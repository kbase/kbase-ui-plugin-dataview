define([
    'bluebird',
    'preact',
    'kb_lib/html',
    'kbaseUI/widget/widgetSet',
    'utils',
    'collapsiblePanel',
    'components/error'
], function (
    Promise,
    preact,
    html,
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
            return div(
                {
                    class: 'kbase-view kbase-dataview-view container-fluid',
                    dataKbaseView: 'dataview',
                    dataKBTesthookPlugin: 'dataview'
                },
                [
                    div({ class: 'row' }, [
                        div({ class: 'col-sm-12' }, [
                            // div({ id: widgetSet.addWidget('kb_dataview_download') }),
                            div({ id: widgetSet.addWidget('kb_dataview_copy') }),
                            div({ id: widgetSet.addWidget('kb_dataview_overview') }),
                            collapsiblePanel({
                                title: 'Data Provenance and Reference Network',
                                icon: 'sitemap',
                                content: div({ id: widgetSet.addWidget('kb_dataview_provenance') })
                            }),
                            // (function () {
                            //     if (runtime.featureEnabled('new_provenance_widget')) {
                            //         return collapsiblePanel({
                            //             title: 'Data Provenance and Reference Network ... in Progress',
                            //             icon: 'sitemap',
                            //             content: div({ id: widgetSet.addWidget('kb_dataview_provenance_v2') })
                            //         });
                            //     } else {
                            //         return null;
                            //     }
                            // })(),
                            (function () {
                                if (runtime.featureEnabled('similar_genomes')) {
                                    return div({ id: widgetSet.addWidget('kb_dataview_relatedData') });
                                }
                            })(),
                            (function () {
                                if (runtime.featureEnabled('linked-samples')) {
                                    return collapsiblePanel({
                                        title: 'Linked Samples',
                                        icon: 'link',
                                        content: div({ id: widgetSet.addWidget('kb_dataview_linkedSamples') })
                                    });
                                    // return div({ id: widgetSet.addWidget('kb_dataview_linkedSamples') });
                                }
                            })(),
                            div({
                                id: widgetSet.addWidget('kb_dataview_dataObjectVisualizer'),
                                dataKBTesthookWidget: 'dataObjectVisualizer'
                            })
                        ])
                    ])
                ]
            );
        }

        function init(config) {
            layout = renderPanel();
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
