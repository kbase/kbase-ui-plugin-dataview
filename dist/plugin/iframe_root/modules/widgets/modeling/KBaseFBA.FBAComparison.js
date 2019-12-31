define(["widgets/modeling/KBModeling"],(function(e){"use strict"
;e.prototype.KBaseFBA_FBAComparison=function(e){var t=this
;this.modeltabs=e,this.setMetadata=function(e){
this.workspace=e[7],this.objName=e[1],this.overview={wsid:e[7]+"/"+e[1],ws:e[7],
obj_name:e[1],objecttype:e[2],owner:e[5],instance:e[4],moddate:e[3],
commonreactions:e[10]["Common reactions"],
commoncompounds:e[10]["Common compounds"],numfbas:e[10]["Number FBAs"],
numreactions:e[10]["Number reactions"],numcompounds:e[10]["Number compounds"]}},
this.cmpnamehash={c:"Cytosol",p:"Periplasm",g:"Golgi apparatus",
e:"Extracellular",r:"Endoplasmic reticulum",l:"Lysosome",n:"Nucleus",
d:"Plastid",m:"Mitochondria",x:"Peroxisome",v:"Vacuole",w:"Cell wall"
},this.tabList=[{key:"overview",name:"Overview",type:"verticaltbl",rows:[{
label:"Name",key:"name"},{label:"ID",key:"wsid"},{label:"Object type",
key:"objecttype",type:"typelink"},{label:"Owner",key:"owner"},{label:"Version",
key:"instance"},{label:"Mod-date",key:"moddate"},{label:"Number FBAs",
key:"numfbas"},{label:"Number reactions",key:"numreactions"},{
label:"Common reactions",key:"commonreactions"},{label:"Number compounds",
key:"numcompounds"},{label:"Common compounds",key:"commoncompounds"}]},{
key:"fbas",name:"Flux Balance Analyses",type:"dataTable",columns:[{label:"FBA",
key:"fba",type:"wstype",linkformat:"dispWSRef"},{label:"Model",key:"model",
type:"wstype",linkformat:"dispWSRef"},{label:"Media",key:"media",type:"wstype",
linkformat:"dispWSRef"},{label:"Objective",key:"objective"},{label:"Reactions",
key:"rxndata"},{label:"Exchanges",key:"exchangedata"}]},{key:"fbacomparisons",
name:"FBA Comparisons",type:"dataTable",columns:[{label:"Index",key:"index"},{
label:"FBA",key:"fba",type:"wstype",linkformat:"dispWSRef"}]},{
key:"modelreactions",name:"Reactions",type:"dataTable",columns:[{
label:"Reaction",type:"tabLink",linkformat:"dispIDCompart",key:"id",
method:"ReactionTab"},{label:"Name",key:"name"},{label:"Equation",
key:"equation",type:"tabLink",linkformat:"linkequation"},{label:"FBAs",
key:"numfba"},{label:"Most common state",key:"mostcommonstate"},{
label:"Inactive states",key:"inactivestates"},{label:"Forward states",
key:"forwardstates"},{label:"Reverse states",key:"reversestates"}]},{
key:"modelcompounds",name:"Compounds",type:"dataTable",columns:[{
label:"Compound",type:"tabLink",linkformat:"dispIDCompart",key:"id",
method:"CompoundTab"},{label:"Exchange",key:"exchange"},{label:"Formula",
key:"formula"},{label:"Charge",key:"charge"},{label:"FBAs",key:"numfba"},{
label:"Most common state",key:"mostcommonstate"},{label:"Inactive states",
key:"inactivestates"},{label:"Uptake states",key:"uptakestates"},{
label:"Excretion states",key:"excretionstates"}]}],this.ReactionTab=function(e){
var s=t.rxnhash[e.id];return[{label:"Reaction",data:s.dispid},{label:"Name",
data:s.name},{label:"Equation",data:s.equation,type:"pictureEquation"},{
label:"Inactive FBAs",data:s.inactivestates},{label:"Forward FBAs",
data:s.forwardstates},{label:"Reverse FBAs",data:s.reversestates}]
},this.CompoundTab=function(e){var s=t.cpdhash[e.id];return[{label:"Compound",
data:s.dispid},{label:"Name",data:s.name},{label:"Formula",data:s.formula},{
label:"Charge",data:s.charge},{label:"Most common state",data:s.mostcommonstate
},{label:"Inactive states",data:s.inactivestates},{label:"Uptake states",
data:s.uptakestates},{label:"Excretion states",data:s.excretionstates}]
},this.CompareTab=function(e){var s=t.cpdhash[e.id];return[{label:"Compound",
data:s.dispid},{label:"Name",data:s.name},{label:"Formula",data:s.formula},{
label:"Charge",data:s.charge},{label:"Most common state",data:s.mostcommonstate
},{label:"Inactive states",data:s.inactivestates},{label:"Uptake states",
data:s.uptakestates},{label:"Excretion states",data:s.excretionstates}]
},this.setData=function(e){this.data=e,this.fbas=this.data.fbas,this.cpdhash={},
this.rxnhash={},this.fbahash={},this.fbacomparisons=[]
;for(var t=0;t<this.fbas.length;t++){
this.fbacomparisons[t]={},this.fbahash[this.fbas[t].id]=this.fbas[t]
;var s="F"+(t+1);this.tabList[2].columns.push({label:s,key:s
}),this.fbas[t].dispid=this.fbas[t].id.split("/")[1],
this.fbas[t].fba=this.fbas[t].fba_ref,
this.fbas[t].model=this.fbas[t].fbamodel_ref,
this.fbas[t].media=this.fbas[t].media_ref,
this.fbas[t].rxndata="Inactive: "+(this.fbas[t].reactions-this.fbas[t].active_reactions)+"<br>Active: "+this.fbas[t].active_reactions,
this.fbas[t].exchangedata="Available: "+(this.fbas[t].compounds-this.fbas[t].uptake_compounds-this.fbas[t].excretion_compounds)+"<br>Uptake: "+this.fbas[t].uptake_compounds+"<br>Excretion: "+this.fbas[t].excretion_compounds
;var a="F"+(t+1)
;this.fbacomparisons[t].fba=this.fbas[t].fba,this.fbacomparisons[t].index=a
;for(var o=0;o<this.fbas.length;o++)if(a="F"+(o+1),o!==t){
if(this.fbas[o].id in this.fbas[t].fba_similarity){
var i=this.fbas[t].fba_similarity[this.fbas[o].id],n="R: "+Math.round(100*(i[1]+i[2]+i[3])/i[0])/100+"<br>C: "+Math.round(100*(i[5]+i[6]+i[7])/i[4])/100,m="Common reactions: "+i[0]+"&#013;Common forward: "+i[1]+"&#013;Common reverse: "+i[2]+"&#013;Common inactive: "+i[3]+"&#013;Common compounds: "+i[4]+"&#013;Common uptake: "+i[5]+"&#013;Common excretion: "+i[6]+"&#013;Common inactive: "+i[7]
;this.fbacomparisons[t][a]='<p title="'+m+'">'+n+"</p>"}
}else this.fbacomparisons[t][a]='<p title="Reactions: '+this.fbas[t].reactions+"&#013;Compounds: "+this.fbas[t].compounds+'">R: 1<br>C: 1</p>'
}this.modelreactions=this.data.reactions
;for(t=0;t<this.modelreactions.length;t++){
var l=this.modelreactions[t].id.split("_"),d=this.modelreactions[t].name.split("_")
;this.modelreactions[t].name=d[0],
this.modelreactions[t].dispid=l[0]+"["+l[1]+"]",
this.rxnhash[this.modelreactions[t].id]=this.modelreactions[t]
;var c="",r="",h="<=>"
;">"===this.modelreactions[t].direction?h="=>":"<"===this.modelreactions[t].direction&&(h="<=")
;for(o=0;o<this.modelreactions[t].stoichiometry.length;o++){
var b=this.modelreactions[t].stoichiometry[o]
;if(l=b[2].split("_"),d=b[1].split("_"),b[0]<0){
if(c.length>0&&(c+=" + "),-1!==b[0])c+="("+Math.round(-100*b[0])/100+") "
;c+=d[0]+"["+l[1]+"]"}else{
if(r.length>0&&(r+=" + "),1!==b[0])r+="("+Math.round(100*b[0])/100+") "
;r+=d[0]+"["+l[1]+"]"}}
this.modelreactions[t].equation=c+" "+h+" "+r,this.modelreactions[t].numfba=0
;var p=Math.floor(100*this.modelreactions[t].state_conservation[this.modelreactions[t].most_common_state][1])
;for(var u in this.modelreactions[t].mostcommonstate=this.modelreactions[t].most_common_state+" ("+p+"%)",
this.modelreactions[t].inactivestates="None",
this.modelreactions[t].forwardstates="None",
this.modelreactions[t].reversestates="None",
this.modelreactions[t].reaction_fluxes)this.modelreactions[t].numfba++,
"IA"===this.modelreactions[t].reaction_fluxes[u][0]?"None"===this.modelreactions[t].inactivestates?this.modelreactions[t].inactivestates="Count: "+this.modelreactions[t].state_conservation.IA[0]+"<br>"+u:this.modelreactions[t].inactivestates+="<br>"+u:"FOR"===this.modelreactions[t].reaction_fluxes[u][0]?"None"===this.modelreactions[t].forwardstates?this.modelreactions[t].forwardstates="Average: "+this.modelreactions[t].state_conservation.FOR[2]+" +/- "+this.modelreactions[t].state_conservation.FOR[3]+"<br>"+u+": "+this.modelreactions[t].reaction_fluxes[u][5]:this.modelreactions[t].forwardstates+="<br>"+u+": "+this.modelreactions[t].reaction_fluxes[u][5]:"REV"===this.modelreactions[t].reaction_fluxes[u][0]&&("None"===this.modelreactions[t].reversestates?this.modelreactions[t].reversestates="Average: "+this.modelreactions[t].state_conservation.REV[2]+" +/- "+this.modelreactions[t].state_conservation.REV[3]+"<br>"+u+": "+this.modelreactions[t].reaction_fluxes[u][5]:this.modelreactions[t].reversestates+="<br>"+u+": "+this.modelreactions[t].reaction_fluxes[u][5])
}this.modelcompounds=this.data.compounds
;for(t=0;t<this.modelcompounds.length;t++){
this.cpdhash[this.modelcompounds[t].id]=this.modelcompounds[t]
;l=this.modelcompounds[t].id.split("_"),d=this.modelcompounds[t].name.split("_")
;this.modelcompounds[t].name=d[0],
this.modelcompounds[t].dispid=l[0]+"["+l[1]+"]",
this.modelcompounds[t].exchange=" => "+this.modelcompounds[t].name+"["+d[1]+"]",
this.modelcompounds[t].numfba=0
;p=Math.floor(100*this.modelcompounds[t].state_conservation[this.modelcompounds[t].most_common_state][1])
;for(var u in this.modelcompounds[t].mostcommonstate=this.modelcompounds[t].most_common_state+" ("+p+"%)",
"UP"in this.modelcompounds[t].state_conservation?this.modelcompounds[t].uptakestates="Average: "+this.modelcompounds[t].state_conservation.UP[2]+" +/- "+this.modelcompounds[t].state_conservation.UP[3]:this.modelcompounds[t].uptakestates="None",
"EX"in this.modelcompounds[t].state_conservation?this.modelcompounds[t].excretionstates="Average: "+this.modelcompounds[t].state_conservation.EX[2]+" +/- "+this.modelcompounds[t].state_conservation.EX[3]:this.modelcompounds[t].excretionstates="None",
"IA"in this.modelcompounds[t].state_conservation?this.modelcompounds[t].inactivestates="Count: "+this.modelcompounds[t].state_conservation.IA[0]:this.modelcompounds[t].inactivestates="None",
this.modelcompounds[t].exchanges)this.modelcompounds[t].numfba++,
"UP"===this.modelcompounds[t].exchanges[u][0]?this.modelcompounds[t].uptakestates+="<br>"+u+": "+this.modelcompounds[t].exchanges[u][5]:"EX"===this.modelcompounds[t].exchanges[u][0]?this.modelcompounds[t].excretionstates+="<br>"+u+": "+-1*this.modelcompounds[t].exchanges[u][5]:this.modelcompounds[t].inactivestates+="<br>"+u
}}}}));