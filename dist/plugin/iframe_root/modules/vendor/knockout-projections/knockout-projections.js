/*! Knockout projections plugin - version 1.1.0
------------------------------------------------------------------------------
Copyright (c) Microsoft Corporation
All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 
THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions and limitations under the License.
------------------------------------------------------------------------------
*/
!function(t,e){"use strict";var i={};function n(t,e,i,n,s,p,a){this.inputItem=e,
this.stateArrayIndex=i,
this.mappingOptions=s,this.arrayOfState=p,this.outputObservableArray=a,
this.outputArray=this.outputObservableArray.peek(),
this.isIncluded=null,this.suppressNotification=!1,
this.outputArrayIndex=t.observable(n),
this.disposeFuncFromMostRecentMapping=null,
this.mappedValueComputed=t.computed(this.mappingEvaluator,this),
this.mappedValueComputed.subscribe(this.onMappingResultChanged,this),
this.previousMappedValue=this.mappedValueComputed.peek()}function s(t,e){
if(!t)return null;switch(t.status){case"added":return t.index;case"deleted":
return t.index+e;default:throw new Error("Unknown diff status: "+t.status)}}
function p(t,e,i,s,p,a,r,o,u){
var d="number"==typeof e.moved,l=d?i[e.moved]:new n(t,e.value,s,p,a,r,o)
;return r.splice(s,0,l),
l.isIncluded&&u.splice(p,0,l.mappedValueComputed.peek()),
d&&(l.stateArrayIndex=s,l.setOutputArrayIndexSilently(p)),l}
function a(t,e,i,n,s){var p=e.splice(i,1)[0]
;p.isIncluded&&s.splice(n,1),"number"!=typeof t.moved&&p.dispose()}
function r(t,e,i){
return t.stateArrayIndex=e,t.setOutputArrayIndexSilently(i),i+(t.isIncluded?1:0)
}function o(t,e){var i=[],o=[],u=t.observableArray(o),d=this.peek()
;if("function"==typeof e&&(e={mapping:e}),e.mappingWithDisposeCallback){
if(e.mapping||e.disposeItem)throw new Error("'mappingWithDisposeCallback' cannot be used in conjunction with 'mapping' or 'disposeItem'.")
}else if(!e.mapping)throw new Error("Specify either 'mapping' or 'mappingWithDisposeCallback'.")
;for(var c=0;c<d.length;c++){
var h=d[c],m=new n(t,h,c,o.length,e,i,u),f=m.mappedValueComputed.peek()
;i.push(m),m.isIncluded&&o.push(f)}var y=function(t,e,i,n,o,u){
return e.subscribe((function(e){if(e.length){for(var d=function(t,e){
for(var i={},n=0;n<t.length;n++){var s=t[n]
;"added"===s.status&&"number"==typeof s.moved&&(i[s.moved]=e[s.moved])}return i
}(e,i),l=0,c=e[0],h=0,m=c&&function(t,e,i){
return i.length&&e[t.index]?e[t.index].outputArrayIndex.peek():i.length
}(c,i,n),f=c.index;c||f<i.length;f++)if(s(c,h)===f){switch(c.status){
case"added":p(t,c,d,f,m,u,i,o,n).isIncluded&&m++,h++;break;case"deleted":
a(c,i,f,m,n),h--,f--;break;default:
throw new Error("Unknown diff status: "+c.status)}c=e[++l]
}else f<i.length&&(m=r(i[f],f,m));o.valueHasMutated()}}),null,"arrayChange")
}(t,this,i,o,u,e),g=t.computed(u).extend({trackArrayChanges:!0}),v=g.dispose
;return g.dispose=function(){y.dispose(),t.utils.arrayForEach(i,(function(t){
t.dispose()})),v.call(this,arguments)},l(t,g),g}function u(t,e){
return o.call(this,t,(function(t){return e(t)?t:i}))}
n.prototype.dispose=function(){
this.mappedValueComputed.dispose(),this.disposeResultFromMostRecentEvaluation()
},n.prototype.disposeResultFromMostRecentEvaluation=function(){
if(this.disposeFuncFromMostRecentMapping&&(this.disposeFuncFromMostRecentMapping(),
this.disposeFuncFromMostRecentMapping=null),this.mappingOptions.disposeItem){
var t=this.mappedValueComputed();this.mappingOptions.disposeItem(t)}
},n.prototype.mappingEvaluator=function(){var t
;if(null!==this.isIncluded&&this.disposeResultFromMostRecentEvaluation(),
this.mappingOptions.mapping)t=this.mappingOptions.mapping(this.inputItem,this.outputArrayIndex);else{
if(!this.mappingOptions.mappingWithDisposeCallback)throw new Error("No mapping callback given.")
;var e=this.mappingOptions.mappingWithDisposeCallback(this.inputItem,this.outputArrayIndex)
;if(!("mappedValue"in e))throw new Error("Return value from mappingWithDisposeCallback should have a 'mappedItem' property.")
;t=e.mappedValue,this.disposeFuncFromMostRecentMapping=e.dispose}var n=t!==i
;return this.isIncluded!==n&&(null!==this.isIncluded&&this.moveSubsequentItemsBecauseInclusionStateChanged(n),
this.isIncluded=n),t},n.prototype.onMappingResultChanged=function(t){
t!==this.previousMappedValue&&(this.isIncluded&&this.outputArray.splice(this.outputArrayIndex.peek(),1,t),
this.suppressNotification||this.outputObservableArray.valueHasMutated(),
this.previousMappedValue=t)
},n.prototype.moveSubsequentItemsBecauseInclusionStateChanged=function(t){
var e,i,n=this.outputArrayIndex.peek()
;if(t)for(this.outputArray.splice(n,0,null),
e=this.stateArrayIndex+1;e<this.arrayOfState.length;e++)(i=this.arrayOfState[e]).setOutputArrayIndexSilently(i.outputArrayIndex.peek()+1);else for(this.outputArray.splice(n,1),
e=this.stateArrayIndex+1;e<this.arrayOfState.length;e++)(i=this.arrayOfState[e]).setOutputArrayIndexSilently(i.outputArrayIndex.peek()-1)
},n.prototype.setOutputArrayIndexSilently=function(t){
this.suppressNotification=!0,
this.outputArrayIndex(t),this.suppressNotification=!1}
;var d="_ko.projections.cache";function l(t,e){return t.utils.extend(e,t[d]),e}
function c(t){t.projections={_exclusionMarker:i},function(t){function e(t,e){
return function(){
return e.apply(this,[t].concat(Array.prototype.slice.call(arguments,0)))}}t[d]={
map:e(t,o),filter:e(t,u)}}(t),l(t,t.observableArray.fn)}!function(){
if("undefined"!=typeof module&&void 0!==module.exports){
var e=require("knockout");c(e),module.exports=e
}else"function"==typeof define&&define.amd?define(["knockout"],c):"ko"in t&&c(t.ko)
}()}(this);