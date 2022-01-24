define([
    'preact',
    'htm',
    'lib/formatters',
    'components/DataTable',
    'components/DataTable2',
    './LinkedData2.styles'
], (
    {Component, h},
    htm,
    fmt,
    DataTable,

    DataTable2,
    styles
) => {
    const html = htm.bind(h);

    class LinkedData2 extends Component {
        constructor(props) {
            super(props);
            this.DEFAULT_SORT = 'Sample Name && Object Type';
            this.state = {
                linkedData: this.calcTable(),
                currentFilter: null,
                currentSort: this.DEFAULT_SORT
            };
            this.columns = [{
                id: 'sampleName',
                label: 'Sample Name/ID',
                display: true,
                isSortable: true,
                style: {
                    flex: '2 0 0'
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
                    flex: '0 0 18em'
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
                id: 'dataId',
                label: 'Data Id',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 8em'
                },
                render: (dataId) => {
                    return html`
                        ${dataId}
                    `;
                }
            }, {
                id: 'linkedAt',
                label: 'Linked',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 8em'
                },
                render: (linkedAt) => {
                    return html`
                        ${Intl.DateTimeFormat('en-US').format(linkedAt)}
                    `;
                }
            }, {
                id: 'linkedBy',
                label: 'By',
                display: true,
                isSortable: true,
                style: {
                    flex: '0 0 12em'
                },
                render: (linkedBy) => {
                    return html`
                        <a href=${`/#people/${linkedBy}`} target="_blank">${linkedBy}</a>
                    `;
                }
            }];
        }

        calcTable() {
            const table = [];
            this.props.data.linkedData
                .forEach(({sample, links}) => {
                    for (const {link: {created, createdby, dataid}, objectInfo: {ref, name, type, typeName}} of links) {
                        table.push({
                            sampleId: sample.id,
                            sampleName: sample.name,
                            sampleVersion: sample.version,
                            objectRef: ref,
                            objectName: name,
                            objectTypeName: typeName,
                            objectType: type,
                            dataId: dataid,
                            linkedAt: new Date(created),
                            linkedBy: createdby
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

        applyFilterSort(filter, sortOption) {
            const table = this.calcTable();

            const filteredTable = (() => {
                if (filter === null || filter.length === 0) {
                    return table.slice();
                }
                return table.filter(({objectTypeName}) => {
                    return (objectTypeName === filter);
                });
            })();

            const sortedTable = filteredTable
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
                    case 'SampleDate':
                        return a.sampleCreatedAt - b.sampleCreatedAt;
                    case 'LinkDate':
                        return a.linkedAt - b.linkedAt;
                    }
                });


            this.setState({
                linkedData: sortedTable,
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
            const options = this.props.data.types.map((typeName) => {
                const selected = typeName === this.state.currentFilter;
                return html`
                    <option value=${typeName} selected=${selected}>${typeName}</option>
                `;
            });
            options.unshift(html`
                <option value="" selected=${this.state.currentFilter === null}>- none -</option>
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
                'Sample Name & Object Type', 'Object Type & Sample Name'
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
                    <div class="form-inline">
                        <label style=${styles.Label}>Filter <span className="fa fa-arrow-right" /></label>
                        <label for="filter-control" style=${{...styles.Label, marginLeft: '0.5em'}}>by object type</label>
                        ${this.renderFilterControl()}
                        <label style=${{...styles.Label, marginLeft: '2em'}}>Sort <span className="fa fa-arrow-right" /></label>
                        <label for="sort-control" style=${{...styles.Label, marginLeft: '0.5em'}}>samples</label>
                        ${this.renderSortControl()}
                        ${this.renderResetButton()}
                    </div>
                </div>
            `;
        }

        render() {
            return html`
                <div style=${styles.main}>
                    ${this.renderHeader()}
                    ${this.renderLinkedDataTable()}
                </div>
            `;
        }
    }

    return LinkedData2;
});
