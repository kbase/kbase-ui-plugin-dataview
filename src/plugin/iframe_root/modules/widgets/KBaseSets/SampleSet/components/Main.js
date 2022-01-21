define([
    'preact',
    'htm',
    'components/Tabs',
    './Spreadsheet',
    './SampleMap3',
    './SampleSet',
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
    styles,
    {merge},
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
                <div style=${styles.summary}>
                    <div style=${styles.summaryField}>
                        <div style=${merge(styles.summaryFieldLabel, {textDecoration: 'underline'})}>Summary</div>
                    </div>
                    <div style=${styles.summaryField}>
                        <div style=${styles.summaryFieldLabel}>Sample count:</div>
                        <div style=${styles.summaryFieldValue}>${this.props.samples.length}</div>
                    </div>
                    <div style=${styles.summaryField}>
                        <div style=${styles.summaryFieldLabel}>Field count:</div>
                        <div style=${styles.summaryFieldValue}>${this.props.fieldKeys.size}</div>
                    </div>

                    <div style=${styles.summaryField}>
                        <div style=${styles.summaryFieldLabel}>Description:</div>
                        <div style=${styles.summaryFieldValue}>${this.props.sampleSet.description}</div>
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
                id: 'sampleset',
                title: 'Sample Set',
                render: () => {
                    return html`
                        <div className="FlexCol" style=${{marginTop: '10px'}}>
                            ${this.renderSampleSet()}
                        </div>
                    `;
                }
            }, {
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
            }, {
                id: 'linked-data-summary',
                title: 'Linked data summary',
                render: () => {
                    return this.props.linkedDataSummaryController.view();
                }

            }, {
                id: 'linked-data',
                title: 'Linked data',
                render: () => {
                    return this.props.linkedDataController.view();
                }

            }];
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
                    <${Tabs} tabs=${tabs} extra=${extra}/>
                </div>
            `;
        }
    }

    return Main;
});
