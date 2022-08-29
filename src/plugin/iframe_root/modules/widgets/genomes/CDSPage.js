define([
    'preact',
    'htm',    
    'components/Genome/CDS/CDS'
], (
    preact,
    htm,
    CDS
) => {
    const html = htm.bind(preact.h);
    class CDSPage {
        constructor(config) {
            this.runtime = config.runtime;
        }

        // LIFECYCLE

        attach(node) {
            this.node = node;
            return null;
        }

        start(params) {
            this.runtime.send('ui', 'setTitle', `Data View for CDS "${params.cdsID}" of Genome "${params.objectInfo.name}"`);
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

    return CDSPage;
});
