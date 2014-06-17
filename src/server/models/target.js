

(function() {
    'use strict';

    exports.define = function(mongoose) {
        var model = mongoose.model('Target', new mongoose.Schema({
            filter: String,
            account: String
        }));

    };
}());
