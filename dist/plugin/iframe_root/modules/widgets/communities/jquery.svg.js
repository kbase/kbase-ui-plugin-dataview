define(["jquery"],(function(t){function e(){
this._settings=[],this._extensions=[],this.regional=[],this.regional[""]={
errorLoadingText:"Error loading",
notSupportedText:"This browser does not support SVG"
},this.local=this.regional[""],
this._uuid=(new Date).getTime(),this._renesis=function(t){try{
return!(!window.ActiveXObject||!new ActiveXObject(t))}catch(e){return!1}
}("RenesisX.RenesisCtrl")}function s(e,i){this._svg=e,this._container=i
;for(var s=0;s<t.svg._extensions.length;s++){var r=t.svg._extensions[s]
;this[r[0]]=new r[1](this)}}function r(){this._path=""}function n(){
this._parts=[]}function a(t){return t&&t.constructor===Array}function o(t){
return 0===t?0:Math.log(t)/Math.LN10}function l(t,e){
return Math.round(t*Math.pow(10,e))/Math.pow(10,e)}function _(){
this.regional=[],this.regional[""]={percentageText:"Percentage"
},this.region=this.regional[""]}function c(e){
for(var i in this._wrapper=e,this._drawNow=!1,t.svg.graphing._chartTypes){
this._chartType=t.svg.graphing._chartTypes[i];break}
this._chartOptions={},this._title={value:"",offset:25,settings:{
textAnchor:"middle"}},this._area=[.1,.1,.8,.9],this._chartFormat={fill:"none",
stroke:"black"
},this._gridlines=[],this._series=[],this._onstatus=null,this._chartCont=this._wrapper.svg(0,0,0,0,{
class_:"svg-graph"
}),this.xAxis=new d(this),this.xAxis.title("",40),this.yAxis=new d(this),
this.yAxis.title("",40),
this.x2Axis=null,this.y2Axis=new d(this),this.legend=new u(this),
this._drawNow=!0}function p(t,e,i,s,r,n,a){"string"!=typeof e&&(a=n,n=r,r=s,s=i,
i=e,
e=null),"string"!=typeof r&&(a=n,n=r,r=null),"number"!=typeof n&&(a=n,n=null),
this._graph=t,
this._name=e||"",this._values=i||[],this._axis=1,this._fill=s||"green",
this._stroke=r||"black",this._strokeWidth=n||1,this._settings=a||{}}
function d(t,e,i,s,r,n,a){
this._graph=t,this._title=e||"",this._titleFormat={},this._titleOffset=0,
this._labels=null,this._labelFormat={},this._lineFormat={stroke:"black",
strokeWidth:1},this._ticks={major:r||10,minor:n||0,size:10,position:"out"
},this._scale={min:i||0,max:s||100,type:a||"linear"},this._crossAt=0}
function u(t,e,i){
this._graph=t,this._show=!0,this._area=[.9,.1,1,.9],this._sampleSize=15,
this._bgSettings=e||{stroke:"gray"},this._textSettings=i||{}}
t.extend(e.prototype,{markerClassName:"hasSVG",
svgNS:"http://www.w3.org/2000/svg",xlinkNS:"http://www.w3.org/1999/xlink",
_wrapperClass:s,_attrNames:{class_:"class",in_:"in",
alignmentBaseline:"alignment-baseline",baselineShift:"baseline-shift",
clipPath:"clip-path",clipRule:"clip-rule",
colorInterpolation:"color-interpolation",
colorInterpolationFilters:"color-interpolation-filters",
colorRendering:"color-rendering",dominantBaseline:"dominant-baseline",
enableBackground:"enable-background",fillOpacity:"fill-opacity",
fillRule:"fill-rule",floodColor:"flood-color",floodOpacity:"flood-opacity",
fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",
fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",
fontWeight:"font-weight",
glyphOrientationHorizontal:"glyph-orientation-horizontal",
glyphOrientationVertical:"glyph-orientation-vertical",horizAdvX:"horiz-adv-x",
horizOriginX:"horiz-origin-x",imageRendering:"image-rendering",
letterSpacing:"letter-spacing",lightingColor:"lighting-color",
markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",
stopColor:"stop-color",stopOpacity:"stop-opacity",
strikethroughPosition:"strikethrough-position",
strikethroughThickness:"strikethrough-thickness",
strokeDashArray:"stroke-dasharray",strokeDashOffset:"stroke-dashoffset",
strokeLineCap:"stroke-linecap",strokeLineJoin:"stroke-linejoin",
strokeMiterLimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",
strokeWidth:"stroke-width",textAnchor:"text-anchor",
textDecoration:"text-decoration",textRendering:"text-rendering",
underlinePosition:"underline-position",underlineThickness:"underline-thickness",
vertAdvY:"vert-adv-y",vertOriginY:"vert-origin-y",wordSpacing:"word-spacing",
writingMode:"writing-mode"},_attachSVG:function(e,i){
var s=e.namespaceURI===this.svgNS?e:null
;if(!t((e=s?null:e)||s).hasClass(this.markerClassName)){"string"==typeof i?i={
loadURL:i}:"function"==typeof i&&(i={onLoad:i
}),t(e||s).addClass(this.markerClassName);try{
s||((s=document.createElementNS(this.svgNS,"svg")).setAttribute("version","1.1"),
e.clientWidth>0&&s.setAttribute("width",e.clientWidth),
e.clientHeight>0&&s.setAttribute("height",e.clientHeight),
e.appendChild(s)),this._afterLoad(e,s,i||{})}catch(r){
t.browser.msie?(e.id||(e.id="svg"+this._uuid++),
this._settings[e.id]=i,e.innerHTML='<embed type="image/svg+xml" width="100%" height="100%" src="'+(i.initPath||"")+'blank.svg" pluginspage="http://www.adobe.com/svg/viewer/install/main.html"/>'):e.innerHTML='<p class="svg_error">'+this.local.notSupportedText+"</p>"
}}},_registerSVG:function(){var e;for(e=0;e<document.embeds.length;e++){
var i=document.embeds[e].parentNode
;if(t(i).hasClass(t.svg.markerClassName)&&!t.data(i,"svgwrapper")){var s=null
;try{s=document.embeds[e].getSVGDocument()}catch(r){
return void setTimeout(t.svg._registerSVG,250)}
(s=s?s.documentElement:null)&&t.svg._afterLoad(i,s)}}},
_afterLoad:function(e,i,s){s=s||this._settings[e.id]
;this._settings[e?e.id:""]=null;var r=new this._wrapperClass(i,e)
;t.data(e||i,"svgwrapper",r);try{
s.loadURL&&r.load(s.loadURL,s),s.settings&&r.configure(s.settings),
s.onLoad&&!s.loadURL&&s.onLoad.apply(e||i,[r])}catch(n){alert(n)}},
_getSVG:function(e){
return e="string"==typeof e?t(e)[0]:e.jquery?e[0]:e,t.data(e,"svgwrapper")},
_destroySVG:function(e){var i=t(e)
;i.hasClass(this.markerClassName)&&(i.removeClass(this.markerClassName),
e.namespaceURI!==this.svgNS&&i.empty(),t.removeData(e,"svgwrapper"))},
addExtension:function(t,e){this._extensions.push([t,e])},isSVGElem:function(e){
return 1===e.nodeType&&e.namespaceURI===t.svg.svgNS}}),t.extend(s.prototype,{
donutslice:function(t){
var e=t.center,i=t.inner,s=t.outer,r=t.startAngle,n=t.endAngle,a=t.settings,o=(s-1)/2,h=(i-1)/2,l=Math.PI*r/180,_=Math.PI*n/180,c=parseInt(e+h*Math.cos(l)),p=parseInt(e+h*Math.sin(l)),d=parseInt(e+h*Math.cos(_)),u=parseInt(e+h*Math.sin(_)),g=parseInt(e+o*Math.cos(l)),f=parseInt(e+o*Math.sin(l)),x=parseInt(e+o*Math.cos(_)),m=parseInt(e+o*Math.sin(_)),w="M"+c+","+p+"  L"+g+","+f+"  A"+(o=parseInt(o))+","+o+" 0 0,1 "+x+","+m+" L"+d+","+u+"  A"+(h=parseInt(h))+","+h+" 0 0,0 "+c+","+p
;return this.path(w,a)},axis:function(t){
var e=t.start,i=t.end,s=t.shift,r=null===t.min?0:t.min,n=null===t.max?100:t.max,a=null===t.showLabels,o=t.labels,h=null===t.labelRotation?0:t.labelRotation,l=null===t.labelFontSize?12:t.labelFontSize,_=null===t.labelFontWeight?100:t.labelFontWeight,c=null===t.labelFontFamily?"Helvetica":t.labelFontFamily,p=null===t.minorTicks?4:t.minorTicks,d=null===t.minorTickLength?5:t.minorTickLength,u=null===t.majorTickLength?10:t.majorTickLenght,g=null===t.minorTickShift?0:t.minorTickShift,f=null===t.majorTickShift?0:t.majorTickShift,x=null===t.majorTicks?10:t.majorTicks,m=(null===t.scale||t.scale,
null===t.direction?"horizontal":t.direction),w=i-e,v=this.group(),y="horizontal"===m?e:s,k="horizontal"===m?s:e,A="horizontal"===m?i:s,b="horizontal"===m?s:i
;this.line(v,y,k,A,b,{stroke:"black",strokeWidth:1})
;y="horizontal"===m?e:s+f,k="horizontal"===m?s+f:e,
A="horizontal"===m?e:s+f-u,b="horizontal"===m?s+f+u:e
;for(var C="horizontal"===m?e:s+g,S="horizontal"===m?s+g:e,T="horizontal"===m?e:s+g-d,X="horizontal"===m?s+g+d:e,z=Math.floor(w/x),N=Math.floor(z/(p+1)),Y=0;Y<=x;Y++){
if(this.line(v,y,k,A,b,{stroke:"black",strokeWidth:1}),a){
var W=(r+("horizontal"===m?Y:x-Y)*((n-r)/x)).formatString()
;o&&o.length&&(W=o[Y])
;var F=y+("horizontal"===m?0:-1*(u+f)-1),H=k+parseInt(l/("horizontal"===m?1:3))+("horizontal"===m?u+f+1:0)
;this.text(v,F,H,W,{textAnchor:"horizontal"===m&&null===h?"middle":"end",
fontSize:l+"px",stroke:"black",fontWeight:_,fontFamily:c,
transform:null===h?"":"rotate(-"+h+","+F+","+H+")"})}
if(x!==Y)for(var O=0;O<p;O++)"horizontal"===m?(C+=N,
T+=N):(S+=N,X+=N),this.line(v,C,S,T,X,{stroke:"black",strokeWidth:1})
;"horizontal"===m?(y+=z,A+=z):(k+=z,b+=z),"horizontal"===m?(C=y,T=A):(S=k,X=b)}
return v},legend:function(t){
for(var e=null===t.top?0:t.top,i=null===t.left?0:t.left,s=t.labels,r=t.colors,n=null===t.fontSize?12:t.fontSize,a=null===t.fontWeight?"normal":t.fontWeight,o=null===t.fontFamily?"Helvetica":t.fontFamily,h=null===t.labelSpacing?10:t.labelSpacing,l=this.group(),_=0;_<s.length;_++)this.rect(l,i,e,n,n,{
stroke:"white",strokeWidth:0,fill:r[_]}),this.text(l,i+n+n,e+n-2,s[_],{
stroke:"black",fontSize:n,fontFamily:o,fontWeight:a}),e+=n+h;return l},
_width:function(){
return this._container?this._container.clientWidth:this._svg.width},
_height:function(){
return this._container?this._container.clientHeight:this._svg.height},
root:function(){return this._svg},configure:function(e,i,s){if(e.nodeName||(s=i,
i=e,e=this._svg),s)for(var r=e.attributes.length-1;r>=0;r--){
var n=e.attributes.item(r)
;"onload"!==n.nodeName&&"version"!==n.nodeName&&"xmlns"!==n.nodeName.substring(0,5)&&e.attributes.removeNamedItem(n.nodeName)
}for(var a in i)e.setAttribute(t.svg._attrNames[a]||a,i[a]);return this},
getElementById:function(t){return this._svg.ownerDocument.getElementById(t)},
change:function(e,i){
if(e)for(var s in i)null===i[s]?e.removeAttribute(t.svg._attrNames[s]||s):e.setAttribute(t.svg._attrNames[s]||s,i[s])
;return this},_args:function(e,i,s){
i.splice(0,0,"parent"),i.splice(i.length,0,"settings");var r={},n=0
;e[0]&&e[0].jquery&&(e[0]=e[0][0]),
null===e[0]||"object"==typeof e[0]&&e[0].nodeName||(r.parent=null,n=1)
;for(var a=0;a<e.length;a++)r[i[a+n]]=e[a];return s&&t.each(s,(function(t,e){
"object"==typeof r[e]&&(r.settings=r[e],r[e]=null)})),r},title:function(t,e,i){
var s=this._args(arguments,["text"]),r=this._makeNode(s.parent,"title",s.settings||{})
;return r.appendChild(this._svg.ownerDocument.createTextNode(s.text)),r},
describe:function(t,e,i){
var s=this._args(arguments,["text"]),r=this._makeNode(s.parent,"desc",s.settings||{})
;return r.appendChild(this._svg.ownerDocument.createTextNode(s.text)),r},
defs:function(e,i,s){var r=this._args(arguments,["id"],["id"])
;return this._makeNode(r.parent,"defs",t.extend(r.id?{id:r.id
}:{},r.settings||{}))},symbol:function(e,i,s,r,n,a,o){
var h=this._args(arguments,["id","x1","y1","width","height"])
;return this._makeNode(h.parent,"symbol",t.extend({id:h.id,
viewBox:h.x1+" "+h.y1+" "+h.width+" "+h.height},h.settings||{}))},
marker:function(e,i,s,r,n,a,o,h){
var l=this._args(arguments,["id","refX","refY","mWidth","mHeight","orient"],["orient"])
;return this._makeNode(l.parent,"marker",t.extend({id:l.id,refX:l.refX,
refY:l.refY,markerWidth:l.mWidth,markerHeight:l.mHeight,orient:l.orient||"auto"
},l.settings||{}))},style:function(e,i,s){
var r=this._args(arguments,["styles"]),n=this._makeNode(r.parent,"style",t.extend({
type:"text/css"},r.settings||{}))
;return n.appendChild(this._svg.ownerDocument.createTextNode(r.styles)),
t.browser.opera&&t("head").append('<style type="text/css">'+r.styles+"</style>"),
n},script:function(e,i,s,r){
var n=this._args(arguments,["script","type"],["type"]),a=this._makeNode(n.parent,"script",t.extend({
type:n.type||"text/javascript"},n.settings||{}))
;return a.appendChild(this._svg.ownerDocument.createTextNode(n.script)),
t.browser.mozilla||t.globalEval(n.script),a},
linearGradient:function(e,i,s,r,n,a,o,h){
var l=this._args(arguments,["id","stops","x1","y1","x2","y2"],["x1"]),_=t.extend({
id:l.id},null!==l.x1?{x1:l.x1,y1:l.y1,x2:l.x2,y2:l.y2}:{})
;return this._gradient(l.parent,"linearGradient",t.extend(_,l.settings||{}),l.stops)
},radialGradient:function(e,i,s,r,n,a,o,h,l){
var _=this._args(arguments,["id","stops","cx","cy","r","fx","fy"],["cx"]),c=t.extend({
id:_.id},null!==_.cx?{cx:_.cx,cy:_.cy,r:_.r,fx:_.fx,fy:_.fy}:{})
;return this._gradient(_.parent,"radialGradient",t.extend(c,_.settings||{}),_.stops)
},_gradient:function(e,i,s,r){
for(var n=this._makeNode(e,i,s),a=0;a<r.length;a++){var o=r[a]
;this._makeNode(n,"stop",t.extend({offset:o[0],stopColor:o[1]},null!==o[2]?{
stopOpacity:o[2]}:{}))}return n},pattern:function(e,i,s,r,n,a,o,h,l,_,c){
var p=this._args(arguments,["id","x","y","width","height","vx","vy","vwidth","vheight"],["vx"]),d=t.extend({
id:p.id,x:p.x,y:p.y,width:p.width,height:p.height},null!==p.vx?{
viewBox:p.vx+" "+p.vy+" "+p.vwidth+" "+p.vheight}:{})
;return this._makeNode(p.parent,"pattern",t.extend(d,p.settings||{}))},
clipPath:function(e,i,s,r){var n=this._args(arguments,["id","units"])
;return n.units=n.units||"userSpaceOnUse",
this._makeNode(n.parent,"clipPath",t.extend({id:n.id,clipPathUnits:n.units
},n.settings||{}))},mask:function(e,i,s,r,n,a,o){
var h=this._args(arguments,["id","x","y","width","height"])
;return this._makeNode(h.parent,"mask",t.extend({id:h.id,x:h.x,y:h.y,
width:h.width,height:h.height},h.settings||{}))},createPath:function(){
return new r},createText:function(){return new n},
svg:function(e,i,s,r,n,a,o,h,l,_){
var c=this._args(arguments,["x","y","width","height","vx","vy","vwidth","vheight"],["vx"]),p=t.extend({
x:c.x,y:c.y,width:c.width,height:c.height},null!==c.vx?{
viewBox:c.vx+" "+c.vy+" "+c.vwidth+" "+c.vheight}:{})
;return this._makeNode(c.parent,"svg",t.extend(p,c.settings||{}))},
group:function(e,i,s){var r=this._args(arguments,["id"],["id"])
;return this._makeNode(r.parent,"g",t.extend({id:r.id},r.settings||{}))},
use:function(e,i,s,r,n,a,o){
var h=this._args(arguments,["x","y","width","height","ref"])
;"string"==typeof h.x&&(h.ref=h.x,h.settings=h.y,h.x=h.y=h.width=h.height=null)
;var l=this._makeNode(h.parent,"use",t.extend({x:h.x,y:h.y,width:h.width,
height:h.height},h.settings||{}))
;return l.setAttributeNS(t.svg.xlinkNS,"href",h.ref),l},link:function(e,i,s){
var r=this._args(arguments,["ref"]),n=this._makeNode(r.parent,"a",r.settings)
;return n.setAttributeNS(t.svg.xlinkNS,"href",r.ref),n},
image:function(e,i,s,r,n,a,o){
var h=this._args(arguments,["x","y","width","height","ref"]),l=this._makeNode(h.parent,"image",t.extend({
x:h.x,y:h.y,width:h.width,height:h.height},h.settings||{}))
;return l.setAttributeNS(t.svg.xlinkNS,"href",h.ref),l},path:function(e,i,s){
var r=this._args(arguments,["path"])
;return this._makeNode(r.parent,"path",t.extend({
d:r.path.path?r.path.path():r.path},r.settings||{}))},
rect:function(e,i,s,r,n,a,o,h){
var l=this._args(arguments,["x","y","width","height","rx","ry"],["rx"])
;return this._makeNode(l.parent,"rect",t.extend({x:l.x,y:l.y,width:l.width,
height:l.height},l.rx?{rx:l.rx,ry:l.ry}:{},l.settings||{}))},
circle:function(e,i,s,r,n){var a=this._args(arguments,["cx","cy","r"])
;return this._makeNode(a.parent,"circle",t.extend({cx:a.cx,cy:a.cy,r:a.r
},a.settings||{}))},ellipse:function(e,i,s,r,n,a){
var o=this._args(arguments,["cx","cy","rx","ry"])
;return this._makeNode(o.parent,"ellipse",t.extend({cx:o.cx,cy:o.cy,rx:o.rx,
ry:o.ry},o.settings||{}))},line:function(e,i,s,r,n,a){
var o=this._args(arguments,["x1","y1","x2","y2"])
;return this._makeNode(o.parent,"line",t.extend({x1:o.x1,y1:o.y1,x2:o.x2,y2:o.y2
},o.settings||{}))},polyline:function(t,e,i){
var s=this._args(arguments,["points"])
;return this._poly(s.parent,"polyline",s.points,s.settings)},
polygon:function(t,e,i){var s=this._args(arguments,["points"])
;return this._poly(s.parent,"polygon",s.points,s.settings)},
_poly:function(e,i,s,r){for(var n="",a=0;a<s.length;a++)n+=s[a].join()+" "
;return this._makeNode(e,i,t.extend({points:t.trim(n)},r||{}))},
text:function(e,i,s,r,n){var o=this._args(arguments,["x","y","value"])
;return"string"==typeof o.x&&arguments.length<4&&(o.value=o.x,
o.settings=o.y,o.x=o.y=null),this._text(o.parent,"text",o.value,t.extend({
x:o.x&&a(o.x)?o.x.join(" "):o.x,y:o.y&&a(o.y)?o.y.join(" "):o.y
},o.settings||{}))},textpath:function(e,i,s,r){
var n=this._args(arguments,["path","value"]),a=this._text(n.parent,"textPath",n.value,n.settings||{})
;return a.setAttributeNS(t.svg.xlinkNS,"href",n.path),a},
_text:function(e,i,s,r){var n=this._makeNode(e,i,r)
;if("number"==typeof s&&(s=s.toString()),
"string"==typeof s)n.appendChild(n.ownerDocument.createTextNode(s));else for(var a=0;a<s._parts.length;a++){
var o=s._parts[a]
;if("tspan"===o[0])(h=this._makeNode(n,o[0],o[2])).appendChild(n.ownerDocument.createTextNode(o[1])),
n.appendChild(h);else if("tref"===o[0]){
(h=this._makeNode(n,o[0],o[2])).setAttributeNS(t.svg.xlinkNS,"href",o[1]),
n.appendChild(h)}else if("textpath"===o[0]){var h,l=t.extend({},o[2])
;l.href=null,
(h=this._makeNode(n,o[0],l)).setAttributeNS(t.svg.xlinkNS,"href",o[2].href),
h.appendChild(n.ownerDocument.createTextNode(o[1])),n.appendChild(h)
}else n.appendChild(n.ownerDocument.createTextNode(o[1]))}return n},
other:function(t,e,i){var s=this._args(arguments,["name"])
;return this._makeNode(s.parent,s.name,s.settings||{})},
_makeNode:function(e,i,s){e=e||this._svg
;var r=this._svg.ownerDocument.createElementNS(t.svg.svgNS,i);for(var i in s){
var n=s[i]
;null===n||null===n||"string"==typeof n&&""===n||r.setAttribute(t.svg._attrNames[i]||i,n)
}return e.appendChild(r),r},add:function(e,i){
var s=this._args(1===arguments.length?[null,e]:arguments,["node"]),r=this
;s.parent=s.parent||this._svg,s.node=s.node.jquery?s.node:t(s.node);try{
if(t.svg._renesis)throw"Force traversal"
;s.parent.appendChild(s.node.cloneNode(!0))}catch(n){s.node.each((function(){
var t=r._cloneAsSVG(this);t&&s.parent.appendChild(t)}))}return this},
clone:function(e,i){
var s=this,r=this._args(1===arguments.length?[null,e]:arguments,["node"])
;r.parent=r.parent||this._svg,r.node=r.node.jquery?r.node:t(r.node);var n=[]
;return r.node.each((function(){var t=s._cloneAsSVG(this)
;t&&(t.id="",r.parent.appendChild(t),n.push(t))})),n},_cloneAsSVG:function(e){
var i=null;if(1===e.nodeType){
i=this._svg.ownerDocument.createElementNS(t.svg.svgNS,this._checkName(e.nodeName))
;for(var s=0;s<e.attributes.length;s++){var r=e.attributes.item(s)
;"xmlns"!==r.nodeName&&r.nodeValue&&("xlink"===r.prefix?i.setAttributeNS(t.svg.xlinkNS,r.localName||r.baseName,r.nodeValue):i.setAttribute(this._checkName(r.nodeName),r.nodeValue))
}for(s=0;s<e.childNodes.length;s++){var n=this._cloneAsSVG(e.childNodes[s])
;n&&i.appendChild(n)}
}else if(3===e.nodeType)t.trim(e.nodeValue)&&(i=this._svg.ownerDocument.createTextNode(e.nodeValue));else if(4===e.nodeType&&t.trim(e.nodeValue))try{
i=this._svg.ownerDocument.createCDATASection(e.nodeValue)}catch(a){
i=this._svg.ownerDocument.createTextNode(e.nodeValue.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"))
}return i},_checkName:function(t){
return"svg:"===(t=t.substring(0,1)>="A"&&t.substring(0,1)<="Z"?t.toLowerCase():t).substring(0,4)?t.substring(4):t
},load:function(e,i){(i="boolean"==typeof i?{addTo:i}:"function"==typeof i?{
onLoad:i}:"string"==typeof i?{parent:i}:"object"==typeof i&&i.nodeName?{parent:i
}:"object"==typeof i&&i.jquery?{parent:i}:i||{}).parent||i.addTo||this.clear(!1)
;var s=[this._svg.getAttribute("width"),this._svg.getAttribute("height")],r=this,n=function(e){
e=t.svg.local.errorLoadingText+": "+e,
i.onLoad?i.onLoad.apply(r._container||r._svg,[r,e]):r.text(null,10,20,e)
},a=function(t){var e=new ActiveXObject("Microsoft.XMLDOM")
;return e.validateOnParse=!1,
e.resolveExternals=!1,e.async=!1,e.loadXML(t),0!==e.parseError.errorCode?(n(e.parseError.reason),
null):e},o=function(e){if(e)if("svg"===e.documentElement.nodeName){
for(var a=i.parent?t(i.parent)[0]:r._svg,o={},h=0;h<e.documentElement.attributes.length;h++){
var l=e.documentElement.attributes.item(h)
;"version"!==l.nodeName&&"xmlns"!==l.nodeName.substring(0,5)&&(o[l.nodeName]=l.nodeValue)
}r.configure(a,o,!i.parent);var _=e.documentElement.childNodes
;for(h=0;h<_.length;h++)try{if(t.svg._renesis)throw"Force traversal"
;a.appendChild(r._svg.ownerDocument.importNode(_[h],!0)),
"script"===_[h].nodeName&&t.globalEval(_[h].textContent)}catch(d){r.add(a,_[h])}
i.changeSize||r.configure(a,{width:s[0],height:s[1]
}),i.onLoad&&i.onLoad.apply(r._container||r._svg,[r])}else{
var c=e.getElementsByTagName("parsererror"),p=c.length?c[0].getElementsByTagName("div"):[]
;n(c.length?(p.length?p[0]:c[0]).firstChild.nodeValue:"???")}}
;return e.match("<svg")?o(t.browser.msie?a(e):(new DOMParser).parseFromString(e,"text/xml")):t.ajax({
url:e,dataType:t.browser.msie?"text":"xml",success:function(e){
o(t.browser.msie?a(e):e)},error:function(t,e,i){n(e+(i?" "+i.message:""))}
}),this},remove:function(t){return(t=t.jquery?t[0]:t).parentNode.removeChild(t),
this},clear:function(t){
for(t&&this.configure({},!0);this._svg.firstChild;)this._svg.removeChild(this._svg.firstChild)
;return this},toSVG:function(t){
return t=t||this._svg,"undefined"==typeof XMLSerializer?this._toSVG(t):(new XMLSerializer).serializeToString(t)
},_toSVG:function(e){var i="";if(!e)return i
;if(3===e.nodeType)i=e.nodeValue;else if(4===e.nodeType)i="<![CDATA["+e.nodeValue+"]]>";else{
if(i="<"+e.nodeName,e.attributes)for(var s=0;s<e.attributes.length;s++){
var r=e.attributes.item(s)
;""===t.trim(r.nodeValue)||r.nodeValue.match(/^\[object/)||r.nodeValue.match(/^function/)||(i+=" "+(r.namespaceURI===t.svg.xlinkNS?"xlink:":"")+r.nodeName+'="'+r.nodeValue+'"')
}if(e.firstChild){i+=">"
;for(var n=e.firstChild;n;)i+=this._toSVG(n),n=n.nextSibling
;i+="</"+e.nodeName+">"}else i+="/>"}return i}}),t.extend(r.prototype,{
reset:function(){return this._path="",this},move:function(t,e,i){
return i=a(t)?e:i,this._coords(i?"m":"M",t,e)},line:function(t,e,i){
return i=a(t)?e:i,this._coords(i?"l":"L",t,e)},horiz:function(t,e){
return this._path+=(e?"h":"H")+(a(t)?t.join(" "):t),this},vert:function(t,e){
return this._path+=(e?"v":"V")+(a(t)?t.join(" "):t),this},
curveC:function(t,e,i,s,r,n,o){
return o=a(t)?e:o,this._coords(o?"c":"C",t,e,i,s,r,n)},
smoothC:function(t,e,i,s,r){return r=a(t)?e:r,this._coords(r?"s":"S",t,e,i,s)},
curveQ:function(t,e,i,s,r){return r=a(t)?e:r,this._coords(r?"q":"Q",t,e,i,s)},
smoothQ:function(t,e,i){return i=a(t)?e:i,this._coords(i?"t":"T",t,e)},
_coords:function(t,e,i,s,r,n,o){if(a(e))for(var h=0;h<e.length;h++){var l=e[h]
;this._path+=(0===h?t:" ")+l[0]+","+l[1]+(l.length<4?"":" "+l[2]+","+l[3]+(l.length<6?"":" "+l[4]+","+l[5]))
}else this._path+=t+e+","+i+(null===s?"":" "+s+","+r+(null===n?"":" "+n+","+o))
;return this},arc:function(t,e,i,s,r,n,o,h){if(h=a(t)?e:h,this._path+=h?"a":"A",
a(t))for(var l=0;l<t.length;l++){var _=t[l]
;this._path+=(0===l?"":" ")+_[0]+","+_[1]+" "+_[2]+" "+(_[3]?"1":"0")+","+(_[4]?"1":"0")+" "+_[5]+","+_[6]
}else this._path+=t+","+e+" "+i+" "+(s?"1":"0")+","+(r?"1":"0")+" "+n+","+o
;return this},close:function(){return this._path+="z",this},path:function(){
return this._path}
}),r.prototype.moveTo=r.prototype.move,r.prototype.lineTo=r.prototype.line,
r.prototype.horizTo=r.prototype.horiz,
r.prototype.vertTo=r.prototype.vert,r.prototype.curveCTo=r.prototype.curveC,
r.prototype.smoothCTo=r.prototype.smoothC,
r.prototype.curveQTo=r.prototype.curveQ,
r.prototype.smoothQTo=r.prototype.smoothQ,
r.prototype.arcTo=r.prototype.arc,t.extend(n.prototype,{reset:function(){
return this._parts=[],this},string:function(t){
return this._parts[this._parts.length]=["text",t],this},span:function(t,e){
return this._parts[this._parts.length]=["tspan",t,e],this},ref:function(t,e){
return this._parts[this._parts.length]=["tref",t,e],this},path:function(e,i,s){
return this._parts[this._parts.length]=["textpath",i,t.extend({href:e
},s||{})],this}}),t.fn.svg=function(e){
var i=Array.prototype.slice.call(arguments,1)
;return"string"==typeof e&&"get"===e?t.svg["_"+e+"SVG"].apply(t.svg,[this[0]].concat(i)):this.each((function(){
"string"==typeof e?t.svg["_"+e+"SVG"].apply(t.svg,[this].concat(i)):t.svg._attachSVG(this,e||{})
}))
},t.svg=new e,t.svg.addExtension("graph",c),t.svg.graphing=new _,t.extend(_.prototype,{
_chartTypes:[],addChartType:function(t,e){this._chartTypes[t]=e},
chartTypes:function(){return this._chartTypes}}),t.extend(c.prototype,{X:0,Y:1,
W:2,H:3,L:0,T:1,R:2,B:3,
_percentageAxis:new d(this,t.svg.graphing.region.percentageText,0,100,10,0),
container:function(t){
return 0===arguments.length?this._chartCont:(this._chartCont=t,this)},
chartType:function(t,e){return 0===arguments.length?this.type():this.type(t,e)},
type:function(e,i){if(0===arguments.length)return this._chartType
;var s=t.svg.graphing._chartTypes[e]
;return s&&(this._chartType=s,this._chartOptions=t.extend({},i||{})),
this._drawGraph(),this},chartOptions:function(t){
return 0===arguments.length?this.options():this.options(t)},options:function(e){
return 0===arguments.length?this._chartOptions:(this._chartOptions=t.extend({},e),
this._drawGraph(),this)},chartFormat:function(t,e,i){
return 0===arguments.length?this.format():this.format(t,e,i)},
format:function(e,i,s){
return 0===arguments.length?this._chartFormat:("object"==typeof i&&(s=i,i=null),
this._chartFormat=t.extend({fill:e},i?{stroke:i
}:{},s||{}),this._drawGraph(),this)},chartArea:function(t,e,i,s){
return 0===arguments.length?this.area():this.area(t,e,i,s)},
area:function(t,e,i,s){
return 0===arguments.length?this._area:(this._area=a(t)?t:[t,e,i,s],
this._drawGraph(),this)},gridlines:function(t,e){
return 0===arguments.length?this._gridlines:(this._gridlines=["string"==typeof t?{
stroke:t}:t,"string"==typeof e?{stroke:e
}:e],null===this._gridlines[0]&&null===this._gridlines[1]&&(this._gridlines=[]),
this._drawGraph(),this)},title:function(e,i,s,r){
return 0===arguments.length?this._title:("number"!=typeof i&&(r=s,
s=i,i=null),"string"!=typeof s&&(r=s,s=null),this._title={value:e,
offset:i||this._title.offset,settings:t.extend({textAnchor:"middle"},s?{fill:s
}:{},r||{})},this._drawGraph(),this)},addSeries:function(t,e,i,s,r,n){
return this._series.push(new p(this,t,e,i,s,r,n)),this._drawGraph(),this},
series:function(t){return(arguments.length>0?this._series[t]:null)||this._series
},noDraw:function(){return this._drawNow=!1,this},redraw:function(){
return this._drawNow=!0,this._drawGraph(),this},status:function(t){
return this._onstatus=t,this},_drawGraph:function(){if(this._drawNow){
for(;this._chartCont.firstChild;)this._chartCont.removeChild(this._chartCont.firstChild)
;this._chartCont.parent||this._wrapper._svg.appendChild(this._chartCont),
this._chartCont.width?this._chartCont.width.baseVal?this._chartCont.width.baseVal.value=this._chartCont.width.baseVal.value||this._wrapper._width():this._chartCont.width=this._chartCont.width||this._wrapper._width():this._chartCont.setAttribute("width",parseInt(this._chartCont.getAttribute("width"),10)||this._wrapper._width()),
this._chartCont.height?this._chartCont.height.baseVal?this._chartCont.height.baseVal.value=this._chartCont.height.baseVal.value||this._wrapper._height():this._chartCont.height=this._chartCont.height||this._wrapper._height():this._chartCont.setAttribute("height",parseInt(this._chartCont.getAttribute("height"),10)||this._wrapper._height()),
this._chartType.drawGraph(this)}},_getValue:function(t,e){
return t[e]?t[e].baseVal?t[e].baseVal.value:t[e]:parseInt(t.getAttribute(e),10)
},_drawTitle:function(){
this._wrapper.text(this._chartCont,this._getValue(this._chartCont,"width")/2,this._title.offset,this._title.value,this._title.settings)
},_getDims:function(t){t=t||this._area
;var e=this._getValue(this._chartCont,"width"),i=this._getValue(this._chartCont,"height"),s=t[this.L]>1?t[this.L]:e*t[this.L],r=t[this.T]>1?t[this.T]:i*t[this.T]
;return[s,r,(t[this.R]>1?t[this.R]:e*t[this.R])-s,(t[this.B]>1?t[this.B]:i*t[this.B])-r]
},_drawChartBackground:function(t,e){var i=this._wrapper.group(this._chartCont,{
class_:"background"}),s=this._getDims()
;return this._wrapper.rect(i,s[this.X],s[this.Y],s[this.W],s[this.H],this._chartFormat),
this._gridlines[0]&&this.yAxis._ticks.major&&!e&&this._drawGridlines(i,this.yAxis,!0,s,this._gridlines[0]),
this._gridlines[1]&&this.xAxis._ticks.major&&!t&&this._drawGridlines(i,this.xAxis,!1,s,this._gridlines[1]),
i},_drawGridlines:function(t,e,i,s,r){
var n=this._wrapper.group(t,r),a=(i?s[this.H]:s[this.W])/(e._scale.max-e._scale.min),o=Math.floor(e._scale.min/e._ticks.major)*e._ticks.major
;for(o=o<e._scale.min?o+e._ticks.major:o;o<=e._scale.max;){
var h=(i?e._scale.max-o:o-e._scale.min)*a+(i?s[this.Y]:s[this.X])
;this._wrapper.line(n,i?s[this.X]:h,i?h:s[this.Y],i?s[this.X]+s[this.W]:h,i?h:s[this.Y]+s[this.H]),
o+=e._ticks.major}},_drawAxes:function(e){var i=this._getDims()
;if(this.xAxis&&!e&&(this.xAxis._title&&this._wrapper.text(this._chartCont,i[this.X]+i[this.W]/2,i[this.Y]+i[this.H]+this.xAxis._titleOffset,this.xAxis._title,this.xAxis._titleFormat),
this._drawAxis(this.xAxis,"xAxis",i[this.X],i[this.Y]+i[this.H],i[this.X]+i[this.W],i[this.Y]+i[this.H])),
this.yAxis&&(this.yAxis._title&&(this.yAxis._titleOffset=i[this.X]-(this.yAxis._titleFontSize||14),
this._wrapper.text(this._chartCont,0,0,this.yAxis._title,t.extend({
textAnchor:"middle",
transform:"translate("+(i[this.X]-this.yAxis._titleOffset)+","+(i[this.Y]+i[this.H]/2)+") rotate(-90)"
},this.yAxis._titleFormat||{}))),
this._drawAxis(this.yAxis,"yAxis",i[this.X],i[this.Y],i[this.X],i[this.Y]+i[this.H])),
this.x2Axis&&!e&&(this.x2Axis._title&&this._wrapper.text(this._chartCont,i[this.X]+i[this.W]/2,i[this.X]-this.x2Axis._titleOffset,this.x2Axis._title,this.x2Axis._titleFormat),
this._drawAxis(this.x2Axis,"x2Axis",i[this.X],i[this.Y],i[this.X]+i[this.W],i[this.Y])),
this.y2Axis){if(this.y2Axis._title){
var s=this._getValue(this._chartCont,"width")-10
;this._wrapper.text(this._chartCont,0,0,this.y2Axis._title,t.extend({
textAnchor:"middle",
transform:"translate("+s+","+(i[this.Y]+i[this.H]/2)+") rotate(90)"
},this.y2Axis._titleFormat||{}))}
this._drawAxis(this.y2Axis,"y2Axis",i[this.X]+i[this.W],i[this.Y],i[this.X]+i[this.W],i[this.Y]+i[this.H])
}},_drawAxis:function(e,i,s,r,n,a){
var o=r===a,h=this._wrapper.group(this._chartCont,t.extend({class_:i
},e._lineFormat)),l=this._wrapper.group(this._chartCont,t.extend({
class_:i+"Labels",textAnchor:o?"middle":"y2Axis"===i?"left":"end"
},e._labelFormat));if(this._wrapper.line(h,s,r,n,a),e._ticks.major){
var _=n>this._getValue(this._chartCont,"width")/2&&a>this._getValue(this._chartCont,"height")/2,c=(o?n-s:a-r)/(e._scale.max-e._scale.min),p=e._ticks.size,d=Math.floor(e._scale.min/e._ticks.major)*e._ticks.major
;d=d<e._scale.min?d+e._ticks.major:d
;var u=e._ticks.minor?Math.floor(e._scale.min/e._ticks.minor)*e._ticks.minor:e._scale.max+1
;u=u<e._scale.min?u+e._ticks.minor:u
;for(var g=this._getTickOffsets(e,_),f=0;d<=e._scale.max||u<=e._scale.max;){
var x=Math.min(d,u),m=x===d?p:p/2,w=(o?s:r)+(o?x-e._scale.min:e._scale.max-x)*c
;if(x===d){var v=x.toString(),y=e._ticks.major.toString()
;if(y.substr(y.indexOf(".")+1).length>3&&(y=y.substr(0,y.indexOf(".")+4)),
parseFloat(y)<.001)return
;v.substr(v.indexOf(".")+1).length>y.substr(y.indexOf(".")+1).length&&(v=parseFloat(d.toFixed(y.substr(y.indexOf(".")+1).length))),
this._wrapper.line(h,o?w:s+m*g[0],o?r+m*g[0]:w,o?w:s+m*g[1],o?r+m*g[1]:w)
;var k=v
;this.shortAxisLabels&&((k=Math.floor(k)+"").length>12?k=(k=x/1e12).formatString(1)+" T":k.length>9?k=(k=x/1e9).formatString(1)+" G":k.length>6?k=(k=x/1e6).formatString(1)+" M":k.length>3&&(k=(k=x/1e3).formatString(1)+" K"))
;var A=this._wrapper.createText().string("10").span(x,{dy:-10,fontSize:10})
;this._wrapper.text(l,o?w:"y2Axis"===i?s+p+5:s-p-5,o?r+2*p:w+5,e._labels?e._labels[f++]:"log"===e._scale.type?A:k)
}
"log"===e._scale.type?(d+=x===d?1:0,u+=x===u?1:0):(d+=x===d?e._ticks.major:0,u+=x===u?e._ticks.minor:0)
}}},_getTickOffsets:function(t,e){
return[t._ticks.position===(e?"in":"out")||"both"===t._ticks.position?-1:0,t._ticks.position===(e?"out":"in")||"both"===t._ticks.position?1:0]
},_getPercentageAxis:function(){
return this._percentageAxis._title=t.svg.graphing.region.percentageText,
this._percentageAxis},_getTotals:function(){
for(var t=[],e=this._series.length?this._series[0]._values.length:0,i=0;i<e;i++){
t[i]=0;for(var s=0;s<this._series.length;s++)t[i]+=this._series[s]._values[i]}
return t},_drawLegend:function(){if(this.legend._show){
var t=this._wrapper.group(this._chartCont,{class_:"legend"
}),e=this._getDims(this.legend._area)
;this._wrapper.rect(t,e[this.X],e[this.Y],e[this.W],e[this.H],this.legend._bgSettings)
;for(var i=this._series.length,s=e[this.H]/i,r=e[this.X]+5,n=e[this.Y]+(s+this.legend._sampleSize)/2,a=0;a<i;a++){
var o=this._series[a]
;this._wrapper.rect(t,r+0,n+a*s-this.legend._sampleSize,this.legend._sampleSize,this.legend._sampleSize,{
fill:o._fill,stroke:o._stroke,strokeWidth:1
}),this._wrapper.text(t,r+0+this.legend._sampleSize+5,n+a*s,o._name,this.legend._textSettings)
}}},_showStatus:function(e,i,s){var r=this._onstatus
;this._onstatus&&(t(e).hover((function(t){r.apply(this,[i,s,"mouseover",t])
}),(function(t){r.apply(this,["",0,"mouseout",t])})),t(e).click((function(t){
r.apply(this,[i,s,"click",t])})))}}),t.extend(p.prototype,{name:function(t){
return 0===arguments.length?this._name:(this._name=t,
this._graph._drawGraph(),this)},values:function(t,e){
return 0===arguments.length?this._values:(a(t)&&(e=t,
t=null),this._name=t||this._name,this._values=e,this._graph._drawGraph(),this)},
format:function(e,i,s,r){return 0===arguments.length?t.extend({fill:this._fill,
stroke:this._stroke,strokeWidth:this._strokeWidth
},this._settings):("string"!=typeof i&&(r=s,
s=i,i=null),"number"!=typeof s&&(r=s,
s=null),this._fill=e||this._fill,this._stroke=i||this._stroke,
this._strokeWidth=s||this._strokeWidth,
t.extend(this._settings,r||{}),this._graph._drawGraph(),this)},end:function(){
return this._graph}}),t.extend(d.prototype,{scale:function(t,e,i){
return 0===arguments.length?this._scale:(this._scale.min="log"===i&&0!==t?o(t):t,
this._scale.max="log"===i&&0!==e?o(e):e,
this._scale.type=i||"linear",this._graph._drawGraph(),this)},
ticks:function(t,e,i,s,r){
return 0===arguments.length?this._ticks:("string"==typeof i&&(s=i,
i=null),this._ticks.major="log"===r&&0!==t?2:t,
this._ticks.minor="log"===r&&0!==e?1:e,
this._ticks.size=i||this._ticks.size,this._ticks.position=s||this._ticks.position,
this._graph._drawGraph(),this)},title:function(e,i,s,r){
return 0===arguments.length?{title:this._title,offset:this._titleOffset,
format:this._titleFormat
}:("number"!=typeof i&&(r=s,s=i,i=null),"string"!=typeof s&&(r=s,
s=null),this._title=e,
this._titleOffset=null!==i?i:this._titleOffset,(s||r)&&(this._titleFormat=t.extend(r||{},s?{
fill:s}:{})),this._graph._drawGraph(),this)},labels:function(e,i,s){
return 0===arguments.length?{labels:this._labels,format:this._labelFormat
}:("string"!=typeof i&&(s=i,
i=null),this._labels=e,(i||s)&&(this._labelFormat=t.extend(s||{},i?{fill:i
}:{})),this._graph._drawGraph(),this)},line:function(e,i,s){
return 0===arguments.length?this._lineFormat:("object"==typeof i&&(s=i,
i=null),t.extend(this._lineFormat,{stroke:e},i?{strokeWidth:i
}:{},s||{}),this._graph._drawGraph(),this)},end:function(){return this._graph}
}),t.extend(u.prototype,{show:function(t){
return 0===arguments.length?this._show:(this._show=t,
this._graph._drawGraph(),this)},area:function(t,e,i,s){
return 0===arguments.length?this._area:(this._area=a(t)?t:[t,e,i,s],
this._graph._drawGraph(),this)},settings:function(t,e,i){
return 0===arguments.length?{sampleSize:this._sampleSize,
bgSettings:this._bgSettings,textSettings:this._textSettings
}:("number"!=typeof t&&(i=e,
e=t,t=null),this._sampleSize=t||this._sampleSize,this._bgSettings=e,
this._textSettings=i||this._textSettings,this._graph._drawGraph(),this)},
end:function(){return this._graph}})
;var g=["barWidth (number) - the width of each bar","barGap (number) - the gap between sets of bars"]
;function f(){}function x(){}function m(){}function w(){}function v(){}
function y(){}function k(){}function A(){}function b(t){
this._wrapper=t,this._drawNow=!1,this._title={value:"",offset:25,settings:{
textAnchor:"middle"}},this._area=[.1,.1,.8,.9],this._areaFormat={fill:"none",
stroke:"black"
},this._gridlines=[],this._equalXY=!1,this._functions=[],this.plotPoints=[],
this._onstatus=null,
this._uuid=(new Date).getTime(),this._plotCont=this._wrapper.svg(0,0,0,0,{
class_:"svg-plot"
}),this.xAxis=new T(this),this.xAxis.title("",40),this.yAxis=new T(this),
this.yAxis.title("",40),this.legend=new X(this),this._drawNow=!0}
function C(t,e,i,s,r,n,o,h){
"string"!=typeof e&&(h=o,o=n,n=r,r=s,s=i,i=e,e=null),
a(s)||(h=o,o=n,n=r,r=s,s=null),
"number"!=typeof r&&(h=o,o=n,n=r,r=null),"string"!=typeof n&&(h=o,
o=n,n=null),"number"!=typeof o&&(h=o,
o=null),this._plot=t,this._name=e||"",this._fn=i||S,
this._range=s,this._points=r||100,
this._stroke=n||"black",this._strokeWidth=o||1,this._settings=h||{}}
function S(t){return t}function T(t,e,i,s,r,n){
this._plot=t,this._title=e||"",this._titleFormat={textAnchor:"middle"
},this._titleOffset=0,this._labelFormat={},this._lineFormat={stroke:"black",
strokeWidth:1},this._ticks={major:r||10,minor:n||0,size:10,position:"both"
},this._scale={min:i||0,max:s||100},this._crossAt=0}function X(t,e,i){
this._plot=t,
this._show=!0,this._area=[.9,.1,1,.9],this._sampleSize=15,this._bgSettings=e||{
stroke:"gray"},this._textSettings=i||{}}t.extend(f.prototype,{title:function(){
return"deviation chart"},description:function(){
return"Compare sets of values as vertical bars with deviations in grouped categories."
},options:function(){return g},drawGraph:function(t){t._drawChartBackground(!0)
;var e=t._chartOptions.barWidth||20,i=t._chartOptions.barGap||10,s=t._series.length,r=s?t._series[0]._values.length:0,n=t._getDims(),a=n[t.W]/((s*e+i)*r+i),o=n[t.H]/(t.yAxis._scale.max-t.yAxis._scale.min)
;this._chart=t._wrapper.group(t._chartCont,{class_:"chart"})
;for(var h=0;h<s;h++)this._drawSeries(t,h,s,e,i,n,a,o)
;t._drawTitle(),t._drawAxes(!0),this._drawXAxis(t,s,r,e,i,n,a),t._drawLegend()},
_drawSeries:function(e,i,s,r,n,a,h,l,_){var c,p=e._series[i]
;c="object"==typeof p._fill?e._wrapper.group(this._chart,t.extend({
class_:"series"+i,stroke:p._stroke,strokeWidth:p._strokeWidth
},p._settings||{})):e._wrapper.group(this._chart,t.extend({class_:"series"+i,
fill:p._fill,stroke:p._stroke,strokeWidth:p._strokeWidth},p._settings||{}))
;for(var d=0;d<p._values.length;d++){
var u=a[e.X]+h*(n+d*(s*r+n)+i*r),g=p._values[d]
;"log"===e.yAxis._scale.type&&(g.upper=o(g.upper),
g.median=o(g.median),g.max=o(g.max),g.lower=o(g.lower),g.min=o(g.min))
;var f=a[e.Y]
;e._wrapper.rect(c,u+1,Math.ceil((e.yAxis._scale.max-g.upper)*l+f),parseInt(r-2),parseInt((g.upper-g.median)*l),0,0,{
stroke:"black",strokeWidth:1,fill:p._fill[d]
}),e._wrapper.rect(c,u+1,parseInt((e.yAxis._scale.max-g.median)*l+f),parseInt(r-2),parseInt((g.median-g.lower)*l),0,0,{
stroke:"black",strokeWidth:1,fill:p._fill[d]})
;e._wrapper.line(c,u+1+parseInt(r/6),parseInt((e.yAxis._scale.max-g.max)*l+1+f),parseInt(u+1+r-2-parseInt(r/6)),parseInt((e.yAxis._scale.max-g.max)*l+1+f),{
stroke:"black",strokeWidth:1})
;e._wrapper.line(c,u+parseInt(r/2),parseInt((e.yAxis._scale.max-g.max)*l+1+f),parseInt(u+parseInt(r/2)),parseInt((e.yAxis._scale.max-g.upper)*l+1+f),{
stroke:"black",strokeWidth:1,strokeDashArray:"2,2"
}),e._wrapper.line(c,u+1+parseInt(r/6),parseInt((e.yAxis._scale.max-g.min)*l-1+f),parseInt(u+1+r-2-parseInt(r/6)),parseInt((e.yAxis._scale.max-g.min)*l-1+f),{
stroke:"black",strokeWidth:1
}),e._wrapper.line(c,u+parseInt(r/2),parseInt((e.yAxis._scale.max-g.lower)*l-1+f),parseInt(u+parseInt(r/2)),parseInt((e.yAxis._scale.max-g.min)*l-1+f),{
stroke:"black",strokeWidth:1,strokeDashArray:"2,2"})}},
_drawXAxis:function(e,i,s,r,n,a,o){var h=e.xAxis
;h._title&&e._wrapper.text(e._chartCont,a[e.X]+a[e.W]/2,parseInt(e._chartCont.attributes[3].value),h._title,t.extend({
textAnchor:"middle"},h._titleFormat||{}))
;var l=e._wrapper.group(e._chartCont,t.extend({class_:"xAxis"
},h._lineFormat)),_=h.labelRotation?"end":"middle",c=e._wrapper.group(e._chartCont,t.extend({
class_:"xAxisLabels",textAnchor:_},h._labelFormat))
;if(e._wrapper.line(l,a[e.X],a[e.Y]+a[e.H],a[e.X]+a[e.W],a[e.Y]+a[e.H]),
h._ticks.major){for(var p=e._getTickOffsets(h,!0),d=0;d<i;d++){
var u=a[e.X]+o*n+r/2+d*(r*o)
;e._wrapper.line(l,u,a[e.Y]+a[e.H]+p[0]*h._ticks.size,u,a[e.Y]+a[e.H]+p[1]*h._ticks.size)
}for(d=0;d<i;d++){u=a[e.X]+o*n+r/2+d*(r*o)
;e._wrapper.text(c,u,a[e.Y]+a[e.H]+2*h._ticks.size,h._labels?h._labels[d]:e._series[d]._name,h.labelRotation?{
textAnchor:"end",
transform:"rotate("+h.labelRotation+", "+u+", "+(a[e.Y]+a[e.H]+2*h._ticks.size)+")"
}:{textAnchor:"end",
transform:"rotate(-50, "+u+", "+(a[e.Y]+a[e.H]+2*h._ticks.size)+")"})}}}
}),t.extend(x.prototype,{title:function(){return"Basic column chart"},
description:function(){
return"Compare sets of values as vertical bars with grouped categories."},
options:function(){return g},drawGraph:function(t){t._drawChartBackground(!0)
;for(var e=t._chartOptions.barWidth||10,i=t._chartOptions.barGap||10,s=t._series.length,r=0,n=0;n<s;n++)t._series[n]._settings.hasOwnProperty("seriesType")&&"line"===t._series[n]._settings.seriesType||r++
;var a=s?t._series[0]._values.length:0,o=t._getDims(),h=o[t.W]/((r*e+i)*a+i),l=o[t.H]/(t.yAxis._scale.max-t.yAxis._scale.min),_=t.y2Axis?o[t.H]/(t.y2Axis._scale.max-t.y2Axis._scale.min):0
;this._chart=t._wrapper.group(t._chartCont,{class_:"chart"});var c=0
;for(n=0;n<s;n++)t._series[n]._settings.isY2?this._drawSeries(t,c,r,e,i,o,h,_):this._drawSeries(t,c,r,e,i,o,h,l),
t._series[n]._settings.hasOwnProperty("seriesType")&&"line"===t._series[n]._settings.seriesType||c++
;t._drawTitle(),t._drawAxes(!0),this._drawXAxis(t,c,a,e,i,o,h),t._drawLegend()},
_drawSeries:function(e,i,s,r,n,a,h,l,_){var c=e._series[i]
;if(c._settings.hasOwnProperty("seriesType")&&"line"===c._settings.seriesType){
for(var p=e._wrapper.createPath(),d=[],u=0;u<c._values.length;u++){
var g=a[e.X]+h*(n/2+(u+.5)*(s*r+n)),f=a[e.Y]+((c._settings.isY2?e.y2Axis._scale.max:e.yAxis._scale.max)-c._values[u])*l
;0===u?p.move(g,f):p.line(g,f),d.push([g,f])}
for(c._settings.noLines||e._wrapper.path(this._chart,p,t.extend({id:"series"+i,
fill:"none",stroke:"white"===c._stroke?"black":c._stroke,
strokeWidth:c._strokeWidth},c._settings||{})),u=0;u<d.length;u++){
var x=e._wrapper.circle(this._chart,d[u][0],d[u][1],3,{fill:"white",
strokeWidth:1,stroke:"white"===c._stroke?"black":c._stroke,
onmouseover:"this.setAttribute('r', parseInt(this.getAttribute('r')) + 1)",
onmouseout:"this.setAttribute('r', parseInt(this.getAttribute('r')) - 1)"})
;e._showStatus(x,c._name,c._values[u])}}else{var m
;m="object"==typeof c._fill?e._wrapper.group(this._chart,t.extend({
class_:"series"+i,stroke:c._stroke,strokeWidth:c._strokeWidth
},c._settings||{})):e._wrapper.group(this._chart,t.extend({class_:"series"+i,
fill:c._fill,stroke:c._stroke,strokeWidth:c._strokeWidth},c._settings||{}))
;for(u=0;u<c._values.length;u++){
var w=e._wrapper.rect(m,a[e.X]+h*(n+u*(s*r+n)+i*r),a[e.Y]+l*(e.yAxis._scale.max-("log"===e.yAxis._scale.type?o(c._values[u]):c._values[u])),h*r,l*("log"===e.yAxis._scale.type?o(c._values[u]):c._values[u]),"object"==typeof c._fill?{
fill:c._fill[u]}:{});e._showStatus(w,c._name,c._values[u])}}},
_drawXAxis:function(e,i,s,r,n,a,o){var h=e.xAxis
;h._title&&e._wrapper.text(e._chartCont,a[e.X]+a[e.W]/2,parseInt(e._chartCont.attributes[3].value),h._title,t.extend({
textAnchor:"middle"},h._titleFormat||{}))
;var l=e._wrapper.group(e._chartCont,t.extend({class_:"xAxis"
},h._lineFormat)),_=h.labelRotation?"end":"middle",c=e._wrapper.group(e._chartCont,t.extend({
class_:"xAxisLabels",textAnchor:_},h._labelFormat))
;if(e._wrapper.line(l,a[e.X],a[e.Y]+a[e.H],a[e.X]+a[e.W],a[e.Y]+a[e.H]),
h._ticks.major){for(var p=e._getTickOffsets(h,!0),d=1;d<s;d++){
var u=a[e.X]+o*(n/2+d*(i*r+n))
;e._wrapper.line(l,u,a[e.Y]+a[e.H]+p[0]*h._ticks.size,u,a[e.Y]+a[e.H]+p[1]*h._ticks.size)
}for(d=0;d<s;d++){u=a[e.X]+o*(n/2+(d+.5)*(i*r+n))
;e._wrapper.text(c,u,a[e.Y]+a[e.H]+2*h._ticks.size,h._labels?h._labels[d]:""+d,h.labelRotation?{
transform:"rotate("+h.labelRotation+", "+u+", "+(a[e.Y]+a[e.H]+2*h._ticks.size)+")"
}:null)}}}}),t.extend(m.prototype,{title:function(){return"Stacked column chart"
},description:function(){
return"Compare sets of values as vertical bars showing relative contributions to the whole for each category."
},options:function(){return g},drawGraph:function(e){
var i=e._drawChartBackground(!0,!0),s=e._getDims()
;e._gridlines[0]&&e.xAxis._ticks.major&&e._drawGridlines(i,e._getPercentageAxis(),!0,s,e._gridlines[0])
;var r=e._chartOptions.barWidth||10,n=e._chartOptions.barGap||10,a=e._series.length,o=a?e._series[0]._values.length:0,h=s[e.W]/((r+n)*o+n),l=s[e.H]
;this._chart=e._wrapper.group(e._chartCont,{class_:"chart"
}),this._drawColumns(e,a,o,r,n,s,h,l),
e._drawTitle(),e._wrapper.text(e._chartCont,0,0,t.svg.graphing.region.percentageText,t.extend({
textAnchor:"middle",
transform:"translate("+(s[e.X]-e.yAxis._titleOffset)+","+(s[e.Y]+s[e.H]/2)+") rotate(-90)"
},e.yAxis._titleFormat||{}));var _=t.extend({},e._getPercentageAxis())
;t.extend(_._labelFormat,e.yAxis._labelFormat||{}),
e._drawAxis(_,"yAxis",s[e.X],s[e.Y],s[e.X],s[e.Y]+s[e.H]),
this._drawXAxis(e,o,r,n,s,h),e._drawLegend()},
_drawColumns:function(e,i,s,r,n,a,o,h){
for(var _=e._getTotals(),c=[],p=0;p<s;p++)c[p]=0;for(var d=0;d<i;d++){
var u=e._series[d],g=e._wrapper.group(this._chart,t.extend({class_:"series"+d,
fill:u._fill,stroke:u._stroke,strokeWidth:u._strokeWidth},u._settings||{}))
;for(p=0;p<u._values.length;p++){c[p]+=u._values[p]
;var f=e._wrapper.rect(g,a[e.X]+o*(n+p*(r+n)),a[e.Y]+h*(_[p]-c[p])/_[p],o*r,h*u._values[p]/_[p])
;e._showStatus(f,u._name,l(u._values[p]/_[p]*100,2))}}},
_drawXAxis:function(e,i,s,r,n,a){var o=e.xAxis
;o._title&&e._wrapper.text(e._chartCont,n[e.X]+n[e.W]/2,n[e.Y]+n[e.H]+o._titleOffset,o._title,t.extend({
textAnchor:"middle"},o._titleFormat||{}))
;var h=e._wrapper.group(e._chartCont,t.extend({class_:"xAxis"
},o._lineFormat)),l=e._wrapper.group(e._chartCont,t.extend({
class_:"xAxisLabels",textAnchor:"middle"},o._labelFormat))
;if(e._wrapper.line(h,n[e.X],n[e.Y]+n[e.H],n[e.X]+n[e.W],n[e.Y]+n[e.H]),
o._ticks.major){for(var _=e._getTickOffsets(o,!0),c=1;c<i;c++){
var p=n[e.X]+a*(r/2+c*(s+r))
;e._wrapper.line(h,p,n[e.Y]+n[e.H]+_[0]*o._ticks.size,p,n[e.Y]+n[e.H]+_[1]*o._ticks.size)
}for(c=0;c<i;c++){p=n[e.X]+a*(r/2+(c+.5)*(s+r))
;e._wrapper.text(l,p,n[e.Y]+n[e.H]+2*o._ticks.size,o._labels?o._labels[c]:""+c)}
}}}),t.extend(w.prototype,{title:function(){return"Stacked area chart"},
description:function(){
return"Compare sets of values as areas showing relative contributions to the whole for each category."
},options:function(){return g},drawGraph:function(e){
var i=e._drawChartBackground(!0,!0),s=e._getDims()
;e._gridlines[0]&&e.xAxis._ticks.major&&e._drawGridlines(i,e._getPercentageAxis(),!0,s,e._gridlines[0])
;var r=e._series.length,n=r?e._series[0]._values.length:0,a=s[e.W]/n,o=s[e.H]
;this._chart=e._wrapper.group(e._chartCont,{class_:"chart"
}),this._drawAreas(e,r,n,s,a,o),
e._drawTitle(),e._wrapper.text(e._chartCont,0,0,t.svg.graphing.region.percentageText,t.extend({
textAnchor:"middle",
transform:"translate("+(s[e.X]-e.yAxis._titleOffset)+","+(s[e.Y]+s[e.H]/2)+") rotate(-90)"
},e.yAxis._titleFormat||{}));var h=t.extend({},e._getPercentageAxis())
;t.extend(h._labelFormat,e.yAxis._labelFormat||{}),
e._drawAxis(h,"yAxis",s[e.X],s[e.Y],s[e.X],s[e.Y]+s[e.H]),
this._drawXAxis(e,n,s,a),e._drawLegend()},_drawAreas:function(t,e,i,s,r,n){
for(var a=t._getTotals(),o=[],h=0,l=0;l<a.length;l++)a[l]>h&&(h=a[l])
;for(l=0;l<i;l++)o[l]=0;for(var _=[],c=0;c<e;c++){_[c]="";var p=t._series[c]
;for(l=0;l<p._values.length;l++){o[l]+=p._values[l],_[c]+=0===l?"M":"L"
;var d=s[t.Y]+n*(a[l]-o[l])/a[l]
;t.normalizeStackedArea||(d=s[t.Y]+n-n/h*(o[l]-p._values[l])),
_[c]+=s[t.X]+r*l+","+d,
l===p._values.length-1&&(_[c]+="L"+(s[t.X]+r*(l+1))+","+d)}
if(0===c&&t.normalizeStackedArea)_[c]+="L"+(s[t.X]+r*p._values.length)+","+(s[t.Y]+s[t.H])+"L"+s[t.X]+","+(s[t.Y]+s[t.H]);else for(l=p._values.length-1;l>-1;l--){
d=s[t.Y]+n*(a[l]-o[l]+p._values[l])/a[l]
;t.normalizeStackedArea||(d=s[t.Y]+n-n/h*o[l]),
l===p._values.length-1&&(_[c]+="L"+(s[t.X]+r*(l+1))+","+d),
_[c]+="L"+(s[t.X]+r*l)+","+d}}for(l=0;l<_.length;l++){p=t._series[l]
;t._wrapper.path(this._chart,_[l],{fill:p._fill,stroke:p._stroke,
strokeWidth:p._strokeWidth})}},_drawXAxis:function(e,i,s,r){var n=e.xAxis
;n._title&&e._wrapper.text(e._chartCont,s[e.X]+s[e.W]/2,s[e.Y]+s[e.H]+n._titleOffset,n._title,t.extend({
textAnchor:"middle"},n._titleFormat||{}))
;var a=e._wrapper.group(e._chartCont,t.extend({class_:"xAxis"
},n._lineFormat)),o=e._wrapper.group(e._chartCont,t.extend({
class_:"xAxisLabels",textAnchor:"middle"},n._labelFormat))
;if(e._wrapper.line(a,s[e.X],s[e.Y]+s[e.H],s[e.X]+s[e.W],s[e.Y]+s[e.H]),
n._ticks.major){
for(var h=e._getTickOffsets(n,!0),l=1;l<i;l++)if(!(l%n._ticks.major>0)){
var _=s[e.X]+r*l
;e._wrapper.line(a,_,s[e.Y]+s[e.H]+h[0]*n._ticks.size,_,s[e.Y]+s[e.H]+h[1]*n._ticks.size)
}for(l=0;l<i;l++)if(!(l%n._ticks.major>0)){_=s[e.X]+r*(l+.5)
;e._wrapper.text(o,_,s[e.Y]+s[e.H]+2*n._ticks.size,n._labels?n._labels[l]:""+l)}
}}}),t.extend(v.prototype,{title:function(){return"Basic row chart"},
description:function(){
return"Compare sets of values as horizontal rows with grouped categories."},
options:function(){return g},drawGraph:function(t){
var e=t._drawChartBackground(!0,!0),i=t._getDims()
;t._drawGridlines(e,t.yAxis,!1,i,t._gridlines[0])
;var s=t._chartOptions.barWidth||10,r=t._chartOptions.barGap||10,n=t._series.length,a=n?t._series[0]._values.length:0,o=i[t.W]/(t.yAxis._scale.max-t.yAxis._scale.min),h=i[t.H]/((n*s+r)*a+r)
;this._chart=t._wrapper.group(t._chartCont,{class_:"chart"})
;for(var l=0;l<n;l++)this._drawSeries(t,l,n,s,r,i,o,h)
;t._drawTitle(),this._drawAxes(t,n,a,s,r,i,h),t._drawLegend()},
_drawSeries:function(e,i,s,r,n,a,o,h){
for(var l=e._series[i],_=e._wrapper.group(this._chart,t.extend({
class_:"series"+i,fill:l._fill,stroke:l._stroke,strokeWidth:l._strokeWidth
},l._settings||{})),c=0;c<l._values.length;c++){
var p=e._wrapper.rect(_,a[e.X]+o*(0-e.yAxis._scale.min),a[e.Y]+h*(n+c*(s*r+n)+i*r),o*l._values[c],h*r)
;e._showStatus(p,l._name,l._values[c])}},_drawAxes:function(e,i,s,r,n,a,o){var h
;(h=e.yAxis)&&(h._title&&e._wrapper.text(e._chartCont,a[e.X]+a[e.W]/2,a[e.Y]+a[e.H]+h._titleOffset,h._title,h._titleFormat),
e._drawAxis(h,"xAxis",a[e.X],a[e.Y]+a[e.H],a[e.X]+a[e.W],a[e.Y]+a[e.H])),
(h=e.xAxis)._title&&e._wrapper.text(e._chartCont,0,0,h._title,t.extend({
textAnchor:"middle",
transform:"translate("+(a[e.X]-h._titleOffset)+","+(a[e.Y]+a[e.H]/2)+") rotate(-90)"
},h._titleFormat||{}));var l=e._wrapper.group(e._chartCont,t.extend({
class_:"yAxis"},h._lineFormat)),_=e._wrapper.group(e._chartCont,t.extend({
class_:"yAxisLabels",textAnchor:"end"},h._labelFormat))
;if(e._wrapper.line(l,a[e.X],a[e.Y],a[e.X],a[e.Y]+a[e.H]),h._ticks.major){
for(var c=e._getTickOffsets(h,!1),p=1;p<s;p++){var d=a[e.Y]+o*(n/2+p*(i*r+n))
;e._wrapper.line(l,a[e.X]+c[0]*h._ticks.size,d,a[e.X]+c[1]*h._ticks.size,d)}
for(p=0;p<s;p++){d=a[e.Y]+o*(n/2+(p+.5)*(i*r+n))
;e._wrapper.text(_,a[e.X]-h._ticks.size,d,h._labels?h._labels[p]:""+p)}}}
}),t.extend(y.prototype,{title:function(){return"Stacked row chart"},
description:function(){
return"Compare sets of values as horizontal bars showing relative contributions to the whole for each category."
},options:function(){return g},drawGraph:function(e){
var i=e._drawChartBackground(!0,!0),s=e._getDims()
;e._gridlines[0]&&e.xAxis._ticks.major&&e._drawGridlines(i,e._getPercentageAxis(),!1,s,e._gridlines[0])
;var r=e._chartOptions.barWidth||10,n=e._chartOptions.barGap||10,a=e._series.length,o=a?e._series[0]._values.length:0,h=s[e.W],l=s[e.H]/((r+n)*o+n)
;this._chart=e._wrapper.group(e._chartCont,{class_:"chart"
}),this._drawRows(e,a,o,r,n,s,h,l),
e._drawTitle(),e._wrapper.text(e._chartCont,s[e.X]+s[e.W]/2,s[e.Y]+s[e.H]+e.xAxis._titleOffset,t.svg.graphing.region.percentageText,t.extend({
textAnchor:"middle"},e.yAxis._titleFormat||{}))
;var _=t.extend({},e._getPercentageAxis())
;t.extend(_._labelFormat,e.yAxis._labelFormat||{}),
e._drawAxis(_,"xAxis",s[e.X],s[e.Y]+s[e.H],s[e.X]+s[e.W],s[e.Y]+s[e.H]),
this._drawYAxis(e,o,r,n,s,l),e._drawLegend()},
_drawRows:function(e,i,s,r,n,a,o,h){
for(var _=e._getTotals(),c=[],p=0;p<s;p++)c[p]=0;for(var d=0;d<i;d++){
var u=e._series[d],g=e._wrapper.group(this._chart,t.extend({class_:"series"+d,
fill:u._fill,stroke:u._stroke,strokeWidth:u._strokeWidth},u._settings||{}))
;for(p=0;p<u._values.length;p++){
var f=e._wrapper.rect(g,a[e.X]+o*c[p]/_[p],a[e.Y]+h*(n+p*(r+n)),o*u._values[p]/_[p],h*r)
;e._showStatus(f,u._name,l(u._values[p]/_[p]*100,2)),c[p]+=u._values[p]}}},
_drawYAxis:function(e,i,s,r,n,a){var o=e.xAxis
;o._title&&e._wrapper.text(e._chartCont,0,0,o._title,t.extend({
textAnchor:"middle",
transform:"translate("+(n[e.X]-o._titleOffset)+","+(n[e.Y]+n[e.H]/2)+") rotate(-90)"
},o._titleFormat||{}));var h=e._wrapper.group(e._chartCont,t.extend({
class_:"yAxis"},o._lineFormat)),l=e._wrapper.group(e._chartCont,t.extend({
class_:"yAxisLabels",textAnchor:"end"},o._labelFormat))
;if(e._wrapper.line(h,n[e.X],n[e.Y],n[e.X],n[e.Y]+n[e.H]),o._ticks.major){
for(var _=e._getTickOffsets(o,!1),c=1;c<i;c++){var p=n[e.Y]+a*(r/2+c*(s+r))
;e._wrapper.line(h,n[e.X]+_[0]*o._ticks.size,p,n[e.X]+_[1]*o._ticks.size,p)}
for(c=0;c<i;c++){p=n[e.Y]+a*(r/2+(c+.5)*(s+r))
;e._wrapper.text(l,n[e.X]-o._ticks.size,p,o._labels?o._labels[c]:""+c)}}}
}),t.extend(k.prototype,{title:function(){return"Basic line chart"},
description:function(){return"Compare sets of values as continuous lines."},
options:function(){return[]},drawGraph:function(t){t._drawChartBackground()
;var e=t._getDims();t.xAxis._scale.max=t._series[0]._values.length-1
;var i=e[t.W]/(t.xAxis._scale.max-t.xAxis._scale.min),s=e[t.H]/(t.yAxis._scale.max-t.yAxis._scale.min)
;this._chart=t._wrapper.group(t._chartCont,{class_:"chart"})
;for(var r=0;r<t._series.length;r++)this._drawSeries(t,r,e,i,s)
;t._drawTitle(),t._drawAxes(!0),
this._drawXAxis(t,t._series[0]._values.length,e,i),t._drawLegend()},
_drawSeries:function(e,i,s,r,n){
for(var a=e._series[i],o=e._wrapper.createPath(),h=[],l=0;l<a._values.length;l++){
var _=s[e.X]+l*r,c=s[e.Y]+(e.yAxis._scale.max-a._values[l])*n
;0===l?o.move(_,c):o.line(_,c),h.push([_,c])}
for(a._settings.noLines||e._wrapper.path(this._chart,o,t.extend({id:"series"+i,
fill:"none",stroke:"white"===a._stroke?"black":a._stroke,
strokeWidth:a._strokeWidth},a._settings||{})),l=0;l<h.length;l++){
var p=e._wrapper.circle(this._chart,h[l][0],h[l][1],3,{fill:"white",
strokeWidth:1,stroke:"white"===a._stroke?"black":a._stroke,
onmouseover:"this.setAttribute('r', parseInt(this.getAttribute('r')) + 1)",
onmouseout:"this.setAttribute('r', parseInt(this.getAttribute('r')) - 1)"})
;e._showStatus(p,a._name,a._values[l])}},_drawXAxis:function(e,i,s,r){
var n=e.xAxis
;n._title&&e._wrapper.text(e._chartCont,s[e.X]+s[e.W]/2,s[e.Y]+s[e.H]+n._titleOffset,n._title,t.extend({
textAnchor:"middle"},n._titleFormat||{}))
;var a=e._wrapper.group(e._chartCont,t.extend({class_:"xAxis"
},n._lineFormat)),o=n.labelRotation?"end":"middle",h=e._wrapper.group(e._chartCont,t.extend({
class_:"xAxisLabels",textAnchor:o},n._labelFormat))
;if(e._wrapper.line(a,s[e.X],s[e.Y]+s[e.H],s[e.X]+s[e.W],s[e.Y]+s[e.H]),
n._ticks.major){for(var l=e._getTickOffsets(n,!0),_=1;_<i;_++){var c=s[e.X]+r*_
;e._wrapper.line(a,c,s[e.Y]+s[e.H]+l[0]*n._ticks.size,c,s[e.Y]+s[e.H]+l[1]*n._ticks.size)
}for(_=0;_<i;_++){c=s[e.X]+r*_
;e._wrapper.text(h,c,s[e.Y]+s[e.H]+2*n._ticks.size,n._labels?n._labels[_]:""+_,n.labelRotation?{
transform:"rotate("+n.labelRotation+", "+c+", "+(s[e.Y]+s[e.H]+2*n._ticks.size)+")"
}:null)}}}}),t.extend(A.prototype,{
_options:["explode (number or number[]) - indexes of sections to explode out of the pie","explodeDist (number) - the distance to move an exploded section","pieGap (number) - the distance between pies for multiple values"],
title:function(){return"Pie chart"},description:function(){
return"Compare relative sizes of values as contributions to the whole."},
options:function(){return this._options},drawGraph:function(t){
t._drawChartBackground(!0,!0),this._chart=t._wrapper.group(t._chartCont,{
class_:"chart"});var e=t._getDims()
;this._drawSeries(t,e),t._drawTitle(),t._drawLegend()},
_drawSeries:function(e,i){
var s=e._getTotals(),r=e._series.length,n=r?e._series[0]._values.length:0,o=e._wrapper.createPath(),h=[]
;h=a(h)?h:[h]
;for(var _=e._chartOptions.explodeDist||10,c=n<=1?0:e._chartOptions.pieGap||10,p=(i[e.W]-n*c-c)/n/2,d=i[e.H]/2,u=Math.min(p,d)-(h.length>0?_:0),g=e._wrapper.group(e._chartCont,t.extend({
class_:"xAxisLabels",textAnchor:"middle"
},e.xAxis._labelFormat)),f=[],x=0;x<n;x++){
for(var m=i[e.X]+p+x*(2*Math.min(p,d)+c)+c,w=i[e.Y]+d,v=0,y=0;y<r;y++){
var k=e._series[y];if(0===x&&(f[y]=e._wrapper.group(this._chart,t.extend({
class_:"series"+y,fill:k._fill,stroke:k._stroke,strokeWidth:k._strokeWidth
},k._settings||{}))),0!==k._values[x]){
for(var A=v/s[x]*2*Math.PI,b=(v+=k._values[x])/s[x]*2*Math.PI,C=!1,S=0;S<h.length;S++)if(h[S]===y){
C=!0;break}
var T=m+(C?_*Math.cos((A+b)/2):0),X=w+(C?_*Math.sin((A+b)/2):0),z=e._wrapper.path(f[y],o.reset().move(T,X).line(T+u*Math.cos(A),X+u*Math.sin(A)).arc(u,u,0,b-A<Math.PI?0:1,1,T+u*Math.cos(b),X+u*Math.sin(b)).close())
;e._showStatus(z,k._name,l((b-A)/2/Math.PI*100,2))}}
e.xAxis&&e.xAxis._labels[x]&&e._wrapper.text(g,m,i[e.Y]+i[e.H]+e.xAxis._titleOffset,e.xAxis._labels[x])
}}
}),t.svg.graphing.addChartType("column",new x),t.svg.graphing.addChartType("stackedColumn",new m),
t.svg.graphing.addChartType("row",new v),
t.svg.graphing.addChartType("stackedRow",new y),
t.svg.graphing.addChartType("line",new k),
t.svg.graphing.addChartType("pie",new A),
t.svg.graphing.addChartType("stackedArea",new w),
t.svg.graphing.addChartType("deviation",new f),
t.svg.addExtension("plot",b),t.extend(b.prototype,{X:0,Y:1,W:2,H:3,L:0,T:1,R:2,
B:3,container:function(t){
return 0===arguments.length?this._plotCont:(this._plotCont=t,this)},
area:function(t,e,i,s){
return 0===arguments.length?this._area:(this._area=a(t)?t:[t,e,i,s],
this._drawPlot(),this)},format:function(e,i,s){
return 0===arguments.length?this._areaFormat:("object"==typeof i&&(s=i,
i=null),this._areaFormat=t.extend({fill:e},i?{stroke:i
}:{},s||{}),this._drawPlot(),this)},gridlines:function(t,e){
return 0===arguments.length?this._gridlines:(this._gridlines=["string"==typeof t?{
stroke:t}:t,"string"==typeof e?{stroke:e
}:e],null===this._gridlines[0]&&null===this._gridlines[1]&&(this._gridlines=[]),
this._drawPlot(),this)},equalXY:function(t){
return 0===arguments.length?this._equalXY:(this._equalXY=t,this)},
title:function(e,i,s,r){
return 0===arguments.length?this._title:("number"!=typeof i&&(r=s,
s=i,i=null),"string"!=typeof s&&(r=s,s=null),this._title={value:e,
offset:i||this._title.offset,settings:t.extend({textAnchor:"middle",
fontSize:"15px"},s?{fill:s}:{},r||{})},this._drawPlot(),this)},
addFunction:function(t,e,i,s,r,n,a){
return this._functions.push(new C(this,t,e,i,s,r,n,a)),this._drawPlot(),this},
functions:function(t){
return(arguments.length>0?this._functions[t]:null)||this._functions},
noDraw:function(){return this._drawNow=!1,this},redraw:function(){
return this._drawNow=!0,this._drawPlot(),this},status:function(t){
return this._onstatus=t,this},_drawPlot:function(){if(this._drawNow){
for(;this._plotCont.firstChild;)this._plotCont.removeChild(this._plotCont.firstChild)
;this._plotCont.parent||this._wrapper._svg.appendChild(this._plotCont),
this._plotCont.width?this._plotCont.width.baseVal?this._plotCont.width.baseVal.value=this._plotCont.width.baseVal.value||this._wrapper._width():this._plotCont.width=this._plotCont.width||this._wrapper._width():this._plotCont.setAttribute("width",parseInt(this._plotCont.getAttribute("width"),10)||this._wrapper._width()),
this._plotCont.height?this._plotCont.height.baseVal?this._plotCont.height.baseVal.value=this._plotCont.height.baseVal.value||this._wrapper._height():this._plotCont.height=this._plotCont.height||this._wrapper._height():this._plotCont.setAttribute("height",parseInt(this._plotCont.getAttribute("height"),10)||this._wrapper._height()),
this._drawChartBackground()
;var t=this._getDims(),e=this._wrapper.other(this._plotCont,"clipPath",{
id:"clip"+this._uuid})
;this._wrapper.rect(e,t[this.X],t[this.Y],t[this.W],t[this.H]),
this._plot=this._wrapper.group(this._plotCont,{class_:"foreground",
clipPath:"url(#clip"+this._uuid+")"}),this._drawAxis(!0),this._drawAxis(!1)
;for(var i=0;i<this._functions.length;i++)this._plotFunction(this._functions[i],i)
;if(this.plotPoints.length)for(i=0;i<this.plotPoints.length;i++)this.connected?this._plotConnectedPoints(this.plotPoints[i],i):this._plotPoints(this.plotPoints[i],i)
;this._drawTitle(),this._drawLegend()}},_getValue:function(t,e){
return t[e]?t[e].baseVal?t[e].baseVal.value:t[e]:parseInt(t.getAttribute(e),10)
},_getDims:function(t){var e=null!==t;t=t||this._area
;var i=this._getValue(this._plotCont,"width"),s=this._getValue(this._plotCont,"height"),r=t[this.L]>1?t[this.L]:i*t[this.L],n=t[this.T]>1?t[this.T]:s*t[this.T],a=(t[this.R]>1?t[this.R]:i*t[this.R])-r,o=(t[this.B]>1?t[this.B]:s*t[this.B])-n
;if(this._equalXY&&!e){
var h=Math.min(a/(this.xAxis._scale.max-this.xAxis._scale.min),o/(this.yAxis._scale.max-this.yAxis._scale.min))
;a=h*(this.xAxis._scale.max-this.xAxis._scale.min),
o=h*(this.yAxis._scale.max-this.yAxis._scale.min)}return[r,n,a,o]},
_getScales:function(){var t=this._getDims()
;return[t[this.W]/(this.xAxis._scale.max-this.xAxis._scale.min),t[this.H]/(this.yAxis._scale.max-this.yAxis._scale.min)]
},_drawChartBackground:function(t,e){var i=this._wrapper.group(this._plotCont,{
class_:"background"}),s=this._getDims()
;return this._wrapper.rect(i,s[this.X],s[this.Y],s[this.W],s[this.H],this._areaFormat),
this._gridlines[0]&&this.yAxis._ticks.major&&!e&&this._drawGridlines(i,!0,this._gridlines[0],s),
this._gridlines[1]&&this.xAxis._ticks.major&&!t&&this._drawGridlines(i,!1,this._gridlines[1],s),
i},_drawGridlines:function(t,e,i,s){
var r=this._wrapper.group(t,i),n=e?this.yAxis:this.xAxis,a=this._getScales(),o=Math.floor(n._scale.min/n._ticks.major)*n._ticks.major
;for(o+=o<=n._scale.min?n._ticks.major:0;o<n._scale.max;){
var h=(e?n._scale.max-o:o-n._scale.min)*a[e?1:0]+(e?s[this.Y]:s[this.X])
;this._wrapper.line(r,e?s[this.X]:h,e?h:s[this.Y],e?s[this.X]+s[this.W]:h,e?h:s[this.Y]+s[this.H]),
o+=n._ticks.major}},_drawAxis:function(e){
var i=(e?"x":"y")+"Axis",s=e?this.xAxis:this.yAxis,r=e?this.yAxis:this.xAxis,n=this._getDims(),a=this._getScales(),o=this._wrapper.group(this._plot,t.extend({
class_:i},s._lineFormat)),h=(this._wrapper.group(this._plot,t.extend({
class_:i+"Labels",textAnchor:e?"middle":"end"
},s._labelFormat)),(e?r._scale.max:-r._scale.min)*a[e?1:0]+(e?n[this.Y]:n[this.X]))
;if(this._wrapper.line(o,e?n[this.X]:h,e?h:n[this.Y],e?n[this.X]+n[this.W]:h,e?h:n[this.Y]+n[this.H],{
strokeWidth:1.5}),s._ticks.major){
var l=s._ticks.size,_=Math.floor(s._scale.min/s._ticks.major)*s._ticks.major
;_=_<s._scale.min?_+s._ticks.major:_
;var c=s._ticks.minor?Math.floor(s._scale.min/s._ticks.minor)*s._ticks.minor:s._scale.max+1
;c=c<s._scale.min?c+s._ticks.minor:c
;for(var p=["nw"===s._ticks.position||"both"===s._ticks.position?-1:0,"se"===s._ticks.position||"both"===s._ticks.position?1:0];_<=s._scale.max||c<=s._scale.max;){
var d=Math.min(_,c),u=d===_?l:l/2,g=(e?d-s._scale.min:s._scale.max-d)*a[e?0:1]+(e?n[this.X]:n[this.Y])
;if(this._wrapper.line(this._plotCont,e?g:h+u*p[0],e?h+u*p[0]:g,e?g:h+u*p[1],e?h+u*p[1]:g),
d===_&&0!==d){
var f=e?n[this.Y]+n[this.H]:n[this.X],x=this._wrapper.createText().string("10").span(d,{
dy:-10,fontSize:10})
;this._wrapper.text(this._plotCont,e?g:f-l,e?f+l+12:g+l/2,"log"===s._scale.type?x:""+d,{
textAnchor:e?"middle":"end"})}
_+=d===_?s._ticks.major:0,c+=d===c?s._ticks.minor:0
;var m=_.toString(),w=s._ticks.major.toString()
;if(w.substr(w.indexOf(".")+1).length>3&&(w=w.substr(0,w.indexOf(".")+4)),
parseFloat(w)<.001)return
;m.substr(m.indexOf(".")+1).length>w.substr(w.indexOf(".")+1).length&&(_=parseFloat(_.toFixed(w.substr(w.indexOf(".")+1).length)))
}}
s._title&&(e?this._wrapper.text(this._plotCont,n[this.X]+n[this.W]/2,n[this.Y]+n[this.H]+s._titleOffset,s._title,s._titleFormat):this._wrapper.text(this._plotCont,0,0,s._title,t.extend({
textAnchor:"middle",
transform:"translate("+(n[this.X]-s._titleOffset)+","+(n[this.Y]+n[this.H]/2)+") rotate(-90)"
},s._titleFormat||{})))},_plotFunction:function(e,i){
for(var s=this._getDims(),r=this._getScales(),n=this._wrapper.createPath(),a=e._range||[this.xAxis._scale.min,this.xAxis._scale.max],o=(a[1]-a[0])/e._points,h=!0,l=0;l<=e._points;l++){
var _=a[0]+l*o;if(_>this.xAxis._scale.max+o)break
;if(!(_<this.xAxis._scale.min-o)){
var c=(_-this.xAxis._scale.min)*r[0]+s[this.X],p=s[this.H]-(e._fn(_)-this.yAxis._scale.min)*r[1]+s[this.Y]
;n[(h?"move":"line")+"To"](c,p),h=!1}}
var d=this._wrapper.path(this._plot,n,t.extend({class_:"fn"+i,fill:"none",
stroke:e._stroke,strokeWidth:e._strokeWidth},e._settings||{}))
;this._showStatus(d,e._name)},_plotPoints:function(e,s){
var r=this._getScales(),n=this._getDims(),a=n[0]-this.xAxis._scale.min*r[0],h=n[1]+n[3]+this.yAxis._scale.min*r[1],l={
size:this.series[s].pointSize||6,shape:this.series[s].shape,
filled:this.series[s].filled||!1,color:this.series[s].color}
;for(i=0;i<e.length;i++){var _=e[i]
;t.extend(_,l),pxscaled="log"===this.xAxis._scale.type?o(_.x):_.x,
pyscaled="log"===this.yAxis._scale.type?o(_.y):_.y,
_.imgX=pxscaled*r[0]+a,_.imgY=h-pyscaled*r[1];var c=_.title?_.title:""
;switch(_.shape){case"circle":
_.svg=this._wrapper.circle(this._plot,pxscaled*r[0]+a,h-pyscaled*r[1],_.size/2,{
fill:_.filled?_.color:"none",strokeWidth:1,stroke:_.color,title:c});break
;case"square":
_.svg=this._wrapper.rect(this._plot,pxscaled*r[0]+a-_.size/2,h-pyscaled*r[1]-_.size/2,_.size,_.size,{
fill:_.filled?_.color:"none",strokeWidth:1,stroke:_.color,title:c});break
;case"triangle":
_.svg=this._wrapper.polygon(this._plot,[[pxscaled*r[0]+a-_.size/2,h-pyscaled*r[1]-_.size/2],[pxscaled*r[0]+a+_.size/2,h-pyscaled*r[1]-_.size/2],[pxscaled*r[0]+a,h-pyscaled*r[1]+_.size/2]],{
fill:_.filled?_.color:"none",strokeWidth:1,stroke:_.color,title:c})}}},
_plotConnectedPoints:function(e,s){
var r=this._getScales(),n=this._getDims(),a=n[0]-this.xAxis._scale.min*r[0],h=n[1]+n[3]+this.yAxis._scale.min*r[1],l={
size:8,shape:this.series[s].shape,line:this.series[s].color||"blue",
fill:this.series[s].fillColor||"black"};for(i=0;i<e.length;i++){var _=e[i]
;if(t.extend(_,l),
_.imgX=("log"===this.xAxis._scale.type?o(_.x):_.x)*r[0]+a,_.imgY=h-("log"===this.yAxis._scale.type?o(_.y):_.y)*r[1],
i>0&&this._wrapper.line(this._plot,("log"===this.xAxis._scale.type?o(e[i-1].x):e[i-1].x)*r[0]+a,h-("log"===this.yAxis._scale.type?o(e[i-1].y):e[i-1].y)*r[1],("log"===this.xAxis._scale.type?o(_.x):_.x)*r[0]+a,h-("log"===this.yAxis._scale.type?o(_.y):_.y)*r[1],{
strokeWidth:2,stroke:this.series[s].color||"blue"}),this.showDots){
var c=_.title?_.title:""
;_.svg=this._wrapper.circle(this._plot,("log"===this.xAxis._scale.type?o(_.x):_.x)*r[0]+a,h-("log"===this.yAxis._scale.type?o(_.y):_.y)*r[1],_.size/2,{
fill:_.fill,strokeWidth:2,stroke:_.line,
onmouseover:"this.setAttribute('r', parseInt(this.getAttribute('r')) + 1)",
onmouseout:"this.setAttribute('r', parseInt(this.getAttribute('r')) - 1)",
title:c})}}},pointsInBounds:function(t,e,s,r){var n=this.plotPoints,a=[]
;for(i=0;i<n.length;i++)for(h=0;h<n[i].length;h++)n[i][h].imgX>=t&&n[i][h].imgX<=s&&n[i][h].imgY>=e&&n[i][h].imgY<=r&&(n[i][h].series=i,
a.push(n[i][h]));return a},_drawTitle:function(){
this._wrapper.text(this._plotCont,this._getValue(this._plotCont,"width")/2,this._title.offset,this._title.value,this._title.settings)
},_drawLegend:function(){
if(this.legend._show)for(var t=this._wrapper.group(this._plotCont,{
class_:"legend"
}),e=this._getDims(this.legend._area),i=this._functions.length||this.series.length,s=e[this.H]/i,r=e[this.X]+5,n=e[this.Y]+(s+this.legend._sampleSize)/2,a=0;a<i;a++){
var o=this._functions.lenth?this._functions[a]:this.series[a]
;this._wrapper.rect(t,r+0,n+a*s-this.legend._sampleSize,this.legend._sampleSize,this.legend._sampleSize,{
fill:o._stroke?o._stroke:o.color
}),this._wrapper.text(t,r+0+this.legend._sampleSize+5,n+a*s,o._name?o._name:o.name,this.legend._textSettings)
}},_showStatus:function(e,i){var s=this._onstatus
;this._onstatus&&t(e).hover((function(t){s.apply(this,[i])}),(function(){
s.apply(this,[""])}))}}),t.extend(C.prototype,{name:function(t){
return 0===arguments.length?this._name:(this._name=t,
this._plot._drawPlot(),this)},fn:function(t,e){
return 0===arguments.length?this._fn:("function"==typeof t&&(e=t,
t=null),this._name=t||this._name,this._fn=e,this._plot._drawPlot(),this)},
range:function(t,e){
return 0===arguments.length?this._range:(this._range=null===t?null:[t,e],
this._plot._drawPlot(),this)},points:function(t){
return 0===arguments.length?this._points:(this._points=t,this._plot._drawPlot(),
this)},format:function(e,i,s){return 0===arguments.length?t.extend({
stroke:this._stroke,strokeWidth:this._strokeWidth
},this._settings):("number"!=typeof i&&(s=i,
i=null),this._stroke=e||this._stroke,
this._strokeWidth=i||this._strokeWidth,t.extend(this._settings,s||{}),
this._plot._drawPlot(),this)},end:function(){return this._plot}
}),t.extend(T.prototype,{scale:function(t,e,i){
return 0===arguments.length?this._scale:(this._scale.min="log"===i&&0!==t?o(t):t,
this._scale.max="log"===i&&0!==e?o(e):e,
this._scale.type=i,this._plot._drawPlot(),this)},ticks:function(t,e,i,s,r){
return 0===arguments.length?this._ticks:("string"==typeof i&&(s=i,
i=null),this._ticks.major="log"===r&&0!==t?1:t,
this._ticks.minor="log"===r&&0!==e?1:e,
this._ticks.size=i||this._ticks.size,this._ticks.position=s||this._ticks.position,
this._plot._drawPlot(),this)},title:function(e,i,s,r){
return 0===arguments.length?{title:this._title,offset:this._titleOffset,
format:this._titleFormat
}:("number"!=typeof i&&(r=s,s=i,i=null),"string"!=typeof s&&(r=s,
s=null),this._title=e,
this._titleOffset=null!==i?i:this._titleOffset,(s||r)&&(this._titleFormat=t.extend(r||{},s?{
fill:s}:{})),this._plot._drawPlot(),this)},format:function(e,i){
return 0===arguments.length?this._labelFormat:("string"!=typeof e&&(i=e,e=null),
this._labelFormat=t.extend(i||{},e?{fill:e}:{}),this._plot._drawPlot(),this)},
line:function(e,i,s){
return 0===arguments.length?this._lineFormat:("number"!=typeof i&&(s=i,
i=null),t.extend(this._lineFormat,{stroke:e,
strokeWidth:i||this._lineFormat.strokeWidth},s||{}),this._plot._drawPlot(),this)
},end:function(){return this._plot}}),t.extend(X.prototype,{show:function(t){
return 0===arguments.length?this._show:(this._show=t,
this._plot._drawPlot(),this)},area:function(t,e,i,s){
return 0===arguments.length?this._area:(this._area=a(t)?t:[t,e,i,s],
this._plot._drawPlot(),this)},settings:function(t,e,i){
return 0===arguments.length?{sampleSize:this._sampleSize,
bgSettings:this._bgSettings,textSettings:this._textSettings
}:("object"==typeof t&&(i=e,
e=t,t=null),this._sampleSize=t||this._sampleSize,this._bgSettings=e,
this._textSettings=i||this._textSettings,this._plot._drawPlot(),this)},
end:function(){return this._plot}
}),t("<style>").prop("type","text/css").html("svg:svg {    display: none;}.svg_error {    color: red;    font-weight: bold;}.marquee {    fill-opacity: 0.2;    stroke: #000;    stroke-dasharray: 2,4;    vector-effect:non-scaling-stroke;}").appendTo("head")
}));