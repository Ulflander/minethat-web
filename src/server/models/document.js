

(function() {
    'use strict';

    exports.define = function(mongoose) {
        var model = mongoose.model('Document', new mongoose.Schema({
            rawLength: Number,
            raw: String
        }));

    };
}());
