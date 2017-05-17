var Promise = require("promise");
var queue = require("queue");
var makeURL = require("./makeURL.js");
var get = require("./get.js");

var getReviews = function(options) {
    return new Promise(function(resolve, reject) {
        if(!options.uri && !options.id) {
            reject(new Error("You need to specify uri or id in options object"));
            return;
        }

        var reviews = [];

        var maxPages = options.maxPages || 1;
        
        var pageURL = makeURL({
            uri: options.uri,
            id: options.id, 
            offset: 0,
            filter: options.filter,
            hideSpoilers: options.hideSpoilers,
        });

        get(pageURL).then(function(result) {
            if(result.maxPages < maxPages) {
                maxPages = result.maxPages;
            }

            var currentPage = result.currentPage;

            result.reviews.map(function(review) {
                reviews.push(review);
            });

            if(currentPage < maxPages) {
                var q = queue();
                q.concurrency = 2;
                q.timeout = 10000;

                for(var page = currentPage; page < maxPages; page+=1) {
                    var currPage = page;
                    q.push(function(done) {
                        get(makeURL({
                            uri: pageURL, 
                            offset: currPage*10,
                            filter: options.filter,
                            hideSpoilers: options.hideSpoilers,
                            })).then(function(result) {
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
                        maxPages: result.maxPages,
                    });
                });

                return;
            }

            resolve({
                reviews,
                maxPages: result.maxPages,
            });
        });
    });
};

module.exports = {
    get: getReviews,
};