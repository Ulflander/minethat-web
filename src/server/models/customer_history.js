

(function() {
    'use strict';

    exports.define = function(mongoose) {
        return mongoose.model('CustomerHistory', new mongoose.Schema({
            customer: String,
            date: {
                type: Number,
                'default': Date.now
            },
            from_plan: String,
            to_plan: String
        }));
    };
}());
