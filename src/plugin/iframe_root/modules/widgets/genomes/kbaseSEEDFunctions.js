/* Shows the SEED functional category hierarchy as a
 * collapsable/expandable bar chart
 *
 * Found a collapsable hierarcy example from Mike Bostock to follow:
 * https://gist.github.com/mbostock/1093025
 *
 * will adapt this to work with the KBase SEED annotations
 */
define([
    'jquery',
    'd3',
    'kb_service/client/workspace',

    // For effect
    'kbaseUI/widget/legacy/authenticatedWidget',
    'css!./kbaseSEEDFunctions'
], (
    $,
    d3,
    Workspace
) => {
    $.KBWidget({
        name: 'KBaseSEEDFunctions',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {
            objNameOrId: null,
            wsNameOrId: null,
            objVer: null,
            width: 900,
            genomeInfo: null
        },
        /*
            SEEDTree:{ "name":"Functional Categories", "count": 0, "children":[], "size":0, "x0":0, "y0":0 },
            subsysToGeneMap:[],
            maxCount:0,
            */
        SEEDTree: {},
        subsysToGeneMap: [],
        maxCount: 0,
        margin: {top: 30, right: 20, bottom: 30, left: 20},
        width: 920,
        barHeight: 20,
        barWidth: 400,
        stepSize: 8,
        svg: null,
        i: 0,
        duration: 400,
        root: null,
        tree: null,
        objName: '',
        wsName: '',
        /**
         * Initialize the widget.
         */
        init(options) {
            this._super(options);

            // init SEED
            this.SEEDTree = {name: 'Functional Categories', count: 0, children: [], size: 0, x0: 0, y0: 0};
            this.subsysToGeneMap = [];
            this.maxCount = 0;

            if (this.runtime.service('session').isLoggedIn()) {
                // if we are logged in, then somehow render gets called later...
            } else {
                // if we are not logged in, then render
                this.render();
            }

            return this;
        },
        /*
            I need to load the SEED subsystem ontology. I am going to use
            the "subsys.txt" file I found at:
            ftp.theseed.org/subsystems/subsys.txt

            Note that this file is updated weekly, but not versioned. It's
            possible that errors will arise because the subsystems assigned
            in the genome object are out of date relative to the current
            subsys.txt file.

            file format is:
            Level 1 \t Level 2 \t Level 3 \t Level 4\t Optional GO id \t Optional GO desc \n

            ontologyDepth is set to 4 for SEED

            SEED is not a strict heirarchy, some nodes have multiple parents
            I'm going to keep track of a nodes parents to map things right.

            to scale the graph, I'm going to keep track of the max count in the Level 1 of the
            hierarchy.

            maxCount - count in the largest Level 1 category

            loadSEEDHierarchy() function will parse file and populate the SEEDTree data structure
            */
        loadSEEDHierarchy() {
            const self = this;
            const ontologyDepth = 4; //this should be moved up to the global variables
            const nodeMap = {};

            const SEEDTree = self.SEEDTree;
            const subsysToGeneMap = self.subsysToGeneMap;
            const Level1 = [];

            //d3.text("assets/data/subsys.txt", function(text) {
            //d3.text("/static/subsys.txt", function(text) {
            d3.text(`${this.runtime.pluginResourcePath  }/data/subsys.txt`, (text) => {
                const data = d3.tsv.parseRows(text);
                let totalGenesWithFunctionalRoles = 0;
                let i, j, geneCount, nodeHierarchy, parentHierarchy, node, gene;

                for (i = 0; i < data.length; i += 1) {
                    geneCount = 0;
                    nodeHierarchy = '';
                    parentHierarchy = 'Functional Categories';
                    const functionName = data[i][3];
                    if (subsysToGeneMap[functionName] === undefined) {
                        // if barchart needs to only show the subsystems that have genes in this genome,
                        // uncomment the continue statement.
                        //continue;
                    } else {
                        geneCount = subsysToGeneMap[functionName].length;
                        totalGenesWithFunctionalRoles += subsysToGeneMap[functionName].length;
                    }

                    for (j = 0; j < ontologyDepth; j += 1) {
                        // some node names are an empty string "". I'm going to set these to
                        // a modified version of their parent node name
                        data[i][j] = data[i][j] === '' ? `--- ${  data[i][j - 1]  } ---` : data[i][j];
                        nodeHierarchy = `${parentHierarchy  }:${  data[i][j]}`;

                        // create new node for top level of hierarchy if it's not already defined.
                        if (j === 0) {
                            if (nodeMap[nodeHierarchy] === undefined) {
                                node = {name: data[i][j], size: 0, children: []};
                                SEEDTree.children.push(node);
                                nodeMap[nodeHierarchy] = node;
                                Level1[data[i][j]] = 0;
                            }
                            Level1[data[i][j]] += geneCount;
                        } else if (nodeMap[nodeHierarchy] === undefined) {
                            node = {name: data[i][j], size: 0, children: []};
                            nodeMap[parentHierarchy].children.push(node);
                            nodeMap[nodeHierarchy] = node;

                            if (j === ontologyDepth - 1 && subsysToGeneMap[data[i][j]] !== undefined) {
                                subsysToGeneMap[data[i][j]].forEach((f) => {
                                    gene = {name: f, size: ''};
                                    node.children.push(gene);
                                });
                            }
                        }
                        nodeMap[nodeHierarchy].size += geneCount;
                        parentHierarchy = nodeHierarchy;
                    }
                }

                if (totalGenesWithFunctionalRoles === 0) {
                    // xss safe
                    self.$mainview.prepend(
                        '<b>No Functional Categories assigned, you can add them using the Narrative.</b>'
                    );
                } else {
                    // Set maxCount to scale bars
                    let k;
                    for (k in Level1) {
                        self.maxCount = self.maxCount > Level1[k] ? self.maxCount : Level1[k];
                    }

                    $.when(
                        self.SEEDTree.children.forEach((d) => {
                            self.collapse(d);
                        })
                    ).done(self.update((self.root = self.SEEDTree)));
                }
            });
        },
        update(source) {
            const self = this;

            const nodes = self.tree.nodes(self.SEEDTree);

            const scale = d3.scale
                .linear()
                .domain([0, this.maxCount])
                .range([0, 275]);
            const height = Math.max(500, nodes.length * self.barHeight + self.margin.top + self.margin.bottom);

            d3.selectAll(this.$mainview)
                .select('svg')
                .transition()
                .duration(self.duration)
                .attr('height', height);

            d3.select(self.frameElement)
                .transition()
                .duration(self.duration)
                .style('height', `${height  }px`);

            // Compute the "layout".
            nodes.forEach((n, i) => {
                n.x = i * self.barHeight;
            });

            // Update the nodes…
            const node = self.svg.selectAll('g.KBSnode').data(nodes, (d) => {
                return d.id || (d.id = ++self.i);
            });

            const nodeEnter = node
                .enter()
                // xss safe
                .append('g')
                .attr('class', 'KBSnode')
                .attr('transform', () => {
                    return `translate(${  source.y0  },${  source.x0  })`;
                })
                .style('opacity', 1e-6)
                .on('mouseover', function () {
                    d3.select(this)
                        .selectAll('text, rect')
                        .style('font-weight', 'bold')
                        .style('font-size', '90%')
                        .style('stroke-width', '3px');
                })
                .on('mouseout', function () {
                    d3.select(this)
                        .selectAll('text, rect')
                        .style('font-weight', 'normal')
                        .style('font-size', '80%')
                        .style('stroke-width', '1.5px');
                });

            // Enter any new nodes at the parent's previous position.
            nodeEnter
                // xss safe
                .append('rect')
                .attr('y', -self.barHeight / 2)
                .attr('x', 300)
                .attr('height', self.barHeight)
                .attr('width', self.barWidth)
                .style('fill', self.color)
                .on(
                    'click',
                    $.proxy((d) => {
                        self.click(d);
                    }, self)
                );

            nodeEnter
                // xss safe
                .append('text')
                .attr('dy', 3.5)
                .attr('dx', 300 + 5.5)
                .text((d) => {
                    return d.name;
                });

            nodeEnter
                // xss safe
                .append('rect')
                .attr('y', -self.barHeight / 2)
                .attr('x', (d) => {
                    return 0 + 275 - scale(d.size) - d.depth * self.stepSize;
                })
                .attr('height', self.barHeight)
                .attr('width', (d) => {
                    return scale(d.size);
                })
                .style('fill', self.color)
                .on(
                    'click',
                    $.proxy((d) => {
                        self.click(d);
                    }, self)
                );

            nodeEnter
                // xss safe
                .append('text')
                .attr('dy', 3.5)
                .attr('x', 278)
                .text((d) => {
                    return d.name === 'Functional Categories' ? '' : d.size;
                });

            // Transition nodes to their new position.
            nodeEnter
                .transition()
                .duration(self.duration)
                .attr('transform', (d) => {
                    return `translate(${  d.y  },${  d.x  })`;
                })
                .style('opacity', 1);

            node.transition()
                .duration(self.duration)
                .attr('transform', (d) => {
                    return `translate(${  d.y  },${  d.x  })`;
                })
                .style('opacity', 1)
                .select('rect')
                .style('fill', self.color);

            // Transition exiting nodes to the parent's new position.
            node.exit()
                .transition()
                .duration(self.duration)
                .attr('transform', () => {
                    return `translate(${  source.y  },${  source.x  })`;
                })
                .style('opacity', 1e-6)
                .remove();

            // Stash the old positions for transition.
            nodes.forEach((d) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },
        // Toggle children on click.
        click(d) {
            // open window with gene landing page
            // if (d.children === undefined || (d._children === null && d.children === null)) {
            // The size is set to an empty string for navigable leaves
            if (d.size === '') {
                window.open(
                    `/#dataview/${
                        this.options.wsNameOrId
                    }/${
                        this.options.objNameOrId
                    }?sub=Feature&subid=${
                        d.name}`
                );
            }

            // expand tree
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }

            this.update(d);
        },
        color(d) {
            /*
                * leaf color is set here.
                * A parent node collapsed and a non-feature leaf without
                */
            // terminal feature nodes are distinguished by having a string as
            // the size. A 0 size node has no children, and just retains
            // the standard color.
            // nodes with children become darker when expanded. Expansion is
            // detected by the presense of _children -- which is used to store
            // the children when the parent is collapsed (and swapped to
            // .children when it is expanded.)
            // The feature leaf nodes are always white.
            if (typeof d.size === 'number') {
                if (d.size > 0) {
                    if (d._children) {
                        return '#c6dbef';
                    }
                    return '#3399ff';
                }
                return '#c6dbef';
            }
            return '#ffffff';
        },
        collapse(d) {
            const self = this;
            if (d.children) {
                d._children = d.children;
                d._children.forEach((n) => {
                    self.collapse(n);
                });
                d.children = null;
            }
        },
        getData() {
            return {
                title: 'Functional Categories ',
                id: this.options.objNameOrId,
                workspace: this.options.wsNameOrId
            };
        },
        render() {
            const self = this;
            self.showData(self.options.genomeInfo.data);
        },
        showData(genomeObj) {
            const margin = this.margin, width = this.width;

            const container = this.$elem;

            const SEEDTree = this.SEEDTree;
            const subsysToGeneMap = this.subsysToGeneMap;
            container.empty();
            const tax_domain = genomeObj.domain;

            // doesn't work for Euks yet
            if (tax_domain === 'Eukaryota') {
                // xss safe
                container.prepend(`<b>Functional Categories not yet available for ${tax_domain}</b>`);
                return this;
            }

            this.tree = d3.layout.tree().nodeSize([0, this.stepSize]);

            this.$mainview = $('<div>').css({'overflow-x': 'scroll'});
            // xss safe
            container.append(this.$mainview);

            this.svg = d3
                .select(this.$mainview[0])
                // xss safe
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                // xss safe
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            /*
                First I am going to iterate over the Genome Typed Object and
                create a mapping of the assigned functional roles (by SEED) to
                an array of genes with those roles.

                subsysToGeneMap [ SEED Role ] = Array of Gene Ids
                */
            genomeObj.features.forEach((feature) => {
                // Each function can have multiple genes, creating mapping of function to list of gene ids
                if (!feature.functions) {
                    if (feature.function) {
                        feature.functions = [feature.function];
                    } else {
                        return;
                    }
                }
                feature.function = feature.functions.join('<br>');

                feature.functions.forEach((functionName) => {
                    if (subsysToGeneMap[functionName] === undefined) {
                        subsysToGeneMap[functionName] = [];
                    }
                    subsysToGeneMap[functionName].push(feature.id);
                });

                // Not sure if this is necessary, but I'm going to keep track of the number of genes with
                // SEED assigned functions in this count variable.
                SEEDTree.count += 1;
            });

            this.loadSEEDHierarchy();
        },
        loggedInCallback(event, auth) {
            this.authToken = auth;
            this.wsClient = new Workspace(this.runtime.getConfig('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });
            this.render();
            return this;
        },
        loggedOutCallback() {
            this.authToken = null;
            this.wsClient = null;
            return this;
        }
    });
});
