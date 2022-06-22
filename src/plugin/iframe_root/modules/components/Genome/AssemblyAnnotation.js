define([
    'preact',
    'htm',
    'jquery',

    // For effect
    'widgets/genomes/kbaseMultiContigBrowser',
    'widgets/genomes/kbaseSEEDFunctions',
    'widgets/genomes/kbaseGenomeGeneTable',
    'css!./AssemblyAnnotation.css',
    'css!./common.css'
], (
    preact,
    htm,
    $
) => {
    const {Component, createRef} = preact;
    const html = htm.bind(preact.h);

    class AssemblyAnnotation extends Component {
        constructor(props) {
            super(props);
            this.contigBrowserRef = createRef();
            this.geneTableRef = createRef();
            this.SEEDFunctionsRef = createRef();
        }

        componentDidMount() {
            $(this.contigBrowserRef.current).KBaseMultiContigBrowser({
                genomeID: this.props.objectInfo.id,
                workspaceID: this.props.objectInfo.wsid,
                ver: this.props.objectInfo.version,
                genomeInfo: this.props.genomeObject,
                runtime: this.props.runtime
            });

            $(this.SEEDFunctionsRef.current).KBaseSEEDFunctions({
                objNameOrId: this.props.objectInfo.id,
                wsNameOrId: this.props.objectInfo.ws,
                objVer: this.props.objectInfo.version,
                genomeInfo: this.props.genomeObject,
                runtime: this.props.runtime
            });

            $(this.geneTableRef.current).KBaseGenomeGeneTable({
                genome_id: this.props.objectInfo.id,
                ws_name: this.props.objectInfo.ws,
                ver: this.props.objectInfo.version,
                genomeInfo: this.props.genomeObject,
                runtime: this.props.runtime
            });
        }

        render() {
            return html`
                <div className="container-fluid Genome AssemblyAnnotation" style=${{width: '100%'}}>
                    <div className="row">
                        <div className="col-md-12">
                            <h4>Contig Browser</h4>
                            <div ref=${this.contigBrowserRef} />
                        </div>
                    </div>
                     <div className="row">
                        <div className="col-md-6">
                            <h4>SEED Functions</h4>
                            <div ref=${this.SEEDFunctionsRef} />
                        </div>
                        <div className="col-md-6">
                            <h4>Gene Table</h4>
                            <div ref=${this.geneTableRef} />
                        </div>
                    </div>
                </div>
            `;
        }
    }
    return AssemblyAnnotation;
});
