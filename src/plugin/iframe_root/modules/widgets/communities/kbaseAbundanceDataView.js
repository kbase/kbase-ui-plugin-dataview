/**
 * KBase widget to display table and boxplot of BIOM data
 */
define([
    'jquery',
    'kb_service/client/workspace',
    'kb_common/html',
    'widgets/communities/kbStandaloneGraph',
    'lib/domUtils',
    'lib/jqueryUtils',

    'datatables_bootstrap',
    'kbaseUI/widget/legacy/authenticatedWidget'
], ($, Workspace, html, Graph, {domSafeText}, {$errorAlert}) => {
    $.KBWidget({
        name: 'AbundanceDataView',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        token: null,
        options: {
            id: null,
            ws: null,
            name: 0
        },
        init(options) {
            this._super(options);
            return this;
        },
        render() {
            const self = this;

            const container = this.$elem;
            container.empty();
            if (self.token === null) {
                // safe
                container.append('<div>[Error] You\'re not logged in</div>');
                return;
            }
            // safe
            container.append(html.loading('loading data...'));

            const kbws = new Workspace(this.runtime.getConfig('services.workspace.url'), {token: self.token});
            kbws.get_objects(
                [{ref: `${self.options.ws}/${self.options.id}`}],
                (data) => {
                    container.empty();
                    // parse data
                    if (data.length === 0) {
                        const msg =
                            `[Error] Object ${self.options.id} does not exist in workspace ${self.options.ws}`;
                        // safe (id and ws can't be invalid here)
                        container.append(`<div><p>${msg}>/p></div>`);
                    } else {
                        const biom = data[0].data;
                        let matrix = [];
                        const colnum = biom.columns.length;
                        const rownum = biom.rows.length;
                        let tdata = [];
                        // get matrix
                        if (biom.matrix_type === 'sparse') {
                            matrix = self.sparse2dense(biom.data, biom.shape[0], biom.shape[1]);
                        } else {
                            matrix = biom.data;
                        }
                        // get column names
                        // build graph data
                        const divdata = new Array(colnum);

                        /*
                     * TODO: re-enable this color palette feature
                      EAP disable for now
                      this is a dependency on "rgbcolor.js", just one of some one-off dependencies
                    for communities. I can't even find this source anywayere.
                    Faked for now.
                    var colors = GooglePalette(colnum);
                    */
                        const colors = [];
                        for (let i = 0; i < colnum; i += 1) {
                            colors[i] = '#678C30';
                        }
                        const clength = colnum + 1;
                        const cnames = new Array(clength);
                        cnames[0] = 'Annotation';
                        for (let c = 0; c < colnum; c++) {
                            if (self.options.name === 0) {
                                cnames[c + 1] = biom['columns'][c]['id'];
                                divdata[c] = {name: biom['columns'][c]['id'], data: [], fill: colors[c]};
                            } else {
                                cnames[c + 1] = biom['columns'][c]['name'];
                                divdata[c] = {name: biom['columns'][c]['name'], data: [], fill: colors[c]};
                            }
                        }
                        // add values
                        let maxval = 0;
                        tdata = new Array(rownum);
                        for (let r = 0; r < rownum; r++) {
                            tdata[r] = new Array(clength);
                            tdata[r][0] = domSafeText(biom['rows'][r]['id']);
                            for (let  c = 0; c < colnum; c++) {
                                maxval = Math.max(maxval, matrix[r][c]);
                                divdata[c]['data'].push(matrix[r][c]);
                                let value = Math.round(matrix[r][c] * 1000) / 1000;
                                if (!value) {
                                    value = '0';
                                }
                                tdata[r][c + 1] = value;
                            }
                        }
                        // set tabs
                        /*
                    var tlen = 0;
                    if (window.hasOwnProperty('rendererTable') && rendererTable.length) {
                        tlen = rendererTable.length;
                    }
                    var glen = 0;
                    if (window.hasOwnProperty('rendererGraph') && rendererGraph.length) {
                        glen = rendererGraph.length;
                    }
                    */
                        // Made tabs created through Javascript so they don't navigate
                        // you off of an Angular page
                        // ...but the button function needs to be set up manually as below.
                        const graphId = html.genId();
                        const $graphTab = $(`<a href="#outputGraph${  graphId  }">BoxPlots</a>`).click(function (e) {
                            e.preventDefault();
                            $(this).tab('show');
                        });
                        const $tableTab = $(`<a href="#outputTable${  graphId  }">Abundance Table</a>`).click(function (
                            e
                        ) {
                            e.preventDefault();
                            $(this).tab('show');
                        });
                        const $tabs = $('<ul>')
                            .addClass('nav nav-tabs')
                            // safe
                            .append(
                                $('<li>')
                                    .addClass('active')
                                    // safe
                                    .append($graphTab)
                            )
                            // safe
                            .append($('<li>').append($tableTab));

                        const divs =
                            '<div class=\'tab-content\'>' +
                            `<div class='tab-pane active' id='outputGraph${
                                graphId
                            }' style='width: 95%;'></div>` +
                            `<div class='tab-pane' id='outputTable${
                                graphId
                            }' style='width: 95%;'></div></div>`;
                        // safe
                        container.append($tabs).append(divs);
                        // TABLE

                        /*
                     TODO: possibly, replace this standaloneTable thing,
                        for now, just use this simple table generator.
                    var tableTest = standaloneTable.create({index: tlen});
                    tableTest.settings.target = document.getElementById("outputTable" + tlen);
                    tableTest.settings.data = {header: cnames, data: tdata};
                    tableTest.settings.filter = {0: {type: "text"}};
                    var mw = [120];
                    for (var i = 1; i < cnames.length; i++) {
                        mw.push(130);
                    }
                    tableTest.settings.minwidths = mw;
                    tableTest.render(tlen);
                    */
                        const tableTest = html.makeTable({
                            columns: cnames,
                            rows: tdata,
                            classes: ['table', 'table-striped']
                        });
                        // safe - the table data is made dom safe (see above).
                        document.getElementById(`outputTable${graphId}`).innerHTML = tableTest;
                        $(`#outputTable${graphId}>table`).dataTable();

                        // DEVIATION PLOT
                        let ab_type = 'normalized';
                        if (maxval > 1) {
                            ab_type = 'raw';
                        }
                        const devTest = Graph.create({
                            target: document.getElementById(`outputGraph${  graphId}`),
                            data: divdata,
                            y_title: `${ab_type  } abundance`,
                            show_legend: false,
                            height: 400,
                            chartArea: [0.1, 0.1, 0.95, 0.8],
                            type: 'deviation'
                        });
                        devTest.render();
                    }
                },
                (error) => {
                    // safe
                    container.html($errorAlert(error));
                }
            );
            return self;
        },
        loggedInCallback(event, auth) {
            this.token = auth.token;
            this.render();
            return this;
        },
        loggedOutCallback() {
            this.token = null;
            this.render();
            return this;
        },
        sparse2dense(sparse, rmax, cmax) {
            const dense = new Array(rmax);
            for (let i = 0; i < rmax; i++) {
                dense[i] = Array.apply(null, new Array(cmax)).map(Number.prototype.valueOf, 0);
            }
            // 0 values are undefined
            for (let i = 0; i < sparse.length; i++) {
                dense[sparse[i][0]][sparse[i][1]] = sparse[i][2];
            }
            return dense;
        },
        /*
         * TODO: use from library
         */
        uuidv4(a, b) {
            for (
                b = a = '';
                a++ < 36;
                b += (a * 51) & 52 ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16) : '-'
            );
            return b;
        }
    });
});
