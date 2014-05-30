
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js');

    exports.index = function(req, res, next) {
        cv.findAll(req, res, 'Job',
            null, null, null, 'job/list.html');
    };

    /**
     * Only available through API.
     */
    exports.remove = function(req, res, next) {
        cv.remove(req, res, 'Job');
    };


}());
