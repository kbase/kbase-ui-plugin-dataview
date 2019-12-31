define(["kb_common_ts/Auth2"],e=>{"use strict";return class{
constructor({runtime:t}){
this.runtime=t,this.auth2Root=null,this.serverTime=null,
this.auth2Client=new e.Auth2({baseUrl:t.config("services.auth.url")})}
getAuthToken(){return this.runtime.token}getUsername(){
return this.runtime.username}isLoggedIn(){return!!this.runtime.token}
isAuthorized(){return!!this.runtime.token}getClient(){return this.auth2Session}
serverTimeOffset(){return Date.now()-this.serverTime}getKBaseSession(){return{
un:this.runtime.username,user_id:this.runtime.username,
name:this.runtime.username,token:this.runtime.token,kbase_sessionid:null}}
start(){return this.auth2Client.root().then(e=>{
this.auth2Root=e,this.serverTime=e.servertime})}stop(){
return new Promise.resolve}}});