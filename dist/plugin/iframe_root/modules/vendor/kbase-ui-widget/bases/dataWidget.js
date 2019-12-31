define(["bluebird","underscore","kb_common/dom","kb_common/state","kb_common/html"],(function(n,t,e,r,o){
"use strict";function a(a){
var u,c,i,f,l=[],s=[],d=r.make(),h=a.runtime,y={},m=r.make(),p=a.defaults,g={}
;if(T("new"),!h)throw D({type:"ArgumentError",reason:"RuntimeMissing",
blame:"dataWidget",message:"The runtime argument was not provided"
}),new Error("The runtime argument was not provided");function v(n,t){
l.hasOwnProperty(n)||(l[n]=[]),l[n].push(t)}function b(n){
return!!l.hasOwnProperty(n)}function E(n){return b(n)?l[n]:[]}function k(n,t){
d.set(n,t)}function w(n,t){return d.get(n,t)}function O(){return d.setClean()}
function T(n){status=n}i=a.class,f=a.icon;var j,C={};function P(n){var t=S(n)
;return t||(t=function(n){var t=[];return{type:n.type,added:new Date,
delegatedListeners:t,addEvent:function(n){t.push(n)},handler:function(n){
t.forEach((function(t){try{n.target.matches(t.selector)&&t.handler(n)}catch(e){
console.error("Error handling listener"),console.error(e)}}))}}}({type:n
}),C[n]=t),t}function S(n){return C[n]}function M(n){var t=S(n.type)
;t||(t=P(n.type)),t.addEvent(n)}function A(){return n.try((function(){
if(d.isDirty())if(O(),"error"!==status){var t=E("render");if(t.length>1)throw{
type:"HookError",reason:"TooManyHooks",
message:"The render hook only supports 0 or 1 hooks"}
;if(0!==t.length)return n.try((function(){return t[0].call(y)
})).then((function(n){if(n)if("object"==typeof n){
if(n.content&&L("body",n.content),n.after)try{n.after.call(y)}catch(t){
console.log('Error running "after" method for render'),
console.log(t),L("error",'Error running "after" method for render')}
}else L("body",n)})).then((function(){return null}))}else!function(){O()
;var n=w("error")
;n&&(L("error",o.makeObjectTable(n,Object.keys(n))),L("body",""))}()}))}
function H(){return j||(j=function(){var n=o.tag("div"),t=o.tag("span");return{
id:o.genId(),content:n({class:"panel panel-default "+i},[n({
class:"panel-heading"},[n({class:"kb-row"},[n({class:"-col -span-8"},[t({
class:"fa pull-left fa-"+f,style:{fontSize:"150%",paddingRight:"10px"}}),t({
class:"panel-title",style:{verticalAlign:"middle"},dataElement:"title"})]),n({
class:"-col -span-4",style:{textAlign:"right"}},[n({class:"btn-group",
dataPlaceholder:"buttons"})])])]),n({class:"panel-body"},[n({dataElement:"body"
}),n({dataElement:"error"})])])}}()),j}function L(n,t){
var e=c.querySelector('[data-element="'+n+'"]');e&&(e.innerHTML=t)}
function z(n){var t=c.querySelector('[data-element="title"]');t&&(t.innerHTML=n)
}function D(n){T("error"),k("error",n)}function R(n){
return n.status&&500===n.status?o.makeTableRotated({class:"table table-striped",
columns:["Name","Code","Message","Source Error"],
rows:[[n.error.name,n.error.code,n.error.message,n.error.error]]
}):"not a data access error"}
return a&&a.on&&Object.keys(a.on).forEach((function(n){v(n,a.on[n])
})),a&&a.events&&a.events.forEach((function(n){M(n)})),y=Object.freeze({
recv:function(n,t,e){s.push(h.recv(n,t,e))},send:function(n,t,e){h.send(n,t,e)},
getConfig:function(n,t){return h.getConfig(n,t)},hasConfig:function(n){
return h.hasConfig(n)},getState:w,setState:k,hasState:function(n){
return d.has(n)},getParam:function(n,t){return m.get(n,t||p[n])},
setParam:function(n,t){m.set(n,t)},hasParam:function(n){return m.has(n)},
getPlace:function(n){return g[n]},getDomNode:function(){return c},get:w,set:k,
addDomEvent:M,setTitle:z,runtime:h}),Object.freeze({on:function(n,e){
t.isArray(n)?n.forEach((function(n){v(n[0],n[1])})):v(n,e)},init:function(t){
return n.try((function(){if(b("init")){var e=E("init").map((function(e){
return n.try((function(){return e.call(y,t)}))}));return n.all(e)}}))},
attach:function(t){return n.try((function(){
if(u=t,c=e.append(u,e.createElement("div")),Object.keys(C).forEach((function(n){
var t=C[n];c.addEventListener(t.type,t.handler,!0)
})),c.innerHTML=H().content,b("attach")){var r=E("attach").map((function(t){
return n.try((function(){return t.call(y,c)}))}))
;return n.all(r).then((function(){return null}))}if(b("layout")){
var o=E("layout")[0];return n.try((function(){return o.call(y)
})).then((function(n){
L("body",n.content),Object.keys(n.places).forEach((function(t){var e=n.places[t]
;e.id&&(e.node=document.getElementById(e.id)),g[t]=e}))}))}}))},
start:function(t){return n.try((function(){
return a.title&&z(a.title),s.push(h.recv("app","heartbeat",(function(){
A().then((function(){})).catch((function(n){D({type:"RenderError",
message:"An error was encountered while rendering",description:R(n),data:n})}))
}))),n.try((function(){var e=[]
;return b("initialContent")&&E("initialContent").forEach((function(r){
e.push(n.try((function(){return r.call(y,t)})).then((function(n){L("body",n)})))
})),b("start")&&E("start").forEach((function(r){e.push(n.try((function(){
return r.call(y,t)})))})),e})).each((function(n,t,e){}))}))},run:function(t){
return n.try((function(){return k("params",t),function(t){
return n.try((function(){if(b("fetch")){var e=E("fetch").map((function(e){
return n.try((function(){return e.call(y,t)}))}))
;return n.all(e).then((function(n){n.forEach((function(n){n&&k(n.name,n.value)
}))}))}})).then((function(){T("fetched")}))}(t).catch((function(n){D({
type:"FetchError",reason:"Unknown",message:"Error encountered fetching data",
description:R(n),data:n})}))}))},stop:function(){return n.try((function(){
if(s.forEach((function(n){n&&h.drop(n)})),b("stop")){
var t=E("stop").map((function(t){return n.try((function(){t.call(y)}))}))
;return n.all(t)}}))},detach:function(){return n.try((function(){
if(u&&u.removeChild(c),c=null,u=null,b("detach")){
var t=E("detach").map((function(t){return n.try((function(){return t.call(y)}))
}));return n.all(t).then((function(){return null}))}}))},destroy:function(){
return n.try((function(){if(b("destroy")){var t=E("destroy").map((function(t){
return n.try((function(){return t.call(y)}))}));return n.all(t)}}))}})}
return Object.freeze({make:function(n){return a(n)}})}));