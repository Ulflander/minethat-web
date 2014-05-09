




(function() {
    'use strict';

    chunk('subscription', {
        validate: function(hide) {
            var val = $('input[name=email]').val(),
                at_idx = val.indexOf('@'),
                dot_idx = val.lastIndexOf('.');

            if (val === '' && hide === true) {
                chunk('landing').hideError('.input-wrap.email');
                return false;
            }

            if (at_idx > 0 && dot_idx > 3 &&
                at_idx < dot_idx &&
                val.length > dot_idx + 2) {

                chunk('landing').hideError('.input-wrap.email');
                return true;
            } else {
                chunk('landing').showError('.input-wrap.email');
            }

            return false;
        },

        subscribe: function() {

            if (!chunk('subscription').validate()) {
                return;
            }

            $.post('/ajax/landing_subscribe', $('#subscribe').serialize(),

                function(res) {
                    var status = !!res ? res.status : 'error',
                        error = !!res ? res.error : null;

                    if (status === 'success') {
                        ga('send', 'event', 'landing', 'subscribe');

                        $('#subscribe').hide();
                        $('#subscribed').fadeIn(200);

                    } else if (status === 'exists') {

                        $('form .result').html('It seems that you\'re ' +
                            'already registered. Thanks for that :) Do ' +
                            'you want to  <a href="/subscription?id=' + res.id +
                            '">edit your subscription</a>?').show();
                        $('input[name=email]').val('');

                    } else if (status === 'error') {
                        $('form .result')
                            .html('Oups, an error occured. You may try again?')
                            .show();
                    }

                });
        }
    });

}());
