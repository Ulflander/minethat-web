

(function() {
    'use strict';


    exports.stacks = {
        /**
         * Landing stack
         *
         * @type Object
         */
        landing: {
            css: [
                'css/fonts.css',
                'css/normalize.css',
                'css/font-awesome.min.css',
                'css/anim.css',
                'css-gen/main.css',
                'css-gen/basic-form.css',
                'css-gen/landing.css'
            ],
            js: [
                'vendors/js/*.js',
                'js/landing/*.js'
            ]
        },

        app: {
            css: [
                'css/fonts.css',
                'css/normalize.css',
                'css/font-awesome.min.css',
                'css/anim.css',
                'css-gen/main.css',
                'css-gen/basic-form.css',
                'css-gen/table.css',
                'css-gen/app.css'
            ],
            js: [
                'vendors/js/*.js'
            ]
        }
    };

    exports.get = function(stack, type) {
        if (!exports.stacks[stack]) {
            new Error('Stack ' + stack + ' does not exists.');
        }
        if (!exports.stacks[stack][type]) {
            new Error('Stack ' + stack + ' type ' +
                     type + ' does not exists.');
        }
        var arr = [], i, root;

        if (type === 'css') {
            root = 'src/client/vendors/';
        } else {
            root = 'src/client/';
        }

        for (i = 0; i < exports.stacks[stack][type].length; i++) {
            arr.push(root + exports.stacks[stack][type][i]);
        }

        return arr;
    };
}());