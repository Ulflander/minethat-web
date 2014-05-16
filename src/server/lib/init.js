

/**
 * Initializes response and request objects with utilities.
 *
 */
(function(self) {
    'use strict';

    var conf = require('../conf.js').conf(),
        responder = require('./respond.js'),
        models = require('./models.js'),
        qs = require('qs');

    /**
     * Initialize the request and response objects by injecting some useful
     * methods.
     *
     * @param  {Request} req Connect request object
     * @param  {Response} res Connect response object
     */
    self.initialize = function(req, res, next) {
        var k;

        req.logger = conf.logger;
        req.query = qs.parse(req._parsedUrl.query);

        // Add models functions to request object
        for (k in models) {
            if (models.hasOwnProperty(k)) {
                if (!!req[k]) {
                    conf.logger.error('Injection failed: key ' + k +
                        'already defined in Request object');
                } else {
                    req[k] = models[k];
                }
            }
        }

        // Add responder functions to response object
        for (k in responder) {
            if (responder.hasOwnProperty(k)) {
                if (!!res[k]) {
                    conf.logger.error('Injection failed: key ' + k +
                        'already defined in Response object');
                } else {
                    res[k] = responder[k];
                }
            }
        }

        next();
    };
}(exports));
