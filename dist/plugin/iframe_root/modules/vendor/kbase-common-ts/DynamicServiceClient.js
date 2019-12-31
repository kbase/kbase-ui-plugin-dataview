var __extends=this&&this.__extends||function(){var t=Object.setPrototypeOf||{
__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){
for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])};return function(e,r){
function o(){this.constructor=e}
t(e,r),e.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}()
;define(["require","exports","./HttpClient","./Auth2Error"],(function(t,e,r,o){
"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(t){
function e(){return t.call(this)||this}
return __extends(e,t),e.prototype.isGeneralError=function(t){
return t instanceof r.GeneralError},e.prototype.request=function(e){
return t.prototype.request.call(this,e).catch(r.GeneralError,(function(t){
throw new o.AuthError({code:"connection-error",message:t.message,
detail:"An error was encountered communicating with the Auth Service",data:{}})
})).catch(r.TimeoutError,(function(t){throw new o.AuthError({
code:"timeout-error",message:t.message,
detail:"There was a timeout communicating with the Auth Service",data:{}})
})).catch(r.AbortError,(function(t){throw new o.AuthError({code:"abort-error",
message:t.message,
detail:"The connection was aborted while communicating with the Auth Service",
data:{}})}))},e}(r.HttpClient);e.AuthClient=n}));