define([
    'jquery',
    'bluebird',
    'kb_lib/html',
    'kb_lib/htmlBootstrapBuilders',
    '../utils',
    './assemblySummary',
    './assemblyContigs'
], ($, Promise, html, BS, utils, AssemblySummary, AssemblyContigs) => {
    const t = html.tag,
        div = t('div');

    function factory(config) {
        let hostNode,
            container;
        const runtime = config.runtime;

        const widgets = [
            {
                module: AssemblySummary,
                id: 'summary'
            },
            {
                module: AssemblyContigs,
                id: 'contigs'
            }
        ];
        widgets.forEach((widget) => {
            widget.instance = widget.module.make({
                runtime
            });
        });

        // VIEW

        function layout() {
            return div([
                BS.buildPanel({
                    type: 'default',
                    title: 'Summary',
                    body: div({
                        dataElement: 'summary'
                    })
                }),
                BS.buildPanel({
                    type: 'default',
                    title: 'Contigs',
                    body: div({
                        dataElement: 'contigs'
                    })
                })
            ]);
        }

        // WIDGET API

        function attach(node) {
            hostNode = node;
            container = hostNode.appendChild(document.createElement('div'));
            // xss safe
            container.innerHTML = layout();
            return Promise.all(
                widgets.map((widget) => {
                    return widget.instance.attach(container.querySelector(`[data-element="${  widget.id  }"]`));
                })
            );
        }

        function start(params) {
            // get the assembly reference
            const assemblyRef = utils.getRef(params);

            return Promise.all(
                widgets.map((widget) => {
                    return widget.instance.start({
                        objectRef: assemblyRef
                    });
                })
            );
        }

        function stop() {
            return Promise.all(
                widgets.map((widget) => {
                    return widget.instance.stop();
                })
            );
        }

        function detach() {
            return Promise.all(
                widgets.map((widget) => {
                    return widget.instance.detach();
                })
            ).then(() => {
                if (hostNode && container) {
                    // xss safe
                    container.innerHTML = '';
                    hostNode.removeChild(container);
                }
            });
        }

        return Object.freeze({
            attach,
            start,
            stop,
            detach
        });
    }

    return {
        make(config) {
            return factory(config);
        }
    };
});
