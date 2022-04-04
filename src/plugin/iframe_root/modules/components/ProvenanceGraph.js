define([
    'preact',
    'htm',
    'jquery',
    'd3',
    './ProvenanceGraph.styles',
    './Loading',
    './ErrorView',
    './SankeyGraph',
    'kb_lib/jsonRpc/genericClient',

    // For effect
    'd3_sankey'
], (
    preact,
    htm,
    $,
    d3,
    styles,
    Loading,
    ErrorView,
    SankeyGraph,
    GenericClient
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    const WIDTH = 1200;
    // const HEIGHT = 700;


    // Utility functions.

    function getNodeLabel(info) {
        return `${info[1]  } (v${  info[4]  })`;
    }

    function makeLink(source, target, value) {
        return {
            source,
            target,
            value
        };
    }

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

    class ProvenanceGraph extends Component {
        constructor(props) {
            super(props);
            this.graphNodeRef = preact.createRef();
            this.state = {
                status: 'NONE',
                mainStyle: styles.main
            };
        }

        componentDidMount() {
            // this.renderGraph(this.ref.current);
            this.fetchData(this.props.objectRef);
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

            function getNodeLabel(info) {
                return `${info[1]} (v${info[4]})`;
            }

            data.forEach((objectInfo) => {
                //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                const objId = `${objectInfo[6]  }/${  objectInfo[0]  }/${  objectInfo[4]}`,
                    nodeId = graph.nodes.length;
                graph.nodes.push({
                    node: nodeId,
                    name: getNodeLabel(objectInfo),
                    info: objectInfo,
                    nodeType: 'core',
                    objId
                });
                if (objectInfo[4] > latestVersion) {
                    latestVersion = objectInfo[4];
                    latestObjId = objId;
                }
                objRefToNodeIdx[objId] = nodeId;
                objIdentities.push({ref: objId});
            });
            if (latestObjId.length > 0) {
                graph.nodes[objRefToNodeIdx[latestObjId].nodeType] = 'selected';
            }
            return {objIdentities, objRefToNodeIdx, graph};
        }

        async getReferencingObjects(objIdentities, graph, objRefToNodeIdx) {
            // Note that graph and objRefToNodeIdx are MODIFIED.
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });
            const [refData] =  await wsClient.callFunc('list_referencing_objects', [objIdentities]);

            // (objIdentities).then((refData) => {
            for (let i = 0; i < refData.length; i++) {
                const limit = 50;
                for (let k = 0; k < refData[i].length; k++) {
                    if (k >= limit) {
                        //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                        const nodeId = graph['nodes'].length;
                        const nameStr = `${refData[i].length - limit  } more ...`;
                        graph['nodes'].push({
                            node: nodeId,
                            name: nameStr,
                            info: [-1, nameStr, 'Multiple Types', 0, 0, 'N/A', 0, 'N/A', 0, 0, {}],
                            nodeType: 'ref',
                            objId: '-1',
                            isFake: true
                        });
                        objRefToNodeIdx[objId] = nodeId;

                        // add the link now too
                        if (objRefToNodeIdx[objIdentities[i]['ref']] !== null) {
                            // only add the link if it is visible
                            graph['links'].push({
                                source: objRefToNodeIdx[objIdentities[i]['ref']],
                                target: nodeId,
                                value: 1
                            });
                        }
                        break;
                    }

                    const refInfo = refData[i][k];
                    //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                    const objId = `${refInfo[6]  }/${  refInfo[0]  }/${  refInfo[4]}`;
                    const graphNodeId = graph['nodes'].length;
                    graph['nodes'].push({
                        node: graphNodeId,
                        name: getNodeLabel(refInfo),
                        info: refInfo,
                        nodeType: 'ref',
                        objId
                    });
                    objRefToNodeIdx[objId] = graphNodeId;

                    // add the link now too
                    if (objRefToNodeIdx[objIdentities[i].ref] !== null) {
                        // only add the link if it is visible
                        graph.links.push(makeLink(objRefToNodeIdx[objIdentities[i].ref], graphNodeId, 1));
                    }
                }
            }
        }

        async getObjectProvenance(objIdentities) {
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });
            const [objdata] = await  wsClient.callFunc('get_object_provenance', [objIdentities]);

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
                        objInfoStash[`${objInfoList[i][6]  }/${  objInfoList[i][0]  }/${  objInfoList[i][4]}`] =
                            objInfoList[i];
                    }
                }
                // add the nodes
                const uniqueRefs = refData.uniqueRefs;
                for (const ref in uniqueRefs) {
                    const refInfo = objInfoStash[ref];
                    if (refInfo) {
                        //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                        const objId = `${refInfo[6]  }/${  refInfo[0]  }/${  refInfo[4]}`;
                        const nodeId = graph.nodes.length;
                        graph.nodes.push({
                            node: nodeId,
                            name: getNodeLabel(refInfo),
                            info: refInfo,
                            nodeType: uniqueRefs[ref],
                            objId
                        });
                        objRefToNodeIdx[objId] = nodeId;
                    } else {
                        // there is a reference, but we no longer have access; could do something better
                        // here, but instead we just skip
                        // At least warn... there be bugs if this happens...
                        console.warn(`In provenance widget reference ${  ref  } is not accessible`);
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
                    graph['nodes'].push({
                        node: nodeId,
                        name: ref,
                        info: [
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
                        ],
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

        async fetchData(objectRef) {
            // init the graph
            this.setState({
                status: 'LOADING'
            });

            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });

            try {
                const  [objectHistory] = await wsClient.callFunc('get_object_history', [{ref: objectRef}]);
                const {objIdentities, objRefToNodeIdx, graph} = this.processObjectHistory(objectHistory);

                const [, refData] = await Promise.all([
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

                this.setState({
                    status: 'SUCCESS',
                    value: {
                        graph, objRefToNodeIdx
                    }
                });
            } catch (ex) {
                this.setState({
                    status: 'ERROR',
                    error: {
                        code: 'unknown',
                        message: ex.message
                    }
                });
            }
        }

        renderGraph({graph, objRefToNodeIdx}) {
            return html`
                <${SankeyGraph} 
                        graph=${graph} 
                        objRefToNodeIdx=${objRefToNodeIdx} 
                        runtime=${this.props.runtime} 
                        width=${WIDTH} 
                        onNodeOver=${({ref, info, objdata}) => {
                            this.props.onInspectNode({ref, info, objdata}, true);
                        }}
                        onNodeOut=${() => {
                            this.props.onInspectNodeLeave();
                        }}
                        setHeight=${(newHeight) => {
                            const height = Math.min(newHeight, 400);
                            console.log('set height', height);
                            this.setState({
                                mainStyle: {
                                    ...this.state.mainStyle,
                                    height
                                }
                            });
                        }}
                        />
            `;
        }

        renderLoading() {
            return html`
                <${Loading} message="Loading..." />
            `;
        }

        renderError(error) {
            return html`
                <${ErrorView} error=${error} />
            `;
        }

        renderState() {
            switch (this.state.status) {
            case 'NONE':
            case 'LOADING':
                return this.renderLoading();
            case 'ERROR':
                return this.renderError(this.state.error);
            case 'SUCCESS':
                return this.renderGraph(this.state.value);
            }
        }

        render() {
            return html`
                <div style=${this.state.mainStyle}>
                    <p>This is a visualization of the relationships between this piece of data and other data in KBase.  Mouse over objects to show additional information (shown below the graph). Double click on an object to select and recenter the graph on that object in a new window.</p>
                    ${this.renderState()}
                </div>
            `;
        }
    }
    return ProvenanceGraph;
});
