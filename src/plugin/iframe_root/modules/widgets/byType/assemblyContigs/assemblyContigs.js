define([
    'bluebird',
    'numeral',
    'knockout',
    // '../queryService2',
    'kb_lib/jsonRpc/dynamicServiceClient',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    'kb_lib/htmlBootstrapBuilders',
    '../table',
    'content',

    // for effect
    'datatables_bootstrap'
], function (
    Promise,
    numeral,
    ko,
    DynamicServiceClient,
    // QueryService,
    html,
    build,
    BS,
    TableComponent,
    content
) {
    'use strict';
    var t = html.tag,
        div = t('div');

    function factory(config) {
        var runtime = config.runtime;
        var container;
        // var queryService = QueryService({
        //     runtime: runtime
        // });

        //
        function fetchData(objectRef) {
            // var query = {
            //     assembly: {
            //         defaultArgs: {
            //             ref: objectRef
            //         },
            //         methods: {
            //             // contig_lengths: {},
            //             // contig_gc_content: {}
            //             search_contigs: {
            //                 args: {
            //                     start: 0,
            //                     sort_by: []
            //                 }
            //             }
            //         }
            //     }
            // };
            // return queryService.query(query);

            var AssemblyClient = new DynamicServiceClient({
                url: runtime.config('services.service_wizard.url'),
                token: runtime.service('session').getAuthToken(),
                module: 'AssemblyAPI'
            });

            var dataCalls = [
                // AssemblyClient.callFunc('get_contig_lengths', [objectRef, null]).then(function (result) {
                //     return result[0];
                // }),
                // AssemblyClient.callFunc('get_contig_gc_content', [objectRef, null]).then(function (result) {
                //     return result[0];
                // }),
                AssemblyClient.callFunc('search_contigs', [{
                    ref: objectRef,
                    sort_by: [],
                    start: 0
                }])
                    .then(([result]) => {
                        return result;
                    })
            ];
            return Promise.all(dataCalls)
                .then(([result]) => {
                    // return {
                    //     contigLengths: contigLengths,
                    //     contigGc: contigGc
                    // };
                    const {contigs, /* num_found */} = result;
                    return contigs;
                });
        }

        function makeContigTable(data) {
            // const rows = Object.keys(data.assembly.contig_lengths)
            //     .map(function (id) {
            //         const contigLength = data.assembly.contig_lengths[id];
            //         const gc = data.assembly.contig_gc_content[id];
            //         return [id, contigLength, gc];
            //     });
            const rows = data.map((contig) => {
                return [
                    contig.contig_id,
                    contig.length,
                    contig.gc
                ];
            });
            return {
                rows,
                columns: [
                    //     {
                    //     name: 'row_id',
                    //     label: '#',
                    //     type: 'number',
                    //     width: '5%',
                    //     search: false,
                    //     style: {
                    //         textAlign: 'center'
                    //     },
                    //     columnStyle: {
                    //         textAlign: 'center'
                    //     }
                    // },
                    {
                        name: 'contig_id',
                        label: 'Id',
                        type: 'string',
                        width: '30%',
                        search: true,
                        style: {
                            fontFamily: 'sans-serif'
                        }
                    },
                    {
                        name: 'length',
                        label: 'Contig Length (bp)',
                        type: 'number',
                        width: '35%',
                        format: function (value) {
                            return numeral(value).format('0,0');
                        },
                        style: {
                            fontFamily: 'monospace',
                            textAlign: 'right'
                        },
                        columnStyle: {
                            textAlign: 'right'
                        }
                    },
                    {
                        name: 'gc',
                        label: 'GC (%)',
                        type: 'number',
                        width: '30%',
                        format: function (value) {
                            if (value === null) {
                                return content.na();
                            }
                            return (value * 100).toFixed(2);
                        },
                        style: {
                            fontFamily: 'monospace',
                            textAlign: 'right'
                        },
                        columnStyle: {
                            textAlign: 'right'
                        }
                    }
                ]
            };
        }

        function renderTable(table) {
            const node = container.querySelector('[data-element="summary"]');
            node.innerHTML = div({
                dataBind: {
                    component: {
                        name: TableComponent.quotedName(),
                        params: {
                            table: 'table',
                            showRowNumber: true
                        }
                    }
                }
            });
            ko.applyBindings(
                {
                    table
                },
                node
            );
        }

        // LIFECYCLE API

        function attach(node) {
            return Promise.try(function () {
                container = node;
                container.innerHTML = div([
                    div(
                        {
                            dataElement: 'summary'
                        },
                        div(
                            {
                                style: {
                                    textAlign: 'center'
                                }
                            },
                            build.loading()
                        )
                    ),
                    div({
                        dataElement: 'contigs'
                    })
                ]);
            });
        }

        function renderError(err) {
            container.innerHTML = BS.buildPanel({
                type: 'danger',
                title: 'Error',
                body: err.message || err.error.message
            });
        }

        function start({workspaceId, objectId, objectVersion}) {
            const ref = [workspaceId, objectId, objectVersion].join('/');
            return fetchData(ref)
                .then(function (data) {
                    const table = makeContigTable(data);
                    renderTable(table);
                })
                .catch((err) => {
                    renderError(err);
                });
        }

        function stop() {
            return Promise.try(function () {
                return null;
            });
        }

        function detach() {
            return Promise.try(function () {
                return null;
            });
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
