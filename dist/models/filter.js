

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('Filter', new mongoose.Schema({
            color: String,
            name: String,
            building: {
                type: Boolean,
                'default': true
            },
            fields: mongoose.Schema.Types.Mixed,
            conditions: mongoose.Schema.Types.Mixed
        }));
    };
}());
