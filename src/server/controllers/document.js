
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js');

    exports.index = function(req, res, next) {
        cv.findAll(req, res, 'Document',
            null, null, {
                sort: {'properties.meta.doc_aggregated_date': -1},
                limit: 50
            },
            'document/list.html');
    };

    exports.recent = function(req, res, next) {
        if (!req.isAPI) {
            return next();
        }
        cv.findAll(req, res, 'Document',
            {'status': 'MINED'}, 'properties.meta', {
                sort: {'properties.meta.doc_aggregated_date': -1},
                limit: 10
            });
    };

    exports.display = function(req, res, next) {
        cv.find(req, res, 'Document', 'document/display.html');
    };

    /**
     * Only available through API.
     */
    exports.remove = function(req, res, next) {
        cv.remove(req, res, 'Document');
    };


    exports.search = function(req, res, next) {
        var conditions = {status: 'MINED'};

        res._data = {
            search: null
        };

        if (req.method === 'POST') {
            conditions['properties.keywords.main'] = req.body.keywords;
        }
        console.log(conditions);

        cv.findAll(req, res, 'Document',
            conditions, null, {
                sort: {'properties.meta.doc_aggregated_date': -1}
            },
            'document/search.html');
    };

}());
