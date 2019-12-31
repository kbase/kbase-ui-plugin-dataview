define(["bluebird","kb_common/html","kb_common/bootstrapUtils","../queryService","datatables_bootstrap"],(function(t,e,n,r){
"use strict";var a=e.tag,o=a("div"),i=a("span"),u=a("table"),c=a("tr"),s=a("td")
;function l(a){var l,d=a.runtime,_=r({runtime:d});function b(){return i({style:{
fontStyle:"italic",color:"gray"}},"n/a")}return{attach:function(e){
return t.try((function(){l=e.appendChild(document.createElement("div"))}))},
start:function(t){return l.innerHTML=o({style:{textAlign:"center"}
},e.loading()),function(t){var e={assembly:{_args:{ref:t},stats:{num_contigs:{},
gc_content:{},dna_size:{}}},workspace:{_args:{ref:t},data:{external_source:{},
external_source_id:{},external_source_origination_date:{}}}};return _.query(e)
}(t.objectRef).then((function(t){!function(t){l.innerHTML=u({
class:"table table-striped table-bordered table-hover",style:{margin:"auto auto"
}
},[c([s("Number of Contigs"),s(t.assembly.stats.num_contigs)]),c([s("Total GC Content"),s(String((100*t.assembly.stats.gc_content).toFixed(2))+"%")]),c([s("Total Length"),s(t.assembly.stats.dna_size+" bp")]),c([s("External Source"),s(t.workspace.external_source||b())]),c([s("External Source ID"),s(t.workspace.external_source_id||b())]),c([s("Source Origination Date"),s(t.workspace.external_source_origination_date||b())])])
}(t)})).catch((function(t){!function(t){l.innerHTML=n.buildPanel({type:"danger",
title:"Error",body:t.message})}(t)}))},stop:function(){return t.try((function(){
return null}))},detach:function(){return t.try((function(){return null}))}}}
return{make:function(t){return l(t)}}}));