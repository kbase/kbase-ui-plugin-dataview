define([
    'jquery',
    'bluebird',
    'kb_common/html',
    'kb_common/jsonRpc/dynamicServiceClient',
    'kb_service/client/workspace',
    'kb_service/client/fba',
    'widgets/modeling/KBModeling',
    'lib/domUtils',
    'content',
    'lib/jqueryUtils',

    // for effect
    'kbaseUI/widget/legacy/tabs',
    'kbaseUI/widget/legacy/authenticatedWidget',
    'widgets/modeling/KBaseBiochem.Media',
    'widgets/modeling/KBaseFBA.FBA',
    'widgets/modeling/KBaseFBA.FBAModel',
    'widgets/modeling/KBaseFBA.FBAModelSet',
    //'widgets/modeling/KBasePhenotypes.PhenotypeSet',
    //'kb_dataview_widget_modeling_phenotypeSimulationSet',
    //'kb_dataview_widget_modeling_genomeSet',
    'kbaseUI/widget/legacy/helpers',
    'datatables_bootstrap'
], (
    $,
    Promise,
    html,
    DynamicServiceClient,
    Workspace,
    FBA,
    KBModeling,
    {domSafeText},
    content,
    {$errorAlert}
) => {
    const IMAGE_URL = 'http://bioseed.mcs.anl.gov/~chenry/jpeg/';

    const t = html.tag,
        a = t('a'),
        span = t('span'),
        table = t('table');

    function domSafeError(err) {
        if (err.message) {
            return domSafeText(err.message);
        }
        if (err.error && err.error.message) {
            return  domSafeText(err.error.message);
        }
        return 'Unknown error';
    }

    $.KBWidget({
        name: 'kbaseTabTable',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {},
        init(input) {
            this._super(input);
            const self = this;

            const type = input.type;

            // base class for workspace object classes
            const kbModeling = new KBModeling({
                runtime: this.runtime
            });

            //
            // 1) Use type (periods replaced with underscores) to instantiate object
            //

            const className = type.split(/-/)[0].replace(/\./g, '_');
            const ClassObject = kbModeling[className];
            this.obj = new ClassObject(self);

            //
            // 2) add the tabs (at page load)
            //
            const tabList = this.obj.tabList;

            const uiTabs = [];
            for (let i = 0; i < tabList.length; i++) {
                const tab = tabList[i];

                // add loading status
                const placeholder = $('<div>');
                placeholder.loading();

                uiTabs.push({
                    name: tab.name,
                    key: tab.key,
                    content: placeholder
                });
            }

            uiTabs[0].active = true;
            const tabs = self.$elem.kbTabs({tabs: uiTabs});

            //
            // 3) get meta data, add any metadata tables
            //
            let param;
            if (isNaN(input.ws) && isNaN(input.obj)) {
                param = {
                    workspace: input.ws,
                    name: input.obj
                };
            } else if (!isNaN(input.ws) && !isNaN(input.obj)) {
                param = {
                    ref: `${input.ws}/${input.obj}`
                };
            } else {
                throw new Error('Invalid input object reference');
            }

            this.workspaceClient = new Workspace(this.runtime.config('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });

            this.workspaceClient
                .get_object_info_new({
                    objects: [param],
                    includeMetadata: 1
                })
                .then(([result]) => {
                    self.obj.setMetadata(result);

                    for (let i = 0; i < tabList.length; i++) {
                        const tab = tabList[i];

                        if (tab.type === 'verticaltbl') {
                            const tabPane = tabs.tabContent(tab.name);
                            const table = self.verticalTable({
                                rows: tab.rows,
                                data: self.obj[tab.key]
                            });
                            tabPane.rmLoading();
                            // xss safe
                            tabPane.append(table);
                        }
                    }
                    return null;
                })
                .catch((err) => {
                    console.error('ERROR getting object info (new)');
                    console.error(err);
                });

            this.workspaceClient
                .get_objects([param])
                .then((data) => {
                    return Promise.try(() => {
                        return this.obj.setData(data[0].data, tabs);
                    }).then(() => {
                        return buildContent();
                    });
                })
                .catch((err) => {
                    console.error('ERROR getting objects', err);
                });

            const refLookup = {};

            function preProcessDataTable(tabSpec) {
                return Promise.try(() => {
                    // get refs
                    const refs = [];
                    const cols = tabSpec.columns;

                    if (!cols) {
                        return;
                    }
                    cols.forEach((col) => {
                        if ((col.type === 'tabLink' || col.type === 'wstype') && col.linkformat === 'dispWSRef') {
                            self.obj[tabSpec.key].forEach((item) => {
                                if (refs.indexOf(item[col.key]) === -1) {
                                    refs.push({
                                        ref: item[col.key]
                                    });
                                }
                            });
                        }
                    });

                    if (refs.length === 0) {
                        return null;
                    }

                    // get human readable info from workspaces
                    return self.workspaceClient.get_object_info_new({objects: refs})
                        .then((data) => {
                            // note we are iterating over the refs fed into the ws call.
                            // that call returns object info for each ref passed in, in the same
                            // order.
                            refs.forEach((ref, i) => {
                                const [
                                    id, name, workspaceType,
                                    , version, , workspaceId,
                                    workspaceName, , , /* metadata */
                                ] = data[i];
                                refLookup[ref.ref] = {
                                    id,
                                    name,
                                    wsid: workspaceId,
                                    ws: workspaceName,
                                    type: workspaceType.split('-')[0],
                                    version,
                                    ref: `${workspaceId  }/${  id  }/${  version}`,
                                    // note that the following (name based refs) is
                                    // deprecated and should no longer be used
                                    link: `${workspaceName  }/${  name}`
                                };
                            });
                            return null;
                        });
                });
            }

            function buildContent() {
                //5) Iterates over the entries in the spec and instantiate things
                return Promise.all(
                    tabList.map((tabSpec) => {
                        Promise.try(() => {
                            const tabPane = tabs.tabContent(tabSpec.name);

                            // skip any vertical tables for now
                            if (tabSpec.type === 'verticaltbl') {
                                return;
                            }

                            // if widget, invoke widget with arguments
                            if (tabSpec.widget) {
                                try {
                                    tabPane[tabSpec.widget](tabSpec.getParams());
                                    return;
                                } catch (ex) {
                                    console.error('Error invoking tab pane', tabSpec, ex);
                                    createErrorMessage(tabPane, ex);
                                }
                            }

                            // preprocess data to get workspace info on any references in class

                            return preProcessDataTable(tabSpec, tabPane)
                                .then(() => {
                                    createDataTable(tabSpec, tabPane);
                                    return null;
                                })
                                .catch((err) => {
                                    console.error('Error in preProcessDataTable', err);
                                    createErrorMessage(tabPane, err);
                                    return null;
                                });
                        });
                    })
                );
            }

            function createErrorMessage(tabPane, error) {
                tabPane.empty();
                // xss safe
                tabPane.append('<br>');
                // xss safe
                tabPane.append(
                    $errorAlert(error)
                );
            }

            // creates a datatable on a tabPane
            function createDataTable(tabSpec, tabPane) {
                const settings = self.getTableSettings(tabSpec, self.obj.data);
                tabPane.rmLoading();

                // note: must add table first
                // xss safe
                tabPane.append(
                    table({
                        class: 'table table-bordered table-striped',
                        dataKBTesthookElement: 'table',
                        style: {
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }
                    })
                );
                // tabPane.append(
                //     '<table class="table table-bordered table-striped" style="margin-left: auto; margin-right: auto;">'
                // );
                tabPane.find('table').dataTable(settings);

                // add any events
                newTabEvents(tabSpec.name);
            }

            // takes table spec and prepared data, returns datatables settings object
            this.getTableSettings = function (tab) {
                const tableColumns = getColSettings(tab);
                const settings = {
                    dom: '<"top"lf>rt<"bottom"ip><"clear">',
                    aaData: self.obj[tab.key],
                    aoColumns: tableColumns,
                    bAutoWidth: false,
                    language: {
                        search: '_INPUT_',
                        searchPlaceholder: `Search ${  tab.name}`
                    }
                };

                // add any events
                for (let i = 0; i < tab.columns.length; i++) {
                    settings.fnDrawCallback = function () {
                        newTabEvents(tab.name);
                    };
                }

                return settings;
            };

            function newTabEvents(name) {
                const ids = tabs.tabContent(name).find('.id-click');

                ids.unbind('click');
                ids.click(function () {
                    const info = {
                            id: $(this).data('id'),
                            type: $(this).data('type'),
                            method: $(this).data('method'),
                            ref: $(this).data('ref'),
                            name: $(this).data('name'),
                            ws: $(this).data('ws'),
                            action: $(this).data('action')
                        },
                        contentDiv = $('<div>');

                    tabs.addTab({
                        name: info.id,
                        content: contentDiv,
                        removable: true
                    });
                    tabs.showTab(info.id);

                    Promise.try(() => {
                        if (info.method && info.method !== 'undefined') {
                            return Promise.try(() => {
                                contentDiv.loading();
                                return self.obj[info.method](info);
                            }).then((rows) => {
                                contentDiv.rmLoading();
                                if (!rows) {
                                    // xss safe
                                    contentDiv.append(`<br>No data found for ${info.id}`);
                                } else {
                                    const table = self.verticalTable({rows});
                                    // xss safe
                                    contentDiv.append(table);
                                    newTabEvents(info.id);
                                }
                            });
                        } else if (info.action === 'openWidget') {
                            contentDiv.kbaseTabTable({
                                ws: info.ws,
                                type: info.type,
                                obj: info.name
                            });
                        }
                    }).catch((err) => {
                        console.error(err);
                        contentDiv.html($errorAlert(err));
                    });
                });
            }

            // takes table spec, returns datatables column settings
            function getColSettings(tab) {
                const settings = [];
                const cols = tab.columns;

                for (let i = 0; i < cols.length; i++) {
                    const col = cols[i];
                    const key = col.key,
                        type = col.type,
                        format = col.linkformat,
                        method = col.method,
                        action = col.action;

                    const config = {
                        sTitle: col.label,
                        sDefaultContent: '-',
                        mData: ref(key, type, format, method, action, content.na())
                    };

                    if (col.width) {
                        config.sWidth = col.width;
                    }

                    settings.push(config);
                }

                return settings;
            }

            function ref(key, type, format, method, action, defaultContent) {
                return function (d) {
                    if (type === 'tabLink' && format === 'dispIDCompart') {
                        const dispid = d.dispid || d[key];
                        return a(
                            {
                                class: 'id-click',
                                dataId: d[key],
                                dataMethod: method,
                                dataKBTesthookField: key
                            },
                            dispid
                        );
                    } else if (type === 'tabLink' && format === 'dispID') {
                        const id = d[key];
                        return a(
                            {
                                class: 'id-click',
                                dataId: id,
                                dataMethod: method,
                                dataKBTesthookField: key
                            },
                            id
                        );
                    } else if (type === 'wstype' && format === 'dispWSRef') {
                        const ref = refLookup[d[key]];
                        // TODO: add testhook field here
                        if (ref && ref.ref) {
                            return (
                                `<a href="${self.runtime.europaURL({hash: `dataview/${ref.ref}`}).toString()}" target="_blank" ` +
                                '" class="id-click"' +
                                `" data-ws="${
                                    ref.ws
                                }" data-id="${
                                    ref.name
                                }" data-ref="${
                                    d[key]
                                }" data-type="${
                                    ref.type
                                }" data-action="openPage"` +
                                `" data-method="${
                                    method
                                }" data-name="${
                                    ref.name
                                }">${
                                    domSafeText(ref.name)
                                }</a>`
                            );
                        }
                        return 'no link';

                    }

                    const value = d[key];

                    if ($.isArray(value)) {
                        if (type === 'tabLinkArray') {
                            return span(
                                {
                                    dataKBTesthookField: key
                                },
                                tabLinkArray(value, method) || defaultContent
                            );
                        }
                        return span(
                            {
                                dataKBTesthookField: key
                            },
                            d[key].join(', ')
                        );
                    }

                    const displayValue = (() => {
                        return value || defaultContent;
                    })();

                    return span(
                        {
                            dataKBTesthookField: key
                        },
                        displayValue
                    );
                };
            }

            function tabLinkArray(tabArray, method) {
                return tabArray.map((d) => {
                    const dispid = d.dispid || d.id;
                    return a(
                        {
                            class: 'id-click',
                            dataId: d.id,
                            dataMethod: method
                        },
                        dispid
                    );
                })
                    .join(', ');
            }

            this.verticalTable = function (p) {
                const data = p.data;
                const rows = p.rows;

                const table = $('<table class="table table-bordered" style="margin-left: auto; margin-right: auto;">');

                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i],
                        type = row.type;

                    // don't display undefined things in vertical table
                    if (
                        ('data' in row && typeof row.data === 'undefined') ||
                        ('key' in row && typeof data[row.key] === 'undefined')
                    ) {
                        continue;
                    }

                    const r = $('<tr>');
                    // xss safe
                    r.append(`<td><b>${domSafeText(row.label)}</b></td>`);

                    // if the data is in the row definition, use it
                    if ('data' in row) {
                        const value = (() => {
                            if (type === 'tabLinkArray') {
                                return tabLinkArray(row.data, row.method);
                            } else if (type === 'tabLink') {
                                return a(
                                    {
                                        class: 'id-click',
                                        dataId: row.data,
                                        dataMethod: row.method
                                    },
                                    row.dispid
                                );
                            }
                            return row.data;
                        })() || content.na();
                        // xss safe (trusting usage)
                        r.append(`<td>${value}</td>`);
                    } else if ('key' in row) {
                        if (row.type === 'wstype') {
                            const ref = data[row.key];

                            const cell = $(`<td data-ref="${ref}">loading...</td>`);
                            // xss safe
                            r.append(cell);

                            getLink(ref)
                                .then(({ref, name}) => {
                                    table
                                        .find(`[data-ref="${ref}"]`)
                                        // xss safe usage of html
                                        .html(`<a href="${self.runtime.europaURL({hash: `dataview/${ref}`}).toString()}" target="_blank">${name ? domSafeText(name) : content.na()}</a>`);
                                    return null;
                                })
                                .catch((err) => {
                                    console.error(err);
                                    table
                                        .find(`[data-ref="${ref}"]`)
                                        // xss safe usage of html
                                        .html(`<span title="${domSafeError(err)}" style="cursor: help">error fetching</span>`);
                                    return null;
                                });
                        } else {
                            // Plain column
                            // xss safe
                            r.append(`<td data-k-b-testhook-field="${row.key}">${domSafeText(data[row.key])}</td>`);
                        }
                    } else if (row.type === 'pictureEquation') {
                        // xss safe
                        r.append($('<td></td>').append(this.pictureEquation(row.data)));
                    }

                    // xss safe
                    table.append(r);
                }

                return table;
            };

            this.getBiochemReaction = function (id) {
                const client = new DynamicServiceClient({
                    url: this.runtime.config('services.service_wizard.url'),
                    token: this.runtime.service('session').getAuthToken(),
                    module: 'BiochemistryAPI'
                });
                return client
                    .callFunc('get_reactions', [
                        {
                            reactions: [id]
                        }
                    ])
                    .spread((data) => {
                        return data[0];
                    });
            };

            this.getBiochemCompound = function (id) {
                const client = new DynamicServiceClient({
                    url: this.runtime.config('services.service_wizard.url'),
                    token: this.runtime.service('session').getAuthToken(),
                    module: 'BiochemistryAPI'
                });
                return client
                    .callFunc('get_compounds', [
                        {
                            compounds: [id]
                        }
                    ])
                    .spread((data) => {
                        return data[0];
                    });
            };

            this.getBiochemCompounds = function (ids) {
                const client = new DynamicServiceClient({
                    url: this.runtime.config('services.service_wizard.url'),
                    token: this.runtime.service('session').getAuthToken(),
                    module: 'BiochemistryAPI'
                });
                return client
                    .callFunc('get_compounds', [
                        {
                            compounds: ids
                        }
                    ])
                    .then(([data]) => {
                        return data;
                    });
            };

            this.compoundImage = function (id) {
                return (
                    `<img src=http://minedatabase.mcs.anl.gov/compound_images/ModelSEED/${
                        id.split('_')[0]
                    }.png style='height:300px !important;'>`
                );
            };

            this.pictureEquation = function (eq) {
                const cpds = get_cpds(eq);
                const panel = $('<div></div>');

                for (let i = 0; i < cpds.left.length; i++) {
                    const cpd = cpds.left[i];
                    const img_url = `${IMAGE_URL + cpd  }.jpeg`;
                    /* TODO: this is going to fail ... there is no panel node around unless it is set globally in some dependency ... */
                    // xss safe
                    panel.append(
                        `<div class="pull-left text-center">\
                                    <img src="${img_url}" width=150 ><br>\
                                    <div class="cpd-id" data-cpd="${cpd}">${domSafeText(cpd)}</div>\
                                </div>`
                    );

                    const plus = $('<div class="pull-left text-center">+</div>');
                    plus.css('margin', '30px 0 0 0');

                    if (i < cpds.left.length - 1) {
                        // xss safe
                        panel.append(plus);
                    }
                }

                const direction = $('<div class="pull-left text-center"><=></div>');
                direction.css('margin', '25px 0 0 0');
                // xss safe
                panel.append(direction);

                for (let i = 0; i < cpds.right.length; i++) {
                    const cpd = cpds.right[i];
                    const img_url = `${IMAGE_URL + cpd  }.jpeg`;
                    // xss safe
                    panel.append(
                        `<div class="pull-left text-center">\
                                    <img src="${img_url}" data-cpd="${cpd}" width=150 ><br>\
                                    <div class="cpd-id" data-cpd="${cpd}">${domSafeText(cpd)}</div>\
                                </div>`
                    );

                    const plus = $('<div class="pull-left text-center">+</div>');
                    plus.css('margin', '25px 0 0 0');

                    if (i < cpds.right.length - 1) {
                        // xss safe
                        panel.append(plus);
                    }
                }

                const cpd_ids = cpds.left.concat(cpds.right);
                this.getBiochemCompounds(cpd_ids)
                    .then((d) => {
                        const map = {};
                        for (const i in d) {
                            map[d[i].id] = domSafeText(d[i].name);
                        }

                        $('.cpd-id').each(function () {
                            // xss safe - I think
                            $(this).html(map[$(this).data('cpd')]);
                        });
                        return null;
                    })
                    .catch((err) => {
                        console.error(err);
                    });

                return panel;
            };

            function get_cpds(equation) {
                const cpds = {};
                const sides = equation.split('=');
                cpds.left = sides[0].match(/cpd\d*/g);
                cpds.right = sides[1].match(/cpd\d*/g);

                return cpds;
            }

            function getLink(ref) {
                return self.workspaceClient.get_object_info_new({
                    objects: [{ref}]
                })
                    .then(([objectInfo]) => {
                        return {
                            url: `${objectInfo[7]}/${objectInfo[1]}`,
                            ref: `${objectInfo[6]}/${objectInfo[0]}/${objectInfo[4]}`,
                            name: objectInfo[1]
                        };
                    });
            }

            return this;
        }
    });
});
