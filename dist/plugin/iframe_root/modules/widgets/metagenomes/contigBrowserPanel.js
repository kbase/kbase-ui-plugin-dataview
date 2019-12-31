define(["bootstrap","jquery","d3","widgets/metagenomes/kbaseContigBrowserButton"],(function(t,i,e,n){
return function(){this.data={name:"ContigBrowserPanel",version:"1.0.0",options:{
contig:null,centerFeature:null,onClickUrl:null,allowResize:!0,svgWidth:700,
svgHeight:100,trackMargin:5,trackThickness:15,leftMargin:5,topMargin:20,
arrowSize:10,start:1,length:1e4,embedInCard:!1,showButtons:!0,
cardContainer:null,onClickFunction:null,width:550,token:null},tooltip:null,
operonFeatures:[],$messagePane:null,init:function(){
this.$messagePane=i("<div/>").addClass("kbwidget-message-pane").addClass("kbwidget-hide-message"),
this.$elem.append(this.$messagePane),this.render()
;return this.options.showButtons&&new n(this.$elem,{browser:this}),this},
render:function(){
this.loading(!1),this.tooltip=e.select("body").append("div").classed("kbcb-tooltip",!0).style("position","absolute"),
this.svg=e.select(this.$elem[0]).append("svg").attr("width",this.options.svgWidth).attr("height",this.options.svgHeight).classed("kbcb-widget",!0),
this.trackContainer=this.svg.append("g"),
this.xScale=e.scale.linear().domain([this.options.start,this.options.start+this.options.length]).range([0,this.options.svgWidth]),
this.xAxis=e.svg.axis().scale(this.xScale).orient("top").tickFormat(e.format(",.0f")),
this.axisSvg=this.svg.append("g").attr("class","kbcb-axis").attr("transform","translate(0, "+this.options.topMargin+")").call(this.xAxis)
;var t=this;return i(window).on("resize",(function(){t.resize()
})),null!=this.options.centerFeature&&this.setCenterFeature(this.options.centerFeature),
this.setContig(),this},track:function(){var t={regions:[],min:1/0,max:-1/0,
numRegions:0,addRegion:function(t){for(var i=0;i<t.length;i++){
var e=Number(t[i][1]),n=Number(t[i][3]),o="+"===t[i][2]?e+n-1:e-n+1;if(e>o){
var s=o;o=e,e=s}
this.regions.push([e,o]),e<this.min&&(this.min=e),o>this.max&&(this.max=o),
this.numRegions++}},hasOverlap:function(t){for(var i=0;i<t.length;i++){
var e=Number(t[i][1]),n=Number(t[i][3]),o="+"===t[i][2]?e+n-1:e-n+1;if(e>o){
var s=o;o=e,e=s}for(var r=0;r<this.regions.length;r++){var a=this.regions[r]
;if(!(e<=a[0]&&o<=a[0]||e>=a[1]&&o>=a[1]))return!0}}return!1}};return t},
setContig:function(){
this.contigLength=this.options.contig.length,this.options.start||(this.options.start=0),
this.options.length+this.options.start>this.contigLength&&(this.options.length=this.contigLength-this.options.start),
this.options.centerFeature?this.setCenterFeature():this.update()},
setCenterFeature:function(t){t&&(this.options.centerFeature=t),this.update()},
setRange:function(t,i){this.options.start=t,this.options.length=i,this.update()
},processFeatures:function(t){var i=[];i[0]=this.track();var e=[]
;for(fid in t)e.push(t[fid]);(t=e).sort((function(t,i){
return t.feature_location[0][1]-i.feature_location[0][1]}))
;for(var n=0;n<t.length;n++){
for(var o=t[n],s=0;s<i.length;s++)if(!i[s].hasOverlap(o.feature_location)){
i[s].addRegion(o.feature_location),o.track=s;break}if(void 0===o.track){
var r=i.length;i[r]=this.track(),i[r].addRegion(o.feature_location),o.track=r}}
return this.numTracks=i.length,t},update:function(t){var i=this,e=function(t){
if(i.options.centerFeature)for(var e in t)for(var n in i.operonFeatures)t[e].feature_id===i.operonFeatures[n]&&(t[e].isInOperon=1)
;i.renderFromRange(t)}
;i.options.centerFeature&&t?i.cdmiClient.fids_to_feature_data([i.options.centerFeature],(function(t){
t?(t=t[i.options.centerFeature],
i.options.start=Math.max(0,Math.floor(parseInt(t.feature_location[0][1])+parseInt(t.feature_location[0][3])/2-i.options.length/2))):window.alert("Error: fid '"+i.options.centerFeature+"' not found! Continuing with original range..."),
i.cdmiClient.region_to_fids([i.options.contig,i.options.start,"+",i.options.length],e)
})):i.region_to_fids([i.options.contig,i.options.start,"+",i.options.length],e)
},region_to_fids:function(t,i){var e=t[1],n=t[1]+t[3],o=[]
;for(var s in this.options.contig.genes){
var r=this.options.contig.genes[s],a=r.location[0][1],h=a
;"-"===r.location[0][2]?h-=r.location[0][3]:h+=r.location[0][3],
a<n&&h>e&&o.push({original_data:r,feature_id:r.id,feature_location:r.location,
isInOperon:0,feature_function:r.function})}i(o)},adjustHeight:function(){
var t=this.numTracks*(this.options.trackThickness+this.options.trackMargin)+this.options.topMargin+this.options.trackMargin
;t>this.svg.attr("height")&&this.svg.attr("height",t)},
renderFromRange:function(t){t=this.processFeatures(t);var i=this
;this.options.allowResize&&this.adjustHeight()
;var n=this.trackContainer.selectAll("path").data(t,(function(t){
return t.feature_id}))
;n.enter().append("path").classed("kbcb-feature",!0).classed("kbcb-operon",(function(t){
return i.isOperonFeature(t)})).classed("kbcb-center",(function(t){
return i.isCenterFeature(t)})).attr("id",(function(t){return t.feature_id
})).attr("fill",e.color("#19b2ff")).on("mouseover",(function(t){
return e.select(this).style("fill",e.rgb(e.select(this).style("fill")).darker()),
e.select(this).style("cursor","pointer"),
i.tooltip=i.tooltip.text(t.feature_id+": "+t.feature_function),
i.tooltip.style("visibility","visible")})).on("mouseout",(function(){
return e.select(this).style("fill",e.rgb(e.select(this).style("fill")).brighter()),
e.select(this).style("cursor","default"),i.tooltip.style("visibility","hidden")
})).on("mousemove",(function(){
return i.tooltip.style("top",e.event.pageY+15+"px").style("left",e.event.pageX-10+"px")
})).on("click",(function(t){
i.options.onClickFunction?i.options.onClickFunction(this,t):i.highlight(this,t)
})),n.exit().remove(),n.attr("d",(function(t){return i.featurePath(t)
})),i.xScale=i.xScale.domain([i.options.start,i.options.start+i.options.length]),
i.xAxis=i.xAxis.scale(i.xScale),
i.axisSvg.call(i.xAxis),i.resize(),this.loading(!0)},featurePath:function(t){
for(var i="",e=[],n=0;n<t.feature_location.length;n++){
var o=t.feature_location[n],s=this.calcXCoord(o),r=this.calcYCoord(o,t.track),a=this.calcHeight(o),h=this.calcWidth(o)
;e.push([s,s+h]),
"+"===o[2]?i+=this.featurePathRight(s,r,a,h)+" ":i+=this.featurePathLeft(s,r,a,h)+" "
}if(t.feature_location.length>1){e.sort((function(t,i){return t[0]-i[0]}))
;var c=this.calcYCoord(t.feature_location[0],t.track)+this.calcHeight(t.feature_location[0])/2
;for(n=0;n<e.length-1;n++)i+="M"+e[n][1]+" "+c+" L"+e[n+1][0]+" "+c+" Z "}
return i},featurePathRight:function(t,i,e,n){var o="M"+t+" "+i
;return n>this.options.arrowSize?o+=" L"+(t+(n-this.options.arrowSize))+" "+i+" L"+(t+n)+" "+(i+e/2)+" L"+(t+(n-this.options.arrowSize))+" "+(i+e)+" L"+t+" "+(i+e)+" Z":o+=" L"+(t+n)+" "+(i+e/2)+" L"+t+" "+(i+e)+" Z",
o},featurePathLeft:function(t,i,e,n){var o="M"+(t+n)+" "+i
;return n>this.options.arrowSize?o+=" L"+(t+this.options.arrowSize)+" "+i+" L"+t+" "+(i+e/2)+" L"+(t+this.options.arrowSize)+" "+(i+e)+" L"+(t+n)+" "+(i+e)+" Z":o+=" L"+t+" "+(i+e/2)+" L"+(t+n)+" "+(i+e)+" Z",
o},calcXCoord:function(t){var i=t[1]
;return"-"===t[2]&&(i=t[1]-t[3]+1),(i-this.options.start)/this.options.length*this.options.svgWidth
},calcYCoord:function(t,i){
return this.options.topMargin+this.options.trackMargin+this.options.trackMargin*i+this.options.trackThickness*i
},calcWidth:function(t){
return Math.floor((t[3]-1)/this.options.length*this.options.svgWidth)},
calcHeight:function(t){return this.options.trackThickness},
isCenterFeature:function(t){return t.feature_id===this.options.centerFeature},
isOperonFeature:function(t){return t.isInOperon},calcFillColor:function(t){
return t.feature_id===this.options.centerFeature?"#00F":1===t.isInOperon?"#0F0":"#F00"
},highlight:function(t,i){this.recenter(i)},recenter:function(t){
centerFeature=t.feature_id,
this.options.onClickUrl?this.options.onClickUrl(t.feature_id):this.update(!0)},
resize:function(){
var t=Math.min(this.$elem.parent().width(),this.options.svgWidth)
;this.svg.attr("width",t)},moveLeftEnd:function(){
this.options.start=0,this.update()},moveLeftStep:function(){
this.options.start=Math.max(0,this.options.start-Math.ceil(this.options.length/2)),
this.update()},zoomIn:function(){
this.options.start=Math.min(this.contigLength-Math.ceil(this.options.length/2),this.options.start+Math.ceil(this.options.length/4)),
this.options.length=Math.max(1,Math.ceil(this.options.length/2)),this.update()},
zoomOut:function(){
this.options.length=Math.min(this.contigLength,2*this.options.length),
this.options.start=Math.max(0,this.options.start-Math.ceil(this.options.length/4)),
this.options.start+this.options.length>this.contigLength&&(this.options.start=this.contigLength-this.options.length),
this.update()},moveRightStep:function(){
this.options.start=Math.min(this.options.start+Math.ceil(this.options.length/2),this.contigLength-this.options.length),
this.update()},moveRightEnd:function(){
this.options.start=this.contigLength-this.options.length,this.update()},
loading:function(t){},showMessage:function(t){var e=i("<span/>").append(t)
;this.$messagePane.append(e),
this.$messagePane.removeClass("kbwidget-hide-message")},hideMessage:function(){
this.$messagePane.addClass("kbwidget-hide-message"),this.$messagePane.empty()},
getData:function(){return{type:"Contig",id:this.options.contig,
workspace:this.options.workspaceID,title:"Contig Browser"}}}}}));