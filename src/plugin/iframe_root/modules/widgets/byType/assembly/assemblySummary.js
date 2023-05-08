define([
    'bluebird',
    'kb_common/html',
    'kb_common/bootstrapUtils',
    'lib/format',
    '../queryService',
    'datatables_bootstrap'
], (
    Promise,
    html,
    BS,
    {domSafeText},
    QueryService
) => {
    const t = html.tag,
        div = t('div'),
        span = t('span'),
        table = t('table'),
        tr = t('tr'),
        td = t('td'),
        tdSafe = (content) => {
            const tdTag = t('td');
            return tdTag(domSafeText(content));
        };

    function factory(config) {
        const runtime = config.runtime;
        let hostNode, container;
        const queryService = QueryService({
            runtime
        });

        function fetchData(objectRef) {
            const querySpec = {
                assembly: {
                    _args: {
                        ref: objectRef
                    },
                    stats: {
                        num_contigs: {},
                        gc_content: {},
                        dna_size: {}
                    }
                },
                workspace: {
                    _args: {
                        ref: objectRef
                    },
                    data: {
                        external_source: {},
                        external_source_id: {},
                        external_source_origination_date: {}
                    }
                }
            };
            return queryService.query(querySpec);
        }

        function renderSummaryTable(data) {
            // xss safe
            container.innerHTML = table(
                {
                    class: 'table table-striped table-bordered table-hover',
                    style: {
                        margin: 'auto auto'
                    }
                },
                [
                    tr([td('Number of Contigs'), tdSafe(data.assembly.stats.num_contigs)]),
                    tr([td('Total GC Content'), td(`${String((data.assembly.stats.gc_content * 100).toFixed(2))}%`)]),
                    tr([td('Total Length'), tdSafe(`${Intl.NumberFormat('en-us', {useGrouping: true}).format(data.assembly.stats.dna_size)} bp`)]),
                    tr([td('External Source'), td(data.workspace.external_source ? domSafeText(data.workspace.external_source) : na())]),
                    tr([td('External Source ID'), td(data.workspace.external_source_id ? domSafeText(data.workspace.external_source_id) : na())]),
                    tr([td('Source Origination Date'), td(data.workspace.external_source_origination_date ? domSafeText(data.workspace.external_source_origination_date) : na())])
                ]
            );
        }

        function na() {
            return span(
                {
                    style: {
                        fontStyle: 'italic',
                        color: 'gray'
                    }
                },
                'n/a'
            );
        }

        function renderError(err) {
            // xss safe
            container.innerHTML = BS.buildPanel({
                type: 'danger',
                title: 'Error',
                body: domSafeText(err.message)
            });
        }

        // WIDGET/SERVICE API

        function attach(node) {
            return Promise.try(() => {
                hostNode = node;
                container = hostNode.appendChild(document.createElement('div'));
            });
        }

        function start(params) {
            // xss safe
            container.innerHTML = div(
                {
                    style: {
                        textAlign: 'center'
                    }
                },
                html.loading()
            );
            return fetchData(params.objectRef)
                .then((data) => {
                    renderSummaryTable(data);
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
