define(["jquery","kbaseUI/widget/legacy/widget","widgets/genomes/kbaseMultiContigBrowser","widgets/metagenomes/annotatedMetagenomeAssemblyViewer"],(function(e){
"use strict";e.KBWidget({name:"KBaseAnnotatedMetagenomeAssemblyWideAssemAnnot",
parent:"kbaseWidget",version:"1.0.0",options:{genomeID:null,workspaceID:null,
ver:null,genomeInfo:null,is_metagenome:!1},init:function(e){
return this._super(e),this.render(),this},render:function(){
var n=e('<div class="row">');this.$elem.append(n);var t=e("<div>")
;n.append(t),t.kbaseAnnotatedMetagenomeAssemblyView({
ws:this.options.genomeInfo.info[6],id:this.options.genomeInfo.info[0],
ver:this.options.genomeInfo.info[4],runtime:this.runtime})},getData:function(){
return{type:"Annotated Metagenome Assembly Assembly and Annotation",
id:this.options.genomeID,workspace:this.options.workspaceID,
title:"Assembly and Annotation"}}})}));