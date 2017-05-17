// NOTE: this module uses a query that is not easily accessible by user on page, it may stop working any time, but it's faster

var Promise = require("promise");
var makeURL = require("./makeURL.js");
var get = require("./get.js");

var getReviews = function(options) {
    return new Promise(function(resolve, reject) {
        if(!options.uri && !options.id) {
            reject(new Error("You need to specify uri or id in options object"));
            return;
        }

        var reviews = [];

        options.offset = options.offset || 0;
        options.count = options.count || 10;

        var pageURL = makeURL({
            uri: options.uri, 
            id: options.id,
            offset: options.offset, 
            count: options.count,
        });

        get(pageURL).then(function(result) {
            var maxPages = result.maxPages;
            var currentPage = result.currentPage;

            result.reviews.map(function(review) {
                reviews.push(review);
            });

            resolve({
                reviews,
                maxPages,
            });
        });
    });
};

module.exports = {
    get: getReviews,
};