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
        constructor({runtime, model, loadingMessage}) {
            this.runtime = runtime;
            this.model = model;
            this.loadingMessage = loadingMessage;
        }

        render(component, loader) {
            return html`
                <div className="FlexCol" style=${{marginTop: '10px'}}>
                    <${AsyncLoader} component=${component} loader=${loader} key=${Date.now()} message=${this.loadingMessage || 'Loading data...'} />
                </div>
            `;
        }

    }

    return Controller;
});
