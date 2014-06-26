

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('User', new mongoose.Schema({
            email: String,
            password: String,

            firstname: String,
            lastname: String,
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
