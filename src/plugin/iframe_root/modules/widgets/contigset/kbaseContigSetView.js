/**
 * Output widget for visualization of genome annotation.
 * @author Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */
define([
    'jquery',
    'bluebird',
    'kb_service/client/workspace',
    'kb_common/html',
    'uuid',
    'lib/jqueryUtils',

    // for effect
    'datatables_bootstrap',
    'kbaseUI/widget/legacy/authenticatedWidget'
], (
    $,
    Promise,
    Workspace,
    html,
    Uuid,
    {$errorAlert}
) => {
    $.KBWidget({
        name: 'kbaseContigSetView',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        ws_id: null,
        ws_name: null,
        token: null,
        job_id: null,
        options: {
            ws_id: null,
            ws_name: null,
            width: 850
        },
        init(options) {
            this._super(options);

            // TODO: these should be named more sensibly ...
            // for instance, ws_id and obj_id, or workspaceId and objectId.
            // and we should not try to support synonums like ws for ws_id and id for obj_id.
            this.ws_name = options.ws_name;
            this.ws_id = options.ws_id;
            if (options.ws && options.id) {
                this.ws_id = options.id;
                this.ws_name = options.ws;
            }

            this.ws_service = new Workspace(this.runtime.getConfig('services.workspace.url'), {
                token: this.token
            });

            this.render();
            return this;
        },
        render() {
            const self = this;
            const pref = new Uuid(4).format();

            const container = this.$elem;

            const ready = function () {
                container.empty();
                // xss safe
                container.append(html.loading('loading data...'));

                // var p = kb.req('ws', 'get_object_subset', [{ref: self.ws_name + "/" + self.ws_id, included: ['contigs/[*]/id', 'contigs/[*]/length', 'id', 'name', 'source', 'source_id', 'type']}]);

                Promise.try(
                    self.ws_service.get_object_subset([
                        {
                            ref: `${self.ws_name  }/${  self.ws_id}`,
                            included: [
                                'contigs/[*]/id',
                                'contigs/[*]/length',
                                'id',
                                'name',
                                'source',
                                'source_id',
                                'type'
                            ]
                        }
                    ])
                )
                    .then((data) => {
                        container.empty();
                        const cs = data[0].data,
                            tabNames = ['Overview', 'Contigs'],
                            tabIds = ['overview', 'contigs'],
                            tabs = $(`<ul id="${pref}table-tabs" class="nav nav-tabs"/>`);
                        // xss safe
                        tabs.append(
                            `<li class="active"><a href="#${pref}${tabIds[0]
                            }" data-toggle="tab" >${tabNames[0]}</a></li>`
                        );
                        for (let i = 1; i < tabIds.length; i += 1) {
                            // xss safe
                            tabs.append(
                                `<li><a href="#${pref}${tabIds[i]  }" data-toggle="tab">${tabNames[i]}</a></li>`
                            );
                        }
                        // xss safe
                        container.append(tabs);

                        // tab panel
                        const tab_pane = $(`<div id="${pref}tab-content" class="tab-content"/>`);
                        // xss safe
                        tab_pane.append(`<div class="tab-pane in active" id="${pref}${tabIds[0]}"/>`);
                        for (let i = 1; i < tabIds.length; i += 1) {
                            // xss safe
                            tab_pane.append($(`<div class="tab-pane in" id="${pref}${tabIds[i]}"/>`));
                        }
                        // xss safe
                        container.append(tab_pane);

                        $(`#${  pref  }table-tabs a`).click(function (e) {
                            e.preventDefault();
                            $(this).tab('show');
                        });

                        ////////////////////////////// Overview Tab //////////////////////////////
                        // xss safe
                        $(`#${pref}overview`).append(
                            '<table class="table table-striped table-bordered" ' +
                                `style="margin-left: auto; margin-right: auto;" id="${
                                    pref
                                }overview-table"/>`
                        );
                        const overviewLabels = ['KBase ID', 'Name', 'Object ID', 'Source', 'Source ID', 'Type'];
                        const overviewData = [cs.id, cs.name, self.ws_id, cs.source, cs.source_id, cs.type];
                        const overviewTable = $(`#${  pref  }overview-table`);
                        for (let i = 0; i < overviewData.length; i += 1) {
                            // xss safe
                            overviewTable.append(
                                `<tr><td>${  overviewLabels[i]  }</td> ` + `<td>${  overviewData[i]  }</td></tr>`
                            );
                        }

                        ////////////////////////////// Contigs Tab //////////////////////////////
                        // xss safe
                        $(`#${  pref  }contigs`).append(
                            `<table id="${
                                pref
                            }contigs-table" ` +
                                'class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>'
                        );

                        const contigsData = cs.contigs.map((contig) => {
                            return {
                                name: contig.id,
                                length: contig.length
                            };
                        });
                        const contigsSettings = {
                            sPaginationType: 'full_numbers',
                            iDisplayLength: 10,
                            aoColumns: [
                                {sTitle: 'Contig name', mData: 'name'},
                                {sTitle: 'Length', mData: 'length'}
                            ],
                            aaData: contigsData,
                            oLanguage: {
                                sSearch: 'Search contig:',
                                sEmptyTable: 'No contigs found.'
                            }
                        };
                        $(`#${  pref  }contigs-table`).dataTable(contigsSettings);
                    })
                    .catch((err) => {
                        container.empty();
                        container.append($errorAlert(err));
                    });
            };
            ready();
            return this;
        },
        getData() {
            return {
                type: 'NarrativeTempCard',
                id: this.ws_id,
                workspace: this.ws_name,
                title: 'Contig-set'
            };
        },
        loggedInCallback(event, auth) {
            this.token = auth.token;
            //this.render();
            return this;
        },
        loggedOutCallback() {
            this.token = null;
            //this.render();
            return this;
        }
    });
});
