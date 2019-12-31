define(["jquery","kb_common/html","kb_common/jsonRpc/genericClient","kb_common/jsonRpc/dynamicServiceClient","kb_service/utils","lib/post","kbaseUI/widget/legacy/widget","widgets/genomes/kbaseGenomeLineage","widgets/genomes/kbaseGenomeRELineage","widgets/trees/kbaseTree"],(function(e,t,n,s,i,r){
"use strict";var o=t.tag,a=o("div"),d=o("a"),h=o("button"),c=o("span")
;function l(t){const n=function(e,t){const n=document.createElement(e)
;return n.innerText=t,n}("div",t);return n.style["font-weight"]="bold",e(n)}
e.KBWidget({name:"KBaseGenomeWideTaxonomy",parent:"kbaseWidget",version:"1.0.0",
options:{genomeID:null,workspaceID:null,genomeInfo:null,genomeRef:null},
trees:null,currentTree:null,objectRef:null,genomeInfo:null,init:function(e){
return this._super(e),this.genomeInfo=this.options.genomeInfo,this.render(),this
},render:function(){const n=e('<div class="row">'),s=e('<div class="col-md-5">')
;let i
;n.append(s),this.runtime.featureEnabled("re-lineage")&&(i=e("<div>"),s.append(l("New Lineage")),
s.append(i));const r=e("<div>")
;this.runtime.featureEnabled("re-lineage")&&s.append(l("Old Lineage")),
s.append(r),this.$tree=e('<div class="col-md-7">')
;const o=t.genId(),d=t.genId(),u=t.genId(),g=t.genId(),m=t.genId(),p=t.genId(),f=a({
class:"col-md-7"},[a({style:{display:"flex",flexDirection:"row",
marginBottom:"10px"}},[a({style:{flex:"3",display:"flex",alignItems:"center"}
},c({id:g})),a({style:{flex:"1"}},[a({class:"btn-toolbar pull-right"},[h({
class:"btn btn-default btn-sm",id:m},c({class:"fa fa-chevron-left"})),h({
class:"btn btn-default btn-sm",id:p},c({class:"fa fa-chevron-right"}))])])]),a({
class:"btn-toolbar"},[a({class:"btn-group",id:u})]),a({id:o}),a({id:d})])
;n.append(f),
this.$elem.append(n),this.$treeNode=e("#"+d),this.$treeMessageNode=e("#"+o),
this.$buttonsNode=e("#"+u),
this.$messageNode=e("#"+g),this.$prevButtonNode=e("#"+m),
this.$nextButtonNode=e("#"+p),this.$prevButtonNode.click(()=>{
this.trees&&(this.currentTree>0&&(this.currentTree-=1),this.displayTree())
}),this.$nextButtonNode.click(()=>{
this.trees&&(this.currentTree<this.trees.length-1&&(this.currentTree+=1),
this.displayTree())}),r.KBaseGenomeLineage({genomeInfo:this.genomeInfo,
runtime:this.runtime
}),this.runtime.featureEnabled("re-lineage")&&i.KBaseGenomeRELineage({
genomeInfo:this.genomeInfo,genomeRef:this.options.genomeRef,
timestamp:new Date(this.genomeInfo.created).getTime(),runtime:this.runtime
}),this.fetchTrees().then(()=>(this.renderTree(),null)).catch(e=>{
console.error(e);var t="<b>Sorry!</b>  Error retreiveing species trees info"
;"string"==typeof e?t+=": "+e:e.error&&e.error.message&&(t+=": "+e.error.message),
this.setMessage(t)})},makeNarrativePath:function(e,t){
return this.runtime.getConfig("services.narrative.url")+"/narrative/ws."+e+".obj."+t
},resolveObjectNameToInfo:function(e,t){return new n({module:"Workspace",
url:this.runtime.config("services.workspace.url"),
token:this.runtime.service("session").getAuthToken()
}).callFunc("get_object_info3",[{objects:[{wsid:e,name:t}],includeMetadata:0,
ignoreErrors:1}]).spread(e=>{const t=e.infos[0]
;if(!t)throw console.error(t),new Error("Could not find new object!!")
;return i.objectInfoToObject(t)})},createTreeBuildingNarrative:function(e,t){
const n=["# Tree-Building Narrative","","This Narrative was created by the Genome Landing Page to assist in creating a tree containing this genome.","Notice that the genome is the sole object in the Data List on the left side of this page, and that the ",'"Insert Genome Into species Tree" app has been inserted into the Narrative below. ',"","Other parameters specifying the output objects have been provided with default values. ","Feel free to override them.","",'The Narrative may be run as-is by clicking the "Run" button, or you may alter the parameters first.'].join("\n"),i={
importData:[this.genomeInfo.objectInfo.ref],markdown:n,
title:"New tree-building Narrative for "+this.genomeInfo.objectInfo.name,
includeIntroCell:0};return new s({module:"NarrativeService",
url:this.runtime.config("services.service_wizard.url"),
token:this.runtime.service("session").getAuthToken()
}).callFunc("create_new_narrative",[i]).spread(n=>{
var s=n.narrativeInfo.wsid,i=n.narrativeInfo.id,o=this.makeNarrativePath(s,i)
;return this.resolveObjectNameToInfo(s,this.genomeInfo.objectInfo.name).then(n=>{
const s=new r.LocalPost({partner:e,channel:t});s.start(),s.on("ready",()=>{
const e={appId:"SpeciesTreeBuilder/insert_set_of_genomes_into_species_tree",
tag:"release",kbaseSecret:t,params:{param0:[n.ref],
genomeSetName:"output_genome_set",treeID:"output_tree"}}
;s.send("add-app-cell",e),s.send("done")}),e.location=o})}).catch(e=>{
console.error(e)})},fetchTrees:function(){var e=new n({module:"Workspace",
url:this.runtime.getConfig("services.workspace.url"),
token:this.runtime.service("session").getAuthToken()}),t={
ref:this.options.workspaceID+"/"+this.options.genomeID}
;return e.callFunc("list_referencing_objects",[[t]]).spread(e=>{
const t=e[0].filter(e=>{return"KBaseTrees.Tree"===e[2].split("-")[0]}).map(e=>({
wsid:e[6],id:e[0],name:e[1]}))
;return this.trees=t,this.trees.length>0&&(this.currentTree=0),null})},
clearButtons:function(){this.$buttonsNode.empty()},addButton:function(e){
this.$buttonsNode.append(e)},hideNavButtons:function(){
this.$prevButtonNode.hide(),this.$nextButtonNode.hide()},
showNavButtons:function(){
this.$prevButtonNode.show(),this.$nextButtonNode.show()},
setTreeMessage:function(e){this.$treeMessageNode.html(e)},
setMessage:function(e){this.$messageNode.html(e)},renderTree:function(){
const e=this.trees
;this.trees&&(0===e.length?(this.setMessage(["There are no species trees associated with this genome."]),
this.$prevButtonNode.addClass("hidden"),
this.$nextButtonNode.addClass("hidden")):(e.length,this.displayTree()))},
displayTree:function(){
0===this.trees.length?this.setMessage("Showing 1 phylogenetic tree for this genome"):this.setMessage(["Showing #",this.currentTree+1," of ",this.trees.length," phylogenetic trees for this genome"].join("")),
this.clearButtons();const e=this.trees[this.currentTree];this.addButton(d({
class:"btn btn-primary",href:["/#dataview",e.wsid,e.id].join("/"),
target:"_blank"
},"View tree in separate window")),0===this.currentTree?this.$prevButtonNode.addClass("disabled"):this.$prevButtonNode.removeClass("disabled"),
this.currentTree===this.trees.length-1?this.$nextButtonNode.addClass("disabled"):this.$nextButtonNode.removeClass("disabled"),
this.$treeNode.kbaseTree({treeID:e.id,workspaceID:e.wsid,
genomeInfo:this.options.genomeInfo,runtime:this.runtime})},getData:function(){
return{type:"Genome Taxonomy",id:this.options.genomeID,
workspace:this.options.workspaceID,title:"Taxonomy"}}})}));