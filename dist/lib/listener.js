(function() {
    'use strict';

    var amqp = require('amqp'),
        conf = require('../conf.js').conf(),
        connection;

    exports.init = function(queue, callback) {

        connection = amqp.createConnection({
            host: conf.RABBIT_HOST,
            port: conf.RABBIT_PORT
        });

        connection.on('ready', function() {
            conf.logger.log('[RabbitMQ] Connection established');

            connection.queue(queue, {
                durable: true,
                'exclusive': false,
                'autoDelete': false
            }, function(q) {
                conf.logger.log('[RabbitMQ] Queue declared');

                q.bind('#');
                q.subscribe(callback);
            });
        });

        connection.on('error', function() {
            conf.logger.warn('[RabbitMQ] Error', arguments);
        });

    };



}());
