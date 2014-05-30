/*jslint node:true*/

(function() {
    'use strict';

    /**
     * Job model
     * @param  {Object} mongoose Mongoose instance
     * @return {Object}          Job mongoose model
     */
    exports.define = function(mongoose) {
        return mongoose.model('Job', new mongoose.Schema({
            start: {type: Date, 'default': Date.now},
            end: Date,
            status: String,
            gateway: String,
            value: String,
            type: String,
            document: String,
            customerId: {
                type: String,
                index: true
            },
            meta: {
                doc_title: String,
                doc_published_date: Number,
                doc_description: String,
                doc_source_name: String,
                doc_source_url: String,
                doc_source_feed_url: String
            },
            email: String,
            target: {
                type: String,
                'default': 'MINE'
            },
            classes: String
        }));
    };

}());
