/**
 * Some useful methods to manage models. All these methods are available through
 * the connect request object passed to controllers.
 */
(function() {
    'use strict';

    var ITEMS_PER_PAGE = 20,
        models = {},
        conf = require('../conf.js').conf(),
        logger = conf.logger,
        mongoose = require('mongoose');

    // Connect to DB
    mongoose.connect('mongodb://'
        + conf.MONGO_HOST + ':'
        + conf.MONGO_PORT + '/'
        + conf.MONGO_DB_PREFIX
        + conf.env.toLowerCase());

    /**
     * Load model.
     *
     * @param  {String} model Model to load
     */
    exports.loadModel = function(model) {
        models[model] = require('../models/' + model.toLowerCase() + '.js')
                            .define(mongoose);
    };

    /**
     * Get model by name.
     *
     * @param  {String} model Model name
     * @return {Object} Model object
     */
    exports.model = function(model) {

        if (!models[model]) {
            exports.loadModel(model);
        }

        return models[model];
    };

    /**
     * Get a list of object by id.
     *
     * @param  {Object|String}   model    Model object or model name
     * @param  {String}   id       Object id
     * @param  {Function} callback Method to call back
     */
    exports.find = function(model, id, callback) {
        if (typeof model === 'string') {
            model = exports.model(model);
        }

        model.findById(id, function(err, obj) {
            if (!!err) {
                logger.error('Error querying db', err);
            }

            if (typeof callback === 'function') {
                callback(err, obj);
            }
        });
    };

    /**
     * Find a stack of objects in Mongo.
     * @param  {Object}   req      Request object
     * @param  {String|Object}   model    Model object or name
     * @param  {Object}   conds    Conditions
     * @param  {Object}   fields   Fields
     * @param  {Object}   options  Options
     * @param  {Function} callback Callback
     */
    exports.findAll = function(req, model, conds, fields, options, callback) {

        var page = !!req.query ? parseInt(req.query.page, 10) || 1 : 1;

        if (typeof model === 'string') {
            model = exports.model(model);
        }

        model.count({}, function(err, count) {
            if (!!err) {
                logger.error('Error querying db', err);
            }

            model.find(conds || {}, fields || {}, exports.page(page, options),
                function(err, objs) {
                    if (!!err) {
                        logger.error('Error querying db', err);
                    }

                    if (typeof callback === 'function') {
                        callback(err, {
                            docs: objs,
                            total: count,
                            limit: ITEMS_PER_PAGE,
                            page: page,
                            hasNext: ITEMS_PER_PAGE * page < count,
                            hasPrevious: page > 1
                        });
                    }
                });
        });

    };

    /**
     * Returns good pagination object given request
     *
     * @param  {Number} page Current page
     * @return {Object} Mongo pagination object
     */
    exports.page = function(page, options) {
        var res,
            k;

        res = {
            skip: ITEMS_PER_PAGE * (page - 1),
            limit: ITEMS_PER_PAGE
        };

        if (!!options) {
            for (k in options) {
                if (options.hasOwnProperty(k)) {
                    res[k] = options[k];
                }
            }
        }

        return res;
    };

}());
