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

    function formattedDate(time) {
        return Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: 'numeric',
            hour12: true
        }).format(time);
    }

    function formattedInteger(value) {
        return Intl.NumberFormat('en-US', {
            useGrouping: true
        }).format(value);
    }

    class Loading extends Component {
        render() {
            return h('div', null, [
                h('span', {
                    className: 'fa fa-spinner fa-pulse fa-2x fa-fw',
                    style: {
                        color: 'gray'
                    }
                })
            ]);
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
                            h('th', {style: {width: '15em'}}, 'ID'),
                            h('th', {style: {width: '11em'}}, '# Linked Objects'),
                            h('th', {style: {width: '11em'}}, 'Saved At'),
                            h('th', {style: {width: '8em'}}, 'Saved By'),
                            h('th', {style: {width: '5em'}}, 'Version')
                        ])
                    ]),
                    h('tbody', null, this.props.sampleSet.samples.map((sample) => {
                        return h('tr', null, [
                            h('td', null, h('a', {
                                href: `/#sampleview/${sample.id}/${sample.version}`,
                                target: '_parent'
                            }, sample.name)),
                            h('td', null, sample.sample.node_tree[0].id),
                            h('td', {style: {textAlign: 'right', paddingRight: '3em'}}, formattedInteger(sample.linkedDataCount)),
                            h('td', null, formattedDate(sample.sample.save_date)),
                            h('td', null, h('a', {
                                href: `/#user/${sample.sample.user}`,
                                target: '_parent'
                            }, sample.sample.user)),
                            h('td', {style: {textAlign: 'right', paddingRight: '1em'}}, sample.version)
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
