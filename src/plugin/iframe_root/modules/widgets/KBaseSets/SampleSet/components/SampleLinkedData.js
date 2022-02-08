define([
    'preact',
    'htm',
    'components/Empty',
    'components/DataTable4'
], (
    {Component, h},
    htm,
    Empty,
    DataTable
) => {
    const html = htm.bind(h);

    const columns = [
        {
            id: 'objectRef',
            label: 'Object Ref',
            sortable: true,
            styles: {
                column: {
                    flex: '0 0 8em'
                }
            },
            render: (objectRef) => {
                return html`<a href="/#dataview/${objectRef}" target="_blank" title=${objectRef}>${objectRef}</a>`;
            },
            sortComparator: (a, b) => {
                if (a.values.workspaceId !== b.values.workspaceId) {
                    return a.values.workspaceId - b.values.workspaceId;
                }
                if (a.values.objectId !== b.values.objectId) {
                    return a.values.objectId - b.values.objectId;
                }
                return a.values.objectVersion - b.values.objectVersion;
            }
        },
        {
            id: 'objectName',
            label: 'Name',
            sortable: true,
            styles: {
                column: {
                    flex: '2 1 0'
                }
            },
            render: (objectName, {objectRef}) => {
                return html`<a href="/#dataview/${objectRef}" target="_blank" title=${objectName}>${objectName}</a>`;
            }
        },
        {
            id: 'typeName',
            label: 'Type',
            sortable: true,
            styles: {
                column: {
                    flex: '1 1 0'
                }
            },
            render: (typeName, {type}) => {
                return html`<a href="/#spec/type/${type}" target="_blank" title=${type}>${typeName}</b>`;
            }
        },
        {
            id: 'dataId',
            label: 'Data Id',
            sortable: true,
            styles: {
                column: {
                    flex: '0 0 8em'
                }
            },
            render: (dataId) => {
                if (dataId === null) {
                    return html`<span style=${{color: 'rgb(150, 150, 150'}}>∅</span>`;
                }
                return html`<span title=${dataId}>${dataId}</span>`;
            }
        },
        {
            id: 'linkedAt',
            label: 'Linked On',
            sortable: true,
            styles: {
                column: {
                    flex: '0 0 8em'
                }
            },
            render: (linkedAt) => {
                return html`<span title="${Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'long'}).format(linkedAt)}" title=${linkedAt}>${Intl.DateTimeFormat('en-us', {}).format(linkedAt)}</span>`;
            }
        },
        {
            id: 'linkedBy',
            label: 'Linked By',
            sortable: true,
            styles: {
                column: {
                    flex: '0 0 10em'
                }
            },
            render: (linkedBy) => {
                return html`<a href="/#people/${linkedBy}" target="_blank" title=${linkedBy}>${linkedBy}</a>`;
            }
        }
    ];

    class SampleLinkedData extends Component {
        renderMaybe(data, key, render) {
            if (key in data) {
                return render(data[key]);
            }
            return html`<span style=${{color: 'rgb(150, 150, 150'}}>∅</span>`;
        }

        renderLinks(dataLinks) {
            if (dataLinks.length === 0) {
                return html`
                    <${Empty} message="No data linked to this sample"/>
                `;
            }

            const props = {
                columns,
                dataSource: this.props.dataLinks.map((link) => {
                    const objectInfo = this.props.objectInfos[link.upa];
                    return {
                        objectRef: link.upa,
                        workspaceId: objectInfo.wsid,
                        objectId: objectInfo.id,
                        objectVersion: objectInfo.version,
                        objectName: objectInfo.name,
                        typeName: objectInfo.typeName,
                        dataId: link.dataid,
                        linkedAt: link.created,
                        linkedBy: link.createdby
                    };
                })
            };

            return html`
                <${DataTable} ...${props} />
            `;
        }

        renderNone() {
            return html`
            <${Empty} message="no data linked to this sample" />
            `;
        }

        render() {
            if (this.props.dataLinks.length === 0) {
                return this.renderNone();
            }
            return this.renderLinks(this.props.dataLinks);
        }
    }

    return SampleLinkedData;
});
