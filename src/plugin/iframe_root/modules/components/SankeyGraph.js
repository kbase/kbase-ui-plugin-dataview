define([
    'preact',
    'htm',
    'jquery',
    'd3',
    'kb_lib/jsonRpc/genericClient',

    // For effect
    'd3_sankey'
], (
    preact,
    htm,
    $,
    d3,
    GenericClient
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

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

    function makeLink(source, target, value) {
        return {
            source,
            target,
            value
        };
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
            this.props.setHeight(height);

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
                .on('click', (d) => {
                    console.log('CLICKY');
                })
                .on('dblclick', (d) => {
                    console.log('dbl clicky');
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
                        const path = `provenance/${encodeURI(`${d.info[6]}/${d.info[0]}/${d.info[4]}`)}`;
                        const url = `${window.location.origin}/#${path}`;
                        console.log('HERE');
                        window.open(url);
                        this.props.runtime.navigate(path);
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

    return SankeyGraph;
});
