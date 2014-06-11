(function() {
    'use strict';

    var slack = require('./share/slack.js').slack;

    exports.share = function(document, comment, account, callback) {

        switch (account.type) {
            case 'slack':
                slack(document, comment, account, callback);
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