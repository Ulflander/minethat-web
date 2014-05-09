




(function() {
    'use strict';

    var errors = {};

    chunk('landing', {
        start: function() {

            $('.input-wrap.email .message').on('click', function() {
                $(this).fadeOut();
            });

            $('#subscribed a').on('click', function() {
                $('input[name=email]').on('focus', function() {
                    ga('send', 'event', 'landing', 'share');
                });
            });

            $('input[name=email]').on('focus', function() {
                ga('send', 'event', 'landing', 'focus_input');
            });

            $('input[name=email]').on('blur', function(e) {
                chunk('subscription').validate(true);
            });

            $('#subscribe').on('submit', function(e) {
                e.preventDefault();
                if (chunk('subscription').validate()) {
                    chunk('subscription').subscribe();
                }
            });

        },

        hideError: function(selector) {
            if (!!errors[selector]) {
                errors[selector] = false;

                $(selector).removeClass('invalid');
                $(selector + ' .message')
                    .fadeOut();
            }
        },

        showError: function(selector) {
            var visible = errors[selector] || false;
            if (!visible) {
                errors[selector] = true;

                $(selector).addClass('invalid');
                $(selector + ' .message').fadeIn();

                setTimeout(function() {
                    chunk('landing').hideError(selector);
                }, 5000);
            } else {
                $(selector + ' .message').fadeOut(200, function() {
                    $(selector + ' .message').fadeIn(200);
                });
            }
        }
    });



    $(function() {
        chunk.start();
    });
}());
