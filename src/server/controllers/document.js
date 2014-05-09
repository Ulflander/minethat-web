
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js');

    exports.index = function(req, res, next) {
        cv.findAll(req, res, 'Document',
            null, null, null, 'document/list.html');
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

}());
