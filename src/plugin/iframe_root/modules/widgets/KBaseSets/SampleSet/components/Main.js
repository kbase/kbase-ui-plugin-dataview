define([
    'preact',
    'htm',
    'components/Tabs',
    './Spreadsheet',
    './Map',
    './SampleSet',

    'css!./Main.css'
], function (
    preact,
    htm,
    Tabs,
    Spreadsheet,
    Map,
    SampleSet
) {
    'use strict';

    const {Component, Fragment} = preact;
    const html = htm.bind(preact.h);

    class Main extends Component {
        constructor(props) {
            super(props);
        }

        renderSampleSet() {
            let truncatedMessage = '';
            if (this.props.totalCount > 50) {
                truncatedMessage = html`<div className="alert alert-warning">The total number of results has been truncated; only the first 50 are displayed during this testing period.</div>`;
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
            const totalCount = Intl.NumberFormat('en-US', {
                useGrouping: true
            }).format(this.props.totalCount);
            return html`
                <${Fragment}>
                    <h4>Description</h4>
                    <p>${this.props.sampleSet.description}</p>
                    <p>This sample set contains a total of ${totalCount} samples.</p>
                <//>
            `;
        }

        renderMap() {
            return html`
            <${Map} sampleSet=${this.props.sampleSet} />
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
            }, {
                id: 'spreadsheet',
                title: 'Spreadsheet',
                render: () => {
                    return html`
                    <div className="FlexCol" style=${{marginTop: '10px'}}>
                        <${Spreadsheet} sampleSet=${this.props.sampleSet}/>
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
