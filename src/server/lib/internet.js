

(function() {
    'use strict';

    var request = require('request'),
        parser = require('blindparser');

    /**
     * Get an URL.
     *
     * Callback takes (err, body) as parameters.
     *
     * @param  {String}   url      URL to ping
     * @param  {Function} callback Callback
     */
    exports.get = function(url, callback) {
        request(url, function(error, response) {
            if (!error && response.statusCode === 200) {
                callback(null, response.body, response.href);
            } else {
                callback(error);
            }
        });
    };

    /**
     * Get a parsed RSS feed.
     *
     * @param  {String}   url      URL to ping
     * @param  {Function} callback Callback
     */
    exports.feed = function(url, callback) {
        exports.get(url, function(err, body, url) {
            if (!!err) {
                callback(err);
                return;
            }

            parser.parseString(body, {}, function(err, feed) {
                if (!!err) {
                    callback(err);
                    return;
                }

                callback(null, feed);
            });
        });
    };

}());
