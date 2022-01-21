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

    class LinkedData extends Component {
        constructor(props) {
            super(props);

            this.state = {
                linkedData: props.data.linkedData,
                currentFilter: null,
                currentSort: 'Type'
            };
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
                .sort((a, b) => {
                    return a.objectInfo.typeName.localeCompare(b.objectInfo.typeName);
                })
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
                         ${Intl.DateTimeFormat('en-us', {}).format(link.created)}
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
                        Linked
                    </div>
                    <div style=${styles.LinkHeaderCol6} >
                        By
                    </div>
                </div>
                ${rows}
            `;
        }

        renderSample({sample, links}) {
            return html`
                <div style=${styles.SampleLinks}>
                    <div style=${styles.Sample}>
                        <span style=${styles.Label}>Sample name</span><a href="/#samples/view/${sample.id}/${sample.version}" target="_blank">${sample.name}</a>
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
            this.applyFilterSort(filterValue, this.state.currentSort);
        }

        onSortChange(ev) {
            const sortValue = ev.target.value;
            this.applyFilterSort(this.state.currentFilter, sortValue);
        }

        applyFilterSort(filter, sortOption) {
            const linkedData = this.props.data.linkedData;
            if (filter === null || filter.length === 0) {
                this.setState({
                    linkedData,
                    currentFilter: null,
                    currentSort: sortOption
                });
                return;
            }
            const filteredLinkedData = this.props.data.linkedData.map((item) => {
                const links = item.links.filter(({objectInfo: {typeName}}) => {
                    return (typeName === filter);
                });
                return {
                    ...item, links
                };
            });

            const sortedLinkedData = filteredLinkedData.map((item) => {
                const links = item.links.sort((a, b) => {
                    switch (sortOption) {
                    case 'Type':
                        return a.link.created - b.link.created;
                    case 'Linked':
                        return a.objectInfo.typeName.localeCompare(b.objectInfo.typeName);
                    }
                });
                return {
                    ...item, links
                };
            });

            this.setState({
                linkedData: sortedLinkedData,
                currentSort: sortOption,
                currentFilter: filter
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
                'Type', 'Linked'
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

        onResetButton() {
            this.applyFilterSort('', 'Type');
        }

        renderHeader() {
            return html`
                <div style=${styles.Header}>
                    <div class="form-inline">
                        <label style=${styles.Label}>Filter</label>
                        <label for="filter-control" style=${styles.Label}>by object type</label>
                        ${this.renderFilterControl()}
                        <label for="sort-control" style=${{...styles.Label, marginLeft: '1em'}}>Sort</label>
                        ${this.renderSortControl()}
                        <button class="btn btn-default" style="margin-left: 1em;" onClick=${this.onResetButton.bind(this)}><span class="fa fa-times" /></button>
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
