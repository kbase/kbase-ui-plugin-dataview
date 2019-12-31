!function(e){
"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?e(require("knockout"),exports):"function"==typeof define&&define.amd?define(["knockout","exports"],e):e(ko,ko.validation={})
}((function(e,t){
if(void 0===e)throw new Error("Knockout is required, please ensure it is loaded before loading this validation plug-in")
;e.validation=t
;var r=e.validation,i=e.utils,a=i.unwrapObservable,n=i.arrayForEach,s=i.extend,u={
registerExtenders:!0,messagesOnModified:!0,errorsAsTitle:!0,
errorsAsTitleOnModified:!1,messageTemplate:null,insertMessages:!0,
parseInputAttributes:!1,writeInputAttributes:!1,decorateInputElement:!1,
decorateElementOnModified:!0,errorClass:null,
errorElementClass:"validationElement",errorMessageClass:"validationMessage",
allowHtmlMessages:!1,grouping:{deep:!1,observable:!0,live:!1},validate:{}
},o=s({},u)
;o.html5Attributes=["required","pattern","min","max","step"],o.html5InputTypes=["email","number","date"],
o.reset=function(){s(o,u)},r.configuration=o,r.utils=function(){
var e=(new Date).getTime(),t={};return{isArray:function(e){
return e.isArray||"[object Array]"===Object.prototype.toString.call(e)},
isObject:function(e){return null!==e&&"object"==typeof e},isNumber:function(e){
return!isNaN(e)},isObservableArray:function(e){
return!!e&&"function"==typeof e.remove&&"function"==typeof e.removeAll&&"function"==typeof e.destroy&&"function"==typeof e.destroyAll&&"function"==typeof e.indexOf&&"function"==typeof e.replace
},values:function(e){var t=[];for(var r in e)e.hasOwnProperty(r)&&t.push(e[r])
;return t},getValue:function(e){return"function"==typeof e?e():e},
hasAttribute:function(e,t){return null!==e.getAttribute(t)},
getAttribute:function(e,t){return e.getAttribute(t)},
setAttribute:function(e,t,r){return e.setAttribute(t,r)},
isValidatable:function(e){return!!(e&&e.rules&&e.isValid&&e.isModified)},
insertAfter:function(e,t){e.parentNode.insertBefore(t,e.nextSibling)},
newId:function(){return e+=1},getConfigOptions:function(e){
return r.utils.contextFor(e)||r.configuration},setDomData:function(e,i){
var a=e.__ko_validation__;a||(e.__ko_validation__=a=r.utils.newId()),t[a]=i},
getDomData:function(e){var r=e.__ko_validation__;if(r)return t[r]},
contextFor:function(e){switch(e.nodeType){case 1:case 8:
var t=r.utils.getDomData(e);if(t)return t
;if(e.parentNode)return r.utils.contextFor(e.parentNode)}},
isEmptyVal:function(e){return void 0===e||(null===e||(""===e||void 0))},
getOriginalElementTitle:function(e){
var t=r.utils.getAttribute(e,"data-orig-title"),i=e.title
;return r.utils.hasAttribute(e,"data-orig-title")?t:i},async:function(e){
window.setImmediate?window.setImmediate(e):window.setTimeout(e,0)},
forEach:function(e,t){if(r.utils.isArray(e))return n(e,t)
;for(var i in e)e.hasOwnProperty(i)&&t(e[i],i)}}}();var l=function(){
var t=0,u=r.configuration,o=r.utils;function l(e){
n(e.subscriptions,(function(e){e.dispose()})),e.subscriptions=[]}
function d(t,r){r.validatables=[],l(r),function t(r,i,a){
var n=[],s=r.peek?r.peek():r;if(!0===r.__kv_traversed)return
;i.options.deep&&(r.__kv_traversed=!0,i.flagged.push(r))
;a=void 0!==a?a:i.options.deep?1:-1,
e.isObservable(r)&&(r.errors||o.isValidatable(r)||r.extend({validatable:!0
}),i.validatables.push(r),
i.options.live&&o.isObservableArray(r)&&i.subscriptions.push(r.subscribe((function(){
i.graphMonitor.valueHasMutated()}))))
;s&&!s._destroy&&(o.isArray(s)?n=s:o.isObject(s)&&(n=o.values(s)))
;0!==a&&o.forEach(n,(function(r){
!r||r.nodeType||e.isComputed(r)&&!r.rules||t(r,i,a+1)}))}(t,r),function(e){
e.options.deep&&(n(e.flagged,(function(e){delete e.__kv_traversed
})),e.flagged.length=0),e.options.live||l(e)}(r)}function f(e){var t=[]
;return n(e,(function(e){
o.isValidatable(e)&&!e.isValid()&&t.push(e.error.peek())})),t}return{
init:function(e,i){
t>0&&!i||((e=e||{}).errorElementClass=e.errorElementClass||e.errorClass||u.errorElementClass,
e.errorMessageClass=e.errorMessageClass||e.errorClass||u.errorMessageClass,
s(u,e),u.registerExtenders&&r.registerExtenders(),t=1)},
reset:r.configuration.reset,group:function(t,r){var a={
options:r=s(s({},u.grouping),r),graphMonitor:e.observable(),flagged:[],
subscriptions:[],validatables:[]},l=null
;return(l=r.observable?e.computed((function(){
return a.graphMonitor(),d(t,a),f(a.validatables)})):function(){
return d(t,a),f(a.validatables)}).showAllMessages=function(e){
void 0===e&&(e=!0),l.forEach((function(t){o.isValidatable(t)&&t.isModified(e)}))
},l.isAnyMessageShown=function(){return!!l.find((function(e){
return o.isValidatable(e)&&!e.isValid()&&e.isModified()}))
},l.filter=function(e){return e=e||function(){return!0
},l(),i.arrayFilter(a.validatables,e)},l.find=function(e){
return e=e||function(){return!0},l(),i.arrayFirst(a.validatables,e)
},l.forEach=function(e){e=e||function(){},l(),n(a.validatables,e)
},l.map=function(e){return e=e||function(e){return e
},l(),i.arrayMap(a.validatables,e)},l._updateState=function(e){
if(!o.isObject(e))throw new Error("An object is required.")
;if(t=e,!r.observable)return d(e,a),f(a.validatables)
;a.graphMonitor.valueHasMutated()},l},formatMessage:function(e,t,r){
if(o.isObject(t)&&t.typeAttr&&(t=t.value),"function"==typeof e)return e(t,r)
;var i=a(t)
;return null==i&&(i=[]),o.isArray(i)||(i=[i]),e.replace(/{(\d+)}/gi,(function(e,t){
return void 0!==i[t]?i[t]:e}))},addRule:function(e,t){return e.extend({
validatable:!0}),!!i.arrayFirst(e.rules(),(function(e){
return e.rule&&e.rule===t.rule}))||e.rules.push(t),e},
addAnonymousRule:function(e,t){
void 0===t.message&&(t.message="Error"),t.onlyIf&&(t.condition=t.onlyIf),
r.addRule(e,t)},addExtender:function(t){e.extenders[t]=function(e,i){
return i&&(i.message||i.onlyIf)?r.addRule(e,{rule:t,message:i.message,
params:!!o.isEmptyVal(i.params)||i.params,condition:i.onlyIf}):r.addRule(e,{
rule:t,params:i})}},registerExtenders:function(){
if(u.registerExtenders)for(var t in r.rules)r.rules.hasOwnProperty(t)&&(e.extenders[t]||r.addExtender(t))
},insertValidationMessage:function(e){var t=document.createElement("SPAN")
;return t.className=o.getConfigOptions(e).errorMessageClass,o.insertAfter(e,t),t
},parseInputValidationAttributes:function(e,t){
n(r.configuration.html5Attributes,(function(i){if(o.hasAttribute(e,i)){
var a=e.getAttribute(i)||!0;if("min"===i||"max"===i){
var n=e.getAttribute("type");void 0!==n&&n||(n="text"),a={typeAttr:n,value:a}}
r.addRule(t(),{rule:i,params:a})}}));var i=e.getAttribute("type")
;n(r.configuration.html5InputTypes,(function(e){e===i&&r.addRule(t(),{
rule:"date"===e?"dateISO":e,params:!0})}))},
writeInputValidationAttributes:function(t,a){var s=a();if(s&&s.rules){
var u=s.rules();n(r.configuration.html5Attributes,(function(r){
var a=i.arrayFirst(u,(function(e){
return e.rule&&e.rule.toLowerCase()===r.toLowerCase()}));a&&e.computed({
read:function(){var i=e.unwrap(a.params)
;"pattern"===a.rule&&i instanceof RegExp&&(i=i.source),t.setAttribute(r,i)},
disposeWhenNodeIsRemoved:t})})),u=null}},
makeBindingHandlerValidatable:function(t){var r=e.bindingHandlers[t].init
;e.bindingHandlers[t].init=function(t,i,a,n,s){
return r(t,i,a,n,s),e.bindingHandlers.validationCore.init(t,i,a,n,s)}},
setRules:function(t,i){var n=function(t,i){
if(t&&i)for(var s in i)if(i.hasOwnProperty(s)){var u=i[s];if(t[s]){
var l=t[s],d=a(l),f={},c={}
;for(var p in u)u.hasOwnProperty(p)&&(r.rules[p]?f[p]=u[p]:c[p]=u[p])
;if(e.isObservable(l)&&l.extend(f),
d&&o.isArray(d))for(var v=0;v<d.length;v++)n(d[v],c);else n(d,c)}}};n(t,i)}}}()
;function d(e){var t="max"===e;return function(i,a){
if(r.utils.isEmptyVal(i))return!0;var n,s,u,o,l
;switch(void 0===a.typeAttr?(s="text",
n=a):(s=a.typeAttr,n=a.value),isNaN(n)||n instanceof Date||(s="number"),
s.toLowerCase()){case"week":
if(u=/^(\d{4})-W(\d{2})$/,null===(o=i.match(u)))throw new Error("Invalid value for "+e+" attribute for week input.  Should look like '2000-W33' http://www.w3.org/TR/html-markup/input.week.html#input.week.attrs.min")
;return!!(l=n.match(u))&&(t?o[1]<l[1]||o[1]===l[1]&&o[2]<=l[2]:o[1]>l[1]||o[1]===l[1]&&o[2]>=l[2])
;case"month":
if(u=/^(\d{4})-(\d{2})$/,null===(o=i.match(u)))throw new Error("Invalid value for "+e+" attribute for month input.  Should look like '2000-03' http://www.w3.org/TR/html-markup/input.month.html#input.month.attrs.min")
;return!!(l=n.match(u))&&(t?o[1]<l[1]||o[1]===l[1]&&o[2]<=l[2]:o[1]>l[1]||o[1]===l[1]&&o[2]>=l[2])
;case"number":case"range":
return t?!isNaN(i)&&parseFloat(i)<=parseFloat(n):!isNaN(i)&&parseFloat(i)>=parseFloat(n)
;default:return t?i<=n:i>=n}}}function f(e,t,i){
return!!t.validator(e(),void 0===i.params||a(i.params))||(e.setError(r.formatMessage(i.message||t.message,a(i.params),e)),
!1)}function c(e,t,i){e.isValidating(!0);var n=function(n){var s=!1,u=""
;e.__valid__()?(n.message?(s=n.isValid,
u=n.message):s=n,s||(e.error(r.formatMessage(u||i.message||t.message,a(i.params),e)),
e.__valid__(s)),e.isValidating(!1)):e.isValidating(!1)}
;r.utils.async((function(){t.validator(e(),void 0===i.params||a(i.params),n)}))}
s(e.validation,l),r.rules={},r.rules.required={validator:function(e,t){var r
;return null==e?!t:(r=e,
"string"==typeof e&&(r=String.prototype.trim?e.trim():e.replace(/^\s+|\s+$/g,"")),
!t||(r+"").length>0)},message:"This field is required."},r.rules.min={
validator:d("min"),message:"Please enter a value greater than or equal to {0}."
},r.rules.max={validator:d("max"),
message:"Please enter a value less than or equal to {0}."},r.rules.minLength={
validator:function(e,t){
return!!r.utils.isEmptyVal(e)||(r.utils.isNumber(e)?""+e:e).length>=t},
message:"Please enter at least {0} characters."},r.rules.maxLength={
validator:function(e,t){
return!!r.utils.isEmptyVal(e)||(r.utils.isNumber(e)?""+e:e).length<=t},
message:"Please enter no more than {0} characters."},r.rules.pattern={
validator:function(e,t){
return r.utils.isEmptyVal(e)||null!==e.toString().match(t)},
message:"Please check this value."},r.rules.step={validator:function(e,t){
if(r.utils.isEmptyVal(e)||"any"===t)return!0;var i=100*e%(100*t)
;return Math.abs(i)<1e-5||Math.abs(1-i)<1e-5},
message:"The value must increment by {0}."},r.rules.email={
validator:function(e,t){
return!t||(r.utils.isEmptyVal(e)||t&&/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(e))
},message:"Please enter a proper email address."},r.rules.date={
validator:function(e,t){
return!t||(r.utils.isEmptyVal(e)||t&&!/Invalid|NaN/.test(new Date(e)))},
message:"Please enter a proper date."},r.rules.dateISO={validator:function(e,t){
return!t||(r.utils.isEmptyVal(e)||t&&/^\d{4}[-/](?:0?[1-9]|1[012])[-/](?:0?[1-9]|[12][0-9]|3[01])$/.test(e))
},message:"Please enter a proper date."},r.rules.number={
validator:function(e,t){
return!t||(r.utils.isEmptyVal(e)||t&&/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e))
},message:"Please enter a number."},r.rules.digit={validator:function(e,t){
return!t||(r.utils.isEmptyVal(e)||t&&/^\d+$/.test(e))},
message:"Please enter a digit."},r.rules.phoneUS={validator:function(e,t){
return!t||(!!r.utils.isEmptyVal(e)||"string"==typeof e&&(e=e.replace(/\s+/g,""),
t&&e.length>9&&e.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/)))
},message:"Please specify a valid phone number."},r.rules.equal={
validator:function(e,t){var i=t;return e===r.utils.getValue(i)},
message:"Values must equal."},r.rules.notEqual={validator:function(e,t){var i=t
;return e!==r.utils.getValue(i)},message:"Please choose another value."
},r.rules.unique={validator:function(e,t){
var a=r.utils.getValue(t.collection),n=r.utils.getValue(t.externalValue),s=0
;return!e||!a||(i.arrayFilter(a,(function(r){
e===(t.valueAccessor?t.valueAccessor(r):r)&&s++})),s<(n?1:2))},
message:"Please make sure the value is unique."
},r.registerExtenders(),e.bindingHandlers.validationCore={
init:function(t,i,a,n,s){var u=r.utils.getConfigOptions(t),o=i()
;if(u.parseInputAttributes&&r.utils.async((function(){
r.parseInputValidationAttributes(t,i)
})),u.insertMessages&&r.utils.isValidatable(o)){
var l=r.insertValidationMessage(t)
;u.messageTemplate?e.renderTemplate(u.messageTemplate,{field:o
},null,l,"replaceNode"):e.applyBindingsToNode(l,{validationMessage:o})}
u.writeInputAttributes&&r.utils.isValidatable(o)&&r.writeInputValidationAttributes(t,i),
u.decorateInputElement&&r.utils.isValidatable(o)&&e.applyBindingsToNode(t,{
validationElement:o})}
},r.makeBindingHandlerValidatable("value"),r.makeBindingHandlerValidatable("checked"),
e.bindingHandlers.textInput&&r.makeBindingHandlerValidatable("textInput"),
r.makeBindingHandlerValidatable("selectedOptions"),
e.bindingHandlers.validationMessage={update:function(t,n){
var s,u,o=n(),l=r.utils.getConfigOptions(t);a(o)
;if(null==o)throw new Error("Cannot bind validationMessage to undefined value. data-bind expression: "+t.getAttribute("data-bind"))
;s=o.isModified&&o.isModified(),u=o.isValid&&o.isValid();var d=null
;l.messagesOnModified&&!s||(d=u?null:o.error)
;var f=!(l.messagesOnModified&&!s)&&!u,c="none"!==t.style.display
;l.allowHtmlMessages?i.setHtml(t,d):e.bindingHandlers.text.update(t,(function(){
return d})),c&&!f?t.style.display="none":!c&&f&&(t.style.display="")}
},e.bindingHandlers.validationElement={update:function(t,i,n){
var s,u,o=i(),l=r.utils.getConfigOptions(t);a(o)
;if(null==o)throw new Error("Cannot bind validationElement to undefined value. data-bind expression: "+t.getAttribute("data-bind"))
;s=o.isModified&&o.isModified(),u=o.isValid&&o.isValid()
;e.bindingHandlers.css.update(t,(function(){
var e={},t=!(l.decorateElementOnModified&&!s)&&!u
;return e[l.errorElementClass]=t,e
}),n),l.errorsAsTitle&&e.bindingHandlers.attr.update(t,(function(){
var e=!l.errorsAsTitleOnModified||s,i=r.utils.getOriginalElementTitle(t)
;return e&&!u?{title:o.error,"data-orig-title":i}:!e||u?{title:i,
"data-orig-title":null}:void 0}))}},e.bindingHandlers.validationOptions={
init:function(e,t,i,n,u){var o=a(t());if(o){var l=s({},r.configuration)
;s(l,o),r.utils.setDomData(e,l)}}},e.extenders.validation=function(e,t){
return n(r.utils.isArray(t)?t:[t],(function(t){r.addAnonymousRule(e,t)})),e
},e.extenders.validatable=function(t,i){if(r.utils.isObject(i)||(i={enable:i
}),"enable"in i||(i.enable=!0),i.enable&&!r.utils.isValidatable(t)){
var a=r.configuration.validate||{},n={throttleEvaluation:i.throttle||a.throttle}
;t.error=e.observable(null),
t.rules=e.observableArray(),t.isValidating=e.observable(!1),
t.__valid__=e.observable(!0),
t.isModified=e.observable(!1),t.isValid=e.computed(t.__valid__),
t.setError=function(e){var r=t.error.peek(),i=t.__valid__.peek()
;t.error(e),t.__valid__(!1),r===e||i||t.isValid.notifySubscribers()
},t.clearError=function(){return t.error(null),t.__valid__(!0),t}
;var u=t.subscribe((function(){t.isModified(!0)})),o=e.computed(s({
read:function(){t(),t.rules();return r.validateObservable(t),!0}},n))
;s(o,n),t._disposeValidation=function(){t.isValid.dispose(),t.rules.removeAll(),
u.dispose(),
o.dispose(),delete t.rules,delete t.error,delete t.isValid,delete t.isValidating,
delete t.__valid__,
delete t.isModified,delete t.setError,delete t.clearError,delete t._disposeValidation
}}else!1===i.enable&&t._disposeValidation&&t._disposeValidation();return t
},r.validateObservable=function(e){
for(var t,i,a=0,n=e.rules(),s=n.length;a<s;a++)if(!(i=n[a]).condition||i.condition())if((t=i.rule?r.rules[i.rule]:i).async||i.async)c(e,t,i);else if(!f(e,t,i))return!1
;return e.clearError(),!0};var p,v={};r.defineLocale=function(e,t){
return e&&t?(v[e.toLowerCase()]=t,t):null},r.locale=function(e){if(e){
if(e=e.toLowerCase(),
!v.hasOwnProperty(e))throw new Error("Localization "+e+" has not been loaded.")
;r.localize(v[e]),p=e}return p},r.localize=function(e){var t=r.rules
;for(var i in e)t.hasOwnProperty(i)&&(t[i].message=e[i])},function(){
var e={},t=r.rules;for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i].message)
;r.defineLocale("en-us",e)
}(),p="en-us",e.applyBindingsWithValidation=function(t,i,a){
var n,u=document.body
;i&&i.nodeType?(u=i,n=a):n=i,r.init(),n&&(n=s(s({},r.configuration),n),
r.utils.setDomData(u,n)),e.applyBindings(t,u)};var g=e.applyBindings
;e.applyBindings=function(e,t){r.init(),g(e,t)
},e.validatedObservable=function(t,i){
if(!i&&!r.utils.isObject(t))return e.observable(t).extend({validatable:!0})
;var a=e.observable(t)
;return a.errors=r.group(r.utils.isObject(t)?t:{},i),a.isValid=e.observable(0===a.errors().length),
e.isObservable(a.errors)?a.errors.subscribe((function(e){a.isValid(0===e.length)
})):e.computed(a.errors).subscribe((function(e){a.isValid(0===e.length)
})),a.subscribe((function(e){
r.utils.isObject(e)||(e={}),a.errors._updateState(e),
a.isValid(0===a.errors().length)})),a}}));