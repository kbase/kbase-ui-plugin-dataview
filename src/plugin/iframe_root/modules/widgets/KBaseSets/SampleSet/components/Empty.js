define([
    'preact',
    'htm',

    'css!./Empty'
], function (
    preact,
    htm
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Empty extends Component {
        render() {
            return html`
                <div className="Empty">
                    Sorry, no samples in this set!
                </div>
            `;
        }
    }
    return Empty;
});
