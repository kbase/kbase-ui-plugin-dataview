define(["require","exports","./HttpClient"],(function(e,t,r){"use strict"
;Object.defineProperty(t,"__esModule",{value:!0});class o extends Error{
constructor(e){
super(e.message),Object.setPrototypeOf(this,o.prototype),this.name="JsonRpcError",
this.code=e.code,
this.message=e.message,this.detail=e.detail,this.data=e.data,this.stack=(new Error).stack
}}t.KBaseJsonRpcError=o;t.KBaseJsonRpcClient=class{constructor(){}
isGeneralError(e){return e instanceof r.GeneralError}request(e){let t={
version:"1.1",method:e.module+"."+e.func,id:String(Math.random()).slice(2),
params:e.params};e.rpcContext&&(t.context=e.rpcContext);let s=new r.HttpHeader
;e.authorization&&s.setHeader("authorization",e.authorization);let a={
method:"POST",url:e.url,timeout:e.timeout,data:JSON.stringify(t),header:s}
;return(new r.HttpClient).request(a).then((function(e){try{
return JSON.parse(e.response)}catch(t){throw new o({code:"parse-error",
message:t.message,detail:"The response from the service could not be parsed",
data:{responseText:e.response}})}})).catch(r.GeneralError,e=>{throw new o({
code:"connection-error",message:e.message,
detail:"An error was encountered communicating with the service",data:{}})
}).catch(r.TimeoutError,e=>{throw new o({code:"timeout-error",message:e.message,
detail:"There was a timeout communicating with the service",data:{}})
}).catch(r.AbortError,e=>{throw new o({code:"abort-error",message:e.message,
detail:"The connection was aborted while communicating with the s ervice",
data:{}})})}}}));