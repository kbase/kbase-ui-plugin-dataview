define([
    'preact',
    'htm',
    'components/common',
    '../../../../ResizeObserver',
    './DropdownMenu',

    'css!./Spreadsheet2.css'
], function (
    preact,
    htm,
    common,
    ResizeObserver2,
    DropdownMenu
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

    class Spreadsheet extends Component {
        constructor(props) {
            super(props);

            this.bodyRef = preact.createRef();
            this.headerRef = preact.createRef();
            this.firstRow = null;
            this.lastRow = null;
            this.firstCol = null;
            this.lastCol = null;

            this.observer = new ResizeObserver2(this.bodyObserver.bind(this));

            // Just for now ... a better impl is a spreadsheet data source.
            this.state = {
                table: this.props.table.slice(),
                currentSort: {
                    column: null,
                    direction: null
                },
                columnMenu: null
            };
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
            this.measureColumnWidths();
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
                this.setState({
                    triggerRefresh: new Date().getTime()
                });
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
            cellTestNode.classList = ['Spreadsheet2-cell-measurer'];

            const cellTestInnerNode = document.createElement('div');
            cellTestNode.appendChild(cellTestInnerNode);
            cellTestInnerNode.classList = ['Spreadsheet2-cell-content-measurer'];

            const headerTestNode = document.createElement('div');
            testNodeContainer.appendChild(headerTestNode);
            headerTestNode.classList = ['Spreadsheet2-cell-measurer'];

            const headerTestInnerNode = document.createElement('div');
            headerTestNode.appendChild(headerTestInnerNode);
            headerTestInnerNode.classList = ['Spreadsheet2-header-cell-content-measurer'];

            return {testNodeContainer, cellTestNode, cellTestInnerNode, headerTestNode, headerTestInnerNode};
        }

        renderColumnHeader(columnDef, columnNumber) {
            const [sortIcon, sortControl] = (() => {
                if (this.state.currentSort.column === columnDef.key) {
                    if (this.state.currentSort.direction === 1) {
                        return ['fa-sort-asc', '-active'];
                    } else {
                        return ['fa-sort-desc', '-active'];
                    }
                } else {
                    return ['fa-sort', ''];
                }
            })();

            return html`
            <${preact.Fragment}>
                <div className="Spreadsheet2-cell-content" title=${columnDef.title}>
                    ${columnDef.title}
                </div>
               
                <div className=${`Spreadsheet2-header-cell-sort-control ${sortControl}`}>
                    <span className=${`fa ${sortIcon}`}></span>
                </div>
            <//>
            `;
        }

        renderAndMeasure(content, contentNode, measurementNode) {
            preact.render(content, contentNode);
            return outerWidth(measurementNode);
        }

        measureColumnWidths() {
            const {testNodeContainer, cellTestNode, cellTestInnerNode, headerTestNode, headerTestInnerNode} = this.createTestNodes();
            const measures = {};

            for (let i = 0; i < this.props.columns.length; i += 1) {
                const columnDef = this.props.columns[i];

                // Measure column header width.
                const headerWidth = this.renderAndMeasure(this.renderColumnHeader(columnDef), headerTestInnerNode, headerTestNode);
                // headerTestInnerNode.innerText = columnDef.title;
                // const headerWidth = outerWidth(headerTestNode);

                // Get max widths for all row values for this column.
                let maxCellWidth = 0;
                for (let j = 0; j < this.props.table.length; j += 1) {
                    const row = this.props.table[j];
                    const cellValue = row[i];

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

                // We constrain the max column width to be the max header or cell width, but no
                // wider the the MAX_CELL_WIDTH
                const maxWidth = Math.min(Math.max(headerWidth, maxCellWidth), MAX_CELL_WIDTH);
                // console.log('hmm', headerWidth, maxCellWidth, maxWidth);
                columnDef.width = Math.ceil(maxWidth);
            }
            document.body.removeChild(testNodeContainer);
        }

        renderHeader() {
            return this.props.columns.map((columnDef, columnNumber) => {
                const classes = ['Spreadsheet2-header-cell'];

                const style = {
                    flexBasis: `${columnDef.width}px`
                };

                return html`
                    <div className=${classes.join(' ')} 
                         onClick=${() => {this.doSortColumn(columnDef, columnNumber);}}
                         style=${style}
                         role="cell"
                         data-k-b-testhook-cell=${columnDef.key}>
                        ${this.renderColumnHeader(columnDef, columnNumber)}
                    </div>
               `;
            });
        }

        doSortColumn(columnDef, columnNumber) {
            if (this.state.currentSort.direction === -1) {
                this.setState({
                    table: this.props.table.slice(),
                    currentSort: {
                        column: null,
                        direction: null
                    }
                });
                return;
            }

            const direction = (() => {
                if (this.state.currentSort.column === columnDef.key) {
                    return this.state.currentSort.direction === 1 ? -1 : 1;
                }
                return 1;
            })();

            const table = this.state.table.sort((aRow, bRow) => {
                const a = aRow[columnNumber];
                const b = bRow[columnNumber];
                if (typeof a === 'undefined' || a === null) {
                    return direction * -1;
                }
                if (typeof b === 'undefined' || b === null) {
                    return direction * 1;
                }
                switch (columnDef.type) {
                case 'string':
                    return direction * a.localeCompare(b);
                case 'number':
                    return direction * (a - b);
                }
            }).slice();

            this.setState({
                table,
                currentSort: {
                    column: columnDef.key,
                    direction
                }
            });
        }

        doMeasurements() {
            this.spreadsheetHeight = this.props.table.length * ROW_HEIGHT;
            this.spreadsheetWidth = this.props.columns.reduce((total, def) => {
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
            if (this.firstCol === null) {
                return;
            }

            const cols = this.props.columns.slice(this.firstCol, this.lastCol + 1);
            const leftMargin = this.props.columns.slice(0, this.firstCol)
                .reduce((margin, def) => {
                    return margin + def.width;
                }, 0);

            const displayRows = [];
            const viewedTable = this.state.table.slice(this.firstRow, this.lastRow + 1);

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

                    const cellValue = row[columnNumber + this.firstCol];

                    // TODO: add back in tooltip / title support to renderCell.
                    // title=${sampleField}
                    return html`
                        <div className="Spreadsheet2-cell Spreadsheet2-sample-field" 
                            style=${style} 
                            role="cell"
                            data-k-b-testhook-cell=${columnDef.key}>
                            <div className="Spreadsheet2-cell-content" >
                                ${this.renderCell(cellValue, columnDef)}
                            </div>
                        </div>
                    `;
                });
                displayRows.push(html`
                    <div className="Spreadsheet2-grid-row" 
                         style=${rowStyle}
                         role="row">
                        ${displayRow}
                    </div>
                `);
            });
            return html`
             <div className="Spreadsheet2-grid" 
                  style=${{top: 0, left: 0, width: `${this.spreadsheetWidth}px`, height: `${this.spreadsheetHeight}px`}}>
                ${displayRows}
            </div>
            `;
        }

        renderSpreadsheet() {
            this.doMeasurements();
            const result = html`
                <div className="Spreadsheet2-container">
                    <div className="Spreadsheet2-header" ref=${this.headerRef}>
                        <div className="Spreadsheet2-header-container">
                            ${this.renderHeader()}
                        </div>
                    </div>
                    <div className="Spreadsheet2-body" ref=${this.bodyRef} 
                         onScroll=${this.handleBodyScroll.bind(this)}
                         >
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

        render() {
            if (this.props.table === 0) {
                return this.renderEmpty();
            }
            return html`
            <div className="Spreadsheet">
                ${this.renderSpreadsheet()}
            </div>
            `;
        }
    }

    return Spreadsheet;
});
