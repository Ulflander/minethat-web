

/**
 * Feed aggregation program.
 */
(function(self) {
    'use strict';

    var logger,
        models,
        model,
        internet = require('./lib/internet.js'),
        currSourcePage = 0,
        limitPerPage = 1;

    // Require and read configuration,
    // then initialize infinite loop
    require('./conf.js').conf(function(conf) {
        logger = conf.logger;
        models = require('./lib/models.js');
        model = models.model('Source');

        setInterval(self.update, conf.env === 'local' ? 30000 : 10000);

        self.update();
    });


    /**
     * Read feed and create jobs for each aggregated article.
     *
     * @param  {Object}   source   Source
     * @param  {Function} callback Callback (mandatory)
     */
    self.aggregate = function(source, callback) {
        internet.feed(source.feed_url, function(err, feed) {
            var items = feed.items,
                i,
                last = 0,
                l = items.length;

            for (i = 0; i < l; i += 1) {
                if (items[i].date > (source.last || 0)) {
                    console.log(items[i].title);

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

