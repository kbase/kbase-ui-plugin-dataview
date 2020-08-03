define([
    'preact',
    'htm',
    'components/common',
    '../../../../ResizeObserver',
    'yaml!../data/templates/enigma1.yml',
    'yaml!../data/templates/sesar1.yml',
    'yaml!../data/metadataValidation.yml',
    'yaml!../data/sampleUploaderSpecs.yml',

    'css!./Spreadsheet.css'
], function (
    preact,
    htm,
    common,
    ResizeObserver2,
    enigmaTemplate,
    sesarTemplate,
    fieldDefinitions,
    sampleUploaderSpecs
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
            this.columnDefs = this.createColumnDefs();
            this.firstRow = null;
            this.lastRow = null;
            this.firstCol = null;
            this.lastCol = null;

            this.observer = new ResizeObserver2(this.bodyObserver.bind(this));
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

        extractSources(sampleSet) {
            const sources = sampleSet.samples.reduce((sources, sample) => {
                sources.add(sample.sample.dataSourceDefinition.id);
                return sources;
            }, new Set());
            return Array.from(sources);
        }

        formatValue(value, formatter) {
            if (!formatter) {
                return value;
            }

            switch (formatter.type) {
            case 'numeric':
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

        createColumnDefs() {
            const sources = this.extractSources(this.props.sampleSet);
            if (sources.length === 0) {
                throw new Error('No source could be determined');
            }
            if (sources.length > 1) {
                throw new Error('Too many sources, cannot show spreadsheet view');
            }

            const source = sources[0];

            // const columnDefs = sesarTemplateX.columns.slice(0);
            const templateDef = (() => {
                switch (source) {
                case 'SESAR':
                    return sesarTemplate;
                case 'ENIGMA':
                    return enigmaTemplate;
                }
            })();
            const columnMapping = sampleUploaderSpecs[source].column_mapping;
            const reverseColumnMapping = Object.entries(columnMapping).reduce((mapping, [key, value]) => {
                mapping[value] = key;
                return mapping;
            }, {});

            // Here we build up column definitions for all of the columns in the template,
            // retaining order.
            // Some columns are "mapped" to sample fields rather than metadata.
            const columnDefs = templateDef.columns.map((key) => {
                if (reverseColumnMapping[key]) {
                    const mappedKey = reverseColumnMapping[key];
                    const mappedDef = fieldDefinitions.validators[mappedKey];
                    if (mappedDef) {
                        return {
                            type: 'node',
                            key,
                            label: mappedDef.key_metadata.display_name,
                            format: mappedDef.format
                        };
                    }
                    console.warn('Mapped NOT FOUND', key);
                    return {
                        type: 'unknown',
                        key,
                        label: key
                    };
                }
                const def = fieldDefinitions.validators[key];
                if (!def) {
                    console.warn('NOT FOUND', key);
                    return {
                        type: 'unknown',
                        key,
                        label: key
                    };
                }
                return {
                    type: 'metadata',
                    key,
                    label: def.key_metadata.display_name,
                    format: def.format
                };
            });


            // scour the samples to add user fields; user fields go at the end of the column definitions.
            // They use the column type 'user'.
            const userFieldMapping = {};
            this.props.sampleSet.samples.forEach((sample) => {
                Object.keys(sample.sample.node_tree[0].meta_user).forEach((key) => {
                    if (userFieldMapping[key]) {
                        return;
                    }
                    const newDef = {
                        key,
                        label: key,
                        type: 'user'
                    };
                    userFieldMapping[key] = newDef;
                    columnDefs.push(newDef);
                });
            });

            this.measureColumnWidths(columnDefs);

            return columnDefs;
        }

        measureColumnWidths(columnDefs) {
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

            const measures = {};

            columnDefs.forEach((columnDef) => {
                // Measure column header width.
                headerTestInnerNode.innerText = columnDef.label;
                const headerWidth = outerWidth(headerTestNode);

                // Get max widths for all row values for this column.
                let width = headerWidth;
                this.props.sampleSet.samples.forEach((sample) => {
                    const content = (() => {
                        switch (columnDef.type) {
                        case 'sample':
                            var sampleField = sample.sample[columnDef.key];
                            if (sampleField) {
                                return `${sampleField}`;
                            }
                            break;
                        case 'node':
                            var nodeField = sample.sample.node_tree[0][columnDef.key];
                            if (nodeField) {
                                return `${nodeField}`;
                            }
                            break;
                        case 'metadata':
                            return (() => {
                                const controlledField = sample.sample.node_tree[0].meta_controlled[columnDef.key];
                                if (!controlledField) {
                                    return common.na();
                                }
                                let units;
                                if (controlledField.units) {
                                    units = `<i style="margin-left: 10px">${controlledField.units}</i>`;
                                } else {
                                    units = '';
                                }
                                const content = `<span>${this.formatValue(controlledField.value, columnDef.format)}${units}</span>`;
                                return content;
                            })();
                        case 'user':
                            var userField = sample.sample.node_tree[0].meta_user[columnDef.key];
                            if (userField) {
                                return `${userField.value}`;
                            }
                            break;
                        case 'unknown':
                            var unknownField = sample.sample.node_tree[0].meta_user[columnDef.key];
                            if (unknownField) {
                                return `${unknownField.value}`;
                            }
                            break;
                        }
                    })();

                    const thisWidth = (() => {
                        if (measures[content]) {
                            return measures[content];
                        }
                        cellTestInnerNode.innerHTML = content;
                        const w = outerWidth(cellTestNode);
                        measures[content] = w;
                        return w;
                    })();

                    width = Math.max(width, thisWidth);
                });

                const maxWidth = Math.max(headerWidth, Math.min(width, MAX_CELL_WIDTH));
                columnDef.width = Math.ceil(maxWidth);
            });

            document.body.removeChild(testNodeContainer);
        }

        renderHeader() {
            return this.columnDefs.map((columnDef) => {
                const classes = ['Spreadsheet-header-cell'];
                switch (columnDef.type) {
                case 'sample':
                    classes.push('Spreadsheet-sample-field');
                    break;
                case 'node':
                    classes.push('Spreadsheet-sample-field');
                    break;
                case 'controlled':
                    classes.push('Spreadsheet-controlled-field');
                    break;
                case 'user':
                    classes.push('Spreadsheet-user-field');
                    break;
                case 'unknown':
                    classes.push('Spreadsheet-unknown-field');
                    break;
                }

                const style = {
                    flexBasis: `${columnDef.width}px`
                };

                return html`
                    <div className=${classes.join(' ')} style=${style}>
                        <div className="Spreadsheet-cell-content" title=${columnDef.label}>
                            ${columnDef.label}
                        </div>
                    </div>
               `;
            });
        }

        doMeasurements() {
            this.spreadsheetHeight = this.props.sampleSet.samples.length * ROW_HEIGHT;
            this.spreadsheetWidth = this.columnDefs.reduce((total, def) => {
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
                for (let i = 0; i < this.columnDefs.length; i += 1) {
                    const def = this.columnDefs[i];
                    if (left >= rowWidth && left < (rowWidth + def.width)) {
                        return i;
                    }
                    rowWidth += def.width;
                }
            })();

            this.lastCol = (() => {
                let rowWidth = 0;
                const right = body.scrollLeft + width;
                for (let i = 0; i < this.columnDefs.length; i += 1) {
                    const def = this.columnDefs[i];
                    if (rowWidth >= right) {
                        return i;
                    }
                    rowWidth += def.width;
                }
                console.warn('dropped off bottom', rowWidth, right);
                return this.columnDefs.length - 1;
            })();
        }

        renderBody() {
            // Another nested loop of (samples, columnDefs).
            // for each sample
            // for the template fields
            // for each template field, find the sample field and render a cell
            if (this.firstCol === null) {
                return;
            }

            const samples = this.props.sampleSet.samples.slice(this.firstRow, this.lastRow + 1);
            const cols = this.columnDefs.slice(this.firstCol, this.lastCol + 1);
            const leftMargin = this.columnDefs.slice(0, this.firstCol).reduce((margin, def) => {
                return margin + def.width;
            }, 0);

            const rows = [];
            samples.forEach((sample, rowCount) => {
                let totalWidth = leftMargin;
                const rowStyle= {
                    top: (this.firstRow + rowCount) * ROW_HEIGHT,
                    right: '0',
                    // bottom: String(spreadsheetHeight - (rowCount * ROW_HEIGHT + ROW_HEIGHT)),
                    left: '0',
                    height: ROW_HEIGHT
                };
                const row = cols.map((columnDef) => {
                    const style = {
                        // top: rowCount * ROW_HEIGHT,
                        top: '0',
                        // right: String(spreadsheetWidth - totalWidth + columnDef.width),
                        // bottom: rowCount * ROW_HEIGHT + ROW_HEIGHT,
                        // bottom: '0',
                        left: totalWidth,
                        width: columnDef.width,
                        height: ROW_HEIGHT
                    };

                    totalWidth += columnDef.width;
                    switch (columnDef.type) {
                    case 'sample':
                        var sampleField = sample.sample[columnDef.key];
                        if (!sampleField) {
                            return html`
                                <div className="Spreadsheet-cell Spreadsheet-sample-field" style=${style}>
                                    ${common.na()}
                                </div>
                            `;
                        }
                        return html`
                            <div className="Spreadsheet-cell Spreadsheet-sample-field" style=${style} title=${sampleField}>
                                <div className="Spreadsheet-cell-content" >
                                    ${sampleField}
                                </div>
                            </div>
                        `;
                    case 'node':
                        var nodeField = sample.sample.node_tree[0][columnDef.key];
                        if (!nodeField) {
                            return html`
                                <div className="Spreadsheet-cell Spreadsheet-sample-field" style=${style}>
                                    ${common.na()}
                                </div>
                            `;
                        }
                        return html`
                            <div className="Spreadsheet-cell Spreadsheet-sample-field" style=${style} title=${nodeField}>
                                <div className="Spreadsheet-cell-content">
                                    ${nodeField}
                                </div>
                            </div>
                        `;
                    case 'metadata':
                        return (() => {
                            const controlledField = sample.sample.node_tree[0].meta_controlled[columnDef.key];
                            if (!controlledField) {
                                return html`
                                    <div className="Spreadsheet-cell Spreadsheet-controlled-field" style=${style}>
                                        ${common.na()}
                                    </div>
                                `;
                            }
                            let units;
                            if (controlledField.units) {
                                units = html`<i style=${{marginLeft: '10px'}}>${controlledField.units}</i>`;
                            } else {
                                units = '';
                            }
                            const content = html`<span>${this.formatValue(controlledField.value, columnDef.format)}${units}</span>`;
                            const tooltip = `${this.formatValue(controlledField.value, columnDef.format)} ${controlledField.units || ''}`;
                            return html`
                                <div className="Spreadsheet-cell Spreadsheet-controlled-field" style=${style} title=${tooltip}>
                                    <div className="Spreadsheet-cell-content">
                                        ${content}
                                    </div>
                                </div>
                            `;
                        })();
                    case 'user':
                        return (() => {
                            const userField = sample.sample.node_tree[0].meta_user[columnDef.key];
                            if (!userField) {
                                return html`
                                <div className="Spreadsheet-cell Spreadsheet-user-field" style=${style}>
                                    ${common.na()}
                                </div>
                            `;
                            }
                            return html`
                            <div className="Spreadsheet-cell Spreadsheet-user-field" style=${style} title=${userField.value}>
                                <div className="Spreadsheet-cell-content">
                                    ${userField.value}
                                </div>
                            </div>
                        `;
                        })();
                    case 'unknown':
                        var unknownField = sample.sample.node_tree[0].meta_controlled[columnDef.key];
                        if (!unknownField) {
                            return html`
                                <div className="Spreadsheet-cell Spreadsheet-unknown-field" style=${style}>
                                    ${common.na()}
                                </div>
                            `;
                        }
                        return html`
                            <div className="Spreadsheet-cell Spreadsheet-unknown-field" style=${style}>
                                <div className="Spreadsheet-cell-content">
                                    ${unknownField.value}
                                </div>
                            </div>
                        `;
                    default:
                        return html`
                            <div className="Spreadsheet-cell Spreadsheet-unmapped-field" style=${style}>
                                ${common.na()}
                            </div>
                        `;
                    }

                });
                rows.push(html`
                    <div className="Spreadsheet-grid-row" style=${rowStyle}>
                        ${row}
                    </div>
                `);
            });
            return html`
             <div className="Spreadsheet-grid" 
                  style=${{top: 0, left: 0, width: `${this.spreadsheetWidth}px`, height: `${this.spreadsheetHeight}px`}}>
                ${rows}
            </div>
            `;
        }

        renderSpreadsheet2() {
            this.doMeasurements();
            const result = html`
                <div className="Spreadsheet-container">
                    <div className="Spreadsheet-header" ref=${this.headerRef}>
                        <div className="Spreadsheet-header-container">
                            ${this.renderHeader()}
                        </div>
                    </div>
                    <div className="Spreadsheet-body" ref=${this.bodyRef} 
                         onScroll=${this.handleBodyScroll.bind(this)}
                         >
                        ${this.renderBody()}
                    </div>
                </div>
            `;

            return result;
        }

        render() {
            return html`
            <div className="Spreadsheet">
                ${this.renderSpreadsheet2()}
            </div>
            `;
        }
    }

    return Spreadsheet;
});
