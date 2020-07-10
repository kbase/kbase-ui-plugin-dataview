define([
    'bluebird',
    'preact',
    'htm',
    'kb_lib/widgetUtils',
    'lib/Params',
    'lib/formatters',
    'components/Loading',
    './model',
    'components/SimpleError',
    './components/SampleSet'
], function (
    Promise,
    preact,
    htm,
    widgetUtils,
    Params,
    fmt,
    Loading,
    Model,
    SimpleError,
    SampleSet
) {
    'use strict';

    // const html = htm.bind(preact.h);

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
            const model = new Model({
                runtime: this.runtime,
                workspaceId: this.workspaceId,
                objectId: this.objectId,
                objectVersion: this.objectVersion
            });

            // Display the object!

            // preact.render(preact.h(SimpleError, {message: 'foo'}), this.node);

            return model
                .getObject()
                .then((sampleSet) => {
                    // TODO: TODO: TODO: remove when sample service supports multiple samples w/paging
                    const totalCount = sampleSet.samples.length;
                    sampleSet.samples = sampleSet.samples.slice(0, 10);
                    return model.getSamples(sampleSet.samples)
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
                            preact.render(preact.h(SampleSet, {sampleSet, totalCount}), this.node);
                            // preact.render(preact.h(SimpleError, {message: 'whaaat?'}), this.node);

                        })
                        .catch((err) => {
                            console.error('Error fetching samples', err);
                            preact.render(preact.h(SimpleError, {message: err.message}), this.node);
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
