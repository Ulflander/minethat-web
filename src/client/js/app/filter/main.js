
/**
 * Main management of filter page.
 */
(function(filter) {
    'use strict';

    filter.filterNumber = 0;

    // On start, bind metrics
    filter.start = function() {
        filter.color();
        filter.entities();
        filter.keywords();

        $('.tooltip').tooltipster();

        $('[data-bind]').on('click', function(e){
            e.preventDefault();
            hunk.filter[$(this).attr('data-bind')]();
        });

        if ($('[name=keywords]').val() != '') {
            filter.estimate();
        }
    };

    filter.gather = function() {
        var f = {
            name: $('[name=name]').val(),
            color: $('[name=color]').val(),
            entities: $('[name=entities]').val(),
            keywords: $('[name=keywords]').val(),
        },
        i = 0,
        key;

        while(true) {
            key = $('[name=key\\[' + i + '\\]]');
            if (key.length === 0) {
                break;
            }

            f[key.val()] = $('[name=val\\[' + i + '\\]]').val();

            i += 1;
        }

        return f;
    };

    filter.remove = function() {
        $('#estimation').html(hunk.tpl.render('tpl-loading-state'));

        $.ajax({
            method: 'DELETE',
            contentType: 'application/json',
            url: $('#filter-remove').attr('href'),
        })
        .done(function(data) {
            console.log(data);
        });
    };

    filter.submit = function() {
        $('#estimation').html(hunk.tpl.render('tpl-loading-state'));

        $.ajax({
            method: 'POST',
            data: JSON.stringify(filter.gather()),
            contentType: 'application/json',
            url: $('#filter-form').attr('data-url'),
        })
        .done(function(data) {
            console.log(data);
        });
    };

    filter.estimate = function() {
        $('#estimation').html(hunk.tpl.render('tpl-loading-state'));

        $.ajax({
            method: 'POST',
            data: JSON.stringify(filter.gather()),
            contentType: 'application/json',
            url: '/app/filters/estimate',
        })
        .done(function(data) {
            $('#estimation').html(data);
        });
    };

    $(function() {
        hunk.start();
    });

}(hunk('filter')));