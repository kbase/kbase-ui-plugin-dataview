define(["jquery","d3","../legacy/authenticatedWidget"],(function(t,i){
"use strict";t.KBWidget({name:"kbaseHistogram",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",options:{numBins:50,
minCutoff:.001,tickColor:"blue",colors:["#0000FF","#000099"]},
getState:function(){return{numBins:this.options.numBins,
minCutoff:this.options.minCutoff,maxCutoff:this.options.maxCutoff}},
loadState:function(t){
this.options.numBins=parseInt(t.numBins),this.options.minCutoff=parseFloat(t.minCutoff),
this.options.maxCutoff=parseFloat(t.maxCutoff),
isNaN(this.options.minCutoff)&&delete this.options.minCutoff,
isNaN(this.options.maxCutoff)&&delete this.options.maxCutoff,
this.data("minCutoff").val(this.options.minCutoff),
this.data("maxCutoff").val(this.options.maxCutoff),
this.data("numBins").text(this.options.numBins),
this.data("numBinsRange").val(this.options.numBins)},_accessors:["dataset"],
setDataset:function(t){
this.dataset(t),this.renderHistogram(this.options.numBins)},
renderXAxis:function(){this.data("barchart").renderXAxis()},init:function(t){
return this._super(t),
this.appendUI(this.$elem),this.gradientID=this.data("barchart").linearGradient({
colors:this.options.colors}),this},appendUI:function(i){
var n=this,a=t.jqElem("div").css({width:800,height:500
}),s=t.jqElem("div").append(t.jqElem("div").attr("class","col-md-10").append(t.jqElem("div").attr("class","col-md-1").append(t.jqElem("div").append(t.jqElem("span").attr("id","numBins").text(n.options.numBins)).append(" bins"))).append(t.jqElem("div").attr("class","col-md-8").append(t.jqElem("input").attr("id","numBinsRange").attr("type","range").attr("min",0).attr("max",100).attr("value",n.options.numBins).attr("step",1).css("width","800px").on("input",(function(i){
n.data("numBins").text(t(this).val())})).on("change",(function(i){
n.data("numBins").text(t(this).val()),n.options.numBins=parseInt(t(this).val()),
n.renderHistogram()
}))))).append(t.jqElem("div").attr("class","col-md-4").append(t.jqElem("div").attr("class","input-group").append(t.jqElem("div").attr("class","input-group-addon").append(" Expression level at least ")).append(t.jqElem("input").attr("type","input").attr("id","minCutoff").attr("class","form-control").attr("value",n.options.minCutoff).on("change",(function(i){
n.options.minCutoff=parseFloat(t(this).val()),n.renderHistogram()
}))))).append(t.jqElem("div").attr("class","col-md-4 col-md-offset-3").append(t.jqElem("div").attr("class","input-group").append(t.jqElem("div").attr("class","input-group-addon").append(" Expression level at most ")).append(t.jqElem("input").attr("type","input").attr("class","form-control").attr("id","maxCutoff").attr("value",n.options.maxCutoff).on("change",(function(i){
n.options.maxCutoff=parseFloat(t(this).val()),n.renderHistogram()
}))))).append(a);i.append(s);var o=a.kbaseBarchart(this.options)
;o.superRenderXAxis=o.renderXAxis,o.renderXAxis=function(){o.superRenderXAxis(),
o.D3svg().selectAll(".xAxis .tick text").attr("fill",this.options.tickColor).on("mouseover",(function(i,n){
t.each(o.dataset(),(function(t,n){n.bar===i&&o.showToolTip({label:n.tooltip})}))
})).on("mouseout",(function(t){o.hideToolTip()}))
},this._rewireIds(i,this),this.data("barElem",a),this.data("barchart",o)},
renderHistogram:function(n){var a=this;void 0===n&&(n=this.options.numBins)
;var s=this.dataset()
;isNaN(this.options.minCutoff)&&isNaN(this.options.maxCutoff)||(s=[],
t.each(this.dataset(),(function(t,i){
(isNaN(a.options.minCutoff)||i>=a.options.minCutoff)&&(isNaN(a.options.maxCutoff)||i<=a.options.maxCutoff)&&s.push(i)
})));var o=i.layout.histogram().bins(n)(s),e=[];t.each(o,(function(t,i){
var n=Math.round(1e3*i.x)/1e3+" to "+Math.round(1e3*(i.x+i.dx))/1e3;e.push({
bar:n,value:i.y,color:"url(#"+a.gradientID+")",tooltip:i.y+" in range<br>"+n,
id:i.x})})),this.data("barchart").setDataset(e)}})}));