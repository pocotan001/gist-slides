var menu = {
    items: null,

    init: function() {
        var i = 0,
            item;

        this.items = document.querySelectorAll('#js-ui-menu > li');

        for (; item = this.items[i]; i++) {
            item.addEventListener('click', this.handleClick.bind(this));
        }
    },

    /**
     * @param {Event} e
     */
    handleClick: function(e) {
        this.sendMessage({
            framework: e.target.dataset.framework
        });
        window.close();
    },

    /**
     * @param {Object} message
     */
    sendMessage: function(message) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    }
};

menu.init();
