define([
    'preact',
    'htm',

    'css!./Table.css',
    'bootstrap'
], function (
    preact,
    htm
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    function niceNumber(value) {
        return Intl.NumberFormat('en-US', {useGrouping: true}).format(value);
    }

    class Table extends Component {
        constructor(props) {
            super(props);

            this.searchRef = preact.createRef();

            const pageSize = this.props.pageSize || 10;

            let pageCount;
            if (this.props.table) {
                pageCount = Math.ceil(this.props.table.length / pageSize);
            } else {
                pageCount = null;
            }

            this.state = {
                status: 'none',
                query: null,
                pageSize,
                table: this.props.table || [],
                totalCount: this.props.totalCount || null,
                currentPage: 1,
                pageCount,
                sortColumn: this.props.sortColumn,
                sortDirection: this.props.sortDirection
            };
        }

        setPageCount() {

        }

        componentDidMount() {
            this.fetch();
        }

        renderTotalCount(){
            switch (this.state.status) {
                case 'none':
                    return '';
                case 'fetching':
                    return 'Fetching data...'
                case 'ok':
                    if (!this.state.totalCount) {
                        return 'None available';
                    }
                    if (this.state.query) {
                        return html`
                            ${niceNumber(this.state.totalCount)} found for <em>${this.state.query}</em>
                        `;
                        
                    } else {
                        return html`
                            ${niceNumber(this.state.totalCount)} total
                        `;
                    }
                case 'error':
                    return 'error';
            }
        }

        submitSearch(e) {
            e.preventDefault();
            if (this.searchRef.current === null) {
                return;
            }
            this.setState({
                currentPage: 1,
                search: this.searchRef.current.value,
                query: this.searchRef.current.value,
            }, this.fetch.bind(this));
        }

        renderFilterControls() {
            return html`
                <form className="form-inline" onSubmit=${this.submitSearch.bind(this)}>
                    <input className="form-control" style=${{width: '12em'}} ref=${this.searchRef}></input>
                    <button className="btn btn-default">
                        <span className="fa fa-search"></span>
                    </button>
                </form>
            `;
        }

        renderHeader() {
            const rowStyle = {
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '10px'
            };
            const colStyle = {
                flex: '1 1 0px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            };
            // <div style=${{...colStyle, justifyContent: 'center'}}>${this.renderStatus()}</div>
            return html`
                <div style=${rowStyle}>
                    <div style=${colStyle}>
                        ${this.renderFilterControls()}
                        <span style=${{marginLeft: '10px'}}>
                            ${this.renderTotalCount()}
                        </span>
                    </div>
                    
                    <div style=${{...colStyle, justifyContent: 'flex-end'}}>
                        ${this.renderPageControls()}
                        <span style=${{marginLeft: '10px', width: '12em'}}>
                        ${this.renderPageCounts()}
                        </span>
                    </div>
                </div>
            `;
        }

        renderTableOverlay() {
            const style = {
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            };
            switch (this.state.status) {
            case 'none':
            case 'fetching':
                style.display = 'flex';
                style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
                break;
            default:
                style.display = 'none';
            }

            const spinnerStyle = {
                fontSize: '150%',
                color: 'rgba(200, 200, 200, 1)', 
                backgroundColor: 'white',
                borderRadius: '10px',
                border: '1px solid rgba(150, 150, 150, 1)',
                padding: '10px', 
                display: 'flex', 
                flexDirection: 'row', 
                justifyContent: 'center', 
                alignItems: 'center'
            };

            return html`
                <div style=${style}>
                    <div style=${{padding: '20px'}}>
                        <div style=${spinnerStyle}><span>Fetching data...</span><span className="fa fa-spinner fa-pulse fa-fw fa-3x"></span></div>
                    </div>
                </div>
            `;
        }

        renderTableEmpty() {
            if (this.state.table && this.state.table.length > 0) {
                return;
            }
            return html`
                <div className="alert alert-info" style=${{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                   <span className="fa fa-ban fa-2x"></span>${' '}<span style=${{marginLeft: '1em'}}>No data</span>
                </div>
            `;
        }

        renderBody() {
            return html`
                <div style=${{position: 'relative'}}>
                    ${this.renderTableOverlay()}
                    ${this.renderTable()}
                    ${this.renderTableEmpty()}
                </div>
            `;
        }

        fetch() {
            // query, sortColumnIndex, sortDirection, pageNum
            const query = this.state.query || null;
            const sortColumn = this.state.sortColumn;
            const sortDirection = this.state.sortDirection === 'ascending' ? 1 : 0;
            const offset = (this.state.currentPage - 1) * this.state.pageSize;
            const limit = this.state.pageSize;


            this.setState({
                status: 'fetching'
            });
            this.props.fetchData(query, sortColumn, sortDirection, offset, limit)
                .then((data) => {
                    this.setState({
                        status: 'ok',
                        table: data.rows,
                        totalCount: data.total,
                        pageCount:  Math.ceil(data.total / this.state.pageSize)
                    });
                })
                .catch((err) => {
                    console.error('Error fetching data for table', err);
                    this.setState({
                        status: 'error',
                        error: {
                            message: err.message || err.error.message
                        }
                    });
                });
        }

        gotoFirstPage() {
            this.setState({
                currentPage: 1
            }, this.fetch.bind(this));
        }

        gotoPrevPage() {
            if (this.state.currentPage === null || this.state.currentPage <= 1) {
                return;
            }
            this.setState({
                currentPage: this.state.currentPage - 1
            }, this.fetch.bind(this));
        }

        gotoNextPage() {
            if (this.state.currentPage >= this.state.pageCount) {
                return;
            }
            this.setState({
                currentPage: this.state.currentPage + 1
            }, this.fetch.bind(this));
        }

        gotoLastPage() {
            this.setState({
                currentPage: this.state.pageCount
            }, this.fetch.bind(this));
        }

        renderFirstButton() {
            if (this.state.currentPage === 1 || this.state.status === 'fetching') {
                return html`
                    <button className="btn btn-default" disabled>
                        <span className="fa fa-step-backward"></span>
                    </button>
                `;
            }
            return html`
                <button className="btn btn-default" onClick=${this.gotoFirstPage.bind(this)}>
                    <span className="fa fa-step-backward"></span>
                </button>
            `;
        }

        renderPrevButton() {
            if (this.state.currentPage === 1 || this.state.status === 'fetching') {
                return html`
                    <button className="btn btn-default" disabled>
                        <span className="fa fa-caret-left" style="font-size: 110%"></span>
                    </button>
                `;
            }
            return html`
                <button className="btn btn-default" onClick=${this.gotoPrevPage.bind(this)}>
                    <span className="fa fa-caret-left" style="font-size: 110%"></span>
                </button>
            `;
        }

        renderNextButton() {
            if (this.state.currentPage === this.state.pageCount || this.state.status === 'fetching') {
                return html`
                    <button className="btn btn-default" disabled>
                        <span className="fa fa-caret-right" style="font-size: 110%"></span>
                    </button>
                `;
            }
            return html`
                <button className="btn btn-default" onClick=${this.gotoNextPage.bind(this)}>
                    <span className="fa fa-caret-right" style="font-size: 110%"></span>
                </button>
            `;
        }

        renderLastButton() {
            if (this.state.currentPage === this.state.pageCount || this.state.status === 'fetching') {
                return html`
                    <button className="btn btn-default" disabled>
                        <span className="fa fa-step-forward"></span>
                    </button>
                `;
            }
            return html`
                <button className="btn btn-default" onClick=${this.gotoLastPage.bind(this)}>
                    <span className="fa fa-step-forward"></span>
                </button>
            `;
        }

        renderPageControls() {
            return html`
                <div className="btn-group">
                    ${this.renderFirstButton()}
                    ${this.renderPrevButton()}
                    ${this.renderNextButton()}
                    ${this.renderLastButton()}
                </div>
            `;
        }

        renderPageCounts() {
            const currentPage = (() => {
                const style = {};
                switch (this.state.status) {
                case 'none':
                case 'fetching':
                    style.backgroundColor = 'rgba(200, 200, 200, 0.5)';
                }
                return html`<span style=${style}>${niceNumber(this.state.currentPage)}</span>`;
            })();
            return html`
                Page ${currentPage} of ${niceNumber(this.state.pageCount)}
            `;
        }

        renderStatus() {
            switch (this.state.status) {
            case 'none':
                return;
            case 'fetching':
                return html`Fetching data ... <span className="fa fa-spinner fa-pulse fa-fw"></span>`;
            case 'ok':
                return;
            case 'error':
                return html`<span className="alert alert-danger">${this.state.error.message}</span>`;
            }
        }

        //     renderFooter() {
        //         const colStyle = {
        //             flex: '1 1 0px',
        //             display: 'flex',
        //             flexDirection: 'row',
        //             alignItems: 'center'
        //         };
        //         return html`
        //             <div style=${{
        //     display: 'flex',
        //     flexDirection: 'row'
        // }}>
        //                 <div style=${colStyle}>
        //                     ${this.renderPageControls()}
        //                     <span style=${{marginLeft: '10px'}}>
        //                     ${this.renderPageCounts()}
        //                     </span>
        //                 </div>
                        
        //                 <div style=${colStyle}>
        //                 </div>
        //             </div>
        //         `;
        //     }

        renderFooter() {
            return;
        }

        handleSortButtonClick(column) {
            let sortDirection = (() => {
                switch (this.state.sortDirection) {
                case 'ascending':
                    return 'descending';
                case 'descending':
                    return null;
                case null:
                    return 'ascending';
                }
            })();
            this.setState({
                sortColumn: sortDirection === null ? null : column.id,
                sortDirection
            }, this.fetch.bind(this));
        }

        renderSortControl(column) {
            let sortControl;
            if (!column.sort) {
                return;
            }

            const sortDirection = (() => {
                if (this.state.sortColumn === column.id) {
                    return this.state.sortDirection;
                } else {
                    return column.sort.direction || 'ascending';
                }
            })();

            const iconState = (() => {
                if (this.state.sortColumn === column.id) {
                    return '-active';
                } else {
                    return '';
                }
            })();
            
            let iconClass;
            switch (column.sort.type) {
                case 'alphanumeric':
                    iconClass = 'sort';
                    break;
                case 'numeric':
                    iconClass = 'sort'
            }
            switch (sortDirection) {
                case 'descending':
                    iconClass += '-desc';
                    break;
                case 'ascending':
                default:
                    iconClass += '-asc';
            }

            return html`
                <div className="Table-sort-button" 
                    onClick=${() => {
                        this.handleSortButtonClick(column);
                }}>
                    <div className=${`Table-sort-button-icon${iconState} fa fa-${iconClass}`}></div>
                </div>
            `;
        }

        renderTableHeader() {
            const rows = this.props.columns.map((column, index) => {
                if (column.display === false) {
                    return;
                }

                const cellStyle = {};
                if (column.width) {
                    cellStyle.width = column.width;
                }
                
                return html`
                    <th style=${cellStyle}>
                        <div className="Table-header-cell-wrapper">
                            <div className="Table-header-cell-label">
                                ${column.title}
                            </div>
                            ${this.renderSortControl(column)}
                        </div>
                    </th>
                `;
            });
            return html`
                <tr>
                    ${rows}
                </tr>
            `;
        }

        renderTableBody() {
            const rows = this.state.table.map((tableRow) => {
                const row = this.props.columns.map((column, index) => {
                    if (column.display === false) {
                        return;
                    }
                    const content = (() => {
                        if (column.render) {
                            try {
                                return column.render(tableRow[index], tableRow);
                            } catch(ex) {
                                return html`
                                    <span className="text-danger"
                                          title=${ex.message}>
                                    ERR
                                    </span>
                                `;
                            }
                        } 
                        return tableRow[index];
                    })();
                    return html`
                        <td>
                            ${content}
                        </td>
                    `;
                });
                return html`
                    <tr>
                      ${row}
                    </tr>
                    `;
            });
            return rows;
        }

        renderTable() {
            return html`
                <table className="table table-bordered">
                    <thead>
                        ${this.renderTableHeader()}
                    </thead>
                    <tbody>
                        ${this.renderTableBody()}
                    </tbody>
                </table>
            `;
        }

        render() {
            return html`
                <div className='Table'>
                    <div className="Table-header">
                        ${this.renderHeader()}
                    </div>

                    <div className="Table-body">
                        ${this.renderBody()}
                    </div>
                    
                    <div className="Table-footer">
                        ${this.renderFooter()}
                    </div>
                </div>
            `;
        }
    }
    return Table;
});
