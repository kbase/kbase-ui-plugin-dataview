/**
 * Output widget to display a pangenome object.
 * @author Chris Henry <chrisshenry@gmail.com>, Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */
define([
    'jquery',
    'uuid',
    'kb_common/html',
    'kb_service/client/workspace',

    'kb_widget/legacy/authenticatedWidget',
    'kb_widget/legacy/tabs',
    'datatables_bootstrap'
], function ($, Uuid, html, Workspace) {
    'use strict';

    var t = html.tag,
        a = t('a'),
        span = t('span');

    function encodeQuery(queryMap) {
        return Object.keys(queryMap)
            .map(function (key) {
                return [key, queryMap[key]].map(encodeURIComponent).join('=');
            })
            .join('&');
    }

    function calcGenomeStats(data) {
        let totalGenesInOrth = 0;
        let totalOrthologs = 0;
        let totalHomFamilies = 0;
        let totalOrphanGenes = 0;

        const genomeStat = {}; // genome_ref -> [ortholog_count,{ortholog_id -> count_of_genes_from_genome},genes_covered_by_homolog_fams, orphan_genes(1-member_orthologs)]
        const orthologStat = {}; // ortholog_id -> {genome_ref -> gene_count(>0)}
        const genesInHomFams = {}; // genome_ref/feature_id -> 0/1(depending_on_homology)
        for (const i in data.orthologs) {
            const orth = data.orthologs[i];
            totalOrthologs++;
            const orth_id = orth.id;
            const orth_size = orth.orthologs.length;
            if (orth_size >= 2) {
                totalHomFamilies++;
            }
            if (!orthologStat[orth_id]) {
                orthologStat[orth_id] = [orth_size, {}];
            }
            for (const j in orth.orthologs) {
                const gene = orth.orthologs[j];
                const genomeRef = gene[2];
                if (!genomeStat[genomeRef]) {
                    genomeStat[genomeRef] = [0, {}, 0, 0];
                }
                if (!genomeStat[genomeRef][1][orth_id]) {
                    genomeStat[genomeRef][1][orth_id] = 0;
                    if (orth_size > 1) {
                        genomeStat[genomeRef][0]++;
                    } else {
                        genomeStat[genomeRef][3]++;
                    }
                }
                genomeStat[genomeRef][1][orth_id]++;
                if (!orthologStat[orth_id][1][genomeRef]) {
                    orthologStat[orth_id][1][genomeRef] = 0;
                }
                orthologStat[orth_id][1][genomeRef]++;
                const geneKey = genomeRef + '/' + gene[0];
                if (!genesInHomFams[geneKey]) {
                    if (orth_size > 1) {
                        genesInHomFams[geneKey] = 1;
                        totalGenesInOrth++;
                        genomeStat[genomeRef][2]++;
                    } else {
                        genesInHomFams[geneKey] = 0;
                        totalOrphanGenes++;
                    }
                }
            }
        }

        return {
            totalGenesInOrth,
            totalOrthologs,
            totalHomFamilies,
            totalOrphanGenes,
            genomeStat,
            orthologStat
        };
    }

    $.KBWidget({
        name: 'kbasePanGenome',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        options: {
            ws: null,
            name: null,
            withExport: false,
            width: 1000
        },
        pref: null,
        geneIndex: {}, // {genome_ref -> {feature_id -> feature_index}}
        genomeNames: {}, // {genome_ref -> genome_name}
        genomeRefs: {}, // {genome_ref -> workspace/genome_object_name}
        loaded: false,
        init: function (options) {
            this._super(options);

            this.workspace = new Workspace(this.runtime.config('services.workspace.url'), {
                token: this.runtime.service('session').getAuthToken()
            });
            this.pref = new Uuid(4).format();
            this.geneIndex = {};
            this.genomeNames = {};
            this.genomeRefs = {};
            var container = this.$elem;
            container.empty();
            container.html(html.loading('loading pan-genome data...'));
            this.render();
            return this;
        },
        render: function () {
            var self = this,
                name = this.options.name,
                container = this.$elem;

            this.workspace
                .get_objects([
                    {
                        workspace: this.options.ws,
                        name: name
                    }
                ])
                .then(function (data) {
                    if (self.loaded) {
                        return;
                    }
                    return [data[0].data, self.cacheGeneFunctions(data[0].data.genome_refs)];
                })
                .spread(function (data) {
                    buildTable(data);
                    return null;
                })
                .catch(function (err) {
                    console.error('ERROR', err);
                    container.empty();
                    container.append('<div class="alert alert-danger">' + err.error.message + '</div>');
                });

            function buildTable(data) {
                self.loaded = true;
                container.empty();
                const tabPane = $('<div id="' + self.pref + 'tab-content">');
                container.append(tabPane);
                const tabs = tabPane.kbTabs({ tabs: [] });
                let showOverview = true;
                if (self.options.withExport) {
                    showOverview = false;
                }
                ///////////////////////////////////// Statistics ////////////////////////////////////////////
                var tabStat = $('<div/>');
                tabs.addTab({ name: 'Pangenome Overview', content: tabStat, active: showOverview, removable: false });

                const tableOver = $(
                    '<table class="table table-striped table-bordered" ' +
                        'style="margin-top: 1em;" id="' +
                        self.pref +
                        'overview-table"/>'
                );
                tabStat.append(tableOver);
                tableOver.append('<tr><td>Pan-genome object ID</td><td>' + self.options.name + '</td></tr>');

                const {
                    totalGenesInOrth,
                    totalOrthologs,
                    totalHomFamilies,
                    totalOrphanGenes,
                    genomeStat,
                    orthologStat
                } = calcGenomeStats(data);

                let totalGenomes = 0;
                const genomeOrder = []; // [[genome_ref, genome_name, genome_num]]
                for (const genomeRef in self.geneIndex) {
                    totalGenomes++;
                    genomeOrder.push([genomeRef, self.genomeNames[genomeRef], 0]);
                }
                genomeOrder.sort(function (a, b) {
                    if (a[1] < b[1]) return -1;
                    if (a[1] > b[1]) return 1;
                    return 0;
                });
                for (const i in genomeOrder) {
                    genomeOrder[i][2] = parseInt('' + i) + 1;
                }
                tableOver.append('<tr><td>Total # of genomes</td><td><b>' + totalGenomes + '</b></td></tr>');
                tableOver.append(
                    '<tr><td>Total # of protein coding genes</td><td><b>' +
                        (totalGenesInOrth + totalOrphanGenes) +
                        '</b> ' +
                        'proteins, <b>' +
                        totalGenesInOrth +
                        '</b> are in homolog families, <b>' +
                        totalOrphanGenes +
                        '</b> ' +
                        'are in singleton families</td></tr>'
                );
                tableOver.append(
                    '<tr><td>Total # of families</td><td><b>' +
                        totalOrthologs +
                        '</b> families, <b>' +
                        totalHomFamilies +
                        '</b> homolog families, <b>' +
                        (totalOrthologs - totalHomFamilies) +
                        '</b> ' +
                        'singleton families</td></tr>'
                );

                const tableOver2 = $(
                    '<table class="table table-striped table-bordered" ' +
                        'style="margin-top: 1em;" id="' +
                        self.pref +
                        'overview-table2"/>'
                );
                tabStat.append(tableOver2);
                tableOver2.append(
                    $('<tr>')
                        .append($('<th>Genome</th>'))
                        .append($('<th># Genes</th>'))
                        .append($('<th># Genes in Homologs</th>'))
                        .append($('<th># Genes in Singletons</th>'))
                        .append($('<th># Homolog Families</th>'))
                );

                for (const genomePos in genomeOrder) {
                    const genomeRef = genomeOrder[genomePos][0];
                    const genomeName = self.genomeNames[genomeRef];
                    let orthCount = 0;
                    let genesInOrth = 0;
                    let genesInSingle = 0;
                    if (genomeStat[genomeRef]) {
                        [orthCount, , genesInOrth, genesInSingle] = genomeStat[genomeRef];
                        // orthCount = stat[0];
                        // genesInOrth = stat[2];
                        // genesInSingle = stat[3];
                    }
                    // var genesAll = 0;
                    // for (var i in self.geneIndex[genomeRef])
                    //     genesAll++;
                    tableOver2.append(
                        '<tr><td>' +
                            genomeName +
                            '</td><td>' +
                            (genesInOrth + genesInSingle) +
                            '</td><td>' +
                            genesInOrth +
                            '</td><td>' +
                            genesInSingle +
                            '</td><td>' +
                            orthCount +
                            '</td><tr>'
                    );
                }

                ///////////////////////////////////// Shared orthologs ////////////////////////////////////////////
                const tabShared = $('<div/>');
                tabs.addTab({ name: 'Genome Comparison', content: tabShared, active: false, removable: false });
                const tableShared = $(
                    '<table class="table table-striped table-bordered" ' +
                        'style="margin-top: 1em; width: 100%;" id="' +
                        self.pref +
                        'shared-table"/>'
                );
                tabShared.append(tableShared);
                var header = '<th>Genome</th><th>Legend</th>';
                for (var genomePos in genomeOrder) {
                    var genomeNum = genomeOrder[genomePos][2];
                    header += '<th width="40" style="text-align: center;">G' + genomeNum + '</th>';
                }
                tableShared.append('<tr>' + header + '</tr>');
                for (const genomePos in genomeOrder) {
                    const genomeRef = genomeOrder[genomePos][0];
                    let row = '';
                    for (const genomePos2 in genomeOrder) {
                        const genomeRef2 = genomeOrder[genomePos2][0];
                        let count = 0;
                        for (var orth_id in orthologStat) {
                            if (orthologStat[orth_id][0] <= 1) continue;
                            if (orthologStat[orth_id][1][genomeRef] && orthologStat[orth_id][1][genomeRef2]) count++;
                        }
                        var color = genomeRef === genomeRef2 ? '#d2691e' : 'black';
                        row += '<td width="40"><font color="' + color + '">' + count + '</font></td>';
                    }
                    const genomeNum = genomeOrder[genomePos][2];
                    tableShared.append(
                        '<tr><td><b>G' +
                            genomeNum +
                            '</b> - ' +
                            genomeOrder[genomePos][1] +
                            '</td><td># homolog families</td>' +
                            row +
                            '</tr>'
                    );
                }

                ///////////////////////////////////// Orthologs /////////////////////////////////////////////
                const tableOrth = $(
                    '<table class="table table-bordered table-striped" style="margin-top: 1em; width: 100%;">'
                );
                const tabOrth = $('<div/>');
                if (self.options.withExport) {
                    tabOrth.append(
                        '<p><b>Please choose homolog family and push \'Export\' ' +
                            'button on opened ortholog tab.</b></p><br>'
                    );
                }
                tabOrth.append(tableOrth);

                tabs.addTab({ name: 'Families', content: tabOrth, active: !showOverview, removable: false });

                var orth_data = [];
                for (const i in data.orthologs) {
                    const orth = data.orthologs[i];
                    const id_text =
                        '<a class="show-orthologs_' + self.pref + '" data-id="' + orth.id + '">' + orth.id + '</a>';
                    const genome_count = Object.keys(orthologStat[orth.id][1]).length;
                    orth_data.push({
                        id: id_text,
                        func: orth['function'],
                        len: orth.orthologs.length,
                        genomes: genome_count
                    });
                }

                const tableSettings = {
                    sPaginationType: 'full_numbers',
                    iDisplayLength: 10,
                    aaData: orth_data,
                    aaSorting: [[2, 'desc'], [0, 'asc']],
                    aoColumns: [
                        { sTitle: 'Family', mData: 'id' },
                        { sTitle: 'Function', mData: 'func' },
                        { sTitle: 'Protein Count', mData: 'len' },
                        { sTitle: 'Genome Count', mData: 'genomes' }
                    ],
                    oLanguage: {
                        sEmptyTable: 'No objects found',
                        sSearch: 'Search: '
                    },
                    fnDrawCallback: events
                };

                // create the table
                tableOrth.dataTable(tableSettings);

                function events() {
                    // event for clicking on ortholog count
                    $('.show-orthologs_' + self.pref).unbind('click');
                    $('.show-orthologs_' + self.pref).click(function () {
                        var id = $(this).data('id');
                        if (tabs.tabContent(id)[0]) {
                            tabs.showTab(id);
                            return;
                        }
                        var ortholog = getOrthologInfo(id);
                        var tabContent = self.buildOrthoTable(id, ortholog);
                        tabs.addTab({ name: id, content: tabContent, active: true, removable: true });
                        tabs.showTab(id);
                    });
                }

                // work in progress
                function getOrthologInfo(id) {
                    for (var i in data.orthologs) {
                        if (data.orthologs[i].id === id) {
                            var ort_list = data.orthologs[i];
                            return ort_list;
                        }
                    }
                }
            }

            return this;
        },
        cacheGeneFunctions: function (genomeRefs) {
            var self = this,
                req = genomeRefs.map(function (ref) {
                    return { ref: ref, included: ['scientific_name', 'features/[*]/id'] };
                });
            return this.workspace.get_object_subset(req).then(function (data) {
                for (var genomePos in genomeRefs) {
                    var ref = genomeRefs[genomePos];
                    self.genomeNames[ref] = data[genomePos].data.scientific_name;
                    self.genomeRefs[ref] = data[genomePos].info[7] + '/' + data[genomePos].info[1];
                    var geneIdToIndex = {};
                    for (var genePos in data[genomePos].data.features) {
                        var gene = data[genomePos].data.features[genePos];
                        geneIdToIndex[gene.id] = genePos;
                    }
                    self.geneIndex[ref] = geneIdToIndex;
                }
                return genomeRefs;
            });
            // .catch(function (err) {
            //     console.error('ERROR cacheGeneFunctions');
            //     console.error(err);
            //     this.$elem.empty();
            //     this.$elem.append('<div class="alert alert-danger">' +
            //         err.error.message + '</div>');
            // });
        },
        buildOrthoTable: function (orth_id, ortholog) {
            var self = this;
            var tab = $(html.loading('loading gene data...'));
            var req = [];
            for (var i in ortholog.orthologs) {
                var genomeRef = ortholog.orthologs[i][2];
                var featureId = ortholog.orthologs[i][0];
                var featurePos = self.geneIndex[genomeRef][featureId];
                req.push({ ref: genomeRef, included: ['features/' + featurePos] });
            }
            this.workspace
                .get_object_subset(req)
                .then(function (data) {
                    var genes = [];
                    for (var i in data) {
                        var feature = data[i].data.features[0];
                        var genomeRef = req[i].ref;
                        feature['genome_ref'] = genomeRef;
                        var ref = self.genomeRefs[genomeRef];
                        var genome = self.genomeNames[genomeRef];
                        var id = feature.id;
                        var func = feature['function'];
                        if (!func) func = '-';
                        var seq = feature.protein_translation;
                        var len = seq ? seq.length : 'no translation';
                        genes.push({ ref: ref, genome: genome, id: id, func: func, len: len, original: feature });
                    }
                    self.buildOrthoTableLoaded(orth_id, genes, tab);
                })
                .catch(function (e) {
                    console.error('Error caching genes: ' + e.error.message);
                });
            return tab;
        },
        buildOrthoTableLoaded: function (orth_id, genes, tab) {
            var pref2 = new Uuid(4).format();
            var self = this;
            tab.empty();
            var table = $('<table class="table table-bordered ' + 'table-striped" style="margin-top: 1em;">');
            if (self.options.withExport) {
                tab.append(
                    '<p><b>Name of feature set object:</b>&nbsp;' +
                        '<input type="text" id="input_' +
                        pref2 +
                        '" ' +
                        'value="' +
                        self.options.name +
                        '.' +
                        orth_id +
                        '.featureset" style="width: 350px;"/>' +
                        '&nbsp;<button id="btn_' +
                        pref2 +
                        '">Export</button><br>' +
                        '<font size="-1">(only features with protein translations will be exported)</font></p><br>'
                );
            }
            tab.append(table);
            var tableSettings = {
                sPaginationType: 'full_numbers',
                iDisplayLength: 10,
                aaData: genes,
                aaSorting: [[0, 'asc'], [1, 'asc']],
                aoColumns: [
                    {
                        sTitle: 'Genome name',
                        mData: function (d) {
                            return a(
                                {
                                    target: '_blank',
                                    href: '#dataview/' + d.ref
                                },
                                span(
                                    {
                                        style: {
                                            whiteSpace: 'nowrap'
                                        }
                                    },
                                    d.genome
                                )
                            );
                            // return '<a class="show-genomes_' + pref2 + '" data-id="' + d.ref + '">' +
                            //     '<span style="white-space: nowrap;">' + d.genome + '</span></a>';
                        }
                    },
                    {
                        sTitle: 'Feature ID',
                        mData: function (d) {
                            var query = {
                                sub: 'Feature',
                                subid: d.id
                            };
                            return a(
                                {
                                    target: '_blank',
                                    href: '#dataview/' + d.ref + '?' + encodeQuery(query)
                                },
                                d.id
                            );
                        }
                    },
                    {
                        sTitle: 'Function',
                        mData: 'func'
                    },
                    {
                        sTitle: 'Protein sequence length',
                        mData: 'len'
                    }
                ],
                oLanguage: {
                    sEmptyTable: 'No objects in workspace',
                    sSearch: 'Search: '
                },
                fnDrawCallback: events2
            };

            // create the table
            table.dataTable(tableSettings);
            if (self.options.withExport) {
                $('#btn_' + pref2).click(function () {
                    var target_obj_name = $('#input_' + pref2).val();
                    if (target_obj_name.length === 0) {
                        alert('Error: feature set object name shouldn\'t be empty');
                        return;
                    }
                    self.exportFeatureSet(orth_id, target_obj_name, genes);
                });
            }

            function events2() {
                $('.show-genomes_' + pref2).unbind('click');
                $('.show-genomes_' + pref2).click(function () {
                    var id = $(this).data('id');
                    var url = '/#dataview/' + id;
                    window.open(url, '_blank');
                });
                $('.show-genes_' + pref2).unbind('click');
                $('.show-genes_' + pref2).click(function () {
                    var id = $(this).data('id');
                    var url = '/#dataview/' + id;
                    window.open(url, '_blank');
                });
            }
        },

        // landml:1470156029700/Anaerocellum_thermophilum_DSM_6725?sub=Feature&subid=kb|g.1962.peg.2180
        exportFeatureSet: function (orth_id, target_obj_name, genes) {
            var elements = {};
            var size = 0;
            for (var i in genes) {
                var gene = genes[i];
                if (gene.original.protein_translation) {
                    elements['' + i] = { data: gene.original };
                    size++;
                }
            }
            var featureSet = {
                description:
                    'Feature set exported from pan-genome "' + this.options.name + '", otholog "' + orth_id + '"',
                elements: elements
            };
            this.workspace
                .save_objects({
                    workspace: this.options.ws,
                    objects: [{ type: 'KBaseSearch.FeatureSet', name: target_obj_name, data: featureSet }]
                })
                .then(function () {
                    alert('Feature set object containing ' + size + ' genes ' + 'was successfully exported');
                })
                .catch(function (err) {
                    alert('Error: ' + err.error.message);
                });
        },
        getData: function () {
            return { title: 'Pangenome', id: this.options.name, workspace: this.options.ws };
        },
        loggedInCallback: function (event, auth) {
            this.token = auth.token;
            this.render();
            return this;
        },
        loggedOutCallback: function () {
            this.token = null;
            this.render();
            return this;
        }
    });
});
