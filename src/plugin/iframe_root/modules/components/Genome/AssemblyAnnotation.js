define([
    'preact',
    'htm',
    'jquery',
    'components/Alert',
    './MultiContigBrowser',
    './SEEDFunctions',
    './GeneTable',

    // For effect
    'widgets/genomes/kbaseMultiContigBrowser',
    'widgets/genomes/kbaseSEEDFunctions',
    'widgets/genomes/kbaseGenomeGeneTable',
    'css!./AssemblyAnnotation.css',
    'css!./common.css'
], (
    preact,
    htm,
    $,
    Alert,
    MultiContigBrowser,
    SEEDFunctions,
    GeneTable
) => {
    const {Component, createRef} = preact;
    const html = htm.bind(preact.h);

    class AssemblyAnnotation extends Component {
        constructor(props) {
            super(props);
            this.geneTableRef = createRef();
            this.SEEDFunctionsRef = createRef();
        }

        renderContigBrowser() {
            return html`
                <${MultiContigBrowser} ...${this.props} />
            `;
        }

        renderSEEDFunctions() {
            return html`<${SEEDFunctions} ...${this.props} />`;
        }

        renderGeneTable() {
            return html`<${GeneTable} ...${this.props} />`;
        }

        render() {
            return html`
                <div className="container-fluid Genome AssemblyAnnotation" style=${{width: '100%'}}>
                    <div className="row">
                        <div className="col-md-12">
                            <h4>Contig Browser</h4>
                            ${this.renderContigBrowser()}
                        </div>
                    </div>
                     <div className="row">
                        <div className="col-md-6">
                            <h4>SEED Functions</h4>
                            ${this.renderSEEDFunctions()}
                        </div>
                        <div className="col-md-6">
                            <h4>Gene Table</h4>
                            ${this.renderGeneTable()}
                        </div>
                    </div>
                </div>
            `;
        }
    }
    return AssemblyAnnotation;
});
