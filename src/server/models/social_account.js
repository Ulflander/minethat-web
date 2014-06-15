(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('SocialAccount', new mongoose.Schema({
            type: String // "twitter", "slack", "facebook" (page), "linkedin"
            // data: Object
        }));
    };
}());
