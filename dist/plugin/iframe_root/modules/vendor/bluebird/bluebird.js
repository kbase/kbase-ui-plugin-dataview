/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2018 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */
!function(t){
if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{
var e
;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),
e.Promise=t()}}((function(){var t,e,n;return function t(e,n,r){function i(s,a){
if(!n[s]){if(!e[s]){var c="function"==typeof _dereq_&&_dereq_
;if(!a&&c)return c(s,!0);if(o)return o(s,!0)
;var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l
}var u=n[s]={exports:{}};e[s][0].call(u.exports,(function(t){var n=e[s][1][t]
;return i(n||t)}),u,u.exports,t,e,n,r)}return n[s].exports}
for(var o="function"==typeof _dereq_&&_dereq_,s=0;s<r.length;s++)i(r[s])
;return i}({1:[function(t,e,n){"use strict";e.exports=function(t){
var e=t._SomePromiseArray;function n(t){var n=new e(t),r=n.promise()
;return n.setHowMany(1),n.setUnwrap(),n.init(),r}t.any=function(t){return n(t)},
t.prototype.any=function(){return n(this)}}},{}],2:[function(t,e,n){"use strict"
;var r;try{throw new Error}catch(f){r=f}
var i=t("./schedule"),o=t("./queue"),s=t("./util");function a(){
this._customScheduler=!1,
this._isTickUsed=!1,this._lateQueue=new o(16),this._normalQueue=new o(16),
this._haveDrainedQueues=!1,this._trampolineEnabled=!0;var t=this
;this.drainQueues=function(){t._drainQueues()},this._schedule=i}
function c(t,e,n){this._lateQueue.push(t,e,n),this._queueTick()}
function l(t,e,n){this._normalQueue.push(t,e,n),this._queueTick()}function u(t){
this._normalQueue._pushOne(t),this._queueTick()}function p(t){
for(;t.length()>0;)h(t)}function h(t){var e=t.shift()
;if("function"!=typeof e)e._settlePromises();else{var n=t.shift(),r=t.shift()
;e.call(n,r)}}a.prototype.setScheduler=function(t){var e=this._schedule
;return this._schedule=t,this._customScheduler=!0,e
},a.prototype.hasCustomScheduler=function(){return this._customScheduler
},a.prototype.enableTrampoline=function(){this._trampolineEnabled=!0
},a.prototype.disableTrampolineIfNecessary=function(){
s.hasDevTools&&(this._trampolineEnabled=!1)
},a.prototype.haveItemsQueued=function(){
return this._isTickUsed||this._haveDrainedQueues
},a.prototype.fatalError=function(t,e){
e?(process.stderr.write("Fatal "+(t instanceof Error?t.stack:t)+"\n"),
process.exit(2)):this.throwLater(t)},a.prototype.throwLater=function(t,e){
if(1===arguments.length&&(e=t,t=function(){throw e
}),"undefined"!=typeof setTimeout)setTimeout((function(){t(e)}),0);else try{
this._schedule((function(){t(e)}))}catch(f){
throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")
}},s.hasDevTools?(a.prototype.invokeLater=function(t,e,n){
this._trampolineEnabled?c.call(this,t,e,n):this._schedule((function(){
setTimeout((function(){t.call(e,n)}),100)}))
},a.prototype.invoke=function(t,e,n){
this._trampolineEnabled?l.call(this,t,e,n):this._schedule((function(){
t.call(e,n)}))},a.prototype.settlePromises=function(t){
this._trampolineEnabled?u.call(this,t):this._schedule((function(){
t._settlePromises()}))
}):(a.prototype.invokeLater=c,a.prototype.invoke=l,a.prototype.settlePromises=u),
a.prototype._drainQueues=function(){
p(this._normalQueue),this._reset(),this._haveDrainedQueues=!0,p(this._lateQueue)
},a.prototype._queueTick=function(){
this._isTickUsed||(this._isTickUsed=!0,this._schedule(this.drainQueues))
},a.prototype._reset=function(){this._isTickUsed=!1
},e.exports=a,e.exports.firstLineError=r},{"./queue":26,"./schedule":29,
"./util":36}],3:[function(t,e,n){"use strict";e.exports=function(t,e,n,r){
var i=!1,o=function(t,e){this._reject(e)},s=function(t,e){
e.promiseRejectionQueued=!0,e.bindingPromise._then(o,o,null,this,t)
},a=function(t,e){0==(50397184&this._bitField)&&this._resolveCallback(e.target)
},c=function(t,e){e.promiseRejectionQueued||this._reject(t)}
;t.prototype.bind=function(o){
i||(i=!0,t.prototype._propagateFrom=r.propagateFromFunction(),
t.prototype._boundValue=r.boundValueFunction());var l=n(o),u=new t(e)
;u._propagateFrom(this,1);var p=this._target()
;if(u._setBoundTo(l),l instanceof t){var h={promiseRejectionQueued:!1,promise:u,
target:p,bindingPromise:l}
;p._then(e,s,void 0,u,h),l._then(a,c,void 0,u,h),u._setOnCancel(l)
}else u._resolveCallback(p);return u},t.prototype._setBoundTo=function(t){
void 0!==t?(this._bitField=2097152|this._bitField,
this._boundTo=t):this._bitField=-2097153&this._bitField
},t.prototype._isBound=function(){return 2097152==(2097152&this._bitField)
},t.bind=function(e,n){return t.resolve(n).bind(e)}}},{}],4:[function(t,e,n){
"use strict";var r;"undefined"!=typeof Promise&&(r=Promise)
;var i=t("./promise")();i.noConflict=function(){try{Promise===i&&(Promise=r)
}catch(t){}return i},e.exports=i},{"./promise":22}],5:[function(t,e,n){
"use strict";var r=Object.create;if(r){var i=r(null),o=r(null)
;i[" size"]=o[" size"]=0}e.exports=function(e){
var n,r=t("./util"),i=r.canEvaluate;r.isIdentifier;function o(t,n){var i
;if(null!=t&&(i=t[n]),"function"!=typeof i){
var o="Object "+r.classString(t)+" has no method '"+r.toString(n)+"'"
;throw new e.TypeError(o)}return i}function s(t){
return o(t,this.pop()).apply(t,this)}function a(t){return t[this]}function c(t){
var e=+this;return e<0&&(e=Math.max(0,e+t.length)),t[e]}
e.prototype.call=function(t){var e=[].slice.call(arguments,1)
;return e.push(t),this._then(s,void 0,void 0,e,void 0)
},e.prototype.get=function(t){var e;if("number"==typeof t)e=c;else if(i){
var r=n(t);e=null!==r?r:a}else e=a;return this._then(e,void 0,void 0,t,void 0)}}
},{"./util":36}],6:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){
var o=t("./util"),s=o.tryCatch,a=o.errorObj,c=e._async
;e.prototype.break=e.prototype.cancel=function(){
if(!i.cancellation())return this._warn("cancellation is disabled")
;for(var t=this,e=t;t._isCancellable();){if(!t._cancelBy(e)){
e._isFollowing()?e._followee().cancel():e._cancelBranched();break}
var n=t._cancellationParent;if(null==n||!n._isCancellable()){
t._isFollowing()?t._followee().cancel():t._cancelBranched();break}
t._isFollowing()&&t._followee().cancel(),t._setWillBeCancelled(),e=t,t=n}
},e.prototype._branchHasCancelled=function(){this._branchesRemainingToCancel--},
e.prototype._enoughBranchesHaveCancelled=function(){
return void 0===this._branchesRemainingToCancel||this._branchesRemainingToCancel<=0
},e.prototype._cancelBy=function(t){
return t===this?(this._branchesRemainingToCancel=0,
this._invokeOnCancel(),!0):(this._branchHasCancelled(),
!!this._enoughBranchesHaveCancelled()&&(this._invokeOnCancel(),!0))
},e.prototype._cancelBranched=function(){
this._enoughBranchesHaveCancelled()&&this._cancel()
},e.prototype._cancel=function(){
this._isCancellable()&&(this._setCancelled(),c.invoke(this._cancelPromises,this,void 0))
},e.prototype._cancelPromises=function(){
this._length()>0&&this._settlePromises()},e.prototype._unsetOnCancel=function(){
this._onCancelField=void 0},e.prototype._isCancellable=function(){
return this.isPending()&&!this._isCancelled()
},e.prototype.isCancellable=function(){
return this.isPending()&&!this.isCancelled()
},e.prototype._doInvokeOnCancel=function(t,e){
if(o.isArray(t))for(var n=0;n<t.length;++n)this._doInvokeOnCancel(t[n],e);else if(void 0!==t)if("function"==typeof t){
if(!e){var r=s(t).call(this._boundValue())
;r===a&&(this._attachExtraTrace(r.e),c.throwLater(r.e))}
}else t._resultCancelled(this)},e.prototype._invokeOnCancel=function(){
var t=this._onCancel()
;this._unsetOnCancel(),c.invoke(this._doInvokeOnCancel,this,t)
},e.prototype._invokeInternalOnCancel=function(){
this._isCancellable()&&(this._doInvokeOnCancel(this._onCancel(),!0),
this._unsetOnCancel())},e.prototype._resultCancelled=function(){this.cancel()}}
},{"./util":36}],7:[function(t,e,n){"use strict";e.exports=function(e){
var n=t("./util"),r=t("./es5").keys,i=n.tryCatch,o=n.errorObj
;return function(t,s,a){return function(c){var l=a._boundValue()
;t:for(var u=0;u<t.length;++u){var p=t[u]
;if(p===Error||null!=p&&p.prototype instanceof Error){
if(c instanceof p)return i(s).call(l,c)}else if("function"==typeof p){
var h=i(p).call(l,c);if(h===o)return h;if(h)return i(s).call(l,c)
}else if(n.isObject(c)){for(var f=r(p),_=0;_<f.length;++_){var d=f[_]
;if(p[d]!=c[d])continue t}return i(s).call(l,c)}}return e}}}},{"./es5":13,
"./util":36}],8:[function(t,e,n){"use strict";e.exports=function(t){
var e=!1,n=[];function r(){this._trace=new r.CapturedTrace(i())}function i(){
var t=n.length-1;if(t>=0)return n[t]}
return t.prototype._promiseCreated=function(){},
t.prototype._pushContext=function(){},t.prototype._popContext=function(){
return null
},t._peekContext=t.prototype._peekContext=function(){},r.prototype._pushContext=function(){
void 0!==this._trace&&(this._trace._promiseCreated=null,n.push(this._trace))
},r.prototype._popContext=function(){if(void 0!==this._trace){
var t=n.pop(),e=t._promiseCreated;return t._promiseCreated=null,e}return null
},r.CapturedTrace=null,r.create=function(){if(e)return new r
},r.deactivateLongStackTraces=function(){},r.activateLongStackTraces=function(){
var n=t.prototype._pushContext,o=t.prototype._popContext,s=t._peekContext,a=t.prototype._peekContext,c=t.prototype._promiseCreated
;r.deactivateLongStackTraces=function(){
t.prototype._pushContext=n,t.prototype._popContext=o,
t._peekContext=s,t.prototype._peekContext=a,t.prototype._promiseCreated=c,e=!1},
e=!0,
t.prototype._pushContext=r.prototype._pushContext,t.prototype._popContext=r.prototype._popContext,
t._peekContext=t.prototype._peekContext=i,
t.prototype._promiseCreated=function(){var t=this._peekContext()
;t&&null==t._promiseCreated&&(t._promiseCreated=this)}},r}},{}],
9:[function(t,e,n){"use strict";e.exports=function(e,n){
var r,i,o,s=e._getDomain,a=e._async,c=t("./errors").Warning,l=t("./util"),u=t("./es5"),p=l.canAttachTrace,h=/[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/,f=/\((?:timers\.js):\d+:\d+\)/,_=/[\/<\(](.+?):(\d+):(\d+)\)?\s*$/,d=null,v=null,y=!1,m=!(0==l.env("BLUEBIRD_DEBUG")),g=!(0==l.env("BLUEBIRD_WARNINGS")||!m&&!l.env("BLUEBIRD_WARNINGS")),b=!(0==l.env("BLUEBIRD_LONG_STACK_TRACES")||!m&&!l.env("BLUEBIRD_LONG_STACK_TRACES")),w=0!=l.env("BLUEBIRD_W_FORGOTTEN_RETURN")&&(g||!!l.env("BLUEBIRD_W_FORGOTTEN_RETURN"))
;e.prototype.suppressUnhandledRejections=function(){var t=this._target()
;t._bitField=-1048577&t._bitField|524288
},e.prototype._ensurePossibleRejectionHandled=function(){
if(0==(524288&this._bitField)){this._setRejectionIsUnhandled();var t=this
;setTimeout((function(){t._notifyUnhandledRejection()}),1)}
},e.prototype._notifyUnhandledRejectionIsHandled=function(){
$("rejectionHandled",r,void 0,this)
},e.prototype._setReturnedNonUndefined=function(){
this._bitField=268435456|this._bitField
},e.prototype._returnedNonUndefined=function(){
return 0!=(268435456&this._bitField)
},e.prototype._notifyUnhandledRejection=function(){
if(this._isRejectionUnhandled()){var t=this._settledValue()
;this._setUnhandledRejectionIsNotified(),$("unhandledRejection",i,t,this)}
},e.prototype._setUnhandledRejectionIsNotified=function(){
this._bitField=262144|this._bitField
},e.prototype._unsetUnhandledRejectionIsNotified=function(){
this._bitField=-262145&this._bitField
},e.prototype._isUnhandledRejectionNotified=function(){
return(262144&this._bitField)>0
},e.prototype._setRejectionIsUnhandled=function(){
this._bitField=1048576|this._bitField
},e.prototype._unsetRejectionIsUnhandled=function(){
this._bitField=-1048577&this._bitField,
this._isUnhandledRejectionNotified()&&(this._unsetUnhandledRejectionIsNotified(),
this._notifyUnhandledRejectionIsHandled())
},e.prototype._isRejectionUnhandled=function(){return(1048576&this._bitField)>0
},e.prototype._warn=function(t,e,n){return U(t,e,n||this)
},e.onPossiblyUnhandledRejection=function(t){var e=s()
;i="function"==typeof t?null===e?t:l.domainBind(e,t):void 0
},e.onUnhandledRejectionHandled=function(t){var e=s()
;r="function"==typeof t?null===e?t:l.domainBind(e,t):void 0};var C=function(){}
;e.longStackTraces=function(){
if(a.haveItemsQueued()&&!Y.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n")
;if(!Y.longStackTraces&&z()){
var t=e.prototype._captureStackTrace,r=e.prototype._attachExtraTrace,i=e.prototype._dereferenceTrace
;Y.longStackTraces=!0,C=function(){
if(a.haveItemsQueued()&&!Y.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n")
;e.prototype._captureStackTrace=t,
e.prototype._attachExtraTrace=r,e.prototype._dereferenceTrace=i,
n.deactivateLongStackTraces(),a.enableTrampoline(),Y.longStackTraces=!1
},e.prototype._captureStackTrace=L,
e.prototype._attachExtraTrace=H,e.prototype._dereferenceTrace=N,
n.activateLongStackTraces(),a.disableTrampolineIfNecessary()}
},e.hasLongStackTraces=function(){return Y.longStackTraces&&z()}
;var j=function(){try{if("function"==typeof CustomEvent){
var t=new CustomEvent("CustomEvent")
;return l.global.dispatchEvent(t),function(t,e){var n={detail:e,cancelable:!0}
;u.defineProperty(n,"promise",{value:e.promise}),u.defineProperty(n,"reason",{
value:e.reason});var r=new CustomEvent(t.toLowerCase(),n)
;return!l.global.dispatchEvent(r)}}if("function"==typeof Event){
t=new Event("CustomEvent");return l.global.dispatchEvent(t),function(t,e){
var n=new Event(t.toLowerCase(),{cancelable:!0})
;return n.detail=e,u.defineProperty(n,"promise",{value:e.promise
}),u.defineProperty(n,"reason",{value:e.reason}),!l.global.dispatchEvent(n)}}
return(t=document.createEvent("CustomEvent")).initCustomEvent("testingtheevent",!1,!0,{}),
l.global.dispatchEvent(t),function(t,e){
var n=document.createEvent("CustomEvent")
;return n.initCustomEvent(t.toLowerCase(),!1,!0,e),!l.global.dispatchEvent(n)}
}catch(e){}return function(){return!1}}(),E=l.isNode?function(){
return process.emit.apply(process,arguments)}:l.global?function(t){
var e="on"+t.toLowerCase(),n=l.global[e]
;return!!n&&(n.apply(l.global,[].slice.call(arguments,1)),!0)}:function(){
return!1};function k(t,e){return{promise:e}}var F={promiseCreated:k,
promiseFulfilled:k,promiseRejected:k,promiseResolved:k,promiseCancelled:k,
promiseChained:function(t,e,n){return{promise:e,child:n}},warning:function(t,e){
return{warning:e}},unhandledRejection:function(t,e,n){return{reason:e,promise:n}
},rejectionHandled:k},T=function(t){var e=!1;try{e=E.apply(null,arguments)
}catch(r){a.throwLater(r),e=!0}var n=!1;try{n=j(t,F[t].apply(null,arguments))
}catch(r){a.throwLater(r),n=!0}return n||e};function x(){return!1}
function P(t,e,n){var r=this;try{t(e,n,(function(t){
if("function"!=typeof t)throw new TypeError("onCancel must be a function, got: "+l.toString(t))
;r._attachCancellationCallback(t)}))}catch(i){return i}}function R(t){
if(!this._isCancellable())return this;var e=this._onCancel()
;void 0!==e?l.isArray(e)?e.push(t):this._setOnCancel([e,t]):this._setOnCancel(t)
}function S(){return this._onCancelField}function O(t){this._onCancelField=t}
function A(){this._cancellationParent=void 0,this._onCancelField=void 0}
function D(t,e){if(0!=(1&e)){this._cancellationParent=t
;var n=t._branchesRemainingToCancel
;void 0===n&&(n=0),t._branchesRemainingToCancel=n+1}
0!=(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo)}e.config=function(t){
if("longStackTraces"in(t=Object(t))&&(t.longStackTraces?e.longStackTraces():!t.longStackTraces&&e.hasLongStackTraces()&&C()),
"warnings"in t){var n=t.warnings
;Y.warnings=!!n,w=Y.warnings,l.isObject(n)&&"wForgottenReturn"in n&&(w=!!n.wForgottenReturn)
}if("cancellation"in t&&t.cancellation&&!Y.cancellation){
if(a.haveItemsQueued())throw new Error("cannot enable cancellation after promises are in use")
;e.prototype._clearCancellationData=A,
e.prototype._propagateFrom=D,e.prototype._onCancel=S,e.prototype._setOnCancel=O,
e.prototype._attachCancellationCallback=R,
e.prototype._execute=P,V=D,Y.cancellation=!0}
return"monitoring"in t&&(t.monitoring&&!Y.monitoring?(Y.monitoring=!0,
e.prototype._fireEvent=T):!t.monitoring&&Y.monitoring&&(Y.monitoring=!1,
e.prototype._fireEvent=x)),e
},e.prototype._fireEvent=x,e.prototype._execute=function(t,e,n){try{t(e,n)
}catch(r){return r}
},e.prototype._onCancel=function(){},e.prototype._setOnCancel=function(t){},
e.prototype._attachCancellationCallback=function(t){},
e.prototype._captureStackTrace=function(){},
e.prototype._attachExtraTrace=function(){},
e.prototype._dereferenceTrace=function(){},
e.prototype._clearCancellationData=function(){},
e.prototype._propagateFrom=function(t,e){};var V=function(t,e){
0!=(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo)};function I(){
var t=this._boundTo
;return void 0!==t&&t instanceof e?t.isFulfilled()?t.value():void 0:t}
function L(){this._trace=new K(this._peekContext())}function H(t,e){if(p(t)){
var n=this._trace
;if(void 0!==n&&e&&(n=n._parent),void 0!==n)n.attachExtraTrace(t);else if(!t.__stackCleaned__){
var r=M(t)
;l.notEnumerableProp(t,"stack",r.message+"\n"+r.stack.join("\n")),l.notEnumerableProp(t,"__stackCleaned__",!0)
}}}function N(){this._trace=void 0}function U(t,n,r){if(Y.warnings){
var i,o=new c(t)
;if(n)r._attachExtraTrace(o);else if(Y.longStackTraces&&(i=e._peekContext()))i.attachExtraTrace(o);else{
var s=M(o);o.stack=s.message+"\n"+s.stack.join("\n")}T("warning",o)||q(o,"",!0)}
}function B(t){for(var e=[],n=0;n<t.length;++n){
var r=t[n],i="    (No stack trace)"===r||d.test(r),o=i&&G(r)
;i&&!o&&(y&&" "!==r.charAt(0)&&(r="    "+r),e.push(r))}return e}function M(t){
var e=t.stack,n=t.toString()
;return e="string"==typeof e&&e.length>0?function(t){
for(var e=t.stack.replace(/\s+$/g,"").split("\n"),n=0;n<e.length;++n){var r=e[n]
;if("    (No stack trace)"===r||d.test(r))break}
return n>0&&"SyntaxError"!=t.name&&(e=e.slice(n)),e
}(t):["    (No stack trace)"],{message:n,stack:"SyntaxError"==t.name?e:B(e)}}
function q(t,e,n){if("undefined"!=typeof console){var r;if(l.isObject(t)){
var i=t.stack;r=e+v(i,t)}else r=e+String(t)
;"function"==typeof o?o(r,n):"function"!=typeof console.log&&"object"!=typeof console.log||console.log(r)
}}function $(t,e,n,r){var i=!1;try{
"function"==typeof e&&(i=!0,"rejectionHandled"===t?e(r):e(n,r))}catch(o){
a.throwLater(o)}
"unhandledRejection"===t?T(t,n,r)||i||q(n,"Unhandled rejection "):T(t,r)}
function Q(t){var e
;if("function"==typeof t)e="[function "+(t.name||"anonymous")+"]";else{
e=t&&"function"==typeof t.toString?t.toString():l.toString(t)
;if(/\[object [a-zA-Z0-9$_]+\]/.test(e))try{e=JSON.stringify(t)}catch(n){}
0===e.length&&(e="(empty array)")}return"(<"+function(t){if(t.length<41)return t
;return t.substr(0,38)+"..."}(e)+">, no stack trace)"}function z(){
return"function"==typeof J}var G=function(){return!1
},X=/[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;function W(t){var e=t.match(X)
;if(e)return{fileName:e[1],line:parseInt(e[2],10)}}function K(t){this._parent=t,
this._promisesCreated=0;var e=this._length=1+(void 0===t?0:t._length);J(this,K),
e>32&&this.uncycle()}
l.inherits(K,Error),n.CapturedTrace=K,K.prototype.uncycle=function(){
var t=this._length;if(!(t<2)){
for(var e=[],n={},r=0,i=this;void 0!==i;++r)e.push(i),i=i._parent
;for(r=(t=this._length=r)-1;r>=0;--r){var o=e[r].stack;void 0===n[o]&&(n[o]=r)}
for(r=0;r<t;++r){var s=n[e[r].stack];if(void 0!==s&&s!==r){
s>0&&(e[s-1]._parent=void 0,e[s-1]._length=1),e[r]._parent=void 0,e[r]._length=1
;var a=r>0?e[r-1]:this
;s<t-1?(a._parent=e[s+1],a._parent.uncycle(),a._length=a._parent._length+1):(a._parent=void 0,
a._length=1);for(var c=a._length+1,l=r-2;l>=0;--l)e[l]._length=c,c++;return}}}},
K.prototype.attachExtraTrace=function(t){if(!t.__stackCleaned__){this.uncycle()
;for(var e=M(t),n=e.message,r=[e.stack],i=this;void 0!==i;)r.push(B(i.stack.split("\n"))),
i=i._parent;!function(t){for(var e=t[0],n=1;n<t.length;++n){
for(var r=t[n],i=e.length-1,o=e[i],s=-1,a=r.length-1;a>=0;--a)if(r[a]===o){s=a
;break}for(a=s;a>=0;--a){var c=r[a];if(e[i]!==c)break;e.pop(),i--}e=r}
}(r),function(t){
for(var e=0;e<t.length;++e)(0===t[e].length||e+1<t.length&&t[e][0]===t[e+1][0])&&(t.splice(e,1),
e--)}(r),l.notEnumerableProp(t,"stack",function(t,e){
for(var n=0;n<e.length-1;++n)e[n].push("From previous event:"),
e[n]=e[n].join("\n")
;return n<e.length&&(e[n]=e[n].join("\n")),t+"\n"+e.join("\n")
}(n,r)),l.notEnumerableProp(t,"__stackCleaned__",!0)}};var J=function(){
var t=/^\s*at\s*/,e=function(t,e){
return"string"==typeof t?t:void 0!==e.name&&void 0!==e.message?e.toString():Q(e)
}
;if("number"==typeof Error.stackTraceLimit&&"function"==typeof Error.captureStackTrace){
Error.stackTraceLimit+=6,d=t,v=e;var n=Error.captureStackTrace
;return G=function(t){return h.test(t)},function(t,e){
Error.stackTraceLimit+=6,n(t,e),Error.stackTraceLimit-=6}}var r,i=new Error
;if("string"==typeof i.stack&&i.stack.split("\n")[0].indexOf("stackDetection@")>=0)return d=/@/,
v=e,y=!0,function(t){t.stack=(new Error).stack};try{throw new Error}catch(o){
r="stack"in o}
return"stack"in i||!r||"number"!=typeof Error.stackTraceLimit?(v=function(t,e){
return"string"==typeof t?t:"object"!=typeof e&&"function"!=typeof e||void 0===e.name||void 0===e.message?Q(e):e.toString()
},null):(d=t,v=e,function(t){Error.stackTraceLimit+=6;try{throw new Error
}catch(o){t.stack=o.stack}Error.stackTraceLimit-=6})}()
;"undefined"!=typeof console&&void 0!==console.warn&&(o=function(t){
console.warn(t)},l.isNode&&process.stderr.isTTY?o=function(t,e){
var n=e?"[33m":"[31m";console.warn(n+t+"[0m\n")
}:l.isNode||"string"!=typeof(new Error).stack||(o=function(t,e){
console.warn("%c"+t,e?"color: darkorange":"color: red")}));var Y={warnings:g,
longStackTraces:!1,cancellation:!1,monitoring:!1};return b&&e.longStackTraces(),
{longStackTraces:function(){return Y.longStackTraces},warnings:function(){
return Y.warnings},cancellation:function(){return Y.cancellation},
monitoring:function(){return Y.monitoring},propagateFromFunction:function(){
return V},boundValueFunction:function(){return I},
checkForgottenReturns:function(t,e,n,r,i){if(void 0===t&&null!==e&&w){
if(void 0!==i&&i._returnedNonUndefined())return;if(0==(65535&r._bitField))return
;n&&(n+=" ");var o="",s="";if(e._trace){
for(var a=e._trace.stack.split("\n"),c=B(a),l=c.length-1;l>=0;--l){var u=c[l]
;if(!f.test(u)){var p=u.match(_);p&&(o="at "+p[1]+":"+p[2]+":"+p[3]+" ");break}}
if(c.length>0){var h=c[0];for(l=0;l<a.length;++l)if(a[l]===h){
l>0&&(s="\n"+a[l-1]);break}}}
var d="a promise was created in a "+n+"handler "+o+"but was not returned from it, see http://goo.gl/rRqMUw"+s
;r._warn(d,!0,e)}},setBounds:function(t,e){if(z()){
for(var n,r,i=t.stack.split("\n"),o=e.stack.split("\n"),s=-1,a=-1,c=0;c<i.length;++c){
if(l=W(i[c])){n=l.fileName,s=l.line;break}}for(c=0;c<o.length;++c){var l
;if(l=W(o[c])){r=l.fileName,a=l.line;break}}
s<0||a<0||!n||!r||n!==r||s>=a||(G=function(t){if(h.test(t))return!0;var e=W(t)
;return!!(e&&e.fileName===n&&s<=e.line&&e.line<=a)})}},warn:U,
deprecated:function(t,e){
var n=t+" is deprecated and will be removed in a future version."
;return e&&(n+=" Use "+e+" instead."),U(n)},CapturedTrace:K,fireDomEvent:j,
fireGlobalEvent:E}}},{"./errors":12,"./es5":13,"./util":36}],
10:[function(t,e,n){"use strict";e.exports=function(t){function e(){
return this.value}function n(){throw this.reason}
t.prototype.return=t.prototype.thenReturn=function(n){
return n instanceof t&&n.suppressUnhandledRejections(),
this._then(e,void 0,void 0,{value:n},void 0)
},t.prototype.throw=t.prototype.thenThrow=function(t){
return this._then(n,void 0,void 0,{reason:t},void 0)
},t.prototype.catchThrow=function(t){
if(arguments.length<=1)return this._then(void 0,n,void 0,{reason:t},void 0)
;var e=arguments[1],r=function(){throw e};return this.caught(t,r)
},t.prototype.catchReturn=function(n){
if(arguments.length<=1)return n instanceof t&&n.suppressUnhandledRejections(),
this._then(void 0,e,void 0,{value:n},void 0);var r=arguments[1]
;r instanceof t&&r.suppressUnhandledRejections();var i=function(){return r}
;return this.caught(n,i)}}},{}],11:[function(t,e,n){"use strict"
;e.exports=function(t,e){var n=t.reduce,r=t.all;function i(){return r(this)}
t.prototype.each=function(t){
return n(this,t,e,0)._then(i,void 0,void 0,this,void 0)
},t.prototype.mapSeries=function(t){return n(this,t,e,e)},t.each=function(t,r){
return n(t,r,e,0)._then(i,void 0,void 0,t,void 0)},t.mapSeries=function(t,r){
return n(t,r,e,e)}}},{}],12:[function(t,e,n){"use strict"
;var r,i,o=t("./es5"),s=o.freeze,a=t("./util"),c=a.inherits,l=a.notEnumerableProp
;function u(t,e){function n(r){if(!(this instanceof n))return new n(r)
;l(this,"message","string"==typeof r?r:e),
l(this,"name",t),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):Error.call(this)
}return c(n,Error),n}
var p=u("Warning","warning"),h=u("CancellationError","cancellation error"),f=u("TimeoutError","timeout error"),_=u("AggregateError","aggregate error")
;try{r=TypeError,i=RangeError}catch(b){
r=u("TypeError","type error"),i=u("RangeError","range error")}
for(var d="join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "),v=0;v<d.length;++v)"function"==typeof Array.prototype[d[v]]&&(_.prototype[d[v]]=Array.prototype[d[v]])
;o.defineProperty(_.prototype,"length",{value:0,configurable:!1,writable:!0,
enumerable:!0}),_.prototype.isOperational=!0;var y=0;function m(t){
if(!(this instanceof m))return new m(t)
;l(this,"name","OperationalError"),l(this,"message",t),
this.cause=t,this.isOperational=!0,
t instanceof Error?(l(this,"message",t.message),
l(this,"stack",t.stack)):Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)
}_.prototype.toString=function(){
var t=Array(4*y+1).join(" "),e="\n"+t+"AggregateError of:\n"
;y++,t=Array(4*y+1).join(" ");for(var n=0;n<this.length;++n){
for(var r=this[n]===this?"[Circular AggregateError]":this[n]+"",i=r.split("\n"),o=0;o<i.length;++o)i[o]=t+i[o]
;e+=(r=i.join("\n"))+"\n"}return y--,e},c(m,Error)
;var g=Error.__BluebirdErrorTypes__;g||(g=s({CancellationError:h,TimeoutError:f,
OperationalError:m,RejectionError:m,AggregateError:_
}),o.defineProperty(Error,"__BluebirdErrorTypes__",{value:g,writable:!1,
enumerable:!1,configurable:!1})),e.exports={Error:Error,TypeError:r,
RangeError:i,CancellationError:g.CancellationError,
OperationalError:g.OperationalError,TimeoutError:g.TimeoutError,
AggregateError:g.AggregateError,Warning:p}},{"./es5":13,"./util":36}],
13:[function(t,e,n){var r=function(){"use strict";return void 0===this}()
;if(r)e.exports={freeze:Object.freeze,defineProperty:Object.defineProperty,
getDescriptor:Object.getOwnPropertyDescriptor,keys:Object.keys,
names:Object.getOwnPropertyNames,getPrototypeOf:Object.getPrototypeOf,
isArray:Array.isArray,isES5:r,propertyIsWritable:function(t,e){
var n=Object.getOwnPropertyDescriptor(t,e);return!(n&&!n.writable&&!n.set)}
};else{
var i={}.hasOwnProperty,o={}.toString,s={}.constructor.prototype,a=function(t){
var e=[];for(var n in t)i.call(t,n)&&e.push(n);return e};e.exports={
isArray:function(t){try{return"[object Array]"===o.call(t)}catch(e){return!1}},
keys:a,names:a,defineProperty:function(t,e,n){return t[e]=n.value,t},
getDescriptor:function(t,e){return{value:t[e]}},freeze:function(t){return t},
getPrototypeOf:function(t){try{return Object(t).constructor.prototype}catch(e){
return s}},isES5:r,propertyIsWritable:function(){return!0}}}},{}],
14:[function(t,e,n){"use strict";e.exports=function(t,e){var n=t.map
;t.prototype.filter=function(t,r){return n(this,t,r,e)
},t.filter=function(t,r,i){return n(t,r,i,e)}}},{}],15:[function(t,e,n){
"use strict";e.exports=function(e,n,r){
var i=t("./util"),o=e.CancellationError,s=i.errorObj,a=t("./catch_filter")(r)
;function c(t,e,n){
this.promise=t,this.type=e,this.handler=n,this.called=!1,this.cancelPromise=null
}function l(t){this.finallyHandler=t}function u(t,e){
return null!=t.cancelPromise&&(arguments.length>1?t.cancelPromise._reject(e):t.cancelPromise._cancel(),
t.cancelPromise=null,!0)}function p(){
return f.call(this,this.promise._target()._settledValue())}function h(t){
if(!u(this,t))return s.e=t,s}function f(t){var i=this.promise,a=this.handler
;if(!this.called){this.called=!0
;var c=this.isFinallyHandler()?a.call(i._boundValue()):a.call(i._boundValue(),t)
;if(c===r)return c;if(void 0!==c){i._setReturnedNonUndefined();var f=n(c,i)
;if(f instanceof e){if(null!=this.cancelPromise){if(f._isCancelled()){
var _=new o("late cancellation observer");return i._attachExtraTrace(_),s.e=_,s}
f.isPending()&&f._attachCancellationCallback(new l(this))}
return f._then(p,h,void 0,this,void 0)}}}
return i.isRejected()?(u(this),s.e=t,s):(u(this),t)}
return c.prototype.isFinallyHandler=function(){return 0===this.type
},l.prototype._resultCancelled=function(){u(this.finallyHandler)
},e.prototype._passThrough=function(t,e,n,r){
return"function"!=typeof t?this.then():this._then(n,r,void 0,new c(this,e,t),void 0)
},e.prototype.lastly=e.prototype.finally=function(t){
return this._passThrough(t,0,f,f)},e.prototype.tap=function(t){
return this._passThrough(t,1,f)},e.prototype.tapCatch=function(t){
var n=arguments.length;if(1===n)return this._passThrough(t,1,void 0,f)
;var r,o=new Array(n-1),s=0;for(r=0;r<n-1;++r){var c=arguments[r]
;if(!i.isObject(c))return e.reject(new TypeError("tapCatch statement predicate: expecting an object but got "+i.classString(c)))
;o[s++]=c}o.length=s;var l=arguments[r]
;return this._passThrough(a(o,l,this),1,void 0,f)},c}},{"./catch_filter":7,
"./util":36}],16:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){
var a=t("./errors").TypeError,c=t("./util"),l=c.errorObj,u=c.tryCatch,p=[]
;function h(t,n,i,o){if(s.cancellation()){
var a=new e(r),c=this._finallyPromise=new e(r)
;this._promise=a.lastly((function(){return c
})),a._captureStackTrace(),a._setOnCancel(this)}else{
(this._promise=new e(r))._captureStackTrace()}
this._stack=o,this._generatorFunction=t,this._receiver=n,this._generator=void 0,
this._yieldHandlers="function"==typeof i?[i].concat(p):p,
this._yieldedPromise=null,this._cancellationPhase=!1}
c.inherits(h,o),h.prototype._isResolved=function(){return null===this._promise},
h.prototype._cleanup=function(){
this._promise=this._generator=null,s.cancellation()&&null!==this._finallyPromise&&(this._finallyPromise._fulfill(),
this._finallyPromise=null)},h.prototype._promiseCancelled=function(){
if(!this._isResolved()){var t
;if(void 0!==this._generator.return)this._promise._pushContext(),
t=u(this._generator.return).call(this._generator,void 0),
this._promise._popContext();else{
var n=new e.CancellationError("generator .return() sentinel")
;e.coroutine.returnSentinel=n,
this._promise._attachExtraTrace(n),this._promise._pushContext(),
t=u(this._generator.throw).call(this._generator,n),this._promise._popContext()}
this._cancellationPhase=!0,this._yieldedPromise=null,this._continue(t)}
},h.prototype._promiseFulfilled=function(t){
this._yieldedPromise=null,this._promise._pushContext()
;var e=u(this._generator.next).call(this._generator,t)
;this._promise._popContext(),this._continue(e)
},h.prototype._promiseRejected=function(t){
this._yieldedPromise=null,this._promise._attachExtraTrace(t),
this._promise._pushContext()
;var e=u(this._generator.throw).call(this._generator,t)
;this._promise._popContext(),this._continue(e)
},h.prototype._resultCancelled=function(){if(this._yieldedPromise instanceof e){
var t=this._yieldedPromise;this._yieldedPromise=null,t.cancel()}
},h.prototype.promise=function(){return this._promise
},h.prototype._run=function(){
this._generator=this._generatorFunction.call(this._receiver),
this._receiver=this._generatorFunction=void 0,this._promiseFulfilled(void 0)
},h.prototype._continue=function(t){var n=this._promise
;if(t===l)return this._cleanup(),
this._cancellationPhase?n.cancel():n._rejectCallback(t.e,!1);var r=t.value
;if(!0===t.done)return this._cleanup(),
this._cancellationPhase?n.cancel():n._resolveCallback(r)
;var o=i(r,this._promise);if(o instanceof e||null!==(o=function(t,n,r){
for(var o=0;o<n.length;++o){r._pushContext();var s=u(n[o])(t)
;if(r._popContext(),s===l){r._pushContext();var a=e.reject(l.e)
;return r._popContext(),a}var c=i(s,r);if(c instanceof e)return c}return null
}(o,this._yieldHandlers,this._promise))){var s=(o=o._target())._bitField
;0==(50397184&s)?(this._yieldedPromise=o,
o._proxy(this,null)):0!=(33554432&s)?e._async.invoke(this._promiseFulfilled,this,o._value()):0!=(16777216&s)?e._async.invoke(this._promiseRejected,this,o._reason()):this._promiseCancelled()
}else this._promiseRejected(new a("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s",String(r))+"From coroutine:\n"+this._stack.split("\n").slice(1,-7).join("\n")))
},e.coroutine=function(t,e){
if("function"!=typeof t)throw new a("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n")
;var n=Object(e).yieldHandler,r=h,i=(new Error).stack;return function(){
var e=t.apply(this,arguments),o=new r(void 0,void 0,n,i),s=o.promise()
;return o._generator=e,o._promiseFulfilled(void 0),s}
},e.coroutine.addYieldHandler=function(t){
if("function"!=typeof t)throw new a("expecting a function but got "+c.classString(t))
;p.push(t)},e.spawn=function(t){
if(s.deprecated("Promise.spawn()","Promise.coroutine()"),
"function"!=typeof t)return n("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n")
;var r=new h(t,this),i=r.promise();return r._run(e.spawn),i}}},{"./errors":12,
"./util":36}],17:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o,s){
var a=t("./util");a.canEvaluate,a.tryCatch,a.errorObj;e.join=function(){
var t,e=arguments.length-1
;e>0&&"function"==typeof arguments[e]&&(t=arguments[e])
;var r=[].slice.call(arguments);t&&r.pop();var i=new n(r).promise()
;return void 0!==t?i.spread(t):i}}},{"./util":36}],18:[function(t,e,n){
"use strict";e.exports=function(e,n,r,i,o,s){
var a=e._getDomain,c=t("./util"),l=c.tryCatch,u=c.errorObj,p=e._async
;function h(t,e,n,r){this.constructor$(t),this._promise._captureStackTrace()
;var i=a()
;this._callback=null===i?e:c.domainBind(i,e),this._preservedValues=r===o?new Array(this.length()):null,
this._limit=n,
this._inFlight=0,this._queue=[],p.invoke(this._asyncInit,this,void 0)}
function f(t,n,i,o){
if("function"!=typeof n)return r("expecting a function but got "+c.classString(n))
;var s=0;if(void 0!==i){
if("object"!=typeof i||null===i)return e.reject(new TypeError("options argument must be an object but it is "+c.classString(i)))
;if("number"!=typeof i.concurrency)return e.reject(new TypeError("'concurrency' must be a number but it is "+c.classString(i.concurrency)))
;s=i.concurrency}
return new h(t,n,s="number"==typeof s&&isFinite(s)&&s>=1?s:0,o).promise()}
c.inherits(h,n),h.prototype._asyncInit=function(){this._init$(void 0,-2)
},h.prototype._init=function(){},h.prototype._promiseFulfilled=function(t,n){
var r=this._values,o=this.length(),a=this._preservedValues,c=this._limit
;if(n<0){
if(r[n=-1*n-1]=t,c>=1&&(this._inFlight--,this._drainQueue(),this._isResolved()))return!0
}else{if(c>=1&&this._inFlight>=c)return r[n]=t,this._queue.push(n),!1
;null!==a&&(a[n]=t);var p=this._promise,h=this._callback,f=p._boundValue()
;p._pushContext();var _=l(h).call(f,t,n,o),d=p._popContext()
;if(s.checkForgottenReturns(_,d,null!==a?"Promise.filter":"Promise.map",p),
_===u)return this._reject(_.e),!0;var v=i(_,this._promise);if(v instanceof e){
var y=(v=v._target())._bitField
;if(0==(50397184&y))return c>=1&&this._inFlight++,
r[n]=v,v._proxy(this,-1*(n+1)),!1
;if(0==(33554432&y))return 0!=(16777216&y)?(this._reject(v._reason()),
!0):(this._cancel(),!0);_=v._value()}r[n]=_}
return++this._totalResolved>=o&&(null!==a?this._filter(r,a):this._resolve(r),!0)
},h.prototype._drainQueue=function(){
for(var t=this._queue,e=this._limit,n=this._values;t.length>0&&this._inFlight<e;){
if(this._isResolved())return;var r=t.pop();this._promiseFulfilled(n[r],r)}
},h.prototype._filter=function(t,e){
for(var n=e.length,r=new Array(n),i=0,o=0;o<n;++o)t[o]&&(r[i++]=e[o])
;r.length=i,this._resolve(r)},h.prototype.preservedValues=function(){
return this._preservedValues},e.prototype.map=function(t,e){
return f(this,t,e,null)},e.map=function(t,e,n,r){return f(t,e,n,r)}}},{
"./util":36}],19:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o){
var s=t("./util"),a=s.tryCatch;e.method=function(t){
if("function"!=typeof t)throw new e.TypeError("expecting a function but got "+s.classString(t))
;return function(){var r=new e(n);r._captureStackTrace(),r._pushContext()
;var i=a(t).apply(this,arguments),s=r._popContext()
;return o.checkForgottenReturns(i,s,"Promise.method",r),
r._resolveFromSyncValue(i),r}},e.attempt=e.try=function(t){
if("function"!=typeof t)return i("expecting a function but got "+s.classString(t))
;var r,c=new e(n)
;if(c._captureStackTrace(),c._pushContext(),arguments.length>1){
o.deprecated("calling Promise.try with more than 1 argument")
;var l=arguments[1],u=arguments[2];r=s.isArray(l)?a(t).apply(u,l):a(t).call(u,l)
}else r=a(t)();var p=c._popContext()
;return o.checkForgottenReturns(r,p,"Promise.try",c),c._resolveFromSyncValue(r),
c},e.prototype._resolveFromSyncValue=function(t){
t===s.errorObj?this._rejectCallback(t.e,!1):this._resolveCallback(t,!0)}}},{
"./util":36}],20:[function(t,e,n){"use strict"
;var r=t("./util"),i=r.maybeWrapAsError,o=t("./errors").OperationalError,s=t("./es5")
;var a=/^(?:name|message|stack|cause)$/;function c(t){var e;if(function(t){
return t instanceof Error&&s.getPrototypeOf(t)===Error.prototype}(t)){
(e=new o(t)).name=t.name,e.message=t.message,e.stack=t.stack
;for(var n=s.keys(t),i=0;i<n.length;++i){var c=n[i];a.test(c)||(e[c]=t[c])}
return e}return r.markAsOriginatingFromRejection(t),t}e.exports=function(t,e){
return function(n,r){if(null!==t){if(n){var o=c(i(n))
;t._attachExtraTrace(o),t._reject(o)}else if(e){var s=[].slice.call(arguments,1)
;t._fulfill(s)}else t._fulfill(r);t=null}}}},{"./errors":12,"./es5":13,
"./util":36}],21:[function(t,e,n){"use strict";e.exports=function(e){
var n=t("./util"),r=e._async,i=n.tryCatch,o=n.errorObj;function s(t,e){
if(!n.isArray(t))return a.call(this,t,e)
;var s=i(e).apply(this._boundValue(),[null].concat(t));s===o&&r.throwLater(s.e)}
function a(t,e){
var n=this._boundValue(),s=void 0===t?i(e).call(n,null):i(e).call(n,null,t)
;s===o&&r.throwLater(s.e)}function c(t,e){if(!t){var n=new Error(t+"")
;n.cause=t,t=n}var s=i(e).call(this._boundValue(),t);s===o&&r.throwLater(s.e)}
e.prototype.asCallback=e.prototype.nodeify=function(t,e){
if("function"==typeof t){var n=a
;void 0!==e&&Object(e).spread&&(n=s),this._then(n,c,void 0,this,t)}return this}}
},{"./util":36}],22:[function(t,e,n){"use strict";e.exports=function(){
var n=function(){
return new f("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n")
},r=function(){return new x.PromiseInspection(this._target())},i=function(t){
return x.reject(new f(t))};function o(){}var s,a={},c=t("./util")
;s=c.isNode?function(){var t=process.domain;return void 0===t&&(t=null),t
}:function(){return null},c.notEnumerableProp(x,"_getDomain",s)
;var l=t("./es5"),u=t("./async"),p=new u;l.defineProperty(x,"_async",{value:p})
;var h=t("./errors"),f=x.TypeError=h.TypeError;x.RangeError=h.RangeError
;var _=x.CancellationError=h.CancellationError
;x.TimeoutError=h.TimeoutError,x.OperationalError=h.OperationalError,
x.RejectionError=h.OperationalError,x.AggregateError=h.AggregateError
;var d=function(){},v={},y={},m=t("./thenables")(x,d),g=t("./promise_array")(x,d,m,i,o),b=t("./context")(x),w=b.create,C=t("./debuggability")(x,b),j=(C.CapturedTrace,
t("./finally")(x,m,y)),E=t("./catch_filter")(y),k=t("./nodeback"),F=c.errorObj,T=c.tryCatch
;function x(t){t!==d&&function(t,e){
if(null==t||t.constructor!==x)throw new f("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n")
;if("function"!=typeof e)throw new f("expecting a function but got "+c.classString(e))
}(this,t),
this._bitField=0,this._fulfillmentHandler0=void 0,this._rejectionHandler0=void 0,
this._promise0=void 0,
this._receiver0=void 0,this._resolveFromExecutor(t),this._promiseCreated(),
this._fireEvent("promiseCreated",this)}function P(t){
this.promise._resolveCallback(t)}function R(t){
this.promise._rejectCallback(t,!1)}function S(t){var e=new x(d)
;e._fulfillmentHandler0=t,e._rejectionHandler0=t,e._promise0=t,e._receiver0=t}
return x.prototype.toString=function(){return"[object Promise]"
},x.prototype.caught=x.prototype.catch=function(t){var e=arguments.length
;if(e>1){var n,r=new Array(e-1),o=0;for(n=0;n<e-1;++n){var s=arguments[n]
;if(!c.isObject(s))return i("Catch statement predicate: expecting an object but got "+c.classString(s))
;r[o++]=s}return r.length=o,t=arguments[n],this.then(void 0,E(r,t,this))}
return this.then(void 0,t)},x.prototype.reflect=function(){
return this._then(r,r,void 0,this,void 0)},x.prototype.then=function(t,e){
if(C.warnings()&&arguments.length>0&&"function"!=typeof t&&"function"!=typeof e){
var n=".then() only accepts functions but was passed: "+c.classString(t)
;arguments.length>1&&(n+=", "+c.classString(e)),this._warn(n)}
return this._then(t,e,void 0,void 0,void 0)},x.prototype.done=function(t,e){
this._then(t,e,void 0,void 0,void 0)._setIsFinal()
},x.prototype.spread=function(t){
return"function"!=typeof t?i("expecting a function but got "+c.classString(t)):this.all()._then(t,void 0,void 0,v,void 0)
},x.prototype.toJSON=function(){var t={isFulfilled:!1,isRejected:!1,
fulfillmentValue:void 0,rejectionReason:void 0}
;return this.isFulfilled()?(t.fulfillmentValue=this.value(),
t.isFulfilled=!0):this.isRejected()&&(t.rejectionReason=this.reason(),
t.isRejected=!0),t},x.prototype.all=function(){
return arguments.length>0&&this._warn(".all() was passed arguments but it does not take any"),
new g(this).promise()},x.prototype.error=function(t){
return this.caught(c.originatesFromRejection,t)
},x.getNewLibraryCopy=e.exports,x.is=function(t){return t instanceof x
},x.fromNode=x.fromCallback=function(t){var e=new x(d);e._captureStackTrace()
;var n=arguments.length>1&&!!Object(arguments[1]).multiArgs,r=T(t)(k(e,n))
;return r===F&&e._rejectCallback(r.e,!0),
e._isFateSealed()||e._setAsyncGuaranteed(),e},x.all=function(t){
return new g(t).promise()},x.cast=function(t){var e=m(t)
;return e instanceof x||((e=new x(d))._captureStackTrace(),
e._setFulfilled(),e._rejectionHandler0=t),e
},x.resolve=x.fulfilled=x.cast,x.reject=x.rejected=function(t){var e=new x(d)
;return e._captureStackTrace(),e._rejectCallback(t,!0),e
},x.setScheduler=function(t){
if("function"!=typeof t)throw new f("expecting a function but got "+c.classString(t))
;return p.setScheduler(t)},x.prototype._then=function(t,e,n,r,i){
var o=void 0!==i,a=o?i:new x(d),l=this._target(),u=l._bitField
;o||(a._propagateFrom(this,3),
a._captureStackTrace(),void 0===r&&0!=(2097152&this._bitField)&&(r=0!=(50397184&u)?this._boundValue():l===this?void 0:this._boundTo),
this._fireEvent("promiseChained",this,a));var h=s();if(0!=(50397184&u)){
var f,v,y=l._settlePromiseCtx
;0!=(33554432&u)?(v=l._rejectionHandler0,f=t):0!=(16777216&u)?(v=l._fulfillmentHandler0,
f=e,l._unsetRejectionIsUnhandled()):(y=l._settlePromiseLateCancellationObserver,
v=new _("late cancellation observer"),l._attachExtraTrace(v),f=e),p.invoke(y,l,{
handler:null===h?f:"function"==typeof f&&c.domainBind(h,f),promise:a,receiver:r,
value:v})}else l._addCallbacks(t,e,a,r,h);return a
},x.prototype._length=function(){return 65535&this._bitField
},x.prototype._isFateSealed=function(){return 0!=(117506048&this._bitField)
},x.prototype._isFollowing=function(){return 67108864==(67108864&this._bitField)
},x.prototype._setLength=function(t){
this._bitField=-65536&this._bitField|65535&t
},x.prototype._setFulfilled=function(){
this._bitField=33554432|this._bitField,this._fireEvent("promiseFulfilled",this)
},x.prototype._setRejected=function(){
this._bitField=16777216|this._bitField,this._fireEvent("promiseRejected",this)},
x.prototype._setFollowing=function(){
this._bitField=67108864|this._bitField,this._fireEvent("promiseResolved",this)},
x.prototype._setIsFinal=function(){this._bitField=4194304|this._bitField
},x.prototype._isFinal=function(){return(4194304&this._bitField)>0
},x.prototype._unsetCancelled=function(){this._bitField=-65537&this._bitField
},x.prototype._setCancelled=function(){
this._bitField=65536|this._bitField,this._fireEvent("promiseCancelled",this)
},x.prototype._setWillBeCancelled=function(){
this._bitField=8388608|this._bitField
},x.prototype._setAsyncGuaranteed=function(){
p.hasCustomScheduler()||(this._bitField=134217728|this._bitField)
},x.prototype._receiverAt=function(t){var e=0===t?this._receiver0:this[4*t-4+3]
;if(e!==a)return void 0===e&&this._isBound()?this._boundValue():e
},x.prototype._promiseAt=function(t){return this[4*t-4+2]
},x.prototype._fulfillmentHandlerAt=function(t){return this[4*t-4+0]
},x.prototype._rejectionHandlerAt=function(t){return this[4*t-4+1]
},x.prototype._boundValue=function(){},
x.prototype._migrateCallback0=function(t){t._bitField
;var e=t._fulfillmentHandler0,n=t._rejectionHandler0,r=t._promise0,i=t._receiverAt(0)
;void 0===i&&(i=a),this._addCallbacks(e,n,r,i,null)
},x.prototype._migrateCallbackAt=function(t,e){
var n=t._fulfillmentHandlerAt(e),r=t._rejectionHandlerAt(e),i=t._promiseAt(e),o=t._receiverAt(e)
;void 0===o&&(o=a),this._addCallbacks(n,r,i,o,null)
},x.prototype._addCallbacks=function(t,e,n,r,i){var o=this._length()
;if(o>=65531&&(o=0,this._setLength(0)),0===o)this._promise0=n,this._receiver0=r,
"function"==typeof t&&(this._fulfillmentHandler0=null===i?t:c.domainBind(i,t)),
"function"==typeof e&&(this._rejectionHandler0=null===i?e:c.domainBind(i,e));else{
var s=4*o-4
;this[s+2]=n,this[s+3]=r,"function"==typeof t&&(this[s+0]=null===i?t:c.domainBind(i,t)),
"function"==typeof e&&(this[s+1]=null===i?e:c.domainBind(i,e))}
return this._setLength(o+1),o},x.prototype._proxy=function(t,e){
this._addCallbacks(void 0,void 0,e,t,null)
},x.prototype._resolveCallback=function(t,e){if(0==(117506048&this._bitField)){
if(t===this)return this._rejectCallback(n(),!1);var r=m(t,this)
;if(!(r instanceof x))return this._fulfill(t);e&&this._propagateFrom(r,2)
;var i=r._target();if(i!==this){var o=i._bitField;if(0==(50397184&o)){
var s=this._length();s>0&&i._migrateCallback0(this)
;for(var a=1;a<s;++a)i._migrateCallbackAt(this,a)
;this._setFollowing(),this._setLength(0),this._setFollowee(i)
}else if(0!=(33554432&o))this._fulfill(i._value());else if(0!=(16777216&o))this._reject(i._reason());else{
var c=new _("late cancellation observer");i._attachExtraTrace(c),this._reject(c)
}}else this._reject(n())}},x.prototype._rejectCallback=function(t,e,n){
var r=c.ensureErrorObject(t),i=r===t;if(!i&&!n&&C.warnings()){
var o="a promise was rejected with a non-error: "+c.classString(t)
;this._warn(o,!0)}this._attachExtraTrace(r,!!e&&i),this._reject(t)
},x.prototype._resolveFromExecutor=function(t){if(t!==d){var e=this
;this._captureStackTrace(),this._pushContext()
;var n=!0,r=this._execute(t,(function(t){e._resolveCallback(t)}),(function(t){
e._rejectCallback(t,n)}))
;n=!1,this._popContext(),void 0!==r&&e._rejectCallback(r,!0)}
},x.prototype._settlePromiseFromHandler=function(t,e,n,r){var i=r._bitField
;if(0==(65536&i)){var o
;r._pushContext(),e===v?n&&"number"==typeof n.length?o=T(t).apply(this._boundValue(),n):(o=F).e=new f("cannot .spread() a non-array: "+c.classString(n)):o=T(t).call(e,n)
;var s=r._popContext()
;0==(65536&(i=r._bitField))&&(o===y?r._reject(n):o===F?r._rejectCallback(o.e,!1):(C.checkForgottenReturns(o,s,"",r,this),
r._resolveCallback(o)))}},x.prototype._target=function(){
for(var t=this;t._isFollowing();)t=t._followee();return t
},x.prototype._followee=function(){return this._rejectionHandler0
},x.prototype._setFollowee=function(t){this._rejectionHandler0=t
},x.prototype._settlePromise=function(t,e,n,i){
var s=t instanceof x,a=this._bitField,c=0!=(134217728&a)
;0!=(65536&a)?(s&&t._invokeInternalOnCancel(),
n instanceof j&&n.isFinallyHandler()?(n.cancelPromise=t,
T(e).call(n,i)===F&&t._reject(F.e)):e===r?t._fulfill(r.call(n)):n instanceof o?n._promiseCancelled(t):s||t instanceof g?t._cancel():n.cancel()):"function"==typeof e?s?(c&&t._setAsyncGuaranteed(),
this._settlePromiseFromHandler(e,n,i,t)):e.call(n,i,t):n instanceof o?n._isResolved()||(0!=(33554432&a)?n._promiseFulfilled(i,t):n._promiseRejected(i,t)):s&&(c&&t._setAsyncGuaranteed(),
0!=(33554432&a)?t._fulfill(i):t._reject(i))
},x.prototype._settlePromiseLateCancellationObserver=function(t){
var e=t.handler,n=t.promise,r=t.receiver,i=t.value
;"function"==typeof e?n instanceof x?this._settlePromiseFromHandler(e,r,i,n):e.call(r,i,n):n instanceof x&&n._reject(i)
},x.prototype._settlePromiseCtx=function(t){
this._settlePromise(t.promise,t.handler,t.receiver,t.value)
},x.prototype._settlePromise0=function(t,e,n){
var r=this._promise0,i=this._receiverAt(0)
;this._promise0=void 0,this._receiver0=void 0,this._settlePromise(r,t,i,e)
},x.prototype._clearCallbackDataAtIndex=function(t){var e=4*t-4
;this[e+2]=this[e+3]=this[e+0]=this[e+1]=void 0
},x.prototype._fulfill=function(t){var e=this._bitField
;if(!((117506048&e)>>>16)){if(t===this){var r=n()
;return this._attachExtraTrace(r),this._reject(r)}
this._setFulfilled(),this._rejectionHandler0=t,
(65535&e)>0&&(0!=(134217728&e)?this._settlePromises():p.settlePromises(this),
this._dereferenceTrace())}},x.prototype._reject=function(t){var e=this._bitField
;if(!((117506048&e)>>>16)){
if(this._setRejected(),this._fulfillmentHandler0=t,this._isFinal())return p.fatalError(t,c.isNode)
;(65535&e)>0?p.settlePromises(this):this._ensurePossibleRejectionHandled()}
},x.prototype._fulfillPromises=function(t,e){for(var n=1;n<t;n++){
var r=this._fulfillmentHandlerAt(n),i=this._promiseAt(n),o=this._receiverAt(n)
;this._clearCallbackDataAtIndex(n),this._settlePromise(i,r,o,e)}
},x.prototype._rejectPromises=function(t,e){for(var n=1;n<t;n++){
var r=this._rejectionHandlerAt(n),i=this._promiseAt(n),o=this._receiverAt(n)
;this._clearCallbackDataAtIndex(n),this._settlePromise(i,r,o,e)}
},x.prototype._settlePromises=function(){var t=this._bitField,e=65535&t;if(e>0){
if(0!=(16842752&t)){var n=this._fulfillmentHandler0
;this._settlePromise0(this._rejectionHandler0,n,t),this._rejectPromises(e,n)
}else{var r=this._rejectionHandler0
;this._settlePromise0(this._fulfillmentHandler0,r,t),this._fulfillPromises(e,r)}
this._setLength(0)}this._clearCancellationData()
},x.prototype._settledValue=function(){var t=this._bitField
;return 0!=(33554432&t)?this._rejectionHandler0:0!=(16777216&t)?this._fulfillmentHandler0:void 0
},x.defer=x.pending=function(){
return C.deprecated("Promise.defer","new Promise"),{promise:new x(d),resolve:P,
reject:R}
},c.notEnumerableProp(x,"_makeSelfResolutionError",n),t("./method")(x,d,m,i,C),
t("./bind")(x,d,m,C),
t("./cancel")(x,g,i,C),t("./direct_resolve")(x),t("./synchronous_inspection")(x),
t("./join")(x,g,m,d,p,s),
x.Promise=x,x.version="3.5.4",t("./map.js")(x,g,i,m,d,C),
t("./call_get.js")(x),t("./using.js")(x,i,m,w,d,C),
t("./timers.js")(x,d,C),t("./generators.js")(x,i,d,m,o,C),
t("./nodeify.js")(x),t("./promisify.js")(x,d),
t("./props.js")(x,g,m,i),t("./race.js")(x,d,m,i),
t("./reduce.js")(x,g,i,m,d,C),t("./settle.js")(x,g,C),
t("./some.js")(x,g,i),t("./filter.js")(x,d),
t("./each.js")(x,d),t("./any.js")(x),
c.toFastProperties(x),c.toFastProperties(x.prototype),S({a:1}),S({b:2}),S({c:3
}),
S(1),S((function(){})),S(void 0),S(!1),S(new x(d)),C.setBounds(u.firstLineError,c.lastLineError),
x}},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,
"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,
"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,
"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,
"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,
"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,
"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,
"./util":36}],23:[function(t,e,n){"use strict";e.exports=function(e,n,r,i,o){
var s=t("./util");s.isArray;function a(t){var r=this._promise=new e(n)
;t instanceof e&&r._propagateFrom(t,3),
r._setOnCancel(this),this._values=t,this._length=0,
this._totalResolved=0,this._init(void 0,-2)}
return s.inherits(a,o),a.prototype.length=function(){return this._length
},a.prototype.promise=function(){return this._promise
},a.prototype._init=function t(n,o){var a=r(this._values,this._promise)
;if(a instanceof e){var c=(a=a._target())._bitField
;if(this._values=a,0==(50397184&c))return this._promise._setAsyncGuaranteed(),
a._then(t,this._reject,void 0,this,o)
;if(0==(33554432&c))return 0!=(16777216&c)?this._reject(a._reason()):this._cancel()
;a=a._value()}
if(null!==(a=s.asArray(a)))0!==a.length?this._iterate(a):-5===o?this._resolveEmptyArray():this._resolve(function(t){
switch(t){case-2:return[];case-3:return{};case-6:return new Map}}(o));else{
var l=i("expecting an array or an iterable object but got "+s.classString(a)).reason()
;this._promise._rejectCallback(l,!1)}},a.prototype._iterate=function(t){
var n=this.getActualLength(t.length)
;this._length=n,this._values=this.shouldCopyValues()?new Array(n):this._values
;for(var i=this._promise,o=!1,s=null,a=0;a<n;++a){var c=r(t[a],i)
;s=c instanceof e?(c=c._target())._bitField:null,
o?null!==s&&c.suppressUnhandledRejections():null!==s?0==(50397184&s)?(c._proxy(this,a),
this._values[a]=c):o=0!=(33554432&s)?this._promiseFulfilled(c._value(),a):0!=(16777216&s)?this._promiseRejected(c._reason(),a):this._promiseCancelled(a):o=this._promiseFulfilled(c,a)
}o||i._setAsyncGuaranteed()},a.prototype._isResolved=function(){
return null===this._values},a.prototype._resolve=function(t){
this._values=null,this._promise._fulfill(t)},a.prototype._cancel=function(){
!this._isResolved()&&this._promise._isCancellable()&&(this._values=null,
this._promise._cancel())},a.prototype._reject=function(t){
this._values=null,this._promise._rejectCallback(t,!1)
},a.prototype._promiseFulfilled=function(t,e){
return this._values[e]=t,++this._totalResolved>=this._length&&(this._resolve(this._values),
!0)},a.prototype._promiseCancelled=function(){return this._cancel(),!0
},a.prototype._promiseRejected=function(t){
return this._totalResolved++,this._reject(t),!0
},a.prototype._resultCancelled=function(){if(!this._isResolved()){
var t=this._values
;if(this._cancel(),t instanceof e)t.cancel();else for(var n=0;n<t.length;++n)t[n]instanceof e&&t[n].cancel()
}},a.prototype.shouldCopyValues=function(){return!0
},a.prototype.getActualLength=function(t){return t},a}},{"./util":36}],
24:[function(t,e,n){"use strict";e.exports=function(e,n){
var r={},i=t("./util"),o=t("./nodeback"),s=i.withAppended,a=i.maybeWrapAsError,c=i.canEvaluate,l=t("./errors").TypeError,u={
__isPromisified__:!0
},p=new RegExp("^(?:"+["arity","length","name","arguments","caller","callee","prototype","__isPromisified__"].join("|")+")$"),h=function(t){
return i.isIdentifier(t)&&"_"!==t.charAt(0)&&"constructor"!==t};function f(t){
return!p.test(t)}function _(t){try{return!0===t.__isPromisified__}catch(e){
return!1}}function d(t,e,n){var r=i.getDataPropertyOrDefault(t,e+n,u)
;return!!r&&_(r)}function v(t,e,n,r){
for(var o=i.inheritedDataKeys(t),s=[],a=0;a<o.length;++a){
var c=o[a],u=t[c],p=r===h||h(c,u,t)
;"function"!=typeof u||_(u)||d(t,c,e)||!r(c,u,t,p)||s.push(c,u)}
return function(t,e,n){for(var r=0;r<t.length;r+=2){var i=t[r]
;if(n.test(i))for(var o=i.replace(n,""),s=0;s<t.length;s+=2)if(t[s]===o)throw new l("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s",e))
}}(s,e,n),s}var y,m=function(t){return t.replace(/([$])/,"\\$")}
;var g=c?y:function(t,c,l,u,p,h){var f=function(){return this}(),_=t
;function d(){var i=c;c===r&&(i=this);var l=new e(n);l._captureStackTrace()
;var u="string"==typeof _&&this!==f?this[_]:t,p=o(l,h);try{
u.apply(i,s(arguments,p))}catch(d){l._rejectCallback(a(d),!0,!0)}
return l._isFateSealed()||l._setAsyncGuaranteed(),l}
return"string"==typeof _&&(t=u),i.notEnumerableProp(d,"__isPromisified__",!0),d}
;function b(t,e,n,o,s){
for(var a=new RegExp(m(e)+"$"),c=v(t,e,a,n),l=0,u=c.length;l<u;l+=2){
var p=c[l],h=c[l+1],f=p+e;if(o===g)t[f]=g(p,r,p,h,e,s);else{
var _=o(h,(function(){return g(p,r,p,h,e,s)}))
;i.notEnumerableProp(_,"__isPromisified__",!0),t[f]=_}}
return i.toFastProperties(t),t}e.promisify=function(t,e){
if("function"!=typeof t)throw new l("expecting a function but got "+i.classString(t))
;if(_(t))return t;var n=function(t,e,n){return g(t,e,void 0,t,null,n)
}(t,void 0===(e=Object(e)).context?r:e.context,!!e.multiArgs)
;return i.copyDescriptors(t,n,f),n},e.promisifyAll=function(t,e){
if("function"!=typeof t&&"object"!=typeof t)throw new l("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n")
;var n=!!(e=Object(e)).multiArgs,r=e.suffix;"string"!=typeof r&&(r="Async")
;var o=e.filter;"function"!=typeof o&&(o=h);var s=e.promisifier
;if("function"!=typeof s&&(s=g),
!i.isIdentifier(r))throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n")
;for(var a=i.inheritedDataKeys(t),c=0;c<a.length;++c){var u=t[a[c]]
;"constructor"!==a[c]&&i.isClass(u)&&(b(u.prototype,r,o,s,n),b(u,r,o,s,n))}
return b(t,r,o,s,n)}}},{"./errors":12,"./nodeback":20,"./util":36}],
25:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){
var o,s=t("./util"),a=s.isObject,c=t("./es5");"function"==typeof Map&&(o=Map)
;var l=function(){var t=0,e=0;function n(n,r){this[t]=n,this[t+e]=r,t++}
return function(r){e=r.size,t=0;var i=new Array(2*r.size);return r.forEach(n,i),
i}}();function u(t){var e,n=!1;if(void 0!==o&&t instanceof o)e=l(t),n=!0;else{
var r=c.keys(t),i=r.length;e=new Array(2*i);for(var s=0;s<i;++s){var a=r[s]
;e[s]=t[a],e[s+i]=a}}
this.constructor$(e),this._isMap=n,this._init$(void 0,n?-6:-3)}function p(t){
var n,o=r(t)
;return a(o)?(n=o instanceof e?o._then(e.props,void 0,void 0,void 0,void 0):new u(o).promise(),
o instanceof e&&n._propagateFrom(o,2),
n):i("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n")
}
s.inherits(u,n),u.prototype._init=function(){},u.prototype._promiseFulfilled=function(t,e){
if(this._values[e]=t,++this._totalResolved>=this._length){var n
;if(this._isMap)n=function(t){for(var e=new o,n=t.length/2|0,r=0;r<n;++r){
var i=t[n+r],s=t[r];e.set(i,s)}return e}(this._values);else{n={}
;for(var r=this.length(),i=0,s=this.length();i<s;++i)n[this._values[i+r]]=this._values[i]
}return this._resolve(n),!0}return!1},u.prototype.shouldCopyValues=function(){
return!1},u.prototype.getActualLength=function(t){return t>>1
},e.prototype.props=function(){return p(this)},e.props=function(t){return p(t)}}
},{"./es5":13,"./util":36}],26:[function(t,e,n){"use strict";function r(t){
this._capacity=t,this._length=0,this._front=0}
r.prototype._willBeOverCapacity=function(t){return this._capacity<t
},r.prototype._pushOne=function(t){var e=this.length();this._checkCapacity(e+1),
this[this._front+e&this._capacity-1]=t,this._length=e+1
},r.prototype.push=function(t,e,n){var r=this.length()+3
;if(this._willBeOverCapacity(r))return this._pushOne(t),
this._pushOne(e),void this._pushOne(n);var i=this._front+r-3
;this._checkCapacity(r);var o=this._capacity-1
;this[i+0&o]=t,this[i+1&o]=e,this[i+2&o]=n,this._length=r
},r.prototype.shift=function(){var t=this._front,e=this[t]
;return this[t]=void 0,this._front=t+1&this._capacity-1,this._length--,e
},r.prototype.length=function(){return this._length
},r.prototype._checkCapacity=function(t){
this._capacity<t&&this._resizeTo(this._capacity<<1)
},r.prototype._resizeTo=function(t){var e=this._capacity
;this._capacity=t,function(t,e,n,r,i){
for(var o=0;o<i;++o)n[o+r]=t[o+e],t[o+e]=void 0
}(this,0,this,e,this._front+this._length&e-1)},e.exports=r},{}],
27:[function(t,e,n){"use strict";e.exports=function(e,n,r,i){
var o=t("./util"),s=function(t){return t.then((function(e){return a(e,t)}))}
;function a(t,a){var c=r(t);if(c instanceof e)return s(c)
;if(null===(t=o.asArray(t)))return i("expecting an array or an iterable object but got "+o.classString(t))
;var l=new e(n);void 0!==a&&l._propagateFrom(a,3)
;for(var u=l._fulfill,p=l._reject,h=0,f=t.length;h<f;++h){var _=t[h]
;(void 0!==_||h in t)&&e.cast(_)._then(u,p,void 0,l,null)}return l}
e.race=function(t){return a(t,void 0)},e.prototype.race=function(){
return a(this,void 0)}}},{"./util":36}],28:[function(t,e,n){"use strict"
;e.exports=function(e,n,r,i,o,s){var a=e._getDomain,c=t("./util"),l=c.tryCatch
;function u(t,n,r,i){this.constructor$(t);var s=a()
;this._fn=null===s?n:c.domainBind(s,n),
void 0!==r&&(r=e.resolve(r))._attachCancellationCallback(this),
this._initialValue=r,
this._currentCancellable=null,this._eachValues=i===o?Array(this._length):0===i?null:void 0,
this._promise._captureStackTrace(),this._init$(void 0,-5)}function p(t,e){
this.isFulfilled()?e._resolve(t):e._reject(t)}function h(t,e,n,i){
return"function"!=typeof e?r("expecting a function but got "+c.classString(e)):new u(t,e,n,i).promise()
}function f(t){this.accum=t,this.array._gotAccum(t)
;var n=i(this.value,this.array._promise)
;return n instanceof e?(this.array._currentCancellable=n,
n._then(_,void 0,void 0,this,void 0)):_.call(this,n)}function _(t){
var n,r=this.array,i=r._promise,o=l(r._fn)
;i._pushContext(),(n=void 0!==r._eachValues?o.call(i._boundValue(),t,this.index,this.length):o.call(i._boundValue(),this.accum,t,this.index,this.length))instanceof e&&(r._currentCancellable=n)
;var a=i._popContext()
;return s.checkForgottenReturns(n,a,void 0!==r._eachValues?"Promise.each":"Promise.reduce",i),
n}c.inherits(u,n),u.prototype._gotAccum=function(t){
void 0!==this._eachValues&&null!==this._eachValues&&t!==o&&this._eachValues.push(t)
},u.prototype._eachComplete=function(t){
return null!==this._eachValues&&this._eachValues.push(t),this._eachValues
},u.prototype._init=function(){},u.prototype._resolveEmptyArray=function(){
this._resolve(void 0!==this._eachValues?this._eachValues:this._initialValue)
},u.prototype.shouldCopyValues=function(){return!1
},u.prototype._resolve=function(t){
this._promise._resolveCallback(t),this._values=null
},u.prototype._resultCancelled=function(t){
if(t===this._initialValue)return this._cancel()
;this._isResolved()||(this._resultCancelled$(),
this._currentCancellable instanceof e&&this._currentCancellable.cancel(),
this._initialValue instanceof e&&this._initialValue.cancel())
},u.prototype._iterate=function(t){var n,r;this._values=t;var i=t.length
;if(void 0!==this._initialValue?(n=this._initialValue,
r=0):(n=e.resolve(t[0]),r=1),
this._currentCancellable=n,!n.isRejected())for(;r<i;++r){var o={accum:null,
value:t[r],index:r,length:i,array:this};n=n._then(f,void 0,void 0,o,void 0)}
void 0!==this._eachValues&&(n=n._then(this._eachComplete,void 0,void 0,this,void 0)),
n._then(p,p,void 0,n,this)},e.prototype.reduce=function(t,e){
return h(this,t,e,null)},e.reduce=function(t,e,n,r){return h(t,e,n,r)}}},{
"./util":36}],29:[function(t,e,n){"use strict"
;var r,i=t("./util"),o=i.getNativePromise()
;if(i.isNode&&"undefined"==typeof MutationObserver){
var s=global.setImmediate,a=process.nextTick;r=i.isRecentNode?function(t){
s.call(global,t)}:function(t){a.call(process,t)}
}else if("function"==typeof o&&"function"==typeof o.resolve){var c=o.resolve()
;r=function(t){c.then(t)}
}else r="undefined"==typeof MutationObserver||"undefined"!=typeof window&&window.navigator&&(window.navigator.standalone||window.cordova)?"undefined"!=typeof setImmediate?function(t){
setImmediate(t)}:"undefined"!=typeof setTimeout?function(t){setTimeout(t,0)
}:function(){
throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")
}:function(){var t=document.createElement("div"),e={attributes:!0
},n=!1,r=document.createElement("div");new MutationObserver((function(){
t.classList.toggle("foo"),n=!1})).observe(r,e);return function(i){
var o=new MutationObserver((function(){o.disconnect(),i()}))
;o.observe(t,e),n||(n=!0,r.classList.toggle("foo"))}}();e.exports=r},{
"./util":36}],30:[function(t,e,n){"use strict";e.exports=function(e,n,r){
var i=e.PromiseInspection;function o(t){this.constructor$(t)}
t("./util").inherits(o,n),o.prototype._promiseResolved=function(t,e){
return this._values[t]=e,
++this._totalResolved>=this._length&&(this._resolve(this._values),!0)
},o.prototype._promiseFulfilled=function(t,e){var n=new i
;return n._bitField=33554432,n._settledValueField=t,this._promiseResolved(e,n)},
o.prototype._promiseRejected=function(t,e){var n=new i
;return n._bitField=16777216,n._settledValueField=t,this._promiseResolved(e,n)},
e.settle=function(t){
return r.deprecated(".settle()",".reflect()"),new o(t).promise()
},e.prototype.settle=function(){return e.settle(this)}}},{"./util":36}],
31:[function(t,e,n){"use strict";e.exports=function(e,n,r){
var i=t("./util"),o=t("./errors").RangeError,s=t("./errors").AggregateError,a=i.isArray,c={}
;function l(t){
this.constructor$(t),this._howMany=0,this._unwrap=!1,this._initialized=!1}
function u(t,e){
if((0|e)!==e||e<0)return r("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n")
;var n=new l(t),i=n.promise();return n.setHowMany(e),n.init(),i}i.inherits(l,n),
l.prototype._init=function(){if(this._initialized)if(0!==this._howMany){
this._init$(void 0,-5);var t=a(this._values)
;!this._isResolved()&&t&&this._howMany>this._canPossiblyFulfill()&&this._reject(this._getRangeError(this.length()))
}else this._resolve([])},l.prototype.init=function(){
this._initialized=!0,this._init()},l.prototype.setUnwrap=function(){
this._unwrap=!0},l.prototype.howMany=function(){return this._howMany
},l.prototype.setHowMany=function(t){this._howMany=t
},l.prototype._promiseFulfilled=function(t){
return this._addFulfilled(t),this._fulfilled()===this.howMany()&&(this._values.length=this.howMany(),
1===this.howMany()&&this._unwrap?this._resolve(this._values[0]):this._resolve(this._values),
!0)},l.prototype._promiseRejected=function(t){
return this._addRejected(t),this._checkOutcome()
},l.prototype._promiseCancelled=function(){
return this._values instanceof e||null==this._values?this._cancel():(this._addRejected(c),
this._checkOutcome())},l.prototype._checkOutcome=function(){
if(this.howMany()>this._canPossiblyFulfill()){
for(var t=new s,e=this.length();e<this._values.length;++e)this._values[e]!==c&&t.push(this._values[e])
;return t.length>0?this._reject(t):this._cancel(),!0}return!1
},l.prototype._fulfilled=function(){return this._totalResolved
},l.prototype._rejected=function(){return this._values.length-this.length()
},l.prototype._addRejected=function(t){this._values.push(t)
},l.prototype._addFulfilled=function(t){this._values[this._totalResolved++]=t
},l.prototype._canPossiblyFulfill=function(){
return this.length()-this._rejected()},l.prototype._getRangeError=function(t){
var e="Input array must contain at least "+this._howMany+" items but contains only "+t+" items"
;return new o(e)},l.prototype._resolveEmptyArray=function(){
this._reject(this._getRangeError(0))},e.some=function(t,e){return u(t,e)
},e.prototype.some=function(t){return u(this,t)},e._SomePromiseArray=l}},{
"./errors":12,"./util":36}],32:[function(t,e,n){"use strict"
;e.exports=function(t){function e(t){
void 0!==t?(t=t._target(),this._bitField=t._bitField,
this._settledValueField=t._isFateSealed()?t._settledValue():void 0):(this._bitField=0,
this._settledValueField=void 0)}e.prototype._settledValue=function(){
return this._settledValueField};var n=e.prototype.value=function(){
if(!this.isFulfilled())throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n")
;return this._settledValue()},r=e.prototype.error=e.prototype.reason=function(){
if(!this.isRejected())throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n")
;return this._settledValue()},i=e.prototype.isFulfilled=function(){
return 0!=(33554432&this._bitField)},o=e.prototype.isRejected=function(){
return 0!=(16777216&this._bitField)},s=e.prototype.isPending=function(){
return 0==(50397184&this._bitField)},a=e.prototype.isResolved=function(){
return 0!=(50331648&this._bitField)};e.prototype.isCancelled=function(){
return 0!=(8454144&this._bitField)},t.prototype.__isCancelled=function(){
return 65536==(65536&this._bitField)},t.prototype._isCancelled=function(){
return this._target().__isCancelled()},t.prototype.isCancelled=function(){
return 0!=(8454144&this._target()._bitField)},t.prototype.isPending=function(){
return s.call(this._target())},t.prototype.isRejected=function(){
return o.call(this._target())},t.prototype.isFulfilled=function(){
return i.call(this._target())},t.prototype.isResolved=function(){
return a.call(this._target())},t.prototype.value=function(){
return n.call(this._target())},t.prototype.reason=function(){
var t=this._target();return t._unsetRejectionIsUnhandled(),r.call(t)
},t.prototype._value=function(){return this._settledValue()
},t.prototype._reason=function(){
return this._unsetRejectionIsUnhandled(),this._settledValue()
},t.PromiseInspection=e}},{}],33:[function(t,e,n){"use strict"
;e.exports=function(e,n){var r=t("./util"),i=r.errorObj,o=r.isObject
;var s={}.hasOwnProperty;return function(t,a){if(o(t)){
if(t instanceof e)return t;var c=function(t){try{return function(t){
return t.then}(t)}catch(e){return i.e=e,i}}(t);if(c===i){a&&a._pushContext()
;var l=e.reject(c.e);return a&&a._popContext(),l}if("function"==typeof c){
if(function(t){try{return s.call(t,"_promise0")}catch(e){return!1}}(t)){
l=new e(n);return t._then(l._fulfill,l._reject,void 0,l,null),l}
return function(t,o,s){var a=new e(n),c=a;s&&s._pushContext()
;a._captureStackTrace(),s&&s._popContext()
;var l=!0,u=r.tryCatch(o).call(t,(function(t){if(!a)return
;a._resolveCallback(t),a=null}),(function(t){if(!a)return
;a._rejectCallback(t,l,!0),a=null}))
;l=!1,a&&u===i&&(a._rejectCallback(u.e,!0,!0),a=null);return c}(t,c,a)}}return t
}}},{"./util":36}],34:[function(t,e,n){"use strict";e.exports=function(e,n,r){
var i=t("./util"),o=e.TimeoutError;function s(t){this.handle=t}
s.prototype._resultCancelled=function(){clearTimeout(this.handle)}
;var a=function(t){return c(+this).thenReturn(t)},c=e.delay=function(t,i){
var o,c
;return void 0!==i?(o=e.resolve(i)._then(a,null,null,t,void 0),r.cancellation()&&i instanceof e&&o._setOnCancel(i)):(o=new e(n),
c=setTimeout((function(){o._fulfill()
}),+t),r.cancellation()&&o._setOnCancel(new s(c)),
o._captureStackTrace()),o._setAsyncGuaranteed(),o}
;e.prototype.delay=function(t){return c(t,this)};function l(t){
return clearTimeout(this.handle),t}function u(t){
throw clearTimeout(this.handle),t}e.prototype.timeout=function(t,e){var n,a;t=+t
;var c=new s(setTimeout((function(){n.isPending()&&function(t,e,n){var r
;r="string"!=typeof e?e instanceof Error?e:new o("operation timed out"):new o(e),
i.markAsOriginatingFromRejection(r),
t._attachExtraTrace(r),t._reject(r),null!=n&&n.cancel()}(n,e,a)}),t))
;return r.cancellation()?(a=this.then(),
(n=a._then(l,u,void 0,c,void 0))._setOnCancel(c)):n=this._then(l,u,void 0,c,void 0),
n}}},{"./util":36}],35:[function(t,e,n){"use strict"
;e.exports=function(e,n,r,i,o,s){
var a=t("./util"),c=t("./errors").TypeError,l=t("./util").inherits,u=a.errorObj,p=a.tryCatch,h={}
;function f(t){setTimeout((function(){throw t}),0)}function _(t,n){
var i=0,s=t.length,a=new e(o);return function o(){if(i>=s)return a._fulfill()
;var c=function(t){var e=r(t)
;return e!==t&&"function"==typeof t._isDisposable&&"function"==typeof t._getDisposer&&t._isDisposable()&&e._setDisposable(t._getDisposer()),
e}(t[i++]);if(c instanceof e&&c._isDisposable()){try{
c=r(c._getDisposer().tryDispose(n),t.promise)}catch(l){return f(l)}
if(c instanceof e)return c._then(o,f,null,null,null)}o()}(),a}function d(t,e,n){
this._data=t,this._promise=e,this._context=n}function v(t,e,n){
this.constructor$(t,e,n)}function y(t){
return d.isDisposer(t)?(this.resources[this.index]._setDisposable(t),
t.promise()):t}function m(t){this.length=t,this.promise=null,this[t-1]=null}
d.prototype.data=function(){return this._data},d.prototype.promise=function(){
return this._promise},d.prototype.resource=function(){
return this.promise().isFulfilled()?this.promise().value():h
},d.prototype.tryDispose=function(t){var e=this.resource(),n=this._context
;void 0!==n&&n._pushContext();var r=e!==h?this.doDispose(e,t):null
;return void 0!==n&&n._popContext(),
this._promise._unsetDisposable(),this._data=null,r},d.isDisposer=function(t){
return null!=t&&"function"==typeof t.resource&&"function"==typeof t.tryDispose},
l(v,d),v.prototype.doDispose=function(t,e){return this.data().call(t,t,e)
},m.prototype._resultCancelled=function(){for(var t=this.length,n=0;n<t;++n){
var r=this[n];r instanceof e&&r.cancel()}},e.using=function(){
var t=arguments.length
;if(t<2)return n("you must pass at least 2 arguments to Promise.using")
;var i,o=arguments[t-1]
;if("function"!=typeof o)return n("expecting a function but got "+a.classString(o))
;var c=!0
;2===t&&Array.isArray(arguments[0])?(t=(i=arguments[0]).length,c=!1):(i=arguments,
t--);for(var l=new m(t),h=0;h<t;++h){var f=i[h];if(d.isDisposer(f)){var v=f
;(f=f.promise())._setDisposable(v)}else{var g=r(f)
;g instanceof e&&(f=g._then(y,null,null,{resources:l,index:h},void 0))}l[h]=f}
var b=new Array(l.length);for(h=0;h<b.length;++h)b[h]=e.resolve(l[h]).reflect()
;var w=e.all(b).then((function(t){for(var e=0;e<t.length;++e){var n=t[e]
;if(n.isRejected())return u.e=n.error(),u
;if(!n.isFulfilled())return void w.cancel();t[e]=n.value()}
C._pushContext(),o=p(o);var r=c?o.apply(void 0,t):o(t),i=C._popContext()
;return s.checkForgottenReturns(r,i,"Promise.using",C),r
})),C=w.lastly((function(){var t=new e.PromiseInspection(w);return _(l,t)}))
;return l.promise=C,C._setOnCancel(l),C},e.prototype._setDisposable=function(t){
this._bitField=131072|this._bitField,this._disposer=t
},e.prototype._isDisposable=function(){return(131072&this._bitField)>0
},e.prototype._getDisposer=function(){return this._disposer
},e.prototype._unsetDisposable=function(){this._bitField=-131073&this._bitField,
this._disposer=void 0},e.prototype.disposer=function(t){
if("function"==typeof t)return new v(t,this,i());throw new c}}},{"./errors":12,
"./util":36}],36:[function(t,e,n){"use strict"
;var r=t("./es5"),i="undefined"==typeof navigator,o={e:{}
},s,a="undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:void 0!==this?this:null
;function c(){try{var t=s;return s=null,t.apply(this,arguments)}catch(e){
return o.e=e,o}}function l(t){return s=t,c}var u=function(t,e){
var n={}.hasOwnProperty;function r(){
for(var r in this.constructor=t,this.constructor$=e,
e.prototype)n.call(e.prototype,r)&&"$"!==r.charAt(r.length-1)&&(this[r+"$"]=e.prototype[r])
}return r.prototype=e.prototype,t.prototype=new r,t.prototype};function p(t){
return null==t||!0===t||!1===t||"string"==typeof t||"number"==typeof t}
function h(t){return"function"==typeof t||"object"==typeof t&&null!==t}
function f(t){return p(t)?new Error(k(t)):t}function _(t,e){
var n,r=t.length,i=new Array(r+1);for(n=0;n<r;++n)i[n]=t[n];return i[n]=e,i}
function d(t,e,n){if(!r.isES5)return{}.hasOwnProperty.call(t,e)?t[e]:void 0
;var i=Object.getOwnPropertyDescriptor(t,e)
;return null!=i?null==i.get&&null==i.set?i.value:n:void 0}function v(t,e,n){
if(p(t))return t;var i={value:n,configurable:!0,enumerable:!1,writable:!0}
;return r.defineProperty(t,e,i),t}function y(t){throw t}var m=function(){
var t=[Array.prototype,Object.prototype,Function.prototype],e=function(e){
for(var n=0;n<t.length;++n)if(t[n]===e)return!0;return!1};if(r.isES5){
var n=Object.getOwnPropertyNames;return function(t){
for(var i=[],o=Object.create(null);null!=t&&!e(t);){var s;try{s=n(t)}catch(u){
return i}for(var a=0;a<s.length;++a){var c=s[a];if(!o[c]){o[c]=!0
;var l=Object.getOwnPropertyDescriptor(t,c)
;null!=l&&null==l.get&&null==l.set&&i.push(c)}}t=r.getPrototypeOf(t)}return i}}
var i={}.hasOwnProperty;return function(n){if(e(n))return[];var r=[]
;t:for(var o in n)if(i.call(n,o))r.push(o);else{
for(var s=0;s<t.length;++s)if(i.call(t[s],o))continue t;r.push(o)}return r}
}(),g=/this\s*\.\s*\S+\s*=/;function b(t){try{if("function"==typeof t){
var e=r.names(t.prototype),n=r.isES5&&e.length>1,i=e.length>0&&!(1===e.length&&"constructor"===e[0]),o=g.test(t+"")&&r.names(t).length>0
;if(n||i||o)return!0}return!1}catch(s){return!1}}function w(t){function e(){}
e.prototype=t;var n=new e;function r(){return typeof n.foo}return r(),r(),t}
var C=/^[a-z$_][a-z$_0-9]*$/i;function j(t){return C.test(t)}function E(t,e,n){
for(var r=new Array(t),i=0;i<t;++i)r[i]=e+i+n;return r}function k(t){try{
return t+""}catch(e){return"[no string representation]"}}function F(t){
return t instanceof Error||null!==t&&"object"==typeof t&&"string"==typeof t.message&&"string"==typeof t.name
}function T(t){try{v(t,"isOperational",!0)}catch(e){}}function x(t){
return null!=t&&(t instanceof Error.__BluebirdErrorTypes__.OperationalError||!0===t.isOperational)
}function P(t){return F(t)&&r.propertyIsWritable(t,"stack")}
var R="stack"in new Error?function(t){return P(t)?t:new Error(k(t))
}:function(t){if(P(t))return t;try{throw new Error(k(t))}catch(e){return e}}
;function S(t){return{}.toString.call(t)}function O(t,e,n){
for(var i=r.names(t),o=0;o<i.length;++o){var s=i[o];if(n(s))try{
r.defineProperty(e,s,r.getDescriptor(t,s))}catch(a){}}}var A=function(t){
return r.isArray(t)?t:null};if("undefined"!=typeof Symbol&&Symbol.iterator){
var D="function"==typeof Array.from?function(t){return Array.from(t)
}:function(t){
for(var e,n=[],r=t[Symbol.iterator]();!(e=r.next()).done;)n.push(e.value)
;return n};A=function(t){
return r.isArray(t)?t:null!=t&&"function"==typeof t[Symbol.iterator]?D(t):null}}
var V="undefined"!=typeof process&&"[object process]"===S(process).toLowerCase(),I="undefined"!=typeof process&&void 0!==process.env
;function L(t){return I?process.env[t]:void 0}function H(){
if("function"==typeof Promise)try{var t=new Promise((function(){}))
;if("[object Promise]"==={}.toString.call(t))return Promise}catch(e){}}
function N(t,e){return t.bind(e)}var U={isClass:b,isIdentifier:j,
inheritedDataKeys:m,getDataPropertyOrDefault:d,thrower:y,isArray:r.isArray,
asArray:A,notEnumerableProp:v,isPrimitive:p,isObject:h,isError:F,canEvaluate:i,
errorObj:o,tryCatch:l,inherits:u,withAppended:_,maybeWrapAsError:f,
toFastProperties:w,filledRange:E,toString:k,canAttachTrace:P,
ensureErrorObject:R,originatesFromRejection:x,markAsOriginatingFromRejection:T,
classString:S,copyDescriptors:O,
hasDevTools:"undefined"!=typeof chrome&&chrome&&"function"==typeof chrome.loadTimes,
isNode:V,hasEnvVariables:I,env:L,global:a,getNativePromise:H,domainBind:N}
;U.isRecentNode=U.isNode&&function(){var t
;return process.versions&&process.versions.node?t=process.versions.node.split(".").map(Number):process.version&&(t=process.version.split(".").map(Number)),
0===t[0]&&t[1]>10||t[0]>0}(),U.isNode&&U.toFastProperties(process);try{
throw new Error}catch(B){U.lastLineError=B}e.exports=U},{"./es5":13}]
},{},[4])(4)
})),"undefined"!=typeof window&&null!==window?window.P=window.Promise:"undefined"!=typeof self&&null!==self&&(self.P=self.Promise);