define(["bluebird","../typeManager"],(e,r)=>{"use strict";return class{
constructor({runtime:e,config:t}){this.runtime=e,this.typeManager=r.make({
runtime:e,typeDefs:{}}),this.pluginHandler(t)}start(){return e.try(()=>{
var e=this.typeManager.checkViewers(),r=[];if(e.length>0&&(e.forEach(e=>{
switch(e.severity){case"warning":console.warn(e.message,e);break;case"error":
console.error(e.message,e),r.push(e.message);break;default:
console.error(e.message,e)}
}),r.length>0))throw new Error("Error starting Type Manager. Check the log for details. "+r.join("; "))
;return!0})}stop(){return e.try(()=>!0)}pluginHandler(r){r&&r.map(r=>{
var t=r.type,a=r.viewers,s=r.icon
;s&&this.typeManager.setIcon(t,s),a&&a.map(r=>e.try(()=>{
this.typeManager.addViewer(t,r)}))})}proxyMethod(e,r,t){if(!e[r])throw{
name:"UndefinedMethod",
message:'The requested method "'+r+'" does not exist on this object',
suggestion:"This is a developer problem, not your fault"};return e[r].apply(e,t)
}getViewer(){return this.proxyMethod(this.typeManager,"getViewer",arguments)}
parseTypeId(){return this.proxyMethod(this.typeManager,"parseTypeId",arguments)}
getIcon(){return this.proxyMethod(this.typeManager,"getIcon",arguments)}
getColor(){return this.proxyMethod(this.typeManager,"getColor",arguments)}
makeVersion(){return this.proxyMethod(this.typeManager,"makeVersion",arguments)}
makeTypeId(){return this.proxyMethod(this.typeManager,"makeTypeId",arguments)}
makeType(){return this.proxyMethod(this.typeManager,"makeType",arguments)}
hasType(){return this.proxyMethod(this.typeManager,"hasType",arguments)}}});