define([
    'preact',
    'htm',
    'kb_lib/widgetUtils',
    'components/Progress',
    './model',
    'components/SimpleError',
    './components/Main'
], function (
    preact,
    htm,
    widgetUtils,
    Progress,
    Model,
    SimpleError,
    Main
) {
    'use strict';

    const html = htm.bind(preact.h);
    const MAX_SAMPLES = 10000;

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

        renderSimpleProgress(progress) {
            return html`Loading samples <span className="text-info" style=${{fontWeight: 'bold'}}>${progress}%</span> ...`;
        }

        onProgress(current, total) {
            const progress = Math.round(100 * current/total);
            this.renderProgress(progress);
        }

        renderProgress(progress) {
            const content = html`
                <div style=${{width: '50%'}}>
                    <div>Loading samples...</div>
                    <${Progress} progress=${progress} />
                </div>
            `;
            preact.render(content, this.node);
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
            this.renderProgress(0);

            // Get the object form the model.
            const model = new Model({
                runtime: this.runtime,
                workspaceId: this.workspaceId,
                objectId: this.objectId,
                objectVersion: this.objectVersion
            });

            // Display the object!

            return model
                .getObject()
                .then((sampleSet) => {
                    // TODO: TODO: TODO: remove when sample service supports multiple samples w/paging
                    const totalCount = sampleSet.samples.length;
                    sampleSet.samples = sampleSet.samples.slice(0, MAX_SAMPLES);
                    return model.getSamplesHybrid({
                        samples: sampleSet.samples,
                        batchSize: 20,
                        onProgress: this.onProgress.bind(this)
                    })
                        .then((samples) => {
                            const samplesMap = samples.reduce((samplesMap, {sample}) => {
                                samplesMap[sample.id] = {
                                    sample,
                                    linkedDataCount: 0
                                };
                                return samplesMap;
                            }, {});
                            sampleSet.samples.forEach((sampleSetItem) => {
                                sampleSetItem.sample = samplesMap[sampleSetItem.id].sample;
                                sampleSetItem.linkedDataCount = samplesMap[sampleSetItem.id].linkedDataCount;
                            });
                            preact.render(preact.h(Main, {sampleSet, totalCount}), this.node);
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
