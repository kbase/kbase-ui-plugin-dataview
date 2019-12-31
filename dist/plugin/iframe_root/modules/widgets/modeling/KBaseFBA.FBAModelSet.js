define(["widgets/modeling/KBModeling"],(function(e){"use strict"
;e.prototype.KBaseFBA_FBAModelSet=function(e){
this.modeltabs=e,this.setMetadata=function(e){
this.workspace=e[7],this.objName=e[1],this.overview={wsid:e[7]+"/"+e[1],
objecttype:e[2],owner:e[5],instance:e[4],moddate:e[3]}
},this.setData=function(e){
for(var t in this.data=e,this.models=[],e.elements)this.models.push({
ref:e.elements[t].ref})},this.tabList=[{key:"overview",name:"Overview",
type:"verticaltbl",rows:[{label:"ID",key:"wsid"},{label:"Object type",
key:"objecttype",type:"typelink"},{label:"Owner",key:"owner"},{label:"Version",
key:"instance"},{label:"Mod-date",key:"moddate"}]},{key:"models",name:"Models",
type:"dataTable",columns:[{label:"Model",key:"ref",linkformat:"dispWSRef",
type:"wstype",wstype:"KBaseFBA.FBAModel"}]}]}}));