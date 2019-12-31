!function(t){function i(t){this._wrapper=t,this._drawNow=!1,this._title={
value:"",offset:25,settings:{textAnchor:"middle"}
},this._area=[.1,.1,.8,.9],this._areaFormat={fill:"none",stroke:"black"
},this._gridlines=[],
this._equalXY=!0,this._functions=[],this._onstatus=null,this._uuid=(new Date).getTime(),
this._plotCont=this._wrapper.svg(0,0,0,0,{class_:"svg-plot"
}),this.xAxis=new h(this),
this.xAxis.title("X",20),this.yAxis=new h(this),this.yAxis.title("Y",20),
this.legend=new n(this),this._drawNow=!0}function s(t,i,s,h,n,_,o,l){
"string"!=typeof i&&(l=o,
o=_,_=n,n=h,h=s,s=i,i=null),r(h)||(l=o,o=_,_=n,n=h,h=null),
"number"!=typeof n&&(l=o,
o=_,_=n,n=null),"string"!=typeof _&&(l=o,o=_,_=null),"number"!=typeof o&&(l=o,
o=null),
this._plot=t,this._name=i||"",this._fn=s||e,this._range=h,this._points=n||100,
this._stroke=_||"black",this._strokeWidth=o||1,this._settings=l||{}}
function e(t){return t}function h(t,i,s,e,h,n){
this._plot=t,this._title=i||"",this._titleFormat={},
this._titleOffset=0,this._labelFormat={},this._lineFormat={stroke:"black",
strokeWidth:1},this._ticks={major:h||10,minor:n||0,size:10,position:"both"
},this._scale={min:s||0,max:e||100},this._crossAt=0}function n(t,i,s){
this._plot=t,
this._show=!0,this._area=[.9,.1,1,.9],this._sampleSize=15,this._bgSettings=i||{
stroke:"gray"},this._textSettings=s||{}}function r(t){
return t&&t.constructor==Array}
t.svg.addExtension("plot",i),t.extend(i.prototype,{X:0,Y:1,W:2,H:3,L:0,T:1,R:2,
B:3,container:function(t){
return 0==arguments.length?this._plotCont:(this._plotCont=t,this)},
area:function(t,i,s,e){
return 0==arguments.length?this._area:(this._area=r(t)?t:[t,i,s,e],
this._drawPlot(),this)},format:function(i,s,e){
return 0==arguments.length?this._areaFormat:("object"==typeof s&&(e=s,
s=null),this._areaFormat=t.extend({fill:i},s?{stroke:s
}:{},e||{}),this._drawPlot(),this)},gridlines:function(t,i){
return 0==arguments.length?this._gridlines:(this._gridlines=["string"==typeof t?{
stroke:t}:t,"string"==typeof i?{stroke:i
}:i],null==this._gridlines[0]&&null==this._gridlines[1]&&(this._gridlines=[]),
this._drawPlot(),this)},equalXY:function(t){
return 0==arguments.length?this._equalXY:(this._equalXY=t,this)},
title:function(i,s,e,h){
return 0==arguments.length?this._title:("number"!=typeof s&&(h=e,
e=s,s=null),"string"!=typeof e&&(h=e,e=null),this._title={value:i,
offset:s||this._title.offset,settings:t.extend({textAnchor:"middle"},e?{fill:e
}:{},h||{})},this._drawPlot(),this)},addFunction:function(t,i,e,h,n,r,_){
return this._functions.push(new s(this,t,i,e,h,n,r,_)),this._drawPlot(),this},
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
;var t=this._getDims(),i=this._wrapper.other(this._plotCont,"clipPath",{
id:"clip"+this._uuid})
;this._wrapper.rect(i,t[this.X],t[this.Y],t[this.W],t[this.H]),
this._plot=this._wrapper.group(this._plotCont,{class_:"foreground",
clipPath:"url(#clip"+this._uuid+")"}),this._drawAxis(!0),this._drawAxis(!1)
;for(var s=0;s<this._functions.length;s++)this._plotFunction(this._functions[s],s)
;this._drawTitle(),this._drawLegend()}},_getValue:function(t,i){
return t[i]?t[i].baseVal?t[i].baseVal.value:t[i]:parseInt(t.getAttribute(i),10)
},_getDims:function(t){var i=null!=t;t=t||this._area
;var s=this._getValue(this._plotCont,"width"),e=this._getValue(this._plotCont,"height"),h=t[this.L]>1?t[this.L]:s*t[this.L],n=t[this.T]>1?t[this.T]:e*t[this.T],r=(t[this.R]>1?t[this.R]:s*t[this.R])-h,_=(t[this.B]>1?t[this.B]:e*t[this.B])-n
;if(this._equalXY&&!i){
var o=Math.min(r/(this.xAxis._scale.max-this.xAxis._scale.min),_/(this.yAxis._scale.max-this.yAxis._scale.min))
;r=o*(this.xAxis._scale.max-this.xAxis._scale.min),
_=o*(this.yAxis._scale.max-this.yAxis._scale.min)}return[h,n,r,_]},
_getScales:function(){var t=this._getDims()
;return[t[this.W]/(this.xAxis._scale.max-this.xAxis._scale.min),t[this.H]/(this.yAxis._scale.max-this.yAxis._scale.min)]
},_drawChartBackground:function(t,i){var s=this._wrapper.group(this._plotCont,{
class_:"background"}),e=this._getDims()
;return this._wrapper.rect(s,e[this.X],e[this.Y],e[this.W],e[this.H],this._areaFormat),
this._gridlines[0]&&this.yAxis._ticks.major&&!i&&this._drawGridlines(s,!0,this._gridlines[0],e),
this._gridlines[1]&&this.xAxis._ticks.major&&!t&&this._drawGridlines(s,!1,this._gridlines[1],e),
s},_drawGridlines:function(t,i,s,e){
var h=this._wrapper.group(t,s),n=i?this.yAxis:this.xAxis,r=this._getScales(),_=Math.floor(n._scale.min/n._ticks.major)*n._ticks.major
;for(_+=_<=n._scale.min?n._ticks.major:0;_<n._scale.max;){
var o=(i?n._scale.max-_:_-n._scale.min)*r[i?1:0]+(i?e[this.Y]:e[this.X])
;this._wrapper.line(h,i?e[this.X]:o,i?o:e[this.Y],i?e[this.X]+e[this.W]:o,i?o:e[this.Y]+e[this.H]),
_+=n._ticks.major}},_drawAxis:function(i){
var s=(i?"x":"y")+"Axis",e=i?this.xAxis:this.yAxis,h=i?this.yAxis:this.xAxis,n=this._getDims(),r=this._getScales(),_=this._wrapper.group(this._plot,t.extend({
class_:s},e._lineFormat)),o=this._wrapper.group(this._plot,t.extend({
class_:s+"Labels",textAnchor:i?"middle":"end"
},e._labelFormat)),l=(i?h._scale.max:-h._scale.min)*r[i?1:0]+(i?n[this.Y]:n[this.X])
;if(this._wrapper.line(_,i?n[this.X]:l,i?l:n[this.Y],i?n[this.X]+n[this.W]:l,i?l:n[this.Y]+n[this.H]),
e._ticks.major){
var a=e._ticks.size,p=Math.floor(e._scale.min/e._ticks.major)*e._ticks.major
;p=p<e._scale.min?p+e._ticks.major:p
;var u=e._ticks.minor?Math.floor(e._scale.min/e._ticks.minor)*e._ticks.minor:e._scale.max+1
;u=u<e._scale.min?u+e._ticks.minor:u
;for(var c=["nw"==e._ticks.position||"both"==e._ticks.position?-1:0,"se"==e._ticks.position||"both"==e._ticks.position?1:0];p<=e._scale.max||u<=e._scale.max;){
var d=Math.min(p,u),f=d==p?a:a/2,g=(i?d-e._scale.min:e._scale.max-d)*r[i?0:1]+(i?n[this.X]:n[this.Y])
;this._wrapper.line(_,i?g:l+f*c[0],i?l+f*c[0]:g,i?g:l+f*c[1],i?l+f*c[1]:g),
d==p&&0!=d&&this._wrapper.text(o,i?g:l-a,i?l-a:g,""+d),p+=d==p?e._ticks.major:0,
u+=d==u?e._ticks.minor:0}}
e._title&&(i?this._wrapper.text(this._plotCont,n[this.X]-e._titleOffset,l,e._title,t.extend({
textAnchor:"end"
},e._titleFormat||{})):this._wrapper.text(this._plotCont,l,n[this.Y]+n[this.H]+e._titleOffset,e._title,t.extend({
textAnchor:"middle"},e._titleFormat||{})))},_plotFunction:function(i,s){
for(var e=this._getDims(),h=this._getScales(),n=this._wrapper.createPath(),r=i._range||[this.xAxis._scale.min,this.xAxis._scale.max],_=(r[1]-r[0])/i._points,o=!0,l=0;l<=i._points;l++){
var a=r[0]+l*_;if(a>this.xAxis._scale.max+_)break
;if(!(a<this.xAxis._scale.min-_)){
var p=(a-this.xAxis._scale.min)*h[0]+e[this.X],u=e[this.H]-(i._fn(a)-this.yAxis._scale.min)*h[1]+e[this.Y]
;n[(o?"move":"line")+"To"](p,u),o=!1}}
var c=this._wrapper.path(this._plot,n,t.extend({class_:"fn"+s,fill:"none",
stroke:i._stroke,strokeWidth:i._strokeWidth},i._settings||{}))
;this._showStatus(c,i._name)},_drawTitle:function(){
this._wrapper.text(this._plotCont,this._getValue(this._plotCont,"width")/2,this._title.offset,this._title.value,this._title.settings)
},_drawLegend:function(){if(this.legend._show){
var t=this._wrapper.group(this._plotCont,{class_:"legend"
}),i=this._getDims(this.legend._area)
;this._wrapper.rect(t,i[this.X],i[this.Y],i[this.W],i[this.H],this.legend._bgSettings)
;for(var s=i[this.W]>i[this.H],e=this._functions.length,h=(s?i[this.W]:i[this.H])/e,n=i[this.X]+5,r=i[this.Y]+((s?i[this.H]:h)+this.legend._sampleSize)/2,_=0;_<e;_++){
var o=this._functions[_]
;this._wrapper.rect(t,n+(s?_*h:0),r+(s?0:_*h)-this.legend._sampleSize,this.legend._sampleSize,this.legend._sampleSize,{
fill:o._stroke
}),this._wrapper.text(t,n+(s?_*h:0)+this.legend._sampleSize+5,r+(s?0:_*h),o._name,this.legend._textSettings)
}}},_showStatus:function(i,s){var e=this._onstatus
;this._onstatus&&t(i).hover((function(t){e.apply(this,[s])}),(function(){
e.apply(this,[""])}))}}),t.extend(s.prototype,{name:function(t){
return 0==arguments.length?this._name:(this._name=t,this._plot._drawPlot(),this)
},fn:function(t,i){
return 0==arguments.length?this._fn:("function"==typeof t&&(i=t,
t=null),this._name=t||this._name,this._fn=i,this._plot._drawPlot(),this)},
range:function(t,i){
return 0==arguments.length?this._range:(this._range=null==t?null:[t,i],
this._plot._drawPlot(),this)},points:function(t){
return 0==arguments.length?this._points:(this._points=t,
this._plot._drawPlot(),this)},format:function(i,s,e){
return 0==arguments.length?t.extend({stroke:this._stroke,
strokeWidth:this._strokeWidth
},this._settings):("number"!=typeof s&&(e=s,s=null),
this._stroke=i||this._stroke,
this._strokeWidth=s||this._strokeWidth,t.extend(this._settings,e||{}),
this._plot._drawPlot(),this)},end:function(){return this._plot}
}),t.extend(h.prototype,{scale:function(t,i){
return 0==arguments.length?this._scale:(this._scale.min=t,
this._scale.max=i,this._plot._drawPlot(),this)},ticks:function(t,i,s,e){
return 0==arguments.length?this._ticks:("string"==typeof s&&(e=s,
s=null),this._ticks.major=t,
this._ticks.minor=i,this._ticks.size=s||this._ticks.size,
this._ticks.position=e||this._ticks.position,this._plot._drawPlot(),this)},
title:function(i,s,e,h){return 0==arguments.length?{title:this._title,
offset:this._titleOffset,format:this._titleFormat
}:("number"!=typeof s&&(h=e,e=s,
s=null),"string"!=typeof e&&(h=e,e=null),this._title=i,
this._titleOffset=null!=s?s:this._titleOffset,
(e||h)&&(this._titleFormat=t.extend(h||{},e?{fill:e
}:{})),this._plot._drawPlot(),this)},format:function(i,s){
return 0==arguments.length?this._labelFormat:("string"!=typeof i&&(s=i,
i=null),this._labelFormat=t.extend(s||{},i?{fill:i
}:{}),this._plot._drawPlot(),this)},line:function(i,s,e){
return 0==arguments.length?this._lineFormat:("number"!=typeof s&&(e=s,
s=null),t.extend(this._lineFormat,{stroke:i,
strokeWidth:s||this._lineFormat.strokeWidth},e||{}),this._plot._drawPlot(),this)
},end:function(){return this._plot}}),t.extend(n.prototype,{show:function(t){
return 0==arguments.length?this._show:(this._show=t,this._plot._drawPlot(),this)
},area:function(t,i,s,e){
return 0==arguments.length?this._area:(this._area=r(t)?t:[t,i,s,e],
this._plot._drawPlot(),this)},settings:function(t,i,s){
return 0==arguments.length?{sampleSize:this._sampleSize,
bgSettings:this._bgSettings,textSettings:this._textSettings
}:("object"==typeof t&&(s=i,
i=t,t=null),this._sampleSize=t||this._sampleSize,this._bgSettings=i,
this._textSettings=s||this._textSettings,this._plot._drawPlot(),this)},
end:function(){return this._plot}})}(jQuery);