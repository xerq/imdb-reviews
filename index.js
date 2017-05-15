module.exports = function(options) {
    options = options || {};

    if(options.useHack) {
        return require("./src/index.hack.js");
    } else {
        return require("./src/index.js");
    }
};