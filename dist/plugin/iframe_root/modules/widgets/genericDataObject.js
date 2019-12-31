define(["kb_common/html"],(function(t){"use strict";function n({runtime:n}){
var e,i,c=t.tag("div"),a=t.tag("p");return{attach:function(t){
i=(e=t).appendChild(document.createElement("div"))},start:function(t){
i.innerHTML=c([a("This object does not have a specific visualization")])},
detach:function(){i&&e.removeChild(i)}}}return{make:function(t){return n(t)}}
}));