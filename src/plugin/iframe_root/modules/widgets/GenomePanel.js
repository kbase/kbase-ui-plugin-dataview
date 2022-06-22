define([
    'preact',
    'htm',
    'components/Genome/Loader'
], (
    preact,
    htm,
    Loader
) => {
    const html = htm.bind(preact.h);
    class Viewer {
        constructor(config) {
            this.runtime = config.runtime;
        }

        // LIFECYCLE

        attach(node) {
            this.node = node;
            return null;
        }

        start(params) {
            // console.log('params', params);
            preact.render(html`<${Loader} objectInfo=${params.objectInfo} runtime=${this.runtime} />`, this.node);
            return null;
        }

        stop() {
            return null;
        }

        detach() {
            // xss safe
            this.node.innerHTML = '';
            return null;
        }
    }

    return Viewer;
});
