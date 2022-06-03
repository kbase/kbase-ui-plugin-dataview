define([
    'jquery',
    'kb_common/html',
    'kb_service/client/workspace',
    'lib/jqueryUtils',

    // for effect
    'datatables_bootstrap',
    'kbaseUI/widget/legacy/authenticatedWidget'
], (
    $,
    html,
    Workspace,
    {$errorAlert}
) => {
    $.KBWidget({
        name: 'KBaseGenomeGeneTable',
        parent: 'kbaseAuthenticatedWidget',
        version: '1.0.0',
        genome_id: null,
        ws_name: null,
        kbCache: null,
        width: 1150,
        options: {
            genome_id: null,
            ws_name: null,
            ver: null,
            genomeInfo: null
        },
        init(options) {
            this._super(options);

            this.ws_name = this.options.ws_name;
            this.genome_id = this.options.genome_id;
            this.render();
            return this;
        },
        render() {
            const self = this;
            const pref = this.uuid();

            const container = this.$elem;

            // xss safe
            container.append(html.loading('loading genes data...'));

            const genomeRef = `${String(this.options.ws_name)  }/${  String(this.options.genome_id)}`;

            const showData = function (gnm) {
                function showGenes() {
                    container.empty();
                    ////////////////////////////// Genes Tab //////////////////////////////
                    // xss safe
                    container.append(
                        $('<div />')
                            .css('overflow', 'auto')
                            // xss safe
                            .append(
                                `<table cellpadding="0" cellspacing="0" border="0" id="${
                                    pref
                                }genes-table" ` +
                                    'class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>'
                            )
                    );
                    const genesData = [];
                    const geneMap = {};
                    const contigMap = {};

                    if (gnm.contig_ids && gnm.contig_lengths && gnm.contig_ids.length === gnm.contig_lengths.length) {
                        for (const pos in gnm.contig_ids) {
                            const contigId = gnm.contig_ids[pos];
                            const contigLen = gnm.contig_lengths[pos];
                            contigMap[contigId] = {name: contigId, length: contigLen, genes: []};
                        }
                    }

                    /*function geneEvents() {
                     $('.' + pref + 'gene-click').unbind('click');
                     $('.' + pref + 'gene-click').click(function () {
                     var geneId = [$(this).data('geneid')];
                     window.open("#/genes/" + genomeRef + "/" + geneId, "_blank");
                     });
                     }*/

                    for (const genePos in gnm.features) {
                        const gene = gnm.features[genePos];
                        const geneId = gene.id;
                        let contigName = null;
                        let geneStart = null;
                        let geneDir = null;
                        let geneLen = null;
                        if (gene.location && gene.location.length > 0) {
                            contigName = gene.location[0][0];
                            geneStart = gene.location[0][1];
                            geneDir = gene.location[0][2];
                            geneLen = gene.location[0][3];
                        }
                        const geneType = gene.type;
                        let geneFunc = gene['function'];
                        if (!geneFunc) geneFunc = '-';
                        genesData.push({
                            id:
                                `<a href="/#dataview/${
                                    genomeRef
                                }?sub=Feature&subid=${
                                    geneId
                                }" target="_blank">${
                                    geneId
                                }</a>`,
                            contig: contigName,
                            start: geneStart,
                            dir: geneDir,
                            len: geneLen,
                            type: geneType,
                            func: geneFunc
                        });
                        geneMap[geneId] = gene;
                        let contig = contigMap[contigName];
                        if (contigName !== null && !contig) {
                            contig = {name: contigName, length: 0, genes: []};
                            contigMap[contigName] = contig;
                        }
                        if (contig) {
                            let geneStop = Number(geneStart);
                            if (geneDir === '+') geneStop += Number(geneLen);
                            if (contig.length < geneStop) {
                                contig.length = geneStop;
                            }
                            contig.genes.push(gene);
                        }
                    }
                    const genesSettings = {
                        sPaginationType: 'full_numbers',
                        iDisplayLength: 10,
                        aaSorting: [[1, 'asc'], [2, 'asc']], // [[0,'asc']],
                        sDom: 't<fip>',
                        aoColumns: [
                            {sTitle: 'Gene ID', mData: 'id'},
                            {sTitle: 'Contig', mData: 'contig'},
                            {sTitle: 'Start', mData: 'start', sWidth: '7%'},
                            {sTitle: 'Strand', mData: 'dir', sWidth: '7%'},
                            {sTitle: 'Length', mData: 'len', sWidth: '7%'},
                            {sTitle: 'Type', mData: 'type', sWidth: '10%'},
                            {sTitle: 'Function', mData: 'func', sWidth: '45%'}
                        ],
                        aaData: genesData,
                        oLanguage: {
                            sSearch: '&nbsp&nbspSearch genes:',
                            sEmptyTable: 'No genes found.'
                        }
                    };
                    $(`#${  pref  }genes-table`).dataTable(genesSettings);
                }

                if (gnm.features.length > 35000) {
                    const btnId = `btn_show_genes${pref}`;
                    // xss safe
                    container.html(
                        'There are many features in this genome, so displaying the full, ' +
                            'sortable gene list may cause your web browser to run out of memory and become ' +
                            'temporarily unresponsive.  Click below to attempt to show the gene list anyway.<br>' +
                            `<button id='${
                                btnId
                            }' class='btn btn-primary'>Show Gene List</button>`
                    );
                    $(`#${btnId}`).click(() => {
                        showGenes();
                    });
                } else {
                    showGenes();
                }
            };
            if (self.options.genomeInfo) {
                showData(self.options.genomeInfo.data);
            } else {
                const objId = {ref: genomeRef};

                const workspace = new Workspace(
                    self.runtime.getConfig('services.workspace.url', {
                        token: self.runtime.service('session').getAuthToken()
                    })
                );
                workspace
                    .get_objects([objId])
                    .then((data) => {
                        showData(data[0]);
                    })
                    .catch((err) => {
                        console.error(err);
                        container.html($errorAlert(err));
                    });
            }
            return this;
        },
        getData() {
            return {
                type: 'KBaseGenomeGeneTable',
                id: `${this.options.ws_name  }.${  this.options.genome_id}`,
                workspace: this.options.ws_name,
                title: 'Gene list'
            };
        },
        uuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0,
                    v = c == 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }
    });
});
