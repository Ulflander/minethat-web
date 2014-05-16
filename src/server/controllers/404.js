
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
        console.log(routes);
        var max = {
                value: 1000,
                url: null
            },
            distance,
            k;

        for (k in routes) {
            if (k.indexOf('/api') === 0) {
                continue;
            }

            if (routes.hasOwnProperty(k)) {
                distance = lev(req.url, k);
                console.log(k);
                console.log(lev(req.url, k));
            }
        }
        cv.view(req, res, '404.html', max, 404);
    };

}(exports));
