define(["require","exports","./Cookie","./Auth2","./Auth2Error","./Utils","bluebird"],(function(e,t,s,i,n,o,r){
"use strict";var h;Object.defineProperty(t,"__esModule",{value:!0}),function(e){
e[e.New=1]="New",
e[e.Ok=2]="Ok",e[e.Stale=3]="Stale",e[e.Syncing=4]="Syncing",e[e.Error=5]="Error",
e[e.Interrupted=6]="Interrupted",e[e.None=7]="None"}(h||(h={}))
;t.Auth2Session=class{constructor(e){
this.cookieName=e.cookieName,this.extraCookies=e.extraCookies,
this.baseUrl=e.baseUrl,
this.cookieManager=new s.CookieManager,this.auth2Client=new i.Auth2(e),
this.serviceLoopActive=!1,
this.cookieMaxAge=3e5,this.changeListeners={},this.sessionCache={session:null,
fetchedAt:0,state:h.New}}getSession(){
return this.sessionCache.state===h.Ok?this.sessionCache.session:null}getToken(){
var e=this.getSession();return e?e.token:null}getUsername(){
var e=this.getSession();return e?e.tokenInfo.user:null}getEmail(){
var e=this.getSession();return e?e.me.email:null}getRealname(){
var e=this.getSession();return e?e.me.display:null}getRoles(){
var e=this.getSession();return e?e.me.roles:null}getCustomRoles(){
var e=this.getSession();return e?e.me.customroles:null}getKbaseSession(){
var e=this.getSession();if(!e)return null;let t=e.tokenInfo;return{un:t.user,
user_id:t.user,name:t.name,token:e.token,kbase_sessionid:null}}isAuthorized(){
return!!this.getSession()}isLoggedIn(){return this.isAuthorized()}getClient(){
return this.auth2Client}loginPick(e){
return this.auth2Client.loginPick(e).then(e=>(this.setSessionCookie(e.token.token,e.token.expires),
this.evaluateSession().then(()=>e)))}loginCreate(e){
return this.auth2Client.loginCreate(e)}initializeSession(e){
return this.setSessionCookie(e.token,e.expires),this.evaluateSession()}
loginUsernameSuggest(e){return this.auth2Client.loginUsernameSuggest(e)}
loginCancel(){return this.auth2Client.loginCancel()}linkCancel(){
return this.auth2Client.linkCancel()}getMe(){
return this.auth2Client.getMe(this.getToken())}putMe(e){
return this.auth2Client.putMe(this.getToken(),e)}getTokens(){
return this.auth2Client.getTokens(this.getToken())}createToken(e){
return this.auth2Client.createToken(this.getToken(),e)}getTokenInfo(){
return this.auth2Client.getTokenInfo(this.getToken())}getLoginCoice(){
return this.auth2Client.getLoginChoice()}loginStart(e){
this.auth2Client.loginStart(e)}linkStart(e){
return this.auth2Client.linkStart(this.getToken(),e)}removeLink(e){
return this.auth2Client.removeLink(this.getToken(),e)}getLinkChoice(e){
return this.auth2Client.getLinkChoice(this.getToken())}linkPick(e){
return this.auth2Client.linkPick(this.getToken(),e).then(e=>e)}logout(e){
return this.auth2Client.logout(this.getToken()).then(()=>(this.removeSessionCookie(),
this.evaluateSession()))}revokeToken(e){
return this.getTokenInfo().then(t=>this.auth2Client.revokeToken(this.getToken(),e))
}revokeAllTokens(){
return this.getTokenInfo().then(e=>this.auth2Client.revokeAllTokens(this.getToken()))
}onChange(e){let t=(new o.Utils).genId();return this.changeListeners[t]=e,t}
offChange(e){delete this.changeListeners[e]}notifyListeners(e){
null!==e&&Object.keys(this.changeListeners).forEach(t=>{
let s=this.changeListeners[t];try{s(e)}catch(i){
console.error("Error running change listener",t,i)}})}checkSession(){
let e=this.getAuthCookie();this.getSession();let t=(new Date).getTime()
;if(!e)return this.sessionCache.session?(this.sessionCache.session=null,
this.sessionCache.state=h.None,{status:"loggedout"
}):(this.sessionCache.state=h.None,{status:"nosession"})
;if(null===this.sessionCache.session)return{status:"newtoken",cookie:e}
;if(e!==this.sessionCache.session.token)return this.sessionCache.session=null,{
status:"newtoken",cookie:e};let s=this.sessionCache.session.tokenInfo.expires-t
;if(s<=0)return this.sessionCache.session=null,
this.sessionCache.state=h.None,this.removeSessionCookie(),{status:"loggedout"}
;if(this.sessionCache.state===h.Interrupted){
let s=t-this.sessionCache.interruptedAt,i=t-this.sessionCache.lastCheckedAt
;if(s<6e4){if(i>5e3)return{status:"interrupted-retry",cookie:e}
}else if(i>6e4)return{status:"interrupted-retry",cookie:e};return{status:"ok",
cookie:e}}
return t-this.sessionCache.fetchedAt>this.sessionCache.session.tokenInfo.cachefor?(this.sessionCache.state=h.Stale,
{status:"cacheexpired",cookie:e}):{status:"ok",cookie:e}}getAuthCookie(){var e
;if(1===(e=this.cookieManager.getItems(this.cookieName)).length)return e[0]
;if(0===e.length)return null
;if(2===e.length&&this.removeSessionCookie(),(e=this.cookieManager.getItems(this.cookieName)).length>0)throw new Error("Duplicate session cookie detected and cannot remove it. Please delete your browser cookies for this site.")
}evaluateSession(){return r.try(()=>{let e=this.checkSession();switch(e.status){
case"loggedout":return void this.notifyListeners("loggedout");case"ok":
case"nosession":return;case"interrupted-retry":case"newtoken":
case"cacheexpired":break;default:
throw new Error("Unexpected session state: "+e.status)}let t=e.cookie;var s,i
;return this.sessionCache.lastCheckedAt=(new Date).getTime(),
this.auth2Client.getTokenInfo(t).then(e=>(s=e,
this.auth2Client.getMe(t))).then(n=>{
switch(i=n,this.sessionCache.fetchedAt=(new Date).getTime(),
this.sessionCache.state=h.Ok,
this.sessionCache.interruptedAt=null,this.sessionCache.session={token:t,
tokenInfo:s,me:i},e.status){case"newtoken":this.notifyListeners("loggedin")
;break;case"interrupted-retry":this.notifyListeners("restored")}
}).catch(n.AuthError,t=>{switch(t.code){case"10020":
console.error("Invalid Session Cookie Detected",t),
this.removeSessionCookie(),this.notifyListeners("loggedout")
;case"connection-error":case"timeout-error":case"abort-error":
switch(this.sessionCache.state=h.Interrupted,
this.sessionCache.interruptedAt=(new Date).getTime(),
this.notifyListeners("interrupted"),e.status){case"cacheexpired":case"newtoken":
this.sessionCache.fetchedAt=(new Date).getTime(),
this.notifyListeners("interrupted");break;case"interrupted-retry":
this.notifyListeners("interrupted")}break;default:
console.error("Unhandled AUTH ERROR",t),
this.removeSessionCookie(),this.notifyListeners("loggedout")}}).catch(t=>{
console.error("ERROR",t,t instanceof n.AuthError),
this.session=null,this.removeSessionCookie(),
"newtoken"===e&&this.notifyListeners("loggedout")})})}serverTimeOffset(){
return this.now-this.root.servertime}start(){
return this.auth2Client.root().then(e=>(this.root=e,
this.now=(new Date).getTime(),r.try(()=>{let e=()=>{
this.serviceLoopActive&&(this.loopTimer=window.setTimeout(t,1e3))
},t=()=>this.evaluateSession().then(()=>{e()});return this.serviceLoopActive=!0,
t()})))}stop(){return r.try(()=>{
this.serviceLoopActive=!1,this.loopTimer&&(window.clearTimeout(this.loopTimer),
this.loopTimer=null)})}setSessionCookie(e,t){
let i=new s.Cookie(this.cookieName).setValue(e).setPath("/").setSecure(!0)
;i.setExpires(new Date(t).toUTCString()),this.cookieManager.setItem(i)
;let n=this;this.extraCookies&&this.extraCookies.forEach(i=>{
let o=new s.Cookie(i.name).setValue(e).setPath("/").setDomain(i.domain)
;o.setExpires(new Date(t).toUTCString()),n.cookieManager.setItem(o)})}
removeSessionCookie(){
this.cookieManager.removeItem(new s.Cookie(this.cookieName).setPath("/"))
;let e=window.location.hostname.split(".")
;for(var t,i=2;i<=e.length;i+=1)t=e.slice(-i).join("."),
this.cookieManager.removeItem(new s.Cookie(this.cookieName).setPath("/").setDomain(t))
;this.extraCookies&&this.extraCookies.forEach(e=>{
this.cookieManager.removeItem(new s.Cookie(e.name).setPath("/").setDomain(e.domain))
})}userSearch(e){return this.auth2Client.userSearch(this.getToken(),e)}
adminUserSearch(e){return this.auth2Client.adminUserSearch(this.getToken(),e)}
getAdminUser(e){return this.auth2Client.getAdminUser(this.getToken(),e)}}}));