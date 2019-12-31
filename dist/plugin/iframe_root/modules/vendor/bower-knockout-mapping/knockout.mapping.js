/*!
 * Knockout Mapping plugin v2.6.0
 * (c) 2013 Steven Sanderson, Roy Jacobs - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
!function(e){"use strict"
;if("function"==typeof require&&"object"==typeof exports&&"object"==typeof module)e(require("knockout"),exports);else if("function"==typeof define&&define.amd)define(["knockout","exports"],e);else{
if("undefined"==typeof ko)throw new Error("Knockout is required, please ensure it is loaded before loading this mapping plug-in")
;e(ko,ko.mapping={})}}((function(e,r){"use strict";e.mapping=r
;var t,n,a=!0,i="__ko_mapping__",o=e.dependentObservable,u=0,s=["create","update","key","arrayChanged"],p={},l={
include:["_destroy"],ignore:[],copy:[],observe:[]},f=l;function c(){
for(var e,r,t,n=arguments,a=n.length,i={},o=[];a--;)for(e=(t=n[a]).length;e--;)i[r=t[e]]||(i[r]=1,
o.push(r));return o}function v(e,t){var n
;for(var a in t)if(t.hasOwnProperty(a)&&t[a])if(n=r.getType(e[a]),
a&&e[a]&&"array"!==n&&"string"!==n)v(e[a],t[a]);else{
var i="array"===r.getType(e[a])&&"array"===r.getType(t[a])
;e[a]=i?c(e[a],t[a]):t[a]}}function d(e,r){var t={};return v(t,e),v(t,r),t}
function b(e,r){for(var t=d({},e),n=s.length-1;n>=0;n--){var a=s[n]
;t[a]&&(t[""]instanceof Object||(t[""]={}),t[""][a]=t[a],delete t[a])}
return r&&(t.ignore=y(r.ignore,t.ignore),
t.include=y(r.include,t.include),t.copy=y(r.copy,t.copy),
t.observe=y(r.observe,t.observe)),
t.ignore=y(t.ignore,f.ignore),t.include=y(t.include,f.include),
t.copy=y(t.copy,f.copy),
t.observe=y(t.observe,f.observe),t.mappedProperties=t.mappedProperties||{},
t.copiedProperties=t.copiedProperties||{},t}function y(t,n){
return void 0===t?t=[]:"array"!==r.getType(t)&&(t=[t]),
void 0===n?n=[]:"array"!==r.getType(n)&&(n=[n]),
e.utils.arrayGetDistinctValues(t.concat(n))}function g(u,s,l,f,c,v,b){
var y="array"===r.getType(e.utils.unwrapObservable(s))
;if(v=v||"",r.isMapped(u)){var h=e.utils.unwrapObservable(u)[i];l=d(h,l)}var j={
data:s,parent:b||c},I=function(){return l[f]&&l[f].create instanceof Function
},E=function(r){return function(r,t){var n=e.dependentObservable
;e.dependentObservable=function(t,n,i){i=i||{},t&&"object"==typeof t&&(i=t)
;var u=i.deferEvaluation,s=i.pure,p=!1;i.deferEvaluation=!0;var l=o(t,n,i)
;return u||s||(l=function(t){var n=e.dependentObservable;e.dependentObservable=o
;var i=e.isWriteableObservable(t);e.dependentObservable=n;var u=o({
read:function(){
return p||(e.utils.arrayRemoveItem(r,t),p=!0),t.apply(t,arguments)},
write:i&&function(e){return t(e)},deferEvaluation:!0})
;return a&&(u._wrapper=!0),u.__DO=t,u}(l),r.push(l)),l
},e.dependentObservable.fn=o.fn,e.computed=e.dependentObservable;var i=t()
;return e.dependentObservable=n,e.computed=e.dependentObservable,i
}(t,(function(){return e.utils.unwrapObservable(c)instanceof Array?l[f].create({
data:r||j.data,parent:j.parent,skip:p}):l[f].create({data:r||j.data,
parent:j.parent})}))},P=function(){return l[f]&&l[f].update instanceof Function
},_=function(r,t){var n={data:t||j.data,parent:j.parent,
target:e.utils.unwrapObservable(r)}
;return e.isWriteableObservable(r)&&(n.observable=r),l[f].update(n)},J=n.get(s)
;if(J)return J;if(f=f||"",y){var W=[],D=!1,S=function(e){return e}
;l[f]&&l[f].key&&(S=l[f].key,
D=!0),e.isObservable(u)||((u=e.observableArray([])).mappedRemove=function(e){
var r="function"==typeof e?e:function(r){return r===S(e)}
;return u.remove((function(e){return r(S(e))}))},u.mappedRemoveAll=function(r){
var t=m(r,S);return u.remove((function(r){
return-1!==e.utils.arrayIndexOf(t,S(r))}))},u.mappedDestroy=function(e){
var r="function"==typeof e?e:function(r){return r===S(e)}
;return u.destroy((function(e){return r(S(e))}))
},u.mappedDestroyAll=function(r){var t=m(r,S);return u.destroy((function(r){
return-1!==e.utils.arrayIndexOf(t,S(r))}))},u.mappedIndexOf=function(r){
var t=m(u(),S),n=S(r);return e.utils.arrayIndexOf(t,n)},u.mappedGet=function(e){
return u()[u.mappedIndexOf(e)]},u.mappedCreate=function(r){
if(-1!==u.mappedIndexOf(r))throw new Error("There already is an object with the key that you specified.")
;var t=I()?E(r):r;if(P()){var n=_(t,r);e.isWriteableObservable(t)?t(n):t=n}
return u.push(t),t});var A=m(e.utils.unwrapObservable(u),S).sort(),N=m(s,S)
;D&&N.sort()
;var M,C,q,F=e.utils.compareArrays(A,N),R={},$=e.utils.unwrapObservable(s),G={},K=!0
;for(M=0,C=$.length;M<C;M++){if(void 0===(q=S($[M]))||q instanceof Object){K=!1
;break}G[q]=$[M]}var V,z,B=[],H=0;for(M=0,C=F.length;M<C;M++){var L;q=F[M]
;var Q=v+"["+x(M)+"]";switch(q.status){case"added":
L=g(void 0,V=K?G[q.value]:w(e.utils.unwrapObservable(s),q.value,S),l,f,u,Q,c),
I()||(L=e.utils.unwrapObservable(L)),
z=O(e.utils.unwrapObservable(s),V,R),L===p?H++:B[z-H]=L,R[z]=!0;break
;case"retained":
V=K?G[q.value]:w(e.utils.unwrapObservable(s),q.value,S),g(L=w(u,q.value,S),V,l,f,u,Q,c),
B[z=O(e.utils.unwrapObservable(s),V,R)]=L,R[z]=!0;break;case"deleted":
L=w(u,q.value,S)}W.push({event:q.status,item:L})}
u(B),l[f]&&l[f].arrayChanged&&e.utils.arrayForEach(W,(function(e){
l[f].arrayChanged(e.event,e.item)}))}else if(T(s)){
if(!(u=e.utils.unwrapObservable(u))){if(I()){var U=E();return P()&&(U=_(U)),U}
if(P())return _();u={}}if(P()&&(u=_(u)),n.save(s,u),P())return u
;k(s,(function(t){var a=v.length?v+"."+x(t):x(t)
;if(-1===e.utils.arrayIndexOf(l.ignore,a))if(-1===e.utils.arrayIndexOf(l.copy,a)){
if("object"!=typeof s[t]&&"array"!==r.getType(s[t])&&l.observe.length>0&&-1===e.utils.arrayIndexOf(l.observe,a))return u[t]=s[t],
void(l.copiedProperties[a]=!0);var i=n.get(s[t]),o=g(u[t],s[t],l,t,u,a,u),p=i||o
;if(l.observe.length>0&&-1===e.utils.arrayIndexOf(l.observe,a))return u[t]=e.utils.unwrapObservable(p),
void(l.copiedProperties[a]=!0)
;e.isWriteableObservable(u[t])?(p=e.utils.unwrapObservable(p),
u[t]()!==p&&u[t](p)):(p=void 0===u[t]?p:e.utils.unwrapObservable(p),
u[t]=p),l.mappedProperties[a]=!0}else u[t]=s[t]}))}else switch(r.getType(s)){
case"function":P()?e.isWriteableObservable(s)?(s(_(s)),u=s):u=_(s):u=s;break
;default:var X
;if(e.isWriteableObservable(u))return P()?(X=_(u),u(X),X):(X=e.utils.unwrapObservable(s),
u(X),X);var Y=I()||P()
;if(u=I()?E():e.observable(e.utils.unwrapObservable(s)),P()&&u(_(u)),Y)return u}
return u}function O(e,r,t){
for(var n=0,a=e.length;n<a;n++)if(!0!==t[n]&&e[n]===r)return n;return null}
function h(t,n){var a
;return n&&(a=n(t)),"undefined"===r.getType(a)&&(a=t),e.utils.unwrapObservable(a)
}function w(r,t,n){
for(var a=0,i=(r=e.utils.unwrapObservable(r)).length;a<i;a++){var o=r[a]
;if(h(o,n)===t)return o}
throw new Error("When calling ko.update*, the key '"+t+"' was not found!")}
function m(r,t){
return e.utils.arrayMap(e.utils.unwrapObservable(r),(function(e){
return t?h(e,t):e}))}function k(e,t){
if("array"===r.getType(e))for(var n=0;n<e.length;n++)t(n);else for(var a in e)e.hasOwnProperty(a)&&t(a)
}function T(e){if(null===e)return!1;var t=r.getType(e)
;return"object"===t||"array"===t}function x(e){
return(""+e).replace(/~/g,"~~").replace(/\[/g,"~[").replace(/]/g,"~]").replace(/\./g,"~.")
}function j(){var r=[],t=[];this.save=function(n,a){
var i=e.utils.arrayIndexOf(r,n);i>=0?t[i]=a:(r.push(n),t.push(a))
},this.get=function(n){var a=e.utils.arrayIndexOf(r,n);return a>=0?t[a]:void 0}}
function I(){var e={},r=function(r){var t;try{t=r}catch(a){t="$$$"}var n=e[t]
;return e.hasOwnProperty(t)||(n=new j,e[t]=n),n};this.save=function(e,t){
r(e).save(e,t)},this.get=function(e){return r(e).get(e)}}r.isMapped=function(r){
var t=e.utils.unwrapObservable(r);return t&&t[i]},r.fromJS=function(e){
if(0===arguments.length)throw new Error("When calling ko.fromJS, pass the object you want to convert.")
;try{var r,a
;u||(t=[],n=new I),u++,2===arguments.length&&(arguments[1][i]?a=arguments[1]:r=arguments[1]),
3===arguments.length&&(r=arguments[1],a=arguments[2]),a&&(r=d(r,a[i]))
;var o=g(a,e,r=b(r));if(a&&(o=a),!--u)for(;t.length;){var s=t.pop()
;s&&(s(),s.__DO.throttleEvaluation=s.throttleEvaluation)}return o[i]=d(o[i],r),o
}catch(p){throw u=0,p}},r.fromJSON=function(t){
var n=Array.prototype.slice.call(arguments,0)
;return n[0]=e.utils.parseJson(t),r.fromJS.apply(this,n)},r.toJS=function(t,n){
if(f||r.resetDefaultOptions(),
0===arguments.length)throw new Error("When calling ko.mapping.toJS, pass the object you want to convert.")
;if("array"!==r.getType(f.ignore))throw new Error("ko.mapping.defaultOptions().ignore should be an array.")
;if("array"!==r.getType(f.include))throw new Error("ko.mapping.defaultOptions().include should be an array.")
;if("array"!==r.getType(f.copy))throw new Error("ko.mapping.defaultOptions().copy should be an array.")
;return n=b(n,t[i]),r.visitModel(t,(function(r){
return e.utils.unwrapObservable(r)}),n)},r.toJSON=function(t,n,a,i){
var o=r.toJS(t,n);return e.utils.stringifyJson(o,a,i)
},r.defaultOptions=function(){if(!(arguments.length>0))return f;f=arguments[0]},
r.resetDefaultOptions=function(){f={include:l.include.slice(0),
ignore:l.ignore.slice(0),copy:l.copy.slice(0),observe:l.observe.slice(0)}
},r.getType=function(e){if(e&&"object"==typeof e){
if(e.constructor===Date)return"date";if(e.constructor===Array)return"array"}
return typeof e},r.visitModel=function(t,n,a){var o
;(a=a||{}).visitedObjects=a.visitedObjects||new I
;var u=e.utils.unwrapObservable(t);if(!T(u))return n(t,a.parentName)
;a=b(a,u[i]),
n(t,a.parentName),o="array"===r.getType(u)?[]:{},a.visitedObjects.save(t,o)
;var s=a.parentName;return k(u,(function(t){var p=x(t)
;if(!a.ignore||-1===e.utils.arrayIndexOf(a.ignore,p)){var l=u[t]
;if(a.parentName=function(e,t,n){var a=e||""
;return"array"===r.getType(t)?e&&(a+="["+x(n)+"]"):(e&&(a+="."),a+=x(n)),a
}(s,u,t),
-1===e.utils.arrayIndexOf(a.copy,p)&&-1===e.utils.arrayIndexOf(a.include,p)){
var f=u[i];if(f){var c=f.mappedProperties;if(c&&!c[p]){var v=f.copiedProperties
;if(v&&!v[p]&&"array"!==r.getType(u))return}}}
switch(r.getType(e.utils.unwrapObservable(l))){case"object":case"array":
case"undefined":var d=a.visitedObjects.get(l)
;o[t]="undefined"!==r.getType(d)?d:r.visitModel(l,n,a);break;default:
o[t]=n(l,a.parentName)}}})),o}}));