define(['bluebird', 'kb_lib/jsonRpc/genericClient', 'kb_service/utils'], function (
    Promise,
    GenericClient,
    ServiceUtils
) {
    'use strict';

    function escapeHtml(toEscape) {
        if (typeof toEscape !== 'string') {
            return;
        }
        var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        return String(toEscape).replace(/[&<>"'`=/]/g, (s) => {
            return entityMap[s];
        });
    }

    class Model {
        constructor(config) {
            this.runtime = config.runtime;
            this.workspaceId = config.workspaceId;
            this.objectId = config.objectId;
            this.objectVersion = config.objectVersion;
        }

        getCreatedObjects() {
            return Promise.try(() => {
                const objectsCreated = this.report.objects_created || [];
                if (objectsCreated.length === 0) {
                    return null;
                }
                const client = new GenericClient({
                    module: 'Workspace',
                    url: this.runtime.config('services.Workspace.url'),
                    token: this.runtime.service('session').getAuthToken()
                });
                const objectIds = objectsCreated.map((object) => {
                    return {
                        ref: object.ref
                    };
                });
                return client
                    .callFunc('get_object_info3', [
                        {
                            objects: objectIds,
                            includeMetadata: 0
                        }
                    ])
                    .spread((result) => {
                        return result.infos.map((info, index) => {
                            const objectInfo = ServiceUtils.objectInfoToObject(info);
                            const type = this.runtime.service('type').parseTypeId(objectInfo.type);
                            const icon = this.runtime.service('type').getIcon({ type: type });
                            return {
                                ref: objectInfo.ref,
                                name: objectInfo.name,
                                type: objectInfo.typeName,
                                fullType: objectInfo.type,
                                description: objectsCreated[index].description || '',
                                icon
                            };
                        });
                    });
            });
        }

        getLinks() {
            const ref = [this.workspaceId, this.objectId, this.objectVersion].join('/');
            const client = new GenericClient({
                module: 'ServiceWizard',
                url: this.runtime.config('services.ServiceWizard.url'),
                token: this.runtime.service('session').getAuthToken()
            });
            return client
                .callFunc('get_service_status', [
                    {
                        module_name: 'HTMLFileSetServ',
                        version: null
                    }
                ])
                .spread((serviceStatus) => {
                    var htmlServiceURL = serviceStatus.url;
                    if (this.report.html_links && this.report.html_links.length) {
                        return this.report.html_links.map((item, index) => {
                            return {
                                name: item.name,
                                // If label is not provided, name must be.
                                label: escapeHtml(item.label || item.name),
                                url: [htmlServiceURL, 'api', 'v1', ref, '$', index, item.name].join('/'),
                                description: item.description
                            };
                        });
                    } else {
                        return [];
                    }
                });
        }

        fetchReport() {
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
                    this.report = object[0].data;
                    return this.report;
                });
        }
    }

    return Model;
});
