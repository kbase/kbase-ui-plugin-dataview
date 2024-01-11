define([
    'preact',
    'htm',
    'lib/format',
    'components/DataTable',
    'components/Empty2',
    'components/UILink',
    './LinkedSamples.styles'
], (
    preact,
    htm,
    fmt,
    DataTable,
    Empty,
    UILink,
    styles
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    // function getMetadataValue(sample, name, defaultValue) {
    //     const metadata = sample.node_tree[0].meta_controlled;
    //     const userMetadata = sample.node_tree[0].meta_user;

    //     if (metadata[name]) {
    //         return metadata[name].value;
    //     }
    //     if (userMetadata[name]) {
    //         return userMetadata[name].value;
    //     }
    //     return defaultValue;
    // }

    class LinkedSamples extends Component {
        constructor(props) {
            super(props);
            this.columns = [{
                id: 'name',
                label: 'Sample Name',
                display: true,
                isSortable: true,
                render: (name, row) => {
                    return html`
                        <${UILink} to="newwindow" hashPath=${{hash: `samples/view/${row.id}/${row.version}`}}>${name}</>
                    `;
                }
            }, {
                id: 'dataid',
                label: 'Data ID',
                display: true,
                isSortable: true,
                render: (dataid) => {
                    return dataid || '∅';
                }
            }, {
                id: 'savedAt',
                label: 'Saved',
                display: true,
                isSortable: true,
                style: {
                    maxWidth: '10em'
                },
                render: (savedAt) => {
                    return this.renderTimestamp(savedAt);
                }
            }, {
                id: 'savedBy',
                label: 'By',
                display: true,
                isSortable: true,
                render: (savedBy) => {
                    return html`
                    <${UILink} to="newwindow" hashPath=${{hash: `people/${savedBy}`}}>
                        ${savedBy}
                    </i>
                `;
                }
            }, {
                id: 'version',
                label: 'Version',
                display: true,
                isSortable: true,
                style: {
                    maxWidth: '5em'
                },
                render: (version) => {
                    return html`
                    <div style=${{textAlign: 'right', paddingRight: '2em'}}>${version}</div>
                `;
                }
            }];
        }
        renderTimestamp(time) {
            return html `<span title="${fmt.timestamp(time)}">
                  ${fmt.date(time)}
            </span>
            `;
        }

        renderLinkedSamples() {
            const props = {
                columns: this.columns,
                pageSize: 10,
                table: [],
                dataSource: this.props.linkedSamples.map(({link, sample}) => {
                    return {
                        dataid: link.dataid,
                        name: sample.name,
                        id: sample.id,
                        nodeId: sample.node_tree[0].id,
                        savedAt: sample.save_date,
                        savedBy: sample.user,
                        version: sample.version
                    };
                })
            };

            return html`
                <${DataTable} heights=${{row: 40, col: 40}} ...${props}/>
            `;
        }

        renderNoLinkedSamples() {
            return html`
                <${Empty} message="No samples are linked to this object." />
            `;
        }

        render() {
            if (this.props.linkedSamples.length === 0) {
                return this.renderNoLinkedSamples();
            }
            return html`
                <div style=${styles.main} >
                ${this.renderLinkedSamples()}
                </table>
            `;
        }
    }
    return LinkedSamples;
});
