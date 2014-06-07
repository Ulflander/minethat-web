
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js'),
        internet = require('../lib/internet.js');


    exports.index = function(req, res, next) {
        cv.findAll(req, res, 'Source',
            null, null, null, 'source/list.html');
    };

    exports.display = function(req, res, next) {
        cv.find(req, res, 'Source', 'source/edit.html');
    };

    exports.from_feed = function(req, res, next) {
        if (req.method === 'GET') {
            if (req.isAPI === false) {
                cv.view(req, res, 'source/from_feed.html');
            } else {
                res.json({
                    status: 'error',
                    error: 'Unauthorized method'
                }, 401);
            }
            return;
        }

        internet.feed(req.body.feed_url, function(err, feed, url) {
            if (!!err || !feed || !url) {
                if (req.isAPI === false) {
                    cv.view(req, res, 'source/from_feed.html', {
                        error: 'Invalid feed'
                    });
                } else {
                    res.json({
                        status: 'error',
                        error: 'Invalid feed'
                    }, 422);
                }
                return;
            }

            var source_url,
                u;

            console.log(feed.metadata);

            // Solve URL
            if (typeof feed.metadata.url === 'string') {
                source_url = feed.metadata.url;
            } else if (Array.isArray(feed.metadata.url)) {
                u = feed.metadata.url[0];
                if (typeof u === 'string') {
                    source_url = u;
                } else if (!!u.href) {
                    source_url = u.href;
                }
            } else {
                req.logger.warn('Unable to detect site url for feed',
                    feed.metadata);
            }

            req.body.name = feed.metadata.title;
            req.body.url = source_url;
            exports.add(req, res, next);
        });
    };

    exports.add = function(req, res, next) {
        cv.create(req, res, 'Source', 'source/edit.html', '/app/source/:id');
    };

    exports.edit = function(req, res, next) {
        cv.edit(req, res, 'Source', 'source/edit.html');
    };


    // Only available through API
    exports.check = function(req, res, next) {
        // First ping feed to check if available
        internet.feed(req.body.feed_url, function(err, feed) {
            if (!!err || !feed) {
                res.json({
                    status: 'error',
                    error: 'Invalid feed'
                }, 422);
                return;
            }

            // Second check if exists in database
            req.findAll(req, 'Source', {
                    feed_url: req.body.feed_url
                }, null, null, function(err, objs) {
                    if (!!err) {
                        res.json({
                            status: 'error',
                            error: 'Internal error'
                        }, 500);
                        return;
                    }
                    console.log(objs);
                    if (objs.total === 0) {
                        res.json({
                            status: 'success'
                        }, 200);
                    } else {
                        res.json({
                            status: 'exists'
                        }, 409);
                    }
                });
        });
    };

    /**
     * Only available through API.
     *
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    exports.remove = function(req, res, next) {
        cv.remove(req, res, 'Source');
    };

}());
