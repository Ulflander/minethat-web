
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
            cv.view(req, res, 'source/from_feed.html');
            return;
        }

        internet.feed(req.body.feed_url, function(err, feed) {
            if (!!err || !feed) {
                cv.view(req, res, 'source/from_feed.html', {
                    error: 'Invalid feed'
                });
                return;
            }
            req.body.name = feed.metadata.title;
            req.body.url = feed.metadata.url;
            exports.add(req, res, next);
        });
    };

    exports.add = function(req, res, next) {
        cv.create(req, res, 'Source', 'source/edit.html', '/app/source/:id');
    };

    exports.edit = function(req, res, next) {
        cv.edit(req, res, 'Source', 'source/edit.html');
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
