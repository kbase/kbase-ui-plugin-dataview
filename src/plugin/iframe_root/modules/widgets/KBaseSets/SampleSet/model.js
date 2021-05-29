define([
    'module',
    'bluebird',
    'kb_lib/jsonRpc/genericClient'
], function (
    module,
    Promise,
    GenericClient
) {
    class Model {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
        }

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

        async getFormat(formatId) {
            return this.getJSON(`mock-data/formats/${formatId.toLowerCase()}`);
        }

        /**
         *
         * @param fieldKeys {Array[string]}
         * @returns {string[]}
         */
        async getFieldSchemas(fieldKeys) {
            return Promise.all(fieldKeys.map((fieldKey) => {
                const key = fieldKey.replace(':', '-');
                return this.getJSON(`mock-data/schemas/${key}`);
            }));
        }

        async getSamples({samples}) {
            const sampleService = new GenericClient({
                module: 'SampleService',
                url: this.runtime.config('services.SampleService.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const samplesParam = samples.map(({id, version}) => {
                return {id, version};
            });

            const [rawSamples] = await sampleService
                .callFunc('get_samples', [{
                    samples: samplesParam
                }]);

            const usernames = rawSamples.reduce((usernames, sample) => {
                usernames.add(sample.user);
                return usernames;
            }, new Set());

            const userProfiles = await this.getUserProfiles(Array.from(usernames));
            const userProfileMap = userProfiles.reduce((userProfileMap, profile) => {
                userProfileMap[profile.user.username] = profile;
                return userProfileMap;
            }, {});


            // NEW

            // Get the format (from the samples)
            // Optimization for now ... since all samples in a set are from the same
            // import, they all have the same format.
            // Actually, we need to fix up the samples as well, since the format is added
            // as a metadata field.
            const fieldKeys = new Set();
            rawSamples.forEach((sample) => {
                sample.format = sample.node_tree[0].meta_controlled['sample_template'].value;
                delete sample.node_tree[0].meta_controlled['sample_template'];
                Object.keys(sample.node_tree[0].meta_controlled).forEach((key) => {
                    fieldKeys.add(key);
                });
                Object.keys(sample.node_tree[0].meta_user).forEach((key) => {
                    fieldKeys.add(key);
                });
            });

            return {
                samples: rawSamples,
                fieldKeys,
                userProfiles: userProfileMap
            };
        }

        async getObject() {
            const workspaceClient = new GenericClient({
                module: 'Workspace',
                url: this.runtime.config('services.workspace.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const [result] = await workspaceClient.callFunc('get_objects2', [{
                objects: [
                    {
                        wsid: this.workspaceId,
                        objid: this.objectId,
                        ver: this.objectVersion
                    }]
            }]);

            if (!result.data[0]) {
                throw new Error('Not found');
            }
            const {info, data} = result.data[0];
            const [
                objid, name, type, save_date, ver, saved_by, wsiid, workspace, chsum, size, meta
            ] = info;

            const infoAsObject = {
                objid, name, type, save_date, ver, saved_by, wsiid, workspace, chsum, size, meta
            };

            return {info: infoAsObject, data};
        }

        async getUserProfiles(usernames) {
            const userProfileService = new GenericClient({
                module: 'UserProfile',
                url: this.runtime.config('services.UserProfile.url'),
                token: this.runtime.service('session').getAuthToken()
            });

            const [profiles] = await userProfileService.callFunc('get_user_profile', [usernames]);
            return profiles;
        }
    }

    return Model;
});
