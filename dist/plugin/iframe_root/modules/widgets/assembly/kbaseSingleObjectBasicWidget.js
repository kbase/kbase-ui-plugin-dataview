define(["jquery","kb_service/client/workspace","kb_common/html","kbaseUI/widget/legacy/authenticatedWidget"],(function(e,n,a){
"use strict";e.KBWidget({name:"kbaseSingleObjectBasicWidget",
parent:"kbaseAuthenticatedWidget",version:"1.0.1",options:{objId:null,
workspaceId:null,objVer:null},init:function(n){
return this._super(n),this.options.landingPageURL="/#dataview/",
this.workspaceURL=this.runtime.getConfig("services.workspace.url"),
this.$errorPane=e("<div>").addClass("alert alert-danger").hide(),
this.$elem.append(this.$errorPane),
this.$messagePane=e("<div>"),this.$elem.append(this.$messagePane),
this.$mainPane=e("<div>"),this.$elem.append(this.$mainPane),this},
loggedInCallback:function(e,a){
return this.ws=new n(this.workspaceURL,a),this.render(),this},
loggedOutCallback:function(e,n){return this.ws=null,this.isLoggedIn=!1,this},
render:function(){var e=this;e.loading(!0)
;var n=e.buildObjectIdentity(e.options.workspaceId,e.options.objId,e.options.objVer)
;this.ws.get_objects([n],(function(n){
e.loading(!1),e.buildWidgetContent(n[0].data)}),(function(n){
e.loading(!1),e.showError(n)}))},buildWidgetContent:function(n){
var a=this.$mainPane,t=this.getDataModel(n);a.append(t.description)
;var i=e('<table class="table table-striped table-bordered" />').css("width","100%").css("margin"," 1em 0 0 0")
;a.append(i);for(var s=0;s<t.items.length;s++){var r=t.items[s]
;r.header?i.append(this.makeHeaderRow(r.name,r.value)):i.append(this.makeRow(r.name,r.value))
}},getDataModel:function(e){return{
description:"Example description for the object: "+JSON.stringify(e),items:[{
name:"name1",value:"value1"},{name:"name2",value:"value2"},{header:"1",
name:"Group title 2"},{name:"name2.1",value:"value2.1"},{name:"name2.2",
value:"value2.2"}]}},makeHeaderRow:function(n){
return e("<tr/>").append(e("<td colspan='2'/>").append(e("<b />").append(n)))},
makeRow:function(n,a){
return e("<tr/>").append(e("<th />").css("width","20%").append(n)).append(e("<td />").append(a))
},loading:function(e){e?this.showMessage(a.loading()):this.hideMessage()},
showMessage:function(n){var a=e("<span/>").append(n)
;this.$messagePane.append(a),this.$messagePane.show()},hideMessage:function(){
this.$messagePane.hide(),this.$messagePane.empty()},
buildObjectIdentity:function(e,n,a,t){var i={}
;return t?i.ref=t:(/^\d+$/.exec(e)?i.wsid=e:i.workspace=e,
/^\d+$/.exec(n)?i.objid=n:i.name=n,a&&(i.ver=a)),i},showError:function(e){
this.$errorPane.empty(),
this.$errorPane.append("<strong>Error when retrieving data.</strong><br><br>"),
this.$errorPane.append(e.error.message),
this.$errorPane.append("<br>"),this.$errorPane.show()}})}));