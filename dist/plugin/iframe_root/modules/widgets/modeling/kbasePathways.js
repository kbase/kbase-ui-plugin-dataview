define(["jquery","bluebird","kb_service/client/workspace","widgets/modeling/modelSeedPathway","kbaseUI/widget/legacy/widget","kbaseUI/widget/legacy/tabs"],(function(e,a,t,n){
"use strict";e.KBWidget({name:"kbasePathways",version:"1.0.0",init:function(i){
var s=this,o="nconrad:kegg",r="nconrad:pathwaysjson",l=this.$elem,c=i.models,d=i.fbas,p=e('<table class="table table-bordered table-striped">'),u=l.kbTabs({
tabs:[{name:"Selection",content:p,active:!0}]});function m(){
l.find(".pathway-link").unbind("click"),
l.find(".pathway-link").click((function(){
var t=e(this).data("map_id"),i=e(this).text(),l=t+"-"+s.uuid(),p=e('<div id="path-container-'+l+'" style="position:relative;">')
;p.loading(),u.addTab({name:i,removable:!0,content:p}),function(e,t,i){
a.all([s.workspaceClient.get_objects([{workspace:o,name:e+".png"
}]),s.workspaceClient.get_objects([{workspace:r,name:e
}])]).spread((function(e,a){var o=e[0].data.id,r=a[0].data
;return t.append('<img src="data:image/png;base64,'+o+'" style="display: inline-block;">'),
t.append('<div id="pathway-'+i+'" style="position:absolute; top:0;">'),
t.rmLoading(),new n({elem:"pathway-"+i,usingImage:!0,mapData:r,models:c,fbas:d,
runtime:s.runtime}).render(),null})).catch((function(e){
console.error("Error loading map"),console.error(e)}))}(t,p,l),u.showTab(i)
})),l.find(".pathway-link").tooltip({title:"Open path tab",placement:"right",
delay:{show:1e3}})}
return this.runtime=i.runtime,this.workspaceClient=new t(this.runtime.config("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()
}),this.load_map_list=function(){
return l.loading(),s.workspaceClient.list_objects({workspaces:[r],
includeMetadata:1}).then((function(e){l.rmLoading();var a={aaData:e,
fnDrawCallback:m,aaSorting:[[1,"asc"]],bAutoWidth:!1,aoColumns:[{sTitle:"Name",
mData:function(e){
return'<a class="pathway-link" data-map_id="'+e[1]+'">'+e[10].name+"</a>"}},{
sTitle:"Map ID",mData:1},{sTitle:"Rxn Count",sWidth:"10%",mData:function(e){
return"reaction_ids"in e[10]?e[10].reaction_ids.split(",").length:"N/A"}},{
sTitle:"Cpd Count",sWidth:"10%",mData:function(e){
return"compound_ids"in e[10]?e[10].compound_ids.split(",").length:"N/A"}},{
sTitle:"Source",sWidth:"10%",mData:function(){return"KEGG"}}],oLanguage:{
sEmptyTable:"No objects in workspace",sSearch:"Search:"}};return p.dataTable(a),
!0})).catch((function(e){
return console.error(e),l.prepend('<div class="alert alert-danger">'+e.error.message+"</div>"),
!1}))},this.load_map_list(),this}})}));