define(["jquery","kb_service/client/workspace","kb_widget_dataview_modeling_modeling"],(function(e,t,n){
"use strict";n.prototype.KBasePhenotypes_PhenotypeSimulationSet=function(o){
var a=this
;this.tabwidget=o,this.runtime=o.runtime,this.workspaceClient=new t(this.runtime.config("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()
}),this.setMetadata=function(t){
this.workspace=t[7],this.objName=t[1],this.overview={wsid:t[7]+"/"+t[1],
objecttype:t[2],owner:t[5],instance:t[4],moddate:t[3]
},"Name"in t[10]&&(this.usermeta={name:t[10].Name,
source:t[10].Source+"/"+t[10]["Source ID"],
numphenotypes:t[10]["Number phenotypes"],type:t[10].Type
},e.extend(this.overview,this.usermeta))},this.setData=function(e){
a.data=e,this.workspaceClient.get_objects([{ref:e.phenotypeset_ref
}]).then((function(e){var t=new n
;return a.phenoset=new t.KBasePhenotypes_PhenotypeSet(a.tabwidget),
a.phenoset.setMetadata(e[0].info),a.phenoset.setData(e[0].data)
})).then((function(){return a.formatObject(),null})).catch((function(e){
console.error(e)}))},this.formatObject=function(){
a.phenotypes=a.phenoset.phenotypes;for(var e=0;e<a.phenotypes.length;e++){
var t=a.phenotypes[e]
;t.simulatedGrowth=a.data.phenotypeSimulations[e].simulatedGrowthFraction,
t.phenoclass=a.data.phenotypeSimulations[e].phenoclass}},this.tabList=[{
key:"overview",name:"Overview",type:"verticaltbl",rows:[{label:"ID",key:"wsid"
},{label:"Object type",key:"objecttype",type:"typelink"},{label:"Owner",
key:"owner"},{label:"Version",key:"instance"},{label:"Mod-date",key:"moddate"},{
label:"Name",key:"name"},{label:"Source",key:"source"},{
label:"Number phenotypes",key:"numphenotypes"},{label:"Phenotype type",
key:"type"}]},{key:"phenotypes",name:"Phenotypes",type:"dataTable",columns:[{
label:"Growth condition",key:"media_ref",linkformat:"dispWSRef",type:"wstype",
wstype:"KBaseFBA.Media"},{label:"Gene KO",type:"wstype",key:"geneko_refs"},{
label:"Additional compounds",key:"additionalcompound_names"},{
label:"Observed normalized growth",key:"normalizedGrowth"},{
label:"Simulated growth",key:"simulatedGrowth"},{label:"Prediction class",
key:"phenoclass"}]}]}}));