(function() {
    'use strict';

    var manager = require('../lib/job.js');

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
        var job = {
                customerId: '2c7f9a',
                gateway: 'API',
                status: 'VOID',
                type: type,
                value: value
            };

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

        manager.makeup(job, function(err) {
            if (!err) {
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

}());
