define(["jquery","uuid","widgets/communities/jquery.svg  "],(function(t,e){
"use strict";return{about:{name:"plot",title:"Plot",author:"Tobias Paczian",
version:"1.0"},defaults:{title:"",title_color:"black",
default_line_color:"black",default_line_width:1,show_legend:!0,
legend_position:"right",series:[],connected:!0,show_dots:!0,width:800,
height:400,x_min:void 0,x_max:void 0,y_min:void 0,y_max:void 0,x_scale:"linear",
y_scale:"linear",x_title:"",y_title:"",x_titleOffset:35,y_titleOffset:45,
titleOffset:0,drag_select:null,data:void 0},options:[{general:[{
name:"default_line_color",type:"color",
description:"default color of the data lines of the plot",
title:"default line color"},{name:"default_line_width",type:"int",
description:"default width of the data lines of the plot in pixel",
title:"default line width"},{name:"connected",type:"bool",
description:"sets whether the data points are connected or not",
title:"connected",defaultTrue:!0},{name:"show_dots",type:"bool",
description:"sets whether the data points are displayed or not",
title:"show dots",defaultTrue:!0}]},{text:[{name:"title",type:"text",
description:"title string of the plot",title:"title"},{name:"title_color",
type:"color",description:"color of the title string of the plot",
title:"title color"},{name:"x_title",type:"text",
description:"title of the x-axis of the plot",title:"x title"},{name:"y_title",
type:"text",description:"title of the y-axis of the plot",title:"y title"},{
name:"x_titleOffset",type:"int",description:"title offset from the x-axis",
title:"x title offset"},{name:"y_titleOffset",type:"int",
description:"title offset from the y-axis",title:"y title offset"},{
name:"titleOffset",type:"int",description:"title offset from the top",
title:"title offset"}]},{layout:[{name:"show_legend",type:"bool",
description:"sets whether the legend is displayed or not",title:"show legend",
defaultTrue:!0},{name:"width",type:"int",
description:"width of the plot in pixel",title:"width"},{name:"height",
type:"int",description:"height of the plot in pixel",title:"height"},{
name:"legend_position",type:"select",description:"position of the legend",
title:"legend position",options:[{value:"left",selected:!0},{value:"right"},{
value:"top"},{value:"bottom"}]}]},{axes:[{name:"x_min",type:"int",
description:"minimum value of the x-axis",title:"x min"},{name:"x_max",
type:"int",description:"maximum value of the x-axis",title:"x max"},{
name:"y_min",type:"int",description:"minimum value of the y-axis",title:"y min"
},{name:"y_max",type:"int",description:"maximum value of the y-axis",
title:"y max"},{name:"y_scale",type:"select",
description:"type of the scale of the y-axis",title:"y scale",options:[{
value:"linear",selected:!0},{value:"log"}]},{name:"x_scale",type:"select",
description:"type of the scale of the x-axis",title:"x scale",options:[{
value:"linear",selected:!0},{value:"log"}]}]}],exampleData:function(){return{
series:[{name:"cool",color:"blue",shape:"circle"},{name:"uncool",color:"red",
shape:"square"},{name:"semi-cool",color:"orange",shape:"triangle"}],points:[[{
x:.5,y:7},{x:.15,y:5},{x:.5,y:15}],[{x:0,y:0},{x:.25,y:35},{x:.35,y:90}],[{x:.8,
y:80},{x:.49,y:50},{x:.15,y:10}]]}},create:function(i){var s={settings:{},
index:i.index}
;return t.extend(!0,s,this),t.extend(!0,s.settings,this.defaults,i),
s.settings.id=new e(4).format(),s},render:function(){var e=this.settings.target
;return e.innerHTML="<div class='plot_div'></div>",
e.firstChild.setAttribute("style","width: "+this.settings.width+"px; height: "+this.settings.height+"px;"),
t(e).find(".plot_div").svg(),
this.drawImage(t(e).find(".plot_div").svg("get")),this},niceNum:function(t,e){
var i=Math.floor(Math.log10(t)),s=t/Math.pow(10,i)
;return(e?s<1.5?1:s<3?2:s<7?5:10:s<=1?1:s<=2?2:s<=5?5:10)*Math.pow(10,i)},
niceScale:function(t){
var e=t.min,i=t.max,s=t.ticks||10,n=this.niceNum(i-e,!1),o=this.niceNum(n/(s-1),!0)
;return{min:Math.floor(e/o)*o,max:Math.ceil(i/o)*o,space:o}},
drawImage:function(t){if(void 0===this.settings.x_min){
var e,i,s=void 0,n=void 0,o=void 0,a=void 0
;for(e=0;e<this.settings.data.points.length;e++)for(i=0;i<this.settings.data.points[e].length;i++)(void 0===s||this.settings.data.points[e][i].x<s)&&(s=this.settings.data.points[e][i].x),
(void 0===n||this.settings.data.points[e][i].x>n)&&(n=this.settings.data.points[e][i].x),
(void 0===o||this.settings.data.points[e][i].y<o)&&(o=this.settings.data.points[e][i].y),
(void 0===a||this.settings.data.points[e][i].y>a)&&(a=this.settings.data.points[e][i].y)
;var l=this.niceScale({min:s,max:n})
;this.settings.x_min=l.min,this.settings.x_max=l.max;var h=this.niceScale({
min:o,max:a});this.settings.y_min=h.min,this.settings.y_max=h.max}
for(t.plot.noDraw().title(this.settings.title,this.settings.titleOffset,this.settings.title_color,this.settings.title_settings),
e=0;e<this.settings.data.length;e++)this.settings.data[e]
;t.plot.plotPoints=this.settings.data.points,
t.plot.connected=this.settings.connected,
t.plot.showDots=this.settings.show_dots,t.plot.series=this.settings.data.series,
t.plot.noDraw().format("white","gray").gridlines({stroke:"gray",
strokeDashArray:"2,2"
},"gray"),t.plot.xAxis.scale(this.settings.x_min,this.settings.x_max,this.settings.x_scale).ticks(parseFloat((this.settings.x_max-this.settings.x_min)/10),parseFloat((this.settings.x_max-this.settings.x_min)/5),8,"sw",this.settings.x_scale).title(this.settings.x_title,this.settings.x_titleOffset),
t.plot.yAxis.scale(this.settings.y_min,this.settings.y_max,this.settings.y_scale).ticks(parseFloat((this.settings.y_max-this.settings.y_min)/10),parseFloat((this.settings.y_max-this.settings.y_min)/5),8,"sw",this.settings.y_scale).title(this.settings.y_title,this.settings.y_titleOffset),
t.plot.legend.settings({fill:"white",stroke:"gray"});var r=0
;if(this.settings.show_legend)switch(this.settings.legend_position){case"left":
r=1;break;case"right":r=2;break;case"top":r=3;break;case"bottom":r=4;break
;default:r=1}
t.plot.noDraw().legend.show(r).area(this.settings.legendArea?this.settings.legendArea:[[0,0,0,0],[.005,.1,.125,.5],[.85,.1,.97,.5],[.2,.1,.8,.2],[.2,.9,.8,.995]][r]).end().area(this.settings.chartArea?this.settings.chartArea:[[.1,.1,.95,.9],[.2,.1,.95,.9],[.1,.1,.8,.9],[.1,.25,.9,.9],[.1,.1,.9,.8]][r]).redraw()
}}}));