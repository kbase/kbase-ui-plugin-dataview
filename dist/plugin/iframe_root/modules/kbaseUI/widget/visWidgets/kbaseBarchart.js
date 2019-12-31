define(["jquery","d3","./visWidget"],(function(t,e){"use strict";t.KBWidget({
name:"kbaseBarchart",parent:"kbaseVisWidget",version:"1.0.0",options:{
xScaleType:"ordinal",overColor:"yellow",strokeWidth:2,zeroLine:!1,
zeroLineColor:"black",zeroLineWidth:1},_accessors:[],defaultXDomain:function(){
return void 0===this.dataset()?[0,0]:this.dataset().map((function(t){
return t.bar}))},defaultYDomain:function(){
if(void 0===this.dataset())return[0,0]
;var a=.9*e.min(this.dataset().map((function(a){
return t.isArray(a.value)?a.stacked?e.sum(a.value):e.min(a.value):a.value})))
;return a>0&&(a=0),[a,1.1*e.max(this.dataset().map((function(a){
return t.isArray(a.value)?a.stacked?e.sum(a.value):e.max(a.value):a.value})))]},
extractLegend:function(e){var a=[];e.forEach((function(e,i){
t.isArray(e.color)||a.push({color:e.color,label:e.bar})})),this.setLegend(a)},
renderChart:function(){if(void 0!==this.dataset()){
var a=this.chartBounds(),i=this,r=this.initialized?this.options.transitionTime:0,s=function(r,s,o,n){
return n?this.attr("x",(function(t,e){var a=s.bar
;return i.options.useIDMapping&&(a=i.xIDMap()[a]),i.xScale()(a)+r(s.stacked?0:e)
})).attr("y",a.origin.x+a.size.height).attr("height",0).attr("opacity",0):this.attr("x",(function(t,e){
var a=s.bar
;return i.options.useIDMapping&&(a=i.xIDMap()[a]),i.xScale()(a)+r(s.stacked?0:e)
})).attr("opacity",1).attr("y",(function(a,r){var o=a
;return s.stacked&&t.isArray(s.value)&&(o=e.sum(s.value.slice(0,r+1))),
i.yScale()(Math.max(0,o))})).attr("height",(function(t,e){
return Math.abs(i.yScale()(0)-i.yScale()(t))
})),this.attr("width",r.rangeBand()).attr("fill",(function(t,e){
return s.color[e%s.color.length]})).attr("stroke",(function(t,e){
return s.stroke?s.stroke[e%s.stroke.length]:"none"
})).attr("stroke-width",(function(t,e){
return s.strokeWidth||i.options.strokeWidth})).attr("data-fill",(function(t,e){
return s.color[e%s.color.length]})),this},o=function(t,a){
return this.on("mouseover",(function(a,r){var s=t.bar
;if(i.options.useIDMapping&&(s=i.xIDMap()[s]),i.options.overColor){
e.select(this).attr("stroke",i.options.overColor).attr("stroke-width",3),
i.data("D3svg").select(".yPadding").selectAll("g g text").attr("fill",(function(t,a){
return t===s?(this.oldFill=e.select(this).attr("fill"),
this.hasOldFill=!0,i.options.overColor):e.select(this).attr("fill")}));var o=s
;t.value.length>1&&(o+="["+(r+1)+"]")
;var n=void 0!==t.label?t.label[r%t.label.length]:o+" is "+t.value[r%t.value.length],l=t.tooltip?t.tooltip[r%t.tooltip.length]:n
;void 0!==n&&i.showToolTip({label:l})}})).on("mouseout",(function(a,r){
i.options.overColor&&(e.select(this).transition().attr("stroke",(function(e){
return t.stroke?t.stroke[r%t.stroke.length]:"none"
})).attr("stroke-width",(function(e){return t.strokeWidth||i.options.strokeWidth
})),
i.data("D3svg").select(".yPadding").selectAll("g g text").attr("fill",(function(t,a){
return this.hasOldFill?(this.hasOldFill=!1,
this.oldFill):e.select(this).attr("fill")})),i.hideToolTip())})),this
},n=function(){return this.each((function(n,l){
void 0===n.value||t.isArray(n.value)||(n.value=[n.value]),
void 0===n.color||t.isArray(n.color)||(n.color=[n.color]),
void 0===n.stroke||t.isArray(n.stroke)||(n.stroke=[n.stroke]),
void 0===n.label||t.isArray(n.label)||(n.label=[n.label]),
void 0===n.tooltip||t.isArray(n.tooltip)||(n.tooltip=[n.tooltip]);var c=[0]
;if(!n.stacked){var h=0;for(h=0;h<n.value.length;h++)c.push(h)}
var u=e.scale.ordinal().domain(c).rangeBands([0,i.xScale().rangeBand()],.05)
;e.scale.ordinal().domain(c).rangeBands([0,85],.05)
;e.select(this).selectAll(".barcharBar").data(n.value).enter().append("rect").attr("class","barcharBar").call((function(){
return s.call(this,u,n,l,!0)
})),e.select(this).selectAll(".barcharBar").data(n.value).call((function(){
return o.call(this,n,l)})).transition().duration(r).call((function(){
return s.call(this,u,n,l)
})),e.select(this).selectAll(".barcharBar").data(n.value).exit().transition().duration(r).attr("x",a.origin.x+a.size.width).attr("opacity",0)
})),this};if(this.options.hGrid&&this.yScale){
var l=e.svg.axis().scale(this.yScale()).orient("left").tickSize(0-a.size.width).outerTickSize(0).tickFormat(""),c=this.D3svg().select(this.region("chart")).select(".yAxis")
;void 0===c[0][0]&&(c=this.D3svg().select(this.region("chart")).append("g").attr("class","yAxis axis").attr("transform","translate(0,0)")),
c.transition().call(l),c.selectAll("line").style("stroke","lightgray")}
var h=this.D3svg().select(this.region("chart")).selectAll(".barGroup")
;if(h.data(this.dataset(),i.uniqueness()).enter().append("g").attr("class","barGroup").call(n),
h.data(this.dataset(),i.uniqueness()).call(n),
h.data(this.dataset(),i.uniqueness()).exit().call((function(){
this.each((function(t,i){
e.select(this).selectAll(".barcharBar").transition().duration(r).attr("y",(function(t){
return a.origin.x+a.size.height})).attr("opacity",0).each("end",(function(){
e.select(this.parentNode).remove()}))}))})),this.options.zeroLine){
var u=this.D3svg().select(this.region("chart")).selectAll(".zeroLine")
;u.data([0]).enter().append("line").attr("class","zeroLine").attr("x1",0).attr("x2",a.size.width).attr("stroke",i.options.zeroLineColor).attr("stroke-width",i.options.zeroLineWidth).attr("y1",i.yScale()(0)).attr("y2",i.yScale()(0)),
u.data([0]).transition().duration(r).attr("y1",i.yScale()(0)).attr("y2",i.yScale()(0))
}this.initialized=!0}},setXScaleRange:function(t,e){
return void 0===e&&(e=this.xScale()),e.rangeBands(t,.05),e},
setYScaleRange:function(t,e){return this._super(t.reverse(),e.nice())}})}));