define([
    'preact',
    'htm',
    './view',
    'kb_service/utils',
    'components/Loading2',
    'lib/Model',

    'bootstrap'
], (
    preact,
    htm,
    View,
    APIUtils,
    Loading,
    Model
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    class Overview extends Component {
        constructor(props) {
            super(props);
            this.state = {
                status: 'none',
                data: null,
                error: null
            };

            this.model = new Model({
                workspaceURL: this.props.runtime.config('services.Workspace.url'),
                authToken: this.props.runtime.service('session').getAuthToken()
            });
        }

        async componentDidMount() {
            this.loadData();
        }

        async loadData() {
            this.setState({
                status: 'loading'
            });
            try {
                const data = await this.fetchData();
                this.setState({
                    status: 'success',
                    data
                });
            } catch (err) {
                console.error('Error fetching workspace object', err);
                if (err.status && err.status === 500) {
                    // User probably doesn't have access -- but in any case we can just tell them
                    // that they don't have access.
                    if (err.error.error.match(/^us.kbase.workspace.database.exceptions.NoSuchObjectException:/)) {
                        // state.set('status', 'notfound');
                        this.setState({
                            status: 'error',
                            error: {
                                type: 'client',
                                code: 'notfound',
                                shortMessage: 'This object does not exist',
                                originalMessage: err.error.message
                            }
                        });
                    } else if (
                        err.error.error.match(
                            /^us.kbase.workspace.database.exceptions.InaccessibleObjectException:/
                        )
                    ) {
                        // state.set('status', 'denied');
                        this.setState({
                            status: 'error',
                            error: {
                                type: 'client',
                                code: 'denied',
                                shortMessage: 'You do not have access to this object',
                                originalMessage: err.error.message
                            }
                        });
                    } else {
                        this.setState({
                            status: 'error',
                            error: {
                                type: 'client',
                                code: 'error',
                                shortMessage: 'An unknown error occurred',
                                originalMessage: err.error.message
                            }
                        });
                    }
                } else {
                    this.setState({
                        status: 'error',
                        error: {
                            type: 'general',
                            code: 'error',
                            shortMessage: 'An unknown error occurred'
                        }
                    });
                }
            }
        }

        async fetchData() {
            const ref = APIUtils.makeWorkspaceObjectRef(
                this.props.workspaceId,
                this.props.objectId,
                this.props.objectVersion
            );

            const [
                objectInfo,
                workspaceInfo,
                versions,
                [too_many_inc_refs, inc_references],
                [too_many_out_refs,out_references],
                writableNarratives
            ] = await Promise.all([
                this.model.getObjectInfo(ref),
                this.model.getWorkspaceInfo(this.props.workspaceId),
                this.model.getObjectHistory(ref),
                this.model.getIncomingReferences(ref),
                this.model.getOutgoingReferences(ref),
                this.model.getWritableNarratives(this.props.workspaceId)
            ]);

            return {
                objectInfo, workspaceInfo, versions,
                too_many_inc_refs, inc_references,
                too_many_out_refs, out_references,
                writableNarratives
            };

        }

        renderNone() {
            return html`
                <div className="alert alert-info">
                    Initializing ... <span className="fa fa-spinner fa-pulse fa-fw"></span>
                </div>
            `;
        }

        renderLoading() {
            return html`
               <${Loading} type="neutral" message="Loading object info" />
            `;
        }

        renderSuccess() {
            return html`
                <${View} ...${this.state.data} runtime=${this.props.runtime}/>
            `;
        }

        renderError() {
            return html`
                <div className="alert alert-danger">
                    ${this.state.error.message}
                </div>
            `;
        }

        render() {
            switch (this.state.status) {
            case 'none':
                return this.renderNone();
            case 'loading':
                return this.renderLoading();
            case 'success':
                return this.renderSuccess();
            case 'error':
                return this.renderError();
            }
        }
    }

    return Overview;
});
