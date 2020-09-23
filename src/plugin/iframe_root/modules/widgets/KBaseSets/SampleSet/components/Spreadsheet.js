define([
    'preact',
    'htm',
    'components/common',
    '../../../../ResizeObserver',
    './DropdownMenu',
    './Popup',
    './Toolbar',

    'css!./Spreadsheet.css'
], function (
    preact,
    htm,
    common,
    ResizeObserver2,
    DropdownMenu,
    Popup,
    Toolbar
) {
    'use strict';

    const MAX_CELL_WIDTH = 200;
    const ROW_HEIGHT = 40;

    const {Component } = preact;
    const html = htm.bind(preact.h);

    function outerWidth(el) {
        el.offsetHeight;
        const rect = el.getBoundingClientRect();
        return Math.ceil(rect.right - rect.left);
    }

    function outerDimensions(el) {
        el.offsetHeight;
        const rect = el.getBoundingClientRect();
        const width = Math.ceil(rect.right - rect.left);
        const height = Math.ceil(rect.bottom - rect.top);
        return {
            width, height
        };
    }

    class HeaderCell extends Component {
        constructor(props) {
            super(props);

            this.state = {
                sortDirection: null,
                isActive: false,
                isStickyOpen: false
            };
        }

        renderCell() {
            // columnDef, columnNumber
            const columnDef = this.props.def;
            const columnNumber = this.props.index;
            const menu = (() => {
                if (typeof columnNumber === 'undefined') {
                    return [];
                }
                const filterMenu = (() => {
                    if (this.props.showMenu === false) {
                        return;
                    }
                    if (columnDef.filterValues.length === 0) {
                        return {
                            items: [{
                                title: 'No Filter Values'
                            }]
                        };
                    }
                    return {
                        items: columnDef.filterValues.map((value) => {
                            return {
                                title: value,
                                action: () => {
                                    this.doFilter(value);
                                }
                            };
                        })
                    };
                })();

                return {
                    items: [{
                        title: 'Sort Ascending',
                        action: () => {
                            this.doSort('ascending');
                        }
                    }, {
                        title: 'Sort Descending',
                        action: () => {
                            this.doSort('descending');
                        }
                    },
                    // {
                    //     title: 'Clear Any Filter',
                    //     action: this.doClearFilter.bind(this)
                    // },
                    {
                        title: 'Quick Filter',
                        dataMenu: filterMenu
                    }]
                };
            })();

            return html`
            <${preact.Fragment}>
                <div className="Spreadsheet-cell-content" title=${columnDef.title}>
                    ${columnDef.title}
                </div>
               
                <div className="Spreadsheet-header-cell-menu">
                    <${Popup} overlaySelector=".Spreadsheet-wrapper" 
                              scrollSelector=".Spreadsheet-header"
                            containerTop=${0} 
                            onOpen=${this.onPopupOpen.bind(this)} 
                            onClose=${this.onPopupClose.bind(this)}>
                        <${DropdownMenu} menu=${menu} onClose=${this.onPopupClose.bind(this)}/>
                    <//>
                </div>
            <//>
            `;
        }

        onPopupOpen() {
            this.setState({
                isStickyOpen: true,
                isActive: false
            });
        }

        onPopupClose() {
            this.setState({
                isStickyOpen: false
            });
        }

        doClearFilter() {
            this.props.onClearFilter();
        }

        doFilter(filterValue) {
            this.props.onFilter(filterValue);
        }

        doSort(sortDirection) {
            if (sortDirection === this.state.sortDirection) {
                return;
            }
            this.setState({
                sortDirection
            }, () => {
                this.props.onSort(this.state.sortDirection);
            });
        }

        doMouseEnterHeaderCell() {
            this.setState({
                isActive: true
            });
        }

        doMouseLeaveHeaderCell() {
            this.setState({
                isActive: false
            });
        }

        render() {
            const classes = ['Spreadsheet-header-cell'];

            if (this.state.isActive || this.state.isStickyOpen) {
                classes.push('-active');
            }

            const style = {
                flexBasis: `${this.props.def.width}px`
            };

            const columnDef = this.props.def;
            const columnNumber = this.props.index;

            // onClick=${this.doSort.bind(this)}
            return html`<div className=${classes.join(' ')} 
                onMouseEnter=${() => {this.doMouseEnterHeaderCell(columnDef);}}
                onMouseLeave=${() => {this.doMouseLeaveHeaderCell(columnDef);}}
                style=${style}
                role="cell"
                data-k-b-testhook-cell=${columnDef.key}>
                ${this.renderCell(columnDef, columnNumber)}
            </div>`;
        }
    }

    class Spreadsheet extends Component {
        constructor(props) {
            super(props);

            this.bodyRef = preact.createRef();
            this.headerRef = preact.createRef();
            this.firstRow = null;
            this.lastRow = null;

            this.observer = new ResizeObserver2(this.bodyObserver.bind(this));

            // Just for now ... a better impl is a spreadsheet data source.
            // analyze table values...

            const table = this.props.table.map((data, index) => {
                const terms = data.reduce((terms, value) => {
                    if (value) {
                        terms.add(String(value));
                    }
                    return terms;
                }, new Set());
                return {
                    state: {
                        selected: false,
                        hidden: false
                    },
                    index,
                    searchData: Array.from(terms).join(' '),
                    data
                };
            });

            this.columnDefMap = this.props.columns.reduce((columnDefMap, def) => {
                columnDefMap[def.key] = def;
                return columnDefMap;
            }, {});

            this.state = {
                table,
                currentSort: null,
                currentFilter: null,
                currentSearch: null,
                columnMenu: null,
                scrollbarWidth: null,
                dimensions: {
                    width: null,
                    height: null
                },
                firstCol: null,
                lastCol: null,
                subsetCount: null
            };
            this.measureColumnWidths();
        }

        componentDidMount() {
            window.setTimeout(() => {
                this.setState({
                    trigger: true
                });
            }, 0);
            if (this.observer && this.bodyRef.current) {
                this.observer.observe(this.bodyRef.current);
            }
            this.setState({
                scrollbarWidth: this.bodyRef.current.offsetWidth - this.bodyRef.current.clientWidth
            });
            const {height, width} = this.calcSpreadsheetDimensions();
            this.setState({
                dimensions: {height, width}
            });
            this.calcColumns();
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.handleWindowResize.bind(this));
            if (this.scrollTimer) {
                window.clearTimeout(this.scrollTimer);
            }
            if (this.observer && this.bodyRef.current) {
                this.observer.unobserve(this.bodyRef.current);
            }
        }

        formatValue(value, formatter) {
            if (!formatter) {
                return value;
            }

            switch (formatter.type) {
            case 'number':
                if (formatter.precision) {
                    return Intl.NumberFormat('en-US', {
                        maximumSignificantDigits: formatter.precision,
                        useGrouping: formatter.group ? true : false
                    }).format(value);
                } else if (formatter.decimalPlaces) {
                    return Intl.NumberFormat('en-US', {
                        maximumFractionDigits: formatter.decimalPlaces,
                        minimumFractionDigits: formatter.decimalPlaces,
                        useGrouping: formatter.group ? true : false
                    }).format(value);
                } else {
                    return Intl.NumberFormat('en-US', {
                        useGrouping: formatter.group ? true : false
                    }).format(value);
                }
            default:
                return value;
            }
        }

        handleBodyScroll(e) {
            if (!this.headerRef.current) {
                return ;
            }
            this.headerRef.current.scrollLeft = e.target.scrollLeft;

            if (this.scrollTimer) {
                return;
            }

            this.scrollTimer = window.setTimeout(() => {
                this.calcColumns();
                // this.setState({
                //     triggerRefresh: new Date().getTime()
                // });
                this.scrollTimer = null;
            }, 100);
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

        handleWindowResize() {
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

        createTestNodes() {
            const testNodeContainer = document.createElement('div');
            testNodeContainer.position = 'absolute';
            document.body.appendChild(testNodeContainer);

            const cellTestNode = document.createElement('div');
            testNodeContainer.appendChild(cellTestNode);
            cellTestNode.classList = ['Spreadsheet-cell-measurer'];

            const cellTestInnerNode = document.createElement('div');
            cellTestNode.appendChild(cellTestInnerNode);
            cellTestInnerNode.classList = ['Spreadsheet-cell-content-measurer'];

            const headerTestNode = document.createElement('div');
            testNodeContainer.appendChild(headerTestNode);
            headerTestNode.classList = ['Spreadsheet-cell-measurer'];

            const headerTestInnerNode = document.createElement('div');
            headerTestNode.appendChild(headerTestInnerNode);
            headerTestInnerNode.classList = ['Spreadsheet-header-cell-content-measurer'];

            return {testNodeContainer, cellTestNode, cellTestInnerNode, headerTestNode, headerTestInnerNode};
        }

        renderAndMeasure(content, contentNode, measurementNode) {
            preact.render(content, contentNode);
            return outerWidth(measurementNode);
        }

        measureColumnWidths() {
            const {testNodeContainer, cellTestNode, cellTestInnerNode, headerTestNode, headerTestInnerNode} = this.createTestNodes();
            const measures = {};

            // also gather values for columns for filtering.

            for (let i = 0; i < this.props.columns.length; i += 1) {
                const columnDef = this.props.columns[i];

                // Yeah, I know, modifying the column def again.
                // Should take care of this in a data module wrapping the spreadsheet.
                columnDef.filterValues = new Set();

                // Measure column header width.
                const headerWidth = this.renderAndMeasure(html`<${HeaderCell} def=${columnDef} />`, headerTestInnerNode, headerTestNode);
                // headerTestInnerNode.innerText = columnDef.title;
                // const headerWidth = outerWidth(headerTestNode);

                // Get max widths for all row values for this column.
                let maxCellWidth = 0;
                for (let j = 0; j < this.props.table.length; j += 1) {
                    const row = this.props.table[j];
                    const cellValue = row[i];

                    if (cellValue !== null && typeof cellValue !== 'undefined' && cellValue !== '') {
                        columnDef.filterValues.add(cellValue);
                    }

                    let thisWidth;
                    if (measures[cellValue]) {
                        thisWidth = measures[cellValue];
                    } else {
                        const cellWidth = this.renderAndMeasure(this.renderCell(cellValue, columnDef), cellTestInnerNode, cellTestNode);
                        // cellTestInnerNode.innerHTML = content;
                        // const w = outerWidth(cellTestNode);
                        measures[cellValue] = cellWidth;
                        thisWidth = cellWidth;
                    }
                    maxCellWidth = Math.max(maxCellWidth, thisWidth);
                }

                // Even grosser, or is it just javascript-fu??
                columnDef.filterValues = Array.from(columnDef.filterValues.values()).sort();

                // We constrain the max column width to be the max header or cell width, but no
                // wider the the MAX_CELL_WIDTH
                const maxWidth = Math.min(Math.max(headerWidth, maxCellWidth), MAX_CELL_WIDTH);
                columnDef.width = Math.ceil(maxWidth);
            }
            document.body.removeChild(testNodeContainer);

            // // Now get the width of the scrollbar, if any.
            // const scrollbarWidth = this.bodyRef.current.offsetWidth - this.bodyRef.current.clientWidth;
            // // this.headerRef.current.style.marginRight = `${scrollbarWidth}px`;
            // this.headerRef.current.style.borderRight = `${scrollbarWidth}px solid rgba(235, 235, 235, 1)`;
            // this.headerRef.current.style.borderRadius = '4px';
        }

        renderHeader() {
            return this.props.columns.map((columnDef, columnNumber) => {
                return html`
                    <${HeaderCell} 
                        def=${columnDef} 
                        index=${columnNumber} 
                        showMenu=${true} 
                        onFilter=${(filterValue) => {this.doFilterColumn(columnDef, columnNumber, filterValue);}} 
                        onSort=${(direction) => {this.doSortColumn(columnDef, columnNumber, direction);}} 
                        onClearFilter=${this.doClearFilter.bind(this)}/>
               `;
            });
        }

        renderHeaderWithMenu() {
            return this.props.columns.map((columnDef, columnNumber) => {
                return html`
                   <${HeaderCell} def=${columnDef} index=${columnNumber} />
               `;
            });
        }

        sortTable(table, columnDef, columnNumber, direction) {
            const directionFactor = direction === 'descending' ? -1 : 1;
            table.sort((aRow, bRow) => {
                const a = aRow.data[columnNumber];
                const b = bRow.data[columnNumber];
                if (a === b) {
                    return 0;
                }
                if (typeof a === 'undefined' || a === null) {
                    return directionFactor * -1;
                }
                if (typeof b === 'undefined' || b === null) {
                    return directionFactor * 1;
                }
                switch (columnDef.type) {
                case 'string':
                    return directionFactor * a.localeCompare(b);
                case 'number':
                    return directionFactor * (a - b);
                }
            });
        }

        doResetSort() {
            this.state.table.sort((a, b) => {
                return a.data[0] - b.data[0];
            });
            this.setState({
                table: this.state.table.slice()
            });
        }

        doSortColumn(columnDef, columnNumber, direction) {
            this.sortTable(this.state.table, columnDef, columnNumber, direction);
            this.setState({
                table: this.state.table.slice(),
                currentSort: {
                    columnDef,
                    direction
                }
            });
        }

        doClearFilter() {
            this.state.table.forEach((row) => {
                row.state.hidden = false;
            });
            const {height, width} = this.calcSpreadsheetDimensions();
            this.setState({
                table: this.state.table.slice(),
                dimensions: {height, width},
                currentFilter: null
            });
        }

        doResetAll() {
            this.state.table.forEach((row) => {
                row.state.hidden = false;
            });
            this.state.table.sort((a, b) => {
                return a.data[0] - b.data[0];
            });
            const {height, width} = this.calcSpreadsheetDimensions();
            this.setState({
                table: this.state.table.slice(),
                dimensions: {height, width},
                currentFilter: null,
                currentSearch: null,
                currentSort: null,
                subsetCount: null
            });
        }

        doFilterColumn(columnDef, columnNumber, filterValue) {
            let count = 0;
            const filterRegexp = new RegExp(filterValue, 'i');
            this.state.table.forEach((row) => {
                // an empty filter is the same as matching all.
                if (filterValue === '') {
                    row.state.hidden = false;
                    return;
                }
                let rowValue = row.data[columnNumber];
                if (typeof rowValue === 'undefined') {
                    row.state.hidden = true;
                    return;
                }
                if (typeof rowValue === 'object') {
                    row.state.hidden = true;
                    return;
                }
                if (typeof rowValue === 'number') {
                    rowValue = String(rowValue);
                }
                if (rowValue.match(filterRegexp)) {
                    row.state.hidden = false;
                    count += 1;
                } else {
                    row.state.hidden = true;
                }
            });

            this.setState({
                table: this.state.table.slice(),
                currentFilter: {
                    columnDef,
                    value: filterValue
                },
                subsetCount: count
            }, () => {
                const {height, width} = this.calcSpreadsheetDimensions();
                this.setState({
                    table: this.state.table.slice(),
                    dimensions: {height, width}
                });
            });
        }

        // componentDidUpdate() {
        //     this.calcSpreadsheetDimensions();
        // }

        calcSpreadsheetDimensions() {
            // Height is simply the sum of all the row heights, which is fixed at ROW_HEIGHT.
            const height = this.state.table
                .filter((row) => {
                    return !row.state.hidden;
                })
                .length * ROW_HEIGHT;

            // Width is the cumulative width of all of the columns, which was calculated by
            // measureColumnWidths.
            const width = this.props.columns.reduce((total, def) => {
                total += def.width;
                return total;
            }, 0);

            return {height, width};
        }

        calcColumns() {
            const body = this.bodyRef.current;
            if (!body) {
                return;
            }

            const {width, height} = outerDimensions(body);
            this.firstRow = Math.floor(body.scrollTop / ROW_HEIGHT);
            this.lastRow = this.firstRow + Math.ceil(height / ROW_HEIGHT);

            const firstCol = (() => {
                let rowWidth = 0;
                const left = body.scrollLeft;
                for (let i = 0; i < this.props.columns.length; i += 1) {
                    const def = this.props.columns[i];
                    if (left >= rowWidth && left < (rowWidth + def.width)) {
                        return i;
                    }
                    rowWidth += def.width;
                }
            })();

            const lastCol = (() => {
                let rowWidth = 0;
                const right = body.scrollLeft + width;
                for (let i = 0; i < this.props.columns.length; i += 1) {
                    const def = this.props.columns[i];
                    if (rowWidth >= right) {
                        return i;
                    }
                    rowWidth += def.width;
                }
                // console.warn('dropped off bottom', rowWidth, right);
                return this.props.columns.length - 1;
            })();

            this.setState({
                firstCol, lastCol
            });
        }

        doMeasurements() {
            const spreadsheetHeight = this.props.table
                .filter((row) => {
                    return !row.state.hidden;
                })
                .length * ROW_HEIGHT;
            const spreadsheetWidth = this.props.columns.reduce((total, def) => {
                total += def.width;
                return total;
            }, 0);

            const body = this.bodyRef.current;
            if (!body) {
                return;
            }

            const {width, height} = outerDimensions(body);
            this.firstRow = Math.floor(body.scrollTop / ROW_HEIGHT);
            this.lastRow = this.firstRow + Math.ceil(height / ROW_HEIGHT);

            this.firstCol = (() => {
                let rowWidth = 0;
                const left = body.scrollLeft;
                for (let i = 0; i < this.props.columns.length; i += 1) {
                    const def = this.props.columns[i];
                    if (left >= rowWidth && left < (rowWidth + def.width)) {
                        return i;
                    }
                    rowWidth += def.width;
                }
            })();

            this.lastCol = (() => {
                let rowWidth = 0;
                const right = body.scrollLeft + width;
                for (let i = 0; i < this.props.columns.length; i += 1) {
                    const def = this.props.columns[i];
                    if (rowWidth >= right) {
                        return i;
                    }
                    rowWidth += def.width;
                }
                // console.warn('dropped off bottom', rowWidth, right);
                return this.props.columns.length - 1;
            })();

            const columns = this.props.columns.slice(this.firstCol, this.lastCol);

            this.setState({
                dimensions: {
                    width: spreadsheetWidth,
                    height: spreadsheetHeight
                },
                columns
            });
        }

        renderCell(cellValue, columnDef) {
            if (typeof cellValue === 'undefined' || cellValue === null) {
                return common.na();
            }
            if (columnDef.format) {
                cellValue = this.formatValue(cellValue, columnDef.format);
            }

            // if (controlledField.units) {
            //     units = html`${' '}<i>${controlledField.units}</i>`;
            // } else {
            //     units = '';
            // }

            return html`<span>${cellValue}</span>`;
        }

        renderBody() {
            // Another nested loop of (samples, columnDefs).
            // for each sample
            // for the template fields
            // for each template field, find the sample field and render a cell
            if (this.state.firstCol === null) {
                return;
            }

            const cols = this.props.columns.slice(this.state.firstCol, this.state.lastCol + 1);
            const leftMargin = this.props.columns.slice(0, this.state.firstCol)
                .reduce((margin, def) => {
                    return margin + def.width;
                }, 0);

            const displayRows = [];
            const viewedTable = this.state.table
                .filter((row) => {return !row.state.hidden;})
                .slice(this.firstRow, this.lastRow + 1);

            viewedTable.forEach((row, rowCount) => {
                let totalWidth = leftMargin;
                const rowStyle= {
                    top: (this.firstRow + rowCount) * ROW_HEIGHT,
                    right: '0',
                    // bottom: String(spreadsheetHeight - (rowCount * ROW_HEIGHT + ROW_HEIGHT)),
                    left: '0',
                    height: ROW_HEIGHT
                };

                const displayRow = cols.map((columnDef, columnNumber) => {
                    const style = {
                        top: '0',
                        left: totalWidth,
                        width: columnDef.width,
                        height: ROW_HEIGHT
                    };

                    totalWidth += columnDef.width;

                    const cellValue = row.data[columnNumber + this.state.firstCol];

                    // TODO: add back in tooltip / title support to renderCell.
                    // title=${sampleField}
                    return html`
                        <div className="Spreadsheet-cell Spreadsheet-sample-field" 
                            style=${style} 
                            role="cell"
                            data-k-b-testhook-cell=${columnDef.key}>
                            <div className="Spreadsheet-cell-content" >
                                ${this.renderCell(cellValue, columnDef)}
                            </div>
                        </div>
                    `;
                });
                displayRows.push(html`
                    <div className="Spreadsheet-grid-row" 
                         style=${rowStyle}
                         role="row">
                        ${displayRow}
                    </div>
                `);
            });
            return html`
             <div className="Spreadsheet-grid" 
                  style=${{top: 0, left: 0, width: `${this.state.dimensions.width}px`, height: `${this.state.dimensions.height}px`}}>
                ${displayRows}
            </div>
            `;
        }

        renderSpreadsheet() {
            const headerStyle = {
                borderRight: `${this.state.scrollbarWidth || 0}px solid rgba(235, 235, 235, 1)`,
                borderRadius: '4px'
            };
            const result = html`
                <div className="Spreadsheet-container">
                    <div className="Spreadsheet-header" style=${headerStyle} ref=${this.headerRef}>
                        <div className="Spreadsheet-header-container">
                            ${this.renderHeader()}
                        </div>
                    </div>
                    <div className="Spreadsheet-body" ref=${this.bodyRef} 
                         onScroll=${this.handleBodyScroll.bind(this)}>
                        ${this.renderBody()}
                    </div>
                </div>
            `;

            return result;
        }

        renderEmpty() {
            return html`
                <div class="alert alert-warning">
                <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no data in this table.
                </div>
            `;
        }

        clearSearch() {
            this.state.table.forEach((row) => {
                row.state.hidden = false;
            });
            const {height, width} = this.calcSpreadsheetDimensions();
            this.setState({
                table: this.state.table.slice(),
                dimensions: {height, width},
                currentSearch: null
            });
        }

        doSearch(query) {
            let count = 0;
            const searchRegexp = new RegExp(query, 'i');
            this.state.table.forEach((row) => {
                // an empty filter is the same as matching all.
                if (query === '') {
                    row.state.hidden = false;
                    return;
                }
                if (row.searchData.match(searchRegexp)) {
                    row.state.hidden = false;
                    count += 1;
                } else {
                    row.state.hidden = true;
                }
            });

            this.setState({
                table: this.state.table.slice(),
                currentSearch: {
                    query
                },
                subsetCount: count
            }, () => {
                const {height, width} = this.calcSpreadsheetDimensions();
                this.setState({
                    table: this.state.table.slice(),
                    dimensions: {height, width}
                });
            });
        }

        doSearchChange(event) {
            const query = event.target.value;
            if (!query) {
                this.clearSearch();
            }
            this.doSearch(query);
        }

        getColumn(key) {
            return this.columnDefMap[key];
        }

        renderToolbar() {
            return html`
            <${Toolbar} 
                        currentSort=${this.state.currentSort}
                        onSort=${this.doSortColumn.bind(this)}
                        onClearSort=${this.doResetSort.bind(this)}
                        

                        currentFilter=${this.state.currentFilter}
                        onFilter=${this.doFilterColumn.bind(this)}
                        onClearFilter=${this.doClearFilter.bind(this)}

                        currentSearch=${this.state.currentSearch}
                        onSearch=${this.doSearch.bind(this)}
                        onClearSearch=${this.clearSearch.bind(this)} 


                        columns=${this.props.columns}
                        total=${this.props.table.length}
                        subsetCount=${this.state.subsetCount}
                        getColumn=${this.getColumn.bind(this)} 
                        onReset=${this.doResetAll.bind(this)} />
            `;
        }

        render() {
            if (this.props.table === 0) {
                return this.renderEmpty();
            }
            return html`
            <div className="Spreadsheet-wrapper">
                <div className="Spreadsheet">
                    ${this.renderToolbar()}
                    ${this.renderSpreadsheet()}
                </div>
            </div>
            `;
        }
    }

    return Spreadsheet;
});
