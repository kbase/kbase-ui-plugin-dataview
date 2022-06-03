/**
 * KBase widget to display table and boxplot of BIOM data
 */
define([
    'jquery',
    'kb_common/html',
    'kb_service/client/workspace',
    'lib/domUtils',
    'lib/jqueryUtils',

    // For effect
    'kbaseUI/widget/legacy/authenticatedWidget',
    'datatables_bootstrap'
], (
    $,
    html,
    Workspace,
    {domSafeText, domSafeValue},
    {$errorAlert}) => {
    $.KBWidget({
        name: 'AnnotationSetTable',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {
            id: null,
            ws: null
        },
        init(options) {
            this._super(options);
            return this;
        },
        render() {
            const self = this;
            const container = this.$elem;
            container.empty();
            if (!this.runtime.service('session').isLoggedIn()) {
                // xss safe
                container.append('<div>[Error] You\'re not logged in</div>');
                return;
            }
            // xss safe
            container.append(html.loading('loading data...'));

            const kbws = new Workspace(this.runtime.getConfig('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });
            kbws.get_objects(
                [{ref: `${self.options.ws  }/${  self.options.id}`}],
                (data) => {
                    container.empty();
                    // parse data
                    if (data.length === 0) {
                        //var msg = "[Error] Object "+self.options.id+" does not exist in workspace "+self.options.ws;

                        // We are moving away from "workspace"
                        const msg = `[Error] Object ${self.options.id} can not be found`;
                        // xss safe
                        container.append(`<div><p>${domSafeText(msg)}>/p></div>`);
                    } else {
                        const otus = data[0].data.otus;
                        const rows = [];
                        let o,
                            funcs,
                            f;
                        for (o = 0; o < otus.length; o += 1) {
                            funcs = otus[o].functions;
                            for (f = 0; f < funcs.length; f += 1) {
                                rows.push([
                                    funcs[f].reference_genes.map((value) => {return domSafeValue(value);}).join('<br>'),
                                    domSafeValue(funcs[f].functional_role),
                                    domSafeValue(funcs[f].abundance),
                                    domSafeValue(funcs[f].confidence),
                                    domSafeText(otus[o].name)
                                ]);
                            }
                        }

                        // container.append('<div id="annotationTable' + tableId + '" style="width: 95%;"></div>');
                        const options = {
                            columns: ['features', 'functional role', 'abundance', 'avg e-value', 'otu'],
                            rows,
                            class: 'table table-striped'
                        };
                        const table = html.makeTable(options);
                        // xss safe useage of html(), as determined by the table created above
                        container.html(table);
                        $(`#${options.generated.id}`).dataTable();
                    }
                },
                (error) => {
                    container.html($errorAlert(error));
                }
            );
            return self;
        },
        loggedInCallback() {
            this.render();
            return this;
        },
        loggedOutCallback() {
            this.render();
            return this;
        }
    });
});
