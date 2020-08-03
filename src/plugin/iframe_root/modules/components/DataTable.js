define([
    'preact',
    'htm',
    '../ResizeObserver',

    'css!./DataTable.css'
], function (
    preact,
    htm,
    ResizeObserver
) {
    'use strict';

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
            this.bodyRef = preact.createRef();
            this.observer = new ResizeObserver(this.bodyObserver.bind(this));

        }
        componentDidMount() {
            window.setTimeout(() => {
                this.setState({
                    trigger: true
                });
            }, 0);
            // window.addEventListener('resize', this.handleWindowResize.bind(this));
            if (this.bodyRef.current) {
                this.observer.observe(this.bodyRef.current);
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
        renderHeader() {
            const style = {
                height: `${this.props.rowHeight}px`
            };
            if (this.props.columns) {
                return (() => {
                    const header = this.props.columns.map(({label, style}) => {
                        return html`    
                            <div className="DataTable-header-col" style=${style || {}}>${label}</div>
                        `;
                    });
                    return html`
                    <div className="DataTable-header">${header}</div>
                    `;
                })();
            } else {
                return (() => {
                    const header = this.props.render.header();
                    return html`
                    <div className="DataTable-header" style=${style}>${header}</div>
                    `;
                })();
            }
        }

        doMeasurements() {
            this.tableHeight = this.props.dataSource.length * this.props.rowHeight;

            const body = this.bodyRef.current;
            if (!body) {
                return;
            }

            const {height} = outerDimensions(body);
            this.firstRow = Math.floor(body.scrollTop / this.props.rowHeight);
            this.lastRow = this.firstRow + Math.ceil(height / this.props.rowHeight);
        }

        renderRows() {
            if (typeof this.firstRow === 'undefined') {
                return;
            }
            const table = this.props.dataSource.slice(this.firstRow, this.lastRow + 1);
            return table.map((values, index) => {
                const top = (this.firstRow + index) * this.props.rowHeight;
                const style = {
                    top,
                    right: '0',
                    left: '0',
                    height: `${this.props.rowHeight}px`
                };

                return (() => {
                    if (this.props.columns) {
                        return (() => {
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
                                    <div className="DataTable-col" style=${style}>
                                        <div className="DataTable-col-content">
                                            ${content}
                                        </div>
                                    </div>
                                `;
                            });
                            const rowClasses = ['DataTable-grid-row'];
                            if (values.isHighlighted) {
                                rowClasses.push('DataTable-row-highlighted');
                            }
                            return html`
                                <div className=${rowClasses.join(' ')} style=${style}>${row}</div>
                            `;
                        })();
                    } else {
                        return (() => {
                            const row = this.props.render.row(values);
                            const rowClasses = ['DataTable-grid-row'];
                            if (values.isHighlighted) {
                                rowClasses.push('DataTable-row-highlighted');
                            }
                            return html`
                                <div className=${rowClasses.join(' ')} style=${style}>${row}</div>
                            `;
                        })();
                    }
                })();
            });
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
            const tableHeight = this.props.dataSource.length * this.props.rowHeight;
            const style = {
                height: `${tableHeight}px`
            };
            return html`
                <div className="DataTable-body" 
                     ref=${this.bodyRef} 
                     onScroll=${this.handleBodyScroll.bind(this)}>
                    <div className="DataTable-grid"
                         style=${style}>
                        ${rows}
                    </div>
                </div>
            `;
        }

        render() {
            this.doMeasurements();
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