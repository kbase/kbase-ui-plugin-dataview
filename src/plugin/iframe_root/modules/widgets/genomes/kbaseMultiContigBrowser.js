/**
 * @class KBaseContigBrowser
 *
 * A KBase widget that displays an interactive view of a single contig. It
 * comes with hooks for navigating up and downstream, and a number of
 * different view and styling options.
 *
 * Note: this relies on kbaseContigBrowser.css in order to be pretty.
 *
 *       @example
 *       // Setting up the browser:
 *       var browser = $("#browserDiv").KBaseContigBrowser({
 *                                           contig: "kb|g.0.c.1",
 *                                           centerFeature: "kb|g.0.peg.3742",
 *                                           start: <first base>,
 *                                           length: <default num bases>,
 *
 *                                           onClickFunction: function(feature) { ... },
 *                                           onClickUrl: "http://kbase.us/....",
 *                                           allowResize: true,
 *                                           svgWidth: <pixels>,
 *                                           svgHeight: <pixels>,
 *                                           trackMargin: <pixels>,
 *                                           trackThickness: <pixels>,
 *                                           leftMargin: <pixels>,
 *                                           topMargin: <pixels>,
 *                                           arrowSize: <pixels>
 *                                       });
 *
 *        // And making buttons to control it:
 *        $("#contigFirstBase").click(function() { genomeWidget.moveLeftEnd(); });
 *        $("#contigLastBase").click(function()  { genomeWidget.moveRightEnd(); });
 *        $("#contigStepPrev").click(function()  { genomeWidget.moveLeftStep(); });
 *        $("#contigStepNext").click(function()  { genomeWidget.moveRightStep(); });
 *        $("#contigZoomIn").click(function()    { genomeWidget.zoomIn(); });
 *        $("#contigZoomOut").click(function()   { genomeWidget.zoomOut(); });
 */

define([
    'jquery',
    'd3',
    'kb_common/html',
    'kbaseUI/widget/legacy/widget',
    'widgets/genomes/kbaseContigBrowserButtons'
], ($, d3, html) => {
    $.KBWidget({
        name: 'KBaseMultiContigBrowser',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            genomeID: null,
            workspaceID: null,
            contig: null,
            centerFeature: null,
            onClickUrl: null,
            allowResize: false,
            svgWidth: 500, // all numbers = pixels. Should follow window size
            //svgWidth: 600, // all numbers = pixels. Should follow window size
            //svgHeight: 60,
            svgHeight: 70,
            trackMargin: 5,
            //trackThickness: 15,
            trackThickness: 20,
            leftMargin: 5,
            topMargin: 20,
            //arrowSize: 10,
            arrowSize: 15,
            start: 1, // except these two - they're contig positions
            length: 16750, // Should follow window size

            embedInCard: false,
            showButtons: true,
            cardContainer: null,
            onClickFunction: null,
            //width: 550,                          // Should follow window size
            width: 525, // Should follow window size

            kbCache: null,
            genomeInfo: null
        },
        /** SEED ontology mappings
         //
         // NOTE: for now we're just going to use the first annotation in
         // subsystems_data, and first parent in each level of the hierarchy.
         //
         // seedOntology:  mapping from Role to 3 levels of parents in ontology,
         // each level is list of parents (non-unique), with level 0 the
         // broadest (e.g. "Carbohydrates"), level 1 whatever that's called,
         // level 2 the "Subsystem"s, and Role is level 3 and for convenience
         // in the code we map it to itself
         //
         // seedTermsUniq: an ordered list of the uniq terms at each level of
         // the ontology
         //
         // seedColors:  mapping for 4 levels of seed ontology to their order
         // (for consistency in coloring), with level 0 the broadest (e.g.
         // "Carbohydrates")
         */
        seedOntology: [],
        seedTermsUniq: [],
        seedColors: [],
        tooltip: null,
        operonFeatures: [],
        $messagePane: null,
        noContigs: 'No Contigs',
        genome: null,
        $selectPanel: null,
        $contigViewPanel: null,
        $featureInfoPanel: null,
        init(options) {
            this._super(options);

            const self = this;

            // 1. Check that needed options are present (basically contig)
            if (this.options.contig === null) {
                // throw an error.
            }

            this.$messagePane = $('<div/>');
            this.$elem.append(this.$messagePane);
            this.showMessage(html.loading('loading contig details'));

            const $maindiv = $('<div class="row"/>');

            // panel with contig selector
            this.$contigSelect = $('<select>')
                .addClass('form-control')
                .css({width: '60%', 'margin-right': '5px'})
                .append(
                    $('<option>')
                        .attr('value', this.noContigs)
                        .append(this.noContigs)
                );
            this.$contigSelect.change(function () {
                const contigId = $(this).val();
                if (contigId !== self.noContigs) {
                    self.contig = contigId;
                    self.options.contig = contigId;
                    self.render();
                }
            });
            this.$selectPanel = $('<div class="col-md-3"/>');
            this.$selectPanel.append(
                $('<div>')
                    .addClass('form-inline')
                    .append(this.$contigSelect)
                    .append(this.$contigButton)
            );
            $maindiv.append(this.$selectPanel);

            // panel where contig browser is defined
            const $contigViewPanelWrapper = $('<div class="col-md-6"/>');
            this.$contigViewPanel = $('<div id="contigmainview" align="center"/>').css({overflow: 'auto'});
            $contigViewPanelWrapper
                .append(this.$contigViewPanel)
                .append('<div>')
                .KBaseContigBrowserButtons({browser: self});

            $maindiv.append($contigViewPanelWrapper);

            // panel where feature info is displayed
            // safe usage of html()
            this.$featureInfoPanel = $('<div class="col-md-3"/>').html('<b>Click on a feature to view details</b>');
            $maindiv.append(this.$featureInfoPanel);

            self.showData(self.options.genomeInfo.data, $maindiv);

            if (!this.options.onClickFunction) {
                this.options.onClickFunction = function (svgobj, d) {
                    self.$featureInfoPanel.empty();
                    const $infoTable = $('<table>').addClass('table table-striped table-bordered');
                    if (d.id) {
                        $infoTable.append(
                            self.addInfoRow(
                                'Feature ID',
                                `<a href="/#dataview/${
                                    self.options.workspaceID
                                }/${
                                    self.options.genomeID
                                }?sub=Feature&subid=${
                                    d.id
                                }" target="_blank">${
                                    d.id
                                }</a>`
                            )
                        );
                    }
                    if (d.type) {
                        $infoTable.append(self.addInfoRow('Type', d.type));
                    }
                    if (d.function) {
                        $infoTable.append(self.addInfoRow('Function', d.function));
                    }

                    self.$featureInfoPanel.append($infoTable);
                };
            }
            return this;
        },
        showData(genome, $maindiv) {
            const self = this;
            self.genome = genome;
            const contigsToLengths = {};
            if (genome.contig_ids && genome.contig_ids.length > 0) {
                for (let i = 0; i < genome.contig_ids.length; i++) {
                    let len = 'Unknown';
                    if (genome.contig_lengths && genome.contig_lengths[i]) {
                        len = genome.contig_lengths[i];
                    }
                    contigsToLengths[genome.contig_ids[i]] = len;
                }
            } else if (genome.features && genome.features.length > 0) {
                /************
                 * TEMP CODE!
                 * INFER CONTIGS FROM FEATURE LIST!
                 * OMG THIS SUCKS THAT I HAVE TO DO THIS UNTIL FBA MODEL SERVICES IS FIXED!
                 * LOUD NOISES!
                 ************/
                for (let i = 0; i < genome.features.length; i++) {
                    const f = genome.features[i];
                    if (f.location && f.location[0][0]) {
                        contigsToLengths[f.location[0][0]] = 'Unknown';
                    }
                }
            }

            self.populateContigSelector(contigsToLengths);
            self.$elem.append($maindiv);

            self.hideMessage();

            // can't seem to get this working!  it always sizes it wrong, but I don't know why
            if (genome.contig_ids.length > 0) {
                self.contig = genome.contig_ids[0];
                self.options.contig = genome.contig_ids[0];
                self.render();
            }
        },
        addInfoRow(a, b) {
            return `<tr><th>${  a  }</th><td>${  b  }</td></tr>`;
        },
        /**
         *
         */
        render() {
            this.loading(false);
            const self = this;
            self.$contigViewPanel.empty();

            // tooltip inspired from
            // https://gist.github.com/1016860
            this.tooltip = d3
                .select('body')
                .append('div')
                .classed('kbcb-tooltip', true);

            // Init the SVG container to be the right size.
            this.svg = d3
                .select(self.$contigViewPanel[0])
                .append('svg')
                .attr('width', this.options.svgWidth)
                .attr('height', this.options.svgHeight)
                .classed('kbcb-widget', true);

            this.trackContainer = this.svg.append('g');

            this.xScale = d3.scale
                .linear()
                .domain([this.options.start, this.options.start + this.options.length])
                .range([0, this.options.svgWidth]);

            this.xAxis = d3.svg
                .axis()
                .scale(this.xScale)
                .orient('top')
                .tickFormat(d3.format(',.0f'));

            this.axisSvg = this.svg
                .append('g')
                .attr('class', 'kbcb-axis')
                .attr('transform', `translate(0, ${  this.options.topMargin  })`)
                .call(this.xAxis);

            // load SEED info
            this.loadSeedOntology(this.wait_for_seed_load);

            return this;
        },
        wait_for_seed_load() {
            this.assignSeedColors(this.seedTermsUniq);

            const self = this;

            this.setWorkspaceContig(self.options.workspaceID, self.options.genomeID, self.options.contig);

            // Kickstart the whole thing
            if (this.options.centerFeature !== null) {
                this.setCenterFeature(this.options.centerFeature);
            }

            return true;
        },
        populateContigSelector(contigsToLengths) {
            this.$contigSelect.empty();
            if (!contigsToLengths || contigsToLengths.length === 0)
                this.$contigSelect.append(
                    $('<option>')
                        .attr('value', this.noContigs)
                        .append(this.noContigs)
                );
            for (const contig in contigsToLengths) {
                this.$contigSelect.append(
                    $('<option>')
                        .attr('value', contig)
                        .append(`${contig  } - ${  contigsToLengths[contig]  } bp`)
                );
            }
        },
        /**
         * An internal class used to define and calculate which features belong on which tracks.
         * A 'track' in this case is a horizontal representation of features on a contig. If
         * two features overlap on the contig, then they belong on separate tracks.
         *
         * This is only used internally to shuffle the features and avoid visual overlapping.
         */
        track() {
            const that = {};

            that.regions = [];
            that.min = Number.POSITIVE_INFINITY;
            that.max = Number.NEGATIVE_INFINIITY;
            that.numRegions = 0;

            that.addRegion = function (feature_location) {
                for (let i = 0; i < feature_location.length; i++) {
                    let start = Number(feature_location[i][1]);
                    const length = Number(feature_location[i][3]);
                    let end = feature_location[i][2] === '+' ? start + length - 1 : start - length + 1;
                    if (start > end) {
                        const x = end;
                        end = start;
                        start = x;
                    }

                    this.regions.push([start, end]);
                    if (start < this.min) {
                        this.min = start;
                    }
                    if (end > this.max) {
                        this.max = end;
                    }
                    this.numRegions++;
                }
            };

            that.hasOverlap = function (feature_location) {
                for (let i = 0; i < feature_location.length; i++) {
                    let start = Number(feature_location[i][1]);
                    const length = Number(feature_location[i][3]);
                    let end = feature_location[i][2] === '+' ? start + length - 1 : start - length + 1;

                    // double check the orientation
                    if (start > end) {
                        const x = end;
                        end = start;
                        start = x;
                    }

                    /* cases:
                     * simple ones:
                     *  [start, end] [min]
                     *  [max] [start, end]
                     * less simple:
                     *  look over all regions
                     */
                    for (let ii = 0; ii < this.regions.length; ii++) {
                        const region = this.regions[ii];
                        if (!((start <= region[0] && end <= region[0]) || (start >= region[1] && end >= region[1])))
                            return true;
                    }
                }
                return false;
            };

            return that;
        },
        calcFeatureRange(loc) {
            const calcLocRange = function (loc) {
                let firstBase = Number(loc[1]);
                let lastBase = Number(loc[1]) + Number(loc[3]) - 1;
                if (loc[2] === '-') {
                    lastBase = firstBase;
                    firstBase -= Number(loc[3]) + 1;
                }
                return [firstBase, lastBase];
            };

            const range = calcLocRange(loc[0]);
            let nextRange;
            for (let i = 1; i < loc.length; i++) {
                nextRange = calcLocRange(loc[i]);
                if (nextRange[0] < range[0]) range[0] = nextRange[0];
                if (nextRange[1] > range[1]) range[1] = nextRange[1];
            }
            return range;
        },
        setWorkspaceContig(workspaceID, genomeID, contigId) {
            const self = this;
            if (contigId && this.options.contig !== contigId) {
                this.options.centerFeature = null;
                this.operonFeatures = [];
                this.options.contig = contigId;
            }

            // we already have the genome, so we don't have to get it again!
            // this should pre-parse the genome's contig into a map that it can handle.
            // no, this isn't ideal. it should stream things.
            // but the list of features is just that - a list. we'll need an api call, eventually, that
            // can fetch the list of features in some range.

            const genome = self.genome;

            this.contigLength = -1; // LOLOLOL.

            // Content lengths appear to come in two variants:
            // an Array, in which case the contig length is in the same position in which the contigId appears
            //   in the contig_ids array.
            // an Object, in which case the contig length is in a key under the contigid
            // TODO: Duck typing like this or type switching? At this point we don't have
            // the type info...
            if (genome.contig_lengths instanceof Array) {
                this.contigLength = genome.contig_lengths[genome.contig_ids.indexOf(contigId)];
            } else {
                this.contigLength = genome.contig_lengths[contigId];
            }

            // if (genome.contig_ids && genome.contig_ids.length > 0) {

            // }
            // indexed by first position.
            // takes into account direction and such.
            this.wsFeatureSet = {};
            for (let i = 0; i < genome.features.length; i++) {
                const f = genome.features[i];
                if (!f.location) {
                    continue;
                }
                if (f.location.length === 0) {
                    continue;
                }
                // assume it has at least one valid 4-tuple
                if (f.location[0][0] !== contigId) {
                    continue;
                }
                const range = this.calcFeatureRange(f.location);
                // store the range in the feature!
                // this HURTS MY SOUL to do, but we need to make workspace features look like CDMI features.
                f.feature_id = f.id;
                f.feature_type = f.type;
                f.feature_location = f.location;
                f.range = range;
                f.feature_function = f.function;
                this.wsFeatureSet[f.id] = f;

                if (range[1] > this.contigLength) {
                    this.contigLength = range[1];
                }
            }

            this.options.start = 0;
            if (this.options.length > this.contigLength) this.options.length = this.contigLength;

            if (this.options.centerFeature) {
                this.setCenterFeature();
            } else {
                this.update();
            }
        },

        setRange(start, length) {
            // set range and re-render
            this.options.start = start;
            this.options.length = length;
            this.update();
        },
        /*
         * Figures out which track each feature should be on, based on starting point and length.
         */
        processFeatures(features) {
            const tracks = [];
            tracks[0] = this.track(); //init with one track.

            // First, transform features into an array instead of an object.
            // eg., take it from {'fid' : <feature object>, 'fid' : <feature object> }
            // to [<feature object>, <feature object> ... ]

            const feature_arr = [];
            let fid;
            for (fid in features) {
                feature_arr.push(features[fid]);
            }

            features = feature_arr;

            // First, sort the features by their start location (first pass = features[fid].feature_location[0][1], later include strand)
            features.sort((a, b) => {
                return a.feature_location[0][1] - b.feature_location[0][1];
            });

            // Foreach feature...
            for (let j = 0; j < features.length; j++) {
                const feature = features[j];

                // Look for an open spot in each track, fill it in the first one we get to, and label that feature with the track.
                // var start = Number(feature.feature_location[0][1]);
                // var length = Number(feature.feature_location[0][3]);
                // var end;

                for (let i = 0; i < tracks.length; i++) {
                    if (!tracks[i].hasOverlap(feature.feature_location)) {
                        tracks[i].addRegion(feature.feature_location);
                        feature.track = i;
                        break;
                    }
                }
                // if our feature doesn't have a track yet, then they're all full in that region.
                // So make a new track and this feature to it!
                if (feature.track === undefined) {
                    const next = tracks.length;
                    tracks[next] = this.track();
                    tracks[next].addRegion(feature.feature_location);
                    feature.track = next;
                }
            }

            this.numTracks = tracks.length;
            return features;
        },
        update(useCenter) {
            const self = this;

            if (self.options.workspaceID && self.options.genomeID) {
                let region = [self.options.start, self.options.start + self.options.length - 1];

                if (self.options.centerFeature && useCenter) {
                    // make a region around the center and use it.
                    const f = this.wsFeatureSet[self.options.centerFeature];
                    if (f) {
                        self.options.start = Math.max(
                            0,
                            Math.floor(
                                parseInt(f.location[0][1], 10) + parseInt(f.location[0][3], 10) / 2 - self.options.length / 2
                            )
                        );
                        region = [self.options.start, self.options.start + self.options.length - 1];
                    }
                }
                const featureList = {};
                // Search across all features (I know...) and pull out those that map to the given range.
                for (const fid in this.wsFeatureSet) {
                    if (this.rangeOverlap(region, this.wsFeatureSet[fid].range)) {
                        featureList[fid] = this.wsFeatureSet[fid];
                    }
                }
                this.renderFromRange(featureList);
            }
        },
        /*
         * Compares two numerical ranges, r1 and r2, as ordered integers. r1[0] <= r1[1] and r2[0] <= r2[1].
         * Returns true if they overlap, false otherwise.
         */
        rangeOverlap(x, y) {
            /* cases
             * 1: No overlap
             * x0-------x1
             *                    y0----------y1
             *
             * 2. Overlap
             * x0--------------x1
             *          y0-------------y1
             *
             * 3. Overlap
             * x0------------------------------x1
             *          y0-------------y1
             *
             * 4. Overlap
             *          x0-------------x1
             * y0-------------y1
             *
             * 5. Overlap
             *          x0-------------x1
             * y0------------------------------y1
             *
             * 6. No overlap
             *                       x0----------x1
             * y0----------y1
             */

            if ((x[0] < y[0] && x[1] > y[0]) || (y[0] < x[0] && y[1] > x[0])) return true;
            return false;
        },
        adjustHeight() {
            const neededHeight =
                this.numTracks * (this.options.trackThickness + this.options.trackMargin) +
                this.options.topMargin +
                this.options.trackMargin;

            if (neededHeight > this.svg.attr('height')) {
                this.svg.attr('height', neededHeight);
            }
        },
        renderFromRange(features) {
            features = this.processFeatures(features);

            // expose 'this' to d3 anonymous functions through closure
            const self = this;

            if (this.options.allowResize) this.adjustHeight();

            const trackSet = this.trackContainer.selectAll('path').data(features, (d) => {
                return d.feature_id;
            });

            trackSet
                .enter()
                .append('path')
                .classed('kbcb-feature', true) // incl feature_type later (needs call to get_entity_Feature?)
                .classed('kbcb-operon', (d) => {
                    return self.isOperonFeature(d);
                })
                .classed('kbcb-center', (d) => {
                    return self.isCenterFeature(d);
                })
                .style('fill', (d) => {
                    return self.calcFillColorByProtAnnot(d, 0);
                })
                .attr('id', (d) => {
                    return d.feature_id;
                })
                .on('mouseover', function (d) {
                    d3.select(this).style('fill', d3.rgb(d3.select(this).style('fill')).darker());
                    self.tooltip = self.tooltip.text(`${d.feature_id  }: ${  d.feature_function}`);
                    return self.tooltip.style('visibility', 'visible');
                })
                .on('mouseout', function () {
                    d3.select(this).style('fill', d3.rgb(d3.select(this).style('fill')).brighter());
                    return self.tooltip.style('visibility', 'hidden');
                })
                .on('mousemove', () => {
                    return self.tooltip
                        .style('top', `${d3.event.pageY + 15  }px`)
                        .style('left', `${d3.event.pageX - 10  }px`);
                })
                .on('click', function (d) {
                    if (self.options.onClickFunction) {
                        self.options.onClickFunction(this, d);
                    } else {
                        self.highlight(this, d);
                    }
                });

            trackSet.exit().remove();

            trackSet.attr('d', (d) => {
                return self.featurePath(d);
            });

            self.xScale = self.xScale.domain([self.options.start, self.options.start + self.options.length]);

            self.xAxis = self.xAxis.scale(self.xScale);

            self.axisSvg.call(self.xAxis);

            self.resize();
            this.loading(true);
        },
        featurePath(feature) {
            let path = '';

            const coords = [];

            // draw an arrow for each location.
            for (let i = 0; i < feature.feature_location.length; i++) {
                const location = feature.feature_location[i];

                const left = this.calcXCoord(location);
                const top = this.calcYCoord(location, feature.track);
                const height = this.calcHeight(location);
                const width = this.calcWidth(location);

                coords.push([left, left + width]);

                if (location[2] === '+') path += `${this.featurePathRight(left, top, height, width)} `;
                else path += `${this.featurePathLeft(left, top, height, width)} `;
            }

            // if there's more than one path, connect the arrows with line segments
            if (feature.feature_location.length > 1) {
                // sort them
                coords.sort((a, b) => {
                    return a[0] - b[0];
                });

                const mid =
                    this.calcYCoord(feature.feature_location[0], feature.track) +
                    this.calcHeight(feature.feature_location[0]) / 2;

                for (let i = 0; i < coords.length - 1; i++) {
                    path += `M${  coords[i][1]  } ${  mid  } L${  coords[i + 1][0]  } ${  mid  } Z `;
                }
                // connect the dots
            }
            return path;
        },
        featurePathRight(left, top, height, width) {
            // top left
            let path = `M${  left  } ${  top}`;

            if (width > this.options.arrowSize) {
                // line to arrow top-back
                path +=
                    ` L${left + (width - this.options.arrowSize)} ${top /* line to arrow tip */} 
                      L${left + width } ${top + height / 2 /*line to arrow bottom-back*/} 
                      L${left + (width - this.options.arrowSize)} ${top + height /* line to bottom-left edge*/} 
                      L${left} ${top + height} Z`;
            } else {
                // line to arrow tip
                path +=
                    ` L${left + width} ${top + height / 2 /* line to arrow bottom */} 
                      L${left} ${top + height} Z`;
            }
            return path;
        },
        featurePathLeft(left, top, height, width) {
            // top right
            let path = `M${  left + width  } ${  top}`;

            if (width > this.options.arrowSize) {
                // line to arrow top-back
                path +=
                    ` L${
                        left + this.options.arrowSize
                    } ${
                        top
                    // line to arrow tip
                    } L${
                        left
                    } ${
                        top + height / 2
                    // line to arrow bottom-back
                    } L${
                        left + this.options.arrowSize
                    } ${
                        top + height
                    // line to bottom-right edge
                    } L${
                        left + width
                    } ${
                        top + height
                    } Z`;
            } else {
                // line to arrow tip
                path +=
                    ` L${
                        left
                    } ${
                        top + height / 2
                    // line to arrow bottom
                    } L${
                        left + width
                    } ${
                        top + height
                    } Z`;
            }
            return path;
        },
        calcXCoord(location) {
            let x = location[1];
            if (location[2] === '-') x = location[1] - location[3] + 1;

            return ((x - this.options.start) / this.options.length) * this.options.svgWidth; // + this.options.leftMargin;
        },
        calcYCoord(location, track) {
            return (
                this.options.topMargin +
                this.options.trackMargin +
                this.options.trackMargin * track +
                this.options.trackThickness * track
            );
        },
        calcWidth(location) {
            return Math.floor(((location[3] - 1) / this.options.length) * this.options.svgWidth);
        },
        calcHeight() {
            return this.options.trackThickness;
        },
        isCenterFeature(feature) {
            return feature.feature_id === this.options.centerFeature;
        },
        isOperonFeature(feature) {
            return feature.isInOperon;
        },
        calcFillColor(feature) {
            if (feature.feature_id === this.options.centerFeature) return '#00F';
            if (feature.isInOperon === 1) return '#0F0';
            return '#F00';
            // should return color based on feature type e.g. CDS vs. PEG vs. RNA vs. ...
        },
        calcFillColorByProtAnnot(feature, annot_num) {
            if (feature.feature_type !== 'CDS')
                // only paint protein coding
                return '#000';

            // SEED
            //
            // SEED has 4 levels of classification. We are defining 0 as broadest category (e.g. "Carbohydrates") and 3 as the Subsystem Role (e.g. "Beta-galactosidase (EC 3.2.1.23)")
            this.options.annot_namespace = 'SEED'; // should be input param
            //this.options.annot_level = 0;          // should be input param
            this.options.annot_level = 3; // should be input param
            return this.colorByAnnot(feature, this.options.annot_namespace, this.options.annot_level, annot_num);
        },
        colorByAnnot(feature, namespace, level /*, annot_num */) {
            if (namespace === 'SEED') {
                //if (! feature.subsystem_data)
                if (!feature.feature_function) {
                    return '#CCC';
                }
                //typedef tuple<string subsystem, string variant, string role> subsystem_data;
                //var seed_role_pos = 2;
                //return this.seedColorLookup (feature.subsystem_data[annot_num][seed_role_pos], level);
                const first_feature_function = feature.feature_function.replace(/\s+\/.+/, '').replace(/\s+#.*/, '');

                return this.seedColorLookup(first_feature_function, level);
            }

            //if (namespace === "COG") {
            //}
            //if (namespace === "PFAM") {
            //}
            //if (namespace === "TIGRFAM") {
            //}

            return '#CCC';
        },
        seedColorLookup(annot, level) {
            const self = this;

            // take first classification rather than go through list (save that fight for another day when we have multi-colored arrows)
            const alt_class_i = 0;
            //for (var alt_class_i=0; alt_class_i < this.seedOntology[annot][level].length; alt_class_i++) {

            if (self.seedOntology[annot] === undefined) return '#CCC';
            const seedClassification = self.seedOntology[annot][level][alt_class_i];
            //}

            return self.seedColors[level][seedClassification];
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

         loadSeedOntology() function will parse file and populate the seedOntology and seedTermsUniq data structures
         */
        loadSeedOntology(/* wait_for_seed_load */) {
            const seedOntology = this.seedOntology;
            const seedTermsUniq = this.seedTermsUniq;
            const self = this;
            const seedTermSeen = [];
            const ROLE_INDEX = 3;
            //var PARENT_DEPTH = 3;
            const ONTOLOGY_DEPTH = 4;

            // init seed term structures
            //seedTermSeen[ROLE_INDEX] = [];
            //seedTermsUniq[ROLE_INDEX] = [];
            //for (var j=0; j < PARENT_DEPTH; j++) {
            for (let j = 0; j < ONTOLOGY_DEPTH; j++) {
                seedTermSeen[j] = [];
                seedTermsUniq[j] = [];
            }

            // read subsys.txt into seedOntology and seedTermsUniq objs
            d3.text(`${this.runtime.pluginResourcePath}/data/subsys.txt`, (text) => {
                const data = d3.tsv.parseRows(text);

                let seedRole = '';
                for (let i = 0; i < data.length; i++) {
                    if (data[i][ROLE_INDEX] === '') continue;
                    seedRole = data[i][ROLE_INDEX];
                    if (seedOntology[seedRole] === undefined) seedOntology[seedRole] = [];
                    if (seedTermSeen[ROLE_INDEX][seedRole] === undefined) {
                        seedTermSeen[ROLE_INDEX][seedRole] = true;
                        seedTermsUniq[ROLE_INDEX].push(seedRole);
                    }
                    //for (j = 0; j < PARENT_DEPTH; j++) {
                    for (let j = 0; j < ONTOLOGY_DEPTH; j++) {
                        if (seedOntology[seedRole][j] === undefined) {
                            seedOntology[seedRole][j] = [];
                        }

                        // some node names are an empty string "".
                        // set to a modified version of their parent
                        data[i][j] = data[i][j] === '' ? `--- ${  data[i][j - 1]  } ---` : data[i][j];

                        seedOntology[seedRole][j].push(data[i][j]);

                        if (seedTermSeen[j][data[i][j]] === undefined) {
                            seedTermSeen[j][data[i][j]] = true;
                            seedTermsUniq[j].push(data[i][j]);
                        }
                    }
                }

                // wait to enforce completion of async d3 method
                self.wait_for_seed_load();
            });

            return true;
        },
        /*
         assign colors to seed ontology
         */
        assignSeedColors(seedTermsUniq) {
            const seedColors = this.seedColors;
            // there are 30 top level SEED categories.  Need 30 colors
            const colorWheel = [
                '#F00', // red              # carb
                '#900', // dark red         # respiration
                '#C30', // light brown      # nucleosides
                '#F60', // orange           # stress
                '#F90', // pumpkin          # protein metab
                '#FC0', // yellow           # regulation
                '#CF3', // yellow green     # cell wall
                '#9FC', // aqua             # misc
                '#9F9', // light green      # photosyn
                '#0C0', // green            # aromatics
                '#393', // darker green     # clust subsys
                '#060', // darkest green    # phosporus
                '#0F9', // blue green       # mobile elts 1
                '#0CF', // cyan             # secondary
                '#F39', // pink             # dormancy spore
                '#39F', // light blue       # amino acids
                '#69F', // light matte blue # iron
                '#36C', // matte blue       # mobile elts 2
                '#00F', // blue             # cell cycle
                '#33C', // dark blue        # membrane trans
                '#00C', // darkest blue     # nitrogen
                '#FC9', // tan              # sulfur
                '#96F', // violet           # dna metabolism
                '#C9F', // light violet     # cofactors
                '#60C', // dark violet      # fatty acids
                '#C0C', // magenta          # vir, dis, def
                '#F99', // light coral      # potassium
                '#F66', // dark coral       # motility
                '#909' // deep purple      # virulence
            ];
            const maxColor = colorWheel.length;
            const SEED_LEVELS = 4; // parents (3) + subsystem role col (1)

            for (let j = 0; j < SEED_LEVELS; j++) {
                if (seedColors[j] === undefined) seedColors[j] = [];
                for (let i = 0; i < seedTermsUniq[j].length; i++) {
                    seedColors[j][seedTermsUniq[j][i]] = colorWheel[i % maxColor];
                }
            }

            return true;
        },
        highlight(element, feature) {
            // unhighlight others - only highlight one at a time.
            // if ours is highlighted, recenter on it.

            this.recenter(feature);
            return; // skip the rest for now.
        },
        recenter(feature) {
            // var centerFeature = feature.feature_id;
            if (this.options.onClickUrl) this.options.onClickUrl(feature.feature_id);
            else this.update(true);
        },
        resize() {
            const newWidth = Math.min(this.$elem.parent().width(), this.options.svgWidth);
            this.svg.attr('width', newWidth);
        },
        moveLeftEnd() {
            this.options.start = 0;
            this.update();
        },
        moveLeftStep() {
            this.options.start = Math.max(0, this.options.start - Math.ceil(this.options.length / 2));
            this.update();
        },
        zoomIn() {
            this.options.start = Math.min(
                this.contigLength - Math.ceil(this.options.length / 2),
                this.options.start + Math.ceil(this.options.length / 4)
            );
            this.options.length = Math.max(1, Math.ceil(this.options.length / 2));
            this.update();
        },
        zoomOut() {
            this.options.length = Math.min(this.contigLength, this.options.length * 2);
            this.options.start = Math.max(0, this.options.start - Math.ceil(this.options.length / 4));
            if (this.options.start + this.options.length > this.contigLength) {
                this.options.start = this.contigLength - this.options.length;
            }
            this.update();
        },
        moveRightStep() {
            this.options.start = Math.min(
                this.options.start + Math.ceil(this.options.length / 2),
                this.contigLength - this.options.length
            );
            this.update();
        },
        /**
         * Moves the viewport to the right end (furthest downstream) of the contig, maintaining the
         * current view window size.
         * @method
         */
        moveRightEnd() {
            this.options.start = this.contigLength - this.options.length;
            this.update();
        },
        loading(doneLoading) {
            if (doneLoading) {
                this.hideMessage();
            } else {
                this.showMessage(html.loading());
            }
        },
        showMessage(message) {
            // kbase panel now does this for us, should probably remove this
            const span = $('<span/>').append(message);

            this.$messagePane
                .empty()
                .append(span)
                .show();
        },
        hideMessage() {
            // kbase panel now does this for us, should probably remove this
            this.$messagePane.hide();
        },
        getData() {
            return {
                type: 'Contig',
                id: this.options.contig,
                workspace: this.options.workspaceID,
                title: 'Contig Browser'
            };
        },
        renderError(error) {
            let errString = 'Sorry, an unknown error occurred';
            if (typeof error === 'string') errString = error;
            else if (error.error && error.error.message) errString = error.error.message;

            const $errorDiv = $('<div>')
                .addClass('alert alert-danger')
                .append('<b>Error:</b>')
                .append(`<br>${  errString}`);
            this.$elem.empty();
            this.$elem.append($errorDiv);
        },
        buildObjectIdentity(workspaceID, objectId) {
            const obj = {};
            if (/^\d+$/.exec(workspaceID)) obj['wsid'] = workspaceID;
            else obj['workspace'] = workspaceID;

            // same for the id
            if (/^\d+$/.exec(objectId)) obj['objid'] = objectId;
            else obj['name'] = objectId;
            return obj;
        }
    });
});
