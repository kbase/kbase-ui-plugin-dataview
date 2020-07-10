define([
    'bluebird',
    'preact',
    'htm',
    'kb_lib/widgetUtils',
    'lib/Params',
    'lib/formatters'
], function (
    Promise,
    preact,
    htm,
    widgetUtils,
    Params,
    fmt
) {
    'use strict';

    const {Component} = preact;
    const html = htm.bind(preact.h);

    function getMetadataValue(sample, name, defaultValue) {
        const metadata = sample.node_tree[0].meta_controlled;
        const userMetadata = sample.node_tree[0].meta_user;

        if (metadata[name]) {
            return metadata[name].value;
        }
        if (userMetadata[name]) {
            return userMetadata[name].value;
        }
        return defaultValue;
    }


    class SampleSet extends Component {
        constructor(props) {
            super(props);
        }

        renderSamples() {
            const rows = this.props.sampleSet.samples.map((sample) => {
                return html`
                    <tr>
                        <td><a href=${`/#samples/view/${sample.id}/${sample.version}`} target="_parent">${sample.name}</a></td>
                        <td>${getMetadataValue(sample.sample, 'material', '-')}</td>
                        <td>${sample.sample.node_tree[0].id}</td>
                        <td>${fmt.formattedDate(sample.sample.save_date)}</td>
                        <td><a href=${`/#user/${sample.sample.user}`} target="_blank">${sample.sample.user}</a></td>
                        <td style=${{textAlign: 'right', paddingRight: '2em'}}>${sample.sample.version}</td>
                        <td style=${{textAlign: 'right', paddingRight: '2em'}}>${fmt.formattedInteger(sample.linkedDataCount)}</td>
                    </tr>
                `;
            });

            return html`
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th style=${{width: '15em'}}>Material</th>
                        <th style=${{width: '10em'}}>Source Id</th>
                        <th style=${{width: '12em'}}>Saved</th>
                        <th style=${{width: '8em'}}>By</th>
                        <th style=${{width: '5em'}}>Version </th>
                        <th style=${{width: '8em'}}># Linked objs</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            `;
        }

        render() {
            let truncatedMessage = '';
            if (this.props.totalCount > 10) {
                truncatedMessage = html`<div className="alert alert-warning">The total number of results has been truncated; only the first 10 are displayed during this testing period.</div>`;
            }
            const totalCount = Intl.NumberFormat('en-US', {
                useGrouping: true
            }).format(this.props.totalCount);
            return html`
                <div>
                    <h4>Description</h4>
                    <p>${this.props.sampleSet.description}</p>
                    <p>This sample set contains a total of ${totalCount} samples.</p>
                    <h4>Samples</h4>
                    ${this.renderSamples()}
                    ${truncatedMessage}
                </div>
            `;
        }
    }

    return SampleSet;
});
