define(["jquery","kb_common/html","kb_service/client/workspace","kb_service/client/fba","kb_service/workspaceClient","kbaseUI/widget/legacy/widget","kbaseUI/widget/legacy/tabs","datatables_bootstrap"],(function(e,a,t,n,i){
"use strict";e.KBWidget({name:"kbasePhenotypeSet",parent:"kbaseWidget",
version:"1.0.0",options:{color:"black"},init:function(r){this._super(r)
;var s=r.ws,o=r.name,l=this.$elem,d=this
;return l.loading(),new t(this.runtime.getConfig("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()}).get_objects({workspace:s,
name:o}).then((function(t){var r=t[0].refs
;r.push(t[0].data.genome_ref),Object.create(i).init({
url:d.runtime.config("services.workspace.url"),
authToken:d.runtime.service("session").getAuthToken()
}).translateRefs(r).then((function(i){l.rmLoading(),function(t,i){
var r=this,s=e('<table class="table table-bordered table-striped" style="width: 100%;">'),o=l.kbTabs({
tabs:[{name:"Overview",active:!0},{name:"Phenotypes",content:s}]}),d=[{
wsid:t[0].info[1],ws:t[0].info[7],kbid:t[0].data.id,source:t[0].data.source,
genome:i[t[0].data.genome_ref].link,type:t[0].data.type,
errors:t[0].data.importErrors,owner:t[0].creator,date:t[0].created
}],c=a.makeRotatedTable(d,[{key:"wsid",label:"Name"},{key:"ws",label:"Workspace"
},{key:"kbid",label:"KBID"},{key:"source",label:"Source"},{key:"genome",
label:"Genome"},{key:"type",label:"Type"},{key:"errors",label:"Errors"},{
key:"owner",label:"Owner"},{key:"date",label:"Creation Date"}])
;o.tabContent("Overview").append(c);var b={sPaginationType:"full_numbers",
iDisplayLength:10,aaData:t[0].data.phenotypes,aaSorting:[[3,"desc"]],
aoColumns:[{sTitle:"Name",mData:"name"},{sTitle:"Media",mData:function(e){
return'<a data-ref="'+i[e.media_ref].label+'" class="btn-show-media-tab">'+i[e.media_ref].label+"</a>"
}},{sTitle:"Gene KO",mData:function(e){return e.geneko_refs.join("<br>")}},{
sTitle:"Additional compounds",mData:function(e){
return e.additionalcompound_refs.join("<br>")}},{sTitle:"Growth",
mData:"normalizedGrowth"}],oLanguage:{sEmptyTable:"No objects in workspace",
sSearch:"Search: "},fnDrawCallback:function(){
l.find(".btn-show-media-tab").unbind("click"),
l.find(".btn-show-media-tab").click((function(){
var a=e(this).data("ref"),t=e("<div>").loading();o.addTab({name:a,content:t,
removable:!0}),function(a,t,i){
new n(r.runtime.getConfig("services.fba.url")).get_media({medias:[i],
workspaces:[t]}).then((function(n){e(a).rmLoading(),e(a).kbaseMediaEditor({
ids:[i],workspaces:[t],data:n})})).catch((function(t){
e(a).rmLoading(),e(a).append('<div class="alert alert-danger">'+t.error.message+"</div>")
}))}(t,a.split("/")[0],a.split("/")[1])}))}};s.dataTable(b)}(t,i)
})).catch((function(e){
l.rmLoading(),l.append('<div class="alert alert-danger">'+e.error.message+"</div>")
}))})).catch((function(e){
l.rmLoading(),l.append('<div class="alert alert-danger">'+e.error.message+"</div>")
})),this}})}));