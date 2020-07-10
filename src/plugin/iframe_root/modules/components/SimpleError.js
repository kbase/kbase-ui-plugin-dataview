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
    class SimpleError extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return html`
                <div className="alert alert-danger">
                <strong>Error!</strong>${' '}
                ${this.props.message}
                </table>
            `;
        }
    }
    return SimpleError;
});
