var app = {
    $body: null,
    $markdownBody: null,
    template: null,
    hasCaches: false,

    /**
     * {
     *     author: '-',
     *     header: '-',
     *     items: [{
     *         body: '-',
     *         children: [{
     *             body: '-'
     *         }]
     *     }]
     * }
     *
     * @type {Object}
     */
    data: null,

    /**
     * @param {String} framework
     */
    init: function(framework) {
        var config = configs[framework];

        if (!this.hasCaches) {
            this.$body = $('body');
            this.$markdownBody = $('.markdown-body').eq(0).clone();
            this.data = {
                author: this.getAuthor(),
                header: this.getHeader(),
                items: this.getItems()
            };
            this.hasCaches = true;
        }

        this.template = templates[framework + '.hbs'];
        this.cleanUpURL();
        this.$body.hide();
        this.removeStyles();
        this.insertCSS(this.getFullPaths(config.css));
        this.render();
        this.fetchScripts(this.getFullPaths(config.js), config.init);
        this.$body.fadeIn();
    },

    cleanUpURL: function() {
        var cleanURL = document.location.href.split('#')[0];

        history.pushState(null, null, cleanURL);
    },

    removeStyles: function() {
        $('style, link[rel="stylesheet"]').remove();
    },

    /**
     * @param {Array} filePaths
     * @return {Array}
     */
    getFullPaths: function(filePaths) {
        return filePaths.map(function(filePath) {
            return chrome.extension.getURL(filePath);
        });
    },

    /**
     * @param {Array} filePaths
     */
    insertCSS: function(filePaths) {
        var stylesheets = filePaths.map(function(filePath) {
            return '<link rel="stylesheet" href="' + filePath + '">';
        }).join('');

        $('head').append(stylesheets);
    },

    /**
     * @param {Array} filePaths
     * @param {Function} callback
     */
    fetchScripts: function(filePaths, callback) {
        var defers = filePaths.map(function(filePath) {
            return $.get(filePath);
        });

        $.when.apply(null, defers).done(function() {
            var scripts;

            if (typeof arguments[0] === 'string') {
                scripts = arguments[0];
            } else {
                scripts = ([].slice.call(arguments)).map(function(argument) {
                    return argument[0];
                }).join('');
            }

            callback(eval.bind(null, scripts));
        });
    },

    /**
     * @param {jQuery}
     * @return {String}
     */
    getHTML: function($el) {
        return $('<div />').append($el.clone()).remove().html();
    },

    /**
     * @return {String}
     */
    getAuthor: function() {
        return $('.name').text().trim();
    },

    /**
     * @return {String}
     */
    getHeader: function() {
        var $headerBody = this.$markdownBody.find('> :first-child').nextUntil('h1, h2').addBack();

        return this.getHTML($headerBody);
    },

    /**
     * @return {Array}
     */
    getItems: function() {
        var $startingPoints = this.$markdownBody.find('> :first-child, h1, h2').filter(':gt(0)'),
            items = [],
            self = this;

        $startingPoints.each(function() {
            var $headings = $(this).nextUntil('h1, h2').addBack().filter('h1, h2, h3'),
                item = {};

            item.children = 2 <= $headings.length ? [] : null;

            $headings.each(function(i) {
                var $itemBody = $(this).nextUntil('h1, h2, h3').addBack();

                if (i === 0) {
                    item.body = self.getHTML($itemBody);
                } else {
                    item.children.push({
                        body: self.getHTML($itemBody)
                    });
                }
            });

            items.push(item);
        });

        return items;
    },

    render: function() {
        this.$body.html(this.template(this.data));
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    app.init(request.framework);
});
