/**
 * Output widget for visualization of comparison between proteomes of two bacterial genomes.
 * @author Roman Sutormin <rsutormin@lbl.gov>
 * @public
 */
define([
    'jquery',
    'kb_common/html',
    'kb_service/client/workspace',
    'uuid',

    // for effect
    'kbaseUI/widget/legacy/authenticatedWidget',
    'kbaseUI/widget/legacy/tabs',
    'datatables_bootstrap'
], (
    $,
    html,
    Workspace,
    Uuid
) => {
    $.KBWidget({
        name: 'kbaseGenomeComparisonViewer',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        id: null,
        ws: null,
        pref: null,
        width: 1150,
        options: {
            id: null,
            ws: null
        },
        init(options) {
            this._super(options);
            this.pref = new Uuid(4).format(),
            this.ws = options.ws;
            this.id = options.id;
            this.render();
            return this;
        },
        render() {
            const self = this,
                container = this.$elem,
                kbws = new Workspace(this.runtime.getConfig('services.workspace.url'), {token: self.token});
            container.empty();
            if (!self.authToken()) {
                container.append('<div>[Error] You\'re not logged in</div>');
                return;
            }
            // safe
            container.html(html.loading('loading genome comparison data...'));

            kbws.get_objects(
                [{ref: `${self.ws}/${self.id}`}],
                (data) => {
                    ///////////////////////////////////// Data Preparation ////////////////////////////////////////////
                    const object = data[0].data;
                    const info = data[0].info;
                    const genomes = object.genomes;
                    const functions = object.functions;
                    const families = object.families;

                    ///////////////////////////////////// Instantiating Tabs ////////////////////////////////////////////
                    const tabPane = $(`<div id="${self.pref}tab-content">`);
                    // safe
                    container.html(tabPane);
                    tabPane.kbaseTabs({canDelete: true, tabs: []});
                    ///////////////////////////////////// Overview table ////////////////////////////////////////////
                    const tabOverview = $('<div/>');
                    tabPane.kbaseTabs('addTab', {
                        tab: 'Overview',
                        content: tabOverview,
                        canDelete: false,
                        show: true
                    });
                    const tableOver = $(
                        '<table class="table table-striped table-bordered" ' +
                            `style="margin-left: auto; margin-right: auto;" id="${
                                self.pref
                            }overview-table"/>`
                    );
                    tabOverview.append(tableOver);
                    tableOver.append(`<tr><td>Genome comparison object</td><td>${  info[1]  }</td></tr>`);
                    tableOver.append(`<tr><td>Genome comparison workspace</td><td>${  info[7]  }</td></tr>`);
                    tableOver.append(`<tr><td>Core functions</td><td>${  object.core_functions  }</td></tr>`);
                    tableOver.append(`<tr><td>Core families</td><td>${  object.core_families  }</td></tr>`);
                    if (object.protcomp_ref) {
                        tableOver.append(`<tr><td>Protein Comparison</td><td>${  object.protcomp_ref  }</td></tr>`);
                    } else {
                        tableOver.append(`<tr><td>Protein Comparison</td><td>${  object.pangenome_ref  }</td></tr>`);
                    }
                    tableOver.append(`<tr><td>Owner</td><td>${  info[5]  }</td></tr>`);
                    tableOver.append(`<tr><td>Creation</td><td>${  info[3]  }</td></tr>`);
                    ///////////////////////////////////// Genomes table ////////////////////////////////////////////
                    const tabGenomes = $('<div/>');
                    tabPane.kbaseTabs('addTab', {tab: 'Genomes', content: tabGenomes, canDelete: false, show: false});
                    const tableGenomes = $(
                        '<table class="table table-striped table-bordered" ' +
                            `style="margin-left: auto; margin-right: auto;" id="${
                                self.pref
                            }genome-table"/>`
                    );
                    tabGenomes.append(tableGenomes);
                    const headings = ['Genome', 'Legend'];
                    for (const i in genomes) {
                        headings.push(`G${  i}`);
                    }
                    tableGenomes.append(`<tr><th><b>${  headings.join('</b></th><th><b>')  }</b></th></tr>`);
                    for (const i in genomes) {
                        const genome = genomes[i];
                        const row = [`<b>G${  i  }</b>-${  genome.name}`, '# of families:<br># of functions:'];
                        for (const j in genomes) {
                            const compgenome = genomes[j];
                            if (genome.genome_similarity[compgenome.genome_ref]) {
                                row.push(
                                    `${genome.genome_similarity[compgenome.genome_ref][0]
                                    }<br>${
                                        genome.genome_similarity[compgenome.genome_ref][1]}`
                                );
                            } else if (j === i) {
                                row.push(`${genome.families  }<br>${  genome.functions}`);
                            } else {
                                row.push('0<br>0');
                            }
                        }
                        tableGenomes.append(`<tr><td>${  row.join('</td><td>')  }</td></tr>`);
                    }
                    ///////////////////////////////////// Functions table ////////////////////////////////////////////
                    const tabFunctions = $('<div/>');
                    tabPane.kbaseTabs('addTab', {
                        tab: 'Functions',
                        content: tabFunctions,
                        canDelete: false,
                        show: false
                    });
                    const tableFunctions = $(
                        '<table class="table table-striped table-bordered" ' +
                            `style="margin-left: auto; margin-right: auto;" id="${
                                self.pref
                            }function-table"/>`
                    );
                    tabFunctions.append(tableFunctions);
                    const func_data = [];
                    let tableSettings = {
                        sPaginationType: 'full_numbers',
                        iDisplayLength: 10,
                        aaData: func_data,
                        aaSorting: [[2, 'desc'], [0, 'asc']],
                        aoColumns: [
                            {sTitle: 'Function', mData: 'id'},
                            {sTitle: 'Subsystem', mData: 'subsystem'},
                            {sTitle: 'Primary class', mData: 'primclass'},
                            {sTitle: 'Secondary class', mData: 'subclass'},
                            {sTitle: 'Totals', mData: 'totals'},
                            {sTitle: 'Families', mData: 'families'},
                            {sTitle: 'Family genes', mData: 'famgenes'},
                            {sTitle: 'Family genomes', mData: 'famgenomes'}
                        ],
                        oLanguage: {
                            sEmptyTable: 'No functions found!',
                            sSearch: 'Search: '
                        },
                        fnDrawCallback: events
                    };
                    for (const i in families) {
                        const fam = families[i];
                        let gcount = 0;
                        for (const j in genomes) {
                            const compgenome = genomes[j];
                            if (fam.genome_features[compgenome.genome_ref]) {
                                const genes = fam.genome_features[compgenome.genome_ref];
                                gcount += genes.length;
                            }
                        }
                        fam.numgenes = gcount;
                    }
                    for (const i in functions) {
                        const func = functions[i];
                        func.subsystem = func.subsystem.replace(/_/g, ' ');
                        const funcdata = {
                            id:
                                `<a class="show-function${
                                    self.pref
                                }" data-id="${
                                    func.id
                                }">${
                                    func.id
                                }</a>`,
                            subsystem: func.subsystem,
                            primclass: func.primclass,
                            subclass: func.subclass
                        };
                        const funcindecies = {};
                        const funcgenomes = {};
                        let gcount = 0;
                        for (const j in genomes) {
                            const compgenome = genomes[j];
                            if (func.genome_features[compgenome.genome_ref]) {
                                const genomefams = {};
                                const genes = func.genome_features[compgenome.genome_ref];
                                for (const k in genes) {
                                    gcount++;
                                    const gene = genes[k];
                                    genomefams[gene[1]] = 1;
                                    if (funcindecies[gene[1]] === undefined) {
                                        funcindecies[gene[1]] = 0;
                                    }
                                    funcindecies[gene[1]]++;
                                }
                                for (const genfam in genomefams) {
                                    if (funcgenomes[genfam] === undefined) {
                                        funcgenomes[genfam] = 0;
                                    }
                                    funcgenomes[genfam]++;
                                }
                            }
                        }
                        func.numgenes = gcount;
                        const sortedfams = getSortedKeys(funcindecies);
                        funcdata.totals =
                            `Families:&nbsp;${
                                sortedfams.length
                            }<br>Genes:&nbsp;${
                                gcount
                            }<br>Genomes:&nbsp;${
                                func.number_genomes}`;
                        funcdata.families = '';
                        funcdata.famgenes = '';
                        funcdata.famgenomes = '';
                        for (const j in sortedfams) {
                            if (funcdata.families.length > 0) {
                                funcdata.families += '<br>';
                                funcdata.famgenes += '<br>';
                                funcdata.famgenomes += '<br>';
                            }
                            if (sortedfams[j] === 'null') {
                                funcdata.famgenes = 0;
                                funcdata.famgenomes = 0;
                                funcdata.families = 'none';
                            } else {
                                funcdata.famgenes +=
                                    `${funcindecies[sortedfams[j]]
                                    }(${
                                        Math.round((100 * funcindecies[sortedfams[j]]) / families[sortedfams[j]].numgenes)
                                    }%)`;
                                funcdata.famgenomes +=
                                    `${funcgenomes[sortedfams[j]]
                                    }(${
                                        Math.round(
                                            (100 * funcgenomes[sortedfams[j]]) / families[sortedfams[j]].number_genomes
                                        )
                                    }%)`;
                                funcdata.families +=
                                    `<a class="show-family${
                                        self.pref
                                    }" data-id="${
                                        families[sortedfams[j]].id
                                    }">${
                                        families[sortedfams[j]].id
                                    }</a>`;
                            }
                        }
                        tableSettings.aaData.push(funcdata);
                    }
                    tableFunctions.dataTable(tableSettings);
                    ///////////////////////////////////// Families table ////////////////////////////////////////////
                    const tabFamilies = $('<div/>');
                    if (self.options.withExport) {
                        tabFamilies.append(
                            '<p><b>Please choose homolog family and push \'Export\' ' +
                                'button on opened ortholog tab.</b></p><br>'
                        );
                    }
                    tabPane.kbaseTabs('addTab', {
                        tab: 'Families',
                        content: tabFamilies,
                        canDelete: false,
                        show: false
                    });
                    const tableFamilies = $(
                        '<table class="table table-striped table-bordered" ' +
                            `style="margin-left: auto; margin-right: auto;" id="${
                                self.pref
                            }genome-table"/>`
                    );
                    tabFamilies.append(tableFamilies);
                    const fam_data = [];
                    tableSettings = {
                        sPaginationType: 'full_numbers',
                        iDisplayLength: 10,
                        aaData: fam_data,
                        aaSorting: [[2, 'desc'], [0, 'asc']],
                        aoColumns: [
                            {sTitle: 'Family', mData: 'id'},
                            {sTitle: 'Totals', mData: 'totals'},
                            {sTitle: 'Functions', mData: 'functions'},
                            {sTitle: 'Subsystems', mData: 'subsystem'},
                            {sTitle: 'Primary classes', mData: 'primclass'},
                            {sTitle: 'Secondary classes', mData: 'subclass'},
                            {sTitle: 'Function genes', mData: 'funcgenes'},
                            {sTitle: 'Function genomes', mData: 'funcgenomes'}
                        ],
                        oLanguage: {
                            sEmptyTable: 'No families found!',
                            sSearch: 'Search: '
                        },
                        fnDrawCallback: events
                    };
                    for (const i in families) {
                        const fam = families[i];
                        const famdata = {
                            id: `<a class="show-family${  self.pref  }" data-id="${  fam.id  }">${  fam.id  }</a>`
                        };
                        const famindecies = {};
                        const famgenomes = {};
                        let gcount = 0;
                        let gene;
                        for (const j in genomes) {
                            const compgenome = genomes[j];
                            if (fam.genome_features[compgenome.genome_ref]) {
                                const genomefams = {};
                                const genes = fam.genome_features[compgenome.genome_ref];
                                for (const k in genes) {
                                    gcount++;
                                    gene = genes[k];
                                    const array = gene[1];
                                    for (const m in array) {
                                        if (famindecies[array[m]] === undefined) {
                                            famindecies[array[m]] = 0;
                                        }
                                        genomefams[array[m]] = 1;
                                        famindecies[array[m]]++;
                                    }
                                }
                                for (const genfam in genomefams) {
                                    if (famgenomes[genfam] === undefined) {
                                        famgenomes[genfam] = 0;
                                    }
                                    famgenomes[genfam]++;
                                }
                            }
                        }
                        const sortedfuncs = getSortedKeys(famindecies);
                        famdata.totals =
                            `Genes:&nbsp;${
                                gcount
                            }<br>Functions:&nbsp;${
                                sortedfuncs.length
                            }<br>Genomes:&nbsp;${
                                fam.number_genomes}`;
                        famdata.functions = '';
                        famdata.subsystem = '';
                        famdata.primclass = '';
                        famdata.subclass = '';
                        famdata.funcgenes = '';
                        famdata.funcgenomes = '';
                        let count = 1;
                        for (const j in sortedfuncs) {
                            if (famdata.functions.length > 0) {
                                famdata.functions += '<br>';
                                famdata.subsystem += '<br>';
                                famdata.primclass += '<br>';
                                famdata.subclass += '<br>';
                                famdata.funcgenes += '<br>';
                                famdata.funcgenomes += '<br>';
                            }
                            if (sortedfuncs[j] === 'null') {
                                famdata.funcgenes += 0;
                                famdata.funcgenomes += 0;
                                famdata.functions += 'none';
                                famdata.subsystem += 'none';
                                famdata.primclass += 'none';
                                famdata.subclass += 'none';
                            } else {
                                famdata.funcgenes +=
                                    `${count
                                    }: ${
                                        famindecies[sortedfuncs[j]]
                                    }(${
                                        Math.round(
                                            (100 * famindecies[sortedfuncs[j]]) / functions[sortedfuncs[j]].numgenes
                                        )
                                    }%)`;
                                famdata.funcgenomes +=
                                    `${count
                                    }: ${
                                        famgenomes[sortedfuncs[j]]
                                    }(${
                                        Math.round(
                                            (100 * famgenomes[sortedfuncs[j]]) / functions[sortedfuncs[j]].number_genomes
                                        )
                                    }%)`;
                                famdata.functions +=
                                    `${count
                                    }: ` +
                                    `<a class="show-function${
                                        self.pref
                                    }" data-id="${
                                        functions[sortedfuncs[j]].id
                                    }">${
                                        functions[sortedfuncs[j]].id
                                    }</a>`;
                                famdata.subsystem += `${count  }: ${  functions[sortedfuncs[j]].subsystem}`;
                                famdata.primclass += `${count  }: ${  functions[sortedfuncs[j]].primclass}`;
                                famdata.subclass += `${count  }: ${  functions[sortedfuncs[j]].subclass}`;
                            }
                            count++;
                        }
                        tableSettings.aaData.push(famdata);
                    }
                    tableFamilies.dataTable(tableSettings);
                    ///////////////////////////////////// Event handling for links ///////////////////////////////////////////
                    function events() {
                        // event for clicking on ortholog count
                        $(`.show-family${  self.pref}`).unbind('click');
                        $(`.show-family${  self.pref}`).click(function () {
                            const id = $(this).data('id');
                            if (tabPane.kbaseTabs('hasTab', id)) {
                                tabPane.kbaseTabs('showTab', id);
                                return;
                            }
                            let fam;
                            for (const i in families) {
                                if (families[i].id === id) {
                                    fam = families[i];
                                }
                            }
                            const tabContent = $('<div/>');
                            const tableFamGen = $(
                                '<table class="table table-striped table-bordered" ' +
                                    `style="margin-left: auto; margin-right: auto;" id="${
                                        self.pref
                                    }${id
                                    }-table"/>`
                            );
                            tabContent.append(tableFamGen);
                            const headings = [
                                'Genome',
                                'Genes',
                                'Score',
                                'Functions',
                                'Subsystems',
                                'Primary class',
                                'Secondary class'
                            ];
                            tableFamGen.append(`<tr><th><b>${  headings.join('</b></th><th><b>')  }</b></th></tr>`);
                            for (const i in genomes) {
                                const genome = genomes[i];
                                let genes = '';
                                let scores = '';
                                let funcs = '';
                                let sss = '';
                                let primclass = '';
                                let subclass = '';
                                if (fam.genome_features[genome.genome_ref] === undefined) {
                                    genes = 'none';
                                    scores = 'none';
                                    funcs = 'none';
                                    sss = 'none';
                                    primclass = 'none';
                                    subclass = 'none';
                                } else {
                                    const genearray = fam.genome_features[genome.genome_ref];
                                    let count = 1;
                                    for (const k in genearray) {
                                        if (k > 0) {
                                            genes += '<br>';
                                            scores += '<br>';
                                        }
                                        genes += `${count  }:${  genearray[0]}`;
                                        scores += `${count  }:${  genearray[2]}`;
                                        const array = genearray[1];
                                        for (const m in array) {
                                            if (m > 0 || k > 0) {
                                                funcs += '<br>';
                                                sss += '<br>';
                                                primclass += '<br>';
                                                subclass += '<br>';
                                            }
                                            funcs += `${count  }:${  functions[array[m]].id}`;
                                            sss += `${count  }:${  functions[array[m]].subsystem}`;
                                            primclass += `${count  }:${  functions[array[m]].primclass}`;
                                            subclass += `${count  }:${  functions[array[m]].subclass}`;
                                        }
                                        count++;
                                    }
                                }
                                const row = [genome.name, genes, scores, funcs, sss, primclass, subclass];
                                tableFamGen.append(`<tr><td>${  row.join('</td><td>')  }</td></tr>`);
                            }
                            tabPane.kbaseTabs('addTab', {tab: id, content: tabContent, canDelete: true, show: true});
                        });
                        $(`.show-function${  self.pref}`).unbind('click');
                        $(`.show-function${  self.pref}`).click(function () {
                            const id = $(this).data('id');
                            if (tabPane.kbaseTabs('hasTab', id)) {
                                tabPane.kbaseTabs('showTab', id);
                                return;
                            }
                            let func;
                            for (const i in functions) {
                                if (functions[i].id === id) {
                                    func = functions[i];
                                }
                            }
                            const tabContent = $('<div/>');
                            const tableFuncGen = $(
                                '<table class="table table-striped table-bordered" ' +
                                    `style="margin-left: auto; margin-right: auto;" id="${
                                        self.pref
                                    }${id
                                    }-table"/>`
                            );
                            tabContent.append(tableFuncGen);
                            const headings = ['Genome', 'Genes', 'Scores', 'Families'];
                            tableFuncGen.append(`<tr><th><b>${  headings.join('</b></th><th><b>')  }</b></th></tr>`);
                            for (const i in genomes) {
                                const genome = genomes[i];
                                let genes = '';
                                let scores = '';
                                // var functions = "";
                                let fams = '';
                                // var sss = '';
                                // var primclass = '';
                                // var subclass = '';
                                if (func.genome_features[genome.genome_ref] === undefined) {
                                    genes = 'none';
                                    scores = 'none';
                                    fams = 'none';
                                } else {
                                    const genearray = func.genome_features[genome.genome_ref];
                                    for (const k in genearray) {
                                        if (k > 0) {
                                            genes += '<br>';
                                            scores += '<br>';
                                            fams += '<br>';
                                        }
                                        genes += genearray[0];
                                        scores += genearray[2];
                                        fams += families[genearray[1]].id;
                                    }
                                }
                                const row = [genome.name, genes, fams, scores];
                                tableFuncGen.append(`<tr><td>${  row.join('</td><td>')  }</td></tr>`);
                            }
                            tabPane.kbaseTabs('addTab', {tab: id, content: tabContent, canDelete: true, show: true});
                        });
                    }

                    function getSortedKeys(obj) {
                        const keys = [];
                        for (const key in obj) keys.push(key);
                        return keys.sort((a, b) => {
                            return obj[b] - obj[a];
                        });
                    }
                },
                (data) => {
                    container.empty();
                    container.append(`<p>[Error] ${  data.error.message  }</p>`);
                    return;
                }
            );
            return this;
        },
        loggedInCallback() {
            //this.token = auth.token;
            this.render();
            return this;
        },
        loggedOutCallback() {
            //this.token = null;
            this.render();
            return this;
        }
    });
});
