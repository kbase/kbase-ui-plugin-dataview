define([
    'preact',
    'htm',
    './view',
    'kb_lib/jsonRpc/genericClient',
    'kb_service/utils',

    'bootstrap'
], function (
    preact,
    htm,
    View,
    GenericClient,
    APIUtils
) {
    'use strict';

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
        }

        async componentDidMount() {
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

        async fetchObjectInfos(wsClient, refs) {
            if (refs.length === 0) {
                return [];
            }
            const [result] = await wsClient.callFunc('get_object_info3', [{
                objects: refs.map((ref) => { return {ref};}),
                ignoreErrors: 1,
                includeMetadata: 1
            }]);

            return result.infos.filter((info) => {
                return info;
            })
                .map((info) => {
                    return APIUtils.objectInfoToObject(info);
                });

        }

        async fetchData() {
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });

            const ref = APIUtils.makeWorkspaceObjectRef(
                this.props.workspaceId,
                this.props.objectId,
                this.props.objectVersion
            );

            const  [
                objectInfo,
                workspaceInfo,
            ] = await Promise.all([
                wsClient.callFunc('get_object_info3', [{
                    objects: [{ ref}],
                    includeMetadata: 1
                }]).then(([result]) => {
                    return APIUtils.objectInfoToObject(result.infos[0]);
                }),
                wsClient.callFunc('get_workspace_info', [{
                    id: this.props.workspaceId
                }]).then(([result]) => {
                    return APIUtils.workspaceInfoToObject(result);
                })
            ]);

            return {
                objectInfo, workspaceInfo
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
            <div className="well">
            Loading ... <span className="fa fa-spinner fa-pulse fa-fw"></span>
            </div>
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
