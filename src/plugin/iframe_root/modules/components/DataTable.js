define([
    'preact',
    'htm',

    'css!./DataTable.css'
], function (
    preact,
    htm
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    class DataTable extends Component {
        renderHeader() {
            const header = this.props.columns.map(({label, style}) => {
                return html`    
                    <div className="DataTable-header-col" style=${style || {}}>${label}</div>
                `;
            });
            return html`
            <div className="DataTable-header">${header}</div>
            `;
        }

        renderBody() {
            const rows = this.props.dataSource.map((values) => {
                const row = this.props.columns.map((col) => {
                    // TODO: format value
                    const content = (() => {
                        if (col.render) {
                            try {
                                return col.render(values[col.id], values);
                            } catch (ex) {
                                return html`
                                <span className="text-danger">${ex.message}</span>
                                `;
                            }
                        } else {
                            return values[col.id];
                        }
                    })();
                    const style = col.style || {};
                    return html`
                        <div className="DataTable-col" style=${style}>${content}</div>
                    `;
                });
                const rowClasses = ['DataTable-row'];
                if (values.isHighlighted) {
                    rowClasses.push('DataTable-row-highlighted');
                }


                return html`
                 <div className=${rowClasses.join(' ')}>${row}</div>
                 `;
            });
            return html`
            <div className="DataTable-body">${rows}</div>
            `;
        }

        render() {
            return html`
            <div className="DataTable">
                ${this.renderHeader()}
                ${this.renderBody()}
            </div>
            `;
        }
    }

    return DataTable;
});