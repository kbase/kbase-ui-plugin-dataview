define(["bluebird","./adapters/objectWidget","./adapters/kbWidget"],(function(e,t,r){
"use strict";function n(n){var i={},o=n.runtime;return{addWidget:function(e){
if(e.id&&(e.name=e.id),
i[e.name])throw new Error("Widget "+e.name+" is already registered");i[e.name]=e
},getWidget:function(e){return i[e]},makeWidget:function(n,a){var u,d=i[n]
;if(!d)throw new Error("Widget "+n+" not found")
;switch((a=a||{}).runtime=o,d.type){case"factory":u=function(t,r){
return new e((function(e,n){var i=[t.module]
;t.css&&i.push("css!"+t.module+".css"),require(i,(function(i){
if(void 0!==i)if(void 0!==i.make)try{e(i.make(r))}catch(o){n(o)
}else n('Factory widget does not have a "make" method: '+t.name+", "+t.module);else n({
message:"Factory widget maker is undefined for "+t.module,data:{widget:t}})}))
}))}(d,a);break;case"es6":u=function(t,r){return new e((function(e,n){
var i=[t.module];t.css&&i.push("css!"+t.module+".css"),require(i,(function(i){
if(void 0!==i)try{e(new i(r))}catch(o){n(o)}else n({
message:"Widget class is undefined for "+t.module,data:{widget:t}})}))}))}(d,a)
;break;case"object":u=function(r,n){return e.try((function(){return t.make({
widgetDef:r,initConfig:n,adapterConfig:{runtime:o}})}))}(d,a);break
;case"kbwidget":u=function(t,n){return e.try((function(){var e={runtime:o,
widget:{module:t.module,
jquery_object:t.config&&t.config.jqueryName||n.jqueryName,panel:n.panel,
title:t.title}};return r.make(e)}))}(d,a);break;default:
throw new Error("Unsupported widget type "+d.type)}return u.then((function(e){
return function(e,t){var r
;if("object"!=typeof e&&(r="Invalid widget after making: "+t),
r)throw console.error(r),console.error(e),new Error(r)}(e,n),e}))}}}return{
make:function(e){return n(e)}}}));