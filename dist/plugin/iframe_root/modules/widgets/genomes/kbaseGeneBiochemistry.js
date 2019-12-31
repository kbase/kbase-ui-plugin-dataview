define(["jquery","kb_lib/htmlBuilders","kb_service/client/workspace","kbaseUI/widget/legacy/widget"],(function(e,t,n){
"use strict";e.KBWidget({name:"KBaseGeneBiochemistry",parent:"kbaseWidget",
version:"1.0.0",options:{featureID:null,embedInCard:!1,genomeID:null,
workspaceID:null,genomeInfo:null},init:function(e){
return this._super(e),null===this.options.featureID?this:(this.render(),
this.renderWorkspace(),this)},render:function(){
this.$messagePane=e("<div/>").addClass("kbwidget-message-pane kbwidget-hide-message"),
this.$elem.append(this.$messagePane),
this.$infoPanel=e("<div>").css("overflow","auto"),
this.$infoTable=e("<table>").addClass("table table-striped table-bordered"),
this.$elem.append(this.$infoPanel.append(this.$infoTable))},
makeRow:function(t,n){
return e("<tr>").append(e("<th>").append(t)).append(e("<td>").append(n))},
renderWorkspace:function(){var e=this
;if(this.showMessage(t.loading()),this.$infoPanel.hide(),
this.options.genomeInfo)e.ready(this.options.genomeInfo);else{
var s=this.buildObjectIdentity(this.options.workspaceID,this.options.genomeID)
;new n(this.runtime.getConfig("service.workspace.url"),{
token:this.runtime.service("session").getAuthToken()
}).get_objects([s]).then((function(t){e.ready(t[0])})).catch((function(t){
e.renderError(t)}))}},ready:function(e){if(e.data.features){var t=null
;for(let n=0;n<e.data.features.length;n++)if(e.data.features[n].id===this.options.featureID){
t=e.data.features[n];break}let r
;r=t.function?t.function:t.functions?t.functions.join("; "):"Unknown",
this.$infoTable.append(this.makeRow("Function",r))
;var n="No subsystem data found.";if(t.subsystem_data){n=""
;for(let e=0;e<t.subsystem_data.length;e++){var s=t.subsystem_data[e]
;n+="<p>Subsystem: "+s[0]+"<br>Variant: "+s[1]+"<br>Role: "+s[2]}}
this.$infoTable.append(this.makeRow("Subsystems",n))
;var i="No annotation comments found.";if(t.annotations){i=""
;for(var a=0;a<t.annotations.length;a++){var o=t.annotations[a]
;i+=o[0]+" ("+o[1]+", timestamp:"+o[2]+")<br>"}}
this.$infoTable.append(this.makeRow("Annotation Comments",i))
}else this.renderError({
error:"No genetic features found in the genome with object id: "+this.options.workspaceID+"/"+this.options.genomeID
});this.hideMessage(),this.$infoPanel.show()},buildObjectIdentity:function(e,t){
var n={}
;return/^\d+$/.exec(e)?n.wsid=e:n.workspace=e,/^\d+$/.exec(t)?n.objid=t:n.name=t,
n},getData:function(){return{type:"Feature",id:this.options.featureID,
workspace:this.options.workspaceID,title:"Biochemical Function"}},
showMessage:function(t){var n=e("<span/>").append(t)
;this.$messagePane.empty().append(n).removeClass("hide")},
hideMessage:function(){this.$messagePane.addClass("hide")},
makeErrorString:function(e){
return"string"==typeof e?e:e.error&&e.error.message?e.error.message:"Sorry, an unknown error occurred"
},renderError:function(t){
var n=this.makeErrorString(t),s=e("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>"+n)
;this.$elem.empty(),this.$elem.append(s)}})}));