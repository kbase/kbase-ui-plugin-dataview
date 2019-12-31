define([],(function(){"use strict";return{make:function(n){return function(n){
var e,i=n.node;function t(){return i.classList.remove("hidden"),e="showing",!0}
function s(){return i.classList.add("hidden"),e="hidden",!0}
return n.show?t():n.hide?s():t(),{show:t,hide:s,toggle:function(){switch(e){
case"hidden":t();break;case"showing":s()}}}}(n)}}}));