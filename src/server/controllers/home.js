
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js'),
        validate = require('../lib/valid.js'),
        mail = require('../lib/mail.js'),
        url = require('url'),
        UAParser = require('ua-parser-js'),
        campaigns = require('../routes/campaigns.js').campaigns;

    /**
     * Get campaign data from request.
     * @param  {Object} req Connect request object
     * @return {Object}     Campaign data object
     */
    exports.campaign = function(req) {
        var d = {
                ref_campaign: 'None',
                ref_domain: 'Unknown'
            };

        if (!!req.query && !!req.query.r) {
            d.ref_campaign = campaigns[req.query.r] || req.query.r;
        }

        if (!!req.headers.referer) {
            d.ref_domain = url.parse(req.headers.referer).hostname;
            if (d.ref_domain.indexOf('www.') === 0) {
                d.ref_domain = d.ref_domain.substr(4);
            }
        }

        return d;
    };

    /**
     * Show landing.
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.index = function(req, res, next) {
        cv.view(req, res, 'landing/landing.html', exports.campaign(req));
    };



    /**
     * Ajax subscription to newsletter (+ beta for landing)
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.subscribe = function(req, res, next) {
        var Subscriber = req.model('Subscriber');

        if (!req.body || !req.body.email) {
            return res.json({
                error: 'miss_param'
            }, 500);
        }

        if (!validate.email(req.body.email)) {
            return res.json({
                error: 'invalid_email'
            }, 500);
        }

        // First check if user exists
        Subscriber.findOne({
            'email': req.body.email
            }, function(err, data) {

                if (err) {
                    return res.json({
                        error: 'db_check_failed'
                    }, 500);
                }

                // Already subscribed
                if (!!data) {
                    return res.json({
                        status: 'exists',
                        id: data._id
                    }, 200);
                }

                exports.create(req, res);
            });
    };



    /**
     * Creates subscriber
     */
    exports.create = function(req, res) {
        var Subscriber = req.model('Subscriber'),

            // Get device/browser
            ua = (new UAParser()
                .setUA(req.headers['user-agent'])
                .getResult()) || {},

            // Create subscriber
            sub = new Subscriber({
                email: req.body.email,
                ref_campaign: req.body.ref_campaign,
                ref_domain: req.body.ref_domain,
                browser: !!ua.browser && !!ua.browser.name ?
                    ua.browser.name : 'Unknown',
                os: !!ua.os && !!ua.os.name ?
                    ua.os.name : 'Unknown',
                device: !!ua.device && !!ua.device.vendor ?
                    ua.device.vendor + ' / ' +
                        (ua.device.model || 'Unknown') : 'Unknown'
            });

        // Save subscriber
        sub.save(function(err) {
            if (err) {
                return res.json({
                    error: 'db_save_failed'
                }, 500);
            }

            // Send email
            mail.template(req.body.email, 'You\'re in!',
            'landing-subscribed.html', {
                sub: sub
            });

            res.json({
                status: 'success'
            });
        });
    };

}());
