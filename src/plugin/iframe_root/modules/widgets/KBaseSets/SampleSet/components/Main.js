define([
    'preact',
    'htm',
    'components/Tabs',
    './Spreadsheet',
    './SampleMap',
    './SampleMap2',
    './SampleSet',
    './Main.styles',
    'lib/merge',
    '../constants'
], (
    {Component, Fragment, h},
    htm,
    Tabs,
    Spreadsheet,
    SampleMap,
    SampleMap2,
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
                    <h4>Description</h4>
                    <div data-k-b-testhook-element="description">
                        ${description}
                    </div>
                <//>
            `;
        }

        renderMap() {
            return html`
                <${SampleMap} samples=${this.props.samples}/>
            `;
        }

        renderMap2() {
            return html`
                <${SampleMap2} samples=${this.props.samples}/>
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
                    return this.renderSampleSet();
                }
            }, {
                id: 'description',
                title: 'Description',
                render: () => {
                    return this.renderDescription();
                }
            }, {
                id: 'map',
                title: 'Map',
                render: () => {
                    return this.renderMap();
                }
            }, {
                id: 'map2',
                title: 'Map 2',
                render: () => {
                    return this.renderMap2();
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
            }];
            return html`
                <div style=${styles.main}>
                    ${this.renderSummary()}
                    <${Tabs} tabs=${tabs}/>
                </div>
            `;
        }
    }

    return Main;
});
