define(["jquery","uuid","kb_common/html","kb_service/client/workspace","kb_service/client/userAndJobState","lib/easyTree","kbaseUI/widget/legacy/authenticatedWidget"],(function(e,t,r,s,n,i){
"use strict";e.KBWidget({name:"kbaseTree",parent:"kbaseAuthenticatedWidget",
version:"0.0.1",options:{treeID:null,workspaceID:null,treeObjVer:null,
jobID:null,token:null,width:1045,height:600},treeWsRef:null,pref:null,
timer:null,init:function(r){
return this._super(r),this.pref=new t(4).format(),this.options.treeID?this.options.workspaceID?(this.wsClient=new s(this.runtime.getConfig("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()
}),this.$messagePane=e("<div/>").addClass("kbwidget-message-pane kbwidget-hide-message"),
this.$elem.append(this.$messagePane),
this.render(),this):(this.renderError("No workspace given!"),
this):(this.renderError("No tree to render!"),this)},render:function(){
if(this.loading(!1),
this.treeWsRef||null===this.options.jobID)this.loadTree();else{
var t=this,s=new n(this.runtime.getConfig("services.ujs.url"),{
token:this.runtime.service("session").getAuthToken()});t.$elem.empty()
;var i=e('<div class="loader-table"/>');t.$elem.append(i)
;var a=e('<table class="table table-striped table-bordered" style="margin-left: auto; margin-right: auto;" id="'+t.pref+'overview-table"/>')
;i.append(a),
a.append("<tr><td>Job was created with id</td><td>"+t.options.jobID+"</td></tr>"),
a.append("<tr><td>Output result will be stored as</td><td>"+t.options.treeID+"</td></tr>"),
a.append('<tr><td>Current job state is</td><td id="'+t.pref+'job"></td></tr>')
;var o=function(){s.get_job_status(t.options.jobID).then((function(s){
var n=s[2],i=s[5],a=s[6],o=e("#"+t.pref+"job")
;"running"===n?o.html(r.loading(n)):o.html(n),
1===i&&(clearInterval(t.timer),this.treeWsRef||0===a&&t.loadTree())
})).catch((function(r){
(clearInterval(t.timer),this.treeWsRef)||e("#"+t.pref+"job").html("Error accessing job status: "+r.error.message)
}))};o(),t.timer=setInterval(o,5e3)}},loadTree:function(){
var t=this.buildObjectIdentity(this.options.workspaceID,this.options.treeID,this.options.treeObjVer,this.treeWsRef),r=this
;this.wsClient.get_objects([t]).then((function(t){r.$elem.empty()
;var s="knhx-canvas-div-"+r.pref
;if(r.canvasId="knhx-canvas-"+r.pref,r.$canvas=e('<div id="'+s+'">').append(e('<canvas id="'+r.canvasId+'">')),
r.options.height&&r.$canvas.css({"max-height":r.options.height-85,
overflow:"scroll"}),r.$elem.append(r.$canvas),!r.treeWsRef){var n=t[0].info
;r.treeWsRef=n[6]+"/"+n[0]+"/"+n[4]}var i,a=t[0].data,o={},d=[]
;if(a.ws_refs)for(i in a.ws_refs)a.ws_refs[i].g&&a.ws_refs[i].g.length>0&&d.push({
ref:a.ws_refs[i].g[0]});return d.length>0?r.wsClient.get_object_info_new({
objects:d}).then((function(e){var t;for(t in e){var r=e[t];o[d[t].ref]=r}
return[a,o]})):[a,o]})).spread((function(e,t){var s
;return new i(r.canvasId,e.tree,e.default_node_labels,(function(n){
if(e.ws_refs&&e.ws_refs[n.id]){var i=e.ws_refs[n.id].g[0],a=t[i]
;a&&(s="/#dataview/"+a[7]+"/"+a[1],window.open(s,"_blank"))}else{
var o=e.default_node_labels[n.id]
;o.indexOf("/")>0&&(s="#genes/"+r.options.workspaceID+"/"+o,
window.open(s,"_blank"))}}),(function(e){
return e.id&&0===e.id.indexOf("user")?"#0000ff":null})),r.loading(!0),!0
})).catch((function(e){r.renderError(e)}))},renderError:function(t){
var r="Sorry, an unknown error occurred"
;"string"==typeof t?r=t:t.error&&t.error.message&&(r=t.error.message)
;var s=e("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>"+r)
;this.$elem.empty(),this.$elem.append(s)},getData:function(){return{type:"Tree",
id:this.options.treeID,workspace:this.options.workspaceID,title:"Tree"}},
buildObjectIdentity:function(e,t,r,s){var n={}
;return s?n.ref=s:(/^\d+$/.exec(e)?n.wsid=e:n.workspace=e,
/^\d+$/.exec(t)?n.objid=t:n.name=t,r&&(n.ver=r)),n},loading:function(e){
e?this.hideMessage():this.showMessage(r.loading())},showMessage:function(t){
var r=e("<span/>").append(t)
;this.$messagePane.append(r),this.$messagePane.show()},hideMessage:function(){
this.$messagePane.hide(),this.$messagePane.empty()},getState:function(){return{
treeWsRef:this.treeWsRef}},loadState:function(e){
e&&e.treeWsRef&&(this.treeWsRef=e.treeWsRef,this.render())}})}));