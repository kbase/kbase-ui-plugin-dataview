/*
 // tabs.js widget for creating and displaying tabs

 // Instantiation
 // optional: content, active, removable
 // you can make all tabs or individual tabs removable

 var tabs = $('#ele').tabs();

 //or

 var tabs = $('#ele').tabs({tabs: [
 {name: 'tab1', content: 'foo text or html', active: true},
 {name: 'tab2', content: 'text or html 2', removable: true}
 ]
 });

 // Add a new tab
 // optional: content, active

 tabs.addTab({name: 'tab3', content: 'new content'})

 // Retrieve a tab button
 // (useful for adding events or other stuff)

 var mytab = tabs.tab('tab1')

 // Add content to existing tab
 // (useful for ajax/event stuff)

 tabs.tab({name: 'tab3', content: 'blah blah blah'})

 // manually show a tab
 // Tab panes are shown when clicked automatically.
 // This is a programmatic way of showing a tab.

 tabs.showTab('tab_name');
 */

define([
    'jquery',
    'kb_lib/html',
    'lib/domUtils',

    // for effect
    './widget'
], (
    $,
    html,
    {domSafeText}
) => {
    const t = html.tag,
        a = t('a'),
        div = t('div');

    $.KBWidget({
        name: 'kbTabs',
        version: '1.0.0',
        init(options) {
            this._super(options);
            if (!options) {
                options = {};
            }
            const container = this.$elem,
                self = this,
                tabs = $(`<ul class="nav nav-${options.pills ? 'pills' : 'tabs'}">`),
                tab_contents = $('<div class="tab-content">');
            // xss safe
            container.append(tabs, tab_contents);

            this.tabHistory = [];

            // adds a single tab and content
            this.addTab = function (p) {
                // if tab exists, don't add
                if (tabs.find(`a[data-id="${  p.name  }"]`).length > 0) {
                    return;
                }

                const tab = $(`<li class="${  p.active ? 'active' : ''  }">`),
                    tab_link = $(
                        a(
                            {
                                dataToggle: 'tab',
                                dataId: p.name,
                                dataKBTesthookTab: p.key
                            },
                            domSafeText(p.name)
                        )
                    );

                // animate by sliding tab up
                if (p.animate === false) {
                    // xss safe
                    tab.append(tab_link);
                    // xss safe
                    tabs.append(tab);
                } else {
                    // xss safe
                    tab.append(tab_link);
                    // xss safe
                    tabs.append(tab);
                    // eap 7/6/15 - disable the following line; must be a hook into
                    // the bootstrap tab plugin; but it does not work with BS 3.
                    // tab.toggle('slide', {direction: 'down', duration: 'fast'});
                }

                // add close button if needed
                if (p.removable || options.removable) {
                    const rm_btn = $(
                        '<button type="button" class="close" style="margin-left: 6px; vertical-align: bottom; ">&times;</button>'
                    );
                    // xss safe
                    tab_link.append(rm_btn);

                    rm_btn.click(() => {
                        self.rmTab(p.name);
                    });
                }

                // add content pane
                const contentPane = $(
                    div({
                        class: `tab-pane ${  p.active ? 'active' : ''}`,
                        dataId: p.name,
                        dataKBTesthookTabpane: p.key
                    })
                );
                // xss safe (need to trust)
                contentPane.append(p.content || '');
                // xss safe
                tab_contents.append(contentPane);

                tab.click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = $(this)
                        .find('a')
                        .data('id');

                    self.showTab(id);
                });

                return p.content;
            };

            // remove tab and tab content
            this.rmTab = function (name) {
                const tab = tabs.find(`a[data-id="${  name  }"]`).parent('li');
                const tab_content = tab_contents.children(`[data-id="${  name  }"]`);

                // get previous or next tab
                let nextTabId;
                this.tabHistory.pop();
                if (this.tabHistory.length) {
                    nextTabId = this.tabHistory[this.tabHistory.length - 1];
                } else if (tab.next().length > 0) {
                    nextTabId = tab
                        .next()
                        .children('a')
                        .data('id');
                } else {
                    nextTabId = tab
                        .prev()
                        .children('a')
                        .data('id');
                }

                // remove the tab
                tab.remove();
                tab_content.remove();

                // show prev or next tab
                self.showTab(nextTabId);
            };

            // returns tab
            this.tab = function (name) {
                return tabs.children(`[data-id="${  name  }"]`);
            };

            // returns content of tab
            this.tabContent = function (name) {
                return tab_contents.children(`[data-id="${  name  }"]`);
            };

            // adds content to existing tab pane; useful for ajax
            this.addContent = function (p) {
                const tab = tab_contents.children(`[data-id="${  p.name  }"]`);
                // xss safe (need to trust)
                tab.append(p.content || '');
                return tab;
            };

            this.setContent = function (p) {
                const tab = tab_contents.children(`[data-id="${  p.name  }"]`);
                // xss safe (need to trust)
                tab.html(p.content || '');
                /* TODO: probably better to return this to support chaining... */
                return tab;
            };

            // highlights tab and shows content
            this.showTab = (id) => {
                this.tabHistory.push(id);
                tabs.children('li').removeClass('active');
                tab_contents.children('.tab-pane').removeClass('active');
                tabs.find(`a[data-id="${  id  }"]`)
                    .parent()
                    .addClass('active');
                tab_contents.children(`[data-id="${  id  }"]`).addClass('active');
            };

            this.getTabNav = function () {
                return tabs;
            };

            // if tabs are supplied, add them
            // don't animate initial tabs
            if (options.tabs) {
                options.tabs.forEach(
                    (tab) => {
                        this.addTab($.extend(tab, {animate: false}));
                    }
                );
            }

            return this;
        }
    });
});
