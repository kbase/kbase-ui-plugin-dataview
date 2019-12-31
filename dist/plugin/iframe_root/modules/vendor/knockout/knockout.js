/*!
 * Knockout JavaScript library v3.5.0
 * (c) The Knockout.js team - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
!function(e){
var t=this||(0,eval)("this"),n=t.document,a=t.navigator,r=t.jQuery,i=t.JSON
;r||"undefined"==typeof jQuery||(r=jQuery),function(e){
"function"==typeof define&&define.amd?define(["exports","require"],e):"object"==typeof exports&&"object"==typeof module?e(module.exports||exports):e(t.ko={})
}((function(o,u){function c(e,t){return(null===e||typeof e in b)&&e===t}
function s(t,n){var a;return function(){a||(a=h.a.setTimeout((function(){a=e,t()
}),n))}}function l(e,t){var n;return function(){
clearTimeout(n),n=h.a.setTimeout(e,t)}}function f(e,t){
t&&"change"!==t?"beforeChange"===t?this.oc(e):this.bb(e,t):this.pc(e)}
function d(e,t){null!==t&&t.s&&t.s()}function p(e,t){var n=this.pd,a=n[w]
;a.qa||(this.Pb&&this.kb[t]?(n.tc(t,e,this.kb[t]),
this.kb[t]=null,--this.Pb):a.F[t]||n.tc(t,e,a.G?{da:e}:n.Zc(e)),e.Ka&&e.fd())}
var h=void 0!==o?o:{};h.b=function(e,t){
for(var n=e.split("."),a=h,r=0;r<n.length-1;r++)a=a[n[r]];a[n[n.length-1]]=t
},h.J=function(e,t,n){e[t]=n
},h.version="3.5.0",h.b("version",h.version),h.options={deferUpdates:!1,
useOnlyNativeEvents:!1,foreachHidesDestroyed:!1},h.a=function(){function o(e,t){
for(var n in e)l.call(e,n)&&t(n,e[n])}function u(e,t){
if(t)for(var n in t)l.call(t,n)&&(e[n]=t[n]);return e}function c(e,t){
return e.__proto__=t,e}function s(e,t,n,a){var r=e[t].match(y)||[]
;h.a.C(n.match(y),(function(e){h.a.Oa(r,e,a)})),e[t]=r.join(" ")}
var l=Object.prototype.hasOwnProperty,f={__proto__:[]
}instanceof Array,d="function"==typeof Symbol,p={},b={}
;p[a&&/Firefox\/2/i.test(a.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"],
p.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" "),
o(p,(function(e,t){if(t.length)for(var n=0,a=t.length;n<a;n++)b[t[n]]=e}))
;var v,g={propertychange:!0},m=n&&function(){
for(var t=3,a=n.createElement("div"),r=a.getElementsByTagName("i");a.innerHTML="\x3c!--[if gt IE "+ ++t+"]><i></i><![endif]--\x3e",
r[0];);return 4<t?t:e}(),y=/\S+/g;return{
Ic:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],
C:function(e,t,n){for(var a=0,r=e.length;a<r;a++)t.call(n,e[a],a,e)},
A:"function"==typeof Array.prototype.indexOf?function(e,t){
return Array.prototype.indexOf.call(e,t)}:function(e,t){
for(var n=0,a=e.length;n<a;n++)if(e[n]===t)return n;return-1},
Lb:function(t,n,a){
for(var r=0,i=t.length;r<i;r++)if(n.call(a,t[r],r,t))return t[r];return e},
hb:function(e,t){var n=h.a.A(e,t);0<n?e.splice(n,1):0===n&&e.shift()},
vc:function(e){var t=[];return e&&h.a.C(e,(function(e){0>h.a.A(t,e)&&t.push(e)
})),t},Mb:function(e,t,n){var a=[]
;if(e)for(var r=0,i=e.length;r<i;r++)a.push(t.call(n,e[r],r));return a},
fb:function(e,t,n){var a=[]
;if(e)for(var r=0,i=e.length;r<i;r++)t.call(n,e[r],r)&&a.push(e[r]);return a},
gb:function(e,t){
if(t instanceof Array)e.push.apply(e,t);else for(var n=0,a=t.length;n<a;n++)e.push(t[n])
;return e},Oa:function(e,t,n){var a=h.a.A(h.a.$b(e),t)
;0>a?n&&e.push(t):n||e.splice(a,1)},Ba:f,extend:u,setPrototypeOf:c,zb:f?c:u,O:o,
Ha:function(e,t,n){if(!e)return e;var a,r={}
;for(a in e)l.call(e,a)&&(r[a]=t.call(n,e[a],a,e));return r},Sb:function(e){
for(;e.firstChild;)h.removeNode(e.firstChild)},Xb:function(e){
for(var t=((e=h.a.la(e))[0]&&e[0].ownerDocument||n).createElement("div"),a=0,r=e.length;a<r;a++)t.appendChild(h.na(e[a]))
;return t},Ca:function(e,t){for(var n=0,a=e.length,r=[];n<a;n++){
var i=e[n].cloneNode(!0);r.push(t?h.na(i):i)}return r},ua:function(e,t){
if(h.a.Sb(e),t)for(var n=0,a=t.length;n<a;n++)e.appendChild(t[n])},
Wc:function(e,t){var n=e.nodeType?[e]:e;if(0<n.length){
for(var a=n[0],r=a.parentNode,i=0,o=t.length;i<o;i++)r.insertBefore(t[i],a)
;for(i=0,o=n.length;i<o;i++)h.removeNode(n[i])}},Ua:function(e,t){if(e.length){
for(t=8===t.nodeType&&t.parentNode||t;e.length&&e[0].parentNode!==t;)e.splice(0,1)
;for(;1<e.length&&e[e.length-1].parentNode!==t;)e.length--;if(1<e.length){
var n=e[0],a=e[e.length-1];for(e.length=0;n!==a;)e.push(n),n=n.nextSibling
;e.push(a)}}return e},Yc:function(e,t){
7>m?e.setAttribute("selected",t):e.selected=t},Cb:function(t){
return null===t||t===e?"":t.trim?t.trim():t.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")
},Td:function(e,t){
return e=e||"",!(t.length>e.length)&&e.substring(0,t.length)===t},
ud:function(e,t){if(e===t)return!0;if(11===e.nodeType)return!1
;if(t.contains)return t.contains(1!==e.nodeType?e.parentNode:e)
;if(t.compareDocumentPosition)return 16==(16&t.compareDocumentPosition(e))
;for(;e&&e!=t;)e=e.parentNode;return!!e},Rb:function(e){
return h.a.ud(e,e.ownerDocument.documentElement)},jd:function(e){
return!!h.a.Lb(e,h.a.Rb)},P:function(e){
return e&&e.tagName&&e.tagName.toLowerCase()},zc:function(e){
return h.onError?function(){try{return e.apply(this,arguments)}catch(u){
throw h.onError&&h.onError(u),u}}:e},setTimeout:function(e,t){
return setTimeout(h.a.zc(e),t)},Fc:function(e){setTimeout((function(){
throw h.onError&&h.onError(e),e}),0)},H:function(e,t,n){var a=h.a.zc(n)
;if(n=g[t],
h.options.useOnlyNativeEvents||n||!r)if(n||"function"!=typeof e.addEventListener){
if(void 0===e.attachEvent)throw Error("Browser doesn't support addEventListener or attachEvent")
;var i=function(t){a.call(e,t)},o="on"+t
;e.attachEvent(o,i),h.a.I.za(e,(function(){e.detachEvent(o,i)}))
}else e.addEventListener(t,a,!1);else v||(v="function"==typeof r(e).on?"on":"bind"),
r(e)[v](t,a)},Fb:function(e,a){
if(!e||!e.nodeType)throw Error("element must be a DOM node when calling triggerEvent")
;var i
;if(i=!("input"!==h.a.P(e)||!e.type||"click"!=a.toLowerCase())&&("checkbox"==(i=e.type)||"radio"==i),
h.options.useOnlyNativeEvents||!r||i)if("function"==typeof n.createEvent){
if("function"!=typeof e.dispatchEvent)throw Error("The supplied element doesn't support dispatchEvent")
;(i=n.createEvent(b[a]||"HTMLEvents")).initEvent(a,!0,!0,t,0,0,0,0,0,!1,!1,!1,!1,0,e),
e.dispatchEvent(i)}else if(i&&e.click)e.click();else{
if(void 0===e.fireEvent)throw Error("Browser doesn't support triggering events")
;e.fireEvent("on"+a)}else r(e).trigger(a)},c:function(e){return h.N(e)?e():e},
$b:function(e){return h.N(e)?e.w():e},Eb:function(e,t,n){var a
;t&&("object"==typeof e.classList?(a=e.classList[n?"add":"remove"],
h.a.C(t.match(y),(function(t){a.call(e.classList,t)
}))):"string"==typeof e.className.baseVal?s(e.className,"baseVal",t,n):s(e,"className",t,n))
},Ab:function(t,n){var a=h.a.c(n);null!==a&&a!==e||(a="")
;var r=h.h.firstChild(t)
;!r||3!=r.nodeType||h.h.nextSibling(r)?h.h.ua(t,[t.ownerDocument.createTextNode(a)]):r.data=a,
h.a.zd(t)},Xc:function(e,t){if(e.name=t,7>=m)try{
var a=e.name.replace(/[&<>'"]/g,(function(e){return"&#"+e.charCodeAt(0)+";"}))
;e.mergeAttributes(n.createElement("<input name='"+a+"'/>"),!1)}catch(c){}},
zd:function(e){
9<=m&&(e=1==e.nodeType?e:e.parentNode).style&&(e.style.zoom=e.style.zoom)},
vd:function(e){if(m){var t=e.style.width;e.style.width=0,e.style.width=t}},
Od:function(e,t){e=h.a.c(e),t=h.a.c(t);for(var n=[],a=e;a<=t;a++)n.push(a)
;return n},la:function(e){for(var t=[],n=0,a=e.length;n<a;n++)t.push(e[n])
;return t},Da:function(e){return d?Symbol(e):e},Xd:6===m,Yd:7===m,W:m,
Kc:function(e,t){
for(var n=h.a.la(e.getElementsByTagName("input")).concat(h.a.la(e.getElementsByTagName("textarea"))),a="string"==typeof t?function(e){
return e.name===t}:function(e){return t.test(e.name)
},r=[],i=n.length-1;0<=i;i--)a(n[i])&&r.push(n[i]);return r},Md:function(e){
return"string"==typeof e&&(e=h.a.Cb(e))?i&&i.parse?i.parse(e):new Function("return "+e)():null
},fc:function(e,t,n){
if(!i||!i.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js")
;return i.stringify(h.a.c(e),t,n)},Nd:function(e,t,a){
var r=(a=a||{}).params||{},i=a.includeFields||this.Ic,u=e
;if("object"==typeof e&&"form"===h.a.P(e)){u=e.action
;for(var c=i.length-1;0<=c;c--)for(var s=h.a.Kc(e,i[c]),l=s.length-1;0<=l;l--)r[s[l].name]=s[l].value
}t=h.a.c(t);var f=n.createElement("form")
;for(var d in f.style.display="none",f.action=u,
f.method="post",t)(e=n.createElement("input")).type="hidden",
e.name=d,e.value=h.a.fc(h.a.c(t[d])),f.appendChild(e);o(r,(function(e,t){
var a=n.createElement("input")
;a.type="hidden",a.name=e,a.value=t,f.appendChild(a)
})),n.body.appendChild(f),a.submitter?a.submitter(f):f.submit(),
setTimeout((function(){f.parentNode.removeChild(f)}),0)}}
}(),h.b("utils",h.a),h.b("utils.arrayForEach",h.a.C),
h.b("utils.arrayFirst",h.a.Lb),
h.b("utils.arrayFilter",h.a.fb),h.b("utils.arrayGetDistinctValues",h.a.vc),
h.b("utils.arrayIndexOf",h.a.A),
h.b("utils.arrayMap",h.a.Mb),h.b("utils.arrayPushAll",h.a.gb),
h.b("utils.arrayRemoveItem",h.a.hb),
h.b("utils.cloneNodes",h.a.Ca),h.b("utils.createSymbolOrString",h.a.Da),
h.b("utils.extend",h.a.extend),
h.b("utils.fieldsIncludedWithJsonPost",h.a.Ic),h.b("utils.getFormFields",h.a.Kc),
h.b("utils.objectMap",h.a.Ha),
h.b("utils.peekObservable",h.a.$b),h.b("utils.postJson",h.a.Nd),
h.b("utils.parseJson",h.a.Md),
h.b("utils.registerEventHandler",h.a.H),h.b("utils.stringifyJson",h.a.fc),
h.b("utils.range",h.a.Od),
h.b("utils.toggleDomNodeCssClass",h.a.Eb),h.b("utils.triggerEvent",h.a.Fb),
h.b("utils.unwrapObservable",h.a.c),
h.b("utils.objectForEach",h.a.O),h.b("utils.addOrRemoveItem",h.a.Oa),
h.b("utils.setTextContent",h.a.Ab),
h.b("unwrap",h.a.c),Function.prototype.bind||(Function.prototype.bind=function(e){
var t=this;if(1===arguments.length)return function(){return t.apply(e,arguments)
};var n=Array.prototype.slice.call(arguments,1);return function(){
var a=n.slice(0);return a.push.apply(a,arguments),t.apply(e,a)}
}),h.a.g=new function(){var t,n,a=0,r="__ko__"+(new Date).getTime(),i={}
;return h.a.W?(t=function(t,n){var o=t[r];if(!o||"null"===o||!i[o]){
if(!n)return e;o=t[r]="ko"+a++,i[o]={}}return i[o]},n=function(e){var t=e[r]
;return!!t&&(delete i[t],e[r]=null,!0)}):(t=function(e,t){var n=e[r]
;return!n&&t&&(n=e[r]={}),n},n=function(e){return!!e[r]&&(delete e[r],!0)}),{
get:function(e,n){var a=t(e,!1);return a&&a[n]},set:function(n,a,r){
(n=t(n,r!==e))&&(n[a]=r)},Tb:function(e,n,a){return(e=t(e,!0))[n]||(e[n]=a)},
clear:n,Z:function(){return a+++r}}
},h.b("utils.domData",h.a.g),h.b("utils.domData.clear",h.a.g.clear),
h.a.I=new function(){function t(t,n){var a=h.a.g.get(t,i)
;return a===e&&n&&(a=[],h.a.g.set(t,i,a)),a}function n(e){
if(n=t(e,!1))for(var n=n.slice(0),r=0;r<n.length;r++)n[r](e)
;h.a.g.clear(e),h.a.I.cleanExternalData(e),u[e.nodeType]&&a(e.childNodes,!0)}
function a(e,t){
for(var a,r=[],i=0;i<e.length;i++)if((!t||8===e[i].nodeType)&&(n(r[r.length]=a=e[i]),
e[i]!==a))for(;i--&&-1==h.a.A(r,e[i]););}var i=h.a.g.Z(),o={1:!0,8:!0,9:!0},u={
1:!0,9:!0};return{za:function(e,n){
if("function"!=typeof n)throw Error("Callback must be a function")
;t(e,!0).push(n)},xb:function(n,a){var r=t(n,!1)
;r&&(h.a.hb(r,a),0==r.length&&h.a.g.set(n,i,e))},na:function(e){
return o[e.nodeType]&&(n(e),u[e.nodeType]&&a(e.getElementsByTagName("*"))),e},
removeNode:function(e){h.na(e),e.parentNode&&e.parentNode.removeChild(e)},
cleanExternalData:function(e){
r&&"function"==typeof r.cleanData&&r.cleanData([e])}}
},h.na=h.a.I.na,h.removeNode=h.a.I.removeNode,
h.b("cleanNode",h.na),h.b("removeNode",h.removeNode),
h.b("utils.domNodeDisposal",h.a.I),
h.b("utils.domNodeDisposal.addDisposeCallback",h.a.I.za),
h.b("utils.domNodeDisposal.removeDisposeCallback",h.a.I.xb),function(){
var a=[0,"",""],i=[1,"<table>","</table>"],o=[3,"<table><tbody><tr>","</tr></tbody></table>"],u=[1,"<select multiple='multiple'>","</select>"],c={
thead:i,tbody:i,tfoot:i,tr:[2,"<table><tbody>","</tbody></table>"],td:o,th:o,
option:u,optgroup:u},s=8>=h.a.W;h.a.ta=function(e,i){var o;if(r){
if(r.parseHTML)o=r.parseHTML(e,i)||[];else if((o=r.clean([e],i))&&o[0]){
for(var u=o[0];u.parentNode&&11!==u.parentNode.nodeType;)u=u.parentNode
;u.parentNode&&u.parentNode.removeChild(u)}}else{
(o=i)||(o=n),u=o.parentWindow||o.defaultView||t
;var l,f=h.a.Cb(e).toLowerCase(),d=o.createElement("div")
;for(l=(f=f.match(/^(?:\x3c!--.*?--\x3e\s*?)*?<([a-z]+)[\s>]/))&&c[f[1]]||a,
f=l[0],
l="ignored<div>"+l[1]+e+l[2]+"</div>","function"==typeof u.innerShiv?d.appendChild(u.innerShiv(l)):(s&&o.body.appendChild(d),
d.innerHTML=l,s&&d.parentNode.removeChild(d));f--;)d=d.lastChild
;o=h.a.la(d.lastChild.childNodes)}return o},h.a.Ld=function(e,t){
var n=h.a.ta(e,t);return n.length&&n[0].parentElement||h.a.Xb(n)
},h.a.dc=function(t,n){
if(h.a.Sb(t),null!==(n=h.a.c(n))&&n!==e)if("string"!=typeof n&&(n=n.toString()),
r)r(t).html(n);else for(var a=h.a.ta(n,t.ownerDocument),i=0;i<a.length;i++)t.appendChild(a[i])
}
}(),h.b("utils.parseHtmlFragment",h.a.ta),h.b("utils.setHtml",h.a.dc),h.aa=function(){
var t={};return{Wb:function(e){
if("function"!=typeof e)throw Error("You can only pass a function to ko.memoization.memoize()")
;var n=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1)
;return t[n]=e,"\x3c!--[ko_memo:"+n+"]--\x3e"},ad:function(n,a){var r=t[n]
;if(r===e)throw Error("Couldn't find any memo with ID "+n+". Perhaps it's already been unmemoized.")
;try{return r.apply(null,a||[]),!0}finally{delete t[n]}},bd:function(e,t){
var n=[];!function e(t,n){
if(t)if(8==t.nodeType)null!=(a=h.aa.Tc(t.nodeValue))&&n.push({sd:t,Jd:a
});else if(1==t.nodeType)for(var a=0,r=t.childNodes,i=r.length;a<i;a++)e(r[a],n)
}(e,n);for(var a=0,r=n.length;a<r;a++){var i=n[a].sd,o=[i]
;t&&h.a.gb(o,t),h.aa.ad(n[a].Jd,o),
i.nodeValue="",i.parentNode&&i.parentNode.removeChild(i)}},Tc:function(e){
return(e=e.match(/^\[ko_memo\:(.*?)\]$/))?e[1]:null}}
}(),h.b("memoization",h.aa),
h.b("memoization.memoize",h.aa.Wb),h.b("memoization.unmemoize",h.aa.ad),
h.b("memoization.parseMemoText",h.aa.Tc),
h.b("memoization.unmemoizeDomNodeAndDescendants",h.aa.bd),h.ma=function(){
function e(){if(i)for(var e,t=i,n=0;u<i;)if(e=r[u++]){if(u>t){if(5e3<=++n){
u=i,h.a.Fc(Error("'Too much recursion' after processing "+n+" task groups."))
;break}t=i}try{e()}catch(o){h.a.Fc(o)}}}function a(){e(),u=i=r.length=0}
var r=[],i=0,o=1,u=0;return{scheduler:t.MutationObserver?function(e){
var t=n.createElement("div");return new MutationObserver(e).observe(t,{
attributes:!0}),function(){t.classList.toggle("foo")}
}(a):n&&"onreadystatechange"in n.createElement("script")?function(e){
var t=n.createElement("script");t.onreadystatechange=function(){
t.onreadystatechange=null,n.documentElement.removeChild(t),t=null,e()
},n.documentElement.appendChild(t)}:function(e){setTimeout(e,0)},yb:function(e){
return i||h.ma.scheduler(a),r[i++]=e,o++},cancel:function(e){
(e-=o-i)>=u&&e<i&&(r[e]=null)},resetForTesting:function(){var e=i-u
;return u=i=r.length=0,e},Rd:e}
}(),h.b("tasks",h.ma),h.b("tasks.schedule",h.ma.yb),
h.b("tasks.runEarly",h.ma.Rd),h.Ta={throttle:function(e,t){
e.throttleEvaluation=t;var n=null;return h.$({read:e,write:function(a){
clearTimeout(n),n=h.a.setTimeout((function(){e(a)}),t)}})},
rateLimit:function(e,t){var n,a,r
;"number"==typeof t?n=t:(n=t.timeout,a=t.method),
e.Hb=!1,r="function"==typeof a?a:"notifyWhenChangesStop"==a?l:s,
e.tb((function(e){return r(e,n,t)}))},deferred:function(t,n){
if(!0!==n)throw Error("The 'deferred' extender only accepts the value 'true', because it is not supported to turn deferral off once enabled.")
;t.Hb||(t.Hb=!0,t.tb((function(n){var a,r=!1;return function(){if(!r){
h.ma.cancel(a),a=h.ma.yb(n);try{r=!0,t.notifySubscribers(e,"dirty")}finally{r=!1
}}}})))},notify:function(e,t){e.equalityComparer="always"==t?null:c}};var b={
undefined:1,boolean:1,number:1,string:1}
;h.b("extenders",h.Ta),h.gc=function(e,t,n){
this.da=e,this.kc=t,this.lc=n,this.Ib=!1,
this.ab=this.Jb=null,h.J(this,"dispose",this.s),
h.J(this,"disposeWhenNodeIsRemoved",this.l)},h.gc.prototype.s=function(){
this.Ib||(this.ab&&h.a.I.xb(this.Jb,this.ab),
this.Ib=!0,this.lc(),this.da=this.kc=this.lc=this.Jb=this.ab=null)
},h.gc.prototype.l=function(e){this.Jb=e,h.a.I.za(e,this.ab=this.s.bind(this))},
h.R=function(){h.a.zb(this,v),v.ob(this)};var v={ob:function(e){e.S={change:[]},
e.rc=1},subscribe:function(e,t,n){var a=this;n=n||"change"
;var r=new h.gc(a,t?e.bind(t):e,(function(){h.a.hb(a.S[n],r),a.cb&&a.cb(n)}))
;return a.Qa&&a.Qa(n),a.S[n]||(a.S[n]=[]),a.S[n].push(r),r},
notifySubscribers:function(e,t){
if("change"===(t=t||"change")&&this.Gb(),this.Wa(t)){
var n="change"===t&&this.dd||this.S[t].slice(0);try{h.v.wc()
;for(var a,r=0;a=n[r];++r)a.Ib||a.kc(e)}finally{h.v.end()}}},mb:function(){
return this.rc},Cd:function(e){return this.mb()!==e},Gb:function(){++this.rc},
tb:function(e){var t,n,a,r,i,o=this,u=h.N(o)
;o.bb||(o.bb=o.notifySubscribers,o.notifySubscribers=f);var c=e((function(){
o.Ka=!1,u&&r===o&&(r=o.mc?o.mc():o());var e=n||i&&o.qb(a,r)
;i=n=t=!1,e&&o.bb(a=r)}));o.pc=function(e,n){
n&&o.Ka||(i=!n),o.dd=o.S.change.slice(0),o.Ka=t=!0,r=e,c()},o.oc=function(e){
t||(a=e,o.bb(e,"beforeChange"))},o.qc=function(){i=!0},o.fd=function(){
o.qb(a,o.w(!0))&&(n=!0)}},Wa:function(e){return this.S[e]&&this.S[e].length},
Ad:function(e){if(e)return this.S[e]&&this.S[e].length||0;var t=0
;return h.a.O(this.S,(function(e,n){"dirty"!==e&&(t+=n.length)})),t},
qb:function(e,t){return!this.equalityComparer||!this.equalityComparer(e,t)},
toString:function(){return"[object Object]"},extend:function(e){var t=this
;return e&&h.a.O(e,(function(e,n){var a=h.Ta[e]
;"function"==typeof a&&(t=a(t,n)||t)})),t}}
;h.J(v,"init",v.ob),h.J(v,"subscribe",v.subscribe),
h.J(v,"extend",v.extend),h.J(v,"getSubscriptionsCount",v.Ad),
h.a.Ba&&h.a.setPrototypeOf(v,Function.prototype),h.R.fn=v,h.Pc=function(e){
return null!=e&&"function"==typeof e.subscribe&&"function"==typeof e.notifySubscribers
},h.b("subscribable",h.R),h.b("isSubscribable",h.Pc),h.U=h.v=function(){
function e(e){a.push(n),n=e}function t(){n=a.pop()}var n,a=[],r=0;return{wc:e,
end:t,ac:function(e){if(n){
if(!h.Pc(e))throw Error("Only subscribable things can act as dependencies")
;n.nd.call(n.od,e,e.ed||(e.ed=++r))}},K:function(n,a,r){try{
return e(),n.apply(a,r||[])}finally{t()}},pa:function(){if(n)return n.o.pa()},
Va:function(){if(n)return n.o.Va()},rb:function(){if(n)return n.rb},
o:function(){if(n)return n.o}}
}(),h.b("computedContext",h.U),h.b("computedContext.getDependenciesCount",h.U.pa),
h.b("computedContext.getDependencies",h.U.Va),
h.b("computedContext.isInitial",h.U.rb),
h.b("computedContext.registerDependency",h.U.ac),
h.b("ignoreDependencies",h.Wd=h.v.K);var g=h.a.Da("_latestValue")
;h.sa=function(e){function t(){
return 0<arguments.length?(t.qb(t[g],arguments[0])&&(t.xa(),
t[g]=arguments[0],t.wa()),this):(h.v.ac(t),t[g])}
return t[g]=e,h.a.Ba||h.a.extend(t,h.R.fn),
h.R.fn.ob(t),h.a.zb(t,m),h.options.deferUpdates&&h.Ta.deferred(t,!0),t};var m={
equalityComparer:c,w:function(){return this[g]},wa:function(){
this.notifySubscribers(this[g],"spectate"),this.notifySubscribers(this[g])},
xa:function(){this.notifySubscribers(this[g],"beforeChange")}}
;h.a.Ba&&h.a.setPrototypeOf(m,h.R.fn);var y=h.sa.Na="__ko_proto__"
;m[y]=h.sa,h.N=function(e){
if((e="function"==typeof e&&e[y])&&e!==m[y]&&e!==h.o.fn[y])throw Error("Invalid object that looks like an observable; possibly from another Knockout instance")
;return!!e},h.Ya=function(e){
return"function"==typeof e&&(e[y]===m[y]||e[y]===h.o.fn[y]&&e.Mc)
},h.b("observable",h.sa),
h.b("isObservable",h.N),h.b("isWriteableObservable",h.Ya),
h.b("isWritableObservable",h.Ya),
h.b("observable.fn",m),h.J(m,"peek",m.w),h.J(m,"valueHasMutated",m.wa),
h.J(m,"valueWillMutate",m.xa),h.Ia=function(e){
if("object"!=typeof(e=e||[])||!("length"in e))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.")
;return e=h.sa(e),h.a.zb(e,h.Ia.fn),e.extend({trackArrayChanges:!0})},h.Ia.fn={
remove:function(e){
for(var t=this.w(),n=[],a="function"!=typeof e||h.N(e)?function(t){return t===e
}:e,r=0;r<t.length;r++){var i=t[r];if(a(i)){
if(0===n.length&&this.xa(),t[r]!==i)throw Error("Array modified during remove; cannot remove item")
;n.push(i),t.splice(r,1),r--}}return n.length&&this.wa(),n},
removeAll:function(t){if(t===e){var n=this.w(),a=n.slice(0)
;return this.xa(),n.splice(0,n.length),this.wa(),a}
return t?this.remove((function(e){return 0<=h.a.A(t,e)})):[]},
destroy:function(e){var t=this.w(),n="function"!=typeof e||h.N(e)?function(t){
return t===e}:e;this.xa();for(var a=t.length-1;0<=a;a--){var r=t[a]
;n(r)&&(r._destroy=!0)}this.wa()},destroyAll:function(t){
return t===e?this.destroy((function(){return!0})):t?this.destroy((function(e){
return 0<=h.a.A(t,e)})):[]},indexOf:function(e){var t=this();return h.a.A(t,e)},
replace:function(e,t){var n=this.indexOf(e)
;0<=n&&(this.xa(),this.w()[n]=t,this.wa())},sorted:function(e){
var t=this().slice(0);return e?t.sort(e):t.sort()},reversed:function(){
return this().slice(0).reverse()}
},h.a.Ba&&h.a.setPrototypeOf(h.Ia.fn,h.sa.fn),h.a.C("pop push reverse shift sort splice unshift".split(" "),(function(e){
h.Ia.fn[e]=function(){var t=this.w();this.xa(),this.yc(t,e,arguments)
;var n=t[e].apply(t,arguments);return this.wa(),n===t?this:n}
})),h.a.C(["slice"],(function(e){h.Ia.fn[e]=function(){var t=this()
;return t[e].apply(t,arguments)}})),h.Oc=function(e){
return h.N(e)&&"function"==typeof e.remove&&"function"==typeof e.push
},h.b("observableArray",h.Ia),
h.b("isObservableArray",h.Oc),h.Ta.trackArrayChanges=function(t,n){function a(){
function e(){if(s){var e,n=[].concat(t.w()||[])
;t.Wa("arrayChange")&&((!c||1<s)&&(c=h.a.Ob(i,n,t.Nb)),
e=c),i=n,c=null,s=0,e&&e.length&&t.notifySubscribers(e,"arrayChange")}}
u?e():(u=!0,o=t.notifySubscribers,t.notifySubscribers=function(e,t){
return t&&"change"!==t||++s,o.apply(this,arguments)
},i=[].concat(t.w()||[]),c=null,r=t.subscribe(e))}
if(t.Nb={},n&&"object"==typeof n&&h.a.extend(t.Nb,n),t.Nb.sparse=!0,!t.yc){
var r,i,o,u=!1,c=null,s=0,l=t.Qa,f=t.cb;t.Qa=function(e){
l&&l.call(t,e),"arrayChange"===e&&a()},t.cb=function(n){
f&&f.call(t,n),"arrayChange"!==n||t.Wa("arrayChange")||(o&&(t.notifySubscribers=o,
o=e),r&&r.s(),r=null,u=!1,i=e)},t.yc=function(e,t,n){function a(e,t,n){
return r[r.length]={status:e,value:t,index:n}}if(u&&!s){
var r=[],i=e.length,o=n.length,l=0;switch(t){case"push":l=i;case"unshift":
for(t=0;t<o;t++)a("added",n[t],l+t);break;case"pop":l=i-1;case"shift":
i&&a("deleted",e[l],l);break;case"splice":
t=Math.min(Math.max(0,0>n[0]?i+n[0]:n[0]),i),
i=1===o?i:Math.min(t+(n[1]||0),i),o=t+o-2,l=Math.max(i,o)
;for(var f=[],d=[],p=2;t<l;++t,
++p)t<i&&d.push(a("deleted",e[t],t)),t<o&&f.push(a("added",n[p],t));h.a.Jc(d,f)
;break;default:return}c=r}}}};var w=h.a.Da("_state");h.o=h.$=function(t,n,a){
function r(){if(0<arguments.length){
if("function"!=typeof i)throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")
;return i.apply(o.lb,arguments),this}
return o.qa||h.v.ac(r),(o.ka||o.G&&r.Xa())&&r.ha(),o.X}
if("object"==typeof t?a=t:(a=a||{},
t&&(a.read=t)),"function"!=typeof a.read)throw Error("Pass a function that returns the value of the ko.computed")
;var i=a.write,o={X:e,ra:!0,ka:!0,pb:!1,hc:!1,qa:!1,vb:!1,G:!1,Vc:a.read,
lb:n||a.owner,l:a.disposeWhenNodeIsRemoved||a.l||null,Sa:a.disposeWhen||a.Sa,
Qb:null,F:{},V:0,Hc:null}
;return r[w]=o,r.Mc="function"==typeof i,h.a.Ba||h.a.extend(r,h.R.fn),
h.R.fn.ob(r),
h.a.zb(r,x),a.pure?(o.vb=!0,o.G=!0,h.a.extend(r,C)):a.deferEvaluation&&h.a.extend(r,E),
h.options.deferUpdates&&h.Ta.deferred(r,!0),
o.l&&(o.hc=!0,o.l.nodeType||(o.l=null)),
o.G||a.deferEvaluation||r.ha(),o.l&&r.ja()&&h.a.I.za(o.l,o.Qb=function(){r.s()
}),r};var x={equalityComparer:c,pa:function(){return this[w].V},Va:function(){
var e=[];return h.a.O(this[w].F,(function(t,n){e[n.La]=n.da})),e},
Ub:function(e){if(!this[w].V)return!1;var t=this.Va()
;return-1!==h.a.A(t,e)||!!h.a.Lb(t,(function(t){return t.Ub&&t.Ub(e)}))},
tc:function(e,t,n){
if(this[w].vb&&t===this)throw Error("A 'pure' computed must not be called recursively")
;this[w].F[e]=n,n.La=this[w].V++,n.Ma=t.mb()},Xa:function(){var e,t,n=this[w].F
;for(e in n)if(Object.prototype.hasOwnProperty.call(n,e)&&(t=n[e],
this.Ja&&t.da.Ka||t.da.Cd(t.Ma)))return!0},Id:function(){
this.Ja&&!this[w].pb&&this.Ja(!1)},ja:function(){var e=this[w]
;return e.ka||0<e.V},Qd:function(){this.Ka?this[w].ka&&(this[w].ra=!0):this.Gc()
},Zc:function(e){if(e.Hb){
var t=e.subscribe(this.Id,this,"dirty"),n=e.subscribe(this.Qd,this);return{da:e,
s:function(){t.s(),n.s()}}}return e.subscribe(this.Gc,this)},Gc:function(){
var e=this,t=e.throttleEvaluation
;t&&0<=t?(clearTimeout(this[w].Hc),this[w].Hc=h.a.setTimeout((function(){
e.ha(!0)}),t)):e.Ja?e.Ja(!0):e.ha(!0)},ha:function(e){var t=this[w],n=t.Sa,a=!1
;if(!t.pb&&!t.qa){if(t.l&&!h.a.Rb(t.l)||n&&n()){if(!t.hc)return void this.s()
}else t.hc=!1;t.pb=!0;try{a=this.yd(e)}finally{t.pb=!1}return a}},
yd:function(t){var n=this[w],a=!1,r=n.vb?e:!n.V;a={pd:this,kb:n.F,Pb:n.V
},h.v.wc({od:a,nd:p,o:this,rb:r}),n.F={},n.V=0;var i=this.xd(n,a)
;return n.V?a=this.qb(n.X,i):(this.s(),
a=!0),a&&(n.G?this.Gb():this.notifySubscribers(n.X,"beforeChange"),
n.X=i,this.notifySubscribers(n.X,"spectate"),
!n.G&&t&&this.notifySubscribers(n.X),
this.qc&&this.qc()),r&&this.notifySubscribers(n.X,"awake"),a},xd:function(e,t){
try{var n=e.Vc;return e.lb?n.call(e.lb):n()}finally{
h.v.end(),t.Pb&&!e.G&&h.a.O(t.kb,d),e.ra=e.ka=!1}},w:function(e){var t=this[w]
;return(t.ka&&(e||!t.V)||t.G&&this.Xa())&&this.ha(),t.X},tb:function(e){
h.R.fn.tb.call(this,e),this.mc=function(){
return this[w].G||(this[w].ra?this.ha():this[w].ka=!1),this[w].X
},this.Ja=function(e){
this.oc(this[w].X),this[w].ka=!0,e&&(this[w].ra=!0),this.pc(this,!e)}},
s:function(){var t=this[w];!t.G&&t.F&&h.a.O(t.F,(function(e,t){t.s&&t.s()
})),t.l&&t.Qb&&h.a.I.xb(t.l,t.Qb),
t.F=e,t.V=0,t.qa=!0,t.ra=!1,t.ka=!1,t.G=!1,t.l=e,t.Sa=e,t.Vc=e,this.Mc||(t.lb=e)
}},C={Qa:function(e){var t=this,n=t[w];if(!n.qa&&n.G&&"change"==e){
if(n.G=!1,n.ra||t.Xa())n.F=null,n.V=0,t.ha()&&t.Gb();else{var a=[]
;h.a.O(n.F,(function(e,t){a[t.La]=e})),h.a.C(a,(function(e,a){
var r=n.F[e],i=t.Zc(r.da);i.La=a,i.Ma=r.Ma,n.F[e]=i})),t.Xa()&&t.ha()&&t.Gb()}
n.qa||t.notifySubscribers(n.X,"awake")}},cb:function(t){var n=this[w]
;n.qa||"change"!=t||this.Wa("change")||(h.a.O(n.F,(function(e,t){t.s&&(n.F[e]={
da:t.da,La:t.La,Ma:t.Ma},t.s())})),n.G=!0,this.notifySubscribers(e,"asleep"))},
mb:function(){var e=this[w]
;return e.G&&(e.ra||this.Xa())&&this.ha(),h.R.fn.mb.call(this)}},E={
Qa:function(e){"change"!=e&&"beforeChange"!=e||this.w()}}
;h.a.Ba&&h.a.setPrototypeOf(x,h.R.fn);var k=h.sa.Na;x[k]=h.o,h.Nc=function(e){
return"function"==typeof e&&e[k]===x[k]},h.Ed=function(e){
return h.Nc(e)&&e[w]&&e[w].vb
},h.b("computed",h.o),h.b("dependentObservable",h.o),
h.b("isComputed",h.Nc),h.b("isPureComputed",h.Ed),
h.b("computed.fn",x),h.J(x,"peek",x.w),
h.J(x,"dispose",x.s),h.J(x,"isActive",x.ja),
h.J(x,"getDependenciesCount",x.pa),h.J(x,"getDependencies",x.Va),
h.wb=function(e,t){return"function"==typeof e?h.o(e,t,{pure:!0
}):((e=h.a.extend({},e)).pure=!0,h.o(e,t))},h.b("pureComputed",h.wb),function(){
function t(a,r,i){
if(i=i||new n,"object"!=typeof(a=r(a))||null===a||a===e||a instanceof RegExp||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a
;var o=a instanceof Array?[]:{};return i.save(a,o),function(e,t){
if(e instanceof Array){for(var n=0;n<e.length;n++)t(n)
;"function"==typeof e.toJSON&&t("toJSON")}else for(n in e)t(n)}(a,(function(n){
var u=r(a[n]);switch(typeof u){case"boolean":case"number":case"string":
case"function":o[n]=u;break;case"object":case"undefined":var c=i.get(u)
;o[n]=c!==e?c:t(u,r,i)}})),o}function n(){this.keys=[],this.values=[]}
h.$c=function(e){
if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.")
;return t(e,(function(e){for(var t=0;h.N(e)&&10>t;t++)e=e();return e}))
},h.toJSON=function(e,t,n){return e=h.$c(e),h.a.fc(e,t,n)},n.prototype={
constructor:n,save:function(e,t){var n=h.a.A(this.keys,e)
;0<=n?this.values[n]=t:(this.keys.push(e),this.values.push(t))},get:function(t){
return 0<=(t=h.a.A(this.keys,t))?this.values[t]:e}}
}(),h.b("toJS",h.$c),h.b("toJSON",h.toJSON),h.Vd=function(e,t,n){function a(t){
var a=h.wb(e,n).extend({Ga:"always"}),r=a.subscribe((function(e){e&&(r.s(),t(e))
}));return a.notifySubscribers(a.w()),r}
return"function"!=typeof Promise||t?a(t.bind(n)):new Promise(a)
},h.b("when",h.Vd),h.u={L:function(t){switch(h.a.P(t)){case"option":
return!0===t.__ko__hasDomDataOptionValue__?h.a.g.get(t,h.f.options.Yb):7>=h.a.W?t.getAttributeNode("value")&&t.getAttributeNode("value").specified?t.value:t.text:t.value
;case"select":return 0<=t.selectedIndex?h.u.L(t.options[t.selectedIndex]):e
;default:return t.value}},ya:function(t,n,a){switch(h.a.P(t)){case"option":
"string"==typeof n?(h.a.g.set(t,h.f.options.Yb,e),
"__ko__hasDomDataOptionValue__"in t&&delete t.__ko__hasDomDataOptionValue__,
t.value=n):(h.a.g.set(t,h.f.options.Yb,n),
t.__ko__hasDomDataOptionValue__=!0,t.value="number"==typeof n?n:"");break
;case"select":""!==n&&null!==n||(n=e)
;for(var r,i=-1,o=0,u=t.options.length;o<u;++o)if((r=h.u.L(t.options[o]))==n||""===r&&n===e){
i=o;break}
(a||0<=i||n===e&&1<t.size)&&(t.selectedIndex=i,6===h.a.W&&h.a.setTimeout((function(){
t.selectedIndex=i}),0));break;default:null!==n&&n!==e||(n=""),t.value=n}}
},h.b("selectExtensions",h.u),
h.b("selectExtensions.readValue",h.u.L),h.b("selectExtensions.writeValue",h.u.ya),
h.m=function(){function e(e){
123===(e=h.a.Cb(e)).charCodeAt(0)&&(e=e.slice(1,-1))
;var t,n=[],o=(e+="\n,").match(a),u=[],c=0;if(1<o.length){
for(var s,l=0;s=o[l];++l){var f=s.charCodeAt(0);if(44===f){if(0>=c){
n.push(t&&u.length?{key:t,value:u.join("")}:{unknown:t||u.join("")}),t=c=0,u=[]
;continue}}else if(58===f){if(!c&&!t&&1===u.length){t=u.pop();continue}}else{
if(47===f&&1<s.length&&(47===s.charCodeAt(1)||42===s.charCodeAt(1)))continue
;47===f&&l&&1<s.length?(f=o[l-1].match(r))&&!i[f[0]]&&(o=(e=e.substr(e.indexOf(s)+1)).match(a),
l=-1,
s="/"):40===f||123===f||91===f?++c:41===f||125===f||93===f?--c:t||u.length||34!==f&&39!==f||(s=s.slice(1,-1))
}u.push(s)}if(0<c)throw Error("Unbalanced parentheses, braces, or brackets")}
return n}
var t=["true","false","null","undefined"],n=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,a=RegExp("\"(?:\\\\.|[^\"])*\"|'(?:\\\\.|[^'])*'|`(?:\\\\.|[^`])*`|/\\*(?:[^*]|\\*+[^*/])*\\*+/|//.*\n|/(?:\\\\.|[^/])+/w*|[^\\s:,/][^,\"'`{}()/:[\\]]*[^\\s,\"'`{}()/:[\\]]|[^\\s]","g"),r=/[\])"'A-Za-z0-9_$]+$/,i={
in:1,return:1,typeof:1},o={};return{Ra:[],va:o,Zb:e,ub:function(a,r){
function i(e,a){var r;if(!l){var f=h.getBindingHandler(e)
;if(f&&f.preprocess&&!(a=f.preprocess(a,e,i)))return
;(f=o[e])&&(r=a,0<=h.a.A(t,r)?r=!1:(f=r.match(n),
r=null!==f&&(f[1]?"Object("+f[1]+")"+f[2]:r)),
f=r),f&&c.push("'"+("string"==typeof o[e]?o[e]:e)+"':function(_z){"+r+"=_z}")}
s&&(a="function(){return "+a+" }"),u.push("'"+e+"':"+a)}
var u=[],c=[],s=(r=r||{}).valueAccessors,l=r.bindingParams,f="string"==typeof a?e(a):a
;return h.a.C(f,(function(e){i(e.key||e.unknown,e.value)
})),c.length&&i("_ko_property_writers","{"+c.join(",")+" }"),u.join(",")},
Hd:function(e,t){for(var n=0;n<e.length;n++)if(e[n].key==t)return!0;return!1},
$a:function(e,t,n,a,r){
e&&h.N(e)?!h.Ya(e)||r&&e.w()===a||e(a):(e=t.get("_ko_property_writers"))&&e[n]&&e[n](a)
}}
}(),h.b("expressionRewriting",h.m),h.b("expressionRewriting.bindingRewriteValidators",h.m.Ra),
h.b("expressionRewriting.parseObjectLiteral",h.m.Zb),
h.b("expressionRewriting.preProcessBindings",h.m.ub),
h.b("expressionRewriting._twoWayBindings",h.m.va),
h.b("jsonExpressionRewriting",h.m),
h.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",h.m.ub),
function(){function e(e){return 8==e.nodeType&&o.test(i?e.text:e.nodeValue)}
function t(e){return 8==e.nodeType&&u.test(i?e.text:e.nodeValue)}
function a(n,a){for(var r=n,i=1,o=[];r=r.nextSibling;){
if(t(r)&&(h.a.g.set(r,s,!0),0==--i))return o;o.push(r),e(r)&&i++}
if(!a)throw Error("Cannot find closing comment tag to match: "+n.nodeValue)
;return null}function r(e,t){var n=a(e,t)
;return n?0<n.length?n[n.length-1].nextSibling:e.nextSibling:null}
var i=n&&"\x3c!--test--\x3e"===n.createComment("test").text,o=i?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,u=i?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,c={
ul:!0,ol:!0},s="__ko_matchedEndComment__";h.h={ea:{},childNodes:function(t){
return e(t)?a(t):t.childNodes},Ea:function(t){
if(e(t))for(var n=0,a=(t=h.h.childNodes(t)).length;n<a;n++)h.removeNode(t[n]);else h.a.Sb(t)
},ua:function(t,n){if(e(t)){h.h.Ea(t)
;for(var a=t.nextSibling,r=0,i=n.length;r<i;r++)a.parentNode.insertBefore(n[r],a)
}else h.a.ua(t,n)},Uc:function(t,n){
e(t)?t.parentNode.insertBefore(n,t.nextSibling):t.firstChild?t.insertBefore(n,t.firstChild):t.appendChild(n)
},Vb:function(t,n,a){
a?e(t)?t.parentNode.insertBefore(n,a.nextSibling):a.nextSibling?t.insertBefore(n,a.nextSibling):t.appendChild(n):h.h.Uc(t,n)
},firstChild:function(n){
if(e(n))return!n.nextSibling||t(n.nextSibling)?null:n.nextSibling
;if(n.firstChild&&t(n.firstChild))throw Error("Found invalid end comment, as the first child of "+n)
;return n.firstChild},nextSibling:function(n){
if(e(n)&&(n=r(n)),n.nextSibling&&t(n.nextSibling)){var a=n.nextSibling
;if(t(a)&&!h.a.g.get(a,s))throw Error("Found end comment without a matching opening comment, as child of "+n)
;return null}return n.nextSibling},Bd:e,Ud:function(e){
return(e=(i?e.text:e.nodeValue).match(o))?e[1]:null},Rc:function(n){
if(c[h.a.P(n)]){var a=n.firstChild;if(a)do{if(1===a.nodeType){var i,o=null
;if(i=a.firstChild)do{if(o)o.push(i);else if(e(i)){var u=r(i,!0);u?i=u:o=[i]
}else t(i)&&(o=[i])}while(i=i.nextSibling)
;if(i=o)for(o=a.nextSibling,u=0;u<i.length;u++)o?n.insertBefore(i[u],o):n.appendChild(i[u])
}}while(a=a.nextSibling)}}}
}(),h.b("virtualElements",h.h),h.b("virtualElements.allowedBindings",h.h.ea),
h.b("virtualElements.emptyNode",h.h.Ea),
h.b("virtualElements.insertAfter",h.h.Vb),h.b("virtualElements.prepend",h.h.Uc),
h.b("virtualElements.setDomNodeChildren",h.h.ua),h.ga=function(){this.md={}
},h.a.extend(h.ga.prototype,{nodeHasBindings:function(e){switch(e.nodeType){
case 1:return null!=e.getAttribute("data-bind")||h.i.getComponentNameForNode(e)
;case 8:return h.h.Bd(e);default:return!1}},getBindings:function(e,t){
var n=(n=this.getBindingsString(e,t))?this.parseBindingsString(n,t,e):null
;return h.i.sc(n,e,t,!1)},getBindingAccessors:function(e,t){
var n=(n=this.getBindingsString(e,t))?this.parseBindingsString(n,t,e,{
valueAccessors:!0}):null;return h.i.sc(n,e,t,!0)},getBindingsString:function(e){
switch(e.nodeType){case 1:return e.getAttribute("data-bind");case 8:
return h.h.Ud(e);default:return null}},parseBindingsString:function(e,t,n,a){
try{var r,i=this.md,o=e+(a&&a.valueAccessors||"");if(!(r=i[o])){
var u,c="with($context){with($data||{}){return{"+h.m.ub(e,a)+"}}}"
;u=new Function("$context","$element",c),r=i[o]=u}return r(t,n)}catch(s){
throw s.message="Unable to parse bindings.\nBindings value: "+e+"\nMessage: "+s.message,
s}}}),h.ga.instance=new h.ga,h.b("bindingProvider",h.ga),function(){
function a(e){var t=(e=h.a.g.get(e,x))&&e.M;t&&(e.M=null,t.Sc())}
function i(e,t,n){this.node=e,this.xc=t,this.ib=[],this.T=!1,t.M||h.a.I.za(e,a),
n&&n.M&&(n.M.ib.push(e),this.Kb=n)}function o(e){return function(){return e}}
function u(e){return e()}function c(e){return h.a.Ha(h.v.K(e),(function(t,n){
return function(){return e()[n]}}))}function s(e,t,n){
return"function"==typeof e?c(e.bind(null,t,n)):h.a.Ha(e,o)}function l(e,t){
return c(this.getBindings.bind(this,e,t))}function f(e,t){
var n=h.h.firstChild(t);if(n){var a,r=h.ga.instance,i=r.preprocessNode;if(i){
for(;a=n;)n=h.h.nextSibling(a),i.call(r,a);n=h.h.firstChild(t)}
for(;a=n;)n=h.h.nextSibling(a),d(e,a)}h.j.Ga(t,h.j.T)}function d(e,t){
var n=e,a=1===t.nodeType
;a&&h.h.Rc(t),(a||h.ga.instance.nodeHasBindings(t))&&(n=p(t,null,e).bindingContextForDescendants),
n&&!y[h.a.P(t)]&&f(n,t)}function p(t,n,a){var r,i=h.a.g.Tb(t,x,{}),o=i.gd
;if(!n){
if(o)throw Error("You cannot apply bindings multiple times to the same element.")
;i.gd=!0}if(o||(i.context=a),n&&"function"!=typeof n)r=n;else{
var c=h.ga.instance,s=c.getBindingAccessors||l,f=h.$((function(){
return(r=n?n(a,t):s.call(c,t,a))&&(a[v]&&a[v](),a[m]&&a[m]()),r}),null,{l:t})
;r&&f.ja()||(f=null)}var d,p=a;if(r){var b=function(){return h.a.Ha(f?f():r,u)
},g=f?function(e){return function(){return u(f()[e])}}:function(e){return r[e]}
;b.get=function(e){return r[e]&&u(g(e))},b.has=function(e){return e in r
},h.j.T in r&&h.j.subscribe(t,h.j.T,(function(){var e=(0,r[h.j.T])();if(e){
var n=h.h.childNodes(t);n.length&&e(n,h.Dc(n[0]))}
})),h.j.oa in r&&(p=h.j.Bb(t,a),h.j.subscribe(t,h.j.oa,(function(){
var e=(0,r[h.j.oa])();e&&h.h.firstChild(t)&&e(t)}))),i=function(e){
var t=[],n={},a=[];return h.a.O(e,(function r(i){if(!n[i]){
var o=h.getBindingHandler(i);o&&(o.after&&(a.push(i),h.a.C(o.after,(function(t){
if(e[t]){
if(-1!==h.a.A(a,t))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+a.join(", "))
;r(t)}})),a.length--),t.push({key:i,Lc:o})),n[i]=!0}})),t
}(r),h.a.C(i,(function(n){var a=n.Lc.init,i=n.Lc.update,u=n.key
;if(8===t.nodeType&&!h.h.ea[u])throw Error("The binding '"+u+"' cannot be used with virtual elements")
;try{"function"==typeof a&&h.v.K((function(){var n=a(t,g(u),b,p.$data,p)
;if(n&&n.controlsDescendantBindings){
if(d!==e)throw Error("Multiple bindings ("+d+" and "+u+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.")
;d=u}})),"function"==typeof i&&h.$((function(){i(t,g(u),b,p.$data,p)}),null,{l:t
})}catch(o){
throw o.message='Unable to process binding "'+u+": "+r[u]+'"\nMessage: '+o.message,
o}}))}return{shouldBindDescendants:i=d===e,bindingContextForDescendants:i&&p}}
function b(t,n){return t&&t instanceof h.fa?t:new h.fa(t,e,e,n)}
var v=h.a.Da("_subscribable"),g=h.a.Da("_ancestorBindingInfo"),m=h.a.Da("_dataDependency")
;h.f={};var y={script:!0,textarea:!0,template:!0}
;h.getBindingHandler=function(e){return h.f[e]};var w={}
;h.fa=function(t,n,a,r,i){function o(){var e=f?l():l,t=h.a.c(e)
;return n?(h.a.extend(c,n),
g in n&&(c[g]=n[g])):(c.$parents=[],c.$root=t,c.ko=h),
c[v]=u,s?t=c.$data:(c.$rawData=e,
c.$data=t),a&&(c[a]=t),r&&r(c,n,t),n&&n[v]&&!h.U.o().Ub(n[v])&&n[v](),
d&&(c[m]=d),c.$data}
var u,c=this,s=t===w,l=s?e:t,f="function"==typeof l&&!h.N(l),d=i&&i.dataDependency
;i&&i.exportDependencies?o():((u=h.wb(o)).w(),
u.ja()?u.equalityComparer=null:c[v]=e)
},h.fa.prototype.createChildContext=function(e,t,n,a){
if(!a&&t&&"object"==typeof t&&(t=(a=t).as,n=a.extend),t&&a&&a.noChildContext){
var r="function"==typeof e&&!h.N(e);return new h.fa(w,this,null,(function(a){
n&&n(a),a[t]=r?e():e}),a)}return new h.fa(e,this,t,(function(e,t){
e.$parentContext=t,
e.$parent=t.$data,e.$parents=(t.$parents||[]).slice(0),e.$parents.unshift(e.$parent),
n&&n(e)}),a)},h.fa.prototype.extend=function(e,t){
return new h.fa(w,this,null,(function(t){
h.a.extend(t,"function"==typeof e?e(t):e)}),t)};var x=h.a.g.Z()
;i.prototype.Sc=function(){this.Kb&&this.Kb.M&&this.Kb.M.rd(this.node)
},i.prototype.rd=function(e){
h.a.hb(this.ib,e),!this.ib.length&&this.T&&this.Bc()},i.prototype.Bc=function(){
this.T=!0,
this.xc.M&&!this.ib.length&&(this.xc.M=null,h.a.I.xb(this.node,a),h.j.Ga(this.node,h.j.oa),
this.Sc())},h.j={T:"childrenComplete",oa:"descendantsComplete",
subscribe:function(e,t,n,a){
return(e=h.a.g.Tb(e,x,{})).Fa||(e.Fa=new h.R),e.Fa.subscribe(n,a,t)},
Ga:function(t,n){var a=h.a.g.get(t,x)
;if(a&&(a.Fa&&a.Fa.notifySubscribers(t,n),n==h.j.T))if(a.M)a.M.Bc();else if(a.M===e&&a.Fa&&a.Fa.Wa(h.j.oa))throw Error("descendantsComplete event not supported for bindings on this node")
},Bb:function(e,t){var n=h.a.g.Tb(e,x,{})
;return n.M||(n.M=new i(e,n,t[g])),t[g]==n?t:t.extend((function(e){e[g]=n}))}
},h.Sd=function(e){return(e=h.a.g.get(e,x))&&e.context},h.eb=function(e,t,n){
return 1===e.nodeType&&h.h.Rc(e),p(e,t,b(n))},h.kd=function(e,t,n){
return n=b(n),h.eb(e,s(t,n,e),n)},h.Pa=function(e,t){
1!==t.nodeType&&8!==t.nodeType||f(b(e),t)},h.uc=function(e,a,i){
if(!r&&t.jQuery&&(r=t.jQuery),2>arguments.length){
if(!(a=n.body))throw Error("ko.applyBindings: could not find document.body; has the document been loaded?")
}else if(!a||1!==a.nodeType&&8!==a.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node")
;d(b(e,i),a)},h.Cc=function(t){
return!t||1!==t.nodeType&&8!==t.nodeType?e:h.Sd(t)},h.Dc=function(t){
return(t=h.Cc(t))?t.$data:e},h.b("bindingHandlers",h.f),h.b("bindingEvent",h.j),
h.b("bindingEvent.subscribe",h.j.subscribe),
h.b("bindingEvent.startPossiblyAsyncContentBinding",h.j.Bb),
h.b("applyBindings",h.uc),
h.b("applyBindingsToDescendants",h.Pa),h.b("applyBindingAccessorsToNode",h.eb),
h.b("applyBindingsToNode",h.kd),h.b("contextFor",h.Cc),h.b("dataFor",h.Dc)
}(),function(e){function t(t,a){
var o,u=Object.prototype.hasOwnProperty.call(r,t)?r[t]:e
;u?u.subscribe(a):((u=r[t]=new h.R).subscribe(a),n(t,(function(e,n){
var a=!(!n||!n.synchronous);i[t]={definition:e,Fd:a
},delete r[t],o||a?u.notifySubscribers(e):h.ma.yb((function(){
u.notifySubscribers(e)}))})),o=!0)}function n(e,t){
a("getConfig",[e],(function(n){n?a("loadComponent",[e,n],(function(e){t(e,n)
})):t(null,null)}))}function a(t,n,r,i){i||(i=h.i.loaders.slice(0))
;var o=i.shift();if(o){var u=o[t];if(u){var c=!1
;if(u.apply(o,n.concat((function(e){c?r(null):null!==e?r(e):a(t,n,r,i)
})))!==e&&(c=!0,
!o.suppressLoaderExceptions))throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.")
}else a(t,n,r,i)}else r(null)}var r={},i={};h.i={get:function(n,a){
var r=Object.prototype.hasOwnProperty.call(i,n)?i[n]:e;r?r.Fd?h.v.K((function(){
a(r.definition)})):h.ma.yb((function(){a(r.definition)})):t(n,a)},
Ac:function(e){delete i[e]},nc:a
},h.i.loaders=[],h.b("components",h.i),h.b("components.get",h.i.get),
h.b("components.clearCachedDefinition",h.i.Ac)}(),function(){
function e(e,t,n,a){function r(){0==--u&&a(o)}var o={},u=2,c=n.template
;n=n.viewModel,c?i(t,c,(function(t){h.i.nc("loadTemplate",[e,t],(function(e){
o.template=e,r()}))})):r(),n?i(t,n,(function(t){
h.i.nc("loadViewModel",[e,t],(function(e){o[s]=e,r()}))})):r()}function a(e){
switch(h.a.P(e)){case"script":return h.a.ta(e.text);case"textarea":
return h.a.ta(e.value);case"template":
if(r(e.content))return h.a.Ca(e.content.childNodes)}return h.a.Ca(e.childNodes)}
function r(e){
return t.DocumentFragment?e instanceof DocumentFragment:e&&11===e.nodeType}
function i(e,n,a){
"string"==typeof n.require?u||t.require?(u||t.require)([n.require],a):e("Uses require, but no AMD loader is present"):a(n)
}function o(e){return function(t){throw Error("Component '"+e+"': "+t)}}var c={}
;h.i.register=function(e,t){if(!t)throw Error("Invalid configuration for "+e)
;if(h.i.sb(e))throw Error("Component "+e+" is already registered");c[e]=t
},h.i.sb=function(e){return Object.prototype.hasOwnProperty.call(c,e)
},h.i.unregister=function(e){delete c[e],h.i.Ac(e)},h.i.Ec={
getConfig:function(e,t){t(h.i.sb(e)?c[e]:null)},loadComponent:function(t,n,a){
var r=o(t);i(r,n,(function(n){e(t,r,n,a)}))},loadTemplate:function(e,i,u){
if(e=o(e),
"string"==typeof i)u(h.a.ta(i));else if(i instanceof Array)u(i);else if(r(i))u(h.a.la(i.childNodes));else if(i.element)if(i=i.element,
t.HTMLElement?i instanceof HTMLElement:i&&i.tagName&&1===i.nodeType)u(a(i));else if("string"==typeof i){
var c=n.getElementById(i);c?u(a(c)):e("Cannot find element with ID "+i)
}else e("Unknown element type: "+i);else e("Unknown template value: "+i)},
loadViewModel:function(e,t,n){!function e(t,n,a){
if("function"==typeof n)a((function(e){return new n(e)
}));else if("function"==typeof n[s])a(n[s]);else if("instance"in n){
var r=n.instance;a((function(){return r}))
}else"viewModel"in n?e(t,n.viewModel,a):t("Unknown viewModel value: "+n)
}(o(e),t,n)}};var s="createViewModel"
;h.b("components.register",h.i.register),h.b("components.isRegistered",h.i.sb),
h.b("components.unregister",h.i.unregister),
h.b("components.defaultLoader",h.i.Ec),h.i.loaders.push(h.i.Ec),h.i.cd=c
}(),function(){function e(e,n){if(a=e.getAttribute("params")){
var a=t.parseBindingsString(a,n,e,{valueAccessors:!0,bindingParams:!0
}),r=(a=h.a.Ha(a,(function(t){return h.o(t,null,{l:e})})),h.a.Ha(a,(function(t){
var n=t.w();return t.ja()?h.o({read:function(){return h.a.c(t())},
write:h.Ya(n)&&function(e){t()(e)},l:e}):n})))
;return Object.prototype.hasOwnProperty.call(r,"$raw")||(r.$raw=a),r}return{
$raw:{}}}h.i.getComponentNameForNode=function(e){var t=h.a.P(e)
;if(h.i.sb(t)&&(-1!=t.indexOf("-")||"[object HTMLUnknownElement]"==""+e||8>=h.a.W&&e.tagName===t))return t
},h.i.sc=function(t,n,a,r){if(1===n.nodeType){
var i=h.i.getComponentNameForNode(n);if(i){
if((t=t||{}).component)throw Error('Cannot use the "component" binding on a custom element matching a component')
;var o={name:i,params:e(n,a)};t.component=r?function(){return o}:o}}return t}
;var t=new h.ga;9>h.a.W&&(h.i.register=function(e){return function(t){
return e.apply(this,arguments)}
}(h.i.register),n.createDocumentFragment=function(e){return function(){
var t,n=e(),a=h.i.cd;for(t in a);return n}}(n.createDocumentFragment))
}(),function(){var e=0;h.f.component={init:function(t,n,a,r,i){function o(){
var e=u&&u.dispose;"function"==typeof e&&e.call(u),s&&s.s(),c=u=s=null}
var u,c,s,l=h.a.la(h.h.childNodes(t))
;return h.h.Ea(t),h.a.I.za(t,o),h.o((function(){var a,r,f=h.a.c(n())
;if("string"==typeof f?a=f:(a=h.a.c(f.name),
r=h.a.c(f.params)),!a)throw Error("No component name specified")
;var d=h.j.Bb(t,i),p=c=++e;h.i.get(a,(function(e){if(c===p){
if(o(),!e)throw Error("Unknown component '"+a+"'");!function(e,t,n){
if(!(t=t.template))throw Error("Component '"+e+"' has no template");e=h.a.Ca(t),
h.h.ua(n,e)}(a,e,t);var n=function(e,t,n){var a=e.createViewModel
;return a?a.call(e,t,n):t}(e,r,{element:t,templateNodes:l})
;e=d.createChildContext(n,{extend:function(e){
e.$component=n,e.$componentTemplateNodes=l}
}),n&&n.koDescendantsComplete&&(s=h.j.subscribe(t,h.j.oa,n.koDescendantsComplete,n)),
u=n,h.Pa(e,t)}}))}),null,{l:t}),{controlsDescendantBindings:!0}}
},h.h.ea.component=!0}();var T={class:"className",for:"htmlFor"};h.f.attr={
update:function(t,n){var a=h.a.c(n())||{};h.a.O(a,(function(n,a){a=h.a.c(a)
;var r=n.indexOf(":"),i=(r="lookupNamespaceURI"in t&&0<r&&t.lookupNamespaceURI(n.substr(0,r)),
!1===a||null===a||a===e)
;i?r?t.removeAttributeNS(r,n):t.removeAttribute(n):a=a.toString(),
8>=h.a.W&&n in T?(n=T[n],
i?t.removeAttribute(n):t[n]=a):i||(r?t.setAttributeNS(r,n,a):t.setAttribute(n,a)),
"name"===n&&h.a.Xc(t,i?"":a)}))}},h.f.checked={after:["value","attr"],
init:function(t,n,a){function r(){var r=t.checked,c=i()
;if(!h.U.rb()&&(r||!u&&!h.U.pa())){var f=h.v.K(n);if(s){var p=l?f.w():f,b=d;d=c,
b!==c?r&&(h.a.Oa(p,c,!0),h.a.Oa(p,b,!1)):h.a.Oa(p,c,r),l&&h.Ya(f)&&f(p)
}else o&&(c===e?c=r:r||(c=e)),h.m.$a(f,a,"checked",c,!0)}}
var i=h.wb((function(){
return a.has("checkedValue")?h.a.c(a.get("checkedValue")):f?a.has("value")?h.a.c(a.get("value")):t.value:void 0
})),o="checkbox"==t.type,u="radio"==t.type;if(o||u){
var c=n(),s=o&&h.a.c(c)instanceof Array,l=!(s&&c.push&&c.splice),f=u||s,d=s?i():e
;u&&!t.name&&h.f.uniqueName.init(t,(function(){return!0})),h.o(r,null,{l:t
}),h.a.H(t,"click",r),h.o((function(){var a=h.a.c(n()),r=i()
;s?(t.checked=0<=h.a.A(a,r),d=r):t.checked=o&&r===e?!!a:i()===a}),null,{l:t
}),c=e}}},h.m.va.checked=!0,h.f.checkedValue={update:function(e,t){
e.value=h.a.c(t())}},h.f.class={update:function(e,t){var n=h.a.Cb(h.a.c(t()))
;h.a.Eb(e,e.__ko__cssValue,!1),e.__ko__cssValue=n,h.a.Eb(e,n,!0)}},h.f.css={
update:function(e,t){var n=h.a.c(t())
;null!==n&&"object"==typeof n?h.a.O(n,(function(t,n){n=h.a.c(n),h.a.Eb(e,t,n)
})):h.f.class.update(e,t)}},h.f.enable={update:function(e,t){var n=h.a.c(t())
;n&&e.disabled?e.removeAttribute("disabled"):n||e.disabled||(e.disabled=!0)}
},h.f.disable={update:function(e,t){h.f.enable.update(e,(function(){
return!h.a.c(t())}))}},h.f.event={init:function(e,t,n,a,r){var i=t()||{}
;h.a.O(i,(function(i){"string"==typeof i&&h.a.H(e,i,(function(e){var o,u=t()[i]
;if(u){try{var c=h.a.la(arguments);a=r.$data,c.unshift(a),o=u.apply(a,c)
}finally{!0!==o&&(e.preventDefault?e.preventDefault():e.returnValue=!1)}
!1===n.get(i+"Bubble")&&(e.cancelBubble=!0,
e.stopPropagation&&e.stopPropagation())}}))}))}},h.f.foreach={Qc:function(e){
return function(){var t=e(),n=h.a.$b(t)
;return n&&"number"!=typeof n.length?(h.a.c(t),{foreach:n.data,as:n.as,
noChildContext:n.noChildContext,includeDestroyed:n.includeDestroyed,
afterAdd:n.afterAdd,beforeRemove:n.beforeRemove,afterRender:n.afterRender,
beforeMove:n.beforeMove,afterMove:n.afterMove,templateEngine:h.ba.Na}):{
foreach:t,templateEngine:h.ba.Na}}},init:function(e,t){
return h.f.template.init(e,h.f.foreach.Qc(t))},update:function(e,t,n,a,r){
return h.f.template.update(e,h.f.foreach.Qc(t),n,a,r)}
},h.m.Ra.foreach=!1,h.h.ea.foreach=!0,h.f.hasfocus={init:function(e,t,n){
function a(a){e.__ko_hasfocusUpdating=!0;var r=e.ownerDocument
;if("activeElement"in r){var i;try{i=r.activeElement}catch(o){i=r.body}a=i===e}
r=t(),
h.m.$a(r,n,"hasfocus",a,!0),e.__ko_hasfocusLastValue=a,e.__ko_hasfocusUpdating=!1
}var r=a.bind(null,!0),i=a.bind(null,!1)
;h.a.H(e,"focus",r),h.a.H(e,"focusin",r),
h.a.H(e,"blur",i),h.a.H(e,"focusout",i),e.__ko_hasfocusLastValue=!1},
update:function(e,t){var n=!!h.a.c(t())
;e.__ko_hasfocusUpdating||e.__ko_hasfocusLastValue===n||(n?e.focus():e.blur(),
!n&&e.__ko_hasfocusLastValue&&e.ownerDocument.body.focus(),
h.v.K(h.a.Fb,null,[e,n?"focusin":"focusout"]))}
},h.m.va.hasfocus=!0,h.f.hasFocus=h.f.hasfocus,
h.m.va.hasFocus="hasfocus",h.f.html={init:function(){return{
controlsDescendantBindings:!0}},update:function(e,t){h.a.dc(e,t())}},function(){
function e(e,t,n){h.f[e]={init:function(e,a,r,i,o){var u,c,s,l,f,d={};if(t){
i=r.get("as");var p=r.get("noChildContext");d={as:i,noChildContext:p,
exportDependencies:f=!(i&&p)}}
return l=(s="render"==r.get("completeOn"))||r.has(h.j.oa),h.o((function(){
var r,i=h.a.c(a()),p=!n!=!i,b=!c
;(f||p!==u)&&(l&&(o=h.j.Bb(e,o)),p&&(t&&!f||(d.dataDependency=h.U.o()),
r=t?o.createChildContext("function"==typeof i?i:a,d):h.U.pa()?o.extend(null,d):o),
b&&h.U.pa()&&(c=h.a.Ca(h.h.childNodes(e),!0)),
p?(b||h.h.ua(e,h.a.Ca(c)),h.Pa(r,e)):(h.h.Ea(e),s||h.j.Ga(e,h.j.T)),u=p)
}),null,{l:e}),{controlsDescendantBindings:!0}}},h.m.Ra[e]=!1,h.h.ea[e]=!0}
e("if"),e("ifnot",!1,!0),e("with",!0)}(),h.f.let={init:function(e,t,n,a,r){
return t=r.extend(t),h.Pa(t,e),{controlsDescendantBindings:!0}}},h.h.ea.let=!0
;var N={};h.f.options={init:function(e){
if("select"!==h.a.P(e))throw Error("options binding applies only to SELECT elements")
;for(;0<e.length;)e.remove(0);return{controlsDescendantBindings:!0}},
update:function(t,n,a){function r(){return h.a.fb(t.options,(function(e){
return e.selected}))}function i(e,t,n){var a=typeof t
;return"function"==a?t(e):"string"==a?e[t]:n}function o(e,n){
if(b&&l)h.u.ya(t,h.a.c(a.get("value")),!0);else if(p.length){
var r=0<=h.a.A(p,h.u.L(n[0]))
;h.a.Yc(n[0],r),b&&!r&&h.v.K(h.a.Fb,null,[t,"change"])}}
var u=t.multiple,c=0!=t.length&&u?t.scrollTop:null,s=h.a.c(n()),l=a.get("valueAllowUnset")&&a.has("value"),f=a.get("optionsIncludeDestroyed")
;n={};var d,p=[]
;l||(u?p=h.a.Mb(r(),h.u.L):0<=t.selectedIndex&&p.push(h.u.L(t.options[t.selectedIndex]))),
s&&(void 0===s.length&&(s=[s]),d=h.a.fb(s,(function(t){
return f||t===e||null===t||!h.a.c(t._destroy)
})),a.has("optionsCaption")&&null!==(s=h.a.c(a.get("optionsCaption")))&&s!==e&&d.unshift(N))
;var b=!1;n.beforeRemove=function(e){t.removeChild(e)
},s=o,a.has("optionsAfterRender")&&"function"==typeof a.get("optionsAfterRender")&&(s=function(t,n){
o(0,n),h.v.K(a.get("optionsAfterRender"),null,[n[0],t!==N?t:e])
}),h.a.cc(t,d,(function(n,r,o){
return o.length&&(p=!l&&o[0].selected?[h.u.L(o[0])]:[],
b=!0),r=t.ownerDocument.createElement("option"),
n===N?(h.a.Ab(r,a.get("optionsCaption")),
h.u.ya(r,e)):(o=i(n,a.get("optionsValue"),n),
h.u.ya(r,h.a.c(o)),n=i(n,a.get("optionsText"),o),h.a.Ab(r,n)),[r]
}),n,s),h.v.K((function(){
l?h.u.ya(t,h.a.c(a.get("value")),!0):(u?p.length&&r().length<p.length:p.length&&0<=t.selectedIndex?h.u.L(t.options[t.selectedIndex])!==p[0]:p.length||0<=t.selectedIndex)&&h.a.Fb(t,"change")
})),h.a.vd(t),c&&20<Math.abs(c-t.scrollTop)&&(t.scrollTop=c)}
},h.f.options.Yb=h.a.g.Z(),h.f.selectedOptions={after:["options","foreach"],
init:function(e,t,n){h.a.H(e,"change",(function(){var a=t(),r=[]
;h.a.C(e.getElementsByTagName("option"),(function(e){
e.selected&&r.push(h.u.L(e))})),h.m.$a(a,n,"selectedOptions",r)}))},
update:function(e,t){
if("select"!=h.a.P(e))throw Error("values binding applies only to SELECT elements")
;var n=h.a.c(t()),a=e.scrollTop
;n&&"number"==typeof n.length&&h.a.C(e.getElementsByTagName("option"),(function(e){
var t=0<=h.a.A(n,h.u.L(e));e.selected!=t&&h.a.Yc(e,t)})),e.scrollTop=a}
},h.m.va.selectedOptions=!0,h.f.style={update:function(t,n){var a=h.a.c(n()||{})
;h.a.O(a,(function(n,a){
if(null!==(a=h.a.c(a))&&a!==e&&!1!==a||(a=""),r)r(t).css(n,a);else if(/^--/.test(n))t.style.setProperty(n,a);else{
n=n.replace(/-(\w)/g,(function(e,t){return t.toUpperCase()}));var i=t.style[n]
;t.style[n]=a,a===i||t.style[n]!=i||isNaN(a)||(t.style[n]=a+"px")}}))}
},h.f.submit={init:function(e,t,n,a,r){
if("function"!=typeof t())throw Error("The value for a submit binding must be a function")
;h.a.H(e,"submit",(function(n){var a,i=t();try{a=i.call(r.$data,e)}finally{
!0!==a&&(n.preventDefault?n.preventDefault():n.returnValue=!1)}}))}},h.f.text={
init:function(){return{controlsDescendantBindings:!0}},update:function(e,t){
h.a.Ab(e,t())}},h.h.ea.text=!0,function(){if(t&&t.navigator){
var n,a,r,i,o,u=function(e){if(e)return parseFloat(e[1])
},c=t.navigator.userAgent
;(n=t.opera&&t.opera.version&&parseInt(t.opera.version()))||(o=u(c.match(/Edge\/([^ ]+)$/)))||u(c.match(/Chrome\/([^ ]+)/))||(a=u(c.match(/Version\/([^ ]+) Safari/)))||(r=u(c.match(/Firefox\/([^ ]+)/)))||(i=h.a.W||u(c.match(/MSIE ([^ ]+)/)))||(i=u(c.match(/rv:([^ )]+)/)))
}if(8<=i&&10>i)var s=h.a.g.Z(),l=h.a.g.Z(),f=function(e){
var t=this.activeElement;(t=t&&h.a.g.get(t,l))&&t(e)},d=function(e,t){
var n=e.ownerDocument
;h.a.g.get(n,s)||(h.a.g.set(n,s,!0),h.a.H(n,"selectionchange",f)),
h.a.g.set(e,l,t)};h.f.textInput={init:function(t,u,c){function s(e,n){
h.a.H(t,e,n)}function l(){p||(b=t.value,p=h.a.setTimeout(f,4))}function f(){
clearTimeout(p),b=p=e;var n=t.value;v!==n&&(v=n,h.m.$a(u(),c,"textInput",n))}
var p,b,v=t.value,g=9==h.a.W?l:f,m=!1
;i&&s("keypress",f),11>i&&s("propertychange",(function(e){
m||"value"!==e.propertyName||g(e)
})),8==i&&(s("keyup",f),s("keydown",f)),d&&(d(t,g),
s("dragend",l)),(!i||9<=i)&&s("input",g),
5>a&&"textarea"===h.a.P(t)?(s("keydown",l),
s("paste",l),s("cut",l)):11>n?s("keydown",l):4>r?(s("DOMAutoComplete",f),
s("dragdrop",f),s("drop",f)):o&&"number"===t.type&&s("keydown",l),s("change",f),
s("blur",f),h.o((function n(){var a=h.a.c(u())
;null!==a&&a!==e||(a=""),b!==e&&a===b?h.a.setTimeout(n,4):t.value!==a&&(m=!0,
t.value=a,m=!1,v=t.value)}),null,{l:t})}},h.m.va.textInput=!0,h.f.textinput={
preprocess:function(e,t,n){n("textInput",e)}}}(),h.f.uniqueName={
init:function(e,t){if(t()){var n="ko_unique_"+ ++h.f.uniqueName.qd;h.a.Xc(e,n)}}
},h.f.uniqueName.qd=0,h.f.using={init:function(e,t,n,a,r){var i
;return n.has("as")&&(i={as:n.get("as"),noChildContext:n.get("noChildContext")
}),t=r.createChildContext(t,i),h.Pa(t,e),{controlsDescendantBindings:!0}}
},h.h.ea.using=!0,h.f.value={after:["options","foreach"],init:function(t,n,a){
var r=h.a.P(t),i="input"==r;if(!i||"checkbox"!=t.type&&"radio"!=t.type){
var o=["change"],u=a.get("valueUpdate"),c=!1,s=null
;u&&("string"==typeof u&&(u=[u]),h.a.gb(o,u),o=h.a.vc(o));var l,f=function(){
s=null,c=!1;var e=n(),r=h.u.L(t);h.m.$a(e,a,"value",r)}
;!h.a.W||!i||"text"!=t.type||"off"==t.autocomplete||t.form&&"off"==t.form.autocomplete||-1!=h.a.A(o,"propertychange")||(h.a.H(t,"propertychange",(function(){
c=!0})),h.a.H(t,"focus",(function(){c=!1})),h.a.H(t,"blur",(function(){c&&f()
}))),h.a.C(o,(function(e){var n=f;h.a.Td(e,"after")&&(n=function(){
s=h.u.L(t),h.a.setTimeout(f,0)},e=e.substring(5)),h.a.H(t,e,n)
})),l=i&&"file"==t.type?function(){var a=h.a.c(n())
;null===a||a===e||""===a?t.value="":h.v.K(f)}:function(){
var i=h.a.c(n()),o=h.u.L(t)
;null!==s&&i===s?h.a.setTimeout(l,0):i===o&&o!==e||("select"===r?(o=a.get("valueAllowUnset"),
h.u.ya(t,i,o),o||i===h.u.L(t)||h.v.K(f)):h.u.ya(t,i))},h.o(l,null,{l:t})
}else h.eb(t,{checkedValue:n})},update:function(){}
},h.m.va.value=!0,h.f.visible={update:function(e,t){
var n=h.a.c(t()),a="none"!=e.style.display
;n&&!a?e.style.display="":!n&&a&&(e.style.display="none")}},h.f.hidden={
update:function(e,t){h.f.visible.update(e,(function(){return!h.a.c(t())}))}
},function(e){h.f[e]={init:function(t,n,a,r,i){
return h.f.event.init.call(this,t,(function(){var t={};return t[e]=n(),t
}),a,r,i)}}
}("click"),h.ca=function(){},h.ca.prototype.renderTemplateSource=function(){
throw Error("Override renderTemplateSource")
},h.ca.prototype.createJavaScriptEvaluatorBlock=function(){
throw Error("Override createJavaScriptEvaluatorBlock")
},h.ca.prototype.makeTemplateSource=function(e,t){if("string"==typeof e){
var a=(t=t||n).getElementById(e)
;if(!a)throw Error("Cannot find template with ID "+e);return new h.B.D(a)}
if(1==e.nodeType||8==e.nodeType)return new h.B.ia(e)
;throw Error("Unknown template type: "+e)
},h.ca.prototype.renderTemplate=function(e,t,n,a){
return e=this.makeTemplateSource(e,a),this.renderTemplateSource(e,t,n,a)
},h.ca.prototype.isTemplateRewritten=function(e,t){
return!1===this.allowTemplateRewriting||this.makeTemplateSource(e,t).data("isRewritten")
},h.ca.prototype.rewriteTemplate=function(e,t,n){
t=t((e=this.makeTemplateSource(e,n)).text()),e.text(t),e.data("isRewritten",!0)
},h.b("templateEngine",h.ca),h.ic=function(){function e(e,t,n,a){e=h.m.Zb(e)
;for(var r=h.m.Ra,i=0;i<e.length;i++){var o=e[i].key
;if(Object.prototype.hasOwnProperty.call(r,o)){var u=r[o]
;if("function"==typeof u){if(o=u(e[i].value))throw Error(o)
}else if(!u)throw Error("This template engine does not support the '"+o+"' binding within its templates")
}}
return n="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+h.m.ub(e,{
valueAccessors:!0
})+" } })()},'"+n.toLowerCase()+"')",a.createJavaScriptEvaluatorBlock(n)+t}
var t=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,n=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g
;return{wd:function(e,t,n){
t.isTemplateRewritten(e,n)||t.rewriteTemplate(e,(function(e){return h.ic.Kd(e,t)
}),n)},Kd:function(a,r){return a.replace(t,(function(t,n,a,i,o){
return e(o,n,a,r)})).replace(n,(function(t,n){
return e(n,"\x3c!-- ko --\x3e","#comment",r)}))},ld:function(e,t){
return h.aa.Wb((function(n,a){var r=n.nextSibling
;r&&r.nodeName.toLowerCase()===t&&h.eb(r,e,a)}))}}
}(),h.b("__tr_ambtns",h.ic.ld),function(){h.B={},h.B.D=function(e){if(this.D=e){
var t=h.a.P(e)
;this.Db="script"===t?1:"textarea"===t?2:"template"==t&&e.content&&11===e.content.nodeType?3:4
}},h.B.D.prototype.text=function(){
var e=1===this.Db?"text":2===this.Db?"value":"innerHTML"
;if(0==arguments.length)return this.D[e];var t=arguments[0]
;"innerHTML"===e?h.a.dc(this.D,t):this.D[e]=t};var t=h.a.g.Z()+"_"
;h.B.D.prototype.data=function(e){
if(1===arguments.length)return h.a.g.get(this.D,t+e)
;h.a.g.set(this.D,t+e,arguments[1])};var n=h.a.g.Z()
;h.B.D.prototype.nodes=function(){var t=this.D;if(0==arguments.length){
var a=h.a.g.get(t,n)||{},r=a.jb||(3===this.Db?t.content:4===this.Db?t:e)
;return r&&!a.hd||(a=this.text())&&(r=h.a.Ld(a,t.ownerDocument),
this.text(""),h.a.g.set(t,n,{jb:r,hd:!0})),r}h.a.g.set(t,n,{jb:arguments[0]})
},h.B.ia=function(e){this.D=e
},h.B.ia.prototype=new h.B.D,h.B.ia.prototype.constructor=h.B.ia,
h.B.ia.prototype.text=function(){if(0==arguments.length){
var t=h.a.g.get(this.D,n)||{};return t.jc===e&&t.jb&&(t.jc=t.jb.innerHTML),t.jc}
h.a.g.set(this.D,n,{jc:arguments[0]})
},h.b("templateSources",h.B),h.b("templateSources.domElement",h.B.D),
h.b("templateSources.anonymousTemplate",h.B.ia)}(),function(){function t(e,t,n){
var a;for(t=h.h.nextSibling(t);e&&(a=e)!==t;)n(a,e=h.h.nextSibling(a))}
function n(e,n){if(e.length){
var a=e[0],r=e[e.length-1],i=a.parentNode,o=h.ga.instance,u=o.preprocessNode
;if(u){if(t(a,r,(function(e,t){var n=e.previousSibling,i=u.call(o,e)
;i&&(e===a&&(a=i[0]||t),e===r&&(r=i[i.length-1]||n))})),e.length=0,!a)return
;a===r?e.push(a):(e.push(a,r),h.a.Ua(e,i))}t(a,r,(function(e){
1!==e.nodeType&&8!==e.nodeType||h.uc(n,e)})),t(a,r,(function(e){
1!==e.nodeType&&8!==e.nodeType||h.aa.bd(e,[n])})),h.a.Ua(e,i)}}function a(e){
return e.nodeType?e:0<e.length?e[0]:null}function r(e,t,r,i,u){u=u||{}
;var c=(e&&a(e)||r||{}).ownerDocument,s=u.templateEngine||o
;if(h.ic.wd(r,s,c),"number"!=typeof(r=s.renderTemplate(r,i,u,c)).length||0<r.length&&"number"!=typeof r[0].nodeType)throw Error("Template engine must return an array of DOM nodes")
;switch(c=!1,t){case"replaceChildren":h.h.ua(e,r),c=!0;break;case"replaceNode":
h.a.Wc(e,r),c=!0;break;case"ignoreTargetNode":break;default:
throw Error("Unknown renderMode: "+t)}
return c&&(n(r,i),u.afterRender&&h.v.K(u.afterRender,null,[r,i[u.as||"$data"]]),
"replaceChildren"==t&&h.j.Ga(e,h.j.T)),r}function i(e,t,n){
return h.N(e)?e():"function"==typeof e?e(t,n):e}var o;h.ec=function(t){
if(t!=e&&!(t instanceof h.ca))throw Error("templateEngine must inherit from ko.templateEngine")
;o=t},h.bc=function(t,n,u,c,s){
if(((u=u||{}).templateEngine||o)==e)throw Error("Set a template engine before calling renderTemplate")
;if(s=s||"replaceChildren",c){var l=a(c);return h.$((function(){
var e=n&&n instanceof h.fa?n:new h.fa(n,null,null,null,{exportDependencies:!0
}),o=i(t,e.$data,e);e=r(c,s,o,e,u),"replaceNode"==s&&(l=a(c=e))}),null,{
Sa:function(){return!l||!h.a.Rb(l)},l:l&&"replaceNode"==s?l.parentNode:l})}
return h.aa.Wb((function(e){h.bc(t,n,u,e,"replaceNode")}))
},h.Pd=function(t,a,o,u,c){function s(e,t){
h.v.K(h.a.cc,null,[u,e,f,o,l,t]),h.j.Ga(u,h.j.T)}function l(e,t){
n(t,d),o.afterRender&&o.afterRender(t,e),d=null}function f(e,n){
d=c.createChildContext(e,{as:p,noChildContext:o.noChildContext,
extend:function(e){e.$index=n,p&&(e[p+"Index"]=n)}});var a=i(t,e,d)
;return r(u,"ignoreTargetNode",a,d,o)}
var d,p=o.as,b=!1===o.includeDestroyed||h.options.foreachHidesDestroyed&&!o.includeDestroyed
;if(b||o.beforeRemove||!h.Oc(a))return h.$((function(){var t=h.a.c(a)||[]
;void 0===t.length&&(t=[t]),b&&(t=h.a.fb(t,(function(t){
return t===e||null===t||!h.a.c(t._destroy)}))),s(t)}),null,{l:u});s(a.w())
;var v=a.subscribe((function(e){s(a(),e)}),null,"arrayChange");return v.l(u),v}
;var u=h.a.g.Z(),c=h.a.g.Z();h.f.template={init:function(e,t){var n=h.a.c(t())
;if("string"==typeof n||n.name)h.h.Ea(e);else if("nodes"in n){
if(n=n.nodes||[],h.N(n))throw Error('The "nodes" option must be a plain, non-observable array.')
;var a=n[0]&&n[0].parentNode;a&&h.a.g.get(a,c)||(a=h.a.Xb(n),h.a.g.set(a,c,!0)),
new h.B.ia(e).nodes(a)}else{
if(!(0<(n=h.h.childNodes(e)).length))throw Error("Anonymous template defined, but no template content was provided")
;a=h.a.Xb(n),new h.B.ia(e).nodes(a)}return{controlsDescendantBindings:!0}},
update:function(t,n,a,r,i){var o=n()
;a=!0,r=null,"string"==typeof(n=h.a.c(o))?n={}:(o=n.name,
"if"in n&&(a=h.a.c(n.if)),
a&&"ifnot"in n&&(a=!h.a.c(n.ifnot))),"foreach"in n?r=h.Pd(o||t,a&&n.foreach||[],n,t,i):a?(a=i,
"data"in n&&(a=i.createChildContext(n.data,{as:n.as,
noChildContext:n.noChildContext,exportDependencies:!0
})),r=h.bc(o||t,a,n,t)):h.h.Ea(t),
i=r,(n=h.a.g.get(t,u))&&"function"==typeof n.s&&n.s(),
h.a.g.set(t,u,!i||i.ja&&!i.ja()?e:i)}},h.m.Ra.template=function(e){
return 1==(e=h.m.Zb(e)).length&&e[0].unknown||h.m.Hd(e,"name")?null:"This template engine does not support anonymous templates nested within its templates"
},h.h.ea.template=!0
}(),h.b("setTemplateEngine",h.ec),h.b("renderTemplate",h.bc),
h.a.Jc=function(e,t,n){var a,r,i,o,u
;if(e.length&&t.length)for(a=r=0;(!n||a<n)&&(o=e[r]);++r){
for(i=0;u=t[i];++i)if(o.value===u.value){
o.moved=u.index,u.moved=o.index,t.splice(i,1),a=i=0;break}a+=i}
},h.a.Ob=function(){function e(e,t,n,a,r){
var i,o,u,c,s,l=Math.min,f=Math.max,d=[],p=e.length,b=t.length,v=b-p||1,g=p+b+1
;for(i=0;i<=p;i++)for(c=u,
d.push(u=[]),s=l(b,i+v),o=f(0,i-1);o<=s;o++)u[o]=o?i?e[i-1]===t[o-1]?c[o-1]:l(c[o]||g,u[o-1]||g)+1:o+1:i+1
;for(l=[],
f=[],v=[],i=p,o=b;i||o;)b=d[i][o]-1,o&&b===d[i][o-1]?f.push(l[l.length]={
status:n,value:t[--o],index:o}):i&&b===d[i-1][o]?v.push(l[l.length]={status:a,
value:e[--i],index:i}):(--o,--i,r.sparse||l.push({status:"retained",value:t[o]
}));return h.a.Jc(v,f,!r.dontLimitMoves&&10*p),l.reverse()}
return function(t,n,a){return a="boolean"==typeof a?{dontLimitMoves:a
}:a||{},n=n||[],
(t=t||[]).length<n.length?e(t,n,"added","deleted",a):e(n,t,"deleted","added",a)}
}(),h.b("utils.compareArrays",h.a.Ob),function(){function t(t,n,a,r,i){
var o=[],u=h.$((function(){var e=n(a,i,h.a.Ua(o,t))||[]
;0<o.length&&(h.a.Wc(o,e),r&&h.v.K(r,null,[a,e,i])),o.length=0,h.a.gb(o,e)
}),null,{l:t,Sa:function(){return!h.a.jd(o)}});return{Y:o,$:u.ja()?u:e}}
var n=h.a.g.Z(),a=h.a.g.Z();h.a.cc=function(r,i,o,u,c,s){function l(e){p={Aa:e,
nb:h.sa(C++)},w.push(p),y||D.push(p)}function f(e){
p=m[e],C!==p.nb.w()&&S.push(p),p.nb(C++),h.a.Ua(p.Y,r),w.push(p)}
function d(e,t){if(e)for(var n=0,a=t.length;n<a;n++)h.a.C(t[n].Y,(function(a){
e(a,n,t[n].Aa)}))}void 0===(i=i||[]).length&&(i=[i]),u=u||{}
;var p,b,v,g,m=h.a.g.get(r,n),y=!m,w=[],x=0,C=0,E=[],T=[],N=[],S=[],D=[],_=0
;if(y)h.a.C(i,l);else{if(!s||m&&m._countWaitingForRemove){
var A=h.a.Mb(m,(function(e){return e.Aa}));s=h.a.Ob(A,i,{
dontLimitMoves:u.dontLimitMoves,sparse:!0})}var B,j,O
;for(A=0;B=s[A];A++)switch(j=B.moved,O=B.index,B.status){case"deleted":
for(;x<O;)f(x++)
;j===e&&((p=m[x]).$&&(p.$.s(),p.$=e),h.a.Ua(p.Y,r).length&&(u.beforeRemove&&(w.push(p),
_++,p.Aa===a?p=null:N.push(p)),p&&E.push.apply(E,p.Y))),x++;break;case"added":
for(;C<O;)f(x++);j!==e?(T.push(w.length),f(j)):l(B.value)}
for(;C<i.length;)f(x++);w._countWaitingForRemove=_}
h.a.g.set(r,n,w),d(u.beforeMove,S),h.a.C(E,u.beforeRemove?h.na:h.removeNode)
;try{g=r.ownerDocument.activeElement}catch(k){}
if(T.length)for(;(A=T.shift())!=e;){
for(p=w[A],b=e;A;)if((v=w[--A].Y)&&v.length){b=v[v.length-1];break}
for(i=0;x=p.Y[i];b=x,i++)h.h.Vb(r,x,b)}for(A=0,T=h.h.firstChild(r);p=w[A];A++){
for(p.Y||h.a.extend(p,t(r,o,p.Aa,c,p.nb)),
i=0;x=p.Y[i];T=x.nextSibling,b=x,i++)x!==T&&h.h.Vb(r,x,b)
;!p.Dd&&c&&(c(p.Aa,p.Y,p.nb),p.Dd=!0,b=p.Y[p.Y.length-1])}
for(g&&r.ownerDocument.activeElement!=g&&g.focus(),
d(u.beforeRemove,N),A=0;A<N.length;++A)N[A].Aa=a
;d(u.afterMove,S),d(u.afterAdd,D)}
}(),h.b("utils.setDomNodeChildrenFromArrayMapping",h.a.cc),h.ba=function(){
this.allowTemplateRewriting=!1
},h.ba.prototype=new h.ca,h.ba.prototype.constructor=h.ba,
h.ba.prototype.renderTemplateSource=function(e,t,n,a){
return(t=9>h.a.W||!e.nodes?null:e.nodes())?h.a.la(t.cloneNode(!0).childNodes):(e=e.text(),
h.a.ta(e,a))
},h.ba.Na=new h.ba,h.ec(h.ba.Na),h.b("nativeTemplateEngine",h.ba),function(){
h.Za=function(){var e=this.Gd=function(){if(!r||!r.tmpl)return 0;try{
if(0<=r.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(e){}return 1
}();this.renderTemplateSource=function(t,a,i,o){
if(o=o||n,i=i||{},2>e)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.")
;var u=t.data("precompiled")
;return u||(u=t.text()||"",u=r.template(null,"{{ko_with $item.koBindingContext}}"+u+"{{/ko_with}}"),
t.data("precompiled",u)),t=[a.$data],a=r.extend({koBindingContext:a
},i.templateOptions),
(a=r.tmpl(u,t,a)).appendTo(o.createElement("div")),r.fragments={},a
},this.createJavaScriptEvaluatorBlock=function(e){
return"{{ko_code ((function() { return "+e+" })()) }}"
},this.addTemplate=function(e,t){
n.write("<script type='text/html' id='"+e+"'>"+t+"<\/script>")
},0<e&&(r.tmpl.tag.ko_code={open:"__.push($1 || '');"},r.tmpl.tag.ko_with={
open:"with($1) {",close:"} "})
},h.Za.prototype=new h.ca,h.Za.prototype.constructor=h.Za;var e=new h.Za
;0<e.Gd&&h.ec(e),h.b("jqueryTmplTemplateEngine",h.Za)}()}))}();