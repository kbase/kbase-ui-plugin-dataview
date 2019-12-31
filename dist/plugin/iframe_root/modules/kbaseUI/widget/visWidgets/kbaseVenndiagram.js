define(["jquery","d3","./visWidget"],(function(t,i){"use strict";t.KBWidget({
name:"kbaseVenndiagram",parent:"kbaseVisWidget",version:"1.0.0",options:{
xGutter:0,xPadding:0,yPadding:0,xOffset:0,yOffset:0,overlap:.2,fillOpacity:.8,
startAngle:2*Math.PI*150/360,strokeWidth:2,strokeColor:function(){return"black"
},fillColor:function(e,a,n){
if(void 0===n.fillScale&&(n.fillScale=i.scale.category20()),
void 0===n.circleColors&&(n.circleColors=[]),
a.data.fillColor)return n.circleColors[e]=a.data.fillColor,a.data.fillColor
;if(a.fillColor)return n.circleColors[e]=a.fillColor,a.fillColor
;if(t.isArray(e)){var o=[];t.each(e,(function(t,e){
o.push(i.rgb(n.options.fillColor(e,a,n)))}));var r=i.rgb()
;return t.each(o,(function(t,i){
r.r+=Math.floor(i.r/2),r.g+=Math.floor(i.g/2),r.b+=Math.floor(i.b/2)
})),r.toString()}var l=n.circleColors[e]
;return void 0===l&&(l=n.circleColors[e]=n.fillScale(e)),l},
circleFontSize:"18pt",intersectFontSize:"24pt",drawLabels:!0,tooltips:!0,
radiusScale:1},_accessors:[],init:function(t){return this._super(t),this},
intersectCircles:function(t,i){var e={x:Math.cos(t.angle)*t.originDistance,
y:-Math.sin(t.angle)*t.originDistance},a={x:Math.cos(i.angle)*t.originDistance,
y:-Math.sin(i.angle)*t.originDistance
},n=Math.min(e.x,a.x),o=Math.min(e.y,a.y),r={x:n+Math.abs(e.x-a.x)/2,
y:o+Math.abs(e.y-a.y)/2},l=e.x-a.x,s=e.y-a.y,c=Math.PI/2
;0!==l&&(c=Math.atan(s/l))
;var d=Math.PI/2-c,u=Math.sqrt(Math.pow(r.x-n,2)+Math.pow(r.y-o,2)),h=Math.sin(Math.acos(u/i.r))*i.r,f={
x:r.x+Math.cos(d)*h,y:r.y-Math.sin(d)*h},p={x:r.x+Math.cos(d+Math.PI)*h,
y:r.y-Math.sin(d+Math.PI)*h}
;return Math.sqrt(Math.pow(f.x,2)+Math.pow(f.y,2))>Math.sqrt(Math.pow(p.x,2)+Math.pow(p.y,2))?[f,p,r]:[p,f,r]
},renderChart:function(){var t=this.chartBounds(),e=this,a=e.dataset()
;if(void 0!==a){
var n=this.options.radius||Math.min(t.size.width,t.size.height)/2
;n*=this.options.radiusScale
;var o=this.data("D3svg").select(this.region("chart")).selectAll(".venn").data([0])
;o.enter().append("g").attr("class","venn").attr("transform","translate("+(t.size.width/2+this.options.xOffset)+","+(t.size.height/2+this.options.yOffset)+")"),
n*=.5;var r=(n=this.options.radius||n)*(1-this.options.overlap),l=[{id:0,
angle:e.options.startAngle,r:n,originDistance:r},{id:1,
angle:e.options.startAngle+2*Math.PI/3,r:n,originDistance:r},{id:2,
angle:e.options.startAngle+2*Math.PI/3*2,r:n,originDistance:r
}],s=this.intersectCircles(l[0],l[1]),c=this.intersectCircles(l[1],l[2]),d=this.intersectCircles(l[0],l[2]),u=[{
angle:l[0].angle,label:a.c1.label,value:a.c1.value,radius:1.3*r,anchor:"end",
fontSize:this.options.circleFontSize},{angle:l[0].angle,value:a.c1.value,
radius:1.3*r,anchor:"end",fontSize:this.options.circleFontSize,dy:"1.5em"},{
angle:l[1].angle,label:a.c2.label,value:a.c2.value,radius:1.3*r,anchor:"start",
fontSize:this.options.circleFontSize},{angle:l[1].angle,value:a.c2.value,
radius:1.3*r,anchor:"start",fontSize:this.options.circleFontSize,dy:"1.5em"},{
angle:l[2].angle,label:a.c3.label,value:a.c3.value,radius:1.3*r,anchor:"middle",
fontSize:this.options.circleFontSize},{angle:l[2].angle,value:a.c3.value,
radius:1.3*r,anchor:"middle",fontSize:this.options.circleFontSize,dy:"1.5em"},{
angle:2*Math.PI*90/360,value:a.c1c3.value,radius:.7*r,
fontSize:this.options.intersectFontSize},{angle:2*Math.PI*210/360,
value:a.c1c2.value,radius:.7*r,fontSize:this.options.intersectFontSize},{
angle:2*Math.PI*330/360,value:a.c2c3.value,radius:.7*r,
fontSize:this.options.intersectFontSize},{angle:0,value:a.c1c2c3.value,radius:0,
fontSize:this.options.intersectFontSize
}],h=this.initialized?this.options.transitionTime:0,f=[{
d:"M "+d[0].x+" "+d[0].y+" A "+n+" "+n+" 0 1 0 "+s[0].x+" "+s[0].y+" A "+n+" "+n+" 0 0 1 "+c[1].x+" "+c[1].y+" A "+n+" "+n+" 0 0 1 "+d[0].x+" "+d[0].y+" Z",
circle:0,fillColor:"#F00",data:a.c1},{
d:"M "+d[0].x+" "+d[0].y+" A "+n+" "+n+" 0 1 1 "+c[0].x+" "+c[0].y+" A "+n+" "+n+" 0 0 0 "+s[1].x+" "+s[1].y+" A "+n+" "+n+" 0 0 0 "+d[0].x+" "+d[0].y+" Z",
circle:1,fillColor:"#00F",data:a.c2},{
d:"M "+c[0].x+" "+c[0].y+" A "+n+" "+n+" 0 1 1 "+s[0].x+" "+s[0].y+" A "+n+" "+n+" 0 0 0 "+d[1].x+" "+d[1].y+" A "+n+" "+n+" 0 0 0 "+c[0].x+" "+c[0].y+" Z",
circle:2,fillColor:"#0F0",data:a.c3},{
d:"M "+s[1].x+" "+s[1].y+" A "+n+" "+n+" 0 0 0 "+c[1].x+" "+c[1].y+" A "+n+" "+n+" 0 0 0 "+d[1].x+" "+d[1].y+" A "+n+" "+n+" 0 0 0 "+s[1].x+" "+s[1].y+" Z",
circle:[0,1,2],data:a.c1c2c3},{
d:"M "+s[0].x+" "+s[0].y+" A "+n+" "+n+" 0 0 1 "+c[1].x+" "+c[1].y+" A "+n+" "+n+" 0 0 0 "+d[1].x+" "+d[1].y+" A "+n+" "+n+" 0 0 1 "+s[0].x+" "+s[0].y+" Z",
circle:[0,2],data:a.c1c3},{
d:"M "+d[0].x+" "+d[0].y+" A "+n+" "+n+" 0 0 0 "+c[1].x+" "+c[1].y+" A "+n+" "+n+" 0 0 1 "+s[1].x+" "+s[1].y+" A "+n+" "+n+" 0 0 0 "+d[0].x+" "+d[0].y+" Z",
circle:[0,1],data:a.c1c2},{
d:"M "+c[0].x+" "+c[0].y+" A "+n+" "+n+" 0 0 0 "+s[1].x+" "+s[1].y+" A "+n+" "+n+" 0 0 1 "+d[1].x+" "+d[1].y+" A "+n+" "+n+" 0 0 0 "+c[0].x+" "+c[0].y+" Z",
circle:[1,2],data:a.c2c3}]
;(f=o.selectAll(".arc").data(f)).enter().append("path").attr("class","arc"),
f.call((function(){this.on("mouseover",(function(t){
if(i.select(this).attr("fill-opacity",1),e.options.tooltips){var a=e.tooltip(t)
;a&&e.showToolTip({label:a,event:{
pageX:e.options.cornerToolTip?e.$elem.prop("offsetLeft")+5:i.event.pageX,
pageY:e.options.cornerToolTip?e.$elem.prop("offsetTop")+20:i.event.pageY}})}
})).on("mouseout",(function(t){var a=i.event.toElement
;a&&"text"!==a.tagName&&(i.select(this).attr("fill-opacity",t.fillOpacity||e.options.fillOpacity),
e.options.tooltips&&e.hideToolTip())})).on("click",(function(t){
if(t.data.action){var i=t.data.action
;"string"==typeof i&&(i=Function("d",i)),i(t.data)}}))
})).transition().duration(h).attr("d",(function(t){return t.d
})).attr("fill",(function(t,i){return e.options.fillColor(t.circle,t,e)
})).attr("stroke","none").attr("fill-opacity",(function(t){
return t.fillOpacity||e.options.fillOpacity})).call(e.endall,(function(){
e.initialized=!0})),f.exit().remove()
;var p=o.selectAll(".strokedCircle").data(l)
;p.enter().append("circle").attr("class","strokedCircle"),
p.transition().duration(h).attr("cx",(function(t){
return t.cx||Math.cos(t.angle)*t.originDistance})).attr("cy",(function(t){
return t.cy||-Math.sin(t.angle)*t.originDistance})).attr("r",(function(t){
return t.r})).attr("fill","none").attr("stroke",(function(t,i){
return t.strokeColor||e.options.strokeColor(i,t)
})).attr("stroke-width",(function(t){return t.strokeWidth||e.options.strokeWidth
})),p.exit().remove();if(e.options.labels){var y=o.selectAll("text").data(u)
;y.enter().append("text"),y.transition().duration(h).call((function(t){
return void 0===t&&(t=1),
this.attr("text-anchor","middle").attr("dy",(function(t){return t.dy||"0.5em"
})).attr("cursor","default"),this.attrTween&&this.text((function(t){
return t.label||t.value})).attrTween("transform",(function(t,e){
void 0===this._current&&(this._current=t);var a=t
;void 0===a.radius&&(a.radius=.7*r);var n=i.interpolate(this._current,a)
;return this._current=n(0),function(t){var i=n(t)
;return"translate("+[Math.cos(i.angle)*i.radius,-Math.sin(i.angle)*i.radius]+")"
}})).attr("font-size",(function(t){return t.fontSize||"12pt"})),this
})),y.exit().remove()}}},tooltip:function(t){
return void 0!==t.data.tooltip?t.data.tooltip:void 0!==t.data.label?t.data.label:void 0
},renderXAxis:function(){},renderYAxis:function(){}})}));