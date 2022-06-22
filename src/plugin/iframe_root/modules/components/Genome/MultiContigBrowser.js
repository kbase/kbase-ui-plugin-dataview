define([
    'preact',
    'htm',
    'jquery',

    // For effect
    'widgets/genomes/kbaseMultiContigBrowser',
], (
    preact,
    htm,
    $
) => {
    const {Component, createRef} = preact;
    const html = htm.bind(preact.h);

    class MultiContigBrowser extends Component {
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
        }

        render() {
            return html`
                <div ref=${this.contigBrowserRef} />
            `;
        }
    }
    return MultiContigBrowser;
});
