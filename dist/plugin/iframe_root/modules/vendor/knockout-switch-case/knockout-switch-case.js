/**
 * @license SWITCH/CASE binding for Knockout http://knockoutjs.com/
 * (c) Michael Best
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Version 2.1.0
 */
!function(e,n){
"function"==typeof define&&define.amd?define(["knockout"],n):n(e.ko)
}(this,(function(e){var n
;if(!e.virtualElements)throw Error("Switch-case requires at least Knockout 2.1")
;var i=e.virtualElements,t=e.bindingFlags||{},s=e.bindingRewriteValidators||e.jsonExpressionRewriting.bindingRewriteValidators,a=e.utils.unwrapObservable,r=e.bindingHandlers,c={}
;function o(n,i){var t=a(i.$switchValueAccessor())
;return"boolean"==typeof t?n?t:!t:"boolean"==typeof n?n:n instanceof Array?-1!==e.utils.arrayIndexOf(n,t):n==t
}function u(e,n){return!o(e,n)}function l(e){return function(){return e}}
function d(i,t,s){var c=t?u:o;return i||(i="if"),s||(s=l),{flags:r[i].flags,
init:function(t,o,u,l,d){
if(!d.$switchSkipNextArray)throw Error("case binding must only be used with a switch binding")
;if(d.$switchIndex!==n)throw Error("case binding cannot be nested")
;if(d.$switchIndex=d.$switchSkipNextArray.push(e.observable(!1))-1,
d.$caseValue=e.observable(),e.computed((function(){
var e,n,i,t=d.$switchIndex,s=t===d.$switchSkipNextArray.length-1
;if(t&&d.$switchSkipNextArray[t-1]())e=!1,n=!0;else{var r=a(o())
;r===d.$else?(e=d.$switchDefault()||s,n=!1):i=n=e=c(r,d)}
d.$caseValue(e),d.$switchSkipNextArray[t](n),
i?d.$switchDefault(!1):!n&&s&&d.$switchDefault(!0)}),null,{
disposeWhenNodeIsRemoved:t}),r[i].init)return r[i].init(t,s(d.$caseValue),u,l,d)
},update:function(e,n,t,a,c){
if(r[i].update)return r[i].update(e,s(c.$caseValue),t,a,c)}}}function f(e,n,t){
return i.allowedBindings[e]&&(i.allowedBindings[t]=!0),d(e,"casenot"===n)}
function h(e,n,i){return f(n,e,i)}function w(e,n){
r[e]=d("if",n),s[e]=!1,i.allowedBindings[e]=!0,
r[e].makeSubkeyHandler=h,r[e].getNamespacedHandler=f}r.switch={
flags:t.contentBind|t.canUseVirtual|t.noValue,init:function(t,s,r,o,u){var l={
$switchSkipNextArray:[],$switchValueAccessor:s,$switchDefault:e.observable(!0),
$default:c,$else:c},d=[];e.computed((function(){var n=a(s())
;l.$value=n,e.utils.arrayForEach(d,(function(e){e.$value=n}))}),null,{
disposeWhenNodeIsRemoved:t})
;for(var f,h=i.firstChild(t);f=h;)switch(h=i.nextSibling(f),f.nodeType){case 1:
case 8:var w=u.extend(l)
;w.$switchIndex=n,e.applyBindings(w,f),w.$switchIndex!==n&&d.push(w)}return{
controlsDescendantBindings:!0}},preprocess:function(e){return e||"true"}
},s.switch=!1,
i.allowedBindings.switch=!0,w("case"),w("casenot",!0),r["case.visible"]=d("visible"),
r["casenot.visible"]=d("visible",!0),r.switch.makeCaseHandler=d}));