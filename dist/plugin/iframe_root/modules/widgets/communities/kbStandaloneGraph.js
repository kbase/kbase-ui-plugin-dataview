define(["jquery","widgets/communities/jquery.svg"],(function(t){"use strict"
;return{about:{name:"graph",title:"Graph",author:"Tobias Paczian",version:"1.0"
},defaults:{type:"column",title:"",title_color:"black",title_settings:{
fontSize:"15px"},x_title:"",y_title:"",y2_title:"",x_title_color:"black",
y_title_color:"black",y2_title_color:"black",x_labels:[],x_labels_rotation:null,
y_labels:[],y_scale:"linear",y2_labels:[],y2_scale:"linear",x_tick_interval:0,
y_tick_interval:30,y2_tick_interval:30,x_labeled_tick_interval:1,
y_labeled_tick_interval:5,y2_labeled_tick_interval:5,default_line_color:"black",
default_line_width:1,show_legend:!1,legend_position:"right",show_grid:!1,
short_axis_labels:!1,normalize_stacked_area:!0,width:800,height:400},options:[{
general:[{name:"type",type:"select",description:"type of the graph",
title:"type",options:[{value:"column",selected:!0},{value:"stackedColumn",
label:"stacked column"},{value:"row"},{value:"stackedRow",label:"stacked row"},{
value:"line"},{value:"pie"},{value:"stackedArea",label:"stacked area"},{
value:"deviation",label:"deviation"}]},{name:"default_line_color",type:"color",
description:"default color of the data lines of the graph",
title:"default line color"},{name:"default_line_width",type:"int",
description:"default width of the data lines of the graph in pixel",
title:"default line width"},{name:"show_grid",type:"select",
description:"sets whether grid is displayed or not",title:"show grid",options:[{
value:0,selected:!0,label:"no"},{value:1,label:"yes"}]}]},{text:[{name:"title",
type:"text",description:"title string of the graph",title:"title"},{
name:"title_color",type:"color",
description:"color of the title string of the graph",title:"title color"},{
name:"x_title",type:"text",description:"title of the x-axis of the graph",
title:"x title"},{name:"y_title",type:"text",
description:"title of the y-axis of the graph",title:"y title"},{
name:"x_title_color",type:"color",
description:"color of the title of the x-axis of the graph",
title:"x title color"},{name:"y_title_color",type:"color",
description:"color of the title of the y-axis of the graph",
title:"y title color"},{name:"x_labels_rotation",type:"int",
description:"rotation in degrees of the x-axis labels",title:"x label rotation"
}]},{layout:[{name:"width",type:"int",description:"width of the graph in pixel",
title:"width"},{name:"height",type:"int",
description:"height of the graph in pixel",title:"height"},{name:"show_legend",
type:"select",description:"sets whether the legend is displayed or not",
title:"show legend",options:[{value:0,selected:!0,label:"no"},{value:1,
label:"yes"}]},{name:"legend_position",type:"select",
description:"position of the legend",title:"legend position",options:[{
value:"left",selected:!0},{value:"right"},{value:"top"},{value:"bottom"}]}]},{
axes:[{name:"y_scale",type:"select",
description:"type of the scale of the y-axis",title:"y scale",options:[{
value:"linear",selected:!0},{value:"log"}]},{name:"x_tick_interval",type:"int",
description:"pixel distance of the minor tickmarks on the x-axis",
title:"minor x ticks"},{name:"y_tick_interval",type:"int",
description:"pixel distance of the minor tickmarks on the y-axis",
title:"minor y ticks"},{name:"x_labeled_tick_interval",type:"int",
description:"pixel distance of the major tickmarks on the x-axis",
title:"major x ticks"},{name:"y_labeled_tick_interval",type:"int",
description:"pixel distance of the major tickmarks on the y-axis",
title:"major y ticks"},{name:"short_axis_labels",type:"select",
description:"sets whether the axis labels should be shortened or not",
title:"short axis labels",options:[{value:0,selected:!0,label:"no"},{value:1,
label:"yes"}]}]}],exampleData:function(){return[{name:"IE",data:[95,91,78,66]},{
name:"Netscape",data:[3,12,18,18]},{name:"Firefox",data:[0,4,8,9]},{
name:"Chrome",data:[0,8,18,22]},{name:"Gecko",data:[1,2,3,33]}]},
create:function(e){var i={settings:{},index:e.index};return t.extend(!0,i,this),
t.extend(!0,i.settings,this.defaults,e),i},render:function(){
var e=this.settings.target
;e.innerHTML="<div class='graph_div'></div>",e.firstChild.setAttribute("style","width: "+this.settings.width+"px; height: "+this.settings.height+"px;"),
t(e).find(".graph_div").svg();var i=0
;return"deviation"!==this.settings.type||this.settings.data[0].data.hasOwnProperty("upper")||(this.calculateData(this.settings.data),
i=this.cmax),this.drawImage(t(e).find(".graph_div").svg("get"),i),this},
niceNum:function(t,e){var i=Math.floor(Math.log10(t)),a=t/Math.pow(10,i)
;return(e?a<1.5?1:a<3?2:a<7?5:10:a<=1?1:a<=2?2:a<=5?5:10)*Math.pow(10,i)},
niceScale:function(t){
var e=t.min,i=t.max,a=t.ticks||10,s=this.niceNum(i-e,!1),l=this.niceNum(s/(a-1),!0)
;return{min:Math.floor(e/l)*l,max:Math.ceil(i/l)*l,space:l}},
hover:function(e,i,a,s){
var l=s.currentTarget.ownerSVGElement.ownerSVGElement.parentNode.id,n=l.substr(9),r=t("#"+l).svg("get")
;if(e?(t(this,r.root()).attr("fill-opacity",.8),
t(this,r.root()).attr("title",e+": "+i)):t(this,r.root()).attr("fill-opacity",1),
"click"===a){
var o=parseInt(this.parentElement.className.baseVal.substr(this.parentElement.className.baseVal.search(/\d+/)),10)
;if(r.graph.options({explode:[o],explodeDist:15
}),"function"==typeof this.settings.onclick){var h,d=""
;for(h=0;h<this.parentElement.children.length;h+=1)if(this.parentElement.children[h]===this){
this.getAttribute("r")&&(h-=1),d=r.graph.xAxis.labels().labels[h];break}
this.settings.onclick({this:n,series:e,value:i,label:d,item:this,index:h,
series_index:o,svg:r})}}},drawImage:function(t,e){
var i,a,s=["url(#fadeBlue)","url(#fadeRed)","url(#fadeGreen)","url(#fadeYellow)","url(#fadeLightblue)","url(#fadePurple)"],l=t.defs(),n=0,r=0
;for(i=0;i<this.settings.data.length;i+=1)for(a=0;a<this.settings.data[i].data.length;a+=1)this.settings.data[i].settings&&this.settings.data[i].settings.isY2?parseFloat(this.settings.data[i].data[a])>r&&(r=parseFloat(this.settings.data[i].data[a])):parseFloat(this.settings.data[i].data[a])>n&&(n=parseFloat(this.settings.data[i].data[a]))
;for(n=e||n,
t.linearGradient(l,"fadeRed",[[0,"#EE5F5B"],[1,"#BD362F"]]),t.linearGradient(l,"fadeBlue",[[0,"#0088CC"],[1,"#0044CC"]]),
t.linearGradient(l,"fadeGreen",[[0,"#62C462"],[1,"#51A351"]]),
t.linearGradient(l,"fadeYellow",[[0,"#FBB450"],[1,"#F89406"]]),
t.linearGradient(l,"fadeLightblue",[[0,"#5BC0DE"],[1,"#2F96B4"]]),
t.linearGradient(l,"fadePurple",[[0,"#ee5be0"],[1,"#bd2fa6"]]),
t.graph.shortAxisLabels=this.settings.short_axis_labels,
t.graph.normalizeStackedArea=this.settings.normalize_stacked_area,
t.graph.noDraw().title(this.settings.title,this.settings.title_color,this.settings.title_settings),
t.graph.noDraw().format("white",this.settings.show_grid?"gray":"white"),
this.settings.show_grid&&t.graph.noDraw().gridlines({stroke:"gray",
strokeDashArray:"2,2"},"gray"),i=0;i<this.settings.data.length;i+=1){
this.settings.data[i].name,
this.settings.data[i].data,this.settings.data[i].lineColor,
this.settings.data[i].lineWidth||this.settings.default_line_width,
this.settings.data[i].settings
;t.graph.noDraw().addSeries(this.settings.data[i].name,this.settings.data[i].data,null,this.settings.data[i].lineColor||"red",this.settings.data[i].lineWidth||this.settings.default_line_width,this.settings.data[i].settings||{})
}
t.graph.xAxis.title(this.settings.x_title,this.settings.x_title_color).ticks(this.settings.x_labeled_tick_interval,this.settings.x_tick_interval).scale(0,3),
this.settings.x_labels.length&&(t.graph.xAxis.labelRotation=this.settings.x_labels_rotation,
t.graph.xAxis.labels(this.settings.x_labels));var o=this.niceScale({min:0,max:n,
ticks:this.settings.y_labeled_tick_interval})
;t.graph.yAxis.title(this.settings.y_title,this.settings.y_title_color).ticks(o.max/this.settings.y_labeled_tick_interval,o.max/this.settings.y_tick_interval,null,null,this.settings.y_scale).scale(0,n,this.settings.y_scale),
this.settings.hasY2?(t.graph.y2Axis.title(this.settings.y2_title||"",this.settings.y2_title_color).ticks(parseInt(r/this.settings.y2_labeled_tick_interval,10),parseInt(r/this.settings.y2_tick_interval,10),null,null,this.settings.y_scale).scale(0,r,this.settings.y2_scale),
this.settings.y2_labels.length&&t.graph.y2Axis.labels(this.settings.y2_labels)):t.graph.y2Axis=null,
this.settings.y_labels.length&&t.graph.yAxis.labels(this.settings.y_labels),
t.graph.legend.settings({fill:"white",stroke:"white"})
;var h=this.settings.type,d=0
;if(this.settings.show_legend)switch(this.settings.legend_position){case"left":
d=1;break;case"right":d=2;break;case"top":d=3;break;case"bottom":d=4}var g={
barWidth:this.settings.barWidth||25}
;for(t.graph.status(this.hover),t.graph.noDraw().legend.show(this.settings.show_legend).area(this.settings.legendArea||[[0,0,0,0],[.005,.1,.125,.5],[.8,.1,.97,.5],[.2,.1,.8,.2],[.2,.9,.8,.995]][d]).end(),
i=0;i<this.settings.data.length;i+=1)t.graph.noDraw().series(i).format(this.settings.data[i].fill||s[i]).end()
;t.graph.noDraw().area(this.settings.chartArea||[[.1,.1,.95,.9],[.2,.1,.95,.9],[.1,.1,.75,.9],[.1,.25,.9,.9],[.1,.1,.9,.8]][d]).type(h,g).redraw()
},calculateData:function(t){var e=[],i=t[0].data[0],a=t[0].data[0]
;for(r=0;r<t.length;r+=1){t[r].data=t[r].data.sort((function(t,e){return t-e})),
t[r].data[0]<i&&(i=t[r].data[0]),
t[r].data[t[r].data.length-1]>a&&(a=t[r].data[t[r].data.length-1]),
e[r]=[],e[r].min=t[r].data[0],e[r].max=t[r].data[t[r].data.length-1]
;if(t[r].data.length%2==1){var s=parseInt(t[r].data.length/2)
;e[r].median=t[r].data[s],
(s+1)%2==1?(e[r].lower=t[r].data[parseInt((s+1)/2)],e[r].upper=t[r].data[s+parseInt((s+1)/2)]):(e[r].lower=(t[r].data[(s+1)/2]+t[r].data[(s+1)/2+1])/2,
e[r].upper=(t[r].data[s+(s+1)/2-1]+t[r].data[s+(s+1)/2])/2)}else{
var l=t[r].data.length/2,n=t[r].data.length/2-1
;e[r].median=(t[r].data[n]+t[r].data[l])/2,
l%2==1?(e[r].lower=t[r].data[n/2],e[r].upper=t[r].data[l+n/2]):(e[r].lower=(t[r].data[l/2-1]+t[r].data[l/2])/2,
e[r].upper=(t[r].data[l+l/2-1]+t[r].data[l+l/2])/2)}}
for(var r=0;r<t.length;r++)this.settings.data[r].data=[e[r]];this.cmax=a}}}));