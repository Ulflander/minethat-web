

/**
 * A stack of usefull methods to automatically call some stuff in DB, render it
 * in a view or format it for API, and return the result to the user.
 * @return {[type]} [description]
 */
(function() {
    'use strict';

    var ejs = require('ejs'),
        fs = require('fs'),
        async = require('async'),
        conf = require('../conf.js').conf(),
        partialRe = /<%-\s+partial\s*\(\s*['"]([a-zA-Z0-9\\\-_]+)['"]/ig,
        templates = {};


    /**
     * Utility to remove a resource.
     *
     * @param  {Object} req      Connect request object
     * @param  {Object} res      Connect response object
     * @param  {Object|String} model    Model object or name
     * @param  {String} template Template to use
     */
    exports.remove = function(req, res, model, template) {
        if (!req.isAPI) {
            res.error(404, 'Only available through API');
            return;
        }

        var Model = req.model(model);
        Model.findById(req.params.id, function(err, doc) {
            if (!!err || doc === null) {
                res.json({status: 'error', error: 'Resource not found'}, 404);
                return;
            }
            doc.remove(function(err) {
                if (!!err) {
                    res.json({status: 'error',
                            error: 'Resource not deleted'}, 500);
                    return;
                }
                res.json({status: 'success'}, 200);
            });
        });
    };

    /**
     * Utility to save a new resource.
     *
     * @param  {Object} req      Connect request object
     * @param  {Object} res      Connect response object
     * @param  {Object|String} model    Model object or name
     * @param  {String} template Template to use
     */
    exports.save = function(req, res, model, template, redirect) {
        var Model = req.model(model),
            resource = new Model(req.body),
            answered = false;

        resource.save(function(err) {
            var data = {
                status: !!err ? 'success' : 'error',
                doc: resource.toObject()
            };

            if (!!answered) {
                return;
            }

            answered = true;

            if (!!err) {
                data.error = {
                    message: err
                };
            }

            if (req.isAPI) {
                res.json(data, !!err ? 500 : 200);
            } else if (!!redirect) {
                res.redirect(redirect.split(':id').join(resource._id));
            } else {
                exports.view(req, res, template, data);
            }
        });
    };

    /**
     * Utility to create a new resource.
     *
     * @param  {Object} req      Connect request object
     * @param  {Object} res      Connect response object
     * @param  {Object|String} model    Model object or name
     * @param  {String} template Template to use
     */
    exports.create = function(req, res, model, template, redirect) {
        var Model = req.model(model);

        if (req.method === 'POST') {
            exports.save(req, res, model, template, redirect);
            return;
        }

        if (req.isAPI) {
            res.json({
                error: 'Not implemented'
            }, 500);
        } else {
            exports.view(req, res, template, {
                doc: new Model(),
                status: 'create'
            });
        }
    };

    /**
     * Utility for display one resource for both API and front end.
     *
     * @param  {Object} req      Connect request object
     * @param  {Object} res      Connect response object
     * @param  {Object|String} model    Model object or name
     * @param  {String} template Template to use
     */
    exports.find = function(req, res, model, template) {
        req.find(model, req.params.id, function(err, obj) {
            if (!!err) {
                return res.error(500);
            }

            if (!obj) {
                if (req.isAPI) {
                    res.json({
                        status: 'error',
                        error: 'Resource not found'
                    }, 404);
                } else {
                    res.error(404);
                }
                return;
            }
            console.log(obj.toObject());
            if (req.isAPI) {
                res.json(obj.toObject());
            } else {
                exports.view(req, res, template, {
                    doc: obj,
                    status: 'exists'
                });
            }
        });
    };

    /**
     * Utility for display one resource for both API and front end.
     *
     * @param  {Object} req      Connect request object
     * @param  {Object} res      Connect response object
     * @param  {Object|String} model    Model object or name
     * @param  {String} template Template to use
     */
    exports.edit = function(req, res, model, template) {
        if (req.method === 'GET') {
            exports.find(req, res, model, template);
            return;
        }
        var Model = req.model(model);
        Model.update({
            _id: req.params.id
        }, req.body, function(err, numberAffected, rawResponse) {

            if (!!err) {
                return res.error(500);
            }

            req.find(model, req.params.id, function(err, obj) {

                if (!!err) {
                    return res.error(500);
                }

                if (!obj) {
                    if (req.isAPI) {
                        res.json({
                            status: 'error',
                            error: 'Resource not found'
                        }, 404);
                    } else {
                        res.error(404);
                    }
                    return;
                }

                if (req.isAPI) {
                    res.json(obj);
                } else {
                    exports.view(req, res, template, {
                        doc: obj,
                        status: 'exists'
                    });
                }
            });
        });
    };


    /**
     * Utility for display one resource for both API and front end.
     *
     * @param  {Object} req      Connect request object
     * @param  {Object} res      Connect response object
     * @param  {Object|String} model    Model object or name
     * @param  {Object}   conds    Conditions
     * @param  {Object}   fields   Fields
     * @param  {Object}   opts  Options
     * @param  {String} template Template to use
     */
    exports.findAll = function(req, res, model, conds, fields, opts, template) {
        req.findAll(req, model, conds, fields, opts,
            function(err, objects) {
                if (!!err) {
                    return res.error(404);
                }

                if (req.isAPI) {
                    res.json(objects);
                } else {
                    exports.view(req, res, template, objects);
                }
            });

    };


    /**
     * Check if template file requires loading
     *
     * @param  {String} template Template filename
     * @return {String} Template content
     */
    exports.requiresLoading = function(template) {
        return !templates[template] || conf.env === 'local';
    };

    /**
     * Load/reload a template file
     *
     * @param  {String} template Template filename
     * @param {Function} callback Callback
     * @return {String} Template content
     */
    exports.load = function(template, callback) {
        fs.readFile(__dirname + '/../views/' + template, function(err, dat) {
            if (!!err) {
                conf.logger.error('File not found: ' + 'views/' + template);
                templates[template] = 'Template not found';
            } else {
                templates[template] = dat.toString();
            }

            var arr = exports.detectPartials(template);
            if (arr.length > 0) {
                exports.loadPartials(arr, callback);
            } else if (typeof callback === 'function') {
                callback();
            }
        });
    };

    /**
     * Render and respond a view.
     *
     * @param  {Object} req      Connect request object
     * @param  {Response} res      Connect response object
     * @param  {String} template Template filename
     * @param  {Object} data     Data to send to view
     */
    exports.render = function(template, data) {
        try {
            return ejs.render(templates[template], {
                data: !!data ? data : {},
                partial: exports.partial,
                env: conf.env
            });
        } catch (err) {
            conf.logger.error('Unable to render template', err);
            return null;
        }
    };

    /**
     * Render and respond a view.
     *
     * @param  {Object} req      Connect request object
     * @param  {Response} res      Connect response object
     * @param  {String} template Template filename
     * @param  {Object} data     Data to send to view
     * @param  {Integer} code    HTTP status code to return
     */
    exports.view = function(req, res, template, data, code) {
        exports.renderView(template, data, function(html) {
            res.html(html, code);
        });
    };

    /**
     * Render and return a view.
     *
     * @param  {String} template Template filename
     * @param  {Object} data     Data to send to view
     * @param  {Function} callback  Callback to return
     */
    exports.renderView = function(template, data, callback) {
        var cb = function() {
            callback(exports.render(template, data));
        };

        if (exports.requiresLoading(template)) {
            return exports.load(template, cb);
        }

        cb();
    };

    /**
     * Render a partial
     *
     * @param  {String} template Template filename
     * @param {Function} callback Callback
     * @return {String} Template content
     */
    exports.partial = function(template, data) {
        var d = {data: data};
        d.env = conf.env;
        d.partial = exports.partial;

        return ejs.render(templates['_partials/' + template + '.html'], d);
    };

    /**
     * Load given partials.
     *
     * @param  {Array}   arr      Array of partials names
     * @param  {Function} callback Callback to call when partials are loaded
     */
    exports.loadPartials = function(arr, callback) {
        var i,
            l = arr.length,
            methods = [];

        for (i = 0; i < l; i += 1) {
            methods.push(exports.loadPartial(arr[i]));
        }
        async.parallel(methods, callback);
    };

    /**
     * Return a function that will load partial and call callback.
     *
     * @param  {String} template Template name
     * @return {Function}          Function that takes a callback in parameter
     * and that will load partial
     */
    exports.loadPartial = function(template) {
        return function(callback) {
            exports.load('_partials/' + template + '.html', callback);
        };
    };


    /**
     * Detect partials names in a template.
     *
     * @param  {String} template Template content
     * @return {Array}          Array of partials names
     */
    exports.detectPartials = function(template) {
        var arr = [],
            res;

        while (true) {
            res = partialRe.exec(templates[template]);
            if (!res) {
                break;
            }
            arr.push(res[1]);
        }

        return arr;
    };
}());
