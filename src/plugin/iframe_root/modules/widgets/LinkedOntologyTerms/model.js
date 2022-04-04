define([
    'bluebird',
    'kb_lib/jsonRpc/genericClient',
    'kb_lib/jsonRpc/dynamicServiceClient'
], (
    Promise,
    GenericClient,
    DynamicServiceClient
) => {
    class Model {
        constructor({runtime, workspaceId, objectId, objectVersion}) {
            this.runtime = runtime;
            this.workspaceId = workspaceId;
            this.objectId = objectId;
            this.objectVersion = objectVersion;
        }

        // getTerms(samples) {
        //     const ontologyAPI = new DynamicServiceClient({
        //         module: 'OntologyAPI',
        //         url: this.runtime.config('services.ServiceWizard.url'),
        //         token: this.runtime.service('session').getAuthToken()
        //     });
        //
        //     return Promise.all(samples.map((sample) => {
        //         return Promise.all([
        //             ontologyAPI
        //                 .callFunc('get_terms_from_ws_obj', [{
        //                     id: sample.id,
        //                     version: sample.version
        //                 }])
        //         ])
        //             .then(([[sample], [linkedData]]) => {
        //                 return {
        //                     sample,
        //                     linkedData
        //                 };
        //             });
        //     }));
        // }

        getLinkedTerms() {
            const ontologyAPI = new DynamicServiceClient({
                module: 'OntologyAPI',
                url: this.runtime.config('services.ServiceWizard.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const upa = (() => {
                if (this.objectVersion) {
                    return `${this.workspaceId}/${this.objectId}/${this.objectVersion}`;
                }
                return `${this.workspaceId}/${this.objectId}`;
            })();

            return ontologyAPI
                .callFunc('get_terms_from_ws_object', [{
                    obj_ref: upa
                }])
                .then(([result]) => {
                    const flattenedTerms = [];
                    result.results.forEach(({terms, feature}) => {
                        terms.forEach((term) => {
                            flattenedTerms.push({
                                term, feature
                            });
                        });
                    });
                    return flattenedTerms;
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
