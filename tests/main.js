var imdbReviews = require("../")({
    useHack: false
});

describe("Testing the main(not hack) module", function() {
    describe("Get reviews of movie " + "http://www.imdb.com/title/tt0068646", function() {
        it("Should return 20 reviews", function(done) {
            imdbReviews.get({
                uri: "http://www.imdb.com/title/tt0068646", 
                maxPages: 2,
            }).then(function(result) {
                var reviews = result.reviews;
                done(reviews.length === 20 ? null : new Error("reviews length is not 20"));
            }).catch(done);
        }).timeout(20000);
    });

    var atLeastOneReviewURLs = [
        "http://www.imdb.com/title/tt2118775/", 
        "http://www.imdb.com/title/tt0454349/", 
        "http://www.imdb.com/title/tt3792960/", 
        "http://www.imdb.com/title/tt4244162/",
        "https://www.imdb.com/title/tt3588984", 
        "http://www.imdb.com/title/tt3896198",
        "http://www.imdb.com/title/tt2316204",
        "http://www.imdb.com/title/tt2118775/", 
        "http://www.imdb.com/title/tt0454349/", 
        "http://www.imdb.com/title/tt3792960/", 
        "http://www.imdb.com/title/tt4244162/", 
        "http://www.imdb.com/title/tt0157246/", 
        "http://www.imdb.com/title/tt0748818/", 
        "http://www.imdb.com/title/tt3155794/",
        ];

    atLeastOneReviewURLs.map(function(url) {
        describe("Get reviews of " + url, function() {
            it("Should return at least one review", function(done) {
                imdbReviews.get({
                    uri: url,
                    filter: "profilic_authors",
                }).then(function(result) {
                    var reviews = result.reviews;
                    done(reviews.length > 0 ? null : new Error("reviews length is 0"));
                }).catch(done);
            }).timeout(6000);
        });
    });

    var atLeastOneReviewIDs = [
        "tt0157246",
        "tt0748734",
    ];

    atLeastOneReviewIDs.map(function(id) {
        describe("Get reviews of " + id, function() {
            it("Should return at least one review", function(done) {
                imdbReviews.get({
                    id,
                }).then(function(result) {
                    var reviews = result.reviews;
                    done(reviews.length > 0 ? null : new Error("reviews length is 0"));
                }).catch(done);
            }).timeout(3000);
        });
    });
});