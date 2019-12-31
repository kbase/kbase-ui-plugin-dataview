define(["jquery","bluebird","kb_lib/html","kbaseUI/widget/widgetSet","kb_service/utils","kb_service/client/workspace"],(function(e,t,n,r,i,o){
"use strict";function a(e){var t=n.tag("div");return t({
class:"panel panel-default"},[t({class:"panel-heading"},[t({class:"panel-title"
},e.title)]),t({class:"panel-body"},[e.content])])}function c(e){
var r,c,u,s=e.runtime,d=s.service("widget").newWidgetSet();return{
init:function(e){return t.try((function(){return u=function(){var e=n.tag("div")
;return{title:"Dataview",content:e({
class:"kbase-view kbase-dataview-view container-fluid",
"data-kbase-view":"dataview",dataKBTesthookPlugin:"dataview"},[e({class:"row"
},[e({class:"col-sm-12"},[a({title:"Data Provenance and Reference Network",
icon:"sitemap",content:e({id:d.addWidget("kb_dataview_provenance")})})])])])}
}(),d.init(e)}))},attach:function(e){return t.try((function(){
return r=e,c=document.createElement("div"),
r.appendChild(c),c.innerHTML=u.content,d.attach(e)}))},start:function(e){
return t.try((function(){return function(e){return t.try((function(){
var t=e.workspaceId,n=e.objectId,r=e.objectVersion
;if(void 0===t)throw new Error("Workspace id or name is required")
;if(void 0===n)throw new Error("Object id or name is required")
;var a=i.makeWorkspaceObjectRef(t,n,r)
;return new o(s.getConfig("services.workspace.url"),{
token:s.service("session").getAuthToken()}).get_object_info_new({objects:[{ref:a
}],ignoreErrors:1}).then((function(e){
if(null===e[0])throw new Error("Object not found: "+a)
;return i.object_info_to_object(e[0])}))}))}(e).then((function(t){
return e.objectInfo=t,
s.send("ui","setTitle","Data Provenance and Reference Network for "+t.name),
d.start(e)}))}))},run:function(e){return t.try((function(){return d.run(e)}))},
stop:function(){return t.try((function(){return d.stop()}))},detach:function(){
return t.try((function(){return d.detach()}))}}}return{make:function(e){
return c(e)}}}));