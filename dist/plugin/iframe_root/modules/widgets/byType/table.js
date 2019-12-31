define(["knockout","kb_lib/html","kb_knockout/registry"],(function(t,e,n){
"use strict"
;var r=e.tag,a=r("div"),o=r("span"),i=r("input"),l=r("button"),s=r("label"),c=r("select"),u=r("table"),d=r("colgroup"),f=r("col"),m=r("thead"),p=r("tbody"),b=r("tr"),g=r("th"),y=r("td")
;function v(e){var n=e.table.columns,r={},a=[];n.forEach((function(e,n){e.pos=n,
r[e.name]=e,e.search&&a.push({name:e.name,pos:n,search:t.observable()})}))
;var o=e.table.rows.map((function(t,e){return{naturalOrder:e,
row:t.map((function(t,e){var r=n[e];return{value:t,
formatted:r.format?r.format(t):t,style:r.style}}))}
})),i=t.observableArray(o),l=e.title,s=t.observable("10"),c=t.pureComputed((function(){
return 0===s().length?10:parseInt(s())})),u=i().length,d=t.observable()
;d.subscribe((function(t){t.length>0&&h(0)}));var f=t.pureComputed((function(){
if(d())return d().toLowerCase()
})),m=t.observable(),p=["asc","desc"].map((function(t){return{label:t,value:t}
})),b=t.observable("desc");function g(){if(m()){var t=r[m()]
;i.sort((function(e,n){var r,a=e.row[t.pos].value,o=n.row[t.pos].value
;switch(t.type){case"string":case"date":case"number":r=a<o?-1:a>o?1:0}
return"desc"===b()?-1*r:r}))}}m.subscribe((function(){g()
})),b.subscribe((function(){g()})),g();var y=i.filter((function(t){var e=f()
;if(!e||0===e.length)return!0;if(0===a.length)return!0;for(var n in a){
var r=a[n];if(t.row[r.pos].value.toLowerCase().indexOf(e)>=0)return!0}return!1
})),v=t.pureComputed((function(){return y().length
})),h=t.observable(0),x=t.pureComputed((function(){
return Math.min(h()+c(),v())-1})),B=t.pureComputed((function(){
return y().length===u?"":"found "+y().length+" of "+u
})),S=y.filter((function(t,e){if(e()>=h()&&e()<=x())return!0
})),w=t.pureComputed((function(){var t=v()-x()-1
;return 0===t?"":"and "+t+" more..."}));function k(){h(0)}function C(){
h(Math.max(v()-c(),0))}var $=[5,10,20,50,100].map((function(t){return{
label:String(t),value:String(t)}}));return{table:S,columns:n,title:l,
filteredTable:y,pageStart:h,pageEnd:x,len:v,total:u,doPrev:function(){
h()>0&&h(h()-1)},doNext:function(){h()+c()<v()&&h(h()+1)},doFirst:k,doLast:C,
doPrevPage:function(){h()>c()?h(h()-c()):k()},doNextPage:function(){
x()<v()-c()?h(h()+c()):C()},search:d,searchSummary:B,pageSizeInput:s,
pageSizes:$,doSortByColumn:function(t){
m()===t.name?"asc"===b()?b("desc"):b("asc"):(m(t.name),b("desc"))},sortBy:m,
more:w,sortDirections:p,sortDirection:b,getColor:function(t){
var e=(9+t%7).toString(16);return"#"+e+e+e},username:e.username,
currentUsername:e.currentUsername,doCancelSort:function(){
m(null),b(null),i.sort((function(t,e){return e.naturalOrder-t.naturalOrder}))}}}
function h(t){return o({class:"fa fa-"+t})}function x(t,e){return l({dataBind:{
click:e},class:"btn btn-default"},h(t))}return n.registerComponent((function(){
return{viewModel:v,template:a([a([a({style:{margin:"0 0 4px 0"}},a({
class:"btn-toolbar"},[a({class:"btn-group form-inline",style:{width:"350px"}
},[x("step-backward","doFirst"),x("backward","doPrevPage"),x("chevron-left","doPrev"),x("chevron-right","doNext"),x("forward","doNextPage"),x("step-forward","doLast"),o({
style:{display:"inline-block",verticalAlign:"middle",margin:"6px 0 0 4px"}},[o({
dataBind:{text:"pageStart() + 1"}})," to ",o({dataBind:{text:"pageEnd() + 1"}
})," of ",o({dataBind:{text:"len()"},style:{marginRight:"10px",
verticalAlign:"middle"}})])]),a({class:"btn-group form-inline"},[s({style:{
marginBottom:"0"}},[c({dataBind:{value:"pageSizeInput",options:"pageSizes",
optionsText:'"label"',optionsValue:'"value"'},class:"form-control"
})," rows per page"])]),a({class:"xform-inline",dataBind:{if:"sortBy()"},style:{
display:"inline-block",marginLeft:"20px"}},[l({type:"button",
class:"btn btn-danger btn-sm",dataBind:{click:"doCancelSort"}},h("times")),o({
style:{display:"inline-block",verticalAlign:"middle",margin:"6px 0 0 4px"}
},["sorting by ",o({dataBind:{text:"sortBy"},style:{fontWeight:"bold"}})," ",o({
dataBind:{text:"sortDirection"},style:{fontWeight:"bold"}})])]),a({
class:"btn-group form-inline pull-right"},[o({style:{verticalAlign:"middle"}
},[i({dataBind:{textInput:"search"},class:"form-control",style:{
verticalAlign:"middle"},placeholder:"search"}),o({dataBind:{
visible:"searchSummary && searchSummary().length > 0",text:"searchSummary"},
style:{marginLeft:"10px"}})])])])),u({class:"table"},[d({},[f({style:{
width:"5em"}}),"\x3c!-- ko foreach: columns --\x3e",f({dataBind:{attr:{
width:"width"}}}),"\x3c!-- /ko --\x3e"]),m(b([g({style:{fontStyle:"italic",
color:"gray"}},"#"),"\x3c!-- ko foreach: columns --\x3e",g(o({dataBind:{
click:"$component.doSortByColumn",style:"$data.columnStyle"},style:{
cursor:"pointer"}},[a([o({dataBind:{text:"label"}}),o({dataBind:{
visible:"$component.sortBy() === name",css:{
"fa-chevron-down":'$component.sortDirection() === "desc"',
"fa-chevron-up":'$component.sortDirection() === "asc"'}},class:"fa"
})])])),"\x3c!-- /ko --\x3e"])),p({style:{maxHeight:"500px"},dataBind:{
foreach:"table"}},b({},[y({dataBind:{
text:"$index() + $component.pageStart() + 1"},style:{fontStyle:"italic",
color:"gray"}}),"\x3c!-- ko foreach: $data.row --\x3e",y({dataBind:{
text:"$data.formatted",style:"$data.style"}}),"\x3c!-- /ko --\x3e"]))]),a({
dataBind:{visible:"more().length > 0",text:"more"},style:{textAlign:"center"}
})]),a({dataBind:{if:"len() === 0"}},"Sorry, no rows")])}}))}));