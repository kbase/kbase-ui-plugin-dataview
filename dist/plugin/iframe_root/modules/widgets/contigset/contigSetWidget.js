define(["bluebird","jquery","numeral","kb_common/html","kb_widget/bases/dataWidget","kb_service/client/workspace","datatables_bootstrap"],(function(e,t,n,a,i,r){
"use strict";function o(e){
return[e.workspaceId,e.objectId,e.objectVersion].filter((function(e){
if(e)return!0})).join("/")}function s(e,t){var n={
columns:["KBase ID","Name","Object ID","Source","Source ID","Type"],
rows:[[t.id,t.name,e.getState("params").objectId,t.source,t.source_id,t.type]],
classes:["table","table-striped","table-bordered"]};return a.makeTableRotated(n)
}function c(e,t){var n={columns:["Contig name","Length"],
rows:t.contigs.map((function(e){return[e.id,e.length]})),
classes:["table","table-striped","table-bordered"]};return a.makeTable(n)}
return{make:function(u){return function(u){return i.make({runtime:u.runtime,
title:"Contig Set Data View",on:{initialContent:function(){
return a.loading("Loading Contig Set data")},fetch:function(t){var n=this
;return e.try((function(){
return new r(u.runtime.getConfig("services.workspace.url"),{
token:n.runtime.service("session").getAuthToken()}).get_object_subset([{
ref:o(t),
included:["contigs/[*]/id","contigs/[*]/length","id","name","source","source_id","type"]
}]).then((function(e){n.setState("contigset",e[0].data)}))}))},
render:function(){var e,i=a.genId(),r=this.getState("contigset");if(r)return e={
id:i,tabs:[{label:"Overview",name:"overview",content:s(this,r)},{
label:"Contigs",name:"contigs",content:c(0,r)}]},{content:a.makeTabs(e),
after:function(){var e={sPaginationType:"full_numbers",iDisplayLength:10,
columnDefs:[{width:"80%",targets:0},{width:"20%",targets:1},{
render:function(e,t,a){return n(e).format("0,0")},targets:1},{
class:"text-right",targets:1}],initComplete:function(e){
var n=this.api(),a=n.data().length,i=n.page.len(),r=n.settings()[0].nTableWrapper
;a<=i&&(t(r).find(".dataTables_length").hide(),
t(r).find(".dataTables_filter").hide(),t(r).find(".dataTables_paginate").hide(),
t(r).find(".dataTables_info").hide())},oLanguage:{sSearch:"Search contig:",
sEmptyTable:"No contigs found."}}
;t("#"+i+' .tab-content [data-name="contigs"] table').dataTable(e)}}}}})}(u)}}
}));