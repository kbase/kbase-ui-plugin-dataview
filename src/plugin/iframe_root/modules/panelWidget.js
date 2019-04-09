define(['bluebird', 'kb_lib/html', 'kbaseUI/widget/widgetSet', 'utils', 'collapsiblePanel'], function (
    Promise,
    html,
    WidgetSet,
    utils,
    collapsiblePanel
) {
    'use strict';

    var t = html.tag,
        div = t('div');

    function widget(config) {
        var mount,
            container,
            runtime = config.runtime,
            layout,
            widgetSet = runtime.service('widget').newWidgetSet();

        function renderPanel() {
            return div({ class: 'kbase-view kbase-dataview-view container-fluid', 'data-kbase-view': 'dataview' }, [
                div({ class: 'row' }, [
                    div({ class: 'col-sm-12' }, [
                        div({ id: widgetSet.addWidget('kb_dataview_download') }),
                        div({ id: widgetSet.addWidget('kb_dataview_copy') }),
                        div({ id: widgetSet.addWidget('kb_dataview_overview') }),
                        collapsiblePanel({
                            title: 'Data Provenance and Reference Network',
                            icon: 'sitemap',
                            content: div({ id: widgetSet.addWidget('kb_dataview_provenance') })
                        }),
                        (function () {
                            if (runtime.featureEnabled('new_provenance_widget')) {
                                return collapsiblePanel({
                                    title: 'Data Provenance and Reference Network ... in Progress',
                                    icon: 'sitemap',
                                    content: div({ id: widgetSet.addWidget('kb_dataview_provenance_v2') })
                                });
                            } else {
                                return null;
                            }
                        })(),
                        (function () {
                            if (runtime.featureEnabled('similar_genomes')) {
                                return div({ id: widgetSet.addWidget('kb_dataview_relatedData') });
                            }
                        })(),
                        div({ id: widgetSet.addWidget('kb_dataview_dataObjectVisualizer') })
                    ])
                ])
            ]);
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
            return utils
                .getObjectInfo(runtime, params)
                .then(function (objectInfo) {
                    runtime.send('ui', 'setTitle', 'Data View for ' + objectInfo.name);

                    params.objectInfo = objectInfo;
                    return Promise.all([objectInfo, widgetSet.start(params)]);
                })
                .spread(function (objectInfo) {
                    // Disable download button for the time being.
                    // Will re-enable when we have time to deal with it.
                    //     runtime.send('ui', 'addButton', {
                    //         name: 'downloadObject',
                    //         label: 'Download',
                    //         style: 'default',
                    //         icon: 'download',
                    //         toggle: true,
                    //         params: {
                    //             ref: objectInfo.ref
                    //         },
                    //         callback: function () {
                    //             runtime.send('downloadWidget', 'toggle');
                    //         }
                    //     });

                    runtime.send('ui', 'addButton', {
                        name: 'copyObject',
                        label: 'Copy',
                        style: 'default',
                        icon: 'copy',
                        toggle: true,
                        params: {
                            ref: objectInfo.ref
                        },
                        callback: function () {
                            runtime.send('copyWidget', 'toggle');
                        }
                    });
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

        return {
            init: init,
            attach: attach,
            start: start,
            run: run,
            stop: stop,
            detach: detach
        };
    }

    return {
        make: function (config) {
            return widget(config);
        }
    };
});
