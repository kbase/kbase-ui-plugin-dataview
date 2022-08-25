define([
    'bluebird',
    'underscore',
    'kb_lib/jsonRpc/genericClient',
    'kb_lib/html',
    'kb_lib/htmlBootstrapBuilders',
    'kb_service/utils',
    'lib/format'
], (Promise, _, GenericClient, html, BS, APIUtils, {domSafeText}) => {
    const t = html.tag,
        div = t('div');

    function factory(config) {
        let mount,
            container,
            theWidget,
            widgetContainer;

        const runtime = config.runtime;

        function findMapping(type, params) {
            let mapping = runtime.getService('type').getViewer({
                type,
                id: params.viewer
            });
            if (mapping) {
                if (params.sub && params.subid) {
                    const sub = params.sub.toLowerCase();
                    if (mapping.sub) {
                        if (Object.prototype.hasOwnProperty.call(mapping.sub, sub)) {
                            mapping = mapping.sub[sub]; // ha, crazy line, i know.
                        } else {
                            throw new Error(
                                `Sub was specified, but config has no correct sub handler, sub:${sub}config:`
                            );
                        }
                    } else {
                        throw new Error(`Sub was specified, but config has no sub handler, sub:${sub}`);
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
                    scrolling: true,
                    options: []
                };
            }
            return mapping;
        }

        // TODO: move this to api utils
        function makeObjectRef(obj) {
            return [obj.workspaceId, obj.objectId, obj.objectVersion]
                .filter((element) => {
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
            return Promise.try(() => {
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
                    .spread((result) => {
                        const objectInfos = result.infos;
                        if (objectInfos.length > 1) {
                            throw new Error(`Too many (${objectInfos.length}) objects found.`);
                        }
                        if (objectInfos[0] === null) {
                            throw new Error('Object not found');
                        }

                        const objectInfo = APIUtils.objectInfoToObject(objectInfos[0]);
                        objectInfo.raw = objectInfos[0];
                        const type = APIUtils.parseTypeId(objectInfo.type),
                            mapping = findMapping(type, params);

                        if (!mapping) {
                            throw new Error(`Cannot find widget for ${type.module}.${type.name}`);
                        }
                        // These params are from the found object.
                        const widgetParams = {
                            workspaceId: objectInfo.wsid,
                            objectId: objectInfo.id,
                            objectName: objectInfo.name,
                            workspaceName: objectInfo.ws,
                            objectVersion: objectInfo.version,
                            objectType: objectInfo.type,
                            type: objectInfo.type,
                            objectInfo
                        };

                        // handle sub
                        if (params.sub) {
                            widgetParams[`${params.sub.toLowerCase()}ID`] = params.subid;
                        }

                        // Create params.
                        if (mapping.options) {
                            mapping.options.forEach((item) => {
                                const from = widgetParams[item.from];
                                if (!from && item.optional !== true) {
                                    throw `Missing param, from ${item.from}, to ${item.to}`;
                                }
                                widgetParams[item.to] = from;
                            });
                        }
                        
                        // Handle different types of widgets here.
                        return runtime
                            .service('widget')
                            .makeWidget(mapping.widget.name, mapping.widget.config)
                            .then((result) => {
                                return {
                                    widget: result,
                                    params: widgetParams,
                                    mapping
                                };
                            });
                    });
            });
        }

        function showError(err) {
            let content;
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
            // xss safe
            container.innerHTML = BS.buildPanel({
                title: 'Error',
                body: domSafeText(content),
                type: 'danger'
            });
        }

        // Widget Lifecycle Interface

        function attach(node) {
            return Promise.try(() => {
                mount = node;
                container = document.createElement('div');
                container.style.display = 'flex';
                container.style['flex-direction'] = 'column';
                container.style['flex'] = '1 1 0px';
                container.style['min-height'] = '0px';
                mount.appendChild(container);
            });
        }

        function start(params) {
            let newParams;
            return makeWidget(params)
                .then((result) => {
                    theWidget = result.widget;
                    newParams = result.params;
                    if (result.mapping.panel) {
                        const temp = container.appendChild(document.createElement('div')),
                            widgetParentId = html.genId();

                        // xss safe
                        temp.innerHTML = BS.buildPanel({
                            name: 'data-view',
                            type: 'default',
                            title: domSafeText(result.mapping.title) || 'Data View',
                            body: div({id: widgetParentId})
                        });
                        // These are global.
                        widgetContainer = document.getElementById(widgetParentId);
                    } else if (result.mapping.scrolling) {
                        widgetContainer = container.appendChild(document.createElement('div'));
                        widgetContainer.style.flex = '1 1 0px';
                        widgetContainer.style.display = 'flex';
                        widgetContainer.style['flex-direction'] = 'column';
                        widgetContainer.style['min-height'] = '0';
                        widgetContainer.style['overflow-y'] = 'auto';
                        widgetContainer.setAttribute('data-k-b-testhook-element', 'scrolling-wrapper');
                    } else {
                        widgetContainer = container;
                    }
                    if (theWidget.init) {
                        return theWidget.init(config);
                    }
                    return null;

                })
                .then(() => {
                    return theWidget.attach(widgetContainer);
                })
                .then(() => {
                    return theWidget.start(newParams);
                })
                .catch((err) => {
                    // if attaching the widget failed, we attach a
                    // generic error widget:
                    // TO BE DONE
                    showError(err);
                    throw err;
                });
        }

        function run(params) {
            return Promise.try(() => {
                if (theWidget && theWidget.run) {
                    return theWidget.run(params);
                }
            });
        }

        function stop() {
            return Promise.try(() => {
                if (theWidget && theWidget.stop) {
                    return theWidget.stop();
                }
            });
        }

        function detach() {
            return Promise.try(() => {
                if (theWidget && theWidget.detach) {
                    return theWidget.detach();
                }
            });
        }

        function destroy() {
            return Promise.try(() => {
                if (theWidget && theWidget.destroy) {
                    return theWidget.destroy();
                }
            });
        }

        return {
            attach,
            start,
            run,
            stop,
            detach,
            destroy
        };
    }

    return {
        make: (config) => {
            return factory(config);
        }
    };
});
