define(["jquery","kb_common/html","numeral","kbaseUI/widget/legacy/widget"],(function(e,n,t){
"use strict";e.KBWidget({name:"KBaseAMAOverview",parent:"kbaseWidget",
version:"1.0.0",options:{genomeID:null,workspaceID:null,isInCard:!1,
genomeInfo:null},$infoTable:null,noContigs:"No Contigs",init:function(n){
return this._super(n),
this.$messagePane=e("<div/>").hide(),this.$elem.append(this.$messagePane),
this.render(),this},render:function(){
this.$infoPanel=e("<div>"),this.$infoTable=e("<table>").addClass("table table-striped table-bordered"),
this.$infoPanel.append(e("<div>").css("overflow","auto").append(this.$infoTable)),
this.$contigSelect=e("<select>").addClass("form-control").css({width:"60%",
"margin-right":"5px"
}).append(e("<option>").attr("id",this.noContigs).append(this.noContigs)),
this.$infoPanel.hide(),this.$elem.append(this.$infoPanel),this.renderWorkspace()
},addInfoRow:function(e,n){return"<tr><th>"+e+"</th><td>"+n+"</td></tr>"},
populateContigSelector:function(n){
for(var t in this.$contigSelect.empty(),n&&0!==n.length||this.$contigSelect.append(e("<option>").attr("id",this.noContigs).append(this.noContigs)),
n)this.$contigSelect.append(e("<option>").attr("id",t).append(t+" - "+n[t]+" bp"))
},alreadyRenderedTable:!1,renderWorkspace:function(){
this.showMessage(n.loading("loading...")),this.$infoPanel.hide();try{
this.showData(this.options.genomeInfo.data,this.options.genomeInfo.info[10])
}catch(e){this.showError(e)}},showData:function(e,n){
var i="Unknown",o="Unknown",s=0,a=0
;e.gc_content&&((i=Number(e.gc_content))<1?i=(100*i).toFixed(2)+" %":i>100?e.dna_size&&0!==e.dna_size&&(i=i+Number(e.dna_size)+" %"):i=i.toFixed(2)+" %"),
e.features?s=e.features.length:n&&n["Number features"]&&(s=n["Number features"]),
e.num_contigs?a=e.num_contigs:e.contig_ids&&(a=e.contig_ids.length),
e.dna_size&&(o=e.dna_size),
this.$infoTable.empty().append(this.addInfoRow("Original Source File Name",e.original_source_file_name)).append(this.addInfoRow("DNA Length",t(o).format("0,0"))).append(this.addInfoRow("Source ID",e.source+": "+e.source_id)).append(this.addInfoRow("Number of Contigs",t(a).format("0,0"))).append(this.addInfoRow("GC Content",i)).append(this.addInfoRow("Genetic Code",e.genetic_code)).append(this.addInfoRow("Number of features",t(s).format("0,0"))),
this.alreadyRenderedTable=!0,this.hideMessage(),this.$infoPanel.show()},
getData:function(){return{type:"Genome",id:this.options.genomeID,
workspace:this.options.workspaceID,title:"Genome Overview"}},
showMessage:function(n){var t=e("<span/>").append(n)
;this.$messagePane.empty().append(t).show()},hideMessage:function(){
this.$messagePane.hide()},buildObjectIdentity:function(e,n){var t={}
;return/^\d+$/.exec(e)?t.wsid=e:t.workspace=e,
/^\d+$/.exec(n)?t.objid=n:t.name=n,t},renderError:function(n){
errString="Sorry, an unknown error occurred",
"string"==typeof n?errString=n:n.error&&n.error.message&&(errString=n.error.message)
;var t=e("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>"+errString)
;this.$elem.empty(),this.$elem.append(t)}})}));