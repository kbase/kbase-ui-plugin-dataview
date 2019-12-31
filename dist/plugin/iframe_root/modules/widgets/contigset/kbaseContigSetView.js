define(["jquery","bluebird","kb_service/client/workspace","kb_common/html","datatables_bootstrap","kbaseUI/widget/legacy/authenticatedWidget"],(function(e,t,a,i){
"use strict";e.KBWidget({name:"kbaseContigSetView",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",ws_id:null,ws_name:null,
token:null,job_id:null,options:{ws_id:null,ws_name:null,width:850},
init:function(e){
return this._super(e),this.ws_name=e.ws_name,this.ws_id=e.ws_id,
e.ws&&e.id&&(this.ws_id=e.id,
this.ws_name=e.ws),this.ws_service=new a(this.runtime.getConfig("services.workspace.url"),{
token:this.token}),this.render(),this},render:function(){
var a=this,n=this.uuid(),s=this.$elem
;return s.empty(),s.append(i.loading("loading data...")),
t.resolve(a.ws_service.get_object_subset([{ref:a.ws_name+"/"+a.ws_id,
included:["contigs/[*]/id","contigs/[*]/length","id","name","source","source_id","type"]
}])).then((function(t){s.empty()
;var i,r=t[0].data,l=["Overview","Contigs"],o=["overview","contigs"],d=e('<ul id="'+n+'table-tabs" class="nav nav-tabs"/>')
;for(d.append('<li class="active"><a href="#'+n+o[0]+'" data-toggle="tab" >'+l[0]+"</a></li>"),
i=1;i<o.length;i+=1)d.append('<li><a href="#'+n+o[i]+'" data-toggle="tab">'+l[i]+"</a></li>")
;s.append(d);var c=e('<div id="'+n+'tab-content" class="tab-content"/>')
;for(c.append('<div class="tab-pane in active" id="'+n+o[0]+'"/>'),
i=1;i<o.length;i+=1)c.append(e('<div class="tab-pane in" id="'+n+o[i]+'"/>'))
;s.append(c),e("#"+n+"table-tabs a").click((function(t){
t.preventDefault(),e(this).tab("show")
})),e("#"+n+"overview").append('<table class="table table-striped table-bordered" style="margin-left: auto; margin-right: auto;" id="'+n+'overview-table"/>')
;var g=["KBase ID","Name","Object ID","Source","Source ID","Type"],u=[r.id,r.name,a.ws_id,r.source,r.source_id,r.type],p=e("#"+n+"overview-table")
;for(i=0;i<u.length;i+=1)p.append("<tr><td>"+g[i]+"</td> <td>"+u[i]+"</td></tr>")
;e("#"+n+"contigs").append('<table id="'+n+'contigs-table" class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>')
;var h={sPaginationType:"full_numbers",iDisplayLength:10,aoColumns:[{
sTitle:"Contig name",mData:"name"},{sTitle:"Length",mData:"length"}],
aaData:r.contigs.map((function(e){return{name:e.id,length:e.length}})),
oLanguage:{sSearch:"Search contig:",sEmptyTable:"No contigs found."}}
;e("#"+n+"contigs-table").dataTable(h)})).catch((function(e){var t
;s.empty(),t=e.error&&e.error.message?e.error.message:e.message?e.message:e,
s.append('<div class="alert alert-danger"><p>[Error] '+t+"</p></div>")})),this},
getData:function(){return{type:"NarrativeTempCard",id:this.ws_id,
workspace:this.ws_name,title:"Contig-set"}},loggedInCallback:function(e,t){
return this.token=t.token,this},loggedOutCallback:function(e,t){
return this.token=null,this},uuid:function(){
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){
var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}))}})}));