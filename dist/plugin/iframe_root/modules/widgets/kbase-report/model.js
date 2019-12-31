define(["bluebird","kb_lib/jsonRpc/genericClient","kb_service/utils"],(function(e,t,r){
"use strict";function i(e){if("string"==typeof e){var t={"&":"&amp;","<":"&lt;",
">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"}
;return String(e).replace(/[&<>"'`=/]/g,e=>t[e])}}return class{constructor(e){
this.runtime=e.runtime,
this.workspaceId=e.workspaceId,this.objectId=e.objectId,this.objectVersion=e.objectVersion
}getCreatedObjects(){return e.try(()=>{const e=this.report.objects_created||[]
;if(0===e.length)return null;const i=new t({module:"Workspace",
url:this.runtime.config("services.Workspace.url"),
token:this.runtime.service("session").getAuthToken()}),s=e.map(e=>({ref:e.ref}))
;return i.callFunc("get_object_info3",[{objects:s,includeMetadata:0
}]).spread(t=>t.infos.map((t,i)=>{
const s=r.objectInfoToObject(t),n=this.runtime.service("type").parseTypeId(s.type),o=this.runtime.service("type").getIcon({
type:n});return{ref:s.ref,name:s.name,type:s.typeName,fullType:s.type,
description:e[i].description||"",icon:o}}))})}getLinks(){
const e=[this.workspaceId,this.objectId,this.objectVersion].join("/")
;return new t({module:"ServiceWizard",
url:this.runtime.config("services.ServiceWizard.url"),
token:this.runtime.service("session").getAuthToken()
}).callFunc("get_service_status",[{module_name:"HTMLFileSetServ",version:null
}]).spread(t=>{var r=t.url
;return this.report.html_links&&this.report.html_links.length?this.report.html_links.map((t,s)=>({
name:t.name,label:i(t.label||t.name),
url:[r,"api","v1",e,"$",s,t.name].join("/"),description:t.description})):[]})}
fetchReport(){return new t({module:"Workspace",
url:this.runtime.config("services.workspace.url"),
token:this.runtime.service("session").getAuthToken()
}).callFunc("get_objects",[[{wsid:this.workspaceId,objid:this.objectId,
ver:this.objectVersion}]]).spread(e=>{if(!e[0])throw new Error("Not found")
;return this.report=e[0].data,this.report})}}}));