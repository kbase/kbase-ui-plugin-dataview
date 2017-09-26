define([
    'bluebird',
    'knockout-plus',
    'kb_common/html',
    'kb_common/bootstrapUtils',
    'kb_common/jsonRpc/dynamicServiceClient',
    '../singleTaskPoller'
], function (
    Promise,
    ko,
    html,
    BS,
    DynamicServiceClient,
    Poller
) {
    var t = html.tag,
        div = t('div'),
        p = t('p'),
        span = t('span'),
        a = t('a'),
        table = t('table'),
        thead = t('thead'),
        tr = t('tr'),
        td = t('td'),
        th = t('th'),
        tbody = t('tbody');

    var connectionCategories = [{
        id: 'taxon',
        title: 'Taxon Inferences'
    }, {
        id: 'genome',
        title: 'Genome Inferences'
    }, {
        id: 'gene',
        title: 'Gene-level Inferences'
    }, {
        id: 'chemical',
        title: 'Chemical inferences'
    }];

    var connectionServices = [{
        categories: ['taxon'],
        id: 'app1',
        title: 'Clade specific genes and their enriched functions'
    }, {
        categories: ['taxonInferences'],
        id: 'app2',
        title: 'Predicted co-occurrence with other taxa'
    }, {
        categories: ['taxonInferences'],
        id: 'app3',
        title: 'Predicted environments for appearance/growth of taxa'
    }, {
        categories: ['taxonInferences'],
        id: 'app4',
        title: 'Predicted gene-content given other fragmentary evidence'
    }, {
        categories: ['genome'],
        id: 'app5',
        title: 'Encoded metabolic and regulatory networks (inference of regulatory motifs, mapping to regulators, and regulator mapping to signal inputs)'
    }, {
        categories: ['genome'],
        id: 'app6',
        title: 'Inference of strain/OTU growth and behavior over large set of standard conditions'
    }, {
        categories: ['genome'],
        id: 'app7',
        title: 'Strain specific genomic islands and genes with functional enrichment'
    }, {
        categories: ['genome'],
        id: 'app8',
        title: 'Evidence of regions under selection pressure or recent HGT'
    }, {
        categories: ['genome'],
        id: 'app9',
        title: 'Inference of phage resistance via CRISPR analysis'
    }, {
        categories: ['gene'],
        // this is the real id.
        id: 'C1',
        title: 'Orthology, gene neighbor/phylo profile based, functional genomic cluster based functional assignments',
        path: {
            path: 'reske/ke/fp'
        },
        released: true,
        connectsType: 'Genome'
    }, {
        categories: ['gene'],
        id: 'app12',
        title: 'Condition/chemical level association for requirement (expression or fitness necessity linked to environment or chemical challenge)'
    }, {
        categories: ['gene'],
        id: 'app13',
        title: 'Horizontal gene transfer inference'
    }, {
        categories: ['gene'],
        id: 'app14',
        title: 'Promiscuity prediction for enzymes/ligand binders '
    }, {
        categories: ['gene'],
        id: 'app15',
        title: 'Inference of regulatory motifs in DNA and RNA controlling expression'
    }, {
        categories: ['gene'],
        id: 'app16',
        title: 'Retrosynthesis predictions'
    }, {
        categories: ['gene'],
        id: 'app17',
        title: 'Predictions of which conditions would exercise genes not exercised in current functional genomic compendia'
    }, {
        categories: ['chemical'],
        id: 'app18',
        title: 'Similarity to other chemicals used to predict effects on genes, roles in pathways, which taxa might be affected by it. (functional enrichment of responsive genes)'
    }, {
        categories: ['chemical'],
        id: 'app19',
        title: 'Co-occurrence with other chemicals in environments, similarity in genes associated leading to predictions of common pathway/traits involved in. '
    }, {
        categories: ['chemical'],
        id: 'app20',
        title: 'Predictions of enzymes/reactions expected to participate in/interfere with'
    }, {
        categories: ['chemical'],
        id: 'app21',
        title: 'Chemotypephenotype relationships'
    }, {
        categories: ['condition'],
        id: 'app22',
        title: 'Similarity to other conditions and predictions of affects on taxa/genes '
    }, {
        categories: ['condition'],
        id: 'app23',
        title: 'Functional enrichment of biological responses to conditions`'
    }];

    function viewModel(params) {
        var runtime = params.runtime;

        // var ref = params.ref;
        var objectInfo = params.objectInfo;

        // var categories = ko.observableArray(connectionCategories);

        var connectors = ko.observableArray();

        var catalog = ko.observableArray();

        var data = {
            categories: connectionCategories,
            apps: connectionServices
        };

        var connectorsState = ko.observable('none');

        function fetchConnectorStatus() {
            var client = new DynamicServiceClient({
                url: runtime.config('services.service_wizard.url'),
                token: runtime.service('session').getAuthToken(),
                module: 'KBaseKnowledgeEngine'
            });

            return client.callFunc('getConnectorState', [{
                obj_ref: objectInfo.ref
            }]).spread(function (state) {
                return state;
                // if (state === null) {
                //     // no connector, none pending.
                //     // race condition -- between when an object is added to the narrative,
                //     // the event is emitted, and reske starts to build the connector.
                //     return 'no-connector';
                // }
                // return state;
            });

        }


        /*
        fetchConnectors
        This does not, but should one day, fetch the connectors relevant to this
        object. Each connector will be in some intermediate state or completed.
        */
        var error = ko.observable();

        function updateConnectors() {
            return fetchConnectorStatus()
                .then(function (status) {
                    // TODO: fetch connector status should return a set of connector apps and their status.
                    // For now: it just returns one status, and just one of our fake connector apps will ever
                    // match any type and that type is Genome.
                    // So ... we use the status for that one returned connector app, if any.
                    // If the status is accepted, queued, or started we monitor it every 5 sec.
                    // If none, we should monitor every 10-15 sec for maybe a minute, just in case it was kicked off and
                    // just isn't registering yet. Otherwise, no polling.
                    var type = objectInfo.typeName;
                    var cat = data.categories.map(function (category) {
                        return {
                            category: category,
                            apps: data.apps.filter(function (app) {
                                return ((app.categories.indexOf(category.id) >= 0) &&
                                    (app.connectsType === type));
                            })
                        };
                    }).filter(function (category) {
                        return (category.apps.length > 0);
                    }).map(function (category) {
                        // a bit messy ... we should have a set of categories and apps which are
                        // supported for this type. Our call to get the connector status should
                        // have returned a set of connector app statuses for this object.
                        // Here we assign the status to each app.
                        // FORNOW the call to get the status only returns the status for one
                        // connector. Not sure why.
                        return {
                            category: category.category,
                            showApps: ko.observable(false),
                            apps: category.apps.map(function (app) {
                                return {
                                    title: app.title,
                                    id: app.id,
                                    state: status,
                                    status: buildStateIcon(status),
                                    path: app.path
                                };
                            })
                        };
                    });
                    connectors(cat);
                    connectorsState('loaded');
                    return cat;
                })
                .catch(function (err) {
                    error(err.message);
                    connectorsState('error');
                });
        }

        var poller = Poller();
        var normalPollingInterval = 5000;
        // var activePollingInterval = 5000;
        var pollStatus = ko.observable();

        function startPolling() {
            poller.start({
                name: 'updater',
                interval: normalPollingInterval,
                runInitially: true,
                // a test to see if we need to keep the poller going.
                doContinue: function () {
                    var c = (connectors()
                        .some(function (category) {
                            return category.apps.some(function (app) {
                                switch (app.state) {
                                case 'accepted':
                                case 'queued':
                                case 'started':
                                    return true;
                                }
                            });
                        }));
                    return c;
                },
                task: function () {
                    pollStatus('busy');
                    return updateConnectors()
                        .catch(function (err) {
                            console.error('ERROR', err);
                        })
                        .finally(function () {
                            pollStatus('idle');
                        });
                }
            });
        }

        // get the initial connectors.
        // if 
        connectorsState('loading');
        updateConnectors()
            .then(function () {
                startPolling();
            })
            .finally(function () {
                connectorsState('loaded');
            });




        function updateCatalog(data) {
            var cat = data.categories.map(function (category) {
                return {
                    category: category,
                    showApps: ko.observable(false),
                    apps: data.apps.filter(function (app) {
                        return (app.categories.indexOf(category.id) >= 0);
                    })
                };
            });
            catalog(cat);
        }
        updateCatalog(data);

        function doViewConnector(data) {
            runtime.send('app', 'navigate', {
                path: data.path.path,
                params: {
                    ref: objectInfo.ref
                }
            });
        }

        function doShowApps(data, event) {
            var show = !data.showApps();
            if (event.shiftKey) {
                catalog()
                    .forEach(function (cat) {
                        cat.showApps(show);
                    });
            } else {
                data.showApps(show);
            }
        }

        return {
            connectors: connectors,
            doViewConnector: doViewConnector,
            catalog: catalog,
            connectorsState: connectorsState,
            doShowApps: doShowApps
        };
    }

    function buildApps() {
        return table({
            class: 'table'
        }, [
            thead([
                tr([
                    th({
                        style: {
                            width: '15%'
                        }
                    }, 'App Id'),
                    th('Connector')
                ])
            ]),
            tbody({
                dataBind: {
                    foreach: 'apps'
                }
            }, tr([
                td({
                    dataBind: {
                        text: 'id',
                    }
                }),
                td({
                    dataBind: {
                        text: 'title'
                    }
                })
            ]))
        ]);
    }

    function buildCatalog() {

        return BS.buildCollapsiblePanel({
            title: 'Connector Catalog',
            collapsed: false,
            classes: ['kb-panel-light'],
            body: div({
                dataBind: {
                    foreach: 'catalog'
                }
            }, [
                div({
                    dataBind: {
                        click: '$component.doShowApps'
                    },
                    class: '-connector-category unselectable',
                    style: {
                        backgroundColor: 'gray',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '5px',
                        cursor: 'pointer',
                        marginBottom: '4px',
                        userSelect: 'none'
                    }
                }, [
                    span({
                        dataBind: {
                            text: 'category.title'
                        }
                    }),
                    ' - ',
                    span({
                        dataBind: {
                            text: 'apps.length'
                        }
                    }),
                    ' app',
                    span({
                        dataBind: {
                            if: 'apps.length > 1'
                        }
                    }, 's'),
                    ' ',
                    span({
                        dataBind: {
                            css: {
                                'fa-chevron-right': '!showApps()',
                                'fa-chevron-down': 'showApps()'
                            }
                        },
                        style: {
                            marginLeft: '4px'
                        },
                        class: 'fa'
                    })
                ]),
                '<!-- ko if: showApps -->',
                buildApps(),
                '<!-- /ko -->'
            ])
        });
    }

    function buildConnectedApps() {
        return table({
            class: 'table'
        }, [
            thead([
                tr([
                    th({
                        style: {
                            width: '15%'
                        }
                    }, 'App Id'),
                    th('Connector'),
                    th({
                        style: {
                            width: '15%',
                            textAlign: 'center'
                        }
                    }, 'Status')
                ])
            ]),
            tbody({
                dataBind: {
                    foreach: 'apps'
                }
            }, tr([
                td({
                    dataBind: {
                        text: 'id',
                    }
                }),
                '<!-- ko if: state === "finished" -->',
                td(a({
                    dataBind: {
                        text: 'title',
                        click: '$component.doViewConnector'
                    }
                })),
                '<!-- /ko -->',
                '<!-- ko if: state !== "finished" -->',
                td(span({
                    dataBind: {
                        text: 'title'
                    }
                })),
                '<!-- /ko -->',
                td({
                    dataBind: {
                        html: 'status',
                    },
                    style: {
                        textAlign: 'center'
                    }
                }),
            ]))
        ]);
    }

    function buildConnectors() {
        return BS.buildPanel({
            title: 'Connectors',
            collapsed: true,
            classes: ['kb-panel-light'],
            body: div([
                div({
                    dataBind: {
                        foreach: 'connectors'
                    }
                }, [
                    div({
                        style: {
                            backgroundColor: 'gray',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '5px'
                        }
                    }, [
                        span({
                            dataBind: {
                                text: 'category.title'
                            }
                        })
                    ]),
                    buildConnectedApps()
                ])
            ])
        });
    }

    function buildError() {
        return BS.buildPanel({
            title: 'Error',
            type: 'error',
            body: p({
                dataBind: {
                    text: 'error'
                }
            })
        });
    }

    function icon(type, color) {
        return span({
            class: 'fa fa-' + type,
            style: {
                color: color || 'black'
            }
        });
    }

    function buildNoData() {
        return span({
            style: {
                color: 'silver'
            }
        }, '-');
    }


    function buildNull() {
        return span({
            class: 'fa fa-ban',
            style: {
                color: 'silver'
            },
            dataToggle: 'tooltip',
            dataPlacement: 'auto',
            title: 'This connector has not yet been built'
        });
    }

    function buildStateIcon(state) {
        switch (state) {
        case 'none':
            return icon('ban', 'silver');
        case 'accepted':
            return span([
                span({
                    class: 'fa fa-spinner fa-spin fa-fw',
                    style: {
                        color: 'silver'
                    }
                }),
                ' ',
                state
            ]);
        case 'queued':
            return span([
                span({
                    class: 'fa fa-spinner fa-spin fa-fw',
                    style: {
                        color: 'orange'
                    }
                }),
                ' ',
                state
            ]);
        case 'started':
            return span([
                span({
                    class: 'fa fa-spinner fa-spin fa-fw',
                    style: {
                        color: 'blue'
                    }
                }),
                ' ',
                state
            ]);
        case 'finished':
            return icon('check', 'green');
        case 'error':
            return icon('exclamation-circle', 'red');
        default:
            if (state === undefined) {
                return buildNoData();
            } else if (state === null) {
                return buildNull();
            } else {
                return span('? ' + state);
            }
        }
    }

    function buildConnectorArea() {
        return div([
            '<!-- ko if: connectorsState() === "loading" -->',
            html.loading('Loading connector status...'),
            '<!-- /ko -->',
            '<!-- ko if: connectorsState() === "loaded" -->',
            buildConnectors(),
            '<!-- /ko -->',
            '<!-- ko if: connectorsState() === "error" -->',
            buildError(),
            '<!-- /ko -->'
        ]);
    }

    function template() {
        return div({
            class: 'container-fluid component_dataview_knowledge-engine'
        }, [
            div({
                class: 'row'
            }, [
                div({
                    class: 'col-sm-6',
                }, buildConnectorArea()),
                div({
                    class: 'col-sm-6',
                }, buildCatalog())
            ])
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
