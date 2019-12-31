define(["bluebird","../widget/manager","../widget/widgetSet"],(function(e,t,r){
"use strict";function i(e,t,r){if(!e[t])throw{name:"UndefinedMethod",
message:'The requested method "'+t+'" does not exist on this object',
suggestion:"This is a developer problem, not your fault"};return e[t].apply(e,r)
}return class{constructor({runtime:e}){
if(!e)throw new Error('WidgetService start requires a runtime object; provide as "runtime"')
;this.widgetManager=new t({baseWidgetConfig:{runtime:e}})}start(){return!0}
stop(){return!0}pluginHandler(t,r){return e.try(()=>{t.forEach(e=>{
r.usingSourceModules||e.module.match(/^plugins\//)||(e.module=[r.moduleRoot,e.module].join("/")),
this.widgetManager.addWidget(e)})})}getWidget(){
return i(this.widgetManager,"getWidget",arguments)}makeWidget(){
return i(this.widgetManager,"makeWidget",arguments)}getWidgetManager(){
return this.widgetManager}newWidgetSet(){return new r({runtime:this.runtime,
widgetManager:this.widgetManager})}}}));