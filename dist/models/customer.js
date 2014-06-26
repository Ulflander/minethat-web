

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('Customer', new mongoose.Schema({
            main_user: String,
            name: String,
            key: String,
            plan: String, // "casual", "pro" or "enterprise"
            img: String,
            ts_created: {
                type: Number,
                'default': Date.now
            }
        }));
    };
}());
