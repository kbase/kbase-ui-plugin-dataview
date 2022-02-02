define([
    'preact',
    'htm',
    'components/Tabs',
    './Spreadsheet',
    './SampleMap3',
    './SampleSet',
    './SampleSet2',
    './Main.styles',
    'lib/merge',
    '../constants'
], (
    {Component, Fragment, h},
    htm,
    Tabs,
    Spreadsheet,
    SampleMap3,
    SampleSet,
    SampleSet2,
    styles,
    {merge},
    {MAX_SAMPLES}
) => {
    const html = htm.bind(h);

    class DataPill extends Component {
        render() {
            return html`
                <div style=${styles.DataPill}>
                    <div styles=${styles.DataPillLabel}>
                        ${this.props.label}
                    </div>
                    <div styles=${styles.DataPillValue}>
                        ${this.props.value}
                    </div>
                </div>
            `;
        }
    }

    class DataPillGroup extends Component {
        render() {
            return html`
                <div style=${styles.DataPillGroup}>
                    <div styles=${styles.DataPillGroupTitle}>
                        ${this.props.title}
                    </div>
                    <div styles=${styles.DataPillGroupBody}>
                        ${this.props.children}
                    </div>
                </div>
            `;
        }
    }
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

        renderDescription() {
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

        renderSummary() {
            return html`
                <div style=${merge(styles.DataPillGroup, {marginBottom: '10px', marginLeft: '1em'})}>
                    <div style=${styles.DataPillGroupTitle}>
                        Summary
                    </div>
                    <div style=${styles.DataPillGroupBody}>
                        <div style=${styles.DataPill}>
                            <div style=${styles.DataPillLabel}>
                                Sample count
                            </div>
                            <div style=${styles.DataPillValue}>
                                ${this.props.samples.length}
                            </div>
                        </div>
                        <div style=${styles.DataPill}>
                            <div style=${styles.DataPillLabel}>
                                Field count
                            </div>
                            <div style=${styles.DataPillValue}>
                                ${this.props.fieldKeys.size}
                            </div>
                        </div>
                        <div style=${styles.DataPill}>
                            <div style=${styles.DataPillLabel}>
                                Description
                            </div>
                            <div style=${styles.DataPillValue}>
                                ${this.props.sampleSet.description}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        onRowClick(sampleRow) {
            const {id, version} = sampleRow;
            window.open(`/#samples/view/${id}/${version}`, '_blank');
        }

        render() {
            const tabs = [{
                id: 'description',
                title: 'Description',
                display: false,
                render: () => {
                    return html`
                        <div className="FlexCol" style=${{marginTop: '10px'}}>
                            ${this.renderDescription()}
                        </div>
                    `;
                }
            }, {
                id: 'map',
                title: 'Map',
                render: () => {
                    return this.renderMap3();
                }
            }, {
                id: 'spreadsheet',
                title: 'Spreadsheet',
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
            },
                //  {
                //     id: 'linked-data-summary2',
                //     title: 'Linked data summary2',
                //     render: () => {
                //         return this.props.linkedDataSummaryController2.view();
                //     }

            // },
            ];

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
                tabs.unshift({
                    id: 'sampleset3',
                    title: 'Samples',
                    render: () => {
                        return this.props.sampleSetController3.view();
                    }
                });
            } else {
                tabs.unshift({
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
                    ${this.renderSummary()}
                    <${Tabs} tabs=${tabs} paneStyle=${{paddingTop: '10px'}} extra=${extra}/>
                </div>
            `;
        }
    }

    return Main;
});
