define(["jquery","kbaseUI/widget/legacy/widget","widgets/genomes/kbaseGenomeOverview","widgets/genomes/kbaseWikiDescription"],(function(e){
"use strict";e.KBWidget({name:"KBaseGenomeWideOverview",parent:"kbaseWidget",
version:"1.0.0",options:{genomeID:null,workspaceID:null,genomeInfo:null},
init:function(e){return this._super(e),this.render(),this},render:function(){
var i=e('<div class="row">');this.$elem.append(i)
;var n=e('<div class="col-md-4">');i.append(n);var o=e('<div class="col-md-8">')
;i.append(o),n.KBaseGenomeOverview({genomeID:this.options.genomeID,
workspaceID:this.options.workspaceID,genomeInfo:this.options.genomeInfo,
runtime:this.runtime}),o.KBaseWikiDescription({genomeID:this.options.genomeID,
workspaceID:this.options.workspaceID,genomeInfo:this.options.genomeInfo,
runtime:this.runtime})},getData:function(){return{type:"Genome Overview",
id:this.options.genomeID,workspace:this.options.workspaceID,title:"Overview"}}})
}));