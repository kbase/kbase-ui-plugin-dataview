define(["jquery","kb_common/html","kb_service/client/workspace","kbaseUI/widget/legacy/widget"],(function(e,n,t){
"use strict";e.KBWidget({name:"KBaseGeneSequence",parent:"kbaseWidget",
version:"1.0.0",options:{featureID:null,embedInCard:!1,genomeID:null,
workspaceID:null,width:950,seq_cell_height:208,genomeInfo:null},
init:function(e){
return this._super(e),null===this.options.featureID?this:(this.render(),
this.options.workspaceID?this.renderWorkspace():this.renderError,this)},
render:function(){
this.$messagePane=e("<div/>").addClass("kbwidget-message-pane hide"),
this.$elem.append(this.$messagePane),
this.$infoPanel=e("<div>").css("overflow","auto"),
this.$infoTable=e("<table>").addClass("table table-striped table-bordered"),
this.$elem.append(this.$infoPanel.append(this.$infoTable))},
makeRow:function(n,t,s){
return e("<tr>").append(e("<th>").append(n)).append(e("<td>").append(e("<div style='max-height:"+this.options.seq_cell_height+"px; overflow:scroll; font-family:monospace; background-color:"+s+"; border:1px solid transparent'>").append(t)))
},renderWorkspace:function(){var e=this
;if(this.showMessage(n.loading()),this.$infoPanel.hide(),
this.options.genomeInfo)e.ready(this.options.genomeInfo);else{
var s=this.buildObjectIdentity(this.options.workspaceID,this.options.genomeID)
;new t(this.runtime.getConfig("service.workspace.url"),{
token:this.runtime.service("session").getAuthToken()
}).get_objects([s]).then((function(n){e.ready(n[0])})).catch((function(n){
e.renderError(n)}))}},ready:function(e){if(e.data.features){
for(var n=null,t=0;t<e.data.features.length;t++)if(e.data.features[t].id===this.options.featureID){
n=e.data.features[t];break}var s="No gene sequence found.";if(n.dna_sequence){
var i=50;if((s=n.dna_sequence).length>i){var r="",a=0,o=0
;for(t=0;(t+1)*i<s.length;t++)a=t*i,o=(t+1)*i,r+=s.substring(a,o)+"<br>"
;a+=i,o=s.length,a<s.length&&(r+=s.substring(a,o)+"<br>"),s=r}}
this.$infoTable.append(this.makeRow("Gene",s,"white"))
;var d="No protein sequence found.";if(n.protein_translation){i=50
;if((d=n.protein_translation).length>i){var h=""
;for(a=0,o=0,t=0;(t+1)*i<d.length;t++)a=t*i,o=(t+1)*i,h+=d.substring(a,o)+"<br>"
;a+=i,o=d.length,a<d.length&&(h+=d.substring(a,o)+"<br>"),d=h}}
this.$infoTable.append(this.makeRow("Protein",d,"#f9f9f9"))
}else this.renderError({
error:"No genetic features found in the genome with object id: "+this.options.workspaceID+"/"+this.options.genomeID
});this.hideMessage(),this.$infoPanel.show()},buildObjectIdentity:function(e,n){
var t={}
;return/^\d+$/.exec(e)?t.wsid=e:t.workspace=e,/^\d+$/.exec(n)?t.objid=n:t.name=n,
t},getData:function(){return{type:"Feature",id:this.options.featureID,
workspace:this.options.workspaceID,title:"Gene Sequence"}},
showMessage:function(n){var t=e("<span/>").append(n)
;this.$messagePane.empty().append(t).removeClass("hide")},
hideMessage:function(){this.$messagePane.addClass("hide")},
renderError:function(n){var t="Sorry, an unknown error occurred"
;"string"==typeof n?t=n:n.error&&n.error.message&&(t=n.error.message)
;var s=e("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>"+t)
;this.$elem.empty(),this.$elem.append(s)}})}));