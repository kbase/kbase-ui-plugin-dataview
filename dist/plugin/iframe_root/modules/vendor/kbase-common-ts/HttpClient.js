define(["require","exports","./HttpUtils","bluebird"],(function(e,t,r,s){
"use strict";Object.defineProperty(t,"__esModule",{value:!0}),s.config({
cancellation:!0});class o{static fromXHR(e){let t=e.getAllResponseHeaders()
;if(!t)return{};let r=t.split(/\n/);var s={};return r.forEach(e=>{
let t=e.indexOf(":",0),r=e.substr(0,t).trim(),o=e.substr(t+1).trim()
;s[r.toLowerCase()]=o}),s}static fromMap(e){var t={}
;return Object.keys(e).forEach(r=>{t[r.toLowerCase()]=e[r]}),t}constructor(e){
void 0===e?this.header={}:e instanceof XMLHttpRequest?this.header=o.fromXHR(e):this.header=o.fromMap(e)
}getHeader(e){return this.header[e.toLowerCase()]}setHeader(e,t){
this.header[e.toLowerCase()]=t}exportHeader(e){
Object.keys(this.header).filter(e=>void 0!==this.getHeader(e)&&null!==this.getHeader(e)).forEach(t=>{
var r=function(e){switch(typeof e){case"string":return e;case"number":
case"boolean":return String(e);default:
throw new Error("Invalid type for header value: "+typeof e)}}(this.getHeader(t))
;e.setRequestHeader(t,r)})}getContentType(){let e=this.header["content-type"]
;if(!e)return{mediaType:null,charset:null};let t=e.split(";").map(e=>e.trim())
;return{mediaType:t[0],charset:t[1]||null}}}t.HttpHeader=o
;class a extends Error{constructor(e,t,r,s){
super(r),Object.setPrototypeOf(this,a.prototype),
this.name="TimeoutError",this.stack=(new Error).stack,
this.timeout=e,this.elapsed=t,this.xhr=s}toString(){
if(this.message)return this.message}}t.TimeoutError=a;class n extends Error{
constructor(e,t){
super(e),Object.setPrototypeOf(this,n.prototype),this.name="GeneralError",
this.stack=(new Error).stack,this.xhr=t}toString(){return this.message}}
t.GeneralError=n;class i extends Error{constructor(e,t){
super(e),Object.setPrototypeOf(this,i.prototype),
this.name="AbortError",this.stack=(new Error).stack,this.xhr=t}toString(){
return this.message}}t.AbortError=i;t.HttpClient=class{constructor(){}
request(e){let t=(new Date).getTime();return new s((s,u,d)=>{
const h=new XMLHttpRequest;h.onload=()=>{s({status:h.status,response:h.response,
responseType:h.responseType,header:new o(h)})},h.ontimeout=()=>{
var r=(new Date).getTime()-t;u(new a(e.timeout,r,"Request timeout",h))
},h.onerror=()=>{u(new n("General request error "+e.url,h))},h.onabort=()=>{
u(new i("Request was aborted",h))};var c=e.url
;e.query&&(c+="?"+new r.HttpQuery(e.query).toString())
;const p=e.responseType||"text";h.responseType=p;try{h.open(e.method,c,!0)
}catch(l){return void u(new n("Error opening request "+l.name,h))}
e.timeout&&(h.timeout=e.timeout),h.withCredentials=e.withCredentials||!1;try{
e.header&&e.header.exportHeader(h)}catch(l){
u(new n("Error applying header before send "+l.name,h))}try{
"string"==typeof e.data?(h.send(e.data),d&&d(()=>{h.abort()
})):e.data instanceof Array?h.send(new Uint8Array(e.data)):void 0===e.data?h.send():null===e.data?h.send():u(new Error("Invalid type of data to send: "+typeof e.data))
}catch(l){u(new n("Error sending data in request",h))}})}}}));