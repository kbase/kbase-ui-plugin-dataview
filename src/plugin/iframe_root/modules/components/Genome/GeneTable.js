define([
    'preact',
    'htm',
    'jquery',

    // For effect
    'widgets/genomes/kbaseGenomeGeneTable'
], (
    preact,
    htm,
    $
) => {
    const {Component, createRef} = preact;
    const html = htm.bind(preact.h);

    class GeneTable extends Component {
        constructor(props) {
            super(props);
            this.geneTableRef = createRef();
        }

        componentDidMount() {
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
                <div ref=${this.geneTableRef} />
            `;
        }
    }
    return GeneTable;
});
