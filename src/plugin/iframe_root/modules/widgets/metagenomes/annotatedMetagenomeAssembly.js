define(['kb_lib/jsonRpc/genericClient', 'kb_lib/jsonRpc/dynamicServiceClient', 'preact', 'bootstrap'], (
    GenericClient,
    DynamicServiceClient,
    preact
) => {
    'use strict';
    // we have to do this here -- cannot destructure in the arguments in strict mode.
    const { h, Component, render } = preact;

    class ObjectInfo extends Component {
        render(props) {
            return h('table', { className: 'table table-bordered', style: { width: 'auto' } }, [
                h('tbody', null, [
                    h('tr', null, h('th', null, 'Workspace ID'), h('td', null, props.wsid)),
                    h('tr', null, h('th', null, 'Object ID'), h('td', null, props.objid)),
                    h('tr', null, h('th', null, 'Version'), h('td', null, props.version))
                    // ... and so forth
                ])
            ]);
        }
    }

    class Narratorials extends Component {
        render(props) {
            return props.narratorials.map(({ title, workspaceId, titleFromWorkspace }) => {
                const confirmed = title === titleFromWorkspace;
                return h('div', null, [
                    h(
                        'a',
                        {
                            href: `/narrative/${workspaceId}`,
                            target: '_blank'
                        },
                        title,
                        ' (',
                        confirmed ? '✅' : '❌',
                        ')'
                    )
                ]);
            });
        }
    }

    function objectInfoToObject(objectInfo) {
        const [objid, name, type, save_date, version, saved_by, wsid, workspace, chsum, size, meta] = objectInfo;

        return {
            objid,
            name,
            type,
            save_date,
            version,
            saved_by,
            wsid,
            workspace,
            chsum,
            size,
            meta
        };
    }

    function workspaceInfoToObject(workspaceInfo) {
        const [
            id,
            workspace,
            owner,
            moddate,
            max_objid,
            user_permission,
            globalread,
            lockstat,
            metadata
        ] = workspaceInfo;
        return {
            id,
            workspace,
            owner,
            moddate,
            max_objid,
            user_permission,
            globalread,
            lockstat,
            metadata
        };
    }

    class AnnotatedMetagenomeAssembly {
        constructor({ runtime }) {
            this.runtime = runtime;
            this.hostNode = null;
            this.container = null;
        }

        /*
            Lifecycle methods. Each of attach, start, stop, detach are called by the
            parent component. Any of them may return a promise (they are wrapped in
            promises anyway). This is most helpful for the start method, which often
            will fetch data from services before rendering.
        */

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
        }

        getObjectInfo(workspaceId, objectId, objectVersion) {
            const workspaceClient = new GenericClient({
                module: 'Workspace',
                url: this.runtime.config('services.Workspace.url'),
                token: this.runtime.service('session').getAuthToken()
            });
            return workspaceClient
                .callFunc('get_object_info3', [
                    {
                        objects: [
                            {
                                ref: [workspaceId, objectId, objectVersion].join('/')
                            }
                        ]
                    }
                ])
                .then(([{ infos: [objectInfo] }]) => {
                    // Here we destructure the workspace's object info
                    // tuple.
                    return objectInfoToObject(objectInfo);
                });
        }

        getNarratorials() {
            const narrativeServiceClient = new DynamicServiceClient({
                module: 'NarrativeService',
                url: this.runtime.config('services.ServiceWizard.url'),
                token: this.runtime.service('session').getAuthToken()
            });
            return narrativeServiceClient.callFunc('list_narratorials', [{}]).then(([{ narratorials }]) => {
                return narratorials.map(({ ws, nar }) => {
                    const narrativeObjectInfo = objectInfoToObject(nar);
                    const workspaceInfo = workspaceInfoToObject(ws);
                    return {
                        title: narrativeObjectInfo.meta.name,
                        titleFromWorkspace: workspaceInfo.metadata.narrative_nice_name,
                        workspaceId: narrativeObjectInfo.wsid,
                        objectId: narrativeObjectInfo.objid,
                        objectVersion: narrativeObjectInfo.version
                    };
                });
            });
        }

        start({ workspaceId, objectId, objectVersion }) {
            // This is the main entry point to the widget. It receives params
            // which are parsed out of the url (actually just the url fragment, aka hash)
            // and named according to the route config.

            // here we can get the object info...
            return Promise.all([this.getObjectInfo(workspaceId, objectId, objectVersion), this.getNarratorials()]).then(
                ([objectInfo, narratorials]) => {
                    const content = h('div', null, [
                        h('h3', null, 'Object Info'),
                        h('div', null, h(ObjectInfo, objectInfo, null)),
                        h('h3', null, 'Narratorials'),
                        h('div', null, h(Narratorials, { narratorials }, null))
                    ]);
                    render(content, this.container);
                }
            );
        }

        stop() {
            // if anything was started during start (unlikely), like an interval or timeout,
            // stop them here.
            // any dom listeners set in start or attach will be removed when the widget
            // is detached.
        }

        detach() {
            if (this.hostNode && this.container) {
                this.hostNode.removeChild(this.container);
            }
        }
    }

    return AnnotatedMetagenomeAssembly;
});
