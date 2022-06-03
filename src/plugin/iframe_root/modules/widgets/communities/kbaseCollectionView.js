/**
 * KBase widget to display a Metagenome Collection
 */
define([
    'jquery',
    'kb_service/client/workspace',
    'kb_common/html',
    'lib/domUtils',
    // for effect
    'datatables_bootstrap',
    'kbaseUI/widget/legacy/authenticatedWidget'
], ($, Workspace, html, {domSafeText}) => {
    $.KBWidget({
        name: 'CollectionView',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {
            id: null,
            ws: null
        },
        init(options) {
            const div = html.tag('div'),
                titleId = html.genId(),
                bodyId = html.genId();
            this._super(options);
            // xss safe
            this.$elem.html(
                html.makePanel({
                    title: div({id: titleId}),
                    content: div({id: bodyId})
                })
            );
            this.$title = $(`#${  titleId}`);
            this.$body = $(`#${  bodyId}`);
            return this;
        },
        showError(error) {
            let message;
            try {
                if (typeof error === 'string') {
                    message = error;
                } else if (error.error) {
                    message = error.error.message;
                } else if (error.message) {
                    message = error.message;
                } else {
                    message = `Unknown error: ${error}`;
                }
            } catch (ex) {
                message = `Unknown error processing another error: ${ex.message}`;
            }
            // xss safe
            this.$title.text('Error');
            // xss safe
            this.$body.text(message);
            console.error('ERROR in kbaseCollectionView.js');
            console.error(error);
        },
        render() {
            const self = this;
            if (!this.runtime.service('session').getAuthToken()) {
                this.showError('You are not logged in');
                return;
            }
            // xss safe
            this.$title.text('Metagenome Collection');
            // xss safe
            this.$body.html(html.loading('loading data...'));

            const workspace = new Workspace(this.runtime.config('services.workspace.url'), {token: this.token});
            let title;
            workspace
                .get_objects([{ref: `${self.options.ws  }/${  self.options.id}`}])
                .then((data) => {
                    if (data.length === 0) {
                        throw new Error(
                            `Object ${  self.options.id  } does not exist in workspace ${  self.options.ws}`
                        );
                    }
                    /* TODO: resolve this issue
                     * Some objects have an "actual" URL - surprise! */
                    const collectionObject = data[0].data,
                        idList = collectionObject.members.map((member) => {
                            if (member.URL.match(/^http/)) {
                                console.error(member);
                                throw new Error('Invalid Collection Object');
                            }
                            return {ref: member.URL};
                        });
                    title = collectionObject.name;
                    if (idList.length > 0) {
                        return workspace.get_objects(idList);
                    }
                    throw new Error('Collection is empty');
                })
                .then((resData) => {
                    const rows = resData.map((item) => {
                            return [
                                item.data.id,
                                item.data.name,
                                item.data.mixs.project_name,
                                item.data.mixs.PI_lastname,
                                item.data.mixs.biome,
                                item.data.mixs.sequence_type,
                                item.data.mixs.seq_method,
                                item.data.statistics.sequence_stats.bp_count_raw,
                                item.data.created
                            ].map((value) => {return domSafeText(value);});
                        }),
                        options = {
                            columns: [
                                'ID',
                                'Name',
                                'Project',
                                'PI',
                                'Biome',
                                'Sequence Type',
                                'Sequencing Method',
                                'bp Count',
                                'Created'
                            ],
                            rows,
                            classes: ['table', 'table-striped']
                        },
                        table = html.makeTable(options);
                    // xss safe
                    self.$title.text(`Metagenome Collection ${title}`);
                    // xss safe
                    self.$body.html(table);
                    $(`#${options.generated.id}`).dataTable();
                })
                .catch((err) => {
                    self.showError(err);
                });
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
