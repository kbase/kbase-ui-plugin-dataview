define([
    'bluebird',
    'kb_lib/jsonRpc/genericClient',
    'kb_lib/jsonRpc/dynamicServiceClient'
], function (
    Promise,
    GenericClient,
    DynamicServiceClient
) {
    'use strict';

    class Model {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
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
                            sample,
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
                        return {sample, linkedData};
                    });
            })
                .then((result) => {
                    return result;
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
