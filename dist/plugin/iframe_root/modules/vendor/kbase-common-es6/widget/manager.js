define(["bluebird","./adapters/objectWidget","./adapters/kbWidget","../merge"],(function(e,t,r,i){
"use strict";return{WidgetManager:class{constructor(e){
if(!e.baseWidgetConfig)throw new Error('WidgetManager requires a baseWidgetConfig argument; pass as "baseWidgetConfig"')
;this.baseWidgetConfig=e.baseWidgetConfig,this.widgets={}}addWidget(e){
if(e.id&&(e.name=e.id),
this.widgets[e.name])throw new Error("Widget "+e.name+" is already registered")
;this.widgets[e.name]=e}getWidget(e){return this.widgets[e]}
makeFactoryWidget(t,r){return new e((e,i)=>{var a=[t.module]
;t.css&&a.push("css!"+t.module+".css"),require(a,a=>{
if(void 0!==a)if(void 0!==a.make)try{e(a.make(r))}catch(d){i(d)
}else i('Factory widget does not have a "make" method: '+t.name+", "+t.module);else i({
message:"Factory widget maker is undefined for "+t.module,data:{widget:t}})
},e=>{i(e)})})}makeES6Widget(t,r){return new e((e,i)=>{var a=[t.module]
;t.css&&a.push("css!"+t.module+".css"),require(a,a=>{let d
;if(d=a.Widget?a.Widget:a,void 0!==d)try{e(new d(r))}catch(s){i(s)}else i({
message:"Widget class is undefined for "+t.module,data:{widget:t}})},e=>{i(e)})
})}makeKbWidget(t,a){return e.try(()=>{
const e=new i.ShallowMerger({}).mergeIn(a).value();return e.widget={
module:t.module,jquery_object:t.config&&t.config.jqueryName||a.jqueryName,
panel:a.panel,title:t.title},new r.KBWidgetAdapter(e)})}makeObjectWidget(r,a){
return e.try(()=>{const e=new i.ShallowMerger({}).mergeIn(a).value()
;return e.widgetDef=r,e.initConfig=a,new t.ObjectWidgetAdapter(e)})}
validateWidget(e,t){var r
;if("object"!=typeof e&&(r="Invalid widget after making: "+t),
r)throw console.error(r),console.error(e),new Error(r)}makeWidget(e,t){
const r=this.widgets[e];if(!r)throw new Error("Widget "+e+" not found");let a
;const d=new i.DeepMerger({}).mergeIn(t).value(),s=new i.DeepMerger(d).mergeIn(this.baseWidgetConfig).value()
;switch(t=t||{},r.type){case"factory":a=this.makeFactoryWidget(r,s);break
;case"es6":a=this.makeES6Widget(r,s);break;case"object":
a=this.makeObjectWidget(r,s);break;case"kbwidget":a=this.makeKbWidget(r,s);break
;default:throw new Error("Unsupported widget type "+r.type)}
return a.then(t=>(this.validateWidget(t,e),t))}}}}));