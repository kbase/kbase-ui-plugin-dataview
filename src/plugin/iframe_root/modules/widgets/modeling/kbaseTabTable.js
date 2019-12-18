define([
    'jquery',
    'bluebird',
    'kb_common/html',
    'kb_common/jsonRpc/dynamicServiceClient',
    'kb_service/client/workspace',
    'kb_service/client/fba',
    'widgets/modeling/KBModeling',
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
], function ($, Promise, html, DynamicServiceClient, Workspace, FBA, KBModeling) {
    'use strict';

    const t = html.tag,
        a = t('a'),
        span = t('span'),
        table = t('table');

    $.KBWidget({
        name: 'kbaseTabTable',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {},
        init: function (input) {
            this._super(input);
            var self = this;

            // root url path for landing pages
            var DATAVIEW_URL = '/#dataview/';

            var type = input.type;

            // tab widget
            var tabs;

            // base class for workspace object classes
            var kbModeling = new KBModeling({
                runtime: this.runtime
            });

            //
            // 1) Use type (periods replaced with underscores) to instantiate object
            //

            var className = type.split(/-/)[0].replace(/\./g, '_');
            var ClassObject = kbModeling[className];
            this.obj = new ClassObject(self);

            //
            // 2) add the tabs (at page load)
            //
            var tabList = this.obj.tabList;

            var uiTabs = [];
            for (var i = 0; i < tabList.length; i++) {
                var tab = tabList[i];

                // add loading status
                var placeholder = $('<div>');
                placeholder.loading();

                uiTabs.push({ name: tabList[i].name, key: tabList[i].key, content: placeholder });
            }

            uiTabs[0].active = true;
            tabs = self.$elem.kbTabs({ tabs: uiTabs });

            //
            // 3) get meta data, add any metadata tables
            //
            var param;
            if (isNaN(input.ws) && isNaN(input.obj)) {
                param = {
                    workspace: input.ws,
                    name: input.obj
                };
            } else if (!isNaN(input.ws) && !isNaN(input.obj)) {
                param = {
                    ref: input.ws + '/' + input.obj
                };
            } else {
                throw new Error('Invalid input object reference');
            }

            this.workspaceClient = new Workspace(this.runtime.config('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });

            this.workspaceClient
                .get_object_info_new({ objects: [param], includeMetadata: 1 })
                .then(function (res) {
                    self.obj.setMetadata(res[0]);

                    for (var i = 0; i < tabList.length; i++) {
                        var spec = tabList[i];

                        if (spec.type === 'verticaltbl') {
                            var key = spec.key,
                                data = self.obj[key],
                                tabPane = tabs.tabContent(spec.name);

                            var table = self.verticalTable({ rows: spec.rows, data: data });
                            tabPane.rmLoading();
                            tabPane.append(table);
                        }
                    }
                    return null;
                })
                .catch(function (err) {
                    console.error('ERROR getting object info (new)');
                    console.error(err);
                });

            this.workspaceClient
                .get_objects([param])
                .then(function (data) {
                    return Promise.try(function () {
                        return self.obj.setData(data[0].data, tabs);
                    }).then(function () {
                        return buildContent();
                    });
                })
                .catch(function (err) {
                    console.error('ERROR getting objects', err);
                });

            var refLookup = {};

            function preProcessDataTable(tabSpec, tabPane) {
                return Promise.try(function () {
                    // get refs
                    var refs = [],
                        cols = tabSpec.columns;
                    cols.forEach(function (col) {
                        if ((col.type === 'tabLink' || col.type === 'wstype') && col.linkformat === 'dispWSRef') {
                            self.obj[tabSpec.key].forEach(function (item) {
                                if (refs.indexOf(item[col.key]) === -1) {
                                    refs.push({ ref: item[col.key] });
                                }
                            });
                        }
                    });

                    if (!refs.length) {
                        return null;
                    }

                    // get human readable info from workspaces
                    return self.workspaceClient.get_object_info_new({ objects: refs }).then(function (data) {
                        refs.forEach(function (ref, i) {
                            // if (ref in referenceLookup) return
                            refLookup[ref.ref] = {
                                name: data[i][1],
                                ws: data[i][7],
                                type: data[i][2].split('-')[0],
                                //link: data[i][2].split('-')[0]+'/'+data[i][7]+'/'+data[i][1]
                                link: data[i][7] + '/' + data[i][1]
                            };
                        });
                        return null;
                    });
                });
            }

            function buildContent(data) {
                //5) Iterates over the entries in the spec and instantiate things
                return Promise.all(
                    tabList.map(function (tabSpec) {
                        Promise.try(function () {
                            var tabPane = tabs.tabContent(tabSpec.name);

                            // skip any vertical tables for now
                            if (tabSpec.type === 'verticaltbl') {
                                return;
                            }

                            // if widget, invoke widget with arguments
                            if (tabSpec.widget) {
                                try {
                                    tabPane[tabSpec.widget](tabSpec.getParams());
                                } catch (ex) {
                                    createErrorMessage(tabPane, ex.message);
                                } finally {
                                    return;
                                }
                            }

                            // preprocess data to get workspace info on any references in class

                            return preProcessDataTable(tabSpec, tabPane)
                                .then(function () {
                                    createDataTable(tabSpec, tabPane);
                                    return null;
                                })
                                .catch(function (err) {
                                    createErrorMessage(tabPane, err.message || err.error.message);
                                    return null;
                                });
                        });
                    })
                );
            }

            function createErrorMessage(tabPane, message) {
                tabPane.empty();
                tabPane.append('<br>');
                tabPane.append(
                    html.makePanel({
                        title: 'Error',
                        content: message
                    })
                );
            }

            // creates a datatable on a tabPane
            function createDataTable(tabSpec, tabPane) {
                var settings = self.getTableSettings(tabSpec, self.obj.data);
                tabPane.rmLoading();

                // note: must add table first
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
            this.getTableSettings = function (tab, data) {
                var tableColumns = getColSettings(tab);

                var settings = {
                    dom: '<"top"lf>rt<"bottom"ip><"clear">',
                    aaData: self.obj[tab.key],
                    aoColumns: tableColumns,
                    bAutoWidth: false,
                    language: {
                        search: '_INPUT_',
                        searchPlaceholder: 'Search ' + tab.name
                    }
                };

                // add any events
                for (var i = 0; i < tab.columns.length; i++) {
                    var col = tab.columns[i];

                    settings.fnDrawCallback = function () {
                        newTabEvents(tab.name);
                    };
                }

                return settings;
            };

            function newTabEvents(name) {
                var ids = tabs.tabContent(name).find('.id-click');

                ids.unbind('click');
                ids.click(function () {
                    var info = {
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

                    Promise.try(function () {
                        if (info.method && info.method !== 'undefined') {
                            return Promise.try(function () {
                                contentDiv.loading();
                                return self.obj[info.method](info);
                            }).then(function (rows) {
                                contentDiv.rmLoading();
                                if (!rows) {
                                    contentDiv.append('<br>No data found for ' + info.id);
                                } else {
                                    var table = self.verticalTable({ rows: rows });
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
                    }).catch(function (err) {
                        console.error(err);
                        contentDiv.empty();
                        contentDiv
                            .append('ERROR: ' + err.message)
                            .css('color', 'red')
                            .css('text-align', 'center')
                            .css('padding', '10px');
                    });
                });
            }

            // takes table spec, returns datatables column settings
            function getColSettings(tab) {
                var settings = [];

                var cols = tab.columns;

                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    var key = col.key,
                        type = col.type,
                        format = col.linkformat,
                        method = col.method,
                        action = col.action;

                    var config = {
                        sTitle: col.label,
                        sDefaultContent: '-',
                        mData: ref(key, type, format, method, action)
                    };

                    if (col.width) config.sWidth = col.width;

                    settings.push(config);
                }

                return settings;
            }

            function ref(key, type, format, method) {
                return function (d) {
                    if (type === 'tabLink' && format === 'dispIDCompart') {
                        var dispid = d[key];
                        if ('dispid' in d) {
                            dispid = d.dispid;
                        }
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
                        var id = d[key];
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
                        var ref = refLookup[d[key]];
                        // TODO: add testhook field here
                        if (ref && ref.link) {
                            return (
                                '<a href="' +
                                DATAVIEW_URL +
                                ref.link +
                                '" target="_blank" ' +
                                '" class="id-click"' +
                                '" data-ws="' +
                                ref.ws +
                                '" data-id="' +
                                ref.name +
                                '" data-ref="' +
                                d[key] +
                                '" data-type="' +
                                ref.type +
                                '" data-action="openPage"' +
                                '" data-method="' +
                                method +
                                '" data-name="' +
                                ref.name +
                                '">' +
                                ref.name +
                                '</a>'
                            );
                        } else {
                            return 'no link';
                        }
                    }

                    var value = d[key];

                    if ($.isArray(value)) {
                        if (type === 'tabLinkArray') {
                            return span(
                                {
                                    dataKBTesthookField: key
                                },
                                tabLinkArray(value, method)
                            );
                        }
                        return span(
                            {
                                dataKBTesthookField: key
                            },
                            d[key].join(', ')
                        );
                    }

                    return span(
                        {
                            dataKBTesthookField: key
                        },
                        value
                    );
                };
            }

            function tabLinkArray(a, method) {
                var links = [];
                a.forEach(function (d) {
                    var dispid = d.id;
                    if ('dispid' in d) {
                        dispid = d.dispid;
                    }
                    links.push(
                        a(
                            {
                                class: 'id-click',
                                dataId: d.id,
                                dataMethod: method
                            },
                            dispid
                        )
                        // '<a class="id-click" data-id="' + d.id + '" data-method="' + method + '">' + dispid + '</a>'
                    );
                });
                return links.join(', ');
            }

            this.verticalTable = function (p) {
                var data = p.data;
                var rows = p.rows;

                var table = $('<table class="table table-bordered" style="margin-left: auto; margin-right: auto;">');

                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i],
                        type = row.type;

                    // don't display undefined things in vertical table
                    if (
                        ('data' in row && typeof row.data === 'undefined') ||
                        ('key' in row && typeof data[row.key] === 'undefined')
                    ) {
                        continue;
                    }

                    var r = $('<tr>');
                    r.append('<td><b>' + row.label + '</b></td>');

                    // if the data is in the row definition, use it
                    if ('data' in row) {
                        var value;
                        if (type === 'tabLinkArray') {
                            value = tabLinkArray(row.data, row.method);
                        } else if (type === 'tabLink') {
                            value = a(
                                {
                                    class: 'id-click',
                                    dataId: row.data,
                                    dataMethod: row.method
                                },
                                row.dispid
                            );
                            // value =
                            //     '<a class="id-click" data-id="' +
                            //     row.data +
                            //     '" data-method="' +
                            //     row.method +
                            //     '">' +
                            //     row.dispid +
                            //     '</a>';
                        } else {
                            value = row.data;
                        }
                        r.append('<td>' + value + '</td>');
                    } else if ('key' in row) {
                        if (row.type === 'wstype') {
                            var ref = data[row.key];

                            var cell = $('<td data-ref="' + ref + '">loading...</td>');
                            r.append(cell);

                            getLink(ref)
                                .then(function (info) {
                                    var name = info.url.split('/')[1];
                                    var ref = info.ref;
                                    table
                                        .find('[data-ref=\'' + ref + '\']')
                                        .html(
                                            '<a href="' + DATAVIEW_URL + info.url + '" target="_blank">' + name + '</a>'
                                        );
                                    return null;
                                })
                                .catch(function (err) {
                                    console.error(err);
                                    return null;
                                });
                        } else {
                            r.append('<td data-k-b-testhook-field="' + row.key + '">' + data[row.key] + '</td>');
                        }
                    } else if (row.type === 'pictureEquation') {
                        r.append($('<td></td>').append(this.pictureEquation(row.data)));
                    }

                    table.append(r);
                }

                return table;
            };

            this.getBiochemReaction = function (id) {
                var client = new DynamicServiceClient({
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
                    .spread(function (data) {
                        return data[0];
                    });
            };

            this.getBiochemCompound = function (id) {
                var client = new DynamicServiceClient({
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
                    .spread(function (data) {
                        return data[0];
                    });
            };

            this.getBiochemCompounds = function (ids) {
                var client = new DynamicServiceClient({
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
                    '<img src=http://minedatabase.mcs.anl.gov/compound_images/ModelSEED/' +
                    id.split('_')[0] +
                    '.png style=\'height:300px !important;\'>'
                );
            };

            var imageURL = 'http://bioseed.mcs.anl.gov/~chenry/jpeg/';
            this.pictureEquation = function (eq) {
                var cpds = get_cpds(eq);
                var panel = $('<div></div>');

                for (var i = 0; i < cpds.left.length; i++) {
                    var cpd = cpds.left[i];
                    var img_url = imageURL + cpd + '.jpeg';
                    /* TODO: this is going to fail ... there is no panel node around unless it is set globally in some dependency ... */
                    panel.append(
                        '<div class="pull-left text-center">\
                                    <img src="' +
                        img_url +
                        '" width=150 ><br>\
                                    <div class="cpd-id" data-cpd="' +
                        cpd +
                        '">' +
                        cpd +
                        '</div>\
                                </div>'
                    );

                    var plus = $('<div class="pull-left text-center">+</div>');
                    plus.css('margin', '30px 0 0 0');

                    if (i < cpds.left.length - 1) {
                        panel.append(plus);
                    }
                }

                var direction = $('<div class="pull-left text-center">' + '<=>' + '</div>');
                direction.css('margin', '25px 0 0 0');
                panel.append(direction);

                for (var i = 0; i < cpds.right.length; i++) {
                    var cpd = cpds.right[i];
                    var img_url = imageURL + cpd + '.jpeg';
                    panel.append(
                        '<div class="pull-left text-center">\
                                    <img src="' +
                        img_url +
                        '" data-cpd="' +
                        cpd +
                        '" width=150 ><br>\
                                    <div class="cpd-id" data-cpd="' +
                        cpd +
                        '">' +
                        cpd +
                        '</div>\
                                </div>'
                    );

                    var plus = $('<div class="pull-left text-center">+</div>');
                    plus.css('margin', '25px 0 0 0');

                    if (i < cpds.right.length - 1) {
                        panel.append(plus);
                    }
                }

                var cpd_ids = cpds.left.concat(cpds.right);
                this.getBiochemCompounds(cpd_ids)
                    .then(function (d) {
                        var map = {};
                        for (var i in d) {
                            map[d[i].id] = d[i].name;
                        }

                        $('.cpd-id').each(function () {
                            $(this).html(map[$(this).data('cpd')]);
                        });
                        return null;
                    })
                    .catch(function (err) {
                        console.error(err);
                    });

                return panel;
            };

            function get_cpds(equation) {
                var cpds = {};
                var sides = equation.split('=');
                cpds.left = sides[0].match(/cpd\d*/g);
                cpds.right = sides[1].match(/cpd\d*/g);

                return cpds;
            }

            function getLink(ref) {
                return self.workspaceClient.get_object_info_new({ objects: [{ ref: ref }] }).then(function (data) {
                    var a = data[0];
                    return {
                        url: a[7] + '/' + a[1],
                        ref: a[6] + '/' + a[0] + '/' + a[4]
                    };
                });
            }

            return this;
        }
    });
});
