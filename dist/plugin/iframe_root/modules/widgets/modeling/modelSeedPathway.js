define(["jquery","d3","kb_service/client/workspace","widgets/modeling/modelSeedVizConfig"],(function(t,e,a,r){
"use strict";return function(n){var s;try{s=t("#"+n.elem)}catch(I){
return void console.error('Pathway widget requires element ("elem") in params')}
var l=this;l.models=n.models||null,l.fbas=n.fbas||null;var i=n.runtime
;this.workspaceClient=new a(i.config("services.workspace.url"),{
token:i.service("session").getAuthToken()})
;var c,o=n.usingImage||!1,d=n.absFlux||!1,p=new r,u=n.mapData,h=u.groups,f=u.reactions,x=u.compounds,v=u.linkedmaps,m=0,b=0,y=50
;function g(t,e,a,r,n){var s=[]
;for(var l in a.substrate_refs)s.push(a.substrate_refs[l].compound_ref);var i=[]
;for(var l in a.product_refs)i.push(a.product_refs[l].compound_ref)
;a.id,a.rxns.join(", "),s.join(", "),i.join(", ")}function k(t,a){
t.each((function(){
for(var t,r=e.select(this),n=r.text().split(/\s+/).reverse(),s=[],l=0,i=r.attr("y"),c=r.attr("x"),o=r.text(null).append("tspan").attr("x",c).attr("y",i).attr("dy","0em");t=n.pop();)s.push(t),
o.text(s.join(" ")),
o.node().getComputedTextLength()>a&&(s.pop(),o.text(s.join(" ")),
s=[t],o=r.append("tspan").attr("x",c).attr("y",i).attr("dy",1.1*++l+0+"em").text(t))
}))}function _(t){var e=[];for(var a in l.models){
var r=l.models[a].modelreactions,n=[];for(var s in r){var i=r[s]
;-1!==t.indexOf(i.id.split("_")[0])&&n.push(i)}e.push(n)}return e}function w(t){
for(var e=[],a=0;a<l.fbas.length;a++){var r=l.fbas[a].FBAReactionVariables,n=[]
;for(var s in r){var i=r[s]
;-1!==t.indexOf(i.modelreaction_ref.split("/").pop().split("_")[0])&&n.push(i)}
e.push(n)}return e}function A(){
var a=t('<div class="map-opts pull-left">                              \x3c!--<button class="btn btn-primary btn-edit-map">Edit Map</button>--\x3e                              <button class="btn btn-default btn-map-opts">Options <div class="caret"></div></button>                              \x3c!--<button class="btn btn-default btn-map-cancel">Done</button>--\x3e                              <button class="btn btn-default btn-map-save">Save</button>                           </div>                           <span class="mouse-pos pull-right">                                <span id="ele-type"></span>                               x: <span id="x-pos">0</span>                               y: <span id="y-pos">0</span>                           </span>                           <br><br>'),r=t('<div class="opts-dd">Display:                    <div class="checkbox">                        <label><input type="checkbox" data-type="rxn-label" checked="checked">Enzymes Labels</label>                    </div>                    <div class="checkbox">                        <label><input type="checkbox" data-type="rect" value="" checked="checked">Enzymes</label>                    </div>                    <div class="checkbox">                        <label><input type="checkbox" data-type="circle" checked="checked">Compounds</label>                    </div>                    <div class="checkbox">                        <label><input type="checkbox" data-type="line" checked="checked">Lines</label>                    </div>                    <div class="checkbox">                        <label><input type="checkbox" data-type="cpd-label" checked="checked">Compound Labels</label>                    </div>                    </div>')
;c.on("mousemove",(function(){var a=e.mouse(this),r=a[0],n=a[1]
;t("#x-pos").html(r),t("#y-pos").html(n)
})),s.prepend(a),t(".btn-map-opts").popover({html:!0,content:r,animation:!1,
container:"body",trigger:"click",placement:"bottom"
}),t(".btn-map-opts").click((function(){
r.find("input").unbind("change"),r.find("input").change((function(){
var e=t(this).data("type")
;"checked"===t(this).attr("checked")?(c.selectAll("."+e).style("display","none"),
t(this).attr("checked",!1)):(c.selectAll("."+e).style("display","block"),
t(this).attr("checked",!0))}))}))
;var n=e.behavior.drag().on("dragstart",(function(){
e.event.sourceEvent.stopPropagation()})).on("drag",(function(){!function(t){
var a=e.event.x,r=e.event.y
;e.select(t).attr("transform","translate("+a+","+r+")"),
"first"===e.select(t).attr("class")?(e.select(t.parentNode).select("line").attr("x1",a),
e.select(t.parentNode).select("line").attr("y1",r)):"middle"===e.select(t).attr("class")?(e.select(t.parentNode).select(".line1").attr("x2",a),
e.select(t.parentNode).select(".line1").attr("y2",r),
e.select(t.parentNode).select(".line2").attr("x1",a),
e.select(t.parentNode).select(".line2").attr("y1",r)):(e.select(t.parentNode).select("line").attr("x2",a),
e.select(t.parentNode).select("line").attr("y2",r))}(this)}))
;c.selectAll(".link").on("click",(function(){
t(".first, .last, .middle").remove(),function(t){
(t=e.select(t)).attr("stroke",p.highlight).attr("fill",p.highlight).attr("stroke-width",2)
;var a=t.attr("x1"),r=t.attr("y1"),s=t.attr("x2"),l=t.attr("y2"),i=t.node().parentNode
;e.select(i).append("g").attr("transform","translate("+a+","+r+")").attr("class","first").call(n).append("circle").attr({
r:0
}).attr("class","line-start").transition().duration(750).ease("elastic").attr("r",8),
e.select(i).append("g").attr("transform","translate("+s+","+l+")").attr("class","last").call(n).append("circle").attr({
r:0
}).attr("class","line-end").transition().duration(750).ease("elastic").attr("r",8)
;t.on("click",(function(){
e.select(i).attr("class","edited-line"),e.event.stopPropagation()
;var t=e.mouse(this)[0],c=e.mouse(this)[1],o=e.select(this).data()[0].type
;e.select(this).remove()
;e.select(i).append("line").attr("class","line1").attr("x1",a).attr("y1",r).attr("x2",t).attr("y2",c)
;var d=e.select(i).append("line").attr("class","line2").attr("x1",t).attr("y1",c).attr("x2",s).attr("y2",l)
;"arrow"===o&&d.attr("marker-end","url(#end-arrow)")
;e.select(i).append("g").attr("transform","translate("+t+","+c+")").attr("class","middle").call(n).append("circle").attr({
r:0
}).attr("class","line-middle").transition().duration(750).ease("elastic").attr("r",8)
}))}(this),a.find(".btn-map-save").addClass("btn-primary")
})),c.selectAll(".cpd-label").on("click",(function(){
t(".first, .last, .middle").remove(),function(t){
(t=e.select(t).call(n)).attr("fill",p.highlight).attr("class","edited-label")
}(this),a.find(".btn-map-save").addClass("btn-primary")
})),a.find(".btn-map-cancel").click((function(){})),
a.find(".btn-map-save").click((function(){!function(){
var a=t.extend({},r.map_data),r=this
;c.selectAll(".edited-line").each((function(t,r){
var n=e.select(this).select(".line1"),s=e.select(this).select(".line2"),l=(n.data()[0].cpd_id,
n.data()[0].group_index),i=n.data()[0].line_type,c=[[parseInt(n.attr("x1")),parseInt(n.attr("y1"))],[parseInt(n.attr("x2")),parseInt(n.attr("y2"))],[parseInt(s.attr("x2")),parseInt(s.attr("y2"))]],o=a.groups
;"substrate"===i?o[l].substrate_path=c:"product"===i&&(o[l].product_path=c)
})),c.selectAll(".edited-label").each((function(t,r){
var n=e.select(this),s=n.attr("transform");if(s){
var l=parseInt(s.split(",")[0].split("(")[1]),i=parseInt(s.split(",")[1].split(")")[0]),c=n.data()[0].cpd_index,o=a.compounds
;o[c].label_x=l,o[c].label_y=i}})),r.workspaceClient.get_object_info([{
workspace:r.workspace,name:r.map_name}]).then((function(t){var e=t[0][10]
;return r.workspaceClient.save_object({workspace:r.workspace,data:a,
id:r.map_name,type:"KBaseBiochem.MetabolicMap",metadata:e})
})).then((function(e){
var a=t('<div class="alert alert-success pull-left">Saved.</div>')
;return a.css("padding","7px"),
a.css("margin-left","10px"),a.css("margin-bottom",0),
s.find(".map-opts").after(a),a.delay(3e3).fadeOut(500),r.drawMap(),null
})).catch((function(t){
s.prepend('<div class="alert alert-danger">'+t.error.message+"</div>")}))}()}))}
function C(){
s.html(""),(c=e.select("#"+n.elem).append("svg").attr("width",800).attr("height",1e3)).append("svg:defs").selectAll("marker").data(["end"]).enter().append("svg:marker").attr("id","end-arrow").attr("viewBox","0 -5 10 10").attr("refX",16).attr("refY",0).attr("markerWidth",10).attr("markerHeight",10).attr("orient","auto").attr("fill","#666").append("svg:path").attr("d","M0,-5L10,0L0,5"),
c.append("svg:defs").append("svg:marker").attr("id","start-arrow").attr("viewBox","0 -5 10 10").attr("refX",4).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M10,-5L0,0L10,5").attr("fill","#000"),
o||function(){var t=[],a=[],r=[];for(var n in h){
var s=h[n],l=s.rxn_ids,i=s.x,o=s.y,d=[]
;for(var p in f)if(-1!==l.indexOf(f[p].id)){var u=f[p];d=d.concat(u.rxns)}
var v=u.product_refs,m=u.substrate_refs;for(var p in m){var b=m[p].id
;for(var y in x){if((w=x[y]).id===b){var g=w.id;if(-1!==t.indexOf(g))if(r.push({
source:t.indexOf(g),target:a.length,value:1,cpd_id:g,group_index:n,rxns:d,
line_type:"substrate"}),s.substrate_path){var k=s.substrate_path;r.push({
source:a.length,target:a.length+1,value:1,cpd_id:g,group_index:n,rxns:d,
line_type:"substrate"});for(y=1;y<k.length;y++)a.push({x:k[y][0],y:k[y][1],
fixed:!0,style:"point"}),t.push("null")}else a.push({x:i,y:o,fixed:!0,
style:"point"}),t.push("null");else r.push({source:a.length,target:a.length+1,
value:1,cpd_id:g,group_index:n,line_type:"substrate",rxns:d}),a.push({x:w.x,
y:w.y,fixed:!0,type:"compound",name:w.label,cpd_index:y,rxns:d,
label_x:w.label_x,label_y:w.label_y}),a.push({x:i,y:o,fixed:!0,style:"reaction"
}),t.push(g),t.push("null")}}}for(var p in v){var _=v[p].id;for(var y in x){
var w;if((w=x[y]).id===_){g=w.id;if(-1!==t.indexOf(g))if(r.push({
source:a.length,target:t.indexOf(g),value:1,type:"arrow",cpd_id:g,group_index:n,
line_type:"product",rxns:d}),s.product_path){k=s.product_path;r.push({
source:a.length-1,target:a.length,value:1,cpd_id:g,group_index:n,
line_type:"product",rxns:d});for(y=1;y<k.length;y++)a.push({x:k[y][0],y:k[y][1],
fixed:!0,style:"point"}),t.push("null")}else a.push({x:i,y:o,fixed:!0,
style:"point"}),t.push("null");else r.push({source:a.length,target:a.length+1,
value:1,type:"arrow",cpd_id:g,group_index:n,line_type:"product",rxns:d
}),a.push({x:i,y:o,fixed:!0,style:"reaction"}),a.push({x:w.x,y:w.y,fixed:!0,
style:"compound",name:w.label,cpd_index:y,label_x:w.label_x,label_y:w.label_y}),
t.push("null"),t.push(g)}}}}
var A=e.layout.force().nodes(a).links(r).charge(-400).linkDistance(40).on("tick",(function(){
C.attr("x1",(function(t){return t.source.x})).attr("y1",(function(t){
return t.source.y})).attr("x2",(function(t){return t.target.x
})).attr("y2",(function(t){return t.target.y})).attr("marker-end",(function(t){
return"arrow"===t.type?"url(#end-arrow)":""})),I.attr("transform",(function(t){
return"translate("+t.x+","+t.y+")"})),I.select("circle").attr("r",(function(t){
return"point"===t.style?0:"reaction"===t.style?1:7}))
})).start(),C=c.selectAll(".link").data(r).enter().append("g").append("line").attr("class","link"),I=c.selectAll(".node").data(a).enter().append("g").attr("class","node").call(A.drag)
;I.append("circle").attr("class","cpd"),
I.append("text").attr("class","cpd-label").attr("x",10).attr("dy",".35em").style("font-size","8pt").attr("transform",(function(t){
if(t.label_x||t.label_y)return"translate("+t.label_x+","+t.label_y+")"
})).text((function(t){return t.name}))}(),function(){
for(var e=l.models?l.models.length:1,a=0;a<f.length;a++){
var r="#fff",n=void 0,s=f[a],i=s.x-s.w/2-1,o=s.y-s.h/2-1.5,u=s.w+3,h=s.h+2
;i>m&&(m=i+2*u+y),o>b&&(b=o+2*h+y)
;var x=c.append("g").attr("class","rect"),v=_(s.rxns);if(l.models){u=s.w/e
;for(var k=0;k<v.length;k++){
var A=v[k],C=x.append("rect").attr("class","rxn-divider-stroke").attr("x",(function(){
return 0===k?i+u*k+1:i+u*k})).attr("y",o+1).attr("width",(function(){
return k===e?u:u+2})).attr("height",h-1.5);A.length>0?(C.attr("fill","#bbe8f9"),
C.attr("stroke",p.strokeDark)):(C.attr("fill","#fff"),
C.attr("stroke",p.strokeDark))
;var I="<h5>"+l.models[k].name+"<br><small>"+l.models[k].source_id+"</small></h5>"
;g(C.node(),I,s)}
}else C=x.append("rect").attr("class","rxn").attr("x",i).attr("y",o).attr("width",u).attr("height",h)
;if(l.fbas){var M=w(s.rxns)
;if(0===[].concat.apply([],M).length)var N=!1;else N=!0}
if(N)for(u=s.w/l.fbas.length,k=0;k<M.length;k++){
A=M[k],C=x.append("rect").attr("class","rxn-divider-stroke").attr("x",(function(){
return 0===k?i+u*k+1:i+u*k})).attr("y",o+1).attr("width",(function(){
return k===e?u:u+1})).attr("height",h-1.5);if(A.length>0){
for(var O=A[0].value,j=1;j<A.length;j++)Math.abs(A[j].value)>Math.abs(O)&&(O=A[j].value)
;Math.abs(O)>499&&(n=!0)}
if(void 0!==O)(r=p.getColor(O,d))?C.attr("fill",r):C.attr("fill",p.geneColor)
;I="<h5>"+l.models[k].name+"<br><small>"+l.models[k].source_id+"</small></h5>"
;g(C.node(),I,s,O,l.fbas[k])}
x.append("text").attr("x",i+2).attr("y",o+h/2+6).text(s.name).attr("class",n?"rxn-label-light":"rxn-label")
;t(x.node()).hover((function(){t(this).find("text").hide()}),(function(){
t(this).find("text").show()}))}}(),o||function(){for(var t=0;t<v.length;t++){
var e=v[t],a=e.x-e.w/2,r=e.y-e.h/2,n=parseInt(e.w)+2,s=parseInt(e.h)+2
;a>m&&(m=a+n+y),r>b&&(b=r+s+y);var l=c.append("g")
;l.append("rect").attr("class","map").attr("x",a).attr("y",r).attr("width",n).attr("height",s),
l.append("text").attr("class","map-label").style("font-size","8pt").text(e.name).attr("x",a+2).attr("y",r+10).call(k,n+2)
}}(),c.attr("width",m).attr("height",b),n.editable&&A()}this.render=function(){
C()}}}));