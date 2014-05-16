

(function(self) {
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
    self.get = function(url, callback) {
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
    self.feed = function(url, callback) {
        self.get(url, function(err, body, url) {
            if (!!err) {
                callback(err);
                return;
            }

            try {
                parser.parseString(body, {}, function(err, feed) {
                    if (!!err) {
                        callback(err);
                        return;
                    }

                    callback(null, feed, url);
                });
            } catch (e) {
                callback(e);
            }
        });
    };

}(exports));
