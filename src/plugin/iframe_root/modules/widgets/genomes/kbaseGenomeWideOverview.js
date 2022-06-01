/**
 * Shows general gene info.
 * Such as its name, synonyms, annotation, publications, etc.
 *
 * Gene "instance" info (e.g. coordinates on a particular strain's genome)
 * is in a different widget.
 */
define([
    'jquery',

    // FOr effect
    'kbaseUI/widget/legacy/widget',
    'widgets/genomes/kbaseGenomeOverview',
    'widgets/genomes/kbaseWikiDescription'
], ($) => {
    $.KBWidget({
        name: 'KBaseGenomeWideOverview',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            genomeID: null,
            workspaceID: null,
            genomeInfo: null
        },
        init(options) {
            this._super(options);
            this.render();
            return this;
        },
        render() {
            const self = this;
            const row = $('<div class="row">');
            // safe
            self.$elem.append(row);
            const overview = $('<div class="col-md-4">');
            // safe
            row.append(overview);
            const wikidescription = $('<div class="col-md-8">');
            // safe
            row.append(wikidescription);

            overview.KBaseGenomeOverview({
                genomeID: self.options.genomeID,
                workspaceID: self.options.workspaceID,
                genomeInfo: self.options.genomeInfo,
                runtime: self.runtime
            });
            wikidescription.KBaseWikiDescription({
                genomeID: self.options.genomeID,
                workspaceID: self.options.workspaceID,
                genomeInfo: self.options.genomeInfo,
                runtime: self.runtime
            });
        },
        getData() {
            return {
                type: 'Genome Overview',
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: 'Overview'
            };
        }
    });
});
