define([
    'preact',
    'htm',
    'components/Tabs',
    './Spreadsheet',
    './Spreadsheet2',
    './SampleMap',
    './SampleSet',

    'css!./Main.css'
], function (
    preact,
    htm,
    Tabs,
    Spreadsheet,
    Spreadsheet2,
    SampleMap,
    SampleSet
) {
    'use strict';

    const {Component, Fragment} = preact;
    const html = htm.bind(preact.h);

    const MAX_SAMPLES = 1000;

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
                    <${SampleSet} sampleSet=${this.props.sampleSet} totalCount=${this.props.totalCount} />
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
            <${SampleMap} sampleSet=${this.props.sampleSet} />
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
                        <${Spreadsheet2} columns=${this.props.sampleColumns} table=${this.props.sampleTable} />
                    </div>
                    `;
                }
            }];
            return html`
            <div className="SampleSet">
                <${Tabs} tabs=${tabs} />
            </div>
            `;
        }
    }

    return Main;
});
