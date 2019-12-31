define(["jquery","uuid","kb_common/html","kb_service/client/workspace","kb_service/utils","kb_lib/jsonRpc/dynamicServiceClient","kbaseUI/widget/legacy/widget","widgets/metagenomes/annotatedMetagenomeAssemblyWideOverview","widgets/metagenomes/annotatedMetagenomeAssembly_AssemblyandAnnotationTab"],(function(e,n,t,i,a,s){
"use strict";e.KBWidget({name:"AnnotatedMetagenomeAssembly",
parent:"kbaseWidget",version:"1.0.0",options:{metagenomeId:null,
workspaceId:null,objectVersion:null},init:function(e){
return this._super(e),this.init_view(),
this.fetchMetagenome(),this.assemblyAPI=new s({
url:this.runtime.getConfig("services.service_wizard.url"),module:"AssemblyAPI",
auth:{token:this.runtime.service("session").getAuthToken()}}),this},
fetchMetagenome:function(){
var e=this,n=this.options.workspaceId,t=this.options.objectId,i=(this.options.objectVersion,
n+"/"+t);this.metagenomeAPI=new s({
url:this.runtime.getConfig("services.service_wizard.url"),
module:"MetagenomeAPI",auth:{
token:this.runtime.service("session").getAuthToken()},version:"dev"
}),this.options.objectVersion&&(i+="/"+this.options.objectVersion),
this.metagenomeAPI.callFunc("get_annotated_metagenome_assembly",[{ref:i,
included_fields:["dna_size","source_id","genetic_code","taxonomy","genetic_code","assembly_ref","gc_content","environment"]
}]).spread((function(n){const t=n.genomes[0];let i=null;const s=t.data
;let o=t.info[10];const r=function(e,n,t,i){
e.dna_size=n,e.gc_content=t,e.num_contigs=i},l=function(e,n){
console.error("Error loading contigset subdata",e,n)}
;return s.hasOwnProperty("assembly_ref")?i=s.assembly_ref:l(s,"No assembly reference present!"),
t.objectInfo=a.objectInfoToObject(t.info),
o&&o.gc_content&&o.size&&o["Number contigs"]?(r(s,o.size,o["GC content"],o["Number contigs"]),
e.render(t),null):e.assemblyAPI.callFunc("get_stats",[i]).spread((function(n){
return r(s,n.dna_size,n.gc_content,n.num_contigs),e.render(t),null
})).catch((function(e){l(s,e)}))})).catch((function(n){
console.error("Error loading genome subdata"),
console.error(n),e.showError(e.view.panels[0].inner_div,n),
e.view.panels[1].inner_div.empty(),e.view.panels[2].inner_div.empty()}))},
init_view:function(){var n='<div data-element="body">';this.view={panels:[{
label:"Overview",name:"overview",outer_div:e("<div>"),inner_div:e(n)},{order:2,
label:"Assembly and Annotation",name:"assembly-annotation",outer_div:e("<div>"),
inner_div:e(n)}]};var i=this;this.view.panels.forEach((function(e){
i.makeWidgetPanel(e.outer_div,e.label,e.name,e.inner_div),
i.$elem.append(e.outer_div),e.inner_div.html(t.loading("Loading..."))}))},
render:function(e){var n=this,t={ws:this.options.workspaceID,
id:this.options.metagenomeID,ver:this.options.ver},i=function(e,t){
console.error(t),n.showError(e,t.message)};n.view.panels[0].inner_div.empty()
;try{n.view.panels[0].inner_div.annotatedMetagenomeAssemblyWideOverview({
metagenomeID:t.id,workspaceID:t.ws,genomeInfo:e,runtime:n.runtime})}catch(a){
i(n.view.panels[0].inner_div,a)}n.view.panels[1].inner_div.empty();try{
n.view.panels[1].inner_div.KBaseAnnotatedMetagenomeAssemblyWideAssemAnnot({
genomeID:t.id,workspaceID:t.ws,ver:t.ver,genomeInfo:e,runtime:n.runtime})
}catch(a){i(n.view.panels[1].inner_div,a)}},makeWidgetPanel:function(t,i,a,s){
var o=new n(4).format()
;t.append(e('<div class="panel-group" id="accordion_'+o+'" role="tablist" aria-multiselectable="true" data-panel="'+a+'">').append(e('<div class="panel panel-default kb-widget">').append('<div class="panel-heading" role="tab" id="heading_'+o+'"><h4 class="panel-title"><span data-toggle="collapse" data-parent="#accordion_'+o+'" data-target="#collapse_'+o+'" aria-expanded="false" aria-controls="collapse_'+o+'" style="cursor:pointer;" data-element="title"> '+i+"</span></h4></div>").append(e('<div id="collapse_'+o+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading_'+o+'" area-expanded="true">').append(e('<div class="panel-body">').append(s)))))
},getData:function(){return{type:"Annotated Metagenome Assembly Page",
id:this.options.metagenomeID,workspace:this.options.workspaceID,
title:"Annotated Metagenome Assembly Page"}},showError:function(n,t){n.empty()
;const i=e("<div>").addClass("alert alert-danger").append(e("<div>").addClass("text-danger").css("font-weight","bold").text("Error")).append(e("<p>").text(JSON.stringify(t.message))).append(e("<div>").text(JSON.stringify(t)))
;n.append(i)}})}));