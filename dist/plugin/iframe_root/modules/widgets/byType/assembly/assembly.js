define(["jquery","bluebird","kb_lib/html","kb_lib/htmlBootstrapBuilders","../utils","./assemblySummary","./assemblyContigs"],(function(t,e,n,a,r,i,u){
"use strict";var l=(0,n.tag)("div");function c(t){var n,c,o=t.runtime,m=[{
module:i,id:"summary"},{module:u,id:"contigs"}];return m.forEach((function(t){
t.instance=t.module.make({runtime:o})})),Object.freeze({attach:function(t){
return(c=(n=t).appendChild(document.createElement("div"))).innerHTML=l([a.buildPanel({
type:"default",title:"Summary",body:l({dataElement:"summary"})}),a.buildPanel({
type:"default",title:"Contigs",body:l({dataElement:"contigs"})
})]),e.all(m.map((function(t){
return t.instance.attach(c.querySelector('[data-element="'+t.id+'"]'))})))},
start:function(t){var n=r.getRef(t);return e.all(m.map((function(t){
return t.instance.start({objectRef:n})})))},stop:function(){
return e.all(m.map((function(t){return t.instance.stop()})))},detach:function(){
return e.all(m.map((function(t){return t.instance.detach()}))).then((function(){
n&&c&&(c.innerHTML="",n.removeChild(c))}))}})}return{make:function(t){
return c(t)}}}));