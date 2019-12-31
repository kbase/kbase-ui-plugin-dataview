define(["jquery","kb_common/html","kb_service/client/workspace","kbaseUI/widget/legacy/authenticatedWidget"],(function(e,t,i){
"use strict";e.KBWidget({name:"kbaseAssemblyView",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",ws_id:null,ws_name:null,
token:null,job_id:null,width:1150,options:{ws_id:null,ws_name:null,job_id:null},
timer:null,init:function(e){
return this._super(e),this.wsUrl=this.runtime.getConfig("services.workspace.url"),
this.ws_name=e.ws_name,
this.ws_id=e.ws_id,e.job_id&&(this.job_id=e.job_id),e.ws&&e.id&&(this.ws_id=e.id,
this.ws_name=e.ws),this},render:function(){var e=this,n=this.$elem
;if(null===e.token)return n.empty(),
void n.append("<div>[Error] You're not logged in</div>");var s=new i(e.wsUrl,{
token:e.token});return function(){var i
;n.empty(),n.append(t.loading("loading data...")),i=e.ws_id,s.get_objects([{
ref:e.ws_name+"/"+i}],(function(e){n.empty()
;var t='<div class="" style="margin-top:15px">'
;t+="<pre><code>"+e[0].data.report+"</code></pre><br>",n.append(t)
}),(function(e){n.empty(),n.append("<p>[Error] "+e.error.message+"</p>")}))
}(),this},getData:function(){return{type:"NarrativeTempCard",
id:this.ws_name+"."+this.ws_id,workspace:this.ws_name,title:"Temp Widget"}},
loggedInCallback:function(e,t){return this.token=t.token,this.render(),this},
loggedOutCallback:function(e,t){return this.token=null,this.render(),this}})}));