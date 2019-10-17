define([
    'jquery',

    'kbaseUI/widget/legacy/widget',
    'widgets/genomes/kbaseMultiContigBrowser',
    'widgets/metagenomes/annotatedMetagenomeAssemblyViewer'
], function ($) {
    'use strict';
    $.KBWidget({
        name: 'KBaseAnnotatedMetagenomeAssemblyWideAssemAnnot',
        parent: 'kbaseWidget',
        version: '1.0.0',
        options: {
            genomeID: null,
            workspaceID: null,
            ver: null,
            genomeInfo: null,
            is_metagenome: false,
        },
        init: function (options) {
            this._super(options);
            this.render();
            return this;
        },
        render: function () {
            var self = this;
            var row1 = $('<div class="row">');
            self.$elem.append(row1);
            var genetable = $('<div>');
            row1.append(genetable);
            genetable.kbaseAnnotatedMetagenomeAssemblyView({
                ws: self.options.genomeInfo.info[6],
                id: self.options.genomeInfo.info[0],
                ver: self.options.genomeInfo.info[4],
                runtime: self.runtime
            });
        },
        getData: function () {
            return {
                type: 'Annotated Metagenome Assembly Assembly and Annotation',
                id: this.options.genomeID,
                workspace: this.options.workspaceID,
                title: 'Assembly and Annotation'
            };
        }
    });
});
