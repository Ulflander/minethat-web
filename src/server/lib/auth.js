/*jslint node:true*/

(function() {
    'use strict';

    var auth = require('http-auth'),
        // For private developers doc
        basic = auth.basic({
            authRealm: 'Private Minethat',
            file: __dirname + '/../../../users.htpasswd'
        });


    exports.auth = function(req, res, next) {

        /**
         * Auth strategy for developers/private.
         *
         */
        if (req._parsedUrl.href.indexOf('/private') === 0 ||
            req._parsedUrl.href.indexOf('/admin') === 0 ||
            req._parsedUrl.href.indexOf('/app') === 0) {
            basic.check(req, res, function(username) {
                next();
            });
            return;
        }

        next();
    };

}());
