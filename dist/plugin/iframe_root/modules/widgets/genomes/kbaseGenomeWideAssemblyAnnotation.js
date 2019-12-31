define(["jquery","kbaseUI/widget/legacy/widget","widgets/genomes/kbaseMultiContigBrowser","widgets/genomes/kbaseSEEDFunctions","widgets/genomes/kbaseGenomeGeneTable"],(function(e){
"use strict";e.KBWidget({name:"KBaseGenomeWideAssemAnnot",parent:"kbaseWidget",
version:"1.0.0",options:{genomeID:null,workspaceID:null,ver:null,
genomeInfo:null,contigSetInfo:null},init:function(e){
return this._super(e),this.render(),this},render:function(){
var n=e('<div class="row">');this.$elem.append(n)
;var o=e('<div class="col-md-12">');n.append(o),o.KBaseMultiContigBrowser({
genomeID:this.options.genomeID,workspaceID:this.options.workspaceID,
ver:this.options.ver,genomeInfo:this.options.genomeInfo,runtime:this.runtime})
;var s=e('<div class="row">');this.$elem.append(s)
;var t=e('<div class="col-md-6">');s.append(t);var i=e('<div class="col-md-6">')
;s.append(i),t.KBaseSEEDFunctions({objNameOrId:this.options.genomeID,
wsNameOrId:this.options.workspaceID,objVer:null,
genomeInfo:this.options.genomeInfo,runtime:this.runtime
}),i.KBaseGenomeGeneTable({genome_id:this.options.genomeID,
ws_name:this.options.workspaceID,ver:this.options.ver,
genomeInfo:this.options.genomeInfo,runtime:this.runtime})},getData:function(){
return{type:"Genome Assembly and Annotation",id:this.options.genomeID,
workspace:this.options.workspaceID,title:"Assembly and Annotation"}}})}));