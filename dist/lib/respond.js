

/**
 * Some useful methods to respond to http requests. All these methods are
 * available through the Response object in controllers.
 *
 * Never use these methods directly but always through the Response object.
 */
(function() {
    'use strict';

    /**
     * Respond as HTML error page.
     *
     * @param  {Number} code HTTP status code (optional: default 404)
     */
    exports.error = function(code) {
        this.respond(code || 404, 'text/plain', 'File not found');
    };

    /**
     * Respond as HTML.
     *
     * @param  {String} html HTML string to send
     * @param  {Number} code HTTP status code (optional: default 200)
     */
    exports.html = function(html, code) {
        this.respond(code || 200, 'text/html', html);
    };

    /**
     * Respond as plain text.
     *
     * @param  {String} str String to send
     * @param  {Number} code HTTP status code (optional: default 200)
     */
    exports.plain = function(str, code) {
        this.respond(code || 200, 'text/plain', str);
    };

    /**
     * Respond as JSON.
     *
     * @param  {String|Object} o JSON string or object to stringify
     * @param  {Number} code HTTP status code (optional: default 200)
     */
    exports.json = function(o, code) {
        this.respond(code || 200, 'application/json',
            (typeof o === 'string' ? o : JSON.stringify(o)));
    };

    /**
     * Respond with given code, content type and content.
     *
     * @param  {Number} code         HTTP status code
     * @param  {String} content_type Content type
     * @param  {String} content      Content
     */
    exports.respond = function(code, content_type, content) {

        try {
            this.writeHead(code, {
                'Content-type': content_type
            });
        } catch (e) {
            console.error('Headers cant be set');
        }

        this.end(content);
    };

    exports.redirect = function(url) {
        this.writeHead(302, {
            'Location': url
        });
        this.end();
    };
}());
