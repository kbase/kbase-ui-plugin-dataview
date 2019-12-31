define([],(function(){"use strict";function e(e){
return["{",Object.keys(e).map(o=>o+":"+e[o]).join(","),"}"].join("")}
function o(o){return o instanceof Array?function(e){
return["{",e.map(e=>e+":"+e).join(","),"}"].join("")}(o):e(o)}function n(e,o,n){
return n?["\x3c!-- ko if: "+e+" --\x3e",o,"\x3c!-- /ko --\x3e","\x3c!-- ko ifnot: "+e+" --\x3e",n,"\x3c!-- /ko --\x3e"]:["\x3c!-- ko if: "+e+" --\x3e",o,"\x3c!-- /ko --\x3e"]
}function x(e,o){return["\x3c!-- ko with: "+e+"--\x3e",o,"\x3c!-- /ko --\x3e"]}
return{if:n,ifnot:function(e,o,n){
return n?["\x3c!-- ko ifnot: "+e+" --\x3e",o,"\x3c!-- /ko --\x3e","\x3c!-- ko if: "+e+" --\x3e",n,"\x3c!-- /ko --\x3e"]:["\x3c!-- ko ifnot: "+e+" --\x3e",o,"\x3c!-- /ko --\x3e"]
},plural:function(e,o,x){return n(e+" === 1",o,x)},foreach:function(o,n){
return"object"==typeof o&&(o=e(o)),
["\x3c!-- ko foreach: "+o+" --\x3e",n,"\x3c!-- /ko --\x3e"]},
foreachAs:function(e,o,n){
return["\x3c!-- ko foreach: {data: "+e+', as: "'+o+'"} --\x3e',n,"\x3c!-- /ko --\x3e"]
},let:function(e,o){
return["\x3c!-- ko let: "+("{"+Object.keys(e).map(o=>'"'+o+'":'+e[o]).join(", ")+"}")+"--\x3e",o,"\x3c!-- /ko --\x3e"]
},with:x,switch:function(e,o){
return["\x3c!-- ko switch: "+e+" --\x3e",o.map(e=>["\x3c!-- ko case: ",e[0]," --\x3e",e[1],"\x3c!-- /ko --\x3e"]),"\x3c!-- /ko --\x3e"]
},ifLet:function(e,o){
const n=[],x="{"+Object.keys(e).map(o=>(n.push(e[o]),'"'+o+'":'+e[o])).join(", ")+"}"
;return["\x3c!-- ko if: "+("( "+n.map(e=>"("+e+")").join(" && ")+" )")+" --\x3e","\x3c!-- ko let: "+x+"--\x3e",o,"\x3c!-- /ko --\x3e","\x3c!-- /ko --\x3e"]
},text:function(e){return["\x3c!-- ko text: "+e+" --\x3e","\x3c!-- /ko --\x3e"]
},component:function(e){const n=o(e.params)
;return['\x3c!-- ko component: {name: "',e.name,'", params: ',n,"}--\x3e\x3c!-- /ko --\x3e"]
},component2:function(e){const n=o(e.params)
;return["\x3c!-- ko component: {name: ",e.name,", params: ",n,"}--\x3e\x3c!-- /ko --\x3e"]
},when:function(e,o){
return["\x3c!-- ko when: "+e+" --\x3e",o,"\x3c!-- /ko --\x3e"]},
ifWith:function(e,o){return n(e,x(e,o))},templateIf:function(e,o,n){
return n?["\x3c!-- ko template: {if: "+e+"} --\x3e",o,"\x3c!-- /ko --\x3e","\x3c!-- ko template: {ifnot: "+e+"} --\x3e",n,"\x3c!-- /ko --\x3e"]:["\x3c!-- ko template: {if: "+e+"} --\x3e",o,"\x3c!-- /ko --\x3e"]
}}}));