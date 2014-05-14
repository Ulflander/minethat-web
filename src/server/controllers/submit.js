(function() {
    'use strict';

    var amqp = require('amqp'),
        conf = require('../conf.js').conf(),
        ready = false,
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
                }
            });
        });

        connection.on('error', function() {
            ready = false;
            console.log('[RabbitMQ] Error', arguments);
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

    exports.html_string = function(req, res, next) {

        if (!req.body.content) {
            return res.json({
                    status: 'error',
                    error: 'Missing "content" parameter'
                }, 500);
        }

        exports.submit(req, res, 'HTML_STRING', req.body.content);
    };


    exports.string = function(req, res, next) {
        if (!req.body || !req.body.string) {
            return res.json({
                    status: 'error',
                    error: 'Missing "string" parameter'
                }, 500);
        }

        exports.submit(req, res, 'STRING', req.body.string);
    };


    exports.url = function(req, res, next) {
        if (!req.body || !req.body.url) {
            return res.json({
                    status: 'error',
                    error: 'Missing "url" parameter'
                }, 500);
        }

        exports.submit(req, res, 'URL', req.body.url);
    };

    exports.submit = function(req, res, type, value) {

        console.log('[API] Got request');

        // Create job
        var JobModel = req.model('Job'),
            job = new JobModel({
                customerId: '2c7f9a',
                gateway: 'API',
                status: 'VOID',
                type: type,
                value: value
            });

        if (!!req.body.meta) {
            job.meta = req.body.meta;
        }

        if (!!req.body.target && req.body.target === 'TRAIN') {
            if (!req.body || !req.body.classes) {
                return res.json({
                    status: 'error',
                    error: 'Missing "classes" parameter'
                }, 500);
            }

            job.target = 'TRAIN';
            job.classes = req.body.classes;
        }

        job.save(function(err) {
            if (!err) {
                exports.publish(job._id);
                return res.json({
                    status: 'success',
                    job: job._id
                });
            }


            return res.json({
                status: 'error',
                error: 'DB error'
            }, 500);
        });
    };

    exports.init();
}());
