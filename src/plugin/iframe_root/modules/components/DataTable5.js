define([
    'preact',
    'htm',
    '../ResizeObserver',

    'css!./DataTable5.css'
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
            this.bodyRef = preact.createRef();
            this.observer = new ResizeObserver(this.bodyObserver.bind(this));
            this.state = {
                searchText: ''
            };
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
            // if (!this.props.header) {
            //     return;
            // }
            const style = {
                height: `${this.props.heights.header}px`
            };
            if (this.props.columns) {
                return (() => {
                    const header = this.props.columns.map(({label, style}) => {
                        return html`
                            <div className="DataTable5-header-col" style=${style || {}}>${label}</div>
                        `;
                    });
                    return html`
                        <div className="DataTable5-header">${header}</div>
                    `;
                })();
            }
            return (() => {
                const header = this.props.render.header();
                return html`
                    <div className="DataTable5-header" style=${style}>${header}</div>
                `;
            })();
        }

        doMeasurements() {
            this.tableHeight = this.props.dataSource.length * this.props.heights.row;

            const body = this.bodyRef.current;
            if (!body) {
                return;
            }

            const {height} = outerDimensions(body);
            this.firstRow = Math.floor(body.scrollTop / this.props.heights.row);
            this.lastRow = this.firstRow + Math.ceil(height / this.props.heights.row);
        }

        renderRows() {
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
                                    <div className="DataTable5-col"
                                         style=${style}
                                         data-k-b-testhook-cell=${col.id}
                                         role="cell">
                                        <div className="DataTable5-col-content">
                                            ${content}
                                        </div>
                                    </div>
                                `;
                            });
                            const rowClasses = ['DataTable5-grid-row'];
                            if (values.isHighlighted) {
                                rowClasses.push('DataTable5-row-highlighted');
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
                    }
                    // freeform row
                    return (() => {
                        const row = this.props.render.row(values);
                        const rowClasses = ['DataTable5-grid-row'];
                        if (values.isHighlighted) {
                            rowClasses.push('DataTable5-row-highlighted');
                        }
                        return html`
                            <div className=${rowClasses.join(' ')}
                                 style=${style}
                                 role="row"
                                 onClick=${() => {
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
            const tableHeight = this.props.dataSource.length * this.props.heights.row;
            const style = {
                height: `${tableHeight}px`
            };
            return html`
                <div className="DataTable5-body"
                     ref=${this.bodyRef}
                     onScroll=${this.handleBodyScroll.bind(this)}>
                    <div className="DataTable5-grid"
                         style=${style}>
                        ${rows}
                    </div>
                </div>
            `;
        }

        // Render header above table.
        onSearchInput(ev) {
            const searchText = ev.target.value;

            this.applySearch(searchText);

            this.setState({
                table: this.state.table.slice(),
                searchText
            });
        }

        applySearch(searchText) {
            if (searchText === '') {
                this.state.table
                    .map(({rowIndex}) => this.tableMap[rowIndex])
                    .forEach((row) => {
                        row.show = true;
                    });
            }
            const searchRE = new RegExp(searchText, 'i');
            this.state.table
                .map(({rowIndex}) => this.tableMap[rowIndex])
                .forEach((row) => {
                    const show = (() => {
                        for (const column of this.props.columns) {
                            if (column.searchable) {
                                const value = row.values[column.id];
                                if (searchRE.test(value)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    })();
                    row.show = show;
                });
        }

        onClearSearch() {
            this.applySearch('');
            this.setState({
                table: this.state.table.slice(),
                searchText: ''
            });
        }

        renderSearch() {
            const clearSearchDisabled = this.state.searchText === '';
            return html`
                <div className="form-inline">
                    <div className="input-group">
                        <input 
                            type="search" 
                            className="form-control" 
                            style=${{width: '20em'}} 
                            placeholder="Search" 
                            value=${this.state.searchText}
                            onInput=${this.onSearchInput.bind(this)}
                            />
                        <span className="input-group-addon"><span class="fa fa-search" /></span>
                    </div>
                    <button 
                        type="button" 
                        title="Clear the search input and show all rows"
                        class="btn btn-default" 
                        style=${{marginLeft: '1em'}}
                        disabled=${clearSearchDisabled}
                        onClick=${this.onClearSearch.bind(this)}>
                        <span className="fa fa-times" />
                    </button>
                </div>
            `;
        }

        searchEnabled() {
            return (this.props.columns.some(({isSearchable}) => isSearchable));
        }

        renderToolbar() {
            if (!this.searchEnabled()) {
                return html`
                <div className="DataTable4-toolbar">
                search not enabled
                </div>
            `;
            }
            return html`
                <div className="DataTable4-toolbar">
                ${this.renderSearch()}
                </div>
            `;
        }

        render() {
            this.doMeasurements();
            return html`
                <div className="DataTable5">
                    ${this.renderToolbar()}
                    ${this.renderHeader()}
                    ${this.renderBody()}
                </div>
            `;
        }
    }

    return DataTable;
});