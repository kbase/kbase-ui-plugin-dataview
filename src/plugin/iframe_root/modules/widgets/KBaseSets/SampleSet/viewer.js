define([
    'bluebird',
    'preact',
    'kb_lib/widgetUtils',
    './model'
], function (
    Promise,
    preact,
    widgetUtils,
    Model
) {
    'use strict';

    const {h, Component} = preact;

    class Loading extends Component {
        render() {
            return h('div', null, 'Loading...');
        }
    }

    class SampleSet extends Component {
        constructor(props) {
            super(props);
        }

        render() {
            return h('div', null, [
                h('h4', null, 'Description'),
                h('div', null, this.props.sampleSet.description),
                h('h4', null, 'Samples'),
                h('table', {className: 'table'}, [
                    h('thead', null, [
                        h('tr', null, [
                            h('th', null, 'Name'),
                            h('th', null, 'ID'),
                            h('th', null, 'Version')
                        ])
                    ]),
                    h('tbody', null, this.props.sampleSet.samples.map((sample) => {
                        return h('tr', null, [
                            h('td', null, h('a', {
                                href: `/#sampleview/${sample.id}/${sample.version}`,
                                target: '_parent'
                            }, sample.name)),
                            h('td', null, sample.id),
                            h('td', null, sample.version)
                        ]);
                    }))
                ])
            ]);
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
                    preact.render(preact.h(SampleSet, {sampleSet}), this.node);
                });
        }

        stop() {}

        detach() {
            this.node = '';
        }
    }

    return Viewer;
});
