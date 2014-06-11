
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js');

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
    };

    /**
     * Estimate reach of a filter.
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.estimate = function(req, res, next) {
        cv.findAll(req, res, 'Document',
            exports.toCondition(req.body), null, {
                sort: {'properties.meta.doc_aggregated_date': -1}
            },
            'filter/estimation.html');
    };


    /**
     * Convert a filter to mongo conditions.
     *
     * @param  {Object} filter Filter description
     * @return {Object}        Mongo conditions
     */
    exports.toCondition = function(filter) {
        var c = {};

        if (!!filter.keywords) {
            c['properties.keywords.main'] = filter.keywords;
        }

        return c;
    };

}());
