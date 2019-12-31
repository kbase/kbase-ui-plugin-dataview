define(["bluebird","preact","kb_lib/html","kbaseUI/widget/widgetSet","utils","collapsiblePanel","components/error"],(function(e,t,a,n,i,d,r){
"use strict";var o=(0,a.tag)("div");function c(a){
var n,c,l,u=a.runtime,s=u.service("widget").newWidgetSet();return{
init:function(e){return l=o({
class:"kbase-view kbase-dataview-view container-fluid",dataKbaseView:"dataview",
dataKBTesthookPlugin:"dataview"},[o({class:"row"},[o({class:"col-sm-12"},[o({
id:s.addWidget("kb_dataview_download")}),o({id:s.addWidget("kb_dataview_copy")
}),o({id:s.addWidget("kb_dataview_overview")}),d({
title:"Data Provenance and Reference Network",icon:"sitemap",content:o({
id:s.addWidget("kb_dataview_provenance")})
}),u.featureEnabled("new_provenance_widget")?d({
title:"Data Provenance and Reference Network ... in Progress",icon:"sitemap",
content:o({id:s.addWidget("kb_dataview_provenance_v2")})}):null,function(){
if(u.featureEnabled("similar_genomes"))return o({
id:s.addWidget("kb_dataview_relatedData")})}(),o({
id:s.addWidget("kb_dataview_dataObjectVisualizer"),
dataKBTesthookWidget:"dataObjectVisualizer"})])])]),s.init(e)},
attach:function(e){
return n=e,c=document.createElement("div"),n.appendChild(c),c.innerHTML=l,
s.attach(e)},start:function(a){
return i.getObjectInfo(u,a).then(t=>(u.send("ui","setTitle","Data View for "+t.name),
a.objectInfo=t,e.all([t,s.start(a)]))).spread(e=>{u.send("ui","addButton",{
name:"copyObject",label:"Copy",style:"default",icon:"copy",toggle:!0,params:{
ref:e.ref},callback:function(){u.send("copyWidget","toggle")}})}).catch(e=>{
c.innerHTML="",t.render(t.h(r,{runtime:u,error:e}),c)})},run:function(e){
return s.run(e)},stop:function(){return s.stop()},detach:function(){
return s.detach().finally((function(){n&&c&&(n.removeChild(c),c.innerHTML="")}))
}}}return{make:function(e){return c(e)}}}));