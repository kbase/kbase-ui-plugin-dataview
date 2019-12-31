define(["jquery","./linechart"],(function(t){"use strict";t.KBWidget({
name:"kbaseSparkline",parent:"kbaseLinechart",version:"1.0.0",options:{
xInset:.02,yInset:.02,lineWidth:1,useHighlightLine:!1,useOverLine:!1,
autoLegend:!1,scaleAxes:!0,transitionTime:500,xPadding:0,xGutter:0,yPadding:0,
yGutter:0,addLastPoint:!0,lastPointShape:"circle",lastPointShapeArea:9,
lastPointColor:"red",shouldRenderXAxis:!1,shouldRenderYAxis:!1},
setDataset:function(t){var e=t;if(t=[{values:t
}],this._super(t),this.options.addLastPoint){var i=e[e.length-1]
;i.shape=this.options.lastPointShape,
i.shapeArea=this.options.lastPointShapeArea,i.color=this.options.lastPointColor}
}})}));