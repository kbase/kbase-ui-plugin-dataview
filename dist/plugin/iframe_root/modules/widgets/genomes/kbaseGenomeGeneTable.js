define(["jquery","kb_common/html","kb_service/client/workspace","datatables_bootstrap","kbaseUI/widget/legacy/authenticatedWidget"],(function(e,t,n){
"use strict";e.KBWidget({name:"KBaseGenomeGeneTable",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",genome_id:null,ws_name:null,
kbCache:null,width:1150,options:{genome_id:null,ws_name:null,ver:null,
genomeInfo:null},init:function(e){
return this._super(e),this.ws_name=this.options.ws_name,
this.genome_id=this.options.genome_id,this.render(),this},render:function(){
var i=this.uuid(),a=this.$elem;a.append(t.loading("loading genes data..."))
;var s=String(this.options.ws_name)+"/"+String(this.options.genome_id),o=function(t,n){
function o(){
a.empty(),a.append(e("<div />").css("overflow","auto").append('<table cellpadding="0" cellspacing="0" border="0" id="'+i+'genes-table" class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>'))
;var n=[],o={},r={}
;if(t.contig_ids&&t.contig_lengths&&t.contig_ids.length===t.contig_lengths.length)for(var l in t.contig_ids){
var g=t.contig_ids[l],u=t.contig_lengths[l];r[g]={name:g,length:u,genes:[]}}
for(var c in t.features){var d=t.features[c],h=d.id,m=null,p=null,b=null,f=null
;d.location&&d.location.length>0&&(m=d.location[0][0],
p=d.location[0][1],b=d.location[0][2],f=d.location[0][3])
;var x=d.type,_=d.function;_||(_="-"),n.push({
id:'<a href="/#dataview/'+s+"?sub=Feature&subid="+h+'" target="_blank">'+h+"</a>",
contig:m,start:p,dir:b,len:f,type:x,func:_}),o[h]=d;var y=r[m]
;if(null===m||y||(y={name:m,length:0,genes:[]},r[m]=y),y){var v=Number(p)
;"+"===b&&(v+=Number(f)),y.length<v&&(y.length=v),y.genes.push(d)}}var w={
sPaginationType:"full_numbers",iDisplayLength:10,
aaSorting:[[1,"asc"],[2,"asc"]],sDom:"t<fip>",aoColumns:[{sTitle:"Gene ID",
mData:"id"},{sTitle:"Contig",mData:"contig"},{sTitle:"Start",mData:"start",
sWidth:"7%"},{sTitle:"Strand",mData:"dir",sWidth:"7%"},{sTitle:"Length",
mData:"len",sWidth:"7%"},{sTitle:"Type",mData:"type",sWidth:"10%"},{
sTitle:"Function",mData:"func",sWidth:"45%"}],aaData:n,oLanguage:{
sSearch:"&nbsp&nbspSearch genes:",sEmptyTable:"No genes found."}}
;e("#"+i+"genes-table").dataTable(w)}if(t.features.length>35e3){a.empty()
;var r="btn_show_genes"+i
;a.append("There are many features in this genome, so displaying the full, sortable gene list may cause your web browser to run out of memory and become temporarily unresponsive.  Click below to attempt to show the gene list anyway.<br><button id='"+r+"' class='btn btn-primary'>Show Gene List</button>"),
e("#"+r).click((function(e){o()}))}else o()}
;if(this.options.genomeInfo)o(this.options.genomeInfo.data);else{var r={ref:s}
;new n(this.runtime.getConfig("services.workspace.url",{
token:this.runtime.service("session").getAuthToken()
})).get_objects([r]).then((function(e){o(e[0])})).catch((function(e){
a.empty(),a.append("<p>[Error] "+e.error.message+"</p>")}))}return this},
getData:function(){return{type:"KBaseGenomeGeneTable",
id:this.options.ws_name+"."+this.options.genome_id,
workspace:this.options.ws_name,title:"Gene list"}},uuid:function(){
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){
var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)}))}})}));