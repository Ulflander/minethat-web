/**
 * Initializes and self configuration + logger.
 */
(function(self) {
    'use strict';

    var env = process.env.ENV,
        path,
        fs = require('fs'),
        logger = require('tracer').console({
            format: ['{{timestamp}} <{{title}}> {{message}}', {
                error: '{{timestamp}} <{{title}}> {{message}} ' +
                    '(in {{file}}:{{line}})\nCall Stack:\n{{stack}}'
            }],
            transport: function(data) {
                if (data.level === 5) {
                    console.error(data.output);
                    return;
                }

                console.log(data.output);
            }
        }),
        reading = false,
        conf = {
            loaded: false,
            logger: logger,
            env: env
        };

    // Check for env
    if (typeof env !== 'string') {
        logger.error('No environment variable ' +
                '"ENV(test|local|development|production)"');

        process.exit(1);
    }



    // Set path
    path = __dirname + '/../../../conf/conf.' + env + '.sh';


    /**
     * Parse conf line.
     *
     * @param  {String} line Line to parse
     */
    self.parseLine = function(line) {
        if (line.indexOf('#') !== 0 &&
            line.indexOf('=') > 0) {

            line = line.split('=');
            conf[line[0].trim()] = /^[0-9]+$/ig.test(line[1]) ?
                    parseInt(line[1], 10) :
                    line[1].trim();
        }
    };

    /**
     * Parse configuration file
     *
     * @param  {String} data Conf file content as string
     */
    self.parse = function(data) {
        // Parse conf
        var arr = data.split('\n'),
            i,
            l = arr.length;

        for (i = 0; i < l; i += 1) {
            self.parseLine(arr[i]);
        }

    };

    /**
     * Read configuration from file.
     *
     * @param  {Function} callback Function to call when conf is loaded
     * @return {Object}            Configuration object reference
     */
    self.read = function(callback) {

        // Set conf as loaded to avoid reloading it
        reading = true;

        // Conf real path
        fs.realpath(path, function(err, p) {
            if (!!err) {
                logger.error('No way to solve path ' + path, err);
                process.exit(1);
            }

            logger.log('Loading configuration at ' + p);

            // Read file
            fs.readFile(p, function(err, data) {
                if (!!err) {
                    logger.error('No way to load conf', err);
                    process.exit(1);
                }

                self.parse(data.toString());

                // Finally set root path async
                fs.realpath(__dirname + '/../../', function(err, path) {
                    if (!!err) {
                        logger.error('No way to get root path', err);
                        process.exit(1);
                    }
                    conf.root = path;
                    reading = false;
                    conf.loaded = true;

                    logger.log('Configuration loaded ...');

                    // Call callback
                    if (typeof callback === 'function') {
                        callback(conf);
                    }
                });
            });

        });
        return conf;
    };

    self.wait = function(callback) {
        setTimeout(function() {
            if (!!conf.loaded) {
                callback(conf);
            } else {
                self.wait(callback);
            }
        }, 15);
    };

    /**
     * Get configuration, load it if not loaded.
     *
     * @param  {Function} callback Function to call when conf is loaded
     * @return {Object}            Configuration object reference
     */
    self.conf = function(callback) {

        if (!!conf.loaded) {
            if (typeof callback === 'function') {
                callback(conf);
            }
            return conf;

        }

        if (!reading) {
            return self.read(callback);
        }

        if (typeof callback === 'function') {
            self.wait(callback);
        }

        return conf;
    };
}(exports));
