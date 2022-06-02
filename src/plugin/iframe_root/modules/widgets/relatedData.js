define([
    'kb_lib/html',
    'collapsiblePanel',
    'kb_lib/jsonRpc/dynamicServiceClient'
], (
    html,
    collapsiblePanel,
    DynamicServiceClient
) => {
    const t = html.tag;
    const iframe = t('iframe');

    class Widget {
        constructor({runtime}) {
            this.runtime = runtime;
            // Both of the props below are assigned in the attach method
            this.hostNode = null;
            this.container = null;
            this.authToken = runtime.service('session').getAuthToken();
            // Not sure how to get the root services endpoint, so getting it from Workspace
            // For narrative-dev and prod, the services endpoint should not have a subdomain

            this.relationEngineURL = runtime.config('services.RelationEngine.url');

            this.narrURL = runtime.config('services.narrative.url');
            window.sketchService = new DynamicServiceClient({
                module: 'sketch_service',
                url: runtime.config('services.service_wizard.url')
                // token: runtime.service('session').getAuthToken()
            });
        }

        dataLayout() {
            // TODO use a dynamic service here
            const src = 'https://kbaseincubator.github.io/object_relations_ui/';
            return iframe({
                src,
                width: '100%',
                height: '600px',
                style: {border: 'none'}
            });
        }

        attach(node) {
            this.hostNode = node;
            this.container = node.appendChild(document.createElement('div'));
        }

        start({workspaceId, objectId, objectVersion}) {
            // In the relation engine, we use ':' as the delimiter
            const upa = [workspaceId, objectId, objectVersion || '1'].join(':');
            // this.container.innerHTML = collapsiblePanel({
            //     title: 'Similar Data',
            //     content: this.dataLayout({ upa }),
            //     icon: 'copy',
            //     collapsed: true
            // });
            // xss safe
            this.container.innerHTML = this.dataLayout();
            const iframeElm = this.container.querySelector('iframe');
            const config = {
                upa,
                authToken: this.authToken,
                rootURL: this.narrURL,
                kbaseEndpoint: this.kbaseEndpoint,
                relEngURL: this.relationEngineURL
            };
            // Get the sketch service URL
            const client = new DynamicServiceClient({
                module: 'sketch_service',
                url: this.runtime.config('services.service_wizard.url')
            });
            // When the iframe content finishes loading, send a post message to it
            iframeElm.addEventListener('load', () => {
                // Call the sketch client lookupModule method, which returns a promise
                client.lookupModule().then((mod) => {
                    config.sketchURL = mod[0].url;
                    iframeElm.contentWindow.postMessage(
                        JSON.stringify({
                            method: 'setConfig',
                            params: {config}
                        }),
                        '*'
                    );
                });
            });
        }

        stop() { }

        detach() {
            // Just in case the widget attach method failed, or was never called...
            if (this.hostNode && this.container) {
                this.hostNode.removeChild(this.container);
            }
        }
    }

    return {
        make(config) {
            return new Widget(config);
        }
    };
});
