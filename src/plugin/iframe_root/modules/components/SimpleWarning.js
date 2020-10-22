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

    class SimpleWarning extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return html`
                <div className="alert alert-warning">
                <strong>${this.props.title || 'Warning'}</strong>${' '}
                ${this.props.message}
                </table>
            `;
        }
    }
    return SimpleWarning;
});
