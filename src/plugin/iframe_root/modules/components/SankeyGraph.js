define([
    'preact',
    'htm',
    'jquery',
    'd3',
    'kb_lib/jsonRpc/genericClient',
    'lib/domUtils',
    'ResizeObserver',

    // For effect
    'd3_sankey',
    'css!./SankeyGraph.css'
], (
    preact,
    htm,
    $,
    d3,
    GenericClient,
    {objectInfoToObject},
    ResizeObserver
) => {
    const {Component} = preact;
    const html = htm.bind(preact.h);

    d3.rgb.prototype.toHex = function () {
        let r = Math.round(this.r).toString(16);
        let g = Math.round(this.g).toString(16);
        let b = Math.round(this.b).toString(16);
        if (this.r < 16) r = `0${r}`;
        if (this.g < 16) g = `0${g}`;
        if (this.b < 16) b = `0${b}`;
        return `#${r}${g}${b}`;
    };

    // The height of the graph is calculated as the product of the total # of nodes and
    // the following factor. This roughly sizes the graph height to scale with the size of
    // the graph. A larger factor results in a taller graph, and taller nodes.
    const HEIGHT_CALC_NODE_FACTOR = 40;

    // The graph container is resizable, with a size dynamically set to be either the actual
    // height of the graph or 400 if the graph is taller than 400px. The container is resizable,
    // so the user can expand it to the full graph. The graph is scrollable inside the container.
    // If we don't constrain the graph height like this, for a large graph, the user will not be
    // able to even see the detail tables below it.
    const DEFAULT_MAX_HEIGHT = 400;

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
            color: '#CCC',
            name: ''
        },
        copied: {
            color: '#4BB856',
            name: 'Copied From'
        },

        inaccessible: {
            color: '#fc03f8',
            name: 'Inaccessible'
        },
    };

    const LINK_TYPES = {
        referencing: {
            color: '#C62828',
            name: 'Data Referencing this Data'
        },
        included: {
            color: '#2196F3',
            name: 'Data Referenced by this Data'
        },
        referenced: {
            color: '#2196F3',
            name: 'Data Referenced by this Data'
        },
        none: {
            color: '#CCC',
            name: ''
        },
        unknown: {
            color: '#fc03f8',
            name: '#fc03f8'
        },
        inaccessible: {
            color: '#fc03f8',
            name: ''
        },
        copied: {
            color: '#4BB856',
            name: 'Copied From'
        }
    };

    // Utility functions.

    // function makeLink(source, target, value) {
    //     return {
    //         source,
    //         target,
    //         value
    //     };
    // }

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
            const newTimestamp = `${tokens[0]}+${tokens[0].substr(0, 2)}:${tokens[1].substr(2, 2)}`;
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
        return `${monthLookup[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    class SankeyGraph extends Component {
        constructor(props) {
            super(props);
            this.ref = preact.createRef();
            this.state = {
                height: null
            };
            this.resizeObserver = new ResizeObserver(this.onContainerResize.bind(this));
        }
        componentDidMount() {
            this.initialize();
        }

        componentDidUpdate(prevProps, prevState) {
            if (prevProps.graph !== this.props.graph) {
                this.renderGraph(this.ref.current);
            }
        }

        initialize() {
            const node = this.ref.current;
            this.setState({
                width: node.clientWidth
            }, () => {
                this.renderGraph(node);
                this.resizeObserver.observe(node);
            });
        }

        componentWillUnmount() {
            if (this.resizeObserver && this.ref.current) {
                this.resizeObserver.unobserve(this.ref.current);
            }
        }

        onContainerResize() {
            if (this.ref.current) {
                this.setWidth(this.ref.current);
            }
        }

        async nodeMouseover(d) {
            this.props.onNodeOver(d);
        }

        nodeMouseout(d) {
            this.props.onNodeOut(d);
        }

        setWidth(element) {
            this.setState({
                width: element.clientWidth
            }, () => {
                // Crude, but works. When this is rewritten with modern
                // d3 and a supported d3 plugin, can redress this with
                // proper d3 updating.
                this.renderGraph(element);
            });
        }

        renderGraph(graphNode) {
            const $graphNode = $(graphNode);

            // TODO: eliminate the "- 27" which is to ensure there is no horizontal scrolling.
            const width = this.state.width - 27;
            const height = this.props.graph.nodes.length * HEIGHT_CALC_NODE_FACTOR;
            // TODO: eliminate the "+ 15", required to ensure bounding container does not overflow
            this.setState({
                height: Math.min(height + 15, DEFAULT_MAX_HEIGHT)
            });

            // TODO: This was previously disabled, not sure why. We should consider
            // reviving it.
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
            // xss safe
            d3.select($graphNode[0]).html('');
            $graphNode.show();
            const svg = d3.select($graphNode[0]).append('svg');

            svg.attr('width', width)
                .attr('height', height)
                .append('g');

            // removed for simplicity, not sure it really adds very much.
            // we use the container to add padding for layout. It is fine
            // and preferred to have the graph start at 0,0.
            // .attr('transform', `translate(${margin.left},${margin.top})`);

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
                .style('stroke', (d) => {
                    return (d.color = LINK_TYPES[d.relationship].color);
                })
                .style('stroke-opacity', '0.3')
                .on('mouseover', function () {
                    d3.select(this).style('stroke-opacity', '0.6');
                })
                .on('mouseout', function () {
                    d3.select(this).style('stroke-opacity', '0.3');
                })
                .sort((a, b) => {
                    return b.dy - a.dy;
                });


            // add the link titles
            link.append('title').text((d) => {
                d.text = (() => {
                    switch (d.source.nodeType) {
                    case 'core':
                        switch (d.target.nodeType) {
                        case 'none':
                            return `no references to ${d.source.name}`;
                        case 'ref':
                            return `${d.source.name} referenced by ${d.target.name}`;
                        default:
                            return `${d.target.name} is a newer version of ${d.source.name}`;
                        }
                    case 'copied':
                        return `${d.target.info.ref} copied from ${d.source.info.ref}`;
                    case 'ref':
                        return `${d.source.name} references ${d.target.name}`;
                    case 'none':
                        return `no references from ${d.target.name}`;
                    case 'included':
                        return `${d.target.name} references ${d.source.name}`;
                    case 'inaccessible':
                        return `${d.target.name} references ${d.source.name}`;
                    }
                })();

                return d.text;
            });
            $(link).tooltip({delay: {show: 0, hide: 100}});

            // add in the nodes
            // we do this to accommodate event listeners via the old d3 library.
            const _this = this;
            const node = svg
                .append('g')
                .selectAll('.node')
                .data(this.props.graph.nodes)
                .enter()
                .append('g')
                .attr('class', 'sankeynode')
                .attr('transform', (d) => {
                    return `translate(${d.x},${d.y})`;
                })
                .call(
                    d3.behavior
                        .drag()
                        .origin((d) => {
                            return d;
                        })
                        // Disabled - when enabled prevents click or dblclick.
                        // Does not seem to affect the operation of the drag and drop behavior.
                        // .on('dragstart', function () {
                        //     this.parentNode.appendChild(this);
                        // })
                        .on('drag', function (d) {
                            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x));
                            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y));
                            d3.select(this).attr('transform', `translate(${d.x},${d.y})`);
                            sankey.relayout();
                            link.attr('d', path);
                        })
                )
                .on('dblclick', (d) => {
                    if (d3.event.defaultPrevented) {
                        return;
                    }
                    // TODO: toggle switch between redirect vs redraw

                    //alternate reload page so we can go forward and back
                    if (d.isFake) {
                        // Oh, no!
                        alert('Cannot expand this node.');
                    } else {
                        const path = `provenance/${encodeURI(`${d.info.ref}`)}`;
                        const url = `${window.location.origin}/#${path}`;
                        window.open(url);
                    }
                })
                .on('mouseover', (d) => {
                    _this.props.onNodeOver(d);
                })
                .on('mouseout', (d) => {
                    _this.props.onNodeOut(d);
                });

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
                .on('mouseover', function (d) {
                    d3.select(this).style('fill', d3.rgb(d.color).darker(1).toHex());
                })
                .on('mouseout', function (d) {
                    d3.select(this).style('fill', d.color);
                })
                .append('title')
                // xss safe
                .html(({info}) => {
                    // const objectInfo = objectInfoToObject(d.info);
                    let text;
                    if (info === null) {
                        text = 'Null node';
                    } else {
                        text =
                            `${info.name} (${info.ref})\n` +
                            '--------------\n' +
                            `  type:  ${info.type}\n` +
                            `  saved on:  ${getTimeStampStr(info.save_date)}\n` +
                            `  saved by:  ${info.saved_by}\n`;
                        text += '  metadata:\n';
                        if (info.metadata !== null && Object.keys(info.metadata).length > 0) {
                            for (const [key, value] of Object.entries(info.metadata)) {
                                text += `     ${key} : ${value}\n`;
                            }
                        } else {
                            text += '     none';
                        }

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
            const style = {};
            if (this.state.height !== null) {
                style.height = this.state.height;
            }
            return html`
                <div ref=${this.ref} className="SankeyGraph" style=${style} />
            `;
        }
    }

    return SankeyGraph;
});
