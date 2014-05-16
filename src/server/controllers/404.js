
(function(self) {
    'use strict';

    var cv = require('../lib/controller-view.js'),
        lev = require('../lib/levenshtein.js'),
        routes = require('../routes/routes.js').routes;

    /**
     * Show landing.
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    self.index = function(req, res, next) {
        req.logger.warn('Page not found: [' + req.method + '] ' + req.url);
        var max = {
                value: 1000,
                url: null
            },
            i,
            l = routes.length;

        for (i = 0; i < l; i += 1) {
            console.log(routes[i]);
            console.log(lev(req.url, routes[i]));
        }
        cv.view(req, res, '404.html', max, 404);
    };

}(exports));
