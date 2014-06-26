

(function(self) {
    'use strict';

    var request = require('request'),
        logger = require('../conf.js').conf().logger,
        feedparser = require('ortoo-feedparser'),
        blindparser = require('blindparser');

    /**
     * Get an URL.
     *
     * Callback takes (err, body) as parameters.
     *
     * @param  {String}   url      URL to ping
     * @param  {Function} callback Callback
     */
    self.get = function(url, callback, headers) {
        try {
            request({
                url: url,
                followAllRedirects: true,
                headers: headers || {
                    'Accept-Language': '*',
                    'User-Agent': 'Minethat 1.0'
                }
            }, function(error, response) {

                if (!error && response.statusCode >= 200 &&
                    response.statusCode < 300) {
                    callback(null, response.body);
                } else {
                    logger.warn('URL is invalid: '+ error,
                        !!response ? response.statusCode : response, url);
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
     * @param {String} lastModified Last modified date
     */
    self.feed = function(url, callback, lastModified) {

        var headers = {
            'Accept': 'text/xml,application/xml,application/rss+xml',
            'Accept-Language': '*',
            'User-Agent': 'Minethat 1.0'
        };

        if (!!lastModified) {
            headers['If-Modified-Since'] = lastModified;
        }

        self.get(url, function(err, body) {
            if (!!err) {
                callback(err);
                return;
            }

            try {
                blindparser.parseString(body, {}, function(err, feed) {
                    if (!!err) {
                        logger.warn('URL ' + url + ' feed is invalid: ' + err);
                        callback(err);
                        return;
                    }

                    callback(null, feed, url);
                });
            } catch (err1) {
                logger.log('Fallback to feedparser...');
                try {
                    feedparser.parseString(body, {}, 
                        function(err, meta, articles){
                            if (!!err) {
                                callback(err);
                            }

                            callback(null, {
                                meta: meta,
                                items: articles
                            }, url);
                        });
                } catch (err2) {
                    callback('Url ' + url + ' feed parsing failed', err2);
                }

            }
        }, headers);
    };

}(exports));
