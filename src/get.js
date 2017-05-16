var Promise = require("promise");
var request = require("request");
var cheerio = require("cheerio");

module.exports = function(url) {
    return new Promise(function(resolve, reject) {
        request(url, function handleRequest(err, response, body) {
            if(err) {
                reject(err);
                return;
            }

            var $ = cheerio.load(body);

            if($("#tn15content div:not([class])").length === 0) {
                resolve({
                    reviews: [],
                    maxPages: 0,
                });
                return;
            }

            var maxPages = -1;
            var currPage = -1;

            if($("table td font:contains('Page'):contains('of')").length > 0) {
                maxPages = $("table td font:contains('Page'):contains('of')").text().split(" of ")[1].split(":")[0];
                maxPages = parseInt(maxPages);
                currPage = $("table td font:contains('Page'):contains('of')").text().split(" of ")[0].split("Page ")[1];
                currPage = parseInt(currPage);
            }

            var reviewsParent = $("#tn15content");
            var reviews = $("div:not([class])", reviewsParent).map(function(index, el) {
                var title = "";
                var author = "";
                var authorAvatar = "";
                var stars = -1;
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

                from = $(el).find("small:contains('from')").text();
                from = from.includes("from") ? from.split("from ")[1] : "";

                authorAvatar = $(el).find("img.avatar").attr("src");

                return {
                    title,
                    author,
                    authorAvatar,
                    stars,
                    dateAdded,
                    from,
                    text,
                };
            }).toArray();

            resolve({
                reviews,
                maxPages,
                currentPage: currPage,
            });
        });
    });
};