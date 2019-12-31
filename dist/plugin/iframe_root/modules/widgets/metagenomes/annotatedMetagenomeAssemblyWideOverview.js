define(["jquery","kbaseUI/widget/legacy/widget","widgets/metagenomes/annotatedMetagenomeAssemblyOverview"],(function(e){
"use strict";e.KBWidget({name:"annotatedMetagenomeAssemblyWideOverview",
parent:"kbaseWidget",version:"1.0.0",options:{metagenomeID:null,
workspaceID:null,genomeInfo:null},init:function(e){
return this._super(e),this.render(),this},render:function(){
var t=e('<div class="row">');this.$elem.append(t)
;var n=e('<div class="col-md-4">');t.append(n),n.KBaseAMAOverview({
genomeID:this.options.metagenomeID,workspaceID:this.options.workspaceID,
genomeInfo:this.options.genomeInfo,runtime:this.runtime})},getData:function(){
return{type:"Annotated Metagenome Assembly Overview",
id:this.options.metagenomeID,workspace:this.options.workspaceID,title:"Overview"
}}})}));