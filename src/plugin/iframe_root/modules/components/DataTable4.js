define([
    'preact',
    'htm',
    'components/IconButton',
    'components/Empty',
    'components/Popup',
    'components/DropdownMenu',

    'css!./DataTable4.css'
], (
    preact,
    htm,
    IconButton,
    Empty,
    Popup,
    DropdownMenu
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);
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

    class FilterCell extends Component {
        constructor(props) {
            super(props);
            this.state = {
                filterPopup: {
                    isActive: false,
                    isStickyOpen: false
                }
            };
        }


        onPopupOpen() {
            this.setState({
                filterPopup: {
                    ...this.state.filterPopup,
                    isStickyOpen: true,
                    isActive: false
                }
            });
        }

        onPopupClose() {
            this.setState({
                filterPopup: {
                    ...this.state.filterPopup,
                    isStickyOpen: false
                }
            });
        }

        onMouseEnter() {
            this.setState({
                filterPopup: {
                    ...this.state.filterPopup,
                    isActive: true
                }
            });
        }

        onMouseLeave() {
            this.setState({
                filterPopup: {
                    ...this.state.filterPopup,
                    isActive: false
                }
            });
        }
        render() {
            const menu = {
                items: this.props.filterValues.map((filterValue) => {
                    return {
                        title: filterValue,
                        action: () => {
                            this.props.onFilter(filterValue);
                        }
                    };
                })
            };

            const menuStyle = {
                flex: '0 0 auto',
                visibility: 'hidden',
                marginLeft: '4px'
            };
            if (this.state.filterPopup.isActive || this.state.filterPopup.isStickyOpen) {
                menuStyle.visibility = 'visible';
            }
            const filterDropdown = html`
                <div style=${menuStyle}>
                    <${Popup} 
                        overlaySelector=".DataTable4"
                        scrollSelector=".DataTable4-filter-header"
                        containerTop=${0}
                        position="left"
                        onOpen=${this.onPopupOpen.bind(this)}
                        onClose=${this.onPopupClose.bind(this)}
                    >
                        <${DropdownMenu} 
                            title="Filter on Unique Values" 
                            menu=${menu} 
                            onClose=${this.onPopupClose.bind(this)}/>
                    </>
                </div>
            `;

            return html`
                <div style=${{flex: '1 1 0', display: 'flex', flexDirection: 'row', alignItems: 'center'}}
                    onMouseEnter=${this.onMouseEnter.bind(this)}
                    onMouseLeave=${this.onMouseLeave.bind(this)} >
                    <input 
                        className="form-control" 
                        title=${`Filter "${this.props.column.label}" column; regular expression may be used`}
                        onInput=${this.props.onInput} 
                        value=${this.props.value}
                        type="search" />
                    ${filterDropdown}
                </div>
            `;
        }
    }

    class DataTable4 extends Component {
        constructor(props) {
            super(props);
            const ordered = [];
            this.tableMap = {};

            const columnValues = this.props.columns.map(() => {
                return new Set();
            });

            this.props.dataSource.forEach((values, rowIndex) => {
                this.tableMap[rowIndex] = {
                    showDetail: false,
                    show: true,
                    rowIndex,
                    values
                };

                ordered.push({
                    showDetail: false,
                    show: true,
                    rowIndex,
                });

                this.props.columns.forEach((column, columnIndex) => {
                    columnValues[columnIndex].add(values[column.id]);
                });
            });

            this.columnValues = columnValues.map((uniqueValues) => {
                return Array.from(uniqueValues).sort();
            });

            const sort = [{
                column: this.props.initialSortColumn || 0,
                direction: this.props.initialSortDirection || 'ascending'
            }];

            const table = this.sortTable(ordered, sort);

            const columnHovered = null;
            this.state = {
                searchText: '',
                columnFilters: {},
                globalFilter: {
                    filterText: ''
                },
                sort,
                columnHovered,
                showFilterHeader: this.props.showFilters || false,
                filterPopup: {
                    isStickyOpen: false,
                    isActive: false
                },
                table
            };
        }

        isColumnSorted(sortable, columnIndex) {
            if (!sortable) {
                return false;
            }
            const columnSort = this.state.sort.filter(({column}) => {
                return column === columnIndex;
            });
            return (columnSort.length === 1);
        }

        getColumnSort(sortable, columnIndex) {
            if (!sortable) {
                return [null, null];
            }

            let sortIndex = 0;
            for (const sort of this.state.sort) {
                if (sort.column === columnIndex) {
                    return [sort, sortIndex];
                }
                sortIndex += 1;
            }
            return [null, null];
        }

        renderSortPosition(sortIndex) {
            if (sortIndex === null) {
                return;
            }
            const rules = new Intl.PluralRules('en-US', {type: 'ordinal'});
            const suffixes = new Map([
                ['one',   'st'],
                ['two',   'nd'],
                ['few',   'rd'],
                ['other', 'th'],
            ]);
            const format = (value) => {
                const rule = rules.select(value);
                const suffix = suffixes.get(rule);
                return `${value}${suffix}`;
            };
            const title = `${format(sortIndex + 1)} sort`;
            return html`
                <span title=${title} style=${{fontWeight: 'normal'}}>(${sortIndex + 1})</span>
            `;
        }

        renderSortableIndicator(sortable, columnIndex) {
            if (!sortable) {
                return;
            }

            const [sortIcon, sortStyle, title, sortIndex] = (() => {
                const [sort, sortIndex] = this.getColumnSort(sortable, columnIndex);
                if (sort === null) {
                    return ['fa-sort', {}, 'This column is sortable, but not sorted', null];
                }
                if (sort.direction === 'ascending') {
                    return ['fa-sort-asc', {}, 'The table is sorted by this column, in ascending order', sortIndex];
                }
                return ['fa-sort-desc', {}, 'The table is sorted by this column, in descending order', sortIndex];
            })();
            return html`
                <div className="DataTable4-header-col-sortable" title=${title}>
                    ${this.renderSortPosition(sortIndex)} <span className=${['fa', 'DataTable4-sort-icon', sortIcon].join(' ')} style=${sortStyle}/>
                </div>
            `;
        }

        renderSearchableIndicator(searchable) {
            if (!searchable) {
                return;
            }
            return html`
                <span 
                    title="This column is searchable"
                    className="fa fa-search" 
                    style=${{fontSize: '60%', marginRight: '1em', color: 'rgba(150, 150, 150)'}} />
            `;
        }

        getRowValue({rowIndex}, columnIndex) {
            const columnId = this.props.columns[columnIndex].id;
            return this.tableMap[rowIndex].values[columnId];
        }

        sortTable(table, sort) {
            const compare = (a, b, column) => {
                const aRow = this.tableMap[a.rowIndex];
                const bRow = this.tableMap[b.rowIndex];
                const customComparator = this.props.columns[column].sortComparator;
                if (customComparator) {
                    return customComparator(aRow, bRow);
                }
                const aValue = this.getRowValue(a, column);
                const bValue = this.getRowValue(b, column);
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
            };

            return table.slice().sort((a, b) => {
                for (const {column, direction} of sort) {
                    const directionFactor = direction === 'ascending' ? 1 : -1;
                    const comparison = compare(a, b, column);
                    if (comparison !== 0) {
                        return comparison * directionFactor;
                    }
                }
            });
        }

        addNewSort(sortColumn) {
            const newSort = {
                column: sortColumn,
                direction: 'ascending'
            };

            const sort = this.state.sort.slice();
            sort.push(newSort);

            const table = this.sortTable(this.state.table, sort);

            this.setState({
                sort,
                table
            });
        }

        toggleSortDirection(sortColumn) {
            const sort = this.state.sort.map((sort, sortIndex) => {
                if (sort.column === sortColumn) {
                    if (sortIndex === 0) {
                        sort.direction = sort.direction === 'ascending' ? 'descending' : 'ascending';
                    } else {
                        switch (sort.direction) {
                        case 'ascending': sort.direction = 'descending'; break;
                        case 'descending': return null; // sort.direction = 'ascending';
                        }

                    }
                }
                return sort;
            })
                .filter((sort) => {
                    return (sort !== null);
                });
            const table = this.sortTable(this.state.table, sort);
            this.setState({table, sort});
        }

        setSingleSort(sortColumn) {
            const sortDirection = (() => {
                if (sortColumn === this.state.sort[0].column) {
                    // reverse direction
                    return this.state.sort[0].direction === 'ascending' ? 'descending' : 'ascending';
                }
                return 'ascending';
            })();

            const sort = [{
                column: sortColumn,
                direction: sortDirection
            }];

            const table = this.sortTable(this.state.table, sort);

            this.setState({
                sort,
                table
            });
        }

        onColumnClick(sortable, sortColumn, shiftPressed) {
            if (!sortable) {
                return;
            }

            // Rules:
            // if shift not pressed, sort only by this column
            // if shift pressed, and this column was not already selected, add it as a
            // new secondary sort
            // if shift pressed, and this column was already sorted by, simply reverse the direction.

            if (shiftPressed) {
                if (this.isColumnSorted(sortable, sortColumn)) {
                    this.toggleSortDirection(sortColumn);
                } else {
                    this.addNewSort(sortColumn);
                }
            } else {
                this.setSingleSort(sortColumn);
            }


        }

        renderHeader() {
            if (this.props.columns) {
                return (() => {
                    const header = this.props.columns.map(({sortable, label, styles}, columnIndex) => {
                        const headerColClasses = [
                            'DataTable4-header-col'
                        ];
                        if (sortable) {
                            headerColClasses.push('DataTable4-header-col-sortable');
                        }
                        if (this.isColumnSorted(sortable, columnIndex)) {
                            headerColClasses.push('DataTable4-header-col-sorted');
                        }
                        const isHovered = this.state.columnHovered === columnIndex;
                        if (isHovered) {
                            headerColClasses.push('DataTable4-col-hovered');
                        }
                        return html`
                            <div className=${headerColClasses.join(' ')} 
                                 style=${styles.column || {}}
                                 onMouseEnter=${() => {this.onColumnEnter(columnIndex);}}
                                 onMouseLeave=${() => {this.onColumnLeave(columnIndex);}}
                                 onClick=${(ev) => {this.onColumnClick(sortable, columnIndex, ev.getModifierState('Shift'));}}>
                                <div className="DataTable4-header-col-label" >
                                    ${label}
                                </div>
                                ${this.renderSortableIndicator(sortable, columnIndex)}
                            </div>
                        `;
                    });
                    header.unshift(html`
                        <div className="DataTable4-header-col" style=${{flex: '0 0 2em'}}>
                            <${IconButton}
                                icon="filter"
                                activeIcon="close"
                                active=${this.state.showFilterHeader}
                                tooltip=${this.state.showFilterHeader ? 'Hide column filters' : 'Show column filters'}
                                onClick=${() => {this.toggleColumnToolbar();}}/>
                        </div>
                    `);
                    return html`
                        <div className="DataTable4-header">
                            ${header}
                        </div>
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

        onFilterInput(filterText, columnIndex) {
            const filterCol = this.props.columns[columnIndex].id;
            const columnFilters = (() => {
                const currentFilters = this.state.columnFilters;
                if (filterText.length === 0) {
                    delete currentFilters[filterCol];
                } else {
                    currentFilters[filterCol] = {
                        filterText,
                        filterRE: new RegExp(filterText, 'i')
                    };
                }
                return currentFilters;
            })();

            this.applyAllFilters(this.state.globalFilter, columnFilters);
            this.setState({
                columnFilters
            });
        }

        getColumnFilterValue(columnIndex) {
            const column = this.props.columns[columnIndex];
            const filter = this.state.columnFilters[column.id];
            if (!filter) {
                return '';
            }
            return filter.filterText;
        }

        renderFilterHeader() {
            if (!this.state.showFilterHeader) {
                return;
            }
            if (this.props.columns) {
                return (() => {
                    const header = this.props.columns.map((column, columnIndex) => {
                        // const column = this.props.columns[columnIndex];
                        const headerColClasses = [
                            'DataTable4-header-col'
                        ];
                        // const column = this.props.columns[columnIndex];
                        const isHovered = this.state.columnHovered === columnIndex;
                        if (isHovered) {
                            headerColClasses.push('DataTable4-col-hovered');
                        }
                        return html`
                            <div className=${headerColClasses.join(' ')} 
                                style=${column.styles.column || {}}
                                onMouseEnter=${() => {this.onColumnEnter(columnIndex);}}
                                onMouseLeave=${() => {this.onColumnLeave(columnIndex);}}>
                                <${FilterCell} 
                                    column=${column} 
                                    onInput=${(ev) => {this.onFilterInput(ev.target.value, columnIndex);}} 
                                    value=${this.getColumnFilterValue(columnIndex)}
                                    filterValues=${this.columnValues[columnIndex]}
                                    onFilter=${(filterText) => {this.onFilterInput(`^${filterText}$`, columnIndex);}}
                                />
                            </div>
                        `;
                    });

                    const filterButton = (() => {
                        const clearFiltersDisabled = (Object.keys(this.state.columnFilters).length === 0);
                        if (!clearFiltersDisabled) {
                            return html`
                                <${IconButton} 
                                    type="danger"
                                    icon="ban" 
                                    tooltip=${clearFiltersDisabled ? 'Clears all active filters; currently disabled since there are no active filters' : 'Clears all active filters'}
                                    onClick=${() => {this.clearFilters();}}
                                />
                            `;
                        }
                    })();
                    header.unshift(html`
                        <div className="DataTable4-header-col" style=${{flex: '0 0 2em'}}>
                           ${filterButton}
                        </div>
                    `);
                    return html`
                        <div className="DataTable4-filter-header">${header}</div>
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

        renderRowWrapper({values, rowIndex, showDetail}) {
            // Compute the style for the row wrapper, which is positioned within the overall
            // grid according to the.
            // Render actual table row
            const rowColumns = this.renderRow(values);
            /*
            tooltip=${this.state.showFilterHeader ? 'Hide column filters' : 'Show column filters'}
                        onClick=${() => {this.toggleColumnToolbar();}}
            */
            const detailToggleButton = (() => {
                if (this.props.renderDetail) {
                    return html`
                        <${IconButton} 
                            icon="caret-right" 
                            tooltip=${showDetail ? 'Hide detail for this row; press Alt to apply to all rows' : 'Show detail for this row; press Alt to apply to all rows' }
                            activeIcon="caret-down"
                            active=${showDetail}
                            onClick=${(shiftPressed) => {this.onRowDblClick(rowIndex, shiftPressed);}}
                        />
                    `;
                }
            })();
            rowColumns.unshift(html`
                <div className="DataTable4-header-col" style=${{flex: '0 0 2em'}}>
                    ${detailToggleButton}
                </div>
            `);
            const row = html`
                <div className="DataTable4-row" 
                    key=${rowIndex} 
                    >${rowColumns}</div>
            `;

            // Render row wrapper.
            const rowClasses = ['DataTable4-grid-row'];
            // if (values.isHighlighted) {
            //     rowClasses.push('DataTable4-row-highlighted');
            // }

            return html`
                <div className=${rowClasses.join(' ')} role="row">
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

                const columnClasses = [
                    'DataTable4-col'
                ];

                const isHovered = this.state.columnHovered === columnIndex;
                if (isHovered) {
                    columnClasses.push('DataTable4-col-hovered');
                }

                return html`
                    <div className=${columnClasses.join(' ')}
                            style=${style}
                            data-k-b-testhook-cell=${col.id}
                            onMouseEnter=${() => {this.onColumnEnter(columnIndex);}}
                            onMouseLeave=${() => {this.onColumnLeave(columnIndex);}}
                            role="cell">
                        <div className="DataTable4-col-content">
                            ${content}
                        </div>
                    </div>
                `;
            });
        }

        renderRows(rows) {
            return rows
                .map((row) => {
                    return this.renderRowWrapper(row);
                });
        }

        onRowDblClick(clickedIndex, shiftPressed) {
            if (!this.props.renderDetail) {
                return;
            }
            const newShowDetail = !this.tableMap[clickedIndex].showDetail;
            if (shiftPressed) {
                this.state.table
                    .map(({rowIndex}) => this.tableMap[rowIndex])
                    .forEach((row) => {
                        row.showDetail = newShowDetail;
                    });
            } else {
                this.tableMap[clickedIndex].showDetail = newShowDetail;
            }
            this.setState({
                ...this.state,
                // Just to trigger a table re-render
                table: this.state.table.slice()
            });
        }

        emptyMessage() {
            if (this.props.emptyMessage) {
                return this.props.emptyMessage;
            }
            if (this.hasFilter()) {
                return 'No data matches this filter';
            }
            return 'No data provided';
        }

        renderBody() {
            const rows = this.state.table
                .map(({rowIndex}) => this.tableMap[rowIndex])
                .filter(({show}) => show);

            if (rows.length === 0) {
                return html`
                    <${Empty} message=${this.emptyMessage()} />
                `;
            }

            return html`
                <div className="DataTable4-grid">
                    ${this.renderRows(rows)}
                </div>
            `;
        }

        renderTable() {
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
                    ${this.renderFilterHeader()}
                    <div className="DataTable4-body">
                        ${this.renderBody()}
                    </div>
                </div>
            `;
        }

        // Render header above table.
        onSearchInput(ev) {
            const filterText = ev.target.value;
            const globalFilter = {
                filterText,
                filterRE: new RegExp(filterText, 'i')
            };

            // Table sort order is handled

            this.applyAllFilters(globalFilter, this.state.columnFilters);

            this.setState({
                table: this.state.table.slice(),
                globalFilter
            });
        }

        applyAllFilters(globalFilter, columnFilters) {
            const filters = Object.entries(columnFilters);
            if (filters.length === 0) {
                this.state.table
                    .map(({rowIndex}) => this.tableMap[rowIndex])
                    .forEach((row) => {
                        row.show = true;
                    });
            }
            this.state.table
                .map(({rowIndex}) => this.tableMap[rowIndex])
                .forEach((row) => {
                    // Per column filter
                    const showForColumnFilter = filters.every((filter) => {
                        const [columnId, {filterRE}] = filter;
                        const value = row.values[columnId];
                        return (filterRE.test(value));
                    });
                    // Global filter
                    const showForGlobalFilter = (() => {
                        if (globalFilter.filterText === '') {
                            return true;
                        }
                        return this.props.columns.some((column) => {
                            return (column.searchable && globalFilter.filterRE && globalFilter.filterRE.test(row.values[column.id]));
                        });
                    })();
                    row.show = showForColumnFilter && showForGlobalFilter;
                });
        }

        onClearSearch() {
            const globalFilter = {
                filterText: ''
            };
            this.applyAllFilters(globalFilter, this.state.columnFilters);
            this.setState({
                table: this.state.table.slice(),
                globalFilter
            });
        }

        renderSearch() {
            return html`
                <div className="form-inline">
                    <div className="input-group">
                        <input 
                            type="search" 
                            className="form-control" 
                            style=${{width: '20em'}} 
                            placeholder="Search" 
                            value=${this.state.globalFilter.filterText}
                            onInput=${this.onSearchInput.bind(this)}
                            />
                        <span className="input-group-addon"><span class="fa fa-search" /></span>
                    </div>
                   
                </div>
            `;
        }

        searchEnabled() {
            return (this.props.columns.some(({searchable}) => searchable));
        }

        clearFilters() {
            const globalFilter = {
                filterText: ''
            };
            const columnFilters = {};

            // Table sort order is handled

            this.applyAllFilters(globalFilter, columnFilters);

            this.setState({
                table: this.state.table.slice(),
                globalFilter,
                columnFilters
            });
        }

        hasFilter() {
            return Object.keys(this.state.columnFilters).length > 0;
        }

        toggleColumnToolbar() {
            this.clearFilters();
            this.setState({
                showFilterHeader: !this.state.showFilterHeader
            });
        }

        columnToolbarEnabled() {
            return true;
        }

        renderColumnToolbar() {
            if (!this.columnToolbarEnabled()) {
                return;
            }
            const toolbar = html`
                <div>FOO</div>
            `;
            return html`
                <div className="DataTable4-toolbar">
                ${toolbar}
                </div>
            `;
        }

        // Render all
        render() {
            const classes= ['DataTable4-wrapper'];
            if (this.props.flex) {
                classes.push('DataTable4-flex');
            }
            // ${this.renderToolbar()}
            return html`
                <div className=${classes.join(' ')}>
                    ${this.renderTable()}
                </div>
            `;
        }

    }

    return DataTable4;
});
