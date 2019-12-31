define(["require","exports","./Html","./HttpUtils","./HttpClient","./Auth2Client","./Auth2Error"],(function(e,t,r,n,i,a,s){
"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o={root:"",
tokenInfo:"api/V2/token",apiMe:"api/V2/me",me:"me",loginStart:"login/start",
logout:"logout",loginChoice:"login/choice",loginCreate:"login/create",
loginUsernameSuggest:"login/suggestname",loginPick:"login/pick",
loginCancel:"login/cancel",linkStart:"link/start",linkCancel:"link/cancel",
linkChoice:"link/choice",linkPick:"link/pick",linkRemove:"me/unlink",
tokens:"tokens",tokensRevoke:"tokens/revoke",tokensRevokeAll:"tokens/revokeall",
userSearch:"api/V2/users/search",adminUserSearch:"api/V2/admin/search",
adminUser:"api/V2/admin/user"};t.Auth2=class{constructor(e){this.config=e}
getProviders(){return[{id:"Globus",label:"Globus",
logoutUrl:"https://www.globus.org/app/logout"},{id:"Google",label:"Google",
logoutUrl:"https://accounts.google.com/Logout"}]}getProvider(e){
return this.getProviders().filter(t=>t.id===e)[0]}root(){
return(new a.AuthClient).request({method:"GET",withCredentials:!0,
header:new i.HttpHeader({Accept:"application/json"}),url:this.makePath([o.root])
}).then(e=>this.processResult(e,200))}loginStart(e){JSON.stringify(e.state)
;let t=new r.Html,i=t.tagMaker(),a=i("form"),s=i("input"),l=(i("button"),
new n.HttpQuery({state:JSON.stringify(e.state)}).toString())
;var h=document.location.origin+"?"+l;let u={provider:e.provider,redirecturl:h,
stayloggedin:e.stayLoggedIn?"true":"false"},d=t.genId(),c=a({method:"post",id:d,
action:this.makePath(o.loginStart),style:{display:"hidden"}},[s({type:"hidden",
name:"provider",value:u.provider},[]),s({type:"hidden",name:"redirecturl",
value:u.redirecturl},[])]);var p=document.createElement("div")
;p.innerHTML=c,document.body.appendChild(p),document.getElementById(d).submit()}
linkStart(e,t){let n=new r.Html,i=n.tagMaker(),a=i("form"),s=i("input"),l={
provider:t.provider},h=n.genId(),u=a({method:"POST",id:h,
action:[this.config.baseUrl,o.linkStart].join("/"),style:{display:"hidden"}
},[s({type:"hidden",name:"provider",value:l.provider},[]),s({type:"hidden",
name:"token",value:e})]);t.node.innerHTML=u,document.getElementById(h).submit()}
decodeError(e){try{return JSON.parse(e.response)}catch(t){
throw console.error(t),new s.AuthError({code:"decode-error",
message:"Error decoding JSON error response",detail:t.message})}}
removeLink(e,t){return(new a.AuthClient).request({method:"POST",
withCredentials:!0,header:new i.HttpHeader({authorization:e,
"content-type":"application/json",accept:"application/json"}),
url:this.makePath([o.linkRemove,t.identityId])
}).then(e=>this.processResult(e,204))}logout(e){
return(new a.AuthClient).request({method:"POST",withCredentials:!0,
header:new i.HttpHeader({authorization:e,"content-type":"application/json",
accept:"application/json"}),url:this.makePath(o.logout)
}).then(e=>this.processResult(e,200))}revokeToken(e,t){
return(new a.AuthClient).request({method:"DELETE",withCredentials:!0,
header:new i.HttpHeader({authorization:e,"content-type":"application/json"}),
url:this.makePath([o.tokensRevoke,t])}).then(e=>this.processResult(e,204))}
revokeAllTokens(e){return(new a.AuthClient).request({method:"DELETE",
withCredentials:!0,header:new i.HttpHeader({authorization:e,
"content-type":"application/json"}),url:this.makePath(o.tokensRevokeAll)
}).then(e=>this.processResult(e,204))}getTokenInfo(e){
return(new a.AuthClient).request({method:"GET",url:this.makePath([o.tokenInfo]),
withCredentials:!0,header:new i.HttpHeader({authorization:e})
}).then(e=>this.processResult(e,200))}getMe(e){
return(new a.AuthClient).request({method:"GET",withCredentials:!0,
url:this.makePath(o.apiMe),header:new i.HttpHeader({authorization:e,
accept:"application/json"})}).then(e=>this.processResult(e,200))}putMe(e,t){
return(new a.AuthClient).request({method:"PUT",withCredentials:!0,
url:this.makePath(o.me),header:new i.HttpHeader({authorization:e,
accept:"application/json","content-type":"application/json"}),
data:JSON.stringify(t)}).then(e=>{this.processResult(e,204)})}makePath(e){
return"string"==typeof e?[this.config.baseUrl].concat([e]).join("/"):[this.config.baseUrl].concat(e).join("/")
}getTokens(e){return(new a.AuthClient).request({method:"GET",withCredentials:!0,
url:this.makePath([o.tokens]),header:new i.HttpHeader({authorization:e,
accept:"application/json"})}).then(e=>this.processResult(e,200))}
createToken(e,t){return(new a.AuthClient).request({method:"POST",
withCredentials:!0,url:this.makePath(o.tokens),header:new i.HttpHeader({
authorization:e,accept:"application/json","content-type":"application/json"}),
data:JSON.stringify(t)}).then(e=>this.processResult(e,200))}getLoginChoice(){
return(new a.AuthClient).request({method:"GET",withCredentials:!0,
url:this.makePath(o.loginChoice),header:new i.HttpHeader({
accept:"application/json"})}).then(e=>this.processResult(e,200))}loginCancel(){
return(new a.AuthClient).request({method:"DELETE",withCredentials:!0,
url:this.makePath(o.loginCancel),header:new i.HttpHeader({
accept:"application/json"})}).then(e=>this.processResult(e,204))}linkCancel(){
return(new a.AuthClient).request({method:"DELETE",withCredentials:!0,
url:this.makePath(o.linkCancel),header:new i.HttpHeader({
accept:"application/json"})}).then(e=>this.processResult(e,204))}loginPick(e){
let t={id:e.identityId,linkall:e.linkAll,
policyids:e.agreements.map(e=>[e.id,e.version].join("."))}
;return(new a.AuthClient).request({method:"POST",withCredentials:!0,
url:this.makePath([o.loginPick]),data:JSON.stringify(t),
header:new i.HttpHeader({"content-type":"application/json",
accept:"application/json"})}).then(e=>this.processResult(e,200))}loginCreate(e){
return(new a.AuthClient).request({method:"POST",withCredentials:!0,
url:this.makePath(o.loginCreate),data:JSON.stringify(e),
header:new i.HttpHeader({"content-type":"application/json",
accept:"application/json"})}).then(e=>this.processResult(e,201))}
loginUsernameSuggest(e){return(new a.AuthClient).request({method:"GET",
withCredentials:!0,url:this.makePath([o.loginUsernameSuggest,e]),
header:new i.HttpHeader({accept:"application/json"})
}).then(e=>this.processResult(e,200))}getLinkChoice(e){
return(new a.AuthClient).request({method:"GET",withCredentials:!0,
url:this.makePath(o.linkChoice),header:new i.HttpHeader({
accept:"application/json",authorization:e})
}).then(e=>this.processResult(e,200)).then(e=>e.haslinks?{id:e.idents[0].id,
expires:e.expires,cancelurl:e.cancelurl,pickurl:e.pickurl,canlink:!0,
provider:e.provider,provusername:e.idents[0].provusername,linkeduser:null,
user:e.user}:{id:e.linked[0].id,expires:e.expires,cancelurl:e.cancelurl,
pickurl:e.pickurl,canlink:!1,provider:e.provider,
provusername:e.linked[0].provusername,linkeduser:e.linked[0].user,user:e.user})}
linkPick(e,t){let r={id:t};return(new a.AuthClient).request({method:"POST",
withCredentials:!0,url:this.makePath(o.linkPick),data:JSON.stringify(r),
header:new i.HttpHeader({authorization:e,"content-type":"application/json",
accept:"application/json"})}).then(e=>this.processResult(e,204))}
processResult(e,t){if(!(e.status>=200&&e.status<300)){var r,n,i=e.response;try{
switch(e.header.getContentType().mediaType){case"application/json":
r=JSON.parse(i);break;default:n=502===e.status?{code:"proxy-error",
status:e.status,
message:"The auth service could not be contacted due to a proxy error (502)",
detail:"An error returned by the proxy service indicates that the auth service is not operating corectly",
data:{text:e.response}}:{code:"invalid-content-type",status:e.status,
message:"An invalid content type was returned",
detail:"An invalid content was returned",data:{text:e.response,
contentType:e.header.getContentType().mediaType,status:e.status}}}}catch(a){
throw new s.AuthError({code:"decoding-error",status:e.status,
message:"Error decoding error message",detail:"Original error code: "+e.status,
data:{text:i}})}if(r){let t=r.error.code||r.error.appcode||r.error.httpcode||0
;throw new s.AuthError({code:String(t),status:e.status,
message:r.error.message||r.error.apperror,data:r})}throw new s.AuthError(n)}
if(t!==e.status)throw new s.AuthError({code:"unexpected-response-code",
message:"Unexpected response code; expected "+String(t)+", received "+String(e.status)
});if(200!==e.status&&201!==e.status){if(204===e.status)return null
;throw new s.AuthError({code:"unexpected-response-code",
message:"Unexpected response code; expected "+String(t)+", received "+String(e.status)
})}switch(e.header.getContentType().mediaType){case"application/json":
return JSON.parse(e.response);case"text/plain":return e.response}}
userSearch(e,t){
let r=new a.AuthClient,s=this.makePath([o.userSearch,t.prefix])+"?"+new n.HttpQuery({
fields:t.fields}).toString();return r.request({method:"GET",withCredentials:!0,
url:s,header:new i.HttpHeader({authorization:e,accept:"application/json"})
}).then(e=>this.processResult(e,200))}adminUserSearch(e,t){
let r=new a.AuthClient,s=new n.HttpQuery({fields:t.fields
}).toString(),l=this.makePath([o.adminUserSearch,t.prefix])+"?"+s
;return r.request({method:"GET",withCredentials:!0,url:l,
header:new i.HttpHeader({authorization:e,accept:"application/json"})
}).then(e=>this.processResult(e,200))}getAdminUser(e,t){
return(new a.AuthClient).request({method:"GET",withCredentials:!0,
url:this.makePath([o.adminUser,t]),header:new i.HttpHeader({authorization:e,
accept:"application/json"})}).then(e=>this.processResult(e,200))}}}));