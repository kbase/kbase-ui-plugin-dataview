define([
    'preact',
    'htm',
    'components/Loading',
    'components/ErrorView',
    'kb_lib/jsonRpc/genericClient',
    './utils',
    './App'

], (
    preact,
    htm,
    Loading,
    ErrorView,
    GenericClient,
    {objectInfoToObject2},
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
        }

        componentDidMount() {
            this.fetchData();
        }

        getNodeLabel(info, nodeId) {
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
                const objectInfo = objectInfoToObject2(info);
                const objRef = objectInfo.ref;
                const nodeId = graph.nodes.length;
                graph.nodes.push({
                    node: nodeId,
                    name: this.getNodeLabel(objectInfo, nodeId),
                    info: objectInfo,
                    nodeType: 'core',
                    objId: objRef
                });
                if (objectInfo[4] > latestVersion) {
                    latestVersion = objectInfo[4];
                    latestObjId = objRef;
                }
                objRefToNodeIdx[objRef] = nodeId;
                objIdentities.push(objectInfo);
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
                name: this.getNodeLabel(objectInfo, nodeId),
                info: objectInfo,
                nodeType: 'core',
                objId: objectInfo.ref
            });

            objRefToNodeIdx[objectInfo.ref] = nodeId;

            // TODO: don't now what this does; find out and document.
            graph.nodes[objRefToNodeIdx[objectInfo.ref].nodeType] = 'selected';

            return {objIdentities, objRefToNodeIdx, graph};
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
        async getReferencingObjects(objIdentities, graph, objRefToNodeIdx, objectInfo) {
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
                    return objectInfoToObject2(info);
                });
            });

            const {totalCount, filteredCount, totalReports, totalObjectsInOtherNarratives} = (() => {
                let filteredCount = 0;
                let totalCount = 0;
                let totalReports = 0;
                let totalObjectsInOtherNarratives = 0;

                referencingObjectsSets.forEach((referencingObjects, setIndex) => {
                    referencingObjects.forEach((referencingObject) => {
                        if (this.filterCondition(referencingObject, objIdentities[setIndex])) {
                            filteredCount += 1;
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
                    });
                });

                // We track the total # of report objects (useful for the filtering ui)

                return {totalCount, filteredCount, totalReports, totalObjectsInOtherNarratives};
            })();

            // We have a list of lists - one list for each object version as contained in objectIdentities.
            let referencingObjectCount = 0;

            for (let i = 0; i < referencingObjectsSets.length; i++) {
                // This is the nodeId of the subject object, the one to which references are made;
                // we want links from this node to the referencing node.
                const fromNodeId = objRefToNodeIdx[objIdentities[i].ref];

                for (let k = 0; k < referencingObjectsSets[i].length; k++) {
                    const referencingObjectInfo = referencingObjectsSets[i][k];


                    if (!this.filterCondition(referencingObjectInfo, objIdentities[i])) {
                        continue;
                    }

                    referencingObjectCount += 1;

                    //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                    const ref = referencingObjectInfo.ref;

                    const graphNodeId = graph.nodes.length;
                    graph.nodes.push({
                        node: graphNodeId,
                        name: this.getNodeLabel(referencingObjectInfo, graphNodeId),
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
                        graph.links.push(makeLink(fromNodeId, graphNodeId, 1, 'referencing'));
                    }

                    // If we have exceeded the maximum number of objects we support in the graph,
                    // create a fake entry.
                    // TODO: explain how this is eventually displayed, because this is weird.
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
            }
            return {
                totalReferencingObjects: totalCount,
                filteredReferencingObjects: filteredCount,
                truncated: false,
                totalReports,
                totalObjectsInOtherNarratives
            };
        }

        async addNullReferencingObject(graph, from) {
            const to = graph.nodes.length;
            graph.nodes.push({
                node: to,
                name: '∅ (no referencing objects)',
                info: null,
                nodeType: 'none',
                objId: null,
                isFake: true
            });
            // 0th node is always the subject.
            graph.links.push(makeLink(from, to, 1, 'none'));
            return to;
        }

        async addNullReferencedObject(graph, to) {
            const from = graph.nodes.length;
            graph.nodes.push({
                node: from,
                name: '∅ (no referenced objects)',
                info: null,
                nodeType: 'none',
                objId: null,
                isFake: true
            });
            // 0th node is always the subject.
            graph.links.push(makeLink(from, to, 1, 'none'));
            return from;
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

            let totalReferencedObjects = 0;

            let isCopied = false;
            objdata.forEach((objectProvenance) => {
                const objRef = getObjectRef(objectProvenance.info);

                totalReferencedObjects += objectProvenance.refs.length;

                // extract the references contained within the object
                objectProvenance.refs.forEach((ref) => {
                    if (!(ref in uniqueRefs)) {
                        uniqueRefs[ref] = 'included';
                        uniqueRefObjectIdentities.push({ref});
                    }
                    links.push(makeLink(ref, objRef, 1, 'included'));
                });

                // extract the references from the provenance
                // TODO: is this not duplicative of the above?
                objectProvenance.provenance.forEach((provenance) => {
                    if (provenance.resolved_ws_objects) {
                        totalReferencedObjects += provenance.resolved_ws_objects.length;
                        provenance.resolved_ws_objects.forEach((resolvedObjectRef) => {
                            if (!(resolvedObjectRef in uniqueRefs)) {
                                uniqueRefs[resolvedObjectRef] = 'included'; // TODO switch to prov??
                                uniqueRefObjectIdentities.push({ref: resolvedObjectRef});
                            }
                            links.push(makeLink(resolvedObjectRef, objRef, 1, 'included'));
                        });
                    }
                });

                // copied from
                if (objectProvenance.copied) {
                    isCopied = true;
                    const copyShort =
                        `${objectProvenance.copied.split('/')[0]}/${objectProvenance.copied.split('/')[1]}`;
                    const thisShort = getObjectRefShort(objectProvenance.info);
                    if (copyShort !== thisShort) {
                        // only add if it wasn't copied from an older version
                        if (!(objectProvenance.copied in uniqueRefs)) {
                            uniqueRefs[objectProvenance.copied] = 'copied'; // TODO switch to prov??
                            uniqueRefObjectIdentities.push({ref: objectProvenance.copied});
                        }
                        links.push(makeLink(objectProvenance.copied, objRef, 1, 'copied'));
                    }
                }
            });
            const result = {
                totalReferencedObjects: Object.keys(uniqueRefs).length,
                uniqueRefs,
                uniqueRefObjectIdentities,
                links,
                isCopied
            };
            return result;
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
                            objectInfoToObject2(objInfoList[i]);
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
                            name: this.getNodeLabel(refInfo, nodeId),
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
                        const nodeId = graph.nodes.length;
                        graph.nodes.push({
                            node: nodeId,
                            name: `Inaccessible (${ref})`,
                            info: null,
                            nodeType: 'inaccessible',
                            objId: ref
                        });
                        objRefToNodeIdx[ref] = nodeId;

                    }
                }
                // add the link info
                refData.links.forEach((link) => {
                    // TODO: is this condition possible?
                    if (isUndefNull(objRefToNodeIdx[link.source]) || isUndefNull(objRefToNodeIdx[link.target])) {
                        console.warn('skipping link', link, objRefToNodeIdx[link.source], objRefToNodeIdx[link.target]);
                    } else {
                        graph.links.push(
                            makeLink(objRefToNodeIdx[link.source], objRefToNodeIdx[link.target], link.value, link.relationship)
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
                        info: objectInfoToObject2([
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
                            links[i]['value'],
                            'unknown'
                        )
                    );
                }
            }
        }

        addVersionEdges(graph, objRefToNodeIdx) {
            //loop over graph nodes, get next version, if it is in our node list, then add it
            let expectedNextVersion, expectedNextId;
            graph.nodes.forEach((node) => {
                // TODO: add flag for isObject
                if (node.nodeType === 'copied' || node.nodeType === 'none' || node.nodeType === 'inaccessible') {
                    return;
                }
                //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                expectedNextVersion = node.info[4] + 1;
                expectedNextId = `${node.info[6]}/${node.info[0]}/${expectedNextVersion}`;
                if (objRefToNodeIdx[expectedNextId]) {
                    // add the link now too
                    graph.links.push(makeLink(objRefToNodeIdx[node.objId], objRefToNodeIdx[expectedNextId], 1, 'version'));
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
                const {objIdentities, objRefToNodeIdx, graph, totalVersions} = await (async () => {
                    // Sorry, we get the object history even though we may not need it.
                    const  [objectHistory] = await wsClient.callFunc('get_object_history', [{ref: objectInfo.ref}]);
                    if (this.state.showAllVersions) {
                        return {...this.processObjectHistory(objectHistory), totalVersions: objectHistory.length};
                    }
                    return {...this.processObject(objectInfo), totalVersions: objectHistory.length};
                })();

                const [{totalReferencingObjects, filteredReferencingObjects, totalReports, totalObjectsInOtherNarratives, truncated}, refData] = await Promise.all([
                    this.getReferencingObjects(objIdentities, graph, objRefToNodeIdx, objectInfo),
                    this.getObjectProvenance(objIdentities, graph, objRefToNodeIdx)
                ]);

                // If no referencing objects, we add a null node to indicate we are at the
                // end of the line.

                // if (totalReferencingObjects === 0) {
                //     this.addNullReferencingObject(graph, graph.nodes.length);
                // }

                if (refData && 'uniqueRefObjectIdentities' in refData && refData.uniqueRefObjectIdentities.length > 0) {
                    // Modifies graph and objRefToNodeIdx
                    await this.getObjectInfo(refData, graph, objRefToNodeIdx);
                }
                // else {
                //     this.addNullReferencedObject(graph, 0);
                // }

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

                // Handle all cases of missing next or previous nodes.
                // So the SanKey plugin will scan the nodes and links and
                // create the links directly on the nodes.
                // We could use that, but at this point in the code flow they have not
                // yet been created (and is an internal impl of SanKey, however rude it
                // is that it modifies the data we pass in...)
                // We just need to know if there are any, so we just count.
                const graph2 = graph.nodes.map(() => {
                    return {from: 0, to: 0};
                });

                graph.links.forEach((link) => {
                    // This is referencing
                    const nodeSource = graph2[link.source];
                    nodeSource.from += 1;

                    // This is referenced.
                    const nodeTarget = graph2[link.target];
                    nodeTarget.to += 1;
                });

                graph2.forEach(({from, to}, index) => {
                    if (from === 0 && graph.nodes[index].nodeType === 'core') {
                        this.addNullReferencingObject(graph, index);
                    }
                    if (to === 0 && graph.nodes[index].nodeType === 'core') {
                        this.addNullReferencedObject(graph, index);
                    }
                });


                for (const node of graph.nodes) {
                    // find links from this node.
                    if (node.targetLinks && node.targetLinks.length === 0) {
                        this.addNullReferencingObject(graph, node.node);
                    }

                    // find links to this node.
                    if (node.sourceLinks && node.sourceLinks.length === 0) {
                        this.addNullReferencedObject(graph, node.node);
                    }
                }

                this.setState({
                    status: 'SUCCESS',
                    value: {
                        graph, objRefToNodeIdx,
                        includesAllVersions: this.state.showAllVersions,
                        totalReferencingObjects,
                        filteredReferencingObjects,
                        totalReferencedObjects: refData.totalReferencedObjects,
                        totalReports,
                        totalObjectsInOtherNarratives,
                        totalVersions,
                        nodeCount: graph.nodes.length, edgeCount: graph.links.length , truncated,
                        isCopied: refData.isCopied
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