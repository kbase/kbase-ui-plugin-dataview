define(["knockout","kb_knockout/registry","kb_knockout/lib/generators","kb_knockout/lib/viewModelBase","kb_lib/html"],(function(t,e,n,i,a){
"use strict";const o=a.tag,r=o("p"),l=o("a"),s=o("div"),k=o("ul"),d=o("li")
;class c extends i{constructor(t){super(t),this.links=t.links}}function u(){
return s(n.if("links && links.length > 0",k({style:{},dataBind:{foreach:"links"}
},d([l({dataBind:{attr:{href:"$data.url"},text:"$data.label || $data.name"},
target:"_blank"}),n.if("$data.description",s({dataBind:{text:"$data.description"
}}))])),r({style:{fontStyle:"italic"}},"No links for this report")))}
return e.registerComponent((function(){return{viewModel:c,template:u()}}))}));