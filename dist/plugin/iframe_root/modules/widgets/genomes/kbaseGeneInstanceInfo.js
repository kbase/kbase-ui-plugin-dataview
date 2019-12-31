define(["jquery","kb_common/html","kb_service/client/workspace","kbaseUI/widget/legacy/widget"],(function(e,t,n){
"use strict";e.KBWidget({name:"KBaseGeneInstanceInfo",parent:"kbaseWidget",
version:"1.0.0",options:{featureID:null,workspaceID:null,genomeID:null,
hideButtons:!1,width:350,genomeInfo:null},init:function(e){
return this._super(e),
this.options.featureID?(this.workspaceClient=new n(this.runtime.config("services.workspace.url")),
this.render(),this.renderWorkspace(),this):(this.renderError(),this)},
render:function(t){var n=function(t){var n=t
;return t=t.replace(/\w\S*/g,(function(e){
return e.charAt(0).toUpperCase()+e.substr(1).toLowerCase()
})),e("<button>").attr("id",n).attr("type","button").addClass("btn btn-primary").append(t)
}
;this.$messagePane=e("<div/>").addClass("kbwidget-message-pane kbwidget-hide-message"),
this.$elem.append(this.$messagePane),
this.$infoPanel=e("<div>").css("overflow","auto"),
this.$infoTable=e("<table>").addClass("table table-striped table-bordered"),
this.$buttonPanel=e("<div>").attr("align","center").addClass("btn-group").append(n("sequence")).append(n("biochemistry")).append(n("structure")),
this.$infoPanel.append(this.$infoTable),
this.options.hideButtons||this.$infoPanel.append(this.$buttonPanel),
this.$elem.append(this.$infoPanel)},renderWorkspace:function(){var n=this
;if(this.$infoPanel.hide(),
this.showMessage(t.loading()),n.options.genomeInfo)n.ready(n.options.genomeInfo);else{
var i=this.buildObjectIdentity(this.options.workspaceID,this.options.genomeID),o=this.workspace.get_objects([i])
;e.when(o).fail(e.proxy((function(e){this.renderError(e),console.error(e)
}),this)),e.when(o).done(e.proxy((function(e){e=e[0],n.ready(e)}),this))}},
ready:function(t){var n=null;if(t.data.features){
for(var i=0;i<t.data.features.length;i++)if(t.data.features[i].id===this.options.featureID){
n=t.data.features[i];break}if(n){this.$infoTable.empty();var o=n.function
;o||(o="Unknown"),
this.$infoTable.append(this.makeRow("Function",o)),this.$infoTable.append(this.makeRow("Genome",e("<div/>").append(t.data.scientific_name).append("<br>").append(this.makeGenomeButton(this.options.genomeID,this.options.workspaceID))))
;var a="Unknown"
;if(n.dna_sequence_length)a=n.dna_sequence_length+" bp";else if(n.dna_sequence)a=n.dna_sequence.length+" bp";else if(n.location&&n.location.length>0){
a=0;for(i=0;i<n.location.length;i++)a+=n.location[i][3];a+=" bp"}
n.protein_translation&&(a+=", "+n.protein_translation.length+" aa"),
this.$infoTable.append(this.makeRow("Length",a)),
this.$infoTable.append(this.makeRow("Location",e("<div/>").append(this.parseLocation(n.location))))
;var s="No known aliases"
;n.aliases&&(s=n.aliases.join(", ")),this.$infoTable.append(this.makeRow("Aliases",s))
;var r="";if(n.protein_families&&n.protein_families.length>0){r=""
;for(i=0;i<n.protein_families.length;i++){var p=n.protein_families[i]
;r+=p.id+": "+p.subject_description+"<br>"}}
r&&this.$infoTable.append(this.makeRow("Protein Families",r)),
this.$buttonPanel.find("button#domains").click((function(e){
window.alert("No domain assignments available for this gene.  You will be able to compute domain assignments in the Narrative in the future.")
})),this.$buttonPanel.find("button#operons").click((function(e){
window.alert("No operon assignments available for this gene.  You will be able to compute operon assignments in the Narrative in the future.")
})),this.$buttonPanel.find("button#structure").click((function(e){
window.alert("No structure assignments available for this gene.  You will be able to compute structure assignments in the Narrative in the future.")
})),this.$buttonPanel.find("button#sequence").click(e.proxy((function(e){
this.trigger("showSequence",{event:e,featureID:this.options.featureID,
genomeID:this.options.genomeID,workspaceID:this.options.workspaceID,
kbCache:this.options.kbCache})
}),this)),this.$buttonPanel.find("button#biochemistry").click(e.proxy((function(e){
this.trigger("showBiochemistry",{event:e,featureID:this.options.featureID,
genomeID:this.options.genomeID,workspaceID:this.options.workspaceID,
kbCache:this.options.kbCache})}),this))}else this.renderError({
error:"Gene '"+this.options.featureID+"' not found in the genome with object id: "+this.options.workspaceID+"/"+this.options.genomeID
})}else this.renderError({
error:"No genetic features found in the genome with object id: "+this.options.workspaceID+"/"+this.options.genomeID
});this.hideMessage(),this.$infoPanel.show()},makeRow:function(t,n){
return e("<tr/>").append(e("<th />").append(t)).append(e("<td />").append(n))},
makeContigButton:function(t){if(this.options.hideButtons)return""
;if(null===t||null===t[0][0])return"";var n=t[0][0],i=this
;return e("<button />").addClass("btn btn-default").append("Show Contig").on("click",(function(e){
i.trigger("showContig",{contig:n,centerFeature:i.options.featureID,
genomeId:i.options.genomeID,workspaceId:i.options.workspaceID,
kbCache:i.options.kbCache,event:e})}))},makeGenomeButton:function(t,n){
return t?(n||(n=null),
e("<div>").append('<a href="/#dataview/'+n+"/"+t+'" target="_blank">'+n+"/<wbr>"+t+"</a>")):""
},calculateGCContent:function(e){var t=0;e=e.toLowerCase()
;for(var n=0;n<e.length;n++){var i=e[n];"g"!==i&&"c"!==i||t++}
return t/e.length*100},parseLocation:function(e){if(0===e.length)return"Unknown"
;for(var t="",n=0;n<e.length;n++){var i=Number(e[n][1]),o=Number(e[n][3])
;t+=i+" to "+("+"===e[n][2]?i+o-1:i-o+1)+" ("+e[n][2]+")<br/>"}return t},
showMessage:function(t){var n=e("<span/>").append(t)
;this.$messagePane.empty().append(n).removeClass("hide")},
hideMessage:function(){this.$messagePane.addClass("hide")},getData:function(){
return{type:"Feature",id:this.options.featureID,
workspace:this.options.workspaceID,genome:this.options.genomeID,
title:"Gene Instance"}},renderError:function(t){
var n="Sorry, an unknown error occurred"
;"string"==typeof t?n=t:t.error&&t.error.message&&(n=t.error.message)
;var i=e("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>"+n)
;this.$elem.empty(),this.$elem.append(i)},buildObjectIdentity:function(e,t){
var n={}
;return/^\d+$/.exec(e)?n.wsid=e:n.workspace=e,/^\d+$/.exec(t)?n.objid=t:n.name=t,
n}})}));