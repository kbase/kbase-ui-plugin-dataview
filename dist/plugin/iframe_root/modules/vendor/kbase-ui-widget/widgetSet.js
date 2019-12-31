define(["kb_common/html","kb_common/dom","bluebird"],(function(t,e,n){
"use strict";return{make:function(i){return function(i){
var r=[],u=(i||{}).runtime;if(!u)throw{type:"ArgumentError",
reason:"RuntimeMissing",name:"RuntimeMissing",
message:"The rumtime argument was not provided",
suggestion:"This is a programmer error, not your fault."};function o(e,n){
n=n||{}
;var i=u.getService("widget").getWidget(e),o=u.getService("widget").makeWidget(e,n),d=t.genId(),a={
id:d,name:i.name||i.id,title:i.title,widgetMaker:o};return r.push(a),d}
function d(){return n.all(r.map((function(t){return t.widgetMaker
}))).then((function(t){!function(t,e){var n,i,r,u=t[0].length;for(n=0;n<u;n+=1){
for(r=[],i=0;i<t.length;i+=1)r.push(t[i][n]);e(r)}}([r,t],(function(t){
var e=t[1];t[0].widget=e}))}))}return{addWidget:o,addWidgets:function(t,e){
t.map((function(t){return o(t,e)}))},makeWidgets:d,init:function(t){
return d().then((function(){return n.all(r.map((function(e){
if(e.widget.init)return e.widget.init(t)})))}))},attach:function(){
return n.all(r.map((function(t){
if(t.node||(t.node=e.findById(t.id)),!t.node)throw{type:"WidgetError",
reason:"MissingAttachmentNode",
message:"The widget "+t.title+" does not have a valid node at "+t.id}
;return t.widget.attach(t.node)})))},start:function(t){
return n.all(r.map((function(e){
if(e.widget&&e.widget.start)return e.widget.start(t)})))},run:function(t){
return n.all(r.map((function(e){if(e.widget&&e.widget.run)return e.widget.run(t)
})).filter((function(t){return!!t})))},stop:function(){
return n.all(r.map((function(t){
if(t.widget&&t.widget.stop)return t.widget.stop()})))},detach:function(){
return n.all(r.map((function(t){
if(t.widget&&t.widget.detach)return t.widget.detach()})).filter((function(t){
return!!t})))},destroy:function(){return n.all(r.map((function(t){
if(t.widget&&t.widget.destroy)return t.widget.destroy()})))}}}(i)}}}));