




(function(landing) {
    'use strict';

    var errors = {};

    landing.start = function() {

        $('.input-wrap.email .message').on('click', function() {
            $(this).fadeOut();
        });

        $('#subscribed a').on('click', function() {
            $('input[name=email]').on('focus', function() {
                if (typeof ga !== 'undefined') {
                    ga('send', 'event', 'landing', 'share');
                }
            });
        });

        $('input[name=email]').on('focus', function() {
            if (typeof ga !== 'undefined') {
                ga('send', 'event', 'landing', 'focus_input');
            }
        });

        $('input[name=email]').on('blur', function(e) {
            hunk.subscription.validate(true);
        });

        $('#subscribe').on('submit', function(e) {
            e.preventDefault();
            if (hunk.subscription.validate()) {
                hunk.subscription.subscribe();
            }
        });


        if (window.location.hash === '#subscribe') {
            $('input[name=email]').focus();
        }

    };

    landing.hideError = function(selector) {
        if (!!errors[selector]) {
            errors[selector] = false;

            $(selector).removeClass('invalid');
            $(selector + ' .message')
                .fadeOut();
        }
    };

    landing.showError = function(selector) {
        var visible = errors[selector] || false;
        if (!visible) {
            errors[selector] = true;

            $(selector).addClass('invalid');
            $(selector + ' .message').fadeIn();

            setTimeout(function() {
                landing.hideError(selector);
            }, 5000);
        } else {
            $(selector + ' .message').fadeOut(200, function() {
                $(selector + ' .message').fadeIn(200);
            });
        }
    }



    $(function() {
        hunk.start();
    });
}(hunk('landing')));
