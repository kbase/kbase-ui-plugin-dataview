/**
 * Requires bootstrap 3 for buttonsx
 */
define(['jquery', 'kbaseUI/widget/legacy/widget', 'bootstrap'], ($) => {
    $.KBWidget({
        name: 'KBaseContigBrowserButtons',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            direction: 'horizontal', // also "vertical" eventually.
            browser: null
        },
        init(options) {
            this._super(options);

            if (this.options.browser === null) {
                return;
            }

            const self = this;
            const $buttonSet = $('<div/>')
                .addClass('btn-group')
                // xss safe
                .append(
                    $('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .css('font-size', '125%')
                        .css('font-weight', 'bold')
                        // xss safe
                        .text('|<<')
                        .click(() => {
                            self.options.browser.moveLeftEnd();
                        })
                )
                // xss safe
                .append(
                    $('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .css('font-size', '125%')
                        .css('font-weight', 'bold')
                        .text('<')
                        .click(() => {
                            self.options.browser.moveLeftStep();
                        })
                )
                // xss safe
                .append(
                    $('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .css('font-size', '125%')
                        .css('font-weight', 'bold')
                        .text('+')
                        .click(() => {
                            self.options.browser.zoomIn();
                        })
                )
                // xss safe
                .append(
                    $('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .css('font-size', '125%')
                        .css('font-weight', 'bold')
                        .text('-')
                        .click(() => {
                            self.options.browser.zoomOut();
                        })
                )
                // xss safe
                .append(
                    $('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .css('font-size', '125%')
                        .css('font-weight', 'bold')
                        .text('>')
                        .click(() => {
                            self.options.browser.moveRightStep();
                        })
                )
                // xss safe
                .append(
                    $('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .css('font-size', '125%')
                        .css('font-weight', 'bold')
                        .text('>>|')
                        .click(() => {
                            self.options.browser.moveRightEnd();
                        })
                );

            // xss safe
            this.$elem.append($('<div align=\'center\'/>').append($buttonSet));

            return this;
        },
        render() {
            return this;
        }
    });
});
