define(["jquery","d3","./geometry/rectangle","./geometry/point","./geometry/size","../legacy/widget"],(function(t,e,i,n,s){
"use strict";t.KBWidget({name:"kbaseVisWidget",version:"1.0.0",options:{
xGutter:20,xPadding:30,yGutter:20,yPadding:30,yLabels:!0,xLabels:!0,
xScaleType:"linear",yScaleType:"linear",useIDMapping:!1,bgColor:"white",
scaleXAxis:!1,scaleYAxis:!1,scaleAxes:!1,useUniqueID:!1,transitionTime:1750,
ticker:0,radialGradientStopColor:"black",linearGradientStopColor:"black",
defaultDataset:function(){return[]},defaultLegend:function(){return[]},
width:"100%",height:"100%",customRegions:{},xAxisColor:"black",
yAxisColor:"black",xAxisRegion:"yPadding",yAxisRegion:"xPadding",
xAxisOrientation:"bottom",yAxisOrientation:"left",shouldRenderXAxis:!0,
shouldRenderYAxis:!0,xLabelRegion:"yGutter",yLabelRegion:"xGutter",
xLabelOffset:0,yLabelOffset:0,xLabelSize:"8pt",yLabelSize:"8pt",
legendRegion:"chart",legendAlignment:"TL",legendOffset:[0,0],
legendLineHeight:13,legendSize:"7pt",legendTextXOffset:6,legendTextYOffset:3,
aspectRatio:"default"},shouldScaleAxis:function(t){
return!!this.options.scaleAxes||(!("x"!==t||!this.options.scaleXAxis)||!("y"!==t||!this.options.scaleYAxis))
},_accessors:["xGutter","xPadding","yGutter","yPadding","width","height",{
name:"json_dataset",setter:"setJSONDataset"},{name:"dataset",setter:"setDataset"
},{name:"legend",setter:"setLegend"},{name:"input",setter:"setInput"},{
name:"xLabel",setter:"setXLabel"},{name:"yLabel",setter:"setYLabel"},{
name:"xScale",setter:"setXScale"},{name:"yScale",setter:"setYScale"
},"xScaleType","yScaleType","yHeightScaleType","xIDMap","yIDMap","radialGradients","linearGradients","children"],
input:function(){return this.dataset()},setInput:function(e){
return t.isPlainObject(e)&&void 0!==e.dataset?this.setValuesForKeys(e):this.setDataset(e)
},setXLabel:function(t){this.setValueForKey("xLabel",t),this.render("xLabel")},
setYLabel:function(t){this.setValueForKey("yLabel",t),this.render("yLabel")},
setXScale:function(t){this.setValueForKey("xScale",t),this.render("xAxis")},
setYScale:function(t){this.setValueForKey("yScale",t),this.render("yAxis")},
createIDMapForDomain:function(e){var i={};return t.each(e,(function(t,e){i[t]=e
})),i},setXScaleDomain:function(t,i){var n=this.xScale()
;return void 0===n&&(void 0===i&&(i=this.xScaleType()||this.options.xScaleType),
n=e.scale[i](),
this.setXScaleRange([0,this.chartBounds().size.width],n),this.setValueForKey("xScale",n)),
n.domain(t),
this.options.useIDMapping&&void 0===this.xIDMap()&&this.xIDMap(this.createIDMapForDomain(t)),
this.render("xAxis"),n},setXScaleRange:function(t,e){
return void 0===e&&(e=this.xScale()),e.range(t),e},
setYScaleDomain:function(t,i){var n=this.yScale()
;return void 0===n&&(void 0===i&&(i=this.yScaleType()||this.options.yScaleType),
n=e.scale[i](),
this.setYScaleRange([0,this.chartBounds().size.height],n),this.setValueForKey("yScale",n)),
n.domain(t),
this.options.useIDMapping&&void 0===this.yIDMap()&&this.yIDMap(this.createIDMapForDomain(t)),
this.render("yAxis"),n},setYScaleRange:function(t,e){
return void 0===e&&(e=this.yScale()),e.range(t),e},init:function(e){
return this._super(e),
void 0===this.children()&&this.children([]),void 0===this.options.transformations&&(this.options.transformations={}),
void 0===this.radialGradients()&&this.radialGradients({}),
void 0===this.linearGradients()&&this.linearGradients({}),
void 0===this.options.chartID&&(this.options.chartID=this.uuid()),
this.ticker=function(){return++this.options.ticker
},this.uniqueID=t.proxy((function(t){return void 0===t.id&&(t.id=this.ticker()),
t.id
}),this),void 0!==this.options.width&&this.options.width.match(/px/)?this.width(parseInt(this.options.width)):this.width(this.$elem.width()),
void 0!==this.options.height&&this.options.height.match(/px/)?this.height(parseInt(this.options.height)):this.height(this.$elem.height()),
this.appendUI(this.$elem),
this.xScale()&&this.setXScaleRange([0,this.chartBounds().size.width],this.xScale()),
this.yScale()&&this.setYScaleRange([0,this.chartBounds().size.height],this.yScale()),
this.callAfterInit(t.proxy((function(){this.render()}),this)),this},
render:function(t){
this._init&&(void 0!==t&&"chart"!==t||this.renderChart(),void 0!==t&&"xAxis"!==t||this.renderXAxis(),
void 0!==t&&"yAxis"!==t||this.renderYAxis(),
void 0!==t&&"xLabel"!==t||this.renderXLabel(),
void 0!==t&&"yLabel"!==t||this.renderYLabel(),
void 0!==t&&"ulCorner"!==t||this.renderULCorner(),
void 0!==t&&"legend"!==t||this.renderLegend())},fitTextToWidth:function(t,e){
for(var i=this.D3svg().append("text").attr("opacity",0).attr("font-size",this.options.legendSize).text(t),n=i[0][0].getBBox(),s=t,a=!1,r=n.width;n.width+this.options.legendTextXOffset>e&&s.length;)s=s.substring(0,s.length-1),
i.text(s+"..."),n=i[0][0].getBBox(),a=!0;return i.remove(),{truncated:a,text:t,
truncatedText:t===s?t:s+"...",width:r}},legendOver:function(){},
legendOut:function(){},renderLegend:function(){if(void 0!==this.legend()){
var t=this,i={circle:81,square:81,"triangle-up":49,"triangle-down":49,
diamond:36,cross:49
},n=this[this.options.legendRegion+"Bounds"](),s=Math.min(this.options.legendWidth||1e9,n.size.width),a=0,r=0,o=t.options.legendTextXOffset,h=t.options.legendTextYOffset
;if(this.options.legendAlignment.match(/B/)&&(r=n.size.height-t.options.legendLineHeight*this.legend().length),
this.options.legendAlignment.match(/R/)){var d=0
;this.legend().forEach((function(e,i){var n=t.fitTextToWidth(e.label,s)
;d=Math.max(d,n.width)})),a=n.size.width-(d+o+6)}
this.D3svg().select(this.region(this.options.legendRegion)).selectAll(".legend").data([0]).enter().append("g").attr("class","legend")
;var l=this.D3svg().select(this.region(this.options.legendRegion)).selectAll(".legend").selectAll("g").data(this.legend(),(function(t){
return t.label})),c=function(e,i,n){
return"translate("+(6+a+t.options.legendOffset[0])+","+(6+n*t.options.legendLineHeight+r+t.options.legendOffset[1])+")"
};l.enter().append("g").each((function(t,i){var n=e.select(this)
;n.attr("transform",(function(t,e){return c(0,0,i)
})),n.append("path").attr("opacity",0),
n.append("text").attr("class","legend-text").attr("opacity",0)}))
;var u=this.drawnLegend?this.options.transitionTime:0;l.each((function(n,a){
var r=e.select(this);r.transition().duration(u).attr("transform",(function(t,e){
return c(0,0,a)}));var d=t.fitTextToWidth(n.label,s)
;r.selectAll("path").transition().duration(u).attr("d",(function(t){
return e.svg.symbol().type(n.shape||"square").size(i[n.shape]||81)()
})).style("fill",(function(t,e){return n.color})).style("stroke",(function(t,e){
return n.color
})).attr("opacity",1),r.selectAll("text").transition().duration(u).attr("x",o).attr("y",h).attr("font-size",t.options.legendSize).style("cursor","pointer").text((function(){
return d.truncatedText
})).attr("opacity",1),r.selectAll("text").on("mouseover",(function(e){
d.truncated&&t.showToolTip({label:d.text
}),e.represents&&t.legendOver(e.represents)})).on("mouseout",(function(e){
d.truncated&&t.hideToolTip(),e.represents&&t.legendOut(e.represents)}))
})),l.exit().each((function(t,i){var n=e.select(this)
;n.selectAll("path").transition().duration(u).attr("opacity",0).remove(),
n.selectAll("text").transition().duration(u).attr("opacity",0).remove(),
n.remove()})),this.drawnLegend=!0}},renderULCorner:function(){
var t=this.ULBounds(),e=new s(t.size.width,t.size.height)
;if(e.width-=5,e.height-=5,
e.width>e.height?e.width=e.height:e.height>e.width&&(e.height=e.width),
!(e.width<25)){var i=[this.options.ulIcon]
;if(this.options.ulIcon)this.D3svg().select(this.region("UL")).selectAll(".ULLabel").data(i).enter().append("image").attr("x",2.5).attr("y",2.5).attr("width",e.width).attr("height",e.height).attr("xlink:href",(function(t){
return t}))}},setLegend:function(t){
void 0===t&&(t=this.options.defaultLegend()),
this.setValueForKey("legend",t),this.render()},extractLegend:function(t){},
setJSONDataset:function(e){var i=this;t.ajax(e,{dataType:"json"
}).then((function(t){
t.data&&!t.dataset&&(t.dataset=t.data),t.dataset?(i.setDataset(t.dataset),
t.xLabel&&i.setXLabel(t.xLabel),t.yLabel&&i.setYLabel(t.yLabel)):i.setDataset(t)
})).fail((function(t){
i.$elem.empty(),i.$elem.addClass("alert alert-danger").html("Could not load JSON "+e+" : "+t.responseText)
}))},setDataset:function(t){
void 0===t&&(t=this.options.defaultDataset()),this.setValueForKey("dataset",t),
this.shouldScaleAxis("x")&&this.setXScaleDomain(this.defaultXDomain()),
this.shouldScaleAxis("y")&&this.setYScaleDomain(this.defaultYDomain()),
this.options.autoLegend&&this.extractLegend(t),this.render()},
setDatasets:function(e){
void 0===e&&(e=[]),void 0===this.children()&&this.children([])
;var i=e.shift(),n=this;this.callAfterInit((function(){n.setDataset(i)
;for(var s=0;s<e.length;s++){var a
;if(s<n.children().length)(a=n.children()[s]).reenter(s,e[s],n);else{
var r=n.childOptions(n.children().length,e[s])
;r.parent=n,a=t.jqElem("div")[n.name](r),n.children().push(a)}a.setDataset(e[s])
}for(s=e.length;s<n.children().length;s++)n.children()[s].setDataset(void 0)
;n.render()}))},reenter:function(t,e,i){},childOptions:function(e,i){
return t.extend(!0,{},i.options||this.options.childOptions||this.options)},
defaultXDomain:function(){return[0,100]},defaultYDomain:function(){return[0,100]
},renderXLabel:function(){
var t=this[this.options.xLabelRegion+"Bounds"](),e=[this.xLabel()],i=this.options.xLabelOffset
;this.D3svg().select(this.region(this.options.xLabelRegion)).selectAll(".xLabel").data(e).text(this.xLabel()).enter().append("text").attr("class","xLabel").attr("x",t.size.width/2).attr("y",t.size.height/2+3).attr("text-anchor","middle").attr("font-size",this.options.xLabelSize).attr("font-family","sans-serif").attr("fill","black").attr("transform","translate(0,"+i+")").text(this.xLabel())
},renderYLabel:function(){
var t=this[this.options.yLabelRegion+"Bounds"](),e=[this.yLabel()],i="xPadding"===this.options.yLabelRegion?-90:90,n=this.options.yLabelOffset
;this.D3svg().select(this.region(this.options.yLabelRegion)).selectAll(".yLabel").data(e).text(this.yLabel()).enter().append("text").attr("class","yLabel").attr("x",t.size.width/2).attr("y",t.size.height/2).attr("text-anchor","middle").attr("font-size",this.options.yLabelSize).attr("font-family","sans-serif").attr("fill","black").attr("transform","translate("+n+",0) rotate("+i+","+(t.size.width/2-7)+","+t.size.height/2+")").text(this.yLabel())
},xTickValues:function(){},xTickLabel:function(t){return t},
renderXAxis:function(){var t=this
;if(this.options.shouldRenderXAxis&&void 0!==this.xScale()&&void 0!==this.xScale().domain){
var i="yGutter"===this.options.xAxisRegion?n.size.height:0
;this.options.xAxisTransform&&(i=this.options.xAxisTransform)
;var n=this[this.options.xAxisRegion+"Bounds"](),s=this.options.xAxisOrientation
;"bottom"===s&&i>n.size.height-30&&(s="top")
;var a=e.svg.axis().scale(this.xScale()).orient(s),r=this.xTickValues()
;void 0!==r&&a.tickValues(r).tickSubdivide(0).tickFormat((function(e){
return t.xTickLabel.call(t,e)})),this.options.xLabels||a.tickFormat("")
;var o=this.D3svg().select(this.region(this.options.xAxisRegion)).select(".xAxis")
;o[0][0]||(o=this.D3svg().select(this.region(this.options.xAxisRegion)).append("g").attr("class","xAxis axis").attr("fill",this.options.xAxisColor)),
o[0][0].parentNode.appendChild(o[0][0]),
this.D3svg().select(this.region(this.options.xAxisRegion)).selectAll(".xAxis").attr("transform","translate(0,"+i+")"),
this.options.xAxisVerticalLabels&&o.selectAll("text").attr("transform",(function(e,i){
try{t.yGutterBounds();var n=this.getBBox()
;return"rotate(90) translate("+2*n.width/3+",-"+n.height+")"}catch(s){return}}))
;var h=this.renderedXAxis?this.options.transitionTime:0
;o.transition().duration(h).call(a),this.renderedXAxis=!0}},svg2HTML:function(){
return t.jqElem("div").append(this.data("$svg")).html()},renderYAxis:function(){
if(this.options.shouldRenderYAxis&&void 0!==this.yScale()){
var t=e.svg.axis().scale(this.yScale()).orient(this.options.yAxisOrientation)
;this.options.yLabels||t.tickFormat("")
;var i=this.D3svg().select(this.region(this.options.yAxisRegion)).select(".yAxis"),n=this[this.options.yAxisRegion+"Bounds"](),s="xPadding"===this.options.yAxisRegion?n.size.width:0
;i[0][0]||(i=this.D3svg().select(this.region(this.options.yAxisRegion)).append("g").attr("class","yAxis axis").attr("fill",this.options.yAxisColor).attr("transform","translate("+s+",0)"))
;var a=this.renderedYAxis?this.options.transitionTime:0
;i.transition().duration(a).call(t),this.renderedYAxis=!0}},
renderChart:function(){},setGutter:function(t){this.xGutter(t),this.yGutter(t)},
setPadding:function(t){this.xPadding(t),this.yPadding(t)},appendUI:function(i){
var n,s=this,a=this.chartBounds()
;if(a.size.width!==a.size.height&&"default"!==this.options.aspectRatio){
var r=Math.abs(a.size.width-a.size.height),o=i.height(),h=i.width()
;"minSquare"===this.options.aspectRatio?a.size.width<a.size.height?o-=r:a.size.height<a.size.width&&(h-=r):"maxSquare"===this.options.aspectRatio&&(a.size.height<a.size.width?o+=r:a.size.width<a.size.height&&(h+=r)),
i.animate({width:h,height:o},0),this.width(h),this.height(o)}
if(this.options.parent?(this.$elem=this.options.parent.$elem,
this.width(this.$elem.width()),
this.height(this.$elem.height()),n=this.D3svg()):(i.append(t.jqElem("style").html(".axis path, .axis line { fill : none; stroke : black; shape-rendering : crispEdges;} .axis text                             {font-family : sans-serif; font-size : 11px}")),
n=e.select(i.get(0)).append("svg").attr("style","width : "+this.options.width+"; height : "+this.options.height),
e.select("body").selectAll(".visToolTip").data([0]).enter().append("div").attr("class","visToolTip").style({
position:"absolute","max-width":"300px",height:"auto",padding:"10px",
"background-color":"white","-webkit-border-radius":"10px",
"-moz-border-radius":"10px","border-radius":"10px",
"-webkit-box-shadow":"4px 4px 10px rgba(0, 0, 0, 0.4)",
"-moz-box-shadow":"4px 4px 10px rgba(0, 0, 0, 0.4)",
"box-shadow":"4px 4px 10px rgba(0, 0, 0, 0.4)","pointer-events":"none",
display:"none","font-family":"sans-serif","font-size":"12px",
"line-height":"20px"}),this.data("D3svg",n)),this.options.rootRegion){
var d=s.region("root",!0);(n=n.selectAll("."+d).data([{region:d}],(function(t){
return t.region}))).enter().append("g").attr("class",(function(t){
return t.region})).attr("transform",t.proxy((function(t){
return s.buildTransformation(s.options.rootRegion)}),this))}
var l=["chart","UL","UR","LL","LR","yGutter","xGutter","yPadding","xPadding"],c=["red","green","blue","cyan","magenta","yellow","purple","orange","gray"]
;n.selectAll("defs").data([null]).enter().append("defs").attr("class","definitions"),
n.selectAll("g").data(l,(function(t){return t
})).enter().append("g").attr("class",(function(t){return t
})).attr("data-x",t.proxy((function(t){return this[t+"Bounds"]().origin.x
}),this)).attr("data-y",t.proxy((function(t){return this[t+"Bounds"]().origin.y
}),this)).attr("data-width",t.proxy((function(t){
return this[t+"Bounds"]().size.width
}),this)).attr("data-height",t.proxy((function(t){
return this[t+"Bounds"]().size.height
}),this)).attr("transform",t.proxy((function(t){var e=this[t+"Bounds"]()
;return"translate("+e.origin.x+","+e.origin.y+")"
}),this)).append("rect").attr("x",0).attr("y",0).attr("width",t.proxy((function(t){
return this[t+"Bounds"]().size.width
}),this)).attr("height",t.proxy((function(t){
return this[t+"Bounds"]().size.height}),this)).attr("fill",(function(t){
return s.options.debug?c.shift():s.options.bgColor
})).attr("class","background"),t.each(l,(function(t,e){
n.selectAll("."+e).selectAll("g").data([{region:s.region(e,!0),r:e
}],(function(t){return t.region
})).enter().append("g").attr("class",(function(t){return t.region
})).attr("transform",(function(t){
return s.buildTransformation(s.options.transformations[t.r]||s.options.transformations.global)
}))}))},buildTransformation:function(e){var i=t.extend(!0,{translate:{x:0,y:0},
scale:{width:1,height:1}},e)
;return"translate("+i.translate.x+","+i.translate.y+") scale("+i.scale.width+","+i.scale.height+")"
},D3svg:function(){
return this.options.parent?this.options.parent.D3svg():this.data("D3svg")},
region:function(t,e){var i=""
;return e||(i="."),void 0!==this.options.customRegions[t]?i+this.options.customRegions[t]:i+t+"-"+this.options.chartID
},ULBounds:function(){
return new i(new n(0,0),new s(this.xPadding(),this.yGutter()))},
URBounds:function(){
return new i(new n(this.xPadding()+this.chartBounds().size.width,0),new s(this.xGutter(),this.yGutter()))
},LLBounds:function(){
return new i(new n(0,this.yGutter()+this.chartBounds().size.height),new s(this.xPadding(),this.yPadding()))
},LRBounds:function(){
return new i(new n(this.xPadding()+this.chartBounds().size.width,this.yGutter()+this.chartBounds().size.height),new s(this.xPadding(),this.yPadding()))
},xPaddingBounds:function(){
return new i(new n(0,this.yGutter()),new s(this.xPadding(),this.chartBounds().size.height))
},xGutterBounds:function(){
return new i(new n(this.xPadding()+this.chartBounds().size.width,this.yGutter()),new s(this.xGutter(),this.chartBounds().size.height))
},yGutterBounds:function(){
return new i(new n(this.xPadding(),0),new s(this.chartBounds().size.width,this.yGutter()))
},yPaddingBounds:function(){
return new i(new n(this.xPadding(),this.yGutter()+this.chartBounds().size.height),new s(this.chartBounds().size.width,this.yPadding()))
},chartBounds:function(){
var t=this.$elem.width(),e=this.$elem.height(),a=new i(new n(this.xPadding(),this.yGutter()),new s(t-this.xPadding()-this.xGutter(),e-this.yGutter()-this.yPadding()))
;return a.size.width<0&&(a.size.width=0),a.size.height<0&&(a.size.height=0),a},
showToolTip:function(t){
void 0===t.event&&(t.event=e.event),e.selectAll(".visToolTip").style("display","block").html(t.label).style("left",t.event.pageX+10+"px").style("top",t.event.pageY-10+"px").style("max-width",(t.maxWidth||"300")+"px")
},hideToolTip:function(t){e.selectAll(".visToolTip").style("display","none")},
radialGradient:function(e){var i=[(e=t.extend(!0,{cx:0,cy:0,
stopColor:this.options.radialGradientStopColor,r:this.chartBounds().size.width/2
},e)).cx,e.cy,e.r,e.startColor,e.stopColor].join(",")
;void 0!==this.radialGradients()[i]&&void 0===e.id&&(e.id=this.radialGradients()[i]),
void 0===e.id&&(e.id=this.uuid())
;var n=this.D3svg().select(".definitions").selectAll("#"+e.id).data([e]),s=!1
;n.enter().append("radialGradient").attr("id",(function(t){return s=!0,t.id
})).attr("gradientUnits","userSpaceOnUse").attr("cx",(function(t){return t.cx
})).attr("cy",(function(t){return t.cy})).attr("r",(function(t){return 2.5*t.r
})).attr("spreadMethod","pad")
;var a=s?0:this.options.transitionTime,r=n.selectAll('stop[offset="0%"]').data([e])
;r.enter().append("stop").attr("offset","0%"),
r.transition().duration(a).attr("stop-color",(function(t){return t.startColor}))
;var o=n.selectAll('stop[offset="30%"]').data([e])
;o.enter().append("stop").attr("offset","30%").attr("stop-opacity",1),
o.transition().duration(a).attr("stop-color",(function(t){return t.startColor}))
;var h=n.selectAll('stop[offset="70%"]').data([e])
;return h.enter().append("stop").attr("stop-opacity",1).attr("offset","70%"),
h.transition().duration(a).attr("stop-color",(function(t){return t.stopColor})),
this.radialGradients()[i]=e.id},linearGradient:function(e){
var i=this.chartBounds(),n=[(e=t.extend(!0,{x1:0,x2:0,y1:i.size.height,y2:0,
width:0,height:i.size.height
},e)).cx,e.cy,e.r,e.startColor,e.stopColor].join(",")
;void 0!==this.linearGradients()[n]&&void 0===e.id&&(e.id=this.linearGradients()[n]),
void 0===e.id&&(e.id=this.uuid())
;var s=this.D3svg().select(".definitions").selectAll("#"+e.id).data([e]),a=!1
;s.enter().append("linearGradient").attr("id",(function(t){return a=!0,t.id
})).attr("gradientUnits","userSpaceOnUse").attr("x1",(function(t){return t.x1
})).attr("x2",(function(t){return t.x2})).attr("y1",(function(t){return t.y1
})).attr("y2",(function(t){return t.y2})).attr("spreadMethod","pad")
;var r=a?0:this.options.transitionTime,o=s.selectAll("stop").data(e.colors)
;return o.enter().append("stop"),
o.transition().duration(r).attr("offset",(function(t,i){
if(e.gradStops)return e.gradStops[i];var n=0
;return i===e.colors.length-1?n=1:i>0&&(n=i/(e.colors.length-1)),
Math.round(1e4*n)/100+"%"})).attr("stop-color",(function(t){return t
})),this.linearGradients()[n]=e.id},wrap:function(t,i,n){
void 0===n&&(n=function(){return 0}),t.each((function(){
for(var t,s=e.select(this),a=s.text().split(/\s+/).reverse(),r=[],o=s.attr("y"),h=parseFloat(s.attr("dy"))||0,d=s.text(null).append("tspan").attr("x",n).attr("y",o).attr("dy",h+"em");t=a.pop();)r.push(t),
d.text(r.join(" ")),
d.node().getComputedTextLength()>i&&(r.pop(),d.text(r.join(" ")),
r=[t],d=s.append("tspan").attr("x",n).attr("y",o).attr("dy","1.1em").text(t))}))
},absPos:function(t){var e=t.getBBox(),i=t.getScreenCTM();return{x:e.x+i.e,
y:e.y+i.f}},endall:function(t,e){var i=0;t.each((function(){++i
})).each("end",(function(){--i||e.apply(this,arguments)}))},
uniqueness:function(t){
return void 0===t&&(t=this.options.uniqueFunc||this.uniqueID),
this.options.useUniqueID?t:void 0}})}));