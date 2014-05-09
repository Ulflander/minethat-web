

(function() {
    'use strict';

    var cv = require('../lib/controller-view.js');

    /**
     * Subscription: manages subscription for users.
     *
     * @param {string} req - Flatiron request object.
     * @param {string} res - Flatiron response object.
     */
    exports.index = function(req, res) {
        var Subscriber = req.model('Subscriber');

        if (!req.query.id) {
            return res.error('Missing param for unsubscription', 500);
        }

        Subscriber.findById(req.query.id, function(err, sub) {
            var msg = null;

            if (err) {
                return res.error('DB query error', 500);
            }

            if (!!req.query.action) {
                if (req.query.action === 'unsubscribe') {
                    sub.unactivated = true;
                    msg = 'Done! You won\'t receive our newsletter anymore.';
                } else {
                    sub.unactivated = false;
                    msg = 'Thanks! You\'re now subscribed to our newsletter!';
                }
                sub.save();
            }

            cv.view(req, res, 'subscribers/subscription.html', {
                msg: msg,
                sub: sub
            });
        });
    };

}());
