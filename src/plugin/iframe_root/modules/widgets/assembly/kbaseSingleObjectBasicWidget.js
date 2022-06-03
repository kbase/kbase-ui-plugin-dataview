/**
 * Abstract class to provide basid visualization for a single object.
 *
 * getDataModel function needs to be implemeted in the descendents of this class
 *
 * Pavel Novichkov <psnovichkov@lbl.gov>
 * @public
 */
define([
    'jquery',
    'kb_service/client/workspace',
    'kb_common/html',
    'lib/domUtils',

    // For effect
    'kbaseUI/widget/legacy/authenticatedWidget'
], (
    $,
    Workspace,
    html,
    {domSafeText}
) => {
    $.KBWidget({
        name: 'kbaseSingleObjectBasicWidget',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.1',
        options: {
            objId: null,
            workspaceId: null,
            objVer: null
        },
        init(options) {
            this._super(options);

            this.options.landingPageURL = '/#dataview/';
            this.workspaceURL = this.runtime.getConfig('services.workspace.url');

            this.$errorPane = $('<div>')
                .addClass('alert alert-danger')
                .hide();
            // xss safe
            this.$elem.append(this.$errorPane);

            this.$messagePane = $('<div>');
            // xss safe
            this.$elem.append(this.$messagePane);

            this.$mainPane = $('<div>');
            // xss safe
            this.$elem.append(this.$mainPane);

            return this;
        },
        loggedInCallback(event, auth) {
            // Cretae a new workspace client
            this.ws = new Workspace(this.workspaceURL, auth);

            // Let's go...
            this.render();

            return this;
        },
        loggedOutCallback() {
            this.ws = null;
            this.isLoggedIn = false;
            return this;
        },
        render() {
            const self = this;
            self.loading(true);

            // Get object
            const identityObj = self.buildObjectIdentity(
                self.options.workspaceId,
                self.options.objId,
                self.options.objVer
            );
            this.ws.get_objects(
                [identityObj],
                (d) => {
                    self.loading(false);
                    self.buildWidgetContent(d[0].data);
                },
                (error) => {
                    self.loading(false);
                    self.showError(error);
                }
            );
        },
        buildWidgetContent(objData) {
            const $container = this.$mainPane;
            const dataModel = this.getDataModel(objData);

            $container.append(domSafeText(dataModel.description));

            // Build a table
            const $table = $('<table class="table table-striped table-bordered" />')
                .css('width', '100%')
                .css('margin', ' 1em 0 0 0');
            // xss safe
            $container.append($table);

            for (let i = 0; i < dataModel.items.length; i++) {
                const item = dataModel.items[i];
                if (item.header) {
                    // xss safe
                    $table.append(this.makeHeaderRow(item.name, item.value));
                } else {
                    // xss safe
                    $table.append(this.makeRow(item.name, item.value));
                }
            }
        },
        getDataModel(objData) {
            // Example of the data model
            return {
                description: `Example description for the object: ${  JSON.stringify(objData)}`,
                items: [
                    {name: 'name1', value: 'value1'},
                    {name: 'name2', value: 'value2'},
                    {header: '1', name: 'Group title 2'},
                    {name: 'name2.1', value: 'value2.1'},
                    {name: 'name2.2', value: 'value2.2'}
                ]
            };
        },
        makeHeaderRow(name) {
            // xss safe
            return $('<tr>').html(
                $('<td colspan=\'2\'/>')
                    // xss safe
                    .html($('<b/>').text(name))
            );
        },
        makeRow(name, value) {
            return $('<tr>')
                // xss safe
                .append(
                    $('<th>')
                        .css('width', '20%')
                        .text(name)
                )
                // xss safe
                .append($('<td>').text(value));
        },
        /*
         getData: function() {
         return {
         type: 'AssemblyInput',
         id: this.options.objId,
         workspace: this.options.workspaceId,
         title: 'Domain Annotation'
         };
         },
         */
        loading(isLoading) {
            if (isLoading) this.showMessage(html.loading());
            else this.hideMessage();
        },
        showMessage(message) {
            // xss safe
            this.$messagePane.append($('<span>').html(message));
            this.$messagePane.show();
        },
        hideMessage() {
            this.$messagePane.hide();
            this.$messagePane.empty();
        },
        buildObjectIdentity(workspaceID, objectID, objectVer, wsRef) {
            const obj = {};
            if (wsRef) {
                obj['ref'] = wsRef;
            } else {
                if (/^\d+$/.exec(workspaceID)) obj['wsid'] = workspaceID;
                else obj['workspace'] = workspaceID;

                // same for the id
                if (/^\d+$/.exec(objectID)) obj['objid'] = objectID;
                else obj['name'] = objectID;

                if (objectVer) obj['ver'] = objectVer;
            }
            return obj;
        },
        showError(error) {
            this.$errorPane.empty();
            // xss safe
            this.$errorPane.append('<strong>Error when retrieving data.</strong><br><br>');
            this.$errorPane.append(domSafeText(error.error.message));
            // xss safe
            this.$errorPane.append('<br>');
            this.$errorPane.show();
        }
    });
});
