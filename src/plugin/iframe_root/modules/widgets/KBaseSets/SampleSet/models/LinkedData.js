define([
    'kb_lib/jsonRpc/genericClient',
    'kb_service/utils',
], (
    GenericClient,
    {objectInfoToObject},
) => {
    class LinkedDataModel {
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

            for (const {id, version} of samples) {
                const [{links}] = await sampleService
                    .callFunc('get_data_links_from_sample', [{id, version}]);

                // extract the upas
                for (const {upa} of links) {
                    upas[upa] = true;
                }

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

            // Create uber view data
            this.cache.linkedData = samples.map((sample) => {
                return {
                    sample,
                    links: sampleLinks[`${sample.id}/${sample.version}`]
                        .filter((link) => {
                            return !!objectInfos[link.upa];
                        })
                        .map((link) => {
                            return {
                                link,
                                objectInfo: objectInfos[link.upa]
                            };
                        })

                };
            });
            return {
                types: this.cache.types,
                linkedData: this.cache.linkedData
            };
        }

        async getLinkedDataSummary({samples}) {
            const {types: allTypes, linkedData} = await this.getLinkedData({samples});

            // Pass through all the data links to pull out the
            // total set of types

            for (const {links} of linkedData) {
                for (const {objectInfo: {typeName}} of links) {
                    allTypes.add(typeName);
                }
            }

            // Then again to get the summary for each sample

            const summary = linkedData.map(({sample, links}) => {
                const types = links.reduce((types, {objectInfo: {typeName}}) => {
                    types.add(typeName);
                    return types;
                }, new Set());

                const objects = links.reduce((objects, {objectInfo: {ref}}) => {
                    objects.add(ref);
                    return objects;
                }, new Set());

                const typeCounts = links.reduce((typeCounts, {objectInfo: {typeName}}) => {
                    if (!(typeName in typeCounts)) {
                        typeCounts[typeName] = 0;
                    }
                    typeCounts[typeName] += 1;
                    return typeCounts;
                }, {});

                return {
                    sample,
                    totals: {
                        typeCount: types.size,
                        objectCount: objects.size,
                    },
                    typeCounts
                };
            });

            return {
                summary,
                types: Array.from(allTypes.values()).sort()
            };
        }

    }

    return LinkedDataModel;
});
