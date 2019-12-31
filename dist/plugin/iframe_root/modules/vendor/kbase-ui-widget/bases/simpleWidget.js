define(["bluebird","underscore","kb_common/dom","kb_common/state","kb_common/html","kb_common/domEvent"],(function(n,t,r,e,o,u){
"use strict";function c(c){
var i,a,f=[],l=[],s=e.make(),h=c.runtime,d={},m=u.make();if(!h)throw{
type:"ArgumentError",reason:"RuntimeMissing",blame:"dataWidget",
message:"The runtime argument was not provided"};function y(n,t){
f.hasOwnProperty(n)||(f[n]=[]),f[n].push(t)}function v(n){
return!!f.hasOwnProperty(n)}function p(n){return v(n)?f[n]:[]}function g(n,t){
s.set(n,t)}function E(n,t){return s.get(n,t)}function b(n,t,r,e){
return m.attachEvent(n,t,r,e)}function k(){m.attachEvents()}function C(){
m.detachEvents()}c&&c.on&&Object.keys(c.on).forEach((function(n){y(n,c.on[n])
})),c&&c.events&&c.events.forEach((function(n){b(n)})),d=Object.freeze({
recv:function(n,t,r){l.push(h.recv(n,t,r))},send:function(n,t,r){h.send(n,t,r)},
getConfig:function(n,t){return h.getConfig(n,t)},hasConfig:function(n){
return h.hasConfig(n)},getState:E,setState:g,hasState:function(n){
return s.has(n)},get:E,set:g,addDomEvent:function(n,t,r,e){
return m.addEvent(n,t,r,e)},attachDomEvent:b,runtime:h});var O=function(){
var n=o.tag("div"),t=o.genId();return{id:t,content:n({id:t},[n({
dataElement:"body"})])}}();function T(n,t){
var r=a.querySelector('[data-element="'+n+'"]');r&&(r.innerHTML=t)}
return Object.freeze({on:function(n,r){t.isArray(n)?n.forEach((function(n){
y(n[0],n[1])})):y(n,r)},init:function(t){return n.try((function(){if(v("init")){
var r=p("init").map((function(r){return n.try((function(){return r.call(d,t)}))
}));return n.all(r)}}))},attach:function(t){return n.try((function(){
if(i=t,(a=r.append(i,r.createElement("div"))).innerHTML=O.content,v("attach")){
var e=p("attach").map((function(t){return n.try((function(){return t.call(d,a)
}))}));return n.all(e).then((function(){k()}))}}))},start:function(t){
return n.try((function(){return l.push(h.recv("app","heartbeat",(function(){
n.try((function(){if(s.isDirty()){s.setClean(),C();var t=p("render")
;if(t.length>1)throw{type:"HookError",reason:"TooManyHooks",
message:"The render hook only supports 0 or 1 hooks"}
;if(0!==t.length)return n.try((function(){return t[0].call(d)
})).then((function(n){if(n)if("object"==typeof n){
if(n.content&&T("body",n.content),n.after)try{n.after.call(d)}catch(t){
console.log('Error running "after" method for render'),
console.log(t),T("error",'Error running "after" method for render')}
}else T("body",n)})).then((function(){k()}))}})).catch((function(n){
console.log("ERROR"),console.log(n)}))}))),n.try((function(){var r=[]
;return v("initialContent")&&p("initialContent").forEach((function(e){
r.push(n.try((function(){return e.call(d,t)})).then((function(n){T("body",n)})))
})),v("start")&&p("start").forEach((function(e){r.push(n.try((function(){
return e.call(d,t)})))})),r})).each((function(n,t,r){}))}))},run:function(t){
return n.try((function(){return g("params",t),function(t){
return n.try((function(){if(v("fetch")){var r=p("fetch").map((function(r){
return n.try((function(){return r.call(d,t)}))}))
;return n.all(r).then((function(n){n.forEach((function(n){n&&g(n.name,n.value)
}))}))}}))}(t)}))},stop:function(){return n.try((function(){if(v("stop")){
var t=p("stop").map((function(t){return n.try((function(){t.call(d)}))}))
;return n.all(t)}}))},detach:function(){return n.try((function(){
if(i.innerHTML="",a=null,i=null,v("detach")){var t=p("detach").map((function(t){
return n.try((function(){return t.call(d)}))}))
;return n.all(t).then((function(){C()}))}}))},destroy:function(){
return n.try((function(){if(v("destroy")){var t=p("destroy").map((function(t){
return n.try((function(){return t.call(d)}))}));return n.all(t)}}))}})}
return Object.freeze({make:function(n){return c(n)}})}));