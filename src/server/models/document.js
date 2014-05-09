

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('Document', new mongoose.Schema({
            rawLength: Number,
            raw: String
        }));
    };
}());
