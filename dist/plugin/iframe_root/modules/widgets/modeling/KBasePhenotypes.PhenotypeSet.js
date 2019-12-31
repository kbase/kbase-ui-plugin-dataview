define(["jquery","widgets/modeling/KBModeling","widgets/modeling/kbaseTabTable"],(function(e,t){
"use strict";t.prototype.KBasePhenotypes_PhenotypeSet=function(t){var o=this
;this.modeltabs=t,this.setMetadata=function(t){
this.workspace=t[7],this.objName=t[1],this.overview={wsid:t[7]+"/"+t[1],
objecttype:t[2],owner:t[5],instance:t[4],moddate:t[3]
},"Name"in t[10]&&(this.usermeta={name:t[10].Name,
source:t[10].Source+"/"+t[10]["Source ID"],
numphenotypes:t[10]["Number phenotypes"],type:t[10].Type
},e.extend(this.overview,this.usermeta))},this.setData=function(e){
this.data=e,this.phenotypes=this.data.phenotypes
;for(var t={},n=0;n<this.phenotypes.length;n++)for(var a=this.phenotypes[n].additionalcompound_refs,s=0;s<a.length;s++)t[a[s]]=1
;var i=[];for(var p in t)i.push(p)
;return this.modeltabs.getBiochemCompounds(i).then((function(e){
for(var t={},n=0;n<e.length;n++)t[e[n].id]=e[n].name
;for(var a=0;a<o.phenotypes.length;a++){
var s=o.phenotypes[a].additionalcompound_refs,i=[]
;for(n=0;n<s.length;n++)i.push(t[s[n].split("/").pop()])
;o.phenotypes[a].additionalcompound_names=i}return null})).catch((function(e){
console.error(e)}))},this.tabList=[{key:"overview",name:"Overview",
type:"verticaltbl",rows:[{label:"ID",key:"wsid"},{label:"Object type",
key:"objecttype",type:"typelink"},{label:"Owner",key:"owner"},{label:"Version",
key:"instance"},{label:"Mod-date",key:"moddate"},{label:"Name",key:"name"},{
label:"Source",key:"source"},{label:"Number phenotypes",key:"numphenotypes"},{
label:"Phenotype type",key:"type"}]},{key:"phenotypes",name:"Phenotypes",
type:"dataTable",columns:[{label:"Growth condition",key:"media_ref",
linkformat:"dispWSRef",type:"wstype",wstype:"KBaseFBA.Media"},{label:"Gene KO",
type:"wstype",key:"geneko_refs"},{label:"Additional compounds",
key:"additionalcompound_names"},{label:"Observed normalized growth",
key:"normalizedGrowth"}]}]}}));