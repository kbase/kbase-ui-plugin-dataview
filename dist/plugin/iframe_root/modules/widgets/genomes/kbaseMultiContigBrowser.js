define(["jquery","d3","kb_common/html","kbaseUI/widget/legacy/widget","widgets/genomes/kbaseContigBrowserButtons"],(function(t,e,i){
"use strict";t.KBWidget({name:"KBaseMultiContigBrowser",parent:"kbaseWidget",
version:"1.0.0",options:{genomeID:null,workspaceID:null,contig:null,
centerFeature:null,onClickUrl:null,allowResize:!1,svgWidth:500,svgHeight:70,
trackMargin:5,trackThickness:20,leftMargin:5,topMargin:20,arrowSize:15,start:1,
length:16750,embedInCard:!1,showButtons:!0,cardContainer:null,
onClickFunction:null,width:525,kbCache:null,genomeInfo:null},seedOntology:[],
seedTermsUniq:[],seedColors:[],tooltip:null,operonFeatures:[],$messagePane:null,
noContigs:"No Contigs",genome:null,$selectPanel:null,$contigViewPanel:null,
$featureInfoPanel:null,init:function(e){this._super(e);var n=this
;this.options.contig,
this.$messagePane=t("<div/>"),this.$elem.append(this.$messagePane),
this.showMessage(i.loading("loading contig details"))
;var o=t('<div class="row"/>')
;this.$contigSelect=t("<select>").addClass("form-control").css({width:"60%",
"margin-right":"5px"
}).append(t("<option>").attr("value",this.noContigs).append(this.noContigs)),
this.$contigSelect.change((function(){var e=t(this).val()
;e!==n.noContigs&&(n.contig=e,n.options.contig=e,n.render())
})),this.$selectPanel=t('<div class="col-md-3"/>'),
this.$selectPanel.append(t("<div>").addClass("form-inline").append(this.$contigSelect).append(this.$contigButton)),
o.append(this.$selectPanel);var s=t('<div class="col-md-6"/>')
;return this.$contigViewPanel=t('<div id="contigmainview" align="center"/>').css({
overflow:"auto"
}),s.append(this.$contigViewPanel).append("<div>").KBaseContigBrowserButtons({
browser:n
}),o.append(s),this.$featureInfoPanel=t('<div class="col-md-3"/>').html("<b>Click on a feature to view details</b>"),
o.append(this.$featureInfoPanel),
n.showData(n.options.genomeInfo.data,o),this.options.onClickFunction||(this.options.onClickFunction=function(e,i){
n.$featureInfoPanel.empty()
;var o=t("<table>").addClass("table table-striped table-bordered")
;i.id&&o.append(n.addInfoRow("Feature ID",'<a href="/#dataview/'+n.options.workspaceID+"/"+n.options.genomeID+"?sub=Feature&subid="+i.id+'" target="_blank">'+i.id+"</a>")),
i.type&&o.append(n.addInfoRow("Type",i.type)),
i.function&&o.append(n.addInfoRow("Function",i.function)),
n.$featureInfoPanel.append(o)}),this},showData:function(t,e){this.genome=t
;var i={}
;if(t.contig_ids&&t.contig_ids.length>0)for(var n=0;n<t.contig_ids.length;n++){
var o="Unknown"
;t.contig_lengths&&t.contig_lengths[n]&&(o=t.contig_lengths[n]),i[t.contig_ids[n]]=o
}else if(t.features&&t.features.length>0)for(n=0;n<t.features.length;n++){
var s=t.features[n]
;s.location&&s.location[0][0]&&(i[s.location[0][0]]="Unknown")}
this.populateContigSelector(i),
this.$elem.append(e),this.hideMessage(),t.contig_ids.length>0&&(this.contig=t.contig_ids[0],
this.options.contig=t.contig_ids[0],this.render())},addInfoRow:function(t,e){
return"<tr><th>"+t+"</th><td>"+e+"</td></tr>"},render:function(){
this.loading(!1)
;return this.$contigViewPanel.empty(),this.tooltip=e.select("body").append("div").classed("kbcb-tooltip",!0),
this.svg=e.select(this.$contigViewPanel[0]).append("svg").attr("width",this.options.svgWidth).attr("height",this.options.svgHeight).classed("kbcb-widget",!0),
this.trackContainer=this.svg.append("g"),
this.xScale=e.scale.linear().domain([this.options.start,this.options.start+this.options.length]).range([0,this.options.svgWidth]),
this.xAxis=e.svg.axis().scale(this.xScale).orient("top").tickFormat(e.format(",.0f")),
this.axisSvg=this.svg.append("g").attr("class","kbcb-axis").attr("transform","translate(0, "+this.options.topMargin+")").call(this.xAxis),
this.loadSeedOntology(this.wait_for_seed_load),this},
wait_for_seed_load:function(){this.assignSeedColors(this.seedTermsUniq)
;return this.setWorkspaceContig(this.options.workspaceID,this.options.genomeID,this.options.contig),
null!==this.options.centerFeature&&this.setCenterFeature(this.options.centerFeature),
!0},populateContigSelector:function(e){
for(var i in this.$contigSelect.empty(),e&&0!==e.length||this.$contigSelect.append(t("<option>").attr("value",this.noContigs).append(this.noContigs)),
e)this.$contigSelect.append(t("<option>").attr("value",i).append(i+" - "+e[i]+" bp"))
},track:function(){var t={regions:[]}
;return t.min=Number.POSITIVE_INFINITY,t.max=Number.NEGATIVE_INFINIITY,
t.numRegions=0,t.addRegion=function(t){for(var e=0;e<t.length;e++){
var i=Number(t[e][1]),n=Number(t[e][3]),o="+"===t[e][2]?i+n-1:i-n+1;if(i>o){
var s=o;o=i,i=s}
this.regions.push([i,o]),i<this.min&&(this.min=i),o>this.max&&(this.max=o),
this.numRegions++}},t.hasOverlap=function(t){for(var e=0;e<t.length;e++){
var i=Number(t[e][1]),n=Number(t[e][3]),o="+"===t[e][2]?i+n-1:i-n+1;if(i>o){
var s=o;o=i,i=s}for(var a=0;a<this.regions.length;a++){var r=this.regions[a]
;if(!(i<=r[0]&&o<=r[0]||i>=r[1]&&o>=r[1]))return!0}}return!1},t},
calcFeatureRange:function(t){for(var e,i=function(t){
var e=Number(t[1]),i=Number(t[1])+Number(t[3])-1
;return"-"===t[2]&&(i=e,e-=Number(t[3])+1),[e,i]
},n=i(t[0]),o=1;o<t.length;o++)(e=i(t[o]))[0]<n[0]&&(n[0]=e[0]),
e[1]>n[1]&&(n[1]=e[1]);return n},setWorkspaceContig:function(t,e,i){
i&&this.options.contig!==i&&(this.options.centerFeature=null,
this.operonFeatures=[],this.options.contig=i);var n=this.genome
;this.contigLength=-1,
n.contig_lengths instanceof Array?this.contigLength=n.contig_lengths[n.contig_ids.indexOf(i)]:this.contigLength=n.contig_lengths[i],
this.wsFeatureSet={};for(var o=0;o<n.features.length;o++){var s=n.features[o]
;if(s.location&&(0!==s.location.length&&s.location[0][0]===i)){
var a=this.calcFeatureRange(s.location);s.feature_id=s.id,s.feature_type=s.type,
s.feature_location=s.location,
s.range=a,s.feature_function=s.function,s.subsystem_data=s.subsystem_data,
this.wsFeatureSet[s.id]=s,a[1]>this.contigLength&&(this.contigLength=a[1])}}
this.options.start=0,
this.options.length>this.contigLength&&(this.options.length=this.contigLength),
this.options.centerFeature?this.setCenterFeature():this.update()},
setRange:function(t,e){this.options.start=t,this.options.length=e,this.update()
},processFeatures:function(t){var e=[];e[0]=this.track();var i,n=[]
;for(i in t)n.push(t[i]);(t=n).sort((function(t,e){
return t.feature_location[0][1]-e.feature_location[0][1]}))
;for(var o=0;o<t.length;o++){
for(var s=t[o],a=0;a<e.length;a++)if(!e[a].hasOverlap(s.feature_location)){
e[a].addRegion(s.feature_location),s.track=a;break}if(void 0===s.track){
var r=e.length;e[r]=this.track(),e[r].addRegion(s.feature_location),s.track=r}}
return this.numTracks=e.length,t},update:function(t){
if(this.options.workspaceID&&this.options.genomeID){
var e=[this.options.start,this.options.start+this.options.length-1]
;if(this.options.centerFeature&&t){
var i=this.wsFeatureSet[this.options.centerFeature]
;i&&(this.options.start=Math.max(0,Math.floor(parseInt(i.location[0][1])+parseInt(i.location[0][3])/2-this.options.length/2)),
e=[this.options.start,this.options.start+this.options.length-1])}var n={}
;for(var o in this.wsFeatureSet)this.rangeOverlap(e,this.wsFeatureSet[o].range)&&(n[o]=this.wsFeatureSet[o])
;this.renderFromRange(n)}},rangeOverlap:function(t,e){
return t[0]<e[0]&&t[1]>e[0]||e[0]<t[0]&&e[1]>t[0]},adjustHeight:function(){
var t=this.numTracks*(this.options.trackThickness+this.options.trackMargin)+this.options.topMargin+this.options.trackMargin
;t>this.svg.attr("height")&&this.svg.attr("height",t)},
renderFromRange:function(t){t=this.processFeatures(t);var i=this
;this.options.allowResize&&this.adjustHeight()
;var n=this.trackContainer.selectAll("path").data(t,(function(t){
return t.feature_id}))
;n.enter().append("path").classed("kbcb-feature",!0).classed("kbcb-operon",(function(t){
return i.isOperonFeature(t)})).classed("kbcb-center",(function(t){
return i.isCenterFeature(t)})).style("fill",(function(t){
return i.calcFillColorByProtAnnot(t,0)})).attr("id",(function(t){
return t.feature_id})).on("mouseover",(function(t){
return e.select(this).style("fill",e.rgb(e.select(this).style("fill")).darker()),
i.tooltip=i.tooltip.text(t.feature_id+": "+t.feature_function),
i.tooltip.style("visibility","visible")})).on("mouseout",(function(){
return e.select(this).style("fill",e.rgb(e.select(this).style("fill")).brighter()),
i.tooltip.style("visibility","hidden")})).on("mousemove",(function(){
return i.tooltip.style("top",e.event.pageY+15+"px").style("left",e.event.pageX-10+"px")
})).on("click",(function(t){
i.options.onClickFunction?i.options.onClickFunction(this,t):i.highlight(this,t)
})),n.exit().remove(),n.attr("d",(function(t){return i.featurePath(t)
})),i.xScale=i.xScale.domain([i.options.start,i.options.start+i.options.length]),
i.xAxis=i.xAxis.scale(i.xScale),
i.axisSvg.call(i.xAxis),i.resize(),this.loading(!0)},featurePath:function(t){
for(var e="",i=[],n=0;n<t.feature_location.length;n++){
var o=t.feature_location[n],s=this.calcXCoord(o),a=this.calcYCoord(o,t.track),r=this.calcHeight(o),h=this.calcWidth(o)
;i.push([s,s+h]),
"+"===o[2]?e+=this.featurePathRight(s,a,r,h)+" ":e+=this.featurePathLeft(s,a,r,h)+" "
}if(t.feature_location.length>1){i.sort((function(t,e){return t[0]-e[0]}))
;var l=this.calcYCoord(t.feature_location[0],t.track)+this.calcHeight(t.feature_location[0])/2
;for(n=0;n<i.length-1;n++)e+="M"+i[n][1]+" "+l+" L"+i[n+1][0]+" "+l+" Z "}
return e},featurePathRight:function(t,e,i,n){var o="M"+t+" "+e
;return n>this.options.arrowSize?o+=" L"+(t+(n-this.options.arrowSize))+" "+e+" L"+(t+n)+" "+(e+i/2)+" L"+(t+(n-this.options.arrowSize))+" "+(e+i)+" L"+t+" "+(e+i)+" Z":o+=" L"+(t+n)+" "+(e+i/2)+" L"+t+" "+(e+i)+" Z",
o},featurePathLeft:function(t,e,i,n){var o="M"+(t+n)+" "+e
;return n>this.options.arrowSize?o+=" L"+(t+this.options.arrowSize)+" "+e+" L"+t+" "+(e+i/2)+" L"+(t+this.options.arrowSize)+" "+(e+i)+" L"+(t+n)+" "+(e+i)+" Z":o+=" L"+t+" "+(e+i/2)+" L"+(t+n)+" "+(e+i)+" Z",
o},calcXCoord:function(t){var e=t[1]
;return"-"===t[2]&&(e=t[1]-t[3]+1),(e-this.options.start)/this.options.length*this.options.svgWidth
},calcYCoord:function(t,e){
return this.options.topMargin+this.options.trackMargin+this.options.trackMargin*e+this.options.trackThickness*e
},calcWidth:function(t){
return Math.floor((t[3]-1)/this.options.length*this.options.svgWidth)},
calcHeight:function(t){return this.options.trackThickness},
isCenterFeature:function(t){return t.feature_id===this.options.centerFeature},
isOperonFeature:function(t){return t.isInOperon},calcFillColor:function(t){
return t.feature_id===this.options.centerFeature?"#00F":1===t.isInOperon?"#0F0":"#F00"
},calcFillColorByProtAnnot:function(t,e){
return"CDS"!==t.feature_type?"#000":(this.options.annot_namespace="SEED",
this.options.annot_level=3,
this.colorByAnnot(t,this.options.annot_namespace,this.options.annot_level,e))},
colorByAnnot:function(t,e,i,n){if("SEED"===e){
if(!t.feature_function)return"#CCC"
;var o=t.feature_function.replace(/\s+\/.+/,"").replace(/\s+\#.*/,"")
;return this.seedColorLookup(o,i)}return"#CCC"},seedColorLookup:function(t,e){
if(0,void 0===this.seedOntology[t])return"#CCC";var i=this.seedOntology[t][e][0]
;return this.seedColors[e][i]},loadSeedOntology:function(t){
for(var i=this.seedOntology,n=this.seedTermsUniq,o=this,s=[],a=0;a<4;a++)s[a]=[],
n[a]=[]
;return e.text(this.runtime.pluginResourcePath+"/data/subsys.txt",(function(t){
for(var r=e.tsv.parseRows(t),h="",l=0;l<r.length;l++)if(""!==r[l][3])for(h=r[l][3],
void 0===i[h]&&(i[h]=[]),
void 0===s[3][h]&&(s[3][h]=!0,n[3].push(h)),a=0;a<4;a++)void 0===i[h][a]&&(i[h][a]=[]),
r[l][a]=""===r[l][a]?"--- "+r[l][a-1]+" ---":r[l][a],
i[h][a].push(r[l][a]),void 0===s[a][r[l][a]]&&(s[a][r[l][a]]=!0,
n[a].push(r[l][a]));o.wait_for_seed_load()})),!0},assignSeedColors:function(t){
for(var e=this.seedColors,i=["#F00","#900","#C30","#F60","#F90","#FC0","#CF3","#9FC","#9F9","#0C0","#393","#060","#0F9","#0CF","#F39","#39F","#69F","#36C","#00F","#33C","#00C","#FC9","#96F","#C9F","#60C","#C0C","#F99","#F66","#909"],n=i.length,o=0;o<4;o++){
void 0===e[o]&&(e[o]=[]);for(var s=0;s<t[o].length;s++)e[o][t[o][s]]=i[s%n]}
return!0},highlight:function(t,e){this.recenter(e)},recenter:function(t){
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
loading:function(t){t?this.hideMessage():this.showMessage(i.loading())},
showMessage:function(e){var i=t("<span/>").append(e)
;this.$messagePane.empty().append(i).show()},hideMessage:function(){
this.$messagePane.hide()},getData:function(){return{type:"Contig",
id:this.options.contig,workspace:this.options.workspaceID,title:"Contig Browser"
}},renderError:function(e){var i="Sorry, an unknown error occurred"
;"string"==typeof e?i=e:e.error&&e.error.message&&(i=e.error.message)
;var n=t("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>"+i)
;this.$elem.empty(),this.$elem.append(n)},buildObjectIdentity:function(t,e){
var i={}
;return/^\d+$/.exec(t)?i.wsid=t:i.workspace=t,/^\d+$/.exec(e)?i.objid=e:i.name=e,
i}})}));