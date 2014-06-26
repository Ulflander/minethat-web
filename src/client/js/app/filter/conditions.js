
(function(filter) {
    'use strict';

    var idIndex = 0,

        conditions = [];

    filter.views = {
        keywords: function(obj) {
            idIndex += 1;

            var elId = 'condition_' + idIndex + '_container',
                $el = $(hunk.tpl.render('tpl-conditions-keyword', {
                    id: elId,
                    input_id: 'condition_' + idIndex,
                    value: obj.val
                }));

            $('#conditions-container').append($el);

            $('input[type=text]', $el).selectize({
                delimiter: ',',
                persist: false,
                create: function(input) {
                    return {
                        value: input,
                        text: input
                    }
                }
            });

            $('input[type=text]', $el).on('change', function() {
                obj.val = $(this).val();
            });

            $('input[type=checkbox]', $el).on('click', function() {
                obj.inclusive = this.checked;
            });

            $('.remove', $el).on('click', function(e) {
                if (window.confirm('Are you sure?')) {
                    e.preventDefault();
                    $el.remove();
                }
            });


            return elId;
        }
    };


    filter.conditions = {

        /**
         * KEYWORDS
         */
        keywords: {
            label: 'Keywords',
            type: 'keywords',
            field: 'properties/keywords/main',
            exclusive: false,
            def: '',
            multiple: true,

            autocomplete: function(str, cb) {
                if (typeof cb === 'function') {
                    cb(['some', 'thing']);
                }
            },

            validate: function(value) {
                return !!value && value !== '';
            },
        },

        /**
         * Metrics
         */
        token_frequency: {
            label: 'Token frequency',
            type: 'range',
            field: 'properties/basic_stats/avg_token_frequency',
            range: [0, 3],
            def: [1, 3]
        },
        entity_frequency: {
            label: 'Entity frequency',
            type: 'range',
            field: 'properties/basic_stats/avg_entity_frequency',
            range: [0, 5],
            def: [0, 5]
        },
        quality: {
            label: 'Quality',
            type: 'range',
            field: 'properties/basic_stats/quality_score',
            range: [0, 100],
            def: [10, 100]
        },
        read_time: {
            label: 'Read time',
            type: 'range',
            field: 'properties/basic_stats/read_time_est',
            range: [0, 90],
            def: [0, 15]
        },
        paragraphs: {
            label: 'Amount of paragraph',
            type: 'range',
            field: 'properties/basic_stats/read_time_est',
            range: [0, 1000],
            def: [0, 1000]
        },
        sent_per_paragraph: {
            label: 'Average sentences per paragraph',
            type: 'range',
            field: 'properties/basic_stats/ave_sent_per_par',
            range: [0, 50],
            def: [0, 50]
        }
    };


    filter.addCondition = function(e) {
        var id = $('#conditions-selector').val(),
            obj = filter.generateCondition(id),
            elId;

        e.preventDefault();

        // Check if condition is applyable
        if (obj.mutiple !== true) {

        }


        // Add condition
        console.log(obj);

        if (!!filter.views[id]) {
            filter.views[id](obj);
        }

        conditions.push(obj);
    };

    filter.fromDB = function(obj) {
        var res = [],
            k;

        for(k in obj.conditions) {
            if (obj.conditions.hasOwnProperty(k)) {
                res.push(filter.conditionFromDB(k, obj.conditions[k]));
            }
        }

        conditions = res;

        return res;
    };


    filter.toDB = function() {
        var res = [],
            i,
            l = !!conditions ? conditions.length : 0;

        for(i = 0; i < l; i += 1) {
            if (conditions[i].type !== 'keywords') {
                res.push(filter.conditionToDB(conditions[i]));
            }
        }

        return res.concat(filter.keywordsToDB(conditions));
    };


    filter.generateCondition = function(id) {
        if (!filter.conditions[id]) {
            console.warn('No condition with id ' + id)
            return {};
        }

        return $.extend({val: filter.conditions[id].def}, filter.conditions[id]);
    };


    filter.conditionFromDB = function(key, obj) {
        var res = [];
        switch(key) {
            case 'properties/keywords/main':
                res = res.concat(filter.keywordsFromDB(obj));
                break;
        }

        return res;
    };


    filter.conditionToDB = function(obj) {
        console.log(obj);
        switch(obj.type) {
            default:
                console.log(obj.type + ' not found for serialization');
        }
    };

    filter.initSelector = function() {
        var k;

        for (k in filter.conditions) {
            $('#conditions-selector').append(
                $('<option value="' + k + '">' +
                    filter.conditions[k].label + '</option>')
            );
        }
        $('#conditions-selector').selectize();
        $('#condition-add').on('click', filter.addCondition);
    };


}(hunk('filter')));