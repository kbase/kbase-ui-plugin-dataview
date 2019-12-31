define(["jquery","kb_service/client/workspace","widgets/modeling/KBModeling","widgets/modeling/kbasePathways","kbaseUI/widget/visWidgets/plants/pmiBarchart"],(function(e,a,t){
"use strict";t.prototype.KBaseFBA_FBA=function(s){var i=this
;this.modeltabs=s,this.runtime=s.runtime,
this.workspaceClient=new a(this.runtime.config("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()}),this.tabList=[{
key:"overview",name:"Overview",type:"verticaltbl",rows:[{label:"ID",key:"wsid"
},{label:"Object type",key:"objecttype",type:"typelink"},{label:"Owner",
key:"owner"},{label:"Version",key:"instance"},{label:"Mod-date",key:"moddate"},{
label:"Objective value",key:"objective"},{label:"Objective function",
key:"objectivefunction"},{label:"Model",key:"model",type:"wstype"},{
label:"Media",key:"media",type:"wstype"},{label:"Regulome",key:"regulome",
type:"wstype"},{label:"Prom Constraint",key:"promconstraint",type:"wstype"},{
label:"Expression",key:"expression",type:"wstype"},{
label:"Expression condition",key:"expressioncolumn"},{label:"Single KO",
key:"singleko"},{label:"Number reactions",key:"numreactions"},{
label:"Number compounds",key:"numcompounds"},{label:"Gene KO",key:"numgeneko"},{
label:"Reaction KO",key:"numrxnko"},{label:"Custom bounds",key:"numcpdbounds"},{
label:"Custom constraints",key:"numconstraints"},{label:"Media supplements",
key:"numaddnlcpds"},{label:"Uptake limits",key:"uptakelimits"},{
label:"Uptake limits",key:"uptakelimits"},{label:"Minimize fluxes?",
key:"minfluxes",type:"boolean"},{label:"Find minimal media?",key:"findminmedia",
type:"boolean"},{label:"Minimize reactions?",key:"minimizerxn",type:"boolean"},{
label:"All reactions reversible?",key:"allreversible",type:"boolean"},{
label:"Thermodynamic constraints?",key:"simplethermo",type:"boolean"},{
label:"Objective fraction",key:"objfraction"}]},{key:"modelreactions",
name:"Reaction fluxes",type:"dataTable",columns:[{label:"Reaction",
type:"tabLink",linkformat:"dispIDCompart",key:"id",method:"ReactionTab",
width:"15%"},{label:"Flux",key:"flux",visible:1},{
label:"Min flux<br>(Lower bound)",key:"disp_low_flux",visible:1},{
label:"Max flux<br>(Upper bound)",key:"disp_high_flux",visible:1},{
label:"Class",key:"fluxClass",visible:1},{label:"Equation",key:"equation",
type:"tabLink",linkformat:"linkequation"},{label:"Genes",key:"genes",
type:"tabLinkArray",method:"GeneTab"}]},{key:"compoundFluxes",
name:"Exchange fluxes",type:"dataTable",columns:[{label:"Compound",key:"id",
type:"tabLink",linkformat:"dispIDCompart",method:"CompoundTab",width:"15%"},{
label:"Exchange reaction",key:"exchangerxn",visible:1},{label:"Exchange flux",
key:"uptake",visible:1},{label:"Min exchange flux<br>(Lower bound)",
key:"disp_low_flux",visible:1},{label:"Max exchange flux<br>(Upper bound)",
key:"disp_high_flux",visible:1},{label:"Class",key:"fluxClass",visible:1},{
label:"Formula",key:"formula"},{label:"Charge",key:"charge"},{
label:"Compartment",key:"cmpkbid",type:"tabLink",method:"CompartmentTab",
linkformat:"dispID"}]},{key:"modelgenes",name:"Genes",visible:1,columns:[{
label:"Gene",key:"id",type:"tabLink",method:"GeneTab",linkformat:"dispID",
visible:1},{label:"Gene knocked out",key:"ko",visible:1},{
label:"Fraction of growth with KO",key:"growthFraction",visible:0}]},{
key:"biomasscpds",name:"Biomass",type:"dataTable",columns:[{label:"Biomass",
key:"biomass",type:"tabLink",method:"BiomassTab",linkformat:"dispID"},{
label:"Biomass flux",key:"bioflux"},{label:"Name",key:"name"},{
label:"Coefficient",key:"coefficient"},{label:"Compartment",key:"cmpkbid",
type:"tabLink",linkformat:"dispID",method:"CompartmentTab"},{
label:"Max production",key:"maxprod",visible:0}]},{name:"Pathways",
widget:"kbasePathways",getParams:function(){return{runtime:i.runtime,
models:[i.model],fbas:[i.data]}}}],this.setMetadata=function(a){
this.workspace=a[7],this.objName=a[1],this.overview={wsid:a[7]+"/"+a[1],ws:a[7],
obj_name:a[1],objecttype:a[2],owner:a[5],instance:a[4],moddate:a[3]
},this.usermeta={},"Model"in a[10]&&(this.usermeta={objective:a[10].Objective,
model:a[10].Model,media:a[10].Media,singleko:a[10]["Combination deletions"],
numreactions:a[10]["Number reaction variables"],
numcompounds:a[10]["Number compound variables"],
numgeneko:a[10]["Number gene KO"],numrxnko:a[10]["Number reaction KO"],
numcpdbounds:a[10]["Number compound bounds"],
numconstraints:a[10]["Number constraints"],
numaddnlcpds:a[10]["Number additional compounds"]
},"ExpressionMatrix"in a[10]&&(this.usermeta.expression=a[10].ExpressionMatrix),
"PromConstraint"in a[10]&&(this.usermeta.promconstraint=a[10].PromConstraint),
"ExpressionMatrixColumn"in a[10]&&(this.usermeta.expressioncolumn=a[10].ExpressionMatrixColumn),
e.extend(this.overview,this.usermeta))},this.formatObject=function(){
for(var e in this.usermeta.model=i.data.fbamodel_ref,
this.usermeta.media=i.data.media_ref,
this.usermeta.objective=i.data.objectiveValue,
this.usermeta.minfluxes=i.data.fluxMinimization,
this.usermeta.findminmedia=i.data.findMinimalMedia,
this.usermeta.minimizerxn=i.data.minimize_reactions,
this.usermeta.allreversible=i.data.allReversible,
this.usermeta.simplethermo=i.data.simpleThermoConstraints,
this.usermeta.objfraction=i.data.objectiveConstraintFraction,
this.usermeta.regulome=i.data.regulome_ref,
this.usermeta.promconstraint=i.data.promconstraint_ref,
this.usermeta.expression=i.data.tintlesample_ref,
this.usermeta.phenotypeset=i.data.phenotypeset_ref,
this.usermeta.phenotypesimulationset=i.data.phenotypesimulationset_ref,
this.usermeta.singleko=i.data.comboDeletions,
this.usermeta.defaultmaxflux=i.data.defaultMaxFlux,
this.usermeta.defaultmaxdrain=i.data.defaultMaxDrainFlux,
this.usermeta.defaultmindrain=i.data.defaultMinDrainFlux,
this.usermeta.phenotypesimulationset=i.data.phenotypesimulationset_ref,
this.usermeta.uptakelimits="",
i.data.uptakelimits)this.usermeta.uptakelimits.length>0&&(this.usermeta.uptakelimits+="<br>"),
this.usermeta.uptakelimits+=e+":"+this.uptakelimits[e]
;for(var e in this.usermeta.objectivefunction="Minimize{",
1===i.data.maximizeObjective&&(this.usermeta.objectivefunction="Maximize{"),
i.data.compoundflux_objterms)this.usermeta.objectivefunction+=" ("+i.data.compoundflux_objterms[e]+") "+e
;for(var e in i.data.reactionflux_objterms)this.usermeta.objectivefunction+=" ("+i.data.reactionflux_objterms[e]+") "+e
;for(var e in i.data.biomassflux_objterms)this.usermeta.objectivefunction+=" ("+i.data.biomassflux_objterms[e]+") "+e
;this.usermeta.objectivefunction+="}",
this.modelreactions=this.model.modelreactions,
this.modelcompounds=this.model.modelcompounds,
this.biomasses=this.model.biomasses,
this.biomasscpds=this.model.biomasscpds,this.modelgenes=this.model.modelgenes,
this.FBAConstraints=i.data.FBAConstraints,
this.FBAMinimalMediaResults=i.data.FBAMinimalMediaResults,
this.FBAMinimalReactionsResults=i.data.FBAMinimalReactionsResults,
this.FBAMetaboliteProductionResults=i.data.FBAMetaboliteProductionResults,
this.rxnhash={};for(var a=0;a<i.data.FBAReactionVariables.length;a++){
var t=i.data.FBAReactionVariables[a].modelreaction_ref.split("/").pop()
;i.data.FBAReactionVariables[a].ko=0,
this.rxnhash[t]=i.data.FBAReactionVariables[a]}
for(a=0;a<i.data.reactionKO_refs.length;a++){
t=i.data.reactionKO_refs[a].split("/").pop();this.rxnhash[t].ko=1}
this.cpdhash={};for(a=0;a<i.data.FBACompoundVariables.length;a++){
var s=i.data.FBACompoundVariables[a].modelcompound_ref.split("/").pop()
;i.data.FBACompoundVariables[a].additionalcpd=0,
this.cpdhash[s]=i.data.FBACompoundVariables[a]}
for(a=0;a<i.data.additionalCpd_refs.length;a++){
s=i.data.additionalCpd_refs[a].split("/").pop();this.cpdhash[s].additionalcpd=1}
this.biohash={};for(a=0;a<i.data.FBABiomassVariables.length;a++){
var o=i.data.FBABiomassVariables[a].biomass_ref.split("/").pop()
;this.biohash[o]=i.data.FBABiomassVariables[a]}this.maxpod=0,this.metprodhash={}
;for(a=0;a<this.FBAMetaboliteProductionResults.length;a++){
this.tabList[4].columns[5].visible=1
;var n=i.data.FBAMetaboliteProductionResults[a]
;s=n.modelcompound_ref.split("/").pop();this.metprodhash[s]=n}this.genehash={}
;for(a=0;a<this.modelgenes.length;a++)this.genehash[this.modelgenes[a].id]=this.modelgenes[a],
this.genehash[this.modelgenes[a].id].ko=0;this.delhash={}
;for(a=0;a<i.data.FBADeletionResults.length;a++){
var l=i.data.FBADeletionResults[a].feature_refs[0].split("/").pop()
;this.delhash[l]=i.data.FBADeletionResults[a]}this.cpdboundhash={}
;for(a=0;a<i.data.FBACompoundBounds.length;a++){
s=i.data.FBACompoundBounds[a].modelcompound_ref.split("/").pop()
;this.cpdboundhash[s]=i.data.FBACompoundBounds[a]}this.rxnboundhash={}
;for(a=0;a<i.data.FBAReactionBounds.length;a++){
t=i.data.FBAReactionBounds[a].modelreaction_ref.split("/").pop()
;this.rxnboundhash[t]=i.data.FBAReactionBounds[a]}
for(a=0;a<this.modelgenes.length;a++){var d=this.modelgenes[a]
;this.genehash[d.id]&&(d.ko=this.genehash[d.id].ko),
this.delhash[d.id]&&(d.growthFraction=this.delhash[d.id].growthFraction)}
var r=0,u=0;for(a=0;a<this.modelreactions.length;a++){
var h=this.modelreactions[a]
;this.rxnhash[h.id]&&("exp_state"in this.rxnhash[h.id]&&(h.exp_state=this.rxnhash[h.id].exp_state),
"expression"in this.rxnhash[h.id]&&(h.expression=this.rxnhash[h.id].expression),
"scaled_exp"in this.rxnhash[h.id]&&(h.scaled_exp=this.rxnhash[h.id].scaled_exp),
h.upperFluxBound=this.rxnhash[h.id].upperBound,
h.lowerFluxBound=this.rxnhash[h.id].lowerBound,h.fluxMin=this.rxnhash[h.id].min,
h.fluxMax=this.rxnhash[h.id].max,
h.flux=this.rxnhash[h.id].value,h.fluxClass=this.rxnhash[h.id].class,
h.disp_low_flux=h.fluxMin+"<br>("+h.lowerFluxBound+")",
h.disp_high_flux=h.fluxMax+"<br>("+h.upperFluxBound+")"),
this.rxnboundhash[h.id]&&(h.customUpperBound=this.rxnboundhash[h.id].upperBound,
h.customLowerBound=this.rxnboundhash[h.id].lowerBound),
"exp_state"in h&&(r=1),"expression"in h&&(u=1,
h.scaled_exp=Math.round(100*h.scaled_exp)/100,
h.expression=Math.round(100*h.expression)/100,
h.exp_value=h.scaled_exp+"<br>("+h.expression+")")}
1===u&&this.tabList[1].columns.splice(2,0,{
label:"Scaled expression (unscaled value)",key:"exp_value"
}),1===r&&this.tabList[1].columns.splice(2,0,{label:"Expression state",
key:"exp_state"}),this.compoundFluxes=[],this.cpdfluxhash={}
;for(a=0;a<this.modelcompounds.length;a++){var m=this.modelcompounds[a]
;this.cpdhash[m.id]&&(m.exchangerxn=" => "+m.name+"[e]",
m.upperFluxBound=this.cpdhash[m.id].upperBound,
m.lowerFluxBound=this.cpdhash[m.id].lowerBound,m.fluxMin=this.cpdhash[m.id].min,
m.fluxMax=this.cpdhash[m.id].max,
m.uptake=this.cpdhash[m.id].value,m.fluxClass=this.cpdhash[m.id].class,
m.disp_low_flux=m.fluxMin+"<br>("+m.lowerFluxBound+")",
m.disp_high_flux=m.fluxMax+"<br>("+m.upperFluxBound+")",
this.cpdfluxhash[m.id]=m,
this.compoundFluxes.push(m)),this.metprodhash[m.id]&&(m.maxProd=this.metprodhash[m.id].maximumProduction),
this.cpdboundhash[m.id]&&(m.customUpperBound=this.cpdboundhash[m.id].upperBound,
m.customLowerBound=this.cpdboundhash[m.id].lowerBound,
this.cpdfluxhash[m.id]||this.compoundFluxes.push(m))}
for(a=0;a<this.biomasses.length;a++){var p=this.biomasses[a]
;this.biohash[p.id]?(p.upperFluxBound=this.biohash[p.id].upperBound,
p.lowerFluxBound=this.biohash[p.id].lowerBound,p.fluxMin=this.biohash[p.id].min,
p.fluxMax=this.biohash[p.id].max,
p.flux=this.biohash[p.id].value,p.fluxClass=this.biohash[p.id].class,
this.modelreactions.push(p)):(this.biohash[p.id]=p,
p.upperFluxBound=1e3,p.lowerFluxBound=0,
p.fluxMin=0,p.fluxMax=1e3,p.flux=0,p.fluxClass="Blocked",
this.modelreactions.push(p)),
p.disp_low_flux=p.fluxMin+"<br>("+p.lowerFluxBound+")",
p.disp_high_flux=p.fluxMax+"<br>("+p.upperFluxBound+")"}
for(a=0;a<this.biomasscpds.length;a++){var b=this.biomasscpds[a]
;this.biohash[b.biomass]&&(b.bioflux=this.biohash[b.biomass].flux),
this.metprodhash[b.id]&&(b.maxprod=this.metprodhash[b.id].maximumProduction)}
},this.setData=function(a,s){return i.data=a,i.workspaceClient.get_objects([{
ref:a.fbamodel_ref}]).then((function(a){
i.model=a[0].data,void 0!==s&&i.workspaceClient.get_objects([{
ref:i.model.template_ref}]).then((function(a){var t=0
;"PlantModelTemplate"===a[0].info[1]&&(t=1);var o=e.jqElem("div")
;return o.kbasePMIBarchart({runtime:i.runtime,fba_workspace:i.workspace,
fba_object:i.objName,
subsystem_annotation_object:t?"PlantSEED_Subsystems":"default-kegg-subsystems",
subsystem_annotation_workspace:t?"PlantSEED":"kbase",
selected_subsystems:t?["Central Carbon: Glycolysis_and_Gluconeogenesis_in_plants"]:["Carbohydrate metabolism: Glycolysis / Gluconeogenesis"]
}),s.addTab({name:"Bar charts",content:o}),null})).catch((function(e){
console.error(e)}));var o=new t
;return i.model=new o.KBaseFBA_FBAModel(i.modeltabs),
i.model.setMetadata(a[0].info),i.model.setData(a[0].data),i.formatObject(),null
}))},this.ReactionTab=function(e){var a=i.rxnhash[e.id]
;if(void 0===a&&void 0!==(a=i.biohash[e.id]))return i.BiomassTab(e)
;var t=i.model.ReactionTab(e);return t&&"done"in t?t.then((function(a){
return i.ExtendReactionTab(e,a)})):i.ExtendReactionTab(e,t)
},this.ExtendReactionTab=function(e,a){var t=i.rxnhash[e.id];return a.push({
label:"Flux",data:t.flux}),a.push({label:"Min flux<br>(Lower bound)",
data:t.disp_low_flux}),a.push({label:"Max flux<br>(Upper bound)",
data:t.disp_high_flux}),a.push({label:"Class",data:t.fluxClass}),a
},this.CompoundTab=function(e){var a=i.model.CompoundTab(e)
;return a&&"done"in a?a.then((function(a){return i.ExtendCompoundTab(e,a)
})):i.ExtendCompoundTab(e,a)},this.ExtendCompoundTab=function(e,a){
var t=i.cpdhash[e.id];return a.push({label:"Exchange reaction",
data:t.exchangerxn}),a.push({label:"Exchange flux",data:t.uptake}),a.push({
label:"Min flux<br>(Lower bound)",data:t.disp_low_flux}),a.push({
label:"Max flux<br>(Upper bound)",data:t.disp_high_flux}),a.push({label:"Class",
data:t.fluxclass}),a},this.GeneTab=function(e){var a=i.model.GeneTab(e)
;return a&&"done"in a?a.then((function(a){return i.ExtendGeneTab(e,a)
})):i.ExtendGeneTab(e,a)},this.ExtendGeneTab=function(e,a){
var t=i.genehash[e.id];return a.push({label:"Gene knocked out",data:t.ko
}),a.push({label:"Fraction of growth with KO",data:t.growthFraction}),a
},this.BiomassTab=function(e){var a=i.model.BiomassTab(e)
;return a&&"done"in a?a.then((function(a){return i.ExtendBiomassTab(e,a)
})):i.ExtendBiomassTab(e,a)},this.ExtendBiomassTab=function(e,a){
var t=i.biohash[e.id];return a.push({label:"Flux",data:t.flux}),a.push({
label:"Min flux<br>(Lower bound)",data:t.disp_low_flux,visible:1}),a.push({
label:"Max flux<br>(Upper bound)",data:t.disp_high_flux,visible:1}),a.push({
label:"Class",data:t.fluxClass,visible:1}),a},this.CompartmentTab=function(e){
return i.model.CompartmentTab(e)}}}));