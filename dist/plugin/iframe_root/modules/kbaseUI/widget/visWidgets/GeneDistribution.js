define("GeneDistribution",["jquery","d3","./visWidget"],(function(t,i){
"use strict";t.KBWidget({name:"GeneDistribution",parent:"kbaseVisWidget",
version:"1.0.0",options:{xScaleType:"ordinal",overColor:"yellow",
strokeWidth:"2",xGutter:0,yGutter:0,xPadding:0,yPadding:0,debug:!1,
colorScale:function(t){
var n=i.scale.category20(),e=i.scale.category20b(),r=i.scale.category20c()
;return function(t){return t<20||t>=60?n(t%20):t<40?e(t%20):t<60?r(t%20):void 0}
},inset:5,colorDomain:[0,100],transitionTime:200},_accessors:[],
binColorScale:function(t,n){var e=0;return t.forEach((function(t,i){
t.results&&t.results.count>e&&(e=t.results.count)
})),i.scale.linear().domain([0,e]).range(["#FFFFFF",n])},
renderXAxis:function(){},renderYAxis:function(){},domain:function(t){
for(var i=1e6,n=-1e6,e=0;e<t.length;e++)t[e].end>n&&(n=t[e].end),
t[e].start<i&&(i=t[e].start);return[i,n]},regionDomain:function(t){var i=0,n={
end:0};return t.forEach((function(t,e){
i+=t.size,t.start=n.end,t.end=t.start+t.size,n=t})),[0,i]},
renderChart:function(){if(null!=this.dataset()){
var t=this.chartBounds(),n=this.regionDomain(this.dataset()),e=i.scale.linear().domain(n).range([0,t.size.width]),r=this,a=function(t,i){
return this.on("mouseover",(function(t,i){
if(r.options.tooltip)r.options.tooltip(t);else if(t.start&&t.regionObj.name){
var n=t.results?t.results.count:0;n&&r.showToolTip({
label:"bin starting at : "+t.start+" for "+t.regionObj.name+" score is "+n})}
})).on("mouseout",(function(t,i){r.hideToolTip()})),this},o=[]
;this.dataset().forEach((function(t,i){t._bins.forEach((function(i,n){
i.regionObj=t,o.push(i)}))}))
;var s=this.initialized?this.options.transitionTime:0,c=this.D3svg().select(this.region("chart")).selectAll(".regions").data([0])
;c.enter().append("g").attr("class","regions")
;var l=c.selectAll(".region").data(this.dataset(),(function(t){return t.name}))
;l.enter().append("rect").attr("class","region").attr("opacity",0).attr("x",t.size.width).attr("y",0).attr("width",0).attr("height",t.size.height),
l.call((function(t){return a.call(this,t)
})).transition().duration(s).attr("opacity",1).attr("x",(function(t){
return e(t.start)})).attr("width",(function(t){return e(t.size)
})).attr("fill",(function(t,n){
return i.scale.linear().domain([0,1]).range(["#FFFFFF",r.colorForRegion(t.name)])(.25)
})),
l.exit().transition().duration(s).attr("opacity",0).attr("x",t.size.width+1).attr("width",0).each("end",(function(t){
i.select(this).remove()}))
;var u=this.D3svg().select(this.region("chart")).selectAll(".bins").data([0])
;u.enter().append("g").attr("class","bins");var d=u.selectAll(".bin").data(o)
;d.enter().append("rect").attr("class","bin").attr("opacity",0).attr("x",t.size.width).attr("y",0).attr("width",0).attr("height",t.size.height),
d.call((function(t){return a.call(this,t)
})).transition().duration(s).attr("opacity",(function(t){return t.results?1:0
})).attr("x",(function(t){return e(t.start+t.regionObj.start)
})).attr("width",(function(t){return e(t.end-t.start)
})).attr("fill",(function(t,i){return r.colorForRegion(t.region)
})),d.exit().transition().duration(s).attr("opacity",0).attr("x",t.size.width+1).attr("width",0).each("end",(function(t){
i.select(this).remove()})),this.initialized=!0}},colorForRegion:function(t,n){
var e=this.regionColors;return null==e&&(e=this.regionColors={
colorScale:this.options.colorScale()
}),null==e[t]&&(e[t]=e.colorScale(i.keys(e).length)),e[t]}})}));