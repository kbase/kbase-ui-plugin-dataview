define([
    'bluebird',
    'kb_lib/jsonRpc/genericClient',
    'kb_lib/jsonRpc/dynamicServiceClient',
    'yaml!./data/templateDefinitions.yml',
    'yaml!./data/templates/enigma1.yml',
    'yaml!./data/templates/sesar1.yml',
    'yaml!./data/metadataValidation.yml',
    'yaml!./data/sampleUploaderSpecs.yml',
], function (
    Promise,
    GenericClient,
    DynamicServiceClient,
    templateDefinitions,
    enigmaTemplate,
    sesarTemplate,
    fieldDefinitions,
    sampleUploaderSpecs
) {
    'use strict';

    class Model {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
        }

        augmentSample(sample) {
            // const metadataKeys = Object.keys(sample.node_tree[0].meta_controlled);
            // const userMetadataKeys = Object.keys(sample.node_tree[0].meta_user);
            const sampleSourceId = sample.node_tree[0].id;
            // const allKeys = metadataKeys.concat(userMetadataKeys);
            let dataSourceDefinition;
            loop:
            for (const [, def] of Object.entries(templateDefinitions.templates)) {
                if (sampleSourceId.match(def.idPattern)) {
                    dataSourceDefinition = def;
                    break loop;
                }
                // if (def.signalFields.includes) {
                //     if (intersect(def.signalFields.includes, allKeys)) {
                //         dataSourceDefinition = def;
                //         break loop;
                //     }
                // }
                // if (def.signalFields.does_not_include) {
                //     if (!intersect(def.signalFields.does_not_include, allKeys)) {
                //         dataSourceDefinition = def;
                //         break loop;
                //     }
                // }
            }

            if (!dataSourceDefinition) {
                console.error('Cannot determine source!', sample.node_tree[0].meta_controlled);
                throw new Error('Cannot determine source!');
            }

            sample.dataSourceDefinition = dataSourceDefinition;
            return sample;
        }

        getSamples(samples) {
            const sampleService = new DynamicServiceClient({
                module: 'SampleService',
                url: this.runtime.config('services.ServiceWizard.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            return Promise.all(samples.map((sample) => {
                return Promise.all([
                    sampleService
                        .callFunc('get_sample', [{
                            id: sample.id,
                            version: sample.version
                        }]),
                    sampleService
                        .callFunc('get_data_links_from_sample', [{
                            id: sample.id,
                            version: sample.version
                        }])
                ])
                    .then(([[sample], [linkedData]]) => {
                        return {
                            sample: this.augmentSample(sample),
                            linkedData
                        };
                    });
            }));
        }

        getSamplesSerial(samples) {
            const sampleService = new DynamicServiceClient({
                module: 'SampleService',
                url: this.runtime.config('services.ServiceWizard.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            return Promise.mapSeries(samples, (sample) => {
                return Promise.all([
                    sampleService
                        .callFunc('get_sample', [{
                            id: sample.id,
                            version: sample.version
                        }]),

                    sampleService
                        .callFunc('get_data_links_from_sample', [{
                            id: sample.id,
                            version: sample.version
                        }])
                ])
                    .then(([[sample], [linkedData]]) => {
                        return {sample: this.augmentSample(sample), linkedData};
                    });
            })
                .then((result) => {
                    return result;
                });

        }

        getSamplesHybrid({samples, batchSize, onProgress}) {
            const sampleService = new DynamicServiceClient({
                module: 'SampleService',
                url: this.runtime.config('services.ServiceWizard.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            // const fetchSample = (sample) => {
            //     return Promise.all([
            //         sampleService
            //             .callFunc('get_sample', [{
            //                 id: sample.id,
            //                 version: sample.version
            //             }]),

            //         sampleService
            //             .callFunc('get_data_links_from_sample', [{
            //                 id: sample.id,
            //                 version: sample.version
            //             }])
            //     ])
            //         .then(([[sample], [linkedData]]) => {
            //             return {sample: this.augmentSample(sample), linkedData};
            //         });
            // };

            const fetchSample2 = (sample) => {
                return Promise.all([
                    sampleService
                        .callFunc('get_sample', [{
                            id: sample.id,
                            version: sample.version
                        }])
                ])
                    .then(([[sample]]) => {
                        return {sample: this.augmentSample(sample)};
                    });
            };

            const batchCount = Math.ceil(samples.length / batchSize);
            const batchSamples = [];
            for (let i = 0; i < batchCount; i += 1) {
                batchSamples.push(samples.slice(i * batchSize, (i + 1) * batchSize));
            }
            console.log('batch samples...', batchCount);
            return Promise.mapSeries(batchSamples, (samples, index) => {
                const start = new Date().getTime();
                return Promise.all(samples.map((sample) => {
                    return fetchSample2(sample);
                }))
                    .then((result) => {
                        if (onProgress) {
                            onProgress(index, batchCount);
                        }
                        console.log('series', new Date().getTime() - start);
                        return result;
                    });
            })
                .then((results) => {
                    return results.reduce((all, result) => {
                        return all.concat(result);
                    }, []);
                });

        }

        getObject() {
            const workspace = new GenericClient({
                module: 'Workspace',
                url: this.runtime.config('services.workspace.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            return workspace
                .callFunc('get_objects', [
                    [
                        {
                            wsid: this.workspaceId,
                            objid: this.objectId,
                            ver: this.objectVersion
                        }
                    ]
                ])
                .spread((object) => {
                    if (!object[0]) {
                        throw new Error('Not found');
                    }
                    return object[0].data;
                });
        }

        createColumnDefs(sampleSet) {
            function extractSources(table) {
                const sources = table.reduce((sources, sample) => {
                    sources.add(sample.sample.dataSourceDefinition);
                    return sources;
                }, new Set());
                return Array.from(sources);
            }

            if (sampleSet.samples.length === 0) {
                return;
            }
            const sources = extractSources(sampleSet.samples);
            if (sources.length === 0) {
                throw new Error('No source could be determined');
            }
            if (sources.length > 1) {
                throw new Error('Too many sources, cannot show spreadsheet view');
            }

            const source = sources[0];

            const templateDef = (() => {
                switch (source.source) {
                case 'SESAR':
                    return sesarTemplate;
                case 'ENIGMA':
                    return enigmaTemplate;
                }
            })();
            const columnMapping = sampleUploaderSpecs[source.source].column_mapping;
            const reverseColumnMapping = Object.entries(columnMapping).reduce((mapping, [key, value]) => {
                mapping[value] = key;
                return mapping;
            }, {});

            // Here we build up column definitions for all of the columns in the template,
            // retaining order.
            // Some columns are "mapped" to sample fields rather than metadata.
            const columnDefs = templateDef.columns.map((key, index) => {
                if (reverseColumnMapping[key]) {
                    const mappedKey = reverseColumnMapping[key];
                    const mappedDef = fieldDefinitions.validators[mappedKey];
                    if (mappedDef) {
                        return {
                            type: 'node',
                            dataType: mappedDef.spec.type,
                            key,
                            label: mappedDef.key_metadata.display_name,
                            format: mappedDef.format
                        };
                    }
                    console.warn('Mapped NOT FOUND', key);
                    return {
                        type: 'unknown',
                        dataType: 'string',
                        key,
                        label: key
                    };
                }
                const def = fieldDefinitions.validators[key];
                if (!def) {
                    console.warn('NOT FOUND', key);
                    return {
                        type: 'unknown',
                        dataType: 'string',
                        key,
                        label: key
                    };
                }
                return {
                    type: 'metadata',
                    dataType: def.spec.type,
                    key,
                    label: def.key_metadata.display_name,
                    format: def.format
                };
            });

            // scour the samples to add user fields; user fields go at the end of the column definitions.
            // They use the column type 'user'.
            const userFieldMapping = sampleSet.samples.reduce((userFields, sample) => {
                Object.keys(sample.sample.node_tree[0].meta_user).forEach((key) => {
                    if (userFields[key]) {
                        return;
                    }
                    const userKey = `_user_${key}`;
                    userFields[userKey] = {
                        userKey,
                        label: key,
                        fieldType: 'user',
                        type: 'string'
                    };
                });
                return userFields;
            }, {});
            Object.entries(userFieldMapping).forEach(([key, def]) => {
                columnDefs[key] = def;
            });
            return columnDefs;
        }
    }

    return Model;
});
