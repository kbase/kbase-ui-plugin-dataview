define([
    'bluebird',
    'numeral',
    'knockout',
    // '../queryService2',
    'kb_lib/jsonRpc/dynamicServiceClient',
    'kb_lib/html',
    'kb_lib/htmlBuilders',
    'kb_lib/htmlBootstrapBuilders',
    'lib/format',
    '../table',
    'content',

    // for effect
    'datatables_bootstrap'
], (
    Promise,
    numeral,
    ko,
    DynamicServiceClient,
    // QueryService,
    html,
    build,
    BS,
    {domSafeText},
    TableComponent,
    content
) => {
    const t = html.tag,
        div = t('div');

    function factory(config) {
        const runtime = config.runtime;
        let container;
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

            const AssemblyClient = new DynamicServiceClient({
                url: runtime.config('services.service_wizard.url'),
                token: runtime.service('session').getAuthToken(),
                module: 'AssemblyAPI'
            });

            const dataCalls = [
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
                        format(value) {
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
                        format(value) {
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
            // xss safe - just inserts a component
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
            return Promise.try(() => {
                container = node;
                // xss safe
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
            // xss safe
            container.innerHTML = BS.buildPanel({
                type: 'danger',
                title: 'Error',
                body: domSafeText(err.message) || domSafeText(err.error.message)
            });
        }

        function start({workspaceId, objectId, objectVersion}) {
            const ref = [workspaceId, objectId, objectVersion].join('/');
            return fetchData(ref)
                .then((data) => {
                    const table = makeContigTable(data);
                    renderTable(table);
                })
                .catch((err) => {
                    renderError(err);
                });
        }

        function stop() {
            return Promise.try(() => {
                return null;
            });
        }

        function detach() {
            return Promise.try(() => {
                return null;
            });
        }
        return {
            attach,
            start,
            stop,
            detach
        };
    }

    return {
        make(config) {
            return factory(config);
        }
    };
});
