define(["kb_common/html","kb_common/domEvent","highlight","numeral"],(function(t,n,e,a){
"use strict";return{make:function(i){return function(i){i.runtime
;var c,l,o=!1,r=n.make(),s=t.tag,u=s("div"),d=s("button"),h=s("p"),f=s("pre"),g=s("code")
;function b(){o=!o,j()}function v(t){var n=JSON.stringify(t,!0,4)
;return f(g(e.highlight("json",n).value))}function m(t){
var n=JSON.stringify(t,!0,4);return f(g(e.highlight("json",n).value))}
function y(t){var n,i=JSON.stringify(t,!0,4),c=!0
;return i.length>1e4&&(o?(n=u([h(["Object is very large (",a(i.length).format("0.0b"),"), but being displayed anyway."]),h(["If the browser is misbehaving, refresh it or ",d({
class:"btn btn-default",id:r.addEvent("click",b)
},"Redisplay with the Object Truncated"),"."])]),
c=!1):(n=u([h(["Object is too large to display fully (",a(i.length).format("0.0b"),") truncated at 10K."]),h(["You may live dangerously and ",d({
class:"btn btn-default",id:r.addEvent("click",b)
},"Display the Entire Object Without Syntax Highlighting"),"."])]),
i=i.substr(0,1e4))),u([n,f(g(c?e.highlight("json",i).value:i))])}function j(){
r.detachEvents(),c.innerHTML=u({class:"container-fluid"},[u({class:"row"},[u({
class:"col-md-12"},[t.makePanel({title:"info",content:v(l.info)}),t.makePanel({
title:"provenance",content:m(l.provenance)}),t.makePanel({title:"data",
content:y(l.data)})])])]),r.attachEvents()}return u=s("div"),{
attach:function(n){(c=n).innerHTML=u({class:"container-fluid"},[u({class:"row"
},[u({class:"col-md-12"},u({class:"well"},t.loading("Loading object...")))])])},
start:function(t){l=t.object,j()},detach:function(){r.detachEvents()}}}(i)}}}));