define([
    'knockout-plus',
    'kb_common/html',
    'kb_common/jsonRpc/dynamicServiceClient'
], function (
    ko,
    html,
    DynamicServiceClient
) {
    'use strict';

    var t = html.tag,
        div = t('div');




    // Chemical inferences
    // ¬ Similarity to other chemicals used to predict effects on genes, roles in pathways, which taxa might be affected by it. (functional enrichment of responsive genes)
    // ¬ Co-occurrence with other chemicals in environments, similarity in genes associated leading to predictions of common pathway/traits involved in. 
    // ¬ Predictions of enzymes/reactions expected to participate in/interfere with
    // ¬ Chemotypephenotype relationships

    // Environment/Condition/Media inferences
    // ¬ Similarity to other conditions and predictions of affects on taxa/genes 
    // ¬ Functional enrichment of biological responses to conditions`

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
                container.innerHTML = 'Sorry, Knowledge Engine not available for ' + params.objectInfo.typeName;
                return;
            }

            container.innerHTML = div({
                class: 'row'
            }, [
                div({
                    class: 'col-sm-12'
                }, [
                    div({
                        dataBind: {
                            component: {
                                name: '"dataview/knowledge-engine"',
                                params: {
                                    ref: 'ref',
                                    objectInfo: 'objectInfo',
                                    runtime: 'runtime'
                                }
                            }
                        }
                    }),
                ])
            ]);
            ko.applyBindings({
                runtime: runtime,
                ref: params.objectInfo.ref,
                objectInfo: params.objectInfo
            }, container);
        }

        function stop() {}

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
        make: function (config) {
            return factory(config);
        }
    };
});
