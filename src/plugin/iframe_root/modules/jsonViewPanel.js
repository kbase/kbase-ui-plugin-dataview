define(['kb_lib/html', 'kbaseUI/widget/widgetSet', 'utils'], (html, WidgetSet, utils) => {
    function factory(config) {
        const runtime = config.runtime;
        let container;
        const widgetSet = runtime.service('widget').newWidgetSet();
        const t = html.tag;
        let layout;

        function renderLayout() {
            const div = t('div');
            return div({
                style: {
                    flex: '1 1 0px',
                    overflow: 'auto',
                    minHeight: '0px'
                }
            }, div(
                {
                    class: 'container-fluid',
                    style: {
                        width: '100%'
                    },
                    dataKBTesthookPlugin: 'dataview'
                },
                [
                    div({class: 'row'}, [
                        div({class: 'col-md-8'}, [div({id: widgetSet.addWidget('kb_dataview_jsonView')})]),
                        div({class: 'col-md-4'}, [div({id: widgetSet.addWidget('kb_dataview_jsonViewOverview')})])
                    ])
                ]
            ));
        }

        function init(config) {
            layout = renderLayout();
            runtime.send('ui', 'setTitle', 'JSON View');
            return widgetSet.init(config);
        }

        function attach(node) {
            container = node;
            // safe
            container.innerHTML = layout;
            return widgetSet.attach(container);
        }

        function start(params) {
            return Promise.all([
                utils.getObject(runtime, params),
                utils.getWorkspaceInfo(runtime, params)])
                .then(([object, workspaceInfo]) => {
                    return widgetSet.start({object, workspaceInfo});
                });
        }

        function stop() {
            container.innerHTML = '';
            return widgetSet.stop();
        }

        return {
            init,
            attach,
            start,
            stop
        };
    }

    return {
        make(config) {
            return factory(config);
        }
    };
});
