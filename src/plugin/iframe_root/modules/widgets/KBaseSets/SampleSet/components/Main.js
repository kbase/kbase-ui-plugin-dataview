define([
    'preact',
    'htm',
    'components/Tabs',
    './Spreadsheet',
    './SampleMap',
    './SampleSet',
    './Main.styles',
    'lib/merge'
], function (
    preact,
    htm,
    Tabs,
    Spreadsheet,
    SampleMap,
    SampleSet,
    styles,
    {merge}
) {
    const {Component, Fragment} = preact;
    const html = htm.bind(preact.h);

    const MAX_SAMPLES = 10000;


    class Main extends Component {
        constructor(props) {
            super(props);
        }

        renderSampleSet() {
            let truncatedMessage = '';
            if (this.props.totalCount > MAX_SAMPLES) {
                truncatedMessage = html`<div className="alert alert-warning">The total number of results has been truncated; only the first ${MAX_SAMPLES} are displayed during this testing period.</div>`;
            }
            // const totalCount = Intl.NumberFormat('en-US', {
            //     useGrouping: true
            // }).format(this.props.totalCount);
            // <p>This sample set contains a total of ${totalCount} samples.</p>
            //         <h4>Samples</h4>
            return html`
                <${Fragment}>
                    <${SampleSet} sampleSet=${this.props.sampleSet} samples=${this.props.samples} totalCount=${this.props.totalCount} userProfiles=${this.props.userProfiles}/>
                    ${truncatedMessage}
                <//>
            `;
        }

        renderDescription() {
            // const totalCount = Intl.NumberFormat('en-US', {
            //     useGrouping: true
            // }).format(this.props.totalCount);
            //
            //<p>This sample set contains a total of ${totalCount} samples.</p>
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
            <${SampleMap} samples=${this.props.samples} />
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
                        <div style=${styles.summaryFieldLabel}>Format:</div>
                        <div style=${styles.summaryFieldValue}>${this.props.format.title}</div>
                    </div>
                    
                    <div style=${styles.summaryField}>
                        <div style=${styles.summaryFieldLabel}>Description:</div>
                        <div style=${styles.summaryFieldValue}>${this.props.sampleSet.description}</div>
                    </div>
                </div>
            `;
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
            },
            // {
            //     id: 'spreadsheet',
            //     title: 'Spreadsheet',
            //     render: () => {
            //         return html`
            //         <div className="FlexCol" style=${{marginTop: '10px'}}>
            //             <${Spreadsheet} sampleSet=${this.props.sampleSet} />
            //         </div>
            //         `;
            //     }
            // },
            {
                id: 'spreadsheet',
                title: 'Spreadsheet',
                render: () => {
                    return html`
                    <div className="FlexCol" style=${{marginTop: '10px'}}>
                        <${Spreadsheet} columns=${this.props.sampleColumns} table=${this.props.sampleTable} columnGroups=${this.props.columnGroups} />
                    </div>
                    `;
                }
            }];
            return html`
            <div style=${styles.main}>
                ${this.renderSummary()}
                <${Tabs} tabs=${tabs} />
            </div>
            `;
        }
    }

    return Main;
});
