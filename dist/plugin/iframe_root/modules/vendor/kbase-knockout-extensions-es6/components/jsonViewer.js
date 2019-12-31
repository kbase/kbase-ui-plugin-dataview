define(["knockout","numeral","kb_lib/html","../registry","../lib/generators","css!./jsonViewer.css"],(function(e,t,a,n,i){
"use strict";const l=a.tag,o=l("div"),s=l("span");function r(e,a){
return Number.isInteger(a)?/_id$/.exec(e)?a:t(a).format("0,0"):a}class d{
constructor(t){this.value=t.value,this.browsable=function(t,a,n){
switch(typeof a){case"string":return{type:typeof a,key:t,value:a,
display:String(a)};case"number":return{type:typeof a,key:t,value:r(t,a),
display:String(a)};case"boolean":return{type:typeof a,key:t,value:a,
display:String(a)};case"object":return null===a?{type:"null",key:t,value:a,
display:"null"}:a instanceof Array?{type:"array",key:t,show:e.observable(n||!1),
value:a.map((function(e){return e}))}:{type:"object",show:e.observable(n||!1),
key:t,value:Object.keys(a).map((function(e){return{key:e,value:a[e]}
})).sort((function(e,t){return e.key<t.key?-1:e.key>t.key?1:0}))};default:
return{type:"unknown",key:t,value:"type not handled: "+typeof a,
display:"type not handled: "+typeof a}}
}(t.key,this.value,t.open),this.open=t.open,this.key=t.key,this.level=t.level||0
}}function y(e){return s({class:"fa fa-"+e,style:{fontSize:"80%"}})}
return n.registerComponent((function(){return{viewModel:d,template:o({dataBind:{
style:{"margin-left":'String(level * 5) + "px"'},with:"browsable"}
},i.switch("type",[['"object"',o({},[i.if("value.length === 0",o({style:{
color:"gray"}},[s({class:"mini-spacer"}),s({dataBind:{text:"key"}
}),": (empty)"]),[o([s({dataBind:{click:"function (data) {show(!show());}",
style:{color:'show() ? "red" : "green"'}},class:"mini-button"},[s({dataBind:{
ifnot:"show"}},y("plus")),s({dataBind:{if:"show"}},y("minus"))])," ",s({
dataBind:{text:"key"}}),":"]),i.if("show",o({dataBind:{foreach:"value"}},[o({
dataBind:{component:{name:'"generic/json-viewer"',params:{key:"key",
value:"value",level:"$component.level + 1"}}}
})]))])])],['"array"',o({},[i.if("value.length === 0",s({style:{color:"gray"}
},[s({class:"mini-spacer"}),s({dataBind:{text:"key"}}),": (empty)"]),[o([o({
dataBind:{click:"function (data) {show(!show());}",style:{
color:'show() ? "red" : "green"'}},class:"mini-button"},[s({dataBind:{
ifnot:"show"}},y("plus")),s({dataBind:{if:"show"}},y("minus"))]),s({dataBind:{
text:"key"}}),":"]),i.if("show",o({dataBind:{foreach:"value"}},[o({dataBind:{
component:{name:'"generic/json-viewer"',params:{key:'"[" + $index() + "]"',
value:"$data",level:"$component.level + 1"}}}})]))])])],['"string"',o([s({
class:"mini-spacer"}),s({dataBind:{text:"key"}}),": ",s({dataBind:{text:"value"
},style:{fontWeight:"bold",color:"green"}})])],['"number"',o([s({
class:"mini-spacer"}),s({dataBind:{text:"key"}}),": ",s({dataBind:{
text:"String(value)"},style:{fontWeight:"bold",fontFamily:"monospace",
color:"blue"}})])],['"boolean"',o([s({class:"mini-spacer"}),s({dataBind:{
text:"key"}}),": ",s({dataBind:{text:'value ? "true" : "false"'},style:{
fontWeight:"bold",color:"orange"}})])],['"null"',o([s({class:"mini-spacer"}),s({
dataBind:{text:"key"}}),": ",s({dataBind:{text:"display"},style:{
fontWeight:"bold",color:"gray"}})])],['"unknown"',o([s({class:"mini-spacer"
}),s({dataBind:{text:"key"}}),": ",s({dataBind:{text:"value"},style:{
fontWeight:"bold",color:"red"}})])]]))}}))}));