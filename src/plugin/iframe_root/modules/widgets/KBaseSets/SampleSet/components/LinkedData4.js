define([
    'preact',
    'htm',
    'components/DataTable4',
    'components/Popover',
    'components/Nullable',
    'components/DataPillGroup',
    'components/DataPill',
    './LinkedData4.styles',

    'css!./LinkedData4.css'
], (
    {Component, h, render: preactRender},
    htm,
    DataTable,
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

    class LinkedData4 extends Component {
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
                sortable: true,
                searchable: true,
                styles:{
                    column: {
                        flex: '1 0 0'
                    }
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
                sortable: true,
                searchable: true,
                styles:{
                    column: {
                        flex: '0 0 9em'
                    }
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
                sortable: true,
                searchable: true,
                styles:{
                    column: {
                        flex: '1 0 0'
                    }
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
                sortable: true,
                searchable: true,
                styles:{
                    column: {
                        flex: '0 0 12em'
                    }
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
                sortable: true,
                styles:{
                    column: {
                        flex: '0 0 6em',
                    },
                    data: {
                        textAlign: 'right',
                        paddingRight: '1em'
                    }
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
            ];
        }

        renderLinkedDataTable() {
            const dataSource = this.state.linkedData;

            const props = {
                columns: this.columns,
                dataSource,
                bordered: true,
                flex: true
            };

            // const onRowClick = (row) => {
            //     window.open(`/#samples/view/${row.id}/${row.version}`, '_blank');
            // };

            return html`
                <${DataTable} ...${props}/>
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
            const table = this.props.table.slice();

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

        // // Render header above table.
        // onSearchInput(ev) {
        //     const searchText = ev.target.value;

        //     this.applySearch(searchText);

        //     this.setState({
        //         table: this.state.table.slice(),
        //         searchText
        //     });
        // }

        // applySearch(searchText) {
        //     if (searchText === '') {
        //         this.state.table
        //             .map(({rowIndex}) => this.tableMap[rowIndex])
        //             .forEach((row) => {
        //                 row.show = true;
        //             });
        //     }
        //     const searchRE = new RegExp(searchText, 'i');
        //     this.state.table
        //         .map(({rowIndex}) => this.tableMap[rowIndex])
        //         .forEach((row) => {
        //             const show = (() => {
        //                 for (const column of this.props.columns) {
        //                     if (column.searchable) {
        //                         const value = row.values[column.id];
        //                         if (searchRE.test(value)) {
        //                             return true;
        //                         }
        //                     }
        //                 }
        //                 return false;
        //             })();
        //             row.show = show;
        //         });
        // }

        // onClearSearch() {
        //     this.applySearch('');
        //     this.setState({
        //         table: this.state.table.slice(),
        //         searchText: ''
        //     });
        // }

        // renderSearch() {
        //     const clearSearchDisabled = this.state.searchText === '';
        //     return html`
        //         <div className="form-inline">
        //             <div className="input-group">
        //                 <input
        //                     type="search"
        //                     className="form-control"
        //                     style=${{width: '20em'}}
        //                     placeholder="Search"
        //                     value=${this.state.searchText}
        //                     onInput=${this.onSearchInput.bind(this)}
        //                     />
        //                 <span className="input-group-addon"><span class="fa fa-search" /></span>
        //             </div>
        //             <button
        //                 type="button"
        //                 title="Clear the search input and show all rows"
        //                 class="btn btn-default"
        //                 style=${{marginLeft: '1em'}}
        //                 disabled=${clearSearchDisabled}
        //                 onClick=${this.onClearSearch.bind(this)}>
        //                 <span className="fa fa-times" />
        //             </button>
        //         </div>
        //     `;
        // }

        // searchEnabled() {
        //     return (this.props.columns.some(({searchable}) => searchable));
        // }

        // renderToolbar() {
        //     if (!this.searchEnabled()) {
        //         return;
        //     }
        //     return html`
        //         <div className="DataTable4-toolbar">
        //         ${this.renderSearch()}
        //         </div>
        //     `;
        // }

        render() {
            return html`
                <div style=${styles.main} class="LinkedData4">
                    ${this.renderLinkedDataTable()}
                </div>
            `;
        }
    }

    return LinkedData4;
});
