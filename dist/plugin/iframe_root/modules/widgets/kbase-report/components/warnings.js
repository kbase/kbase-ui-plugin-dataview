define(["knockout","kb_knockout/registry","kb_knockout/lib/generators","kb_knockout/lib/viewModelBase","kb_lib/html"],(function(n,t,e,a,r){
"use strict";const i=r.tag,s=i("div"),o=i("p"),l=i("span");class g extends a{
constructor(n){super(n),this.warnings=n.warnings}}
return t.registerComponent((function(){return{viewModel:g,template:s({style:{
maxHeight:"100px",overflowY:"auto",margin:"0px 5px 5px 10px"}},[o([l({dataBind:{
text:"warnings.length"}
})," ",e.plural("warnings","Warning","Warnings")]),e.foreach("warnings",s({
style:{margin:"5px"}},[s({style:{margin:"0px 5px 5px 10px"}},l({
class:"label label-warning",dataBind:{text:"$data"}}))]))])}}))}));