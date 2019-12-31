!function(e,n){e.KBWidget({name:"KBaseGeneDomains",parent:"kbaseWidget",
version:"1.0.1",options:{featureID:null,embedInCard:!1,auth:null,
loadingImage:"assets/img/loading.gif",genomeID:null,workspaceID:null,
kbCache:null,maxDescriptionLength:100},init:function(e){
return this._super(e),this.wsClient=this.options.kbCache.ws,this.render(),this},
render:function(){
this.$elem.append(e('<div id="mainview">').css("overflow","auto")),
this.$elem.find("#mainview").append('<table id="ref-table"                             class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>'),
this.processDomainAnnotationObjects()},
processDomainAnnotationObjects:function(){
var n=this,t=n.buildObjectIdentity(n.options.workspaceID,n.options.genomeID)
;n.wsClient.list_referencing_objects([t],(function(t){
for(var i={},a=t[0],o=0;o<a.length;o++){var r=a[o][2]
;if(/.DomainAnnotation-/.exec(r)){var s=a[o][6],d=a[o][0];a[o][4]
;i[s+"/"+d]=a[o]}}e.isEmptyObject(i)||n.processContigIndexElements(i)}))},
processContigIndexElements:function(e){var n=this,t=[],i={}
;for(var a in e)t.push({ref:a,
included:["/feature_to_contig_and_index/"+n.options.featureID,"/used_dms_ref"]})
;var o=[];n.wsClient.get_object_subset(t,(function(e){
for(var t=0;t<e.length;t++){
var a=e[t].data.feature_to_contig_and_index,r=e[t].info[6],s=e[t].info[0],d=(e[t].info[4],
e[t].data.used_dms_ref);for(var l in null!=d&&(i[d]=d),a)o.push({
annObjectRef:r+"/"+s,contigId:a[l][0],geneIndex:a[l][1]})}
o.length>0&&n.processDomainAnnotations(o,i)}))},
processDomainAnnotations:function(e,n){for(var t=this,i=[],a=0;a<e.length;a++){
var o=e[a];i.push({ref:o.annObjectRef,
included:["/data/"+o.contigId+"/"+o.geneIndex]})}var r={},s=[]
;t.wsClient.get_object_subset(i,(function(e){for(var i=0;i<e.length;i++){
var a=e[i].info[6],o=e[i].info[0],d=e[i].info[4]
;for(var l in e[i].data.data)for(var c=e[i].data.data[l],p=0;p<c.length;p++){
var m=c[p][0],f=c[p][1],g=c[p][2],u=c[p][4]
;for(var h in u)for(var D=u[h],v=0;v<D.length;v++){
var b=D[v][0],_=D[v][1],I=D[v][2],w=h+"_"+b+"_"+_;if(null==r[w]){r[w]=""
;var j=100*(_-b)/(g-f),x=100*b/(g-f);s.push({wsId:a,objId:o,objVer:d,
objRef:a+"/"+o+"/"+d,contigId:l,geneId:m,geneStart:f,geneEnd:g,domainId:h,
domainDescription:"",domainStart:b,domainEnd:_,eValue:I,
image:'<div style="position:relative; border: 1px solid gray; width:100%; height:2px;"><div style="position:relative; left: '+x+"%; width:"+j+'%; top: -5px; height:10px; background-color:red;"/></div>'
})}}}}s.length>0&&t.processDomainDescirptions(s,n)}))},
processDomainDescirptions:function(e,n){
for(var t=this,i={},a=0;a<e.length;a++)i[e[a].domainId]="";var o=[]
;for(var r in n){var s=[]
;for(var d in i)s.push("/domain_accession_to_description/"+d);o.push({ref:r,
included:s})}var l={},c={};t.wsClient.get_object_subset(o,(function(n){
for(var i=0;i<n.length;i++){var a=n[i].data.domain_accession_to_description
;if(null!=a)for(var o in a)l[o]=a[o],
c[o]=a[o],c[o].length>t.options.maxDescriptionLength&&(c[o]=c[o].substring(0,t.options.maxDescriptionLength)+"&#8230;")
}for(i=0;i<e.length;i++){var r=c[e[i].domainId]
;null!=r&&(e[i].domainDescription=r,
e[i].shortDomainDescription=r,e[i].longDomainDescription=l[e[i].domainId])}
e.length>0&&t.bindDomainData(e)}))},bindDomainData:function(n){var t="t<fip>"
;n.length<=10&&(t="tfi");var i={iDisplayLength:10,sDom:t,aoColumns:[{
sTitle:"Domain",mData:"domainId"},{sTitle:"Description",
mData:"domainDescription",sWidth:"30%"},{sTitle:"Location",mData:"image"},{
sTitle:"Start",mData:"domainStart"},{sTitle:"End",mData:"domainEnd"},{
sTitle:"eValue",mData:"eValue"},{sTitle:"DomainAnnotation object",mData:"objRef"
}],aaData:n},a=this.$elem.find("#ref-table").dataTable(i),o=[]
;e("#ref-table tbody td").click((function(e){var t=a.fnGetPosition(e.target)[0]
;null==o[t]&&(o[t]=0),
o[t]=1-o[t],1==o[t]?a.fnUpdate(n[t].longDomainDescription,t,1):a.fnUpdate(n[t].shortDomainDescription,t,1)
}))},buildObjectIdentity:function(e,n){var t={}
;return/^\d+$/.exec(e)?t.wsid=e:t.workspace=e,
/^\d+$/.exec(n)?t.objid=n:t.name=n,t},getData:function(){return{type:"Feature",
id:this.options.featureID,workspace:this.options.workspaceID,
title:"Gene Domains"}},showMessage:function(n){var t=e("<span/>").append(n)
;this.$messagePane.empty().append(t).removeClass("kbwidget-hide-message")},
hideMessage:function(){this.$messagePane.addClass("kbwidget-hide-message")},
renderError:function(n){
errString="Sorry, an unknown error occurred","string"==typeof n?errString=n:n.error&&n.error.message&&(errString=n.error.message)
;var t=e("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>"+errString)
;this.$elem.empty(),this.$elem.append(t)}})}(jQuery);