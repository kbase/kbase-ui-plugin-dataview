define(["jquery","kb_service/client/workspace","kb_common/html","widgets/communities/kbStandaloneGraph","datatables_bootstrap","kbaseUI/widget/legacy/authenticatedWidget"],(function(e,t,a,n){
"use strict";e.KBWidget({name:"AbundanceDataView",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",token:null,options:{id:null,
ws:null,name:0},init:function(e){return this._super(e),this},render:function(){
var r=this,i=(this.uuidv4(),this.$elem)
;if(i.empty(),null!==r.token)return i.append(a.loading("loading data...")),
new t(this.runtime.getConfig("services.workspace.url"),{token:r.token
}).get_objects([{ref:r.options.ws+"/"+r.options.id}],(function(t){
if(i.empty(),0===t.length){
var o="[Error] Object "+r.options.id+" does not exist in workspace "+r.options.ws
;i.append("<div><p>"+o+">/p></div>")}else{
var s=t[0].data,d=[],l=s.columns.length,p=s.rows.length,u=[]
;d="sparse"===s.matrix_type?r.sparse2dense(s.data,s.shape[0],s.shape[1]):s.data
;for(var c=new Array(l),h=[],v=0;v<l;v+=1)h[v]="#678C30"
;var m=l+1,b=new Array(m);b[0]="Annotation"
;for(var g=0;g<l;g++)0===r.options.name?(b[g+1]=s.columns[g].id,c[g]={
name:s.columns[g].id,data:[],fill:h[g]}):(b[g+1]=s.columns[g].name,c[g]={
name:s.columns[g].name,data:[],fill:h[g]})
;for(var f=0,w=(u=new Array(p),0);w<p;w++){
u[w]=new Array(m),u[w][0]=s.rows[w].id;for(g=0;g<l;g++){
f=Math.max(f,d[w][g]),c[g].data.push(d[w][g]);var y=Math.round(1e3*d[w][g])/1e3
;y||(y="0"),u[w][g+1]=y}}
var k=a.genId(),A=(a.genId(),e('<a href="#outputGraph'+k+'">BoxPlots</a>').click((function(t){
t.preventDefault(),e(this).tab("show")
}))),T=e('<a href="#outputTable'+k+'">Abundance Table</a>').click((function(t){
t.preventDefault(),e(this).tab("show")
})),_=e("<ul>").addClass("nav nav-tabs").append(e("<li>").addClass("active").append(A)).append(e("<li>").append(T)),x="<div class='tab-content'><div class='tab-pane active' id='outputGraph"+k+"' style='width: 95%;'></div><div class='tab-pane' id='outputTable"+k+"' style='width: 95%;'></div></div>"
;i.append(_).append(x);var C=a.makeTable({columns:b,rows:u,
classes:["table","table-striped"]})
;document.getElementById("outputTable"+k).innerHTML=C,
e("#outputTable"+k+">table").dataTable();var I="normalized"
;f>1&&(I="raw"),n.create({target:document.getElementById("outputGraph"+k),
data:c,y_title:I+" abundance",show_legend:!1,height:400,
chartArea:[.1,.1,.95,.8],type:"deviation"}).render()}}),(function(t){i.empty()
;var a=e("<div>");a.append(e("<p>").css({padding:"10px 20px"
}).text("[Error] "+t.error.message)),i.append(a)})),r
;i.append("<div>[Error] You're not logged in</div>")},
loggedInCallback:function(e,t){return this.token=t.token,this.render(),this},
loggedOutCallback:function(e,t){return this.token=null,this.render(),this},
sparse2dense:function(e,t,a){
for(var n=new Array(t),r=0;r<t;r++)n[r]=Array.apply(null,new Array(a)).map(Number.prototype.valueOf,0)
;for(r=0;r<e.length;r++)n[e[r][0]][e[r][1]]=e[r][2];return n},
uuidv4:function(e,t){
for(t=e="";e++<36;t+=51*e&52?(15^e?8^Math.random()*(20^e?16:4):4).toString(16):"-");
return t}})}));