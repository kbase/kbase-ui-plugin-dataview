define(["jquery","d3","kb_service/client/workspace","kbaseUI/widget/legacy/authenticatedWidget","css!./kbaseSEEDFunctions"],(function(t,e,n){
"use strict";t.KBWidget({name:"KBaseSEEDFunctions",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",options:{objNameOrId:null,
wsNameOrId:null,objVer:null,width:900,genomeInfo:null},SEEDTree:{},
subsysToGeneMap:[],maxCount:0,margin:{top:30,right:20,bottom:30,left:20},
width:920,barHeight:20,barWidth:400,stepSize:8,svg:null,i:0,duration:400,
root:null,tree:null,objName:"",wsName:"",init:function(t){return this._super(t),
this.SEEDTree={name:"Functional Categories",count:0,children:[],size:0,x0:0,y0:0
},
this.subsysToGeneMap=[],this.maxCount=0,this.runtime.service("session").isLoggedIn()||this.render(),
this},loadSEEDHierarchy:function(){
var n=this,i={},r=n.SEEDTree,o=n.subsysToGeneMap,a=[]
;e.text(this.runtime.pluginResourcePath+"/data/subsys.txt",(function(s){
var l,c,u,h,d,f,p,g=e.tsv.parseRows(s),m=0;for(l=0;l<g.length;l+=1){
u=0,h="",d="Functional Categories";const t=g[l][3]
;for(void 0===o[t]||(u=o[t].length,
m+=o[t].length),c=0;c<4;c+=1)g[l][c]=""===g[l][c]?"--- "+g[l][c-1]+" ---":g[l][c],
h=d+":"+g[l][c],0===c?(void 0===i[h]&&(f={name:g[l][c],size:0,children:[]
},r.children.push(f),i[h]=f,a[g[l][c]]=0),a[g[l][c]]+=u):void 0===i[h]&&(f={
name:g[l][c],size:0,children:[]
},i[d].children.push(f),i[h]=f,3===c&&void 0!==o[g[l][c]]&&o[g[l][c]].forEach((function(t){
p={name:t,size:""},f.children.push(p)}))),i[h].size+=u,d=h}
if(0===m)n.$mainview.prepend("<b>No Functional Categories assigned, you can add them using the Narrative.</b>");else{
var y;for(y in a)n.maxCount=n.maxCount>a[y]?n.maxCount:a[y]
;t.when(n.SEEDTree.children.forEach((function(t){n.collapse(t)
}))).done(n.update(n.root=n.SEEDTree))}}))},update:function(n){
var i=this,r=i.tree.nodes(i.SEEDTree),o=e.scale.linear().domain([0,this.maxCount]).range([0,275]),a=Math.max(500,r.length*i.barHeight+i.margin.top+i.margin.bottom)
;e.selectAll(this.$mainview).select("svg").transition().duration(i.duration).attr("height",a),
e.select(i.frameElement).transition().duration(i.duration).style("height",a+"px"),
r.forEach((function(t,e){t.x=e*i.barHeight}))
;var s=i.svg.selectAll("g.KBSnode").data(r,(function(t){
return t.id||(t.id=++i.i)
})),l=s.enter().append("g").attr("class","KBSnode").attr("transform",(function(){
return"translate("+n.y0+","+n.x0+")"
})).style("opacity",1e-6).on("mouseover",(function(){
e.select(this).selectAll("text, rect").style("font-weight","bold").style("font-size","90%").style("stroke-width","3px")
})).on("mouseout",(function(){
e.select(this).selectAll("text, rect").style("font-weight","normal").style("font-size","80%").style("stroke-width","1.5px")
}))
;l.append("rect").attr("y",-i.barHeight/2).attr("x",300).attr("height",i.barHeight).attr("width",i.barWidth).style("fill",i.color).on("click",t.proxy((function(t){
i.click(t)
}),i)),l.append("text").attr("dy",3.5).attr("dx",305.5).text((function(t){
return t.name
})),l.append("rect").attr("y",-i.barHeight/2).attr("x",(function(t){
return 275-o(t.size)-t.depth*i.stepSize
})).attr("height",i.barHeight).attr("width",(function(t){return o(t.size)
})).style("fill",i.color).on("click",t.proxy((function(t){i.click(t)
}),i)),l.append("text").attr("dy",3.5).attr("x",278).text((function(t){
return"Functional Categories"===t.name?"":t.size
})),l.transition().duration(i.duration).attr("transform",(function(t){
return"translate("+t.y+","+t.x+")"
})).style("opacity",1),s.transition().duration(i.duration).attr("transform",(function(t){
return"translate("+t.y+","+t.x+")"
})).style("opacity",1).select("rect").style("fill",i.color),
s.exit().transition().duration(i.duration).attr("transform",(function(){
return"translate("+n.y+","+n.x+")"
})).style("opacity",1e-6).remove(),r.forEach((function(t){t.x0=t.x,t.y0=t.y}))},
click:function(t){
""===t.size&&window.open("/#dataview/"+this.options.wsNameOrId+"/"+this.options.objNameOrId+"?sub=Feature&subid="+t.name),
t.children?(t._children=t.children,
t.children=null):(t.children=t._children,t._children=null),this.update(t)},
color:function(t){
return"number"==typeof t.size?t.size>0?t._children?"#c6dbef":"#3399ff":"#c6dbef":"#ffffff"
},collapse:function(t){var e=this
;t.children&&(t._children=t.children,t._children.forEach((function(t){
e.collapse(t)})),t.children=null)},getData:function(){return{
title:"Functional Categories ",id:this.options.objNameOrId,
workspace:this.options.wsNameOrId}},render:function(){
this.showData(this.options.genomeInfo.data)},showData:function(n){
var i=this.margin,r=this.width,o=this.$elem,a=this.SEEDTree,s=this.subsysToGeneMap
;o.empty();var l=n.domain
;if("Eukaryota"===l)return o.prepend("<b>Functional Categories not yet available for "+l+"</b>"),
this
;this.tree=e.layout.tree().nodeSize([0,this.stepSize]),this.$mainview=t("<div>").css({
"overflow-x":"scroll"
}),o.append(this.$mainview),this.svg=e.select(this.$mainview[0]).append("svg").attr("width",r+i.left+i.right).append("g").attr("transform","translate("+i.left+","+i.top+")"),
n.features.forEach((function(t){if(!t.functions){if(!t.function)return
;t.functions=[t.function]}
t.function=t.functions.join("<br>"),t.functions.forEach(e=>{
void 0===s[e]&&(s[e]=[]),s[e].push(t.id)}),a.count+=1
})),this.loadSEEDHierarchy()},loggedInCallback:function(t,e){
return this.authToken=e,
this.wsClient=new n(this.runtime.getConfig("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()}),this.render(),this},
loggedOutCallback:function(){return this.authToken=null,this.wsClient=null,this}
})}));