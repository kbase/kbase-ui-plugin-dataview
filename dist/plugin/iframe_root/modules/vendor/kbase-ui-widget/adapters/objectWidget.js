define(["bluebird","jquery","kb_common/utils","kb_common/dom"],(function(e,n,t,r){
"use strict";return{make:function(i){return function(i){
var o,u,c,d,f=i.adapterConfig.runtime,a=i.widgetDef.module;if(!f)throw{
type:"ArgumentError",reason:"RuntimeMissing",
message:"The runtime factory construction property is required but not provided"
};return{init:function(n){return new e((function(e){require([a],(function(r){
if(!r)throw new Error("Widget module did not load properly (undefined) for "+i.module)
;d=t.shallowMerge({},i.initConfig),t.merge(d,n),o=Object.create(r),e()}))}))},
attach:function(n){return new e((function(e){
u=n,c=r.createElement("div"),u.appendChild(c),e()}))},start:function(r){
return new e((function(e){var i=t.shallowMerge(d,{container:n(c),
userId:f.getService("session").getUsername(),runtime:f,params:r})
;o.init(i),o.go(),e()}))},stop:function(){return e.try((function(){o.stop()}))},
detach:function(){return e.try((function(){u.removeChild(c)}))},
destroy:function(){}}}(i)}}}));