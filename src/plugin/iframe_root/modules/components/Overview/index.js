define([
    'preact',
    'htm',
    './view',
    'kb_lib/jsonRpc/genericClient',
    'kb_service/utils',
    'components/Loading2',

    'bootstrap'
], (
    preact,
    htm,
    View,
    GenericClient,
    APIUtils,
    Loading
) => {


    const {Component} = preact;
    const html = htm.bind(preact.h);

    const MAX_OUTGOING_REFS = 100;
    const MAX_INCOMING_REFS = 100;

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

        async fetchObjectHistory(wsClient, ref) {
            const [result] = await wsClient.callFunc('get_object_history', [{
                ref
            }]);

            return result.map((version) => {
                return APIUtils.objectInfoToObject(version);
            })
                .sort((a, b) => {
                    return a.version - b.version;
                });
        }

        async fetchIncomingReferences(wsClient, ref) {
            const counts = await wsClient.callFunc('list_referencing_object_counts', [[{
                ref
            }]]);
            if (counts[0] > MAX_INCOMING_REFS) {
                return [true, null];
            }
            const [result] = await wsClient.callFunc('list_referencing_objects', [[{ref}]]);
            const references = result[0].map((reference) => {
                return APIUtils.objectInfoToObject(reference);
            })
                .sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });

            return [false, references];
        }

        async fetchOutgoingReferences(wsClient, ref) {
            const [[result]] = await wsClient.callFunc('get_object_provenance', [[{ref}]]);
            const objectRefs = result.provenance.reduce((objectRefs, reference) => {
                reference.resolved_ws_objects.forEach((ref) => {
                    objectRefs.push(ref);
                });
                return objectRefs;
            }, result.refs);

            if (objectRefs.length > MAX_OUTGOING_REFS) {
                return [true, null];
            }

            const objectInfos = (await this.fetchObjectInfos(wsClient, objectRefs))
                .sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });


            return [false, objectInfos];
        }

        async fetchObjectInfos(wsClient, refs) {
            if (refs.length === 0) {
                return [];
            }
            const [result] = await wsClient.callFunc('get_object_info3', [{
                objects: refs.map((ref) => {
                    return {ref};
                }),
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

        async fetchWritableNarratives(wsClient) {
            const [workspaceInfos] = await wsClient.callFunc('list_workspace_info', [{
                perm: 'w'
            }]);
            return workspaceInfos.map((workspaceInfo) => {
                return APIUtils.workspaceInfoToObject(workspaceInfo);
            })
                .filter((workspaceInfo) => {
                    return (workspaceInfo.metadata.narrative &&
                        !isNaN(parseInt(workspaceInfo.metadata.narrative, 10)) &&
                        workspaceInfo.id !== this.props.workspaceId &&
                        workspaceInfo.metadata.narrative_nice_nice &&
                        workspaceInfo.metadata.is_temporary &&
                        workspaceInfo.metadata.is_temporary !== 'true');
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

            const [
                objectInfo,
                workspaceInfo,
                versions,
                [too_many_inc_refs, inc_references],
                [too_many_out_refs, out_references],
                writableNarratives
            ] = await Promise.all([
                wsClient.callFunc('get_object_info3', [{
                    objects: [{ref}],
                    includeMetadata: 1
                }]).then(([result]) => {
                    return APIUtils.objectInfoToObject(result.infos[0]);
                }),
                wsClient.callFunc('get_workspace_info', [{
                    id: this.props.workspaceId
                }]).then(([result]) => {
                    return APIUtils.workspaceInfoToObject(result);
                }),
                this.fetchObjectHistory(wsClient, ref),
                this.fetchIncomingReferences(wsClient, ref),
                this.fetchOutgoingReferences(wsClient, ref),
                this.fetchWritableNarratives(wsClient)
            ]);

            // const [result] = await wsClient.callFunc('get_object_info3', [{
            //     objects: [{ ref}],
            //     includeMetadata: 1
            // }]);

            // const objectInfo = APIUtils.objectInfoToObject(result.infos[0]);

            // const [wsinfoResult] = await wsClient.callFunc('get_workspace_info', [{
            //     id: this.props.workspaceId
            // }]);
            // const workspaceInfo = APIUtils.workspaceInfoToObject(wsinfoResult);

            // const versions = await this.fetchObjectHistory(wsClient, ref);

            // const [too_many_inc_refs, inc_references] = await this.fetchIncomingReferences(wsClient, ref);

            // const [too_many_out_refs, out_references] = await this.fetchOutgoingReferences(wsClient, ref);

            // const writableNarratives = await this.fetchWritableNarratives(wsClient);

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
