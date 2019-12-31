define(["jquery","d3","./visWidget"],(function(t,e){"use strict";t.KBWidget({
name:"kbaseTreechart",parent:"kbaseVisWidget",version:"1.0.0",options:{debug:!1,
xGutter:0,xPadding:0,yGutter:0,yPadding:0,bgColor:"none",red:void 0,blue:void 0,
distance:100,redBlue:!1,strokeWidth:1.5,transitionTime:500,lineStyle:"curve",
fixed:0,displayStyle:"NTnt",nodeHeight:15,labelSpace:10,circleRadius:4.5,
circleStroke:"steelblue",openCircleFill:"lightsteelblue",
closedCircleFill:"#FFF",lineStroke:"#ccc",staticWidth:!1,staticHeight:!1,
canShrinkWidth:!0,bias:"root"},_accessors:["comparison"],
calculateNodeDepths:function(t){t.forEach((function(t){if(!t.children){
t.nodeDepth=0
;for(var e=t.parent,i=1;void 0!==e;)(void 0===e.nodeDepth||e.nodeDepth<i)&&(e.nodeDepth=i),
i+=1,e=e.parent}}))},afterInArray:function(t,e){var i=e.indexOf(t)+1
;return i>=e.length&&(i=0),e[i]},countVisibleLeaves:function(t){var e=0
;if(void 0===t.children||!0!==t.open&&void 0!==t.open)e=1;else for(var i=0;i<t.children.length;i++)e+=this.countVisibleLeaves(t.children[i])
;return e},findInChildren:function(t,e){if(t===e)return!0
;if(void 0!==e&&void 0!==e.children)for(var i=0;i<e.children.length;i++)if(this.findInChildren(t,e.children[i]))return!0
;return!1},redBlue:function(t,i){this.options.red===i&&(this.options.red=void 0,
this.options.redNode=void 0),
this.options.blue===i&&(this.options.blue=void 0,this.options.blueNode=void 0)
;var n=["red","black"]
;void 0!==this.options.red&&void 0!==this.options.blue?(this.options.red.fill="black",
e.select(this.options.redNode).attr("fill",this.options.red.fill),
this.options.red=void 0,
n=["red","black"]):void 0!==this.options.red?n=["blue","black"]:void 0===this.options.red&&void 0!==this.options.blue&&(n=["red","black"]),
i.fill=this.afterInArray(i.fill,n),
"black"===i.fill||void 0===i.children||this.findInChildren(this.options.red,i)||this.findInChildren(this.options.blue,i)||(this.toggle(i),
this.updateTree(i)),
"black"!==i.fill&&(this.options[i.fill]=i,this.options[i.fill+"Node"]=t),
e.select(t).attr("fill",i.fill),
void 0!==this.options.red&&void 0!==this.options.blue?this.comparison("Comparing "+this.options.red.name+" vs "+this.options.blue.name):this.comparison("")
},defaultNodeClick:function(t){
this.findInChildren(this.options.red,t)||this.findInChildren(this.options.blue,t)||(this.toggle(t),
this.updateTree(t))},defaultTextClick:function(t,e){
this.options.redBlue&&this.redBlue(e,t)},nodeState:function(t){
return t.children?"open":t._children?"closed":"leaf"},depth:function(t,e,i){
return this.options.depth?this.options.depth.call(this,t,e,i):this.defaultDepth(t,e,i)
},defaultDepth:function(t,e,i){var n=this.options.distance
;return void 0!==t.distance&&(n*=t.distance),
void 0!==t.parent?n+=this.depth(t.parent,e,i):n=e+i,n},uniqueness:function(t){
if(void 0===t.id){var e=t.name
;void 0===e&&void 0!==this.options.nameFunction&&(e=this.options.nameFunction.call(this,t)),
void 0!==t.parent&&(e=this.uniqueness(t.parent)+"/"+e),t.id=e}return t.id},
updateTree:function(e){
for(var i,n=this.data("D3svg").select(this.region("chart")),o=this,s=this.initialized?this.options.transitionTime:0,r=this.chartBounds(),l=(document.createElement("div"),
e);void 0!==l.parent;)l=l.parent
;var a=n.append("text").attr("style","visibility : hidden; font-size : 11px;cursor : pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;").attr("class","fake").text(l.name)
;i=a[0][0].getBBox().width+o.options.labelSpace+r.origin.x
;var c=this.options.nodeHeight*this.countVisibleLeaves(this.dataset())
;this.height(this.$elem.height()),
r.size.height=c,this.treeLayout=this.layoutType().size([r.size.height,r.size.width]),
this.nodes=this.treeLayout.nodes(this.dataset()).reverse(),
this.calculateNodeDepths(this.nodes);var d=0,h=0,u=5e9;function p(t,e){
var i=t[0][0].getBBox(),n=e.children||e._children?e.y+o.options.labelSpace:e.y+i.width+o.options.labelSpace,s=e.children||e._children?e.y+o.options.labelSpace-i.width:e.y+o.options.labelSpace
;return[s,n,n-s]}o.options.fixedDepth=0,this.nodes.forEach((function(t){
t.y=o.depth(t,i,d),t.y>o.options.fixedDepth&&(o.options.fixedDepth=t.y)
})),this.nodes.forEach((function(t){
t.y=o.depth(t,i,d),t.y=!o.options.fixed||t.children&&0!==t.children.length?t.y:o.options.fixedDepth,
void 0===t.name&&o.options.nameFunction&&(t.name=o.options.nameFunction.call(o,t))
;var e=n.append("text").attr("style","visibility : hidden;font-size : 11px;cursor : pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;").attr("class","fake").text(t.name),s=p(e,t),r=s[0],l=s[1]
;if(t.width=s[2],o.options.labelWidth&&t.width>o.options.labelWidth){
var a=t.name.split(/\s+/),c=[a.shift()];e.text(c.join(" "))
;for(var f=0;p(e,t)[2]<o.options.labelWidth&&f++<40;)c.push(a.shift()),
e.text(c.join(" "));a.push(c.pop()),t.name_truncated=c.join(" ")}
l>h&&(h=l),r<u&&(u=r)}));var f=0
;u<r.origin.x&&(f+=r.origin.x-u,d=f),h>r.origin.x+r.size.width&&(f+=h-r.size.width),
n.selectAll(".fake").remove()
;var v=this.options.xGutter+this.options.yGutter+f+r.size.width
;v<o.options.originalWidth&&!o.options.canShrinkWidth&&(v=o.options.originalWidth),
v=this.options.staticWidth?o.options.originalWidth:v,
c=this.options.staticHeight?o.options.originalHeight:c+this.options.yGutter+this.options.yPadding,
this.$elem.animate({width:v,height:c},s)
;var g=n.selectAll("g.tree-node").data(this.nodes,(function(t){
return o.uniqueness(t)
})),y=g.enter().append("g").attr("class","tree-node").attr("data-node-id",(function(t){
return o.uniqueness(t)})).attr("opacity",0).attr("transform",(function(t){
return"translate("+e.y0+","+e.x0+")"}))
;y.append("circle").attr("class","circle").attr("r",1e-6).attr("style","cursor : pointer;").attr("stroke",(function(t){
return t.stroke||o.options.circleStroke})).style("fill",(function(t){
return t._children?o.options.openCircleFill:o.options.closedCircleFill
})).on("click",(function(e){
o.oneClick?o.options.nodeDblClick&&(o.oneClick=!1,o.options.nodeDblClick.call(o,e,this)):(o.oneClick=!0,
setTimeout(t.proxy((function(){if(o.oneClick){
if(o.oneClick=!1,o.options.nodeClick)return o.options.nodeClick.call(o,e,this)
;o.defaultNodeClick(e,this)}}),this),250))})).on("mouseover",(function(t){
o.options.nodeOver?o.options.nodeOver.call(o,t,this):t.tooltip&&o.showToolTip({
label:t.tooltip})})).on("mouseout",(function(t){
o.options.nodeOut?o.options.nodeOut.call(o,t,this):t.tooltip&&o.hideToolTip()
})),
y.append("text").attr("class","tree-nodeText").attr("data-text-id",(function(t){
return o.uniqueness(t)
})).attr("style","font-size : 11px;cursor : pointer;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;").attr("dy",".35em").text((function(t){
var e=t.name
;return t.width>o.options.labelWidth&&o.options.truncationFunction&&(e=o.options.truncationFunction(t,this,o)),
e})).style("fill-opacity",1e-6).attr("fill",(function(t){return t.fill||"black"
})).on("click",(function(e){
o.oneClick?o.options.textDblClick&&(o.oneClick=!1,o.options.textDblClick.call(o,e,this)):(o.oneClick=!0,
setTimeout(t.proxy((function(){
if(o.oneClick)return o.oneClick=!1,o.options.textClick?o.options.textClick.call(o,e,this):o.defaultTextClick(e,this)
}),this),250))})).on("mouseover",(function(t){
o.options.textOver&&o.options.textOver.call(o,t,this)
})).on("mouseout",(function(t){
o.options.textOut&&o.options.textOut.call(o,t,this)})),y.each((function(t,e){
o.options.nodeEnterCallback&&o.options.nodeEnterCallback.call(o,t,e,this,s)}))
;var x=g.transition().duration(s).attr("opacity",1).attr("transform",(function(t){
var e=!o.options.fixed||t.children&&0!==t.length?t.y:o.options.fixedDepth
;return"leaf"===o.options.bias&&void 0!==t.parent&&(e=o.options.fixedDepth-t.nodeDepth*o.options.distance),
"translate("+e+","+t.x+")"}));x.select("circle").attr("r",(function(t){
return t.radius||o.options.circleRadius})).attr("stroke",(function(t){
return t.stroke||o.options.circleStroke})).style("fill",(function(t){
return t._children?o.options.openCircleFill:o.options.closedCircleFill
})).attr("visibility",(function(t){var e=!0
;return t.children&&t.children.length&&(e=!1),
e&&o.options.displayStyle.match(/n/)?"visible":!e&&o.options.displayStyle.match(/N/)?"visible":e&&o.options.displayStyle.match(/c/)&&void 0!==t.name&&t.name.length>0?"visible":!e&&o.options.displayStyle.match(/C/)&&void 0!==t.name&&t.name.length>0?"visible":"hidden"
})),x.select("text").style("fill-opacity",1).attr("x",(function(t){
return t.children?0-o.options.labelSpace:o.options.labelSpace
})).attr("text-anchor",(function(t){return t.children?"end":"start"
})).attr("visibility",(function(t){var e=!0
;return t.children&&t.children.length&&(e=!1),
e&&o.options.displayStyle.match(/t/)?"visible":!e&&o.options.displayStyle.match(/T/)?"visible":"hidden"
})),x.each((function(t,e){
o.options.nodeUpdateCallback&&o.options.nodeUpdateCallback.call(o,t,e,this,s)}))
;var k=g.exit().transition().duration(s).attr("opacity",0).attr("transform",(function(t){
return"translate("+e.y+","+e.x+")"})).remove()
;k.select("circle").attr("r",1e-6),
k.select("text").style("fill-opacity",1e-6),k.each((function(t,e){
o.options.nodeExitCallback&&o.options.nodeExitCallback.call(o,t,e,this,s)}))
;var b=n.selectAll("path.tree-link").data(o.treeLayout.links(o.nodes),(function(t){
return o.uniqueness(t.target)}))
;b.enter().insert("path","g").attr("class","tree-link").attr("data-link-id",(function(t){
return o.uniqueness(t.target)})).attr("fill","none").attr("stroke",(function(t){
return t.target.lineStroke||o.options.lineStroke})).attr("d",(function(t){
var i={x:e.x0,y:e.y0};return o.diagonal({source:i,target:i})
})).on("mouseover",(function(t){
o.options.lineOver&&o.options.lineOver.call(o,t,this)
})).on("mouseout",(function(t){
o.options.lineOut&&o.options.lineOut.call(o,t,this)
})).transition().duration(s).attr("d",o.diagonal),
b.transition().duration(s).attr("stroke-width",(function(t){
var e=t.target.weight||o.options.strokeWidth
;return"function"==typeof e&&(e=e.call(o,t)),e+"px"
})).attr("d",o.diagonal),b.exit().transition().duration(s).attr("opacity",0).attr("d",(function(t){
var i={x:e.x,y:e.y};return o.diagonal({source:i,target:i})
})).remove(),o.nodes.forEach((function(t){t.x0=t.x,t.y0=t.y}))},
layoutType:function(){
return"cluster"===this.options.layout?e.layout.cluster():void 0===this.options.layout?e.layout.tree():this.options.layout
},renderChart:function(){if(void 0!==this.dataset()){
this.options.originalWidth=this.$elem.width(),
this.options.originalHeight=this.$elem.height();var t=this.chartBounds()
;void 0===this.treeLayout&&(this.treeLayout=this.layoutType().size([t.size.height,t.size.width]))
;var i=this,n=function(t){
var e=t.source.y,n=!i.options.fixed||t.target.children&&0!==t.target.children.length?t.target.y:i.options.fixedDepth
;return"leaf"===i.options.bias&&void 0!==t.source.nodeDepth&&void 0!==t.target.nodeDepth&&(n=i.options.fixedDepth-t.target.nodeDepth*i.options.distance,
e=i.options.fixedDepth-t.source.nodeDepth*i.options.distance,
void 0===t.source.parent&&(e=t.source.y)),{source:e,target:n}}
;"curve"===this.options.lineStyle?this.diagonal=e.svg.diagonal().projection((function(t){
return[!i.options.fixed||t.children&&0!==t.length?t.y:i.options.fixedDepth,t.x]
})):"straight"===this.options.lineStyle?this.diagonal=function(t){var e=n(t)
;return"M"+e.source+","+t.source.x+"L"+e.target+","+t.target.x
}:"square"===this.options.lineStyle?this.diagonal=function(t){var e=n(t)
;return"M"+e.source+","+t.source.x+"L"+e.source+","+t.target.x+"L"+e.target+","+t.target.x
}:"step"===this.options.lineStyle&&(this.diagonal=function(t){
var e=n(t),i=(e.target-e.source)/2+e.source
;return"M"+e.source+","+t.source.x+"L"+i+","+t.source.x+"L"+i+","+t.target.x+"L"+e.target+","+t.target.x
}),
this.nodes=this.treeLayout.nodes(this.dataset()).reverse(),this.calculateNodeDepths(this.nodes),
this.dataset().x0=t.size.height/2,this.dataset().y0=0;var o=this.dataset()
;o.children&&o.children.forEach((function t(e){
e.children&&(e.children.forEach(t),!1===e.open&&i.toggle(e))
})),this.updateTree(this.dataset()),this.initialized=!0}},toggle:function(t){
void 0!==t.children?(t._children=t.children,
t.children=null,t.open=!1):(t.children=t._children,t._children=null,t.open=!0)}
})}));