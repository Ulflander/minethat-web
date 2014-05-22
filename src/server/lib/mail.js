

/**
 * Utility to send emails.
 */
(function() {
    'use strict';

    var smtp,
        htmlToText = require('html-to-text'),
        cv = require('./controller-view.js'),
        conf = require('../conf.js').conf(),
        logger = conf.logger,
        nodemailer = require('nodemailer');

    /**
     * Send email given html content.
     *
     * @param  {String} to      Recipient
     * @param  {String} subject Subject
     * @param  {String} html    HTML content
     * @param  {String} from    Sender
     * @param  {String} text    Optional text version
     */
    exports.html = function(to, subject, html, from, text) {
        if (!smtp) {
            smtp = nodemailer.createTransport('SMTP', {
                service: 'Gmail',
                auth: {
                    user: conf.WEB_EMAIL_USER,
                    pass: conf.WEB_EMAIL_PASS
                }
            });
        }

        smtp.sendMail({
            from: from || 'Xav from Minethat <xav@minethat.co>',
            to: to,
            subject: subject,
            text: text || htmlToText.fromString(html),
            html: html
        }, function(error, response) {
            if (error) {
                logger.error(error);
            }else {
                logger.debug('Message sent to ' + to + '/' + response.message);
            }
        });
    };

    /**
     * Send email by rendering an email.
     *
     * @param  {String} to      Recipient
     * @param  {String} subject Subject
     * @param  {String} tpl     Template name
     * @param  {Object} data    Data to use for rendering template
     * @param  {String} from    Sender
     * @param  {String} text    Optional text version
     */
    exports.template = function(to, subject, tpl, data, from, text) {
        cv.renderView('emails/' + tpl, data, function(html) {
            exports.html(to, subject, html, from, text);
        });
    };
}());
