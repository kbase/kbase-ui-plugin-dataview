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

    class LinkedSamples extends Component {
        constructor(props) {
            super(props);
        }

        renderLinkedSamples() {
            const rows = this.props.linkedSamples.map(({link, sample}) => {
                return html`
                <tr>
                    <td><a href="/#sampleview/${link.id}/${link.version}">${sample.sample.name}</a></td>
                    <td>${getMetadataValue(sample.sample, 'material', '-')}</td>
                    <td>${sample.sample.node_tree[0].id}</td>
                    <td>${fmt.formattedDate(sample.sample.save_date)}</td>
                    <td><a href="/#people/${sample.sample.user}" target="_blank">${sample.sample.user}</a></td>
                    <td style=${{textAlign: 'right', paddingRight: '2em'}}>${sample.sample.version}</td>
                    <td style=${{textAlign: 'right', paddingRight: '2em'}}>${fmt.formattedInteger(sample.linkedData.links.length)}</td>
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
                        <th style=${{width: '5em'}}>Version</th>
                        <th style=${{width: '8em'}}># Linked objs</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
            `;
        }

        renderNoLinkedSamples() {
            return html`
            <div class="alert alert-info">
            No samples linked to this object.
            </div>
            `;
        }

        render() {
            if (this.props.linkedSamples.length === 0) {
                return this.renderNoLinkedSamples();
            }
            return html`
                <div className="LinkedSamples">
                ${this.renderLinkedSamples()}
                </table>
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
            const p = new Params(params);
            this.workspaceId = p.check('workspaceId', 'integer', {
                required: true
            });
            this.objectId = p.check('objectId', 'integer', {
                required: true
            });
            this.objectVersion = p.check('objectVersion', 'integer', {
                required: true
            });

            // Display loading spinner...
            preact.render(preact.h(Loading, { }), this.node);

            // // Get the object form the model.
            this.model = new Model({
                runtime: this.runtime,
                workspaceId: this.workspaceId,
                objectId: this.objectId,
                objectVersion: this.objectVersion
            });

            // // Display the object!

            return this.model
                .getLinkedSamples()
                .then((linkedSamples) => {
                    preact.render(preact.h(LinkedSamples, {linkedSamples}), this.node);
                });
        }

        stop() {}

        detach() {
            this.node = '';
        }
    }

    return Viewer;
});
