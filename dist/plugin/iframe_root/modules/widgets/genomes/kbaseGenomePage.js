define(["jquery","uuid","kb_common/html","kb_service/client/workspace","kb_service/utils","kb_lib/jsonRpc/dynamicServiceClient","kbaseUI/widget/legacy/widget","widgets/genomes/kbaseGenomeWideOverview","widgets/genomes/kbaseLitWidget","widgets/genomes/kbaseGenomeWideTaxonomy","widgets/genomes/kbaseGenomeWideAssemblyAnnotation"],(function(e,n,i,t,o,s){
"use strict";e.KBWidget({name:"KBaseGenomePage",parent:"kbaseWidget",
version:"1.0.0",options:{genomeID:null,workspaceID:null,ver:null},
init:function(e){
return this._super(e),this.init_view(),this.fetchGenome(),this.assemblyAPI=new s({
url:this.runtime.getConfig("services.service_wizard.url"),module:"AssemblyAPI",
auth:{token:this.runtime.service("session").getAuthToken()}}),this},
fetchGenome:function(){
var e=this,n=this.options.workspaceID,i=this.options.genomeID,t=(this.options.objectVersion,
n+"/"+i),a=["contigset_ref","assembly_ref","domain","dna_size","scientific_name","source","source_id","genetic_code","id","contig_ids","contig_lengths","gc_content","taxonomy"],r=["type","id","contig_id","location","function","functions"]
;this.genomeAnnotationAPI=new s({
url:this.runtime.getConfig("services.service_wizard.url"),
module:"GenomeAnnotationAPI",auth:{
token:this.runtime.service("session").getAuthToken()}
}),this.options.objectVersion&&(t+="/"+this.options.objectVersion),
this.genomeAnnotationAPI.callFunc("get_genome_v1",[{genomes:[{ref:t}],
included_fields:a}]).spread((function(n){const i=n.genomes[0];let s=null
;const l=i.data;let d=i.info[10];const c=function(e,n,i,t){
e.dna_size=n,e.gc_content=i,e.num_contigs=t},p=function(e,n){
console.error("Error loading contigset subdata",e,n)}
;return l.hasOwnProperty("contigset_ref")?s=l.contigset_ref:l.hasOwnProperty("assembly_ref")?s=l.assembly_ref:p(l,"No assembly reference present!"),
i.objectInfo=o.objectInfoToObject(i.info),
"Eukaryota"===l.domain||"Plant"===l.domain?d&&d["GC content"]&&d.Size&&d["Number contigs"]?(c(l,d.Size,d["GC content"],d["Number contigs"]),
e.render(i),null):e.assemblyAPI.callFunc("get_stats",[s]).spread((function(n){
return c(l,n.dna_size,n.gc_content,n.num_contigs),e.render(i),null
})).catch((function(e){p(l,e)
})):(a.push("features"),e.genomeAnnotationAPI.callFunc("get_genome_v1",[{
genomes:[{ref:t}],included_fields:a,included_feature_fields:r
}]).spread((function(n){const t=n.genomes[0].data.features;if(i.data.features=t,
d=i.info[10],
d&&d["GC content"]&&d.Size&&d["Number contigs"])c(l,d.Size,d["GC content"],d["Number contigs"]),
e.render(i);else{
if(!l.hasOwnProperty("dna_size"))return e.assemblyAPI.callFunc("get_stats",[s]).spread((function(n){
c(l,n.dna_size,n.gc_content,n.num_contigs),e.render(i)})).catch((function(e){
p(l,e)}));e.render(i)}return null})).catch((function(n){
e.showError(e.view.panels[0].inner_div,n),console.error(n)})),null)
})).catch((function(n){
console.error("Error loading genome subdata"),console.error(n),
e.showError(e.view.panels[0].inner_div,n),
e.view.panels[1].inner_div.empty(),e.view.panels[2].inner_div.empty(),
e.view.panels[3].inner_div.empty()}))},fetchAssembly:function(e,n){
var i=null,t=e.data
;t.hasOwnProperty("contigset_ref")?i=t.contigset_ref:t.hasOwnProperty("assembly_ref")&&(i=t.assembly_ref),
this.assemblyAPI.callFunc("get_contig_ids",[i]).spread(o=>(Object.defineProperties(t,{
contig_ids:{__proto__:null,value:o,writable:!1,enumerable:!0}
}),this.assemblyAPI.callFunc("get_contig_lengths",[i,o]).spread(i=>(Object.defineProperties(t,{
contig_lengths:{__proto__:null,value:i,writable:!1,enumerable:!0}
}),n(e),null)).catch(e=>{this.showError(this.view.panels[3].inner_div,e)
}))).catch(e=>{this.showError(this.view.panels[3].inner_div,e)})},
init_view:function(){var n='<div data-element="body">';this.view={panels:[{
label:"Overview",name:"overview",outer_div:e("<div>"),inner_div:e(n)},{order:2,
label:"Publications",name:"publications",outer_div:e("<div>"),inner_div:e(n)},{
order:3,label:"Taxonomy",name:"taxonomy",outer_div:e("<div>"),inner_div:e(n)},{
order:4,label:"Assembly and Annotation",name:"assembly-annotation",
outer_div:e("<div>"),inner_div:e(n)}]};var t=this
;this.view.panels.forEach((function(e){
t.makeWidgetPanel(e.outer_div,e.label,e.name,e.inner_div),
t.$elem.append(e.outer_div),e.inner_div.html(i.loading("Loading..."))}))},
render:function(e){var n=this,i={ws:this.options.workspaceID,
id:this.options.genomeID,ver:this.options.objectVersion},t=function(e,i){
console.error(i),n.showError(e,i.message)};n.view.panels[0].inner_div.empty()
;try{n.view.panels[0].inner_div.KBaseGenomeWideOverview({genomeID:i.id,
workspaceID:i.ws,genomeInfo:e,runtime:n.runtime})}catch(r){
t(n.view.panels[0].inner_div,r)}var o=""
;e&&e.data.scientific_name&&(o=e.data.scientific_name),
n.view.panels[1].inner_div.empty();try{
n.view.panels[1].inner_div.KBaseLitWidget({literature:o,genomeInfo:e,
runtime:n.runtime})}catch(r){t(n.view.panels[1].inner_div,r)}
n.view.panels[2].inner_div.empty();try{
n.view.panels[2].inner_div.KBaseGenomeWideTaxonomy({genomeID:i.id,
workspaceID:i.ws,genomeRef:i,genomeInfo:e,runtime:n.runtime})}catch(r){
t(n.view.panels[2].inner_div,r)}
if(e&&"Eukaryota"===e.data.domain||e&&"Plant"===e.data.domain)n.view.panels[3].inner_div.empty(),
n.view.panels[3].inner_div.append("Browsing Eukaryotic Genome Features is not supported at this time.");else{
var s=e.data,a=function(e){n.view.panels[3].inner_div.empty();try{
n.view.panels[3].inner_div.KBaseGenomeWideAssemAnnot({genomeID:i.id,
workspaceID:i.ws,ver:i.ver,genomeInfo:e,runtime:n.runtime})}catch(r){
t(n.view.panels[3].inner_div,r)}}
;s.contig_ids&&s.contig_lengths&&s.contig_ids.length===s.contig_lengths.length?a(e):n.fetchAssembly(e,a)
}},makeWidgetPanel:function(i,t,o,s){var a=new n(4).format()
;i.append(e('<div class="panel-group" id="accordion_'+a+'" role="tablist" aria-multiselectable="true" data-panel="'+o+'">').append(e('<div class="panel panel-default kb-widget">').append('<div class="panel-heading" role="tab" id="heading_'+a+'"><h4 class="panel-title"><span data-toggle="collapse" data-parent="#accordion_'+a+'" data-target="#collapse_'+a+'" aria-expanded="false" aria-controls="collapse_'+a+'" style="cursor:pointer;" data-element="title"> '+t+"</span></h4></div>").append(e('<div id="collapse_'+a+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading_'+a+'" area-expanded="true">').append(e('<div class="panel-body">').append(s)))))
},getData:function(){return{type:"Genome Page",id:this.options.genomeID,
workspace:this.options.workspaceID,title:"Genome Page"}},
showError:function(n,i){n.empty()
;const t=e("<div>").addClass("alert alert-danger").append(e("<div>").addClass("text-danger").css("font-weight","bold").text("Error")).append(e("<p>").text(JSON.stringify(i.message))).append(e("<div>").text(JSON.stringify(i)))
;n.append(t)}})}));