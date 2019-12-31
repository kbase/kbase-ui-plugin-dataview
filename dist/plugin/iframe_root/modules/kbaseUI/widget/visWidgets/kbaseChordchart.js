define(["jquery","d3","./visWidget","./rgbColor","./geometry/rectangle","./geometry/point","./geometry/size","./kbasePiechart"],(function(t,e){
"use strict";t.KBWidget({name:"kbaseChordchart",parent:"kbasePiechart",
version:"1.0.0",options:{chordPadding:.1,xOffset:0,yOffset:0,innerRadius:-25,
outerRadius:-25,strokeWidth:.5,strokeColor:"black",choppedGroups:!1,
sortGroups:void 0,drawArcs:!0,drawChords:!0,sortSubgroups:e.descending,
chordColorScale:function(t,e,r){return r.options.colorScale(t,e,r)}},
_accessors:["calculatedPieData"],init:function(t){return this._super(t),this},
pieData:function(){return this.calculatedPieData()},
startingChordPosition:function(t,e){
return this.initialized?e<this.lastChordData.length-1?{source:{
startAngle:this.lastChordData[e+1].source.startAngle,
endAngle:this.lastChordData[e+1].source.startAngle},target:{
startAngle:this.lastChordData[e+1].target.startAngle,
endAngle:this.lastChordData[e+1].target.startAngle}}:{source:{
startAngle:this.options.endAngle,endAngle:this.options.endAngle},target:{
startAngle:this.options.endAngle,endAngle:this.options.endAngle}
}:"slice"===this.options.startingPosition?{source:{
startAngle:t.source.startAngle,endAngle:t.source.startAngle},target:{
startAngle:t.target.startAngle,endAngle:t.target.startAngle}
}:"top"===this.options.startingPosition?{source:{
startAngle:this.options.startAngle,endAngle:this.options.startAngle},target:{
startAngle:this.options.startAngle,endAngle:this.options.startAngle}
}:"final"===this.options.startingPosition?{source:{
startAngle:t.source.startAngle,endAngle:t.source.endAngle},target:{
startAngle:t.target.startAngle,endAngle:t.target.endAngle}}:void 0},
sliceAction:function(e){
var r=t.KBWidget.registry()[e.parent].prototype.sliceAction
;return r=r.call(this,e),function(){return this.call(r),this}},
renderChart:function(){
var r=this.chartBounds(),n=this,a=e.layout.chord().padding(this.options.chordPadding).sortGroups(this.options.sortGroups).sortSubgroups(this.options.sortSubgroups).matrix(n.dataset()),s=a.groups(),i=[]
;t.each(s,(function(r,a){
a.startAngle+=n.options.startAngle,a.endAngle+=n.options.startAngle
;var s=a.endAngle-a.startAngle;if(a.data={},n.options.choppedGroups){
var o=a.startAngle,l=n.dataset()[r].slice(),c=0;l.forEach((function(t){c+=t}))
;var d=a.data.color||n.options.chordColorScale(r,a.data,n),g=e.rgb(d),u=g.darker(.15),h=g.brighter(.15),p=e.scale.linear().domain([0,1]).range([u,h])
;n.options.colorScale;l.sort(n.options.sortSubgroups).forEach((function(e,r){
var n=o+s*e/c,l=t.extend(!0,{},a.data);l.color=p(r),i.push({startAngle:o,
endAngle:n,index:a.index,value:a.value,data:l}),o=n}))}else i.push(a)
})),this.calculatedPieData(i),this.options.drawArcs&&this._super()
;var o=e.scale.ordinal().domain(e.range(4)).range(["#000000","#FFDD89","#957244","#F26223"])
;if(this.options.drawChords){
var l=this.data("D3svg").select(this.region("chart")).selectAll(".chords").data([0])
;l.enter().insert("g",".labelG").attr("class","chords").attr("transform","translate("+(r.size.width/2+this.options.xOffset)+","+(r.size.height/2+this.options.yOffset)+")")
;var c=this.innerRadius(),d=this.outerRadius(),g=(e.svg.arc().innerRadius(c).outerRadius(d),
[]);a.chords().forEach((function(e,r){
newVal=t.extend(!0,{},e),newVal.data={},newVal.source.startAngle+=n.options.startAngle,
newVal.source.endAngle+=n.options.startAngle,
newVal.target.startAngle+=n.options.startAngle,
newVal.target.endAngle+=n.options.startAngle,g.push(newVal)
;var a=newVal.source.index
;newVal.target.value>newVal.source.value&&(a=newVal.target.index),
newVal.data.colorIdx=a}))
;var u=this.initialized||"final"!==this.options.startingPosition?this.options.transitionTime:0,h=l.selectAll("path").data(g)
;h.enter().append("path").attr("fill",(function(t){return o(t.target.index)
})),h.transition().duration(u).call((function(){
return this.attr("fill-opacity",.67).attr("fill",(function(t,e){
return t.data.color||n.options.colorScale(t.data.colorIdx,t.data,n)
})).attr("stroke","black").attr("stroke-width",.5).attr("fill-opacity",.5),
this.attrTween&&this.attrTween("d",(function(t,r){
void 0===this._current&&(this._current=n.startingChordPosition(t,r))
;var a=e.interpolate(this._current,t);return this._current=a(0),function(t){
return e.svg.chord().radius(c)(a(t))}})),this})).call(n.endall,(function(){
n.lastChordData=a.chords})),h.exit().remove()}
var p=this.data("D3svg").select(this.region("chart")).selectAll(".ticks").data([0])
;p.enter().insert("g",".labelG").attr("class","ticks"),
p.attr("transform","translate("+(r.size.width/2+this.options.xOffset)+","+(r.size.height/2+this.options.yOffset)+")")
;var A=p.selectAll(".tickArcs").data(a.groups)
;A.enter().append("g").attr("class","tickArcs"),
A.exit().transition().duration(u).attr("opacity",0).each("end",(function(t){
e.select(this).remove()}));var f=A.selectAll("g").data((function(t){
var r=(t.endAngle-t.startAngle)/t.value
;return e.range(0,t.value,1e3).map((function(e,n){return{angle:e*r+t.startAngle,
label:n%5?null:e/1e3+"k"}}))})),v=f.enter().append("g").attr("opacity",1)
;v.append("line"),
v.append("text"),f.exit().transition().duration(u).attr("opacity",0).each("end",(function(t){
e.select(this).remove()
})),f.transition().duration(u).attrTween("transform",(function(t,r){
void 0===this._current&&(this._current=n.startingChordPosition(t,r))
;var a=e.interpolate(this._current,t);return this._current=a(0),function(t){
return"rotate("+(180*a(t).angle/Math.PI-90)+")translate("+d+",0)"}
})),f.select("line").attr("x1",1).attr("y1",0).attr("x2",5).attr("y2",0).style("stroke","#000").attr("stroke-opacity",(function(t){
return e.select(this).attr("stroke-opacity")||0
})),f.select("line").transition().duration(u).attr("stroke-opacity",1),
f.select("text").attr("x",8).attr("dy",".35em").attr("transform",(function(t){
return t.angle%(2*Math.PI)>Math.PI?"rotate(180)translate(-16)":null
})).style("text-anchor",(function(t){
return t.angle%(2*Math.PI)>Math.PI?"end":null})).text((function(t){
return t.label})).attr("opacity",(function(t){
return e.select(this).attr("opacity")||0
})),f.select("text").transition().duration(u).attr("opacity",1)},
renderXAxis:function(){},renderYAxis:function(){}})}));