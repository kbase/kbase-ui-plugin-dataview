define(["jquery","widgets/modeling/KBModeling","widgets/modeling/kbaseTabTable"],(function(e,t){
"use strict";t.prototype.KBaseSearch_GenomeSet=function(t){
this.modeltabs=t,this.setMetadata=function(t){
this.workspace=t[7],this.objName=t[1],this.overview={wsid:t[7]+"/"+t[1],
objecttype:t[2],owner:t[5],instance:t[4],moddate:t[3]
},"Name"in t[10]&&(this.usermeta={name:t[10].Name,
source:t[10].Source+"/"+t[10]["Source ID"],type:t[10].Type
},e.extend(this.overview,this.usermeta))},this.setData=function(e){
for(var t in this.data=e,this.genome_refs=[],e.elements)this.genome_refs.push({
ref:e.elements[t].ref})},this.tabList=[{key:"overview",name:"Overview",
type:"verticaltbl",rows:[{label:"ID",key:"wsid"},{label:"Object type",
key:"objecttype",type:"typelink"},{label:"Owner",key:"owner"},{label:"Version",
key:"instance"},{label:"Mod-date",key:"moddate"},{label:"Name",key:"name"},{
label:"Source",key:"source"}]},{key:"genome_refs",name:"Genomes",
type:"dataTable",columns:[{label:"Genome",key:"ref",linkformat:"dispWSRef",
type:"wstype",wstype:"KBaseGenomes.Genome"}]}]}}));