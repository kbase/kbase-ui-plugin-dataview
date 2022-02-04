define([
    'preact',
    'htm',

    'css!./DataTable4.css'
], (
    preact,
    htm
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    // function outerDimensions(el) {
    //     el.offsetHeight;
    //     const rect = el.getBoundingClientRect();
    //     const width = Math.ceil(rect.right - rect.left);
    //     const height = Math.ceil(rect.bottom - rect.top);
    //     return {
    //         width, height
    //     };
    // }

    /*
    Dev Notes:

    Over DataTable, adds a detail area below each row.
    Therefore we support heights and renderer for detail area
    The detail area is optional

    First iteration, let's just support showing the entire enchilada, detail and all.

    Next, let's support multiple details, and prop to select the detail to show.

    Then we can support the ability to open/close details per row.

    Props:
    heights:
        header
        row
        detail
    showDetail
    columns:
        ..
    render:
        header
        row
        detail
    dataSource:
        ..
    onClick
    */

    class DataTable4 extends Component {
        constructor(props) {
            super(props);
            this.state = {
                table: this.props.dataSource.map((values) => {
                    return {
                        showDetail: false,
                        values
                    };
                })
            };
        }
        renderHeader() {
            if (this.props.columns) {
                return (() => {
                    const header = this.props.columns.map(({label, style}) => {
                        return html`
                            <div className="DataTable4-header-col" style=${style || {}}>${label}</div>
                        `;
                    });
                    return html`
                        <div className="DataTable4-header">${header}</div>
                    `;
                })();
            }
            return (() => {
                const header = this.props.render.header();
                return html`
                    <div className="DataTable4-header">${header}</div>
                `;
            })();
        }

        renderRowWrapper(values, showDetail, index) {
            // Compute the style for the row wrapper, which is positioned within the overall
            // grid according to the.
            // Render actual table row
            const rowColumns = this.renderRow(values);
            const row = html`
                <div className="DataTable4-row" key=${index}>${rowColumns}</div>
            `;

            // Render row wrapper.
            const rowClasses = ['DataTable4-grid-row'];
            if (values.isHighlighted) {
                rowClasses.push('DataTable4-row-highlighted');
            }

            return html`
                <div 
                    className=${rowClasses.join(' ')}
                    onDblClick=${(ev) => {this.onRowDblClick(index, ev.getModifierState('Shift'));}}
                    
                     role="row">
                    ${row}
                    <div className="DataTable4-detail">
                    ${showDetail && this.props.renderDetail(values)}
                    </div>
                </div>
            `;
        }

        renderRow(values) {
            return this.props.columns.map((col) => {
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
                    <div className="DataTable4-col"
                            style=${style}
                            data-k-b-testhook-cell=${col.id}
                            role="cell">
                        <div className="DataTable4-col-content">
                            ${content}
                        </div>
                    </div>
                `;
            });
        }

        renderRows() {
            return this.state.table.map(({values, showDetail}, index) => {
                return this.renderRowWrapper(values, showDetail, index);
            });
        }

        onRowDblClick(clickedIndex, shiftPressed) {
            const table = (() => {
                if (shiftPressed) {
                    return this.state.table.map((row) => {
                        return {
                            ...row,
                            showDetail: !this.state.table[clickedIndex].showDetail
                        };
                    });
                }
                return this.state.table.map((row, index) => {
                    if (clickedIndex !== index) {
                        return row;
                    }
                    row.showDetail = !row.showDetail;
                    return row;
                });
            })();
            this.setState({
                ...this.state,
                table
            });
        }

        renderBody() {
            return html`
                <div className="DataTable4-body">
                    <div className="DataTable4-grid">
                        ${this.renderRows()}
                    </div>
                </div>
            `;
        }

        render() {
            return html`
                <div className="DataTable4">
                    ${this.renderHeader()}
                    ${this.renderBody()}
                </div>
            `;
        }
    }

    return DataTable4;
});
