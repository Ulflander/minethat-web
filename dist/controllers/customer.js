
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js');

    exports.index = function(req, res, next) {
        cv.findAll(req, res, 'Customer',
            null, null, null, 'customer/list.html');
    };
    
}());
