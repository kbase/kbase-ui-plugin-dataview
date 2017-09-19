define([
    'knockout-plus',
    'kb_common/html'
], function(
    ko,
    html
) {
    var t = html.tag,
        div = t('div'),
        span = t('span'),
        a = t('a'),
        table = t('table'),
        thead= t('thead'),
        tr = t('tr'),
        td = t('td'),
        th = t('th'),
        tbody = t('tbody');

    function viewModel(params) {
        var runtime = params.runtime;
        var connectors = ko.observableArray();

        function updateConnectors() {
            connectors.push({
                name: 'functionalProfile',
                label: 'Functional Profile',
                path: {
                    path: 'reske/ke/fp',
                    query: {
                        ref: params.ref
                    }
                },
                status: 'ready'
            });
            connectors.push({
                name: 'somethingElse',
                label: 'Something Else',
                path: {
                    path: 'reske/ke/somethingelse',
                    params: {
                        ref: params.ref
                    }
                },
                status: 'building'
            });
        }

        function doViewConnector(data) {
            runtime.send('app', 'navigate', {
                path: data.path.path,
                params: data.path.query
            });
        }

        updateConnectors();

        return {
            connectors: connectors,
            doViewConnector: doViewConnector
        };
    }

    function template() {
        return table({
            class: 'table'
        }, [
            thead([
                tr([
                    th('Connector'),
                    th('Status')
                ])
            ]),
            tbody({
                dataBind: {
                    foreach: 'connectors'
                }
            }, tr([
                td(a({
                    dataBind: {
                        text: 'label',
                        click: '$component.doViewConnector'
                    }
                })),
                td([
                    '<!-- ko if: status === "ready" -->',
                    span({
                        class: 'fa fa-check',
                        style: {
                            color: 'green'
                        }
                    }),
                    '<!-- /ko -->',
                    '<!-- ko if: status === "building" -->',
                    'Connector is building...', span({style: {fontSize: '60%'}}, html.loading()),
                    '<!-- /ko -->'
                ])
            ]))
        ]);
    }

    function component() {
        return {
            viewModel: viewModel,
            template: template()
        };
    }

    return component;
});