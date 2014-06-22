

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('Target', new mongoose.Schema({
            filter: String,
            account: {
                type: String
            }
        }));
    };
}());
