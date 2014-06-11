
/**
 * Manage keywords selection.
 */
(function(filter) {
    'use strict';

    filter.keywords = function() {
        $('[name=keywords]').selectize({
                delimiter: ',',
                persist: false,
                create: function(input) {
                    return {
                        value: input,
                        text: input
                    }
                }
            });
    };

}(hunk('filter')));