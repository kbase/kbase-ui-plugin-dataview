define([
    'bluebird',
    'kb_lib/jsonRpc/genericClient'
], function (
    Promise,
    GenericClient
) {
    'use strict';

    class Model {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
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
