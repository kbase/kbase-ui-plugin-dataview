define([
    'preact',
    'htm',
    'jquery',

    // For effect
    'widgets/genomes/kbaseSEEDFunctions',
], (
    preact,
    htm,
    $
) => {
    const {Component, createRef} = preact;
    const html = htm.bind(preact.h);

    class SEEDFunctions extends Component {
        constructor(props) {
            super(props);
            this.geneTableRef = createRef();
            this.SEEDFunctionsRef = createRef();
        }

        componentDidMount() {
            $(this.SEEDFunctionsRef.current).KBaseSEEDFunctions({
                objNameOrId: this.props.objectInfo.id,
                wsNameOrId: this.props.objectInfo.ws,
                objVer: this.props.objectInfo.version,
                genomeInfo: this.props.genomeObject,
                runtime: this.props.runtime
            });
        }

        render() {
            return html`
                <div ref=${this.SEEDFunctionsRef} />
            `;
        }
    }
    return SEEDFunctions;
});
