define([
    'preact',
    'htm',
    'europaSupport',
    'components/Tabs',
    './Spreadsheet',
    './SampleMap',
    './SampleSet',
    './Main.styles',
    '../constants'
], (
    {Component, Fragment, h},
    htm,
    {UIURL},
    Tabs,
    Spreadsheet,
    SampleMap,
    SampleSet,
    styles,
    {MAX_SAMPLES}
) => {
    const html = htm.bind(h);

    class Main extends Component {
        renderSampleSet() {
            let truncatedMessage = '';
            if (this.props.totalCount > MAX_SAMPLES) {
                truncatedMessage = html`
                    <div className="alert alert-warning">The total number of results has been truncated; only the first
                        ${MAX_SAMPLES} are displayed during this testing period.
                    </div>`;
            }
            return html`
                <${Fragment}>
                    <${SampleSet} 
                        runtime=${this.props.runtime}
                        sampleSet=${this.props.sampleSet} 
                        samples=${this.props.samples}
                        totalCount=${this.props.totalCount} 
                        userProfiles=${this.props.userProfiles}
                    />
                        ${truncatedMessage}
                    </>
            `;
        }
        renderSummary() {
            // TODO: this description should perhaps be markdown? Or simply generate paragraphs on
            // line feeds. Currently the control is a text input not textarea
            const description = this.props.sampleSet.description.split('\n')
                .map((line) => {
                    return html`
                        <p>${line}</p>
                    `;
                });
            return html`
                <${Fragment}>
                    <h4 style=>Description</h4>
                    <div data-k-b-testhook-element="description">
                        ${description}
                    </div>
                <//>
            `;
        }

        renderMap3() {
            const geolocationGroup = this.props.groups.filter((group) => {
                return group.name === 'geolocation';
            })[0];

            const geolocationFields = this.props.sampleColumns.filter((column) => {
                return geolocationGroup.fields.includes(column.key);
            });

            return html`
                <${SampleMap} samples=${this.props.samples} fieldKeys=${geolocationGroup.fields} fieldSchemas=${geolocationFields} />
            `;
        }

        onRowClick(sampleRow) {
            const {id, version} = sampleRow;
            const url = UIURL({path: `samples/view/${id}/${version}`, type: 'kbaseui'}, true)
            window.open(url, '_blank');
        }

        render() {
            const tabs = [{
                id: 'summary',
                title: 'Summary',
                render: () => {
                    return this.props.summaryController.view();
                }
            }];

            tabs.push({
                id: 'sampleset3',
                title: 'Samples',
                render: () => {
                    return this.props.sampleSetController.view();
                }
            });

            tabs.push({
                id: 'map',
                title: 'Map',
                render: () => {
                    return this.renderMap3();
                }
            });

            tabs.push({
                id: 'spreadsheet',
                title: 'Sample Data',
                render: () => {
                    return html`
                        <div className="FlexCol">
                            <${Spreadsheet} columns=${this.props.sampleColumns}
                                            table=${this.props.sampleTable}
                                            onRowClick=${this.onRowClick.bind(this)}
                                            columnGroups=${this.props.columnGroups}/>
                        </div>
                    `;
                }
            });

            tabs.push({
                id: 'linked-data3',
                title: 'Linked Data',
                render: () => {
                    return this.props.linkedDataController.view();
                }

            });

            const extra = html`
                <div>
                    <a className="btn btn-link" href="https://docs.kbase.us/workflows/samples-and-samplesets"
                       target="_blank" style=${{fontSize: '120%'}}>
                        <span className="fa fa-question-circle"></span>
                    </a>
                </div>
            `;
            return html`
                <div style=${styles.main}>
                    <${Tabs} tabs=${tabs} paneStyle=${{paddingTop: '10px'}} extra=${extra}/>
                </div>
            `;
        }
    }

    return Main;
});
