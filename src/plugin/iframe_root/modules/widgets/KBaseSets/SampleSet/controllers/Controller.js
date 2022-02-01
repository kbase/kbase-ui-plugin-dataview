define([
    'preact',
    'htm',
    'components/AsyncLoader'
], (
    {h},
    htm,
    AsyncLoader
) => {
    const html = htm.bind(h);
    class Controller {
        constructor({runtime, model, loadingMessage, inlineLoading}) {
            this.runtime = runtime;
            this.model = model;
            this.loadingMessage = loadingMessage;
            this.inlineLoading = inlineLoading;
        }

        render(component, loader, componentKey) {
            const key = (() => {
                if (componentKey) {
                    return componentKey;
                }
                return Date.now();
            })();
            return html`
                <${AsyncLoader} 
                    component=${component} 
                    loader=${loader} 
                    inlineLoading=${!!this.inlineLoading}
                    key=${key} 
                    message=${this.loadingMessage || 'Loading data...'} />
            `;
        }

    }

    return Controller;
});
