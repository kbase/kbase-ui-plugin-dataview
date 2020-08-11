define([
    'bluebird',
    'kb_lib/jsonRpc/genericClient',
    'kb_lib/jsonRpc/dynamicServiceClient',
    'yaml!./data/templateDefinitions.yml'
], function (
    Promise,
    GenericClient,
    DynamicServiceClient,
    templateDefinitions
) {
    'use strict';

    function intersect(arr1, arr2) {
        for (const item1 of arr1) {
            for (const item2 of arr2) {
                if (item1 === item2) {
                    return true;
                }
            }
        }
    }

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

            // console.log('datasource definition?', dataSourceDefinition);

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
    }

    return Model;
});
