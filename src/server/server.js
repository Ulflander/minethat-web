

/**
 * Run web server.
 */
(function() {
    'use strict';

    var connect = require('connect'),
        sstatic = require('serve-static'),
        body = require('body-parser'),
        initialize = require('./lib/init.js').initialize,
        router = require('./routes/router.js').router,
        _404 = require('./controllers/404.js'),
        app;


    exports.run = function(conf) {
        app = connect();
        app.conf = conf;
        app.logger = conf.logger;


        app.use(require('./lib/auth.js').auth);
        app.use(sstatic(conf.WEB_SERVER_STATIC_PATH || (__dirname + '/../../dist')));
        app.use(body());
        app.use(initialize);
        app.use(router());
        app.use(_404.index);

        app.listen(conf.WEB_SERVER_PORT);
        app.logger.log('Server started on ' +
            conf.WEB_SERVER_HOST + ':' + conf.WEB_SERVER_PORT);
    };

}());
