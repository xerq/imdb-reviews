var Promise = require("promise");
var request = require("request");
var cheerio = require("cheerio");
var queue = require("queue");
var url = require("url");

var get = function(url) {
    return new Promise(function(resolve, reject) {
        request(url, function handleRequest(err, response, body) {
            if(err) {
                reject(err);
                return;
            }

            var $ = cheerio.load(body);

            var maxPages = $("table td font:contains('Page'):contains('of')").text().split(" of ")[1].split(":")[0];
            var currPage = $("table td font:contains('Page'):contains('of')").text().split(" of ")[0].split("Page ")[1];

            var reviewsParent = $("#tn15content");
            var reviews = $("div:not([class])", reviewsParent).map(function(index, el) {
                var title = "";
                var author = "";
                var authorAvatar = "";
                var stars = 0;
                var dateAdded = "";
                var from = "";
                var text = "";

                if($(el).next().prop("tagName").toLowerCase() === "p") {
                    text = $(el).next().text(); 
                }

                title = $(el).find("h2").first().text();
                author = $(el).find("a[href *= 'user/']").text();
                stars = $(el).find("img[alt][src *= 'showtimes/']").attr("alt");
                dateAdded = $(el).find("small").filter(function(index, smallEl) {
                    if($(smallEl).text().match(/(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)/i)) {
                        return true;
                    }
                });
                dateAdded = dateAdded.length > 0 ? $(dateAdded[0]).text() : "";

                from = $(el).find("small:contains('from')").text().split("from ")[1];

                authorAvatar = $(el).find("img.avatar").attr("src");

                return {
                    title,
                    author,
                    authorAvatar,
                    stars,
                    dateAdded,
                    from,
                    text
                };
            }).toArray();

            resolve({
                reviews,
                maxPages,
                currentPage: currPage
            });
        });
    });
};

var makeURL = function(imdbURL, offset) {
    imdbURL = url.parse(imdbURL);

    imdbURL.pathname = imdbURL.pathname.split("/").filter(function(path) {
        return path != "reviews";
    }).join("/");

    var newQuery = {};

    if(imdbURL.query) {
        Object.keys(imdbURL.query).map(function(queryKey) {
            if(queryKey != "start") {
                return newQuery[queryKey] = imdbURL.query[queryKey];
            }
        });
    }
    else {
        imdbURL.query = {};
    }

    imdbURL.pathname = imdbURL.pathname.endsWith("/") ? imdbURL.pathname : imdbURL.pathname + "/";

    return url.resolve(url.format(imdbURL), "reviews?start=" + offset);
};

var getByURL = function(imdbURL, maxPages) {
    return new Promise(function(resolve, reject) {
        var reviews = [];

        maxPages = maxPages || 1;
        
        var pageURL = makeURL(imdbURL, 0);

        get(pageURL)
        .then(function(result) {
            if(result.maxPages < maxPages) {
                maxPages = result.maxPages;
            }

            var currentPage = result.currentPage;

            result.reviews.map(function(review) {
                reviews.push(review);
            });

            if(currentPage < maxPages) {
                var q = queue();
                q.concurrency = 1;
                q.timeout = 3000;

                for(var page = currentPage++; page < maxPages; page+=1) {
                    q.push(function(done) {
                        get(makeURL(pageURL, currentPage*10)).then(function(result) {
                            result.reviews.map(function(review) {
                                reviews.push(review);
                            });

                            done();
                        });
                    });
                }

                q.start(function(err) {
                    if(err) {
                        reject(err);
                        return;
                    }

                    resolve({
                        reviews,
                        maxPages
                    });
                });

                return;
            }

            resolve({
                reviews,
                maxPages
            });
        });
    });
    
};

module.exports = {
    getByURL
};