

(function() {
    'use strict';

    var fs = require('fs'),
        routes = require('../routes/routes.js'),
        blog = require('../controllers/blog.js'),
        marked = require('marked'),
        conf = require('../conf.js').conf();

    /**
     * Add route to article, read article and add it to controller.
     */
    exports.add = function(filename) {
        if (filename.substring(0, 1) === '.' && conf.env !== 'local') {
            return;
        }

        var rootFilename = filename.split('.md').join('');
        routes.add('/devlog/' + rootFilename + '.html', ['get', 'blog.article']);

        fs.readFile(conf.root + '/src/blog/' + filename, function(err, f) {
            if (!!err) {
                conf.logger.error('Unable to read blog article' +
                    conf.root + '/src/blog/' + filename, err);
                return;
            }

            marked(f.toString(), {}, function(err, data) {
                if (!!err) {
                    conf.logger.error('Unable to convert blog article' +
                        conf.root + '/src/blog/' + filename, err);
                    return;
                }

                blog.add('/devlog/' + rootFilename + '.html', data);
            });
        });

    };

    /**
     * Initialize blog by reading list of articles (read list of files, add
     * routes, initialize controller).
     *
     * @param {Function} callback Function to call when blog initialized
     * @return {Array}  Array of HTML articles
     */
    exports.init = function(callback) {
        fs.readdir(conf.root + '/src/blog/', function(err, files) {
            if (!!err) {
                conf.logger.error('Blog files not found at "' + conf.root +
                    '/src/blog/"', err);
                return;
            }
            var i,
                l = files.length;

            for (i = 0; i < l; i += 1) {
                if (files[i].indexOf('.md') > -1) {
                    exports.add(files[i]);
                }
            }

            if (typeof callback === 'function') {
                callback();
            }
        });
    };
}());
