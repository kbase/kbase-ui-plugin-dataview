define(["kb_lib/jsonRpc/dynamicServiceClient","kb_lib/jsonRpc/genericClient","kb_lib/jsonRpc/exceptions"],(function(e,r,t){
"use strict";class n extends Error{constructor(e,r,t,n,i){
super(t),this.source=e,
this.code=r,this.message=t,this.detail=n,this.info=i,this.stack=(new Error).stack
}}return{RPC:class{constructor(e){this.runtime=e.runtime,this.RPCError=n}
call(i,o,s){
const c=this.runtime.config(["services",i,"url"].join(".")),u=this.runtime.service("session").getAuthToken()
;let l;l=c?new r({module:i,url:c,token:u}):new e({
url:this.runtime.config("services.service_wizard.url"),token:u,module:i})
;const a=s||[];return l.callFunc(o,a).catch(e=>{
if(e instanceof t.AjaxError)throw new n("AJAX Error: "+e.name,e.code,e.message,null,{
originalError:e});if(e instanceof n){
const r="An error was encountered running an rpc method",t='The module is "'+e.module+'", the method "'+e.func+'", the error returned from the service is "'+(e.message||"unknown")+'"'
;throw new n("service-call-error",e.name,r,t,{originalError:e})}
throw new n("rpc-call",e.name,e.message,null,{originalError:e})})}},
RPCClient:class{constructor({runtime:e,module:r,timeout:t,authenticated:i}){
this.runtime=e,
this.moduleName=r,this.timeout=t||6e4,this.RPCError=n,this.authenticated=i,
this.setup()}setup(){
const t=this.runtime.config(["services",this.moduleName,"url"].join("."));let n
;n=this.authenticated?this.runtime.service("session").getAuthToken():null,
this.client=t?new r({module:this.moduleName,url:t,token:n,timeout:this.timeout
}):new e({url:this.runtime.config("services.service_wizard.url"),token:n,
module:this.moduleName,timeout:this.timeout})}callFunc(e,r){const i=r||[]
;return this.client.callFunc(e,i).catch(e=>{
if(e instanceof t.AjaxError)throw console.error("AJAX Error",e),
new n("AJAX Error: "+e.name,e.code,e.message,null,{originalError:e})
;if(e instanceof n){console.error("RPC Error",e)
;const r="An error was encountered running an rpc method",t='The module is "'+e.module+'", the method "'+e.func+'", the error returned from the service is "'+(e.message||"unknown")+'"'
;throw new n("service-call-error",e.name,r,t,{originalError:e})}
throw new n("rpc-call",e.name,e.message,null,{originalError:e})})}}}}));