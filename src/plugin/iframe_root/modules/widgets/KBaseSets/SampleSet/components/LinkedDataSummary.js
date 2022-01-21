define([
    'preact',
    'htm',
    'lib/formatters',
    'components/DataTable',
    './LinkedDataSummary.styles'
], (
    {Component, h},
    htm,
    fmt,
    DataTable,
    styles
) => {
    const html = htm.bind(h);

    class LinkedDataSummary extends Component {
        renderLinkedDataSummaryTable() {
            const columns = [{
                id: 'name',
                label: 'Name/ID',
                display: true,
                isSortable: true,
                style: {
                    flex: '2 0 0'
                },
                render: (name, row) => {
                    return html`
                        <a href=${`/#samples/view/${row.id}/${row.version}`} target="_blank">${name}</a>
                    `;
                }
            }, {
                id: 'typeCount',
                label: 'Types',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 8em',
                    textAlign: 'right',
                    paddingRight: '1em'
                },
                render: (typeCount) => {
                    return html`
                        <span>${typeCount}</span>
                    `;
                }
            }, {
                id: 'objectCount',
                label: 'Objects',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 8em',
                    textAlign: 'right',
                    paddingRight: '1em'
                },
                render: (objectCount) => {
                    return html`
                        <span>${objectCount}</span>
                    `;
                }
            }];


            for (const name of this.props.data.types) {
                columns.push({
                    id: `type_${name}`,
                    label: name,
                    display: true,
                    isSortable: true,
                    style: {
                        flex: '0 0 10em',
                        textAlign: 'right',
                        paddingRight: '1em'
                    },
                    render: (count) => {
                        return html`
                        <span>${count}</span>
                    `;
                    }
                });
            }

            const props = {
                columns,
                pageSize: 10,
                table: [],
                dataSource: this.props.data.summary
                    .filter(({totals: {typeCount}}) => {
                        return typeCount > 0;
                    })
                    .map(({sample, totals, typeCounts}) => {
                        const row = {
                            id: sample.id,
                            name: sample.name,
                            version: sample.version,
                            typeCount: totals.typeCount,
                            objectCount: totals.objectCount,
                        // source: sample.sample.dataSourceDefinition.source
                        };
                        for (const name of this.props.data.types) {
                            row[`type_${name}`] = typeCounts[name] || 0;
                        }
                        return row;
                    })
            };

            const onRowClick = (row) => {
                window.open(`/#samples/view/${row.id}/${row.version}`, '_blank');
            };

            return html`
                <${DataTable} heights=${{row: 40, col: 40}} onClick=${onRowClick} ...${props}/>
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
