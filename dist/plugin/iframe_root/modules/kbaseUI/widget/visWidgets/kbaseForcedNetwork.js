define(["jquery","d3","./rgbColor","./geometry/rectangle","./geometry/point","./geometry/size","./visWidget","../legacy/searchControls"],(function(t,e,i,o,r,n){
"use strict";t.KBWidget({name:"kbaseForcedNetwork",parent:"kbaseVisWidget",
version:"1.0.0",options:{overColor:"blue",nodeColor:"gray",lineColor:"gray",
lineWeight:3,nodeStrokeColor:"black",nodeStrokeWeight:1,nodeRadius:10,
filteredNodeColor:"#BFBFBF",linkDistance:100,charge:-10,xGutter:0,xPadding:0,
yPadding:0,maxCurveWeight:100,searchBox:!0,filter:!1,cornerToolTip:!1},
_accessors:["forceLayout","restart"],defaultXDomain:function(){
if(void 0===this.dataset())return[0,0]
;var t=2*e.min(this.dataset().nodes.map((function(t){return t.x})))
;return t>0&&(t=0),[t,2*e.max(this.dataset().nodes.map((function(t){return t.x
})))]},defaultYDomain:function(){if(void 0===this.dataset())return[0,0]
;var t=2*e.min(this.dataset().nodes.map((function(t){return t.y})))
;return t>0&&(t=0),[t,2*e.max(this.dataset().nodes.map((function(t){return t.y
})))]},appendUI:function(t){this._super(t)
;var a=void 0,s=this.data("D3svg").select(".chart"),h=this.chartBounds(),l=void 0,c=this,g=[]
;return s.on("mousedown",(function(){
if("background"===e.select(e.event.target).attr("class")){var t=e.mouse(this)
;a=new r(t[0]+h.origin.x,t[1]+h.origin.y),
l=s.append("rect").attr("class","selectionBox").attr("x",a.x).attr("y",a.y).attr("width",0).attr("height",0).attr("stroke","#222").attr("stroke-width","3").attr("fill",new i(0,0,0).asStringWithAlpha(.1))
}})).on("mousemove",(function(){if(void 0!==a){
var t=e.mouse(this),i=new r(t[0]+h.origin.x,t[1]+h.origin.y),s=a.rectWithPoint(i)
;s.origin.x-=h.origin.x,
s.origin.y-=h.origin.y,l.attr("x",s.origin.x),l.attr("y",s.origin.y),
l.attr("width",s.size.width),
l.attr("height",s.size.height),c.forceLayout().nodes().forEach((function(t,e){
new o(new r(t.x-t.radius,t.y-t.radius),new n(2*t.radius,2*t.radius)).intersects(s)?(g.push(t),
t.highlighted=3):t.highlighted=-1})),c.restart()()}})).on("mouseup",(function(){
if(void 0!==a){var t=e.mouse(this),i=new r(t[0]+h.origin.x,t[1]+h.origin.y)
;a.rectWithPoint(i)
;a=void 0,l=void 0,s.select(".selectionBox").remove(),g.forEach((function(t,e){
t.highlighted=!1})),g=[],c.restart()()}})),this},renderChart:function(){
if(null!=this.dataset()){this.options.filter&&(this.$elem.kbaseSearchControls({
context:this,searchCallback:function(t,e,i){
i.options.filterVal=new RegExp(e,"i"),i.restart()()}
}),this.$elem.data("searchControls").addClass("col-md-6"))
;var t=this.chartBounds(),o=this,r=this.data("D3svg").select(".chart").selectAll(".node"),n=this.data("D3svg").select(".chart").selectAll(".tag"),a=this.data("D3svg").select(".chart").selectAll(".edge"),s=this.forceLayout()
;if(void 0!==s)return this.forceLayout().nodes(this.dataset().nodes),
this.forceLayout().links(this.dataset().edges),void o.restart()()
;s=e.layout.force().nodes(o.dataset().nodes).links(o.dataset().edges).size([t.size.width,t.size.height]).charge((function(t,e){
return t.charge||o.options.charge})).linkDistance((function(t,e){
return t.linkDistance||o.options.linkDistance})).on("tick",(function(){
a.attr("d",(function(t){if(t.curveStrength){
var i=t.target.x-t.source.x,r=t.target.y-t.source.y,n=e.scale.linear().domain([-o.options.maxCurveWeight,o.options.maxCurveWeight]).range([0,i]),a=e.scale.linear().domain([-o.options.maxCurveWeight,o.options.maxCurveWeight]).range([0,r]),s=t.source.x+n(t.curveStrength),h=t.target.y-a(t.curveStrength)
;return" M"+t.source.x+","+t.source.y+" Q"+s+","+h+"  "+t.target.x+","+t.target.y
}return"M"+t.source.x+","+t.source.y+"L"+t.target.x+","+t.target.y
})),r.attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})),
n.attr("x",(function(t){return t.x+(t.tagOffsetX||0)})).attr("y",(function(t){
return t.y+(t.tagOffsetY||0)})),n.attr("fill-opacity",(function(t){
var e=t.search
;return void 0===e&&(e=t.tag),void 0===o.options.filterVal||e.match(o.options.filterVal)?1:.25
}))})),this.forceLayout(s);var h=function(){var l=function(){
return this.on("mouseover",(function(t){var i,r=(i=e.mouse(this))[0];i[1]
;o.showToolTip({label:t.label||"Node: "+t.name,event:{
pageX:e.event.pageX-(o.options.cornerToolTip?r+300:0),pageY:e.event.pageY}
}),t.source.highlighted=1,
t.target.highlighted=1,t.highlighted=2,o.forceLayout().links().forEach((function(t,e){
2!=t.highlighted&&(t.highlighted=-1)
})),o.forceLayout().nodes().forEach((function(t,e){
2!=t.highlighted&&1!=t.highlighted&&(t.highlighted=-1)})),h()
})).on("mouseout",(function(t){
o.hideToolTip(),o.forceLayout().links().forEach((function(t,e){
t.highlighted=0,t.source.highlighted=0,t.target.highlighted=0
})),o.forceLayout().nodes().forEach((function(t,e){t.highlighted=0})),h()
})).call(s.drag),this},c=function(){
return this.attr("class","edge").attr("stroke",(function(t){
return t.color||o.options.lineColor})).attr("stroke-width",(function(t){
return t.weight||o.options.lineWeight
})).attr("fill","none").attr("stroke-opacity",(function(t){
return void 0===o.options.filterVal&&-1!==t.highlighted||-1!==t.highlighted&&t.source.tag.match(o.options.filterVal)&&t.target.tag.match(o.options.filterVal)?1:.25
})),this}
;(a=a.data(s.links())).enter().insert("path",".node").call(l).call(c),a.call(l).transition().duration(100).call(c),
a.exit().remove();var g=function(){return this.on("mouseover",(function(t){
var i,r=(i=e.mouse(this))[0];i[1];o.showToolTip({label:t.label||"Node: "+t.name,
event:{pageX:e.event.pageX-(o.options.cornerToolTip?r+300:0),pageY:e.event.pageY
}}),o.forceLayout().links().forEach((function(e,i){
e.source===t&&(e.target.highlighted=1,
e.highlighted=1),e.target===t&&(e.source.highlighted=1,
e.highlighted=1),1!=e.highlighted&&(e.highlighted=-1)
})),o.forceLayout().nodes().forEach((function(t,e){
1!==t.highlighted&&(t.highlighted=-1)})),t.highlighted=2,h()
})).on("mouseout",(function(t){
o.hideToolTip(),t.highlighted=0,o.forceLayout().links().forEach((function(t,e){
t.highlighted=0,t.source.highlighted=0,t.target.highlighted=0
})),o.forceLayout().nodes().forEach((function(t,e){t.highlighted=0})),h()
})).on("mousedown",(function(t){t.fixed=!1})).on("dblclick",(function(t){
t.fixed=!1})).on("mouseup",(function(e){
e.x<t.origin.x||e.y<t.origin.y||e.x>t.origin.x+t.size.width||e.y>t.origin.y+t.size.height?e.fixed=!1:e.fixed=!0
})).call(s.drag),this},d=function(){return this.attr("r",(function(t){
return t.radius||o.options.nodeRadius})).attr("fill",(function(t){var e=t.search
;if(void 0===e&&(e=t.tag),
2===t.highlighted)return t.highlightColor||o.options.nodeHighlightColor||t.color||o.options.nodeColor
;if(1===t.highlighted)return t.relatedHighlightColor||o.options.relatedNodeHighlightColor||t.color||o.options.nodeColor
;if(void 0!==o.options.filteredNodeColor&&void 0!==o.options.filterVal&&!e.match(o.options.filterVal)||-1===t.highlighted){
var r=i.prototype.rgbFromString(t.color||o.options.nodeColor)
;return r?new i(r.r,r.g,r.b).lightenBy(191).asString():o.options.filteredNodeColor||t.color||o.options.nodeColor
}return t.color||o.options.nodeColor})).attr("stroke",(function(t){
return t.stroke||o.options.nodeStrokeColor})).attr("stroke-width",(function(t){
return t.strokeWidth||o.options.nodeStrokeWeight
})).attr("data-name",(function(t){return t.name})),this}
;(r=r.data(s.nodes())).enter().append("circle").attr("class","node").call(d).call(g),
r.call(g).transition().duration(100).call(d),r.exit().remove();var u=function(){
return this.text((function(t){return t.tag
})).attr("text-anchor","middle").attr("alignment-baseline","middle").attr("style",(function(t){
return t.tagStyle})),this}
;(n=n.data(s.nodes())).enter().append("text").attr("text","tag").call(u).call(g),
n.call(g).transition().duration(100).call(u),n.exit().remove(),s.start()}
;o.restart(h),h()}},renderXAxis:function(){},renderYAxis:function(){}})}));