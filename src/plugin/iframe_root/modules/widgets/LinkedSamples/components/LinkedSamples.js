define([
    'preact',
    'htm',
    'lib/format',
    'components/DataTable',
    'components/Empty2',
    './LinkedSamples.styles'
], (
    preact,
    htm,
    fmt,
    DataTable,
    Empty,
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
                    <a href="/#samples/view/${row.id}/${row.version}" target="_blank">${name}</a>
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
                    <a href="/#people/${savedBy}" target="_blank">${savedBy}</a>
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
            // const table = this.props.linkedSamples.map(({link, sample}) => {
            //     return {
            //
            //     }
            //     // return html`
            //     // <tr>
            //     //     <td>${link.dataid || '∅'}</td>
            //     //     <td><a href="/#samples/view/${link.id}/${link.version}" target="_blank">${sample.name}</a></td>
            //     //     <td>${sample.node_tree[0].id}</td>
            //     //     <td>${this.renderTimestamp(sample.save_date)}</td>
            //     //     <td><a href="/#people/${sample.user}" target="_blank">${sample.user}</a></td>
            //     //     <td style=${{textAlign: 'right', paddingRight: '2em'}}>${sample.version}</td>
            //     // </tr>
            //     // `;
            // });
            // <td>${(sample.sgetMetadataValueample, 'material', '-')}</td>
            // const rows = this.props.linkedSamples.map(({link, sample}) => {
            //     return html`
            //     <tr>
            //         <td>${link.dataid || '∅'}</td>
            //         <td><a href="/#samples/view/${link.id}/${link.version}" target="_blank">${sample.name}</a></td>
            //         <td>${sample.node_tree[0].id}</td>
            //         <td>${this.renderTimestamp(sample.save_date)}</td>
            //         <td><a href="/#people/${sample.user}" target="_blank">${sample.user}</a></td>
            //         <td style=${{textAlign: 'right', paddingRight: '2em'}}>${sample.version}</td>
            //     </tr>
            //     `;
            // });
            //
            // return html`
            // <table className="table">
            //     <thead>
            //         <tr>
            //             <th style=${{width: '15em', whiteSpace: 'nowrap'}}>Path to Sample</th>
            //             <th style=${{whiteSpace: 'nowrap'}}>Sample Name</th>
            //             <th style=${{whiteSpace: 'nowrap'}}>Id</th>
            //             <th style=${{width: '12em', whiteSpace: 'nowrap'}}>Saved</th>
            //             <th style=${{width: '8em', whiteSpace: 'nowrap'}}>By</th>
            //             <th style=${{width: '5em', whiteSpace: 'nowrap'}}>Version</th>
            //         </tr>
            //     </thead>
            //     <tbody>
            //         ${rows}
            //     </tbody>
            // </table>
            // `;
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
