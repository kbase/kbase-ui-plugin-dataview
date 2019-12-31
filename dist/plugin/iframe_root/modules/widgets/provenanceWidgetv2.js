define(["bluebird","jquery","d3","kb_common/html","kb_common/dom","kb_service/client/workspace","kb_common/jsonRpc/genericClient","dagre","bootstrap","d3_sankey"],(function(e,t,r,n,a,o,i,s){
"use strict";function d(d){
var c,l,u,f=d.runtime,p=!0,h=new o(f.getConfig("services.workspace.url"),{
token:f.service("session").getAuthToken()}),b=new i({
url:f.config("services.workspace.url"),
token:f.service("session").getAuthToken(),module:"Workspace"}),g={startingNode:{
color:"#ffeaad",borderColor:"#dbbc60",name:"Current object",width:20,stroke:0},
functionNode:{color:"#bbb6c1",borderColor:"grey",name:"Functions",width:20,
stroke:0},noRefs:{color:"#b5d6ff",
name:"All References and Dependencies Displayed",width:20,stroke:0},node:{
color:"#87abff",borderColor:"#6079b2",name:"Objects",width:20,stroke:0},
dependencies:{color:"grey",name:"Dependencies Refereneces",width:4,stroke:5},
refs:{color:"grey",name:"Provenance References",width:4,stroke:0}
},v=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],m={},k={
nodes:[],links:[]},w={},y={},_={},j={"DataPalette.DataPalette":!0
},x=n.tag("div"),N=n.tag("br"),D=n.tag("tr"),F=n.tag("td"),A=n.tag("b"),O=1200,M=700,C=110,I=40,S=new s.graphlib.Graph
;function T(e){if(!e)return"";var t=new Date(e),r=Math.floor((new Date-t)/1e3)
;if(isNaN(r)){
var n=e.split("+"),a=n[0]+"+"+n[0].substr(0,2)+":"+n[1].substr(2,2)
;if(t=new Date(a),
r=Math.floor((new Date-t)/1e3),isNaN(r))return t=new Date(n[0]),
v[t.getMonth()]+" "+t.getDate()+", "+t.getFullYear()}
return v[t.getMonth()]+" "+t.getDate()+", "+t.getFullYear()}function E(e){
if(!e.isFunction)if(e.isFake){
var t='<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>'
;t+='<h4>Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">',
t+="<tr><td><b>Name</b></td><td>"+(n=e.info)[1]+"</td></tr>",
t+="</td></tr></table></td><td>",
t+='<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">',
t+="<tr><td><b>N/A</b></td></tr>",
t+="</table>",t+="</td></tr></table>",u.find("#objdetailsdiv").html(t)}else try{
var r=e.data,n=r.info,a=!1
;t='<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>'
;t+='<h4>Data Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">',
t+="<tr><td><b>Name</b></td><td>"+n[1]+' (<a href="/#dataview/'+n[6]+"/"+n[1]+"/"+n[4]+'" target="_blank">'+n[6]+"/"+n[0]+"/"+n[4]+"</a>)</td></tr>",
t+='<tr><td><b>Type</b></td><td><a href="/#spec/type/'+n[2]+'" target="_parent">'+n[2]+"</a></td></tr>",
t+="<tr><td><b>Saved on</b></td><td>"+T(n[3])+"</td></tr>",
t+='<tr><td><b>Saved by</b></td><td><a href="/#people/'+n[5]+'" target="_blank">'+n[5]+"</td></tr>"
;var o='<tr><td><b>Meta data</b></td><td><div style="width:250px;word-wrap: break-word;">'
;for(var i in n[10])a=!0,o+="<b>"+i+"</b> : "+n[10][i]+"<br>"
;if(a&&(t+=o+"</div></td></tr>"),
t+="</div></td></tr></table></td><td>",t+='<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">',
r.copied&&(t+=R("Copied from",'<a href="/#dataview/'+r.copied+'" target="_blank">'+r.copied+"</a>")),
r.provenance.length>0)for(var s="",d=0;d<r.provenance.length;d++)r.provenance.length>1&&(s="Action "+d+": "),
t+=P(r.provenance[d],s);else t+='<tr><td></td><td><b><span style="color:red">No provenance data set.</span></b></td></tr>'
;t+="</table>",t+="</td></tr></table>",u.find("#objdetailsdiv").html(t)
}catch(c){
t='<center><table cellpadding="2" cellspacing="0" class="table table-bordered"><tr><td>'
;t+='<h4>Data Object Details</h4><table cellpadding="2" cellspacing="0" border="0" class="table table-bordered table-striped">',
t+="<tr><td><b>Name</b></td><td>"+(n=e.info)[1]+'(<a href="/#dataview/'+n[6]+"/"+n[1]+"/"+n[4]+'" target="_blank">'+n[6]+"/"+n[0]+"/"+n[4]+"</a>)</td></tr>",
t+='<tr><td><b>Type</b></td><td><a href="/#spec/type/'+n[2]+'" target="_parent">'+n[2]+"</a></td></tr>",
t+="<tr><td><b>Saved on</b></td><td>"+T(n[3])+"</td></tr>",
t+='<tr><td><b>Saved by</b></td><td><a href="/#people/'+n[5]+'" target="_blank">'+n[5]+"</td></tr>"
;a=!1,
o='<tr><td><b>Meta data</b></td><td><div style="width:250px;word-wrap: break-word;">'
;for(var i in n[10])a=!0,o+="<b>"+i+"</b> : "+n[10][i]+"<br>"
;a&&(t+=o+"</div></td></tr>"),
t+="</div></td></tr></table></td><td>",t+='<h4>Provenance</h4><table cellpadding="2" cellspacing="0" class="table table-bordered table-striped">',
t+="error in fetching provenance",
t+="</table>",t+="</td></tr></table>",console.error("Error fetching provenance"),
console.error(c),u.find("#objdetailsdiv").html(t)}}function P(e,t){var r=[]
;return"description"in e&&r.push(R(t+"Description",e.description)),
"service"in e&&r.push(R(t+"Service Name",e.service)),
"service_ver"in e&&r.push(R(t+"Service Version",e.service_ver)),
"method"in e&&r.push(R(t+"Method",e.method)),
"method_params"in e&&r.push(R(t+"Method Parameters",JSON.stringify(function(e){
if(e&&e.constructor===Array)for(var t=0;t<e.length;t++)e[t]&&"object"==typeof e[t]&&e[t].hasOwnProperty("auth")&&delete e[t].auth
;return e
}(e.method_params),null,"  "))),"script"in e&&r.push(R(t+"Command Name",e.script)),
"script_ver"in e&&r.push(R(t+"Script Version",e.script_ver)),
"script_command_line"in e&&r.push(R(t+"Command Line Input",e.script_command_line)),
"intermediate_incoming"in e&&e.intermediate_incoming.length>0&&r.push(R(t+"Action Input",JSON.stringify(e.intermediate_incoming,null,"  "))),
"intermediate_outgoing"in e&&e.intermediate_outgoing.length>0&&r.push(R(t+"Action Output",JSON.stringify(e.intermediate_outgoing,null,"  "))),
"external_data"in e&&e.external_data.length>0&&r.push(R(t+"External Data",function(e){
var t="";return e.forEach((function(e){
"resource_name"in e&&(t+="<b>Resource Name</b><br/>",
"resource_url"in e&&(t+='<a target="_blank" href='+e.resource_url,
t+=">"),t+=e.resource_name,
"resource_url"in e&&(t+="</a>"),t+="<br/>"),"resource_version"in e&&(t+="<b>Resource Version</b><br/>",
t+=e.resource_version+"<br/>"),
"resource_release_date"in e&&(t+="<b>Resource Release Date</b><br/>",
t+=T(e.resource_release_date)+"<br/>"),"data_id"in e&&(t+="<b>Data ID</b><br/>",
"data_url"in e&&(t+='<a target="_blank" href='+e.data_url,
t+=">"),t+=e.data_id,"data_url"in e&&(t+="</a>"),
t+="<br/>"),"description"in e&&(t+="<b>Description</b><br/>",
t+=e.description+"<br/>")})),t
}(e.external_data))),"time"in e&&r.push(R(t+"Timestamp",T(e.time))),r.join("")}
function R(e,t){return D([F({style:{maxWidth:"250px"}},[A(e)]),F({style:{
maxWidth:"300px"}},[x({style:{maxWidth:"300px",maxHeight:"250px",
overflowY:"auto",whiteSpace:"pre",wordWrap:"break-word"}},[t])])])}
function J(e){return e[1]+" (v"+e[4]+")"}function W(e,t,r){var n=_[t.objId]
;if(void 0!==n)return n;n=k.nodes.length,_[t.objId]=n
;var a=e.ref.split("/").slice(0,2).join("/"),o=m[a]
;return k.nodes.push(t),K(o,n,r),n}function L(e,t,r){
for(var n=0;n<Math.min(e.length,10);n++){
var a,o=e[n].info,i=o[6]+"/"+o[0]+"/"+o[4],s=o[6]+"/"+o[0]
;if(void 0!==m[s])a=m[s],k.nodes[a].versions[o[4]]=!0;else{
var d=o[2].split("-")[0],c=!(e[n].provenance.length+e[n].refs.length>0),l={}
;l[o[4]]=!0;var u={name:J(o),objId:i,type:d,data:e[n],endNode:c,versions:l,
referencesFrom:[],referencesTo:[]};a=k.nodes.length,m[s]=a,k.nodes.push(u)}
K(t,a,r)}}function z(e){
return h.list_referencing_objects([e]).then((function(t){var r=function(e){
for(var t=[],r=0;r<Math.min(e.length,10);r++){
var n=e[r][6]+"/"+e[r][0]+"/"+e[r][4];t.push({ref:n})}return t}(t[0])
;return 0===t[0].length?null:h.get_objects2({objects:r,no_data:1
}).then(H.bind(null,e))})).catch((function(){}))}function H(e,t){
for(var r=0;r<t.data.length;r++){var n=t.data[r]
;if(!j[n.info[2].split("-")[0]]){
for(var a=0;a<n.refs.length;a++)if(e.ref===n.refs[a]){
var o=!0,i=e.ref.split("/").slice(0,2).join("/");L([n],m[i],o);break}
for(var s=0;s<n.provenance.length;s++){
var d=n.provenance[s],c=n.info,l=V(d,i=c[6]+"/"+c[0],d.script);o=!1
;if(d.resolved_ws_objects.length>0)L([n],W(e,l,o),o)}}}}function K(e,t,r){
var n=t+"to"+e;if(!y[n]){y[n]=!0;var a={source:t,target:e,isDep:r}
;k.links.push(a),
k.nodes[t].referencesTo.push(a),k.nodes[e].referencesFrom.push(a)}}
function V(e,t,r){return r?{isFunction:!0,type:"Script",objId:t+"to"+e.script,
name:e.script,method:e.script,referencesFrom:[],referencesTo:[]}:{isFunction:!0,
type:"App",objId:t+"to"+e.service,name:e.service,method:e.method,
referencesFrom:[],referencesTo:[]}}function Y(e){var t=w[e.ref],r=t?{ref:t}:e
;return h.get_objects2({objects:[r],no_data:1}).then((function(e){return e.data
})).then(B.bind(null,e,!0))}function B(t,r,n){
for(var a,o,i={},s=[],d=[],c=0;c<n.length;c++){
n[c].provenance.forEach((function(e){var r=t.ref.split("/").slice(0,2).join("/")
;a=V(e,r,e.script)
;o=W(t,a,!1),e.resolved_ws_objects&&e.resolved_ws_objects.forEach((function(e){
if(!(e in i)){i[e]="included",void 0===w[t.ref]&&(w[t.ref]=t.ref)
;var r=w[t.ref]+";"+e;w[e]=r,s.push({ref:r})}}))}))
;for(var l=n[c].refs,u=0;u<l.length;u++){var f=w[t.ref];f||(f=t.ref,w[t.ref]=f)
;var p=w[l[u]];void 0===p&&(p=f+";"+l[u],w[l[u]]=p),d.push({ref:p})}
if(s.length>0)return e.all([b.callFunc("get_objects2",[{objects:s,no_data:1
}]),t,o]).spread((function(e,t,r){
if(null!==e||j[e[0].data.info[2].split("-")[0]]){L(e=e[0].data,r,!1)}}))
;if(d.length>0)return e.all([b.callFunc("get_objects2",[{objects:d,no_data:1,
ignoreErrors:1}]),t]).spread((function(e,t){if(null!==e){e=e[0].data
;var r=t.ref.split("/").slice(0,2).join("/");L(e,m[r],!0)}}))}}function G(n){
u.find("#loading-mssg").show(),u.find("#objgraphview2").hide(),h.get_objects2({
objects:[n],no_data:1}).then((function(e){return function(e){var t,r=[],n=0,a=""
;return e.forEach((function(e){
var o=e.info,i=o[2].split("-")[0],s=o[6]+"/"+o[0],d=o[6]+"/"+o[0]+"/"+o[4],c={}
;c[o[4]]=!0,o[4]>n&&(t={name:J(o),objId:d,type:i,data:e,isPresent:!0,
startingObject:!0,referencesFrom:[],versions:c,referencesTo:[]
},n=o[4],a=d),m[s]=0,w[d]=d,r.push({ref:d})})),k.nodes.push(t),{ref:a}}(e.data)
})).then((function(t){return e.all([Y(t),z(t)])})).then((function(){
r.select(u.find("#objgraphview2")).html(""),
u.find("#objgraphview2").show(),function(t,n){
var a,o,i,s,d=O,c=M,l=t,f=n,p=r.transition().duration(1750),h=r.layout.force().charge(-1800).linkDistance(30).size([d,c])
;h.drag().on("dragstart",(function(e){e.fixed=!0,h.stop()
})).on("dragend",(function(e){e.fixed=!0,h.stop()})),h.on("tick",(function(){
i.attr("cx",(function(e){return e.x=Math.max(C/2,Math.min(O-C/2,e.x))
})).attr("cy",(function(e){return e.y=Math.max(I/2,Math.min(M-I/2,e.y))
})).attr("transform",(function(e){return"translate("+e.x+","+e.y+")"
})).style("fill",(function(e){
return e.isFunction?g.functionNode.color:e.startingObject?g.startingNode.color:e.endNode||e.expanded?g.noRefs.color:g.node.color
})).attr("display",(function(e){return!1===e.toggle?"none":"initial"
})),s.attr("x1",(function(e){return e.source.x})).attr("y1",(function(e){
return e.source.y+I/2})).attr("x2",(function(e){return e.target.x
})).attr("y2",(function(e){return e.target.y-I/2})).attr("display",(function(e){
return!1===e.toggle?"none":"initial"}))}))
;var b=(o=r.select(u.find("#objgraphview2")[0]).append("svg").attr("width",d).attr("height",c).attr("class","prov")).append("rect").attr("x",0).attr("y",0).attr("height",c).attr("width",d).style("fill","#efefef").style("stroke-width",0)
;function v(){
o.attr("height",M).attr("width",O),b.attr("height",M).attr("width",O),
h.nodes(l).links(f);var e=o.selectAll(".node").data(l,(function(e){
return e.objId}));!function(e){
e.enter().insert("line",".node").attr("class","link").attr("id",(function(e){
return"#path"+e.source+"_"+e.target
})).attr("marker-end","url(#markerArrow)").transition(p).style("stroke-dasharray",(function(e){
return e.isDep?"3, 3":"10,0"
})).style("stroke-width","5"),o.append("svg:defs").selectAll("marker").data([1]).enter().append("svg:marker").attr("id","markerArrow").attr("markerHeight",3).attr("markerWidth",3).attr("refX",5).attr("orient","auto").attr("viewBox","-5 -5 10 10").append("svg:path").attr("d","M 0,0 m -5,-5 L 5,0 L -5,5 Z").attr("fill","blue")
}(o.selectAll(".link").data(f,(function(e){return e.source+","+e.target
}))),function(e){a=[]
;var t=e.enter().append("g").attr("class","node").each((function(e){a.push(e)
})).on("click",E).call(h.drag)
;t.append("rect").attr("class","nodeObj").attr("x",-C/2).attr("y",-I/2).attr("width",C).attr("height",I).attr("stroke-width","1px").on("dblclick",k).attr("stroke",m).attr("rx",(function(e){
return e.isFunction?C/2:0})).attr("ry",(function(e){return e.isFunction?C/2:0
})).on("mouseover",(function(){r.select(this).attr("stroke-width","3px")
})).on("mouseleave",(function(){r.select(this).attr("stroke-width","1px")
})).transition(p),r.selectAll(".nodeObj").each((function(e){
if(void 0!==e.versions)for(var t=1;t<Object.keys(e.versions).length;t++)r.select(this.parentNode).insert("rect",":first-child").attr("class","versions").attr("x",-C/2+5*t).attr("y",-I/2-5*t).attr("width",C).attr("height",I).attr("stroke-width","1px").attr("stroke",m).on("mouseover",(function(){
r.select(this).attr("stroke-width","3px")})).on("mouseleave",(function(){
r.select(this).attr("stroke-width","1px")}))
})),t.append("title").html((function(e){var t="Type: "+e.type+"\nName: "+e.name
;if(!e.isFunction){var r=e.data.info
;t+="\nSaved on:  "+T(r[3])+"\nSaved by:  "+r[5]}return t})),t.transition
;var n=t.append("text").attr("fill","black")
;n.append("tspan").text((function(e){
return e.type.length<15?e.type:e.type.slice(0,10)+"..."
})).attr("font-weight","bold").attr("x",(function(e){
return-C/2+(e.isFunction?40:5)
})).attr("y",-I/2+15).attr("dy",0),n.append("tspan").attr("dy",15).attr("x",(function(e){
return-C/2+(e.isFunction?12:5)})).attr("y",-I/2+15).text((function(e){
return e.isFunction?e.name.length<12?e.name:e.name.slice(0,9)+"...":e.name.length<20?e.name:e.name.slice(0,12)+"..."
}))
}(e),s=o.selectAll(".link"),i=o.selectAll(".node"),h.start(),h.tick(),h.stop()}
function m(e){
return e.isFunction?g.functionNode.borderColor:e.startingObject?g.startingNode.borderColor:g.node.borderColor
}function k(t){var r={ref:t.objId}
;if(t.isPresent||t.isFunction)t.startingObject&&void 0===t.expanded&&(t.expanded=!0),
t.expanded=!t.expanded,t.expanded,function(e){
for(var t=e.expanded,r=w(e.referencesTo);r.length>0;){var n=r.pop()
;n.toggle=t,(!1===t&&!y(n.target)||!0===t&&t!==n.target.toggle)&&(!1===n.target.expanded&&!0===t||(r=r.concat(w(n.target.referencesTo))),
n.target.toggle=t)}
}(t),v();else if(!t.endNode)return t.expanded=!0,e.all([B(r,0,[t.data]),z(r)]).then((function(){
l=q(),v(),t.isPresent=!0}))}function w(e){
for(var t=[],r=0;r<e.length;r++)t.push(e[r]);return t}function y(e){
for(var t=e.referencesFrom,r=0;r<t.length;r++)if(!1!==t[r].toggle)return!0
;return!1}h.on("end",(function(){(a=l).forEach((function(e){e.fixed=!0}))})),v()
}(q(),k.links),function(){if(p){p=!1;var e=t("<div/>",{id:"graphkey2"
}),n=t("#nodeColorKey2");n.append(e),Object.keys(g).map((function(e){
var n=t("<tr/>",{class:"prov-graph-color"}),a="row"+e,o=t("<td/>",{id:a
}),i=t("<td/>",{text:g[e].name}).css("vertical-align","top")
;n.append(o),n.append(i),t("#graphkey2").append(n);var s="#"+a
;r.select(s).append("svg").attr("height",26).attr("width",60).append("line").attr("x1",5).attr("y1",5).attr("x2",50).attr("y2",5).attr("stroke-dasharray",g[e].stroke).attr("stroke-width",g[e].width).attr("stroke",g[e].color)
})),n.append(t("<div/>",{id:"objdetailsdiv"}))}
}(),u.find("#loading-mssg").hide()})).catch((function(e){!function(e){var t
;u.find("#loading-mssg").hide(),
u.append("<br><b>Error in building object graph!</b><br>"),
u.append("<i>Error was:</i></b> &nbsp "),
t=e.message?e.message:e.error&&e.error.message?e.error.message:"unknown error (check console)",
u.append(t+"<br>"),
console.error("Error in building object graph!"),console.error(e)}(e)}))}
function q(){S.setGraph({}),S.setDefaultEdgeLabel((function(){return{}}))
;for(var e=0;e<k.nodes.length;e++){var t=k.nodes[e]
;t.height=I,t.width=C,t.index=e;var r=Object.assign({},t)
;r.label=t.name,S.setNode(t.objId,r)}for(let i=0;i<k.links.length;i++){
var n=k.links[i]
;isNaN(n.source)&&(n.source=n.source.index,n.target=n.target.index),
S.setEdge(k.nodes[n.source].objId,k.nodes[n.target].objId)}s.layout(S)
;var a=[],o=S.nodes();for(let i=0;i<o.length;i++)a.push(S.node(o[i]))
;return M=S._label.height,O=S._label.width,a}return{attach:function(e){
c=e,l=a.createElement("div"),
u=t(l),l.innerHTML=x([x(["This is a visualization of the relationships between this piece of data and other data in KBase.  Click objects to show additional information (shown below the graph). Double click on an object expand graph.",N(),N()]),x({
id:"objgraphview2",style:{overflow:"auto",height:3*M/4+"px",resize:"vertical"}
}),x({id:"nodeColorKey2"})]),c.appendChild(l)},start:function(e){
p=!0,G(function(e,t,r){return r?{ref:e+"/"+t+"/"+r}:{ref:e+"/"+t}
}(e.workspaceId,e.objectId))},stop:function(){},detach:function(){
c.removeChild(l)}}}return{make:function(e){return d(e)}}}));