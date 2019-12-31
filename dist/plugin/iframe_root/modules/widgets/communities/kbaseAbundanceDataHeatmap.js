define(["jquery","bluebird","kb_service/client/workspace","kb_common/html","widgets/communities/kbStandaloneHeatmap","datatables_bootstrap","kbaseUI/widget/legacy/authenticatedWidget"],(function(e,t,n,i,s){
"use strict";e.KBWidget({name:"AbundanceDataHeatmap",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",token:null,options:{id:null,
ws:null,rows:0},init:function(e){return this._super(e),this},render:function(){
var t=this,r=this.$elem
;if(r.empty(),this.runtime.service("session").isLoggedIn())return r.append(i.loading("loading data...")),
new n(this.runtime.getConfig("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()}).get_objects([{
ref:t.options.ws+"/"+t.options.id}],(function(n){if(r.empty(),0===n.length){
var a="[Error] Object "+t.options.id+" does not exist in workspace "+t.options.ws
;r.append("<div><p>"+a+">/p></div>")}else{var o=n[0].data,d=i.genId()
;r.append("<div id='outputHeatmap"+d+"' style='width: 95%;'></div>"),s.create({
target:e("#outputHeatmap"+d).get(0),data:o}).render()}}),(function(t){r.empty()
;var n=e("<div>");n.append(e("<p>").css({padding:"10px 20px"
}).text("[Error] "+t.error.message)),r.append(n)})),t
;r.append("<div>[Error] You're not logged in</div>")},
loggedInCallback:function(e,t){return this.token=t.token,this.render(),this},
loggedOutCallback:function(e,t){return this.token=null,this.render(),this}})}));