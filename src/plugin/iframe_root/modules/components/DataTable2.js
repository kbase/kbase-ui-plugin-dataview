define([
    'preact',
    'htm',
    '../ResizeObserver',

    'css!./DataTable2.css'
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

    class DataTable extends Component {
        constructor(props) {
            super(props);
            this.bodyHeaderRef = preact.createRef();
            this.bodyColumnsRef = preact.createRef();
            this.observer = new ResizeObserver(this.bodyObserver.bind(this));
        }

        componentDidMount() {
            window.setTimeout(() => {
                this.setState({
                    trigger: true
                });
            }, 0);
            // window.addEventListener('resize', this.handleWindowResize.bind(this));
            if (this.bodyHeaderRef.current) {
                this.observer.observe(this.bodyHeaderRef.current);
                this.observer.observe(this.bodyColumnsRef.current);
                // , {
                //     attributes: true
                // }
            }
        }

        componentWillUnmount() {
            // window.removeEventListener('resize', this.handleWindowResize.bind(this));
            if (this.scrollTimer) {
                window.clearTimeout(this.scrollTimer);
            }
            if (this.observer) {
                this.observer.unobserve(this.bodyHeaderRef.current);
                this.observer.unobserve(this.bodyColumnsRef.current);
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

        // handleWindowResize() {
        //     return;
        //     if (this.resizeTimer) {
        //         return;
        //     }

        //     this.resizeTimer = window.setTimeout(() => {
        //         this.setState({
        //             triggerRefresh: new Date().getTime()
        //         });
        //         this.resizeTimer = null;
        //     }, 100);
        // }

        renderHeaderHeader() {
            return this.props.columns.slice(0, this.props.columnHeader).map(({label, style}) => {
                return html`
                        <div className="DataTable2-header-col" style=${style || {}}>${label}</div>
                    `;
            });
        }

        renderHeaderColumns() {
            return this.props.columns.slice(this.props.columnHeader).map(({label, style}) => {
                return html`
                        <div className="DataTable2-header-col" style=${style || {}}>${label}</div>
                    `;
            });
        }

        renderHeader() {
            return html`
                <div className="DataTable2-header">
                    <div className="DataTable2-headerHeader">
                        ${this.renderHeaderHeader()}
                    </div>
                    <div className="DataTable2-headerColumns">
                        ${this.renderHeaderColumns()}
                    </div>
                </div>
            `;
        }

        doMeasurements() {
            this.tableHeight = this.props.dataSource.length * this.props.heights.row;

            const body = this.bodyHeaderRef.current;
            if (!body) {
                return;
            }

            const {height} = outerDimensions(body);
            this.firstRow = Math.floor(body.scrollTop / this.props.heights.row);
            this.lastRow = this.firstRow + Math.ceil(height / this.props.heights.row);
        }

        renderRows({from, to}) {
            if (typeof this.firstRow === 'undefined') {
                return;
            }
            const table = this.props.dataSource.slice(this.firstRow, this.lastRow + 1);
            return table.map((values, index) => {
                const top = (this.firstRow + index) * this.props.heights.row;
                const style = {
                    top,
                    right: '0',
                    left: '0',
                    height: `${this.props.heights.row}px`
                };

                return (() => {
                    const columns = (() => {
                        if (to === null) {
                            return this.props.columns.slice(from);
                        }
                        return this.props.columns.slice(from, to);
                    })();
                    return (() => {
                        const row = columns.map((col) => {
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
                                    <div className="DataTable2-col"
                                         style=${style}
                                         data-k-b-testhook-cell=${col.id}
                                         role="cell">
                                        <div className="DataTable2-col-content">
                                            ${content}
                                        </div>
                                    </div>
                                `;
                        });
                        const rowClasses = ['DataTable2-grid-row'];
                        if (values.isHighlighted) {
                            rowClasses.push('DataTable2-row-highlighted');
                        }
                        return html`
                                <div className=${rowClasses.join(' ')}
                                     style=${style}
                                     role="row" 
                                     onDblClick=${() => {
                            this.onRowClick(values);
                        }}>${row}
                                </div>
                            `;
                    })();
                })();
            });
        }

        onRowClick(values) {
            if (!this.props.onClick) {
                return;
            }
            this.props.onClick(values);
        }

        handleBodyHeaderScroll() {
            if (this.bodyHeaderScrollTimer) {
                return;
            }

            this.scrollTimer = window.setTimeout(() => {
                this.setState({
                    triggerRefresh: new Date().getTime()
                });
                this.bodyHeaderScrollTimer = null;
            }, 100);
        }

        handleBodyColumnsScroll() {
            if (this.bodyColumnsTimer) {
                return;
            }

            this.scrollTimer = window.setTimeout(() => {
                this.setState({
                    triggerRefresh: new Date().getTime()
                });
                this.bodyColumnsTimer = null;
            }, 100);
        }

        renderBodyHeader() {
            const rows = this.renderRows({from: 0, to: this.props.columnHeader});
            const tableHeight = this.props.dataSource.length * this.props.heights.row;
            const style = {
                height: `${tableHeight}px`
            };
            return html`
                <div className="DataTable2-bodyHeader"
                     ref=${this.bodyHeaderRef}
                     onScroll=${this.handleBodyHeaderScroll.bind(this)}>
                    <div className="DataTable2-grid"
                         style=${style}>
                        ${rows}
                    </div>
                </div>
            `;
        }

        renderBodyColumns() {
            const rows = this.renderRows({from: this.props.columnHeader, to: null});
            const tableHeight = this.props.dataSource.length * this.props.heights.row;
            const style = {
                height: `${tableHeight}px`
            };
            return html`
                <div className="DataTable2-bodyColumns"
                     ref=${this.bodyColumnsRef}
                     onScroll=${this.handleBodyColumnsScroll.bind(this)}>
                    <div className="DataTable2-grid"
                         style=${style}>
                        ${rows}
                    </div>
                </div>
            `;
        }

        renderBody() {
            return html`
                <div className="DataTable2-body">
                    ${this.renderBodyHeader()}
                    ${this.renderBodyColumns()}
                </div>
            `;
        }

        render() {
            this.doMeasurements();
            return html`
                <div className="DataTable2">
                    ${this.renderHeader()}
                    ${this.renderBody()}
                </div>
            `;
        }
    }

    return DataTable;
});