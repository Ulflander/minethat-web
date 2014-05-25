
(function() {
    'use strict';

    var routes = require('./routes.js').routes,
        controllers = {},
        heads = {},
        urlrouter = require('urlrouter');


    /**
     * Setup the route on the app.
     *
     * @param  {Object} app        Connect application
     * @param  {String} method     HTTP method
     * @param  {String} route      HTTP url (route)
     * @param  {Object} controller Controller object
     * @param  {String} func       Method name to call on controller
     */
    exports.setup = function(app, method, route, controller, func) {

        // Check target function
        if (typeof controller[func] !== 'function') {
            throw new Error('Route "' + route + '" is invalid: ' +
                ' function "' + func + '" does not exist' +
                ' in controller.');
        }

        // When route called
        app[method](route, function(req, res, next) {

            // Mark as API if needed
            if (route.indexOf('/api') === 0) {
                req.isAPI = true;
            } else {
                req.isAPI = false;
            }


            // And call controller
            controller[func](req, res, next);
        });
    };

    /**
     * Load controller if needed then setup the route.
     *
     * @param  {Object} app     Connect application
     * @param  {String} route   Route
     * @param  {Array} options  Options array as given in routes.js
     */
    exports.route = function(app, route, options) {
        var ctrl = options[1].split('.');

        // Load controller if not exists
        if (!controllers[ctrl[0]]) {
            controllers[ctrl[0]] =
                require('../controllers/' + ctrl[0] + '.js');
        }

        // Set default method if none
        if (ctrl.length < 2) {
            ctrl[1] = 'index';
        }

        exports.setup(app, options[0], route, controllers[ctrl[0]], ctrl[1]);
    };

    /**
     * Route each route given in routes.js.
     *
     * @param  {Object} app Connect application
     */
    exports.apply = function(app) {
        var route,
            i,
            l;

        for (route in routes) {
            if (routes.hasOwnProperty(route)) {
                if (typeof routes[route][0] === 'string') {
                    exports.route(app, route, routes[route]);
                } else {
                    for (i = 0, l = routes[route].length; i < l; i += 1) {
                        exports.route(app, route, routes[route][i]);
                    }
                }
            }
        }
    };

    /**
     * Initializes routes using apply method and 'urlrouter' connect middleware.
     *
     * @return {Object} urlrouter object mapped to apply method
     */
    exports.router = function() {
        return urlrouter(exports.apply);
    };

}());

