define([
    'preact',
    'htm',
    'lib/formatters',
    'components/DataTable',
    'components/DataTable2',
    'components/Popover',
    'components/Nullable',
    'components/DataPillGroup',
    'components/DataPill',
    './LinkedData3.styles',

    'css!./LinkedData3.css'
], (
    {Component, h, render: preactRender},
    htm,
    fmt,
    DataTable,
    DataTable2,
    Popover,
    Nullable,
    DataPillGroup,
    DataPill,
    styles
) => {
    const html = htm.bind(h);

    function htmlToString(htmContent) {
        const element = document.createElement('div');
        preactRender(htmContent, element);
        return element.innerHTML;
    }

    class LinkedData3 extends Component {
        constructor(props) {
            super(props);
            this.DEFAULT_SORT = 'Sample Name & Object Type';
            this.state = {
                linkedData: this.doFilterSort(null, this.DEFAULT_SORT),
                currentFilter: null,
                currentSort: this.DEFAULT_SORT
            };
            this.columns = [{
                id: 'sampleName',
                label: 'Sample Name',
                display: true,
                isSortable: true,
                style: {
                    flex: '1 0 0'
                },
                render: (sampleName, row) => {
                    return html`
                        <a href=${`/#samples/view/${row.sampleId}/${row.sampleVersion}`} target="_blank">${sampleName}</a>
                    `;
                }
            }, {
                id: 'objectRef',
                label: 'Object Ref',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 7em'
                },
                render: (ref) => {
                    return html`
                        <a href=${`/#dataview/${ref}`} target="_blank">${ref}</a>
                    `;
                }
            }, {
                id: 'objectName',
                label: 'Object Name',
                display: true,
                isSortable: true,
                style: {
                    flex: '1 0 0'
                },
                render: (name, row) => {
                    return html`
                        <a href=${`/#dataview/${row.objectRef}`} target="_blank">${name}</a>
                    `;
                }
            }, {
                id: 'objectTypeName',
                label: 'Type',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 12em'
                },
                render: (typeName, row) => {
                    return html`
                        <a href=${`/#spec/type/${row.objectType}`} target="_blank">${typeName}</a>
                    `;
                }
            }, {
                id: 'linkCount',
                label: 'Links',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 4em',
                    textAlign: 'right',
                    paddingRight: '1em'
                },
                render: (linkCount, row) => {
                    const render = () => {
                        const rows = row.links
                            .sort((a, b) => {
                                const creationOrder = (a.created - b.created);
                                if (creationOrder === 0) {
                                    if (a.dataid === null) {
                                        return -1;
                                    } else if (b.dataid === null) {
                                        return 1;
                                    }
                                    return a.dataid.localeCompare(b.dataid);

                                }
                            })
                            .map((link) => {
                                const {dataid, created, createdby} = link;
                                return html`
                                <tr>
                                    <td>
                                        <${Nullable} value=${dataid} />
                                    </td>
                                    <td>
                                        ${Intl.DateTimeFormat('en-US').format(created)}
                                    </td>
                                    <td>
                                        <a href="/#people/${createdby}" target="_blank">${createdby}</a>
                                    </td>
                                </tr>
                            `;

                            });
                        const table = html`
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th style=${{color: 'rgba(150, 150, 150)'}}>Data Id</th>
                                        <th style=${{color: 'rgba(150, 150, 150)'}}>Linked</th>
                                        <th style=${{color: 'rgba(150, 150, 150)'}}>By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                ${rows}
                                </tbody>
                            </table>
                        `;
                        return htmlToString(table);
                    };
                    return html`
                        <${Popover} render=${render} class="LinksCell">${linkCount}</Popover>
                    `;
                }
            }
            // {
            //     id: 'dataId',
            //     label: 'Data Id',
            //     display: true,
            //     isSortable: true,
            //     style: {
            //         flex: '0 0 8em'
            //     },
            //     render: (dataId) => {
            //         return html`
            //             ${dataId}
            //         `;
            //     }
            // }, {
            //     id: 'linkedAt',
            //     label: 'Linked',
            //     display: true,
            //     isSortable: true,
            //     style: {
            //         flex: '0 0 8em'
            //     },
            //     render: (linkedAt) => {
            //         return html`
            //             ${Intl.DateTimeFormat('en-US').format(linkedAt)}
            //         `;
            //     }
            // }, {
            //     id: 'linkedBy',
            //     label: 'By',
            //     display: true,
            //     isSortable: true,
            //     style: {
            //         flex: '0 0 12em'
            //     },
            //     render: (linkedBy) => {
            //         return html`
            //             <a href=${`/#people/${linkedBy}`} target="_blank">${linkedBy}</a>
            //         `;
            //     }
            // }
            ];
        }

        calcTable() {
            const table = [];
            this.props.linkedData
                .forEach(({sample, objects}) => {
                    for (const {objectInfo: {ref, name, type, typeName, workspaceId, id, version}, links} of Object.values(objects)) {
                        table.push({
                            sampleId: sample.id,
                            sampleName: sample.name,
                            sampleVersion: sample.version,
                            objectRef: ref,
                            objectName: name,
                            objectTypeName: typeName,
                            objectType: type,
                            linkCount: links.length,
                            objectRefArray: [workspaceId, id, version],
                            links
                            // dataId: dataid,
                            // linkedAt: new Date(created),
                            // linkedBy: createdby
                        });
                    }
                });
            return table;
        }

        renderLinkedDataTable() {
            const dataSource = this.state.linkedData;

            const props = {
                columns: this.columns,
                pageSize: 10,
                table: [],
                dataSource
            };

            const onRowClick = (row) => {
                window.open(`/#samples/view/${row.id}/${row.version}`, '_blank');
            };

            return html`
                <${DataTable} heights=${{row: 40, col: 40}} columnHeader=${3} onClick=${onRowClick} ...${props}/>
            `;
        }

        renderEmptySet() {
            return html`
                <div class="alert alert-warning" style=${{marginTop: '10px'}}>
                    <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no linked data in this set.
                </div>
            `;
        }

        doFilterSort(filter, sortOption) {
            const table = this.calcTable();

            const filteredTable = (() => {
                if (filter === null || filter.length === 0) {
                    return table.slice();
                }
                return table.filter(({objectTypeName}) => {
                    return (objectTypeName === filter);
                });
            })();

            return filteredTable
                .sort((a, b) => {
                    switch (sortOption) {
                    case 'Sample Name & Object Type': {
                        const nameComparison = a.sampleName.localeCompare(b.sampleName);
                        if (nameComparison !== 0) {
                            return nameComparison;
                        }
                        return a.objectTypeName.localeCompare(b.objectTypeName);
                    }
                    case 'Object Type & Sample Name': {
                        const typeNameComparison = a.objectTypeName.localeCompare(b.objectTypeName);

                        if (typeNameComparison !== 0) {
                            return typeNameComparison;
                        }
                        return a.sampleName.localeCompare(b.sampleName);

                    }
                    case 'Object Ref & Sample Name': {
                        for (const aPart of a.objectRefArray) {
                            for (const bPart of b.objectRefArray) {
                                if (aPart == bPart) {
                                    continue;
                                }
                                return aPart - bPart;
                            }
                        }
                        return a.sampleName.localeCompare(b.sampleName);
                    }
                    case 'Object Name & Sample Name': {
                        const objectNameComparison = a.objectName.localeCompare(b.objectName);
                        if (objectNameComparison !== 0) {
                            return objectNameComparison;
                        }
                        return a.sampleName.localeCompare(b.sampleName);
                    }
                    }
                });

        }

        applyFilterSort(filter, sortOption) {
            const linkedData = this.doFilterSort(filter, sortOption);

            this.setState({
                linkedData,
                currentFilter: filter,
                currentSort: sortOption,
            });
        }

        // Filtering

        onFilterChange(ev) {
            const filterValue = ev.target.value;
            this.applyFilterSort(filterValue, this.state.currentSort);
        }

        renderFilterControl() {
            const options = this.props.types.map((typeName) => {
                const selected = typeName === this.state.currentFilter;
                return html`
                    <option value=${typeName} selected=${selected}>${typeName}</option>
                `;
            });
            options.unshift(html`
                <option value="" selected=${this.state.currentFilter === null}>- All -</option>
            `);
            return html`
                <select class="form-control" id="filter-control" onChange=${this.onFilterChange.bind(this)}>
                    ${options}
                </select>
            `;
        }

        // Sorting.

        onSortChange(ev) {
            const sortValue = ev.target.value;
            this.applyFilterSort(this.state.currentFilter, sortValue);
        }


        renderSortControl() {
            const sortBy = [
                'Sample Name & Object Type', 'Object Type & Sample Name', 'Object Ref & Sample Name', 'Object Name & Sample Name'
            ];
            const options = sortBy.map((sortId) => {
                const selected = this.state.currentSort === sortId;
                return html`
                    <option value=${sortId} selected=${selected}>${sortId}</option>
                `;
            });
            return html`
                <select class="form-control" id="sort-control" onChange=${this.onSortChange.bind(this)}>
                    ${options}
                </select>
            `;
        }

        // Reset control

        onResetButton() {
            this.applyFilterSort('', this.DEFAULT_SORT);
        }

        renderResetButton() {
            const disabled = (() => {
                return (
                    (this.state.currentFilter === null || this.state.currentFilter === '') &&
                    (this.state.currentSort === this.DEFAULT_SORT)
                );
            })();
            return html`
                <button class="btn btn-default" style="margin-left: 1em;" disabled=${disabled} onClick=${this.onResetButton.bind(this)}><span class="fa fa-times" /></button>
            `;
        }

        // Header enchilada

        renderHeader() {
            return html`
                <div style=${styles.Header}>
                    <${DataPillGroup} title="Filter">
                        <${DataPill} label="by object type" render=${this.renderFilterControl.bind(this)} />
                    </>
                    <${DataPillGroup} title="Sort" style=${{marginLeft: '2em'}}>
                        <${DataPill} label="by object type" render=${this.renderSortControl.bind(this)} />
                    </>
                    ${this.renderResetButton()}
                </div>
            `;
        }

        render() {
            return html`
                <div style=${styles.main} class="LinkedData3">
                    ${this.renderHeader()}
                    ${this.renderLinkedDataTable()}
                </div>
            `;
        }
    }

    return LinkedData3;
});
