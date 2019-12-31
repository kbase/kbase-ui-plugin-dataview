define(["./reactive","./minidom","kb_common/html"],(function(n,t,e){"use strict"
;return{make:function(n){return function(n){var e=n.node,a=t.make({node:e}),i={}
;return{setLayout:function(n){
e.innerHTML=n,a.findNodes("[data-place]").forEach((function(n){
var t=n.getAttribute("data-place");i[t]=n}))}}}(n)}}}));