!function(){var n={version:"3.5.17"},t=[].slice,e=function(n){return t.call(n)
},r=this.document;function i(n){
return n&&(n.ownerDocument||n.document||n).documentElement}function u(n){
return n&&(n.ownerDocument&&n.ownerDocument.defaultView||n.document&&n||n.defaultView)
}if(r)try{e(r.documentElement.childNodes)[0].nodeType}catch(nl){e=function(n){
for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}}
if(Date.now||(Date.now=function(){return+new Date}),r)try{
r.createElement("DIV").style.setProperty("opacity",0,"")}catch(tl){
var o=this.Element.prototype,a=o.setAttribute,l=o.setAttributeNS,c=this.CSSStyleDeclaration.prototype,f=c.setProperty
;o.setAttribute=function(n,t){a.call(this,n,t+"")
},o.setAttributeNS=function(n,t,e){l.call(this,n,t,e+"")
},c.setProperty=function(n,t,e){f.call(this,n,t+"",e)}}function s(n,t){
return n<t?-1:n>t?1:n>=t?0:NaN}function h(n){return null===n?NaN:+n}
function p(n){return!isNaN(n)}function g(n){return{left:function(t,e,r,i){
for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);r<i;){
var u=r+i>>>1;n(t[u],e)<0?r=u+1:i=u}return r},right:function(t,e,r,i){
for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);r<i;){
var u=r+i>>>1;n(t[u],e)>0?i=u:r=u+1}return r}}}
n.ascending=s,n.descending=function(n,t){return t<n?-1:t>n?1:t>=n?0:NaN
},n.min=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){
for(;++i<u;)if(null!=(r=n[i])&&r>=r){e=r;break}
for(;++i<u;)null!=(r=n[i])&&e>r&&(e=r)}else{
for(;++i<u;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=r;break}
for(;++i<u;)null!=(r=t.call(n,n[i],i))&&e>r&&(e=r)}return e
},n.max=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){
for(;++i<u;)if(null!=(r=n[i])&&r>=r){e=r;break}
for(;++i<u;)null!=(r=n[i])&&r>e&&(e=r)}else{
for(;++i<u;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=r;break}
for(;++i<u;)null!=(r=t.call(n,n[i],i))&&r>e&&(e=r)}return e
},n.extent=function(n,t){var e,r,i,u=-1,o=n.length;if(1===arguments.length){
for(;++u<o;)if(null!=(r=n[u])&&r>=r){e=i=r;break}
for(;++u<o;)null!=(r=n[u])&&(e>r&&(e=r),i<r&&(i=r))}else{
for(;++u<o;)if(null!=(r=t.call(n,n[u],u))&&r>=r){e=i=r;break}
for(;++u<o;)null!=(r=t.call(n,n[u],u))&&(e>r&&(e=r),i<r&&(i=r))}return[e,i]
},n.sum=function(n,t){var e,r=0,i=n.length,u=-1
;if(1===arguments.length)for(;++u<i;)p(e=+n[u])&&(r+=e);else for(;++u<i;)p(e=+t.call(n,n[u],u))&&(r+=e)
;return r},n.mean=function(n,t){var e,r=0,i=n.length,u=-1,o=i
;if(1===arguments.length)for(;++u<i;)p(e=h(n[u]))?r+=e:--o;else for(;++u<i;)p(e=h(t.call(n,n[u],u)))?r+=e:--o
;if(o)return r/o},n.quantile=function(n,t){
var e=(n.length-1)*t+1,r=Math.floor(e),i=+n[r-1],u=e-r;return u?i+u*(n[r]-i):i},
n.median=function(t,e){var r,i=[],u=t.length,o=-1
;if(1===arguments.length)for(;++o<u;)p(r=h(t[o]))&&i.push(r);else for(;++o<u;)p(r=h(e.call(t,t[o],o)))&&i.push(r)
;if(i.length)return n.quantile(i.sort(s),.5)},n.variance=function(n,t){
var e,r,i=n.length,u=0,o=0,a=-1,l=0
;if(1===arguments.length)for(;++a<i;)p(e=h(n[a]))&&(o+=(r=e-u)*(e-(u+=r/++l)));else for(;++a<i;)p(e=h(t.call(n,n[a],a)))&&(o+=(r=e-u)*(e-(u+=r/++l)))
;if(l>1)return o/(l-1)},n.deviation=function(){
var t=n.variance.apply(this,arguments);return t?Math.sqrt(t):t};var v=g(s)
;function d(n){return n.length}
n.bisectLeft=v.left,n.bisect=n.bisectRight=v.right,n.bisector=function(n){
return g(1===n.length?function(t,e){return s(n(t),e)}:n)
},n.shuffle=function(n,t,e){(u=arguments.length)<3&&(e=n.length,u<2&&(t=0))
;for(var r,i,u=e-t;u;)i=Math.random()*u--|0,r=n[u+t],n[u+t]=n[i+t],n[i+t]=r
;return n},n.permute=function(n,t){
for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r
},n.pairs=function(n){
for(var t=0,e=n.length-1,r=n[0],i=new Array(e<0?0:e);t<e;)i[t]=[r,r=n[++t]]
;return i},n.transpose=function(t){if(!(u=t.length))return[]
;for(var e=-1,r=n.min(t,d),i=new Array(r);++e<r;)for(var u,o=-1,a=i[e]=new Array(u);++o<u;)a[o]=t[o][e]
;return i},n.zip=function(){return n.transpose(arguments)},n.keys=function(n){
var t=[];for(var e in n)t.push(e);return t},n.values=function(n){var t=[]
;for(var e in n)t.push(n[e]);return t},n.entries=function(n){var t=[]
;for(var e in n)t.push({key:e,value:n[e]});return t},n.merge=function(n){
for(var t,e,r,i=n.length,u=-1,o=0;++u<i;)o+=n[u].length
;for(e=new Array(o);--i>=0;)for(t=(r=n[i]).length;--t>=0;)e[--o]=r[t];return e}
;var y=Math.abs;function m(n){for(var t=1;n*t%1;)t*=10;return t}function M(n,t){
for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}
function x(){this._=Object.create(null)}n.range=function(n,t,e){
if(arguments.length<3&&(e=1,
arguments.length<2&&(t=n,n=0)),(t-n)/e==1/0)throw new Error("infinite range")
;var r,i=[],u=m(y(e)),o=-1
;if(n*=u,t*=u,(e*=u)<0)for(;(r=n+e*++o)>t;)i.push(r/u);else for(;(r=n+e*++o)<t;)i.push(r/u)
;return i},n.map=function(n,t){var e=new x
;if(n instanceof x)n.forEach((function(n,t){e.set(n,t)
}));else if(Array.isArray(n)){var r,i=-1,u=n.length
;if(1===arguments.length)for(;++i<u;)e.set(i,n[i]);else for(;++i<u;)e.set(t.call(n,r=n[i],i),r)
}else for(var o in n)e.set(o,n[o]);return e};var b="__proto__",_="\0"
;function w(n){return(n+="")===b||n[0]===_?_+n:n}function S(n){
return(n+="")[0]===_?n.slice(1):n}function k(n){return w(n)in this._}
function N(n){return(n=w(n))in this._&&delete this._[n]}function E(){var n=[]
;for(var t in this._)n.push(S(t));return n}function A(){var n=0
;for(var t in this._)++n;return n}function C(){for(var n in this._)return!1
;return!0}function z(){this._=Object.create(null)}function L(n){return n}
function q(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}
}function T(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.slice(1)
;for(var e=0,r=R.length;e<r;++e){var i=R[e]+t;if(i in n)return i}}M(x,{has:k,
get:function(n){return this._[w(n)]},set:function(n,t){return this._[w(n)]=t},
remove:N,keys:E,values:function(){var n=[];for(var t in this._)n.push(this._[t])
;return n},entries:function(){var n=[];for(var t in this._)n.push({key:S(t),
value:this._[t]});return n},size:A,empty:C,forEach:function(n){
for(var t in this._)n.call(this,S(t),this._[t])}}),n.nest=function(){
var t,e,r={},i=[],u=[];function o(n,u,a){
if(a>=i.length)return e?e.call(r,u):t?u.sort(t):u
;for(var l,c,f,s,h=-1,p=u.length,g=i[a++],v=new x;++h<p;)(s=v.get(l=g(c=u[h])))?s.push(c):v.set(l,[c])
;return n?(c=n(),f=function(t,e){c.set(t,o(n,e,a))}):(c={},f=function(t,e){
c[t]=o(n,e,a)}),v.forEach(f),c}return r.map=function(n,t){return o(t,n,0)
},r.entries=function(t){return function n(t,e){if(e>=i.length)return t
;var r=[],o=u[e++];return t.forEach((function(t,i){r.push({key:t,values:n(i,e)})
})),o?r.sort((function(n,t){return o(n.key,t.key)})):r}(o(n.map,t,0),0)
},r.key=function(n){return i.push(n),r},r.sortKeys=function(n){
return u[i.length-1]=n,r},r.sortValues=function(n){return t=n,r
},r.rollup=function(n){return e=n,r},r},n.set=function(n){var t=new z
;if(n)for(var e=0,r=n.length;e<r;++e)t.add(n[e]);return t},M(z,{has:k,
add:function(n){return this._[w(n+="")]=!0,n},remove:N,values:E,size:A,empty:C,
forEach:function(n){for(var t in this._)n.call(this,S(t))}
}),n.behavior={},n.rebind=function(n,t){
for(var e,r=1,i=arguments.length;++r<i;)n[e=arguments[r]]=q(n,t,t[e]);return n}
;var R=["webkit","ms","moz","Moz","o","O"];function D(){}function P(){}
function U(n){var t=[],e=new x;function r(){
for(var e,r=t,i=-1,u=r.length;++i<u;)(e=r[i].on)&&e.apply(this,arguments)
;return n}return r.on=function(r,i){var u,o=e.get(r)
;return arguments.length<2?o&&o.on:(o&&(o.on=null,
t=t.slice(0,u=t.indexOf(o)).concat(t.slice(u+1)),
e.remove(r)),i&&t.push(e.set(r,{on:i})),n)},r}function j(){
n.event.preventDefault()}function F(){for(var t,e=n.event;t=e.sourceEvent;)e=t
;return e}function H(t){
for(var e=new P,r=0,i=arguments.length;++r<i;)e[arguments[r]]=U(e)
;return e.of=function(r,i){return function(u){try{var o=u.sourceEvent=n.event
;u.target=t,n.event=u,e[u.type].apply(r,i)}finally{n.event=o}}},e}
n.dispatch=function(){
for(var n=new P,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=U(n);return n
},P.prototype.on=function(n,t){var e=n.indexOf("."),r=""
;if(e>=0&&(r=n.slice(e+1),
n=n.slice(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t)
;if(2===arguments.length){
if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}
},n.event=null,n.requote=function(n){return n.replace(O,"\\$&")}
;var O=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,I={}.__proto__?function(n,t){
n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]};function Y(n){
return I(n,$),n}var Z=function(n,t){return t.querySelector(n)},V=function(n,t){
return t.querySelectorAll(n)},X=function(n,t){
var e=n.matches||n[T(n,"matchesSelector")];return(X=function(n,t){
return e.call(n,t)})(n,t)};"function"==typeof Sizzle&&(Z=function(n,t){
return Sizzle(n,t)[0]||null
},V=Sizzle,X=Sizzle.matchesSelector),n.selection=function(){
return n.select(r.documentElement)};var $=n.selection.prototype=[]
;function B(n){return"function"==typeof n?n:function(){return Z(n,this)}}
function W(n){return"function"==typeof n?n:function(){return V(n,this)}}
$.select=function(n){var t,e,r,i,u=[];n=B(n);for(var o=-1,a=this.length;++o<a;){
u.push(t=[]),t.parentNode=(r=this[o]).parentNode
;for(var l=-1,c=r.length;++l<c;)(i=r[l])?(t.push(e=n.call(i,i.__data__,l,o)),
e&&"__data__"in i&&(e.__data__=i.__data__)):t.push(null)}return Y(u)
},$.selectAll=function(n){var t,r,i=[];n=W(n)
;for(var u=-1,o=this.length;++u<o;)for(var a=this[u],l=-1,c=a.length;++l<c;)(r=a[l])&&(i.push(t=e(n.call(r,r.__data__,l,u))),
t.parentNode=r);return Y(i)};var J="http://www.w3.org/1999/xhtml",G={
svg:"http://www.w3.org/2000/svg",xhtml:J,xlink:"http://www.w3.org/1999/xlink",
xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"
};function K(t,e){return t=n.ns.qualify(t),null==e?t.local?function(){
this.removeAttributeNS(t.space,t.local)}:function(){this.removeAttribute(t)
}:"function"==typeof e?t.local?function(){var n=e.apply(this,arguments)
;null==n?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,n)
}:function(){var n=e.apply(this,arguments)
;null==n?this.removeAttribute(t):this.setAttribute(t,n)}:t.local?function(){
this.setAttributeNS(t.space,t.local,e)}:function(){this.setAttribute(t,e)}}
function Q(n){return n.trim().replace(/\s+/g," ")}function nn(t){
return new RegExp("(?:^|\\s+)"+n.requote(t)+"(?:\\s+|$)","g")}function tn(n){
return(n+"").trim().split(/^|\s+/)}function en(n,t){
var e=(n=tn(n).map(rn)).length;return"function"==typeof t?function(){
for(var r=-1,i=t.apply(this,arguments);++r<e;)n[r](this,i)}:function(){
for(var r=-1;++r<e;)n[r](this,t)}}function rn(n){var t=nn(n)
;return function(e,r){if(i=e.classList)return r?i.add(n):i.remove(n)
;var i=e.getAttribute("class")||""
;r?(t.lastIndex=0,t.test(i)||e.setAttribute("class",Q(i+" "+n))):e.setAttribute("class",Q(i.replace(t," ")))
}}function un(n,t,e){return null==t?function(){this.style.removeProperty(n)
}:"function"==typeof t?function(){var r=t.apply(this,arguments)
;null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}:function(){
this.style.setProperty(n,t,e)}}function on(n,t){return null==t?function(){
delete this[n]}:"function"==typeof t?function(){var e=t.apply(this,arguments)
;null==e?delete this[n]:this[n]=e}:function(){this[n]=t}}function an(t){
return"function"==typeof t?t:(t=n.ns.qualify(t)).local?function(){
return this.ownerDocument.createElementNS(t.space,t.local)}:function(){
var n=this.ownerDocument,e=this.namespaceURI
;return e===J&&n.documentElement.namespaceURI===J?n.createElement(t):n.createElementNS(e,t)
}}function ln(){var n=this.parentNode;n&&n.removeChild(this)}function cn(n){
return{__data__:n}}function fn(n){return function(){return X(this,n)}}
function sn(n){return arguments.length||(n=s),function(t,e){
return t&&e?n(t.__data__,e.__data__):!t-!e}}function hn(n,t){
for(var e=0,r=n.length;e<r;e++)for(var i,u=n[e],o=0,a=u.length;o<a;o++)(i=u[o])&&t(i,o,e)
;return n}function pn(n){return I(n,gn),n}n.ns={prefix:G,qualify:function(n){
var t=n.indexOf(":"),e=n
;return t>=0&&"xmlns"!==(e=n.slice(0,t))&&(n=n.slice(t+1)),G.hasOwnProperty(e)?{
space:G[e],local:n}:n}},$.attr=function(t,e){if(arguments.length<2){
if("string"==typeof t){var r=this.node()
;return(t=n.ns.qualify(t)).local?r.getAttributeNS(t.space,t.local):r.getAttribute(t)
}for(e in t)this.each(K(e,t[e]));return this}return this.each(K(t,e))
},$.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){
var e=this.node(),r=(n=tn(n)).length,i=-1;if(t=e.classList){
for(;++i<r;)if(!t.contains(n[i]))return!1
}else for(t=e.getAttribute("class");++i<r;)if(!nn(n[i]).test(t))return!1
;return!0}for(t in n)this.each(en(t,n[t]));return this}return this.each(en(n,t))
},$.style=function(n,t,e){var r=arguments.length;if(r<3){if("string"!=typeof n){
for(e in r<2&&(t=""),n)this.each(un(e,n[e],t));return this}if(r<2){
var i=this.node();return u(i).getComputedStyle(i,null).getPropertyValue(n)}e=""}
return this.each(un(n,t,e))},$.property=function(n,t){if(arguments.length<2){
if("string"==typeof n)return this.node()[n];for(t in n)this.each(on(t,n[t]))
;return this}return this.each(on(n,t))},$.text=function(n){
return arguments.length?this.each("function"==typeof n?function(){
var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){
this.textContent=""}:function(){this.textContent=n}):this.node().textContent
},$.html=function(n){
return arguments.length?this.each("function"==typeof n?function(){
var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){
this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML
},$.append=function(n){return n=an(n),this.select((function(){
return this.appendChild(n.apply(this,arguments))}))},$.insert=function(n,t){
return n=an(n),t=B(t),this.select((function(){
return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments)||null)
}))},$.remove=function(){return this.each(ln)},$.data=function(n,t){
var e,r,i=-1,u=this.length;if(!arguments.length){
for(n=new Array(u=(e=this[0]).length);++i<u;)(r=e[i])&&(n[i]=r.__data__)
;return n}function o(n,e){
var r,i,u,o=n.length,f=e.length,s=Math.min(o,f),h=new Array(f),p=new Array(f),g=new Array(o)
;if(t){var v,d=new x,y=new Array(o)
;for(r=-1;++r<o;)(i=n[r])&&(d.has(v=t.call(i,i.__data__,r))?g[r]=i:d.set(v,i),
y[r]=v)
;for(r=-1;++r<f;)(i=d.get(v=t.call(e,u=e[r],r)))?!0!==i&&(h[r]=i,i.__data__=u):p[r]=cn(u),
d.set(v,!0);for(r=-1;++r<o;)r in y&&!0!==d.get(y[r])&&(g[r]=n[r])}else{
for(r=-1;++r<s;)i=n[r],u=e[r],i?(i.__data__=u,h[r]=i):p[r]=cn(u)
;for(;r<f;++r)p[r]=cn(e[r]);for(;r<o;++r)g[r]=n[r]}
p.update=h,p.parentNode=h.parentNode=g.parentNode=n.parentNode,
a.push(p),l.push(h),c.push(g)}var a=pn([]),l=Y([]),c=Y([])
;if("function"==typeof n)for(;++i<u;)o(e=this[i],n.call(e,e.parentNode.__data__,i));else for(;++i<u;)o(e=this[i],n)
;return l.enter=function(){return a},l.exit=function(){return c},l
},$.datum=function(n){
return arguments.length?this.property("__data__",n):this.property("__data__")
},$.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=fn(n))
;for(var u=0,o=this.length;u<o;u++){
i.push(t=[]),t.parentNode=(e=this[u]).parentNode
;for(var a=0,l=e.length;a<l;a++)(r=e[a])&&n.call(r,r.__data__,a,u)&&t.push(r)}
return Y(i)},$.order=function(){
for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],i=r.length-1,u=r[i];--i>=0;)(e=r[i])&&(u&&u!==e.nextSibling&&u.parentNode.insertBefore(e,u),
u=e);return this},$.sort=function(n){n=sn.apply(this,arguments)
;for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()
},$.each=function(n){return hn(this,(function(t,e,r){n.call(t,t.__data__,e,r)}))
},$.call=function(n){var t=e(arguments);return n.apply(t[0]=this,t),this
},$.empty=function(){return!this.node()},$.node=function(){
for(var n=0,t=this.length;n<t;n++)for(var e=this[n],r=0,i=e.length;r<i;r++){
var u=e[r];if(u)return u}return null},$.size=function(){var n=0
;return hn(this,(function(){++n})),n};var gn=[];function vn(n){var t,e
;return function(r,i,u){var o,a=n[u].update,l=a.length
;for(u!=e&&(e=u,t=0),i>=t&&(t=i+1);!(o=a[t])&&++t<l;);return o}}
function dn(t,r,i){var u="__on"+t,o=t.indexOf("."),a=mn;o>0&&(t=t.slice(0,o))
;var l=yn.get(t);function c(){var n=this[u]
;n&&(this.removeEventListener(t,n,n.$),delete this[u])}
return l&&(t=l,a=Mn),o?r?function(){var n=a(r,e(arguments))
;c.call(this),this.addEventListener(t,this[u]=n,n.$=i),n._=r}:c:r?D:function(){
var e,r=new RegExp("^__on([^.]+)"+n.requote(t)+"$")
;for(var i in this)if(e=i.match(r)){var u=this[i]
;this.removeEventListener(e[1],u,u.$),delete this[i]}}}
n.selection.enter=pn,n.selection.enter.prototype=gn,
gn.append=$.append,gn.empty=$.empty,
gn.node=$.node,gn.call=$.call,gn.size=$.size,gn.select=function(n){
for(var t,e,r,i,u,o=[],a=-1,l=this.length;++a<l;){
r=(i=this[a]).update,o.push(t=[]),t.parentNode=i.parentNode
;for(var c=-1,f=i.length;++c<f;)(u=i[c])?(t.push(r[c]=e=n.call(i.parentNode,u.__data__,c,a)),
e.__data__=u.__data__):t.push(null)}return Y(o)},gn.insert=function(n,t){
return arguments.length<2&&(t=vn(this)),$.insert.call(this,n,t)
},n.select=function(n){var t
;return"string"==typeof n?(t=[Z(n,r)]).parentNode=r.documentElement:(t=[n]).parentNode=i(n),
Y([t])},n.selectAll=function(n){var t
;return"string"==typeof n?(t=e(V(n,r))).parentNode=r.documentElement:(t=e(n)).parentNode=null,
Y([t])},$.on=function(n,t,e){var r=arguments.length;if(r<3){
if("string"!=typeof n){for(e in r<2&&(t=!1),n)this.each(dn(e,n[e],t))
;return this}if(r<2)return(r=this.node()["__on"+n])&&r._;e=!1}
return this.each(dn(n,t,e))};var yn=n.map({mouseenter:"mouseover",
mouseleave:"mouseout"});function mn(t,e){return function(r){var i=n.event
;n.event=r,e[0]=this.__data__;try{t.apply(this,e)}finally{n.event=i}}}
function Mn(n,t){var e=mn(n,t);return function(n){var t=n.relatedTarget
;t&&(t===this||8&t.compareDocumentPosition(this))||e.call(this,n)}}
r&&yn.forEach((function(n){"on"+n in r&&yn.remove(n)}));var xn,bn=0
;function _n(t){
var e=".dragsuppress-"+ ++bn,r="click"+e,o=n.select(u(t)).on("touchmove"+e,j).on("dragstart"+e,j).on("selectstart"+e,j)
;if(null==xn&&(xn=!("onselectstart"in t)&&T(t.style,"userSelect")),xn){
var a=i(t).style,l=a[xn];a[xn]="none"}return function(n){
if(o.on(e,null),xn&&(a[xn]=l),n){var t=function(){o.on(r,null)}
;o.on(r,(function(){j(),t()}),!0),setTimeout(t,0)}}}n.mouse=function(n){
return Sn(n,F())}
;var wn=this.navigator&&/WebKit/.test(this.navigator.userAgent)?-1:0
;function Sn(t,e){e.changedTouches&&(e=e.changedTouches[0])
;var r=t.ownerSVGElement||t;if(r.createSVGPoint){var i=r.createSVGPoint()
;if(wn<0){var o=u(t);if(o.scrollX||o.scrollY){
var a=(r=n.select("body").append("svg").style({position:"absolute",top:0,left:0,
margin:0,padding:0,border:"none"},"important"))[0][0].getScreenCTM()
;wn=!(a.f||a.e),r.remove()}}
return wn?(i.x=e.pageX,i.y=e.pageY):(i.x=e.clientX,i.y=e.clientY),
[(i=i.matrixTransform(t.getScreenCTM().inverse())).x,i.y]}
var l=t.getBoundingClientRect()
;return[e.clientX-l.left-t.clientLeft,e.clientY-l.top-t.clientTop]}
function kn(){return n.event.changedTouches[0].identifier}
n.touch=function(n,t,e){
if(arguments.length<3&&(e=t,t=F().changedTouches),t)for(var r,i=0,u=t.length;i<u;++i)if((r=t[i]).identifier===e)return Sn(n,r)
},n.behavior.drag=function(){
var t=H(o,"drag","dragstart","dragend"),e=null,r=a(D,n.mouse,u,"mousemove","mouseup"),i=a(kn,n.touch,L,"touchmove","touchend")
;function o(){this.on("mousedown.drag",r).on("touchstart.drag",i)}
function a(r,i,u,o,a){return function(){
var l,c=this,f=n.event.target.correspondingElement||n.event.target,s=c.parentNode,h=t.of(c,arguments),p=0,g=r(),v=".drag"+(null==g?"":"-"+g),d=n.select(u(f)).on(o+v,M).on(a+v,x),y=_n(f),m=i(s,g)
;function M(){var n,t,e=i(s,g);e&&(n=e[0]-m[0],t=e[1]-m[1],p|=n|t,m=e,h({
type:"drag",x:e[0]+l[0],y:e[1]+l[1],dx:n,dy:t}))}function x(){
i(s,g)&&(d.on(o+v,null).on(a+v,null),y(p),h({type:"dragend"}))}
l=e?[(l=e.apply(c,arguments)).x-m[0],l.y-m[1]]:[0,0],h({type:"dragstart"})}}
return o.origin=function(n){return arguments.length?(e=n,o):e
},n.rebind(o,t,"on")},n.touches=function(n,t){
return arguments.length<2&&(t=F().touches),t?e(t).map((function(t){var e=Sn(n,t)
;return e.identifier=t.identifier,e})):[]}
;var Nn=1e-6,En=Nn*Nn,An=Math.PI,Cn=2*An,zn=Cn-Nn,Ln=An/2,qn=An/180,Tn=180/An
;function Rn(n){return n>0?1:n<0?-1:0}function Dn(n,t,e){
return(t[0]-n[0])*(e[1]-n[1])-(t[1]-n[1])*(e[0]-n[0])}function Pn(n){
return n>1?0:n<-1?An:Math.acos(n)}function Un(n){
return n>1?Ln:n<-1?-Ln:Math.asin(n)}function jn(n){return((n=Math.exp(n))+1/n)/2
}function Fn(n){return(n=Math.sin(n/2))*n}var Hn=Math.SQRT2
;n.interpolateZoom=function(n,t){
var e,r,i=n[0],u=n[1],o=n[2],a=t[0],l=t[1],c=t[2],f=a-i,s=l-u,h=f*f+s*s
;if(h<En)r=Math.log(c/o)/Hn,e=function(n){return[i+n*f,u+n*s,o*Math.exp(Hn*n*r)]
};else{
var p=Math.sqrt(h),g=(c*c-o*o+4*h)/(2*o*2*p),v=(c*c-o*o-4*h)/(2*c*2*p),d=Math.log(Math.sqrt(g*g+1)-g),y=Math.log(Math.sqrt(v*v+1)-v)
;r=(y-d)/Hn,e=function(n){var t=n*r,e=jn(d),a=o/(2*p)*(e*function(n){
return((n=Math.exp(2*n))-1)/(n+1)}(Hn*t+d)-function(n){
return((n=Math.exp(n))-1/n)/2}(d));return[i+a*f,u+a*s,o*e/jn(Hn*t+d)]}}
return e.duration=1e3*r,e},n.behavior.zoom=function(){var t,e,i,o,a,l,c,f,s,h={
x:0,y:0,k:1
},p=[960,500],g=Yn,v=250,d=0,y="mousedown.zoom",m="mousemove.zoom",M="mouseup.zoom",x="touchstart.zoom",b=H(_,"zoomstart","zoom","zoomend")
;function _(n){n.on(y,L).on(In+".zoom",T).on("dblclick.zoom",R).on(x,q)}
function w(n){return[(n[0]-h.x)/h.k,(n[1]-h.y)/h.k]}function S(n){
h.k=Math.max(g[0],Math.min(g[1],n))}function k(n,t){t=function(n){
return[n[0]*h.k+h.x,n[1]*h.k+h.y]}(t),h.x+=n[0]-t[0],h.y+=n[1]-t[1]}
function N(t,r,i,u){t.__chart__={x:h.x,y:h.y,k:h.k
},S(Math.pow(2,u)),k(e=r,i),t=n.select(t),
v>0&&(t=t.transition().duration(v)),t.call(_.event)}function E(){
c&&c.domain(l.range().map((function(n){return(n-h.x)/h.k
})).map(l.invert)),s&&s.domain(f.range().map((function(n){return(n-h.y)/h.k
})).map(f.invert))}function A(n){d++||n({type:"zoomstart"})}function C(n){
E(),n({type:"zoom",scale:h.k,translate:[h.x,h.y]})}function z(n){--d||(n({
type:"zoomend"}),e=null)}function L(){
var t=this,e=b.of(t,arguments),r=0,i=n.select(u(t)).on(m,(function(){
r=1,k(n.mouse(t),o),C(e)})).on(M,(function(){i.on(m,null).on(M,null),a(r),z(e)
})),o=w(n.mouse(t)),a=_n(t);wa.call(t),A(e)}function q(){
var t,e=this,r=b.of(e,arguments),i={},u=0,o=".zoom-"+n.event.changedTouches[0].identifier,l="touchmove"+o,c="touchend"+o,f=[],s=n.select(e),p=_n(e)
;function g(){var r=n.touches(e);return t=h.k,r.forEach((function(n){
n.identifier in i&&(i[n.identifier]=w(n))})),r}function v(){var t=n.event.target
;n.select(t).on(l,d).on(c,m),f.push(t)
;for(var r=n.event.changedTouches,o=0,s=r.length;o<s;++o)i[r[o].identifier]=null
;var p=g(),v=Date.now();if(1===p.length){if(v-a<500){var y=p[0]
;N(e,y,i[y.identifier],Math.floor(Math.log(h.k)/Math.LN2)+1),j()}a=v
}else if(p.length>1){y=p[0];var M=p[1],x=y[0]-M[0],b=y[1]-M[1];u=x*x+b*b}}
function d(){var o,l,c,f,s=n.touches(e);wa.call(e)
;for(var h=0,p=s.length;h<p;++h,f=null)if(c=s[h],f=i[c.identifier]){if(l)break
;o=c,l=f}if(f){var g=(g=c[0]-o[0])*g+(g=c[1]-o[1])*g,v=u&&Math.sqrt(g/u)
;o=[(o[0]+c[0])/2,(o[1]+c[1])/2],l=[(l[0]+f[0])/2,(l[1]+f[1])/2],S(v*t)}
a=null,k(o,l),C(r)}function m(){if(n.event.touches.length){
for(var t=n.event.changedTouches,e=0,u=t.length;e<u;++e)delete i[t[e].identifier]
;for(var a in i)return void g()}n.selectAll(f).on(o,null),s.on(y,L).on(x,q),p(),
z(r)}v(),A(r),s.on(y,null).on(x,v)}function T(){var r=b.of(this,arguments)
;o?clearTimeout(o):(wa.call(this),
t=w(e=i||n.mouse(this)),A(r)),o=setTimeout((function(){o=null,z(r)
}),50),j(),S(Math.pow(2,.002*On())*h.k),k(e,t),C(r)}function R(){
var t=n.mouse(this),e=Math.log(h.k)/Math.LN2
;N(this,t,w(t),n.event.shiftKey?Math.ceil(e)-1:Math.floor(e)+1)}
return In||(In="onwheel"in r?(On=function(){
return-n.event.deltaY*(n.event.deltaMode?120:1)
},"wheel"):"onmousewheel"in r?(On=function(){return n.event.wheelDelta
},"mousewheel"):(On=function(){return-n.event.detail
},"MozMousePixelScroll")),_.event=function(t){t.each((function(){
var t=b.of(this,arguments),r=h
;Na?n.select(this).transition().each("start.zoom",(function(){
h=this.__chart__||{x:0,y:0,k:1},A(t)})).tween("zoom:zoom",(function(){
var i=p[0],u=p[1],o=e?e[0]:i/2,a=e?e[1]:u/2,l=n.interpolateZoom([(o-h.x)/h.k,(a-h.y)/h.k,i/h.k],[(o-r.x)/r.k,(a-r.y)/r.k,i/r.k])
;return function(n){var e=l(n),r=i/e[2];this.__chart__=h={x:o-e[0]*r,y:a-e[1]*r,
k:r},C(t)}})).each("interrupt.zoom",(function(){z(t)
})).each("end.zoom",(function(){z(t)})):(this.__chart__=h,A(t),C(t),z(t))}))
},_.translate=function(n){return arguments.length?(h={x:+n[0],y:+n[1],k:h.k
},E(),_):[h.x,h.y]},_.scale=function(n){return arguments.length?(h={x:h.x,y:h.y,
k:null},S(+n),E(),_):h.k},_.scaleExtent=function(n){
return arguments.length?(g=null==n?Yn:[+n[0],+n[1]],_):g},_.center=function(n){
return arguments.length?(i=n&&[+n[0],+n[1]],_):i},_.size=function(n){
return arguments.length?(p=n&&[+n[0],+n[1]],_):p},_.duration=function(n){
return arguments.length?(v=+n,_):v},_.x=function(n){
return arguments.length?(c=n,l=n.copy(),h={x:0,y:0,k:1},_):c},_.y=function(n){
return arguments.length?(s=n,f=n.copy(),h={x:0,y:0,k:1},_):s},n.rebind(_,b,"on")
};var On,In,Yn=[0,1/0];function Zn(){}function Vn(n,t,e){
return this instanceof Vn?(this.h=+n,
this.s=+t,void(this.l=+e)):arguments.length<2?n instanceof Vn?new Vn(n.h,n.s,n.l):pt(""+n,gt,Vn):new Vn(n,t,e)
}n.color=Zn,Zn.prototype.toString=function(){return this.rgb()+""},n.hsl=Vn
;var Xn=Vn.prototype=new Zn;function $n(n,t,e){var r,i;function u(n){
return Math.round(255*function(n){
return n>360?n-=360:n<0&&(n+=360),n<60?r+(i-r)*n/60:n<180?i:n<240?r+(i-r)*(240-n)/60:r
}(n))}
return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:t<0?0:t>1?1:t,r=2*(e=e<0?0:e>1?1:e)-(i=e<=.5?e*(1+t):e+t-e*t),
new lt(u(n+120),u(n),u(n-120))}function Bn(t,e,r){
return this instanceof Bn?(this.h=+t,
this.c=+e,void(this.l=+r)):arguments.length<2?t instanceof Bn?new Bn(t.h,t.c,t.l):it(t instanceof Gn?t.l:(t=vt((t=n.rgb(t)).r,t.g,t.b)).l,t.a,t.b):new Bn(t,e,r)
}Xn.brighter=function(n){
return n=Math.pow(.7,arguments.length?n:1),new Vn(this.h,this.s,this.l/n)
},Xn.darker=function(n){
return n=Math.pow(.7,arguments.length?n:1),new Vn(this.h,this.s,n*this.l)
},Xn.rgb=function(){return $n(this.h,this.s,this.l)},n.hcl=Bn
;var Wn=Bn.prototype=new Zn;function Jn(n,t,e){
return isNaN(n)&&(n=0),isNaN(t)&&(t=0),new Gn(e,Math.cos(n*=qn)*t,Math.sin(n)*t)
}function Gn(n,t,e){
return this instanceof Gn?(this.l=+n,this.a=+t,void(this.b=+e)):arguments.length<2?n instanceof Gn?new Gn(n.l,n.a,n.b):n instanceof Bn?Jn(n.h,n.c,n.l):vt((n=lt(n)).r,n.g,n.b):new Gn(n,t,e)
}Wn.brighter=function(n){
return new Bn(this.h,this.c,Math.min(100,this.l+Kn*(arguments.length?n:1)))
},Wn.darker=function(n){
return new Bn(this.h,this.c,Math.max(0,this.l-Kn*(arguments.length?n:1)))
},Wn.rgb=function(){return Jn(this.h,this.c,this.l).rgb()},n.lab=Gn
;var Kn=18,Qn=.95047,nt=1,tt=1.08883,et=Gn.prototype=new Zn;function rt(n,t,e){
var r=(n+16)/116,i=r+t/500,u=r-e/200
;return new lt(at(3.2404542*(i=ut(i)*Qn)-1.5371385*(r=ut(r)*nt)-.4985314*(u=ut(u)*tt)),at(-.969266*i+1.8760108*r+.041556*u),at(.0556434*i-.2040259*r+1.0572252*u))
}function it(n,t,e){
return n>0?new Bn(Math.atan2(e,t)*Tn,Math.sqrt(t*t+e*e),n):new Bn(NaN,NaN,n)}
function ut(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function ot(n){
return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function at(n){
return Math.round(255*(n<=.00304?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}
function lt(n,t,e){
return this instanceof lt?(this.r=~~n,this.g=~~t,void(this.b=~~e)):arguments.length<2?n instanceof lt?new lt(n.r,n.g,n.b):pt(""+n,lt,$n):new lt(n,t,e)
}function ct(n){return new lt(n>>16,n>>8&255,255&n)}function ft(n){
return ct(n)+""}et.brighter=function(n){
return new Gn(Math.min(100,this.l+Kn*(arguments.length?n:1)),this.a,this.b)
},et.darker=function(n){
return new Gn(Math.max(0,this.l-Kn*(arguments.length?n:1)),this.a,this.b)
},et.rgb=function(){return rt(this.l,this.a,this.b)},n.rgb=lt
;var st=lt.prototype=new Zn;function ht(n){
return n<16?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}
function pt(n,t,e){var r,i,u,o=0,a=0,l=0
;if(r=/([a-z]+)\((.*)\)/.exec(n=n.toLowerCase()))switch(i=r[2].split(","),r[1]){
case"hsl":return e(parseFloat(i[0]),parseFloat(i[1])/100,parseFloat(i[2])/100)
;case"rgb":return t(yt(i[0]),yt(i[1]),yt(i[2]))}
return(u=mt.get(n))?t(u.r,u.g,u.b):(null==n||"#"!==n.charAt(0)||isNaN(u=parseInt(n.slice(1),16))||(4===n.length?(o=(3840&u)>>4,
o|=o>>4,
a=240&u,a|=a>>4,l=15&u,l|=l<<4):7===n.length&&(o=(16711680&u)>>16,a=(65280&u)>>8,
l=255&u)),t(o,a,l))}function gt(n,t,e){
var r,i,u=Math.min(n/=255,t/=255,e/=255),o=Math.max(n,t,e),a=o-u,l=(o+u)/2
;return a?(i=l<.5?a/(o+u):a/(2-o-u),
r=n==o?(t-e)/a+(t<e?6:0):t==o?(e-n)/a+2:(n-t)/a+4,r*=60):(r=NaN,i=l>0&&l<1?0:r),
new Vn(r,i,l)}function vt(n,t,e){
var r=ot((.4124564*(n=dt(n))+.3575761*(t=dt(t))+.1804375*(e=dt(e)))/Qn),i=ot((.2126729*n+.7151522*t+.072175*e)/nt)
;return Gn(116*i-16,500*(r-i),200*(i-ot((.0193339*n+.119192*t+.9503041*e)/tt)))}
function dt(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}
function yt(n){var t=parseFloat(n)
;return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}st.brighter=function(n){
n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,i=30
;return t||e||r?(t&&t<i&&(t=i),
e&&e<i&&(e=i),r&&r<i&&(r=i),new lt(Math.min(255,t/n),Math.min(255,e/n),Math.min(255,r/n))):new lt(i,i,i)
},st.darker=function(n){
return new lt((n=Math.pow(.7,arguments.length?n:1))*this.r,n*this.g,n*this.b)
},st.hsl=function(){return gt(this.r,this.g,this.b)},st.toString=function(){
return"#"+ht(this.r)+ht(this.g)+ht(this.b)};var mt=n.map({aliceblue:15792383,
antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,
beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,
blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,
chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,
cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,
darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,
darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,
darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,
darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,
darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,
deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,
firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,
gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,
gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,
hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,
khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,
lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,
lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,
lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,
lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,
lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,
limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,
mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,
mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,
mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,
midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,
navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,
orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,
palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,
papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,
plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,
red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,
salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,
sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,
slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,
steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,
turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,
whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});function Mt(n){
return"function"==typeof n?n:function(){return n}}function xt(n){
return function(t,e,r){
return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),bt(t,e,n,r)}}
function bt(t,r,i,u){
var o={},a=n.dispatch("beforesend","progress","load","error"),l={},c=new XMLHttpRequest,f=null
;function s(){var n,t=c.status;if(!t&&function(n){var t=n.responseType
;return t&&"text"!==t?n.response:n.responseText}(c)||t>=200&&t<300||304===t){
try{n=i.call(o,c)}catch(nl){return void a.error.call(o,nl)}a.load.call(o,n)
}else a.error.call(o,c)}
return!this.XDomainRequest||"withCredentials"in c||!/^(http(s)?:)?\/\//.test(t)||(c=new XDomainRequest),
"onload"in c?c.onload=c.onerror=s:c.onreadystatechange=function(){
c.readyState>3&&s()},c.onprogress=function(t){var e=n.event;n.event=t;try{
a.progress.call(o,c)}finally{n.event=e}},o.header=function(n,t){
return n=(n+"").toLowerCase(),
arguments.length<2?l[n]:(null==t?delete l[n]:l[n]=t+"",o)
},o.mimeType=function(n){return arguments.length?(r=null==n?null:n+"",o):r
},o.responseType=function(n){return arguments.length?(f=n,o):f
},o.response=function(n){return i=n,o},["get","post"].forEach((function(n){
o[n]=function(){return o.send.apply(o,[n].concat(e(arguments)))}
})),o.send=function(n,e,i){
if(2===arguments.length&&"function"==typeof e&&(i=e,e=null),
c.open(n,t,!0),null==r||"accept"in l||(l.accept=r+",*/*"),
c.setRequestHeader)for(var u in l)c.setRequestHeader(u,l[u])
;return null!=r&&c.overrideMimeType&&c.overrideMimeType(r),
null!=f&&(c.responseType=f),null!=i&&o.on("error",i).on("load",(function(n){
i(null,n)})),a.beforesend.call(o,c),c.send(null==e?null:e),o
},o.abort=function(){return c.abort(),o
},n.rebind(o,a,"on"),null==u?o:o.get(function(n){
return 1===n.length?function(t,e){n(null==t?e:null)}:n}(u))}
mt.forEach((function(n,t){mt.set(n,ct(t))
})),n.functor=Mt,n.xhr=xt(L),n.dsv=function(n,t){
var e=new RegExp('["'+n+"\n]"),r=n.charCodeAt(0);function i(n,e,r){
arguments.length<3&&(r=e,e=null);var i=bt(n,t,null==e?u:o(e),r)
;return i.row=function(n){
return arguments.length?i.response(null==(e=n)?u:o(n)):e},i}function u(n){
return i.parse(n.responseText)}function o(n){return function(t){
return i.parse(t.responseText,n)}}function a(t){return t.map(l).join(n)}
function l(n){return e.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}
return i.parse=function(n,t){var e;return i.parseRows(n,(function(n,r){
if(e)return e(n,r-1);var i=new Function("d","return {"+n.map((function(n,t){
return JSON.stringify(n)+": d["+t+"]"})).join(",")+"}");e=t?function(n,e){
return t(i(n),e)}:i}))},i.parseRows=function(n,t){
var e,i,u={},o={},a=[],l=n.length,c=0,f=0;function s(){if(c>=l)return o
;if(i)return i=!1,u;var t=c;if(34===n.charCodeAt(t)){
for(var e=t;e++<l;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}
return c=e+2,
13===(a=n.charCodeAt(e+1))?(i=!0,10===n.charCodeAt(e+2)&&++c):10===a&&(i=!0),
n.slice(t+1,e).replace(/""/g,'"')}for(;c<l;){var a,f=1
;if(10===(a=n.charCodeAt(c++)))i=!0;else if(13===a)i=!0,
10===n.charCodeAt(c)&&(++c,++f);else if(a!==r)continue;return n.slice(t,c-f)}
return n.slice(t)}for(;(e=s())!==o;){for(var h=[];e!==u&&e!==o;)h.push(e),e=s()
;t&&null==(h=t(h,f++))||a.push(h)}return a},i.format=function(t){
if(Array.isArray(t[0]))return i.formatRows(t);var e=new z,r=[]
;return t.forEach((function(n){for(var t in n)e.has(t)||r.push(e.add(t))
})),[r.map(l).join(n)].concat(t.map((function(t){return r.map((function(n){
return l(t[n])})).join(n)}))).join("\n")},i.formatRows=function(n){
return n.map(a).join("\n")},i
},n.csv=n.dsv(",","text/csv"),n.tsv=n.dsv("\t","text/tab-separated-values")
;var _t,wt,St,kt,Nt=this[T(this,"requestAnimationFrame")]||function(n){
setTimeout(n,17)};function Et(n,t,e){var r=arguments.length
;r<2&&(t=0),r<3&&(e=Date.now());var i={c:n,t:e+t,n:null}
;return wt?wt.n=i:_t=i,wt=i,St||(kt=clearTimeout(kt),St=1,Nt(At)),i}
function At(){var n=Ct(),t=zt()-n
;t>24?(isFinite(t)&&(clearTimeout(kt),kt=setTimeout(At,t)),St=0):(St=1,Nt(At))}
function Ct(){for(var n=Date.now(),t=_t;t;)n>=t.t&&t.c(n-t.t)&&(t.c=null),t=t.n
;return n}function zt(){
for(var n,t=_t,e=1/0;t;)t.c?(t.t<e&&(e=t.t),t=(n=t).n):t=n?n.n=t.n:_t=t.n
;return wt=n,e}function Lt(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}
n.timer=function(){Et.apply(this,arguments)},n.timer.flush=function(){Ct(),zt()
},n.round=function(n,t){
return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)}
;var qt=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"].map((function(n,t){
var e=Math.pow(10,3*y(8-t));return{scale:t>8?function(n){return n/e
}:function(n){return n*e},symbol:n}}));function Tt(t){
var e=t.decimal,r=t.thousands,i=t.grouping,u=t.currency,o=i&&r?function(n,t){
for(var e=n.length,u=[],o=0,a=i[0],l=0;e>0&&a>0&&(l+a+1>t&&(a=Math.max(1,t-l)),
u.push(n.substring(e-=a,e+a)),!((l+=a+1)>t));)a=i[o=(o+1)%i.length]
;return u.reverse().join(r)}:L;return function(t){
var r=Rt.exec(t),i=r[1]||" ",a=r[2]||">",l=r[3]||"-",c=r[4]||"",f=r[5],s=+r[6],h=r[7],p=r[8],g=r[9],v=1,d="",y="",m=!1,M=!0
;switch(p&&(p=+p.substring(1)),(f||"0"===i&&"="===a)&&(f=i="0",a="="),g){
case"n":h=!0,g="g";break;case"%":v=100,y="%",g="f";break;case"p":
v=100,y="%",g="r";break;case"b":case"o":case"x":case"X":
"#"===c&&(d="0"+g.toLowerCase());case"c":M=!1;case"d":m=!0,p=0;break;case"s":
v=-1,g="r"}
"$"===c&&(d=u[0],y=u[1]),"r"!=g||p||(g="g"),null!=p&&("g"==g?p=Math.max(1,Math.min(21,p)):"e"!=g&&"f"!=g||(p=Math.max(0,Math.min(20,p)))),
g=Dt.get(g)||Pt;var x=f&&h;return function(t){var r=y;if(m&&t%1)return""
;var u=t<0||0===t&&1/t<0?(t=-t,"-"):"-"===l?"":l;if(v<0){
var c=n.formatPrefix(t,p);t=c.scale(t),r=c.symbol+y}else t*=v
;var b,_,w=(t=g(t,p)).lastIndexOf(".");if(w<0){var S=M?t.lastIndexOf("e"):-1
;S<0?(b=t,_=""):(b=t.substring(0,S),_=t.substring(S))
}else b=t.substring(0,w),_=e+t.substring(w+1);!f&&h&&(b=o(b,1/0))
;var k=d.length+b.length+_.length+(x?0:u.length),N=k<s?new Array(k=s-k+1).join(i):""
;return x&&(b=o(N+b,N.length?s-_.length:1/0)),
u+=d,t=b+_,("<"===a?u+t+N:">"===a?N+u+t:"^"===a?N.substring(0,k>>=1)+u+t+N.substring(k):u+(x?t:N+t))+r
}}}n.formatPrefix=function(t,e){var r=0
;return(t=+t)&&(t<0&&(t*=-1),e&&(t=n.round(t,Lt(t,e))),
r=1+Math.floor(1e-12+Math.log(t)/Math.LN10),
r=Math.max(-24,Math.min(24,3*Math.floor((r-1)/3)))),qt[8+r/3]}
;var Rt=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,Dt=n.map({
b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)
},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},
X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){
return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},
f:function(n,t){return n.toFixed(t)},r:function(t,e){
return(t=n.round(t,Lt(t,e))).toFixed(Math.max(0,Math.min(20,Lt(t*(1+1e-15),e))))
}});function Pt(n){return n+""}var Ut=n.time={},jt=Date;function Ft(){
this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}
Ft.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){
return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()
},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){
return this._.getUTCMilliseconds()},getMinutes:function(){
return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},
getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){
return this._.getTime()},getTimezoneOffset:function(){return 0},
valueOf:function(){return this._.valueOf()},setDate:function(){
Ht.setUTCDate.apply(this._,arguments)},setDay:function(){
Ht.setUTCDay.apply(this._,arguments)},setFullYear:function(){
Ht.setUTCFullYear.apply(this._,arguments)},setHours:function(){
Ht.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){
Ht.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){
Ht.setUTCMinutes.apply(this._,arguments)},setMonth:function(){
Ht.setUTCMonth.apply(this._,arguments)},setSeconds:function(){
Ht.setUTCSeconds.apply(this._,arguments)},setTime:function(){
Ht.setTime.apply(this._,arguments)}};var Ht=Date.prototype;function Ot(n,t,e){
function r(t){var e=n(t),r=u(e,1);return t-e<r-t?e:r}function i(e){
return t(e=n(new jt(e-1)),1),e}function u(n,e){return t(n=new jt(+n),e),n}
function o(n,r,u){var o=i(n),a=[];if(u>1)for(;o<r;)e(o)%u||a.push(new Date(+o)),
t(o,1);else for(;o<r;)a.push(new Date(+o)),t(o,1);return a}
n.floor=n,n.round=r,n.ceil=i,n.offset=u,n.range=o;var a=n.utc=It(n)
;return a.floor=a,
a.round=It(r),a.ceil=It(i),a.offset=It(u),a.range=function(n,t,e){try{jt=Ft
;var r=new Ft;return r._=n,o(r,t,e)}finally{jt=Date}},n}function It(n){
return function(t,e){try{jt=Ft;var r=new Ft;return r._=t,n(r,e)._}finally{
jt=Date}}}function Yt(t){
var e=t.dateTime,r=t.date,i=t.time,u=t.periods,o=t.days,a=t.shortDays,l=t.months,c=t.shortMonths
;function f(n){var t=n.length;function e(e){
for(var r,i,u,o=[],a=-1,l=0;++a<t;)37===n.charCodeAt(a)&&(o.push(n.slice(l,a)),
null!=(i=Zt[r=n.charAt(++a)])&&(r=n.charAt(++a)),
(u=b[r])&&(r=u(e,null==i?"e"===r?" ":"0":i)),o.push(r),l=a+1)
;return o.push(n.slice(l,a)),o.join("")}return e.parse=function(t){var e={
y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null};if(s(e,n,t,0)!=t.length)return null
;"p"in e&&(e.H=e.H%12+12*e.p);var r=null!=e.Z&&jt!==Ft,i=new(r?Ft:jt)
;return"j"in e?i.setFullYear(e.y,0,e.j):"W"in e||"U"in e?("w"in e||(e.w="W"in e?1:0),
i.setFullYear(e.y,0,1),
i.setFullYear(e.y,0,"W"in e?(e.w+6)%7+7*e.W-(i.getDay()+5)%7:e.w+7*e.U-(i.getDay()+6)%7)):i.setFullYear(e.y,e.m,e.d),
i.setHours(e.H+(e.Z/100|0),e.M+e.Z%100,e.S,e.L),r?i._:i},e.toString=function(){
return n},e}function s(n,t,e,r){for(var i,u,o,a=0,l=t.length,c=e.length;a<l;){
if(r>=c)return-1;if(37===(i=t.charCodeAt(a++))){
if(o=t.charAt(a++),!(u=_[o in Zt?t.charAt(a++):o])||(r=u(n,e,r))<0)return-1
}else if(i!=e.charCodeAt(r++))return-1}return r}f.utc=function(n){var t=f(n)
;function e(n){try{var e=new(jt=Ft);return e._=n,t(e)}finally{jt=Date}}
return e.parse=function(n){try{jt=Ft;var e=t.parse(n);return e&&e._}finally{
jt=Date}},e.toString=t.toString,e},f.multi=f.utc.multi=se
;var h=n.map(),p=Bt(o),g=Wt(o),v=Bt(a),d=Wt(a),y=Bt(l),m=Wt(l),M=Bt(c),x=Wt(c)
;u.forEach((function(n,t){h.set(n.toLowerCase(),t)}));var b={a:function(n){
return a[n.getDay()]},A:function(n){return o[n.getDay()]},b:function(n){
return c[n.getMonth()]},B:function(n){return l[n.getMonth()]},c:f(e),
d:function(n,t){return $t(n.getDate(),t,2)},e:function(n,t){
return $t(n.getDate(),t,2)},H:function(n,t){return $t(n.getHours(),t,2)},
I:function(n,t){return $t(n.getHours()%12||12,t,2)},j:function(n,t){
return $t(1+Ut.dayOfYear(n),t,3)},L:function(n,t){
return $t(n.getMilliseconds(),t,3)},m:function(n,t){
return $t(n.getMonth()+1,t,2)},M:function(n,t){return $t(n.getMinutes(),t,2)},
p:function(n){return u[+(n.getHours()>=12)]},S:function(n,t){
return $t(n.getSeconds(),t,2)},U:function(n,t){return $t(Ut.sundayOfYear(n),t,2)
},w:function(n){return n.getDay()},W:function(n,t){
return $t(Ut.mondayOfYear(n),t,2)},x:f(r),X:f(i),y:function(n,t){
return $t(n.getFullYear()%100,t,2)},Y:function(n,t){
return $t(n.getFullYear()%1e4,t,4)},Z:ce,"%":function(){return"%"}},_={
a:function(n,t,e){v.lastIndex=0;var r=v.exec(t.slice(e))
;return r?(n.w=d.get(r[0].toLowerCase()),e+r[0].length):-1},A:function(n,t,e){
p.lastIndex=0;var r=p.exec(t.slice(e))
;return r?(n.w=g.get(r[0].toLowerCase()),e+r[0].length):-1},b:function(n,t,e){
M.lastIndex=0;var r=M.exec(t.slice(e))
;return r?(n.m=x.get(r[0].toLowerCase()),e+r[0].length):-1},B:function(n,t,e){
y.lastIndex=0;var r=y.exec(t.slice(e))
;return r?(n.m=m.get(r[0].toLowerCase()),e+r[0].length):-1},c:function(n,t,e){
return s(n,b.c.toString(),t,e)},d:re,e:re,H:ue,I:ue,j:ie,L:le,m:ee,M:oe,
p:function(n,t,e){var r=h.get(t.slice(e,e+=2).toLowerCase())
;return null==r?-1:(n.p=r,e)},S:ae,U:Gt,w:Jt,W:Kt,x:function(n,t,e){
return s(n,b.x.toString(),t,e)},X:function(n,t,e){return s(n,b.X.toString(),t,e)
},y:ne,Y:Qt,Z:te,"%":fe};return f}Ut.year=Ot((function(n){
return(n=Ut.day(n)).setMonth(0,1),n}),(function(n,t){
n.setFullYear(n.getFullYear()+t)}),(function(n){return n.getFullYear()
})),Ut.years=Ut.year.range,
Ut.years.utc=Ut.year.utc.range,Ut.day=Ot((function(n){var t=new jt(2e3,0)
;return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t
}),(function(n,t){n.setDate(n.getDate()+t)}),(function(n){return n.getDate()-1
})),Ut.days=Ut.day.range,Ut.days.utc=Ut.day.utc.range,Ut.dayOfYear=function(n){
var t=Ut.year(n)
;return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)
},
["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].forEach((function(n,t){
t=7-t;var e=Ut[n]=Ot((function(n){
return(n=Ut.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n}),(function(n,t){
n.setDate(n.getDate()+7*Math.floor(t))}),(function(n){var e=Ut.year(n).getDay()
;return Math.floor((Ut.dayOfYear(n)+(e+t)%7)/7)-(e!==t)}))
;Ut[n+"s"]=e.range,Ut[n+"s"].utc=e.utc.range,Ut[n+"OfYear"]=function(n){
var e=Ut.year(n).getDay();return Math.floor((Ut.dayOfYear(n)+(e+t)%7)/7)}
})),Ut.week=Ut.sunday,Ut.weeks=Ut.sunday.range,Ut.weeks.utc=Ut.sunday.utc.range,
Ut.weekOfYear=Ut.sundayOfYear;var Zt={"-":"",_:" ",0:"0"},Vt=/^\s*\d+/,Xt=/^%/
;function $t(n,t,e){var r=n<0?"-":"",i=(r?-n:n)+"",u=i.length
;return r+(u<e?new Array(e-u+1).join(t)+i:i)}function Bt(t){
return new RegExp("^(?:"+t.map(n.requote).join("|")+")","i")}function Wt(n){
for(var t=new x,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}
function Jt(n,t,e){Vt.lastIndex=0;var r=Vt.exec(t.slice(e,e+1))
;return r?(n.w=+r[0],e+r[0].length):-1}function Gt(n,t,e){Vt.lastIndex=0
;var r=Vt.exec(t.slice(e));return r?(n.U=+r[0],e+r[0].length):-1}
function Kt(n,t,e){Vt.lastIndex=0;var r=Vt.exec(t.slice(e));return r?(n.W=+r[0],
e+r[0].length):-1}function Qt(n,t,e){Vt.lastIndex=0
;var r=Vt.exec(t.slice(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}
function ne(n,t,e){Vt.lastIndex=0;var r=Vt.exec(t.slice(e,e+2))
;return r?(n.y=function(n){return n+(n>68?1900:2e3)}(+r[0]),e+r[0].length):-1}
function te(n,t,e){return/^[+-]\d{4}$/.test(t=t.slice(e,e+5))?(n.Z=-t,e+5):-1}
function ee(n,t,e){Vt.lastIndex=0;var r=Vt.exec(t.slice(e,e+2))
;return r?(n.m=r[0]-1,e+r[0].length):-1}function re(n,t,e){Vt.lastIndex=0
;var r=Vt.exec(t.slice(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}
function ie(n,t,e){Vt.lastIndex=0;var r=Vt.exec(t.slice(e,e+3))
;return r?(n.j=+r[0],e+r[0].length):-1}function ue(n,t,e){Vt.lastIndex=0
;var r=Vt.exec(t.slice(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}
function oe(n,t,e){Vt.lastIndex=0;var r=Vt.exec(t.slice(e,e+2))
;return r?(n.M=+r[0],e+r[0].length):-1}function ae(n,t,e){Vt.lastIndex=0
;var r=Vt.exec(t.slice(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}
function le(n,t,e){Vt.lastIndex=0;var r=Vt.exec(t.slice(e,e+3))
;return r?(n.L=+r[0],e+r[0].length):-1}function ce(n){
var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=y(t)/60|0,i=y(t)%60
;return e+$t(r,"0",2)+$t(i,"0",2)}function fe(n,t,e){Xt.lastIndex=0
;var r=Xt.exec(t.slice(e,e+1));return r?e+r[0].length:-1}function se(n){
for(var t=n.length,e=-1;++e<t;)n[e][0]=this(n[e][0]);return function(t){
for(var e=0,r=n[e];!r[1](t);)r=n[++e];return r[0](t)}}n.locale=function(n){
return{numberFormat:Tt(n),timeFormat:Yt(n)}};var he=n.locale({decimal:".",
thousands:",",grouping:[3],currency:["$",""],dateTime:"%a %b %e %X %Y",
date:"%m/%d/%Y",time:"%H:%M:%S",periods:["AM","PM"],
days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
months:["January","February","March","April","May","June","July","August","September","October","November","December"],
shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
});function pe(){}n.format=he.numberFormat,n.geo={},pe.prototype={s:0,t:0,
add:function(n){
ve(n,this.t,ge),ve(ge.s,this.s,this),this.s?this.t+=ge.t:this.s=ge.t},
reset:function(){this.s=this.t=0},valueOf:function(){return this.s}}
;var ge=new pe;function ve(n,t,e){var r=e.s=n+t,i=r-n,u=r-i;e.t=n-u+(t-i)}
function de(n,t){n&&me.hasOwnProperty(n.type)&&me[n.type](n,t)}
n.geo.stream=function(n,t){n&&ye.hasOwnProperty(n.type)?ye[n.type](n,t):de(n,t)}
;var ye={Feature:function(n,t){de(n.geometry,t)},
FeatureCollection:function(n,t){
for(var e=n.features,r=-1,i=e.length;++r<i;)de(e[r].geometry,t)}},me={
Sphere:function(n,t){t.sphere()},Point:function(n,t){
n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){
for(var e=n.coordinates,r=-1,i=e.length;++r<i;)n=e[r],t.point(n[0],n[1],n[2])},
LineString:function(n,t){Me(n.coordinates,t,0)},MultiLineString:function(n,t){
for(var e=n.coordinates,r=-1,i=e.length;++r<i;)Me(e[r],t,0)},
Polygon:function(n,t){xe(n.coordinates,t)},MultiPolygon:function(n,t){
for(var e=n.coordinates,r=-1,i=e.length;++r<i;)xe(e[r],t)},
GeometryCollection:function(n,t){
for(var e=n.geometries,r=-1,i=e.length;++r<i;)de(e[r],t)}};function Me(n,t,e){
var r,i=-1,u=n.length-e;for(t.lineStart();++i<u;)r=n[i],t.point(r[0],r[1],r[2])
;t.lineEnd()}function xe(n,t){var e=-1,r=n.length
;for(t.polygonStart();++e<r;)Me(n[e],t,1);t.polygonEnd()}n.geo.area=function(t){
return be=0,n.geo.stream(t,Re),be}
;var be,_e,we,Se,ke,Ne,Ee,Ae,Ce,ze,Le,qe,Te=new pe,Re={sphere:function(){
be+=4*An},point:D,lineStart:D,lineEnd:D,polygonStart:function(){
Te.reset(),Re.lineStart=De},polygonEnd:function(){var n=2*Te
;be+=n<0?4*An+n:n,Re.lineStart=Re.lineEnd=Re.point=D}};function De(){
var n,t,e,r,i;function u(n,t){t=t*qn/2+An/4
;var u=(n*=qn)-e,o=u>=0?1:-1,a=o*u,l=Math.cos(t),c=Math.sin(t),f=i*c,s=r*l+f*Math.cos(a),h=f*o*Math.sin(a)
;Te.add(Math.atan2(h,s)),e=n,r=l,i=c}Re.point=function(o,a){
Re.point=u,e=(n=o)*qn,r=Math.cos(a=(t=a)*qn/2+An/4),i=Math.sin(a)
},Re.lineEnd=function(){u(n,t)}}function Pe(n){var t=n[0],e=n[1],r=Math.cos(e)
;return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function Ue(n,t){
return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function je(n,t){
return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}
function Fe(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function He(n,t){
return[n[0]*t,n[1]*t,n[2]*t]}function Oe(n){
var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}
function Ie(n){return[Math.atan2(n[1],n[0]),Un(n[2])]}function Ye(n,t){
return y(n[0]-t[0])<Nn&&y(n[1]-t[1])<Nn}n.geo.bounds=function(){
var t,e,r,i,u,o,a,l,c,f,s,h={point:p,lineStart:v,lineEnd:d,
polygonStart:function(){
h.point=m,h.lineStart=M,h.lineEnd=x,c=0,Re.polygonStart()},
polygonEnd:function(){
Re.polygonEnd(),h.point=p,h.lineStart=v,h.lineEnd=d,Te<0?(t=-(r=180),
e=-(i=90)):c>Nn?i=90:c<-Nn&&(e=-90),s[0]=t,s[1]=r}};function p(n,u){
f.push(s=[t=n,r=n]),u<e&&(e=u),u>i&&(i=u)}function g(n,o){var a=Pe([n*qn,o*qn])
;if(l){var c=je(l,a),f=je([c[1],-c[0],0],c);Oe(f),f=Ie(f)
;var s=n-u,h=s>0?1:-1,g=f[0]*Tn*h,v=y(s)>180
;if(v^(h*u<g&&g<h*n))(d=f[1]*Tn)>i&&(i=d);else if(v^(h*u<(g=(g+360)%360-180)&&g<h*n)){
var d;(d=-f[1]*Tn)<e&&(e=d)}else o<e&&(e=o),o>i&&(i=o)
;v?n<u?b(t,n)>b(t,r)&&(r=n):b(n,r)>b(t,r)&&(t=n):r>=t?(n<t&&(t=n),
n>r&&(r=n)):n>u?b(t,n)>b(t,r)&&(r=n):b(n,r)>b(t,r)&&(t=n)}else p(n,o);l=a,u=n}
function v(){h.point=g}function d(){s[0]=t,s[1]=r,h.point=p,l=null}
function m(n,t){if(l){var e=n-u;c+=y(e)>180?e+(e>0?360:-360):e}else o=n,a=t
;Re.point(n,t),g(n,t)}function M(){Re.lineStart()}function x(){
m(o,a),Re.lineEnd(),y(c)>Nn&&(t=-(r=180)),s[0]=t,s[1]=r,l=null}function b(n,t){
return(t-=n)<0?t+360:t}function _(n,t){return n[0]-t[0]}function w(n,t){
return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}return function(u){
if(i=r=-(t=e=1/0),f=[],n.geo.stream(u,h),c=f.length){f.sort(_)
;for(var o=1,a=[v=f[0]];o<c;++o)w((p=f[o])[0],v)||w(p[1],v)?(b(v[0],p[1])>b(v[0],v[1])&&(v[1]=p[1]),
b(p[0],v[1])>b(v[0],v[1])&&(v[0]=p[0])):a.push(v=p);for(var l,c,p,g=-1/0,v=(o=0,
a[c=a.length-1]);o<=c;v=p,++o)p=a[o],(l=b(v[1],p[0]))>g&&(g=l,t=p[0],r=v[1])}
return f=s=null,t===1/0||e===1/0?[[NaN,NaN],[NaN,NaN]]:[[t,e],[r,i]]}
}(),n.geo.centroid=function(t){
_e=we=Se=ke=Ne=Ee=Ae=Ce=ze=Le=qe=0,n.geo.stream(t,Ze)
;var e=ze,r=Le,i=qe,u=e*e+r*r+i*i
;return u<En&&(e=Ee,r=Ae,i=Ce,we<Nn&&(e=Se,r=ke,
i=Ne),(u=e*e+r*r+i*i)<En)?[NaN,NaN]:[Math.atan2(r,e)*Tn,Un(i/Math.sqrt(u))*Tn]}
;var Ze={sphere:D,point:Ve,lineStart:$e,lineEnd:Be,polygonStart:function(){
Ze.lineStart=We},polygonEnd:function(){Ze.lineStart=$e}};function Ve(n,t){n*=qn
;var e=Math.cos(t*=qn);Xe(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}
function Xe(n,t,e){++_e,Se+=(n-Se)/_e,ke+=(t-ke)/_e,Ne+=(e-Ne)/_e}function $e(){
var n,t,e;function r(r,i){r*=qn
;var u=Math.cos(i*=qn),o=u*Math.cos(r),a=u*Math.sin(r),l=Math.sin(i),c=Math.atan2(Math.sqrt((c=t*l-e*a)*c+(c=e*o-n*l)*c+(c=n*a-t*o)*c),n*o+t*a+e*l)
;we+=c,Ee+=c*(n+(n=o)),Ae+=c*(t+(t=a)),Ce+=c*(e+(e=l)),Xe(n,t,e)}
Ze.point=function(i,u){i*=qn;var o=Math.cos(u*=qn)
;n=o*Math.cos(i),t=o*Math.sin(i),e=Math.sin(u),Ze.point=r,Xe(n,t,e)}}
function Be(){Ze.point=Ve}function We(){var n,t,e,r,i;function u(n,t){n*=qn
;var u=Math.cos(t*=qn),o=u*Math.cos(n),a=u*Math.sin(n),l=Math.sin(t),c=r*l-i*a,f=i*o-e*l,s=e*a-r*o,h=Math.sqrt(c*c+f*f+s*s),p=e*o+r*a+i*l,g=h&&-Pn(p)/h,v=Math.atan2(h,p)
;ze+=g*c,
Le+=g*f,qe+=g*s,we+=v,Ee+=v*(e+(e=o)),Ae+=v*(r+(r=a)),Ce+=v*(i+(i=l)),Xe(e,r,i)}
Ze.point=function(o,a){n=o,t=a,Ze.point=u,o*=qn;var l=Math.cos(a*=qn)
;e=l*Math.cos(o),r=l*Math.sin(o),i=Math.sin(a),Xe(e,r,i)},Ze.lineEnd=function(){
u(n,t),Ze.lineEnd=Be,Ze.point=Ve}}function Je(n,t){function e(e,r){
return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){
return(e=t.invert(e,r))&&n.invert(e[0],e[1])}),e}function Ge(){return!0}
function Ke(n,t,e,r,i){var u=[],o=[];if(n.forEach((function(n){
if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(Ye(e,r)){i.lineStart()
;for(var a=0;a<t;++a)i.point((e=n[a])[0],e[1]);i.lineEnd()}else{
var l=new nr(e,n,null,!0),c=new nr(e,null,l,!1)
;l.o=c,u.push(l),o.push(c),l=new nr(r,n,null,!1),
c=new nr(r,null,l,!0),l.o=c,u.push(l),o.push(c)}}
})),o.sort(t),Qe(u),Qe(o),u.length){
for(var a=0,l=e,c=o.length;a<c;++a)o[a].e=l=!l;for(var f,s,h=u[0];;){
for(var p=h,g=!0;p.v;)if((p=p.n)===h)return;f=p.z,i.lineStart();do{
if(p.v=p.o.v=!0,p.e){
if(g)for(a=0,c=f.length;a<c;++a)i.point((s=f[a])[0],s[1]);else r(p.x,p.n.x,1,i)
;p=p.n}else{
if(g)for(a=(f=p.p.z).length-1;a>=0;--a)i.point((s=f[a])[0],s[1]);else r(p.x,p.p.x,-1,i)
;p=p.p}f=(p=p.o).z,g=!g}while(!p.v);i.lineEnd()}}}function Qe(n){if(t=n.length){
for(var t,e,r=0,i=n[0];++r<t;)i.n=e=n[r],e.p=i,i=e;i.n=e=n[0],e.p=i}}
function nr(n,t,e,r){
this.x=n,this.z=t,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}
function tr(t,e,r,i){return function(u,o){var a,l=e(o),c=u.invert(i[0],i[1]),f={
point:s,lineStart:p,lineEnd:g,polygonStart:function(){
f.point=x,f.lineStart=b,f.lineEnd=_,a=[],v=[]},polygonEnd:function(){
f.point=s,f.lineStart=p,f.lineEnd=g,a=n.merge(a);var t=function(n,t){
var e=n[0],r=n[1],i=[Math.sin(e),-Math.cos(e),0],u=0,o=0;Te.reset()
;for(var a=0,l=t.length;a<l;++a){var c=t[a],f=c.length
;if(f)for(var s=c[0],h=s[0],p=s[1]/2+An/4,g=Math.sin(p),v=Math.cos(p),d=1;;){
d===f&&(d=0)
;var y=(n=c[d])[0],m=n[1]/2+An/4,M=Math.sin(m),x=Math.cos(m),b=y-h,_=b>=0?1:-1,w=_*b,S=w>An,k=g*M
;if(Te.add(Math.atan2(k*_*Math.sin(w),v*x+k*Math.cos(w))),
u+=S?b+_*Cn:b,S^h>=e^y>=e){var N=je(Pe(s),Pe(n));Oe(N);var E=je(i,N);Oe(E)
;var A=(S^b>=0?-1:1)*Un(E[2]);(r>A||r===A&&(N[0]||N[1]))&&(o+=S^b>=0?1:-1)}
if(!d++)break;h=y,g=M,v=x,s=n}}return(u<-Nn||u<Nn&&Te<-Nn)^1&o}(c,v)
;a.length?(M||(o.polygonStart(),
M=!0),Ke(a,ir,t,r,o)):t&&(M||(o.polygonStart(),M=!0),
o.lineStart(),r(null,null,1,o),o.lineEnd()),M&&(o.polygonEnd(),M=!1),a=v=null},
sphere:function(){
o.polygonStart(),o.lineStart(),r(null,null,1,o),o.lineEnd(),o.polygonEnd()}}
;function s(n,e){var r=u(n,e);t(n=r[0],e=r[1])&&o.point(n,e)}function h(n,t){
var e=u(n,t);l.point(e[0],e[1])}function p(){f.point=h,l.lineStart()}
function g(){f.point=s,l.lineEnd()}var v,d,y=rr(),m=e(y),M=!1;function x(n,t){
d.push([n,t]);var e=u(n,t);m.point(e[0],e[1])}function b(){m.lineStart(),d=[]}
function _(){x(d[0][0],d[0][1]),m.lineEnd()
;var n,t=m.clean(),e=y.buffer(),r=e.length
;if(d.pop(),v.push(d),d=null,r)if(1&t){var i,u=-1;if((r=(n=e[0]).length-1)>0){
for(M||(o.polygonStart(),M=!0),o.lineStart();++u<r;)o.point((i=n[u])[0],i[1])
;o.lineEnd()}
}else r>1&&2&t&&e.push(e.pop().concat(e.shift())),a.push(e.filter(er))}return f}
}function er(n){return n.length>1}function rr(){var n,t=[];return{
lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:D,
buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){
t.length>1&&t.push(t.pop().concat(t.shift()))}}}function ir(n,t){
return((n=n.x)[0]<0?n[1]-Ln-Nn:Ln-n[1])-((t=t.x)[0]<0?t[1]-Ln-Nn:Ln-t[1])}
var ur=tr(Ge,(function(n){var t,e=NaN,r=NaN,i=NaN;return{lineStart:function(){
n.lineStart(),t=1},point:function(u,o){var a=u>0?An:-An,l=y(u-e)
;y(l-An)<Nn?(n.point(e,r=(r+o)/2>0?Ln:-Ln),
n.point(i,r),n.lineEnd(),n.lineStart(),
n.point(a,r),n.point(u,r),t=0):i!==a&&l>=An&&(y(e-i)<Nn&&(e-=i*Nn),
y(u-a)<Nn&&(u-=a*Nn),r=function(n,t,e,r){var i,u,o=Math.sin(n-e)
;return y(o)>Nn?Math.atan((Math.sin(t)*(u=Math.cos(r))*Math.sin(e)-Math.sin(r)*(i=Math.cos(t))*Math.sin(n))/(i*u*o)):(t+r)/2
}(e,r,u,o),
n.point(i,r),n.lineEnd(),n.lineStart(),n.point(a,r),t=0),n.point(e=u,r=o),i=a},
lineEnd:function(){n.lineEnd(),e=r=NaN},clean:function(){return 2-t}}
}),(function(n,t,e,r){var i
;if(null==n)i=e*Ln,r.point(-An,i),r.point(0,i),r.point(An,i),
r.point(An,0),r.point(An,-i),
r.point(0,-i),r.point(-An,-i),r.point(-An,0),r.point(-An,i);else if(y(n[0]-t[0])>Nn){
var u=n[0]<t[0]?An:-An;i=e*u/2,r.point(-u,i),r.point(0,i),r.point(u,i)
}else r.point(t[0],t[1])}),[-An,-An/2]);function or(n){
var t=Math.cos(n),e=t>0,r=y(t)>Nn;return tr(i,(function(n){var t,a,l,c,f;return{
lineStart:function(){c=l=!1,f=1},point:function(s,h){
var p,g=[s,h],v=i(s,h),d=e?v?0:o(s,h):v?o(s+(s<0?An:-An),h):0
;if(!t&&(c=l=v)&&n.lineStart(),
v!==l&&(p=u(t,g),(Ye(t,p)||Ye(g,p))&&(g[0]+=Nn,g[1]+=Nn,
v=i(g[0],g[1]))),v!==l)f=0,
v?(n.lineStart(),p=u(g,t),n.point(p[0],p[1])):(p=u(t,g),
n.point(p[0],p[1]),n.lineEnd()),t=p;else if(r&&t&&e^v){var y
;d&a||!(y=u(g,t,!0))||(f=0,
e?(n.lineStart(),n.point(y[0][0],y[0][1]),n.point(y[1][0],y[1][1]),
n.lineEnd()):(n.point(y[1][0],y[1][1]),
n.lineEnd(),n.lineStart(),n.point(y[0][0],y[0][1])))}
!v||t&&Ye(t,g)||n.point(g[0],g[1]),t=g,l=v,a=d},lineEnd:function(){
l&&n.lineEnd(),t=null},clean:function(){return f|(c&&l)<<1}}
}),Yr(n,6*qn),e?[0,-n]:[-An,n-An]);function i(n,e){
return Math.cos(n)*Math.cos(e)>t}function u(n,e,r){
var i=[1,0,0],u=je(Pe(n),Pe(e)),o=Ue(u,u),a=u[0],l=o-a*a;if(!l)return!r&&n
;var c=t*o/l,f=-t*a/l,s=je(i,u),h=He(i,c);Fe(h,He(u,f))
;var p=s,g=Ue(h,p),v=Ue(p,p),d=g*g-v*(Ue(h,h)-1);if(!(d<0)){
var m=Math.sqrt(d),M=He(p,(-g-m)/v);if(Fe(M,h),M=Ie(M),!r)return M
;var x,b=n[0],_=e[0],w=n[1],S=e[1];_<b&&(x=b,b=_,_=x);var k=_-b,N=y(k-An)<Nn
;if(!N&&S<w&&(x=w,
w=S,S=x),N||k<Nn?N?w+S>0^M[1]<(y(M[0]-b)<Nn?w:S):w<=M[1]&&M[1]<=S:k>An^(b<=M[0]&&M[0]<=_)){
var E=He(p,(-g+m)/v);return Fe(E,h),[M,Ie(E)]}}}function o(t,r){
var i=e?n:An-n,u=0;return t<-i?u|=1:t>i&&(u|=2),r<-i?u|=4:r>i&&(u|=8),u}}
function ar(n,t,e,r){return function(i){
var u,o=i.a,a=i.b,l=o.x,c=o.y,f=0,s=1,h=a.x-l,p=a.y-c;if(u=n-l,h||!(u>0)){
if(u/=h,h<0){if(u<f)return;u<s&&(s=u)}else if(h>0){if(u>s)return;u>f&&(f=u)}
if(u=e-l,h||!(u<0)){if(u/=h,h<0){if(u>s)return;u>f&&(f=u)}else if(h>0){
if(u<f)return;u<s&&(s=u)}if(u=t-c,p||!(u>0)){if(u/=p,p<0){if(u<f)return
;u<s&&(s=u)}else if(p>0){if(u>s)return;u>f&&(f=u)}if(u=r-c,p||!(u<0)){
if(u/=p,p<0){if(u>s)return;u>f&&(f=u)}else if(p>0){if(u<f)return;u<s&&(s=u)}
return f>0&&(i.a={x:l+f*h,y:c+f*p}),s<1&&(i.b={x:l+s*h,y:c+s*p}),i}}}}}}
var lr=1e9;function cr(t,e,r,i){return function(l){
var c,f,s,h,p,g,v,d,y,m,M,x=l,b=rr(),_=ar(t,e,r,i),w={point:N,
lineStart:function(){w.point=E,f&&f.push(s=[]);m=!0,y=!1,v=d=NaN},
lineEnd:function(){c&&(E(h,p),g&&y&&b.rejoin(),c.push(b.buffer()))
;w.point=N,y&&l.lineEnd()},polygonStart:function(){l=b,c=[],f=[],M=!0},
polygonEnd:function(){l=x,c=n.merge(c);var e=function(n){
for(var t=0,e=f.length,r=n[1],i=0;i<e;++i)for(var u,o=1,a=f[i],l=a.length,c=a[0];o<l;++o)u=a[o],
c[1]<=r?u[1]>r&&Dn(c,u,n)>0&&++t:u[1]<=r&&Dn(c,u,n)<0&&--t,c=u;return 0!==t
}([t,i]),r=M&&e,u=c.length
;(r||u)&&(l.polygonStart(),r&&(l.lineStart(),S(null,null,1,l),
l.lineEnd()),u&&Ke(c,o,e,S,l),l.polygonEnd()),c=f=s=null}};function S(n,o,l,c){
var f=0,s=0;if(null==n||(f=u(n,l))!==(s=u(o,l))||a(n,o)<0^l>0)do{
c.point(0===f||3===f?t:r,f>1?i:e)
}while((f=(f+l+4)%4)!==s);else c.point(o[0],o[1])}function k(n,u){
return t<=n&&n<=r&&e<=u&&u<=i}function N(n,t){k(n,t)&&l.point(n,t)}
function E(n,t){
var e=k(n=Math.max(-lr,Math.min(lr,n)),t=Math.max(-lr,Math.min(lr,t)))
;if(f&&s.push([n,t]),
m)h=n,p=t,g=e,m=!1,e&&(l.lineStart(),l.point(n,t));else if(e&&y)l.point(n,t);else{
var r={a:{x:v,y:d},b:{x:n,y:t}}
;_(r)?(y||(l.lineStart(),l.point(r.a.x,r.a.y)),l.point(r.b.x,r.b.y),
e||l.lineEnd(),M=!1):e&&(l.lineStart(),l.point(n,t),M=!1)}v=n,d=t,y=e}return w}
;function u(n,i){
return y(n[0]-t)<Nn?i>0?0:3:y(n[0]-r)<Nn?i>0?2:1:y(n[1]-e)<Nn?i>0?1:0:i>0?3:2}
function o(n,t){return a(n.x,t.x)}function a(n,t){var e=u(n,1),r=u(t,1)
;return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}}
function fr(n){var t=0,e=An/3,r=Dr(n),i=r(t,e);return i.parallels=function(n){
return arguments.length?r(t=n[0]*An/180,e=n[1]*An/180):[t/An*180,e/An*180]},i}
function sr(n,t){
var e=Math.sin(n),r=(e+Math.sin(t))/2,i=1+e*(2*r-e),u=Math.sqrt(i)/r
;function o(n,t){var e=Math.sqrt(i-2*r*Math.sin(t))/r
;return[e*Math.sin(n*=r),u-e*Math.cos(n)]}return o.invert=function(n,t){
var e=u-t;return[Math.atan2(n,e)/r,Un((i-(n*n+e*e)*r*r)/(2*r))]},o}
n.geo.clipExtent=function(){var n,t,e,r,i,u,o={stream:function(n){
return i&&(i.valid=!1),(i=u(n)).valid=!0,i},extent:function(a){
return arguments.length?(u=cr(n=+a[0][0],t=+a[0][1],e=+a[1][0],r=+a[1][1]),
i&&(i.valid=!1,i=null),o):[[n,t],[e,r]]}};return o.extent([[0,0],[960,500]])
},(n.geo.conicEqualArea=function(){return fr(sr)
}).raw=sr,n.geo.albers=function(){
return n.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)
},n.geo.albersUsa=function(){
var t,e,r,i,u=n.geo.albers(),o=n.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),a=n.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),l={
point:function(n,e){t=[n,e]}};function c(n){var u=n[0],o=n[1]
;return t=null,e(u,o),t||(r(u,o),t)||i(u,o),t}return c.invert=function(n){
var t=u.scale(),e=u.translate(),r=(n[0]-e[0])/t,i=(n[1]-e[1])/t
;return(i>=.12&&i<.234&&r>=-.425&&r<-.214?o:i>=.166&&i<.234&&r>=-.214&&r<-.115?a:u).invert(n)
},c.stream=function(n){var t=u.stream(n),e=o.stream(n),r=a.stream(n);return{
point:function(n,i){t.point(n,i),e.point(n,i),r.point(n,i)},sphere:function(){
t.sphere(),e.sphere(),r.sphere()},lineStart:function(){
t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){
t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){
t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){
t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},c.precision=function(n){
return arguments.length?(u.precision(n),
o.precision(n),a.precision(n),c):u.precision()},c.scale=function(n){
return arguments.length?(u.scale(n),
o.scale(.35*n),a.scale(n),c.translate(u.translate())):u.scale()
},c.translate=function(n){if(!arguments.length)return u.translate()
;var t=u.scale(),f=+n[0],s=+n[1]
;return e=u.translate(n).clipExtent([[f-.455*t,s-.238*t],[f+.455*t,s+.238*t]]).stream(l).point,
r=o.translate([f-.307*t,s+.201*t]).clipExtent([[f-.425*t+Nn,s+.12*t+Nn],[f-.214*t-Nn,s+.234*t-Nn]]).stream(l).point,
i=a.translate([f-.205*t,s+.212*t]).clipExtent([[f-.214*t+Nn,s+.166*t+Nn],[f-.115*t-Nn,s+.234*t-Nn]]).stream(l).point,
c},c.scale(1070)};var hr,pr,gr,vr,dr,yr,mr={point:D,lineStart:D,lineEnd:D,
polygonStart:function(){pr=0,mr.lineStart=Mr},polygonEnd:function(){
mr.lineStart=mr.lineEnd=mr.point=D,hr+=y(pr/2)}};function Mr(){var n,t,e,r
;function i(n,t){pr+=r*n-e*t,e=n,r=t}mr.point=function(u,o){
mr.point=i,n=e=u,t=r=o},mr.lineEnd=function(){i(n,t)}}var xr={
point:function(n,t){n<gr&&(gr=n);n>dr&&(dr=n);t<vr&&(vr=t);t>yr&&(yr=t)},
lineStart:D,lineEnd:D,polygonStart:D,polygonEnd:D};function br(){
var n=_r(4.5),t=[],e={point:r,lineStart:function(){e.point=i},lineEnd:o,
polygonStart:function(){e.lineEnd=a},polygonEnd:function(){e.lineEnd=o,e.point=r
},pointRadius:function(t){return n=_r(t),e},result:function(){if(t.length){
var n=t.join("");return t=[],n}}};function r(e,r){t.push("M",e,",",r,n)}
function i(n,r){t.push("M",n,",",r),e.point=u}function u(n,e){
t.push("L",n,",",e)}function o(){e.point=r}function a(){t.push("Z")}return e}
function _r(n){
return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}
var wr,Sr={point:kr,lineStart:Nr,lineEnd:Er,polygonStart:function(){
Sr.lineStart=Ar},polygonEnd:function(){Sr.point=kr,Sr.lineStart=Nr,Sr.lineEnd=Er
}};function kr(n,t){Se+=n,ke+=t,++Ne}function Nr(){var n,t;function e(e,r){
var i=e-n,u=r-t,o=Math.sqrt(i*i+u*u)
;Ee+=o*(n+e)/2,Ae+=o*(t+r)/2,Ce+=o,kr(n=e,t=r)}Sr.point=function(r,i){
Sr.point=e,kr(n=r,t=i)}}function Er(){Sr.point=kr}function Ar(){var n,t,e,r
;function i(n,t){var i=n-e,u=t-r,o=Math.sqrt(i*i+u*u)
;Ee+=o*(e+n)/2,Ae+=o*(r+t)/2,
Ce+=o,ze+=(o=r*n-e*t)*(e+n),Le+=o*(r+t),qe+=3*o,kr(e=n,r=t)}
Sr.point=function(u,o){Sr.point=i,kr(n=e=u,t=r=o)},Sr.lineEnd=function(){i(n,t)}
}function Cr(n){var t=4.5,e={point:r,lineStart:function(){e.point=i},lineEnd:o,
polygonStart:function(){e.lineEnd=a},polygonEnd:function(){e.lineEnd=o,e.point=r
},pointRadius:function(n){return t=n,e},result:D};function r(e,r){
n.moveTo(e+t,r),n.arc(e,r,t,0,Cn)}function i(t,r){n.moveTo(t,r),e.point=u}
function u(t,e){n.lineTo(t,e)}function o(){e.point=r}function a(){n.closePath()}
return e}function zr(n){var t=.5,e=Math.cos(30*qn),r=16;function i(n){
return(r?o:u)(n)}function u(t){return Tr(t,(function(e,r){
e=n(e,r),t.point(e[0],e[1])}))}function o(t){var e,i,u,o,l,c,f,s,h,p,g,v,d={
point:y,lineStart:m,lineEnd:x,polygonStart:function(){
t.polygonStart(),d.lineStart=b},polygonEnd:function(){
t.polygonEnd(),d.lineStart=m}};function y(e,r){e=n(e,r),t.point(e[0],e[1])}
function m(){s=NaN,d.point=M,t.lineStart()}function M(e,i){
var u=Pe([e,i]),o=n(e,i)
;a(s,h,f,p,g,v,s=o[0],h=o[1],f=e,p=u[0],g=u[1],v=u[2],r,t),t.point(s,h)}
function x(){d.point=y,t.lineEnd()}function b(){m(),d.point=_,d.lineEnd=w}
function _(n,t){M(e=n,t),i=s,u=h,o=p,l=g,c=v,d.point=M}function w(){
a(s,h,f,p,g,v,i,u,e,o,l,c,r,t),d.lineEnd=x,x()}return d}
function a(r,i,u,o,l,c,f,s,h,p,g,v,d,m){var M=f-r,x=s-i,b=M*M+x*x
;if(b>4*t&&d--){
var _=o+p,w=l+g,S=c+v,k=Math.sqrt(_*_+w*w+S*S),N=Math.asin(S/=k),E=y(y(S)-1)<Nn||y(u-h)<Nn?(u+h)/2:Math.atan2(w,_),A=n(E,N),C=A[0],z=A[1],L=C-r,q=z-i,T=x*L-M*q
;(T*T/b>t||y((M*L+x*q)/b-.5)>.3||o*p+l*g+c*v<e)&&(a(r,i,u,o,l,c,C,z,E,_/=k,w/=k,S,d,m),
m.point(C,z),a(C,z,E,_,w,S,f,s,h,p,g,v,d,m))}}return i.precision=function(n){
return arguments.length?(r=(t=n*n)>0&&16,i):Math.sqrt(t)},i}function Lr(n){
var t=zr((function(t,e){return n([t*Tn,e*Tn])}));return function(n){
return Pr(t(n))}}function qr(n){this.stream=n}function Tr(n,t){return{point:t,
sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},
lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},
polygonEnd:function(){n.polygonEnd()}}}function Rr(n){return Dr((function(){
return n}))()}function Dr(t){var e,r,i,u,o,a,l=zr((function(n,t){
return[(n=e(n,t))[0]*c+u,o-n[1]*c]
})),c=150,f=480,s=250,h=0,p=0,g=0,v=0,d=0,y=ur,m=L,M=null,x=null;function b(n){
return[(n=i(n[0]*qn,n[1]*qn))[0]*c+u,o-n[1]*c]}function _(n){
return(n=i.invert((n[0]-u)/c,(o-n[1])/c))&&[n[0]*Tn,n[1]*Tn]}function w(){
i=Je(r=Fr(g,v,d),e);var n=e(h,p);return u=f-n[0]*c,o=s+n[1]*c,S()}function S(){
return a&&(a.valid=!1,a=null),b}return b.stream=function(n){
return a&&(a.valid=!1),(a=Pr(y(r,l(m(n))))).valid=!0,a},b.clipAngle=function(n){
return arguments.length?(y=null==n?(M=n,ur):or((M=+n)*qn),S()):M
},b.clipExtent=function(n){
return arguments.length?(x=n,m=n?cr(n[0][0],n[0][1],n[1][0],n[1][1]):L,S()):x
},b.scale=function(n){return arguments.length?(c=+n,w()):c
},b.translate=function(n){return arguments.length?(f=+n[0],s=+n[1],w()):[f,s]
},b.center=function(n){
return arguments.length?(h=n[0]%360*qn,p=n[1]%360*qn,w()):[h*Tn,p*Tn]
},b.rotate=function(n){
return arguments.length?(g=n[0]%360*qn,v=n[1]%360*qn,d=n.length>2?n[2]%360*qn:0,
w()):[g*Tn,v*Tn,d*Tn]},n.rebind(b,l,"precision"),function(){
return e=t.apply(this,arguments),b.invert=e.invert&&_,w()}}function Pr(n){
return Tr(n,(function(t,e){n.point(t*qn,e*qn)}))}function Ur(n,t){return[n,t]}
function jr(n,t){return[n>An?n-Cn:n<-An?n+Cn:n,t]}function Fr(n,t,e){
return n?t||e?Je(Or(n),Ir(t,e)):Or(n):t||e?Ir(t,e):jr}function Hr(n){
return function(t,e){return[(t+=n)>An?t-Cn:t<-An?t+Cn:t,e]}}function Or(n){
var t=Hr(n);return t.invert=Hr(-n),t}function Ir(n,t){
var e=Math.cos(n),r=Math.sin(n),i=Math.cos(t),u=Math.sin(t);function o(n,t){
var o=Math.cos(t),a=Math.cos(n)*o,l=Math.sin(n)*o,c=Math.sin(t),f=c*e+a*r
;return[Math.atan2(l*i-f*u,a*e-c*r),Un(f*i+l*u)]}return o.invert=function(n,t){
var o=Math.cos(t),a=Math.cos(n)*o,l=Math.sin(n)*o,c=Math.sin(t),f=c*i-l*u
;return[Math.atan2(l*i+c*u,a*e+f*r),Un(f*e-a*r)]},o}function Yr(n,t){
var e=Math.cos(n),r=Math.sin(n);return function(i,u,o,a){var l=o*t
;null!=i?(i=Zr(e,i),u=Zr(e,u),(o>0?i<u:i>u)&&(i+=o*Cn)):(i=n+o*Cn,u=n-.5*l)
;for(var c,f=i;o>0?f>u:f<u;f-=l)a.point((c=Ie([e,-r*Math.cos(f),-r*Math.sin(f)]))[0],c[1])
}}function Zr(n,t){var e=Pe(t);e[0]-=n,Oe(e);var r=Pn(-e[1])
;return((-e[2]<0?-r:r)+2*Math.PI-Nn)%(2*Math.PI)}function Vr(t,e,r){
var i=n.range(t,e-Nn,r).concat(e);return function(n){return i.map((function(t){
return[n,t]}))}}function Xr(t,e,r){var i=n.range(t,e-Nn,r).concat(e)
;return function(n){return i.map((function(t){return[t,n]}))}}function $r(n){
return n.source}function Br(n){return n.target}n.geo.path=function(){
var t,e,r,i,u,o=4.5;function a(t){
return t&&("function"==typeof o&&i.pointRadius(+o.apply(this,arguments)),
u&&u.valid||(u=r(i)),n.geo.stream(t,u)),i.result()}function l(){return u=null,a}
return a.area=function(t){return hr=0,n.geo.stream(t,r(mr)),hr
},a.centroid=function(t){
return Se=ke=Ne=Ee=Ae=Ce=ze=Le=qe=0,n.geo.stream(t,r(Sr)),
qe?[ze/qe,Le/qe]:Ce?[Ee/Ce,Ae/Ce]:Ne?[Se/Ne,ke/Ne]:[NaN,NaN]
},a.bounds=function(t){
return dr=yr=-(gr=vr=1/0),n.geo.stream(t,r(xr)),[[gr,vr],[dr,yr]]
},a.projection=function(n){
return arguments.length?(r=(t=n)?n.stream||Lr(n):L,l()):t
},a.context=function(n){return arguments.length?(i=null==(e=n)?new br:new Cr(n),
"function"!=typeof o&&i.pointRadius(o),l()):e},a.pointRadius=function(n){
return arguments.length?(o="function"==typeof n?n:(i.pointRadius(+n),+n),a):o
},a.projection(n.geo.albersUsa()).context(null)},n.geo.transform=function(n){
return{stream:function(t){var e=new qr(t);for(var r in n)e[r]=n[r];return e}}
},qr.prototype={point:function(n,t){this.stream.point(n,t)},sphere:function(){
this.stream.sphere()},lineStart:function(){this.stream.lineStart()},
lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){
this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}
},n.geo.projection=Rr,
n.geo.projectionMutator=Dr,(n.geo.equirectangular=function(){return Rr(Ur)
}).raw=Ur.invert=Ur,n.geo.rotation=function(n){function t(t){
return(t=n(t[0]*qn,t[1]*qn))[0]*=Tn,t[1]*=Tn,t}
return n=Fr(n[0]%360*qn,n[1]*qn,n.length>2?n[2]*qn:0),t.invert=function(t){
return(t=n.invert(t[0]*qn,t[1]*qn))[0]*=Tn,t[1]*=Tn,t},t
},jr.invert=Ur,n.geo.circle=function(){var n,t,e=[0,0],r=6;function i(){
var n="function"==typeof e?e.apply(this,arguments):e,r=Fr(-n[0]*qn,-n[1]*qn,0).invert,i=[]
;return t(null,null,1,{point:function(n,t){i.push(n=r(n,t)),n[0]*=Tn,n[1]*=Tn}
}),{type:"Polygon",coordinates:[i]}}return i.origin=function(n){
return arguments.length?(e=n,i):e},i.angle=function(e){
return arguments.length?(t=Yr((n=+e)*qn,r*qn),i):n},i.precision=function(e){
return arguments.length?(t=Yr(n*qn,(r=+e)*qn),i):r},i.angle(90)
},n.geo.distance=function(n,t){
var e,r=(t[0]-n[0])*qn,i=n[1]*qn,u=t[1]*qn,o=Math.sin(r),a=Math.cos(r),l=Math.sin(i),c=Math.cos(i),f=Math.sin(u),s=Math.cos(u)
;return Math.atan2(Math.sqrt((e=s*o)*e+(e=c*f-l*s*a)*e),l*f+c*s*a)
},n.geo.graticule=function(){
var t,e,r,i,u,o,a,l,c,f,s,h,p=10,g=p,v=90,d=360,m=2.5;function M(){return{
type:"MultiLineString",coordinates:x()}}function x(){
return n.range(Math.ceil(i/v)*v,r,v).map(s).concat(n.range(Math.ceil(l/d)*d,a,d).map(h)).concat(n.range(Math.ceil(e/p)*p,t,p).filter((function(n){
return y(n%v)>Nn
})).map(c)).concat(n.range(Math.ceil(o/g)*g,u,g).filter((function(n){
return y(n%d)>Nn})).map(f))}return M.lines=function(){
return x().map((function(n){return{type:"LineString",coordinates:n}}))
},M.outline=function(){return{type:"Polygon",
coordinates:[s(i).concat(h(a).slice(1),s(r).reverse().slice(1),h(l).reverse().slice(1))]
}},M.extent=function(n){
return arguments.length?M.majorExtent(n).minorExtent(n):M.minorExtent()
},M.majorExtent=function(n){
return arguments.length?(i=+n[0][0],r=+n[1][0],l=+n[0][1],
a=+n[1][1],i>r&&(n=i,i=r,r=n),l>a&&(n=l,l=a,a=n),M.precision(m)):[[i,l],[r,a]]},
M.minorExtent=function(n){
return arguments.length?(e=+n[0][0],t=+n[1][0],o=+n[0][1],
u=+n[1][1],e>t&&(n=e,e=t,t=n),o>u&&(n=o,o=u,u=n),M.precision(m)):[[e,o],[t,u]]},
M.step=function(n){
return arguments.length?M.majorStep(n).minorStep(n):M.minorStep()
},M.majorStep=function(n){return arguments.length?(v=+n[0],d=+n[1],M):[v,d]
},M.minorStep=function(n){return arguments.length?(p=+n[0],g=+n[1],M):[p,g]
},M.precision=function(n){
return arguments.length?(m=+n,c=Vr(o,u,90),f=Xr(e,t,m),s=Vr(l,a,90),h=Xr(i,r,m),
M):m
},M.majorExtent([[-180,-90+Nn],[180,90-Nn]]).minorExtent([[-180,-80-Nn],[180,80+Nn]])
},n.geo.greatArc=function(){var t,e,r=$r,i=Br;function u(){return{
type:"LineString",
coordinates:[t||r.apply(this,arguments),e||i.apply(this,arguments)]}}
return u.distance=function(){
return n.geo.distance(t||r.apply(this,arguments),e||i.apply(this,arguments))
},u.source=function(n){
return arguments.length?(r=n,t="function"==typeof n?null:n,u):r
},u.target=function(n){
return arguments.length?(i=n,e="function"==typeof n?null:n,u):i
},u.precision=function(){return arguments.length?u:0},u
},n.geo.interpolate=function(n,t){return function(n,t,e,r){
var i=Math.cos(t),u=Math.sin(t),o=Math.cos(r),a=Math.sin(r),l=i*Math.cos(n),c=i*Math.sin(n),f=o*Math.cos(e),s=o*Math.sin(e),h=2*Math.asin(Math.sqrt(Fn(r-t)+i*o*Fn(e-n))),p=1/Math.sin(h),g=h?function(n){
var t=Math.sin(n*=h)*p,e=Math.sin(h-n)*p,r=e*l+t*f,i=e*c+t*s,o=e*u+t*a
;return[Math.atan2(i,r)*Tn,Math.atan2(o,Math.sqrt(r*r+i*i))*Tn]}:function(){
return[n*Tn,t*Tn]};return g.distance=h,g}(n[0]*qn,n[1]*qn,t[0]*qn,t[1]*qn)
},n.geo.length=function(t){return wr=0,n.geo.stream(t,Wr),wr};var Wr={sphere:D,
point:D,lineStart:function(){var n,t,e;function r(r,i){
var u=Math.sin(i*=qn),o=Math.cos(i),a=y((r*=qn)-n),l=Math.cos(a)
;wr+=Math.atan2(Math.sqrt((a=o*Math.sin(a))*a+(a=e*u-t*o*l)*a),t*u+e*o*l),
n=r,t=u,e=o}Wr.point=function(i,u){
n=i*qn,t=Math.sin(u*=qn),e=Math.cos(u),Wr.point=r},Wr.lineEnd=function(){
Wr.point=Wr.lineEnd=D}},lineEnd:D,polygonStart:D,polygonEnd:D};function Jr(n,t){
function e(t,e){var r=Math.cos(t),i=Math.cos(e),u=n(r*i)
;return[u*i*Math.sin(t),u*Math.sin(e)]}return e.invert=function(n,e){
var r=Math.sqrt(n*n+e*e),i=t(r),u=Math.sin(i),o=Math.cos(i)
;return[Math.atan2(n*u,r*o),Math.asin(r&&e*u/r)]},e}var Gr=Jr((function(n){
return Math.sqrt(2/(1+n))}),(function(n){return 2*Math.asin(n/2)}))
;(n.geo.azimuthalEqualArea=function(){return Rr(Gr)}).raw=Gr
;var Kr=Jr((function(n){var t=Math.acos(n);return t&&t/Math.sin(t)}),L)
;function Qr(n,t){var e=Math.cos(n),r=function(n){return Math.tan(An/4+n/2)
},i=n===t?Math.sin(n):Math.log(e/Math.cos(t))/Math.log(r(t)/r(n)),u=e*Math.pow(r(n),i)/i
;if(!i)return ei;function o(n,t){u>0?t<-Ln+Nn&&(t=-Ln+Nn):t>Ln-Nn&&(t=Ln-Nn)
;var e=u/Math.pow(r(t),i);return[e*Math.sin(i*n),u-e*Math.cos(i*n)]}
return o.invert=function(n,t){var e=u-t,r=Rn(i)*Math.sqrt(n*n+e*e)
;return[Math.atan2(n,e)/i,2*Math.atan(Math.pow(u/r,1/i))-Ln]},o}
function ni(n,t){
var e=Math.cos(n),r=n===t?Math.sin(n):(e-Math.cos(t))/(t-n),i=e/r+n
;if(y(r)<Nn)return Ur;function u(n,t){var e=i-t
;return[e*Math.sin(r*n),i-e*Math.cos(r*n)]}return u.invert=function(n,t){
var e=i-t;return[Math.atan2(n,e)/r,i-Rn(r)*Math.sqrt(n*n+e*e)]},u}
(n.geo.azimuthalEquidistant=function(){return Rr(Kr)
}).raw=Kr,(n.geo.conicConformal=function(){return fr(Qr)
}).raw=Qr,(n.geo.conicEquidistant=function(){return fr(ni)}).raw=ni
;var ti=Jr((function(n){return 1/n}),Math.atan);function ei(n,t){
return[n,Math.log(Math.tan(An/4+t/2))]}function ri(n){
var t,e=Rr(n),r=e.scale,i=e.translate,u=e.clipExtent;return e.scale=function(){
var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n
},e.translate=function(){var n=i.apply(e,arguments)
;return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){
var o=u.apply(e,arguments);if(o===e){if(t=null==n){var a=An*r(),l=i()
;u([[l[0]-a,l[1]-a],[l[0]+a,l[1]+a]])}}else t&&(o=null);return o
},e.clipExtent(null)}(n.geo.gnomonic=function(){return Rr(ti)
}).raw=ti,ei.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Ln]
},(n.geo.mercator=function(){return ri(ei)}).raw=ei;var ii=Jr((function(){
return 1}),Math.asin);(n.geo.orthographic=function(){return Rr(ii)}).raw=ii
;var ui=Jr((function(n){return 1/(1+n)}),(function(n){return 2*Math.atan(n)}))
;function oi(n,t){return[Math.log(Math.tan(An/4+t/2)),-n]}function ai(n){
return n[0]}function li(n){return n[1]}function ci(n){
for(var t=n.length,e=[0,1],r=2,i=2;i<t;i++){
for(;r>1&&Dn(n[e[r-2]],n[e[r-1]],n[i])<=0;)--r;e[r++]=i}return e.slice(0,r)}
function fi(n,t){return n[0]-t[0]||n[1]-t[1]}(n.geo.stereographic=function(){
return Rr(ui)}).raw=ui,oi.invert=function(n,t){
return[-t,2*Math.atan(Math.exp(n))-Ln]},(n.geo.transverseMercator=function(){
var n=ri(oi),t=n.center,e=n.rotate;return n.center=function(n){
return n?t([-n[1],n[0]]):[(n=t())[1],-n[0]]},n.rotate=function(n){
return n?e([n[0],n[1],n.length>2?n[2]+90:90]):[(n=e())[0],n[1],n[2]-90]
},e([0,0,90])}).raw=oi,n.geom={},n.geom.hull=function(n){var t=ai,e=li
;if(arguments.length)return r(n);function r(n){if(n.length<3)return[]
;var r,i=Mt(t),u=Mt(e),o=n.length,a=[],l=[]
;for(r=0;r<o;r++)a.push([+i.call(this,n[r],r),+u.call(this,n[r],r),r])
;for(a.sort(fi),r=0;r<o;r++)l.push([a[r][0],-a[r][1]])
;var c=ci(a),f=ci(l),s=f[0]===c[0],h=f[f.length-1]===c[c.length-1],p=[]
;for(r=c.length-1;r>=0;--r)p.push(n[a[c[r]][2]])
;for(r=+s;r<f.length-h;++r)p.push(n[a[f[r]][2]]);return p}
return r.x=function(n){return arguments.length?(t=n,r):t},r.y=function(n){
return arguments.length?(e=n,r):e},r},n.geom.polygon=function(n){return I(n,si),
n};var si=n.geom.polygon.prototype=[];function hi(n,t,e){
return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function pi(n,t,e,r){
var i=n[0],u=e[0],o=t[0]-i,a=r[0]-u,l=n[1],c=e[1],f=t[1]-l,s=r[1]-c,h=(a*(l-c)-s*(i-u))/(s*o-a*f)
;return[i+h*o,l+h*f]}function gi(n){var t=n[0],e=n[n.length-1]
;return!(t[0]-e[0]||t[1]-e[1])}si.area=function(){
for(var n,t=-1,e=this.length,r=this[e-1],i=0;++t<e;)n=r,
r=this[t],i+=n[1]*r[0]-n[0]*r[1];return.5*i},si.centroid=function(n){
var t,e,r=-1,i=this.length,u=0,o=0,a=this[i-1]
;for(arguments.length||(n=-1/(6*this.area()));++r<i;)t=a,
a=this[r],e=t[0]*a[1]-a[0]*t[1],u+=(t[0]+a[0])*e,o+=(t[1]+a[1])*e
;return[u*n,o*n]},si.clip=function(n){
for(var t,e,r,i,u,o,a=gi(n),l=-1,c=this.length-gi(this),f=this[c-1];++l<c;){
for(t=n.slice(),
n.length=0,i=this[l],u=t[(r=t.length-a)-1],e=-1;++e<r;)hi(o=t[e],f,i)?(hi(u,f,i)||n.push(pi(u,o,f,i)),
n.push(o)):hi(u,f,i)&&n.push(pi(u,o,f,i)),u=o;a&&n.push(n[0]),f=i}return n}
;var vi,di,yi,mi,Mi,xi=[],bi=[];function _i(){
Oi(this),this.edge=this.site=this.circle=null}function wi(n){
var t=xi.pop()||new _i;return t.site=n,t}function Si(n){
Ti(n),yi.remove(n),xi.push(n),Oi(n)}function ki(n){
var t=n.circle,e=t.x,r=t.cy,i={x:e,y:r},u=n.P,o=n.N,a=[n];Si(n)
;for(var l=u;l.circle&&y(e-l.circle.x)<Nn&&y(r-l.circle.cy)<Nn;)u=l.P,
a.unshift(l),Si(l),l=u;a.unshift(l),Ti(l)
;for(var c=o;c.circle&&y(e-c.circle.x)<Nn&&y(r-c.circle.cy)<Nn;)o=c.N,a.push(c),
Si(c),c=o;a.push(c),Ti(c);var f,s=a.length
;for(f=1;f<s;++f)c=a[f],l=a[f-1],ji(c.edge,l.site,c.site,i)
;l=a[0],(c=a[s-1]).edge=Pi(l.site,c.site,null,i),qi(l),qi(c)}function Ni(n){
for(var t,e,r,i,u=n.x,o=n.y,a=yi._;a;)if((r=Ei(a,o)-u)>Nn)a=a.L;else{
if(!((i=u-Ai(a,o))>Nn)){r>-Nn?(t=a.P,e=a):i>-Nn?(t=a,e=a.N):t=e=a;break}
if(!a.R){t=a;break}a=a.R}var l=wi(n);if(yi.insert(t,l),t||e){
if(t===e)return Ti(t),
e=wi(t.site),yi.insert(l,e),l.edge=e.edge=Pi(t.site,l.site),qi(t),void qi(e)
;if(e){Ti(t),Ti(e)
;var c=t.site,f=c.x,s=c.y,h=n.x-f,p=n.y-s,g=e.site,v=g.x-f,d=g.y-s,y=2*(h*d-p*v),m=h*h+p*p,M=v*v+d*d,x={
x:(d*m-p*M)/y+f,y:(h*M-v*m)/y+s}
;ji(e.edge,c,g,x),l.edge=Pi(c,n,null,x),e.edge=Pi(n,g,null,x),qi(t),qi(e)
}else l.edge=Pi(t.site,l.site)}}function Ei(n,t){var e=n.site,r=e.x,i=e.y,u=i-t
;if(!u)return r;var o=n.P;if(!o)return-1/0;var a=(e=o.site).x,l=e.y,c=l-t
;if(!c)return a;var f=a-r,s=1/u-1/c,h=f/c
;return s?(-h+Math.sqrt(h*h-2*s*(f*f/(-2*c)-l+c/2+i-u/2)))/s+r:(r+a)/2}
function Ai(n,t){var e=n.N;if(e)return Ei(e,t);var r=n.site
;return r.y===t?r.x:1/0}function Ci(n){this.site=n,this.edges=[]}
function zi(n,t){return t.angle-n.angle}function Li(){
Oi(this),this.x=this.y=this.arc=this.site=this.cy=null}function qi(n){
var t=n.P,e=n.N;if(t&&e){var r=t.site,i=n.site,u=e.site;if(r!==u){
var o=i.x,a=i.y,l=r.x-o,c=r.y-a,f=u.x-o,s=2*(l*(d=u.y-a)-c*f);if(!(s>=-En)){
var h=l*l+c*c,p=f*f+d*d,g=(d*h-c*p)/s,v=(l*p-f*h)/s,d=v+a,y=bi.pop()||new Li
;y.arc=n,y.site=i,y.x=g+o,y.y=d+Math.sqrt(g*g+v*v),y.cy=d,n.circle=y
;for(var m=null,M=Mi._;M;)if(y.y<M.y||y.y===M.y&&y.x<=M.x){if(!M.L){m=M.P;break}
M=M.L}else{if(!M.R){m=M;break}M=M.R}Mi.insert(m,y),m||(mi=y)}}}}function Ti(n){
var t=n.circle;t&&(t.P||(mi=t.N),Mi.remove(t),bi.push(t),Oi(t),n.circle=null)}
function Ri(n,t){var e=n.b;if(e)return!0
;var r,i,u=n.a,o=t[0][0],a=t[1][0],l=t[0][1],c=t[1][1],f=n.l,s=n.r,h=f.x,p=f.y,g=s.x,v=s.y,d=(h+g)/2,y=(p+v)/2
;if(v===p){if(d<o||d>=a)return;if(h>g){if(u){if(u.y>=c)return}else u={x:d,y:l}
;e={x:d,y:c}}else{if(u){if(u.y<l)return}else u={x:d,y:c};e={x:d,y:l}}
}else if(i=y-(r=(h-g)/(v-p))*d,r<-1||r>1)if(h>g){if(u){if(u.y>=c)return}else u={
x:(l-i)/r,y:l};e={x:(c-i)/r,y:c}}else{if(u){if(u.y<l)return}else u={x:(c-i)/r,
y:c};e={x:(l-i)/r,y:l}}else if(p<v){if(u){if(u.x>=a)return}else u={x:o,y:r*o+i}
;e={x:a,y:r*a+i}}else{if(u){if(u.x<o)return}else u={x:a,y:r*a+i};e={x:o,y:r*o+i}
}return n.a=u,n.b=e,!0}function Di(n,t){this.l=n,this.r=t,this.a=this.b=null}
function Pi(n,t,e,r){var i=new Di(n,t)
;return vi.push(i),e&&ji(i,n,t,e),r&&ji(i,t,n,r),
di[n.i].edges.push(new Fi(i,n,t)),di[t.i].edges.push(new Fi(i,t,n)),i}
function Ui(n,t,e){var r=new Di(n,null);return r.a=t,r.b=e,vi.push(r),r}
function ji(n,t,e,r){n.a||n.b?n.l===e?n.b=r:n.a=r:(n.a=r,n.l=t,n.r=e)}
function Fi(n,t,e){var r=n.a,i=n.b
;this.edge=n,this.site=t,this.angle=e?Math.atan2(e.y-t.y,e.x-t.x):n.l===t?Math.atan2(i.x-r.x,r.y-i.y):Math.atan2(r.x-i.x,i.y-r.y)
}function Hi(){this._=null}function Oi(n){n.U=n.C=n.L=n.R=n.P=n.N=null}
function Ii(n,t){var e=t,r=t.R,i=e.U
;i?i.L===e?i.L=r:i.R=r:n._=r,r.U=i,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}
function Yi(n,t){var e=t,r=t.L,i=e.U
;i?i.L===e?i.L=r:i.R=r:n._=r,r.U=i,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}
function Zi(n){for(;n.L;)n=n.L;return n}function Vi(n,t){
var e,r,i,u=n.sort(Xi).pop()
;for(vi=[],di=new Array(n.length),yi=new Hi,Mi=new Hi;;)if(i=mi,
u&&(!i||u.y<i.y||u.y===i.y&&u.x<i.x))u.x===e&&u.y===r||(di[u.i]=new Ci(u),Ni(u),
e=u.x,r=u.y),u=n.pop();else{if(!i)break;ki(i.arc)}t&&(function(n){
for(var t,e=vi,r=ar(n[0][0],n[0][1],n[1][0],n[1][1]),i=e.length;i--;)(!Ri(t=e[i],n)||!r(t)||y(t.a.x-t.b.x)<Nn&&y(t.a.y-t.b.y)<Nn)&&(t.a=t.b=null,
e.splice(i,1))}(t),function(n){
for(var t,e,r,i,u,o,a,l,c,f,s=n[0][0],h=n[1][0],p=n[0][1],g=n[1][1],v=di,d=v.length;d--;)if((u=v[d])&&u.prepare())for(l=(a=u.edges).length,
o=0;o<l;)r=(f=a[o].end()).x,
i=f.y,t=(c=a[++o%l].start()).x,e=c.y,(y(r-t)>Nn||y(i-e)>Nn)&&(a.splice(o,0,new Fi(Ui(u.site,f,y(r-s)<Nn&&g-i>Nn?{
x:s,y:y(t-s)<Nn?e:g}:y(i-g)<Nn&&h-r>Nn?{x:y(e-g)<Nn?t:h,y:g}:y(r-h)<Nn&&i-p>Nn?{
x:h,y:y(t-h)<Nn?e:p}:y(i-p)<Nn&&r-s>Nn?{x:y(e-p)<Nn?t:s,y:p
}:null),u.site,null)),++l)}(t));var o={cells:di,edges:vi}
;return yi=Mi=vi=di=null,o}function Xi(n,t){return t.y-n.y||t.x-n.x}
Ci.prototype.prepare=function(){
for(var n,t=this.edges,e=t.length;e--;)(n=t[e].edge).b&&n.a||t.splice(e,1)
;return t.sort(zi),t.length},Fi.prototype={start:function(){
return this.edge.l===this.site?this.edge.a:this.edge.b},end:function(){
return this.edge.l===this.site?this.edge.b:this.edge.a}},Hi.prototype={
insert:function(n,t){var e,r,i;if(n){if(t.P=n,t.N=n.N,n.N&&(n.N.P=t),n.N=t,n.R){
for(n=n.R;n.L;)n=n.L;n.L=t}else n.R=t;e=n
}else this._?(n=Zi(this._),t.P=null,t.N=n,n.P=n.L=t,e=n):(t.P=t.N=null,this._=t,
e=null)
;for(t.L=t.R=null,t.U=e,t.C=!0,n=t;e&&e.C;)e===(r=e.U).L?(i=r.R)&&i.C?(e.C=i.C=!1,
r.C=!0,
n=r):(n===e.R&&(Ii(this,e),e=(n=e).U),e.C=!1,r.C=!0,Yi(this,r)):(i=r.L)&&i.C?(e.C=i.C=!1,
r.C=!0,n=r):(n===e.L&&(Yi(this,e),e=(n=e).U),e.C=!1,r.C=!0,Ii(this,r)),e=n.U
;this._.C=!1},remove:function(n){n.N&&(n.N.P=n.P),n.P&&(n.P.N=n.N),n.N=n.P=null
;var t,e,r,i=n.U,u=n.L,o=n.R
;if(e=u?o?Zi(o):u:o,i?i.L===n?i.L=e:i.R=e:this._=e,u&&o?(r=e.C,
e.C=n.C,e.L=u,u.U=e,
e!==o?(i=e.U,e.U=n.U,n=e.R,i.L=n,e.R=o,o.U=e):(e.U=i,i=e,n=e.R)):(r=n.C,
n=e),n&&(n.U=i),!r)if(n&&n.C)n.C=!1;else{do{if(n===this._)break;if(n===i.L){
if((t=i.R).C&&(t.C=!1,i.C=!0,Ii(this,i),t=i.R),t.L&&t.L.C||t.R&&t.R.C){
t.R&&t.R.C||(t.L.C=!1,
t.C=!0,Yi(this,t),t=i.R),t.C=i.C,i.C=t.R.C=!1,Ii(this,i),n=this._;break}
}else if((t=i.L).C&&(t.C=!1,i.C=!0,Yi(this,i),t=i.L),t.L&&t.L.C||t.R&&t.R.C){
t.L&&t.L.C||(t.R.C=!1,
t.C=!0,Ii(this,t),t=i.L),t.C=i.C,i.C=t.L.C=!1,Yi(this,i),n=this._;break}
t.C=!0,n=i,i=i.U}while(!n.C);n&&(n.C=!1)}}},n.geom.voronoi=function(n){
var t=ai,e=li,r=t,i=e,u=$i;if(n)return o(n);function o(n){
var t=new Array(n.length),e=u[0][0],r=u[0][1],i=u[1][0],o=u[1][1]
;return Vi(a(n),u).cells.forEach((function(u,a){var l=u.edges,c=u.site
;(t[a]=l.length?l.map((function(n){var t=n.start();return[t.x,t.y]
})):c.x>=e&&c.x<=i&&c.y>=r&&c.y<=o?[[e,o],[i,o],[i,r],[e,r]]:[]).point=n[a]})),t
}function a(n){return n.map((function(n,t){return{x:Math.round(r(n,t)/Nn)*Nn,
y:Math.round(i(n,t)/Nn)*Nn,i:t}}))}return o.links=function(n){
return Vi(a(n)).edges.filter((function(n){return n.l&&n.r})).map((function(t){
return{source:n[t.l.i],target:n[t.r.i]}}))},o.triangles=function(n){var t=[]
;return Vi(a(n)).cells.forEach((function(e,r){
for(var i,u=e.site,o=e.edges.sort(zi),a=-1,l=o.length,c=o[l-1].edge,f=c.l===u?c.r:c.l;++a<l;)c,
i=f,
f=(c=o[a].edge).l===u?c.r:c.l,r<i.i&&r<f.i&&Bi(u,i,f)<0&&t.push([n[r],n[i.i],n[f.i]])
})),t},o.x=function(n){return arguments.length?(r=Mt(t=n),o):t},o.y=function(n){
return arguments.length?(i=Mt(e=n),o):e},o.clipExtent=function(n){
return arguments.length?(u=null==n?$i:n,o):u===$i?null:u},o.size=function(n){
return arguments.length?o.clipExtent(n&&[[0,0],n]):u===$i?null:u&&u[1]},o}
;var $i=[[-1e6,-1e6],[1e6,1e6]];function Bi(n,t,e){
return(n.x-e.x)*(t.y-n.y)-(n.x-t.x)*(e.y-n.y)}function Wi(n){return n.x}
function Ji(n){return n.y}function Gi(n,t,e,r,i,u){if(!n(t,e,r,i,u)){
var o=.5*(e+i),a=.5*(r+u),l=t.nodes
;l[0]&&Gi(n,l[0],e,r,o,a),l[1]&&Gi(n,l[1],o,r,i,a),
l[2]&&Gi(n,l[2],e,a,o,u),l[3]&&Gi(n,l[3],o,a,i,u)}}function Ki(n,t,e,r,i,u,o){
var a,l=1/0;return function n(c,f,s,h,p){if(!(f>u||s>o||h<r||p<i)){
if(g=c.point){var g,v=t-c.x,d=e-c.y,y=v*v+d*d;if(y<l){var m=Math.sqrt(l=y)
;r=t-m,i=e-m,u=t+m,o=e+m,a=g}}
for(var M=c.nodes,x=.5*(f+h),b=.5*(s+p),_=(e>=b)<<1|t>=x,w=_+4;_<w;++_)if(c=M[3&_])switch(3&_){
case 0:n(c,f,s,x,b);break;case 1:n(c,x,s,h,b);break;case 2:n(c,f,b,x,p);break
;case 3:n(c,x,b,h,p)}}}(n,r,i,u,o),a}function Qi(t,e){t=n.rgb(t),e=n.rgb(e)
;var r=t.r,i=t.g,u=t.b,o=e.r-r,a=e.g-i,l=e.b-u;return function(n){
return"#"+ht(Math.round(r+o*n))+ht(Math.round(i+a*n))+ht(Math.round(u+l*n))}}
function nu(n,t){var e,r={},i={};for(e in n)e in t?r[e]=uu(n[e],t[e]):i[e]=n[e]
;for(e in t)e in n||(i[e]=t[e]);return function(n){for(e in r)i[e]=r[e](n)
;return i}}function tu(n,t){return n=+n,t=+t,function(e){return n*(1-e)+t*e}}
function eu(n,t){var e,r,i,u=ru.lastIndex=iu.lastIndex=0,o=-1,a=[],l=[]
;for(n+="",t+="";(e=ru.exec(n))&&(r=iu.exec(t));)(i=r.index)>u&&(i=t.slice(u,i),
a[o]?a[o]+=i:a[++o]=i),
(e=e[0])===(r=r[0])?a[o]?a[o]+=r:a[++o]=r:(a[++o]=null,l.push({i:o,x:tu(e,r)})),
u=iu.lastIndex
;return u<t.length&&(i=t.slice(u),a[o]?a[o]+=i:a[++o]=i),a.length<2?l[0]?(t=l[0].x,
function(n){return t(n)+""}):function(){return t}:(t=l.length,function(n){
for(var e,r=0;r<t;++r)a[(e=l[r]).i]=e.x(n);return a.join("")})}
n.geom.delaunay=function(t){return n.geom.voronoi().triangles(t)
},n.geom.quadtree=function(n,t,e,r,i){var u,o=ai,a=li
;if(u=arguments.length)return o=Wi,a=Ji,3===u&&(i=e,r=t,e=t=0),l(n)
;function l(n){var l,c,f,s,h,p,g,v,d,m=Mt(o),M=Mt(a)
;if(null!=t)p=t,g=e,v=r,d=i;else if(v=d=-(p=g=1/0),
c=[],f=[],h=n.length,u)for(s=0;s<h;++s)(l=n[s]).x<p&&(p=l.x),
l.y<g&&(g=l.y),l.x>v&&(v=l.x),
l.y>d&&(d=l.y),c.push(l.x),f.push(l.y);else for(s=0;s<h;++s){
var x=+m(l=n[s],s),b=+M(l,s)
;x<p&&(p=x),b<g&&(g=b),x>v&&(v=x),b>d&&(d=b),c.push(x),f.push(b)}var _=v-p,w=d-g
;function S(n,t,e,r,i,u,o,a){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var l=n.x,c=n.y
;if(null!=l)if(y(l-e)+y(c-r)<.01)k(n,t,e,r,i,u,o,a);else{var f=n.point
;n.x=n.y=n.point=null,k(n,f,l,c,i,u,o,a),k(n,t,e,r,i,u,o,a)
}else n.x=e,n.y=r,n.point=t}else k(n,t,e,r,i,u,o,a)}function k(n,t,e,r,i,u,o,a){
var l=.5*(i+o),c=.5*(u+a),f=e>=l,s=r>=c,h=s<<1|f
;n.leaf=!1,f?i=l:o=l,s?u=c:a=c,S(n=n.nodes[h]||(n.nodes[h]={leaf:!0,nodes:[],
point:null,x:null,y:null}),t,e,r,i,u,o,a)}_>w?d=g+_:v=p+w;var N={leaf:!0,
nodes:[],point:null,x:null,y:null,add:function(n){
S(N,n,+m(n,++s),+M(n,s),p,g,v,d)},visit:function(n){Gi(n,N,p,g,v,d)},
find:function(n){return Ki(N,n[0],n[1],p,g,v,d)}};if(s=-1,null==t){
for(;++s<h;)S(N,n[s],c[s],f[s],p,g,v,d);--s}else n.forEach(N.add)
;return c=f=n=l=null,N}return l.x=function(n){return arguments.length?(o=n,l):o
},l.y=function(n){return arguments.length?(a=n,l):a},l.extent=function(n){
return arguments.length?(null==n?t=e=r=i=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],
i=+n[1][1]),l):null==t?null:[[t,e],[r,i]]},l.size=function(n){
return arguments.length?(null==n?t=e=r=i=null:(t=e=0,
r=+n[0],i=+n[1]),l):null==t?null:[r-t,i-e]},l
},n.interpolateRgb=Qi,n.interpolateObject=nu,
n.interpolateNumber=tu,n.interpolateString=eu
;var ru=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,iu=new RegExp(ru.source,"g")
;function uu(t,e){
for(var r,i=n.interpolators.length;--i>=0&&!(r=n.interpolators[i](t,e)););
return r}function ou(n,t){
var e,r=[],i=[],u=n.length,o=t.length,a=Math.min(n.length,t.length)
;for(e=0;e<a;++e)r.push(uu(n[e],t[e]));for(;e<u;++e)i[e]=n[e]
;for(;e<o;++e)i[e]=t[e];return function(n){for(e=0;e<a;++e)i[e]=r[e](n);return i
}}n.interpolate=uu,n.interpolators=[function(n,t){var e=typeof t
;return("string"===e?mt.has(t.toLowerCase())||/^(#|rgb\(|hsl\()/i.test(t)?Qi:eu:t instanceof Zn?Qi:Array.isArray(t)?ou:"object"===e&&isNaN(t)?nu:tu)(n,t)
}],n.interpolateArray=ou;var au=function(){return L},lu=n.map({linear:au,
poly:function(n){return function(t){return Math.pow(t,n)}},quad:function(){
return pu},cubic:function(){return gu},sin:function(){return du},exp:function(){
return yu},circle:function(){return mu},elastic:function(n,t){var e
;arguments.length<2&&(t=.45);arguments.length?e=t/Cn*Math.asin(1/n):(n=1,e=t/4)
;return function(r){return 1+n*Math.pow(2,-10*r)*Math.sin((r-e)*Cn/t)}},
back:function(n){n||(n=1.70158);return function(t){return t*t*((n+1)*t-n)}},
bounce:function(){return Mu}}),cu=n.map({in:L,out:su,"in-out":hu,
"out-in":function(n){return hu(su(n))}});function fu(n){return function(t){
return t<=0?0:t>=1?1:n(t)}}function su(n){return function(t){return 1-n(1-t)}}
function hu(n){return function(t){return.5*(t<.5?n(2*t):2-n(2-2*t))}}
function pu(n){return n*n}function gu(n){return n*n*n}function vu(n){
if(n<=0)return 0;if(n>=1)return 1;var t=n*n,e=t*n
;return 4*(n<.5?e:3*(n-t)+e-.75)}function du(n){return 1-Math.cos(n*Ln)}
function yu(n){return Math.pow(2,10*(n-1))}function mu(n){
return 1-Math.sqrt(1-n*n)}function Mu(n){
return n<1/2.75?7.5625*n*n:n<2/2.75?7.5625*(n-=1.5/2.75)*n+.75:n<2.5/2.75?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375
}function xu(n,t){return t-=n,function(e){return Math.round(n+t*e)}}
function bu(n){
var t=[n.a,n.b],e=[n.c,n.d],r=wu(t),i=_u(t,e),u=wu(function(n,t,e){
return n[0]+=e*t[0],n[1]+=e*t[1],n}(e,t,-i))||0
;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,
r*=-1,i*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*Tn,
this.translate=[n.e,n.f],this.scale=[r,u],this.skew=u?Math.atan2(i,u)*Tn:0}
function _u(n,t){return n[0]*t[0]+n[1]*t[1]}function wu(n){
var t=Math.sqrt(_u(n,n));return t&&(n[0]/=t,n[1]/=t),t}n.ease=function(n){
var e=n.indexOf("-"),r=e>=0?n.slice(0,e):n,i=e>=0?n.slice(e+1):"in"
;return r=lu.get(r)||au,fu((i=cu.get(i)||L)(r.apply(null,t.call(arguments,1))))
},n.interpolateHcl=function(t,e){t=n.hcl(t),e=n.hcl(e)
;var r=t.h,i=t.c,u=t.l,o=e.h-r,a=e.c-i,l=e.l-u;isNaN(a)&&(a=0,i=isNaN(i)?e.c:i)
;isNaN(o)?(o=0,r=isNaN(r)?e.h:r):o>180?o-=360:o<-180&&(o+=360)
;return function(n){return Jn(r+o*n,i+a*n,u+l*n)+""}
},n.interpolateHsl=function(t,e){t=n.hsl(t),e=n.hsl(e)
;var r=t.h,i=t.s,u=t.l,o=e.h-r,a=e.s-i,l=e.l-u;isNaN(a)&&(a=0,i=isNaN(i)?e.s:i)
;isNaN(o)?(o=0,r=isNaN(r)?e.h:r):o>180?o-=360:o<-180&&(o+=360)
;return function(n){return $n(r+o*n,i+a*n,u+l*n)+""}
},n.interpolateLab=function(t,e){t=n.lab(t),e=n.lab(e)
;var r=t.l,i=t.a,u=t.b,o=e.l-r,a=e.a-i,l=e.b-u;return function(n){
return rt(r+o*n,i+a*n,u+l*n)+""}},n.interpolateRound=xu,n.transform=function(t){
var e=r.createElementNS(n.ns.prefix.svg,"g");return(n.transform=function(n){
if(null!=n){e.setAttribute("transform",n)
;var t=e.transform.baseVal.consolidate()}return new bu(t?t.matrix:Su)})(t)
},bu.prototype.toString=function(){
return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"
};var Su={a:1,b:0,c:0,d:1,e:0,f:0};function ku(n){return n.length?n.pop()+",":""
}function Nu(t,e){var r=[],i=[]
;return t=n.transform(t),e=n.transform(e),function(n,t,e,r){
if(n[0]!==t[0]||n[1]!==t[1]){var i=e.push("translate(",null,",",null,")")
;r.push({i:i-4,x:tu(n[0],t[0])},{i:i-2,x:tu(n[1],t[1])})
}else(t[0]||t[1])&&e.push("translate("+t+")")
}(t.translate,e.translate,r,i),function(n,t,e,r){
n!==t?(n-t>180?t+=360:t-n>180&&(n+=360),r.push({
i:e.push(ku(e)+"rotate(",null,")")-2,x:tu(n,t)
})):t&&e.push(ku(e)+"rotate("+t+")")}(t.rotate,e.rotate,r,i),function(n,t,e,r){
n!==t?r.push({i:e.push(ku(e)+"skewX(",null,")")-2,x:tu(n,t)
}):t&&e.push(ku(e)+"skewX("+t+")")}(t.skew,e.skew,r,i),function(n,t,e,r){
if(n[0]!==t[0]||n[1]!==t[1]){var i=e.push(ku(e)+"scale(",null,",",null,")")
;r.push({i:i-4,x:tu(n[0],t[0])},{i:i-2,x:tu(n[1],t[1])})
}else 1===t[0]&&1===t[1]||e.push(ku(e)+"scale("+t+")")
}(t.scale,e.scale,r,i),t=e=null,function(n){
for(var t,e=-1,u=i.length;++e<u;)r[(t=i[e]).i]=t.x(n);return r.join("")}}
function Eu(n,t){return t=(t-=n=+n)||1/t,function(e){return(e-n)/t}}
function Au(n,t){return t=(t-=n=+n)||1/t,function(e){
return Math.max(0,Math.min(1,(e-n)/t))}}function Cu(n){
for(var t=n.source,e=n.target,r=function(n,t){if(n===t)return n
;var e=zu(n),r=zu(t),i=e.pop(),u=r.pop(),o=null
;for(;i===u;)o=i,i=e.pop(),u=r.pop();return o
}(t,e),i=[t];t!==r;)t=t.parent,i.push(t)
;for(var u=i.length;e!==r;)i.splice(u,0,e),e=e.parent;return i}function zu(n){
for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}
function Lu(n){n.fixed|=2}function qu(n){n.fixed&=-7}function Tu(n){
n.fixed|=4,n.px=n.x,n.py=n.y}function Ru(n){n.fixed&=-5}
n.interpolateTransform=Nu,n.layout={},n.layout.bundle=function(){
return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Cu(n[e]));return t
}},n.layout.chord=function(){var t,e,r,i,u,o,a,l={},c=0;function f(){
var l,f,h,p,g,v={},d=[],y=n.range(i),m=[];for(t=[],e=[],l=0,p=-1;++p<i;){
for(f=0,g=-1;++g<i;)f+=r[p][g];d.push(f),m.push(n.range(i)),l+=f}
for(u&&y.sort((function(n,t){return u(d[n],d[t])})),o&&m.forEach((function(n,t){
n.sort((function(n,e){return o(r[t][n],r[t][e])}))
})),l=(Cn-c*i)/l,f=0,p=-1;++p<i;){for(h=f,g=-1;++g<i;){
var M=y[p],x=m[M][g],b=r[M][x],_=f,w=f+=b*l;v[M+"-"+x]={index:M,subindex:x,
startAngle:_,endAngle:w,value:b}}e[M]={index:M,startAngle:h,endAngle:f,
value:d[M]},f+=c}for(p=-1;++p<i;)for(g=p-1;++g<i;){var S=v[p+"-"+g],k=v[g+"-"+p]
;(S.value||k.value)&&t.push(S.value<k.value?{source:k,target:S}:{source:S,
target:k})}a&&s()}function s(){t.sort((function(n,t){
return a((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)}))
}return l.matrix=function(n){
return arguments.length?(i=(r=n)&&r.length,t=e=null,l):r},l.padding=function(n){
return arguments.length?(c=n,t=e=null,l):c},l.sortGroups=function(n){
return arguments.length?(u=n,t=e=null,l):u},l.sortSubgroups=function(n){
return arguments.length?(o=n,t=null,l):o},l.sortChords=function(n){
return arguments.length?(a=n,t&&s(),l):a},l.chords=function(){return t||f(),t
},l.groups=function(){return e||f(),e},l},n.layout.force=function(){
var t,e,r,i,u,o,a={},l=n.dispatch("start","tick","end"),c=[1,1],f=.9,s=Du,h=Pu,p=-30,g=Uu,v=.1,d=.64,y=[],m=[]
;function M(n){return function(t,e,r,i){if(t.point!==n){
var u=t.cx-n.x,o=t.cy-n.y,a=i-e,l=u*u+o*o;if(a*a/d<l){if(l<g){var c=t.charge/l
;n.px-=u*c,n.py-=o*c}return!0}if(t.point&&l&&l<g){c=t.pointCharge/l
;n.px-=u*c,n.py-=o*c}}return!t.charge}}function x(t){
t.px=n.event.x,t.py=n.event.y,a.resume()}return a.tick=function(){
if((r*=.99)<.005)return t=null,l.end({type:"end",alpha:r=0}),!0
;var e,a,s,h,g,d,x,b,_,w=y.length,S=m.length
;for(a=0;a<S;++a)h=(s=m[a]).source,(d=(b=(g=s.target).x-h.x)*b+(_=g.y-h.y)*_)&&(b*=d=r*u[a]*((d=Math.sqrt(d))-i[a])/d,
_*=d,
g.x-=b*(x=h.weight+g.weight?h.weight/(h.weight+g.weight):.5),g.y-=_*x,h.x+=b*(x=1-x),
h.y+=_*x)
;if((x=r*v)&&(b=c[0]/2,_=c[1]/2,a=-1,x))for(;++a<w;)(s=y[a]).x+=(b-s.x)*x,
s.y+=(_-s.y)*x;if(p)for(!function n(t,e,r){var i=0,u=0
;if(t.charge=0,!t.leaf)for(var o,a=t.nodes,l=a.length,c=-1;++c<l;)null!=(o=a[c])&&(n(o,e,r),
t.charge+=o.charge,i+=o.charge*o.cx,u+=o.charge*o.cy);if(t.point){
t.leaf||(t.point.x+=Math.random()-.5,t.point.y+=Math.random()-.5)
;var f=e*r[t.point.index]
;t.charge+=t.pointCharge=f,i+=f*t.point.x,u+=f*t.point.y}
t.cx=i/t.charge,t.cy=u/t.charge
}(e=n.geom.quadtree(y),r,o),a=-1;++a<w;)(s=y[a]).fixed||e.visit(M(s))
;for(a=-1;++a<w;)(s=y[a]).fixed?(s.x=s.px,
s.y=s.py):(s.x-=(s.px-(s.px=s.x))*f,s.y-=(s.py-(s.py=s.y))*f);l.tick({
type:"tick",alpha:r})},a.nodes=function(n){return arguments.length?(y=n,a):y
},a.links=function(n){return arguments.length?(m=n,a):m},a.size=function(n){
return arguments.length?(c=n,a):c},a.linkDistance=function(n){
return arguments.length?(s="function"==typeof n?n:+n,a):s
},a.distance=a.linkDistance,a.linkStrength=function(n){
return arguments.length?(h="function"==typeof n?n:+n,a):h
},a.friction=function(n){return arguments.length?(f=+n,a):f
},a.charge=function(n){return arguments.length?(p="function"==typeof n?n:+n,a):p
},a.chargeDistance=function(n){return arguments.length?(g=n*n,a):Math.sqrt(g)
},a.gravity=function(n){return arguments.length?(v=+n,a):v},a.theta=function(n){
return arguments.length?(d=n*n,a):Math.sqrt(d)},a.alpha=function(n){
return arguments.length?(n=+n,r?n>0?r=n:(t.c=null,t.t=NaN,t=null,l.end({
type:"end",alpha:r=0})):n>0&&(l.start({type:"start",alpha:r=n
}),t=Et(a.tick)),a):r},a.start=function(){
var n,t,e,r=y.length,l=m.length,f=c[0],g=c[1]
;for(n=0;n<r;++n)(e=y[n]).index=n,e.weight=0
;for(n=0;n<l;++n)"number"==typeof(e=m[n]).source&&(e.source=y[e.source]),
"number"==typeof e.target&&(e.target=y[e.target]),
++e.source.weight,++e.target.weight
;for(n=0;n<r;++n)e=y[n],isNaN(e.x)&&(e.x=v("x",f)),
isNaN(e.y)&&(e.y=v("y",g)),isNaN(e.px)&&(e.px=e.x),isNaN(e.py)&&(e.py=e.y)
;if(i=[],
"function"==typeof s)for(n=0;n<l;++n)i[n]=+s.call(this,m[n],n);else for(n=0;n<l;++n)i[n]=s
;if(u=[],
"function"==typeof h)for(n=0;n<l;++n)u[n]=+h.call(this,m[n],n);else for(n=0;n<l;++n)u[n]=h
;if(o=[],
"function"==typeof p)for(n=0;n<r;++n)o[n]=+p.call(this,y[n],n);else for(n=0;n<r;++n)o[n]=p
;function v(e,i){if(!t){for(t=new Array(r),c=0;c<r;++c)t[c]=[];for(c=0;c<l;++c){
var u=m[c];t[u.source.index].push(u.target),t[u.target.index].push(u.source)}}
for(var o,a=t[n],c=-1,f=a.length;++c<f;)if(!isNaN(o=a[c][e]))return o
;return Math.random()*i}return a.resume()},a.resume=function(){
return a.alpha(.1)},a.stop=function(){return a.alpha(0)},a.drag=function(){
if(e||(e=n.behavior.drag().origin(L).on("dragstart.force",Lu).on("drag.force",x).on("dragend.force",qu)),
!arguments.length)return e
;this.on("mouseover.force",Tu).on("mouseout.force",Ru).call(e)
},n.rebind(a,l,"on")};var Du=20,Pu=1,Uu=1/0;function ju(t,e){
return n.rebind(t,e,"sort","children","value"),t.nodes=t,t.links=Zu,t}
function Fu(n,t){
for(var e=[n];null!=(n=e.pop());)if(t(n),(i=n.children)&&(r=i.length))for(var r,i;--r>=0;)e.push(i[r])
}function Hu(n,t){
for(var e=[n],r=[];null!=(n=e.pop());)if(r.push(n),(u=n.children)&&(i=u.length))for(var i,u,o=-1;++o<i;)e.push(u[o])
;for(;null!=(n=r.pop());)t(n)}function Ou(n){return n.children}function Iu(n){
return n.value}function Yu(n,t){return t.value-n.value}function Zu(t){
return n.merge(t.map((function(n){return(n.children||[]).map((function(t){
return{source:n,target:t}}))})))}n.layout.hierarchy=function(){
var n=Yu,t=Ou,e=Iu;function r(i){var u,o=[i],a=[]
;for(i.depth=0;null!=(u=o.pop());)if(a.push(u),
(c=t.call(r,u,u.depth))&&(l=c.length)){
for(var l,c,f;--l>=0;)o.push(f=c[l]),f.parent=u,f.depth=u.depth+1
;e&&(u.value=0),u.children=c
}else e&&(u.value=+e.call(r,u,u.depth)||0),delete u.children
;return Hu(i,(function(t){var r,i
;n&&(r=t.children)&&r.sort(n),e&&(i=t.parent)&&(i.value+=t.value)})),a}
return r.sort=function(t){return arguments.length?(n=t,r):n
},r.children=function(n){return arguments.length?(t=n,r):t},r.value=function(n){
return arguments.length?(e=n,r):e},r.revalue=function(n){
return e&&(Fu(n,(function(n){n.children&&(n.value=0)})),Hu(n,(function(n){var t
;n.children||(n.value=+e.call(r,n,n.depth)||0),(t=n.parent)&&(t.value+=n.value)
}))),n},r},n.layout.partition=function(){var t=n.layout.hierarchy(),e=[1,1]
;function r(n,r){var i=t.call(this,n,r);return function n(t,e,r,i){
var u=t.children;if(t.x=e,t.y=t.depth*i,t.dx=r,t.dy=i,u&&(o=u.length)){
var o,a,l,c=-1;for(r=t.value?r/t.value:0;++c<o;)n(a=u[c],e,l=a.value*r,i),e+=l}
}(i[0],0,e[0],e[1]/function n(t){var e=t.children,r=0
;if(e&&(i=e.length))for(var i,u=-1;++u<i;)r=Math.max(r,n(e[u]));return 1+r
}(i[0])),i}return r.size=function(n){return arguments.length?(e=n,r):e},ju(r,t)
},n.layout.pie=function(){var t=Number,e=Vu,r=0,i=Cn,u=0;function o(a){
var l,c=a.length,f=a.map((function(n,e){return+t.call(o,n,e)
})),s=+("function"==typeof r?r.apply(this,arguments):r),h=("function"==typeof i?i.apply(this,arguments):i)-s,p=Math.min(Math.abs(h)/c,+("function"==typeof u?u.apply(this,arguments):u)),g=p*(h<0?-1:1),v=n.sum(f),d=v?(h-c*g)/v:0,y=n.range(c),m=[]
;return null!=e&&y.sort(e===Vu?function(n,t){return f[t]-f[n]}:function(n,t){
return e(a[n],a[t])}),y.forEach((function(n){m[n]={data:a[n],value:l=f[n],
startAngle:s,endAngle:s+=l*d+g,padAngle:p}})),m}return o.value=function(n){
return arguments.length?(t=n,o):t},o.sort=function(n){
return arguments.length?(e=n,o):e},o.startAngle=function(n){
return arguments.length?(r=n,o):r},o.endAngle=function(n){
return arguments.length?(i=n,o):i},o.padAngle=function(n){
return arguments.length?(u=n,o):u},o};var Vu={};function Xu(n){return n.x}
function $u(n){return n.y}function Bu(n,t,e){n.y0=t,n.y=e}
n.layout.stack=function(){var t=L,e=Gu,r=Ku,i=Bu,u=Xu,o=$u;function a(l,c){
if(!(p=l.length))return l;var f=l.map((function(n,e){return t.call(a,n,e)
})),s=f.map((function(n){return n.map((function(n,t){
return[u.call(a,n,t),o.call(a,n,t)]}))})),h=e.call(a,s,c)
;f=n.permute(f,h),s=n.permute(s,h);var p,g,v,d,y=r.call(a,s,c),m=f[0].length
;for(v=0;v<m;++v)for(i.call(a,f[0][v],d=y[v],s[0][v][1]),
g=1;g<p;++g)i.call(a,f[g][v],d+=s[g-1][v][1],s[g][v][1]);return l}
return a.values=function(n){return arguments.length?(t=n,a):t
},a.order=function(n){
return arguments.length?(e="function"==typeof n?n:Wu.get(n)||Gu,a):e
},a.offset=function(n){
return arguments.length?(r="function"==typeof n?n:Ju.get(n)||Ku,a):r
},a.x=function(n){return arguments.length?(u=n,a):u},a.y=function(n){
return arguments.length?(o=n,a):o},a.out=function(n){
return arguments.length?(i=n,a):i},a};var Wu=n.map({"inside-out":function(t){
var e,r,i=t.length,u=t.map(Qu),o=t.map(no),a=n.range(i).sort((function(n,t){
return u[n]-u[t]})),l=0,c=0,f=[],s=[]
;for(e=0;e<i;++e)r=a[e],l<c?(l+=o[r],f.push(r)):(c+=o[r],s.push(r))
;return s.reverse().concat(f)},reverse:function(t){
return n.range(t.length).reverse()},default:Gu}),Ju=n.map({
silhouette:function(n){var t,e,r,i=n.length,u=n[0].length,o=[],a=0,l=[]
;for(e=0;e<u;++e){for(t=0,r=0;t<i;t++)r+=n[t][e][1];r>a&&(a=r),o.push(r)}
for(e=0;e<u;++e)l[e]=(a-o[e])/2;return l},wiggle:function(n){
var t,e,r,i,u,o,a,l,c,f=n.length,s=n[0],h=s.length,p=[]
;for(p[0]=l=c=0,e=1;e<h;++e){for(t=0,i=0;t<f;++t)i+=n[t][e][1]
;for(t=0,u=0,a=s[e][0]-s[e-1][0];t<f;++t){
for(r=0,o=(n[t][e][1]-n[t][e-1][1])/(2*a);r<t;++r)o+=(n[r][e][1]-n[r][e-1][1])/a
;u+=o*n[t][e][1]}p[e]=l-=i?u/i*a:0,l<c&&(c=l)}for(e=0;e<h;++e)p[e]-=c;return p},
expand:function(n){var t,e,r,i=n.length,u=n[0].length,o=1/i,a=[]
;for(e=0;e<u;++e){for(t=0,r=0;t<i;t++)r+=n[t][e][1]
;if(r)for(t=0;t<i;t++)n[t][e][1]/=r;else for(t=0;t<i;t++)n[t][e][1]=o}
for(e=0;e<u;++e)a[e]=0;return a},zero:Ku});function Gu(t){
return n.range(t.length)}function Ku(n){
for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function Qu(n){
for(var t,e=1,r=0,i=n[0][1],u=n.length;e<u;++e)(t=n[e][1])>i&&(r=e,i=t);return r
}function no(n){return n.reduce(to,0)}function to(n,t){return n+t[1]}
function eo(n,t){return ro(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}
function ro(n,t){for(var e=-1,r=+n[0],i=(n[1]-r)/t,u=[];++e<=t;)u[e]=i*e+r
;return u}function io(t){return[n.min(t),n.max(t)]}function uo(n,t){
return n.value-t.value}function oo(n,t){var e=n._pack_next
;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function ao(n,t){
n._pack_next=t,t._pack_prev=n}function lo(n,t){var e=t.x-n.x,r=t.y-n.y,i=n.r+t.r
;return.999*i*i>e*e+r*r}function co(n){if((t=n.children)&&(l=t.length)){
var t,e,r,i,u,o,a,l,c=1/0,f=-1/0,s=1/0,h=-1/0
;if(t.forEach(fo),(e=t[0]).x=-e.r,e.y=0,
M(e),l>1&&((r=t[1]).x=r.r,r.y=0,M(r),l>2))for(ho(e,r,i=t[2]),
M(i),oo(e,i),e._pack_prev=i,oo(i,r),r=e._pack_next,u=3;u<l;u++){ho(e,r,i=t[u])
;var p=0,g=1,v=1;for(o=r._pack_next;o!==r;o=o._pack_next,g++)if(lo(o,i)){p=1
;break}
if(1==p)for(a=e._pack_prev;a!==o._pack_prev&&!lo(a,i);a=a._pack_prev,v++);
p?(g<v||g==v&&r.r<e.r?ao(e,r=o):ao(e=a,r),u--):(oo(e,i),r=i,M(i))}
var d=(c+f)/2,y=(s+h)/2,m=0
;for(u=0;u<l;u++)(i=t[u]).x-=d,i.y-=y,m=Math.max(m,i.r+Math.sqrt(i.x*i.x+i.y*i.y))
;n.r=m,t.forEach(so)}function M(n){
c=Math.min(n.x-n.r,c),f=Math.max(n.x+n.r,f),s=Math.min(n.y-n.r,s),
h=Math.max(n.y+n.r,h)}}function fo(n){n._pack_next=n._pack_prev=n}
function so(n){delete n._pack_next,delete n._pack_prev}function ho(n,t,e){
var r=n.r+e.r,i=t.x-n.x,u=t.y-n.y;if(r&&(i||u)){
var o=t.r+e.r,a=i*i+u*u,l=.5+((r*=r)-(o*=o))/(2*a),c=Math.sqrt(Math.max(0,2*o*(r+a)-(r-=a)*r-o*o))/(2*a)
;e.x=n.x+l*i+c*u,e.y=n.y+l*u-c*i}else e.x=n.x+r,e.y=n.y}function po(n,t){
return n.parent==t.parent?1:2}function go(n){var t=n.children
;return t.length?t[0]:n.t}function vo(n){var t,e=n.children
;return(t=e.length)?e[t-1]:n.t}function yo(n,t,e){var r=e/(t.i-n.i)
;t.c-=r,t.s+=e,n.c+=r,t.z+=e,t.m+=e}function mo(n,t,e){
return n.a.parent===t.parent?n.a:e}function Mo(n){return{x:n.x,y:n.y,dx:n.dx,
dy:n.dy}}function xo(n,t){
var e=n.x+t[3],r=n.y+t[0],i=n.dx-t[1]-t[3],u=n.dy-t[0]-t[2];return i<0&&(e+=i/2,
i=0),u<0&&(r+=u/2,u=0),{x:e,y:r,dx:i,dy:u}}function bo(n){
var t=n[0],e=n[n.length-1];return t<e?[t,e]:[e,t]}function _o(n){
return n.rangeExtent?n.rangeExtent():bo(n.range())}function wo(n,t,e,r){
var i=e(n[0],n[1]),u=r(t[0],t[1]);return function(n){return u(i(n))}}
function So(n,t){var e,r=0,i=n.length-1,u=n[r],o=n[i]
;return o<u&&(e=r,r=i,i=e,e=u,u=o,o=e),n[r]=t.floor(u),n[i]=t.ceil(o),n}
function ko(n){return n?{floor:function(t){return Math.floor(t/n)*n},
ceil:function(t){return Math.ceil(t/n)*n}}:No}n.layout.histogram=function(){
var t=!0,e=Number,r=io,i=eo;function u(u,o){
for(var a,l,c=[],f=u.map(e,this),s=r.call(this,f,o),h=i.call(this,s,f,o),p=(o=-1,
f.length),g=h.length-1,v=t?1:1/p;++o<g;)(a=c[o]=[]).dx=h[o+1]-(a.x=h[o]),a.y=0
;if(g>0)for(o=-1;++o<p;)(l=f[o])>=s[0]&&l<=s[1]&&((a=c[n.bisect(h,l,1,g)-1]).y+=v,
a.push(u[o]));return c}return u.value=function(n){
return arguments.length?(e=n,u):e},u.range=function(n){
return arguments.length?(r=Mt(n),u):r},u.bins=function(n){
return arguments.length?(i="number"==typeof n?function(t){return ro(t,n)}:Mt(n),
u):i},u.frequency=function(n){return arguments.length?(t=!!n,u):t},u
},n.layout.pack=function(){var t,e=n.layout.hierarchy().sort(uo),r=0,i=[1,1]
;function u(n,u){
var o=e.call(this,n,u),a=o[0],l=i[0],c=i[1],f=null==t?Math.sqrt:"function"==typeof t?t:function(){
return t};if(a.x=a.y=0,Hu(a,(function(n){n.r=+f(n.value)})),Hu(a,co),r){
var s=r*(t?1:Math.max(2*a.r/l,2*a.r/c))/2;Hu(a,(function(n){n.r+=s
})),Hu(a,co),Hu(a,(function(n){n.r-=s}))}return function n(t,e,r,i){
var u=t.children
;if(t.x=e+=i*t.x,t.y=r+=i*t.y,t.r*=i,u)for(var o=-1,a=u.length;++o<a;)n(u[o],e,r,i)
}(a,l/2,c/2,t?1:1/Math.max(2*a.r/l,2*a.r/c)),o}return u.size=function(n){
return arguments.length?(i=n,u):i},u.radius=function(n){
return arguments.length?(t=null==n||"function"==typeof n?n:+n,u):t
},u.padding=function(n){return arguments.length?(r=+n,u):r},ju(u,e)
},n.layout.tree=function(){
var t=n.layout.hierarchy().sort(null).value(null),e=po,r=[1,1],i=null
;function u(n,u){var c=t.call(this,n,u),f=c[0],s=function(n){var t,e={A:null,
children:[n]},r=[e]
;for(;null!=(t=r.pop());)for(var i,u=t.children,o=0,a=u.length;o<a;++o)r.push((u[o]=i={
_:u[o],parent:t,children:(i=u[o].children)&&i.slice()||[],A:null,a:null,z:0,m:0,
c:0,s:0,t:null,i:o}).a=i);return e.children[0]}(f)
;if(Hu(s,o),s.parent.m=-s.z,Fu(s,a),i)Fu(f,l);else{var h=f,p=f,g=f
;Fu(f,(function(n){n.x<h.x&&(h=n),n.x>p.x&&(p=n),n.depth>g.depth&&(g=n)}))
;var v=e(h,p)/2-h.x,d=r[0]/(p.x+e(p,h)/2+v),y=r[1]/(g.depth||1)
;Fu(f,(function(n){n.x=(n.x+v)*d,n.y=n.depth*y}))}return c}function o(n){
var t=n.children,r=n.parent.children,i=n.i?r[n.i-1]:null;if(t.length){
!function(n){var t,e=0,r=0,i=n.children,u=i.length
;for(;--u>=0;)(t=i[u]).z+=e,t.m+=e,e+=t.s+(r+=t.c)}(n)
;var u=(t[0].z+t[t.length-1].z)/2;i?(n.z=i.z+e(n._,i._),n.m=n.z-u):n.z=u
}else i&&(n.z=i.z+e(n._,i._));n.parent.A=function(n,t,r){if(t){
for(var i,u=n,o=n,a=t,l=u.parent.children[0],c=u.m,f=o.m,s=a.m,h=l.m;a=vo(a),
u=go(u),
a&&u;)l=go(l),(o=vo(o)).a=n,(i=a.z+s-u.z-c+e(a._,u._))>0&&(yo(mo(a,n,r),n,i),
c+=i,f+=i),s+=a.m,c+=u.m,h+=l.m,f+=o.m
;a&&!vo(o)&&(o.t=a,o.m+=s-f),u&&!go(l)&&(l.t=u,l.m+=c-h,r=n)}return r
}(n,i,n.parent.A||r[0])}function a(n){n._.x=n.z+n.parent.m,n.m+=n.parent.m}
function l(n){n.x*=r[0],n.y=n.depth*r[1]}return u.separation=function(n){
return arguments.length?(e=n,u):e},u.size=function(n){
return arguments.length?(i=null==(r=n)?l:null,u):i?null:r
},u.nodeSize=function(n){
return arguments.length?(i=null==(r=n)?null:l,u):i?r:null},ju(u,t)
},n.layout.cluster=function(){
var t=n.layout.hierarchy().sort(null).value(null),e=po,r=[1,1],i=!1
;function u(u,o){var a,l=t.call(this,u,o),c=l[0],f=0;Hu(c,(function(t){
var r=t.children;r&&r.length?(t.x=function(n){return n.reduce((function(n,t){
return n+t.x}),0)/n.length}(r),t.y=function(t){return 1+n.max(t,(function(n){
return n.y}))}(r)):(t.x=a?f+=e(t,a):0,t.y=0,a=t)}));var s=function n(t){
var e=t.children;return e&&e.length?n(e[0]):t}(c),h=function n(t){
var e,r=t.children;return r&&(e=r.length)?n(r[e-1]):t
}(c),p=s.x-e(s,h)/2,g=h.x+e(h,s)/2;return Hu(c,i?function(n){n.x=(n.x-c.x)*r[0],
n.y=(c.y-n.y)*r[1]}:function(n){
n.x=(n.x-p)/(g-p)*r[0],n.y=(1-(c.y?n.y/c.y:1))*r[1]}),l}
return u.separation=function(n){return arguments.length?(e=n,u):e
},u.size=function(n){return arguments.length?(i=null==(r=n),u):i?null:r
},u.nodeSize=function(n){return arguments.length?(i=null!=(r=n),u):i?r:null
},ju(u,t)},n.layout.treemap=function(){
var t,e=n.layout.hierarchy(),r=Math.round,i=[1,1],u=null,o=Mo,a=!1,l="squarify",c=.5*(1+Math.sqrt(5))
;function f(n,t){
for(var e,r,i=-1,u=n.length;++i<u;)r=(e=n[i]).value*(t<0?0:t),e.area=isNaN(r)||r<=0?0:r
}function s(n){var t=n.children;if(t&&t.length){
var e,r,i,u=o(n),a=[],c=t.slice(),h=1/0,v="slice"===l?u.dx:"dice"===l?u.dy:"slice-dice"===l?1&n.depth?u.dy:u.dx:Math.min(u.dx,u.dy)
;for(f(c,u.dx*u.dy/n.value),
a.area=0;(i=c.length)>0;)a.push(e=c[i-1]),a.area+=e.area,
"squarify"!==l||(r=p(a,v))<=h?(c.pop(),
h=r):(a.area-=a.pop().area,g(a,v,u,!1),v=Math.min(u.dx,u.dy),
a.length=a.area=0,h=1/0);a.length&&(g(a,v,u,!0),a.length=a.area=0),t.forEach(s)}
}function h(n){var t=n.children;if(t&&t.length){var e,r=o(n),i=t.slice(),u=[]
;for(f(i,r.dx*r.dy/n.value),
u.area=0;e=i.pop();)u.push(e),u.area+=e.area,null!=e.z&&(g(u,e.z?r.dx:r.dy,r,!i.length),
u.length=u.area=0);t.forEach(h)}}function p(n,t){
for(var e,r=n.area,i=0,u=1/0,o=-1,a=n.length;++o<a;)(e=n[o].area)&&(e<u&&(u=e),
e>i&&(i=e));return t*=t,(r*=r)?Math.max(t*i*c/r,r/(t*u*c)):1/0}
function g(n,t,e,i){var u,o=-1,a=n.length,l=e.x,c=e.y,f=t?r(n.area/t):0
;if(t==e.dx){
for((i||f>e.dy)&&(f=e.dy);++o<a;)(u=n[o]).x=l,u.y=c,u.dy=f,l+=u.dx=Math.min(e.x+e.dx-l,f?r(u.area/f):0)
;u.z=!0,u.dx+=e.x+e.dx-l,e.y+=f,e.dy-=f}else{
for((i||f>e.dx)&&(f=e.dx);++o<a;)(u=n[o]).x=l,
u.y=c,u.dx=f,c+=u.dy=Math.min(e.y+e.dy-c,f?r(u.area/f):0)
;u.z=!1,u.dy+=e.y+e.dy-c,e.x+=f,e.dx-=f}}function v(n){var r=t||e(n),u=r[0]
;return u.x=u.y=0,
u.value?(u.dx=i[0],u.dy=i[1]):u.dx=u.dy=0,t&&e.revalue(u),f([u],u.dx*u.dy/u.value),
(t?h:s)(u),a&&(t=r),r}return v.size=function(n){
return arguments.length?(i=n,v):i},v.padding=function(n){
if(!arguments.length)return u;function t(t){var e=n.call(v,t,t.depth)
;return null==e?Mo(t):xo(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){
return xo(t,n)}var r
;return o=null==(u=n)?Mo:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],
e):e,v},v.round=function(n){
return arguments.length?(r=n?Math.round:Number,v):r!=Number
},v.sticky=function(n){return arguments.length?(a=n,t=null,v):a
},v.ratio=function(n){return arguments.length?(c=n,v):c},v.mode=function(n){
return arguments.length?(l=n+"",v):l},ju(v,e)},n.random={normal:function(n,t){
var e=arguments.length;return e<2&&(t=1),e<1&&(n=0),function(){var e,r,i;do{
i=(e=2*Math.random()-1)*e+(r=2*Math.random()-1)*r}while(!i||i>1)
;return n+t*e*Math.sqrt(-2*Math.log(i)/i)}},logNormal:function(){
var t=n.random.normal.apply(n,arguments);return function(){return Math.exp(t())}
},bates:function(t){var e=n.random.irwinHall(t);return function(){return e()/t}
},irwinHall:function(n){return function(){
for(var t=0,e=0;e<n;e++)t+=Math.random();return t}}},n.scale={};var No={floor:L,
ceil:L};function Eo(t,e,r,i){var u=[],o=[],a=0,l=Math.min(t.length,e.length)-1
;for(t[l]<t[0]&&(t=t.slice().reverse(),
e=e.slice().reverse());++a<=l;)u.push(r(t[a-1],t[a])),o.push(i(e[a-1],e[a]))
;return function(e){var r=n.bisect(t,e,1,l)-1;return o[r](u[r](e))}}
function Ao(t,e){return n.rebind(t,e,"range","rangeRound","interpolate","clamp")
}function Co(n,t){return So(n,ko(zo(n,t)[2])),So(n,ko(zo(n,t)[2])),n}
function zo(n,t){null==t&&(t=10)
;var e=bo(n),r=e[1]-e[0],i=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),u=t/r*i
;return u<=.15?i*=10:u<=.35?i*=5:u<=.75&&(i*=2),
e[0]=Math.ceil(e[0]/i)*i,e[1]=Math.floor(e[1]/i)*i+.5*i,e[2]=i,e}
function Lo(t,e){return n.range.apply(n,zo(t,e))}function qo(t,e,r){
var i=zo(t,e);if(r){var u=Rt.exec(r);if(u.shift(),"s"===u[8]){
var o=n.formatPrefix(Math.max(y(i[0]),y(i[1])))
;return u[7]||(u[7]="."+Ro(o.scale(i[2]))),
u[8]="f",r=n.format(u.join("")),function(n){return r(o.scale(n))+o.symbol}}
u[7]||(u[7]="."+function(n,t){var e=Ro(t[2])
;return n in To?Math.abs(e-Ro(Math.max(y(t[0]),y(t[1]))))+ +("e"!==n):e-2*("%"===n)
}(u[8],i)),r=u.join("")}else r=",."+Ro(i[2])+"f";return n.format(r)}
n.scale.linear=function(){return function n(t,e,r,i){var u,o;function a(){
var n=Math.min(t.length,e.length)>2?Eo:wo,a=i?Au:Eu
;return u=n(t,e,a,r),o=n(e,t,a,uu),l}function l(n){return u(n)}
return l.invert=function(n){return o(n)},l.domain=function(n){
return arguments.length?(t=n.map(Number),a()):t},l.range=function(n){
return arguments.length?(e=n,a()):e},l.rangeRound=function(n){
return l.range(n).interpolate(xu)},l.clamp=function(n){
return arguments.length?(i=n,a()):i},l.interpolate=function(n){
return arguments.length?(r=n,a()):r},l.ticks=function(n){return Lo(t,n)
},l.tickFormat=function(n,e){return qo(t,n,e)},l.nice=function(n){
return Co(t,n),a()},l.copy=function(){return n(t,e,r,i)},a()}([0,1],[0,1],uu,!1)
};var To={s:1,g:1,p:1,r:1,e:1};function Ro(n){
return-Math.floor(Math.log(n)/Math.LN10+.01)}n.scale.log=function(){
return function t(e,r,i,u){function o(n){
return(i?Math.log(n<0?0:n):-Math.log(n>0?0:-n))/Math.log(r)}function a(n){
return i?Math.pow(r,n):-Math.pow(r,-n)}function l(n){return e(o(n))}
return l.invert=function(n){return a(e.invert(n))},l.domain=function(n){
return arguments.length?(i=n[0]>=0,e.domain((u=n.map(Number)).map(o)),l):u
},l.base=function(n){return arguments.length?(r=+n,e.domain(u.map(o)),l):r
},l.nice=function(){var n=So(u.map(o),i?Math:Po);return e.domain(n),u=n.map(a),l
},l.ticks=function(){
var n=bo(u),t=[],e=n[0],l=n[1],c=Math.floor(o(e)),f=Math.ceil(o(l)),s=r%1?2:r
;if(isFinite(f-c)){if(i){for(;c<f;c++)for(var h=1;h<s;h++)t.push(a(c)*h)
;t.push(a(c))}else for(t.push(a(c));c++<f;)for(h=s-1;h>0;h--)t.push(a(c)*h)
;for(c=0;t[c]<e;c++);for(f=t.length;t[f-1]>l;f--);t=t.slice(c,f)}return t
},l.tickFormat=function(t,e){if(!arguments.length)return Do
;arguments.length<2?e=Do:"function"!=typeof e&&(e=n.format(e))
;var i=Math.max(1,r*t/l.ticks().length);return function(n){
var t=n/a(Math.round(o(n)));return t*r<r-.5&&(t*=r),t<=i?e(n):""}
},l.copy=function(){return t(e.copy(),r,i,u)},Ao(l,e)
}(n.scale.linear().domain([0,1]),10,!0,[1,10])};var Do=n.format(".0e"),Po={
floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}}
;function Uo(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}
n.scale.pow=function(){return function n(t,e,r){var i=Uo(e),u=Uo(1/e)
;function o(n){return t(i(n))}return o.invert=function(n){return u(t.invert(n))
},o.domain=function(n){
return arguments.length?(t.domain((r=n.map(Number)).map(i)),o):r
},o.ticks=function(n){return Lo(r,n)},o.tickFormat=function(n,t){
return qo(r,n,t)},o.nice=function(n){return o.domain(Co(r,n))
},o.exponent=function(n){
return arguments.length?(i=Uo(e=n),u=Uo(1/e),t.domain(r.map(i)),o):e
},o.copy=function(){return n(t.copy(),e,r)},Ao(o,t)}(n.scale.linear(),1,[0,1])},
n.scale.sqrt=function(){return n.scale.pow().exponent(.5)
},n.scale.ordinal=function(){return function t(e,r){var i,u,o;function a(n){
return u[((i.get(n)||("range"===r.t?i.set(n,e.push(n)):NaN))-1)%u.length]}
function l(t,r){return n.range(e.length).map((function(n){return t+r*n}))}
return a.domain=function(n){if(!arguments.length)return e;e=[],i=new x
;for(var t,u=-1,o=n.length;++u<o;)i.has(t=n[u])||i.set(t,e.push(t))
;return a[r.t].apply(a,r.a)},a.range=function(n){
return arguments.length?(u=n,o=0,r={t:"range",a:arguments},a):u
},a.rangePoints=function(n,t){arguments.length<2&&(t=0)
;var i=n[0],c=n[1],f=e.length<2?(i=(i+c)/2,0):(c-i)/(e.length-1+t)
;return u=l(i+f*t/2,f),o=0,r={t:"rangePoints",a:arguments},a
},a.rangeRoundPoints=function(n,t){arguments.length<2&&(t=0)
;var i=n[0],c=n[1],f=e.length<2?(i=c=Math.round((i+c)/2),
0):(c-i)/(e.length-1+t)|0
;return u=l(i+Math.round(f*t/2+(c-i-(e.length-1+t)*f)/2),f),o=0,r={
t:"rangeRoundPoints",a:arguments},a},a.rangeBands=function(n,t,i){
arguments.length<2&&(t=0),arguments.length<3&&(i=t)
;var c=n[1]<n[0],f=n[c-0],s=n[1-c],h=(s-f)/(e.length-t+2*i);return u=l(f+h*i,h),
c&&u.reverse(),o=h*(1-t),r={t:"rangeBands",a:arguments},a
},a.rangeRoundBands=function(n,t,i){
arguments.length<2&&(t=0),arguments.length<3&&(i=t)
;var c=n[1]<n[0],f=n[c-0],s=n[1-c],h=Math.floor((s-f)/(e.length-t+2*i))
;return u=l(f+Math.round((s-f-(e.length-t)*h)/2),h),
c&&u.reverse(),o=Math.round(h*(1-t)),r={t:"rangeRoundBands",a:arguments},a
},a.rangeBand=function(){return o},a.rangeExtent=function(){return bo(r.a[0])
},a.copy=function(){return t(e,r)},a.domain(e)}([],{t:"range",a:[[]]})
},n.scale.category10=function(){return n.scale.ordinal().range(jo)
},n.scale.category20=function(){return n.scale.ordinal().range(Fo)
},n.scale.category20b=function(){return n.scale.ordinal().range(Ho)
},n.scale.category20c=function(){return n.scale.ordinal().range(Oo)}
;var jo=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(ft),Fo=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(ft),Ho=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(ft),Oo=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(ft)
;function Io(){return 0}n.scale.quantile=function(){return function t(e,r){var i
;function u(){var t=0,u=r.length;for(i=[];++t<u;)i[t-1]=n.quantile(e,t/u)
;return o}function o(t){if(!isNaN(t=+t))return r[n.bisect(i,t)]}
return o.domain=function(n){
return arguments.length?(e=n.map(h).filter(p).sort(s),u()):e
},o.range=function(n){return arguments.length?(r=n,u()):r
},o.quantiles=function(){return i},o.invertExtent=function(n){
return(n=r.indexOf(n))<0?[NaN,NaN]:[n>0?i[n-1]:e[0],n<i.length?i[n]:e[e.length-1]]
},o.copy=function(){return t(e,r)},u()}([],[])},n.scale.quantize=function(){
return function n(t,e,r){var i,u;function o(n){
return r[Math.max(0,Math.min(u,Math.floor(i*(n-t))))]}function a(){
return i=r.length/(e-t),u=r.length-1,o}return o.domain=function(n){
return arguments.length?(t=+n[0],e=+n[n.length-1],a()):[t,e]
},o.range=function(n){return arguments.length?(r=n,a()):r
},o.invertExtent=function(n){return[n=(n=r.indexOf(n))<0?NaN:n/i+t,n+1/i]
},o.copy=function(){return n(t,e,r)},a()}(0,1,[0,1])
},n.scale.threshold=function(){return function t(e,r){function i(t){
if(t<=t)return r[n.bisect(e,t)]}return i.domain=function(n){
return arguments.length?(e=n,i):e},i.range=function(n){
return arguments.length?(r=n,i):r},i.invertExtent=function(n){
return n=r.indexOf(n),[e[n-1],e[n]]},i.copy=function(){return t(e,r)},i
}([.5],[0,1])},n.scale.identity=function(){return function n(t){function e(n){
return+n}return e.invert=e,e.domain=e.range=function(n){
return arguments.length?(t=n.map(e),e):t},e.ticks=function(n){return Lo(t,n)
},e.tickFormat=function(n,e){return qo(t,n,e)},e.copy=function(){return n(t)},e
}([0,1])},n.svg={},n.svg.arc=function(){var n=Zo,t=Vo,e=Io,r=Yo,i=Xo,u=$o,o=Bo
;function a(){
var a=Math.max(0,+n.apply(this,arguments)),c=Math.max(0,+t.apply(this,arguments)),f=i.apply(this,arguments)-Ln,s=u.apply(this,arguments)-Ln,h=Math.abs(s-f),p=f>s?0:1
;if(c<a&&(g=c,c=a,a=g),h>=zn)return l(c,p)+(a?l(a,1-p):"")+"Z"
;var g,v,d,y,m,M,x,b,_,w,S,k,N=0,E=0,A=[]
;if((y=(+o.apply(this,arguments)||0)/2)&&(d=r===Yo?Math.sqrt(a*a+c*c):+r.apply(this,arguments),
p||(E*=-1),c&&(E=Un(d/c*Math.sin(y))),a&&(N=Un(d/a*Math.sin(y)))),c){
m=c*Math.cos(f+E),M=c*Math.sin(f+E),x=c*Math.cos(s-E),b=c*Math.sin(s-E)
;var C=Math.abs(s-f-2*E)<=An?0:1;if(E&&Wo(m,M,x,b)===p^C){var z=(f+s)/2
;m=c*Math.cos(z),M=c*Math.sin(z),x=b=null}}else m=M=0;if(a){
_=a*Math.cos(s-N),w=a*Math.sin(s-N),S=a*Math.cos(f+N),k=a*Math.sin(f+N)
;var L=Math.abs(f-s+2*N)<=An?0:1;if(N&&Wo(_,w,S,k)===1-p^L){var q=(f+s)/2
;_=a*Math.cos(q),w=a*Math.sin(q),S=k=null}}else _=w=0
;if(h>Nn&&(g=Math.min(Math.abs(c-a)/2,+e.apply(this,arguments)))>.001){
v=a<c^p?0:1;var T=g,R=g;if(h<An){
var D=null==S?[_,w]:null==x?[m,M]:pi([m,M],[S,k],[x,b],[_,w]),P=m-D[0],U=M-D[1],j=x-D[0],F=b-D[1],H=1/Math.sin(Math.acos((P*j+U*F)/(Math.sqrt(P*P+U*U)*Math.sqrt(j*j+F*F)))/2),O=Math.sqrt(D[0]*D[0]+D[1]*D[1])
;R=Math.min(g,(a-O)/(H-1)),T=Math.min(g,(c-O)/(H+1))}if(null!=x){
var I=Jo(null==S?[_,w]:[S,k],[m,M],c,T,p),Y=Jo([x,b],[_,w],c,T,p)
;g===T?A.push("M",I[0],"A",T,",",T," 0 0,",v," ",I[1],"A",c,",",c," 0 ",1-p^Wo(I[1][0],I[1][1],Y[1][0],Y[1][1]),",",p," ",Y[1],"A",T,",",T," 0 0,",v," ",Y[0]):A.push("M",I[0],"A",T,",",T," 0 1,",v," ",Y[0])
}else A.push("M",m,",",M);if(null!=S){
var Z=Jo([m,M],[S,k],a,-R,p),V=Jo([_,w],null==x?[m,M]:[x,b],a,-R,p)
;g===R?A.push("L",V[0],"A",R,",",R," 0 0,",v," ",V[1],"A",a,",",a," 0 ",p^Wo(V[1][0],V[1][1],Z[1][0],Z[1][1]),",",1-p," ",Z[1],"A",R,",",R," 0 0,",v," ",Z[0]):A.push("L",V[0],"A",R,",",R," 0 0,",v," ",Z[0])
}else A.push("L",_,",",w)
}else A.push("M",m,",",M),null!=x&&A.push("A",c,",",c," 0 ",C,",",p," ",x,",",b),
A.push("L",_,",",w),null!=S&&A.push("A",a,",",a," 0 ",L,",",1-p," ",S,",",k)
;return A.push("Z"),A.join("")}function l(n,t){
return"M0,"+n+"A"+n+","+n+" 0 1,"+t+" 0,"+-n+"A"+n+","+n+" 0 1,"+t+" 0,"+n}
return a.innerRadius=function(t){return arguments.length?(n=Mt(t),a):n
},a.outerRadius=function(n){return arguments.length?(t=Mt(n),a):t
},a.cornerRadius=function(n){return arguments.length?(e=Mt(n),a):e
},a.padRadius=function(n){return arguments.length?(r=n==Yo?Yo:Mt(n),a):r
},a.startAngle=function(n){return arguments.length?(i=Mt(n),a):i
},a.endAngle=function(n){return arguments.length?(u=Mt(n),a):u
},a.padAngle=function(n){return arguments.length?(o=Mt(n),a):o
},a.centroid=function(){
var e=(+n.apply(this,arguments)+ +t.apply(this,arguments))/2,r=(+i.apply(this,arguments)+ +u.apply(this,arguments))/2-Ln
;return[Math.cos(r)*e,Math.sin(r)*e]},a};var Yo="auto";function Zo(n){
return n.innerRadius}function Vo(n){return n.outerRadius}function Xo(n){
return n.startAngle}function $o(n){return n.endAngle}function Bo(n){
return n&&n.padAngle}function Wo(n,t,e,r){return(n-e)*t-(t-r)*n>0?0:1}
function Jo(n,t,e,r,i){
var u=n[0]-t[0],o=n[1]-t[1],a=(i?r:-r)/Math.sqrt(u*u+o*o),l=a*o,c=-a*u,f=n[0]+l,s=n[1]+c,h=t[0]+l,p=t[1]+c,g=(f+h)/2,v=(s+p)/2,d=h-f,y=p-s,m=d*d+y*y,M=e-r,x=f*p-h*s,b=(y<0?-1:1)*Math.sqrt(Math.max(0,M*M*m-x*x)),_=(x*y-d*b)/m,w=(-x*d-y*b)/m,S=(x*y+d*b)/m,k=(-x*d+y*b)/m,N=_-g,E=w-v,A=S-g,C=k-v
;return N*N+E*E>A*A+C*C&&(_=S,w=k),[[_-l,w-c],[_*e/M,w*e/M]]}function Go(n){
var t=ai,e=li,r=Ge,i=Qo,u=i.key,o=.7;function a(u){
var a,l=[],c=[],f=-1,s=u.length,h=Mt(t),p=Mt(e);function g(){
l.push("M",i(n(c),o))}
for(;++f<s;)r.call(this,a=u[f],f)?c.push([+h.call(this,a,f),+p.call(this,a,f)]):c.length&&(g(),
c=[]);return c.length&&g(),l.length?l.join(""):null}return a.x=function(n){
return arguments.length?(t=n,a):t},a.y=function(n){return arguments.length?(e=n,
a):e},a.defined=function(n){return arguments.length?(r=n,a):r
},a.interpolate=function(n){
return arguments.length?(u="function"==typeof n?i=n:(i=Ko.get(n)||Qo).key,a):u},
a.tension=function(n){return arguments.length?(o=n,a):o},a}
n.svg.line=function(){return Go(L)};var Ko=n.map({linear:Qo,"linear-closed":na,
step:function(n){var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]]
;for(;++t<e;)i.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);e>1&&i.push("H",r[0])
;return i.join("")},"step-before":ta,"step-after":ea,basis:ua,
"basis-open":function(n){if(n.length<4)return Qo(n)
;var t,e=[],r=-1,i=n.length,u=[0],o=[0]
;for(;++r<3;)t=n[r],u.push(t[0]),o.push(t[1]);e.push(oa(ca,u)+","+oa(ca,o)),--r
;for(;++r<i;)t=n[r],u.shift(),u.push(t[0]),o.shift(),o.push(t[1]),fa(e,u,o)
;return e.join("")},"basis-closed":function(n){
var t,e,r=-1,i=n.length,u=i+4,o=[],a=[]
;for(;++r<4;)e=n[r%i],o.push(e[0]),a.push(e[1]);t=[oa(ca,o),",",oa(ca,a)],--r
;for(;++r<u;)e=n[r%i],o.shift(),o.push(e[0]),a.shift(),a.push(e[1]),fa(t,o,a)
;return t.join("")},bundle:function(n,t){var e=n.length-1
;if(e)for(var r,i,u=n[0][0],o=n[0][1],a=n[e][0]-u,l=n[e][1]-o,c=-1;++c<=e;)r=n[c],
i=c/e,r[0]=t*r[0]+(1-t)*(u+i*a),r[1]=t*r[1]+(1-t)*(o+i*l);return ua(n)},
cardinal:function(n,t){return n.length<3?Qo(n):n[0]+ra(n,ia(n,t))},
"cardinal-open":function(n,t){
return n.length<4?Qo(n):n[1]+ra(n.slice(1,-1),ia(n,t))},
"cardinal-closed":function(n,t){
return n.length<3?na(n):n[0]+ra((n.push(n[0]),n),ia([n[n.length-2]].concat(n,[n[1]]),t))
},monotone:function(n){return n.length<3?Qo(n):n[0]+ra(n,function(n){
var t,e,r,i,u=[],o=function(n){
var t=0,e=n.length-1,r=[],i=n[0],u=n[1],o=r[0]=sa(i,u)
;for(;++t<e;)r[t]=(o+(o=sa(i=u,u=n[t+1])))/2;return r[t]=o,r
}(n),a=-1,l=n.length-1
;for(;++a<l;)t=sa(n[a],n[a+1]),y(t)<Nn?o[a]=o[a+1]=0:(e=o[a]/t,
r=o[a+1]/t,(i=e*e+r*r)>9&&(i=3*t/Math.sqrt(i),o[a]=i*e,o[a+1]=i*r));a=-1
;for(;++a<=l;)i=(n[Math.min(l,a+1)][0]-n[Math.max(0,a-1)][0])/(6*(1+o[a]*o[a])),
u.push([i||0,o[a]*i||0]);return u}(n))}});function Qo(n){
return n.length>1?n.join("L"):n+"Z"}function na(n){return n.join("L")+"Z"}
function ta(n){
for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("V",(r=n[t])[1],"H",r[0])
;return i.join("")}function ea(n){
for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r=n[t])[0],"V",r[1])
;return i.join("")}function ra(n,t){
if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return Qo(n)
;var e=n.length!=t.length,r="",i=n[0],u=n[1],o=t[0],a=o,l=1
;if(e&&(r+="Q"+(u[0]-2*o[0]/3)+","+(u[1]-2*o[1]/3)+","+u[0]+","+u[1],
i=n[1],l=2),t.length>1){
a=t[1],u=n[l],l++,r+="C"+(i[0]+o[0])+","+(i[1]+o[1])+","+(u[0]-a[0])+","+(u[1]-a[1])+","+u[0]+","+u[1]
;for(var c=2;c<t.length;c++,
l++)u=n[l],a=t[c],r+="S"+(u[0]-a[0])+","+(u[1]-a[1])+","+u[0]+","+u[1]}if(e){
var f=n[l];r+="Q"+(u[0]+2*a[0]/3)+","+(u[1]+2*a[1]/3)+","+f[0]+","+f[1]}return r
}function ia(n,t){
for(var e,r=[],i=(1-t)/2,u=n[0],o=n[1],a=1,l=n.length;++a<l;)e=u,
u=o,o=n[a],r.push([i*(o[0]-e[0]),i*(o[1]-e[1])]);return r}function ua(n){
if(n.length<3)return Qo(n)
;var t=1,e=n.length,r=n[0],i=r[0],u=r[1],o=[i,i,i,(r=n[1])[0]],a=[u,u,u,r[1]],l=[i,",",u,"L",oa(ca,o),",",oa(ca,a)]
;for(n.push(n[e-1]);++t<=e;)r=n[t],
o.shift(),o.push(r[0]),a.shift(),a.push(r[1]),fa(l,o,a)
;return n.pop(),l.push("L",r),l.join("")}function oa(n,t){
return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}Ko.forEach((function(n,t){
t.key=n,t.closed=/-closed$/.test(n)}))
;var aa=[0,2/3,1/3,0],la=[0,1/3,2/3,0],ca=[0,1/6,2/3,1/6];function fa(n,t,e){
n.push("C",oa(aa,t),",",oa(aa,e),",",oa(la,t),",",oa(la,e),",",oa(ca,t),",",oa(ca,e))
}function sa(n,t){return(t[1]-n[1])/(t[0]-n[0])}function ha(n){
for(var t,e,r,i=-1,u=n.length;++i<u;)e=(t=n[i])[0],r=t[1]-Ln,t[0]=e*Math.cos(r),
t[1]=e*Math.sin(r);return n}function pa(n){
var t=ai,e=ai,r=0,i=li,u=Ge,o=Qo,a=o.key,l=o,c="L",f=.7;function s(a){
var s,h,p,g=[],v=[],d=[],y=-1,m=a.length,M=Mt(t),x=Mt(r),b=t===e?function(){
return h}:Mt(e),_=r===i?function(){return p}:Mt(i);function w(){
g.push("M",o(n(d),f),c,l(n(v.reverse()),f),"Z")}
for(;++y<m;)u.call(this,s=a[y],y)?(v.push([h=+M.call(this,s,y),p=+x.call(this,s,y)]),
d.push([+b.call(this,s,y),+_.call(this,s,y)])):v.length&&(w(),v=[],d=[])
;return v.length&&w(),g.length?g.join(""):null}return s.x=function(n){
return arguments.length?(t=e=n,s):e},s.x0=function(n){
return arguments.length?(t=n,s):t},s.x1=function(n){
return arguments.length?(e=n,s):e},s.y=function(n){
return arguments.length?(r=i=n,s):i},s.y0=function(n){
return arguments.length?(r=n,s):r},s.y1=function(n){
return arguments.length?(i=n,s):i},s.defined=function(n){
return arguments.length?(u=n,s):u},s.interpolate=function(n){
return arguments.length?(a="function"==typeof n?o=n:(o=Ko.get(n)||Qo).key,
l=o.reverse||o,c=o.closed?"M":"L",s):a},s.tension=function(n){
return arguments.length?(f=n,s):f},s}function ga(n){return n.radius}
function va(n){return[n.x,n.y]}function da(n){return function(){
var t=n.apply(this,arguments),e=t[0],r=t[1]-Ln
;return[e*Math.cos(r),e*Math.sin(r)]}}function ya(){return 64}function ma(){
return"circle"}function Ma(n){var t=Math.sqrt(n/An)
;return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}
n.svg.line.radial=function(){var n=Go(ha)
;return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n
},ta.reverse=ea,ea.reverse=ta,n.svg.area=function(){return pa(L)
},n.svg.area.radial=function(){var n=pa(ha)
;return n.radius=n.x,delete n.x,n.innerRadius=n.x0,
delete n.x0,n.outerRadius=n.x1,
delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,
delete n.y0,n.endAngle=n.y1,delete n.y1,n},n.svg.chord=function(){
var n=$r,t=Br,e=ga,r=Xo,i=$o;function u(e,r){var i=o(this,n,e,r),u=o(this,t,e,r)
;return"M"+i.p0+a(i.r,i.p1,i.a1-i.a0)+(function(n,t){
return n.a0==t.a0&&n.a1==t.a1
}(i,u)?l(i.r,i.p1,i.r,i.p0):l(i.r,i.p1,u.r,u.p0)+a(u.r,u.p1,u.a1-u.a0)+l(u.r,u.p1,i.r,i.p0))+"Z"
}function o(n,t,u,o){
var a=t.call(n,u,o),l=e.call(n,a,o),c=r.call(n,a,o)-Ln,f=i.call(n,a,o)-Ln
;return{r:l,a0:c,a1:f,p0:[l*Math.cos(c),l*Math.sin(c)],
p1:[l*Math.cos(f),l*Math.sin(f)]}}function a(n,t,e){
return"A"+n+","+n+" 0 "+ +(e>An)+",1 "+t}function l(n,t,e,r){return"Q 0,0 "+r}
return u.radius=function(n){return arguments.length?(e=Mt(n),u):e
},u.source=function(t){return arguments.length?(n=Mt(t),u):n
},u.target=function(n){return arguments.length?(t=Mt(n),u):t
},u.startAngle=function(n){return arguments.length?(r=Mt(n),u):r
},u.endAngle=function(n){return arguments.length?(i=Mt(n),u):i},u
},n.svg.diagonal=function(){var n=$r,t=Br,e=va;function r(r,i){
var u=n.call(this,r,i),o=t.call(this,r,i),a=(u.y+o.y)/2,l=[u,{x:u.x,y:a},{x:o.x,
y:a},o];return"M"+(l=l.map(e))[0]+"C"+l[1]+" "+l[2]+" "+l[3]}
return r.source=function(t){return arguments.length?(n=Mt(t),r):n
},r.target=function(n){return arguments.length?(t=Mt(n),r):t
},r.projection=function(n){return arguments.length?(e=n,r):e},r
},n.svg.diagonal.radial=function(){var t=n.svg.diagonal(),e=va,r=t.projection
;return t.projection=function(n){return arguments.length?r(da(e=n)):e},t
},n.svg.symbol=function(){var n=ma,t=ya;function e(e,r){
return(xa.get(n.call(this,e,r))||Ma)(t.call(this,e,r))}
return e.type=function(t){return arguments.length?(n=Mt(t),e):n
},e.size=function(n){return arguments.length?(t=Mt(n),e):t},e};var xa=n.map({
circle:Ma,cross:function(n){var t=Math.sqrt(n/5)/2
;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"
},diamond:function(n){var t=Math.sqrt(n/(2*_a)),e=t*_a
;return"M0,"+-t+"L"+e+",0 0,"+t+" "+-e+",0Z"},square:function(n){
var t=Math.sqrt(n)/2
;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},
"triangle-down":function(n){var t=Math.sqrt(n/ba),e=t*ba/2
;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){
var t=Math.sqrt(n/ba),e=t*ba/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}})
;n.svg.symbolTypes=xa.keys();var ba=Math.sqrt(3),_a=Math.tan(30*qn)
;$.transition=function(n){for(var t,e,r=Na||++Ca,i=qa(n),u=[],o=Ea||{
time:Date.now(),ease:vu,delay:0,duration:250},a=-1,l=this.length;++a<l;){
u.push(t=[])
;for(var c=this[a],f=-1,s=c.length;++f<s;)(e=c[f])&&Ta(e,f,i,r,o),t.push(e)}
return ka(u,i,r)},$.interrupt=function(n){return this.each(null==n?wa:Sa(qa(n)))
};var wa=Sa(qa());function Sa(n){return function(){var t,e,r
;(t=this[n])&&(r=t[e=t.active])&&(r.timer.c=null,
r.timer.t=NaN,--t.count?delete t[e]:delete this[n],
t.active+=.5,r.event&&r.event.interrupt.call(this,this.__data__,r.index))}}
function ka(n,t,e){return I(n,Aa),n.namespace=t,n.id=e,n}var Na,Ea,Aa=[],Ca=0
;function za(n,t,e,r){var i=n.id,u=n.namespace
;return hn(n,"function"==typeof e?function(n,o,a){
n[u][i].tween.set(t,r(e.call(n,n.__data__,o,a)))}:(e=r(e),function(n){
n[u][i].tween.set(t,e)}))}function La(n){return null==n&&(n=""),function(){
this.textContent=n}}function qa(n){
return null==n?"__transition__":"__transition_"+n+"__"}function Ta(n,t,e,r,i){
var u,o,a,l,c,f=n[e]||(n[e]={active:0,count:0}),s=f[r];function h(e){
var i=f.active,h=f[i]
;for(var g in h&&(h.timer.c=null,h.timer.t=NaN,--f.count,delete f[i],
h.event&&h.event.interrupt.call(n,n.__data__,h.index)),f)if(+g<r){var v=f[g]
;v.timer.c=null,v.timer.t=NaN,--f.count,delete f[g]}o.c=p,Et((function(){
return o.c&&p(e||1)&&(o.c=null,o.t=NaN),1
}),0,u),f.active=r,s.event&&s.event.start.call(n,n.__data__,t),
c=[],s.tween.forEach((function(e,r){(r=r.call(n,n.__data__,t))&&c.push(r)
})),l=s.ease,a=s.duration}function p(i){
for(var u=i/a,o=l(u),h=c.length;h>0;)c[--h].call(n,o)
;if(u>=1)return s.event&&s.event.end.call(n,n.__data__,t),
--f.count?delete f[r]:delete n[e],1}s||(u=i.time,o=Et((function(n){var t=s.delay
;if(o.t=t+u,t<=n)return h(n-t);o.c=h}),0,u),s=f[r]={tween:new x,time:u,timer:o,
delay:i.delay,duration:i.duration,ease:i.ease,index:t},i=null,++f.count)}
Aa.call=$.call,
Aa.empty=$.empty,Aa.node=$.node,Aa.size=$.size,n.transition=function(t,e){
return t&&t.transition?Na?t.transition(e):t:n.selection().transition(t)
},n.transition.prototype=Aa,Aa.select=function(n){
var t,e,r,i=this.id,u=this.namespace,o=[];n=B(n)
;for(var a=-1,l=this.length;++a<l;){o.push(t=[])
;for(var c=this[a],f=-1,s=c.length;++f<s;)(r=c[f])&&(e=n.call(r,r.__data__,f,a))?("__data__"in r&&(e.__data__=r.__data__),
Ta(e,f,u,i,r[u][i]),t.push(e)):t.push(null)}return ka(o,u,i)
},Aa.selectAll=function(n){var t,e,r,i,u,o=this.id,a=this.namespace,l=[];n=W(n)
;for(var c=-1,f=this.length;++c<f;)for(var s=this[c],h=-1,p=s.length;++h<p;)if(r=s[h]){
u=r[a][o],e=n.call(r,r.__data__,h,c),l.push(t=[])
;for(var g=-1,v=e.length;++g<v;)(i=e[g])&&Ta(i,g,a,o,u),t.push(i)}
return ka(l,a,o)},Aa.filter=function(n){var t,e,r=[]
;"function"!=typeof n&&(n=fn(n));for(var i=0,u=this.length;i<u;i++){r.push(t=[])
;for(var o,a=0,l=(o=this[i]).length;a<l;a++)(e=o[a])&&n.call(e,e.__data__,a,i)&&t.push(e)
}return ka(r,this.namespace,this.id)},Aa.tween=function(n,t){
var e=this.id,r=this.namespace
;return arguments.length<2?this.node()[r][e].tween.get(n):hn(this,null==t?function(t){
t[r][e].tween.remove(n)}:function(i){i[r][e].tween.set(n,t)})
},Aa.attr=function(t,e){if(arguments.length<2){for(e in t)this.attr(e,t[e])
;return this}var r="transform"==t?Nu:uu,i=n.ns.qualify(t);function u(){
this.removeAttribute(i)}function o(){this.removeAttributeNS(i.space,i.local)}
function a(n){return null==n?u:(n+="",function(){var t,e=this.getAttribute(i)
;return e!==n&&(t=r(e,n),function(n){this.setAttribute(i,t(n))})})}
function l(n){return null==n?o:(n+="",function(){
var t,e=this.getAttributeNS(i.space,i.local)
;return e!==n&&(t=r(e,n),function(n){this.setAttributeNS(i.space,i.local,t(n))})
})}return za(this,"attr."+t,e,i.local?l:a)},Aa.attrTween=function(t,e){
var r=n.ns.qualify(t);return this.tween("attr."+t,r.local?function(n,t){
var i=e.call(this,n,t,this.getAttributeNS(r.space,r.local))
;return i&&function(n){this.setAttributeNS(r.space,r.local,i(n))}
}:function(n,t){var i=e.call(this,n,t,this.getAttribute(r))
;return i&&function(n){this.setAttribute(r,i(n))}})},Aa.style=function(n,t,e){
var r=arguments.length;if(r<3){if("string"!=typeof n){
for(e in r<2&&(t=""),n)this.style(e,n[e],t);return this}e=""}function i(){
this.style.removeProperty(n)}function o(t){return null==t?i:(t+="",function(){
var r,i=u(this).getComputedStyle(this,null).getPropertyValue(n)
;return i!==t&&(r=uu(i,t),function(t){this.style.setProperty(n,r(t),e)})})}
return za(this,"style."+n,t,o)},Aa.styleTween=function(n,t,e){function r(r,i){
var o=t.call(this,r,i,u(this).getComputedStyle(this,null).getPropertyValue(n))
;return o&&function(t){this.style.setProperty(n,o(t),e)}}
return arguments.length<3&&(e=""),this.tween("style."+n,r)},Aa.text=function(n){
return za(this,"text",n,La)},Aa.remove=function(){var n=this.namespace
;return this.each("end.transition",(function(){var t
;this[n].count<2&&(t=this.parentNode)&&t.removeChild(this)}))
},Aa.ease=function(t){var e=this.id,r=this.namespace
;return arguments.length<1?this.node()[r][e].ease:("function"!=typeof t&&(t=n.ease.apply(n,arguments)),
hn(this,(function(n){n[r][e].ease=t})))},Aa.delay=function(n){
var t=this.id,e=this.namespace
;return arguments.length<1?this.node()[e][t].delay:hn(this,"function"==typeof n?function(r,i,u){
r[e][t].delay=+n.call(r,r.__data__,i,u)}:(n=+n,function(r){r[e][t].delay=n}))
},Aa.duration=function(n){var t=this.id,e=this.namespace
;return arguments.length<1?this.node()[e][t].duration:hn(this,"function"==typeof n?function(r,i,u){
r[e][t].duration=Math.max(1,n.call(r,r.__data__,i,u))
}:(n=Math.max(1,n),function(r){r[e][t].duration=n}))},Aa.each=function(t,e){
var r=this.id,i=this.namespace;if(arguments.length<2){var u=Ea,o=Na;try{
Na=r,hn(this,(function(n,e,u){Ea=n[i][r],t.call(n,n.__data__,e,u)}))}finally{
Ea=u,Na=o}}else hn(this,(function(u){var o=u[i][r]
;(o.event||(o.event=n.dispatch("start","end","interrupt"))).on(t,e)}))
;return this},Aa.transition=function(){
for(var n,t,e,r=this.id,i=++Ca,u=this.namespace,o=[],a=0,l=this.length;a<l;a++){
o.push(n=[]);for(var c,f=0,s=(c=this[a]).length;f<s;f++)(t=c[f])&&Ta(t,f,u,i,{
time:(e=t[u][r]).time,ease:e.ease,delay:e.delay+e.duration,duration:e.duration
}),n.push(t)}return ka(o,u,i)},n.svg.axis=function(){
var t,r=n.scale.linear(),i=Ra,u=6,o=6,a=3,l=[10],c=null;function f(e){
e.each((function(){
var e,f=n.select(this),s=this.__chart__||r,h=this.__chart__=r.copy(),p=null==c?h.ticks?h.ticks.apply(h,l):h.domain():c,g=null==t?h.tickFormat?h.tickFormat.apply(h,l):L:t,v=f.selectAll(".tick").data(p,h),d=v.enter().insert("g",".domain").attr("class","tick").style("opacity",Nn),y=n.transition(v.exit()).style("opacity",Nn).remove(),m=n.transition(v.order()).style("opacity",1),M=Math.max(u,0)+a,x=_o(h),b=f.selectAll(".domain").data([0]),_=(b.enter().append("path").attr("class","domain"),
n.transition(b));d.append("line"),d.append("text")
;var w,S,k,N,E=d.select("line"),A=m.select("line"),C=v.select("text").text(g),z=d.select("text"),q=m.select("text"),T="top"===i||"left"===i?-1:1
;if("bottom"===i||"top"===i?(e=Pa,
w="x",k="y",S="x2",N="y2",C.attr("dy",T<0?"0em":".71em").style("text-anchor","middle"),
_.attr("d","M"+x[0]+","+T*o+"V0H"+x[1]+"V"+T*o)):(e=Ua,
w="y",k="x",S="y2",N="x2",
C.attr("dy",".32em").style("text-anchor",T<0?"end":"start"),
_.attr("d","M"+T*o+","+x[0]+"H0V"+x[1]+"H"+T*o)),
E.attr(N,T*u),z.attr(k,T*M),A.attr(S,0).attr(N,T*u),
q.attr(w,0).attr(k,T*M),h.rangeBand){var R=h,D=R.rangeBand()/2;s=h=function(n){
return R(n)+D}}else s.rangeBand?s=h:y.call(e,h,s);d.call(e,s,h),m.call(e,h,h)}))
}return f.scale=function(n){return arguments.length?(r=n,f):r
},f.orient=function(n){return arguments.length?(i=n in Da?n+"":Ra,f):i
},f.ticks=function(){return arguments.length?(l=e(arguments),f):l
},f.tickValues=function(n){return arguments.length?(c=n,f):c
},f.tickFormat=function(n){return arguments.length?(t=n,f):t
},f.tickSize=function(n){var t=arguments.length
;return t?(u=+n,o=+arguments[t-1],f):u},f.innerTickSize=function(n){
return arguments.length?(u=+n,f):u},f.outerTickSize=function(n){
return arguments.length?(o=+n,f):o},f.tickPadding=function(n){
return arguments.length?(a=+n,f):a},f.tickSubdivide=function(){
return arguments.length&&f},f};var Ra="bottom",Da={top:1,right:1,bottom:1,left:1
};function Pa(n,t,e){n.attr("transform",(function(n){var r=t(n)
;return"translate("+(isFinite(r)?r:e(n))+",0)"}))}function Ua(n,t,e){
n.attr("transform",(function(n){var r=t(n)
;return"translate(0,"+(isFinite(r)?r:e(n))+")"}))}n.svg.brush=function(){
var t,e,r=H(h,"brushstart","brush","brushend"),i=null,o=null,a=[0,0],l=[0,0],c=!0,f=!0,s=Fa[0]
;function h(t){t.each((function(){
var t=n.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",d).on("touchstart.brush",d),e=t.selectAll(".background").data([0])
;e.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),
t.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move")
;var r=t.selectAll(".resize").data(s,L)
;r.exit().remove(),r.enter().append("g").attr("class",(function(n){
return"resize "+n})).style("cursor",(function(n){return ja[n]
})).append("rect").attr("x",(function(n){return/[ew]$/.test(n)?-3:null
})).attr("y",(function(n){return/^[ns]/.test(n)?-3:null
})).attr("width",6).attr("height",6).style("visibility","hidden"),
r.style("display",h.empty()?"none":null)
;var u,a=n.transition(t),l=n.transition(e)
;i&&(u=_o(i),l.attr("x",u[0]).attr("width",u[1]-u[0]),
g(a)),o&&(u=_o(o),l.attr("y",u[0]).attr("height",u[1]-u[0]),v(a)),p(a)}))}
function p(n){n.selectAll(".resize").attr("transform",(function(n){
return"translate("+a[+/e$/.test(n)]+","+l[+/^s/.test(n)]+")"}))}function g(n){
n.select(".extent").attr("x",a[0]),
n.selectAll(".extent,.n>rect,.s>rect").attr("width",a[1]-a[0])}function v(n){
n.select(".extent").attr("y",l[0]),
n.selectAll(".extent,.e>rect,.w>rect").attr("height",l[1]-l[0])}function d(){
var s,d,y=this,m=n.select(n.event.target),M=r.of(y,arguments),x=n.select(y),b=m.datum(),_=!/^(n|s)$/.test(b)&&i,w=!/^(e|w)$/.test(b)&&o,S=m.classed("extent"),k=_n(y),N=n.mouse(y),E=n.select(u(y)).on("keydown.brush",(function(){
32==n.event.keyCode&&(S||(s=null,N[0]-=a[1],N[1]-=l[1],S=2),j())
})).on("keyup.brush",(function(){
32==n.event.keyCode&&2==S&&(N[0]+=a[1],N[1]+=l[1],S=0,j())}))
;if(n.event.changedTouches?E.on("touchmove.brush",z).on("touchend.brush",q):E.on("mousemove.brush",z).on("mouseup.brush",q),
x.interrupt().selectAll("*").interrupt(),
S)N[0]=a[0]-N[0],N[1]=l[0]-N[1];else if(b){var A=+/w$/.test(b),C=+/^n/.test(b)
;d=[a[1-A]-N[0],l[1-C]-N[1]],N[0]=a[A],N[1]=l[C]
}else n.event.altKey&&(s=N.slice());function z(){var t=n.mouse(y),e=!1
;d&&(t[0]+=d[0],
t[1]+=d[1]),S||(n.event.altKey?(s||(s=[(a[0]+a[1])/2,(l[0]+l[1])/2]),
N[0]=a[+(t[0]<s[0])],
N[1]=l[+(t[1]<s[1])]):s=null),_&&L(t,i,0)&&(g(x),e=!0),w&&L(t,o,1)&&(v(x),e=!0),
e&&(p(x),M({type:"brush",mode:S?"move":"resize"}))}function L(n,r,i){
var u,o,h=_o(r),p=h[0],g=h[1],v=N[i],d=i?l:a,y=d[1]-d[0]
;if(S&&(p-=v,g-=y+v),u=(i?f:c)?Math.max(p,Math.min(g,n[i])):n[i],
S?o=(u+=v)+y:(s&&(v=Math.max(p,Math.min(g,2*s[i]-u))),
v<u?(o=u,u=v):o=v),d[0]!=u||d[1]!=o)return i?e=null:t=null,d[0]=u,d[1]=o,!0}
function q(){
z(),x.style("pointer-events","all").selectAll(".resize").style("display",h.empty()?"none":null),
n.select("body").style("cursor",null),
E.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),
k(),M({type:"brushend"})}
x.style("pointer-events","none").selectAll(".resize").style("display",null),
n.select("body").style("cursor",m.style("cursor")),M({type:"brushstart"}),z()}
return h.event=function(i){i.each((function(){var i=r.of(this,arguments),u={x:a,
y:l,i:t,j:e},o=this.__chart__||u
;this.__chart__=u,Na?n.select(this).transition().each("start.brush",(function(){
t=o.i,e=o.j,a=o.x,l=o.y,i({type:"brushstart"})
})).tween("brush:brush",(function(){var n=ou(a,u.x),r=ou(l,u.y);return t=e=null,
function(t){a=u.x=n(t),l=u.y=r(t),i({type:"brush",mode:"resize"})}
})).each("end.brush",(function(){t=u.i,e=u.j,i({type:"brush",mode:"resize"}),i({
type:"brushend"})})):(i({type:"brushstart"}),i({type:"brush",mode:"resize"}),i({
type:"brushend"}))}))},h.x=function(n){
return arguments.length?(s=Fa[!(i=n)<<1|!o],h):i},h.y=function(n){
return arguments.length?(s=Fa[!i<<1|!(o=n)],h):o},h.clamp=function(n){
return arguments.length?(i&&o?(c=!!n[0],
f=!!n[1]):i?c=!!n:o&&(f=!!n),h):i&&o?[c,f]:i?c:o?f:null},h.extent=function(n){
var r,u,c,f,s
;return arguments.length?(i&&(r=n[0],u=n[1],o&&(r=r[0],u=u[0]),t=[r,u],
i.invert&&(r=i(r),
u=i(u)),u<r&&(s=r,r=u,u=s),r==a[0]&&u==a[1]||(a=[r,u])),o&&(c=n[0],
f=n[1],i&&(c=c[1],
f=f[1]),e=[c,f],o.invert&&(c=o(c),f=o(f)),f<c&&(s=c,c=f,f=s),c==l[0]&&f==l[1]||(l=[c,f])),
h):(i&&(t?(r=t[0],
u=t[1]):(r=a[0],u=a[1],i.invert&&(r=i.invert(r),u=i.invert(u)),
u<r&&(s=r,r=u,u=s))),
o&&(e?(c=e[0],f=e[1]):(c=l[0],f=l[1],o.invert&&(c=o.invert(c),
f=o.invert(f)),f<c&&(s=c,c=f,f=s))),i&&o?[[r,c],[u,f]]:i?[r,u]:o&&[c,f])
},h.clear=function(){return h.empty()||(a=[0,0],l=[0,0],t=e=null),h
},h.empty=function(){return!!i&&a[0]==a[1]||!!o&&l[0]==l[1]},n.rebind(h,r,"on")}
;var ja={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",
nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"
},Fa=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]],Ha=Ut.format=he.timeFormat,Oa=Ha.utc,Ia=Oa("%Y-%m-%dT%H:%M:%S.%LZ")
;function Ya(n){return n.toISOString()}function Za(t,e,r){function i(n){
return t(n)}function u(t,r){var i=(t[1]-t[0])/r,u=n.bisect(Xa,i)
;return u==Xa.length?[e.year,zo(t.map((function(n){return n/31536e6
})),r)[2]]:u?e[i/Xa[u-1]<Xa[u]/i?u-1:u]:[Wa,zo(t,r)[2]]}
return i.invert=function(n){return Va(t.invert(n))},i.domain=function(n){
return arguments.length?(t.domain(n),i):t.domain().map(Va)
},i.nice=function(n,t){
var e=i.domain(),r=bo(e),o=null==n?u(r,10):"number"==typeof n&&u(r,n)
;function a(e){return!isNaN(e)&&!n.range(e,Va(+e+1),t).length}return o&&(n=o[0],
t=o[1]),i.domain(So(e,t>1?{floor:function(t){for(;a(t=n.floor(t));)t=Va(t-1)
;return t},ceil:function(t){for(;a(t=n.ceil(t));)t=Va(+t+1);return t}}:n))
},i.ticks=function(n,t){
var e=bo(i.domain()),r=null==n?u(e,10):"number"==typeof n?u(e,n):!n.range&&[{
range:n},t];return r&&(n=r[0],t=r[1]),n.range(e[0],Va(+e[1]+1),t<1?1:t)
},i.tickFormat=function(){return r},i.copy=function(){return Za(t.copy(),e,r)
},Ao(i,t)}function Va(n){return new Date(n)}
Ha.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?Ya:Ia,
Ya.parse=function(n){var t=new Date(n);return isNaN(t)?null:t
},Ya.toString=Ia.toString,Ut.second=Ot((function(n){
return new jt(1e3*Math.floor(n/1e3))}),(function(n,t){
n.setTime(n.getTime()+1e3*Math.floor(t))}),(function(n){return n.getSeconds()
})),
Ut.seconds=Ut.second.range,Ut.seconds.utc=Ut.second.utc.range,Ut.minute=Ot((function(n){
return new jt(6e4*Math.floor(n/6e4))}),(function(n,t){
n.setTime(n.getTime()+6e4*Math.floor(t))}),(function(n){return n.getMinutes()
})),
Ut.minutes=Ut.minute.range,Ut.minutes.utc=Ut.minute.utc.range,Ut.hour=Ot((function(n){
var t=n.getTimezoneOffset()/60;return new jt(36e5*(Math.floor(n/36e5-t)+t))
}),(function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))}),(function(n){
return n.getHours()
})),Ut.hours=Ut.hour.range,Ut.hours.utc=Ut.hour.utc.range,Ut.month=Ot((function(n){
return(n=Ut.day(n)).setDate(1),n}),(function(n,t){n.setMonth(n.getMonth()+t)
}),(function(n){return n.getMonth()
})),Ut.months=Ut.month.range,Ut.months.utc=Ut.month.utc.range
;var Xa=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],$a=[[Ut.second,1],[Ut.second,5],[Ut.second,15],[Ut.second,30],[Ut.minute,1],[Ut.minute,5],[Ut.minute,15],[Ut.minute,30],[Ut.hour,1],[Ut.hour,3],[Ut.hour,6],[Ut.hour,12],[Ut.day,1],[Ut.day,2],[Ut.week,1],[Ut.month,1],[Ut.month,3],[Ut.year,1]],Ba=Ha.multi([[".%L",function(n){
return n.getMilliseconds()}],[":%S",function(n){return n.getSeconds()
}],["%I:%M",function(n){return n.getMinutes()}],["%I %p",function(n){
return n.getHours()}],["%a %d",function(n){return n.getDay()&&1!=n.getDate()
}],["%b %d",function(n){return 1!=n.getDate()}],["%B",function(n){
return n.getMonth()}],["%Y",Ge]]),Wa={range:function(t,e,r){
return n.range(Math.ceil(t/r)*r,+e,r).map(Va)},floor:L,ceil:L}
;$a.year=Ut.year,Ut.scale=function(){return Za(n.scale.linear(),$a,Ba)}
;var Ja=$a.map((function(n){return[n[0].utc,n[1]]
})),Ga=Oa.multi([[".%L",function(n){return n.getUTCMilliseconds()
}],[":%S",function(n){return n.getUTCSeconds()}],["%I:%M",function(n){
return n.getUTCMinutes()}],["%I %p",function(n){return n.getUTCHours()
}],["%a %d",function(n){return n.getUTCDay()&&1!=n.getUTCDate()
}],["%b %d",function(n){return 1!=n.getUTCDate()}],["%B",function(n){
return n.getUTCMonth()}],["%Y",Ge]]);function Ka(n){
return JSON.parse(n.responseText)}function Qa(n){var t=r.createRange()
;return t.selectNode(r.body),t.createContextualFragment(n.responseText)}
Ja.year=Ut.year.utc,Ut.scale.utc=function(){return Za(n.scale.linear(),Ja,Ga)
},n.text=xt((function(n){return n.responseText})),n.json=function(n,t){
return bt(n,"application/json",Ka,t)},n.html=function(n,t){
return bt(n,"text/html",Qa,t)},n.xml=xt((function(n){return n.responseXML
})),"function"==typeof define&&define.amd?(this.d3=n,
define(n)):"object"==typeof module&&module.exports?module.exports=n:this.d3=n
}();