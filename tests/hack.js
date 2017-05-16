var imdbReviews = require("../")({
    useHack: true
});

describe("Testing the hack", function() {
    describe("Get reviews of movie " + "http://www.imdb.com/title/tt0068646", function() {
        it("Should return 20 reviews", function(done) {
            imdbReviews.get({
                uri: "http://www.imdb.com/title/tt0068646", 
                offset: 2, 
                count: 20
            }).then(function(result) {
                var reviews = result.reviews;
                done(reviews.length === 20 ? null : new Error("reviews length is less than 20"));
            }).catch(done);
        }).timeout(10000);

        it("Should return 5 reviews", function(done) {
            imdbReviews.get({
                uri: "http://www.imdb.com/title/tt0068646", 
                offset: 0, 
                count: 5
            }).then(function(result) {
                var reviews = result.reviews;
                done(reviews.length === 5 ? null : new Error("reviews length is not 5"));
            }).catch(done);
        }).timeout(10000);

        it("Should return 3 reviews", function(done) {
            imdbReviews.get({
                uri: "http://www.imdb.com/title/tt0068646", 
                offset: 0, 
                count: 3
            }).then(function(result) {
                var reviews = result.reviews;
                done(reviews.length === 3 ? null : new Error("reviews length is not 3"));
            }).catch(done);
        }).timeout(10000);
    });

    var atLeastOneReviewURLs = [
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
                    uri: url
                }).then(function(result) {
                    var reviews = result.reviews;
                    done(reviews.length > 0 ? null : new Error("reviews length is 0"));
                }).catch(done);
            }).timeout(3000);
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
                    id
                }).then(function(result) {
                    var reviews = result.reviews;
                    done(reviews.length > 0 ? null : new Error("reviews length is 0"));
                }).catch(done);
            }).timeout(3000);
        });
    });
});