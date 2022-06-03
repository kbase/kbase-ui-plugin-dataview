/**
 * KBase widget to display a Metagenome Collection
 */
define([
    'jquery',
    'bluebird',
    'kb_service/client/workspace',
    'kb_common/html',
    'widgets/communities/kbStandaloneHeatmap',
    'lib/jqueryUtils',

    // for effect
    'datatables_bootstrap',
    'kbaseUI/widget/legacy/authenticatedWidget'
], ($, Promise, Workspace, html, Heatmap, {$errorAlert}) => {
    $.KBWidget({
        name: 'AbundanceDataHeatmap',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        token: null,
        options: {
            id: null,
            ws: null,
            rows: 0
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
                        const msg =
                            `[Error] Object ${self.options.id} does not exist in workspace ${self.options.ws}`;
                        // xss safe
                        container.append(`<div><p>${msg}>/p></div>`);
                    } else {
                        const heatdata = data[0].data;
                        // HEATMAP
                        const heatmapId = html.genId();
                        // xss safe
                        container.append(`<div id='outputHeatmap${heatmapId}' style='width: 95%;'></div>`);
                        const heatTest = Heatmap.create({
                            target: $(`#outputHeatmap${heatmapId}`).get(0),
                            data: heatdata
                        });
                        heatTest.render();
                    }
                },
                (error) => {
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
        }
    });
});
