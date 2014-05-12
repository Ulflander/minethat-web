

(function() {
    'use strict';

    var fs = require('fs'),
        conf = require('../conf.js').conf();

    /**
     * Get all articles and return their HTML representation.
     *
     * @param {Object} router Router object to setup blog routes
     * @param {Function} callback Function to call when blog initialized
     * @return {Array}  Array of HTML articles
     */
    exports.init = function(router, callback) {
        fs.readdir(conf.root + 'src/blog/', function(err, files) {
            if (!!err) {
                return;
            }

            console.log(files);
        });
    };
}());
