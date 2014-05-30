

/**
 * Initializes web server: read configuration, connect to rabbit,
 * then run server.js.
 */
(function() {
    'use strict';


    // Require and read configuration
    require('./conf.js').conf(function(conf) {
        // Run web server
        require('./server.js').run(conf);
    });

}());

