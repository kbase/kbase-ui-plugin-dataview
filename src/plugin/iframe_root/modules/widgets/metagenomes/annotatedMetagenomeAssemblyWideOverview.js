/**
 * Shows general gene info.
 * Such as its name, synonyms, annotation, publications, etc.
 *
 * Gene "instance" info (e.g. coordinates on a particular strain's genome)
 * is in a different widget.
 */
define([
    'jquery',
    'kbaseUI/widget/legacy/widget',
    'widgets/metagenomes/annotatedMetagenomeAssemblyOverview'
], ($) => {
    $.KBWidget({
        name: 'annotatedMetagenomeAssemblyWideOverview',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            metagenomeID: null,
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
            const $overview = $('<div class="col-md-4">');
            // safe
            row.append($overview);

            $overview.KBaseAMAOverview({
                genomeID: self.options.metagenomeID,
                workspaceID: self.options.workspaceID,
                genomeInfo: self.options.genomeInfo,
                runtime: self.runtime
            });
        },
        getData() {
            return {
                type: 'Annotated Metagenome Assembly Overview',
                id: this.options.metagenomeID,
                workspace: this.options.workspaceID,
                title: 'Overview'
            };
        }
    });
});
