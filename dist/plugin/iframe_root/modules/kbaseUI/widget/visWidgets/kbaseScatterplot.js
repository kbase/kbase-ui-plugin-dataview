define(["jquery","d3","./visWidget"],(function(t,e){"use strict";t.KBWidget({
name:"kbaseScatterplot",parent:"kbaseVisWidget",version:"1.0.0",options:{
overColor:"yellow",weight:20,color:"black",shape:"circle"},_accessors:[],
defaultXDomain:function(){
return void 0===this.dataset()?[0,0]:[.9*e.min(this.dataset().map((function(t){
return t.x})).filter((function(t){return"log"!==this.xScaleType()||0!==t
}),this)),1.1*e.max(this.dataset().map((function(t){return t.x})))]},
defaultYDomain:function(){
return void 0===this.dataset()?[0,0]:[.9*e.min(this.dataset().map((function(t){
return t.y})).filter((function(t){return"log"!==this.yScaleType()||0!==t
}),this)),1.1*e.max(this.dataset().map((function(t){return t.y})))]},
renderChart:function(){if(void 0!==this.dataset()){this.chartBounds()
;var t=this,i=this.rendered?this.options.transitionTime:0,n=this.D3svg().select(this.region("chart")).selectAll(".point").data(this.dataset())
;n.enter().append("path").attr("class","point"),
n.exit().remove(),n.call((function(){return this.on("mouseover",(function(i){
t.options.overColor&&e.select(this).attr("stroke",t.options.overColor).attr("stroke-width",3)
;var n=i.label?i.label:(t.options.weight||i.weight)+" at ("+i.x+","+i.y+")"
;void 0!==n&&t.showToolTip({label:n})})).on("mouseout",(function(i){
t.options.overColor&&e.select(this).transition().attr("stroke","none"),
t.D3svg().select(t.region("yPadding")).selectAll("g g text").attr("fill",(function(t,e){
return"black"})),t.hideToolTip()})),this
})).transition().duration(i).attr("transform",(function(e){
var i=t.xScale()(e.x),n=t.yScale()(e.y)
;return"translate("+(i=isNaN(i)?-5e5:i)+","+(n=isNaN(n)?-5e5:n)+")"
})).attr("d",(function(i){
return e.svg.symbol().type(i.shape||t.options.shape).size(i.weight||t.options.weight)()
})).call((function(){this.attr("cx",(function(e){var i=t.xScale()(e.x)
;return isNaN(i)?-5e5:i})).attr("cy",(function(e){var i=t.yScale()(e.y)
;return isNaN(i)?-5e5:i})).attr("r",(function(e){
return e.weight||t.options.weight})).attr("fill",(function(e){
return e.color||t.options.color}))})),this.rendered=!0}},
setYScaleRange:function(t,e){return this._super(t.reverse(),e)}})}));