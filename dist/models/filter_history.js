

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('FilterHistory', new mongoose.Schema({
            filter: {
                type: String,
                indexed: true
            },
            document: {
                type: String,
                indexed: true
            }
        }));
    };
}());
