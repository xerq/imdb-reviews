var imdbReviews = require("../")({
    useHack: false
});

describe("Testing the main(not hack) module", function() {
    describe("Get reviews of movie " + "http://www.imdb.com/title/tt0068646", function() {
        it("Should return at least one review", function(done) {
            imdbReviews.getByURL("http://www.imdb.com/title/tt0068646", 2).then(function(result) {
                console.log(result);
                var reviews = result.reviews;
                done(reviews.length > 0 ? null : new Error("reviews length is 0"));
            }).catch(done);
        }).timeout(10000);
    });

    var atLeastOneReviewURLs = ["http://www.imdb.com/title/tt2118775/", "http://www.imdb.com/title/tt0454349/", "http://www.imdb.com/title/tt3792960/", "http://www.imdb.com/title/tt4244162/"];

    atLeastOneReviewURLs.map(function(url) {
        describe("Get reviews of " + url, function() {
            it("Should return at least one review", function(done) {
                imdbReviews.getByURL(url).then(function(result) {
                    var reviews = result.reviews;
                    done(reviews.length > 0 ? null : new Error("reviews length is 0"));
                }).catch(done);
            }).timeout(3000);
        });
    });
});