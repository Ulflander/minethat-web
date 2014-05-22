(function() {
    'use strict';

    var amqp = require('amqp'),
        conf = require('../conf.js').conf(),
        ready = false,
        models = require('./models.js'),
        connection;

    exports.init = function(callback) {

        connection = amqp.createConnection({
            host: conf.RABBIT_HOST,
            port: conf.RABBIT_PORT
        });

        connection.on('ready', function() {
            console.log('[RabbitMQ] Connection established');

            connection.queue(conf.RABBIT_EXTRACT_QUEUE, {
                durable: true,
                'exclusive': false,
                'autoDelete': false
            }, function(q) {
                console.log('[RabbitMQ] Queue declared');
                ready = true;

                if (typeof callback === 'function') {
                    callback();
                    callback = null;
                }
            });
        });

        connection.on('error', function() {
            ready = false;
            console.log('[RabbitMQ] Error', arguments);
        });

    };

    exports.makeup = function(obj, callback) {

        // Create job
        var JobModel = models.model('Job'),
            job = new JobModel(obj);

        job.save(function(err) {
            if (!err) {
                exports.publish(job._id);
            }

            if (typeof callback === 'function') {
                callback(err, job);
            }
        });

    };

    exports.publish = function(jobId) {
        if (!ready) {
            setTimeout(function() {
                exports.publish(jobId);
            }, 100);
            return;
        }

        console.log('[RabbitMQ] Submitted job ' + jobId);
        connection.publish('extract', jobId);
    };



}());
