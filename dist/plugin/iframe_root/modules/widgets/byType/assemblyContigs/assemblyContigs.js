define(["bluebird","numeral","knockout","../queryService","kb_common/html","../table","datatables_bootstrap"],(function(t,n,e,r,a,i){
"use strict";var o=(0,a.tag)("div");function u(u){var l,c=u.runtime,m=r({
runtime:c});return{attach:function(n){return t.try((function(){
(l=n).innerHTML=o([o({dataElement:"summary"},o({style:{textAlign:"center"}
},a.loading())),o({dataElement:"contigs"})])}))},start:function(t){
return function(t){var n={assembly:{_args:{ref:t},contig_lengths:{},
contig_gc_content:{}}};return m.query(n)}(t.objectRef).then((function(t){
!function(t){var n=l.querySelector('[data-element="summary"]');n.innerHTML=o({
dataBind:{component:{name:i.quotedName(),params:{table:"table",showRowNumber:!0}
}}}),e.applyBindings({table:t},n)}(function(t){return{
rows:Object.keys(t.assembly.contig_lengths).map((function(n){
return[n,t.assembly.contig_lengths[n],t.assembly.contig_gc_content[n]]})),
columns:[{name:"id",label:"Id",type:"string",width:"30%",search:!0,style:{
fontFamily:"sans-serif"}},{name:"contigLength",label:"Contig Length (bp)",
type:"number",width:"35%",format:function(t){return n(t).format("0,0")},style:{
fontFamily:"monospace",textAlign:"right"},columnStyle:{textAlign:"right"}},{
name:"gc",label:"GC (%)",type:"number",width:"30%",format:function(t){
return(100*t).toFixed(2)},style:{fontFamily:"monospace",textAlign:"right"},
columnStyle:{textAlign:"right"}}]}}(t))}))},stop:function(){
return t.try((function(){return null}))},detach:function(){
return t.try((function(){return null}))}}}return{make:function(t){return u(t)}}
}));