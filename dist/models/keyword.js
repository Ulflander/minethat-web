

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('Keyword', new mongoose.Schema({
            value: {
                type: String,
                indexed: true
            },
            count: {
                type: Number
            }
        }));
    };
}());
