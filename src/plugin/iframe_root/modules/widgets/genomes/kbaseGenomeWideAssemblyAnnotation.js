define([
    'jquery',

    // For effect
    'kbaseUI/widget/legacy/widget',
    'widgets/genomes/kbaseMultiContigBrowser',
    'widgets/genomes/kbaseSEEDFunctions',
    'widgets/genomes/kbaseGenomeGeneTable'
], ($) => {
    $.KBWidget({
        name: 'KBaseGenomeWideAssemAnnot',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            genomeID: null,
            workspaceID: null,
            ver: null,
            genomeInfo: null,
            contigSetInfo: null
        },
        init(options) {
            this._super(options);
            this.render();
            return this;
        },
        render() {
            const self = this;
            const row0 = $('<div class="row">');
            // safe
            self.$elem.append(row0);
            const contigbrowser = $('<div class="col-md-12">');
            // safe
            row0.append(contigbrowser);
            contigbrowser.KBaseMultiContigBrowser({
                genomeID: self.options.genomeID,
                workspaceID: self.options.workspaceID,
                ver: self.options.ver,
                genomeInfo: self.options.genomeInfo,
                runtime: self.runtime
            });
            const row1 = $('<div class="row">');
            // safe
            self.$elem.append(row1);
            const seedannotations = $('<div class="col-md-6">');
            // safe
            row1.append(seedannotations);
            const genetable = $('<div class="col-md-6">');
            // safe
            row1.append(genetable);
            seedannotations.KBaseSEEDFunctions({
                objNameOrId: self.options.genomeID,
                wsNameOrId: self.options.workspaceID,
                objVer: null,
                genomeInfo: self.options.genomeInfo,
                runtime: self.runtime
            });
            genetable.KBaseGenomeGeneTable({
                genome_id: self.options.genomeID,
                ws_name: self.options.workspaceID,
                ver: self.options.ver,
                genomeInfo: self.options.genomeInfo,
                runtime: self.runtime
            });
        },
        getData() {
            return {
                type: 'Genome Assembly and Annotation',
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: 'Assembly and Annotation'
            };
        }
    });
});
