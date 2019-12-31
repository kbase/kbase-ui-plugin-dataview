define(["kb_knockout/registry","kb_knockout/lib/generators","kb_knockout/lib/viewModelBase","kb_lib/html"],(function(t,e,a,s){
"use strict"
;const c=s.tag,r=c("span"),i=c("i"),n=c("p"),l=c("a"),o=c("div"),d=c("table"),b=c("thead"),f=c("tr"),k=c("th"),p=c("tbody"),u=c("td")
;class y extends a{constructor(t){super(t),this.createdObjects=t.createdObjects}
}function g(){return o({style:{padding:"8px"}
},e.if("createdObjects && createdObjects.length > 0",d({
class:"table kb-table-lite"},[b(f([k({style:{width:"2em"}
}),k("Type"),k("Object"),k("Description")])),p({dataBind:{
foreach:"createdObjects"}},f([u({style:{textAlign:"center"}},r({
class:"fa-stack",style:{marginRight:"10px"}},[i({
class:"fa fa-circle fa-stack-2x",dataBind:{style:{color:"icon.color"}}}),i({
class:"fa-inverse fa-stack-1x",dataBind:{class:'icon.classes.join(" ")'}
})])),u([l({dataBind:{text:"type",attr:{href:'"/#spec/type/" + fullType'}},
target:"_blank"})]),u(l({dataBind:{text:"name",attr:{href:'"/#dataview/" + ref'}
},target:"_blank"})),u({dataBind:{text:"description"}})]))]),n({style:{
fontStyle:"italic"}},"No objects created for this report")))}
return t.registerComponent((function(){return{viewModel:y,template:g()}}))}));