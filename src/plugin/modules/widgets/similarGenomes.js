define([
    'kb_common/html',
    'kb_common/jsonRpc/dynamicServiceClient',
    'plugins/dataview/modules/collapsiblePanel',
    'bootstrap'
],
function (
    html,
    collapsiblePanel
) {
    'use strict';

    const t = html.tag,
        iframe = t('iframe');

    class Widget {
        constructor({runtime}) {
            this.runtime = runtime;
            // Both of the props below are assigned in the attach method
            this.hostNode = null;
            this.container = null;
        }

        dataLayout({ upa, objName }) {
            let url = 'https://kbaseincubator.github.io/object_relations_ui/';
            url += '?upa=' + upa;
            url += '&name=' + objName;
            // TODO switch api url on current environment
            url += '&api_url="https://ci.kbase.us/services/relation_engine_api_ci"';
            return iframe({
                src: url,
                width: '100%',
                height: '100%'
            });
        }

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
        }

        start({workspaceId, objectId, objectVersion, objectInfo}) {
            console.log({ workspaceId, objectId, objectVersion, objectInfo })
            const objName = objectInfo.name;
            // In the relation engine, we use ':' as the delimiter
            const upa = [workspaceId, objectId, objectVersion || '1'].join(':');
            // Make an RPC method call to the sketch_service dynamic service
            // This will return a set of similar genomes, rendered by the dataLayout function
            this.container.innerHTML = collapsiblePanel({
                title: 'Similar Data',
                content: this.dataLayout({ upa, objName }),
                icon: 'copy',
                collapsed: false
            })
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
