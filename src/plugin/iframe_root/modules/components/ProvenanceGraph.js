define([
    'preact',
    'htm',
    'jquery',
    'd3',
    './ProvenanceGraph.styles',
    './Loading',
    './ErrorView',
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
    GenericClient
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    const WIDTH = 1200;
    const HEIGHT = 700;

    const TYPES = {
        selected: {
            color: '#FF9800',
            name: 'Current version'
        },
        core: {
            color: '#FF9800',
            name: 'All Versions of this Data'
        },
        ref: {
            color: '#C62828',
            name: 'Data Referencing this Data'
        },
        included: {
            color: '#2196F3',
            name: 'Data Referenced by this Data'
        },
        none: {
            color: '#FFFFFF',
            name: ''
        },
        copied: {
            color: '#4BB856',
            name: 'Copied From'
        }
    };

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

    function getTimeStampStr(objInfoTimeStamp) {
        const monthLookup = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (!objInfoTimeStamp) {
            return '';
        }
        let date = new Date(objInfoTimeStamp);
        let seconds = Math.floor((new Date() - date) / 1000);

        // f-ing safari, need to add extra ':' delimiter to parse the timestamp
        if (isNaN(seconds)) {
            const tokens = objInfoTimeStamp.split('+'); // this is just the date without the GMT offset
            const newTimestamp = `${tokens[0]  }+${  tokens[0].substr(0, 2)  }:${  tokens[1].substr(2, 2)}`;
            date = new Date(newTimestamp);
            seconds = Math.floor((new Date() - date) / 1000);
            if (isNaN(seconds)) {
                // just in case that didn't work either, then parse without the timezone offset, but
                // then just show the day and forget the fancy stuff...
                date = new Date(tokens[0]);
                return `${monthLookup[date.getMonth()]  } ${  date.getDate()  }, ${  date.getFullYear()}`;
            }
        }

        // keep it simple, just give a date
        return `${monthLookup[date.getMonth()]  } ${  date.getDate()  }, ${  date.getFullYear()}`;
    }

    class SankeyGraph extends Component {
        constructor(props) {
            super(props);
            this.ref = preact.createRef();
        }
        componentDidMount() {
            const node = this.ref.current;
            this.renderGraph(node);
        }

        async nodeMouseover(d) {
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.props.runtime.config('services.Workspace.url'),
                token: this.props.runtime.service('session').getAuthToken()
            });
            if (d.isFake) {
                //
                // TODO: What is this?
                //
                // const info = d.info;
                // let text = '<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>';
                // text +=
                //     '<h4>Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">';
                // text += `<tr><td><b>Name</b></td><td>${  info[1]  }</td></tr>`;
                // text += '</td></tr></table></td><td>';
                // text +=
                //     '<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">';
                // text += '<tr><td><b>N/A</b></td></tr>';
                // text += '</table>';
                // text += '</td></tr></table>';
                // $container.find('#objdetailsdiv').html(text);
            } else {
                const [objdata] = await wsClient.callFunc('get_object_provenance', [[{
                    ref: d.objId
                }]]);

                this.props.onNodeOver({
                    ref: d.objId,
                    info: d.info,
                    objdata
                });
            }
        }

        nodeMouseout() {
            this.props.onNodeOut();
        }

        renderGraph(graphNode) {
            const $graphNode = $(graphNode);
            const margin = {top: 10, right: 10, bottom: 10, left: 10};
            const width = this.props.width - 50 - margin.left - margin.right;
            const {graph, objRefToNodeIdx} = this.props;
            const height = this.props.graph.nodes.length * 38 - margin.top - margin.bottom;

            if (graph.links.length === 0) {
                // in order to render, we need at least two nodes
                graph.nodes.push({
                    node: 1,
                    name: 'No references found',
                    info: [-1, 'No references found', 'No Type', 0, 0, 'N/A', 0, 'N/A', 0, 0, {}],
                    nodeType: 'none',
                    objId: '-1',
                    isFake: true
                });
                objRefToNodeIdx['-1'] = 1;
                graph.links.push(makeLink(0, 1, 1));
            }

            if (height < 450) {
                $graphNode.height(height + 40);
            }
            /*var zoom = d3.behavior.zoom()
                 .translate([0, 0])
                 .scale(1)
                 .scaleExtent([1, 8])
                 .on("zoom", function() {
                 features.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                 //features.select(".state-border").style("stroke-width", 1.5 / d3.event.scale + "px");
                 //features.select(".county-border").style("stroke-width", .5 / d3.event.scale + "px");
                 });
                 */
            // append the svg canvas to the page
            d3.select($graphNode[0]).html('');
            $graphNode.show();
            const svg = d3.select($graphNode[0]).append('svg');
            svg.attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${  margin.left  },${  margin.top  })`);

            // Set the sankey diagram properties
            const sankey = d3
                .sankey()
                .nodeWidth(25)
                .nodePadding(40)
                .size([width, height]);

            const path = sankey.link();
            sankey
                .nodes(this.props.graph.nodes)
                .links(this.props.graph.links)
                .layout(40);

            // add in the links
            const link = svg
                .append('g')
                .selectAll('.link')
                .data(this.props.graph.links)
                .enter()
                .append('path')
                .attr('class', 'sankeylink')
                .attr('d', path)
                .style('stroke-width', () => {
                    return 10; /*Math.max(1, d.dy);*/
                })
                .sort((a, b) => {
                    return b.dy - a.dy;
                });

            // add the link titles
            link.append('title').text((d) => {
                if (d.source.nodeType === 'copied') {
                    d.text = `${d.target.name  } copied from ${  d.source.name}`;
                } else if (d.source.nodeType === 'core') {
                    d.text = `${d.target.name  } is a newer version of ${  d.source.name}`;
                } else if (d.source.nodeType === 'ref') {
                    d.text = `${d.source.name  } references ${  d.target.name}`;
                } else if (d.source.nodeType === 'included') {
                    d.text = `${d.target.name  } references ${  d.source.name}`;
                }
                return d.text;
            });
            $(link).tooltip({delay: {show: 0, hide: 100}});

            // add in the nodes
            const node = svg
                .append('g')
                .selectAll('.node')
                .data(this.props.graph.nodes)
                .enter()
                .append('g')
                .attr('class', 'sankeynode')
                .attr('transform', (d) => {
                    return `translate(${  d.x  },${  d.y  })`;
                })
                .call(
                    d3.behavior
                        .drag()
                        .origin((d) => {
                            return d;
                        })
                        .on('dragstart', function () {
                            this.parentNode.appendChild(this);
                        })
                        .on('drag', function (d) {
                            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x));
                            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y));
                            d3.select(this).attr('transform', `translate(${  d.x  },${  d.y  })`);
                            sankey.relayout();
                            link.attr('d', path);
                        })
                )
                .on('dblclick', (d) => {
                    if (d3.event.defaultPrevented) {
                        return;
                    }
                    // TODO: toggle switch between redirect vs redraw

                    // alternate redraw
                    //self.$elem.find('#objgraphview').hide();
                    //self.buildDataAndRender({ref:d['objId']});

                    //alternate reload page so we can go forward and back
                    if (d.isFake) {
                        // Oh, no!
                        alert('Cannot expand this node.');
                    } else {
                        //if (d.info[1].indexOf(' ') >= 0) {
                        //    // TODO: Fix this
                        //    window.location.href = "#provenance/" + encodeURI(d.info[7] + "/" + d.info[0]);
                        //} else {
                        // TODO: Fix this
                        this.props.runtime.navigate(`provenance/${  encodeURI(`${d.info[6]  }/${  d.info[0]  }/${  d.info[4]}`)}`);
                        //}
                    }
                })
                .on('mouseover', this.nodeMouseover.bind(this))
                .on('mouseout', this.nodeMouseout.bind(this));

            // add the rectangles for the nodes
            node.append('rect')
                .attr('y', () => {
                    return -5;
                })
                .attr('height', (d) => {
                    return Math.abs(d.dy) + 10;
                })
                .attr('width', sankey.nodeWidth())
                .style('fill', (d) => {
                    return (d.color = TYPES[d['nodeType']].color);
                })
                .style('stroke', (d) => {
                    return 0 * d3.rgb(d.color).darker(2);
                })
                .append('title')
                .html((d) => {
                    //0:obj_id, 1:obj_name, 2:type ,3:timestamp, 4:version, 5:username saved_by, 6:ws_id, 7:ws_name, 8 chsum, 9 size, 10:usermeta
                    const info = d.info;
                    let text =
                        `${info[1]
                        } (${
                            info[6]
                        }/${
                            info[0]
                        }/${
                            info[4]
                        })\n` +
                        '--------------\n' +
                        `  type:  ${
                            info[2]
                        }\n` +
                        `  saved on:  ${
                            getTimeStampStr(info[3])
                        }\n` +
                        `  saved by:  ${
                            info[5]
                        }\n`;
                    let found = false;
                    const metadata = '  metadata:\n';
                    for (const m in info[10]) {
                        text += `     ${  m  } : ${  info[10][m]  }\n`;
                        found = true;
                    }
                    if (found) {
                        text += metadata;
                    }
                    return text;
                });

            // add in the title for the nodes
            node.append('text')
                .attr('y', (d) => {
                    return d.dy / 2;
                })
                .attr('dy', '.35em')
                .attr('text-anchor', 'end')
                .attr('transform', null)
                .text((d) => {
                    return d.name;
                })
                .filter((d) => {
                    return d.x < width / 2;
                })
                .attr('x', 6 + sankey.nodeWidth())
                .attr('text-anchor', 'start');
            return this;
        }

        render() {
            return html`
                <div ref=${this.ref} style=${{margin: '2em 0'}}/>
            `;
        }
    }

    class ProvenanceGraph extends Component {
        constructor(props) {
            super(props);
            this.graphNodeRef = preact.createRef();
            this.state = {
                status: 'NONE'
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
                        height=${HEIGHT} 
                        onNodeOver=${({ref, info, objdata}) => {
                            this.props.onInspectNode({ref, info, objdata}, true);
                        }}
                        onNodeOut=${() => {
                            this.props.onInspectNodeLeave();
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
                <div style=${styles.main}>
                    <p>This is a visualization of the relationships between this piece of data and other data in KBase.  Mouse over objects to show additional information (shown below the graph). Double click on an object to select and recenter the graph on that object in a new window.</p>
                    ${this.renderState()}
                </div>
            `;
        }
    }
    return ProvenanceGraph;
});
