/**
 * KBase widget to display a Metagenome
 */
define([
    'jquery',
    'googlepalette',
    'kb_service/client/workspace',
    'kb_common/html',
    'widgets/communities/kbStandaloneGraph',
    'widgets/communities/kbStandalonePlot',

    // these don't need a parameter
    'kbaseUI/widget/legacy/authenticatedWidget',
    'kbaseUI/widget/legacy/kbaseTabs',
    'datatables_bootstrap'
], ($, GooglePalette, Workspace, html, Graph, Plot) => {
    $.KBWidget({
        name: 'MetagenomeView',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        token: null,
        options: {
            id: null,
            ws: null
        },
        init(options) {
            this._super(options);
            return this;
        },
        render() {
            const self = this;
            const pref = this.uuidv4();

            const container = this.$elem;
            container.empty();
            if (self.token === null) {
                container.append('<div>[Error] You\'re not logged in</div>');
                return;
            }
            container.append(html.loading('loading data...'));

            const kbws = new Workspace(this.runtime.getConfig('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });
            kbws.get_objects(
                [{ref: `${self.options.ws  }/${  self.options.id}`}],
                (data) => {
                    container.empty();
                    // parse data
                    if (data.length === 0) {
                        const msg =
                            `[Error] Object ${  self.options.id  } does not exist in workspace ${  self.options.ws}`;
                        container.append(`<div><p>${  msg  }>/p></div>`);
                    } else {
                        // parse data
                        const d = data[0].data;

                        // get base numbers
                        const stats = d.statistics.sequence_stats;
                        const is_rna = d.sequence_type === 'Amplicon';
                        const raw_seqs = 'sequence_count_raw' in stats
                            ? parseFloat(stats.sequence_count_raw)
                            : 0;
                        const qc_rna_seqs = 'sequence_count_preprocessed_rna' in stats
                            ? parseFloat(stats.sequence_count_preprocessed_rna)
                            : 0;
                        const qc_seqs = 'sequence_count_preprocessed' in stats
                            ? parseFloat(stats.sequence_count_preprocessed)
                            : 0;
                        const rna_sims = 'sequence_count_sims_rna' in stats
                            ? parseFloat(stats.sequence_count_sims_rna)
                            : 0;
                        const r_clusts = 'cluster_count_processed_rna' in stats
                            ? parseFloat(stats.cluster_count_processed_rna)
                            : 0;
                        const r_clust_seq = 'clustered_sequence_count_processed_rna' in stats
                            ? parseFloat(stats.clustered_sequence_count_processed_rna)
                            : 0;
                        const ann_reads = 'read_count_annotated' in stats
                            ? parseFloat(stats.read_count_annotated)
                            : 0;
                        const aa_reads = 'read_count_processed_aa' in stats
                            ? parseFloat(stats.read_count_processed_aa)
                            : 0;

                        // first round math
                        let qc_fail_seqs = raw_seqs - qc_seqs;
                        let ann_rna_reads = rna_sims ? rna_sims - r_clusts + r_clust_seq : 0;
                        let ann_aa_reads = ann_reads && ann_reads > ann_rna_reads ? ann_reads - ann_rna_reads : 0;
                        let unkn_aa_reads = aa_reads - ann_aa_reads;
                        let unknown_all = raw_seqs - (qc_fail_seqs + unkn_aa_reads + ann_aa_reads + ann_rna_reads);
                        if (raw_seqs < qc_fail_seqs + ann_rna_reads) {
                            const diff = qc_fail_seqs + ann_rna_reads - raw_seqs;
                            unknown_all = diff > unknown_all ? 0 : unknown_all - diff;
                        }

                        // fuzzy math
                        if (is_rna) {
                            qc_fail_seqs = raw_seqs - qc_rna_seqs;
                            unkn_aa_reads = 0;
                            ann_aa_reads = 0;
                            unknown_all = raw_seqs - (qc_fail_seqs + ann_rna_reads);
                        } else {
                            if (unknown_all < 0) {
                                unknown_all = 0;
                            }
                            if (raw_seqs < qc_fail_seqs + unknown_all + unkn_aa_reads + ann_aa_reads + ann_rna_reads) {
                                const diff =
                                    qc_fail_seqs +
                                    unknown_all +
                                    unkn_aa_reads +
                                    ann_aa_reads +
                                    ann_rna_reads -
                                    raw_seqs;
                                unknown_all = diff > unknown_all ? 0 : unknown_all - diff;
                            }
                            if (
                                unknown_all === 0 &&
                                raw_seqs < qc_fail_seqs + unkn_aa_reads + ann_aa_reads + ann_rna_reads
                            ) {
                                const diff = qc_fail_seqs + unkn_aa_reads + ann_aa_reads + ann_rna_reads - raw_seqs;
                                unkn_aa_reads = diff > unkn_aa_reads ? 0 : unkn_aa_reads - diff;
                            }
                            if (
                                unknown_all === 0 &&
                                unkn_aa_reads === 0 &&
                                raw_seqs < qc_fail_seqs + ann_aa_reads + ann_rna_reads
                            ) {
                                const diff = qc_fail_seqs + ann_aa_reads + ann_rna_reads - raw_seqs;
                                ann_rna_reads = diff > ann_rna_reads ? 0 : ann_rna_reads - diff;
                            }
                        }

                        // set tabs
                        const tabPane = $(`<div id="${  pref  }tab-content">`);
                        container.append(tabPane);
                        tabPane.kbaseTabs({canDelete: false, tabs: []});

                        // overview tab
                        let oTabDiv = $(`<div id="${  pref  }overview">`);
                        tabPane.kbaseTabs('addTab', {
                            tab: 'Overview',
                            content: oTabDiv,
                            canDelete: false,
                            show: true
                        });
                        let overviewTable = '<h4>Info</h4>';
                        overviewTable += '<p><table class="table table-striped table-bordered" style="width: 50%;">';
                        overviewTable +=
                            `<tr><td style="padding-right: 25px; width: 165px;"><b>Metagenome ID</b></td><td>${
                                d.id
                            }</td></tr>`;
                        overviewTable +=
                            `<tr><td style="padding-right: 25px; width: 165px;"><b>Metagenome Name</b></td><td>${
                                d.name
                            }</td></tr>`;
                        overviewTable +=
                            `<tr><td style="padding-right: 25px; width: 165px;"><b>Project ID</b></td><td>${
                                d.metadata.project.id
                            }</td></tr>`;
                        overviewTable +=
                            `<tr><td style="padding-right: 25px; width: 165px;"><b>Project Name</b></td><td>${
                                d.metadata.project.name
                            }</td></tr>`;
                        overviewTable +=
                            `<tr><td style="padding-right: 25px; width: 165px;"><b>PI</b></td><td>${
                                d.metadata.project.data.PI_firstname
                            } ${
                                d.metadata.project.data.PI_lastname
                            }</td></tr>`;
                        overviewTable +=
                            `<tr><td style="padding-right: 25px; width: 165px;"><b>Organization</b></td><td>${
                                d.metadata.project.data.PI_organization
                            }</td></tr>`;
                        overviewTable +=
                            `<tr><td style="padding-right: 25px; width: 165px;"><b>Sequence Type</b></td><td>${
                                d.sequence_type
                            }</td></tr>`;
                        overviewTable += '</table></p>';
                        overviewTable += '<h4>Summary</h4>';
                        overviewTable +=
                            `<p>The dataset ${
                                d.name
                            } was uploaded on ${
                                d.created
                            } and contains ${
                                stats.sequence_count_raw
                            } sequences totaling ${
                                stats.bp_count_raw
                            } basepairs with an average length of ${
                                stats.average_length_raw
                            } bps.</p>`;
                        const ptext =
                            ` Of the remainder, ${
                                ann_aa_reads
                            } sequences (${
                                ((ann_aa_reads / raw_seqs) * 100).toFixed(2)
                            }%) contain predicted proteins with known functions and ${
                                unkn_aa_reads
                            } sequences (${
                                ((unkn_aa_reads / raw_seqs) * 100).toFixed(2)
                            }%) contain predicted proteins with unknown function.`;
                        const ftext =
                            ` ${
                                unknown_all
                            } sequences (${
                                ((unknown_all / raw_seqs) * 100).toFixed(2)
                            }%) have no rRNA genes${
                                is_rna ? '.' : ' or predicted proteins'}`;
                        overviewTable +=
                            `<p>${
                                qc_fail_seqs
                            } sequences (${
                                ((qc_fail_seqs / raw_seqs) * 100).toFixed(2)
                            }%) failed to pass the QC pipeline. Of the sequences that passed QC, ${
                                ann_rna_reads
                            } sequences (${
                                ((ann_rna_reads / raw_seqs) * 100).toFixed(2)
                            }%) containe ribosomal RNA genes.${
                                is_rna ? '' : ptext
                            }${ftext
                            }</p>`;
                        $(`#${  pref  }overview`).append(overviewTable);

                        // metadata tab
                        const mTabDiv = $(`<div id="${  pref  }metadata" style="width: 95%;">`);
                        tabPane.kbaseTabs('addTab', {
                            tab: 'Metadata',
                            content: mTabDiv,
                            canDelete: false,
                            show: true
                        });

                        const mdata = [];
                        const cats = ['project', 'sample', 'library', 'env_package'];
                        for (const c in cats) {
                            if (d.metadata[cats[c]]) {
                                for (const key in d.metadata[cats[c]].data) {
                                    mdata.push([cats[c], key, d.metadata[cats[c]].data[key]]);
                                }
                            }
                        }
                        const tableOptions = {
                            columns: ['Category', 'Field', 'Value'],
                            rows: mdata,
                            class: 'table table-striped'
                        };
                        const table = html.makeTable(tableOptions);
                        $(`#${  pref  }metadata`).html(table);
                        $(`#${  tableOptions.generated.id}`).dataTable();

                        /*
                     var tlen = 0;
                     if (window.hasOwnProperty('rendererTable') && rendererTable.length) {
                     tlen = rendererTable.length;
                     }
                     var mdata = [];
                     var cats = ['project', 'sample', 'library', 'env_package'];
                     for (var c in cats) {
                     if (d.metadata[cats[c]]) {
                     for (var key in d.metadata[cats[c]]['data']) {
                     mdata.push([cats[c], key, d.metadata[cats[c]]['data'][key]]);
                     }
                     }
                     }
                     var tableMeta = standaloneTable.create({index: tlen});
                     tableMeta.settings.target = document.getElementById(pref + 'metadata');
                     tableMeta.settings.data = {header: ['Category', 'Field', 'Value'], data: mdata};
                     tableMeta.settings.width = 400;
                     tableMeta.settings.height = 600;
                     tableMeta.settings.rows_per_page = 10;
                     tableMeta.settings.sort_autodetect = true;
                     tableMeta.settings.filter_autodetect = true;
                     tableMeta.settings.hide_options = false;
                     tableMeta.render(tlen);
                     */

                        // seq stats tab
                        oTabDiv = $(`<div id="${  pref  }stats">`);
                        tabPane.kbaseTabs('addTab', {
                            tab: 'Statistics',
                            content: oTabDiv,
                            canDelete: false,
                            show: false
                        });
                        let statsTable = '<p><table class="table table-striped table-bordered" style="width: 65%;">';
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Upload: bp Count</b></td><td>${
                                stats.bp_count_raw
                            } bp</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Upload: Sequences Count</b></td><td>${
                                stats.sequence_count_raw
                            }</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Upload: Mean Sequence Length</b></td><td>${
                                stats.average_length_raw
                            } ± ${
                                stats.standard_deviation_length_raw
                            } bp</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Upload: Mean GC percent</b></td><td>${
                                stats.average_gc_content_raw
                            } ± ${
                                stats.standard_deviation_gc_content_raw
                            } %</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Artificial Duplicate Reads: Sequence Count</b></td><td>${
                                stats.sequence_count_dereplication_removed
                            }</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Post QC: bp Count</b></td><td>${
                                stats.bp_count_preprocessed
                            }</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Post QC: Sequences Count</b></td><td>${
                                stats.sequence_count_preprocessed
                            }</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Post QC: Mean Sequence Length</b></td><td>${
                                stats.average_length_preprocessed
                            } ± ${
                                stats.standard_deviation_length_preprocessed
                            } bp</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Post QC: Mean GC percent</b></td><td>${
                                stats.average_gc_content_preprocessed
                            } ± ${
                                stats.standard_deviation_gc_content_preprocessed
                            } %</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Processed: Predicted Protein Features</b></td><td>${
                                stats.sequence_count_processed_aa
                            }</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Processed: Predicted rRNA Features</b></td><td>${
                                stats.sequence_count_processed_rna
                            }</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Alignment: Identified Protein Features</b></td><td>${
                                stats.sequence_count_sims_aa
                            }</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Alignment: Identified rRNA Features</b></td><td>${
                                stats.sequence_count_sims_rna
                            }</td></tr>`;
                        statsTable +=
                            `<tr><td style="padding-right: 25px; width: 325px;"><b>Annotation: Identified Functional Categories</b></td><td>${
                                stats.sequence_count_ontology
                            }</td></tr>`;
                        statsTable += '</table></p>';
                        $(`#${  pref  }stats`).append(statsTable);

                        // drisee tab
                        const drisee_cols = d.statistics.qc.drisee.percents.columns;
                        const drisee_data = d.statistics.qc.drisee.percents.data;
                        if (!is_rna && drisee_cols && drisee_data && drisee_cols.length > 0 && drisee_data.length > 0) {
                            const dTabDiv = $(`<div id="${pref}drisee" style="width: 95%;">`);
                            tabPane.kbaseTabs('addTab', {
                                tab: 'DRISEE',
                                content: dTabDiv,
                                canDelete: false,
                                show: true
                            });

                            const x = 0;
                            const y = [1, 2, 3, 4, 5, 6, 7];
                            const series = [];
                            const points = [];
                            const x_all = [];
                            const y_all = [];
                            let annMax = 0;
                            const colors = GooglePalette(y.length);
                            for (let i = 0; i < y.length; i++) {
                                series.push({name: drisee_cols[y[i]], color: colors[i]});
                                annMax = Math.max(annMax, drisee_cols[y[i]].length);
                                const xy = [];
                                for (let j = 0; j < drisee_data.length; j++) {
                                    xy.push({x: parseFloat(drisee_data[j][x]), y: parseFloat(drisee_data[j][y[i]])});
                                    x_all.push(parseFloat(drisee_data[j][x]));
                                    y_all.push(parseFloat(drisee_data[j][y[i]]));
                                }
                                points.push(xy);
                            }
                            const pwidth = 750;
                            const pheight = 300;
                            const lwidth = annMax * 10;
                            const lheight = series.length * 23;
                            const width = pwidth + lwidth;
                            const height = lheight > pheight ? Math.min(lheight, pheight + pheight / 2) : pheight;
                            const plotDrisee = Plot.create({
                                target: document.getElementById(`${pref}drisee`),
                                data: {series, points},
                                x_titleOffset: 40,
                                y_titleOffset: 60,
                                x_title: 'bp position',
                                y_title: 'percent error',
                                x_min: Math.min.apply(Math, x_all),
                                x_max: Math.max.apply(Math, x_all),
                                y_min: Math.min.apply(Math, y_all),
                                y_max: Math.max.apply(Math, y_all),
                                show_legend: true,
                                show_dots: false,
                                connected: true,
                                legendArea: [pwidth + 20, 20, lwidth, lheight],
                                chartArea: [70, 20, pwidth, pheight],
                                width: width + 40,
                                height: height + 45
                            });
                            plotDrisee.render();
                        }

                        // kmer tab
                        const kmer_data = d.statistics.qc.kmer['15_mer']['data'];
                        if (!is_rna && kmer_data && kmer_data.length > 0) {
                            const kTabDiv = $(`<div id="${  pref  }kmer" style="width: 95%;">`);
                            tabPane.kbaseTabs('addTab', {
                                tab: 'Kmer Profile',
                                content: kTabDiv,
                                canDelete: false,
                                show: true
                            });
                            var xy = [];
                            var x_all = [];
                            var y_all = [];
                            for (var i = 0; i < kmer_data.length; i += 2) {
                                xy.push({x: parseFloat(kmer_data[i][3]), y: parseFloat(kmer_data[i][0])});
                                x_all.push(parseFloat(kmer_data[i][3]));
                                y_all.push(parseFloat(kmer_data[i][0]));
                            }
                            var pwidth = 750;
                            var pheight = 300;
                            let ymax = Math.max.apply(Math, y_all);
                            ymax = ymax + 0.25 * ymax;
                            let pot = ymax.toString().indexOf('.') || ymax.toString.length;
                            pot = Math.pow(10, pot - 1);
                            ymax = Math.floor((ymax + pot) / pot) * pot;

                            const plotKmer = Plot.create({
                                target: document.getElementById(`${pref  }kmer`),
                                data: {series: [{name: ''}], points: [xy]},
                                x_titleOffset: 40,
                                y_titleOffset: 60,
                                x_title: 'sequence size',
                                y_title: 'kmer coverage',
                                x_scale: 'log',
                                y_scale: 'log',
                                x_min: Math.min.apply(Math, x_all),
                                x_max: Math.max.apply(Math, x_all),
                                y_min: 0,
                                y_max: ymax,
                                show_legend: false,
                                show_dots: false,
                                connected: true,
                                chartArea: [70, 20, pwidth, pheight],
                                width: pwidth + 40,
                                height: pheight + 45
                            });
                            plotKmer.render();
                        }

                        // bp data
                        const bp_cols = d.statistics.qc.bp_profile.percents.columns;
                        const bp_data = d.statistics.qc.bp_profile.percents.data;
                        const gTabDiv = $(`<div id="${pref}bp_plot" style="width: 95%;">`);
                        tabPane.kbaseTabs('addTab', {
                            tab: 'Nucleotide Histogram',
                            content: gTabDiv,
                            canDelete: false,
                            show: true
                        });

                        const names = bp_cols.slice(1);
                        const colors = GooglePalette(names.length);
                        const areaData = [];
                        for (let x = 0; x < names.length; x++) {
                            areaData.push({name: names[x], data: [], fill: colors[x]});
                        }
                        for (let i = 0; i < bp_data.length; i++) {
                            for (let j = 1; j < bp_data[i].length; j++) {
                                areaData[j - 1].data.push(parseFloat(bp_data[i][j]));
                            }
                        }
                        pwidth = 750;
                        pheight = 300;
                        const lwidth = 15;
                        const lheight = areaData.length * 23;
                        const width = pwidth + lwidth;
                        const height = lheight > pheight ? Math.min(lheight, pheight + pheight / 2) : pheight;
                        const graphBP = Graph.create({
                            target: document.getElementById(`${pref}bp_plot`),
                            data: areaData,
                            x_title: `bp ${  bp_cols[0]}`,
                            y_title: 'Percent bp',
                            type: 'stackedArea',
                            x_tick_interval: parseInt(bp_data.length / 50, 10),
                            x_labeled_tick_interval: parseInt(bp_data.length / 10, 10),
                            show_legend: true,
                            legendArea: [pwidth + 20, 20, lwidth, lheight],
                            chartArea: [70, 20, pwidth, pheight],
                            width: width + 40,
                            height: height + 45
                        });
                        graphBP.render();

                        // set active
                        tabPane.kbaseTabs('showTab', 'Overview');
                    }
                },
                (data) => {
                    container.empty();
                    const main = $('<div>');
                    main.append(
                        $('<p>')
                            .css({padding: '10px 20px'})
                            .text(`[Error] ${  data.error.message}`)
                    );
                    container.append(main);
                }
            );
            return self;
        },
        loggedInCallback(event, auth) {
            this.token = auth.token;
            this.render();
            return this;
        },
        loggedOutCallback() {
            this.token = null;
            this.render();
            return this;
        },
        uuidv4(a, b) {
            for (
                b = a = '';
                a++ < 36;
                b += (a * 51) & 52 ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16) : '-'
            );
            return b;
        }
    });
});
