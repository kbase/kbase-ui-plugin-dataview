/*global define */
/*jslint browser: true, white: true */
define([
    'bluebird',
    'jquery',
    'd3',
    'kb_common/html',
    'kb_common/dom',
    'kb_service/client/workspace',
    'kb_common/jsonRpc/dynamicServiceClient',
    'dagre',
    'bootstrap',
    'd3_sankey'
],
function (Promise, $, d3, html, dom, Workspace, DynamicServiceClient, dagre) {
    'use strict';
    function widget(config) {

        var runtime = config.runtime;
        var mount, container, $container, workspaceId, objectId;
        var sketchClient = new DynamicServiceClient({
            url: runtime.config('services.service_wizard.url'),
            token: runtime.service('session').getAuthToken(),
            module: 'sketch_service'
        });

        /**
         * HTML to render when the genome similarity data is finished loading.
         */
        function dataLayout(data) {
            var distances = data.distances;
            return html.tag('div')([
                html.tag('table')({class: 'table'}, [
                    html.tag('thead')([
                        html.tag('tr')([
                            html.tag('th')('Distance'),
                            html.tag('th')('Scientific name'),
                            html.tag('th')('Database name'),
                            html.tag('th')('Database ID')
                        ])
                    ]),
                    html.tag('tbody')(distances.map(function (each) {
                          return html.tag('tr')([
                              html.tag('td')([String(each.dist)]),
                              html.tag('td')([each.sciname]),
                              html.tag('td')([each.namespaceid]),
                              html.tag('td')([each.sourceid])
                          ]);
                    }))
                ])
            ]);
        }

        /**
         * HTML to render while the data is loading.
         */
        function loadingLayout() {
            return html.tag('div')([
                html.tag('p')([html.loading('Finding similar genomes')])
            ])
        }

        /**
         * Construct an ObjectIdentity that can be used to query the WS.
         */
        function getObjectIdentity(wsNameOrId, objNameOrId, objVer) {
            if (objVer) {
                return {ref: wsNameOrId + '/' + objNameOrId + '/' + objVer};
            }
            return {ref: wsNameOrId + '/' + objNameOrId};
        }

        // Widget API
        function attach(node) {
            mount = node;
            container = dom.createElement('div');
            $container = $(container);
            container.innerHTML = loadingLayout();
            mount.appendChild(container);
        }
        function start(params) {
            workspaceId = params.workspaceId;
            objectId = params.objectId;
            var objectIdentity = getObjectIdentity(params.workspaceId, params.objectId, params.objectVersion);
            var workspaceRef = [workspaceId, params.objectId, params.objectVersion || '1'].join('/');
            sketchClient.callFunc('get_homologs', [workspaceRef]).then(function (data) {
                container.innerHTML = dataLayout(data);
            });
        }
        function stop() {}
        function detach() {
            mount.removeChild(container);
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
            return widget(config);
        }
    };
});

