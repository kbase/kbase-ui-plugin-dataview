define([
    'preact',
    'htm',
    'components/common',
    'yaml!../data/templates/enigma1.yml',
    'yaml!../data/templates/sesar1.yml',
    'yaml!../data/metadataValidation.yml',
    'yaml!../data/sampleUploaderSpecs.yml',

    'css!./Spreadsheet.css'
], function (
    preact,
    htm,
    common,
    enigmaTemplate,
    sesarTemplate,
    fieldDefinitions,
    sampleUploaderSpecs
) {
    'use strict';

    const MAX_CELL_WIDTH = 200;

    const {Component } = preact;
    const html = htm.bind(preact.h);

    function outerWidth(el) {
        const rect = el.getBoundingClientRect();
        return rect.right - rect.left;
    }

    class Spreadsheet extends Component {
        constructor(props) {
            super(props);

            this.bodyRef = preact.createRef();
            this.headerRef = preact.createRef();
        }

        componentDidMount() {
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
            // console.log(e.target.scrollLeft);
            if (!this.headerRef.current) {
                return ;
            }
            this.headerRef.current.scrollLeft = e.target.scrollLeft;
            // console.log
        }

        renderSpreadsheet() {
            const sources = this.extractSources(this.props.sampleSet);
            if (sources.length === 0) {
                throw new Error('No source could be determined');
            }
            if (sources.length > 1) {
                throw new Error('Too many sources, cannot show spreadsheet view');
            }

            const source = sources[0];
            // for now, assume all are from the sample template

            // eventually, we may have tabs -- one tab per template

            // but for now ... gather the superset of all sample fields
            // const controlledFieldKeys = {};
            // const userFieldKeys = {};
            // const allKeys = new Set();
            // const fieldDefs = {};

            // this.props.sampleSet.samples.forEach((sample) => {
            //     Object.entries(sample.sample.node_tree[0].meta_user).forEach(([key, ]) => {
            //         fieldDefs[key] = {
            //             key,
            //             width: '10em',
            //             type: 'user'
            //         };
            //     });

            //     Object.entries(sample.sample.node_tree[0].meta_controlled).forEach(([key, ]) => {
            //         fieldDefs[key] = {
            //             key,
            //             width: '10em',
            //             type: 'controlled'
            //         };
            //     });
            // });

            // create an alpha ordered set for now.
            // const sampleFieldDefs = Object.entries(fieldDefs)
            //     .map(([, value]) => {
            //         return value;
            //     })
            //     .sort((a, b) => {
            //         return a.key.localeCompare(b.key);
            //     });

            // Determine the width of each column label. This, for now, determines the
            // column width.
            // TODO: do this for every element!
            const testNodeContainer = document.createElement('div');
            testNodeContainer.position = 'absolute';
            document.body.appendChild(testNodeContainer);
            const testNode = document.createElement('div');
            testNodeContainer.appendChild(testNode);
            testNode.style.display = 'inline';
            testNode.style.visibility = 'hidden';

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

            testNode.classList = ['Spreadsheet-cell'];
            const measures = {};

            // Here, in a nested loop (columnDefs, samples)
            // we measure the width of each column.
            columnDefs.forEach((columnDef) => {
                // Measure column header width.
                testNode.innerText = columnDef.label;
                testNode.classList.add('Spreadsheet-header-cell');
                const headerWidth = outerWidth(testNode);
                testNode.classList.remove('Spreadsheet-header-cell');

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
                                    units = html`<i style=${{marginLeft: '1em'}}>${controlledField.units}</i>`;
                                } else {
                                    units = '';
                                }
                                const content = html`<span>${this.formatValue(controlledField.value, columnDef.format)}${units}</span>`;
                                return content;
                                // const tooltip = `${this.formatValue(controlledField.value, columnDef.format)} ${controlledField.units || ''}`;
                                // return html`
                                //     <div className="Spreadsheet-cell Spreadsheet-controlled-field" title=${tooltip}>
                                //         <div className="Spreadsheet-cell-content">
                                //             ${content}
                                //         </div>
                                //     </div>
                                // `;
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
                        testNode.innerHTML = content;
                        const w = outerWidth(testNode);
                        measures[content] = w;
                        return w;
                    })();

                    width = Math.max(width, thisWidth);
                });


                const maxWidth = Math.max(headerWidth, Math.min(width, MAX_CELL_WIDTH));

                columnDef.width = `${Math.ceil(maxWidth)}px`;
            });

            const headerCells = columnDefs.map((columnDef) => {
                const classes = ['Spreadsheet-header-cell Spreadsheet-cell'];
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
                    flexBasis: columnDef.width
                };

                return html`
                    <div className=${classes.join(' ')} style=${style}>
                        ${columnDef.label}
                    </div>
               `;
            });


            // Another nested loop of (samples, columnDefs).
            // for each sample
            // for the template fields
            // for each template field, find the sample field and render a cell
            const rows = [];
            this.props.sampleSet.samples.forEach((sample) => {
                const row = columnDefs.map((columnDef) => {
                    const style = {
                        flexBasis: columnDef.width
                    };
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
                            <div className="Spreadsheet-cell Spreadsheet-sample-field" style=${style}title=${sampleField}>
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
                                units = html`<i style=${{marginLeft: '1em'}}>${controlledField.units}</i>`;
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
                    <div className="Spreadsheet-row">
                        ${row}
                    </div>
                `);
            });

            const body = rows;
            const result = html`
                <div className="Spreadsheet-container">
                    <div className="Spreadsheet-header" ref=${this.headerRef}>
                        <div className="Spreadsheet-header-container">
                            ${headerCells}
                        </div>
                    </div>
                    <div className="Spreadsheet-body" ref=${this.bodyRef} onScroll=${this.handleBodyScroll.bind(this)}>
                        ${body}
                    </div>
                </div>
            `;

            return result;
        }

        render() {
            return html`
            <div className="Spreadsheet">
                ${this.renderSpreadsheet()}
            </div>
            `;
        }
    }

    return Spreadsheet;
});
