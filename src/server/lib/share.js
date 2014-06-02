(function() {
    'use strict';

    var slack = require('./share/slack.js').slack;

    exports.share = function(document, account, callback) {

        switch (account.type) {
            case 'slack':
                slack(document, account, callback);
                return;
        }

        // Not found: error!
        if (typeof callback === 'function') {
            callback({
                error: 'Social network not found'
            });
        }

        return;
    };

}());