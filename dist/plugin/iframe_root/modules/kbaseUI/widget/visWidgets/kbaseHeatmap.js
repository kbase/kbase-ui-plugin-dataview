define(["jquery","d3","./visWidget"],(function(t,e){"use strict";t.KBWidget({
name:"kbaseHeatmap",parent:"kbaseVisWidget",version:"1.0.0",options:{
scaleAxes:!0,xScaleType:"ordinal",yScaleType:"ordinal",yGutter:80,yPadding:20,
xPadding:150,xGutter:110,overColor:"#999900",hmBGColor:"lightgray",
colors:["#0000FF","#FFFFFF","#FF0000"],rx:2,ry:2,cellPadding:1},
_accessors:["spectrum"],init:function(t){this._super(t)
;var e=this.colorScale().nice().domain(),i=100*Math.abs(e[0])/(Math.abs(e[0])+Math.abs(e[2]))
;return this.options.gradientID=this.linearGradient({colors:this.options.colors,
gradStops:["0%",i+"%","100%"]}),this},setDataset:function(e){
void 0===e.data||t.isArray(e.data)||(e=e.data),this._super(e)},
setSpectrum:function(t){
this.spectrum(e.scale.ordinal().domain(e.range(0,1)).range(t))},
defaultXDomain:function(){
return void 0===this.dataset()?[0,0]:this.dataset().column_labels},
defaultYDomain:function(){
return void 0===this.dataset()?[0,0]:this.dataset().row_labels},
setXScaleRange:function(t,e){
return void 0===e&&(e=this.xScale()),e.rangeBands(t),e},
setYScaleRange:function(t,e){
return void 0===e&&(e=this.yScale()),e.rangeBands(t),e},renderXAxis:function(){
if(void 0!==this.xScale()&&void 0!==this.xScale().domain){
var t=e.svg.axis().scale(this.xScale()).orient("top"),i=this.D3svg().select(".yGutter").select(".xAxis")
;void 0===i[0][0]&&(i=this.D3svg().select(".yGutter").append("g").attr("class","xAxis axis").attr("transform","translate(0,"+this.yGutterBounds().size.height+")"))
;var a=this
;i.transition().duration(0).call(t),i.selectAll("text").each((function(t,i){
var s=e.select(this).text()
;s.length>15&&e.select(this).text(s.substring(0,12)+"...")
;var o=a.dataset().column_labels.indexOf(s)
;e.select(this).attr("data-id",a.dataset().column_ids[o]),
e.select(this).attr("transform",(function(t,i){a.yGutterBounds()
;return"rotate(-45,0,0) translate("+(e.select(this).node().getComputedTextLength()/2+5)+",5)"
})).on("mouseover",(function(t){e.select(this).attr("fill",a.options.overColor)
;var i=e.select(this)
;a.options.labelOver?a.options.labelOver.call(this,t):i.text()!==s&&a.showToolTip({
label:s})})).on("mouseout",(function(t){
e.select(this).attr("fill","black"),a.options.labelOut?a.options.labelOut.call(this,t):a.hideToolTip()
}))}))}},renderXLabel:function(){var t=this.yGutterBounds(),e=[this.xLabel()]
;this.D3svg().select(".yPadding").selectAll(".xLabel").data(e).text(this.xLabel()).enter().append("text").attr("class","xLabel").attr("x",t.size.width/2).attr("y",t.size.height/2+3).attr("text-anchor","middle").attr("font-size","11px").attr("font-family","sans-serif").attr("fill","black").text(this.xLabel())
},renderYLabel:function(){var t=this.xGutterBounds()
;this.D3svg().select(this.region("xGutter")).selectAll(".yLabel").data([0]).enter().append("rect").attr("x",5).attr("y",0).attr("width",t.size.width/3).attr("height",t.size.height).attr("font-size","11px").attr("font-family","sans-serif").attr("fill","black").attr("fill","url(#"+this.options.gradientID+")")
;var i=this.colorScale(),a=[i.domain()[i.domain().length-1],i.domain()[0]],s=e.scale.linear().domain(a).range([0,t.size.height]).nice(),o=e.svg.axis().scale(s).orient("right"),l=this.D3svg().select(this.region("xGutter")).select(".tempAxis")
;void 0===l[0][0]&&(l=this.D3svg().select(this.region("xGutter")).append("g").attr("class","tempAxis axis").attr("transform","translate("+(t.size.width/3+6)+",0)")),
o.tickFormat(e.format(".2f")),l.transition().call(o)},renderYAxis:function(){
if(void 0!==this.yScale()){
var t=e.svg.axis().scale(this.yScale()).orient("left"),i=this.D3svg().select(this.region("xPadding")).select(".yAxis"),a=this
;void 0===i[0][0]&&(i=this.D3svg().select(this.region("xPadding")).append("g").attr("class","yAxis axis").attr("transform","translate("+this.xPaddingBounds().size.width+",0)")),
i.transition().call(t),i.selectAll("text").each((function(t,i){
var s=e.select(this).text()
;s.length>23&&e.select(this).text(s.substring(0,18)+"...")
;var o=a.dataset().row_labels.indexOf(s)
;e.select(this).attr("data-id",a.dataset().row_ids[o]),
e.select(this).on("mouseover",(function(t){
e.select(this).attr("fill",a.options.overColor);var i=e.select(this)
;a.options.labelOver?a.options.labelOver.call(this,t):i.text()!==s&&a.showToolTip({
label:s})})).on("mouseout",(function(t){
e.select(this).attr("fill","black"),a.options.labelOut?a.options.labelOut.call(this,t):a.hideToolTip()
}))}))}},colorScale:function(){var t=this.options.colorScale;if(void 0===t){
var i=this.options.maxValue,a=this.options.minValue
;if(void 0!==this.dataset()&&(void 0===i||void 0===a)){i=0,a=0
;for(var s=0;s<this.dataset().data.length;s++)for(var o=this.dataset().data[s],l=0;l<o.length;l++)o[l]>i&&(i=o[l]),
o[l]<a&&(a=o[l])}var r=[a,0,i]
;r[0]=a,r[r.length-1]=i,t=e.scale.linear().domain(r).range(this.options.colors)}
return t},cellHeight:function(){
return this.yScale().rangeBand()-2*this.options.cellPadding},
renderChart:function(){var t=this,i=this.chartBounds()
;if(void 0!==this.dataset()){var a=this.yScale().copy()
;a.domain(this.dataset().row_ids);var s=this.xScale().copy()
;s.domain(this.dataset().column_ids)
;var o=this.initialized?this.options.transitionTime:0
;this.D3svg().select(this.region("chart")).selectAll(".hmBG").data([0]).enter().append("rect").attr("x",0).attr("y",0).attr("width",i.size.width).attr("height",i.size.height).attr("fill",t.options.hmBGColor).attr("class","hmBG")
;for(var l=[],r=this.colorScale(),n=0;n<this.dataset().data.length;n++)for(var c=this.dataset().data[n],h=0;h<c.length;h++)l.push({
x:this.dataset().column_ids[h],y:this.dataset().row_ids[n],
column:this.dataset().column_labels[h],row:this.dataset().row_labels[n],
value:c[h],color:r(c[h])})
;var d=this.D3svg().select(this.region("chart")).selectAll(".davis-cell").data(l)
;d.enter().append("rect").attr("class","davis-cell"),d.call((function(){
return this.on("mouseover",(function(i){if(t.options.overColor){
e.select(this).attr("stroke",t.options.overColor).attr("stroke-width",5),
t.D3svg().select(".yGutter").selectAll("g g text").attr("fill",(function(a,s){
var o=i.x
;if(t.options.useIDMapping&&(o=t.xIDMap()[o]),e.select(this).attr("data-id")===o)return t.options.overColor
})),
t.D3svg().select(".xPadding").selectAll("g g text").attr("fill",(function(a,s){
var o=i.y
;if(t.options.useIDMapping&&(o=t.yIDMap()[o]),e.select(this).attr("data-id")===o)return t.options.overColor
}));var a=i.x;t.options.useIDMapping&&(a=t.xIDMap()[a]);var s=i.y
;t.options.useIDMapping&&(s=t.yIDMap()[s]),t.showToolTip({
label:i.label||"Value for: "+i.row+" - "+i.column+"<br>is "+i.value})}
})).on("mouseout",(function(i){
t.options.overColor&&(e.select(this).attr("stroke",0),
t.D3svg().select(".yGutter").selectAll("g g text").attr("fill",(function(t,e){
return"black"
})),t.D3svg().select(".xPadding").selectAll("g g text").attr("fill",(function(t,e){
return"black"})),t.hideToolTip())})).on("click",(function(e){
t.options.clickCallback&&t.options.clickCallback(e,t)})),this
})).transition().duration(o).call((function(){return this.attr("x",(function(e){
var i=e.x;return t.options.useIDMapping&&(i=t.xIDMap()[i]),s(i)+1
})).attr("y",(function(e){var i=e.y
;return t.options.useIDMapping&&(i=t.yIDMap()[i]),a(i)+1
})).attr("width",t.xScale().rangeBand()-2*t.options.cellPadding).attr("height",t.cellHeight()).attr("rx",t.options.rx).attr("ry",t.options.ry).attr("fill",(function(t){
return t.color})),this})).call(t.endall,(function(){t.initialized=!0
})),d.data(l).exit().remove()}}})}));