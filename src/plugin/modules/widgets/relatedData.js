define([
    'kb_common/html',
    'plugins/dataview/modules/collapsiblePanel',
    'bootstrap'
],
function (
    html,
    collapsiblePanel
) {
    'use strict';

    const t = html.tag;
    const iframe = t('iframe');

    class Widget {
        constructor({runtime}) {
            this.runtime = runtime;
            // Both of the props below are assigned in the attach method
            this.hostNode = null;
            this.container = null;
            this.authToken = this.runtime.service('session').getAuthToken();
            const config = this.runtime.rawConfig();
            // Not sure how to get the root services endpoint, so getting it from Workspace
            this.kbaseEndpoint = config.services.Workspace.url.replace(/ws$/, '');
            this.narrURL = config.services.narrative.url;
        }

        dataLayout({ upa }) {
            // TODO use a dynamic service here
            const src = 'https://kbaseincubator.github.io/object_relations_ui/';
            return iframe({
                src: src,
                width: '100%',
                height: '600px',
                style: { border: 'none' }
            });
        }

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
        }

        start({workspaceId, objectId, objectVersion, objectInfo}) {
            // In the relation engine, we use ':' as the delimiter
            const upa = [workspaceId, objectId, objectVersion || '1'].join(':');
            this.container.innerHTML = collapsiblePanel({
                title: 'Similar Data',
                content: this.dataLayout({ upa }),
                icon: 'copy',
                collapsed: false
            });
            const iframeElm = this.container.querySelector('iframe');
            const config = {
                upa,
                authToken: this.authToken,
                rootURL: this.narrURL,
                kbaseEndpoint: this.kbaseEndpoint,
                relEngURL: this.kbaseEndpoint + '/relation_engine_api'
            };
            // When the iframe content finishes loading, send a post message to it
            iframeElm.addEventListener('load', () => {
                iframeElm.contentWindow.postMessage(JSON.stringify({
                    method: 'setConfig',
                    params: { config }
                }), '*');
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
