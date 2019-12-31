define(["kb_lib/html"],(function(n){"use strict";return{make:function(e){
return function(e){var t={},r=n.tag("div");function d(e){
if(t[e])throw new Error("Place already defined: "+e);var r=n.genId()
;return t[e]={id:r},r}function i(n){var e=t[n]
;if(void 0===e)throw new Error("Place not defined: "+n);return e}function o(n){
var e=i(n)
;if(e.node||(e.node=document.getElementById(e.id)),!e.node)throw new Error("Place does not exist in the DOM: "+e+" : "+e.id)
;return e.node}return{add:d,get:i,getNode:o,setContent:function(n,e){
o(n).innerHTML=e},addPlaceHolder:function(n){return r({id:d(n)})},
appendContent:function(n,e){var t=o(n),r=document.createElement("div")
;r.innerHTML=e,t.appendChild(r.firstChild)}}}()}}}));