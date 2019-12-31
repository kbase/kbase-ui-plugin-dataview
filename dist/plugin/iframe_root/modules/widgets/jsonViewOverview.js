define(["kb_common/html","highlight","numeral"],(function(t,n,e){"use strict"
;function i(n){n.runtime
;var e,i=t.tag,r=i("div"),a=i("table"),o=i("tr"),c=i("td"),u=i("a");return{
attach:function(n){(e=n).innerHTML=r({class:"well"
},t.loading("Loading object overview..."))},start:function(t){e.innerHTML=r({
class:"well"},function(t){var n=function(t){
return[t.info[6],t.info[0],t.info[4]].join("/")}(t);return a({
class:"table table-striped"},[o([c("Dataview"),c(u({href:"/#dataview/"+n,
target:"_parent"},n))])])}(t.object))}}}return{make:function(t){return i(t)}}
}));