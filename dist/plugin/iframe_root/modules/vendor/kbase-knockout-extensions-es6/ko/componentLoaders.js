define(["knockout"],(function(n){"use strict";n.components.loaders.unshift({
loadTemplate:function(n,e,t){if(!e.svg)return void t(null)
;const o=document.createElementNS("http://www.w3.org/2000/svg","svg")
;o.innerHTML=e.svg,t(o.childNodes)}})}));