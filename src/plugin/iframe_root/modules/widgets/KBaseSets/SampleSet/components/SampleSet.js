define([
    'preact',
    'htm',
    'lib/formatters',
    'components/DataTable',
    './SampleSet.styles'
], (
    {Component, h},
    htm,
    fmt,
    DataTable,
    styles
) => {
    const html = htm.bind(h);

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
            }, {
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
                        <a href=${`/#user/${savedBy}`}
                           target="_blank">${this.props.userProfiles[savedBy].user.realname}</a>
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
            ];

            const props = {
                columns,
                pageSize: 10,
                table: [],
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
        }

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
