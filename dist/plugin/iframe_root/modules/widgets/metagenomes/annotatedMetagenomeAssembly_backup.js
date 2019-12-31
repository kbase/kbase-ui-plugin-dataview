define(["kb_lib/jsonRpc/genericClient","kb_lib/jsonRpc/dynamicServiceClient","preact","bootstrap"],(e,t,r)=>{
"use strict";const{h:n,Component:s,render:i}=r;class o extends s{render(e){
return n("table",{className:"table table-bordered",style:{width:"auto"}
},[n("tbody",null,[n("tr",null,n("th",null,"Workspace ID"),n("td",null,e.wsid)),n("tr",null,n("th",null,"Object ID"),n("td",null,e.objid)),n("tr",null,n("th",null,"Version"),n("td",null,e.version))])])
}}class a extends s{render(e){
return e.narratorials.map(({title:e,workspaceId:t,titleFromWorkspace:r})=>{
return n("div",null,[n("a",{href:`/narrative/${t}`,target:"_blank"
},e," (",e===r?"✅":"❌",")")])})}}function l(e){const[t,r,n,s,i,o,a,l,c,u,d]=e
;return{objid:t,name:r,type:n,save_date:s,version:i,saved_by:o,wsid:a,
workspace:l,chsum:c,size:u,meta:d}}return class{constructor({runtime:e}){
this.runtime=e,this.hostNode=null,this.container=null}attach(e){this.hostNode=e,
this.container=e.appendChild(document.createElement("div"))}
getObjectInfo(t,r,n){return new e({module:"Workspace",
url:this.runtime.config("services.Workspace.url"),
token:this.runtime.service("session").getAuthToken()
}).callFunc("get_object_info3",[{objects:[{ref:[t,r,n].join("/")}]
}]).then(([{infos:[e]}])=>l(e))}getNarratorials(){return new t({
module:"NarrativeService",url:this.runtime.config("services.ServiceWizard.url"),
token:this.runtime.service("session").getAuthToken()
}).callFunc("list_narratorials",[{}]).then(([{narratorials:e}])=>e.map(({ws:e,nar:t})=>{
const r=l(t),n=function(e){const[t,r,n,s,i,o,a,l,c]=e;return{id:t,workspace:r,
owner:n,moddate:s,max_objid:i,user_permission:o,globalread:a,lockstat:l,
metadata:c}}(e);return{title:r.meta.name,
titleFromWorkspace:n.metadata.narrative_nice_name,workspaceId:r.wsid,
objectId:r.objid,objectVersion:r.version}}))}
start({workspaceId:e,objectId:t,objectVersion:r}){
return Promise.all([this.getObjectInfo(e,t,r),this.getNarratorials()]).then(([e,t])=>{
const r=n("div",null,[n("h3",null,"Object Info"),n("div",null,n(o,e,null)),n("h3",null,"Narratorials"),n("div",null,n(a,{
narratorials:t},null))]);i(r,this.container)})}stop(){}detach(){
this.hostNode&&this.container&&this.hostNode.removeChild(this.container)}}});