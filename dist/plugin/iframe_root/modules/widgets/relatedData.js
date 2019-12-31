define(["kb_common/html","collapsiblePanel","kb_lib/jsonRpc/dynamicServiceClient"],(function(e,t,i){
"use strict";const n=(0,e.tag)("iframe");class o{constructor({runtime:e}){
this.runtime=e,
this.hostNode=null,this.container=null,this.authToken=e.service("session").getAuthToken(),
this.relationEngineURL=e.config("services.RelationEngine.url"),
this.narrURL=e.config("services.narrative.url"),window.sketchService=new i({
module:"sketch_service",url:e.config("services.service_wizard.url")})}
dataLayout(){return n({
src:"https://kbaseincubator.github.io/object_relations_ui/",width:"100%",
height:"600px",style:{border:"none"}})}attach(e){
this.hostNode=e,this.container=e.appendChild(document.createElement("div"))}
start({workspaceId:e,objectId:n,objectVersion:o,objectInfo:s}){
const r=[e,n,o||"1"].join(":");this.container.innerHTML=t({title:"Similar Data",
content:this.dataLayout({upa:r}),icon:"copy",collapsed:!0})
;const c=this.container.querySelector("iframe"),a={upa:r,
authToken:this.authToken,rootURL:this.narrURL,kbaseEndpoint:this.kbaseEndpoint,
relEngURL:this.relationEngineURL},h=new i({module:"sketch_service",
url:this.runtime.config("services.service_wizard.url")})
;c.addEventListener("load",()=>{h.lookupModule().then(e=>{
a.sketchURL=e[0].url,c.contentWindow.postMessage(JSON.stringify({
method:"setConfig",params:{config:a}}),"*")})})}stop(){}detach(){
this.hostNode&&this.container&&this.hostNode.removeChild(this.container)}}
return{make:function(e){return new o(e)}}}));