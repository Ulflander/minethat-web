

(function() {
    'use strict';

    /**
     * Add a new route
     *
     * @param {String} route Route
     * @param {Array} methodController Method and controller/function
     */
    exports.add = function(route, methodController) {
        exports.routes[route] = methodController;
    };

    exports.routes = {

        ///////////////////////
        // APP
        '/app/sources': ['get', 'source.index'],
        '/app/source/new': [
            ['get', 'source.add'],
            ['post', 'source.add']
        ],
        '/app/source/generate': [
            ['get', 'source.from_feed'],
            ['post', 'source.from_feed']
        ],
        '/app/source/:id': [
            ['get', 'source.edit'],
            ['post', 'source.edit']
        ],

        '/app/documents': ['get', 'document.index'],
        '/app/document/:id': ['get', 'document.display'],



        ///////////////////////
        // ADMINISTRATION
        '/admin/subscribers': ['get', 'subscriber'],
        '/admin/subscribers.csv': ['get', 'subscriber.csv'],
        '/admin/subscriber/:id': ['get', 'subscriber.display'],


        ///////////////////////
        // REST API
        '/api/v1/sources': ['get', 'source.index'],
        '/api/v1/sources/check': ['post', 'source.check'],
        '/api/v1/source/:id': [
            ['get', 'source.display'],
            ['post', 'source.edit'],
            ['delete', 'source.remove']
        ],
        '/api/v1/source': ['post', 'source.add'],


        '/api/v1/document/:id': [
            ['get', 'document.display'],
            ['delete', 'document.remove']
        ],

        ///////////////////////
        // REST API
        '/api/v1/submit/url': ['post', 'submit.url'],
        '/api/v1/submit/string': ['post', 'submit.string'],
        '/api/v1/submit/html_string': ['post', 'submit.html_string'],

        ///////////////////////
        // PUBLIC
        '/': ['get', 'home'],
        '/blog': ['get', 'blog'],
        '/ajax/landing_subscribe': ['post', 'home.subscribe'],
        '/subscription': ['get', 'subscription']
    };

}());
