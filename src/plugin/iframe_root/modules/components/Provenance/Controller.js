define([
    'preact',
    'htm',
    'components/Loading',
    'components/ErrorView',
    'kb_lib/jsonRpc/genericClient',
    './App',
    'lib/Model'

], (
    preact,
    htm,
    Loading,
    ErrorView,
    GenericClient,
    App,
    Model
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    const MAX_REFERENCING_OBJECTS = 100;

    // Utility functions.

    function getObjectRef(objectInfo) {
        return [objectInfo[6], objectInfo[0], objectInfo[4]].join('/');
    }

    function getObjectRefShort(objectInfo) {
        return [objectInfo[6], objectInfo[0]].join('/');
    }

    function isUndefNull(obj) {
        if (obj === null || obj === undefined) {
            return true;
        }
        return false;
    }

    function makeLink(source, target, value, relationship = 'unknown') {
        return {
            source,
            target,
            value,
            relationship
        };
    }

    class Controller extends Component {
        constructor(props) {
            super(props);
            this.graphNodeRef = preact.createRef();
            this.state = {
                status: 'NONE',
                omitOtherNarratives: false,
                omitReports: false,
                showAllVersions: false,
                nodeLabelType: 'object-name',
                omitTypes: [],
                selectedNode: {
                    nodeInfo: null,
                    over: false
                }
            };
            
            this.model = new Model({
                workspaceURL: this.props.runtime.config('services.Workspace.url'),
                authToken: this.props.runtime.service('session').getAuthToken()
            });
        }

        componentDidMount() {
            this.fetchData();
        }

        getNodeName(info, nodeId) {
            switch (this.state.nodeLabelType) {
            case 'object-name':
                return `${info.name} (v${info.version})`;
            case 'type':
                return `${info.typeName} (${info.ref})`;
            case 'ref':
                return `${info.ref} (${info.typeName})`;
            case 'node-number':
                return `#${nodeId} ${info.typeName} (${info.ref})`;
            }
        }

        formatTitlePart(titlePart) {
            if (titlePart.length < 25) {
                return titlePart;
            }
            return `${titlePart.substr(0, 25)}…`
        }

        getNodeLabel(info, nodeId) {
            switch (this.state.nodeLabelType) {
            case 'object-name':
                 return `${this.formatTitlePart(info.name)} (${info.typeName})`;
            case 'type':
                return `${info.typeName} (${info.ref})`;
            case 'ref':
                return `${info.ref} (${info.typeName})`;
            case 'node-number':
                return `#${nodeId} ${info.typeName} (${info.ref})`;
            }
        }

        processObject(objectInfo, {graph, objRefToNodeIdx}) {
            // The primordial node.
            const nodeId = 0;

            graph.nodes.push({
                node: nodeId,
                name: this.getNodeName(objectInfo, nodeId),
                label: this.getNodeLabel(objectInfo, nodeId),
                info: objectInfo,
                nodeType: 'core',
                objId: objectInfo.ref
            });
        }

        filterCondition(refInfo, objInfo) {
            if (this.state.omitOtherNarratives) {
                if (refInfo.wsid !== objInfo.wsid) {
                    return false;
                }
            }
            if (this.state.omitTypes.length > 0) {
                for (const [moduleName, typeName] of this.state.omitTypes) {
                    if (refInfo.typeModule === moduleName && refInfo.typeName === typeName) {
                        return false;
                    }
                }
            }
            return true;
        }

        /* Adds nodes and links for all referencing objects, with the link terminating at a
           node which is the target object (or one of it's versions, if the showAllVersions flag is on)
        */
        async getReferencingObjects(objectInfo, {graph}) {
            const referencingObjects = await this.model.getReferencingObjects(objectInfo.ref);

            let filteredCount = 0;
            let totalCount = 0;
            let totalReports = 0;
            let totalObjectsInOtherNarratives = 0;
            let referencingObjectCount = 0;
            for (const referencingObject of referencingObjects) {
                referencingObjectCount += 1;
                if (this.filterCondition(referencingObject, objectInfo)) {
                    filteredCount += 1;
                    const graphNodeId = graph.nodes.length;
                    graph.nodes.push({
                        node: graphNodeId,
                        name: this.getNodeName(referencingObject, graphNodeId),
                        label: this.getNodeLabel(referencingObject, graphNodeId),
                        info: referencingObject,
                        nodeType: 'referencing',
                        objId: referencingObject.ref
                    });
                    graph.links.push(makeLink(0, graphNodeId, 1, 'referencing'));
                }
                totalCount += 1;

                if (referencingObject.typeModule === 'KBaseReport' &&
                    referencingObject.typeName === 'Report') {
                    totalReports += 1;
                }
                // We also track the total # of objects not in the same workspace as the subject object.
                if (referencingObject.wsid !== objectInfo.wsid) {
                    totalObjectsInOtherNarratives += 1;
                }

                if (referencingObjectCount >= MAX_REFERENCING_OBJECTS) {
                    return {
                        totalReferencingObjects: totalCount,
                        filteredReferencingObjects: filteredCount,
                        truncated: true,
                        totalReports,
                        totalObjectsInOtherNarratives
                    };
                }
            }

            return {
                totalReferencingObjects: totalCount,
                filteredReferencingObjects: filteredCount,
                truncated: false,
                totalReports,
                totalObjectsInOtherNarratives
            };
        }

        addNullReferencingObject({graph}) {
            const nodeId = graph.nodes.length;
            graph.nodes.push({
                node: nodeId,
                name: '∅ (no referencing objects)',
                label: '∅ (no referencing objects)',
                info: null,
                nodeType: 'none',
                objId: null,
                isFake: true
            });
            // 0th node is always the subject.
            graph.links.push(makeLink(0, nodeId, 1, 'none'));
        }

        addNullReferencedObject({graph}) {
            const nodeId = graph.nodes.length;
            graph.nodes.push({
                node: nodeId,
                name: '∅ (no referenced objects)',
                label: '∅ (no referenced objects)',
                info: null,
                nodeType: 'none',
                objId: null,
                isFake: true
            });
            // 0th node is always the target.
            graph.links.push(makeLink(nodeId, 0, 1, 'none'));
        }

        async getObjectProvenance(ref, {graph}) {
            const [truncated, objectReferences] = await this.model.getOutgoingReferences(ref);
            const uniqueRefs = new Set();

            // Each object reference is a unique ref already.
            // Our job here is to create a node for each one,
            // and a link from the subject ref to this node.
            let isCopied = false;
            for (const {ref, relation, info} of objectReferences) {
                const nodeId = graph.nodes.length;
                if (relation.includes('copiedFrom')) {
                    isCopied = true;
                }
                if (info) {
                    graph.nodes.push({
                        node: nodeId,
                        name: info.name,
                        info: info,
                        name: this.getNodeName(info, nodeId),
                        label: this.getNodeLabel(info, nodeId),
                        // TODO: align with multiple possible relations
                        nodeType: relation[0],
                        objId: info.ref,
                        isFake: false
                    });
                } else {
                    // Case in which the object is inaccessible 
                     graph.nodes.push({
                        node: nodeId,
                        name: 'unknown',
                        info: info,
                        name: this.getNodeName(info, nodeId),
                        label: this.getNodeLabel(info, nodeId),
                        // TODO: align with multiple possible relations
                        nodeType: 'none',
                        objId: null,
                        isFake: false
                    });
                }
                graph.links.push(makeLink(nodeId, 0, 1, relation[0]))
            }

            return {
                totalReferencedObjects: objectReferences.length,
                uniqueRefs,
                isCopied
            };
        }

        async fetchData(reloading = false) {
            const objectInfo = this.props.objectInfo;
            // init the graph
            this.setState({
                status: reloading ? 'RELOADING' : 'LOADING'
            });

            try {
                const graphState = {
                    objIdentities: [],
                    objRefToNodeIdx: {},
                    graph: {
                        nodes: [],
                        links: []
                    }
                };

                const totalVersions = 1;

                this.processObject(this.props.objectInfo, graphState);

                const {
                    totalReferencingObjects, 
                    filteredReferencingObjects, 
                    totalReports, 
                    totalObjectsInOtherNarratives, 
                    truncated
                } = await this.getReferencingObjects(objectInfo, graphState);
                const {totalReferencedObjects, isCopied} =  await this.getObjectProvenance(objectInfo.ref, graphState);

                // TODO: restore selected NODE
                // In case this is a reload, the selected node may have disappeared, in which case
                // we reset the selected node to null.
                // let selectedNode = this.state.selectedNode;
                // if (selectedNode.nodeInfo) {
                //     if (!(selectedNode.nodeInfo.ref in objRefToNodeIdx)) {
                //         selectedNode = {
                //             nodeInfo: null,
                //             over: false
                //         };
                //     }
                // }

                const selectedNode = {
                    nodeInfo: null,
                    over: false
                };

                if (filteredReferencingObjects === 0) {
                    this.addNullReferencingObject(graphState);
                }

                if (totalReferencedObjects === 0) {
                    this.addNullReferencedObject(graphState);
                }

                this.setState({
                    status: 'SUCCESS',
                    value: {
                        graph: graphState.graph,
                        objRefToNodeIdx: graphState.objRefToNodeIdex,
                        includesAllVersions: this.state.showAllVersions,
                        totalReferencingObjects,
                        filteredReferencingObjects,
                        totalReferencedObjects,
                        totalReports,
                        totalObjectsInOtherNarratives,
                        totalVersions,
                        nodeCount: graphState.graph.nodes.length, 
                        edgeCount: graphState.graph.links.length , 
                        truncated,
                        isCopied
                    },
                    selectedNode
                });
            } catch (ex) {
                console.error(ex);
                this.setState({
                    status: 'ERROR',
                    error: {
                        code: 'unknown',
                        message: ex.message
                    }
                });
            }
        }

        async onNodeOver(node) {
            const {isFake, ref, info} = node;
            if (isFake) {
                return;
            }

            // TODO: there should be enough info in the node to 
            // display.
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });
            const [objdata] = await wsClient.callFunc('get_object_provenance', [[{
                ref: node.objId
            }]]);
            this.onInspectNode({ref, info, objdata}, true);
        }

        onNodeOut(node) {
            this.onInspectNodeLeave();
        }

        onInspectNode(nodeInfo) {
            if (nodeInfo === null) {
                this.setState({
                    selectedNode: {
                        nodeInfo: null,
                        over: false
                    }
                });
            } else {
                this.setState({
                    selectedNode: {
                        nodeInfo,
                        over: true
                    }
                });
            }
        }

        onInspectNodeLeave() {
            this.setState({
                selectedNode: {
                    ...this.state.selectedNode,
                    over: false
                }
            });
        }

        renderLoading() {
            return html`
                <${Loading} message="Loading..." />
            `;
        }

        renderError(error) {
            return html`
                <${ErrorView} error=${error} runtime=${this.props.runtime}/>
            `;
        }

        toggleOmitOtherNarratives() {
            this.setState({
                omitOtherNarratives: !this.state.omitOtherNarratives
            }, () => {
                this.fetchData(true);
            });
        }

        toggleOmitReports() {
            const omitReports = !this.state.omitReports;
            const omitTypes = [];
            if (omitReports) {
                omitTypes.push(['KBaseReport', 'Report']);
            }
            this.setState({
                omitReports,
                omitTypes
            }, () => {
                this.fetchData(true);
            });
        }

        toggleShowAllVersions() {
            const showAllVersions = !this.state.showAllVersions;
            this.setState({
                showAllVersions
            }, () => {
                this.fetchData(true);
            });
        }

        selectNodeLabelType(nodeLabelType) {
            this.setState({
                nodeLabelType
            }, () => {
                this.fetchData(true);
            });
        }

        renderSuccess(value) {
            return html`
                <${App} 
                    omitOtherNarratives=${this.state.omitOtherNarratives}
                    omitReports=${this.state.omitReports}
                    showAllVersions=${this.state.showAllVersions}
                    nodeLabelType=${this.state.nodeLabelType}
                    environment=${this.props.environment}
                    toggleOmitOtherNarratives=${this.toggleOmitOtherNarratives.bind(this)}
                    toggleOmitReports=${this.toggleOmitReports.bind(this)}
                    toggleShowAllVersions=${this.toggleShowAllVersions.bind(this)}
                    selectNodeLabelType=${this.selectNodeLabelType.bind(this)}
                    value=${value}
                    runtime=${this.props.runtime}
                    onNodeOver=${this.onNodeOver.bind(this)}
                    onNodeOut=${this.onNodeOut.bind(this)}
                    selectedNode=${this.state.selectedNode}
                    objectInfo=${this.props.objectInfo}
                    loading=${false}
                    totalReferencingObjects=${this.state.value.totalReferencingObjects}
                    filteredReferencingObjects=${this.state.value.filteredReferencingObjects}
                    totalReferencedObjects=${this.state.value.totalReferencedObjects}
                    totalVersions=${this.state.value.totalVersions}
                    includesAllVersions=${this.state.value.includesAllVersions}
                    isCopied=${this.state.value.isCopied}
                    totalReports=${this.state.value.totalReports}
                    totalObjectsInOtherNarratives=${this.state.value.totalObjectsInOtherNarratives}
                    totalVersions=${this.state.value.totalVersions}
                />
            `;
        }

        renderReloading(value) {
            return html`
                <${App} 
                     omitOtherNarratives=${this.state.omitOtherNarratives}
                    omitReports=${this.state.omitReports}
                    showAllVersions=${this.state.showAllVersions}
                    nodeLabelType=${this.state.nodeLabelType}
                    environment=${this.props.environment}
                    toggleOmitOtherNarratives=${this.toggleOmitOtherNarratives.bind(this)}
                    toggleOmitReports=${this.toggleOmitReports.bind(this)}
                    toggleShowAllVersions=${this.toggleShowAllVersions.bind(this)}
                    selectNodeLabelType=${this.selectNodeLabelType.bind(this)}
                    value=${value}
                    runtime=${this.props.runtime}
                    onNodeOver=${this.onNodeOver.bind(this)}
                    onNodeOut=${this.onNodeOut.bind(this)}
                    selectedNode=${this.state.selectedNode}
                    objectInfo=${this.props.objectInfo}
                    loading=${true}
                    totalReferencingObjects=${this.state.value.totalReferencingObjects}
                    filteredReferencingObjects=${this.state.value.filteredReferencingObjects}
                    totalReferencedObjects=${this.state.value.totalReferencedObjects}
                    totalVersions=${this.state.value.totalVersions}
                    includesAllVersions=${this.state.value.includesAllVersions}
                    isCopied=${this.state.value.isCopied}
                    totalReports=${this.state.value.totalReports}
                    totalObjectsInOtherNarratives=${this.state.value.totalObjectsInOtherNarratives}
                    totalVersions=${this.state.value.totalVersions}
                />
            `;
        }

        render() {
            switch (this.state.status) {
            case 'NONE':
            case 'LOADING':
                return this.renderLoading();
            case 'ERROR':
                return this.renderError(this.state.error);
            case 'SUCCESS':
                return this.renderSuccess(this.state.value);
            case 'RELOADING':
                return this.renderReloading(this.state.value);
            }
        }
    }

    return Controller;
});