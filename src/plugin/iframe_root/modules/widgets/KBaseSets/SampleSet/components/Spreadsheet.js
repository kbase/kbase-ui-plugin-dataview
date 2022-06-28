define([
    'preact',
    'htm',
    'components/common',
    'ResizeObserver',
    'components/DropdownMenu',
    'components/Popup',
    './Toolbar',
    'components/Empty',
    './Spreadsheet.styles',
    '../constants',

    'css!./Spreadsheet.css'
], (
    {Component, h, Fragment, createRef, render},
    htm,
    {none},
    ResizeObserver,
    DropdownMenu,
    Popup,
    Toolbar,
    Empty,
    styles,
    {MAX_CELL_WIDTH, ROW_HEIGHT}
) => {
    const html = htm.bind(h);

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
                                    this.doFilter(`^${value}$`);
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
                    }, {
                        title: 'Quick Filter',
                        dataMenu: filterMenu
                    }]
                };
            })();

            const menuStyle = Object.assign({}, styles.Spreadsheet_header_cell_menu);
            if (this.state.isActive || this.state.isStickyOpen) {
                menuStyle.visibility = 'visible';
            }

            return html`
                <${Fragment}>
                    <div style=${styles.Spreadsheet_cell_content} title=${columnDef.title}>
                        ${columnDef.title}
                    </div>

                    <div style=${menuStyle}>
                        <${Popup} overlaySelector=".Spreadsheet-wrapper"
                                  scrollSelector=".Spreadsheet-header"
                                  containerTop=${0}
                                  onOpen=${this.onPopupOpen.bind(this)}
                                  onClose=${this.onPopupClose.bind(this)}>
                            <${DropdownMenu} menu=${menu} onClose=${this.onPopupClose.bind(this)}/>
                            </
                            />
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
            const style = Object.assign({}, styles.Spreadsheet_header_cell);

            style.flexBasis = `${this.props.def.width}px`;

            const columnDef = this.props.def;
            const columnNumber = this.props.index;

            return html`
                <div style=${style}
                     onMouseEnter=${() => {
        this.doMouseEnterHeaderCell(columnDef);
    }}
                     onMouseLeave=${() => {
        this.doMouseLeaveHeaderCell(columnDef);
    }}
                     role="cell"
                     data-k-b-testhook-cell=${columnDef.key}>
                    ${this.renderCell(columnDef, columnNumber)}
                </div>`;
        }
    }

    class HeaderUnitCell extends Component {
        constructor(props) {
            super(props);

            this.state = {
                sortDirection: null,
                isActive: false,
                isStickyOpen: false
            };
        }

        renderCell() {
            const columnDef = this.props.def;

            const menuStyle = Object.assign({}, styles.Spreadsheet_header_cell_menu);
            if (this.state.isActive || this.state.isStickyOpen) {
                menuStyle.visibility = 'visible';
            }

            return html`
                <${Fragment}>
                    <div style=${styles.Spreadsheet_cell_unit} title=${columnDef.unit}>
                        ${columnDef.unit}
                    </div>
                <//>
            `;
        }

        render() {
            const style = Object.assign({}, styles.Spreadsheet_header_cell);

            style.flexBasis = `${this.props.def.width}px`;

            const columnDef = this.props.def;
            const columnNumber = this.props.index;

            return html`
                <div style=${style}
                     role="cell"
                     data-k-b-testhook-cell=${columnDef.key}>
                    ${this.renderCell(columnDef, columnNumber)}
                </div>`;
        }
    }

    class Spreadsheet extends Component {
        constructor(props) {
            super(props);

            this.bodyRef = createRef();
            this.headerRef = createRef();
            this.firstRow = null;
            this.lastRow = null;

            this.observer = new ResizeObserver(this.bodyObserver.bind(this));

            // Just for now ... a better impl is a spreadsheet data source.
            // analyze table values...

            const table = this.props.table.map(({entity, data}, index) => {
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
                    entity,
                    data
                };
            });

            this.columnDefMap = this.props.columns.reduce((columnDefMap, def) => {
                columnDefMap[def.key] = def;
                return columnDefMap;
            }, {});

            this.state = {
                table,
                currentFilter: {
                    columnDef: null,
                    value: null
                },
                currentSort: {
                    columnDef: this.props.columns[0],
                    direction: 'ascending'
                },
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

        handleBodyScroll(e) {
            if (!this.headerRef.current) {
                return;
            }
            this.headerRef.current.scrollLeft = e.target.scrollLeft;

            if (this.scrollTimer) {
                return;
            }

            this.scrollTimer = window.setTimeout(() => {
                this.calcColumns();
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

        setStyles(node, styles) {
            Object.entries(styles).forEach(([name, value]) => {
                node.style.setProperty(name, value);
            });
        }

        createTestNode(container, cellType) {
            const testNode = document.createElement('div');
            container.appendChild(testNode);
            this.setStyles(testNode, styles[`Spreadsheet_${cellType}_measurer`]);

            const testInnerNode = document.createElement('div');
            testNode.appendChild(testInnerNode);
            this.setStyles(testInnerNode, styles[`Spreadsheet_${cellType}_content_measurer`]);

            return [testNode, testInnerNode];
        }

        createTestNodes() {
            const testNodeContainer = document.createElement('div');
            testNodeContainer.position = 'absolute';
            document.body.appendChild(testNodeContainer);

            const [cellTestNode, cellTestInnerNode] = this.createTestNode(testNodeContainer, 'cell');
            const [headerTestNode, headerTestInnerNode] = this.createTestNode(testNodeContainer, 'header_cell');
            const [unitTestNode, unitTestInnerNode] = this.createTestNode(testNodeContainer, 'header_cell');

            return {
                testNodeContainer, cellTestNode, cellTestInnerNode, headerTestNode, headerTestInnerNode,
                unitTestNode, unitTestInnerNode
            };
        }

        renderAndMeasure(content, contentNode, measurementNode) {
            render(content, contentNode);
            return outerWidth(measurementNode);
        }

        measureColumnWidths() {
            const {
                testNodeContainer,
                cellTestNode,
                cellTestInnerNode,
                headerTestNode,
                headerTestInnerNode,
                unitTestNode,
                unitTestInnerNode
            } = this.createTestNodes();
            const measures = {};

            // also gather values for columns for filtering.

            for (let i = 0; i < this.props.columns.length; i += 1) {
                const columnDef = this.props.columns[i];

                // Yeah, I know, modifying the column def again.
                // Should take care of this in a data module wrapping the spreadsheet.
                columnDef.filterValues = new Set();

                // Measure column header width.
                const headerWidth = this.renderAndMeasure(html`
                    <${HeaderCell} def=${columnDef}/>`, headerTestInnerNode, headerTestNode);
                // Measure unit header width.
                const unitHeaderWidth = this.renderAndMeasure(html`
                    <${HeaderUnitCell} def=${columnDef}/>`, unitTestInnerNode, unitTestNode);

                // Get max width for all values for this column, across all rows
                let maxCellWidth = 0;
                for (let j = 0; j < this.props.table.length; j += 1) {
                    const row = this.props.table[j];
                    const cellValue = row.data[i];

                    if (cellValue !== null && typeof cellValue !== 'undefined' && cellValue !== '') {
                        columnDef.filterValues.add(cellValue);
                    }

                    let thisWidth;
                    if (measures[cellValue]) {
                        thisWidth = measures[cellValue];
                    } else {
                        const cellWidth = this.renderAndMeasure(this.renderCell(cellValue, columnDef), cellTestInnerNode, cellTestNode);
                        measures[cellValue] = cellWidth;
                        thisWidth = cellWidth;
                    }
                    maxCellWidth = Math.max(maxCellWidth, thisWidth);
                }

                // Even grosser, or is it just javascript-fu??
                columnDef.filterValues = Array.from(columnDef.filterValues.values()).sort();

                // We constrain the max column width to be the greater of either header or cell width,
                // but no wider the the MAX_CELL_WIDTH
                // TODO: deal with the group header; for now, it is assumed to be smaller than the
                // spans it covers...

                const maxWidth = Math.min(Math.max(headerWidth, unitHeaderWidth, maxCellWidth), MAX_CELL_WIDTH);
                columnDef.width = Math.ceil(maxWidth);
            }
            document.body.removeChild(testNodeContainer);
        }

        renderHeaderGroups() {
            let colsSoFar = 0;
            const result = this.props.columnGroups.map((columnGroup) => {
                // get width of this span.

                const columns = this.props.columns.slice(colsSoFar, colsSoFar + columnGroup.count);
                colsSoFar += columnGroup.count;
                const width = columns.reduce((width, column) => {
                    return width + column.width;
                }, 0);

                const style = Object.assign({}, styles.Spreadsheet_header_cell);

                style.flexBasis = `${width}px`;
                // create a simple div for now.
                return html`
                    <div style=${style} role="cell">
                        ${columnGroup.title}
                    </div>
                `;
            });
            // const style = Object.assign({}, styles.Spreadsheet_header_cell);
            // style.flexBasis = `${this.props.columns[0].width}px`;

            // result.unshift(html`
            //     <div style=${style} role="cell"></div>
            // `);
            return result;
        }

        renderHeaderUnits() {
            return this.props.columns.map((columnDef, columnNumber) => {
                return html`
                    <${HeaderUnitCell}
                            def=${columnDef}
                            index=${columnNumber}/>
                `;
            });
        }

        renderHeader() {
            return this.props.columns.map((columnDef, columnNumber) => {
                return html`
                    <${HeaderCell}
                            def=${columnDef}
                            index=${columnNumber}
                            showMenu=${true}
                            onFilter=${(filterValue) => {
        this.doFilter(columnDef, filterValue);
    }}
                            onSort=${(direction) => {
        this.doSortColumn(columnDef, direction);
    }}
                            onClearFilter=${this.doClearFilter.bind(this)}/>
                `;
            });
        }

        sortTable(table, columnDef, direction) {
            const directionFactor = direction === 'descending' ? -1 : 1;
            table.sort((aRow, bRow) => {
                const a = aRow.data[columnDef.index];
                const b = bRow.data[columnDef.index];
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

        doSortColumn(columnDef, direction) {
            this.sortTable(this.state.table, columnDef, direction);
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
                currentFilter: {
                    columnDef: null,
                    value: null
                }
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
                currentFilter: {
                    columnDef: null,
                    value: null
                },
                currentSort: {
                    columnDef: this.props.columns[0],
                    direction: 'ascending'
                },
                subsetCount: null
            });
        }

        doFilter(columnDef, filterValue) {
            let count = null;
            const filterRegexp = new RegExp(filterValue, 'i');

            if (!filterValue) {
                this.state.table.forEach((row) => {
                    row.state.hidden = false;
                });
            } else {
                count = 0;
                this.state.table.forEach((row) => {
                    // if column not defined (not selected), search all fields
                    if (columnDef === null) {
                        if (row.searchData.match(filterRegexp)) {
                            row.state.hidden = false;
                            count += 1;
                        } else {
                            row.state.hidden = true;
                        }
                        return;
                    }

                    let rowValue = row.data[columnDef.index];
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
            }

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
                return none();
            }
            if (columnDef.formatter) {
                try {
                    cellValue = columnDef.formatter(cellValue);
                } catch (ex) {
                    cellValue = `**ERR** ${ex.message}`;
                }
            }

            return html`<span title="${cellValue}">${cellValue}</span>`;
        }

        renderEmptyBody() {
            return html`
                <div style=${styles.Spreadsheet_centeringContainer}>
                    <${Empty} message="No matching samples"/>
                </div>
            `;
        }

        doContextMenu(ev) {
            ev.stopPropagation();
            ev.preventDefault();
        }

        renderBody() {
            // Another nested loop of (samples, columnDefs).
            // for each sample
            // for the template fields
            // for each template field, find the sample field and render a cell
            if (this.state.firstCol === null) {
                return;
            }

            // Ge the subset of columns which are currently visible.
            const cols = this.props.columns.slice(this.state.firstCol, this.state.lastCol + 1);
            const leftMargin = this.props.columns.slice(0, this.state.firstCol)
                .reduce((margin, def) => {
                    return margin + def.width;
                }, 0);

            // Get the sub-table resulting from both filtering and the
            // currently displayed first and last rows.
            const viewedTable = this.state.table
                .filter((row) => {
                    return !row.state.hidden;
                })
                .slice(this.firstRow, this.lastRow + 1);

            if (viewedTable.length === 0) {
                return this.renderEmptyBody();
            }

            const displayRows = [];
            viewedTable.forEach((row, rowCount) => {
                let totalWidth = leftMargin;
                const rowStyle = Object.assign({}, styles.Spreadsheet_grid_row, {
                    top: (this.firstRow + rowCount) * ROW_HEIGHT,
                    right: '0',
                    left: '0',
                    height: ROW_HEIGHT
                });

                const displayRow = cols.map((columnDef, columnNumber) => {
                    const cellStyle = Object.assign({}, styles.Spreadsheet_cell, {
                        top: '0',
                        left: totalWidth,
                        width: columnDef.width,
                        height: ROW_HEIGHT
                    });

                    totalWidth += columnDef.width;

                    const cellValue = row.data[columnNumber + this.state.firstCol];

                    return html`
                        <div style=${cellStyle}
                             role="cell"
                             data-k-b-testhook-cell=${columnDef.key}>
                            <div style=${styles.Spreadsheet_cell_content}>
                                ${this.renderCell(cellValue, columnDef)}
                            </div>
                        </div>
                    `;
                });
                // oncontextmenu=${(ev) => {this.doContextMenu(ev, row);}}
                displayRows.push(html`
                    <div style=${rowStyle}
                         class="HoverRow"
                         ondblclick=${(ev) => {
        ev.preventDefault();
        this.props.onRowClick(row.entity);
    }}
                         role="row">
                        ${displayRow}
                    </div>
                `);
            });
            return html`
                <div style=${Object.assign({}, styles.Spreadsheet_grid, {
        top: 0,
        left: 0,
        width: `${this.state.dimensions.width}px`,
        height: `${this.state.dimensions.height}px`
    })}>
                    ${displayRows}
                </div>
            `;
        }

        renderSpreadsheet() {
            const headerStyle = Object.assign({}, styles.Spreadsheet_header, {
                borderRight: `${this.state.scrollbarWidth || 0}px solid rgba(235, 235, 235, 1)`,
            });
            return html`
                <div style=${styles.Spreadsheet_container}>
                    <div className="Spreadsheet-header" style=${headerStyle} ref=${this.headerRef}>
                        <div style=${styles.Spreadsheet_header_container}>
                            ${this.renderHeaderGroups()}
                        </div>
                        <div style=${styles.Spreadsheet_header_container}>
                            ${this.renderHeader()}
                        </div>
                        <div style=${styles.Spreadsheet_header_container}>
                            ${this.renderHeaderUnits()}
                        </div>
                    </div>
                    <div style=${styles.Spreadsheet_body} ref=${this.bodyRef}
                         onScroll=${this.handleBodyScroll.bind(this)}>
                        ${this.renderBody()}
                    </div>
                </div>
            `;
        }

        renderEmpty() {
            return html`
                <${Empty} message="No samples in this SampleSet"/>
            `;
        }

        applySearchFilter() {

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
                        onFilter=${this.doFilter.bind(this)}
                        onClearFilter=${this.doClearFilter.bind(this)}

                        columns=${this.props.columns}
                        total=${this.props.table.length}
                        subsetCount=${this.state.subsetCount}
                        getColumn=${this.getColumn.bind(this)}
                        onReset=${this.doResetAll.bind(this)}
                />
            `;
        }

        render() {
            if (this.props.table === 0) {
                return this.renderEmpty();
            }
            return html`
                <div style=${styles.Spreadsheet_outer}>
                    ${this.renderToolbar()}
                    <div style=${styles.Spreadsheet_wrapper} className="Spreadsheet-wrapper">
                        <div style=${styles.Spreadsheet}>
                            ${this.renderSpreadsheet()}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    return Spreadsheet;
});
