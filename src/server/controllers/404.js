
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js');

    /**
     * Show landing.
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.index = function(req, res, next) {
        cv.view(req, res, '404.html');
    };

}());
