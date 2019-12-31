define(["jquery","d3","./visWidget"],(function(t,i){"use strict";t.KBWidget({
name:"kbaseLinechart",parent:"kbaseVisWidget",version:"1.0.0",options:{
overColor:"yellow",useOverLine:!0,highlightToFront:!1,useLineLabelToolTip:!0,
lineWidth:3,lineCap:"round",strokeColor:"black",fillColor:"none",
strokeOpacity:1,fillOpacity:.3,xIncrementor:function(t){return void 0!==t?t+1:0
},useHighlightLine:!0,highlightLineColor:"red",highlightLineWidth:1,
shapeArea:64,xInset:.1,yInset:.1},_accessors:[],legendOver:function(t){
t.svg.parentNode.appendChild(t.svg)},legendOut:function(){},
extractLegend:function(t){var i=[];t.forEach((function(t){i.push({
color:t.strokeColor,label:t.label,shape:t.shape,represents:t})
})),this.setLegend(i)},setDataset:function(i){var e,o=this
;i.forEach((function(i){if(i.values){
var n=[],r=i.values.length,s=o.options.xIncrementor,a=s();for(e=0;e<r;e++){
var l=i.values[e]
;t.isPlainObject(l)?(l.x?a=s(l.x):l.x=a,void 0!==l.y2&&(n.push({x:l.x,y:l.y2
}),delete l.y2)):(i.values[e]={x:a,y:l},a=s(a))}if(n.length){
for(e=n.length-1;e>=0;e--)i.values.push(n[e]);i.values.push(i.values[0])}}
})),this._super(i)},defaultXDomain:function(){
if(void 0===this.dataset())return[0,0];var t=[i.min(this.dataset(),(function(t){
return i.min(t.values.map((function(t){return t.x})))
})),i.max(this.dataset(),(function(t){return i.max(t.values.map((function(t){
return t.x})))}))],e=Math.max(this.options.xInset*t[0],this.options.xInset*t[1])
;return t[0]-=e,t[1]+=e,t},defaultYDomain:function(){
if(void 0===this.dataset())return[0,0];var t=[i.min(this.dataset(),(function(t){
return i.min(t.values.map((function(t){return t.y})))
})),i.max(this.dataset(),(function(t){return i.max(t.values.map((function(t){
return t.y})))}))],e=Math.max(this.options.yInset*t[0],this.options.yInset*t[1])
;return t[0]-=e,t[1]+=e,t},renderChart:function(){if(void 0!==this.dataset()){
var t=this.chartBounds(),e=this,o=i.svg.line().x((function(t){
return e.xScale()(t.x)})).y((function(t){return e.yScale()(t.y)})),n=function(){
return this.attr("d",(function(t){return o(t.values)
})).attr("stroke",(function(t){return t.strokeColor||e.options.strokeColor
})).attr("fill",(function(t){return t.fillColor||e.options.fillColor
})).attr("fill-opacity",(function(t){return t.fillOpacity||e.options.fillOpacity
})).attr("stroke-opacity",(function(t){
return t.strokeOpacity||e.options.strokeOpacity
})).attr("stroke-width",(function(t){
return void 0!==t.width?t.width:e.options.lineWidth
})).attr("stroke-linecap",(function(t){return t.linecap||e.options.lineCap
})).attr("stroke-dasharray",(function(t){return t.dasharray})),this
},r=function(){return this.on("mouseover",(function(t){
e.options.useOverLine&&e.options.overColor&&i.select(this).attr("stroke",e.options.overColor).attr("stroke-width",(t.width||e.options.lineWidth)+.5),
t.label&&e.options.useLineLabelToolTip&&e.showToolTip({label:t.label
}),e.options.highlightToFront&&t.svg.parentNode.appendChild(t.svg)
})).on("mouseout",(function(){
e.options.useOverLine&&e.options.overColor&&i.select(this).attr("stroke",(function(t){
return t.strokeColor||e.options.strokeColor})).attr("stroke-width",(function(t){
return void 0!==t.width?t.width:e.options.lineWidth
})),e.options.useLineLabelToolTip&&e.hideToolTip()})),this}
;if(this.options.hGrid&&this.yScale){
var s=i.svg.axis().scale(this.yScale()).orient("left").tickSize(0-t.size.width).outerTickSize(0).tickFormat(""),a=this.D3svg().select(this.region("chart")).select(".yAxis")
;void 0===a[0][0]&&(a=this.D3svg().select(this.region("chart")).append("g").attr("class","yAxis axis").attr("transform","translate(0,0)")),
a.transition().call(s),a.selectAll("line").style("stroke","lightgray")}
var l=this.data("D3svg").select(this.region("chart")).selectAll(".line").data(this.dataset(),(function(t){
return t.label}))
;l.enter().append("path").attr("class","line").call(n).call(r).each((function(t){
t.svg=this
})),l.call(r).transition().duration(this.options.transitionTime).call(n),
l.exit().remove();var h=e.linesDrawn?e.options.transitionTime:0,u=[]
;this.dataset().forEach((function(t){t.values.forEach((function(i){
if(t.shape||i.shape){var o={};for(var n in i)o[n]=i[n]
;o.color=i.color||t.fillColor||t.strokeColor||e.options.fillColor,
o.shape=i.shape||t.shape,
o.shapeArea=i.shapeArea||t.shapeArea||e.options.shapeArea,
o.pointOver=i.pointOver||t.pointOver||e.options.pointOver,
o.pointOut=i.pointOut||t.pointOut||e.options.pointOut,
o.id=[i.x,i.y,t.label].join("/"),u.push(o)}}))}))
;var c=e.data("D3svg").select(e.region("chart")).selectAll(".point").data(u,(function(t){
return t.id}))
;if(c.enter().append("path").attr("class","point").attr("opacity",0).attr("transform",(function(t){
return"translate("+e.xScale()(t.x)+","+e.yScale()(t.y)+")"
})).on("mouseover",(function(t){
e.options.overColor&&i.select(this).attr("fill",e.options.overColor),
t.label?e.showToolTip({label:t.label}):t.pointOver&&t.pointOver.call(e,t)
})).on("mouseout",(function(t){
e.options.overColor&&i.select(this).attr("fill",(function(t){return t.color
})),t.label?e.hideToolTip():t.pointOut&&t.pointOut.call(e,t)
})),c.transition().duration(h).attr("transform",(function(t){
return"translate("+e.xScale()(t.x)+","+e.yScale()(t.y)+")"
})).attr("d",(function(t){
return i.svg.symbol().type(t.shape).size(t.shapeArea)()
})).attr("fill",(function(t){return t.color
})).attr("opacity",1),c.exit().transition().duration(h).attr("opacity",0).remove(),
this.options.useHighlightLine){
var p=this.data("D3svg").select(this.region("chart")).selectAll(".highlight").data([0])
;p.enter().append("line").attr("x1",t.size.width/2).attr("x2",t.size.width/2).attr("y1",0).attr("y2",t.size.height).attr("opacity",0).attr("stroke",this.options.highlightLineColor).attr("stroke-width",this.options.highlightLineWidth).attr("pointer-events","none"),
this.data("D3svg").select(this.region("chart")).on("mouseover",(function(){
p.attr("opacity",1)})).on("mousemove",(function(){var t=i.mouse(this)
;p.attr("x1",t[0]).attr("x2",t[0]).attr("opacity",1)
})).on("mouseout",(function(){p.attr("opacity",0)}))}this.linesDrawn=!0}},
setYScaleRange:function(t,i){return this._super(t.reverse(),i)}})}));