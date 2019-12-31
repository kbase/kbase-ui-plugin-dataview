define(["require","exports","./HttpClient","./Auth2Error"],(function(e,r,t,o){
"use strict";Object.defineProperty(r,"__esModule",{value:!0})
;class n extends t.HttpClient{constructor(){super()}isGeneralError(e){
return e instanceof t.GeneralError}request(e){
return super.request(e).catch(t.GeneralError,e=>{throw new o.AuthError({
code:"connection-error",message:e.message,
detail:"An error was encountered communicating with the Auth Service",data:{}})
}).catch(t.TimeoutError,e=>{throw new o.AuthError({code:"timeout-error",
message:e.message,
detail:"There was a timeout communicating with the Auth Service",data:{}})
}).catch(t.AbortError,e=>{throw new o.AuthError({code:"abort-error",
message:e.message,
detail:"The connection was aborted while communicating with the Auth Service",
data:{}})})}}r.AuthClient=n}));