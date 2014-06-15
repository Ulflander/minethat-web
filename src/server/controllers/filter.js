
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js'),
        futils = require('../lib/filter-utils'),

        ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

    /**
     * Create a new filter
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.create = function(req, res, next) {
        if (req.method === 'GET') {
            cv.view(req, res, 'filter/edit.html');
            return;
        }

        req.body = futils.toFilterModel(req.body);

        console.log(req.body);

        cv.create(req, res, 'Filter', 'filter/edit.html', '/app/filters/:id');
    };

    /**
     * Edit a filter
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.edit = function(req, res, next) {
        if (req.method === 'POST') {
            req.body = futils.toFilterModel(req.body);
        }

        cv.edit(req, res, 'Filter', 'filter/edit.html');
    };

    /**
     * Estimate reach of a filter.
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.estimate = function(req, res, next) {
        var conds = futils.toCondition(req.body);

        exports.countWeeks(req, conds, [], function(err, counts) {
            var i, l = counts.length, t = 0;
            if (!err) {
                for (i = 0; i < l; i += 1) {
                    t += counts[i].value;
                }
                res.global.avg_per_week = (t / l).toFixed(0);
                res.global.count_per_week = counts;
            } else {
                req.logger.warn('Unable to get counts per week', err);
            }

            delete conds['properties.meta.doc_published_date'];
            cv.findAll(req, res, 'Document',
                conds, null, {
                    sort: {'properties.meta.doc_published_date': -1}
                },
                'filter/estimation.html');
        });
    };

    /**
     * Estimate reach of a filter.
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.wall = function(req, res, next) {
        req.find('Filter', req.params.id, function(err, obj) {
            if (!!err || !obj) {
                if (!!err) {
                    console.error('Unable to find filter', err);
                }
                return next();
            }

            cv.findAll(req, res, 'Document',
                futils.toCondition(obj.fields), null, {
                    sort: {'properties.meta.doc_published_date': -1}
                },
                'filter/wall.html');
        });
    };

    /**
     * Only available through API.
     */
    exports.remove = function(req, res, next) {
        cv.remove(req, res, 'Filter');
    };


    exports.countWeeks = function(req, conds, weeks, callback) {
        var l = weeks.length,
            start = Date.now() - l * ONE_WEEK,
            end = Date.now() - (l + 1) * ONE_WEEK;

        if (l === 4) {
            callback(null, weeks.reverse());
            return;
        }

        conds['properties.meta.doc_published_date'] = {
            $gt: end,
            $lte: start
        };

        req.model('Document').count(conds, function(err, count) {
            if (!!err) {
                return callback(err);
            }

            weeks[l] = {
                week: l === 0 ? 'Last week' : 'Week - ' + l,
                value: count
            };
            exports.countWeeks(req, conds, weeks, callback);
        });
    };

}());
