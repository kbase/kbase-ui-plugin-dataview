define([
    'preact',
    'htm',
    '../ResizeObserver',

    'css!./DataTable3.css'
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

    class DataTable3 extends Component {
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
                            <div className="DataTable3-header-col" style=${style || {}}>${label}</div>
                        `;
                    });
                    return html`
                        <div className="DataTable3-header">${header}</div>
                    `;
                })();
            }
            return (() => {
                const header = this.props.render.header();
                return html`
                    <div className="DataTable3-header" style=${style}>${header}</div>
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
            return this.props.heights.row + this.currentView().height;

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
                <div className="DataTable3-row"
                        >${rowColumns}
                </div>
            `;

            // Render row detail, if any.
            const detail = this.renderDetail(values);


            // Render row wrapper.
            const rowClasses = ['DataTable3-grid-row'];
            if (values.isHighlighted) {
                rowClasses.push('DataTable3-row-highlighted');
            }

            return html`
                <div style=${style} 
                className=${rowClasses.join(' ')}
                onDblClick=${() => {
        this.onRowClick(values);
    }}
                     role="row">
                    ${row}
                    ${detail}
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
                    <div className="DataTable3-col"
                            style=${style}
                            data-k-b-testhook-cell=${col.id}
                            role="cell">
                        <div className="DataTable3-col-content">
                            ${content}
                        </div>
                    </div>
                `;
            });
        }

        currentView() {
            return this.props.views[this.props.view];
        }

        renderDetail(row) {
            const view = this.currentView();
            if (view && view.render) {
                return view.render(row);
            }
        }

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
                <div className="DataTable3-body"
                     ref=${this.bodyRef}
                     onScroll=${this.handleBodyScroll.bind(this)}>
                    <div className="DataTable3-grid"
                         style=${style}>
                        ${rows}
                    </div>
                </div>
            `;
        }

        render() {
            this.doMeasurements();
            return html`
                <div className="DataTable3">
                    ${this.renderHeader()}
                    ${this.renderBody()}
                </div>
            `;
        }
    }

    return DataTable3;
});