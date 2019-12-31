define(["jquery","kb_common/html","kb_service/client/workspace","kbaseUI/widget/legacy/authenticatedWidget","datatables_bootstrap"],(function(e,n,t){
"use strict";e.KBWidget({name:"AnnotationSetTable",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",options:{id:null,ws:null},
init:function(e){return this._super(e),this},render:function(){
var i=this,r=this.$elem
;if(r.empty(),this.runtime.service("session").isLoggedIn())return r.append(n.loading("loading data...")),
new t(this.runtime.getConfig("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()}).get_objects([{
ref:i.options.ws+"/"+i.options.id}],(function(t){if(r.empty(),0===t.length){
var a="[Error] Object "+i.options.id+" can not be found"
;r.append("<div><p>"+a+">/p></div>")}else{var o,s,d,u=t[0].data.otus,l=[]
;for(o=0;o<u.length;o+=1)for(s=u[o].functions,
d=0;d<s.length;d+=1)l.push([s[d].reference_genes.join("<br>"),s[d].functional_role,s[d].abundance,s[d].confidence,u[o].name])
;var c={columns:["features","functional role","abundance","avg e-value","otu"],
rows:l,class:"table table-striped"},p=n.makeTable(c)
;r.html(p),e("#"+c.generated.id).dataTable()}}),(function(n){r.empty()
;var t=e("<div>");t.append(e("<p>").css({padding:"10px 20px"
}).text("[Error] "+n.error.message)),r.append(t)})),i
;r.append("<div>[Error] You're not logged in</div>")},
loggedInCallback:function(e,n){return this.render(),this},
loggedOutCallback:function(e,n){return this.render(),this}})}));