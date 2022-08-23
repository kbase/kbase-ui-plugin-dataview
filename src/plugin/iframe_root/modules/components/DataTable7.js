
/*
DataTable7
#7 until there is a better name.
This data table is dedicated to a simply infinitely scrolling table.
Columns are defined via a configuration prop "columns".
Data is currently just an array of objects.

Future:
- port over the infinite scrolling
- at the same time defining a good DataSource interface object
*/
define([
    'preact',
    'htm',
    '../ResizeObserver',

    'css!./DataTable7.css'
], (
    preact,
    htm,
    ResizeObserver
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    function outerDimensions(el) {
        el.offsetHeight;
        const rect = el.getBoundingClientRect();
        const width = Math.ceil(rect.right - rect.left);
        const height = Math.ceil(rect.bottom - rect.top);
        return {
            width, height
        };
    }


    class DataTable7 extends Component {
        constructor(props) {
            super(props);
            this.bodyRef = preact.createRef();
            this.observer = new ResizeObserver(this.bodyObserver.bind(this));
        }

        componentDidMount() {
            window.setTimeout(() => {
                this.setState({
                    trigger: true
                });
            }, 0);
            if (this.bodyRef.current) {
                this.observer.observe(this.bodyRef.current);
            }
        }

        componentWillUnmount() {
            if (this.scrollTimer) {
                window.clearTimeout(this.scrollTimer);
            }
            if (this.observer) {
                this.observer.unobserve(this.bodyRef.current);
            }
        }

        bodyObserver() {
            if (this.resizeTimer) {
                return;
            }

            this.resizeTimer = window.setTimeout(() => {
                this.setState({
                    triggerRefresh: new Date().getTime()
                });
                this.resizeTimer = null;
            }, 100);
        }
        renderHeader() {
            const style = {
                height: `${this.props.heights.header}px`
            };
            if (this.props.columns) {
                return (() => {
                    const header = this.props.columns.map(({label, style}) => {
                        return html`
                            <div className="DataTable7-header-col" style=${style || {}}>${label}</div>
                        `;
                    });
                    return html`
                        <div className="DataTable7-header">${header}</div>
                    `;
                })();
            }
            return (() => {
                const header = this.props.render.header();
                return html`
                    <div className="DataTable7-header" style=${style}>${header}</div>
                `;
            })();
        }

        doMeasurements() {
            const rowHeight = this.rowHeight();

            this.tableHeight = this.props.dataSource.length * rowHeight;

            const body = this.bodyRef.current;
            if (!body) {
                return;
            }

            const {height} = outerDimensions(body);
            this.firstRow = Math.floor(body.scrollTop / rowHeight);
            this.lastRow = this.firstRow + Math.ceil(height / rowHeight);
        }

        rowHeight() {
            return this.props.heights.row; // + this.currentView().height;
        }

        renderRowWrapper(values, index) {
            // Compute the style for the row wrapper, which is positioned within the overall
            // grid according to the.
            const rowHeight = this.rowHeight();
            const top = (this.firstRow + index) * rowHeight;
            const style = {
                top,
                right: '0',
                left: '0',
                height: `${rowHeight}px`
            };

            // Render actual table row
            const rowColumns = this.renderRow(values);
            const row = html`
                <div className="DataTable7-row">
                    ${rowColumns}
                </div>
            `;

            // Render row detail, if any.
            // const detail = this.renderDetail(values);


            // Render row wrapper.
            const rowClasses = ['DataTable7-grid-row'];
            if (values.isHighlighted) {
                rowClasses.push('DataTable7-row-highlighted');
            }

            return html`
                <div style=${style} 
                className=${rowClasses.join(' ')}
                onDblClick=${() => {
        this.onRowClick(values);
    }}
                     role="row">
                    ${row}
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
                    <div className="DataTable7-col"
                            style=${style}
                            data-k-b-testhook-cell=${col.id}
                            role="cell">
                        <div className="DataTable7-col-content">
                            ${content}
                        </div>
                    </div>
                `;
            });
        }

        // currentView() {
        //     return this.props.views[this.props.view];
        // }

        // renderDetail(row) {
        //     const view = this.currentView();
        //     if (view && view.render) {
        //         return view.render(row);
        //     }
        // }

        renderRows() {
            if (typeof this.firstRow === 'undefined') {
                return;
            }

            const table = this.props.dataSource.slice(this.firstRow, this.lastRow + 1);
            return table.map((values, index) => {
                return this.renderRowWrapper(values, index);
            });
        }

        onRowClick(values) {
            if (!this.props.onClick) {
                return;
            }
            this.props.onClick(values);
        }

        handleBodyScroll() {
            if (this.scrollTimer) {
                return;
            }

            this.scrollTimer = window.setTimeout(() => {
                this.setState({
                    triggerRefresh: new Date().getTime()
                });
                this.scrollTimer = null;
            }, 100);
        }

        renderBody() {
            const rows = this.renderRows();
            const tableHeight = this.props.dataSource.length * this.rowHeight();
            const style = {
                height: `${tableHeight}px`
            };
            return html`
                <div className="DataTable7-body"
                     ref=${this.bodyRef}
                     onScroll=${this.handleBodyScroll.bind(this)}>
                    <div className="DataTable7-grid"
                         style=${style}>
                        ${rows}
                    </div>
                </div>
            `;
        }

        render() {
            this.doMeasurements();
            const classes = [
                "DataTable7"
            ];
            if (this.props.bordered !== false) {
                classes.push('-bordered');
            }
            return html`
                <div className=${classes.join(' ')} role="table">
                    ${this.renderHeader()}
                    ${this.renderBody()}
                </div>
            `;
        }
    }

    return DataTable7;
});