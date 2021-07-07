define([
    'bluebird',
    'kb_lib/jsonRpc/genericClient'
], (
    Promise,
    GenericClient
) => {
    class Model {
        constructor({runtime, workspaceId, objectId, objectVersion}) {
            this.runtime = runtime;
            this.workspaceId = workspaceId;
            this.objectId = objectId;
            this.objectVersion = objectVersion;
        }

        getSamples(samples) {
            const sampleService = new GenericClient({
                module: 'SampleService',
                url: this.runtime.config('services.SampleService.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            return sampleService.callFunc('get_samples', [{
                samples
            }])
                .then(([samples]) => {
                    return samples;
                });

            // return Promise.all(samples.map((sample) => {
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
            //             return {
            //                 sample,
            //                 linkedData
            //             };
            //         });
            // }));
        }

        getLinkedSamples() {
            const sampleService = new GenericClient({
                module: 'SampleService',
                url: this.runtime.config('services.SampleService.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const upa = (() => {
                if (this.objectVersion) {
                    return `${this.workspaceId}/${this.objectId}/${this.objectVersion}`;
                }
                return `${this.workspaceId}/${this.objectId}`;
            })();

            return sampleService
                .callFunc('get_data_links_from_data', [{
                    upa
                }])
                .then(([result]) => {
                    const samplesToFetch = result.links.map(({id, version}) => {
                        return {id, version};
                    });
                    if (samplesToFetch.length === 0) {
                        return [];
                    }
                    return Promise.all(this.getSamples(samplesToFetch))
                        .then((samples) => {
                            return result.links.map((link, index) => {
                                return {
                                    link,
                                    sample: samples[index]
                                };
                            });
                        });
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
