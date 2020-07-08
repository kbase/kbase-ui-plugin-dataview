define([
    'bluebird',
    'underscore',
    'kb_lib/jsonRpc/genericClient',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    'kb_lib/htmlBootstrapBuilders',
    'kb_service/utils'
], function (Promise, _, GenericClient, html, htmlBuilders, BS, APIUtils) {
    'use strict';

    var t = html.tag,
        div = t('div');

    function factory(config) {
        var mount,
            container,
            runtime = config.runtime,
            theWidget,
            widgetContainer;

        function findMapping(type, params) {
            var mapping = runtime.getService('type').getViewer({
                type: type,
                id: params.viewer
            });
            if (mapping) {
                if (params.sub && params.subid) {
                    var sub = params.sub.toLowerCase();
                    if (mapping.sub) {
                        if (mapping.sub.hasOwnProperty(sub)) {
                            mapping = mapping.sub[sub]; // ha, crazy line, i know.
                        } else {
                            throw new Error(
                                'Sub was specified, but config has no correct sub handler, sub:' + sub + 'config:'
                            );
                        }
                    } else {
                        throw new Error('Sub was specified, but config has no sub handler, sub:' + sub);
                    }
                }
            } else {
                // Now we have a default mapping.
                mapping = {
                    title: 'Generic Object View',
                    widget: {
                        name: 'kb_dataview_genericObject'
                    },
                    panel: false,
                    options: []
                };
            }
            return mapping;
        }

        // TODO: move this to api utils
        function makeObjectRef(obj) {
            return [obj.workspaceId, obj.objectId, obj.objectVersion]
                .filter(function (element) {
                    if (element) {
                        return true;
                    }
                })
                .join('/');
        }

        function makeWidget(params) {
            // Translate and normalize params.
            // params.objectVersion = params.ver;

            // Get other params from the runtime.
            return Promise.try(function () {
                const workspace = new GenericClient({
                    module: 'Workspace',
                    url: runtime.getConfig('services.workspace.url'),
                    token: runtime.getService('session').getAuthToken()
                });
                const objectRefs = [
                    {
                        ref: makeObjectRef(params)
                    }
                ];
                return workspace
                    .callFunc('get_object_info3', [
                        {
                            objects: objectRefs,
                            ignoreErrors: 1,
                            includeMetadata: 1
                        }
                    ])
                    .spread(function (result) {
                        const objectInfos = result.infos;
                        if (objectInfos.length > 1) {
                            throw new Error('Too many (' + objectInfos.length + ') objects found.');
                        }
                        if (objectInfos[0] === null) {
                            throw new Error('Object not found');
                        }

                        var wsobject = APIUtils.objectInfoToObject(objectInfos[0]);
                        var type = APIUtils.parseTypeId(wsobject.type),
                            mapping = findMapping(type, params);
                        if (!mapping) {
                            throw new Error('Sorry, cannot find widget for ' + type.module + '.' + type.name);
                        }
                        // These params are from the found object.
                        var widgetParams = {
                            workspaceId: wsobject.wsid,
                            objectId: wsobject.id,
                            objectName: wsobject.name,
                            workspaceName: wsobject.ws,
                            objectVersion: wsobject.version,
                            objectType: wsobject.type,
                            type: wsobject.type
                        };

                        // handle sub
                        if (params.sub) {
                            widgetParams[params.sub.toLowerCase() + 'ID'] = params.subid;
                        }

                        // Create params.
                        if (mapping.options) {
                            mapping.options.forEach(function (item) {
                                var from = widgetParams[item.from];
                                if (!from && item.optional !== true) {
                                    throw 'Missing param, from ' + item.from + ', to ' + item.to;
                                }
                                widgetParams[item.to] = from;
                            });
                        }
                        // Handle different types of widgets here.
                        return runtime
                            .service('widget')
                            .makeWidget(mapping.widget.name, mapping.widget.config)
                            .then(function (result) {
                                return {
                                    widget: result,
                                    params: widgetParams,
                                    mapping: mapping
                                };
                            });
                    });
            });
        }

        function showError(err) {
            var content;
            console.error(err);
            if (typeof err === 'string') {
                content = err;
            } else if (err.message) {
                content = err.message;
            } else if (err.error && err.error.error) {
                content = err.error.error.message;
            } else {
                content = 'Unknown Error';
            }
            container.innerHTML = BS.buildPanel({
                title: 'Error',
                body: content,
                type: 'danger' });
        }

        // Widget Lifecycle Interface

        function attach(node) {
            return Promise.try(function () {
                mount = node;
                container = document.createElement('div');
                mount.appendChild(container);
            });
        }

        function start(params) {
            var newParams;
            return makeWidget(params)
                .then(function (result) {
                    theWidget = result.widget;
                    newParams = result.params;
                    if (result.mapping.panel) {
                        var temp = container.appendChild(document.createElement('div')),
                            widgetParentId = html.genId();
                        temp.innerHTML = BS.buildPanel({
                            name: 'data-view',
                            type: 'default',
                            title: result.mapping.title || 'Data View',
                            body: div({ id: widgetParentId })
                        });
                        // These are global.
                        widgetContainer = document.getElementById(widgetParentId);
                    } else {
                        widgetContainer = container;
                    }
                    if (theWidget.init) {
                        return theWidget.init(config);
                    } else {
                        return null;
                    }
                })
                .then(function () {
                    return theWidget.attach(widgetContainer);
                })
                .then(function () {
                    return theWidget.start(newParams);
                })
                .catch(function (err) {
                    // if attaching the widget failed, we attach a
                    // generic error widget:
                    // TO BE DONE
                    showError(err);
                    throw err;
                });
        }

        function run(params) {
            return Promise.try(function () {
                if (theWidget && theWidget.run) {
                    return theWidget.run(params);
                }
            });
        }

        function stop() {
            return Promise.try(function () {
                if (theWidget && theWidget.stop) {
                    return theWidget.stop();
                }
            });
        }

        function detach() {
            return Promise.try(function () {
                if (theWidget && theWidget.detach) {
                    return theWidget.detach();
                }
            });
        }

        function destroy() {
            return Promise.try(function () {
                if (theWidget && theWidget.detach) {
                    return theWidget.detach();
                }
            });
        }

        return {
            attach: attach,
            start: start,
            run: run,
            stop: stop,
            detach: detach,
            destroy: destroy
        };
    }

    return {
        make: function (config) {
            return factory(config);
        }
    };
});
