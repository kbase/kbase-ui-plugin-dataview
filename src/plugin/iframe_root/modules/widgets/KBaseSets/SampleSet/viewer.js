define([
    'preact',
    'htm',
    'kb_lib/widgetUtils',
    'components/Progress',
    './model',
    'components/SimpleError',
    'components/SimpleWarning',
    'components/SimpleInfo',
    'components/Loading',
    './components/Main',
    './constants'
], (
    preact,
    htm,
    widgetUtils,
    Progress,
    Model,
    SimpleError,
    SimpleWarning,
    SimpleInfo,
    Loading,
    Main,
    {MAX_SAMPLES}
) => {
    const html = htm.bind(preact.h);

    class Viewer {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
            this.createdObjects = null;
            this.status = 'NONE';
        }

        // LIFECYCLE

        attach(node) {
            this.node = node;
            this.status = 'ATTACHED';
        }

        renderSimpleProgress(progress) {
            return html`Loading samples <span className="text-info" style=${{fontWeight: 'bold'}}>${progress}
                %</span> ...`;
        }

        onProgress(current, total) {
            const progress = Math.round(100 * current / total);
            this.renderProgress(progress);
        }

        renderProgress(progress) {
            const content = html`
                <div style=${{width: '50%'}}>
                    <div>Loading samples...</div>
                    <${Progress} progress=${progress}/>
                </div>
            `;
            preact.render(content, this.node);
        }

        makeFormatter(schema) {
            return (value) => {
                switch (schema.type) {
                case 'string':
                    switch (schema.format) {
                    case 'url':
                        return html`
                            <a href="${value}" target="_blank">${value}</a>
                        `;
                    case 'ontology-term':
                        return html`
                            <a href="/#ontology/term/${schema.namespace}/${value}" target="_blank">${value}</a>
                        `;
                    default:
                        return value;
                    }
                case 'number':
                    if ('formatting' in schema.kbase) {
                        return Intl.NumberFormat('en-US', schema.kbase.formatting).format(value);
                    }
                    return value;

                default:
                    return value;
                }
            };
        }

        /**
         *
         * @param model
         * @param samples
         * @param sampleSet
         * @param allFieldKeys {Set} Unique set of all fields.
         * @returns {Promise<*[]>}
         */
        async samplesToTable(model, samples, sampleSet, allFieldKeys) {
            const fieldGroups = await model.getFieldGroups();
            const fieldKeys = new Set(Array.from(allFieldKeys));

            // first pass, just flatten out all the fields, and pluck out the ones in fieldKeys.
            const groupedFields = [];
            const groups = [];
            for (const {name, title, fields} of fieldGroups) {
                const group = {
                    name, title,
                    count: 0
                };
                for (const fieldKey of fields) {
                    if (fieldKeys.has(fieldKey)) {
                        groupedFields.push({
                            groupTitle: title,
                            groupName: name,
                            type: 'controlled',
                            fieldKey
                        });
                        fieldKeys.delete(fieldKey);
                        group.count += 1;
                    }
                }
                if (group.count > 0) {
                    groups.push(group);
                }
            }

            // Get the schemas for all field controlled fields.
            const fieldsToGet = groupedFields
                .map(({fieldKey}) => {
                    return fieldKey;
                });
            const fieldSchemas = await model.getFieldSchemas(fieldsToGet);
            groupedFields.forEach((field, index) => {
                field.schema = fieldSchemas[index];
            });

            // Any remaining fields are user fields
            if (fieldKeys.size > 0) {
                Array.from(fieldKeys).sort().forEach((fieldKey) => {
                    groupedFields.push({
                        type: 'user',
                        fieldKey
                    });
                });
                groups.push({
                    name: 'userFields',
                    title: 'User Fields',
                    count: fieldKeys.size
                });
            }

            // Here we add a group composed of top level fields
            const sampleColumns = [
                {
                    index: 0,
                    fieldKey: 'row_number',
                    title: '#',
                    fieldType: 'row-number',
                    type: 'number'
                },
                {
                    index: 1,
                    fieldKey: 'name',
                    title: 'Name',
                    fieldType: 'attribute',
                    type: 'string'
                },
                {
                    index: 2,
                    fieldKey: 'id',
                    title: 'ID',
                    fieldType: 'node-attribute',
                    type: 'string'
                }
            ];
            groups.unshift({
                name: 'sampleFields',
                title: 'Sample',
                count: sampleColumns.length
            });

            // Here we add all fields which are mapped to the field
            // grouping and ordering spec.
            groupedFields.forEach(({type, fieldKey, schema}, index) => {
                switch (type) {
                case 'controlled': {
                    const unit = (() => {
                        if ('unit' in schema.kbase) {
                            return schema.kbase.unit;
                        }
                        return null;
                    })();
                    sampleColumns.push({
                        index: index + 3,
                        fieldKey,
                        title: schema.title,
                        fieldType: 'controlled',
                        type: schema.type,
                        format: schema.kbase.format,
                        formatter: this.makeFormatter(schema),
                        unit
                    });
                    break;
                }
                case 'user':
                    sampleColumns.push({
                        index: index + 3,
                        fieldKey,
                        title: fieldKey,
                        fieldType: 'user',
                        type: 'string',
                        formatter: (value) => {
                            return value;
                        }
                    });
                }
            });

            function getCellContent(sample, type, fieldKey, rowIndex) {
                switch (type) {
                case 'row-number':
                    return rowIndex + 1;
                case 'attribute':
                    return sample[fieldKey];
                case 'node-attribute':
                    return sample.node_tree[0][fieldKey];
                case 'controlled':
                    return (() => {
                        const controlledField = sample.node_tree[0].meta_controlled[fieldKey];
                        if (!controlledField) {
                            return null;
                        }
                        return controlledField.value;
                    })();
                case 'user':
                    return (() => {
                        const userField = sample.node_tree[0].meta_user[fieldKey];
                        if (!userField) {
                            return null;
                        }
                        return userField.value;
                    })();
                }
            }

            const sampleTable = samples.map((sample, index) => {
                const data = sampleColumns.map(({fieldType, fieldKey}) => {
                    return getCellContent(sample, fieldType, fieldKey, index);
                });

                return {
                    entity: {
                        id: sample.id,
                        version: sample.version
                    },
                    data
                };
            });

            return [sampleColumns, sampleTable, groups];
        }

        async start(params) {
            // Check params
            this.status = 'STARTING';
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
            // this.renderProgress(0);
            preact.render(preact.h(Loading, {message: 'Loading Sample Set...'}), this.node);

            // Get the object from the model.
            const model = new Model({
                runtime: this.runtime,
                workspaceId: this.workspaceId,
                objectId: this.objectId,
                objectVersion: this.objectVersion
            });

            // Display the object!

            try {
                const {info: objectInfo, data: sampleSet} = await model.getObject();

                const totalCount = sampleSet.samples.length;
                sampleSet.samples = sampleSet.samples.slice(0, MAX_SAMPLES);

                const {samples, fieldKeys, userProfiles} = await model.getSamples({
                    samples: sampleSet.samples
                });

                const samplesMap = samples.reduce((samplesMap, sample) => {
                    samplesMap[sample.id] = sample;
                    return samplesMap;
                }, {});

                // Created an array of samples in the same order as in the sampleset.
                const orderedSamples = sampleSet.samples.map((sampleSetItem) => {
                    return samplesMap[sampleSetItem.id];
                });

                if (orderedSamples.length === 0) {
                    // TODO: see if this is even possible.
                    preact.render(preact.h(SimpleInfo, {
                        title: 'Sorry',
                        message: 'No samples in this set'
                    }), this.node);
                    return;
                }

                const [sampleColumns, sampleTable, columnGroups] = await this.samplesToTable(model, orderedSamples, sampleSet, fieldKeys);

                // Just get the raw groups and schemas. For mapping view; should refactor to simplify the
                // complexity here...
                const groups = await model.getFieldGroups();

                const params = {
                    sampleSet,
                    samples,
                    totalCount,
                    fieldKeys,
                    sampleTable,
                    sampleColumns,
                    userProfiles,
                    objectInfo,
                    columnGroups,
                    groups
                };
                preact.render(preact.h(Main, params), this.node);
                this.status = 'STARTED';
            } catch (ex) {
                if (['STOPPING', 'STOPPED', 'DETACHED'].includes(this.status)) {
                    // ignore, this means the tab has been closed.
                    return;
                }

                this.status = 'ERROR';
                console.error('Error fetching samples', ex);
                preact.render(preact.h(SimpleError, {message: ex.message}), this.node);
            }
        }

        stop() {
            if (this.status === 'STARTING') {
                this.status = 'STOPPING';
            }
            // Should cancel any pending requests here...
            this.status = 'STOPPED';
        }

        detach() {
            this.node = '';
            this.status = 'DETACHED';
        }
    }

    return Viewer;
});
