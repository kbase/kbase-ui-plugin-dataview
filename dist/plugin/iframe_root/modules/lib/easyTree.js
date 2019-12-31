define(["lib/knhx","lib/canvastext"],(function(e,n){"use strict"
;return function(t,i,r,o,a){var s,d,l,c=e.kn_parse(i)
;if(r)for(l in c.node)c.node.hasOwnProperty(l)&&(d=r[s=c.node[l].name])&&(c.node[l].id=s,
c.node[l].name=d);if(a)for(l in c.node)if(c.node.hasOwnProperty(l)){
var _=c.node[l],h=a(_,l);h&&(_.hl=h)}var f={},g=document.getElementById(t),p=f
;p.c_box=[],
p.width=1e3,p.height=600,p.xmargin=20,p.ymargin=20,p.fontsize=8,p.c_ext="rgb(0,0,0)",
p.c_int="rgb(255,0,0)",
p.c_line="#444",p.c_node="#666",p.c_active_node="rgb(255,128,0)",
p.c_hl="rgb(180, 210, 255)",
p.c_hidden="rgb(0,200,0)",p.c_regex="rgb(0,128,0)",p.regex=":B=([^:\\]]+)",
p.xskip=3,
p.yskip=14,p.box_width=6,p.old_nh=null,p.is_real=!0,p.is_circular=!1,p.show_dup=!0,
p.runtime=0;var y=0,u=0,v=0,x=0;function m(t,i,r){e.kn_plot_core(t,i,r)
;var o="Change layout",a=t.getContext("2d")
;n.enable(a),a.strokeStyle=r.c_ext,a.fillStyle="rgb(180, 245, 220)"
;var s=a.measureText(r.font,r.fontsize,o),d=r.width-80,l=1.5*r.fontsize+1
;a.fillRect(d,1,s,l),
a.drawText(r.font,r.fontsize,d,1+.8*r.fontsize+r.fontsize/3,o),y=d,u=1,v=s,x=l}
function w(n){
if(n.layerX||0===n.layerX?(n._x=n.layerX,n._y=n.layerY):(n.offsetX||0===n.offsetX)&&(n._x=n.offsetX,
n._y=n.offsetY),"Microsoft Internet Explorer"===navigator.appName){
var t=document.body,i=document.getElementById("canvasContainer")
;n._x=n.clientX-(i.offsetLeft-t.scrollLeft)-3,
n._y=n.clientY-(i.offsetTop-t.scrollTop)-3}if(c){
var r=e.kn_get_node(c,f,n._x,n._y);if(r>=0&&r<c.node.length){var a=c,s=f,d=r
;if(d<a.node.length&&a.node[d].child.length){if(!a.node[d].parent)return
;a.node[d].hidden=!a.node[d].hidden;a.node.length
;a.node=kn_expand_node(a.node[a.node.length-1]),
kn_count_tips(a),s.is_real=e.kn_calxy(a,s.is_real),c=a,f=s,m(g,a,s)
}else o&&o(c.node[r],r)}else{var l=n._x,_=n._y
;l>=y&&l<y+v&&_>=u&&_<u+x&&function(n){
f.is_circular=n,f.height=f.is_circular?f.width:2*f.ymargin+c.n_tips*f.yskip,
g.height=f.height,e.kn_count_tips(c),f.is_real=e.kn_calxy(c,f.is_real),m(g,c,f)
}(!f.is_circular)}}}var k=c
;if(k.error)1&k.error?window.alert("Parsing ERROR: missing left parenthesis!"):2&k.error?window.alert("Parsing ERROR: missing right parenthesis!"):4&k.error?window.alert("Parsing ERROR: missing brackets!"):window.alert("Unknown parsing ERROR: "+k.error);else{
p.is_real=e.kn_calxy(k,p.is_real),
p.height=p.is_circular?p.width:2*p.ymargin+k.n_tips*p.yskip,
g.width=p.width,g.height=p.height,m(g,k,p);var b=document.createElement("div")
;b.setAttribute("id","canvasContainer"),
b.setAttribute("style","position: relative;");var R=g.parentNode||g.parent
;R.removeChild(g),
R.appendChild(b),b.appendChild(g),g.addEventListener?g.addEventListener("click",w,!1):g.attachEvent("onclick",w)
}}}));