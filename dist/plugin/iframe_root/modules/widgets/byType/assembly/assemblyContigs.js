define(["bluebird","numeral","knockout","../queryService","kb_common/html","kb_lib/htmlBootstrapBuilders","../table","datatables_bootstrap"],(function(t,n,e,r,i,a,o){
"use strict";var l=(0,i.tag)("div");function u(u){var c,m=u.runtime,s=r({
runtime:m});return{attach:function(n){return t.try((function(){
(c=n).innerHTML=l([l({dataElement:"summary"},l({style:{textAlign:"center"}
},i.loading())),l({dataElement:"contigs"})])}))},start:function(t){
return function(t){var n={assembly:{_args:{ref:t},contig_lengths:{},
contig_gc_content:{}}};return s.query(n)}(t.objectRef).then((function(t){
!function(t){var n=c.querySelector('[data-element="summary"]');n.innerHTML=l({
dataBind:{component:{name:o.quotedName(),params:{table:"table",showRowNumber:!0}
}}}),e.applyBindings({table:t},n)}(function(t){return{
rows:Object.keys(t.assembly.contig_lengths).map((function(n){
return[n,t.assembly.contig_lengths[n],t.assembly.contig_gc_content[n]]})),
columns:[{name:"id",label:"Id",type:"string",width:"30%",search:!0,style:{
fontFamily:"sans-serif"}},{name:"contigLength",label:"Contig Length (bp)",
type:"number",width:"35%",format:function(t){return n(t).format("0,0")},style:{
fontFamily:"monospace",textAlign:"right"},columnStyle:{textAlign:"right"}},{
name:"gc",label:"GC (%)",type:"number",width:"30%",format:function(t){
return(100*t).toFixed(2)},style:{fontFamily:"monospace",textAlign:"right"},
columnStyle:{textAlign:"right"}}]}}(t))})).catch(t=>{!function(t){
c.innerHTML=a.buildPanel({type:"danger",title:"Error",body:t.message})}(t)})},
stop:function(){return t.try((function(){return null}))},detach:function(){
return t.try((function(){return null}))}}}return{make:function(t){return u(t)}}
}));