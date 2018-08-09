define([
    'kb_common/html',
    'kb_common/jsonRpc/dynamicServiceClient',
    'bootstrap'
],
function (
    html,
    DynamicServiceClient
) {
    'use strict';

    const t = html.tag,
        div = t('div'),
        p = t('p'),
        table = t('table'),
        thead = t('thead'),
        tr = t('tr'),
        th = t('th'),
        tbody = t('tbody'),
        td = t('td');

    class Widget {
        constructor({runtime}) {
            this.runtime = runtime;
            // Both of the props below are assigned in the attach method
            this.hostNode = null;
            this.container = null;
        }

        dataLayout({distances}) {
            return div(
                table({class: 'table'}, [
                    thead(
                        tr([
                            th('Distance'),
                            th('Scientific name'),
                            th('Database name'),
                            th('Database ID')
                        ])
                    ),
                    tbody(distances.map((each) => {
                        return tr([
                            td([String(each.dist)]),
                            td([each.sciname]),
                            td([each.namespaceid]),
                            td([each.sourceid])
                        ]);
                    }))
                ])
            );
        }

        loadingLayout() {
            return div(p(html.loading('Finding similar genomes')));
        }

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
            this.container.innerHTML = this.loadingLayout();
        }

        start({workspaceId, objectId, objectVersion}) {
            const workspaceRef = [workspaceId, objectId, objectVersion || '1'].join('/');
            const sketchClient = new DynamicServiceClient({
                url: this.runtime.config('services.service_wizard.url'),
                token: this.runtime.service('session').getAuthToken(),
                module: 'sketch_service'
            });
            // Make an RPC method call to the sketch_service dynamic service
            // This will return a set of similar genomes, rendered by the dataLayout function
            sketchClient.callFunc('get_homologs', [workspaceRef])
                .then((data) => {
                    this.container.innerHTML = this.dataLayout(data);
                })
                .catch((err) => {
                    this.container.innerHTML = div({
                        class: 'alert alert-danger'
                    }, err.message);
                });
        }

        stop() {}

        detach() {
            // Just in case the widget attach method failed, or was never called...
            if (this.hostNode && this.container) {
                this.hostNode.removeChild(this.container);
            }
        }
    }

    return {
        make: function (config) {
            return new Widget(config);
        }
    };
});
