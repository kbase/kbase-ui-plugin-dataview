/**
 * Requires bootstrap 3 for buttons
 */
define(
    [
        'bootstrap',
        'jquery'
    ], (
        bootstrap,
        $
    ) => {

        class ContigBrowserButton {
            constructor({direction, browser} = {direction: 'horizontal'}) {
                this.direction = direction;

                if (!browser) {
                    throw new Error('The browser is required');
                }

                this.browser = browser;
            }

            $render() {
                return $('<div/>')
                    .addClass('btn-group')
                    .append($('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .text('First')
                        .click(() => { this.browser.moveLeftEnd(); })
                    )
                    .append($('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .text('Previous')
                        .click(() => { this.browser.moveLeftStep(); })
                    )
                    .append($('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .text('Zoom In')
                        .click(() => { this.browser.zoomIn(); })
                    )
                    .append($('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .text('Zoom Out')
                        .click(() => { this.browser.zoomOut(); })
                    )
                    .append($('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .text('Next')
                        .click(() => { this.browser.moveRightStep(); })
                    )
                    .append($('<button/>')
                        .attr('type', 'button')
                        .addClass('btn btn-default')
                        .text('Last')
                        .click(() => {this.browser.moveRightEnd(); })
                    );
            }
        }

        return ContigBrowserButton;
    });