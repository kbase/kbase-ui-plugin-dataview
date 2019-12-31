define(["bluebird","numeral","kb_common/html","kb_common/jsonRpc/genericClient","places","kb_service/client/workspace","kb_service/client/narrativeMethodStore","kb_service/utils","poller"],(function(e,t,n,o,a,r,s,i,d){
"use strict";function l(l){
var c,u,f,m=l.runtime,p=n.tag,h=p("div"),b=p("button"),g=p("label"),v=p("input"),w=p("table"),y=p("tr"),k=p("td"),j=p("th"),_=p("p"),E=p("form"),T=p("span"),R=p("iframe"),C="hidden",O=d.make({
interval:1e3}),I={mode:"new",downloads:{}};function N(e){
return"number"!=typeof e?"":t(e).format("00:00:00")}var S={};function q(e){
return S[e.id+"."+e.type]}function x(e){var t=S[e.target.id+"."+e.type]
;t&&t.handler&&t.handler(e)}var D={};function A(e){
var t=n.genId(),o=["btn","btn-"+e.type],a={id:t,type:"click",
handler:function(t){t.preventDefault(),e.handler()}}
;e.disabled&&(o.push("disabled"),
a.disabled=!0,a.disabledHandler=a.handler,a.handler=function(e){
e.preventDefault()}),function(e){S[e.id+"."+e.type]=e}(a),e.name&&(D[e.name]=t)
;var r=e.width||"100%";return b({style:{width:r},class:o.join(" "),id:t
},e.label)}function L(e){var t=D[e];if(t){var n=q({id:t,type:"click"})
;if(n&&!n.disabled){var o=document.getElementById(t)
;o&&(n.disabledHandler=n.handler,n.handler=function(e){e.preventDefault
},o.classList.add("disabled"),n.disabled=!0)}}}function F(e){var t=D[e];if(t){
var n=q({id:t,type:"click"});if(n&&n.disabled){var o=document.getElementById(t)
;o&&(n.handler=n.disabledHandler,
delete n.disabledHandler,o.classList.remove("disabled"),n.disabled=!1)}}}
function H(e){if(null!==e.limit){
if(0===e.limit)return void(e.message="No more downloads available")
;e.limit-=1,0===e.limit&&(e.message="Download starting; if you need to download again, you will need to Reset and run Transform again")
}else e.message="You may download this file again.";!function(e){
var t=n.genId(),o=R({id:t,src:e,style:{display:"none"}})
;f.appendContent("downloaders",o)}(e.url)}function J(e){switch(e.status){
case"downloaded":return 0===e.limit?A({type:"default",disabled:!0,
handler:function(){alert("Can only download once")},label:"Downloaded"}):A({
type:"primary",handler:function(){H(e),e.status="downloaded",M()},
label:"Download File"});case"ready":return A({type:"primary",handler:function(){
H(e),e.status="downloaded",M()},label:"Download File"});case"timedout":
case"error":return A({type:"warning",handler:function(){
m.send("app","redirect",{
url:m.config("services.doc_site.url")+"/report-an-issue",newWindow:!0})},
label:"Report Error"});case"waiting":return A({type:"danger",handler:function(){
alert("cancel ")},label:"Cancel"});default:return""}}function M(){var e,t=!0
;e=0===Object.keys(I.downloads).length?T({style:{fontStyle:"italic"}
},["No transforms requested, please select one or more from the options above"]):w({
class:"table table-bordered",style:{width:"100%"}},[y([j({width:"10%"
},"Format"),j({width:"10%"},"Started?"),j({width:"10%"},"Completed?"),j({
width:"10%"},"Elapsed"),j({width:"10%"},"Status"),j({width:"10%"},"Next"),j({
width:"40%"},"Message")]),Object.keys(I.downloads).map((function(e){
var n=I.downloads[e],o=e
;return n.completed||(t=!1),y([k(o),k(n.started?"Y":"n"),k(n.completed?"Y":"n"),k(N(n.elapsed)),k(n.status||""),k(J(n)),k(n.message||"")])
})).join("")]),f.setContent("downloads",e),t&&(L("stop"),F("reset"))}
function z(e){return{content:E([w([y([k("Transform to: "),k(T({
class:"kb-btn-group",dataToggle:"buttons"},Object.keys(e).map((function(e){
return g({class:"kb-checkbox-control"},[v({type:"checkbox",autocomplete:"off",
checked:!1,value:e}),T({style:{marginLeft:"4px"}},e)])
})).join(" ")))]),y([k(),k([h({class:"btn-toolbar",role:"toolbar"},[h({
class:"btn-group",role:"group"},[A({name:"transform",type:"primary",
handler:function(){
L("transform"),F("stop"),Object.keys(I.downloads).forEach((function(e){
var t=I.downloads[e];"JSON"===e?function(e){
e.started=!0,e.requested=!0,e.completed=!0,e.available=!0,e.limit=null
;var t=function(e,t,n){
var o=m.getConfig("services.data_import_export.url")+"/download",a={ws:e,id:t,
token:m.service("session").getAuthToken(),url:n,name:t+".JSON.zip",wszip:1}
;return o+"?"+Y(a)
}(I.params.objectInfo.ws,I.params.objectInfo.name,m.getConfig("services.workspace.url"))
;e.url=t,e.status="ready",e.message="",M()}(t):function(e){
var t=I.downloadConfig[e.formatId],n=I.params.objectInfo;e.started=!0,e.limit=1
;var a=new o({module:"NarrativeJobService",
url:m.config("services.narrative_job_service.url"),
token:m.service("session").getAuthToken()});a.callFunc("run_job",[{
method:[t.module,t.func].join("."),params:[{input_ref:n.ref}],service_ver:"dev"
}]).then((function(t){var n=t[0]
;e.jobId=n,e.requested=!0,e.message="Requested transform of this object...",M(),
O.addTask({timeout:36e5,isCompleted:function(t){
return a.callFunc("check_job",[n]).then((function(n){var o=n[0];if(o.finished){
if(o.error)throw console.error("ERROR",o),new Error(o.job_status);return!0}
switch(e.elapsed=t/1e3,e.status=o.job_state,o.job_state){case"queued":
e.message="In queue, at position "+o.position+".";break;case"in-progress":
e.message="Processing...";break;default:e.message=""}return M(),!1
})).catch((function(e){throw e}))},whenCompleted:function(){
return a.callFunc("check_job",[n]).then((function(t){var n=t[0];e.completed=!0
;var o=function(e,t){
var n=m.config("services.data_import_export.url")+"/download",o=m.config("services.shock.url"),a={
id:e.shock_id,token:m.service("session").getAuthToken(),name:t+".zip",url:o,
del:1};return n+"?"+Y(a)}(n.result[0],I.objectName)
;e.url=o,e.status="ready",e.available=!0,
e.message="Transform complete, ready for download.",M()})).catch((function(e){
throw console.error("ERROR",e),e}))},whenTimedOut:function(t){
e.completed=!0,e.error=!0,
e.status="timedout",e.message="Timed out after "+t/1e3+" seconds",M()},
whenError:function(t){var n
;console.error(t),e.completed=!0,e.status="error",e.error=!0,
n=t.message?t.message:t.error&&t.error.message?t.error.message:"Unknown error",
e.message=n,M()},onCancel:function(){
return a.callFunc("cancel_job",[n]).catch((function(e){
console.error("ERROR canceling: ",e)}))}})})).catch((function(t){var n
;e.status="error",
e.error=!0,n=t.message?t.message:t.error.message?t.error.message:"Unknown error",
e.message=n,M()}))}(t)}))},label:"Transform",width:"10em",disabled:!0}),A({
name:"stop",type:"danger",handler:function(){O.cancelAllTasks()},label:"Stop",
disabled:!0,width:"10em"}),A({name:"reset",type:"default",handler:function(){
L("reset"),F("transform"),Object.keys(I.downloads).forEach((function(e){
var t=I.downloads[e]
;t.started=!1,t.requested=!1,t.completed=!1,t.available=!1,t.status="reset",
t.elapsed=null,t.message=""})),M()},label:"Reset",disabled:!0,width:"10em"
})])])])])])]),events:[{type:"change",selector:'input[type="checkbox"]',
handler:function(e){var t=e.target.value;e.target.checked?I.downloads[t]={
formatId:t,requested:!1,completed:!1,available:!1
}:delete I.downloads[t],M(),0===Object.keys(I.downloads).length?L("transform"):F("transform")
}}]}}function U(){switch(C){case"hidden":
f.getNode("main").classList.remove("hidden"),C="showing";break;case"showing":
f.getNode("main").classList.add("hidden"),C="hidden"}}function Y(e){
return Object.keys(e).map((function(t){return[t,String(e[t])].map((function(e){
return encodeURIComponent(e)})).join("=")})).join("&")}return{
init:function(e){},attach:function(e){
c=e,u=e.appendChild(document.createElement("div")),f=a.make({root:u
}),function(e){e.forEach((function(e){u.addEventListener(e,x)}))
}(["click","load"])},start:function(t){!function(e){I.params=e
}(t),u.innerHTML=h({class:"hidden",id:f.add("main")},[h({
class:"panel panel-primary"},[h({class:"panel-heading"},[T({class:"panel-title",
id:f.add("title")},"Transform and Download Data Object")]),h({class:"panel-body"
},[h({class:"container-fluid"},[h({class:"col-md-12"
},[_(["This tool allows you to convert this data object to one or more output formats and download the resulting file(s)."]),_({
id:f.add("comment")})]),h({class:"col-md-12"},[T({id:f.add("content")})]),h({
class:"col-md-12",style:{marginTop:"1em"}},[h({class:"panel panel-default"},[h({
class:"panel-heading"},[h({class:"panel-title"},"Requested Transforms")]),h({
class:"panel-body"},[h({id:f.add("downloads")})]),h({id:f.add("downloaders")
})])])])])])]),M(),m.recv("downloadWidget","toggle",(function(){U()}))
;var n=new r(m.getConfig("services.workspace.url"),{
token:m.service("session").getAuthToken()}),o=function(e){
var t=e.objectInfo.ws+"/"+e.objectInfo.name
;return e.objectInfo.version&&(t+="/"+e.objectInfo.version),t}(t)
;return e.all([new s(m.config("services.narrative_method_store.url",{
token:m.service("session").getAuthToken()})).list_categories({load_methods:0,
load_apps:0,load_types:1,tag:"dev"}).then((function(e){return e[3]
})),n.get_object_info_new({objects:[{ref:o}],ignoreErrors:1
})]).spread((function(e,t){
if(0===t.length)throw new Error("No object found with ref "+o)
;if(t.length>1)throw new Error("Too many objects returned for ref "+o)
;var n=i.object_info_to_object(t[0]),a=n.typeModule+"."+n.typeName,r=e[a],s={}
;r&&r.export_functions&&Object.keys(r.export_functions).forEach((function(e){
var t=r.export_functions[e].split(".");s[e]={module:t[0],func:t[1]}})),I.type=a,
I.objectName=n.name,s.JSON={},I.downloadConfig=s;var d=z(s)
;f.setContent("content",d.content),d.events.forEach((function(e){(function(e,t){
void 0===t&&(t=e,e=document);var n=e.querySelectorAll(t)
;return null===n?[]:Array.prototype.slice.call(n)
})(f.getNode("content"),e.selector).forEach((function(t){
t.addEventListener(e.type,e.handler)}))}))})).catch((function(e){
console.error("ERROR",e)}))},stop:function(){},detach:function(){
u&&c.removeChild(u)},destroy:function(){}}}return{make:function(e){return l(e)}}
}));