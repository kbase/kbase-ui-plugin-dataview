define(["widgets/modeling/KBModeling"],(function(e){"use strict"
;e.prototype.KBaseBiochem_Media=function(e){var a=this
;this.tabwidget=e,this.setMetadata=function(e){this.overview={
wsid:e[7]+"/"+e[1],objecttype:e[2],owner:e[5],instance:e[4],moddate:e[3],
name:e[10].Name,source:e[10]["Source ID"],minimal:e[10]["Is Minimal"],
defined:e[10]["Is Defined"],numcompounds:e[10]["Number compounds"]}
},this.setData=function(e){
this.data=e,this.mediacompounds=this.data.mediacompounds,
this.reagents=this.data.reagents,this.cpdhash={}
;for(var t=[],o=0;o<this.mediacompounds.length;o++){var l=this.mediacompounds[o]
;l.id=l.compound_ref.split("/").pop(),this.cpdhash[l.id]=l,t.push(l.id)}
return this.tabwidget.getBiochemCompounds(t).then(e=>{
for(var t=0;t<a.mediacompounds.length;t++){var o=a.mediacompounds[t]
;e[t]&&(o.name=e[t].name,
o.formula=e[t].formula,o.charge=e[t].charge,o.deltaG=e[t].deltaG,
o.deltaGErr=e[t].deltaGErr,o.abbrev=e[t].abbrev)}}).catch(e=>{
console.error("Error getting biochem compounds",e)})
},this.CompoundTab=function(e){var a=this.cpdhash[e.id];return[{
label:"Compound",data:a.id},{label:"Name",data:a.name},{label:"Formula",
data:a.formula},{label:"Charge",data:a.charge},{label:"deltaG",data:a.deltaG},{
label:"Max flux",data:a.maxFlux},{label:"Min flux",data:a.minFlux},{
label:"Concentration",data:a.concentration}]},this.tabList=[{key:"overview",
name:"Overview",type:"verticaltbl",rows:[{label:"ID",key:"wsid"},{
label:"Object type",key:"objecttype",type:"typelink"},{label:"Owner",key:"owner"
},{label:"Version",key:"instance"},{label:"Mod-date",key:"moddate"},{
label:"Name",key:"name"},{label:"Source",key:"source"},{label:"Is minimal",
key:"minimal"},{label:"Is defined",key:"defined"},{label:"Number compounds",
key:"numcompounds"}]},{key:"mediacompounds",name:"Media compounds",
type:"dataTable",columns:[{label:"Compound",key:"id",type:"tabLink",
linkformat:"dispID",method:"CompoundTab"},{label:"Name",key:"name"},{
label:"Formula",key:"formula"},{label:"Charge",key:"charge"},{
label:"Min uptake<br>(mol/g CDW hr)",key:"minFlux"},{
label:"Max uptake<br>(mol/g CDW hr)",key:"maxFlux"}]}]}}));