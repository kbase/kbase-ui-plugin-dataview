define([
    'preact',
    'htm',    
    'components/Genome/Feature/Feature'
], (
    preact,
    htm,
    Feature
) => {
    const html = htm.bind(preact.h);
    class FeaturePage {
        constructor(config) {
            this.runtime = config.runtime;
        }

        // LIFECYCLE

        attach(node) {
            this.node = node;
            return null;
        }

        start(params) {
            this.runtime.send('ui', 'setTitle', `Data View for feature "${params.featureID}" of genome "${params.objectInfo.name}"`);
            preact.render(html`<${Feature} featureId=${params.featureID} objectInfo=${params.objectInfo} runtime=${this.runtime}/>`, this.node);
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

    return FeaturePage;
});
