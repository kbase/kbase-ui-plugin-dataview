define(["jquery","kb_common/html","kb_service/client/workspace","kbaseUI/widget/legacy/widget","widgets/genomes/kbaseGeneInstanceInfo","widgets/genomes/kbaseGeneBiochemistry","widgets/genomes/kbaseGeneSequence"],(function(e,a,n){
"use strict";e.KBWidget({name:"KBaseGenePage",parent:"kbaseWidget",
version:"1.0.0",options:{featureID:null,genomeID:null,workspaceID:null},
init:function(e){
return this._super(e),"CDS"===this.options.workspaceID&&(this.options.workspaceID="KBasePublicGenomesV4"),
this.workspace=new n(this.runtime.getConfig("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()}),this.render(),this},
render:function(){var a=this,n={ws:this.options.workspaceID,
gid:this.options.genomeID,fid:this.options.featureID
},t=e('<div panel panel-default">');a.$elem.append(t)
;var o=a.makePleaseWaitPanel();a.makeDecoration(t,"Feature Overview",o)
;var i=e('<div panel panel-default">');a.$elem.append(i)
;var r=a.makePleaseWaitPanel();a.makeDecoration(i,"Biochemistry",r)
;var s=e('<div panel panel-default">');a.$elem.append(s)
;var c=a.makePleaseWaitPanel();a.makeDecoration(s,"Sequence",c)
;var d=n.ws+"/"+n.gid;a.workspace.get_object_subset([{ref:d,
included:["/complete","/contig_ids","/contig_lengths","contigset_ref","/dna_size","/domain","/gc_content","/genetic_code","/id","/md5","num_contigs","/scientific_name","/source","/source_id","/tax_id","/taxonomy","/features/[*]/id"]
}],(function(e){var t=e[0],l=null;for(var p in t.data.features){
var u=t.data.features[p].id;if(u&&u===n.fid){l=p;break}}
l?a.workspace.get_object_subset([{ref:d,included:["/features/"+l]
}],(function(e){var i=e[0].data;t.data.features[l]=i.features[0],function(e){
o.empty();try{o.KBaseGeneInstanceInfo({featureID:n.fid,genomeID:n.gid,
workspaceID:n.ws,hideButtons:!0,genomeInfo:e,runtime:a.runtime})}catch(t){
console.error(t),a.showError(o,t.message)}
e&&e.data.scientific_name&&e.data.scientific_name,r.empty();try{
r.KBaseGeneBiochemistry({featureID:n.fid,genomeID:n.gid,workspaceID:n.ws,
genomeInfo:e,runtime:a.runtime})}catch(t){
console.error(t),a.showError(r,t.message)}c.empty(),c.KBaseGeneSequence({
featureID:n.fid,genomeID:n.gid,workspaceID:n.ws,genomeInfo:e,runtime:a.runtime})
}(t)}),(function(e){
console.error("Error loading genome subdata"),console.error(e),
o.empty(),a.showError(o,e),i.empty(),s.empty()
})):(o.empty(),a.showError(o,"Feature "+n.fid+" is not found in genome"),
i.empty(),s.empty())}),(function(e){
console.error("Error loading genome subdata"),
console.error(e),o.empty(),a.showError(o,e),i.empty(),s.empty()}))},
makePleaseWaitPanel:function(){return e("<div>").html(a.loading("loading..."))},
makeDecoration:function(a,n,t){var o=this.genUUID()
;a.append(e('<div class="panel-group" id="accordion_'+o+'" role="tablist" aria-multiselectable="true">').append(e('<div class="panel panel-default kb-widget">').append('<div class="panel-heading" role="tab" id="heading_'+o+'"><h4 class="panel-title"><span data-toggle="collapse" data-parent="#accordion_'+o+'" data-target="#collapse_'+o+'" aria-expanded="false" aria-controls="collapse_'+o+'" style="cursor:pointer;"> '+n+"</span></h4></div>").append(e('<div id="collapse_'+o+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading_'+o+'" area-expanded="true">').append(e('<div class="panel-body">').append(t)))))
},getData:function(){return{type:"Gene Page",
id:this.options.genomeID+"/"+this.options.featureID,
workspace:this.options.workspaceID,title:"Gene Page"}},showError:function(e,a){
e.empty(),e.append("Error: "+JSON.stringify(a))},genUUID:function(){
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){
var a=16*Math.random()|0;return("x"===e?a:3&a|8).toString(16)}))}})}));