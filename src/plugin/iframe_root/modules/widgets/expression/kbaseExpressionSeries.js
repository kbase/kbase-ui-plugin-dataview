define([
    'jquery',
    'bluebird',
    'kb_common/html',
    'kb_common/utils',
    'kb_service/client/workspace',
    'kb_service/workspaceClient',
    'lib/jqueryUtils',

    // For effect
    'kbaseUI/widget/legacy/widget',
    'kbaseUI/widget/legacy/tabs',
    'datatables_bootstrap'
], ($, Promise, html, Utils, Workspace, workspaceClient, {$errorAlert}) => {

    function objTable({obj, keys, labels, keysAsLabels, bold}) {
        // const obj = p.obj,
        //     keys = p.keys;

        // option to use nicely formated keys as labels
        if (keysAsLabels) {
            const labels = [];
            for (const i in keys) {
                const str = keys[i].key.replace(/(id|Id)/g, 'ID');
                const words = str.split(/_/g);
                for (const j in words) {
                    words[j] = words[j].charAt(0).toUpperCase() + words[j].slice(1);
                }
                const name = words.join(' ');
                labels.push(name);
            }
        } else if ('labels' in p) {
            const labels = labels;
        } else {
            // if labels are specified in key objects, use them
            for (const i in keys) {
                const key_obj = keys[i];
                if ('label' in key_obj) {
                    labels.push(key_obj.label);
                } else {
                    labels.push(key_obj.key);
                }

            }
        }

        const table = $('<table class="table table-striped table-bordered">');

        for (const i in keys) {
            const key = keys[i];
            const $row = $('<tr>');

            let $labelCell;
            if (bold) {
                $labelCell = $('<td>').css('font-weight', 'bold').text(labels);
            } else {
                $labelCell = $('<td>').text(labels[i]);
            }
            // xss safe
            $row.append($labelCell);

            const $valueCell = $('<td>');
            if ('format' in key) {
                const val = key.format(obj);
                $valueCell.text(val);
            } else if (key.type === 'bool') {
                $valueCell.text((obj[key.key] === 1 ? 'True' : 'False'));
            } else {
                $valueCell.text(obj[key.key]);
            }
            // xss safe
            $row.append($valueCell);

            // xss safe
            table.append($row);
        }

        return table;
    }


    $.KBWidget({
        name: 'kbaseExpressionSeries',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            color: 'black'
        },
        init(options) {
            this._super(options);
            const workspace = new Workspace(this.runtime.getConfig('services.workspace.url'), {
                    token: this.runtime.service('session').getAuthToken()
                }),
                wsClient = Object.create(workspaceClient).init({
                    url: this.runtime.getConfig('services.workspace.url'),
                    authToken: this.runtime.service('session').getAuthToken()
                }),
                container = this.$elem;

            // xss safe
            container.html(html.loading());

            function buildTable(data) {
                return Promise.try(() => {
                    container.empty();
                    const tabs = container.kbTabs({
                            tabs: [
                                {name: 'Overview', active: true},
                                {name: 'ExpressionSeries', content: html.loading()}
                            ]
                        }),
                        // Code to displaying overview data
                        keys = [
                            {key: 'wsid'},
                            {key: 'ws'},
                            {key: 'kbid'},
                            {key: 'source'},
                            {key: 'genome'},
                            {key: 'type'},
                            {key: 'errors'},
                            {key: 'owner'},
                            {key: 'date'}
                        ],
                        wsObj = data[0][0],
                        genome = Object.keys(wsObj.data.genome_expression_sample_ids_map)[0],
                        phenooverdata = {
                            wsid: wsObj.info[1],
                            ws: wsObj.info[7],
                            kbid: wsObj.data.regulome_id,
                            source: wsObj.data.source,
                            genome,
                            type: wsObj.data.type,
                            errors: wsObj.data.importErrors,
                            owner: wsObj.creator,
                            date: wsObj.created
                        },
                        labels = [
                            'Name',
                            'Workspace',
                            'KBID',
                            'Source',
                            'Genome',
                            'Type',
                            'Errors',
                            'Owner',
                            'Creation date'
                        ],
                        table = objTable({obj: phenooverdata, keys, labels}),
                        series = wsObj.data.genome_expression_sample_ids_map[genome],
                        sample_refs = [];

                    // xss safe
                    tabs.tabContent('Overview').append(table);

                    for (let i = 0; i < series.length; i++) {
                        sample_refs.push({ref: series[i]});
                    }
                    return Promise.resolve(workspace.get_objects(sample_refs)).then((sample_data) => {
                        // container.rmLoading();
                        //container.empty();
                        //container.append(pcTable);
                        // create a table from the sample names
                        const pcTable = $('<table class="table table-bordered table-striped" style="width: 100%;">');
                        tabs.setContent({name: 'ExpressionSeries', content: pcTable});
                        const tableSettings = {
                            sPaginationType: 'full_numbers',
                            iDisplayLength: 10,
                            aaData: sample_data,
                            aaSorting: [[0, 'asc']],
                            aoColumns: [
                                {
                                    sTitle: 'Gene Expression Samples',
                                    mData(d) {
                                        return d.data.id;
                                    }
                                }
                            ],
                            oLanguage: {
                                sEmptyTable: 'No objects in workspace',
                                sSearch: 'Search: '
                            }
                        };
                        pcTable.dataTable(tableSettings);
                    });
                });
            }

            workspace
                .get_objects([{workspace: options.ws, name: options.name}])
                .then((data) => {
                    const reflist = data[0].refs;
                    return new Promise.all([data, wsClient.translateRefs(reflist)]);
                })
                .then((data, refhash) => {
                    return buildTable(data, refhash);
                })
                .catch((e) => {
                    console.error(e);
                    container.html($errorAlert(e));
                });

            return this;
        }
    });
});
