define([
    'preact',
    'htm',
    'jquery',
    'uuid',

    // For effect
    'widgets/trees/kbaseTree'
], (
    preact,
    htm,
    $,
    Uuid
) => {
    const {Component, createRef} = preact;
    const html = htm.bind(preact.h);

    class Tree extends Component {
        constructor(props) {
            super(props);
            this.treeRef = createRef();
        }

        componentDidMount() {
            $(this.treeRef.current).kbaseTree({
                treeID: this.props.objectID,
                workspaceID: this.props.workspaceID,
                genomeInfo: this.props.genomeObject,
                runtime: this.props.runtime
            });
        }

        render() {
            return html`
                <div ref=${this.treeRef} key=${new Uuid(4).format()}/>
            `;
        }
    }
    return Tree;
});
