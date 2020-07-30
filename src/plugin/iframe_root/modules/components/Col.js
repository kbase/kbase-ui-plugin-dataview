define([
    'preact',
    'htm',

    'css!./Col'
], function (
    preact,
    htm
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Col extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return html`
                <div className="Col">
                    ${this.props.children}
                </div>
            `;
        }
    }
    return Col;
});
