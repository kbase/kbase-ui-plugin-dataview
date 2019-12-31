define(["places"],(function(e){"use strict";return{make:function(n){
return function(n){var t=n.node,i=e.make(t),o="showing";function r(){
t.classList.add("hidden")}function c(){t.classList.remove("hidden")}return{
findNode:function(e){return t.querySelector(e)},findNodes:function(e,n){var o
;n?o=i.get(e):(o=t,n=e);var r=o.querySelectorAll(n)
;return null===r?[]:Array.prototype.slice.call(r)},setHtml:function(e,n){
"string"==typeof e&&(n=e,e=t),e.innerHTML=n},addPlace:i.add,getPlace:i.get,
getPlaceNode:i.getNode,show:c,hide:r,toggle:function(){switch(o){case"hidden":
c()&&(o="showing");break;case"showing":r()&&(o="hidden")}}}}(n)}}}));