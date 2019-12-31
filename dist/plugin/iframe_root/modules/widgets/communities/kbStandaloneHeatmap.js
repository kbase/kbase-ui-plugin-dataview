define(["jquery","widgets/communities/jquery.svg"],(function(t){"use strict"
;return{about:{name:"heatmap",title:"Heatmap",author:"Tobias Paczian",
version:"1.0",requires:["jquery.svg.js"]},defaults:{width:200,height:200,
tree_height:50,tree_width:50,legend_height:80,legend_width:100,row_text_size:15,
col_text_size:15,min_cell_height:19,selectedRows:[],selectedColumns:[],cells:[]
},options:[{text:[{name:"row_text_size",type:"int",
description:"font size of the row text in pixel",title:"row font size"},{
name:"col_text_size",type:"int",
description:"font size of the column text in pixel",title:"column font size"},{
name:"min_cell_height",type:"int",description:"minimum height of a cell",
title:"minimum cell height"}]},{layout:[{name:"height",type:"int",
description:"height of the plot",title:"height"},{name:"width",type:"int",
description:"width of the plot",title:"width"},{name:"tree_height",type:"int",
description:"height of the dendogram",title:"dendogram height"},{
name:"tree_width",type:"int",description:"width of the dendogram",
title:"dendogram width"},{name:"legend_height",type:"int",
description:"height of the legend",title:"legend height"},{name:"legend_width",
type:"int",description:"width of the legend",title:"legend width"}]}],
exampleData:function(){return{columns:["4441619.3","4441656.4","4441620.3"],
rows:["Eukaryota","unassigned","Bacteria","Archaea"],
data:[[.338159580408187,.717179237742824,.514052821211353],[.238159580408187,.317179237742824,.114052821211353],[.553202346761363,.614080873307415,.555096325148052],[.996159994861707,.940468112695288,1]]
}},create:function(e){var s={settings:{}}
;return t.extend(!0,s,this),t.extend(!0,s.settings,this.defaults,e),s},
render:function(){
var e=this.settings.data.rows.length*this.settings.min_cell_height+this.settings.tree_height+this.settings.legend_height
;this.settings.height<e&&(this.settings.height=e)
;var s=this.settings.data.columns.length*this.settings.min_cell_height+this.settings.tree_width+this.settings.legend_width
;this.settings.width<s&&(this.settings.width=s);var i=this.settings.target
;i.innerHTML="<div class='heatmap-container'><div class='heatmap_div'></div></div>"
;var a=t(i).find(".heatmap_div")
;a.attr("style","width: "+this.settings.width+"px; height: "+this.settings.height+"px;")
;var n=this
;return t(i).find(".heatmap-container").on("click",'[data-type="label"]',(function(){
var e=parseInt(t(this).attr("data-row"),10),s=parseInt(t(this).attr("data-dir"),10)
;n.toggleSelected(e,s)
})),t(i).find(".heatmap-container").on("click",'[data-type="cell"]',(function(){
var e=parseInt(t(this).attr("data-row"),10),s=parseInt(t(this).attr("data-col"),10),i=parseFloat(t(this).attr("data-value"))
;n.cellClick(e,s,i,this)
})),t(i).find(".heatmap-container").on("mouseover",'[data-type="cell"]',(function(){
var e=parseInt(t(this).attr("data-row"),10),s=parseInt(t(this).attr("data-col"),10),i=parseFloat(t(this).attr("data-value"))
;n.cellHover(1,e,s,i,this)
})),t(i).find(".heatmap-container").on("mouseout",'[data-type="cell"]',(function(){
var e=parseInt(t(this).attr("data-row"),10),s=parseInt(t(this).attr("data-col"),10),i=parseFloat(t(this).attr("data-value"))
;n.cellHover(0,e,s,i,this)})),a.svg(),this.drawImage(a.svg("get")),this},
drawImage:function(t){
var e=this.settings.data.rows.length,s=this.settings.data.columns.length,i=parseInt((this.settings.width-this.settings.legend_width-this.settings.tree_width-5)/s,10)
;this.settings.boxwidth=i
;var a=parseInt((this.settings.height-this.settings.legend_height-this.settings.tree_height-5)/e,10)
;this.settings.boxheight=a
;var n=parseInt(this.settings.width-this.settings.legend_width-this.settings.tree_width-5,10),h=(parseInt(this.settings.height-this.settings.legend_height-this.settings.tree_height-5,10),
0),r=0,l=0,o=0,d={fill:"red",strokeWidth:1,stroke:"black"}
;if(this.settings.data.hasOwnProperty("coldend")&&this.settings.data.hasOwnProperty("colindex"))this.settings.data.colcluster=this.settings.data.coldend;else{
var g=this.cluster(this.transpose(this.settings.data.data))
;this.settings.data.colcluster=g[0],this.settings.data.colindex=g[1]}
if(this.settings.data.hasOwnProperty("rowdend")&&this.settings.data.hasOwnProperty("rowindex"))this.settings.data.rowcluster=this.settings.data.rowdend;else{
var c=this.cluster(this.settings.data.data)
;this.settings.data.rowcluster=c[0],this.settings.data.rowindex=c[1]}
this.drawDendogram(t,0),this.drawDendogram(t,1)
;for(var p=0;p<this.settings.data.data.length;p++){
var f=this.settings.tree_width+n+5,u=this.settings.tree_height+this.settings.legend_height+(a*(p+1)-parseInt((a-this.settings.row_text_size)/2))-2,w="black"
;this.settings.selectedRows[p]&&(w="blue"),
t.text(null,f,u,""+this.settings.data.rows[this.settings.data.rowindex[p]-1],{
fill:w,fontSize:this.settings.row_text_size+"px","data-type":"label",
"data-row":String(p),"data-dir":"0",cursor:"pointer"
}),t.text(null,f,u,""+this.settings.data.rows[this.settings.data.rowindex[p]-1],{
fill:w,fontSize:this.settings.row_text_size+"px","data-type":"label",
"data-row":String(p),"data-dir":"0",cursor:"pointer"
}),this.settings.cells.push([])
;for(var v=0;v<this.settings.data.data[p].length;v++){if(0===p){
var m=this.settings.tree_width+i*v+parseInt((i-this.settings.col_text_size)/2)+12,_=this.settings.legend_height-5
;w="black",
this.settings.selectedColumns[v]&&(w="blue"),t.text(null,m,_,this.settings.data.columns[this.settings.data.colindex[v]-1],{
fill:w,fontSize:this.settings.col_text_size+"px",
transform:"rotate(-90, "+m+", "+_+")","data-type":"label","data-row":String(v),
"data-dir":"1",cursor:"pointer"})}
h=v*i+this.settings.tree_width,l=i,r=p*a+this.settings.tree_height+this.settings.legend_height,
o=a
;var x="black",y=2*this.settings.data.data[this.settings.data.rowindex[p]-1][this.settings.data.colindex[v]-1]-1,b=parseInt(255*Math.abs(y))
;x=y<0?"rgb("+b+",0,0)":"rgb(0,"+b+",0)",
d.fill=x,d["data-type"]="cell",d["data-row"]=String(p),
d["data-col"]=String(v),d["data-value"]=String(y),
this.settings.cells[p][v]=t.rect(null,h,r,l,o,0,0,d)}}},
drawDendogram:function(t,e){
var s=e?this.settings.tree_width:this.settings.tree_height,i=e?this.settings.data.rowcluster:this.settings.data.colcluster,a=e?this.settings.boxheight:this.settings.boxwidth,n=e?this.settings.tree_height:this.settings.tree_width,h=this.settings.legend_height+this.settings.tree_height,r=parseInt(s/i.depth),l=""
;if(e){n++;for(var o=0;o<i.depth;o++){for(var d=0+h,g=0;g<i[o].length;g++){
var c=i[o][g]
;l+="M"+n+","+parseInt(d+a*c.a/2)+"l-"+parseInt(r)+",0",c.hasOwnProperty("b")&&(l+="l0,"+parseInt(a*(c.a/2)+a*(c.b/2))+"l"+parseInt(r)+",0"),
d+=c.b?(c.a+c.b)*a:c.a*a}n-=r}}else for(o=0;o<i.depth;o++){
for(d=0+n,g=0;g<i[o].length;g++){c=i[o][g]
;l+="M"+parseInt(d+a*c.a/2)+","+h+"l0,-"+parseInt(r),
c.hasOwnProperty("b")&&(l+="l"+parseInt(a*(c.a/2)+a*(c.b/2))+",0l0,"+parseInt(r)),
d+=c.b?(c.a+c.b)*a:c.a*a}h-=r}t.path(null,l,{fill:"none",stroke:"black"})},
toggleSelected:function(t,e){
e?"function"==typeof this.settings.colClicked?this.settings.colClicked({col:t,
label:this.settings.data.cols[this.settings.data.colindex[t]-1]
}):this.settings.selectedColumns[t]?this.settings.selectedColumns[t]=0:this.settings.selectedColumns[t]=1:"function"==typeof this.settings.rowClicked?this.settings.rowClicked({
row:t,label:this.settings.data.rows[this.settings.data.rowindex[t]-1]
}):this.settings.selectedRows[t]?this.settings.selectedRows[t]=0:this.settings.selectedRows[t]=1,
this.render()},cellClick:function(t,e,s,i){
"function"==typeof this.settings.cellClicked&&this.settings.cellClicked({row:t,
col:e,value:s,cell:i})},cellHover:function(t,e,s,i,a){
"function"==typeof this.settings.cellHovered&&this.settings.cellHovered({over:t,
row:e,col:s,value:i,cell:a})},clustsort:function(t,e){return t.amin-e.amin},
distance:function(t){for(var e={},s=0;s<t.length;s++)e[s]={}
;for(s=0;s<t.length;s++)for(var i=0;i<t.length;i++)if(!(s>=i)){
for(var a=0,n=0;n<t[s].data[0].length;n++)a+=Math.pow(t[s].data[0][n]-t[i].data[0][n],2)
;e[s][i]=Math.pow(a,.5)}return e},transpose:function(t){
for(var e=[],s=0;s<t.length;s++)for(var i=0;i<t[s].length;i++)0===s&&e.push([]),
e[i][s]=t[s][i];return e},cluster:function(t){
for(var e=t.length,s={},i=[],a=0;a<t.length;a++)i.push({points:[a],data:[t[a]],
basepoints:[a],level:[0]}),s[a]=!0;for(var n,h,r=this.distance(i);e>1;){var l=!1
;for(var a in r)if(r.hasOwnProperty(a)){
for(var o in r[a])if(r[a].hasOwnProperty(o)&&s[a]&&s[o]){n=r[a][o],h=[a,o],l=!0
;break}if(l)break}
for(var a in r)if(r.hasOwnProperty(a))for(var o in r[a])r[a].hasOwnProperty(o)&&s[a]&&s[o]&&r[a][o]<n&&(h=[a,o],
n=r[a][o]);s[h[0]]=!1,s[h[1]]=!1,e--,s[i.length]=!0;var d=0,g=0
;for(o=0;o<2;o++)for(a=0;a<i[h[o]].data.length;a++)0===o?d+=i[h[o]].data[a]:g+=i[h[o]].data[a]
;var c=[],p=[];for(o=0;o<2;o++){var f=o;d>g&&(f=0===o?1:0)
;for(a=0;a<i[h[f]].data.length;a++)c.push(i[h[f]].data[a])
;for(a=0;a<i[h[f]].basepoints.length;a++)p.push(i[h[f]].basepoints[a])}
var u=h[0],w=h[1];if(d>g){var v=u;u=w,w=v}u=parseInt(u),w=parseInt(w),i.push({
points:[u,w],data:c,basepoints:p,
level:[Math.max.apply(null,i[u].level)+1,Math.max.apply(null,i[w].level)+1]})
;var m=[]
;for(o=0;o<2;o++)for(a=0;a<i[h[o]].data.length;a++)for(f=0;f<i[h[o]].data[a].length;f++)0===o&&0===a&&(m[f]=0),
m[f]+=i[h[o]].data[a][f]
;for(a=0;a<m.length;a++)m[a]=m[a]/(i[u].data.length+i[w].data.length)
;var _=i.length-1;r[_]={};for(o=0;o<_;o++){var x=[]
;for(a=0;a<i[o].data.length;a++)for(f=0;f<i[o].data[a].length;f++)0===a&&(x[f]=0),
x[f]+=i[o].data[a][f];for(a=0;a<x.length;a++)x[a]=x[a]/i[o].data.length;var y=0
;for(a=0;a<m.length;a++)y+=Math.pow(m[a]-x[a],2);r[o][_]=Math.pow(y,.5)}}
var b=[],I=i.length-1
;for(a=0;a<i[I].basepoints.length;a++)b.push(i[I].basepoints[a]+1);var k={}
;for(a=0;a<b.length;a++)k[b[a]]=a;var z=0
;for(a=0;a<i.length;a++)i[a].level[0]&&i[a].level[0]>z&&(z=i[a].level[0]),
i[a].level[1]&&i[a].level[1]>z&&(z=i[a].level[1]);var M={depth:z}
;for(a=0;a<M.depth;a++)M[a]=[];for(a=t.length;a<i.length;a++){
var C=Math.max.apply(null,i[a].level)-1;if(M[C].push({
a:i[i[a].points[0]].data.length,b:i[i[a].points[1]].data.length,
amin:k[Math.min.apply(null,i[i[a].points[0]].basepoints)+1]
}),i[a].level[0]!==i[a].level[1]){var P=0;i[a].level[1]<i[a].level[0]&&(P=1)
;for(o=0;o<Math.abs(i[a].level[0]-i[a].level[1]);o++)M[C-(o+1)].push({
a:i[i[a].points[P]].data.length,
amin:k[Math.min.apply(null,i[i[a].points[P]].basepoints)+1]})}}
for(var a in M)M.hasOwnProperty(a)&&!isNaN(a)&&M[a].sort(this.clustsort)
;return[M,b]}}}));