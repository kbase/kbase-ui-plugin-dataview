define(["jquery","kb_common/html","kb_service/client/workspace","d3","kbaseUI/widget/legacy/authenticatedWidget"],(function(e,t,i,n){
"use strict";e.KBWidget({name:"GenomeComparisonWidget",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",ws_name:null,ws_id:null,
options:{ws_name:null,ws_id:null},cmpImgUrl:null,timer:null,geneRows:21,
geneRowH:21,pref:null,size:500,imgI:0,imgJ:0,scale:null,stepPercent:25,geneI:-1,
dirI:1,geneJ:-1,dirJ:1,cmp:null,cmp_ref:null,
selectHitsMessage:"Move mouse over hits in map and select hit to visualize region around it",
genome1wsName:null,genome1objName:null,genome2wsName:null,genome2objName:null,
tooltip:null,init:function(e){
return this._super(e),this.cmpImgUrl=this.runtime.config("services.genome_comparison.url").replace("jsonrpc","image"),
this.ws_name=e.ws_name,this.ws_id=e.ws_id,this.pref=this.uuid(),this},
render:function(){var r=this
;r.tooltip=n.select("body").append("div").classed("genome-comparison-tooltip",!0)
;var s=this.$elem;if(s.empty(),r.authToken()){
var a=new i(this.runtime.config("services.workspace.url"),{
token:this.authToken()}),o=function(){
s.empty(),s.append(t.loading("loading comparison data...")),
a.get_object_subset([{ref:r.cmp.genome1ref,included:["scientific_name"]},{
ref:r.cmp.genome2ref,included:["scientific_name"]}],(function(t){
r.genome1wsName=t[0].info[7],r.genome1objName=t[0].info[1]
;var i=t[0].data.scientific_name
;r.genome2wsName=t[1].info[7],r.genome2objName=t[1].info[1]
;var n=t[1].data.scientific_name;s.empty()
;var a=e("<table/>").addClass("table table-bordered").css({"margin-left":"auto",
"margin-right":"auto"});s.append(a);var o=function(e,t){
return"<tr><td>"+e+"</td><td>"+t+"</td></tr>"},d=0
;for(var m in r.cmp.data1)r.cmp.data1[m].length>0&&d++;var l=0
;for(var m in r.cmp.data2)r.cmp.data2[m].length>0&&l++
;a.append(o("Comparison object",r.ws_id)),
a.append(o("Genome1 (x-axis)",'<a href="/#dataview/'+r.genome1wsName+"?sub=Feature&subid="+r.genome1objName+'" target="_blank">'+i+"</a> ("+r.cmp.proteome1names.length+" genes, "+d+" have hits)")),
a.append(o("Genome2 (y-axis)",'<a href="/#dataview/'+r.genome2wsName+"?sub=Feature&subid="+r.genome2objName+'" target="_blank">'+n+"</a> ("+r.cmp.proteome2names.length+" genes, "+l+" have hits)")),
null==r.scale&&(r.scale=100*r.size/Math.max(r.cmp.proteome1names.length,r.cmp.proteome2names.length))
;var p=' style="border: 0px; margin: 0px; padding: 0px;"',c=' style="border: 0px; margin: 0px; padding: 0px;"',g=' style="border: 0px; margin: 0px; padding: 1px;"',h=' style="width: 27px;"'
;a.append('<tr><td><center><button id="'+r.pref+'btn-zi">Zoom +</button>&nbsp;<button id="'+r.pref+'btn-zo">Zoom -</button><br><br><table'+p+"><tr"+c+"><td"+g+'><button id="'+r.pref+'btn-mul"'+h+">&#8598;</button></td><td"+g+'><button id="'+r.pref+'btn-mu"'+h+">&#8593;</button></td><td"+g+'><button id="'+r.pref+'btn-mur"'+h+">&#8599;</button></td></tr><tr"+c+"><td"+g+'><button id="'+r.pref+'btn-ml"'+h+">&#8592;</button></td><td"+g+"/><td"+g+'><button id="'+r.pref+'btn-mr"'+h+">&#8594;</button></td></tr><tr"+c+"><td"+g+'><button id="'+r.pref+'btn-mdl"'+h+">&#8601;</button></td><td"+g+'><button id="'+r.pref+'btn-md"'+h+">&#8595;</button></td><td"+g+'><button id="'+r.pref+'btn-mdr"'+h+">&#8600;</button></td></tr></table></center></td><td><table"+p+"><tr"+c+'><td width="'+(r.size+100)+'"'+g+'><div style="position:relative"><img id="'+r.pref+'img" src=""/><div id="'+r.pref+'rect" style="position:absolute; z-index: 2; border: 1px; border-style: solid; border-color: red; background-color: transparent; display:none; pointer-events:none;"/></div></td><td width="300"'+g+'><table id="'+r.pref+'genes"'+p+"><tr"+p+"><td"+p+">"+r.selectHitsMessage+"</td></tr></table></td></tr></table></td></tr>"),
r.refreshImage(),r.refreshGenes();var u=function(e){
var t=Math.min(r.size,r.cmp.proteome1names.length*r.scale/100),i=Math.min(r.size,r.cmp.proteome2names.length*r.scale/100),n=r.imgI+50*t/r.scale,s=r.imgJ+50*i/r.scale
;100*r.size/(r.scale*e)>1.1*Math.max(r.cmp.proteome1names.length,r.cmp.proteome2names.length)||(r.scale*=e,
r.imgI=n-50*r.size/r.scale,r.imgJ=s-50*r.size/r.scale,r.refreshImage())}
;e("#"+r.pref+"btn-zi").click((function(){u(1.5)
})),e("#"+r.pref+"btn-zo").click((function(){u(1/1.5)}));var f=function(e,t){
r.imgJ+=e*r.size*r.stepPercent/r.scale,
r.imgI+=t*r.size*r.stepPercent/r.scale,r.refreshImage()}
;e("#"+r.pref+"btn-mul").click((function(){f(1,-1)
})),e("#"+r.pref+"btn-mu").click((function(){f(1,0)
})),e("#"+r.pref+"btn-mur").click((function(){f(1,1)
})),e("#"+r.pref+"btn-ml").click((function(){f(0,-1)
})),e("#"+r.pref+"btn-mr").click((function(){f(0,1)
})),e("#"+r.pref+"btn-mdl").click((function(){f(-1,-1)
})),e("#"+r.pref+"btn-md").click((function(){f(-1,0)
})),e("#"+r.pref+"btn-mdr").click((function(){f(-1,1)}));var b=function(t){
var i=t.pageX,n=t.pageY
;!i&&!n&&t.clientX&&t.clientY&&(i=t.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,
n=t.clientY+document.body.scrollTop+document.documentElement.scrollTop)
;var s=e("#"+r.pref+"img").offset(),a=i-s.left-35,o=n-s.top,d=Math.min(r.size,r.cmp.proteome1names.length*r.scale/100),m=Math.min(r.size,r.cmp.proteome2names.length*r.scale/100),l=-1,p=-1,c=-1
;if(a>=0&&a<=d&&o>=0&&o<=m)for(var g in r.cmp.data1){
var h=(g-r.imgI)*r.scale/100
;if(h>=0&&h<d&&Math.abs(a-h)<=2)for(var u in r.cmp.data1[g]){
var f=r.cmp.data1[g][u][0],b=m+1-(f-r.imgJ)*r.scale/100
;if(b>=0&&b<m&&Math.abs(o-b)<=2){var x=Math.sqrt((a-h)*(a-h)+(o-b)*(o-b))
;(l<0||l>x)&&(l=x,p=g,c=f)}}}return{scrX:i,scrY:n,relX:a,relY:o,bestDist:l,
bestI:p,bestJ:c}};e("#"+r.pref+"img").hover((function(){
r.tip().style("visibility","visible")}),(function(){
r.tip().style("visibility","hidden")})).mousemove((function(e){
var t=b(e),i=r.tip();if(Number(t.bestDist)>=0){
var n="X-axis: "+r.cmp.proteome1names[Number(t.bestI)]+", Y-axis: "+r.cmp.proteome2names[Number(t.bestJ)]+"<br>click to see detailes..."
;return i.html(n),
i.style("top",e.pageY+15+"px").style("left",e.pageX-10+"px"),void i.style("visibility","visible")
}i.style("visibility","hidden"),i.text("")})).click((function(e){var t=b(e)
;Number(t.bestDist)>=0?(r.geneI=Number(t.bestI),
r.geneJ=Number(t.bestJ)):(r.geneI=-1,r.geneJ=-1),r.refreshGenes()}))
}),(function(t){
e("#"+r.pref+"job").html("Error accessing genome objects: "+t.error.message)}))}
;return function(){var t=r.cmp_ref;t||(t=r.ws_name+"/"+r.ws_id),a.get_objects([{
ref:t}],(function(e){r.cmp=e[0].data;var t=e[0].info
;r.cmp_ref=t[6]+"/"+t[0]+"/"+t[4],o()}),(function(t){
e("#"+r.pref+"job").html("Error accessing comparison object: "+t.error.message)
}))}(),this}s.append("<div>[Error] You're not logged in</div>")},tip:function(){
return this.tooltip},refreshDetailedRect:function(){
var t=e("#"+this.pref+"rect").append(t)
;if(this.geneI<0||this.geneJ<0)t.hide();else{e("#"+this.pref+"img").offset()
;var i=(this.geneI-this.imgI)*this.scale/100,n=(this.geneJ-this.imgJ)*this.scale/100
;if(i<0||i>=this.size||n<0||n>=this.size)t.hide();else{
var r=this.geneRows*this.scale/200;r<1&&(r=1)
;var s=i+35-r-1,a=Math.min(this.size,this.cmp.proteome2names.length*this.scale/100)+1-n-r-1
;t.css({top:Math.round(a)+"px",left:Math.round(s)+"px",width:1+2*r+"px",
height:1+2*r+"px"}),t.show()}}},refreshImage:function(){
var t=this.imgI+100*this.size/this.scale
;t>this.cmp.proteome1names.length&&(t=this.cmp.proteome1names.length)
;var i=this.imgJ+100*this.size/this.scale
;i>this.cmp.proteome2names.length&&(i=this.cmp.proteome2names.length),
this.imgI=t-100*this.size/this.scale,
this.imgJ=i-100*this.size/this.scale,this.imgI<0&&(this.imgI=0),
this.imgJ<0&&(this.imgJ=0),
this.imgI=Math.round(this.imgI),this.imgJ=Math.round(this.imgJ)
;var n=this.cmpImgUrl+"?ws="+this.ws_name+"&id="+this.ws_id+"&x="+this.imgI+"&y="+this.imgJ+"&w="+this.size+"&sp="+this.scale+"&token="+encodeURIComponent(this.authToken())
;e("#"+this.pref+"img").attr("src",n),this.refreshDetailedRect()},
refreshGenes:function(){var t=this,i=e("#"+t.pref+"genes");i.empty()
;var n=' style="border: 0px; margin: 0px; padding: 0px;"'
;if(t.geneI<0||t.geneJ<0)return t.refreshDetailedRect(),
void i.append("<tr"+n+"><td"+n+">"+t.selectHitsMessage+"</td></tr>")
;var r=Math.floor(t.geneRows/2),s=Math.floor(t.geneRowH/2),a="&#8595;",o="&#8595;"
;t.dirI<0&&(a="&#8593;"),t.dirJ<0&&(o="&#8593;")
;var d=' style="border: 0px; margin: 0px; padding: 0px;"',m=' style="width: 27px;"'
;i.append("<tr"+d+'><td rowspan="'+(t.geneRows+2)+'" width="10" style="border: 0px; margin: 0px; padding: 0px; text-align: center; vertical-align: middle;"><button id="'+t.pref+'btn-dirI"'+m+">"+a+'</button></td><td style="border: 0px; margin: 0px; padding: 0px; text-align: center; vertical-align: middle;"><button id="'+t.pref+'btn-i-up"'+m+'>&#8593;</button></td><td style="border: 0px; margin: 0px; padding: 0px; text-align: center; vertical-align: middle;"><button id="'+t.pref+'btn-both-up"'+m+'>&#8593;&#8593;</button></td><td style="border: 0px; margin: 0px; padding: 0px; text-align: center; vertical-align: middle;"><button id="'+t.pref+'btn-j-up"'+m+'>&#8593;</button></td><td rowspan="'+(t.geneRows+2)+'" width="10" style="border: 0px; margin: 0px; padding: 0px; text-align: center; vertical-align: middle;"><button id="'+t.pref+'btn-dirJ"'+m+">"+o+"</button></td></tr>")
;for(var l="",p=[],c=0;c<t.geneRows;c++){
var g=t.geneI+(c-r)*t.dirI,h=t.geneJ+(c-r)*t.dirJ,u="-",f="-"
;g>=0&&g<t.cmp.proteome1names.length&&(u=t.cmp.proteome1names[g]),
h>=0&&h<t.cmp.proteome2names.length&&(f=t.cmp.proteome2names[h]),
c===r&&(u='<font color="red">'+u+"</font>",f='<font color="red">'+f+"</font>")
;var b=' style="border: 0px; margin: 0px; padding: 0px; font-size: 12px; height: '+t.geneRowH+'px; text-align: center; vertical-align: middle;"',x="<td "+b+'><a href="/#dataview/'+t.genome1wsName+"/"+t.genome1objName+"?sub=Feature&subid="+t.cmp.proteome1names[g]+'" target="_blank">'+u+"</a></td>"
;0===c&&(x+='<td id="'+t.pref+'glinks" rowspan="'+t.geneRows+'" width="30"'+d+"/>"),
x+="<td "+b+'><a href="/#dataview/'+t.genome2wsName+"/"+t.genome2objName+"?sub=Feature&subid="+t.cmp.proteome2names[h]+'" target="_blank">'+f+"</a></td>",
i.append("<tr"+d+">"+x+"</tr>");var v=c*(t.geneRowH+.2)+s
;for(var y in t.cmp.data1[g]){
var w=t.cmp.data1[g][y],I=w[0],J=(I-t.geneJ)*t.dirJ+r;if(J>=0&&J<t.geneRows){
var k=J*(t.geneRowH+.2)+s,_=""
;w[2]<100&&(_=' stroke-dasharray="5, 5"'),l+='<line x1="0" y1="'+v+'" x2="30" y2="'+k+'"'+_+' style="stroke:rgb(0,0,0);stroke-width:1"/>',
p.push({x1:0,y1:v,x2:30,y2:k,gene1:t.cmp.proteome1names[g],
gene2:t.cmp.proteome2names[I],bit_score:w[1],percent_of_bbh:w[2]})}}}
i.append("<tr"+d+'><td style="border: 0px; margin: 0px; padding: 0px; text-align: center; vertical-align: middle;"><button id="'+t.pref+'btn-i-dn"'+m+'>&#8595;</button></td><td style="border: 0px; margin: 0px; padding: 0px; text-align: center; vertical-align: middle;"><button id="'+t.pref+'btn-both-dn"'+m+'>&#8595;&#8595;</button></td><td style="border: 0px; margin: 0px; padding: 0px; text-align: center; vertical-align: middle;"><button id="'+t.pref+'btn-j-dn"'+m+">&#8595;</button></td></tr>")
;var z=e("#"+t.pref+"glinks"),M=t.geneRows*t.geneRowH
;z.append('<svg width="30" height="'+M+'">'+l+"</svg>"),z.hover((function(){
t.tip().style("visibility","visible")}),(function(){
t.tip().style("visibility","hidden")})).mousemove((function(e){
var i=e.pageX,n=e.pageY
;!i&&!n&&e.clientX&&e.clientY&&(i=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,
n=e.clientY+document.body.scrollTop+document.documentElement.scrollTop)
;var r=z.offset(),s=i-r.left,a=n-r.top,o=-1,d=null;for(var m in p){
var l=p[m],c=Math.abs((l.y2-l.y1)*s-(l.x2-l.x1)*a+l.x2*l.y1-l.y2*l.x1)/Math.sqrt((l.y2-l.y1)*(l.y2-l.y1)+(l.x2-l.x1)*(l.x2-l.x1))
;(o<0||c<o)&&(o=c,d=l)}var g=t.tip();if(o&&o<=2){
var h="Gene1: "+d.gene1+"<br>Gene2: "+d.gene2+"<br>Bit-score: "+d.bit_score+"<br>Percent of related BBH bit-score: "+d.percent_of_bbh+"%"
;return g.html(h),
g.style("top",e.pageY+15+"px").style("left",e.pageX-10+"px"),void g.style("visibility","visible")
}g.style("visibility","hidden"),g.html("")
})),e("#"+t.pref+"btn-dirI").click((function(){t.dirI*=-1,t.refreshGenes()
})),e("#"+t.pref+"btn-i-up").click((function(){t.geneI-=t.dirI,t.refreshGenes()
})),e("#"+t.pref+"btn-both-up").click((function(){
t.geneI-=t.dirI,t.geneJ-=t.dirJ,t.refreshGenes()
})),e("#"+t.pref+"btn-j-up").click((function(){t.geneJ-=t.dirJ,t.refreshGenes()
})),e("#"+t.pref+"btn-dirJ").click((function(){t.dirJ*=-1,t.refreshGenes()
})),e("#"+t.pref+"btn-i-dn").click((function(){t.geneI+=t.dirI,t.refreshGenes()
})),e("#"+t.pref+"btn-both-dn").click((function(){
t.geneI+=t.dirI,t.geneJ+=t.dirJ,t.refreshGenes()
})),e("#"+t.pref+"btn-j-dn").click((function(){t.geneJ+=t.dirJ,t.refreshGenes()
})),t.refreshDetailedRect()},loggedInCallback:function(e,t){
return this.render(),this},loggedOutCallback:function(e,t){return this.render(),
this},getState:function(){
return null===this.scale&&(this.scale=100*this.size/Math.max(this.cmp.proteome1names.length,this.cmp.proteome2names.length)),
{imgI:this.imgI,imgJ:this.imgJ,scale:this.scale,geneI:this.geneI,dirI:this.dirI,
geneJ:this.geneJ,dirJ:this.dirJ,cmp_ref:this.cmp_ref}},loadState:function(e){
if(e){
this.imgI=e.imgI,this.imgJ=e.imgJ,this.scale=e.scale,this.geneI=e.geneI,this.dirI=e.dirI,
this.geneJ=e.geneJ,
this.dirJ=e.dirJ,this.cmp_ref=e.cmp_ref,this.cmp?(null===this.scale&&(this.scale=100*this.size/Math.max(this.cmp.proteome1names.length,this.cmp.proteome2names.length)),
this.refreshImage(),this.refreshGenes()):this.render()}},uuid:function(){
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){
var t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}))}})}));