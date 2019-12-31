define(["jquery","./widget"],(function(e){"use strict";e.KBWidget({
name:"kbaseAuthenticatedWidget",version:"1.0.0",_accessors:[{name:"auth",
setter:"setAuth"
},"sessionId","authToken","user_id","loggedInCallback","loggedOutCallback","loggedInQueryCallback"],
options:{auth:void 0},init:function(e){
return this._super(e),this.setAuth(this.runtime.getService("session").getKBaseSession()),
this.loggedInQueryCallback&&this.authToken()&&this.callAfterInit(function(){
this.loggedInQueryCallback(this.auth())}.bind(this)),this},setAuth:function(e){
null==e&&(e={}),this.setValueForKey("auth",e),this.sessionId(e.kbase_sessionid),
this.authToken(e.token),this.user_id(e.user_id)},
loggedInQueryCallback:function(e){
this.loggedInCallback&&this.loggedInCallback(void 0,e)}})}));