define(["kb_lib/html","kbaseUI/widget/widgetSet","utils"],(function(t,e,i){
"use strict";function n(e){
var n,r,a=e.runtime,u=a.service("widget").newWidgetSet(),d=t.tag;return{
init:function(t){return r=function(){var t=d("div");return t({
class:"container-fluid",style:{width:"100%"},dataKBTesthookPlugin:"dataview"
},[t({class:"row"},[t({class:"col-md-8"},[t({
id:u.addWidget("kb_dataview_jsonView")})]),t({class:"col-md-4"},[t({
id:u.addWidget("kb_dataview_jsonViewOverview")})])])])
}(),a.send("ui","setTitle","JSON View"),u.init(t)},attach:function(t){
return(n=t).innerHTML=r,u.attach(n)},start:function(t){
return i.getObject(a,t).then((function(t){return u.start({object:t})}))},
stop:function(){return n.innerHTML="",u.stop()}}}return{make:function(t){
return n(t)}}}));