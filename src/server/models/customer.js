

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('Customer', new mongoose.Schema({
            email: String,
            password: String,
            firstname: String,
            lastname: String,
            key: String,
            plan: String, // "casual", "pro" or "enterprise"
            img: String,
            ts_created: {
                type: Number,
                'default': Date.now
            },
            subscribed: {
                type: Boolean,
                'default': false
            }
        }));
    };
}());
