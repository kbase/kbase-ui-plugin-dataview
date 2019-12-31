define(["jquery","d3","./visWidget"],(function(t,i){"use strict";t.KBWidget({
name:"kbasePiechart",parent:"kbaseVisWidget",version:"1.0.0",options:{xGutter:0,
xPadding:0,yPadding:0,overColor:"blue",innerRadius:0,outerRadius:0,startAngle:0,
gradient:!0,startingPosition:"final",strokeWidth:1,strokeColor:"white",
highlightColor:"black",sliceOffset:25,bgColor:"rgba(0,0,0,0)",xOffset:0,
yOffset:0,outsideLabels:!0,labels:!0,autoEndAngle:!1,
colorScale:i.scale.category20(),outerArcOpacity:.4,cornerToolTip:!1,
draggable:!0,tooltips:!0,rescaleChildren:!0,outerRadiusInset:10},_accessors:[],
init:function(i){
return this._super(i),void 0===this.options.endAngle&&(this.options.endAngle=this.options.startAngle+2*Math.PI),
this.pieSize=this.options.endAngle-this.options.startAngle,
this.uniqueID=t.proxy((function(t){
return void 0===t.data&&(t.data={}),t.data.id||(t.data.id=this.ticker())
}),this),void 0!==this.parent&&(this.outerRadiusInset=0),this},
childOptions:function(t,i){var n=this._super(t,i)
;return this.options.rescaleChildren&&(n.outerRadius=this.options.innerRadius*(t+1),
n.innerRadius=this.options.innerRadius),n},reenter:function(t,i,n){
return this.options.rescaleChildren&&(this.options.outerRadius=n.options.innerRadius*(t+1),
this.options.innerRadius=n.options.innerRadius),this},
startingPosition:function(t,i){
return this.initialized?i<this.lastPieData.length-1?{
startAngle:this.lastPieData[i+1].startAngle,
endAngle:this.lastPieData[i+1].startAngle}:{startAngle:this.options.endAngle,
endAngle:this.options.endAngle}:"slice"===this.options.startingPosition?{
startAngle:t.startAngle,endAngle:t.startAngle
}:"top"===this.options.startingPosition?{startAngle:this.options.startAngle,
endAngle:this.options.startAngle}:"final"===this.options.startingPosition?{
startAngle:t.startAngle,endAngle:t.endAngle}:void 0},midAngle:function(t){
return t.startAngle+(t.endAngle-t.startAngle)/2},midPosition:function(t){
var i=this.midAngle(t)%(2*Math.PI);return 0<i&&i<Math.PI||i<-Math.PI?1:-1},
useOutsideLabels:function(t){
return this.options.outsideLabels&&void 0===t.data.outsideLabel||t.data.outsideLabel
},setDataset:function(i){void 0!==i&&t.each(i,(function(t,n){
"number"==typeof n&&(i[t]={value:n})})),this._super(i)},outerRadius:function(){
var t=this.chartBounds(),i=this.options.outerRadius;if(i<=0){
var n=t.size.width<t.size.height?t.size.width:t.size.height
;i=n/2+i,n<0&&(n=0),i<0&&(i=n/2)}return i},innerRadius:function(){
var t=this.options.innerRadius
;return t<0&&(t=this.outerRadius()+this.options.innerRadius),t<0&&(t=0),t},
sliceAction:function(t){return function(){
var n=t.outerRadius()-t.options.outerRadiusInset,e=i.svg.arc().innerRadius(n).outerRadius(n+10)
;return this.on("mouseover",(function(n){if(!n.data.gap){var a=this
;if(!t.dragging){
t.outerArc.transition().duration(0).attr("fill-opacity",t.options.outerArcOpacity).attr("fill",(function(i,e){
return n.data.color||t.options.colorScale(e,n.data,t)
})).attr("transform",(function(t){return i.select(a).attr("transform")
})).attr("d",(function(t){return e({startAngle:n.startAngle,endAngle:n.endAngle
})}));var r;(r=i.mouse(this))[0],r[1];if(t.options.tooltips){var s=t.tooltip(n)
;s&&t.showToolTip({label:s,event:{
pageX:t.options.cornerToolTip?t.$elem.prop("offsetLeft")+5:i.event.pageX,
pageY:t.options.cornerToolTip?t.$elem.prop("offsetTop")+20:i.event.pageY}})}}}
})).on("mouseout",(function(i){i.data.gap||(t.options.tooltips&&t.hideToolTip(),
t.outerArc.attr("fill-opacity",0))})).on("dblclick",(function(i){
i.data.gap||t.options.draggable&&(t.options.startAngle=t.options.startAngle-i.startAngle,
t.renderChart())})),this}},tooltip:function(t){
return void 0!==t.data.tooltip?t.data.tooltip:void 0!==t.data.label?t.data.label+" : "+t.data.value:void 0
},pieData:function(t){
return this.pieLayout=i.layout.pie().sort(null).startAngle(this.options.startAngle).endAngle(this.options.endAngle).value((function(t,i){
return t.value})),this.pieLayout(t)},renderChart:function(){
if(void 0!==this.dataset()){
0===this.dataset().length&&(this.initialized=!1,this.lastPieData=void 0);var n=0
;"final"===this.options.startingPosition&&(n=1);var e=this.chartBounds(),a=this
;if(this.options.autoEndAngle){var r=0;t.each(a.dataset(),(function(t,i){
r+=i.value})),r>1&&(r=1),this.options.endAngle=2*r*Math.PI
}else this.options.endAngle=this.options.startAngle+this.pieSize
;var s=this.pieData(a.dataset()),o=this.outerRadius()-this.options.outerRadiusInset,l=this.innerRadius(),d=i.svg.arc().innerRadius(l).outerRadius(o),u=i.svg.arc().innerRadius(l+8*(o-l)/10).outerRadius(l+8*(o-l)/10),c=i.svg.arc().innerRadius(l+(o-l)/2).outerRadius(l+(o-l)/2),h=function(t){
return void 0===t&&(t=1),
this.attr("text-anchor","middle"),this.attrTween&&this.text((function(t){
return t.data.label})).attrTween("fill-opacity",(function(e,r){
void 0===this._currentOpacity&&(this._currentOpacity=a.initialized?0:n)
;var s=i.interpolate(this._currentOpacity,t);this._currentOpacity=s(0)
;var o=this;return function(t){return o._currentOpacity=s(t)}
})).attrTween("transform",(function(n,e){
void 0===this._current&&(this._current=a.startingPosition(n,e));var r=n
;0===t&&(r={startAngle:n.startAngle,endAngle:n.startAngle
},e>0&&s.length&&(e>s.length&&(e=s.length),r={startAngle:s[e-1].endAngle,
endAngle:s[e-1].endAngle}));var l=i.interpolate(this._current,r)
;this._current=l(0);var c=a.useOutsideLabels(n),h=c?u:d;return function(t){
var i=l(t),n=h.centroid(i)
;return c&&(n[0]=1.06*o*a.midPosition(i),n[1]+=2),"translate("+n+")"}
})).styleTween("text-anchor",(function(t){this._current=this._current||t
;var n=i.interpolate(this._current,t);this._current=n(0)
;var e=a.useOutsideLabels(t);return function(t){var i=n(t)
;return e?a.midPosition(i)>0?"start":"end":"middle"}})),this
},g=i.behavior.drag();g.on("dragstart",(function(t){
this.__delta=0,a.outerArc.attr("fill-opacity",0),a.dragging=!0
})).on("drag",(function(t){this.__delta+=a.midPosition(t)*i.event.dy
;if(this.__delta>20||this.__delta<-20){
var n=this.__delta,e=a.options.startAngle+Math.PI*(n/2)/o
;a.options.startAngle=e,a.renderChart(),this.__delta=0}
})).on("dragend",(function(t){delete this.__delta,a.dragging=!1}))
;var p=this.D3svg().select(this.region("chart")).selectAll(".pie").data([0])
;if(p.enter().append("g").attr("class","pie").attr("transform","translate("+(e.size.width/2+this.options.xOffset)+","+(e.size.height/2+this.options.yOffset)+")"),
t.each(s,(function(t,i){void 0!==i.data.id&&(i.id=i.data.id)
})),void 0!==a.options.pieColor){
var f=this.D3svg().select(this.region("chart")).data([0]).selectAll(".pieBG").data([0]),v=i.svg.arc().innerRadius(0).outerRadius(o)
;f.enter().insert("path",".pie").attr("class","pieBG").attr("transform","translate("+(e.size.width/2+this.options.xOffset)+","+(e.size.height/2+this.options.yOffset)+")").attr("d",(function(t){
return v({startAngle:0,endAngle:2*Math.PI})})),f.attr("fill",a.options.pieColor)
}
a.outerArc=p.selectAll(".outerArc").data([0]),a.outerArc.enter().append("path").attr("class","outerArc")
;var A=p.selectAll(".slice").data(s,this.uniqueness())
;A.enter().append("path").attr("class","slice").attr("fill",(function(t,i){
return void 0===t.data.color&&(t.data.color=a.options.colorScale(i,t.data,a)),
t.data.color
})).attr("stroke",a.options.strokeColor).attr("stroke-width",a.options.strokeWidth).attr("stroke-linejoin","bevel")
;var _=this.initialized||"final"!==this.options.startingPosition?this.options.transitionTime:0
;A.call(a.sliceAction(a)).transition().duration(_).call((function(){
return this.attr("transform",(function(t,n){
if(void 0!==t.data.offset)return"translate("+i.svg.arc().innerRadius(0).outerRadius(t.data.offset||0).centroid(t)+")"
})).attr("fill-opacity",(function(t){return t.data.gap?0:1
})).attr("stroke-opacity",(function(t){return t.data.gap?0:1
})),a.options.gradient||this.attr("fill",(function(t,i){
return void 0===t.data.color&&(t.data.color=a.options.colorScale(i,t.data,a)),
t.data.color
})),this.attrTween&&(a.options.gradient&&this.attrTween("fill",(function(i,n){
var e,r=a.uniqueness(),s=void 0===r?void 0:r(i),l=i.data.gradID
;void 0===l&&(void 0!==a.lastPieData&&n<a.lastPieData.length&&(void 0===s?e=a.lastPieData[n].data.gradID:t.each(a.lastPieData,(function(t,i){
r(i)!==s||(e=i.data.gradID)}))),void 0===e&&(e=a.uuid()),l=i.data.gradID=e)
;var d=i.data.color
;return void 0===i.data.color&&(i.data.color=a.options.colorScale(n,i.data,a)),
d="url(#"+a.radialGradient({startColor:i.data.color,
stopColor:a.options.gradient?a.options.radialGradientStopColor:i.data.color,
id:l,r:o})+")",function(t){return d}})),this.attrTween("d",(function(t,n){
void 0===this._current&&(this._current=a.startingPosition(t,n))
;var e=i.interpolate(this._current,t);return this._current=e(0),function(t){
return d(e(t))}}))),this})).call(a.endall,(function(){
a.initialized=!0,a.lastPieData=s
})),a.options.draggable&&A.call(g),A.exit().transition().duration(_).attrTween("d",(function(t,n){
var e={startAngle:t.startAngle,endAngle:t.startAngle}
;n>0&&s.length&&n<=s.length&&(e={startAngle:s[n-1].endAngle,
endAngle:s[n-1].endAngle});var a=i.interpolate(this._current,e)
;return this._current=a(0),function(t){return d(a(t))}
})).each("end",(function(t){i.select(this).remove()}))
;var b=this.D3svg().select(this.region("chart")).selectAll(".labelG").data([0])
;b.enter().append("g").attr("class","labelG").attr("transform","translate("+(e.size.width/2+this.options.xOffset)+","+(e.size.height/2+this.options.yOffset)+")")
;var y=b.selectAll(".label").data(s.filter((function(t){
return(a.options.labels||t.data.forceLabel)&&void 0!==t.data.label&&t.data.label.length
})),this.uniqueness())
;y.enter().append("text").attr("class","label").call((function(){h.call(this,1)
})),y.call((function(){return this})).transition().duration(_).call((function(){
h.call(this,1)})),y.exit().transition().duration(_).call((function(){
h.call(this,0)})).each("end",(function(t){i.select(this).remove()}))
;var R=function(t){
return void 0===t&&(t=1),this.attrTween&&this.attrTween("stroke-opacity",(function(e,r){
void 0===this._currentOpacity&&(this._currentOpacity=a.initialized?0:n)
;var s=i.interpolate(this._currentOpacity,t);this._currentOpacity=s(0)
;var o=this;return function(t){return o._currentOpacity=s(t)}
})).attrTween("points",(function(n,e){
this._current=this._current||a.startingPosition(n,e);var r=n;0===t&&(r={
startAngle:n.startAngle,endAngle:n.startAngle
},e>0&&s.length&&(e>s.length&&(e=s.length),r={startAngle:s[e-1].endAngle,
endAngle:s[e-1].endAngle}))
;var l=i.interpolate(this._current,r),h=a.useOutsideLabels(n),g=h?u:d
;return this._current=l(0),function(t){var i=l(t),n=g.centroid(i)
;return h&&(n[0]=1.05*o*a.midPosition(i)),[c.centroid(i),g.centroid(i),n]}
})),this},P=b.selectAll("polyline").data(s.filter((function(t){
return(a.options.labels||t.data.forceLabel)&&(a.options.outsideLabels||t.data.outsideLabel)&&void 0!==t.data.label&&t.data.label.length
})),this.uniqueness())
;P.enter().append("polyline").attr("stroke","black").attr("stroke-width",1).attr("fill","rgba(0,0,0,0)"),
P.transition().duration(_).call((function(){R.call(this,1)
})),P.exit().transition().duration(_).call((function(){R.call(this,0)
})).each("end",(function(t){i.select(this).remove()}))}},
renderXAxis:function(){},renderYAxis:function(){}})}));