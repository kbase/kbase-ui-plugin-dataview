define([
    'preact',
    'htm',
    'css!./Toolbar.css'
], function (
    preact,
    htm
) {
    'use strict';

    const {Component } = preact;
    const html = htm.bind(preact.h);

    class Toolbar extends Component {
        constructor(props) {
            super(props);
        }

        onSortSelectChange(event) {
            if (event.target.selectedOptions.length !== 1) {
                return;
            }
            const columnKey =  event.target.selectedOptions[0].value;
            if (!columnKey) {
                this.props.onClearSort();
                return;
            }
            const def = this.props.getColumn(columnKey);
            const direction = (() => {
                if (this.props.currentSort) {
                    return this.props.currentSort.direction;
                }
                return 'ascending';
            })();
            this.props.onSort(def, def.index, direction);
        }

        onSortDirectionSelectChange(event) {
            if (event.target.selectedOptions.length !== 1) {
                return;
            }
            if (!this.props.currentSort) {
                return;
            }
            const directionKey =  event.target.selectedOptions[0].value;
            const def = this.props.currentSort.columnDef;
            this.props.onSort(def, def.index, directionKey);
        }

        renderToolbarSort() {
            const columnsSelect = (() => {
                const options = this.props.columns.map((columnDef) => {
                    const selected = this.props.currentSort && columnDef.key === this.props.currentSort.columnDef.key;
                    return html`
                        <option value=${columnDef.key} 
                                selected=${selected}>
                            ${columnDef.title}
                        </option>
                    `;
                });
                const selectStyle = this.props.currentSort ? {} : {color: 'rgb(145, 145, 145)'};
                return html`
                <select className="form-control" onChange=${this.onSortSelectChange.bind(this)} style=${selectStyle}>
                    <option value=''>Select a column</option>
                    ${options}
                </select>
                `;
            })();
            const directionSelect = (() => {
                const values = [{
                    key: 'ascending',
                    label: 'Ascending'
                }, {
                    key: 'descending',
                    label: 'Descending'
                }];
                const options = values.map(({key, label}) => {
                    const selected = this.props.currentSort && key ===  this.props.currentSort.direction;
                    return html`
                        <option value=${key} 
                                selected=${selected}>
                            ${label}
                        </option>
                    `;
                });
                return html`
                <select className="form-control" onChange=${this.onSortDirectionSelectChange.bind(this)}>
                    ${options}
                </select>
                `;
            })();

            return html`
            <${preact.Fragment}>
                <div className="Toolbar-filter-column">
                    ${columnsSelect}
                </div>
                ${' '}
                <div className="Toolbar-filter-value">
                    ${directionSelect}
                </div>
                
            <//>
            `;
            // <button class="btn btn-danger btn-sm" onClick=${this.props.onClearSort}><span className="fa fa-trash"></span></button>
        }

        onFilterSelectChange(event) {
            if (event.target.selectedOptions.length !== 1) {
                return;
            }
            const columnKey =  event.target.selectedOptions[0].value;
            if (columnKey === '') {
                this.props.onClearFilter();
                return;
            }
            const def = this.props.getColumn(columnKey);
            const filterValue = this.props.currentFilter ? this.props.currentFilter.value : '';
            this.props.onFilter(def, def.index, filterValue);
        }

        onFilterValueChange(event) {
            if (!this.props.currentFilter){
                return;
            }
            const def = this.props.currentFilter.columnDef;
            const filterValue = event.target.value;
            this.props.onFilter(def, def.index, filterValue);
        }

        renderToolbarFilter() {
            const columnsSelect = (() => {
                const currentKey = this.props.currentFilter ? this.props.currentFilter.columnDef.key : null;
                const options = this.props.columns.map((columnDef) => {
                    const selected = columnDef.key === currentKey;
                    return html`
                        <option value=${columnDef.key} 
                                selected=${selected}>
                            ${columnDef.title}
                        </option>
                    `;
                });
                const selectStyle = this.props.currentFilter ? {} : {color: 'rgb(145, 145, 145)'};
                return html`
                <select className="form-control" onChange=${this.onFilterSelectChange.bind(this)} style=${selectStyle}>
                    <option value="">Select a column</option>
                    ${options}
                </select>
                `;
            })();

            return html`
            <${preact.Fragment}>
                <div className="Toolbar-sort-column">
                    ${columnsSelect}
                </div>
                <div className="Toolbar-sort-direction">
                    <input className="form-control" value=${this.props.currentFilter && this.props.currentFilter.value} 
                           placeholder="Search column"
                           onChange=${this.onFilterValueChange.bind(this)}></input>
                </div>
                
            <//>
            `;
            // <button class="btn btn-danger btn-sm" onClick=${this.props.onClearFilter}><span className="fa fa-trash"></span></button>
        }

        renderToolbarCounts() {
            const total = this.props.total;
            if (this.props.subsetCount === null) {
                return html`
                <b>${total}</b>
                <span style=${{paddingLeft: '1ex'}}> samples</span>
                `;
            }
            const filterTotal = this.props.subsetCount;
            return html`
                <b>${filterTotal}</b>
                <span style=${{paddingLeft: '1ex', paddingRight: '1ex'}}>of</span>
                <b>${total}</b>
                <span style=${{paddingLeft: '1ex'}}>samples</span>
            `;
        }

        doSearchChange(event) {
            const query = event.target.value;
            if (!query) {
                this.props.onClearSearch();
            } else {
                this.props.onSearch(query);
            }
        }

        renderResetButton() {
            const enabled = this.props.currentFilter || this.props.currentSort || this.props.currentSearch;
            return html`
                <button 
                    className="btn btn-danger btn-sm" 
                    title="Reset search, filter, and sorting"
                    disabled=${!enabled}
                    onClick=${this.props.onReset}>
                        <span className="fa fa-recycle"></span>
                </button>
            `;
        }

        renderSearchInput() {
            const value = (this.props.currentSearch && this.props.currentSearch.query) || '';
            return html`
                <input className="form-control" 
                        placeholder="Search spreadsheet" 
                        value=${value}
                        onChange=${this.doSearchChange.bind(this)}></input>
            `;
        }

        render() {
            return html`
            <div className="Toolbar">
                <div className="Toolbar-search">
                    ${this.renderSearchInput()}
                </div>
                <div className="Toolbar-filter">
                    <div className="Toolbar-label">filter</div>
                    ${this.renderToolbarFilter()}
                </div>
                <div className="Toolbar-sort">
                    <div className="Toolbar-label">sort</div>
                    ${this.renderToolbarSort()}
                </div>
                <div className="Toolbar-buttons">
                    ${this.renderResetButton()}
                </div>
                <div className="Toolbar-counts">
                    ${this.renderToolbarCounts()}
                </div>
            </div>
            `;
        }
    }

    return Toolbar;
});
