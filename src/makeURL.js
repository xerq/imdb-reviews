var url = require("url");

var filters = {
    "best": "best",
    "chronological": "chrono",
    "prolific_authors": "prolific",
    "loved_it": "love",
    "hated_it": "hate"
};

module.exports = function(options) {
    options.filter = filters[options.filter] || filters["best"];
    options.hideSpoilers = options.hideSpoilers || false;
    options.offset = options.offset || 0;
    options.count = options.count || 10;

    if(!options.uri && options.id) {
        options.uri = "http://www.imdb.com/title/" + options.id;
    }

    var imdbURL = url.parse(options.uri);

    imdbURL.pathname = imdbURL.pathname.split("/").filter(function(path) {
        return path != "reviews";
    }).join("/");

    imdbURL.pathname = imdbURL.pathname.endsWith("/") ? imdbURL.pathname : imdbURL.pathname + "/";

    imdbURL.query = {};

    var query = "start=" + options.offset + (options.count ? ";count=" + options.count : "") + "&filter=" + options.filter;

    if(options.hideSpoilers) {
        query += "&spoiler=hide";
    }

    return url.resolve(url.format(imdbURL), "reviews?" + query);
};