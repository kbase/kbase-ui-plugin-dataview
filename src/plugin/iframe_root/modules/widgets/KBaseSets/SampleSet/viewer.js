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


        samplesToTable(model, samples, sampleSet) {
            const columnDefs = model.createColumnDefs(sampleSet);
            const sampleColumns = columnDefs.map((def) => {
                return {
                    key: def.key,
                    title: def.label,
                    type: def.dataType,
                    format: def.format
                };
            });

            sampleColumns.unshift({
                key: 'row_number',
                title: '#',
                type: 'number'
            });

            function formatValue(value, formatter) {
                if (!formatter) {
                    return value;
                }

                switch (formatter.type) {
                case 'number':
                    if (formatter.precision) {
                        return Intl.NumberFormat('en-US', {
                            maximumSignificantDigits: formatter.precision,
                            useGrouping: formatter.group ? true : false
                        }).format(value);
                    } else if (formatter.decimalPlaces) {
                        return Intl.NumberFormat('en-US', {
                            maximumFractionDigits: formatter.decimalPlaces,
                            minimumFractionDigits: formatter.decimalPlaces,
                            useGrouping: formatter.group ? true : false
                        }).format(value);
                    } else {
                        return Intl.NumberFormat('en-US', {
                            useGrouping: formatter.group ? true : false
                        }).format(value);
                    }
                default:
                    return value;
                }
            }

            function getCellContent(sample, columnDef) {
                switch (columnDef.type) {
                case 'sample':
                    var sampleField = sample.sample[columnDef.key];
                    if (!sampleField) {
                        return null;
                    }
                    return sampleField;
                case 'node':
                    var nodeField = sample.sample.node_tree[0][columnDef.key];
                    if (!nodeField) {
                        return null;
                    }
                    return nodeField;
                case 'metadata':
                    var controlledField = sample.sample.node_tree[0].meta_controlled[columnDef.key];
                    if (!controlledField) {
                        return null;
                    }
                    return formatValue(controlledField.value, columnDef.spec);
                case 'user':
                    var userField = sample.sample.node_tree[0].meta_user[columnDef.key];
                    if (!userField) {
                        return null;
                    }
                    return userField.value;
                case 'unknown':
                    var unknownField = sample.sample.node_tree[0].meta_user[columnDef.key];
                    if (!unknownField) {
                        return null;
                    }
                    return unknownField.value;
                }
            }

            const sampleTable = samples.map((sample, index) => {
                const row = columnDefs.map((def) =>{
                    return getCellContent(sample, def);
                });
                row.unshift(index + 1);
                return row;
            });

            return [sampleColumns, sampleTable];
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
                            const [sampleColumns, sampleTable] = this.samplesToTable(model, samples, sampleSet);
                            preact.render(preact.h(Main, {sampleSet, totalCount, sampleTable, sampleColumns}), this.node);
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
