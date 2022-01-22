define([
    'preact',
    'htm',
    'components/Empty',
    './LinkedData.styles'
], (
    {Component, h},
    htm,
    Empty,
    styles
) => {
    const html = htm.bind(h);

    function combineStyles(...styles) {
        let newStyles = {};
        for (const style of styles) {
            newStyles = Object.assign(newStyles, style);
        }
        return newStyles;
    }


    class LinkedData extends Component {
        constructor(props) {
            super(props);

            this.DEFAULT_CURRENT_SORT = 'Type';
            this.DEFAULT_CURRENT_SORT_SAMPLE = 'Created - Newest First';

            this.state = {
                linkedData: props.data.linkedData,
                currentFilter: null,
                currentSort: this.DEFAULT_CURRENT_SORT,
                currentSortSample: this.DEFAULT_CURRENT_SORT_SAMPLE
            };
        }

        componentDidMount() {
            const {currentFilter, currentSort, currentSortSample} = this.state;
            this.applyFilterSort(currentFilter, currentSort, currentSortSample);
        }
        renderDataId(link) {
            if (link.dataid) {
                return link.dataid;
            }
            return html`<span style=${{color: 'rgb(150, 150, 150'}}>∅</span>`;
        }

        renderLinks(links) {
            if (links.length === 0) {
                return html`
                    <${Empty} message="No data linked to this sample"/>
                `;
            }
            const rows =  links
                .map(({link, objectInfo}) => {
                    return html`
                    <div style=${styles.Link} >
                        <div style=${styles.LinkCol1} >
                        <a href="/#dataview/${link.upa}" target="_blank">${link.upa}</a>
                        </div>
                        <div style=${styles.LinkCol2}>
                        <a href="/#dataview/${link.upa}" target="_blank">${objectInfo.name}</a>
                        </div>
                        <div style=${styles.LinkCol3}>
                        <a href="/#spec/type/${objectInfo.type}" target="_blank">${objectInfo.typeName}</b>
                        </div>
                        <div style=${styles.LinkCol4}>
                         ${this.renderDataId(link)}
                        </div>
                        <div style=${styles.LinkCol5}>
                        <span title="${Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'long'}).format(link.created)}">${Intl.DateTimeFormat('en-us', {}).format(link.created)}</span>
                        </div>
                        <div style=${styles.LinkCol6}>
                        <a href="/#people/${link.createdby}" target="_blank">${link.createdby}</a>
                        </div>
                    </div>
                `;
                });
            return html`
                <div style=${styles.LinkHeader} >
                    <div style=${styles.LinkHeaderCol1} >
                        Object Ref
                    </div>
                    <div style=${styles.LinkHeaderCol2} >
                        Name
                    </div>
                    <div style=${styles.LinkHeaderCol3} >
                        Type
                    </div>
                    <div style=${styles.LinkHeaderCol4} >
                        Data Id
                    </div>
                    <div style=${styles.LinkHeaderCol5} >
                        Linked On
                    </div>
                    <div style=${styles.LinkHeaderCol6} >
                        By
                    </div>
                </div>
                ${rows}
            `;
        }

        grokDescription(sample) {
            const metadata = sample.node_tree[0].meta_controlled;
            if ('description' in metadata) {
                return metadata['description'].value;
            }
            return html`<i>n/a</i>`;
        }

        renderSample({sample, links}) {
            const description = this.grokDescription(sample);

            return html`
                <div style=${styles.SampleLinks}>
                    <div style=${styles.Sample}>
                        <div style=${{...styles.Label, marginLeft: '0'}}>Sample <span className="fa fa-arrow-right" /></div>
                        <div style=${styles.Label}>name</div>
                        <div style=${combineStyles(styles.SampleField, styles.SampleName)}><a href="/#samples/view/${sample.id}/${sample.version}" target="_blank">${sample.name}</a></div>
                        <div style=${styles.Label}>description</div>
                        <div style=${combineStyles(styles.SampleField, styles.SampleDescription)}>${description}</div>
                        <div style=${styles.Label}>created</div>
                        <div style=${combineStyles(styles.SampleField, styles.SampleSaveDate)}>
                            <span title="${Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'long'}).format(sample.save_date)}">
                                ${Intl.DateTimeFormat('en-US').format(sample.save_date)}
                            </span>
                        </div>
                        <div style=${styles.Label}>version</div>
                        <div style=${combineStyles(styles.SampleField, styles.SampleVersion)}>${sample.version}</div>
                        <div style=${styles.Label}>owner</div>
                        <div style=${combineStyles(styles.SampleField, styles.SampleOwner)}><a href="/#people/${sample.user}" target="_blank">${sample.user}</a></div>
                    </div>
                    <div style=${styles.Links}>
                        ${this.renderLinks(links)}
                    </div>
                </div>
            `;
        }

        renderLinkedData() {
            return this.state.linkedData
                .filter(({links}) => {
                    return links.length > 0;
                })
                .map((sample) => {
                    return this.renderSample(sample);
                });
        }

        renderEmptySet() {
            return html`
                <div class="alert alert-warning" style=${{marginTop: '10px'}}>
                    <span style=${{fontSize: '150%', marginRight: '4px'}}>∅</span> - Sorry, no linked data in this set.
                </div>
            `;
        }

        onFilterChange(ev) {
            const filterValue = ev.target.value;
            this.applyFilterSort(filterValue, this.state.currentSort, this.state.currentSortSample);
        }

        onSortChange(ev) {
            const sortValue = ev.target.value;
            this.applyFilterSort(this.state.currentFilter, sortValue, this.state.currentSortSample);
        }

        onSortSampleChange(ev) {
            const sortValue = ev.target.value;
            this.applyFilterSort(this.state.currentFilter, this.state.currentSort, sortValue);
        }

        applyFilterSort(filter, sortFilterOption, sortSampleOption) {
            const filteredLinkedData = (() => {
                if (filter === null || filter.length === 0) {
                    return this.props.data.linkedData.slice();
                }
                return this.props.data.linkedData.map((item) => {
                    const links = item.links.filter(({objectInfo: {typeName}}) => {
                        return (typeName === filter);
                    });
                    return {
                        ...item, links
                    };
                });
            })();

            const sortedLinkedData = filteredLinkedData
                .sort((a, b) => {
                    switch (sortSampleOption) {
                    case 'Created - Newest First':
                        return a.sample.save_date - b.sample.save_date;
                    case 'Created - Oldest First':
                        return b.sample.save_date - a.sample.save_date;
                    case 'Name':
                        return a.sample.name.localeCompare(b.sample.name);
                    case 'Owner':
                        return a.sample.user.localeCompare(b.sample.user);
                    }
                })
                .map((item) => {
                    const links = item.links.slice().sort((a, b) => {
                        switch (sortFilterOption) {
                        case 'Type':
                            return a.objectInfo.typeName.localeCompare(b.objectInfo.typeName);
                        case 'Type2':
                            return b.objectInfo.typeName.localeCompare(a.objectInfo.typeName);
                        case 'Linked - Newest First':
                            return b.link.created - a.link.created;
                        case 'Linked - Oldest First':
                            return a.link.created - b.link.created;
                        }
                    });

                    return {
                        ...item, links
                    };
                });

            this.setState({
                linkedData: sortedLinkedData,
                currentFilter: filter,
                currentSort: sortFilterOption,
                currentSortSample: sortSampleOption
            });
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

        renderSortControl() {
            const sortBy = [
                'Type', 'Type2', 'Linked - Newest First', 'Linked - Oldest First'
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

        renderSortSampleControl() {
            const sortBy = [
                'Name', 'Created - Newest First', 'Created - Oldest First', 'Owner'
            ];
            const options = sortBy.map((sortId) => {
                const selected = this.state.currentSortSample === sortId;
                return html`
                    <option value=${sortId} selected=${selected}>${sortId}</option>
                `;
            });
            return html`
                <select class="form-control" id="sort-sample-control" onChange=${this.onSortSampleChange.bind(this)}>
                    ${options}
                </select>
            `;
        }

        onResetButton() {
            this.applyFilterSort('', this.DEFAULT_CURRENT_SORT, this.DEFAULT_CURRENT_SORT_SAMPLE);
        }

        renderResetButton() {
            const disabled = (() => {
                return (
                    (this.state.currentFilter === null || this.state.currentFilter === '') &&
                    (this.state.currentSort === this.DEFAULT_CURRENT_SORT) &&
                    (this.state.currentSortSample === this.DEFAULT_CURRENT_SORT_SAMPLE)
                );
            })();
            return html`
                <button class="btn btn-default" style="margin-left: 1em;" disabled=${disabled} onClick=${this.onResetButton.bind(this)}><span class="fa fa-times" /></button>
            `;
        }

        renderHeader() {
            return html`
                <div style=${styles.Header}>
                    <div class="form-inline">
                        <label style=${styles.Label}>Filter <span className="fa fa-arrow-right" /></label>
                        <label for="filter-control" style=${{...styles.Label, marginLeft: '0.5em'}}>by object type</label>
                        ${this.renderFilterControl()}
                        <label style=${{...styles.Label, marginLeft: '2em'}}>Sort <span className="fa fa-arrow-right" /></label>
                        <label for="sort-control" style=${{...styles.Label, marginLeft: '0.5em'}}>samples</label>
                        ${this.renderSortSampleControl()}
                        <label for="sort-control" style=${{...styles.Label, marginLeft: '1em'}}>links</label>
                        ${this.renderSortControl()}
                        ${this.renderResetButton()}
                    </div>
                </div>
            `;
        }

        render() {
            if (this.state.linkedData.length === 0) {
                return this.renderEmptySet();
            }
            return html`
                <div style=${styles.main}>
                    ${this.renderHeader()}
                    <div style=${styles.LinkedData}>
                        ${this.renderLinkedData()}
                    </div>
                </div>
            `;
        }
    }

    return LinkedData;
});
