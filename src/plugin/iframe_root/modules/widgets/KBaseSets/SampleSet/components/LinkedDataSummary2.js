define([
    'preact',
    'htm',
    'lib/formatters',
    'components/DataTable',
    'components/DataTable2',
    './Spreadsheet2',
    './LinkedDataSummary2.styles'
], (
    {Component, h},
    htm,
    fmt,
    DataTable,

    DataTable2,
    Spreadsheet2,
    styles
) => {
    const html = htm.bind(h);

    class LinkedDataSummary extends Component {
        renderLinkedDataSummaryTable() {
            // const columns = [{
            //     id: 'name',
            //     label: 'Sample Name/ID',
            //     display: true,
            //     isSortable: true,
            //     style: {
            //         flex: '2 0 0'
            //     },
            //     render: (name, row) => {
            //         return html`
            //             <a href=${`/#samples/view/${row.id}/${row.version}`} target="_blank">${name}</a>
            //         `;
            //     }
            // }, {
            //     id: 'typeCount',
            //     label: 'Unique data types',
            //     display: true,
            //     isSortable: true,
            //     style: {
            //         flex: '0 0 12em',
            //         textAlign: 'right',
            //         paddingRight: '1em'
            //     },
            //     render: (typeCount) => {
            //         return html`
            //             <span>${typeCount}</span>
            //         `;
            //     }
            // }, {
            //     id: 'objectCount',
            //     label: 'Total linked objects',
            //     display: true,
            //     isSortable: true,
            //     style: {
            //         flex: '0 0 12em',
            //         textAlign: 'right',
            //         paddingRight: '1em'
            //     },
            //     render: (objectCount) => {
            //         return html`
            //             <span>${objectCount}</span>
            //         `;
            //     }
            // }];


            // for (const name of this.props.data.types) {
            //     columns.push({
            //         id: `type_${name}`,
            //         label: name,
            //         display: true,
            //         isSortable: true,
            //         style: {
            //             flex: '0 0 10em',
            //             textAlign: 'right',
            //             paddingRight: '1em'
            //         },
            //         render: (count) => {
            //             return html`
            //             <span>${count}</span>
            //         `;
            //         }
            //     });
            // }

            // const props = {
            //     columns,
            //     pageSize: 10,
            //     table: [],
            //     dataSource: this.props.data.summary
            //         .filter(({totals: {typeCount}}) => {
            //             return typeCount > 0;
            //         })
            //         .map(({sample, totals, typeCounts}) => {
            //             const row = {
            //                 id: sample.id,
            //                 name: sample.name,
            //                 version: sample.version,
            //                 typeCount: totals.typeCount,
            //                 objectCount: totals.objectCount,
            //             // source: sample.sample.dataSourceDefinition.source
            //             };
            //             for (const name of this.props.data.types) {
            //                 row[`type_${name}`] = typeCounts[name] || 0;
            //             }
            //             return row;
            //         })
            // };

            const onRowClick = (row) => {
                window.open(`/#samples/view/${row.id}/${row.version}`, '_blank');
            };

            // return html`
            //     <${DataTable} heights=${{row: 40, col: 40}} columnHeader=${3} onClick=${onRowClick} ...${props}/>
            // `;

            const identityFormatter = (value) => {
                return value;
            };


            // Create columns


            // These are the fixed columns
            const columns = [{
                index: 0,
                fieldKey: 'name',
                title: 'Name/ID',
                fieldType: 'attribute',
                type: 'string',
                formatter: identityFormatter
            },
            {
                index: 1,
                fieldKey: 'typeCount',
                title: 'Unique data types',
                fieldType: 'attribute',
                type: 'number',
                formatter: identityFormatter
            },
            {
                index: 2,
                fieldKey: 'objectCount',
                title: 'Total linked objects',
                fieldType: 'attribute',
                type: 'number',
                formatter: identityFormatter
            }];


            // These are the per-type columns.
            this.props.data.types.forEach((name, index) => {
                columns.push({
                    index: index + 3,
                    fieldKey: `type_${name}`,
                    title: name,
                    fieldType: 'attribute',
                    type: 'number',
                    formatter: identityFormatter
                });
            });

            // We have two column groups.
            const groups = [
                {
                    name: 'summary',
                    title: 'Summary',
                    count: 3
                },
                {
                    name: 'types',
                    title: 'Types',
                    scrollable: true,
                    count: columns.length - 3
                }
            ];

            const table = this.props.data.summary
                .filter(({totals: {typeCount}}) => {
                    return typeCount > 0;
                })
                .map(({sample, totals, typeCounts}) => {
                    const row = {
                        id: sample.id,
                        version: sample.version,
                        name: sample.name,
                        typeCount: totals.typeCount,
                        objectCount: totals.objectCount,
                    };
                    for (const name of this.props.data.types) {
                        row[`type_${name}`] = typeCounts[name] || 0;
                    }
                    return row;
                });

            return html`
             <${Spreadsheet2} columns=${columns}
                table=${table}
                onRowClick=${onRowClick}
                columnGroups=${groups}/>
            `;
        }

        renderEmptySet() {
            return html`
                <div class="alert alert-warning" style=${{marginTop: '10px'}}>
                    <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no linked data in this set.
                </div>
            `;
        }

        render() {
            if (this.props.data.summary.length === 0) {
                return this.renderEmptySet();
            }
            return html`
                <div className="SampleSet" style=${styles.main}>
                    ${this.renderLinkedDataSummaryTable()}
                </div>
            `;
        }
    }

    return LinkedDataSummary;
});
