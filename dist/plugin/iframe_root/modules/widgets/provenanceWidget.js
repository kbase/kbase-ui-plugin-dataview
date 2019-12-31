define(["bluebird","jquery","d3","kb_common/html","kb_common/dom","kb_service/client/workspace","d3_sankey"],(function(e,t,n,r,a,o){
"use strict";function i(i){
var d,s,l,c,u=i.runtime,p=!0,f=new o(u.getConfig("services.workspace.url"),{
token:u.service("session").getAuthToken()}),b={selected:{color:"#FF9800",
name:"Current version"},core:{color:"#FF9800",name:"All Versions of this Data"},
ref:{color:"#C62828",name:"Data Referencing this Data"},included:{
color:"#2196F3",name:"Data Referenced by this Data"},none:{color:"#FFFFFF",
name:""},copied:{color:"#4BB856",name:"Copied From"}
},h=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],g={
nodes:[],links:[]
},v=r.tag("div"),m=r.tag("br"),y=r.tag("table"),w=r.tag("tr"),_=r.tag("td"),k=r.tag("svg"),j=r.tag("rect"),x=r.tag("b")
;function D(e){if(!e)return"";var t=new Date(e),n=Math.floor((new Date-t)/1e3)
;if(isNaN(n)){
var r=e.split("+"),a=r[0]+"+"+r[0].substr(0,2)+":"+r[1].substr(2,2)
;if(t=new Date(a),
n=Math.floor((new Date-t)/1e3),isNaN(n))return t=new Date(r[0]),
h[t.getMonth()]+" "+t.getDate()+", "+t.getFullYear()}
return h[t.getMonth()]+" "+t.getDate()+", "+t.getFullYear()}function N(e){
if(e.isFake){
var t='<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>'
;t+='<h4>Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">',
t+="<tr><td><b>Name</b></td><td>"+e.info[1]+"</td></tr>",
t+="</td></tr></table></td><td>",
t+='<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">',
t+="<tr><td><b>N/A</b></td></tr>",
t+="</table>",t+="</td></tr></table>",l.find("#objdetailsdiv").html(t)
}else f.get_object_provenance([{ref:e.objId}]).then((function(t){
var n=e.info,r=!1,a='<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>'
;a+='<h4>Data Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">',
a+="<tr><td><b>Name</b></td><td>"+n[1]+' (<a href="/#dataview/'+n[6]+"/"+n[1]+"/"+n[4]+'" target="_blank">'+n[6]+"/"+n[0]+"/"+n[4]+"</a>)</td></tr>",
a+='<tr><td><b>Type</b></td><td><a href="/#spec/type/'+n[2]+'" target="_parent">'+n[2]+"</a></td></tr>",
a+="<tr><td><b>Saved on</b></td><td>"+D(n[3])+"</td></tr>",
a+='<tr><td><b>Saved by</b></td><td><a href="/#people/'+n[5]+'" target="_blank">'+n[5]+"</td></tr>"
;var o='<tr><td><b>Meta data</b></td><td><div style="width:250px;word-wrap: break-word;">'
;for(var i in n[10])r=!0,o+="<b>"+i+"</b> : "+n[10][i]+"<br>"
;if(r&&(a+=o+"</div></td></tr>"),
a+="</div></td></tr></table></td><td>",a+='<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">',
t.length>0)if(t[0].copied&&(a+=F("Copied from",'<a href="#dataview/'+t[0].copied+'" target="_blank">'+t[0].copied+"</a>")),
t[0].provenance.length>0)for(var d="",s=0;s<t[0].provenance.length;s++)t[0].provenance.length>1&&(d="Action "+s+": "),
a+=T(t[0].provenance[s],d);else a+='<tr><td></td><td><b><span style="color:red">No provenance data set.</span></b></td></tr>';else a+='<tr><td></td><td><b><span style="color:red">No provenance data set.</span></b></td></tr>'
;a+="</table>",a+="</td></tr></table>",l.find("#objdetailsdiv").html(a)
})).catch((function(t){
var n=e.info,r='<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>'
;r+='<h4>Data Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">',
r+="<tr><td><b>Name</b></td><td>"+n[1]+'(<a href="/#dataview/'+n[6]+"/"+n[1]+"/"+n[4]+'" target="_blank">'+n[6]+"/"+n[0]+"/"+n[4]+"</a>)</td></tr>",
r+='<tr><td><b>Type</b></td><td><a href="/#spec/type/'+n[2]+'" target="_parent">'+n[2]+"</a></td></tr>",
r+="<tr><td><b>Saved on</b></td><td>"+D(n[3])+"</td></tr>",
r+='<tr><td><b>Saved by</b></td><td><a href="/#people/'+n[5]+'" target="_blank">'+n[5]+"</td></tr>"
;var a=!1,o='<tr><td><b>Meta data</b></td><td><div style="width:250px;word-wrap: break-word;">'
;for(var i in n[10])a=!0,o+="<b>"+i+"</b> : "+n[10][i]+"<br>"
;a&&(r+=o+"</div></td></tr>"),
r+="</div></td></tr></table></td><td>",r+='<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">',
r+="error in fetching provenance",
r+="</table>",r+="</td></tr></table>",console.error("Error fetching provenance"),
console.error(t),l.find("#objdetailsdiv").html(r)}))}function T(e,t){var n=[]
;return"description"in e&&n.push(F(t+"Description",e.description)),
"service"in e&&n.push(F(t+"Service Name",e.service)),
"service_ver"in e&&n.push(F(t+"Service Version",e.service_ver)),
"method"in e&&n.push(F(t+"Method",e.method)),
"method_params"in e&&n.push(F(t+"Method Parameters",JSON.stringify(function(e){
if(e&&e.constructor===Array)for(var t=0;t<e.length;t++)e[t]&&"object"==typeof e[t]&&e[t].hasOwnProperty("auth")&&delete e[t].auth
;return e
}(e.method_params),null,"  "))),"script"in e&&n.push(F(t+"Command Name",e.script)),
"script_ver"in e&&n.push(F(t+"Script Version",e.script_ver)),
"script_command_line"in e&&n.push(F(t+"Command Line Input",e.script_command_line)),
"intermediate_incoming"in e&&e.intermediate_incoming.length>0&&n.push(F(t+"Action Input",JSON.stringify(e.intermediate_incoming,null,"  "))),
"intermediate_outgoing"in e&&e.intermediate_outgoing.length>0&&n.push(F(t+"Action Output",JSON.stringify(e.intermediate_outgoing,null,"  "))),
"external_data"in e&&e.external_data.length>0&&n.push(F(t+"External Data",function(e){
var t="";return e.forEach((function(e){
"resource_name"in e&&(t+="<b>Resource Name</b><br/>",
"resource_url"in e&&(t+='<a target="_blank" href='+e.resource_url,
t+=">"),t+=e.resource_name,
"resource_url"in e&&(t+="</a>"),t+="<br/>"),"resource_version"in e&&(t+="<b>Resource Version</b><br/>",
t+=e.resource_version+"<br/>"),
"resource_release_date"in e&&(t+="<b>Resource Release Date</b><br/>",
t+=D(e.resource_release_date)+"<br/>"),"data_id"in e&&(t+="<b>Data ID</b><br/>",
"data_url"in e&&(t+='<a target="_blank" href='+e.data_url,
t+=">"),t+=e.data_id,"data_url"in e&&(t+="</a>"),
t+="<br/>"),"description"in e&&(t+="<b>Description</b><br/>",
t+=e.description+"<br/>")})),t
}(e.external_data))),"time"in e&&n.push(F(t+"Timestamp",D(e.time))),n.join("")}
function F(e,t){return w([_({style:{maxWidth:"250px"}},[x(e)]),_({style:{
maxWidth:"300px"}},[v({style:{maxWidth:"300px",maxHeight:"250px",
overflowY:"auto",whiteSpace:"pre",wordWrap:"break-word"}},[t])])])}
function I(e){return e[1]+" (v"+e[4]+")"}function M(e){
return f.list_referencing_objects(e).then((function(t){
for(var n=0;n<t.length;n++)for(var r=0;r<t[n].length;r++){if(r>=50){
var a=g.nodes.length,o=t[n].length-50+" more ...";g.nodes.push({node:a,name:o,
info:[-1,o,"Multiple Types",0,0,"N/A",0,"N/A",0,0,{}],nodeType:"ref",objId:"-1",
isFake:!0}),c[d]=a,null!==c[e[n].ref]&&g.links.push({source:c[e[n].ref],
target:a,value:1});break}var i=t[n][r],d=i[6]+"/"+i[0]+"/"+i[4]
;a=g.nodes.length,g.nodes.push({node:a,name:I(i),info:i,nodeType:"ref",objId:d
}),c[d]=a,null!==c[e[n].ref]&&g.links.push(A(c[e[n].ref],a,1))}}))}
function A(e,t,n){return{source:e,target:t,value:n}}function E(e){
return f.get_object_provenance(e).then((function(e){var t={},n=[],r=[]
;return e.forEach((function(e){var a=function(e){
return[e[6],e[0],e[4]].join("/")}(e.info);(e.refs.forEach((function(e){
e in t||(t[e]="included",n.push({ref:e})),r.push(A(e,a,1))
})),e.provenance.forEach((function(e){
e.resolved_ws_objects&&e.resolved_ws_objects.forEach((function(e){
e in t||(t[e]="included",n.push({ref:e})),r.push(A(e,a,1))}))
})),e.copied)&&(e.copied.split("/")[0]+"/"+e.copied.split("/")[1]!==function(e){
return[e[6],e[0]].join("/")
}(e.info)&&(e.copied in t||(t[e.copied]="copied",n.push({ref:e.copied
})),r.push(A(e.copied,a,1))))})),{uniqueRefs:t,uniqueRefObjectIdentities:n,
links:r}}))}function O(e){return null==e}function R(r){
l.find("#loading-mssg").show(),l.find("#objgraphview").hide(),g={nodes:[],
links:[]},f.get_object_history(r).then((function(e){return function(e){
var t=[],n=0,r="";return c={},g={nodes:[],links:[]},e.forEach((function(e){
var a=e[6]+"/"+e[0]+"/"+e[4],o=g.nodes.length;g.nodes.push({node:o,name:I(e),
info:e,nodeType:"core",objId:a}),e[4]>n&&(n=e[4],r=a),c[a]=o,t.push({ref:a})})),
r.length>0&&(g.nodes[c[r].nodeType]="selected"),t}(e)})).then((function(t){
return e.all([M(t),E(t)])})).spread((function(e,t){
if(t&&"uniqueRefObjectIdentities"in t&&t.uniqueRefObjectIdentities.length>0)return function(e){
return f.get_object_info_new({objects:e.uniqueRefObjectIdentities,
includeMetadata:1,ignoreErrors:1}).then((function(t){
for(var n={},r=0;r<t.length;r++)t[r]&&(n[t[r][6]+"/"+t[r][0]+"/"+t[r][4]]=t[r])
;var a=e.uniqueRefs;for(var o in a){var i=n[o];if(i){
var d=i[6]+"/"+i[0]+"/"+i[4],s=g.nodes.length;g.nodes.push({node:s,name:I(i),
info:i,nodeType:a[o],objId:d}),c[d]=s
}else console.warn("In provenance widget reference "+o+" is not accessible")}
e.links.forEach((function(e){
O(c[e.source])||O(c[e.target])?console.warn("skipping link",e):g.links.push(A(c[e.source],c[e.target],e.value))
}))})).catch((function(){var t=e.uniqueRefs;for(var n in t){
var r=g.nodes.length,a=n.split("/");g.nodes.push({node:r,name:n,
info:[a[1],"Data not found, object may be deleted","Unknown","",a[2],"Unknown",a[0],a[0],"Unknown","Unknown",{}],
nodeType:t[n],objId:n}),c[n]=r}
for(var o=e.links,i=0;i<o.length;i++)g.links.push(A(c[o[i].source],c[o[i].target],o[i].value))
}))}(t)})).finally((function(){(function(){var e,t;g.nodes.forEach((function(n){
"copied"!==n.nodeType&&(e=n.info[4]+1,
t=n.info[6]+"/"+n.info[0]+"/"+e,c[t]&&g.links.push(A(c[n.objId],c[t],1)))}))
})(),function(){
var e,r,a,o,d,s=10,p=10,f=10,h=10,v=i.width-50-h-p,m=38*g.nodes.length-s-f
;0===g.links.length&&(g.nodes.push({node:1,name:"No references found",
info:[-1,"No references found","No Type",0,0,"N/A",0,"N/A",0,0,{}],
nodeType:"none",objId:"-1",isFake:!0
}),c[-1]=1,g.links.push(A(0,1,1))),m<450&&l.find("#objgraphview").height(m+40),
n.select(l.find("#objgraphview")[0]).html(""),
l.find("#objgraphview").show(),(e=n.select(l.find("#objgraphview")[0]).append("svg")).attr("width",v+h+p).attr("height",m+s+f).append("g").attr("transform","translate("+h+","+s+")"),
r=n.sankey().nodeWidth(25).nodePadding(40).size([v,m]),
a=r.link(),r.nodes(g.nodes).links(g.links).layout(40),
(o=e.append("g").selectAll(".link").data(g.links).enter().append("path").attr("class","sankeylink").attr("d",a).style("stroke-width",(function(){
return 10})).sort((function(e,t){return t.dy-e.dy
}))).append("title").text((function(e){
return"copied"===e.source.nodeType?e.text=e.target.name+" copied from "+e.source.name:"core"===e.source.nodeType?e.text=e.target.name+" is a newer version of "+e.source.name:"ref"===e.source.nodeType?e.text=e.source.name+" references "+e.target.name:"included"===e.source.nodeType&&(e.text=e.target.name+" references "+e.source.name),
e.text})),t(o).tooltip({delay:{show:0,hide:100}
}),(d=e.append("g").selectAll(".node").data(g.nodes).enter().append("g").attr("class","sankeynode").attr("transform",(function(e){
return"translate("+e.x+","+e.y+")"
})).call(n.behavior.drag().origin((function(e){return e
})).on("dragstart",(function(){this.parentNode.appendChild(this)
})).on("drag",(function(e){
e.x=Math.max(0,Math.min(v-e.dx,n.event.x)),e.y=Math.max(0,Math.min(m-e.dy,n.event.y)),
n.select(this).attr("transform","translate("+e.x+","+e.y+")"),
r.relayout(),o.attr("d",a)}))).on("dblclick",(function(e){
n.event.defaultPrevented||(e.isFake?alert("Cannot expand this node."):u.navigate("provenance/"+encodeURI(e.info[6]+"/"+e.info[0]+"/"+e.info[4])))
})).on("mouseover",N)).append("rect").attr("y",(function(){return-5
})).attr("height",(function(e){return Math.abs(e.dy)+10
})).attr("width",r.nodeWidth()).style("fill",(function(e){
return e.color=b[e.nodeType].color})).style("stroke",(function(e){
return 0*n.rgb(e.color).darker(2)})).append("title").html((function(e){
var t=e.info,n=t[1]+" ("+t[6]+"/"+t[0]+"/"+t[4]+")\n--------------\n  type:  "+t[2]+"\n  saved on:  "+D(t[3])+"\n  saved by:  "+t[5]+"\n",r=!1
;for(var a in t[10])n+="     "+a+" : "+t[10][a]+"\n",r=!0
;return r&&(n+="  metadata:\n"),n})),d.append("text").attr("y",(function(e){
return e.dy/2
})).attr("dy",".35em").attr("text-anchor","end").attr("transform",null).text((function(e){
return e.name})).filter((function(e){return e.x<v/2
})).attr("x",6+r.nodeWidth()).attr("text-anchor","start")}(),function(){if(p){
p=!1;var e=y({cellpadding:"0",cellspacing:"0",border:"0",width:"100%",style:{
border:"1px silver solid; padding: 4px;"}},[w([_({valign:"top"},[y({
cellpadding:"2",cellspacing:"0",border:"0",id:"graphkey",style:""
},Object.keys(b).map((function(e){
if("selected"!==e&&""!==b[e].name)return w([_([k({width:"40",height:"20"},[j({
x:"0",y:"0",width:"40",height:"20",fill:b[e].color})])]),_({valign:"middle"
},[b[e].name])])})).filter((function(e){return void 0!==e})))]),_([v({
id:"objdetailsdiv"})])])]);t("#nodeColorKey").html(e)}
}(),l.find("#loading-mssg").hide()})).catch((function(e){!function(e){var t
;l.find("#loading-mssg").hide(),
l.append("<br><b>Error in building object graph!</b><br>"),
l.append("<i>Error was:</i></b> &nbsp "),
t=e.message?e.message:e.error&&e.error.message?e.error.message:"unknown error (check console)",
l.append(t+"<br>"),
console.error("Error in building object graph!"),console.error(e)}(e)}))}
return i.width=1200,i.height=700,{attach:function(e){
d=e,s=a.createElement("div"),
l=t(s),s.innerHTML=v([v(["This is a visualization of the relationships between this piece of data and other data in KBase.  Mouse over objects to show additional information (shown below the graph). Double click on an object to select and recenter the graph on that object in a new window.",m(),m()]),v({
id:"objgraphview",style:{overflow:"auto",height:"450px",resize:"vertical"}}),v({
id:"nodeColorKey"})]),d.appendChild(s)},start:function(e){
p=!0,R(function(e,t,n){return n?{ref:e+"/"+t+"/"+n}:{ref:e+"/"+t}
}(e.workspaceId,e.objectId))},stop:function(){},detach:function(){
d.removeChild(s)}}}return{make:function(e){return i(e)}}}));