
/**
 * Main management of filter page.
 */
(function(filter) {
    'use strict';

    var current;

    // On start, bind metrics
    filter.start = function() {
        filter.color();
        $('.tooltip').tooltipster();
        filter.initSelector();

        $('#filter-estimate').on('click', function(e) {
            e.preventDefault();
            filter.estimate();
        });
        $('#filter-submit').on('click', function(e) {
            e.preventDefault();
            filter.submit();
        });
        $('#filter-remove').on('click', function(e) {
            e.preventDefault();
            filter.remove();
        });
    };

    filter.init = function(f) {
        var i, l, conds;

        if (!!f) {
            current = f;
        } else {
            current = {
                name: '',
                color: '#333333',
                conditions: []
            }
        }

        console.log(current);
        conds = filter.fromDB(current);

        for (i = 0, l = conds.length; i < l; i += 1) {
            if (!!filter.views[conds[i].id]) {
                filter.views[conds[i].id](conds[i]);
            }
        }

    };

    filter.gather = function() {
        var f = {
            name: $('[name=name]').val(),
            color: $('[name=color]').val(),
            conditions: filter.toDB()
        };

        return f;
    };






    filter.remove = function() {
        if (window.confirm('Are you sure?')) {
            $('#estimation').html(hunk.tpl.render('tpl-loading-state'));

            $.ajax({
                method: 'DELETE',
                contentType: 'application/json',
                url: $('#filter-remove').attr('href'),
            })
            .done(function(data) {
                console.log(data);
            });
        }
    };

    filter.submit = function() {
        $('#estimation').html(hunk.tpl.render('tpl-loading-state'));

        $.ajax({
            method: 'POST',
            data: JSON.stringify(filter.gather()),
            contentType: 'application/json',
            url: $('.filter-settings').attr('data-url'),
        })
        .done(function(data) {
            console.log(data);
        });
    };

    filter.estimate = function() {
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