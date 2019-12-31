define(["jquery","underscore","bluebird","kb_common/html"],(function(n,e,t,r){
"use strict";function u(u){
var i,o,c,a=u.runtime,d=u.widget.module,f=u.widget.jquery_object,s=u.widget.panel,l=u.widget.title
;return{init:function(n){return new t((function(n,e){require([d],(function(){n()
}),(function(n){e(n)}))}))},attach:function(e){return new t((function(t,u){
i=e,o=document.createElement("div"),
i.appendChild(o),void 0===(c=s?function(e,t){
var u=r.genId(),i=r.tag("div"),o=r.tag("span");return e.html(i({
class:"panel panel-default "},[i({class:"panel-heading"},[o({class:"panel-title"
},t)]),i({class:"panel-body"},[i({id:u})])])),n("#"+u)
}(n(o),l):n(o))[f]?u("Sorry, cannot find jquery widget "+f):t()}))},
start:function(n){return new t((function(t){var r=e.extendOwn({},n,{
wsNameOrId:n.workspaceId,objNameOrId:n.objectId,
ws_url:a.getConfig("services.workspace.url"),
token:a.getService("session").getAuthToken(),runtime:a});c[f](r),t()}))},
run:function(n){return new t((function(n){n()}))},stop:function(){
return new t((function(n){n()}))},detach:function(){return new t((function(n){
n()}))},destroy:function(){return new t((function(n){n()}))}}}return{
make:function(n){return u(n)}}}));