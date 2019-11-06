define(['bluebird', 'kb_service/utils', 'kb_service/client/workspace', 'kb_lib/jsonRpc/genericClient'], function (Promise, apiUtils, Workspace, GenericClient) {
    'use strict';
    class UIError extends Error {
        constructor({message, code, data}) {
            super(message);
            this.code = code;
            this.data = data;
        }
    }
    function getObjectInfo(runtime, params) {
        return Promise.try(function () {
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

            return workspace.callFunc('get_object_info_new', [{
                objects: [{ ref: objectRef }],
                ignoreErrors: 0
            }])
                .then(([objectList]) => {
                    return apiUtils.object_info_to_object(objectList[0]);
                })
                .catch((err) => {
                    if (/Anonymous users may not read workspace/.test(err.message)) {
                        throw new UIError({
                            message: 'Private object without authorization ',
                            code: 'private-object-no-authorization',
                            data: {
                                workspaceID: workspaceId
                            }
                        });
                    } else if (/User .+ may not read workspace/.test(err.message)) {
                        throw new UIError({
                            message: 'Access denied to this object with reference ' + objectRef,
                            code: 'private-object-inadequate-authorization',
                            data: {
                                workspaceID: workspaceId,
                            }
                        });
                    } else {
                        throw new UIError({
                            message: 'An unknown error occurred while accessing object with reference ' + objectRef,
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
        return Promise.try(function () {
            var workspaceId = params.workspaceId,
                objectId = params.objectId,
                objectVersion = params.objectVersion;

            if (workspaceId === undefined) {
                throw new Error('Workspace id or name is required');
            }
            if (objectId === undefined) {
                throw new Error('Object id or name is required');
            }

            var objectRef = apiUtils.makeWorkspaceObjectRef(workspaceId, objectId, objectVersion),
                workspaceClient = new Workspace(runtime.config('services.workspace.url'), {
                    token: runtime.service('session').getAuthToken()
                });

            return workspaceClient.get_objects([{ ref: objectRef }]).then(function (objectList) {
                if (objectList.length === 0) {
                    throw new Error('Object not found: ' + objectRef);
                }
                if (objectList.length > 1) {
                    throw new Error('Too many objects found: ' + objectRef + ', ' + objectList.length);
                }
                if (objectList[0] === null) {
                    throw new Error('Object x not found with reference ' + objectRef);
                }
                return objectList[0];
            });
        });
    }

    return {
        getObjectInfo: getObjectInfo,
        getObject: getObject
    };
});
