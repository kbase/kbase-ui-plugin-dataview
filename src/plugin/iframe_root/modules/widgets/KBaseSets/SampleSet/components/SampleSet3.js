define([
    'preact',
    'htm',
    'lib/formatters',
    'components/DataTable4',
    'components/Container',
    './SampleLinkedDataSummary',
    './SampleLinkedDataDetail',
    './SampleSet2.styles'
], (
    {Component, h},
    htm,
    fmt,
    DataTable,
    Container,
    SampleLinkedDataSummary,
    SampleLinkedDataDetail,
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
        constructor(props) {
            super(props);
            this.state = {
                view: 'normal'
            };
        }
        renderSamplesTable() {
            const columns = [{
                id: 'name',
                label: 'Sample Name',
                display: true,
                isSortable: true,
                style: {
                    flex: '2 0 0'
                },
                render: (name, sample) => {
                    return html`
                        <a href=${`/#samples/view/${sample.id}/${sample.version}`} target="_blank">${name}</a>
                    `;
                }
            }, {
                id: 'description',
                label: 'Description',
                display: true,
                isSortable: true,
                style: {
                    flex: '2 0 0'
                },
                render: (description) => {
                    return description;
                }
            },{
                id: 'savedAt',
                label: 'Created',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 6em'
                },
                render: (savedAt) => {
                    return html`
                        <span>${Intl.DateTimeFormat('en-US').format(savedAt)}</span>
                    `;
                }
            }, {
                id: 'version',
                label: 'Version',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 7em',
                    textAlign: 'right',
                    paddingRight: '1em'
                },
                render: (version) => {
                    return html`
                        <span>${version}</span>
                    `;
                }
            }, {
                id: 'savedBy',
                label: 'By',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 13em'
                },
                render: (savedBy) => {
                    return html`
                        <a href=${`/#user/${savedBy}`}
                           target="_blank">${this.props.userProfiles[savedBy].user.realname}</a>
                    `;
                }
            }
            ];

            const props = {
                columns,
                dataSource: this.props.samples.map((sample) => {
                    return {
                        id: sample.id,
                        name: sample.name,
                        description: getMetadataValue(sample, 'description', '-'),
                        material: getMetadataValue(sample, 'material', '-'),
                        sourceId: sample.node_tree[0].id,
                        savedAt: sample.save_date,
                        savedBy: sample.user,
                        version: sample.version,
                        // source: sample.sample.dataSourceDefinition.source
                    };
                }),
                view: this.state.view,
                views: {
                    normal: {
                        render: null
                    },
                    summary: {
                        height: 50,
                        render: (row) => {
                            return html`
                            <${Container}>
                                ${this.props.sampleLinkedDataSummaryController.view({id: row.id, version: row.version})}
                            </>
                            `;
                        }
                    },
                    detail: {
                        height: 80,
                        render: (row) => {
                            return html`
                            <${Container}>
                                ${this.props.sampleLinkedDataDetailController.view({id: row.id, version: row.version})}
                            </>
                            `;
                        }
                    }
                }
            };

            const onRowClick = (row) => {
                window.open(`/#samples/view/${row.id}/${row.version}`, '_blank');
            };

            return html`
                <${DataTable} onClick=${onRowClick} ...${props}/>
            `;
        }

        renderEmptySet() {
            return html`
                <div class="alert alert-warning" style=${{marginTop: '10px'}}>
                    <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no samples in this set.
                </div>
            `;
        }

        changeView(view) {
            this.setState({
                view
            });
        }

        activeClassForView(view) {
            if (this.state.view === view) {
                return 'active';
            }
            return '';
        }

        disableForView(view) {
            if (this.state.view === view) {
                return 'disable';
            }
            return '';
        }

        renderViewButton(view, label) {
            return html`
                <button 
                  class="btn btn-default ${this.activeClassForView(view)}" ${this.disableForView(view)} 
                  style=${{outline: 'none'}}
                  onClick=${() => {this.changeView(view);}}>
                    ${label}
                </button>
            `;
        }

        renderHeader() {
            return html`
            <div style=${styles.header}>
                <div style=${styles.label}>
                    View <span class="fa fa-arrow-right" />
                </div>
                <div class="btn-group">
                    ${this.renderViewButton('normal', 'List')}
                    ${this.renderViewButton('summary', 'Summary')}
                    ${this.renderViewButton('detail', 'Linked Data')}
                </div>
            </div>
            `;
        }

        render() {
            if (this.props.sampleSet.samples.length === 0) {
                return this.renderEmptySet();
            }
            return html`
                <div className="SampleSet" style=${styles.main}>
                    ${this.renderHeader()}
                    ${this.renderSamplesTable()}
                </div>
            `;
        }
    }

    return SampleSet;
});
