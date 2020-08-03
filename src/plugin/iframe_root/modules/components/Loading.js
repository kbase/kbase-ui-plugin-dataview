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
            let message;
            if (this.props.message) {
                message = html`<span>${this.props.message}</span>`;
            }
            return html`
                <div>
                    ${message}
                    <span className="fa fa-spinner fa-pulse fa-2x fa-fw"
                          style=${{color: 'gray'}}></>
                </div>
            `;
        }
    }

    return Loading;
});