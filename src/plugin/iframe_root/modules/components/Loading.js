define([
    'preact',
    'htm'
], function (
    preact,
    htm
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Loading extends Component {
        render() {
            return html`
                <div>
                    <span className="fa fa-spinner fa-pulse fa-2x fa-fw"
                          style=${{color: 'gray'}}></span>
                </div>
            `;
        }
    }

    return Loading;
});