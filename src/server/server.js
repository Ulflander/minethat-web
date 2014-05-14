

/**
 * Run web server.
 */
(function(self) {
    'use strict';

    var connect = require('connect'),
        sstatic = require('serve-static'),
        body = require('body-parser'),
        blog = require('./lib/blog.js'),
        initialize = require('./lib/init.js').initialize,
        router = require('./routes/router.js').router,
        _404 = require('./controllers/404.js');

    /**
     * Discover blog, initialize connect, then run server.
     *
     * @param  {[type]} conf [description]
     * @return {[type]}      [description]
     */
    self.run = function(conf) {
        var app = connect();

        app.conf = conf;
        app.logger = conf.logger;

        // Discover and setup blog articles
        blog.init(function() {

            // Authentication strategies
            app.use(require('./lib/auth.js').auth);

            // Static files
            app.use(sstatic(conf.WEB_SERVER_STATIC_PATH ||
                    (__dirname + '/../../dist')));

            // Body parsing
            app.use(body({
                limit: '10mb'
            }));

            // Injection ot utilities into request and response objects
            app.use(initialize);

            // Routes
            app.use(router());


            // And at last, 404
            app.use(_404.index);

            // Rock'n roll!
            app.listen(conf.WEB_SERVER_PORT);
            app.logger.log('Server started on ' +
                conf.WEB_SERVER_HOST + ':' + conf.WEB_SERVER_PORT);
        });

    };

}(exports));
