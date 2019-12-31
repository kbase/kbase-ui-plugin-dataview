define(["numeral","kb_lib/html","places","yaml!widgets/download/typeSupport.yml","kb_service/client/workspace","kb_service/client/transform","kb_service/client/userAndJobState","kb_service/utils","poller","toggler"],(function(e,t,n,a,o,r,s,d,l,i){
"use strict";function c(c){
var u,f,m,p=c.runtime,h=t.tag,b=h("div"),g=h("button"),w=h("label"),v=h("input"),y=h("table"),k=h("tr"),j=h("td"),_=h("th"),T=h("p"),C=h("form"),I=h("span"),S=h("iframe"),E=n.make({
root:f}),N=l.make({interval:1e3}),O={mode:"new",downloads:{}};var x=b({
class:"hidden",id:E.add("main")},[b({class:"panel panel-primary"},[b({
class:"panel-heading"},[I({class:"panel-title",id:E.add("title")
},"Transform and Download Data Object")]),b({class:"panel-body"},[b({
class:"container-fluid"},[b({class:"col-md-12"
},[T(["This tool allows you to convert this data object to one or more output formats and download the resulting file."]),T({
id:E.add("comment")})]),b({class:"col-md-12"},[I({id:E.add("content")})]),b({
class:"col-md-12",style:{marginTop:"1em"}},[b({class:"panel panel-default"},[b({
class:"panel-heading"},[b({class:"panel-title"},"Requested Transforms")]),b({
class:"panel-body"},[b({id:E.add("downloads")})]),b({id:E.add("downloaders")
})])])])])])]);function A(t){return void 0===t?"":e(t).format("00:00:00")}
var q={};function D(e){q[e.id+"."+e.type]=e}function J(e){
return q[e.id+"."+e.type]}function z(e){var t=q[e.target.id+"."+e.type]
;t&&t.handler(e)}var R={};function H(e){
var n=t.genId(),a=["btn","btn-"+e.type],o={id:n,type:"click",
handler:function(t){t.preventDefault(),e.handler()}}
;e.disabled&&(a.push("disabled"),
o.disabled=!0,o.disabledHandler=o.handler,o.handler=function(){
alert("This button is disabled")}),D(o),e.name&&(R[e.name]=n)
;var r=e.width||"100%";return g({style:{width:r},class:a.join(" "),id:n
},e.label)}function L(e){var t=R[e];if(t){var n=J({id:t,type:"click"})
;if(n&&!n.disabled){var a=document.getElementById(t)
;a&&(n.disabledHandler=n.handler,n.handler=function(){
alert("This button is disabled")},a.classList.add("disabled"),n.disabled=!0)}}}
function U(e){var t=R[e];if(t){var n=J({id:t,type:"click"});if(n&&n.disabled){
var a=document.getElementById(t)
;a&&(n.handler=n.disabledHandler,delete n.disabledHandler,
a.classList.remove("disabled"),n.disabled=!1)}}}var Y={};function F(e){
if(null!==e.limit){
if(0===e.limit)return void(e.message="No more downloads available")
;e.limit-=1,0===e.limit&&(e.message="Download starting; please run Transform again to obtain another download")
}else e.message="You may download this file again if you need to";!function(e){
var n=t.genId(),a=S({id:n,src:e,style:{border:"1px red solid",width:"40px",
height:"40px"}});E.appendContent("downloaders",a)}(e.url)}function M(e){
switch(e.status){case"downloaded":return 0===e.limit?H({type:"default",
disabled:!0,handler:function(){alert("Can only download once")},
label:"Downloaded"}):H({type:"primary",handler:function(){
F(e),e.status="downloaded",B()},label:"Download File"});case"ready":return H({
type:"primary",handler:function(){F(e),e.status="downloaded",B()},
label:"Download File"});case"timedout":case"error":return H({type:"warning",
handler:function(){p.send("app","redirect",{
url:p.config("services.doc_site.url")+"/report-an-issue",newWindow:!0})},
label:"Report Error"});case"waiting":return H({type:"danger",handler:function(){
alert("cancel ")},label:"Cancel"});default:return""}}function B(){var e=y({
class:"table table-bordered",style:{width:"100%"}},[k([_({width:"10%"
},"Format"),_({width:"10%"},"Started?"),_({width:"10%"},"Requested?"),_({
width:"10%"},"Completed?"),_({width:"10%"},"Available?"),_({width:"10%"
},"Elapsed"),_({width:"10%"},"Status"),_({width:"10%"},"Next"),_({width:"20%"
},"Message")]),Object.keys(O.downloads).map((function(e){
var t=O.downloads[e],n=O.downloadConfig[t.formatId].name
;return k([j(n),j(t.started?"Y":"n"),j(t.requested?"Y":"n"),j(t.completed?"Y":"n"),j(t.available?"Y":"n"),j(A(t.elapsed)),j(t.status||""),j(M(t)),j(t.message||"")])
})).join("")]);E.setContent("downloads",e)}function W(e){return{
content:C([y([k([j("Transform to: "),j(I({class:"kb-btn-group",
dataToggle:"buttons"},e.map((function(e,n){var a=String(n);return function(e){
var n=t.genId(),a=(e.type,{id:n,type:"change",handler:function(t){
t.preventDefault(),e.handler()}}),o=e.name||"checkbox_"+e.value
;return D(a),o&&(Y[o]=n),w({class:"kb-checkbox-control"},[v({type:"checkbox",
autocomplete:"off",checked:e.checked,value:e.value}),e.label])}({type:"default",
checked:!1,value:String(n),handler:function(e){e.target.checked?O.downloads[a]={
formatId:n,requested:!1,completed:!1,available:!1
}:delete O.downloads[a],B(),0===Object.keys(O.downloads).length?L("transform"):U("transform")
},label:e.name})})).join(" ")))]),k([j(),j([b({class:"btn-toolbar",
role:"toolbar"},[b({class:"btn-group",role:"group"},[H({name:"transform",
type:"primary",handler:function(){Object.keys(O.downloads).forEach((function(e){
var t=O.downloads[e];"JSON"===O.downloadConfig[t.formatId].name?function(e){
e.started=!0,e.requested=!0,e.completed=!0,e.available=!0,e.limit=null
;var t=function(e,t,n){
var a=p.getConfig("services.data_import_export.url")+"/download",o={ws:e,id:t,
token:p.service("session").getAuthToken(),url:n,name:t+".JSON.zip",wszip:1}
;return a+"?"+Z(o)
}(O.params.objectInfo.ws,O.params.objectInfo.name,p.getConfig("services.workspace.url"))
;e.url=t,e.status="ready",e.message="",B()}(t):function(e){
var t=O.downloadConfig[e.formatId],n={external_type:t.external_type,
kbase_type:O.type,workspace_name:O.params.objectInfo.ws,
object_name:O.params.objectInfo.name,optional_arguments:{
transform:t.transform_options}
},a="."+t.name.replace(/[^a-zA-Z0-9|\.\-_]/g,"_"),o=new r(p.getConfig("services.transform.url"),{
token:p.service("session").getAuthToken()}),d=O.params.objectInfo.name+a
;e.started=!0,e.limit=1,o.download(n).then((function(n){var a=n[1]
;e.jobId=a,e.requested=!0,e.message="Requested transform of this object...",B()
;var o=new s(p.getConfig("services.user_job_state.url"),{
token:p.service("session").getAuthToken()});N.addTask({timeout:3e5,
isCompleted:function(t){return o.get_job_status(a).then((function(n){
var a=n[2],o=n[5],r=n[6];if(1===o){if(0===r)return!0;throw new Error(a)}
return e.elapsed=t/1e3,e.status="waiting",B(),!1})).catch((function(e){throw e
}))},whenCompleted:function(){return o.get_results(a).then((function(n){
e.completed=!0;var a=function(e,t,n){var a=function(e){var t=e.split("/")
;return t.length>1&&(e=t[t.length-1]),(t=e.split("?")).length>0&&(e=t[0]),e
}(e.shocknodes[0]),o=p.config("services.data_import_export.url")+"/download",r={
id:a,token:p.service("session").getAuthToken(),del:1}
;return n?r.unzip=n:r.name=t+".zip",
e.remoteShockUrl&&(r.url=e.remoteShockUrl),o+"?"+Z(r)}(n,d,t.unzip)
;e.url=a,e.status="ready",
e.available=!0,e.message="Transform complete, ready for download.",B()}))},
whenTimedOut:function(t){
e.error=!0,e.status="timedout",e.message="Timed out after "+t/1e3+" seconds",B()
},whenError:function(t){var n
;console.error(t),e.status="error",e.error=!0,n=t.message?t.message:t.error.message?t.error.message:"Unknown error",
e.message=n,B()}})})).catch((function(t){var n
;e.status="error",e.error=!0,n=t.message?t.message:t.error.message?t.error.message:"Unknown error",
e.message=n,B()}))}(t)})),L("transform"),U("stop")},label:"Transform",
width:"10em",disabled:!0}),H({name:"stop",type:"danger",handler:function(){
alert("Cannot do this yet"),L("stop"),U("reset")},label:"Stop",disabled:!0,
width:"10em"}),H({name:"reset",type:"default",handler:function(){
alert("Not implemented yet"),L("reset"),U("transform")},label:"Reset",
disabled:!0,width:"10em"})])])])])])]),events:[{type:"change",selector:"input",
handler:function(e){var t=e.target.value;e.target.checked?O.downloads[t]={
formatId:parseInt(t,10),requested:!1,completed:!1,available:!1
}:delete O.downloads[t],
B(),0===Object.keys(O.downloads).length?L("transform"):U("transform")}}]}}
function Z(e){return Object.keys(e).map((function(t){
return[t,String(e[t])].map((function(e){return encodeURIComponent(e)
})).join("=")})).join("&")}return{init:function(e){},attach:function(e){
u=e,f=e.appendChild(document.createElement("div")),function(e){
e.forEach((function(e){f.addEventListener(e,z)}))}(["click","load"])},
start:function(e){O.params=e,f.innerHTML=x,m=i.make({node:E.getNode("main"),
hide:!0}),p.recv("downloadWidget","toggle",(function(){m.toggle()}))},
run:function(e){var t=new o(p.getConfig("services.workspace.url"),{
token:p.service("session").getAuthToken()}),n=function(e){
var t=e.objectInfo.ws+"/"+e.objectInfo.name
;return e.objectInfo.version&&(t+="/"+e.objectInfo.version),t}(e)
;return t.get_object_info_new({objects:[{ref:n}],ignoreErrors:1
}).then((function(e){
if(0===e.length)throw new Error("No object found with ref "+n)
;if(e.length>1)throw new Error("Too many objects returned for ref "+n)
;var t=d.object_info_to_object(e[0]),o=t.typeModule+"."+t.typeName,r=a.types[o]
;O.type=o,
void 0===r&&(E.setContent("comment","This object type does not support Transform conversions, but the default JSON format is available."),
r=[]);var s=r.concat({name:"JSON",external_type:"JSON.JSON",transform_options:{}
});O.downloadConfig=s;var l=W(s)
;E.setContent("content",l.content),l.events.forEach((function(e){(function(e,t){
void 0===t&&(t=e,e=document);var n=e.querySelectorAll(t)
;return null===n?[]:Array.prototype.slice.call(n)
})(E.getNode("content"),e.selector).forEach((function(t){
t.addEventListener(e.type,e.handler)}))}))}))},stop:function(){},
detach:function(){f&&u.removeChild(f)},destroy:function(){}}}return{
make:function(e){return c(e)}}}));