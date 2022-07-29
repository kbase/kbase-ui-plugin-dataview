define([
    'preact',
    'bluebird',
    // 'kb_lib/html',
    // 'kbaseUI/widget/widgetSet',
    'kb_service/utils',
    'kb_service/client/workspace',
    'components/Provenance/Controller',
    'css!./provenancePanel.css'
], (preact, Promise, apiUtils, Workspace, Provenance) => {

    // const html = htm.bind(preact.h);
    // const t = htmlTags.tag,
    //     div = t('div');

    // function renderBSPanel(config) {
    //     const div = html.tag('div');
    //     return div({class: 'panel panel-default'}, [
    //         div({class: 'panel-heading'}, [div({class: 'panel-title'}, config.title)]),
    //         div({class: 'panel-body'}, [config.content])
    //     ]);
    // }

    function widget(config) {
        const runtime = config.runtime;
        const widgetSet = runtime.service('widget').newWidgetSet();
        let mount,
            container;

        function getObjectInfo(params) {
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
                    workspaceClient = new Workspace(runtime.getConfig('services.workspace.url'), {
                        token: runtime.service('session').getAuthToken()
                    });

                return workspaceClient
                    .get_object_info_new({
                        objects: [{ref: objectRef}],
                        ignoreErrors: 1
                    })
                    .then((objectInfos) => {
                        if (objectInfos[0] === null) {
                            throw new Error(`Object not found: ${  objectRef}`);
                        }
                        const objectInfo = apiUtils.object_info_to_object(objectInfos[0]);
                        objectInfo.raw = objectInfos[0];
                        return objectInfo;
                    });
            });
        }

        function init() {
            return Promise.resolve();
        }

        function attach(node) {
            return Promise.try(() => {
                mount = node;
                container = document.createElement('div');
                container.classList = ['ProvenancePanel'];
                mount.appendChild(container);
            });
        }

        async function start(params) {
            const objectInfo = await getObjectInfo(params);
            runtime.send('ui', 'setTitle', `Data Provenance and Reference Network for ${objectInfo.name}`);
            preact.render(preact.h(Provenance, {objectInfo, runtime, environment: 'standalone'}), container);
        }

        function run(params) {
            return Promise.try(() => {
                return widgetSet.run(params);
            });
        }

        function stop() {
            return Promise.try(() => {
                return widgetSet.stop();
            });
        }

        function detach() {
            return Promise.try(() => {
                return widgetSet.detach();
            });
        }

        return {
            init,
            attach,
            start,
            run,
            stop,
            detach
        };
    }

    return {
        make(config) {
            return widget(config);
        }
    };
});
