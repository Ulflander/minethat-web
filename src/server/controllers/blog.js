
(function() {
    'use strict';

    var cv = require('../lib/controller-view.js'),
        re = new RegExp('<p>([^<]+)', 'im'),
        articles = {},
        summaries = {};

    /**
     * Add an article to the blog.
     *
     * @param {String} filename Name of file for URL
     * @param {String} article HTML article
     */
    exports.add = function(filename, article) {
        articles[filename] = article;

        // Generate summary
        var res = re.exec(article);
        if (!!res) {
            summaries[filename] = res[1].split('\n').join(' ');
        } else {
            summaries[filename] = '';
        }
    };

    /**
     * Show recent posts.
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.index = function(req, res, next) {
        var list = [],
            k,
            filename;

        for (k in articles) {
            if (articles.hasOwnProperty(k)) {
                filename = k.split('/blog/').join('')
                            .split('.html').join('')
                            .split('-');
                list.push({
                    url: '/blog/' + filename.join('-') + '.html',
                    date: filename.splice(0, 3).join('/'),
                    title: filename.join(' ')
                });
            }
        }


        cv.view(req, res, 'blog/articles.html', {
            articles: list
        });
    };

    /**
     * Show blog post.
     *
     * @param  {Object}   req  Connect request object
     * @param  {Object}   res  Connect response object
     * @param  {Function} next Callback
     */
    exports.article = function(req, res, next) {
        // Split url and set data
        var url = req.url.split('/blog/').join('')
                        .split('.html').join('')
                        .split('-');



        cv.view(req, res, 'blog/article.html', {
            summary: summaries[req.url],
            url: 'http://www.minethat.co' + req.url,
            content: articles[req.url] || 'Article not found',
            date: url.splice(0, 3).join('/'),
            title: url.join(' ')
        });
    };

}());
