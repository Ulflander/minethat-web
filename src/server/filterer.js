/*jslint regexp:true*/


/**
 * Filterer loads filters, and filters any input article, it also send keywords
 * and entities into redis.
 */
(function(self) {
    'use strict';

    var logger,
        listener,
        models;

    // Require and read configuration,
    // then initialize infinite loop
    require('./conf.js').conf(function(conf) {

        logger = conf.logger;
        models = require('./lib/models.js');
        listener = require('./lib/listener.js');

        logger.log('Filterer started...');

        listener.init(conf.RABBIT_FILTER_QUEUE, self.onDocument);
    });



    self.onDocument = function(docId) {
        models.find('Document', docId.data.toString(), function(err, doc) {
            if (!!err) {
                logger.error('Error while retrieving doc ' + docId, err);
                return;
            }

            var d = doc.toObject();
            console.log(d);
            self.saveKeywords(d.properties.keywords.main);
        }, 'properties');
    };

    self.saveKeywords = function(keywords) {
        var i,
            l = keywords.length;

        // For each keyword
        for (i = 0; i < l; i += 1) {
            console.log(keywords[i]);
            self.saveKeyword(keywords[i]);
        }
    };

    self.saveKeyword = function (original) {

        // Check for its existence
        models.findAll(null, 'Keyword', {
            value: original
        }, null, null, function(err, keywords) {

            // Create it if not exist
            if (!keywords || keywords.length === 0) {
                var Keyword = models.model('Keyword'),
                    kw = new Keyword({
                        count: 1,
                        value: original
                    });

                kw.save(function(err) {
                    if (!!err) {
                        logger.error('Error while saving keyword ' +
                            original, err);
                        return;
                    }

                    console.log('Created ' + original);
                });

            // Otherwise update count
            } else {
                keywords[0].update({
                    count: keywords[0].count + 1
                }, function(err) {
                    if (!!err) {
                        logger.error('Error while updating keyword ' +
                            original, err);
                        return;
                    }


                    console.log('Updated ' + original + ': ' +
                        keywords[0].count);
                });
            }
        });
    };

}(exports));

