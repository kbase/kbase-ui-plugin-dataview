define([
    'bluebird',
    'preact',
    'htm',
    'kb_lib/widgetUtils',
    'lib/Params',
    'lib/formatters',
    'components/Loading',
    './model'
], function (
    Promise,
    preact,
    htm,
    widgetUtils,
    Params,
    fmt,
    Loading,
    Model
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
            return html`
                <div>
                    <h4>Description</h4>
                    <div>${this.props.sampleSet.description}</div>
                    <h4>Samples</h4>
                    ${this.renderSamples()}
                </div>
            `;
        }
    }

    class Viewer {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
            this.createdObjects = null;
        }

        // LIFECYCLE

        attach(node) {
            this.node = node;
        }

        start(params) {
            // Check params
            const p = new widgetUtils.Params(params);
            this.workspaceId = p.check('workspaceId', 'number', {
                required: true
            });
            this.objectId = p.check('objectId', 'number', {
                required: true
            });
            this.objectVersion = p.check('objectVersion', 'number', {
                required: true
            });

            // Display loading spinner...
            preact.render(preact.h(Loading, { }), this.node);

            // Get the object form the model.
            this.model = new Model({
                runtime: this.runtime,
                workspaceId: this.workspaceId,
                objectId: this.objectId,
                objectVersion: this.objectVersion
            });

            // Display the object!

            return this.model
                .getObject()
                .then((sampleSet) => {
                    return this.model.getSamples(sampleSet.samples)
                        .then((samples) => {
                            const samplesMap = samples.reduce((samplesMap, {sample, linkedData}) => {
                                samplesMap[sample.id] = {
                                    sample,
                                    linkedDataCount: linkedData.links.length
                                };
                                return samplesMap;
                            }, {});
                            sampleSet.samples.forEach((sampleSetItem) => {
                                sampleSetItem.sample = samplesMap[sampleSetItem.id].sample;
                                sampleSetItem.linkedDataCount = samplesMap[sampleSetItem.id].linkedDataCount;
                            });
                            preact.render(preact.h(SampleSet, {sampleSet}), this.node);
                        });
                });
        }

        stop() {}

        detach() {
            this.node = '';
        }
    }

    return Viewer;
});
