
(function(filter) {
    'use strict';

    filter.color = function() {
        $('[name=color]').spectrum({
            preferredFormat: "hex",
        });
    };

}(hunk('filter')));