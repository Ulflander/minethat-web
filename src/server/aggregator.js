

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
        limitPerPage = 5;

    // Require and read configuration,
    // then initialize infinite loop
    require('./conf.js').conf(function(conf) {
        console.log(conf);

        logger = conf.logger;
        models = require('./lib/models.js');
        manager = require('./lib/job.js');
        model = models.model('Source');

        setInterval(self.update, conf.env === 'local' ? 30000 : 10000);

        logger.log('Aggregator started...');
        manager.init(self.update);
    });


    self.submit = function(source, feedItem) {

        console.log(feedItem);

        // Create job
        var job = {
                customerId: '2c7f9a',
                gateway: 'API',
                status: 'VOID',
                type: 'FEED_URL',
                value: feedItem.link[0],
                meta: {

                    doc_title: feedItem.title[0],
                    doc_published_date: feedItem.date,
                    doc_description: feedItem.desc[0],
                    doc_source_name: source.name,
                    doc_source_url: source.url,
                    doc_source_feed_url: source.feed_url
                }
            };

        manager.makeup(job, function(err) {
            if (!!err) {
                logger.error('Unable to publish job', err);
            }
        });
    };


    /**
     * Read feed and create jobs for each aggregated article.
     *
     * @param  {Object}   source   Source
     * @param  {Function} callback Callback (mandatory)
     */
    self.aggregate = function(source, callback) {
        internet.feed(source.feed_url, function(err, feed) {
            if (!!err) {
                logger.error('Unable to retrieve feed items', err);
                return;
            }

            var items = feed.items,
                i,
                last = 0,
                l = items.length;

            for (i = 0; i < l; i += 1) {
                if (items[i].date > (source.last || 0)) {
                    self.submit(source, items[i]);

                    if (items[i].date > last) {
                        last = items[i].date;
                    }
                }
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
        self.aggregate(source, function(source) {
            model.update({
                _id: source._id
            }, {last: source.last},
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
        model.find({}, {}, {skip: currSourcePage, limit: limitPerPage},
            function(err, objs) {
                if (!!err) {
                    logger.error('Error querying db', err);
                    return;
                }
                var i,
                    l = objs.length;

                if (l === 0) {
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

