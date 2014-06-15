/*jslint regexp:true*/

var util = require('util'),
    Twitter = require('twitter'),
    moment = require('moment'),
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    twit = new Twitter({
        consumer_key: 'WO30xPwtmdSOzOmoJ5ruAdeHH',
        consumer_secret: 'IH6UltER7AQsA9Y3vUCDGJxi3AKS4NbzcXDICwBGergu3wJKvm',
        access_token_key: '58438762-2U1PaQyuvH9DIxcNU40rKxzjmz1klqYSzOlTY8tVk',
        access_token_secret: 'ZGZF2dsQLshYautCNjuxbO7lM6gzRYJVEISDBrc07Kxep'
    });

/**
 * Feed aggregation program.
 */
(function(self) {
    'use strict';


    var logger,
        models,
        model,
        manager,
        internet = require('./lib/internet.js'),
        currSourcePage = 0,
        limitPerPage = 2;

    // Require and read configuration,
    // then initialize infinite loop
    require('./conf.js').conf(function(conf) {

        logger = conf.logger;
        models = require('./lib/models.js');
        model = models.model('Source');

        setInterval(self.update, conf.env === 'local' ? 60000 : 30000);

        logger.log('Aggregator started...');
    });




}(exports));

