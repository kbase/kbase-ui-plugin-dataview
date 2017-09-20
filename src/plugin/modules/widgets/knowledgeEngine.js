define([
    'knockout-plus',
    'kb_common/html'
], function (
    ko,
    html
) {
    'use strict';

    var t = html.tag,
        div = t('div');

    function factory(config) {
        var runtime = config.runtime,
            hostNode, container;

        function attach(node) {
            hostNode = node;
            container = hostNode.appendChild(document.createElement('div'));
        }

        function start(params) {
            // crude for now...
            if (params.objectInfo.typeName !== 'Genome') {
                container.innerHTML =  'Sorry, Knowledge Engine Connections not yet available for ' + params.objectInfo.typeName;
                return;
            }

            container.innerHTML = div({
                class: 'row'
            }, [
                div({
                    class: 'col-sm-6'
                }, [
                    'This is the Knowledge Engine Connections Panel'
                ]),
                div({
                    class: 'col-sm-6'
                }, [
                    div({
                        dataBind: {
                            component: {
                                name: '"dataview/knowledge-engine"',
                                params: {
                                    ref: 'ref',
                                    runtime: 'runtime'
                                }
                            }
                        }
                    }),
                ])
            ]);
            ko.applyBindings({
                runtime: runtime,
                ref: params.objectInfo.ref
            }, container);
        }

        function stop () {
        }

        function detach() {
            if (hostNode && container) {
                hostNode.removeChild(container);
            }
        }

        return {
            attach: attach,
            start: start,
            stop: stop,
            detach: detach
        };
    }

    return {
        make: function(config) {
            return factory(config);
        }
    };
});