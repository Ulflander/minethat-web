

(function() {
  'use strict';


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


    ///////////////////////
    // PUBLIC
    '/': ['get', 'home'],
    '/ajax/landing_subscribe': ['post', 'home.subscribe'],
    '/subscription': ['get', 'subscription']


    /*
    '/subscription': ['get', 'home.subscription'],
    '/ajax/landing_subscribe': ['post', 'home.subscribe'],


    ///////////////////////
    // app
    '/app/jobs': ['get', 'jobs.all'],
    '/app/job/:id': ['get', 'jobs.one'],

    '/app/documents': ['get', 'documents.all'],
    '/app/document': ['get', 'documents.one'],


    ///////////////////////
    // admin


    ///////////////////////
    // REST API
    '/api/v1/jobs': ['get', 'jobs.all'],
    '/api/v1/job/:jobId': ['get', 'jobs.one'],


    '/api/v1/documents': ['get', 'documents.all'],


    ///////////////////////
    // REST API
    '/api/v1/submit/url': ['post', 'submit.url'],
    '/api/v1/submit/string': ['post', 'submit.string'],
    '/api/v1/submit/html_string': ['post', 'submit.html_string']
    */
  };

}());
