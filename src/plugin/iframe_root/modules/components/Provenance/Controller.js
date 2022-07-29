define([
    'preact',
    'htm',
    'components/Loading',
    'components/ErrorView',
    'kb_lib/jsonRpc/genericClient',
    'lib/domUtils',
    './App'

], (
    preact,
    htm,
    Loading,
    ErrorView,
    GenericClient,
    {objectInfoToObject},
    App
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

    function getNodeLabel(info) {
        return `${info.name} (v${info.version})`;
    }

    function makeLink(source, target, value) {
        return {
            source,
            target,
            value
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
                omitTypes: [],
                selectedNode: {
                    nodeInfo: null,
                    over: false
                }
            };
        }

        componentDidMount() {
            this.fetchData();
        }

        processObjectHistory(data) {
            const objIdentities = [];
            let latestVersion = 0,
                latestObjId = '';

            // These are global - but not really!
            const objRefToNodeIdx = {};
            const graph = {
                nodes: [],
                links: []
            };

            data.forEach((info) => {
                //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                const objectInfo = objectInfoToObject(info);
                const objRef = objectInfo.ref;
                const nodeId = graph.nodes.length;
                graph.nodes.push({
                    node: nodeId,
                    name: getNodeLabel(objectInfo),
                    info: objectInfo,
                    nodeType: 'core',
                    objId: objRef
                });
                if (objectInfo[4] > latestVersion) {
                    latestVersion = objectInfo[4];
                    latestObjId = objRef;
                }
                objRefToNodeIdx[objRef] = nodeId;
                objIdentities.push(objectInfoToObject(objectInfo));
            });
            if (latestObjId.length > 0) {
                graph.nodes[objRefToNodeIdx[latestObjId].nodeType] = 'selected';
            }
            return {objIdentities, objRefToNodeIdx, graph};
        }

        processObject(objectInfo) {
            // This is where we initialize these core data objects which are threaded through
            // several methods to generate the data for the graph.
            const objIdentities = [];
            const objRefToNodeIdx = {};
            const graph = {
                nodes: [],
                links: []
            };

            objIdentities.push(objectInfo);

            // The primordial node.
            const nodeId = 0;

            graph.nodes.push({
                node: nodeId,
                name: getNodeLabel(objectInfo),
                info: objectInfo,
                nodeType: 'core',
                objId: objectInfo.ref
            });

            objRefToNodeIdx[objectInfo.ref] = nodeId;

            // TODO: don't now what this does; find out and document.
            graph.nodes[objRefToNodeIdx[objectInfo.ref].nodeType] = 'selected';

            return {objIdentities, objRefToNodeIdx, graph};
        }

        /* Adds nodes and links for all referencing objects, with the link terminating at a
           node which is the target object (or one of it's versions, if the showAllVersions flag is on)
        */
        async getReferencingObjects(objIdentities, graph, objRefToNodeIdx) {
            // Note that graph and objRefToNodeIdx are MODIFIED.
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });

            const [results] =  await wsClient.callFunc('list_referencing_objects', [objIdentities.map(({ref}) => {return {ref};})]);

            // convert all object info to object-ified object info.
            const referencingObjectsSets = results.map((referencingObjects) => {
                return referencingObjects.map((info) => {
                    return objectInfoToObject(info);
                });
            });

            // const warnings = [];

            const filterCondition = (refInfo, objInfo) => {
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
            };

            const [totalCount, filteredCount] = (() => {
                let filteredCount = 0;
                let totalCount = 0;

                referencingObjectsSets.forEach((referencingObjects, setIndex) => {
                    referencingObjects.forEach((referencingObject) => {
                        if (filterCondition(referencingObject, objIdentities[setIndex])) {
                            filteredCount += 1;
                        }
                        totalCount += 1;
                    });
                });

                return [totalCount, filteredCount];
            })();

            // We have a list of lists - one list for each object version as contained in objectIdentities.
            let referencingObjectCount = 0;
            for (let i = 0; i < referencingObjectsSets.length; i++) {
                for (let k = 0; k < referencingObjectsSets[i].length; k++) {
                    const referencingObjectInfo = referencingObjectsSets[i][k];
                    if (!filterCondition(referencingObjectInfo, objIdentities[i])) {
                        continue;
                    }

                    referencingObjectCount += 1;

                    //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                    const ref = referencingObjectInfo.ref;

                    const graphNodeId = graph.nodes.length;
                    graph.nodes.push({
                        node: graphNodeId,
                        name: getNodeLabel(referencingObjectInfo),
                        info: referencingObjectInfo,
                        nodeType: 'ref',
                        objId: ref
                    });

                    // Allows lookup of the node from the ref by getting the id, actually the node index, which can then be
                    // used to index into graph.nodes.
                    objRefToNodeIdx[ref] = graphNodeId;

                    // add the link now too
                    if (objRefToNodeIdx[objIdentities[i].ref] !== null) {
                        // only add the link if it is visible
                        graph.links.push(makeLink(objRefToNodeIdx[objIdentities[i].ref], graphNodeId, 1));
                    }

                    // If we have exceeded the maximum number of objects we support in the graph,
                    // create a fake entry.
                    // TODO: explain how this is eventually displayed, because this is weird.
                    if (referencingObjectCount >= MAX_REFERENCING_OBJECTS) {
                        // annoying way to get the total filtered referencing objects.

                        // console.log('total count', totalCount);

                        // // //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                        // const warning = `The number of referencing objects (${totalCount}) exceeds the maximum displayable (${MAX_REFERENCING_OBJECTS}); display limited to first 50 referencing objects.`;
                        // console.warn(warning);
                        // warnings.push(warning);
                        // return warnings;
                        return {totalReferencingObjects: totalCount, filteredReferencingObjects: filteredCount, truncated: true};
                    }
                }
            }
            return {totalReferencingObjects: totalCount, filteredReferencingObjects: filteredCount, truncated: false};
        }

        async getObjectProvenance(objIdentities) {
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });
            const [objdata] = await  wsClient.callFunc('get_object_provenance', [objIdentities.map(({ref}) => {return {ref};})]);

            const uniqueRefs = {},
                uniqueRefObjectIdentities = [],
                links = [];

            objdata.forEach((objectProvenance) => {
                const objRef = getObjectRef(objectProvenance.info);

                // extract the references contained within the object
                objectProvenance.refs.forEach((ref) => {
                    if (!(ref in uniqueRefs)) {
                        uniqueRefs[ref] = 'included';
                        uniqueRefObjectIdentities.push({ref});
                    }
                    links.push(makeLink(ref, objRef, 1));
                });

                // extract the references from the provenance
                objectProvenance.provenance.forEach((provenance) => {
                    if (provenance.resolved_ws_objects) {
                        provenance.resolved_ws_objects.forEach((resolvedObjectRef) => {
                            if (!(resolvedObjectRef in uniqueRefs)) {
                                uniqueRefs[resolvedObjectRef] = 'included'; // TODO switch to prov??
                                uniqueRefObjectIdentities.push({ref: resolvedObjectRef});
                            }
                            links.push(makeLink(resolvedObjectRef, objRef, 1));
                        });
                    }
                });

                // copied from
                if (objectProvenance.copied) {
                    const copyShort =
                        `${objectProvenance.copied.split('/')[0]  }/${  objectProvenance.copied.split('/')[1]}`;
                    const thisShort = getObjectRefShort(objectProvenance.info);
                    if (copyShort !== thisShort) {
                        // only add if it wasn't copied from an older version
                        if (!(objectProvenance.copied in uniqueRefs)) {
                            uniqueRefs[objectProvenance.copied] = 'copied'; // TODO switch to prov??
                            uniqueRefObjectIdentities.push({ref: objectProvenance.copied});
                        }
                        links.push(makeLink(objectProvenance.copied, objRef, 1));
                    }
                }
            });
            return {
                uniqueRefs,
                uniqueRefObjectIdentities,
                links
            };
        }

        async getObjectInfo(refData, graph, objRefToNodeIdx) {
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });
            try {
                const [objInfoList] = await wsClient.callFunc('get_object_info_new', [{
                    objects: refData['uniqueRefObjectIdentities'],
                    includeMetadata: 1,
                    ignoreErrors: 1
                }]);

                const objInfoStash = {};
                for (let i = 0; i < objInfoList.length; i++) {
                    if (objInfoList[i]) {
                        objInfoStash[`${objInfoList[i][6]}/${objInfoList[i][0]}/${objInfoList[i][4]}`] =
                            objectInfoToObject(objInfoList[i]);
                    }
                }
                // add the nodes
                const uniqueRefs = refData.uniqueRefs;
                for (const ref in uniqueRefs) {
                    const refInfo = objInfoStash[ref];
                    if (refInfo) {
                        //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                        const objRef = refInfo.ref;
                        const nodeId = graph.nodes.length;
                        graph.nodes.push({
                            node: nodeId,
                            name: getNodeLabel(refInfo),
                            info: refInfo,
                            nodeType: uniqueRefs[ref],
                            objId: objRef
                        });
                        objRefToNodeIdx[objRef] = nodeId;
                    } else {
                        // there is a reference, but we no longer have access; could do something better
                        // here, but instead we just skip
                        // At least warn... there be bugs if this happens...
                        console.warn(`In provenance widget reference ${ref} is not accessible`);
                    }
                }
                // add the link info
                refData.links.forEach((link) => {
                    if (isUndefNull(objRefToNodeIdx[link.source]) || isUndefNull(objRefToNodeIdx[link.target])) {
                        console.warn('skipping link', link);
                    } else {
                        graph.links.push(
                            makeLink(objRefToNodeIdx[link.source], objRefToNodeIdx[link.target], link.value)
                        );
                    }
                });
            } catch (ex) {
                // we couldn't get info for some reason, could be if objects are deleted or not visible
                const uniqueRefs = refData['uniqueRefs'];
                for (const ref in uniqueRefs) {
                    const nodeId = graph['nodes'].length;
                    const refTokens = ref.split('/');
                    // TODO: probably better to have a special node type rather than create a fake
                    // object info!
                    graph['nodes'].push({
                        node: nodeId,
                        name: ref,
                        info: objectInfoToObject([
                            refTokens[1],
                            'Data not found, object may be deleted',
                            'Unknown',
                            '',
                            refTokens[2],
                            'Unknown',
                            refTokens[0],
                            refTokens[0],
                            'Unknown',
                            'Unknown',
                            {}
                        ]),
                        nodeType: uniqueRefs[ref],
                        objId: ref
                    });
                    objRefToNodeIdx[ref] = nodeId;
                }
                // add the link info
                const links = refData['links'];
                for (let i = 0; i < links.length; i++) {
                    graph['links'].push(
                        makeLink(
                            objRefToNodeIdx[links[i]['source']],
                            objRefToNodeIdx[links[i]['target']],
                            links[i]['value']
                        )
                    );
                }
            }
        }

        addVersionEdges(graph, objRefToNodeIdx) {
            //loop over graph nodes, get next version, if it is in our node list, then add it
            let expectedNextVersion, expectedNextId;
            graph.nodes.forEach((node) => {
                if (node.nodeType === 'copied') {
                    return;
                }
                //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                expectedNextVersion = node.info[4] + 1;
                expectedNextId = `${node.info[6]  }/${  node.info[0]  }/${  expectedNextVersion}`;
                if (objRefToNodeIdx[expectedNextId]) {
                    // add the link now too
                    graph.links.push(makeLink(objRefToNodeIdx[node.objId], objRefToNodeIdx[expectedNextId], 1));
                }
            });
        }

        async fetchData(reloading = false) {
            const objectInfo = this.props.objectInfo;
            // init the graph
            this.setState({
                status: reloading ? 'RELOADING' : 'LOADING'
            });

            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });

            try {
                const showAllVersions = false;

                const {objIdentities, objRefToNodeIdx, graph} = await (async () => {
                    if (showAllVersions) {
                        const  [objectHistory] = await wsClient.callFunc('get_object_history', [{ref: objectInfo.ref}]);
                        return this.processObjectHistory(objectHistory);
                    }
                    return this.processObject(objectInfo);
                })();

                const [{totalReferencingObjects, filteredReferencingObjects, truncated}, refData] = await Promise.all([
                    this.getReferencingObjects(objIdentities, graph, objRefToNodeIdx),
                    this.getObjectProvenance(objIdentities, graph, objRefToNodeIdx)
                ]);

                if (refData && 'uniqueRefObjectIdentities' in refData) {
                    if (refData.uniqueRefObjectIdentities.length > 0) {
                        // Modifies graph and objRefToNodeIdx
                        await this.getObjectInfo(refData, graph, objRefToNodeIdx);
                    }
                }

                this.addVersionEdges(graph, objRefToNodeIdx);

                // In case this is a reload, the selected node may have disappeared, in which case
                // we reset the selected node to null.
                let selectedNode = this.state.selectedNode;
                if (selectedNode.nodeInfo) {
                    if (!(selectedNode.nodeInfo.ref in objRefToNodeIdx)) {
                        selectedNode = {
                            nodeInfo: null,
                            over: false
                        };
                    }
                }

                this.setState({
                    status: 'SUCCESS',
                    value: {
                        graph, objRefToNodeIdx, totalReferencingObjects, filteredReferencingObjects, truncated
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

        onNodeOver({ref, info, objdata}) {
            this.onInspectNode({ref, info, objdata}, true);
        }

        onNodeOut() {
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
            });
            this.fetchData(true);
        }

        toggleOmitReports() {
            const omitReports = !this.state.omitReports;
            const omitTypes = [];
            // let selectedNode = this.state.selectedNode;
            if (omitReports) {
                omitTypes.push(['KBaseReport', 'Report']);
                // console.log('sel', selectedNode);
                // if (selectedNode.nodeInfo && selectedNode.nodeInfo.info[2].split(/[.-]/)[1] === 'Report') {
                //     selectedNode = {
                //         nodeInfo: null,
                //         over: false
                //     };
                // }
            }
            this.setState({
                omitReports,
                omitTypes
            });
            this.fetchData(true);
        }

        renderSuccess(value) {
            return html`
                <${App} 
                    omitOtherNarratives=${this.state.omitOtherNarratives}
                    omitReports=${this.state.omitReports}
                    environment=${this.props.environment}
                    toggleOmitOtherNarratives=${this.toggleOmitOtherNarratives.bind(this)}
                    toggleOmitReports=${this.toggleOmitReports.bind(this)}
                    value=${value}
                    runtime=${this.props.runtime}
                    onNodeOver=${this.onNodeOver.bind(this)}
                    onNodeOut=${this.onNodeOut.bind(this)}
                    selectedNode=${this.state.selectedNode}
                    objectInfo=${this.props.objectInfo}
                    loading=${false}
                />
            `;
        }

        renderReloading(value) {
            return html`
                <${App} 
                    omitOtherNarratives=${this.state.omitOtherNarratives}
                    omitReports=${this.state.omitReports}
                    environment=${this.props.environment}
                    toggleOmitOtherNarratives=${this.toggleOmitOtherNarratives.bind(this)}
                    toggleOmitReports=${this.toggleOmitReports.bind(this)}
                    value=${value}
                    runtime=${this.props.runtime}
                    onNodeOver=${this.onNodeOver.bind(this)}
                    onNodeOut=${this.onNodeOut.bind(this)}
                    selectedNode=${this.state.selectedNode}
                    objectInfo=${this.props.objectInfo}
                    loading=${true}
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