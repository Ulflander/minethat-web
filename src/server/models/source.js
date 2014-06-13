/*jslint node:true*/

(function() {
    'use strict';

    var internet = require('../lib/internet.js');

    /**
     * Source model
     *
     * @param  {Object} mongoose Mongoose instance
     * @return {Object}          Source mongoose model
     */
    exports.define = function(mongoose) {
        var schema = new mongoose.Schema({
                name: String,
                url: String,
                feed_url: {
                    type: String,
                    index: true
                },
                type: {
                    type: String,
                    'default': 'CONTENT' // SPAM, FAKE, CONTENT
                },
                quality: {
                    type: String,
                    'default': 'NORMAL' // NONE, NORMAL, FULL
                },
                customer_id: {
                    type: String,
                    index: true
                },
                last: {
                    type: Number
                },
                successive_errors: {
                    type: Number,
                    'default': 0
                },
                fake: {
                    type: Boolean,
                    'default': false
                }
            }),
            Source = mongoose.model('Source', schema);

        // Validation
        schema.pre('save', function(next) {

            var self = this,
                error = false,
                checks = 0,
                cb = function(err) {
                    if (!!err) {
                        error = true;
                    }
                    checks += 1;
                    if (checks === 2) {
                        next(error ? new Error('Validation error') : null);
                    }
                };

            // Validate URL
            internet.get(this.url, function(err, body, url) {
                if (!!err) {
                    self.invalidate('url', 'URL is invalid');
                }
                cb(err);
            });

            // Validate feed URL
            if (!!this.feed_url) {
                internet.feed(this.feed_url, function(err, body, url) {
                    if (!!err) {
                        self.invalidate('url', 'Feed URL is invalid');
                    }
                    cb(err);
                });
            } else {
                cb();
            }
        });

        return Source;
    };

}());
