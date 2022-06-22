define([
    'preact',
    'htm',
    'uuid',
    'kb_common/jsonRpc/genericClient',
    'components/Loading',
    'components/Empty',
    './Tree'
], (
    preact,
    htm,
    Uuid,
    GenericClient,
    Loading,
    Empty,
    Tree
) => {
    const {Component, createRef} = preact;
    const html = htm.bind(preact.h);

    class SpeciesTree extends Component {
        constructor(props) {
            super(props);
            this.treeViewRef = createRef();
            this.state = {
                status: 'NONE'
            };
        }

        componentDidMount() {
            this.loadData();
        }

        async fetchTrees() {
            const workspace = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.getConfig('services.workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });
            const objectIdentity = {
                ref: `${this.props.objectInfo.wsid}/${this.props.objectInfo.id}`
            };
            const [data] = await workspace.callFunc('list_referencing_objects', [[objectIdentity]]);
            return data[0]
                .filter((referencingObject) => {
                    const type = referencingObject[2].split('-')[0];
                    return type === 'KBaseTrees.Tree';
                })
                .map((referencingTree) => {
                    return {
                        wsid: referencingTree[6],
                        id: referencingTree[0],
                        name: referencingTree[1]
                    };
                });
        }

        async loadData() {
            this.setState({
                status: 'PENDING'
            });

            try {
                const trees = await this.fetchTrees();
                if (trees.length === 0) {
                    this.setState({
                        status: 'SUCCESS',
                        value: {
                            trees: null
                        }
                    });
                    return;
                }
                this.setState({
                    status: 'SUCCESS',
                    value: {
                        trees,
                        selectedTree: 0
                    }
                });
            } catch (ex) {
                console.error(ex);
                this.setState({
                    status: 'ERROR',
                    error: {
                        message: ex.message
                    }
                });
            }
        }

        renderNotFound() {
            return html`
                <${Empty} message="A species tree could not be found for this genome." />
            `;
        }

        renderSelectedTree() {
            const tree = this.state.value.trees[this.state.value.selectedTree];
            if (!tree) {
                return html`
                    <${Empty} message="Tree not available" />
                `;
            }
            return html`
                <${Tree} objectID=${tree.id} 
                        key=${new Uuid(4).format()}
                        workspaceID=${tree.wsid} 
                        genomeObject=${this.props.genomeObject} 
                        runtime=${this.props.runtime} />
            `;
        }

        previousTree() {
            const selected = this.state.value.selectedTree;
            if (selected === 0) {
                return;
            }
            this.setState({
                ...this.state,
                value: {
                    ...this.state.value,
                    selectedTree: selected - 1
                }
            });
        }

        nextTree() {
            const selected = this.state.value.selectedTree;
            if (selected === this.state.value.trees.length -1) {
                return;
            }
            this.setState({
                ...this.state,
                value: {
                    ...this.state.value,
                    selectedTree: selected + 1
                }
            });
        }

        renderTreeControls() {
            const trees = this.state.value.trees;
            return html`
                <div>
                    <p>
                        ${trees.length} tree${trees.length !== 1 ? 's' : ''} found for this genome.
                    </p>
                    <div className="xbtn-toolbar" style=${{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <button className="btn btn-default" 
                            title=${this.state.value.selectedTree === 0 ? 'No previous trees' : 'View the previous tree'}
                            onClick=${this.previousTree.bind(this)} 
                            disabled=${this.state.value.selectedTree === 0}>
                            <span className="fa fa-chevron-left" />
                        </button>
                        <button className="btn btn-default" 
                            title=${this.state.value.selectedTree ===  this.state.value.trees.length - 1 ? 'No further trees' : 'View the next tree'}
                            onClick=${this.nextTree.bind(this)} 
                            disabled=${this.state.value.selectedTree === this.state.value.trees.length - 1}>
                             <span className="fa fa-chevron-right" />
                        </button> 
                        ${' '}
                        <div className="btn-text">
                            Showing tree ${this.state.value.selectedTree + 1} of ${this.state.value.trees.length}.
                        </div>
                    </div>
                </div>
            `;
        }

        renderSuccess() {
            if (!this.state.value.trees) {
                return this.renderNotFound();
            }
            return html`
                <div>
                    <div>
                        ${this.renderTreeControls()}
                    </div>
                    <div>
                        ${this.renderSelectedTree()}
                    </div>
                </div>
            `;
        }

        renderLoading() {
            return html`
                <${Loading} message="Loading species tree..." />
            `;
        }

        renderError(error) {
            return html`
                <div className="alert alert-danger">
                    ${error.message}
                </div>
            `;
        }

        render() {
            switch (this.state.status) {
            case 'NONE':
            case 'PENDING':
                return this.renderLoading();
            case 'ERROR':
                return this.renderError(this.state.error);
            case 'SUCCESS':
                return this.renderSuccess(this.state.value);
            }

        }
    }
    return SpeciesTree;
});
