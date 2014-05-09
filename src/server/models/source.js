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
                customer_id: {
                    type: String,
                    index: true
                },
                last_timestamp: {
                    type: Number
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
            internet.feed(this.feed_url, function(err, body, url) {
                if (!!err) {
                    self.invalidate('url', 'Feed URL is invalid');
                }
                cb(err);
            });
        });

        return Source;
    };

}());
