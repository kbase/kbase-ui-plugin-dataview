!function(e,n){
"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(e.preact={})
}(this,(function(e){
var n,t,l,o,_,r,u,i={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i
;function p(e,n){for(var t in n)e[t]=n[t];return e}function f(e){
var n=e.parentNode;n&&n.removeChild(e)}function a(e,n,t){var l,o=arguments,_={}
;for(l in n)"key"!==l&&"ref"!==l&&(_[l]=n[l])
;if(arguments.length>3)for(t=[t],l=3;l<arguments.length;l++)t.push(o[l])
;if(null!=t&&(_.children=t),
"function"==typeof e&&null!=e.defaultProps)for(l in e.defaultProps)void 0===_[l]&&(_[l]=e.defaultProps[l])
;return d(e,_,n&&n.key,n&&n.ref)}function d(e,t,l,o){var _={type:e,props:t,
key:l,ref:o,__k:null,__:null,__b:0,__e:null,__d:null,__c:null,constructor:void 0
};return n.vnode&&n.vnode(_),_}function h(e){return e.children}function y(e,n){
this.props=e,this.context=n}function v(e,n){
if(null==n)return e.__?v(e.__,e.__.__k.indexOf(e)+1):null
;for(var t;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e)return t.__e
;return"function"==typeof e.type?v(e):null}function m(e){var n,t
;if(null!=(e=e.__)&&null!=e.__c){
for(e.__e=e.__c.base=null,n=0;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e){
e.__e=e.__c.base=t.__e;break}return m(e)}}function g(e){
(!e.__d&&(e.__d=!0)&&1===l.push(e)||_!==n.debounceRendering)&&((_=n.debounceRendering)||o)(k)
}function k(){var e,n,t,o,_,r,u;for(l.sort((function(e,n){
return n.__v.__b-e.__v.__b
}));e=l.pop();)e.__d&&(t=void 0,o=void 0,r=(_=(n=e).__v).__e,
(u=n.__P)&&(t=[],o=P(u,_,p({},_),n.__n,void 0!==u.ownerSVGElement,null,t,null==r?v(_):r),
E(t,_),o!=r&&m(_)))}function b(e,n,t,l,o,_,r,u,s){
var p,a,d,h,y,m,g,k=t&&t.__k||c,b=k.length
;if(u==i&&(u=null!=_?_[0]:b?v(t,0):null),p=0,n.__k=x(n.__k,(function(t){
if(null!=t){
if(t.__=n,t.__b=n.__b+1,null===(d=k[p])||d&&t.key==d.key&&t.type===d.type)k[p]=void 0;else for(a=0;a<b;a++){
if((d=k[a])&&t.key==d.key&&t.type===d.type){k[a]=void 0;break}d=null}
if(h=P(e,t,d=d||i,l,o,_,r,u,s),
(a=t.ref)&&d.ref!=a&&(g||(g=[]),d.ref&&g.push(d.ref,null,t),
g.push(a,t.__c||h,t)),null!=h){
if(null==m&&(m=h),null!=t.__d)h=t.__d,t.__d=null;else if(_==d||h!=u||null==h.parentNode){
e:if(null==u||u.parentNode!==e)e.appendChild(h);else{
for(y=u,a=0;(y=y.nextSibling)&&a<b;a+=2)if(y==h)break e;e.insertBefore(h,u)}
"option"==n.type&&(e.value="")}
u=h.nextSibling,"function"==typeof n.type&&(n.__d=h)}}return p++,t
})),n.__e=m,null!=_&&"function"!=typeof n.type)for(p=_.length;p--;)null!=_[p]&&f(_[p])
;for(p=b;p--;)null!=k[p]&&D(k[p],k[p])
;if(g)for(p=0;p<g.length;p++)N(g[p],g[++p],g[++p])}function x(e,n,t){
if(null==t&&(t=[]),
null==e||"boolean"==typeof e)n&&t.push(n(null));else if(Array.isArray(e))for(var l=0;l<e.length;l++)x(e[l],n,t);else t.push(n?n("string"==typeof e||"number"==typeof e?d(null,e,null,null):null!=e.__e||null!=e.__c?d(e.type,e.props,e.key,null):e):e)
;return t}function C(e,n,t){
"-"===n[0]?e.setProperty(n,t):e[n]="number"==typeof t&&!1===s.test(n)?t+"px":null==t?"":t
}function w(e,n,t,l,o){var _,r,u,i,c
;if(o?"className"===n&&(n="class"):"class"===n&&(n="className"),
"key"===n||"children"===n);else if("style"===n)if(_=e.style,
"string"==typeof t)_.cssText=t;else{
if("string"==typeof l&&(_.cssText="",l=null),l)for(r in l)t&&r in t||C(_,r,"")
;if(t)for(u in t)l&&t[u]===l[u]||C(_,u,t[u])
}else"o"===n[0]&&"n"===n[1]?(i=n!==(n=n.replace(/Capture$/,"")),
c=n.toLowerCase(),
n=(c in e?c:n).slice(2),t?(l||e.addEventListener(n,S,i),(e.l||(e.l={}))[n]=t):e.removeEventListener(n,S,i)):"list"!==n&&"tagName"!==n&&"form"!==n&&"type"!==n&&!o&&n in e?e[n]=null==t?"":t:"function"!=typeof t&&"dangerouslySetInnerHTML"!==n&&(n!==(n=n.replace(/^xlink:?/,""))?null==t||!1===t?e.removeAttributeNS("http://www.w3.org/1999/xlink",n.toLowerCase()):e.setAttributeNS("http://www.w3.org/1999/xlink",n.toLowerCase(),t):null==t||!1===t?e.removeAttribute(n):e.setAttribute(n,t))
}function S(e){this.l[e.type](n.event?n.event(e):e)}
function P(e,t,l,o,_,r,u,i,c){var s,f,a,d,v,m,g,k,C,w,S=t.type
;if(void 0!==t.constructor)return null;(s=n.__b)&&s(t);try{
e:if("function"==typeof S){
if(k=t.props,C=(s=S.contextType)&&o[s.__c],w=s?C?C.props.value:s.__:o,
l.__c?g=(f=t.__c=l.__c).__=f.__E:("prototype"in S&&S.prototype.render?t.__c=f=new S(k,w):(t.__c=f=new y(k,w),
f.constructor=S,
f.render=T),C&&C.sub(f),f.props=k,f.state||(f.state={}),f.context=w,
f.__n=o,a=f.__d=!0,
f.__h=[]),null==f.__s&&(f.__s=f.state),null!=S.getDerivedStateFromProps&&(f.__s==f.state&&(f.__s=p({},f.__s)),
p(f.__s,S.getDerivedStateFromProps(k,f.__s))),
d=f.props,v=f.state,a)null==S.getDerivedStateFromProps&&null!=f.componentWillMount&&f.componentWillMount(),
null!=f.componentDidMount&&f.__h.push(f.componentDidMount);else{
if(null==S.getDerivedStateFromProps&&k!==d&&null!=f.componentWillReceiveProps&&f.componentWillReceiveProps(k,w),
!f.__e&&null!=f.shouldComponentUpdate&&!1===f.shouldComponentUpdate(k,f.__s,w)){
for(f.props=k,
f.state=f.__s,f.__d=!1,f.__v=t,t.__e=l.__e,t.__k=l.__k,f.__h.length&&u.push(f),
s=0;s<t.__k.length;s++)t.__k[s]&&(t.__k[s].__=t);break e}
null!=f.componentWillUpdate&&f.componentWillUpdate(k,f.__s,w),
null!=f.componentDidUpdate&&f.__h.push((function(){f.componentDidUpdate(d,v,m)
}))}
f.context=w,f.props=k,f.state=f.__s,(s=n.__r)&&s(t),f.__d=!1,f.__v=t,f.__P=e,
s=f.render(f.props,f.state,f.context),
t.__k=x(null!=s&&s.type==h&&null==s.key?s.props.children:s),
null!=f.getChildContext&&(o=p(p({},o),f.getChildContext())),
a||null==f.getSnapshotBeforeUpdate||(m=f.getSnapshotBeforeUpdate(d,v)),
b(e,t,l,o,_,r,u,i,c),
f.base=t.__e,f.__h.length&&u.push(f),g&&(f.__E=f.__=null),f.__e=null
}else t.__e=U(l.__e,t,l,o,_,r,u,c);(s=n.diffed)&&s(t)}catch(e){n.__e(e,t,l)}
return t.__e}function E(e,t){n.__c&&n.__c(t,e),e.some((function(t){try{
e=t.__h,t.__h=[],e.some((function(e){e.call(t)}))}catch(e){n.__e(e,t.__v)}}))}
function U(e,n,t,l,o,_,r,u){var s,p,f,a,d,h=t.props,y=n.props
;if(o="svg"===n.type||o,
null==e&&null!=_)for(s=0;s<_.length;s++)if(null!=(p=_[s])&&(null===n.type?3===p.nodeType:p.localName===n.type)){
e=p,_[s]=null;break}if(null==e){
if(null===n.type)return document.createTextNode(y)
;e=o?document.createElementNS("http://www.w3.org/2000/svg",n.type):document.createElement(n.type),
_=null}
if(null===n.type)null!=_&&(_[_.indexOf(e)]=null),h!==y&&(e.data=y);else if(n!==t){
if(null!=_&&(_=c.slice.call(e.childNodes)),
f=(h=t.props||i).dangerouslySetInnerHTML,a=y.dangerouslySetInnerHTML,!u){
if(h===i)for(h={},
d=0;d<e.attributes.length;d++)h[e.attributes[d].name]=e.attributes[d].value
;(a||f)&&(a&&f&&a.__html==f.__html||(e.innerHTML=a&&a.__html||""))}
(function(e,n,t,l,o){var _;for(_ in t)_ in n||w(e,_,null,t[_],l)
;for(_ in n)o&&"function"!=typeof n[_]||"value"===_||"checked"===_||t[_]===n[_]||w(e,_,n[_],t[_],l)
})(e,y,h,o,u),
n.__k=n.props.children,a||b(e,n,t,l,"foreignObject"!==n.type&&o,_,r,i,u),
u||("value"in y&&void 0!==y.value&&y.value!==e.value&&(e.value=null==y.value?"":y.value),
"checked"in y&&void 0!==y.checked&&y.checked!==e.checked&&(e.checked=y.checked))
}return e}function N(e,t,l){try{"function"==typeof e?e(t):e.current=t}catch(e){
n.__e(e,l)}}function D(e,t,l){var o,_,r
;if(n.unmount&&n.unmount(e),(o=e.ref)&&N(o,null,t),
l||"function"==typeof e.type||(l=null!=(_=e.__e)),
e.__e=e.__d=null,null!=(o=e.__c)){if(o.componentWillUnmount)try{
o.componentWillUnmount()}catch(e){n.__e(e,t)}o.base=o.__P=null}
if(o=e.__k)for(r=0;r<o.length;r++)o[r]&&D(o[r],t,l);null!=_&&f(_)}
function T(e,n,t){return this.constructor(e,t)}function W(e,t,l){var o,_,u
;n.__&&n.__(e,t),
_=(o=l===r)?null:l&&l.__k||t.__k,e=a(h,null,[e]),u=[],P(t,(o?t:l||t).__k=e,_||i,i,void 0!==t.ownerSVGElement,l&&!o?[l]:_?null:c.slice.call(t.childNodes),u,l||i,o),
E(u,e)}n={__e:function(e,n){for(var t;n=n.__;)if((t=n.__c)&&!t.__)try{
if(t.constructor&&null!=t.constructor.getDerivedStateFromError)t.setState(t.constructor.getDerivedStateFromError(e));else{
if(null==t.componentDidCatch)continue;t.componentDidCatch(e)}return g(t.__E=t)
}catch(n){e=n}throw e}},t=function(e){return null!=e&&void 0===e.constructor
},y.prototype.setState=function(e,n){var t
;t=this.__s!==this.state?this.__s:this.__s=p({},this.state),
"function"==typeof e&&(e=e(t,this.props)),
e&&p(t,e),null!=e&&this.__v&&(this.__e=!1,n&&this.__h.push(n),g(this))
},y.prototype.forceUpdate=function(e){
this.__v&&(this.__e=!0,e&&this.__h.push(e),g(this))
},y.prototype.render=h,l=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,
r=i,u=0,e.render=W,e.hydrate=function(e,n){W(e,n,r)
},e.createElement=a,e.h=a,e.Fragment=h,e.createRef=function(){return{}
},e.isValidElement=t,e.Component=y,e.cloneElement=function(e,n){
return n=p(p({},e.props),n),
arguments.length>2&&(n.children=c.slice.call(arguments,2)),
d(e.type,n,n.key||e.key,n.ref||e.ref)},e.createContext=function(e){var n={},t={
__c:"__cC"+u++,__:e,Consumer:function(e,n){return e.children(n)},
Provider:function(e){var l,o=this
;return this.getChildContext||(l=[],this.getChildContext=function(){
return n[t.__c]=o,n},this.shouldComponentUpdate=function(n){
e.value!==n.value&&l.some((function(e){e.context=n.value,g(e)}))
},this.sub=function(e){l.push(e);var n=e.componentWillUnmount
;e.componentWillUnmount=function(){l.splice(l.indexOf(e),1),n&&n.call(e)}
}),e.children}};return t.Consumer.contextType=t,t
},e.toChildArray=x,e._e=D,e.options=n}));