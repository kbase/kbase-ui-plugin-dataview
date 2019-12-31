define(["lib/canvastext","lib/popit"],(function(e,n){"use strict"
;function t(e,n,t,i){var l,o,r,h=0;for(o={parent:null,child:[],name:"",meta:"",
d:-1,hl:!1,hidden:!1
},r=n,l=n;r<e.length&&","!==e.charAt(r)&&")"!==e.charAt(r);++r){
var a=e.charAt(r);if("["===a){var d=r;0===h&&(h=r);do{++r
}while(r<e.length&&"]"!==e.charAt(r));if(r===e.length){t.error|=4;break}
o.meta=e.substr(d,r-d+1)}else if(":"===a){var c
;for(0===h&&(h=r),c=++r;r<e.length;++r){var s=e.charAt(r)
;if((s<"0"||s>"9")&&"e"!==s&&"E"!==s&&"+"!==s&&"-"!==s&&"."!==s)break}
o.d=parseFloat(e.substr(c,r-c)),--r}else a<"!"&&a>"~"&&0===h&&(h=r)}
return 0===h&&(h=r),h>l&&(o.name=e.substr(l,h-l)),t.node.push(o),r}
function i(e){var n,i=new Array,l={}
;for(l.error=l.n_tips=0,l.node=[],n=0;n<e.length;n+=0){
for(;n<e.length&&(e.charAt(n)<"!"||e.charAt(n)>"~");)++n;if(n===e.length)break
;var o=e.charAt(n)
;if(","===o)++n;else if("("===o)i.push(-1),++n;else if(")"===o){var r,h,a
;for(r=l.node.length,a=i.length-1;a>=0&&!(i[a]<0);--a);if(a<0){l.error|=1;break}
for(h=i.length-1-a,
n=t(e,n+1,l),a=i.length-1,h-=1;h>=0;--h,--a)l.node[r].child[h]=l.node[i[a]],
l.node[i[a]].parent=l.node[r];i.length=a,i.push(r)
}else++l.n_tips,i.push(l.node.length),n=t(e,n,l)}
return i.length>1&&(l.error|=2),l.root=l.node[l.node.length-1],l}function l(e){
var n,t;for(e.node[e.node.length-1].depth=0,n=e.node.length-2;n>=0;--n){
(r=e.node[n]).depth=r.parent.depth+1}var i="",l=0,o=1
;for(n=0;n<e.node.length;++n){var r,h=(r=e.node[n]).depth-l
;if(h>0)for(o?o=0:i+=",\n",t=0;t<h;++t)i+="(";else i+=h<0?"\n)":",\n"
;r.name&&(i+=String(r.name)),r.d>=0&&(i+=":"+r.d),r.meta&&(i+=r.meta),l=r.depth}
return i+="\n"}function r(e){var n,t;for(n=[],(t=[]).push({p:e,i:0});;){
for(;t[t.length-1].i!==t[t.length-1].p.child.length&&!t[t.length-1].p.hidden;){
var i=t[t.length-1];t.push({p:i.p.child[i.i],i:0})}
if(n.push(t.pop().p),!(t.length>0))break;++t[t.length-1].i}return n}
function h(e){var n
;for(e.n_tips=0,n=0;n<e.node.length;++n)(0===e.node[n].child.length||e.node[n].hidden)&&++e.n_tips
;return e.n_tips}function a(e,n){var t=e.node[e.node.length-1];if(n!==t){var i={
parent:null,child:[],name:"",meta:"",d:-1,hl:!1,hidden:!1}
;i.child.push(t),t.parent=i;var l,o=n.parent;if(2===o.child.length){
var r,h=o.parent
;for(l=o.child[0]===n?0:1,(r=o.child[1-l]).d+=o.d,r.parent=h,l=0;l<h.child.length&&h.child[l]!==o;++l);
h.child[l]=r,o.parent=null}else{var a,d
;for(l=0;l<o.child.length&&o.child[l]!==n;++l);
for(a=d=0;a<o.child.length;++a)o.node[d]=o.node[a],a!==l&&++d;--o.child.length}
return(t=i.child[0]).parent=null,t}}function d(e,n){var t,i,l
;for(l=e.n_tips-1,t=i=0;t<e.node.length;++t){
(r=e.node[t]).y=r.child.length&&!r.hidden?(r.child[0].y+r.child[r.child.length-1].y)/2:i++/l,
0===r.child.length?r.miny=r.maxy=r.y:(r.miny=r.child[0].miny,
r.maxy=r.child[r.child.length-1].maxy)}if(n){var o=e.node[e.node.length-1]
;for(l=o.x=o.d>=0?o.d:0,t=e.node.length-2;t>=0;--t){
(r=e.node[t]).x=r.parent.x+(r.d>=0?r.d:0),r.x>l&&(l=r.x)}0==l&&(n=!1)}if(!n){
for(l=e.node[e.node.length-1].x=1,t=e.node.length-2;t>=0;--t){var r
;(r=e.node[t]).x=r.parent.x+1,r.x>l&&(l=r.x)}
for(t=0;t<e.node.length-1;++t)0===e.node[t].child.length&&(e.node[t].x=l)}
for(t=0;t<e.node.length;++t)e.node[t].x/=l;return n}function c(e,n,t,i){
if(n.is_circular)for(var l=0;l<e.node.length;++l){
var o=e.node[l],r=Math.floor(n.width/2+o.x*n.real_r*Math.cos(o.y*n.full_arc)+.999),h=Math.floor(n.height/2+o.x*n.real_r*Math.sin(o.y*n.full_arc)+.999)
;if(t>=r-(a=2)&&t<=r+a&&i>=h-a&&i<=h+a)return l
}else for(l=0;l<e.node.length;++l){var a
;r=e.node[l].x*n.real_x+n.shift_x,h=e.node[l].y*n.real_y+n.shift_y
;if(t>=r-(a=.6*n.box_width)&&t<=r+a&&i>=h-a&&i<=h+a)return l}
return e.node.length}function s(n,t,i){if(i.is_circular)!function(n,t,i){
var l,o,r=n.getContext("2d")
;for(r.strokeStyle=r.fillStyle="white",r.fillRect(0,0,i.width,i.height),
e.enable(r),o=0,l=0;o<t.node.length;++o){
if(!t.node[o].child.length)(g=r.measureText(i.font,i.fontsize,t.node[o].name))>l&&(l=g)
}var h,a,d=2*Math.PI*(350/360)
;(a=(i.width/2-i.xmargin-1*t.n_tips/d)/(l/i.fontsize+t.n_tips/d))>i.fontsize&&(a=i.fontsize)
;for(l*=a/i.fontsize,
i.real_r=h=i.width/2-i.xmargin-l,i.full_arc=d,r.save(),r.translate(i.width/2,i.height/2),
o=t.node.length-1;o>=0;--o)if(t.node[o].box){
var c,s,f=((p=t.node[o]).parent?(p.parent.x+p.x)/2:0)*h
;r.strokeStyle=r.fillStyle=t.node[o].box,
r.beginPath(),c=p.miny-1/t.n_tips/2,s=p.maxy+1/t.n_tips/2,
r.moveTo(f*Math.cos(c*d),f*Math.sin(c*d)),
r.arc(0,0,f,c*d,s*d,!1),r.lineTo(f*Math.cos(s*d),f*Math.sin(s*d)),
r.arc(0,0,h,s*d,c*d,!0),r.closePath(),r.fill()}
for(r.strokeStyle=i.c_ext,r.fillStyle=i.c_hl,o=0;o<t.node.length;++o){var g
;if(!(p=t.node[o]).child.length)r.save(),
p.hl&&(g=r.measureText(i.font,a,t.node[o].name)),
p.y*d>.5*Math.PI&&p.y*d<1.5*Math.PI?(r.rotate(p.y*d-Math.PI),
p.hl&&r.fillRect(-(h+a/2),.8*-a,-g,1.5*a),
r.drawTextRight(i.font,a,-(h+a/2),a/3,p.name)):(r.rotate(p.y*d),
p.hl&&r.fillRect(h+a/2,.8*-a,g,1.5*a),
r.drawText(i.font,a,h+a/2,a/3,p.name)),r.restore()}
r.strokeStyle="black",r.beginPath();var v=t.node[t.node.length-1]
;for(r.moveTo(0,0),
r.lineTo(v.x*h*Math.cos(v.y*d),v.x*h*Math.sin(v.y*d)),o=0;o<t.node.length-1;++o){
var p=t.node[o],u=Math.cos(p.y*d),_=Math.sin(p.y*d)
;r.moveTo(p.parent.x*h*u,p.parent.x*h*_),r.lineTo(p.x*h*u,p.x*h*_)}
for(r.stroke(),
r.closePath(),r.strokeStyle="lightgray",r.beginPath(),o=0;o<t.node.length-1;++o){
if(!(p=t.node[o]).child.length){u=Math.cos(p.y*d),_=Math.sin(p.y*d)
;r.moveTo(p.x*h*u,p.x*h*_),r.lineTo(h*u,h*_)}}
for(r.stroke(),r.closePath(),r.strokeStyle="black",
r.beginPath(),o=0;o<t.node.length;++o){
if(0!==(p=t.node[o]).child.length&&!p.hidden){var x=p.x*h
;r.moveTo(x*Math.cos(p.child[0].y*d),x*Math.sin(p.child[0].y*d)),
r.arc(0,0,x,p.child[0].y*d,p.child[p.child.length-1].y*d,!1)}}
r.stroke(),r.closePath(),r.restore()}(n,t,i);else{
var l,o,r,h,a,d,c,s=n.getContext("2d")
;for(s.strokeStyle=s.fillStyle="white",s.fillRect(0,0,i.width,i.height),
e.enable(s),o=0,l=0;o<t.node.length;++o){
if(!t.node[o].child.length)(g=s.measureText(i.font,i.fontsize,t.node[o].name))>l&&(l=g)
}
for(i.real_x=r=i.width-2*i.xmargin-l,i.real_y=h=i.height-2*i.ymargin-i.fontsize,
i.shift_x=a=i.xmargin,
i.shift_y=d=i.ymargin+i.fontsize/2,o=t.node.length-1;o>=0;--o)if(t.node[o].box){
var f=(m=t.node[o]).x*r+a-i.box_width/2;s.strokeStyle=s.fillStyle=t.node[o].box,
s.fillRect(f,m.miny*h+d-i.yskip/2,i.width-i.xmargin-f,(m.maxy-m.miny)*h+i.yskip)
}for(s.strokeStyle=i.c_ext,s.fillStyle=i.c_hl,o=0;o<t.node.length;++o){
if(0===(m=t.node[o]).child.length||m.hidden){if(m.hl){
var g=s.measureText(i.font,i.fontsize,t.node[o].name)
;s.fillRect(m.x*r+2*i.xskip+a,m.y*h+d-.8*i.fontsize,g,1.5*i.fontsize)}
s.drawText(i.font,i.fontsize,m.x*r+2*i.xskip+a,m.y*h+d+i.fontsize/3,m.name)}}
for(s.strokeStyle=i.c_int,o=0;o<t.node.length;++o){
if((m=t.node[o]).child.length&&m.name.length>0&&!m.hidden){
var v=s.measureText(i.font,i.fontsize,m.name)
;s.drawText(i.font,i.fontsize,m.x*r-i.xskip+a-v,m.y*h+d-i.fontsize/3,m.name)}}
if(i.regex&&i.regex.indexOf("(")>=0){var p=new RegExp(i.regex)
;if(p)for(s.strokeStyle=i.c_regex,o=0;o<t.node.length;++o){
if((m=t.node[o]).child.length&&m.meta){var u=p.exec(m.meta);if(u.length>1){
v=s.measureText(i.font,i.fontsize,u[1])
;s.drawText(i.font,i.fontsize,m.x*r-i.xskip+a-v,m.y*h+d+1.33*i.fontsize,u[1])}}}
}
for(s.strokeStyle=i.c_line,s.beginPath(),c=t.node[t.node.length-1].y*h+d,s.moveTo(a,c),
s.lineTo(t.node[t.node.length-1].x*r+a,c),o=0;o<t.node.length-1;++o){
c=(m=t.node[o]).y*h+d,s.moveTo(m.parent.x*r+a,c),s.lineTo(m.x*r+a,c)}
for(o=0;o<t.node.length;++o){
0===(m=t.node[o]).child.length||m.hidden||(f=m.x*r+a,
s.moveTo(f,m.child[0].y*h+d),s.lineTo(f,m.child[m.child.length-1].y*h+d))}
for(s.stroke(),s.closePath(),o=0;o<t.node.length;++o){var _,x,y,m
;_=(m=t.node[o]).x*r+a,
x=m.y*h+d,y=i.box_width/2,m.hidden?s.fillStyle=i.c_hidden:i.show_dup&&/:D=Y/i.test(m.meta)?s.fillStyle=i.c_dup:s.fillStyle=i.c_node,
s.fillRect(_-y,x-y,i.box_width,i.box_width)}}}function f(e,n,t,f){var g,v=this
;this.set_id=function(e){g=e},this.plot=function(n){var l=(new Date).getTime()
;if(n){var o=function(e,n,t){var l=i(n)
;return l.error?l:(t.is_real=d(l,t.is_real),
t.height=t.is_circular?t.width:2*t.ymargin+l.n_tips*t.yskip,
e.width=t.width,e.height=t.height,s(e,l,t),l)}(e,n,t)
;1&o.error?alert("Parsing ERROR: missing left parenthesis!"):2&o.error?alert("Parsing ERROR: missing right parenthesis!"):4&o.error&&alert("Parsing ERROR: missing brackets!"),
f=o}else s(e,f,t);t.runtime=((new Date).getTime()-l)/1e3
},this.plot_str=function(){this.plot(n.value)},this.undo_redo=function(){
var l=t.old_nh;t.old_nh=n.value,n.value=l,f=i(n.value),t.is_real=d(f,t.is_real),
s(e,f,t)};var p=function(e,t){e.old_nh=n.value,n.value=t};function u(n,t){
if(null!==n.active_node&&n.active_node<n.node.length){
var i=n.node[n.active_node];n.active_node=null;var l=e.getContext("2d")
;l.fillStyle=t.show_dup&&/:D=Y/i.test(i.meta)?t.c_dup:t.c_node,
l.fillRect(i.x*t.real_x+t.shift_x-t.box_width/2,i.y*t.real_y+t.shift_y-t.box_width/2,t.box_width,t.box_width)
}}return this.get=function(e,n){var i=c(f,t,e,n)
;return i>=0&&i<f.node.length?i:-1},this.swap=function(){var n=f,i=t,o=g
;if(o<n.node.length&&n.node[o].child.length){var h=n.node[o],a=h.child[0]
;for(j=0;j<h.child.length-1;++j)h.child[j]=h.child[j+1]
;h.child[h.child.length-1]=a,
n.node=r(n.node[n.node.length-1]),i.is_real=d(n,i.is_real),
f=n,t=i,s(e,n,i),p(i,l(n))}},this.sort=function(){var n=f,i=t,o=g
;o<n.node.length&&n.node[o].child.length&&(!function(e){sort_leaf=function(e,n){
return e.depth<n.depth?1:e.depth>n.depth?-1:String(e.name)<String(n.name)?-1:String(e.name)>String(n.name)?1:0
},sort_weight=function(e,n){return e.weight/e.n_tips-n.weight/n.n_tips}
;var n,t=new Array,i=r(e);for(i[i.length-1].depth=0,n=i.length-2;n>=0;--n){
(l=i[n]).depth=l.parent.depth+1,0===l.child.length&&t.push(l)}
for(t.sort(sort_leaf),n=0;n<t.length;++n)t[n].weight=n,t[n].n_tips=1
;for(n=0;n<i.length;++n){var l;if((l=i[n]).child.length){var o,h=0,a=0
;for(o=0;o<l.child.length;++o)h+=l.child[o].n_tips,a+=l.child[o].weight
;l.n_tips=h,l.weight=a}}
for(n=0;n<i.length;++n)i[n].child.length>=2&&i[n].child.sort(sort_weight)
}(n.node[o]),n.node=r(n.node[n.node.length-1]),i.is_real=d(n,i.is_real),f=n,t=i,
s(e,n,i),p(i,l(n)))},this.reroot=function(){var n=f,i=t,o=g;if(o<n.node.length){
var h=function(e,n,t){var i,l,o,r,h,a,d,c;if(n===e)return e
;for((t<0||t>n.d)&&(t=n.d/2),o=n.d,(h=c={parent:null,child:[],name:"",meta:"",
d:-1,hl:!1,hidden:!1}).child[0]=n,h.child[0].d=t,r=n.parent,h.child[0].parent=h,
i=0;i<r.child.length&&r.child[i]!==n;++i);
for(h.child[1]=r,l=r.d,r.d=o-t,a=r.parent,r.parent=h;null!==a;){
for(d=a.parent,r.child[i]=a,i=0;i<a.child.length&&a.child[i]!==r;++i);
a.parent=r,o=a.d,a.d=l,l=o,h=r,r=a,a=d}if(2===r.child.length){
for(a=r.child[1-i],i=0;i<h.child.length&&h.child[i]!==r;++i);
a.d+=r.d,a.parent=h,h.child[i]=a}else{
for(j=k=0;j<r.child.length;++j)r.child[k]=r.child[j],j!==i&&++k;--r.child.length
}return c}(n.node[n.node.length-1],n.node[o],-1)
;n.node=r(h),f=n,i.is_real=d(n,i.is_real),s(e,n,i),p(i,l(n))}
},this.collapse=function(){var n=f,i=t,l=g
;if(l<n.node.length&&n.node[l].child.length){n.node[l].hidden=!n.node[l].hidden
;n.node.length
;n.node=r(n.node[n.node.length-1]),h(n),i.is_real=d(n,i.is_real),f=n,
t=i,s(e,n,i)}},this.remove=function(){var n=f,i=t,o=g;if(o<n.node.length){
var c=a(n,n.node[o])
;n.node=r(c),h(n),f=n,i.is_real=d(n,i.is_real),s(e,n,i),p(i,l(n))}
},this.multifurcate=function(){var n=f,i=t,o=g
;o<n.node.length&&n.node[o].child.length&&(!function(e){var n,t,i,l,o
;if(0!==e.child.length&&e.parent){
for(t=e.parent,n=0;n<t.child.length&&t.child[n]!==e;++n);
for(i=n,l=t.child.length-i-1,
o=t.child.length,t.child.length+=e.child.length-1,n=0;n<l;++n)t.child[t.child.length-1-n]=t.child[o-1-n]
;for(n=0;n<e.child.length;++n)e.child[n].parent=t,
e.child[n].d>=0&&e.d>=0&&(e.child[n].d+=e.d),t.child[n+i]=e.child[n]}
}(n.node[o]),n.node=r(n.node[n.node.length-1]),i.is_real=d(n,i.is_real),f=n,t=i,
s(e,n,i),p(i,l(n)))},this.move=function(){var n=f,i=t,o=g
;if(o<n.node.length)if(null!==n.active_node&&n.active_node<n.node.length){
if(n.node[n.active_node].parent===n.node[o])alert("Error: cannot move a child to its parent!");else{
var h=function(e,n,t){var i=e.node[e.node.length-1];if(n===i)return null
;for(var l=t;l.parent;l=l.parent)if(l===n)return null;i=a(e,n);var o,r={
parent:null,child:[],name:"",meta:"",d:-1,hl:!1,hidden:!1}
;for(r.child.push(i),i.parent=r,
l=t.parent,o=0;o<l.child.length&&l.child[o]!==t;++o);var h={parent:null,
child:[],name:"",meta:"",d:-1,hl:!1,hidden:!1}
;return h.parent=l,l.child[o]=h,t.d>=0&&(h.d=t.d/2,
t.d/=2),h.child.push(n),n.parent=h,
h.child.push(t),t.parent=h,(i=r.child[0]).parent=null,i
}(n,n.node[n.active_node],n.node[o])
;h?(n.node=r(h),f=n,i.is_real=d(n,i.is_real),
s(e,n,i),p(i,l(n))):alert("Error: Invalid move!")}u(n,i)}else{n.active_node=o
;var c=n.node[o],_=i.box_width-2,x=v.canvas.getContext("2d")
;x.fillStyle=i.c_active_node,
x.fillRect(c.x*i.real_x+i.shift_x-_/2,c.y*i.real_y+i.shift_y-_/2,_,_)
}else u(n,i)},this.highlight=function(i){var l=f,r=t,h=g,a={white:"#FFFFFF",
red:"#FFD8D0",green:"#D8FFC0",blue:"#C0D8FF",yellow:"#FFFFC8",pink:"#FFD8FF",
cyan:"#D8FFFF",none:"none"};if(a[i]&&(i=a[i]),h<l.node.length){
(new Date).getTime();var d,c,v=i
;if("none"===v&&(v=null),v!==l.node[h].box&&(l.node[h].box=v,
f=l,t=r,s(e,l,r)),o=n,
0===l.node[h].child.length)c=(d=o.value.indexOf(l.node[h].name))+l.node[h].name.length;else{
var p,u,_,x,y=o.value;for(p=l.node[h],u=0;p.child.length;)++u,p=p.child[0]
;for(d=y.indexOf(p.name),--d;d>=0&&("("===y.charAt(d)&&--u,0!==u);--d);
for(_=l.node[h],x=0;_.child.length;)++x,_=_.child[_.child.length-1]
;for(c=y.indexOf(_.name)+_.name.length;c<y.length&&(")"===y.charAt(c)&&--x,
0!==x);++c);++c}if(o.setSelectionRange){var m=o.clientHeight/o.rows
;y=o.value.substr(0,d);for(k=b=0;k<d&&k<y.length;++k)"\n"===y.charAt(k)&&++b
;o.scrollTop=b*m,o.setSelectionRange(d,c)}else{var k,b,w=o.createTextRange()
;y=o.value.substr(0,c);for(k=b=0;k<d;++k)"\n"===y.charAt(k)&&++b
;for(d-=b;k<c;++k)"\n"===y.charAt(k)&&++b
;c-=b,w.collapse(!0),w.moveEnd("character",c),
w.moveStart("character",d),w.select()}}},this}return{kn_parse:i,kn_plot_core:s,
kn_count_tips:h,kn_calxy:d,kn_get_node:c,knhx_init:function(e,t,i,l){
var o=document.getElementById(e),r=new f(o,document.getElementById(t),i,l),h='<h4>Actions</h4><div id="knhx_action_menu_'+e+'"><a href="javascript:void(0);" xonClick="kn_actions.swap();">Swap</a><br><a href="javascript:void(0);" xonClick="kn_actions.sort();">Ladderize</a><br><a href="javascript:void(0);" xonClick="kn_actions.collapse();">Collapse</a><br><a href="javascript:void(0);" xonClick="kn_actions.reroot();">Reroot</a><br><a href="javascript:void(0);" xonClick="kn_actions.move();">Move</a><br><a href="javascript:void(0);" xonClick="kn_actions.multifurcate();">Multifurcate</a><br><a href="javascript:void(0);" xonClick="kn_actions.remove();">Remove</a><br><a href="javascript:void(0);" xonClick="kn_actions.highlight(\'none\');" class="alt">&nbsp;</a><a href="javascript:void(0);" xclass="alt" xonClick="kn_actions.highlight(\'red\');" style="background-color:#FFD8D0;">&nbsp;</a><a href="javascript:void(0);" class="alt" xonClick="kn_actions.highlight(\'green\');" style="background-color:#D0FFC0;">&nbsp;</a><a href="javascript:void(0);" xonClick="kn_actions.highlight(\'blue\');" class="alt" style="background-color:#C0D8FF;">&nbsp;</a><a href="javascript:void(0);" xonClick="kn_actions.highlight(\'yellow\');" class="alt" style="background-color:#FFFFC8;">&nbsp;</a><a href="javascript:void(0);" xonClick="kn_actions.highlight(\'cyan\');" class="alt" style="background-color:#D8FFFF;">&nbsp;</a></div>'
;function a(e){
if(e.layerX||0===e.layerX?(e._x=e.layerX,e._y=e.layerY):(e.offsetX||0===e.offsetX)&&(e._x=e.offsetX,
e._y=e.offsetY),"Microsoft Internet Explorer"===navigator.appName){
var t=document.body,i=document.getElementById("canvasContainer")
;e._x=e.clientX-(i.offsetLeft-t.scrollLeft)-3,
e._y=e.clientY-(i.offsetTop-t.scrollTop)-3}if(l){var o=r.get(e._x,e._y)
;o>=0&&(r.set_id(o),
null===l.active_node?n.show(e,h,"98px",(function(e){})):r.move())}}
return o.addEventListener?o.addEventListener("click",a,!1):o.attachEvent("onclick",a),
this}}}));