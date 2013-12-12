var configs = {
    'reveal.js': {
        css: [
            '/framework/reveal.js/css/reveal.min.css',
            '/framework/reveal.js/css/theme/default.css'
        ],
        js: [
            '/framework/reveal.js/lib/js/head.min.js',
            '/framework/reveal.js/js/reveal.min.js'
        ],
        init: function(importScripts) {
            importScripts();
            Reveal.initialize({
                controls: true,
                progress: true,
                history: true,
                center: true,

                theme: Reveal.getQueryHash().theme,
                transition: Reveal.getQueryHash().transition || 'default',

                // Optional libraries used to extend on reveal.js
                dependencies: []
            });
        }
    },

    'shower': {
        css: [
            '/framework/shower/themes/ribbon/styles/screen.css'
        ],
        js: [
            '/framework/shower/shower.min.js'
        ],
        init: function(importScripts) {
            app.$body.addClass('list');
            importScripts();
        }
    },

    'bespoke.js': {
        css: [
            '/framework/bespoke.js/demo/style.css',
            '/framework/bespoke.js/demo/themes.css'
        ],
        js: [
            '/framework/bespoke.js/dist/bespoke.min.js'
        ],
        init: function(importScripts) {
            // Available options: 'coverflow', 'classic', 'cube', 'carousel', 'concave'
            app.$body.addClass('coverflow');
            importScripts();
            bespoke.horizontal.from('article');
        }
    }
};
