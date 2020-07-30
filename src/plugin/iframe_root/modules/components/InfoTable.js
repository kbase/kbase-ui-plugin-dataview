define([
    'preact',
    'htm',

    'css!./InfoTable.css'
], function (
    preact,
    htm
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    class InfoTable extends Component {
        render() {
            const cols = this.props.data.map(({label, value}) => {
                return html`
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol">${label}</div>
                    <div className="InfoTable-valueCol">${value}</div>
                </div>
                `;
            });
            return html`
                    <div className="InfoTable">
                        ${rows}
                    </div>
                `;
        }
    }

    return InfoTable
});