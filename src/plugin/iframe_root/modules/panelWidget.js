define([
    'bluebird',
    'jquery',
    'preact',
    'kb_lib/html',
    'kb_lib/htmlBootstrapBuilders',
    'kbaseUI/widget/widgetSet',
    'utils',
    'collapsiblePanel',
    'components/error',

    'bootstrap'
], function (
    Promise,
    $,
    preact,
    html,
    BS,
    WidgetSet,
    utils,
    collapsiblePanel,
    ErrorComponent
) {
    'use strict';

    const t = html.tag,
        div = t('div');

    function widget({runtime}) {
        let mount = null;
        let container = null;
        let layout = null;

        const  widgetSet = runtime.service('widget').newWidgetSet();

        function renderPanel() {
            const tabs = [
                {
                    name: 'main',
                    title: 'Data View',
                    content: div({
                        id: widgetSet.addWidget('kb_dataview_dataObjectVisualizer'),
                        dataKBTesthookWidget: 'dataObjectVisualizer'
                    })
                }, {
                    name: 'provenance',
                    title: 'Provenance',
                    content: div({
                        id: widgetSet.addWidget('kb_dataview_provenance')
                    })
                }
            ];

            if (runtime.featureEnabled('similar_genomes')) {
                tabs.push({
                    name: 'relatedData',
                    title: 'Related Data',
                    content: div({
                        id: widgetSet.addWidget('kb_dataview_relatedData')
                    })
                });
            }

            if (runtime.featureEnabled('linked-samples')) {
                tabs.push({
                    name: 'linkedSamples',
                    title: 'Linked Samples',
                    content: div({
                        id: widgetSet.addWidget('kb_dataview_linkedSamples')
                    })
                });
            }

            return div({
                class: 'kbase-view kbase-dataview-view container-fluid',
                dataKbaseView: 'dataview',
                dataKBTesthookPlugin: 'dataview'
            }, [
                div({
                    class: 'row',
                    style: {
                        marginTop: '10px'
                    }
                }, [
                    div({ class: 'col-sm-12' }, [
                        // div({ id: widgetSet.addWidget('kb_dataview_download') }),
                        div({ id: widgetSet.addWidget('kb_dataview_copy') }),
                        div({ id: widgetSet.addWidget('kb_dataview_overview') }),
                        BS.buildTabs({
                            tabs,
                            id: 'mainTabs'
                        }).content
                    ])
                ])
            ]);
        }

        function init(config) {
            layout = renderPanel();
            $('#mainTabs a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
            return widgetSet.init(config);
        }

        function attach(node) {
            mount = node;
            container = document.createElement('div');
            mount.appendChild(container);
            container.innerHTML = layout;
            return widgetSet.attach(node);
        }

        function start(params) {
            return Promise.all([
                utils.getObjectInfo(runtime, params),
                utils.getWorkspaceInfo(runtime, params)
            ])
                .then(([objectInfo, workspaceInfo]) => {
                    runtime.send('ui', 'setTitle', 'Data View for ' + objectInfo.name);
                    params.objectInfo = objectInfo;
                    params.workspaceInfo = workspaceInfo;

                    // Ensures that these params are set, even if the landing page was invoked
                    // with names rather than ids.
                    params.workspaceId = objectInfo.wsid;
                    params.objectId = objectInfo.id;
                    params.objectVersion = objectInfo.version;

                    return Promise.all([objectInfo, widgetSet.start(params)]);
                })
                // .spread((objectInfo) => {
                //     // TODO: re-enable object download.
                //     // Disable download button for the time being.
                //     // Will re-enable when we have time to deal with it.
                //     //     runtime.send('ui', 'addButton', {
                //     //         name: 'downloadObject',
                //     //         label: 'Download',
                //     //         style: 'default',
                //     //         icon: 'download',
                //     //         toggle: true,
                //     //         params: {
                //     //             ref: objectInfo.ref
                //     //         },
                //     //         callback: function () {
                //     //             runtime.send('downloadWidget', 'toggle');
                //     //         }
                //     //     });

                //     // runtime.send('ui', 'addButton', {
                //     //     name: 'copyObject',
                //     //     label: 'Copy',
                //     //     style: 'default',
                //     //     icon: 'copy',
                //     //     toggle: true,
                //     //     params: {
                //     //         ref: objectInfo.ref
                //     //     },
                //     //     callback: function () {
                //     //         runtime.send('copyWidget', 'toggle');
                //     //     }
                //     // });
                // })
                .catch((error) => {
                    container.innerHTML = '';
                    console.error('ERROR', error);
                    preact.render(preact.h(ErrorComponent, { runtime, error }), container);
                });
        }

        function run(params) {
            return widgetSet.run(params);
        }

        function stop() {
            return widgetSet.stop();
        }

        function detach() {
            return widgetSet.detach().finally(function () {
                if (mount && container) {
                    mount.removeChild(container);
                    container.innerHTML = '';
                }
            });
        }

        return Object.freeze({
            init,
            attach,
            start,
            run,
            stop,
            detach
        });
    }

    return {
        make: function (config) {
            return widget(config);
        }
    };
});
