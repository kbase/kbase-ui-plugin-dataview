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
            const sortColumn = this.props.initialSortColumn || 0;
            const sortDirection = this.props.initialSortDirection || 'ascending';
            const initialTable = this.props.dataSource.map((values) => {
                return {
                    showDetail: false,
                    values
                };
            });
            const table = this.sortTable(initialTable, sortColumn, sortDirection);
            const columnHovered = null;
            this.state = {
                sortColumn,
                sortDirection,
                columnHovered,
                table
            };
        }

        isColumnSorted(sortable, columnIndex) {
            return (sortable && columnIndex === this.state.sortColumn);
        }

        renderSortableIndicator(sortable, columnIndex) {
            if (!sortable) {
                return;
            }

            const [sortIcon, sortStyle, title] = (() => {
                if (columnIndex !== this.state.sortColumn) {
                    return ['fa-sort', {}, 'This column is sortable, but not sorted'];
                }
                if (this.state.sortDirection === 'ascending') {
                    return ['fa-sort-asc', {color: 'blue'}, 'The table is sorted by this column, in ascending order'];
                }
                return ['fa-sort-desc', {color: 'blue'}, 'The table is sorted by this column, in descending order'];
            })();
            return html`
                <div className="DataTable4-header-col-sortable" title=${title}>
                    <span className=${['fa', sortIcon].join(' ')} style=${sortStyle}/>
                </div>
            `;
        }

        getRowValue(row, index) {
            const columnId = this.props.columns[index].id;
            return row.values[columnId];
        }

        sortTable(table, sortColumn, sortDirection) {
            const directionFactor = sortDirection === 'ascending' ? 1 : -1;

            const customComparator = this.props.columns[sortColumn].sortComparator;

            return table.slice().sort((a, b) => {
                const comparison = (() => {
                    if (customComparator) {
                        return customComparator(a, b);
                    }
                    const aValue = this.getRowValue(a, sortColumn);
                    const bValue = this.getRowValue(b, sortColumn);
                    switch (typeof aValue) {
                    case 'string':
                        switch (typeof bValue) {
                        case 'string':
                            return aValue.localeCompare(bValue);
                        case 'number':
                            return aValue.localeCompare(String(bValue));
                        case 'null':
                            return 1;
                        default:
                            return 0;
                        }
                    case 'number':
                        switch (typeof bValue) {
                        case 'string':
                            return String(aValue).localeCompare(bValue);
                        case 'number':
                            return aValue - bValue;
                        case 'null':
                            return 1;
                        default:
                            return 0;

                        }
                    case 'object': {
                        if (aValue instanceof Date) {
                            switch (typeof bValue) {
                            case 'object':
                                if (bValue instanceof Date) {
                                    return aValue.getTime() - bValue.getTime();
                                }
                                return 0;
                            default:
                                return 0;

                            }
                        } else {
                            return 0;
                        }
                    }
                    case 'null':
                        switch (typeof bValue) {
                        case 'string':
                            return -1;
                        case 'number':
                            return -1;
                        case 'null':
                            return 0;
                        default:
                            return -1;
                        }
                    default:
                        return 0;
                    }
                })();
                return comparison * directionFactor;
            });
        }

        onColumnClick(sortable, sortColumn) {
            if (!sortable) {
                return;
            }

            const sortDirection = (() => {
                if (sortColumn === this.state.sortColumn) {
                    // reverse direction
                    return this.state.sortDirection === 'ascending' ? 'descending' : 'ascending';
                }
                return 'ascending';
            })();


            const table = this.sortTable(this.state.table, sortColumn, sortDirection);

            this.setState({
                sortDirection,
                sortColumn,
                table
            });
        }

        renderHeader() {
            if (this.props.columns) {
                return (() => {

                    const header = this.props.columns.map(({sortable, searchable, label, styles}, index) => {
                        const headerColClasses = [
                            'DataTable4-header-col'
                        ];
                        if (sortable) {
                            headerColClasses.push('DataTable4-header-col-sortable');
                        }
                        if (this.isColumnSorted(sortable, index)) {
                            headerColClasses.push('DataTable4-header-col-sorted');
                        }
                        return html`
                            <div className=${headerColClasses.join(' ')} 
                                 style=${styles.column || {}}
                                 onMouseEnter=${() => {this.onColumnEnter(index);}}
                                 onMouseLeave=${() => {this.onColumnLeave(index);}}
                                 onClick=${() => {this.onColumnClick(sortable, index);}}>
                                <div className="DataTable4-header-col-label" >
                                    ${label}
                                </div>
                                ${this.renderSortableIndicator(sortable, index)}
                            </div>
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
                <div className="DataTable4-row" key=${index} onDblClick=${(ev) => {this.onRowDblClick(index, ev.getModifierState('Shift'));}}>${rowColumns}</div>
            `;

            // Render row wrapper.
            const rowClasses = ['DataTable4-grid-row'];
            // if (values.isHighlighted) {
            //     rowClasses.push('DataTable4-row-highlighted');
            // }

            return html`
                <div 
                    className=${rowClasses.join(' ')}
                    
                    
                     role="row">
                    ${row}
                    <div className="DataTable4-detail">
                    ${showDetail && this.props.renderDetail && this.props.renderDetail(values)}
                    </div>
                </div>
            `;
        }

        onColumnEnter(columnIndex) {
            this.setState({
                columnHovered: columnIndex
            });
        }

        onColumnLeave() {
            this.setState({
                columnHovered: null
            });
        }



        renderRow(values) {
            return this.props.columns.map((col, columnIndex) => {
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
                const style = Object.assign({}, col.styles.column, col.styles.data);
                const isHovered = this.state.columnHovered === columnIndex;
                const columnClasses = [
                    'DataTable4-col'
                ];
                if (isHovered) {
                    columnClasses.push('DataTable4-col-hovered');
                }
                return html`
                    <div className=${columnClasses.join(' ')}
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
            if (!this.props.renderDetail) {
                return;
            }
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
            const classes = [
                'DataTable4'
            ];
            if (this.props.flex) {
                classes.push('DataTable4-flex');
            }
            if (this.props.bordered) {
                classes.push('DataTable4-bordered');
            }
            return html`
                <div className=${classes.join(' ')}>
                    ${this.renderHeader()}
                    ${this.renderBody()}
                </div>
            `;
        }
    }

    return DataTable4;
});
