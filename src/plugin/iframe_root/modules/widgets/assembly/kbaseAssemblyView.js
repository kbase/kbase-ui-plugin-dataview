/**
 * Output widget for visualization of assembly reports
 * @author Chris Bun <chrisbun@gmail.com>
 * @public
 */
define([
    'jquery',
    'kb_common/html',
    'kb_service/client/workspace',
    'lib/domUtils',

    // for effect
    'kbaseUI/widget/legacy/authenticatedWidget'
], (
    $,
    html,
    Workspace,
    {domSafeText}
) => {
    $.KBWidget({
        name: 'kbaseAssemblyView',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        ws_id: null,
        ws_name: null,
        token: null,
        job_id: null,
        width: 1150,
        options: {
            ws_id: null,
            ws_name: null,
            job_id: null
        },
        timer: null,
        init(options) {
            this._super(options);
            this.wsUrl = this.runtime.getConfig('services.workspace.url');
            this.ws_name = options.ws_name;
            this.ws_id = options.ws_id;
            if (options.job_id)
                this.job_id = options.job_id;
            if (options.ws && options.id) {
                this.ws_id = options.id;
                this.ws_name = options.ws;
            }
            return this;
        },
        render() {
            const self = this;

            const container = this.$elem;
            if (self.token === null) {
                // xss safe
                container.html('<div>[Error] You\'re not logged in</div>');
                return;
            }

            const kbws = new Workspace(self.wsUrl, {token: self.token});

            const ready = function () {
                container.empty();
                // xss safe
                container.append(html.loading('loading data...'));
                const objname = self.ws_id;
                // commented this out ... can't think of how this ever worked. eap.
                //if (typeof self.ws_id === 'string') {
                //     if (self.ws_id.indexOf('.report') === -1) { //Check if contigset or report
                //        objname = self.ws_id + '.report';
                //     }
                // }
                kbws.get_objects(
                    [{ref: `${self.ws_name  }/${  objname}`}],
                    (data) => {
                        let report_div = '<div class="" style="margin-top:15px">';
                        const report = data[0].data.report;
                        report_div += `<pre><code>${domSafeText(report)}</code></pre><br>`; // code block behaves differently in LP and Narrative, needed to add <pre> block --mike
                        // xss safe
                        container.html(report_div);
                    },
                    (data) => {
                        // xss safe
                        container.html(`<p>[Error] ${domSafeText(data.error.message)}</p>`);
                    }
                );
            };
            ready();
            return this;
        },
        getData() {
            return {
                type: 'NarrativeTempCard',
                id: `${this.ws_name  }.${  this.ws_id}`,
                workspace: this.ws_name,
                title: 'Temp Widget'
            };
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
