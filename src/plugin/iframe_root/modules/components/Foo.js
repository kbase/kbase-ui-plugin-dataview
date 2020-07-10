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

    class LinkedSamplesView extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return html`
                <div className="alert alert-info">
                <strong>Linked Samples...!</strong>${' '}
                
                </table>
            `;
        }
    }
    return LinkedSamplesView;
});
