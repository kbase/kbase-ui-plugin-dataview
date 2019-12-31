define(["jquery","kb_service/client/workspace","kb_common/html","datatables_bootstrap","kbaseUI/widget/legacy/authenticatedWidget"],(function(e,t,n){
"use strict";e.KBWidget({name:"CollectionView",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",options:{id:null,ws:null},
init:function(t){var o=n.tag("div"),r=n.genId(),i=n.genId()
;return this._super(t),this.$elem.html(n.makePanel({title:o({id:r}),content:o({
id:i})})),this.$title=e("#"+r),this.$body=e("#"+i),this},showError:function(e){
var t;try{
t="string"==typeof e?e:e.error?e.error.message:e.message?e.message:"Unknown error: "+e
}catch(n){t="Unknown error processing another error: "+n}
this.$title.html("Error"),
this.$body.html(t),console.error("ERROR in kbaseCollectionView.js"),
console.error(e)},render:function(){var o=this
;if(this.runtime.service("session").getAuthToken()){
this.$title.html("Metagenome Collection"),
this.$body.html(n.loading("loading data..."))
;var r,i=new t(this.runtime.config("services.workspace.url"),{token:this.token})
;return i.get_objects([{ref:o.options.ws+"/"+o.options.id}]).then((function(e){
if(0===e.length)throw new Error("Object "+o.options.id+" does not exist in workspace "+o.options.ws)
;var t=e[0].data,n=t.members.map((function(e){
if(e.URL.match(/^http/))throw console.error(e),
new Error("Invalid Collection Object");return{ref:e.URL}}))
;if(r=t.name,n.length>0)return i.get_objects(n)
;throw new Error("Collection is empty")})).then((function(t){var i={
columns:["ID","Name","Project","PI","Biome","Sequence Type","Sequencing Method","bp Count","Created"],
rows:t.map((function(e){
return[e.data.id,e.data.name,e.data.mixs.project_name,e.data.mixs.PI_lastname,e.data.mixs.biome,e.data.mixs.sequence_type,e.data.mixs.seq_method,e.data.statistics.sequence_stats.bp_count_raw,e.data.created]
})),classes:["table","table-striped"]},s=n.makeTable(i)
;o.$title.html("Metagenome Collection "+r),
o.$body.html(s),e("#"+i.generated.id).dataTable()})).catch((function(e){
o.showError(e)})),o}this.showError("You are not logged in")},
loggedInCallback:function(e,t){return this.token=t.token,this.render(),this},
loggedOutCallback:function(e,t){return this.token=null,this.render(),this}})}));