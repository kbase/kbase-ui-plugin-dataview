define(["jquery","d3","./kbasePiechart"],(function(o,t){"use strict"
;o.KBWidget({name:"kbaseCircularHeatmap",parent:"kbasePiechart",version:"1.0.0",
options:{labels:!1,draggable:!1,gradient:!1,pieColor:"black",gbgColor:"#00FF00",
gmidColor:"black",gfgColor:"#FF0000",highlightColor:"cyan",
colorScale:function(o,e,i){if(void 0===i.colorScale){
var n=[0,1],a=[i.options.gbgColor||i.options.pieColor,i.options.gfgColor]
;i.options.gmidColor&&(a.splice(1,0,i.options.gmidColor),
n.splice(1,0,.5)),i.colorScale=t.scale.linear().domain(n).range(a)}
return i.colorScale(e.val)}},_accessors:[{name:"datasets",setter:"setDatasets"
}],init:function(o){
return this._super(o),this.options.parent&&(void 0===this.options.gbgColor&&(this.options.gbgColor=this.options.pieColor),
delete this.options.pieColor),this},setDatasets:function(o){
var t=this,e=t._super;t.callAfterInit((function(){
for(var i=o.length?o[0]:0,n=0;n<o.length;n++){
if(o[n].length!==i.length)throw"Cannot set datasets! Non-standard lengths of circles!"
;for(var a=0;a<o[n].length;a++)o[n][a].value=1/o[n].length}
return void 0===t.originalInnerRadius&&(t.originalInnerRadius=t.innerRadius()),
t.options.innerRadius=0-(t.outerRadius()-t.originalInnerRadius)/o.length,
e.call(t,o)}))},sliceAction:function(o){return function(){
return this.on("mouseover",(function(e){if(!e.data.gap){
var i=o.options.highlightColor;t.select(this).attr("fill",i);var n
;(n=t.mouse(this))[0],n[1];o.options.tooltips&&o.showToolTip({
label:e.data.tooltip||e.data.label+" : "+e.data.value,event:{
pageX:o.options.cornerToolTip?o.$elem.prop("offsetLeft")+5:t.event.pageX,
pageY:o.options.cornerToolTip?o.$elem.prop("offsetTop")+20:t.event.pageY}})}
})).on("mouseout",(function(e){e.data.gap||(o.options.tooltips&&o.hideToolTip(),
t.select(this).attr("fill",(function(t,i){
return e.data.color||o.options.colorScale(i,e.data,o)})))
})).on("dblclick",(function(t){
t.data.gap||o.options.draggable&&(o.options.startAngle=o.options.startAngle-t.startAngle,
o.renderChart())})),this}}})}));