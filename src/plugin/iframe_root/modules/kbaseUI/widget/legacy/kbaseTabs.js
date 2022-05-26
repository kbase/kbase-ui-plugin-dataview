/*

 Easy widget to serve as a tabbed container.

 var $tabs = $('#tabs').kbaseTabs(
 {
 tabPosition : 'bottom', //or left or right or top. Defaults to 'top'
 canDelete : true,       //whether or not the tab can be removed. Defaults to false.
 tabs : [
 {
 tab : 'T1',                                     //name of the tab
 // safe
 content : $('<div></div>').html("I am a tab"),  //jquery object to stuff into the content
 canDelete : false,                              //override the canDelete param on a per tab basis
 },
 {
 tab : 'T2',
 // safe
 content : $('<div></div>').html("I am a tab 2"),
 },
 {
 tab : 'T3',
 // safe
 content : $('<div></div>').html("I am a tab 3"),
 show : true,                                    //boolean. This tab gets shown by default. If not specified, the first tab is shown
 },
 ],
 }
 );

 useful methods would be:

 $('#tabs').kbaseTabs('showTab', 'T1');
 $('#tabs').kbaseTabs('addTab', tabObject);  //the tabObject defined up above

 */

define([
    'jquery',

    './widget',
    'bootstrap'
], (
    $
) => {
    $.KBWidget({
        name: 'kbaseTabs',
        version: '1.0.0',
        _accessors: ['tabsHeight'],
        options: {
            tabPosition: 'top',
            canDelete: false,
            borderColor: 'lightgray'
        },
        init(options) {
            this._super(options);

            this.data('tabs', {});
            this.data('nav', {});

            this.appendUI($(this.$elem));

            return this;
        },
        appendUI($elem, tabs) {
            if (tabs === undefined) {
                tabs = this.options.tabs;
            }

            const $block = $('<div></div>').addClass('tabbable');

            const $tabs = $('<div></div>')
                .addClass('tab-content')
                .attr('id', 'tabs-content')
                .css('height', this.tabsHeight());

            const $nav = $('<ul></ul>')
                .addClass('nav nav-tabs')
                .attr('id', 'tabs-nav');

            $block.append($nav).append($tabs);

            this._rewireIds($block, this);

            $elem.append($block);

            if (tabs) {
                $.each(
                    tabs,
                    $.proxy(function (idx, tab) {
                        this.addTab(tab);
                    }, this)
                );
            }
        },
        addTab(tab) {
            if (tab.canDelete === undefined) {
                tab.canDelete = this.options.canDelete;
            }

            const $tab = $('<div></div>')
                .addClass('tab-pane');

            if (tab.content) {
                $tab.append(tab.content);
            } else if (tab.showContentCallback) {
                $tab.append(tab.showContentCallback());
            }

            if (this.options.border) {
                $tab.css('border', `solid ${  this.options.borderColor}`);
                $tab.css('border-width', '0px 1px 0px 1px');
                $tab.css('padding', '3px');
            }

            const $that = this;

            const $nav = $('<li></li>')
                .css('white-space', 'nowrap')
                .append(
                    $('<a></a>')
                        .attr('href', '#')
                        .text(tab.tab)
                        .attr('data-tab', tab.tab)
                        .bind('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            const previous = $that.data('tabs-nav').find('.active:last a')[0];

                            //we can't just call 'show' directly, since it requires an href or data-target attribute
                            //on the link which MUST be an idref to something else in the dom. We don't have those,
                            //so we just do what show does and call activate directly.
                            //
                            //oh, but we can't just say $(this).tab('activate',...) because bootstrap is specifically
                            //wired up not to pass along any arguments to methods invoked in this manner.
                            //
                            //Because bootstrap -sucks-.
                            $.fn.tab.Constructor.prototype.activate.call(
                                $(this),
                                $(this).parent('li'),
                                $that.data('tabs-nav')
                            );

                            $.fn.tab.Constructor.prototype.activate.call($(this), $tab, $tab.parent(), function () {
                                $(this).trigger({
                                    type: 'shown',
                                    relatedTarget: previous
                                });
                            });
                        })
                        .append(
                            $('<button></button>')
                                .addClass('btn btn-default btn-xs')
                                .append($('<i></i>').addClass(this.closeIcon()))
                                .css('padding', '0px')
                                .css('width', '22px')
                                .css('height', '22px')
                                .css('margin-left', '10px')
                                .bind(
                                    'click',
                                    $.proxy(function (e) {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        if (tab.deleteCallback !== undefined) {
                                            tab.deleteCallback(tab.tab);
                                        } else {
                                            this.deletePrompt(tab.tab);
                                        }
                                    }, this)
                                )
                        )
                );

            if (!tab.canDelete) {
                $nav.find('button').remove();
            }

            this.data('tabs')[tab.tab] = $tab;
            this.data('nav')[tab.tab] = $nav;

            this.data('tabs-content').append($tab);
            this.data('tabs-nav').append($nav);

            const tabCount = Object.keys(this.data('tabs')).length;
            if (tab.show || tabCount === 1) {
                this.showTab(tab.tab);
            }
        },
        closeIcon() {
            return 'fa fa-close';
        },
        hasTab(tabName) {
            return this.data('tabs')[tabName];
        },
        showTab(tab) {
            if (this.shouldShowTab(tab)) {
                const nav = this.data('nav');
                nav[tab].find('a').trigger('click');
            }
        },
        removeTab(tabName) {
            const $tab = this.data('tabs')[tabName];
            const $nav = this.data('nav')[tabName];

            if ($nav.hasClass('active')) {
                if ($nav.next('li').length) {
                    $nav.next()
                        .find('a')
                        .trigger('click');
                } else {
                    $nav.prev('li')
                        .find('a')
                        .trigger('click');
                }
            }

            $tab.remove();
            $nav.remove();

            this.data('tabs')[tabName] = undefined;
            this.data('nav')[tabName] = undefined;
        },
        shouldShowTab() {
            return 1;
        },
        deletePrompt(tabName) {
            this.removeTab(tabName);
        },
        deleteTabCallback(tabName) {
            return $.proxy(function (e, $prompt) {
                if ($prompt !== undefined) {
                    $prompt.closePrompt();
                }

                if (this.shouldDeleteTab(tabName)) {
                    this.removeTab(tabName);
                }
            }, this);
        },
        shouldDeleteTab() {
            return 1;
        },
        activeTab() {
            const activeNav = this.data('tabs-nav').find('.active:last a')[0];
            return $(activeNav).attr('data-tab');
        }
    });
});
