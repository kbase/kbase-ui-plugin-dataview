define(["jquery","kb_service/client/workspace","kb_service/client/fba","kb_common/jsonRpc/dynamicServiceClient","widgets/modeling/KBModeling","widgets/modeling/kbasePathways"],(function(e,a,i,t,s){
"use strict";s.prototype.KBaseFBA_FBAModel=function(i){var s=this
;this.modeltabs=i,
this.runtime=i.runtime,this.workspaceClient=new a(this.runtime.config("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()
}),this.setMetadata=function(a){
this.workspace=a[7],this.objName=a[1],this.overview={wsid:a[7]+"/"+a[1],ws:a[7],
obj_name:a[1],objecttype:a[2],owner:a[5],instance:a[4],moddate:a[3]
},"Name"in a[10]&&(this.usermeta={name:a[10].Name,
source:a[10].Source+"/"+a[10]["Source ID"],genome:a[10].Genome,
modeltype:a[10].Type,numreactions:a[10]["Number reactions"],
numcompounds:a[10]["Number compounds"],
numcompartments:a[10]["Number compartments"],
numbiomass:a[10]["Number biomasses"],numgapfills:a[10]["Number gapfills"]
},e.extend(this.overview,this.usermeta))},this.cmpnamehash={c:"Cytosol",
p:"Periplasm",g:"Golgi apparatus",e:"Extracellular",r:"Endoplasmic reticulum",
l:"Lysosome",n:"Nucleus",d:"Plastid",m:"Mitochondria",x:"Peroxisome",
v:"Vacuole",w:"Cell wall"},this.tabList=[{key:"overview",name:"Overview",
type:"verticaltbl",rows:[{label:"Name",key:"name"},{label:"ID",key:"wsid"},{
label:"Object type",key:"objecttype",type:"typelink"},{label:"Owner",key:"owner"
},{label:"Version",key:"instance"},{label:"Mod-date",key:"moddate"},{
label:"Source",key:"source"},{label:"Genome",key:"genome",type:"wstype"},{
label:"Model type",key:"modeltype"},{label:"Number reactions",key:"numreactions"
},{label:"Number compounds",key:"numcompounds"},{label:"Number compartments",
key:"numcompartments"},{label:"Number biomass",key:"numbiomass"},{
label:"Number gapfills",key:"numgapfills"}]},{key:"modelreactions",
name:"Reactions",type:"dataTable",columns:[{label:"Reaction",type:"tabLink",
linkformat:"dispIDCompart",key:"id",method:"ReactionTab",width:"15%"},{
label:"Name",key:"name"},{label:"Equation",key:"equation",type:"tabLink",
linkformat:"linkequation"},{label:"Genes",key:"genes",type:"tabLinkArray",
method:"GeneTab"},{label:"Gapfilling",key:"gapfillingstring"}]},{
key:"modelcompounds",name:"Compounds",type:"dataTable",columns:[{
label:"Compound",key:"id",type:"tabLink",linkformat:"dispIDCompart",
method:"CompoundTab",width:"15%"},{label:"Name",key:"name"},{label:"Formula",
key:"formula"},{label:"Charge",key:"charge"},{label:"Compartment",key:"cmpkbid",
type:"tabLink",method:"CompartmentTab",linkformat:"dispID"}]},{key:"modelgenes",
name:"Genes",type:"dataTable",columns:[{label:"Gene",key:"id",type:"tabLink",
method:"GeneTab"},{label:"Reactions",key:"reactions",type:"tabLinkArray",
method:"ReactionTab"}]},{key:"modelcompartments",name:"Compartments",
type:"dataTable",columns:[{label:"Compartment",key:"id",type:"tabLink",
method:"CompartmentTab",linkformat:"dispID"},{label:"Name",key:"name"},{
label:"pH",key:"pH"},{label:"Potential",key:"potential"}]},{key:"biomasscpds",
name:"Biomass",type:"dataTable",columns:[{label:"Biomass",key:"biomass",
type:"tabLink",method:"BiomassTab",linkformat:"dispID"},{label:"Compound",
key:"id",type:"tabLink",linkformat:"dispIDCompart",method:"CompoundTab"},{
label:"Name",key:"name"},{label:"Coefficient",key:"coefficient"},{
label:"Compartment",key:"cmpkbid",type:"tabLink",linkformat:"dispID",
method:"CompartmentTab"}]},{key:"gapfillings",name:"Gapfilling",
type:"dataTable",columns:[{label:"Gapfill",key:"simpid"},{label:"Integrated",
key:"integrated"},{label:"Media",key:"media_ref",linkformat:"dispWSRef",
type:"wstype",wstype:"KBaseFBA.Media"}]},{name:"Pathways",
widget:"kbasePathways",getParams:function(){return{runtime:s.runtime,
models:[s.data]}}}],this.ReactionTab=function(e){var a=s.rxnhash[e.id],i=[{
label:"Reaction",data:a.dispid},{label:"Name",data:a.name}]
;return"pathway"in a&&i.push({label:"Pathway",data:a.pathway
}),"reference"in a&&i.push({label:"Reference",data:a.reference}),i.push({
label:"Compartment",
data:s.cmphash[a.cmpkbid].name+" "+s.cmphash[a.cmpkbid].compartmentIndex},{
label:"Equation",data:a.equation,type:"pictureEquation"},{label:"GPR",data:a.gpr
}),"rxn00000"!==a.rxnkbid?new t({
url:this.runtime.config("services.service_wizard.url"),
token:this.runtime.service("session").getAuthToken(),module:"BiochemistryAPI"
}).callFunc("get_reactions",[{reactions:[a.rxnkbid],biochemistry:s.biochem,
biochemistry_workspace:"kbase"}]).spread((function(e){"deltaG"in e[0]&&i.push({
label:"Delta G",data:e[0].deltaG+" ("+e[0].deltaGErr+") kcal/mol"
}),e[0].enzymes&&i.push({label:"Enzymes",data:e[0].enzymes.join(", ")})
;for(var a={},t=[],s=0;s<e[0].aliases.length;s++)e[0].aliases[s]in a||(t.push(e[0].aliases[s]),
a[e[0].aliases[s]]=1);return i.push({label:"Aliases",data:t.join(", ")}),i})):i
},this.GeneTab=function(e){var a;return s.modelgenes.forEach((function(i){
i.id===e.id&&(a=[{label:"ID",data:i.id},{label:"Reactions",data:i.reactions,
type:"tabLinkArray",method:"ReactionTab"}])})),a},this.CompoundTab=function(e){
var a=s.cpdhash[e.id],i=[{label:"Compound",data:a.dispid},{label:"Image",
data:"<img src=http://minedatabase.mcs.anl.gov/compound_images/ModelSEED/"+a.id.split("_")[0]+".png style='height:300px !important;'>"
},{label:"Name",data:a.name},{label:"Formula",data:a.formula},{label:"InChIKey",
data:a.inchikey},{label:"SMILES",data:a.smiles},{label:"Charge",data:a.charge},{
label:"Compartment",
data:s.cmphash[a.cmpkbid].name+" "+s.cmphash[a.cmpkbid].compartmentIndex
}],n=new t({url:this.runtime.config("services.service_wizard.url"),
token:this.runtime.service("session").getAuthToken(),module:"BiochemistryAPI"})
;return a.smiles&&"cpd00000"==a.cpdkbid?n.callFunc("depict_compounds",[{
structures:[a.smiles]}]).then((function(e){return i[1]={label:"Image",data:e[0]
},i})):"cpd00000"!==a.cpdkbid?n.callFunc("get_compounds",[{
compounds:[a.cpdkbid],biochemistry:s.biochem,biochemistry_workspace:"kbase"
}]).spread((function(e){"deltaG"in e[0]&&i.push({label:"Delta G",
data:e[0].deltaG+" ("+e[0].deltaGErr+") kcal/mol"})
;for(var a={},t=[],s=0;s<e[0].aliases.length;s++)e[0].aliases[s]in a||(t.push(e[0].aliases[s]),
a[e[0].aliases[s]]=1);return i.push({label:"Aliases",data:t.join(", ")}),i})):i
},this.CompartmentTab=function(e){var a=s.cmphash[e.id];return[{
label:"Compartment",data:a.id},{label:"Name",data:a.name},{label:"pH",data:a.pH
},{label:"potential",data:a.potential}]},this.BiomassTab=function(e){
var a=s.biohash[e.id];return[{label:"Biomass",data:a.id},{label:"Name",
data:a.name},{label:"DNA fraction",data:a.dna},{label:"RNA fraction",data:a.RNA
},{label:"Protein fraction",data:a.protein},{label:"Cell wall fraction",
data:a.cellwall},{label:"Lipid fraction",data:a.lipid},{
label:"Cofactor fraction",data:a.cofactor},{label:"Other fraction",data:a.other
},{label:"Energy mols",data:a.energy},{label:"Equation",data:a.equation}]
},this.setData=function(e){
this.data=e,this.modelreactions=this.data.modelreactions,
this.modelcompounds=this.data.modelcompounds,
this.modelgenes=[],this.modelcompartments=this.data.modelcompartments,
this.biomasses=this.data.biomasses,
this.biomasscpds=[],this.gapfillings=this.data.gapfillings,
this.cpdhash={},this.biohash={},
this.rxnhash={},this.cmphash={},this.genehash={},
this.gfhash={},this.biochemws="kbase",this.biochem="default"
;for(var a=[],i=0;i<this.gapfillings.length;i++)this.gapfillings[i].simpid="gf."+(i+1),
"fba_ref"in this.gapfillings[i]&&this.gapfillings[i].fba_ref.length>0?a.push({
ref:this.gapfillings[i].fba_ref
}):"gapfill_ref"in this.gapfillings[i]&&this.gapfillings[i].gapfill_ref.length>0&&a.push({
ref:this.gapfillings[i].gapfill_ref
}),this.gfhash[this.gapfillings[i].simpid]=this.gapfillings[i]
;for(i=0;i<this.modelcompartments.length;i++){var t=this.modelcompartments[i]
;t.cmpkbid=t.compartment_ref.split("/").pop(),
"d"===t.cmpkbid&&(this.biochem="plantdefault"),
t.name=s.cmpnamehash[t.cmpkbid],this.cmphash[t.id]=t}
for(i=0;i<this.modelcompounds.length;i++){
var n=this.modelcompounds[i],l=n.id.split("_")
;if(n.dispid=l[0]+"["+l[1]+"]",n.cmpkbid=n.modelcompartment_ref.split("/").pop(),
n.cpdkbid=n.compound_ref.split("/").pop(),
void 0===n.name&&(n.name=n.dispid),n.name=n.name.replace(/_[a-zA-z]\d+$/,""),
this.cpdhash[n.id]=n,"cpd00000"!==n.cpdkbid){n.compound_ref.split("/")
;this.cpdhash[n.cpdkbid+"_"+n.cmpkbid]=n,
l[0]!==n.cpdkbid&&(n.dispid+="<br>("+n.cpdkbid+")")}}
for(i=0;i<this.biomasses.length;i++){var o=this.biomasses[i]
;this.biohash[o.id]=o,o.dispid=o.id
;for(var d="",r="",m=0;m<o.biomasscompounds.length;m++){
var p=o.biomasscompounds[m];p.id=p.modelcompound_ref.split("/").pop()
;l=p.id.split("_");if(p.dispid=l[0]+"["+l[1]+"]",p.name=this.cpdhash[p.id].name,
p.formula=this.cpdhash[p.id].formula,
p.charge=this.cpdhash[p.id].charge,p.cmpkbid=this.cpdhash[p.id].cmpkbid,
p.biomass=o.id,this.biomasscpds.push(p),p.coefficient<0){
if(d.length>0&&(d+=" + "),
-1!==p.coefficient)d+="("+Math.round(-100*p.coefficient)/100+") "
;d+='<a class="id-click" data-id="'+p.cpdkbid+'" data-method="CompoundTab">'+this.cpdhash[p.cpdkbid].name+"["+this.cpdhash[p.cpdkbid].cmpkbid+"]</a>"
}else{
if(r.length>0&&(r+=" + "),1!==p.coefficient)r+="("+Math.round(100*p.coefficient)/100+") "
;r+='<a class="id-click" data-id="'+p.cpdkbid+'" data-method="CompoundTab">'+this.cpdhash[p.cpdkbid].name+"["+this.cpdhash[p.cpdkbid].cmpkbid+"]</a>"
}}o.equation=d+" => "+r}for(i=0;i<this.modelreactions.length;i++){
var c=this.modelreactions[i];l=c.id.split("_")
;c.dispid=l[0]+"["+l[1]+"]",c.rxnkbid=c.reaction_ref.split("/").pop(),
c.rxnkbid=c.rxnkbid.replace(/_[a-zA-z]/,""),
c.cmpkbid=c.modelcompartment_ref.split("/").pop(),
c.name=c.name.replace(/_[a-zA-z]\d+$/,""),
c.gpr="","CustomReaction"===c.name&&(c.name=c.dispid),
s.rxnhash[c.id]=c,"rxn00000"!==c.rxnkbid&&(this.rxnhash[c.rxnkbid+"_"+c.cmpkbid]=c,
c.rxnkbid!==l[0]&&(c.dispid+="<br>("+c.rxnkbid+")"));d="",r="";var h="<=>"
;">"===c.direction?h="=>":"<"===c.direction&&(h="<="),
c.modelReactionProteins>0&&(c.gpr="")
;for(m=0;m<c.modelReactionReagents.length;m++){var b=c.modelReactionReagents[m]
;if(b.cpdkbid=b.modelcompound_ref.split("/").pop(),b.coefficient<0){
if(d.length>0&&(d+=" + "),
-1!==b.coefficient)d+="("+Math.round(-100*b.coefficient)/100+") "
;d+=this.cpdhash[b.cpdkbid].name+"["+this.cpdhash[b.cpdkbid].cmpkbid+"]"}else{
if(r.length>0&&(r+=" + "),
1!==b.coefficient)r+="("+Math.round(100*b.coefficient)/100+") "
;r+=this.cpdhash[b.cpdkbid].name+"["+this.cpdhash[b.cpdkbid].cmpkbid+"]"}}
c.ftrhash={};for(m=0;m<c.modelReactionProteins.length;m++){
var f=c.modelReactionProteins[m];m>0&&(c.gpr+=" or "),c.gpr+="("
;for(var u=0;u<f.modelReactionProteinSubunits.length;u++){
var g=f.modelReactionProteinSubunits[u]
;u>0&&(c.gpr+=" and "),c.gpr+="(",0===g.feature_refs.length&&(c.gpr+="Unknown")
;for(var k=0;k<g.feature_refs.length;k++){
var y=g.feature_refs[k].split("/").pop()
;c.ftrhash[y]=1,k>0&&(c.gpr+=" or "),c.gpr+=y}c.gpr+=")"}c.gpr+=")"}
for(var v in c.gapfilling=[],
c.gapfill_data)"<"===c.gapfill_data[v][0][0]?c.gapfilling.push(v+": reverse"):c.gapfilling.push(v+": forward")
;for(var _ in c.gapfillingstring=c.gapfilling.join("<br>"),
c.dispfeatures="",c.genes=[],c.ftrhash){c.genes.push({id:_});var w=[]
;this.modelgenes.forEach((function(e){w.push(e.id)
})),-1===w.indexOf(_)?this.modelgenes.push({id:_,reactions:[{id:c.id,
dispid:c.dispid}]}):this.modelgenes[w.indexOf(_)].reactions.push({id:c.id,
dispid:c.dispid})}c.equation=d+" "+h+" "+r}
a.length>0&&this.workspaceClient.get_objects(a).then((function(e){
for(var a=0;a<e.length;a++)for(var i=e[a].data.gapfillingSolutions[0].gapfillingSolutionReactions,t=0;t<i.length;t++){
var n,l=i[t].reaction_ref.split("/").pop()
;if(l in s.rxnhash)n=s.rxnhash[l];else l=l+"_"+i[t].compartment_ref.split("/").pop()+i[t].compartmentIndex,
n=s.rxnhash[l]
;void 0!==n&&("<"===i[t].direction?n.gapfilling.push("gf."+(a+1)+": reverse"):n.gapfilling.push("gf."+(a+1)+": forward"),
n.gapfillingstring=n.gapfilling.join("<br>"))}})).catch((function(e){
console.error(e)}))}}}));