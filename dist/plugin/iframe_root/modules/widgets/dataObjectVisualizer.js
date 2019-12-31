define(["bluebird","underscore","kb_lib/jsonRpc/genericClient","kb_lib/html","kb_lib/htmlBuilders","kb_lib/htmlBootstrapBuilders","kb_service/utils"],(function(e,t,r,n,o,i,u){
"use strict";var c=(0,n.tag)("div");function a(t){var o,a,s,f,d=t.runtime
;function l(e){
return[e.workspaceId,e.objectId,e.objectVersion].filter((function(e){
if(e)return!0})).join("/")}function b(t){return e.try((function(){
const e=new r({module:"Workspace",url:d.getConfig("services.workspace.url"),
token:d.getService("session").getAuthToken()}),n=[{ref:l(t)}]
;return e.callFunc("get_object_info3",[{objects:n,ignoreErrors:1,
includeMetadata:1}]).spread((function(e){const r=e.infos
;if(r.length>1)throw new Error("Too many ("+r.length+") objects found.")
;if(null===r[0])throw new Error("Object not found")
;var n=u.objectInfoToObject(r[0]),o=u.parseTypeId(n.type),i=function(e,t){
var r=d.getService("type").getViewer({type:e,id:t.viewer});if(r){
if(t.sub&&t.subid){var n=t.sub.toLowerCase()
;if(!r.sub)throw new Error("Sub was specified, but config has no sub handler, sub:"+n)
;if(!r.sub.hasOwnProperty(n))throw new Error("Sub was specified, but config has no correct sub handler, sub:"+n+"config:")
;r=r.sub[n]}}else r={title:"Generic Object View",widget:{
name:"kb_dataview_genericObject"},panel:!0,options:[]};return r}(o,t)
;if(!i)throw new Error("Sorry, cannot find widget for "+o.module+"."+o.name)
;var c={workspaceId:n.wsid,objectId:n.id,objectName:n.name,workspaceName:n.ws,
objectVersion:n.version,objectType:n.type,type:n.type}
;return t.sub&&(c[t.sub.toLowerCase()+"ID"]=t.subid),
i.options&&i.options.forEach((function(e){var t=c[e.from]
;if(!t&&!0!==e.optional)throw"Missing param, from "+e.from+", to "+e.to
;c[e.to]=t
})),d.service("widget").makeWidget(i.widget.name,i.widget.config).then((function(e){
return{widget:e,params:c,mapping:i}}))}))}))}return{attach:function(t){
return e.try((function(){o=t,a=document.createElement("div"),o.appendChild(a)}))
},start:function(e){var r;return b(e).then((function(e){
if(s=e.widget,r=e.params,e.mapping.panel){
var o=a.appendChild(document.createElement("div")),u=n.genId()
;o.innerHTML=i.buildPanel({name:"data-view",type:"default",
title:e.mapping.title||"Data View",body:c({id:u})}),f=document.getElementById(u)
}else f=a;return s.init?s.init(t):null})).then((function(){return s.attach(f)
})).then((function(){return s.start(r)})).catch((function(e){throw function(e){
var t
;console.error(e),t="string"==typeof e?e:e.message?e.message:e.error&&e.error.error?e.error.error.message:"Unknown Error",
a.innerHTML=i.buildPanel({title:"Error",body:t,type:"danger"})}(e),e}))},
run:function(t){return e.try((function(){if(s&&s.run)return s.run(t)}))},
stop:function(){return e.try((function(){if(s&&s.stop)return s.stop()}))},
detach:function(){return e.try((function(){if(s&&s.detach)return s.detach()}))},
destroy:function(){return e.try((function(){if(s&&s.detach)return s.detach()}))}
}}return{make:function(e){return a(e)}}}));