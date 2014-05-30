

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

        chrome: {
            css: [
                'css/fonts.css',
                'css/normalize.css',
                'css/font-awesome.min.css',
                'css/anim.css',
                'css-gen/main.css',
                'css-gen/basic-form.css',
                'css-gen/table.css'
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
            console.warn('Stack ' + stack + ' does not exists.');
            return null;
        }
        if (!exports.stacks[stack][type]) {
            console.warn('Stack ' + stack + ' type ' +
                     type + ' does not exists.');
            return null;
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