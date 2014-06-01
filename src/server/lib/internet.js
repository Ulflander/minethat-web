

(function(self) {
    'use strict';

    var request = require('request'),
        logger = require('../conf.js').conf().logger,
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
        try {

            request({
                url: url,
                followAllRedirects: true
            }, function(error, response) {

                if (!error && response.statusCode >= 200 &&
                    response.statusCode < 300) {
                    callback(null, response.body);
                } else {
                    logger.warn('URL is invalid: '
                        + error, response.statusCode, url);
                    callback(error);
                }
            });
        } catch (e) {
            logger.warn('URL is invalid', url, e);
            callback(e);
        }
    };

    /**
     * Get a parsed RSS feed.
     *
     * @param  {String}   url      URL to ping
     * @param  {Function} callback Callback
     */
    self.feed = function(url, callback) {
        self.get(url, function(err, body) {
            if (!!err) {
                callback(err);
                return;
            }

            try {
                parser.parseString(body, {}, function(err, feed) {
                    if (!!err) {
                        logger.warn('URL ' + url + ' feed is invalid: '
                            + err);
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
