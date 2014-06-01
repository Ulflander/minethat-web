
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
            null, null, {
                sort: {'properties.meta.doc_aggregated_date': -1}, 
                limit: 5
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
        cv.findAll(req, res, 'Document',
            null, null, {
                sort: {'properties.meta.doc_aggregated_date': -1}
            }, 
            'document/search.html');
    };

}());
