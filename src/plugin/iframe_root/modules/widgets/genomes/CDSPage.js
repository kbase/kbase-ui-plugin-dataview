define([
    'preact',
    'htm',    
    'components/Genome/CDS'
], (
    preact,
    htm,
    CDS
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
            preact.render(html`<${CDS} cdsId=${params.cdsID} objectInfo=${params.objectInfo} runtime=${this.runtime}/>`, this.node);
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
