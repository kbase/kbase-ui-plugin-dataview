define([
    'bluebird',
    'jquery',
    'preact',
    'htm',
    'kb_lib/html',
    'utils',
    'collapsiblePanel',
    'components/ErrorView',
    'components/Tabs',
    'components/WidgetWrapper',
    'components/Overview/index',
    'components/MiniOverview/index',
    'components/ProvenancePanel',
    'uuid',

    'css!./objectViewWidget.css',
    'bootstrap'
], (
    Promise,
    $,
    preact,
    htm,
    htmlTags,
    utils,
    collapsiblePanel,
    ErrorView,
    Tabs,
    WidgetWrapper,
    OverviewComponent,
    MiniOverviewComponent,
    Provenance,
    Uuid
) => {
    const html = htm.bind(preact.h);
    const t = htmlTags.tag,
        div = t('div');

    function make({runtime}) {
        let mount = null;
        let container = null;
        let layout = null;

        const overviewId = new Uuid(4).format();
        const miniOverviewId = new Uuid(4).format();
        const widgetSet = runtime.service('widget').newWidgetSet();

        function renderTabs(params) {
            const tabs = [
                {
                    id: 'main',
                    title: 'Data View',
                    render: () => {
                        const style = {
                            flex: '1 1 0px',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '0px'
                        };
                        return html`
                            <${WidgetWrapper}
                                    id="kb_dataview_dataObjectVisualizer"
                                    params=${params}
                                    runtime=${runtime}
                                    key=${new Uuid(4).format()}
                                    config=${{}},
                                    style=${style}
                            />
                        `;
                    }
                }, {
                    id: 'overview',
                    title: 'Overview',
                    autoScroll: true,
                    render: () => {
                        return html`
                            <${OverviewComponent}
                                    runtime=${runtime}
                                    ...${params}
                            />
                        `;
                    }
                }, {
                    id: 'provenance',
                    title: 'Provenance',
                    autoScroll: true,
                    render: () => {
                        return html`<${Provenance} runtime=${runtime} ...${params} />`;
                    }
                }
            ];

            if (runtime.featureEnabled('similar_genomes')) {
                tabs.push({
                    id: 'relatedData',
                    title: 'Related Data',
                    render: () => {
                        return html`
                            <${WidgetWrapper}
                                    id="kb_dataview_relatedData"
                                    params=${params}
                                    runtime=${runtime}
                                    key=${new Uuid(4).format()}
                                    config=${{}}
                                    scrolling=${true}
                            />
                        `;
                    }
                });
            }

            tabs.push({
                id: 'linkedSamples',
                title: 'Linked Samples',
                render: () => {
                    return html`
                        <${WidgetWrapper}
                                id="kb_dataview_linkedSamples"
                                params=${params}
                                runtime=${runtime}
                                key=${new Uuid(4).format()}
                                config=${{}}
                                scrolling=${true},
                                style=${{flex: '1 1 0', display: 'flex', flexDirection: 'column'}}
                        />
                    `;
                }
            });

            if (runtime.featureEnabled('object-link-to-term')) {
                tabs.push({
                    id: 'linkedOntologyTerms',
                    title: 'Linked Ontology Terms',
                    render: () => {
                        return html`
                            <${WidgetWrapper}
                                    id="kb_dataview_linkedOntologyTerms"
                                    params=${params}
                                    runtime=${runtime}
                                    key=${new Uuid(4).format()}
                                    config=${{}}
                                    scrolling=${true}
                            />
                        `;
                    }
                });
            }

            preact.render(preact.h(Tabs, {tabs, paneStyle: {}}), document.getElementById('tabs123'));
        }

        function renderPanel() {
            return div({
                class: 'PanelWidget',
                dataKbaseView: 'dataview',
                dataKBTesthookPlugin: 'dataview'
            }, [
                div({
                    class: 'Col'
                }, [
                    div({
                        id: widgetSet.addWidget('kb_dataview_copy'),
                        style: {
                            flex: '0 0 auto'
                        }
                    }),
                    div({
                        id: miniOverviewId,
                        style: {
                            flex: '0 0 auto',
                            marginBottom: '10px'
                        }
                    }),
                    div({
                        id: 'tabs123',
                        style: {
                            flex: '1 1 0px',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '0px'
                        }
                    })
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
            container.style.flex = '1 1 0px';
            container.style.display = 'flex';
            container.style['flex-direction'] = 'column';
            container.style['min-height'] = '0';
            mount.appendChild(container);
            // safe
            container.innerHTML = layout;
        }

        function start(params) {
            // add the tabs now.
            renderTabs(params);
            widgetSet.attach()
                .then(() => {
                    return Promise.all([
                        utils.getObjectInfo(runtime, params),
                        utils.getWorkspaceInfo(runtime, params)
                    ]);
                })
                .then(([objectInfo, workspaceInfo]) => {
                    runtime.send('ui', 'setTitle', `Data View for ${objectInfo.name}`);
                    params.objectInfo = objectInfo;
                    params.workspaceInfo = workspaceInfo;

                    // Ensures that these params are set, even if the landing page was invoked
                    // with names rather than ids.
                    params.workspaceId = objectInfo.wsid;
                    params.objectId = objectInfo.id;
                    params.objectVersion = objectInfo.version;
                    const props = Object.assign({}, params);
                    props.runtime = runtime;

                    preact.render(preact.h(MiniOverviewComponent, props), document.getElementById(miniOverviewId));

                    // preact.render(preact.h(OverviewComponent, props), document.getElementById(overviewId));

                    return Promise.all([objectInfo, widgetSet.start(params)]);
                })
                .catch((error) => {
                    // safe
                    container.innerHTML = '';
                    console.error('ERROR', error);
                    preact.render(preact.h(ErrorView, {runtime, error}), container);
                });
        }

        function run(params) {
            // return widgetSet.run(params);
            renderTabs(params);
            widgetSet.run(params)
                .then(() => {
                    return Promise.all([
                        utils.getObjectInfo(runtime, params),
                        utils.getWorkspaceInfo(runtime, params)
                    ]);
                })
                .then(([objectInfo, workspaceInfo]) => {
                    runtime.send('ui', 'setTitle', `Data View for ${objectInfo.name}`);
                    params.objectInfo = objectInfo;
                    params.workspaceInfo = workspaceInfo;

                    // Ensures that these params are set, even if the landing page was invoked
                    // with names rather than ids.
                    params.workspaceId = objectInfo.wsid;
                    params.objectId = objectInfo.id;
                    params.objectVersion = objectInfo.version;
                    const props = Object.assign({}, params);
                    props.runtime = runtime;

                    preact.render(preact.h(OverviewComponent, props), document.getElementById(overviewId));

                    return Promise.all([objectInfo, widgetSet.start(params)]);
                })
                .catch((error) => {
                    // safe
                    container.innerHTML = '';
                    console.error('ERROR', error);
                    preact.render(preact.h(ErrorView, {runtime, error}), container);
                });
        }

        function stop() {
            return widgetSet.stop();
        }

        function detach() {
            return widgetSet.detach().finally(() => {
                if (mount && container) {
                    mount.removeChild(container);
                    // safe
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
        make
    };
});
