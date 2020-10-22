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

    class SimpleInfo extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return html`
                <div className="alert alert-info">
                <strong>${this.props.title || 'Info'}</strong>${' '}
                ${this.props.message}
                </table>
            `;
        }
    }
    return SimpleInfo;
});
