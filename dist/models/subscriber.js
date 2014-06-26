

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('Subscriber', new mongoose.Schema({
            email: String,
            ref_campaign: String,
            ref_domain: String,
            os: String,
            device: String,
            browser: String,
            ts_created: {type: Date, 'default': Date.now},
            unactivated: {type: Boolean, 'default': false}
        }));
    };
}());
