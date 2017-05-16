var url = require("url");

module.exports = function(options) {
    if(!options.uri && !options.id) {
        throw new Error("You didn't specify uri or id");
    }

    options.offset = options.offset || 0;
    options.count = options.count || 10;

    if(!options.uri && options.id) {
        options.uri = "http://www.imdb.com/title/" + options.id;
    }

    var imdbURL = url.parse(options.uri);

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

    var query = "start=" + options.offset + ";count=" + options.count;

    return url.resolve(url.format(imdbURL), "reviews?" + query);
};