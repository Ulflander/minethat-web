
(function(filter) {
    'use strict';

    filter.addMetric = function() {
        var k,
            $sel,
            $input,
            $el = $('<div></div>')
                    .addClass('input-wrap metric')
                    .appendTo($('#metrics'));

        $sel = $('<select>')
                .attr('name', 'key[' + filter.filterNumber + ']');
        for(k in filter.metrics) {
            $sel.append($('<option>')
                            .attr('value', k)
                            .text(filter.metrics[k]));
        }
        $el.append($sel);
        $sel.selectize();

        $input = $('<input />')
                    .attr('type', 'text')
                    .addClass('input')
                    .attr('name', 'val[' + filter.filterNumber + ']')
                    .appendTo($el);

        filter.filterNumber += 1;

    };

    filter.metrics = {
        'properties.basic_stats.avg_token_frequency.min': 'Min. token frequency (0 to 3)',
        'properties.basic_stats.avg_token_frequency.max': 'Max. token frequency (0 to 3)',
        'properties.basic_stats.avg_entity_frequency.min': 'Min. entity frequency (0 to 5)',
        'properties.basic_stats.avg_entity_frequency.max': 'Max. entity frequency (0 to 5)',

        'properties.basic_stats.quality_score.min': 'Min. quality (0 to 100)',
        'properties.basic_stats.read_time_est.min': 'Min. read time in minutes',
        'properties.basic_stats.read_time_est.max': 'Max. read time in minutes',
        'properties.basic_stats.total_paragraphs.min': 'Min. amount of paragraphs',
        'properties.basic_stats.total_paragraphs.max': 'Max. amount of paragraphs',

        'properties.meta.doc_source_name.in': 'Source(s)',

        'properties.meta.main_language': 'Main language'
    };

}(hunk('filter')));