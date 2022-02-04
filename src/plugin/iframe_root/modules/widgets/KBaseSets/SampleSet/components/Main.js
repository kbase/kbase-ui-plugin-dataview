define([
    'preact',
    'htm',
    'components/Tabs',
    'components/DataPillGroup',
    'components/DataPill',
    './Spreadsheet',
    './SampleMap3',
    './SampleSet',
    './SampleSet2',
    './Main.styles',
    '../constants'
], (
    {Component, Fragment, h},
    htm,
    Tabs,
    DataPillGroup,
    DataPill,
    Spreadsheet,
    SampleMap3,
    SampleSet,
    SampleSet2,
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
                    <${SampleSet} sampleSet=${this.props.sampleSet} samples=${this.props.samples}
                                  totalCount=${this.props.totalCount} userProfiles=${this.props.userProfiles}/>
                        ${truncatedMessage}
                    </
                    />
            `;
        }

        renderSampleSet2x() {
            let truncatedMessage = '';
            if (this.props.totalCount > MAX_SAMPLES) {
                truncatedMessage = html`
                    <div className="alert alert-warning">The total number of results has been truncated; only the first
                        ${MAX_SAMPLES} are displayed during this testing period.
                    </div>`;
            }
            return html`
                <${Fragment}>
                    <${SampleSet2} sampleSet=${this.props.sampleSet} samples=${this.props.samples}
                                  totalCount=${this.props.totalCount} userProfiles=${this.props.userProfiles}/>
                        ${truncatedMessage}
                    </
                    />
            `;
        }

        // renderSampleSet2() {
        //     let truncatedMessage = '';
        //     if (this.props.totalCount > MAX_SAMPLES) {
        //         truncatedMessage = html`
        //             <div className="alert alert-warning">The total number of results has been truncated; only the first
        //                 ${MAX_SAMPLES} are displayed during this testing period.
        //             </div>`;
        //     }
        //     return html`
        //         <${Fragment}>
        //             <${SampleSet2} sampleSet=${this.props.sampleSet} samples=${this.props.samples}
        //                           totalCount=${this.props.totalCount} userProfiles=${this.props.userProfiles}/>
        //                 ${truncatedMessage}
        //             </
        //             />
        //     `;
        // }

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
                <${SampleMap3} samples=${this.props.samples} fieldKeys=${geolocationGroup.fields} fieldSchemas=${geolocationFields} />
            `;
        }

        renderSummaryHeader() {
            return html`
                <${DataPillGroup} title="Summary" style=${{marginBottom: '10px', marginLeft: '1em'}}>
                    
                <${DataPill} label="Sample count" value=${this.props.samples.length} />
                <${DataPill} label="Field count" value=${this.props.fieldKeys.size} />
                <${DataPill} label="Description" value=${this.props.sampleSet.description} />
                </div>
            `;
        }

        onRowClick(sampleRow) {
            const {id, version} = sampleRow;
            window.open(`/#samples/view/${id}/${version}`, '_blank');
        }

        render() {
            const tabs = [{
                id: 'summary',
                title: 'Summary',
                render: () => {
                    return this.props.summaryController.view();
                }
            }];

            if (this.props.linksEnabled) {
                tabs.push({
                    id: 'sampleset3',
                    title: 'Samples',
                    render: () => {
                        return this.props.sampleSetController3.view();
                    }
                });
            } else {
                tabs.push({
                    id: 'sampleset',
                    title: 'Samples',
                    render: () => {
                        return html`
                        <div className="FlexCol" style=${{marginTop: '10px'}}>
                            ${this.renderSampleSet()}
                        </div>
                    `;
                    }
                });
            }


            tabs.push({
                id: 'map',
                title: 'Map',
                render: () => {
                    return this.renderMap3();
                }
            });

            tabs.push({
                id: 'spreadsheet',
                title: 'Metadata',
                render: () => {
                    return html`
                        <div className="FlexCol" style=${{marginTop: '10px'}}>
                            <${Spreadsheet} columns=${this.props.sampleColumns}
                                            table=${this.props.sampleTable}
                                            onRowClick=${this.onRowClick.bind(this)}
                                            columnGroups=${this.props.columnGroups}/>
                        </div>
                    `;
                }
            });
            //  {
            //     id: 'linked-data-summary2',
            //     title: 'Linked data summary2',
            //     render: () => {
            //         return this.props.linkedDataSummaryController2.view();
            //     }

            // },
            // ];

            // if (this.props.linksEnabled) {
            //     tabs.unshift({
            //         id: 'sampleset2',
            //         title: 'Sample Set 2',
            //         render: () => {
            //             return html`
            //             <div className="FlexCol" style=${{marginTop: '10px'}}>
            //                 ${this.renderSampleSet2()}
            //             </div>
            //         `;
            //         }
            //     });
            // }



            if (this.props.linksEnabled) {
                // tabs.push({
                //     id: 'linked-data-summary',
                //     title: 'Linked Data Summary',
                //     render: () => {
                //         return this.props.linkedDataSummaryController.view();
                //     }

                // });
                // tabs.push({
                //     id: 'linked-data',
                //     title: 'Linked Data',
                //     render: () => {
                //         return this.props.linkedDataController.view();
                //     }

                // });
                // tabs.push({
                //     id: 'linked-data2',
                //     title: 'Linked Data 2',
                //     render: () => {
                //         return this.props.linkedDataController2.view();
                //     }

                // });
                tabs.push({
                    id: 'linked-data3',
                    title: 'Linked Data Objects',
                    render: () => {
                        return this.props.linkedDataController3.view();
                    }

                });
            }
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
                    ${this.renderSummaryHeader()}
                    <${Tabs} tabs=${tabs} paneStyle=${{paddingTop: '10px'}} extra=${extra}/>
                </div>
            `;
        }
    }

    return Main;
});
