define([
    'preact',
    'htm',
    'lib/formatters',
    'components/DataTable',
    './SampleSet.styles'
], function (
    preact,
    htm,
    fmt,
    DataTable,
    styles
) {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    function getMetadataValue(sample, name, defaultValue) {
        const metadata = sample.node_tree[0].meta_controlled;
        const userMetadata = sample.node_tree[0].meta_user;

        if (metadata[name]) {
            return metadata[name].value;
        }
        if (userMetadata[name]) {
            return userMetadata[name].value;
        }
        return defaultValue;
    }

    class SampleSet extends Component {
        constructor(props) {
            super(props);
        }

        renderSamplesTable() {
            const columns = [{
                id: 'name',
                label: 'Name',
                display: true,
                isSortable: true,
                render: (name, sample) => {
                    return html`
                        <a href=${`/#samples/view/${sample.id}/${sample.version}`} target="_blank">${name}</a>
                    `;
                }
            }, {
                id: 'sourceId',
                label: 'ID',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 12'
                },
                render: (sourceId) => {
                    return html`
                        ${sourceId}
                    `;
                }
            },
            //     {
            //     id: 'source',
            //     label: 'Format',
            //     display: true,
            //     isSortable: true,
            //     style: {
            //         flex: '0 0 10em'
            //     },
            //     render: (source) => {
            //         return html`
            //             ${source}
            //         `;
            //     }
            // },
            //     {
            //     id: 'material',
            //     label: 'Material',
            //     display: true,
            //     isSortable: true,
            //     style: {
            //         flex: '0 0 10em'
            //     },
            //     render: (material) => {
            //         return html`
            //             <span>
            //         ${material}
            //         </span>
            //         `;
            //     }
            // },
            {
                id: 'savedAt',
                label: 'Saved',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 10'
                },
                render: (savedAt) => {
                    return html`
                        <span>${fmt.formattedDate(savedAt)}</span>
                    `;
                }
            }, {
                id: 'savedBy',
                label: 'By',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 6'
                },
                render: (savedBy) => {
                    return html`
                        <a href=${`/#user/${savedBy}`} target="_blank">${this.props.userProfiles[savedBy].user.realname}</a>
                    `;
                }
            }, {
                id: 'version',
                label: 'Version',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 7em'
                },
                render: (version) => {
                    return html`
                        <span>${version}</span>
                    `;
                }
            },
                // {
                //     id: 'linkedDataCount',
                //     label: '# Linked Objects',
                //     display: true,
                //     isSortable: true,
                //     style: {
                //         flex: '0 0 10em'
                //     },
                //     render: (linkedDataCount) => {
                //         return html`
                //         <span>${fmt.formattedInteger(linkedDataCount)}</span>
                //         `;
                //     }
                // }
            ];

            const props = {
                columns,
                pageSize: 10,
                table: [],
                // fetchData: (query, sortColumn, sortDirection, offset, limit) => {
                //     return Promise.resolve({
                //         rows: this.props.sampleSet.samples.slice(offset, offset + limit),
                //         query,
                //         start: offset,
                //         total: this.props.sampleSet.samples.length
                //     });
                // }
                dataSource: this.props.samples.map((sample) => {
                    return {
                        id: sample.id,
                        name: sample.name,
                        material: getMetadataValue(sample, 'material', '-'),
                        sourceId: sample.node_tree[0].id,
                        savedAt: sample.save_date,
                        savedBy: sample.user,
                        version: sample.version,
                        // source: sample.sample.dataSourceDefinition.source
                    };
                })
            };

            return html`
                <${DataTable} heights=${{row: 40, col: 40}} ...${props}/>
            `;

            // const rows = this.props.sampleSet.samples.map((sample) => {
            //     return html`
            //         <tr>
            //             <td><a href=${`/#samples/view/${sample.id}/${sample.version}`} target="_parent">${sample.name}</a></td>
            //             <td>${getMetadataValue(sample.sample, 'material', '-')}</td>
            //             <td>${sample.sample.node_tree[0].id}</td>
            //             <td>${fmt.formattedDate(sample.sample.save_date)}</td>
            //             <td><a href=${`/#user/${sample.sample.user}`} target="_blank">${sample.sample.user}</a></td>
            //             <td style=${{textAlign: 'right', paddingRight: '2em'}}>${sample.sample.version}</td>
            //             <td style=${{textAlign: 'right', paddingRight: '2em'}}>${fmt.formattedInteger(sample.linkedDataCount)}</td>
            //         </tr>
            //     `;
            // });

            // return html`
            // <table className="table">
            //     <thead>
            //         <tr>
            //             <th>Name</th>
            //             <th style=${{width: '15em'}}>Material</th>
            //             <th style=${{width: '10em'}}>Source Id</th>
            //             <th style=${{width: '12em'}}>Saved</th>
            //             <th style=${{width: '8em'}}>By</th>
            //             <th style=${{width: '5em'}}>Version </th>
            //             <th style=${{width: '8em'}}># Linked objs</th>
            //         </tr>
            //     </thead>
            //     <tbody>
            //         ${rows}
            //     </tbody>
            // </table>
            // `;
        }

        // renderSampleSet() {
        //     let truncatedMessage = '';
        //     if (this.props.totalCount > 50) {
        //         truncatedMessage = html`<div className="alert alert-warning">The total number of results has been truncated; only the first 50 are displayed during this testing period.</div>`;
        //     }
        //     const totalCount = Intl.NumberFormat('en-US', {
        //         useGrouping: true
        //     }).format(this.props.totalCount);
        //     return html`
        //         <${Fragment}>
        //             <p>This sample set contains a total of ${totalCount} samples.</p>
        //             <h4>Samples</h4>
        //             ${this.renderSamples()}
        //             ${truncatedMessage}
        //         <//>
        //     `;
        // }

        renderEmptySet() {
            return html`
                <div class="alert alert-warning" style=${{marginTop: '10px'}}>
                    <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no samples in this set.
                </div>
            `;
        }

        render() {
            if (this.props.sampleSet.samples.length === 0) {
                return this.renderEmptySet();
            }
            return html`
                <div className="SampleSet" style=${styles.main}>
                    ${this.renderSamplesTable()}
                </div>
            `;
        }
    }

    return SampleSet;
});
