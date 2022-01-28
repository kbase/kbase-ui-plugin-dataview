define([
    'bluebird',
    'kb_service/utils',
    'kb_service/client/workspace',
    'kb_lib/jsonRpc/genericClient'
], (
    Promise,
    apiUtils,
    Workspace,
    GenericClient
) => {

    class UIError extends Error {
        constructor({message, code, data}) {
            super(message);
            this.code = code;
            this.data = data;
        }
    }
    function getObjectInfo(runtime, params) {
        return Promise.try(() => {
            const workspaceId = params.workspaceId,
                objectId = params.objectId,
                objectVersion = params.objectVersion;

            if (workspaceId === undefined) {
                throw new Error('Workspace id or name is required');
            }
            if (objectId === undefined) {
                throw new Error('Object id or name is required');
            }

            const objectRef = apiUtils.makeWorkspaceObjectRef(workspaceId, objectId, objectVersion);

            const workspace = new GenericClient({
                module: 'Workspace',
                url: runtime.config('services.Workspace.url'),
                token: runtime.service('session').getAuthToken()
            });

            return workspace.callFunc('get_object_info3', [{
                objects: [{ref: objectRef}],
                includeMetadata: 1,
                ignoreErrors: 0
            }])
                .then(([result]) => {
                    return apiUtils.object_info_to_object(result.infos[0]);
                })
                .catch((err) => {
                    if (/Anonymous users may not read workspace/.test(err.message)) {
                        throw new UIError({
                            message: 'Private object without authorization ',
                            code: 'private-object-no-authorization',
                            data: {
                                workspaceId
                            }
                        });
                    } else if (/User .+ may not read workspace/.test(err.message)) {
                        throw new UIError({
                            message: `Access denied to this object with reference ${  objectRef}`,
                            code: 'private-object-inadequate-authorization',
                            data: {
                                workspaceId,
                            }
                        });
                    } else if (/^Object .+ in workspace .+ has been deleted$/.test(err.message)) {
                        throw new UIError({
                            message: `Object with reference ${objectRef} has been deleted and may not be accessed`,
                            code: 'object-deleted',
                            data: {
                                workspaceId,
                                objectRef,
                            }
                        });
                    } else {
                        throw new UIError({
                            message: `An unknown error occurred while accessing object with reference ${  objectRef}`,
                            code: 'unknown-error',
                            data: {
                                originalError: err
                            }
                        });
                    }

                });
        });
    }
    function getWorkspaceInfo(runtime, params) {
        return Promise.try(() => {
            const workspaceId = params.workspaceId;

            if (workspaceId === undefined) {
                throw new Error('Workspace id or name is required');
            }
            const workspace = new GenericClient({
                module: 'Workspace',
                url: runtime.config('services.Workspace.url'),
                token: runtime.service('session').getAuthToken()
            });

            const getWorkspaceInfoParams = {};
            if (workspaceId.match(/^\d+$/)) {
                getWorkspaceInfoParams.id = workspaceId;
            } else {
                getWorkspaceInfoParams.workspace = workspaceId;
            }

            return workspace.callFunc('get_workspace_info', [getWorkspaceInfoParams])
                .then(([info]) => {
                    // return apiUtils.workspace_info_to_object(info);
                    return info;
                })
                .catch((err) => {
                    if (/Anonymous users may not read workspace/.test(err.message)) {
                        throw new UIError({
                            message: 'Private object without authorization ',
                            code: 'private-object-no-authorization',
                            data: {
                                workspaceId
                            }
                        });
                    } else if (/User .+ may not read workspace/.test(err.message)) {
                        throw new UIError({
                            message: `Access denied to this workspace with id ${  workspaceId}`,
                            code: 'private-object-inadequate-authorization',
                            data: {
                                workspaceId,
                            }
                        });
                    } else {
                        console.error('ERROR', err);
                        throw new UIError({
                            message: `An unknown error occurred while accessing workspace with id ${  workspaceId}`,
                            code: 'unknown-error',
                            data: {
                                originalError: err
                            }
                        });
                    }

                });
        });
    }
    function getObject(runtime, params) {
        return Promise.try(() => {
            const workspaceId = params.workspaceId,
                objectId = params.objectId,
                objectVersion = params.objectVersion;

            if (workspaceId === undefined) {
                throw new Error('Workspace id or name is required');
            }
            if (objectId === undefined) {
                throw new Error('Object id or name is required');
            }

            const objectRef = apiUtils.makeWorkspaceObjectRef(workspaceId, objectId, objectVersion),
                workspaceClient = new Workspace(runtime.config('services.workspace.url'), {
                    token: runtime.service('session').getAuthToken()
                });

            return workspaceClient.get_objects([{ref: objectRef}]).then((objectList) => {
                if (objectList.length === 0) {
                    throw new Error(`Object not found: ${  objectRef}`);
                }
                if (objectList.length > 1) {
                    throw new Error(`Too many objects found: ${  objectRef  }, ${  objectList.length}`);
                }
                if (objectList[0] === null) {
                    throw new Error(`Object x not found with reference ${  objectRef}`);
                }
                return objectList[0];
            });
        });
    }

    return {
        getObjectInfo,
        getObject,
        getWorkspaceInfo
    };
});
