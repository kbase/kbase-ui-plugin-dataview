/***
 *  ModelSEEDPathway.js
 *
 *	Usage:
 *		var pathway = new ModelSeedPathway({
 *		     	    	elem: '<dom_id_string>',            // required
 *                      usingImage: <true|false>,           // default: false (optional)
 *              	    mapName: $s.name,                   // map name (required?)
 *              	    mapData: $s.mapData,                // map json (required)
 *              	    models: [workspace_model_objects],  // model objects (required)
 *              	    fbas: [fba_workspace_objects]       // fba objects (optional)
 *                   })
 *
 * 	Requires:
 * 		ModelSeedVizConfig.js - configuration file things such as colors
 *
 */

define([
    'jquery',
    'd3',
    'kb_service/client/workspace',
    'widgets/modeling/modelSeedVizConfig',
    'lib/jqueryUtils'
], (
    $,
    d3,
    Workspace,
    ModelSeedVizConfig,
    {$errorAlert}
) => {
    function ModelSeedPathway(params) {
        let container;
        try {
            container = $(`#${  params.elem}`);
        } catch (e) {
            console.error('Pathway widget requires element ("elem") in params');
            return;
        }

        const self = this;

        self.models = params.models || null;
        self.fbas = params.fbas || null;

        const runtime = params.runtime;

        this.workspaceClient = new Workspace(runtime.config('services.workspace.url'), {
            token: runtime.service('session').getAuthToken()
        });

        const usingImage = params.usingImage || false,
            useAbsFlux = params.absFlux || false;

        const config = new ModelSeedVizConfig();

        // globals
        const mapData = params.mapData;
        const groups = mapData.groups, // groups of reactions
            rxns = mapData.reactions, // reactions
            cpds = mapData.compounds, // compounds
            mapLinks = mapData.linkedmaps; // lines from reactions to maps and visa versa

        // const oset = 12, // off set for arrows
        //     r = 12; // radial offset from circle.  Hooray for math degrees.
        const c_pad = 50; // padding around max_x/max_y
        let max_x = 0, // used to compute canvas size (width) based on data
            max_y = 0, // used to compute canvas size (height) based on data
            svg; // svg element for map

        // draw reactions
        function drawReactions() {
            const count = self.models ? self.models.length : 1;

            // for each rxn on the map
            for (let i = 0; i < rxns.length; i++) {
                // Not used, disabled
                // const color = '#fff';
                let lightLabel = false;

                // reaction object listed in map
                const rxn = rxns[i];

                // adjust boxes
                const x = rxn.x - rxn.w / 2 - 1,
                    y = rxn.y - rxn.h / 2 - 1.5,
                    w = rxn.w + 3,
                    h = rxn.h + 2;

                // adjust canvas size
                if (x > max_x) max_x = x + 2 * w + c_pad;
                if (y > max_y) max_y = y + 2 * h + c_pad;

                const group = svg.append('g').attr('class', 'rect');

                // draw enzymes (rectangles)
                /*var outer_rect = group.append('rect')
                 .attr('class', 'rxn')
                 .attr('x', x)
                 .attr('y', y)
                 .attr('width', w)
                 .attr('height', h);*/

                const found_rxns = getModelRxns(rxn.rxns);

                // divide box for number of models being displayed
                if (self.models) {
                    const w = rxn.w / count;

                    for (let j = 0; j < found_rxns.length; j++) {
                        const found_rxn = found_rxns[j];

                        const rect = group
                            .append('rect')
                            .attr('class', 'rxn-divider-stroke')
                            .attr('x', () => {
                                if (j === 0) return x + w * j + 1;
                                return x + w * j;
                            })
                            .attr('y', y + 1)
                            .attr('width', () => {
                                if (j === count) return w;
                                return w + 2;
                            })
                            .attr('height', h - 1.5);

                        if (found_rxn.length > 0) {
                            rect.attr('fill', '#bbe8f9');
                            rect.attr('stroke', config.strokeDark);
                        } else {
                            rect.attr('fill', '#fff');
                            rect.attr('stroke', config.strokeDark);
                        }

                        // Tooltip rendering has been disabled (for some reason?), so don't even
                        // bother initializing them.
                        // const title =
                        //     `<h5>${self.models[j].data.name}<br>` +
                        //     `<small>${self.models[j].data.source_id}</small></h5>`;
                        // tooltip(rect.node(), title, rxn);
                    }
                } else {
                    group
                        .append('rect')
                        .attr('class', 'rxn')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('width', w)
                        .attr('height', h);
                }

                // determine if fba results should be added for the map reaction

                let addFBAResults = false;
                let fba_rxns = [];
                if (self.fbas) {
                    fba_rxns = getFbaRxns(rxn.rxns);

                    if ([].concat.apply([], fba_rxns).length === 0) {
                        addFBAResults = false;
                    } else {
                        addFBAResults = true;
                    }
                }

                // color flux depending on rxns found for each fba
                if (addFBAResults) {
                    const w = rxn.w / self.fbas.length;

                    // for each fba result
                    for (let j = 0; j < fba_rxns.length; j++) {
                        const found_rxn = fba_rxns[j];
                        const rect = group
                            .append('rect')
                            .attr('class', 'rxn-divider-stroke')
                            .attr('x', () => {
                                if (j === 0) {
                                    return x + w * j + 1;
                                }
                                return x + w * j;
                            })
                            .attr('y', y + 1)
                            .attr('width', () => {
                                if (j === count) {
                                    return w;
                                }
                                return w + 1;
                            })
                            .attr('height', h - 1.5);

                        let flux;

                        // there may be more than one fba result on a box,
                        // so find the largest magnitude flux
                        if (found_rxn.length > 0) {
                            flux = found_rxn[0].value;
                            for (let k = 1; k < found_rxn.length; k++) {
                                if (Math.abs(found_rxn[k].value) > Math.abs(flux)) {
                                    flux = found_rxn[k].value;
                                }
                            }

                            if (Math.abs(flux) > 499) {
                                lightLabel = true;
                            }
                        }

                        if (typeof flux !== 'undefined') {
                            const color = config.getColor(flux, useAbsFlux);
                            if (color) {
                                rect.attr('fill', color);
                            } else {
                                rect.attr('fill', config.geneColor);
                            }
                        }


                        // Tooltip rendering has been disabled (for some reason?), so don't even
                        // bother initializing them.
                        //var title = self.fbas[i].info[1];
                        // const title =
                        //     `<h5>${self.models[j].data.name}<br>` +
                        //     `<small>${self.models[j].data.source_id}</small></h5>`;
                        // tooltip(rect.node(), title, rxn, flux, self.fbas[j]);
                    }
                } // end fbas rects

                group
                    .append('text')
                    .attr('x', x + 2)
                    .attr('y', y + h / 2 + 6)
                    .text(rxn.name)
                    .attr('class', lightLabel ? 'rxn-label-light' : 'rxn-label');

                // Disabled, it doesn't do anything but strangely hide the text on a node
                // when hovered over...
                // $(group.node()).hover(
                //     function () {
                //         $(this)
                //             .find('text')
                //             .hide();
                //     },
                //     function () {
                //         $(this)
                //             .find('text')
                //             .show();
                //     }
                // );
            } // end loop
        }

        // function tooltip(container, title, mapRxn, flux) {
        //     // get substrates and products
        //     const subs = [];
        //     for (const i in mapRxn.substrate_refs) {
        //         subs.push(mapRxn.substrate_refs[i].compound_ref);
        //     }
        //     const prods = [];
        //     for (const i in mapRxn.product_refs) {
        //         prods.push(mapRxn.product_refs[i].compound_ref);
        //     }

        //     //content for tooltip
        //     const content =
        //         `<table class="table table-condensed">
        //             ${typeof flux !== 'undefined' ? `<tr><td><b>Flux</b></td><td>${flux}</td></tr>` : ''}
        //             <tr><td><b>Map RXN ID</b></td><td>${mapRxn.id}</td></tr>
        //             <tr><td><b>Rxns</b></td><td>${mapRxn.rxns.join(', ')}</td></tr>
        //             <tr><td><b>Substrates</b></td><td>${subs.join(', ')}</td></tr>
        //             <tr><td><b>Products</b></td><td>${prods.join(', ')}</td></tr>
        //          </table>`;


        //     // $(container).popover({html: true, content, animation: false, title, container: 'body', trigger: 'hover'});
        // }

        // Unused, disable
        // function drawCompounds() {
        //     for (const i in cpds) {
        //         const cpd = cpds[i];
        //         const r = cpd.w;
        //         const g = svg.append('g').attr('class', 'circle');
        //         const circle = g
        //             .append('circle')
        //             .attr('class', 'cpd')
        //             .attr('cx', cpd.x)
        //             .attr('cy', cpd.y)
        //             .attr('r', r);

        //         const content = `ID: ${  cpd.id  }<br>` + `kegg id: ${  cpd.name}`;
        //         //$(circle.node()).popover({html: true, content: content, animation: false,
        //         //                        container: 'body', trigger: 'hover'});
        //     }
        // }

        function drawConnections() {
            const node_ids = [];
            const nodes = [];
            const links = [];

            // draw connections from substrate to products
            for (const j in groups) {
                const group = groups[j];
                const group_rxn_ids = group.rxn_ids;
                const x = group.x;
                const y = group.y;
                let rxn;

                // get all model rxn objects for each rxn id in map
                let model_rxns = [];
                for (const i in rxns) {
                    if (group_rxn_ids.indexOf(rxns[i].id) !== -1) {
                        rxn = rxns[i];
                        model_rxns = model_rxns.concat(rxn.rxns);
                    }
                }

                // only need rxn object to get product_refs and substrate_refs
                // since there are groups of reactions
                const prods = rxn.product_refs;
                const subs = rxn.substrate_refs;

                // create substrate line (links)
                for (const i in subs) {
                    const sub_id = subs[i].id;

                    // find associated compound (for position)
                    for (const k in cpds) {
                        const cpd = cpds[k];

                        if (cpd.id !== sub_id) {
                            continue;
                        }

                        const id = cpd.id;

                        // if node has already been created,
                        // create link from that node.  Otherwise, create new node and link.
                        if (node_ids.indexOf(id) !== -1) {
                            // create link from existing node to next node
                            links.push({
                                source: node_ids.indexOf(id),
                                target: nodes.length,
                                value: 1,
                                cpd_id: id,
                                group_index: j,
                                rxns: model_rxns,
                                line_type: 'substrate'
                            });

                            // if there is a special path to draw the line on,
                            // draw nodes and links along path.
                            if (group.substrate_path) {
                                const path = group.substrate_path;
                                links.push({
                                    source: nodes.length,
                                    target: nodes.length + 1,
                                    value: 1,
                                    cpd_id: id,
                                    group_index: j,
                                    rxns: model_rxns,
                                    line_type: 'substrate'
                                });
                                for (let k = 1; k < path.length; k++) {
                                    nodes.push({x: path[k][0], y: path[k][1], fixed: true, style: 'point'});
                                    node_ids.push('null');
                                }
                            } else {
                                nodes.push({x, y, fixed: true, style: 'point'});
                                node_ids.push('null');
                            }
                        } else {
                            links.push({
                                source: nodes.length,
                                target: nodes.length + 1,
                                value: 1,
                                cpd_id: id,
                                group_index: j,
                                line_type: 'substrate',
                                rxns: model_rxns
                            });
                            nodes.push({
                                x: cpd.x,
                                y: cpd.y,
                                fixed: true,
                                type: 'compound',
                                name: cpd.label,
                                cpd_index: k,
                                rxns: model_rxns,
                                label_x: cpd.label_x,
                                label_y: cpd.label_y
                            });
                            nodes.push({x, y, fixed: true, style: 'reaction'});
                            node_ids.push(id);
                            node_ids.push('null');
                        }
                    }
                }

                // create product lines (links)
                for (const i in prods) {
                    const prod_id = prods[i].id;

                    for (const k in cpds) {
                        const cpd = cpds[k];

                        if (cpd.id !== prod_id) {
                            continue;
                        }

                        const id = cpd.id;

                        // if there is a special path to draw the line on,
                        // draw nodes and links along path.
                        if (node_ids.indexOf(id) !== -1) {
                            links.push({
                                source: nodes.length,
                                target: node_ids.indexOf(id),
                                value: 1,
                                type: 'arrow',
                                cpd_id: id,
                                group_index: j,
                                line_type: 'product',
                                rxns: model_rxns
                            });

                            if (group.product_path) {
                                const path = group.product_path;
                                links.push({
                                    source: nodes.length - 1,
                                    target: nodes.length,
                                    value: 1,
                                    cpd_id: id,
                                    group_index: j,
                                    line_type: 'product',
                                    rxns: model_rxns
                                });
                                for (let k = 1; k < path.length; k++) {
                                    nodes.push({x: path[k][0], y: path[k][1], fixed: true, style: 'point'});
                                    node_ids.push('null');
                                }
                            } else {
                                nodes.push({x, y, fixed: true, style: 'point'});
                                node_ids.push('null');
                            }
                        } else {
                            links.push({
                                source: nodes.length,
                                target: nodes.length + 1,
                                value: 1,
                                type: 'arrow',
                                cpd_id: id,
                                group_index: j,
                                line_type: 'product',
                                rxns: model_rxns
                            });
                            nodes.push({x, y, fixed: true, style: 'reaction'});
                            nodes.push({
                                x: cpd.x,
                                y: cpd.y,
                                fixed: true,
                                style: 'compound',
                                name: cpd.label,
                                cpd_index: k,
                                label_x: cpd.label_x,
                                label_y: cpd.label_y
                            });
                            node_ids.push('null');
                            node_ids.push(id);
                        }
                    }
                }
            }

            // the following does all the drawing
            const force = d3.layout
                .force()
                .nodes(nodes)
                .links(links)
                .charge(-400)
                .linkDistance(40)
                .on('tick', tick)
                .start();

            // define connections between compounds and reactions (nodes)
            const link = svg
                .selectAll('.link')
                .data(links)
                .enter()
                .append('g')
                .append('line')
                .attr('class', 'link');

            /*.style('stroke', function(d) {
             c = '#666';

             // if there is fba data, color lines

             if (self.fbas) {
             // fixme: this only works for one model
             var found_rxns = getFbaRxns(d.rxns)[0]

             var flux;
             if (found_rxns.length) {
             // fixme: only using first flux value from first model
             flux = 0
             for (var j in found_rxns) {
             if (Math.abs(found_rxns[j].value) > Math.abs(flux) ) {
             flux = found_rxns[j].value
             }
             }

             if (flux > flux_threshold) {
             var c = '#FF3333';
             } else if (-1*flux > flux_threshold) {
             var c = '#33AD33';
             }
             return c;
             }
             } else {
             return c;
             }
             })*/

            const node = svg
                .selectAll('.node')
                .data(nodes)
                .enter()
                .append('g')
                .attr('class', 'node')
                .call(force.drag);

            node.append('circle').attr('class', 'cpd');

            //fix me!  tranform dep?
            node.append('text')
                .attr('class', 'cpd-label')
                .attr('x', 10)
                .attr('dy', '.35em')
                .style('font-size', '8pt')
                .attr('transform', (d) => {
                    if (d.label_x || d.label_y) return `translate(${  d.label_x  },${  d.label_y  })`;
                })
                .text((d) => {
                    return d.name;
                });

            function tick() {
                link.attr('x1', (d) => {
                    return d.source.x;
                })
                    .attr('y1', (d) => {
                        return d.source.y;
                    })
                    .attr('x2', (d) => {
                        return d.target.x;
                    })
                    .attr('y2', (d) => {
                        return d.target.y;
                    })
                    .attr('marker-end', (d) => {
                        if (d.type === 'arrow') {
                            return 'url(#end-arrow)';
                        }
                        return '';

                    });

                node.attr('transform', (d) => {
                    return `translate(${  d.x  },${  d.y  })`;
                });

                // size the circles depending on kind of point
                node.select('circle').attr('r', (d) => {
                    if (d.style === 'point') return 0;
                    else if (d.style === 'reaction') return 1;
                    return 7;
                });
            }
        } // end draw connections

        function drawMapLinks() {
            for (let i = 0; i < mapLinks.length; i++) {
                const map = mapLinks[i];

                const x = map.x - map.w / 2,
                    y = map.y - map.h / 2,
                    w = parseInt(map.w, 10) + 2,
                    h = parseInt(map.h, 10) + 2;

                if (x > max_x) max_x = x + w + c_pad;
                if (y > max_y) max_y = y + h + c_pad;

                const group = svg.append('g');

                // draw reactions (rectangles)
                group
                    .append('rect')
                    .attr('class', 'map')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', w)
                    .attr('height', h);

                group
                    .append('text')
                    .attr('class', 'map-label')
                    .style('font-size', '8pt')
                    .text(map.name)
                    .attr('x', x + 2)
                    .attr('y', y + 10)
                    .call(wrap, w + 2);
            }
        }

        // xss ignore
        function wrap(text, width) {
            //var dy = 3;
            const dy = 0;

            text.each(function () {
                const text = d3.select(this),
                    words = text
                        .text()
                        .split(/\s+/)
                        .reverse(),
                    lineHeight = 1.1, // ems
                    y = text.attr('y'),
                    x = text.attr('x');
                let tspan = text
                    .text(null)
                    .append('tspan')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', `${dy  }em`);
                let word, line = [], lineNumber = 0;

                while ((word = words.pop())) {
                    line.push(word);
                    tspan.text(line.join(' '));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(' '));
                        line = [word];
                        tspan = text
                            .append('tspan')
                            .attr('x', x)
                            .attr('y', y)
                            .attr('dy', `${++lineNumber * lineHeight + dy  }em`)
                            .text(word);
                    }
                }
            });
        }

        function getModelRxns(rxn_ids) {
            // get a list of rxn objects (or undefined)
            // for each model supplied

            // this is a list of lists, where is list are rxnobjs
            // for each model for a given set of rxn_ids.  phew.
            const found_rxns = [];

            // for each model, look for model data
            for (const j in self.models) {
                const model = self.models[j];
                const rxn_objs = model.modelreactions;

                // see if we can find the rxn in that model's list of reactions
                const found_rxn = [];
                for (const i in rxn_objs) {
                    const rxn_obj = rxn_objs[i];
                    if (rxn_ids.indexOf(rxn_obj.id.split('_')[0]) !== -1) {
                        found_rxn.push(rxn_obj);
                    }
                }

                found_rxns.push(found_rxn); // either an raction object or undefined
            }

            return found_rxns;
        }

        function getFbaRxns(rxn_ids) {
            // get a list of fba arrays (or undefined)
            // for each model supplied
            const found_rxns = [];

            // for each fba, look for model data
            for (let j = 0; j < self.fbas.length; j++) {
                const fba = self.fbas[j];
                //if (!fba) continue;
                const fba_objs = fba.FBAReactionVariables;

                // see if we can find the rxn in that fbas's list of reactions
                const found_rxn = [];

                for (const i in fba_objs) {
                    const fba_obj = fba_objs[i];

                    // yeeeeep...
                    if (
                        rxn_ids.indexOf(
                            fba_obj.modelreaction_ref
                                .split('/')
                                .pop()
                                .split('_')[0]
                        ) !== -1
                    )
                        found_rxn.push(fba_obj);
                }

                found_rxns.push(found_rxn); // either an reaction object or undefined
            }
            return found_rxns;
        }

        // Not used, disabled
        // function zoom() {
        //     const margin = {top: -5, right: -5, bottom: -5, left: -5},
        //         width = 960 - margin.left - margin.right,
        //         height = 500 - margin.top - margin.bottom;

        //     const zoom = d3.behavior
        //         .zoom()
        //         .scaleExtent([1, 10])
        //         .on('zoom', zoomed);

        //     d3.behavior
        //         .drag()
        //         .origin((d) => {
        //             return d;
        //         })
        //         .on('dragstart', dragstarted)
        //         .on('drag', dragged)
        //         .on('dragend', dragended);

        //     //var svg = d3.select("body").append("svg")
        //     //    .attr("width", width + margin.left + margin.right)
        //     //   .attr("height", height + margin.top + margin.bottom)
        //     //  .append("g")
        //     //    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
        //     //   .call(zoom);
        //     svg.call(zoom);

        //     svg
        //         .append('rect')
        //         .attr('width', width)
        //         .attr('height', height)
        //         .style('fill', 'none')
        //         .style('pointer-events', 'all');

        //     const container = svg.append('g');

        //     container
        //         .append('g')
        //         .attr('class', 'x axis')
        //         .selectAll('line')
        //         .data(d3.range(0, width, 10))
        //         .enter()
        //         .append('line')
        //         .attr('x1', (d) => {
        //             return d;
        //         })
        //         .attr('y1', 0)
        //         .attr('x2', (d) => {
        //             return d;
        //         })
        //         .attr('y2', height);

        //     container
        //         .append('g')
        //         .attr('class', 'y axis')
        //         .selectAll('line')
        //         .data(d3.range(0, height, 10))
        //         .enter()
        //         .append('line')
        //         .attr('x1', 0)
        //         .attr('y1', (d) => {
        //             return d;
        //         })
        //         .attr('x2', width)
        //         .attr('y2', (d) => {
        //             return d;
        //         });

        //     /*
        //      d3.tsv("dots.tsv", dottype, function(error, dots) {
        //      dot = container.append("g")
        //      .attr("class", "dot")
        //      .selectAll("circle")
        //      .data(dots)
        //      .enter().append("circle")
        //      .attr("r", 5)
        //      .attr("cx", function(d) { return d.x; })
        //      .attr("cy", function(d) { return d.y; })
        //      .call(drag);
        //      });*/

        //     // unused, disabled
        //     // function dottype(d) {
        //     //     d.x = +d.x;
        //     //     d.y = +d.y;
        //     //     return d;
        //     // }

        //     function zoomed() {
        //         container.attr('transform', `translate(${  d3.event.translate  })scale(${  d3.event.scale  })`);
        //     }

        //     function dragstarted(d) {
        //         d3.event.sourceEvent.stopPropagation();
        //         d3.select(this).classed('dragging', true);
        //     }

        //     function dragged(d) {
        //         d3.select(this)
        //             .attr('cx', (d.x = d3.event.x))
        //             .attr('cy', (d.y = d3.event.y));
        //     }

        //     function dragended(d) {
        //         d3.select(this).classed('dragging', false);
        //     }
        // }

        function editable() {
            const edit_opts = $(
                `<div class="map-opts pull-left">
                              <!--<button class="btn btn-primary btn-edit-map">Edit Map</button>-->
                              <button class="btn btn-default btn-map-opts">Options <div class="caret"></div></button>
                              <!--<button class="btn btn-default btn-map-cancel">Done</button>-->
                              <button class="btn btn-default btn-map-save">Save</button>
                           </div>
                           <span class="mouse-pos pull-right">
                                <span id="ele-type"></span>
                               x: <span id="x-pos">0</span>
                               y: <span id="y-pos">0</span>
                           </span>
                           <br><br>`
            );

            const opts = $(
                `<div class="opts-dd">Display:
                    <div class="checkbox">
                        <label><input type="checkbox" data-type="rxn-label" checked="checked">Enzymes Labels</label>
                    </div>
                    <div class="checkbox">
                        <label><input type="checkbox" data-type="rect" value="" checked="checked">Enzymes</label>
                    </div>
                    <div class="checkbox">
                        <label><input type="checkbox" data-type="circle" checked="checked">Compounds</label>
                    </div>
                    <div class="checkbox">
                        <label><input type="checkbox" data-type="line" checked="checked">Lines</label>
                    </div>
                    <div class="checkbox">
                        <label><input type="checkbox" data-type="cpd-label" checked="checked">Compound Labels</label>
                    </div>
                    </div>`
            );

            // display x, y coordinates (on top left)
            svg.on('mousemove', function () {
                const c = d3.mouse(this);
                const x = c[0];
                const y = c[1];
                $('#x-pos').text(x);
                $('#y-pos').text(y);
            });
            // xss safe
            container.prepend(edit_opts);

            // event for options
            $('.btn-map-opts').popover({
                html: true,
                content: opts,
                animation: false,
                container: 'body',
                trigger: 'click',
                placement: 'bottom'
            });
            $('.btn-map-opts').click(() => {
                opts.find('input').unbind('change');
                opts.find('input').change(function () {
                    const type = $(this).data('type');
                    const checked = $(this).attr('checked') === 'checked';

                    if (checked) {
                        svg.selectAll(`.${  type}`).style('display', 'none');
                        $(this).attr('checked', false);
                    } else {
                        svg.selectAll(`.${  type}`).style('display', 'block');
                        $(this).attr('checked', true);
                    }
                });
            });

            // drag event
            const drag = d3.behavior
                .drag()
                .on('dragstart', () => {
                    d3.event.sourceEvent.stopPropagation();
                })
                .on('drag', function () {
                    dragmove(this);
                });

            svg.selectAll('.link').on('click', function () {
                $('.first, .last, .middle').remove();
                editLine(this);
                edit_opts.find('.btn-map-save').addClass('btn-primary');
            });

            svg.selectAll('.cpd-label').on('click', function () {
                $('.first, .last, .middle').remove();
                editLabel(this);
                edit_opts.find('.btn-map-save').addClass('btn-primary');
            });

            edit_opts.find('.btn-map-cancel').click(() => {
                //$('.first, .second, .middle').remove()
            });

            edit_opts.find('.btn-map-save').click(() => {
                saveMap();
            });

            function editLabel(label) {
                label = d3.select(label).call(drag);
                label.attr('fill', config.highlight).attr('class', 'edited-label');
            }

            function editLine(line) {
                line = d3.select(line);

                // highlight line
                line.attr('stroke', config.highlight)
                    .attr('fill', config.highlight)
                    .attr('stroke-width', 2);

                // getting start and end of line
                const x1 = line.attr('x1'),
                    y1 = line.attr('y1'),
                    x2 = line.attr('x2'),
                    y2 = line.attr('y2');
                const g = line.node().parentNode;

                // start, draggalbe circle
                d3
                    .select(g)
                    .append('g')
                    .attr('transform', `translate(${  x1  },${  y1  })`)
                    .attr('class', 'first')
                    .call(drag)
                    .append('circle')
                    .attr({
                        r: 0
                    })
                    .attr('class', 'line-start')
                    .transition()
                    .duration(750)
                    .ease('elastic')
                    .attr('r', 8);

                // end, dragable circle
                d3
                    .select(g)
                    .append('g')
                    .attr('transform', `translate(${  x2  },${  y2  })`)
                    .attr('class', 'last')
                    .call(drag)
                    .append('circle')
                    .attr({
                        r: 0
                    })
                    .attr('class', 'line-end')
                    .transition()
                    .duration(750)
                    .ease('elastic')
                    .attr('r', 8);

                // when clicking on selected line, divide into two lines.
                line.on('click', function () {
                    // add class to denoted edited lines
                    d3.select(g).attr('class', 'edited-line');

                    d3.event.stopPropagation();
                    // get position of new circle
                    const x = d3.mouse(this)[0];
                    const y = d3.mouse(this)[1];

                    const type = d3.select(this).data()[0].type;

                    // remove old line
                    d3.select(this).remove();

                    // add new lines
                    d3
                        .select(g)
                        .append('line')
                        .attr('class', 'line1')
                        .attr('x1', x1)
                        .attr('y1', y1)
                        .attr('x2', x)
                        .attr('y2', y);

                    const line2 = d3
                        .select(g)
                        .append('line')
                        .attr('class', 'line2')
                        .attr('x1', x)
                        .attr('y1', y)
                        .attr('x2', x2)
                        .attr('y2', y2);

                    if (type === 'arrow') {
                        line2.attr('marker-end', 'url(#end-arrow)');
                    }

                    // to be stored
                    // Not used, disabled
                    // const wayPoints = [[x1, y1], [x, y], [x2, y2]];

                    // mid, draggable circle
                    d3
                        .select(g)
                        .append('g')
                        .attr('transform', `translate(${  x  },${  y  })`)
                        .attr('class', 'middle')
                        .call(drag)
                        .append('circle')
                        .attr({
                            r: 0
                        })
                        .attr('class', 'line-middle')
                        .transition()
                        .duration(750)
                        .ease('elastic')
                        .attr('r', 8);
                });
            }
        }

        function saveMap() {
            const new_map = $.extend({}, self.map_data),
                self = this;

            // get data on edited lines
            const g = svg.selectAll('.edited-line');
            g.each(function () {
                const l1 = d3.select(this).select('.line1');
                const l2 = d3.select(this).select('.line2');
                // Not used, disabled
                // const cpd_id = l1.data()[0].cpd_id;
                const group_index = l1.data()[0].group_index;
                const line_type = l1.data()[0].line_type;

                const x1 = parseInt(l1.attr('x1'), 10);
                const y1 = parseInt(l1.attr('y1'), 10);
                const x = parseInt(l1.attr('x2'), 10);
                const y = parseInt(l1.attr('y2'), 10);
                const x2 = parseInt(l2.attr('x2'), 10);
                const y2 = parseInt(l2.attr('y2'), 10);

                const path = [[x1, y1], [x, y], [x2, y2]];

                const groups = new_map.groups;
                if (line_type === 'substrate') {
                    groups[group_index]['substrate_path'] = path;
                } else if (line_type === 'product') {
                    groups[group_index]['product_path'] = path;
                }
            });

            // get data on edited compound labels
            const labels = svg.selectAll('.edited-label');
            labels.each(function () {
                const l = d3.select(this);

                const transform = l.attr('transform');

                // if label hasn't been moved, don't save
                if (!transform) {
                    return;
                }

                const x = parseInt(transform.split(',')[0].split('(')[1], 10);
                const y = parseInt(transform.split(',')[1].split(')')[0], 10);
                const cpd_index = l.data()[0].cpd_index;

                const cpds = new_map.compounds;
                cpds[cpd_index].label_x = x;
                cpds[cpd_index].label_y = y;
            });

            // have to get meta data to resave object
            self.workspaceClient
                .get_object_info([
                    {
                        workspace: self.workspace,
                        name: self.map_name
                    }
                ])
                .then((data) => {
                    const metadata = data[0][10];
                    // saving object to workspace
                    return self.workspaceClient.save_object({
                        workspace: self.workspace,
                        data: new_map,
                        id: self.map_name,
                        type: 'KBaseBiochem.MetabolicMap',
                        metadata
                    });
                })
                .then(() => {
                    const msg = $('<div class="alert alert-success pull-left">Saved.</div>');
                    msg.css('padding', '7px'); // one exception for putting this in js
                    msg.css('margin-left', '10px');
                    msg.css('margin-bottom', 0);
                    // xss safe
                    container.find('.map-opts').after(msg);
                    msg.delay(3000).fadeOut(500);

                    // redraw map
                    self.drawMap();
                    return null;
                })
                .catch((e) => {
                    // xss safe
                    container.prepend($errorAlert(e));
                });
        }

        //Drag handler
        function dragmove(d) {
            const x = d3.event.x;
            const y = d3.event.y;
            d3.select(d).attr('transform', `translate(${  x  },${  y  })`);

            if (d3.select(d).attr('class') === 'first') {
                d3.select(d.parentNode)
                    .select('line')
                    .attr('x1', x);
                d3.select(d.parentNode)
                    .select('line')
                    .attr('y1', y);
            } else if (d3.select(d).attr('class') === 'middle') {
                d3.select(d.parentNode)
                    .select('.line1')
                    .attr('x2', x);
                d3.select(d.parentNode)
                    .select('.line1')
                    .attr('y2', y);
                d3.select(d.parentNode)
                    .select('.line2')
                    .attr('x1', x);
                d3.select(d.parentNode)
                    .select('.line2')
                    .attr('y1', y);
            } else {
                d3.select(d.parentNode)
                    .select('line')
                    .attr('x2', x);
                d3.select(d.parentNode)
                    .select('line')
                    .attr('y2', y);
            }
        }

        // Not used, disabled
        // function splines() {
        //     const width = 960,
        //         height = 500;

        //     const points = d3.select('line').each(function () {
        //         const x1 = d3.select(this).attr('x1');
        //         const y1 = d3.select(this).attr('y1');
        //         svg.append();
        //         d3.select(this).attr('class', 'special');
        //         return [x1, y1];
        //     });

        //     /*
        //      var points = d3.range(1, 5).map(function(i) {
        //      return [i * width / 5, 50 + Math.random() * (height - 100)];
        //      });*/

        //     let dragged = null,
        //         selected = points[0];

        //     const line = d3.select('line');

        //     /*
        //      var svg = d3.select('.panel-body').append("svg")
        //      .attr("width", width)
        //      .attr("height", height)
        //      .attr("tabindex", 1);
        //      */
        //     svg.append('rect')
        //         .attr('fill', 'none')
        //         .attr('width', width)
        //         .attr('height', height)
        //         .on('mousedown', mousedown);

        //     svg.append('path')
        //         .datum(points)
        //         .attr('class', 'line')
        //         .attr('fill', 'none')
        //         .attr('stroke', 'steelblue')
        //         .attr('stroke-width', 2)
        //         .call(redraw);

        //     d3.select(window)
        //         .on('mousemove', mousemove)
        //         .on('mouseup', mouseup)
        //         .on('keydown', keydown);

        //     d3.select('#interpolate')
        //         .on('change', change)
        //         .selectAll('option')
        //         .data([
        //             'linear',
        //             'step-before',
        //             'step-after',
        //             'basis',
        //             'basis-open',
        //             'basis-closed',
        //             'cardinal',
        //             'cardinal-open',
        //             'cardinal-closed',
        //             'monotone'
        //         ])
        //         .enter()
        //         .append('option')
        //         .attr('value', (d) => {
        //             return d;
        //         })
        //         .text((d) => {
        //             return d;
        //         });

        //     svg.node().focus();

        //     function redraw() {
        //         svg.select('path').attr('d', line);

        //         const circle = svg.selectAll('.special').data(points, (d) => {
        //             return d;
        //         });

        //         circle
        //             .enter()
        //             .append('circle')
        //             .attr('r', 1e-6)
        //             .on('mousedown', (d) => {
        //                 selected = dragged = d;
        //                 redraw();
        //             })
        //             .transition()
        //             .duration(750)
        //             .ease('elastic')
        //             .attr('r', 6.5);

        //         circle
        //             .classed('selected', (d) => {
        //                 return d === selected;
        //             })
        //             .attr('cx', (d) => {
        //                 return d[0];
        //             })
        //             .attr('cy', (d) => {
        //                 return d[1];
        //             });

        //         circle.exit().remove();

        //         if (d3.event) {
        //             d3.event.preventDefault();
        //             d3.event.stopPropagation();
        //         }
        //     }

        //     function change() {
        //         line.interpolate(this.value);
        //         redraw();
        //     }

        //     function mousedown() {
        //         points.push((selected = dragged = d3.mouse(svg.node())));
        //         redraw();
        //     }

        //     function mousemove() {
        //         if (!dragged) {
        //             return;
        //         }
        //         const m = d3.mouse(svg.node());
        //         dragged[0] = Math.max(0, Math.min(width, m[0]));
        //         dragged[1] = Math.max(0, Math.min(height, m[1]));
        //         redraw();
        //     }

        //     function mouseup() {
        //         if (!dragged) return;
        //         mousemove();
        //         dragged = null;
        //     }

        //     function keydown() {
        //         if (!selected) return;
        //         switch (d3.event.keyCode) {
        //         case 8: // backspace
        //         case 46: {
        //             // delete
        //             const i = points.indexOf(selected);
        //             points.splice(i, 1);
        //             selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
        //             redraw();
        //             break;
        //         }
        //         }
        //     }
        // }

        function drawMap() {
            // xss safe usage of html
            container.html('');

            svg = d3
                .select(`#${  params.elem}`)
                .append('svg')
                .attr('width', 800)
                .attr('height', 1000);

            // add arrow markers for use
            svg.append('svg:defs')
                .selectAll('marker')
                .data(['end']) // Different link/path types can be defined here
                .enter()
                .append('svg:marker') // This section adds in the arrows
                .attr('id', 'end-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 16)
                .attr('refY', 0)
                .attr('markerWidth', 10)
                .attr('markerHeight', 10)
                .attr('orient', 'auto')
                .attr('fill', '#666')
                .append('svg:path')
                .attr('d', 'M0,-5L10,0L0,5');

            svg.append('svg:defs')
                .append('svg:marker')
                .attr('id', 'start-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 4)
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M10,-5L0,0L10,5')
                .attr('fill', '#000');

            if (!usingImage) {
                drawConnections();
            }
            drawReactions();
            if (!usingImage) {
                drawMapLinks();
            }

            // addjust canvas size for map size //fixme: this could be precomputed
            svg.attr('width', max_x).attr('height', max_y);

            if (params.editable) {
                editable();
            }
        }

        this.render = function () {
            drawMap();
        };
    }

    return ModelSeedPathway;
});
