!function(e,a){e.KBWidget({name:"kbaseDomainAnnotation",
parent:"kbaseAuthenticatedWidget",version:"1.0.1",options:{
domainAnnotationID:null,workspaceID:null,domainAnnotationVer:null,kbCache:null,
loadingImage:"assets/img/ajax-loader.gif",height:null},
domainAnnotationData:null,genomeRef:null,genomeId:null,genomeName:null,
domainModelSetRef:null,domainModelSetName:null,domainAccession2Description:{},
annotatedGenesCount:0,annotatedDomainsCount:0,init:function(a){
return this._super(a),
this.workspaceURL=kb.urls.workspace_url,this.landingPageURL="#/dataview/",
this.$messagePane=e("<div/>"),this.$elem.append(this.$messagePane),this},
loggedInCallback:function(e,a){
return this.ws=new Workspace(this.workspaceURL,a),this.render(),this},
loggedOutCallback:function(e,a){return this.ws=null,this.isLoggedIn=!1,this},
render:function(){var a=this;a.pref=this.uuid(),a.loading(!0)
;var n=this.$elem,t=this.ws,i=a.buildObjectIdentity(this.options.workspaceID,this.options.domainAnnotationID,this.options.domainAnnotationVer)
;t.get_objects([i],(function(i){
a.domainAnnotationData=i[0].data,a.genomeRef=a.domainAnnotationData.genome_ref,
a.domainModelSetRef=a.domainAnnotationData.used_dms_ref
;var o=t.get_object_subset([{ref:a.genomeRef,included:["/id"]},{ref:a.genomeRef,
included:["/scientific_name"]}],(function(e){
a.genomeId=e[0].data.id,a.genomeName=e[1].data.scientific_name}),(function(e){
a.clientError(e)})),s=t.get_objects([{ref:a.domainModelSetRef}],(function(e){
a.domainSetName=e[0].data.set_name,
a.domainAccession2Description=e[0].data.domain_accession_to_description
}),(function(e){a.clientError(e)}));e.when.apply(e,[o,s]).done((function(){
a.loading(!1),a.prepareVizData(),n.empty()
;var t=e('<div id="'+a.pref+'tab-content">');n.append(t),t.kbaseTabs({
canDelete:!0,tabs:[]});var i=e("<div/>");t.kbaseTabs("addTab",{tab:"Overview",
content:i,canDelete:!1,show:!0})
;var o=e('<table class="table table-striped table-bordered" style="width: 100%; margin-left: 0px; margin-right: 0px;" id="'+a.pref+'overview-table"/>')
;i.append(o),
o.append(a.makeRow("Annotated genome",e("<span />").append(a.genomeName).css("font-style","italic").append("<br /><a href='"+a.landingPageURL+a.genomeRef+"' target='_blank'>"+a.genomeRef+"</a>"))).append(a.makeRow("Domain models set",a.domainSetName)).append(a.makeRow("Annotated genes",a.annotatedGenesCount)).append(a.makeRow("Annotated domains",a.annotatedDomainsCount))
;var s=e("<div/>");t.kbaseTabs("addTab",{tab:"Domains",content:s,canDelete:!1,
show:!1})
;var d=e('<table class="table table-striped table-bordered" style="width: 100%; margin-left: 0px; margin-right: 0px;" id="'+a.pref+'domain-table"/>')
;s.append(d);var r={sPaginationType:"full_numbers",iDisplayLength:10,aaData:[],
aaSorting:[[2,"asc"],[0,"asc"]],aoColumns:[{sTitle:"Domain",mData:"id"},{
sTitle:"Description",mData:"description"},{sTitle:"#Genes",mData:"geneCount"},{
sTitle:"Genes",mData:"geneRefs"}],oLanguage:{sEmptyTable:"No domains found!",
sSearch:"Search: "},fnDrawCallback:function(){
e(".show-gene"+a.pref).unbind("click"),e(".show-gene"+a.pref).click((function(){
var n=e(this).attr("data-id"),i=e(this).attr("data-contigId"),o=e(this).attr("data-geneIndex")
;if(t.kbaseTabs("hasTab",n))t.kbaseTabs("showTab",n);else{
var s=e("<div/>"),d=e('<table class="table table-striped table-bordered" style="width: 100%; margin-left: 0px; margin-right: 0px;" id="'+a.pref+n+'-table"/>')
;s.append(d);var r={sPaginationType:"full_numbers",iDisplayLength:10,aaData:[],
aaSorting:[[3,"asc"],[5,"desc"]],aoColumns:[{sTitle:"Domain",mData:"domainId"},{
sTitle:"Description",mData:"domainDescription",sWidth:"30%"},{sTitle:"Location",
mData:"image"},{sTitle:"Start",mData:"domainStart"},{sTitle:"End",
mData:"domainEnd"},{sTitle:"eValue",mData:"eValue"}],oLanguage:{
sEmptyTable:"No domains found!",sSearch:"Search: "}
},l=[],m=a.domainAnnotationData.data[i][o],g=m[0],c=m[1],p=m[2],h=m[4]
;for(var u in h)for(var f=h[u],b=0;b<f.length;b++){
var D=f[b][0],x=f[b][1],v=f[b][2],w=(p-c+1)/3,k=100*(x-D)/w,I=100*D/w;l.push({
contigId:i,geneId:g,geneStart:c,geneEnd:p,domainId:u,
domainDescription:a.domainAccession2Description[u],domainStart:D,domainEnd:x,
eValue:v,
image:'<div style="widht: 100%; height:100%; vertical-align: middle; margin-top: 1em; margin-bottom: 1em;"><div style="position:relative; border: 1px solid gray; width:100%; height:2px;"><div style="position:relative; left: '+I+"%; width:"+k+'%; top: -5px; height:10px; background-color:red;"/></div></div>'
})}r.aaData=l,d.dataTable(r),t.kbaseTabs("addTab",{tab:n,content:s,canDelete:!0,
show:!0})}}))}},l=[],m=a.domains;for(var g in m){
for(var c=m[g],p="",h=0;h<c.genes.length;h++)gene=c.genes[h],h>0&&(p+="<br />"),
p+='<a class="show-gene'+a.pref+'" data-id="'+gene.geneId+'" data-contigId="'+gene.contigId+'" data-geneIndex="'+gene.geneIndex+'">'+gene.geneId+"</a>"
;l.push({id:g,description:c.description,geneCount:c.genes.length,geneRefs:p})}
r.aaData=l,d.dataTable(r)}))}))},prepareVizData:function(){
var a=this.domainAnnotationData,n={},t=0,i=0;for(var o in a.data){
for(var s=a.data[o],d=0;d<s.length;d++){var r=s[d][0],l=s[d][4]
;if(!e.isEmptyObject(l))for(var m in i++,l){var g=n[m];void 0===g&&(g={id:m,
description:this.domainAccession2Description[m],genes:[]
},n[m]=g,t++),g.genes.push({geneId:r,contigId:o,geneIndex:d})}}
this.domains=n,this.annotatedDomainsCount=t,this.annotatedGenesCount=i}},
makeRow:function(a,n){
return e("<tr/>").append(e("<th />").css("width","20%").append(a)).append(e("<td />").append(n))
},getData:function(){return{type:"DomainAnnotation",
id:this.options.domainAnnotationID,workspace:this.options.workspaceID,
title:"Domain Annotation"}},loading:function(e){
e?this.showMessage("<img src='"+this.options.loadingImage+"'/>"):this.hideMessage()
},showMessage:function(a){var n=e("<span>").append(a)
;this.$messagePane.append(n),this.$messagePane.show()},hideMessage:function(){
this.$messagePane.hide(),this.$messagePane.empty()},uuid:function(){
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){
var a=16*Math.random()|0;return("x"==e?a:3&a|8).toString(16)}))},
buildObjectIdentity:function(e,a,n,t){var i={}
;return t?i.ref=t:(/^\d+$/.exec(e)?i.wsid=e:i.workspace=e,
/^\d+$/.exec(a)?i.objid=a:i.name=a,n&&(i.ver=n)),i},clientError:function(e){
this.loading(!1),this.showMessage(e.error.error)}})}(jQuery);