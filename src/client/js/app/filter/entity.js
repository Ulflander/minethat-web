
/**
 * Manage entities selection.
 */
(function(filter) {
    'use strict';

    filter.entities = function() {
        $('[name=entities]').selectize({
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