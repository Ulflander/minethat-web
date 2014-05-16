
(function(self) {
    'use strict';

    var cv = require('../lib/controller-view.js');

    /**
     * Show landing.
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    self.index = function(req, res, next) {
        req.logger.warn('Page not found: [' + req.method + '] ' + req.url);
        cv.view(req, res, '404.html');
    };

}(exports));
