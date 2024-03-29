define([
    'preact',
    'htm',
    './Toolbar.styles'
], (
    {Component, h, Fragment},
    htm,
    styles
) => {
    const html = htm.bind(h);

    class Toolbar extends Component {
        constructor(props) {
            super(props);
            this.state = {
                filter: {
                    value: null,
                }
            };
        }

        onSortSelectChange(event) {
            if (event.target.selectedOptions.length !== 1) {
                return;
            }
            const columnKey = event.target.selectedOptions[0].value;
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
            this.props.onSort(def, direction);
        }

        onSortDirectionSelectChange(event) {
            if (event.target.selectedOptions.length !== 1) {
                return;
            }
            if (!this.props.currentSort) {
                return;
            }
            const directionKey = event.target.selectedOptions[0].value;
            const def = this.props.currentSort.columnDef;
            this.props.onSort(def, directionKey);
        }

        renderToolbarSort() {
            const columnsSelect = (() => {

                const options = this.props.columns.map((columnDef) => {
                    const selected = this.props.currentSort && columnDef.fieldKey === this.props.currentSort.columnDef.fieldKey;
                    return html`
                        <option value=${columnDef.fieldKey}
                                selected=${selected}>
                            ${columnDef.title}
                        </option>
                    `;
                });
                return html`
                    <select className="form-control" onChange=${this.onSortSelectChange.bind(this)}>
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
                    const selected = this.props.currentSort && key === this.props.currentSort.direction;
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
                <${Fragment}>
                    <div style=${styles.filterColumn}>
                        ${columnsSelect}
                    </div>
                ${' '}
                    <div style=${styles.filterValue}>
                        ${directionSelect}
                    </div>

                <//>
            `;
        }

        onFilterSelectChange(event) {
            if (event.target.selectedOptions.length !== 1) {
                return;
            }
            const columnKey = event.target.selectedOptions[0].value;
            if (columnKey === '') {
                this.props.onClearFilter();
                return;
            }
            const def = this.props.getColumn(columnKey);
            const filterValue = this.props.currentFilter ? this.props.currentFilter.value : '';
            this.props.onFilter(def, filterValue);
        }

        onFilterValueChange(event) {
            if (!this.props.currentFilter) {
                return;
            }
            const def = this.props.currentFilter.columnDef;
            const filterValue = event.target.value;
            this.props.currentFilter.value = filterValue;
            this.props.onFilter(def, filterValue);
        }

        onFilterValueKeyUp(event) {
            if (!this.props.currentFilter) {
                return true;
            }
            const filterValue = event.target.value;
            if (this.props.currentFilter.value !== filterValue) {
                this.setState({
                    filter: {
                        value: filterValue
                    }
                });
            } else {
                this.setState({
                    filter: {
                        value: filterValue
                    }
                });
            }
            return true;
        }

        renderToolbarFilter() {
            const columnsSelect = (() => {
                const currentKey = this.props.currentFilter.columnDef ? this.props.currentFilter.columnDef.fieldKey : null;
                const options = this.props.columns.map((columnDef) => {
                    const selected = columnDef.fieldKey === currentKey;
                    return html`
                        <option value=${columnDef.fieldKey}
                                selected=${selected}>
                            ${columnDef.title}
                        </option>
                    `;
                });
                return html`
                    <select className="form-control" onChange=${this.onFilterSelectChange.bind(this)}>
                        <option value="">All fields</option>
                        ${options}
                    </select>
                `;
            })();

            const value = (() => {
                if (this.state.filter.value === null) {
                    return this.props.currentFilter.value;
                }
                if (this.props.currentFilter.value === this.state.filter.value) {
                    return this.props.currentFilter.value;
                }
                return this.state.filter.value;
            })();

            const style = {
                width: '14em'
            };

            if (this.isDirty()) {
                style.backgroundColor = 'rgba(255, 240, 162, 1)';
            }

            return html`
                <${Fragment}>
                    <div style=${styles.filterValue}>
                        <input class="form-control"
                               value=${value}
                               placeholder="Search"
                               style=${style}
                               onKeyUp=${this.onFilterValueKeyUp.bind(this)}
                               onChange=${this.onFilterValueChange.bind(this)} />
                    </div>
                    <div style=${styles.filterColumn}>
                        ${columnsSelect}
                    </div>
                <//>
            `;
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

        doReset() {
            this.setState({
                filter: {
                    value: null
                }
            });
            this.props.onReset();
        }

        isDirty() {
            // if (this.state.filter.value === null) {
            //     return false;
            // }
            // return (this.state.filter.value === this.props.currentFilter.value);
            return this.state.filter.value !== this.props.currentFilter.value;
        }

        isModified() {
            if (this.state.filter.value) {
                return true;
            }
            if (this.props.currentFilter.value) {
                return true;
            }
            if (this.props.currentSort.columnDef.index !== 0) {
                return true;
            }
            if (this.props.currentSort.direction !== 'ascending') {
                return true;
            }
            return false;
        }

        renderClearButton() {
            const enabled = this.isModified() || this.isDirty();
            const classes = [
                'fa', 'fa-lg', 'fa-times'
            ];
            let title;
            if (enabled) {
                title = 'Reset search and sorting';
                classes.push('text-danger');
            } else {
                title = 'Nothing to reset';
            }
            return html`
                <button
                        className="btn btn-default btn-sm"
                        title=${title}
                        disabled=${!enabled}
                        onClick=${this.doReset.bind(this)}>
                    <span className=${classes.join(' ')}></span>
                </button>
            `;
        }

        doApply() {
            // nothing to do .. the act of clicking the button will
            // blur the search input, running any pending query.
        }

        renderSearchButton() {
            const enabled = this.isDirty();
            const classes = [
                'fa', 'fa-lg', 'fa-search'
            ];
            let title;
            if (enabled) {
                title = 'Apply pending search';
                classes.push('text-primary');
            } else {
                title = 'No pending search';
            }
            return html`
                <button
                        className="btn btn-default btn-sm"
                        title=${title}
                        disabled=${!enabled}
                        onClick=${this.doApply.bind(this)}>
                    <span class=${classes.join(' ')}></span>
                </button>
            `;
        }

        renderButtons() {
            return html`
                <div class="btn-group">
                    ${this.renderClearButton()}
                    ${this.renderSearchButton()}
                </div>
            `;
        }

        render() {
            return html`
                <div style=${styles.main}>
                    <div style=${styles.filter}>
                        ${this.renderToolbarFilter()}
                    </div>
                    <div style=${styles.sort}>
                        <div style=${styles.label}>sort</div>
                        ${this.renderToolbarSort()}
                    </div>
                    <div style=${styles.buttons}>
                        ${this.renderButtons()}
                    </div>
                    <div style=${styles.counts}>
                        ${this.renderToolbarCounts()}
                    </div>
                </div>
            `;
        }
    }

    return Toolbar;
});
