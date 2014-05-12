
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js');

    exports.index = function(req, res, next) {
        cv.findAll(req, res, 'Subscriber',
            null, null, null, 'subscriber/list.html');
    };

    exports.display = function(req, res, next) {
        cv.find(req, res, 'Subscriber', 'subscriber/display.html');
    };

    exports.csv = function(req, res, next) {
        cv.find(req, res, 'Subscriber', 'subscriber/display.html');
    };

}());
