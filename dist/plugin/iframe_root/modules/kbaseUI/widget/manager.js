define(["bluebird","./adapters/objectWidget","./adapters/kbWidget","kb_lib/merge"],(function(e,t,i,r){
"use strict";return class{constructor(e){
if(!e||!e.baseWidgetConfig)throw new Error('WidgetManager requires a baseWidgetConfig argument; pass as "baseWidgetConfig"')
;this.baseWidgetConfig=e.baseWidgetConfig,this.widgets={}}addWidget(e){
if(e.id&&(e.name=e.id),
this.widgets[e.name])throw new Error("Widget "+e.name+" is already registered")
;this.widgets[e.name]=e}getWidget(e){return this.widgets[e]}
makeFactoryWidget(t,i){return new e((e,r)=>{var a=[t.module]
;t.css&&a.push("css!"+t.module+".css"),require(a,a=>{
if(void 0!==a)if(void 0!==a.make)try{e(a.make(i))}catch(d){r(d)
}else r(new Error('Factory widget does not have a "make" method: '+t.name+", "+t.module));else r(new Error("Factory widget maker is undefined for "+t.module))
},e=>{r(e)})})}makeES6Widget(t,i){return new e((e,r)=>{var a=[t.module]
;t.css&&a.push("css!"+t.module+".css"),require(a,a=>{let d
;if(d=a.Widget?a.Widget:a,void 0!==d)try{e(new d(i))}catch(s){r(s)}else r({
message:"Widget class is undefined for "+t.module,data:{widget:t}})},e=>{r(e)})
})}makeObjectWidget(i,a){return e.try(()=>{
const e=new r.ShallowMerger({}).mergeIn(a).value()
;return e.widgetDef=i,e.initConfig=a,new t(e)})}makeKBWidget(t,r){
return e.try(()=>{var e={runtime:r.runtime,widget:{module:t.module,
jquery_object:t.config&&t.config.jqueryName||r.jqueryName,panel:t.panel,
title:t.title}};return new i(e)})}validateWidget(e,t){var i
;if("object"!=typeof e&&(i="Invalid widget after making: "+t),
i)throw console.error(i),console.error(e),new Error(i)}makeWidget(e,t){
const i=this.widgets[e];if(!i)throw new Error("Widget "+e+" not found");let r
;const a=Object.assign({},t,this.baseWidgetConfig);switch(t=t||{},i.type){
case"factory":r=this.makeFactoryWidget(i,a);break;case"es6":
r=this.makeES6Widget(i,a);break;case"object":r=this.makeObjectWidget(i,a);break
;case"kbwidget":r=this.makeKBWidget(i,a);break;default:
throw new Error("Unsupported widget type "+i.type)}
return r.then(t=>(this.validateWidget(t,e),t))}}}));