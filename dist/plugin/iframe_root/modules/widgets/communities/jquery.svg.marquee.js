define(["jquery"],(function(e){"use strict"
;var t="http://www.w3.org/2000/svg",r=document.createElementNS(t,"svg").createSVGPoint()
;function a(t,r,a){
var s=1*r.getAttribute("x"),o=1*r.getAttribute("y"),n=1*r.getAttribute("width"),i=1*r.getAttribute("height")
;t(e("#"+a.parentNode.id).svg("get").plot.pointsInBounds(s,o,s+n,o+i))}
function s(e,t,r){var a=[t.x,r.x].sort(n),s=[t.y,r.y].sort(n)
;e.setAttribute("x",a[0]),
e.setAttribute("y",s[0]),e.setAttribute("width",a[1]-a[0]),
e.setAttribute("height",s[1]-s[0])}function o(e,t){
return r.x=t.clientX,r.y=t.clientY,r.matrixTransform(e.getScreenCTM().inverse())
}function n(e,t){return e-t}function i(e){
for(var t=e.split(/[, ]+/),r=0;r<t.length;r++)t[r]=parseFloat(t[r]),
isNaN(t[r])&&(t[r]=0);if(t.length%2==1){var a=t.length
;for(r=0;r<a;r++)t.push(t[r])}return t}function l(e){
for(var t=e.split(/[, ]+/),r=0;r<t.length;r++)t[r]=parseFloat(t[r]),
isNaN(t[r])&&(t[r]=0);for(;t.length<4;)t.push(0);return t}function d(t,r){
"object"==typeof(t=t||"")&&(t=t.nodeValue);var a=e.extend({translateX:0,
translateY:0,scaleX:0,scaleY:0,rotateA:0,rotateX:0,rotateY:0,skewX:0,skewY:0,
matrix:[0,0,0,0,0,0]},r||{});a.order=""
;for(var s=/([a-zA-Z]+)\(\s*([+-]?[\d\.]+)\s*(?:[\s,]\s*([+-]?[\d\.]+)\s*(?:[\s,]\s*([+-]?[\d\.]+)\s*(?:[\s,]\s*([+-]?[\d\.]+)\s*[\s,]\s*([+-]?[\d\.]+)\s*[\s,]\s*([+-]?[\d\.]+)\s*)?)?)?\)/g,o=s.exec(t);o;){
switch(o[1]){case"translate":
a.order+="t",a.translateX=parseFloat(o[2]),a.translateY=o[3]?parseFloat(o[3]):0
;break;case"scale":
a.order+="s",a.scaleX=parseFloat(o[2]),a.scaleY=o[3]?parseFloat(o[3]):a.scaleX
;break;case"rotate":
a.order+="r",a.rotateA=parseFloat(o[2]),a.rotateX=o[3]?parseFloat(o[3]):0,
a.rotateY=o[4]?parseFloat(o[4]):0;break;case"skewX":
a.order+="x",a.skewX=parseFloat(o[2]);break;case"skewY":
a.order+="y",a.skewY=parseFloat(o[2]);break;case"matrix":
a.order+="m",a.matrix=[parseFloat(o[2]),parseFloat(o[3]),parseFloat(o[4]),parseFloat(o[5]),parseFloat(o[6]),parseFloat(o[7])]
}o=s.exec(t)}
if("m"===a.order&&Math.abs(a.matrix[0])===Math.abs(a.matrix[3])&&0!==a.matrix[1]&&Math.abs(a.matrix[1])===Math.abs(a.matrix[2])){
var n=180*Math.acos(a.matrix[0])/Math.PI
;n=a.matrix[1]<0?360-n:n,a.order="rt",a.rotateA=n,
a.rotateX=a.rotateY=0,a.translateX=a.matrix[4],a.translateY=a.matrix[5]}return a
}window.trackMarquee=function(e,r,n){
e.addEventListener("mousedown",(function(i){
var l=o(e,i),d=document.createElementNS(t,"rect");function u(t){var r=o(e,t)
;s(d,l,r),n&&a(n,d)}d.setAttribute("class","marquee"),s(d,l,l),e.appendChild(d),
document.documentElement.addEventListener("mousemove",u,!1),
document.documentElement.addEventListener("mouseup",(function t(){
document.documentElement.removeEventListener("mousemove",u,!1),
document.documentElement.removeEventListener("mouseup",t,!1),
e.removeChild(d),r&&a(r,d,e)}),!1)}),!1)
},e.each(["x","y","width","height","rx","ry","cx","cy","r","x1","y1","x2","y2","stroke-width","strokeWidth","opacity","fill-opacity","fillOpacity","stroke-opacity","strokeOpacity","stroke-dashoffset","strokeDashOffset","font-size","fontSize","font-weight","fontWeight","letter-spacing","letterSpacing","word-spacing","wordSpacing"],(function(t,r){
var a=r.charAt(0).toUpperCase()+r.substr(1)
;e.cssProps&&(e.cssProps["svg"+a]=e.cssProps["svg-"+r]=r),
e.fx.step["svg"+a]=e.fx.step["svg-"+r]=function(t){
var s=e.svg._attrNames[r]||r,o=t.elem.attributes.getNamedItem(s);if(!t.set){
t.start=o?parseFloat(o.nodeValue):0
;var n=e.fn.jquery>="1.6"?"":t.options.curAnim["svg"+a]||t.options.curAnim["svg-"+r]
;/^[+-]=/.exec(n)&&(t.end=t.start+parseFloat(n.replace(/=/,""))),
e(t.elem).css(s,""),t.set=!0}
var i=t.pos*(t.end-t.start)+t.start+("%"===t.unit?"%":"")
;o?o.nodeValue=i:t.elem.setAttribute(s,i)}
})),e.fx.step.svgStrokeDashArray=e.fx.step["svg-strokeDashArray"]=e.fx.step["svgStroke-dasharray"]=e.fx.step["svg-stroke-dasharray"]=function(t){
var r=t.elem.attributes.getNamedItem("stroke-dasharray");if(!t.set){
t.start=i(r?r.nodeValue:"")
;var a=e.fn.jquery>="1.6"?t.end:t.options.curAnim.svgStrokeDashArray||t.options.curAnim["svg-strokeDashArray"]||t.options.curAnim["svgStroke-dasharray"]||t.options.curAnim["svg-stroke-dasharray"]
;if(t.end=i(a),/^[+-]=/.exec(a)){
if((a=a.split(/[, ]+/)).length%2==1)for(var s=a.length,o=0;o<s;o++)a.push(a[o])
;for(o=0;o<a.length;o++)/^[+-]=/.exec(a[o])&&(t.end[o]=t.start[o]+parseFloat(a[o].replace(/=/,"")))
}t.set=!0}var n=e.map(t.start,(function(e,r){return t.pos*(t.end[r]-e)+e
})).join(",");r?r.nodeValue=n:t.elem.setAttribute("stroke-dasharray",n)
},e.fx.step.svgViewBox=e.fx.step["svg-viewBox"]=function(t){
var r=t.elem.attributes.getNamedItem("viewBox");if(!t.set){
t.start=l(r?r.nodeValue:"")
;var a=e.fn.jquery>="1.6"?t.end:t.options.curAnim.svgViewBox||t.options.curAnim["svg-viewBox"]
;if(t.end=l(a),/^[+-]=/.exec(a)){for(a=a.split(/[, ]+/);a.length<4;)a.push("0")
;for(var s=0;s<4;s++)/^[+-]=/.exec(a[s])&&(t.end[s]=t.start[s]+parseFloat(a[s].replace(/=/,"")))
}t.set=!0}var o=e.map(t.start,(function(e,r){return t.pos*(t.end[r]-e)+e
})).join(" ");r?r.nodeValue=o:t.elem.setAttribute("viewBox",o)
},e.fx.step.svgTransform=e.fx.step["svg-transform"]=function(e){
var t=e.elem.attributes.getNamedItem("transform")
;e.set||(e.start=d(t?t.nodeValue:""),e.end=d(e.end,e.start),e.set=!0)
;for(var r="",a=0;a<e.end.order.length;a++)switch(e.end.order.charAt(a)){
case"t":
r+=" translate("+(e.pos*(e.end.translateX-e.start.translateX)+e.start.translateX)+","+(e.pos*(e.end.translateY-e.start.translateY)+e.start.translateY)+")"
;break;case"s":
r+=" scale("+(e.pos*(e.end.scaleX-e.start.scaleX)+e.start.scaleX)+","+(e.pos*(e.end.scaleY-e.start.scaleY)+e.start.scaleY)+")"
;break;case"r":
r+=" rotate("+(e.pos*(e.end.rotateA-e.start.rotateA)+e.start.rotateA)+","+(e.pos*(e.end.rotateX-e.start.rotateX)+e.start.rotateX)+","+(e.pos*(e.end.rotateY-e.start.rotateY)+e.start.rotateY)+")"
;break;case"x":
r+=" skewX("+(e.pos*(e.end.skewX-e.start.skewX)+e.start.skewX)+")";case"y":
r+=" skewY("+(e.pos*(e.end.skewY-e.start.skewY)+e.start.skewY)+")";break
;case"m":
for(var s="",o=0;o<6;o++)s+=","+(e.pos*(e.end.matrix[o]-e.start.matrix[o])+e.start.matrix[o])
;r+=" matrix("+s.substr(1)+")"}
t?t.nodeValue=r:e.elem.setAttribute("transform",r)
},e.each(["fill","stroke"],(function(t,r){
var a=r.charAt(0).toUpperCase()+r.substr(1)
;e.fx.step["svg"+a]=e.fx.step["svg-"+r]=function(t){if(!t.set){
t.start=e.svg._getColour(t.elem,r);var a="none"===t.end
;t.end=a?e.svg._getColour(t.elem.parentNode,r):e.svg._getRGB(t.end),
t.end[3]=a,e(t.elem).css(r,""),t.set=!0}
var s=t.elem.attributes.getNamedItem(r),o="rgb("+[Math.min(Math.max(parseInt(t.pos*(t.end[0]-t.start[0])+t.start[0],10),0),255),Math.min(Math.max(parseInt(t.pos*(t.end[1]-t.start[1])+t.start[1],10),0),255),Math.min(Math.max(parseInt(t.pos*(t.end[2]-t.start[2])+t.start[2],10),0),255)].join(",")+")"
;o=t.end[3]&&1===t.state?"none":o,s?s.nodeValue=o:t.elem.setAttribute(r,o)}
})),e.svg._getColour=function(t,r){var a;t=e(t);do{
if(""!==(a=t.attr(r)||t.css(r))&&"none"!==a||t.hasClass(e.svg.markerClassName))break
}while(t=t.parent());return e.svg._getRGB(a)},e.svg._getRGB=function(t){var r
;return t&&t.constructor===Array?3===t.length||4===t.length?t:u.none:(r=/^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)jQuery/.exec(t))?[parseInt(r[1],10),parseInt(r[2],10),parseInt(r[3],10)]:(r=/^rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)jQuery/.exec(t))?[2.55*parseFloat(r[1]),2.55*parseFloat(r[2]),2.55*parseFloat(r[3])]:(r=/^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})jQuery/.exec(t))?[parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16)]:(r=/^#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])jQuery/.exec(t))?[parseInt(r[1]+r[1],16),parseInt(r[2]+r[2],16),parseInt(r[3]+r[3],16)]:u[e.trim(t).toLowerCase()]||u.none
};var u={"":[255,255,255,1],none:[255,255,255,1],aliceblue:[240,248,255],
antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],
azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],
blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],
brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],
chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],
cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],
cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],
darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],
darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],
darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],
darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],
darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],
darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],
deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],
dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],
forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],
ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],
gray:[128,128,128],grey:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],
honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],
indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],
lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],
lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],
lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],
lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],
lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],
lightskyblue:[135,206,250],lightslategray:[119,136,153],
lightslategrey:[119,136,153],lightsteelblue:[176,196,222],
lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],
linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],
mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],
mediumpurple:[147,112,219],mediumseagreen:[60,179,113],
mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],
mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],
midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],
moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],
oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],
orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],
palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],
palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],
peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],
powderblue:[176,224,230],purple:[128,0,128],red:[255,0,0],
rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],
salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],
seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],
skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],
slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],
steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],
tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],
wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],
yellow:[255,255,0],yellowgreen:[154,205,50]}}));