define(["jquery","kb_common/jsonRpc/dynamicServiceClient","widgets/modeling/KBModeling","widgets/modeling/kbaseTabTable"],(function(e,a,t){
"use strict";t.prototype.KBaseBiochem_CompoundSet=function(e){
this.tabwidget=e,this.runtime=e.runtime,this.setMetadata=function(e){
this.overview={wsid:e[7]+"/"+e[1],objecttype:e[2],owner:e[5],instance:e[4],
moddate:e[3]}},this.setData=function(a){
this.data=a,this.compounds=this.data.compounds,this.cpdhash={}
;for(var t=[],i=0;i<this.compounds.length;i++){var n=this.compounds[i]
;n.img=e.compoundImage(n.id),this.cpdhash[n.id]=n,t.push(n.id)}
},this.CompoundTab=function(e){var t=this.cpdhash[e.id],i=new a({
url:this.runtime.config("services.service_wizard.url"),
token:this.runtime.service("session").getAuthToken(),module:"BiochemistryAPI"
}),n=[{label:"Compound",data:t.id},{label:"Image",data:t.img},{label:"Name",
data:t.name},{label:"Formula",data:t.formula},{label:"Charge",data:t.charge},{
label:"Mass",data:t.mass},{label:"InChIKey",data:t.inchikey},{label:"SMILES",
data:t.smiles},{label:"Concentration",data:t.concentration}]
;return t.smiles?i.callFunc("depict_compounds",[{structures:[t.smiles]
}]).then((function(e){return n[1]={label:"Image",data:e[0]},n})):n
},this.tabList=[{key:"overview",name:"Overview",type:"verticaltbl",rows:[{
label:"ID",key:"wsid"},{label:"Object type",key:"objecttype",type:"typelink"},{
label:"Owner",key:"owner"},{label:"Version",key:"instance"},{label:"Mod-date",
key:"moddate"},{label:"Name",key:"name"},{label:"Description",key:"description"
},{label:"Number compounds",key:"numcompounds"}]},{key:"compounds",
name:"Media compounds",type:"dataTable",columns:[{label:"Compound",key:"id",
type:"tabLink",linkformat:"dispID",method:"CompoundTab"},{label:"Name",
key:"name"},{label:"Formula",key:"formula"},{label:"Charge",key:"charge"},{
label:"InChIKey",key:"inchikey"},{label:"Mass",key:"mass"}]}]}}));