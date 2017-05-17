# imdb-reviews [![NPM version](https://badge.fury.io/js/imdb-reviews.svg)](http://badge.fury.io/js/imdb-reviews) [![Build Status](https://travis-ci.org/xerq/imdb-reviews.svg?branch=master)](https://travis-ci.org/xerq/imdb-reviews)

Javascript module for getting reviews of movie/series from imdb

## Features:

 * Get reviews by URL
 * Set currentPage/offset and how many pages/reviews should the module scrap
 * Hack version allowing to get more reviews than default(10) from one page/request, it's also faster

## Installation
```
npm install imdb-reviews
```

## Usage

### ES5:

#### Without hack:

```javascript
var imdbReviews = require("imdb-reviews")();

// by url
imdbReviews.get({
    uri: "http://www.imdb.com/title/tt0068646", 
    maxPages: 2
    }).then(function(result) {
    console.log("Reviews: ", result.reviews);
    console.log("Max pages: ", result.maxPages);
}).catch(console.error);

// by id
imdbReviews.get({
    id: "tt0068646", 
    maxPages: 2
    }).then(function(result) {
    console.log("Reviews: ", result.reviews);
    console.log("Max pages: ", result.maxPages);
}).catch(console.error);
```

#### With hack:

```javascript
var imdbReviews = require("imdb-reviews")({
    useHack: true
});

// by url
imdbReviews.get({
    uri: "http://www.imdb.com/title/tt0068646", 
    offset: 0, 
    count: 50
    }).then(function(result) {
    console.log("Reviews: ", result.reviews);
    console.log("Max pages: ", result.maxPages);
}).catch(console.error);

// by id
imdbReviews.get({
    id: "tt0068646", 
    offset: 0, 
    count: 50
    }).then(function(result) {
    console.log("Reviews: ", result.reviews);
    console.log("Max pages: ", result.maxPages);
}).catch(console.error);
```

### ES6:

#### Without hack:

```javascript
import _imdbReviews from "imdb-reviews";

const imdbReviews = _imdbReviews();

// by url
imdbReviews.get({
    uri: "http://www.imdb.com/title/tt0068646", 
    maxPages: 2
    }).then((result) => {
    console.log(`Reviews: ${result.reviews}`);
    console.log(`Max pages: ${result.maxPages}`);
}).catch(console.error);

// by id
imdbReviews.get({
    id: "tt0068646", 
    maxPages: 2
    }).then((result) => {
    console.log(`Reviews: ${result.reviews}`);
    console.log(`Max pages: ${result.maxPages}`);
}).catch(console.error);
```

#### With hack:

```javascript
import _imdbReviews from "imdb-reviews";

const imdbReviews = _imdbReviews({
    useHack: true
});

// by url
imdbReviews.get({
    uri: "http://www.imdb.com/title/tt0068646", 
    offset: 0, 
    count: 50
    }).then((result) => {
    console.log(`Reviews: ${result.reviews}`);
    console.log(`Max pages: ${result.maxPages}`);
}).catch(console.error);

// by id
imdbReviews.get({
    id: "tt0068646", 
    offset: 0, 
    count: 50
    }).then((result) => {
    console.log(`Reviews: ${result.reviews}`);
    console.log(`Max pages: ${result.maxPages}`);
}).catch(console.error);
```

## Constructor

```javascript
var imdbReviews = require("imdb-reviews")({
    useHack: false
});
```

## Methods

#### `get(options)`
Promise, if succeed returns object with `reviews` and `maxPages`

### Properties of `options`:
`uri` - url of imdb movie/series**

`id` - id of imdb movie/series**

`offset` - starting point (default `0`)

`count` - maxiumum reviews to scrap (default `10`)

`maxPages` - maxiumum number of pages to scrap (default `1`)

`filter` - filter the reviews by `best`, `chronological`, `prolific_authors`, `loved_it`, `hated_it` (default `best`)

`hideSpoilers` - hide spoilers (default `false`)


** - choose one, don't need to set both

## Example object returned by calling `imdbReviews.get({ url: "http://www.imdb.com/title/tt0068646", maxPages: 2})`
```javascript
{ 
    reviews: 
    [ { title: '"The Godfather" is pretty much flawless, and one of the greatest films ever made',
        author: 'SJ_1',
        authorAvatar: 'http://ia.media-imdb.com/images/M/MV5BMjI2NDEyMjYyMF5BMl5BanBnXkFtZTcwMzM3MDk0OQ@@._SX40_SY40_SS40_.jpg',
        stars: '10/10',
        dateAdded: '30 September 2005',
        from: 'United Kingdom',
        text: '\nRather than concentrating on everything that is great about The\nGodfather, a much easier way for me to judge its quality is on what is\nbad about it. Almost every film has something that I don\'t like about\nit, but I can honestly say that I wouldn\'t change anything about The\nGodfather. There is nothing weak about it and nothing that stands out\nas bad. That\'s why it gets ten out of ten.This is one of those films that made me wonder why I hadn\'t seen it\nearlier. The acting from everyone involved is great, Marlon Brando\ncomes across perfectly as the head of the family, and James Caan and Al\nPacino are excellent as his sons. The soundtrack by Nino Rota is also\nvery memorable, bringing back memories of the film every time I hear\nit. The plot has to be excellent for it to get ten out of ten, and it\nis, it\'s far from predictable and the film is the definition of a great\nepic.The film is pretty shocking in the way every death occurs almost\ninstantaneously, and as it spans ten years so many different things\nhappen and every minute of it is great entertainment. It\'s a well-made\nand entertaining film that is only the first part of a trilogy, but it\nstands on its own as a wonderful film in its own right. If you haven\'t\nseen it, what are you waiting for? This was one acclaimed film that\ndidn\'t disappoint.\n' },
        ... 
        ],
    maxPages: 2 
}
```
