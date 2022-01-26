define([
    'kb_lib/jsonRpc/genericClient',
    'kb_service/utils',
], (
    GenericClient,
    {objectInfoToObject},
) => {
    class LinkedDataModel3 {
        constructor({runtime}) {
            this.runtime = runtime;
            this.cache = {
                linkedData: null,
                types: null
            };
        }

        async getObjectInfos(upas) {
            const upasToGet = Object.keys(upas).map((ref) => {
                return {
                    ref
                };
            });
            const workspaceClient = new GenericClient({
                module: 'Workspace',
                url: this.runtime.config('services.workspace.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const [{infos}] = await workspaceClient.callFunc('get_object_info3', [{
                objects: upasToGet,
                includeMetadata: 1,
                ignoreErrors: 1
            }]);

            return infos
                .filter((info) => {
                    return info !== null;
                })
                .reduce((infoMap, info) => {
                    const objectInfo = objectInfoToObject(info);
                    infoMap[objectInfo.ref] = objectInfo;
                    return infoMap;
                }, {});
        }

        async getLinkedData({samples}) {
            if (this.cache.linkedData) {
                return {
                    types: this.cache.types,
                    linkedData: this.cache.linkedData
                };
            }

            const sampleService = new GenericClient({
                module: 'SampleService',
                url: this.runtime.config('services.SampleService.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const upas = {};
            const sampleLinks = {};

            // Danger: call the sample service once for each sample to get the links.

            const allLinks = await Promise.all(samples.map(async (sample) => {
                const {id, version} = sample;
                const [{links}] = await sampleService
                    .callFunc('get_data_links_from_sample', [{id, version}]);
                return {sample, links};
            }));

            for (const {sample: {id, version}, links} of allLinks) {
                // const [{links}] = await sampleService
                //     .callFunc('get_data_links_from_sample', [{id, version}]);

                // extract the upas
                for (const {upa} of links) {
                    upas[upa] = true;
                }

                // Note a simplification - the linkage is actually dependent on
                // sample id, version, node id; but we only ever have one node, so
                // we can ignore that.
                sampleLinks[`${id}/${version}`] = links;
            }

            // Get object info for each upa
            const objectInfos = await this.getObjectInfos(upas);

            this.cache.objectInfos = objectInfos;

            const types = Object.values(objectInfos).reduce((types, {typeName}) => {
                types.add(typeName);
                return types;
            }, new Set());

            this.cache.types =  Array.from(types.values()).sort();

            // Create uber view data; we actually reduce this down to
            // one linked object per sample, retaining any data ids in an array.
            this.cache.linkedData = samples.map((sample) => {
                return {
                    sample,
                    objects: sampleLinks[`${sample.id}/${sample.version}`]
                        .filter((link) => {
                            return !!objectInfos[link.upa];
                        })
                        .reduce((objects, link) => {
                            if (!(link.upa in objects)) {
                                objects[link.upa] = {
                                    objectInfo: objectInfos[link.upa],
                                    links: []
                                };
                            }
                            objects[link.upa].links.push(link);
                            return objects;
                        }, {})

                };
            });
            return {
                types: this.cache.types,
                linkedData: this.cache.linkedData
            };
        }


    }

    return LinkedDataModel3;
});
