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
        manager = require('./lib/job.js');
        model = models.model('Source');

        setInterval(self.update, conf.env === 'local' ? 10000 : 1000);

        logger.log('Aggregator started...');
        manager.init(self.update);
    });

    self.markError = function(source, err) {
        if (!source.successive_errors) {
            source.successive_errors = 0;
        }
        source.successive_errors += 1;
        model.update({
            _id: source._id
        }, {
            successive_errors: source.successive_errors,
            last_error: !!err ? err.toString() : ''
        },
        function(err, numberAffected, rawResponse) {
            if (!!err) {
                logger.error('Error updating source', err);
                return;
            }
            if (numberAffected === 0) {
                logger.error('Error updating source: no item affected');
            }
        });
    };


    self.getLinkField = function(item) {
        if (typeof item.origlink === 'string') {
            return item.origlink;
        }
        if (Array.isArray(item.origlink)) {
            return item.origlink[0];
        }
        if (typeof item.link === 'string') {
            return item.link;
        }
        if (Array.isArray(item.link)) {
            return item.link[0];
        }

        return undefined;
    };

    self.getTitleField = function(item) {
        var title = '';
        if (typeof item.title === 'string') {
            title = item.title;
        }
        if (Array.isArray(item.title)) {
            title = item.title[0];
        }

        return entities.decode(title.replace(/(<([^>]+)>)/ig,' '));
    };

    self.getDescField = function(item) {
        var desc = '';
        if (typeof item.description === 'string') {
            desc = item.description;
        }
        if (Array.isArray(item.description)) {
            desc = item.description[0];
        }
        if (typeof item.desc === 'string') {
            desc = item.desc;
        }
        if (Array.isArray(item.desc)) {
            desc = item.desc[0];
        }

        return entities.decode(desc.replace(/(<([^>]+)>)/ig,' '));
    };

    /**
     * Parse and normalize feed date.
     * @param  {[type]} date [description]
     * @return {[type]}      [description]
     */
    self.parseDate = function(date, now) {

        // Try to parse with momentjs
        if (isNaN(date)) {
            date = moment(date).valueOf();
        }

        // Get ts from date object
        if (typeof date === 'object' &&
            typeof date.getTime === 'function') {

            return date.getTime();
        }

        // Valid
        if (typeof date === 'number' && date > 0) {
            return date;
        }

        return 0;
    };


    self.submit = function(source, feedItem) {
        var link = self.getLinkField(feedItem),
            job;

        if (!link) {
            logger.debug('Unable to publish: no link, via ' + source.name);
            return;
        }

        logger.debug('Publishing ' + link + ' via ' + source.name);

        // Create job
        job = {
            customerId: '2c7f9a',
            gateway: 'API',
            status: 'VOID',
            type: 'FEED_URL',
            value: link,
            meta: {
                doc_description_quality: source.quality,
                doc_title: self.getTitleField(feedItem),
                doc_published_date: feedItem.date,
                doc_description: self.getDescField(feedItem),
                doc_source_name: source.name,
                doc_source_url: source.url,
                doc_source_id: source._id,
                doc_source_feed_url: source.feed_url
            }
        };

        manager.makeup(job, function(err) {
            if (!!err) {
                logger.warn('Unable to publish job for ' + source.name, err);
                self.markError(source, err);
            }
        });
    };


    /**
     * Read feed and create jobs for each aggregated article.
     *
     * @param  {Object}   source   Source
     * @param {Number} now Timestamp at aggregation time
     * @param  {Function} callback Callback (mandatory)
     */
    self.aggregate = function(source, now, callback) {
        internet.feed(source.feed_url, function(err, feed) {

            if (!!err || !feed || !feed.items) {
                logger.warn('Unable to retrieve feed items: ' +
                        source.name, err);
                self.markError(source, err);
                return;
            }

            var items = feed.items,
                i,
                last = 0,
                found = false,
                date,
                l = items.length;

            for (i = 0; i < l; i += 1) {
                date = self.parseDate(items[i].date, now);

                if (date === 0) {
                    logger.warn('Feed article date is not valid');
                    self.markError(source);
                } else if (date > (source.last || 0)) {
                    items[i].date = date;
                    self.submit(source, items[i]);
                    found = true;
                    if (date > last) {
                        last = date;
                    }
                }
            }
            if (last === 0 && found !== false) {
                logger.warn('Unable to retrieve feed items: ' + source.name);
                self.markError(source);
                return;
            }

            if (last > 0) {
                source.last = last;
            }

            callback(source);
        });
    };

    /**
     * Aggregate articles, then update source last aggregation timestamp.
     *
     * @param  {Object} source Source to aggregate
     */
    self.check = function(source) {
        self.aggregate(source, Date.now(), function(source) {

            model.update({
                _id: source._id
            }, {
                last: source.last,
                successive_errors: 0
            },
            function(err, numberAffected, rawResponse) {
                if (!!err) {
                    logger.error('Error updating source', err);
                    return;
                }
                if (numberAffected === 0) {
                    logger.error('Error updating source: no item affected');
                }
            });
        });
    };

    /**
     * Aggregate articles from a bunch of sources.
     */
    self.update = function() {
        model.find({
            $or: [{successive_errors: {
                    $lt: 4
                }}, {successive_errors: {
                    $exists: false
                }}]
        }, {}, {skip: currSourcePage, limit: limitPerPage},
            function(err, objs) {
                if (!!err) {
                    logger.error('Error querying db', err);
                    return;
                }
                var i,
                    l = objs.length;

                if (l === 0) {
                    logger.log('No source found');
                    currSourcePage = 0;
                    return;
                }

                currSourcePage += 1;

                for (i = 0; i < l; i += 1) {
                    self.check(objs[i]);
                }
            });
    };



}(exports));

