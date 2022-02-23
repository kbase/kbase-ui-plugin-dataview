define([
    'kb_lib/jsonRpc/genericClient',
    'kb_service/utils',
    'json!../data/groups.json',
    'json!../data/schemas.json',
    '../constants'
], (
    GenericClient,
    {objectInfoToObject},
    groupsData,
    schemasData,

    {MAX_SAMPLES}
) => {

    const schemas = schemasData.reduce((schemas, schema) => {
        schemas[schema.kbase.sample.key] = schema;
        return schemas;
    }, {});
    class SampleSetModel {
        constructor({runtime, workspaceId, objectId, objectVersion}) {
            this.runtime = runtime;
            this.workspaceId = workspaceId;
            this.objectId = objectId;
            this.objectVersion = objectVersion;
            this.sampleSetRef = `${workspaceId}/${objectId}/${objectVersion}`;

            this.cache = {
                objectInfos: {},
                objects: {},
                userProfiles: {},
                samples: {},
                dataLinksBySample: {}
            };
        }

        // Core data fetchers, which also cache.
        // FWIW we should try to clamp down on caching, as it can become
        // stale, and I'm not sure users would necessarily be aware
        // of this.

        // TODO: add caching!

        async getJSON(filePath) {
            const currentPath = module.uri.split('/').slice(1, -1).join('/');
            const response = await fetch(`${currentPath}/${filePath}.json`, {
                method: 'GET'
            });
            if (response.status !== 200) {
                throw new Error(`Cannot load JSON file ${filePath}`);
            }
            try {
                return await response.json();
            } catch (ex) {
                console.error('ERROR parsing JSON file', ex);
                throw new Error(`Error parsing JSON file "${filePath}: ${ex.message}`);
            }
        }

        /**
         *
         * @param fieldKeys {Array[string]}
         * @returns {string[]}
         */
        async getFieldSchemas(fieldKeys) {
            return Promise.all(fieldKeys.map((fieldKey) => {
                return schemas[fieldKey];
            }));
        }

        /**
         *
         * @returns {Promise<any>}
         */
        async getFieldGroups() {
            return groupsData;
        }

        async getObjectInfos(upas) {
            const upasToGet = [];
            const objectInfos = {};

            // First extract any in the cache.
            for (const upa of upas) {
                if (upa in this.cache.objectInfos) {
                    objectInfos[upa] = this.cache.objectInfos[upa];
                } else {
                    upasToGet.push(upa);
                }
            }

            // If there are any left to get, get them.
            if (upasToGet.length > 0) {
                const params = {
                    objects: upasToGet.map((ref) => {
                        return {
                            ref
                        };
                    }),
                    includeMetadata: 1,
                    ignoreErrors: 1
                };
                const workspaceClient = new GenericClient({
                    module: 'Workspace',
                    url: this.runtime.config('services.workspace.url'),
                    token: this.runtime.service('session').getAuthToken()
                });

                const [{infos}] = await workspaceClient.callFunc('get_object_info3', [params]);
                infos
                    .filter((info) => {
                        return info !== null;
                    })
                    .forEach((info) => {
                        const asObject = objectInfoToObject(info);
                        this.cache.objectInfos[asObject.ref] = asObject;
                        objectInfos[asObject.ref] = asObject;
                    });
            }

            return objectInfos;
        }

        sampleToRef({id, version}) {
            return `${id}/${version}`;
        }

        async getDataLinks(samplesToGet) {
            // NB links are cached by sample ref.
            const sampleLinksToFetch = samplesToGet.filter((sample) => {
                const key = this.sampleToRef(sample);
                return !(key in this.cache.dataLinksBySample);
            })
                .map(({id, version}) => {
                    return {id, version};
                });

            // Seed the cache with empty link set for each sample.
            // The data links api returns a list of links for all requested
            // samples, not a list for each sample.

            if (sampleLinksToFetch.length > 0) {
                for (const sample of sampleLinksToFetch) {
                    this.cache.dataLinksBySample[this.sampleToRef(sample)] = [];
                }

                const sampleService = new GenericClient({
                    module: 'SampleService',
                    url: this.runtime.config('services.SampleService.url'),
                    token: this.runtime.service('session').getAuthToken()
                });

                const result = await sampleService
                    .callFunc('get_data_links_from_sample_set', [{
                        sample_ids: sampleLinksToFetch,
                        effective_time: Date.now()
                    }]);

                const [{links}] = result;

                links.forEach((link) => {
                    const {id, version} = link;
                    const key = this.sampleToRef({id, version});
                    this.cache.dataLinksBySample[key].push(link);
                });
            }
            return samplesToGet.map((sample) => {
                const key = this.sampleToRef(sample);
                return this.cache.dataLinksBySample[key] || [];
            });
        }

        async getSamples(samplesToGet) {
            const samplesToFetch = samplesToGet.filter(({id, version}) => {
                const key = `${id}.${version}`;
                return !(key in this.cache.samples);
            })
                .map(({id, version}) => {
                    return {id, version};
                });

            if (samplesToFetch.length > 0) {
                const sampleService = new GenericClient({
                    module: 'SampleService',
                    url: this.runtime.config('services.SampleService.url'),
                    token: this.runtime.service('session').getAuthToken()
                });

                const [samples] = await sampleService
                    .callFunc('get_samples', [{
                        samples: samplesToFetch
                    }]);

                for (const sample of samples) {
                    const {id, version} = sample;
                    const key = `${id}.${version}`;
                    this.cache.samples[key] = sample;
                }
            }

            return samplesToGet.map(({id, version}) => {
                const key = `${id}.${version}`;
                return this.cache.samples[key];
            });
        }

        async getSampleSet() {
            if (this.sampleSetRef in this.cache.objects) {
                return this.cache.objects[this.sampleSetRef];
            }

            const workspaceClient = new GenericClient({
                module: 'Workspace',
                url: this.runtime.config('services.workspace.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const [result] = await workspaceClient.callFunc('get_objects2', [{
                objects: [
                    {
                        ref: this.sampleSetRef
                    }]
            }]);

            if (!result.data[0]) {
                throw new Error('SampleSet not found');
            }
            const {info, data} = result.data[0];
            const infoAsObject = objectInfoToObject(info);
            this.cache.objects[infoAsObject.ref] = {info: infoAsObject, data};
            return {info: infoAsObject, data};
        }

        async getUserProfiles(usernames) {
            const usersToGet = usernames.filter((username) => {
                return !(username in this.cache.userProfiles);
            });

            if (usersToGet.length > 0) {
                const userProfileService = new GenericClient({
                    module: 'UserProfile',
                    url: this.runtime.config('services.UserProfile.url'),
                    token: this.runtime.service('session').getAuthToken()
                });

                const [profiles] = await userProfileService.callFunc('get_user_profile', [usernames]);
                for (const profile of profiles) {
                    this.cache.userProfiles[profile.user.username] = profile;
                }
            }
            return usernames.map((username) => {
                return this.cache.userProfiles[username];
            });
        }

        getKeysForSamples(samples) {
            const fieldKeys = new Set();
            samples.forEach((sample) => {
                Object.keys(sample.node_tree[0].meta_controlled).forEach((key) => {
                    fieldKeys.add(key);
                });
                Object.keys(sample.node_tree[0].meta_user).forEach((key) => {
                    fieldKeys.add(key);
                });
            });
            return Array.from(fieldKeys);
        }

        async getTheSheBang() {
            let start = Date.now();
            const start0 = start;
            /******
             * Get Sample Set
             ******/
            const sampleSet = await this.getSampleSet();

            console.log('shebang: 1: getSampleSet', Date.now() - start);
            start = Date.now();

            const sampleCount = sampleSet.data.samples.length;

            /******
             * Get Samples
             ******/
            // Ensure we don't exceed hard-capped limit
            // DISABLED for now - figure out best way to handle this
            // sampleSet.samples = sampleSet.samples.slice(0, MAX_SAMPLES);

            const samples = await this.getSamples(sampleSet.data.samples);
            if (samples.length === 0) {
                // TODO: see if this is even possible.
                throw new Error('no samples in this set');
            }

            console.log('shebang: 2: getSamples', Date.now() - start);
            start = Date.now();

            const fieldKeys = new Set();
            samples.forEach((sample) => {
                Object.keys(sample.node_tree[0].meta_controlled).forEach((key) => {
                    fieldKeys.add(key);
                });
                Object.keys(sample.node_tree[0].meta_user).forEach((key) => {
                    fieldKeys.add(key);
                });
            });

            // Reform into a map of id to sample.
            // TODO: should include version in key?
            const samplesMap = samples.reduce((samplesMap, sample) => {
                samplesMap[sample.id] = sample;
                return samplesMap;
            }, {});

            // Create an array of samples in the same order as in the sampleset.
            const orderedSamples = sampleSet.data.samples.map((sampleSetItem) => {
                return samplesMap[sampleSetItem.id];
            });

            /******
             * Get data links
             ******/

            // Get the data links
            let rawDataLinks;
            try {
                rawDataLinks = await this.getDataLinks(orderedSamples);
            } catch (ex) {
                console.error('Error fetching data links', ex);
                throw new Error(`Error fetching data links: ${  ex.message}`);
            }
            console.log('shebang: 3a: getDataLinks', rawDataLinks);
            const samplesNLinks = samples.map((sample, index) => {
                return {
                    sample,
                    links: rawDataLinks[index]
                };
            });

            console.log('shebang: 3b: getDataLinks', Date.now() - start);
            start = Date.now();

            /******
             * Get object infos from data links
             ******/
            // Get the upas
            const upas = new Set();
            for (const links of rawDataLinks) {
                // extract the upas
                for (const {upa} of links) {
                    upas.add(upa);
                }
            }

            // Get object info for each upa

            const objectInfos = await this.getObjectInfos(Array.from(upas));
            console.log('shebang: 4: getObjectInfos', Date.now() - start);
            start = Date.now();

            const dataLinks = rawDataLinks.map((links) => {
                return links.filter(({upa}) => {
                    return (upa in objectInfos);
                });
            });

            // Get the user profiles
            // TODO
            const usernames = samples.reduce((usernames, sample) => {
                usernames.add(sample.user);
                return usernames;
            }, new Set());

            start = Date.now();
            const userProfiles = await this.getUserProfiles(Array.from(usernames));
            const userProfileMap = userProfiles.reduce((userProfileMap, profile) => {
                userProfileMap[profile.user.username] = profile;
                return userProfileMap;
            }, {});
            console.log('shebang: 5: getUserProfiles', Date.now() - start);
            start = Date.now();

            /******
             * Get types from object infos
             * (maybe defer for the component? this is already getting massive.)
             ******/
            const types = Array.from(Object.values(objectInfos).reduce((types, {typeName}) => {
                types.add(typeName);
                return types;
            }, new Set()));

            console.log('shebang: total', Date.now() - start0);

            return {
                sampleSet,
                samples: orderedSamples,
                samplesNLinks,
                totals: {
                    samples: sampleCount,
                },
                dataLinks,
                objectInfos,
                userProfiles: userProfileMap,
                types,
                fieldKeys
            };
        }

        // Derived data - aggregations, etc.

        getFromCache(cacheName, key) {
            if (cacheName in this.cache) {
                if (key in this.cache[cacheName]) {
                    return this.cache[cacheName][key];
                }
            }
            return null;
        }

        setCache(cacheName, key, value) {
            if (!(cacheName in this.cache)) {
                this.cache[cacheName] = {};
            }
            this.cache[cacheName][key] = value;
        }

        async getSampleLinkedData({id, version}) {
            const sampleService = new GenericClient({
                module: 'SampleService',
                url: this.runtime.config('services.SampleService.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const upas = {};

            // Get the links for a single sample; may be cached.

            const [{links}] = await (async () => {
                const cacheKey = `${id}:${version}`;
                const links = this.getFromCache('get_data_links_from_sample', cacheKey);

                if (links) {
                    return links;
                }
                const newLinks = await sampleService.callFunc('get_data_links_from_sample', [{id, version}]);
                this.setCache('get_data_links_from_sample', cacheKey, newLinks);
                return newLinks;
            })();

            if (links.length === 0) {
                return {
                    types: [],
                    linkedData: [],
                    objectInfos: {}
                };
            }

            for (const {upa} of links) {
                upas[upa] = true;
            }

            // Get object info for each upa
            const objectInfos = await this.getObjectInfos(upas);

            this.cache.objectInfos = objectInfos;

            const uniqueTypes = Object.values(objectInfos).reduce((types, {typeName}) => {
                types.add(typeName);
                return types;
            }, new Set());

            const types =  Array.from(uniqueTypes.values()).sort();

            const linkedData = links
                .filter((link) => {
                    return (link.upa in objectInfos);
                })
                .map((link) => {
                    return {
                        link,
                        objectInfo: objectInfos[link.upa]
                    };
                });
            return {
                types,
                linkedData,
                objectInfos
            };
        }

        async getLinkedDataSummary() {
            const {types: allTypes, linkedData} = await this.getLinkedData();

            // Pass through all the data links to pull out the
            // total set of types

            // for (const {links} of linkedData) {
            //     for (const {objectInfo: {typeName}} of links) {
            //         allTypes.add(typeName);
            //     }
            // }

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

        async getLinkedData3() {
            // if (this.cache.linkedData) {
            //     return {
            //         types: this.cache.types,
            //         linkedData: this.cache.linkedData
            //     };
            // }

            const sampleService = new GenericClient({
                module: 'SampleService',
                url: this.runtime.config('services.SampleService.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const upas = {};
            const sampleLinks = {};

            // Danger: call the sample service once for each sample to get the links.

            const allLinks = await Promise.all(this.sampleSet.samples.map(async (sample) => {
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

            const sortedTypes =  Array.from(types.values()).sort();

            // Create uber view data; we actually reduce this down to
            // one linked object per sample, retaining any data ids in an array.
            const linkedData = this.sampleSet.samples.map((sample) => {
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
                types: sortedTypes,
                linkedData
            };
        }
    }

    return SampleSetModel;
});
