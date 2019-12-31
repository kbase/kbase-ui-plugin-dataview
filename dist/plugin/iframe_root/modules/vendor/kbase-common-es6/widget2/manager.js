define(["bluebird","./adapters/objectWidget","kb_lib/merge"],(function(e,t,i){
"use strict";return{WidgetManager:class{constructor(e){
if(!e.baseWidgetConfig)throw new Error('WidgetManager requires a baseWidgetConfig argument; pass as "baseWidgetConfig"')
;this.baseWidgetConfig=e.baseWidgetConfig,this.widgets={}}addWidget(e){
if(e.id&&(e.name=e.id),
this.widgets[e.name])throw new Error("Widget "+e.name+" is already registered")
;this.widgets[e.name]=e}getWidget(e){return this.widgets[e]}
makeFactoryWidget(t,i){return new e((e,r)=>{var a=[t.module]
;t.css&&a.push("css!"+t.module+".css"),require(a,a=>{
if(void 0!==a)if(void 0!==a.make)try{e(a.make(i))}catch(d){r(d)
}else r('Factory widget does not have a "make" method: '+t.name+", "+t.module);else r({
message:"Factory widget maker is undefined for "+t.module,data:{widget:t}})
},e=>{r(e)})})}makeES6Widget(t,i){return new e((e,r)=>{var a=[t.module]
;t.css&&a.push("css!"+t.module+".css"),require(a,a=>{let d
;if(d=a.Widget?a.Widget:a,void 0!==d)try{e(new d(i))}catch(s){r(s)}else r({
message:"Widget class is undefined for "+t.module,data:{widget:t}})},e=>{r(e)})
})}makeObjectWidget(r,a){return e.try(()=>{
const e=new i.ShallowMerger({}).mergeIn(a).value()
;return e.widgetDef=r,e.initConfig=a,new t.ObjectWidgetAdapter(e)})}
validateWidget(e,t){var i
;if("object"!=typeof e&&(i="Invalid widget after making: "+t),
i)throw console.error(i),console.error(e),new Error(i)}makeWidget(e,t){
const r=this.widgets[e];if(!r)throw new Error("Widget "+e+" not found");let a
;const d=new i.DeepMerger({}).mergeIn(t).value(),s=new i.DeepMerger(d).mergeIn(this.baseWidgetConfig).value()
;switch(t=t||{},r.type){case"factory":a=this.makeFactoryWidget(r,s);break
;case"es6":a=this.makeES6Widget(r,s);break;case"object":
a=this.makeObjectWidget(r,s);break;default:
throw new Error("Unsupported widget type "+r.type)}
return a.then(t=>(this.validateWidget(t,e),t))}}}}));