define(["jquery","handlebars","d3"],(function(t,e,i){"use strict";var r
;t(document).on("libsLoaded.kbase",(function(){
t("[data-kbwidget]").each((function(e,i){
var r=t(i),n=r.attr("data-kbwidget"),o=r.text()
;r.empty(),o=void 0!==o?JSON.parse(o):{},r[n](o)}))}));var n=function(t){
if(void 0!==t&&t.length)return t.charAt(0).toUpperCase()+t.slice(1)
},o=function(t){return"didChangeValueFor"+n(t)},s=function(e){
return t(e).prop("tagName").toLowerCase().match(/^(input|select|textarea)$/)?"checkbox"===t(e).attr("type")?{
setter:"checked",getter:"checked"}:{setter:"val",getter:"val"}:{setter:"html",
getter:"html"}},a=function(e,i,r,n,o){return t.proxy((function(i,r){
i.preventDefault(),i.stopPropagation();var s=r.newValue
;void 0!==n.transformedValue&&(s=n.transformedValue(s)),
"checked"===o.setter?t(e).attr(o.setter,s):t(e)[o.setter](s)}),t(e))
},u=function(e,i,r,n,o){return t.proxy((function(s){var a
;if(("keypress"!==s.type||13===s.which)&&(s.preventDefault(),
s.stopPropagation(),
(a="checked"===o.getter?!!this.is(":checked"):this[o.getter]())!==this.data("kbase_bindingValue"))){
if(void 0!==n.validator){var u=n.validator(a)
;if(!u.success)return t(e).data("validationError.kbaseBinding",u.msg),
this.popover({placement:"right",title:"Validation error",
content:t.proxy((function(){return this.data("validationError.kbaseBinding")
}),t(e)),trigger:"manual",html:!0}),void this.popover("show")
;t(e).popover("hide"),u.newVal&&(a=u.newVal)}
void 0!==n.reverseTransformedValue&&(a=n.reverseTransformedValue(a))
;var h=i.__attributes[r].setter
;i[h](a),this.data("kbase_bindingValue",this[o.getter]())}}),t(e))
},h=function(e,i,r){return t.proxy((function(t){
t.preventDefault(),t.stopPropagation(),
this.data("kbase_bindingValue",this[r.getter]())}),t(e))};t.fn.asD3=function(){
return void 0===this.data("d3rep")&&this.data("d3rep",i.select(this.get(0))),
this.data("d3rep")},t.fn.kb_bind=function(e,i,r,n){if(this.length>1){
var p=arguments;return t.each(this,(function(e,i){t.fn.kb_bind.apply(t(i),p)})),
this}void 0===n&&(n=s(this)),void 0===r&&(r={});var d=o(i)
;e.on(d,a(this,0,0,r,n)),
t(this).on("blur.kbaseBinding",u(this,e,i,r,n)),t(this).on("focus.kbaseBinding",h(this,0,n))
;var c=t(this).prop("tagName").toLowerCase()
;c.match(/^(input)$/)&&(t(this).on("keypress.kbaseBinding",u(this,e,i,r,n)),
"checkbox"===t(this).attr("type")&&t(this).on("change.kbaseBinding",u(this,e,i,r,n)))
;var f=e.__attributes[i].getter,l=e[f]()
;return void 0!==r.transformedValue&&(l=r.transformedValue(l)),
"checked"===n.setter?t(this).attr(n.setter,l):t(this)[n.setter](l),this
},t.fn.kb_unbind=function(e,i,r,n,h){if(this.length>1){var p=arguments
;return t.each(this,(function(e,i){t.fn.kb_unbind.apply(t(i),p)})),this}
void 0===h&&(h=s(this)),void 0===n&&(n={});var d=o(i)
;e.off(d,a(this,0,0,n,h)),t(this).off("blur.kbaseBinding",u(this,e,i,n,h)),
t(this).off("focus.kbaseBinding",u(this,n,h))
;var c=t(this).prop("tagName").toLowerCase()
;return c.match(/^(input)$/)&&"checkbox"===t(this).attr("type")&&t(this).off("change.kbaseBinding",u(this,e,i,n,h)),
this};var p={}
;void 0===r&&(r=window.KBase),void 0===window.KBase&&(r=window.KBase={
_functions:{getter:function(t){return function(){return this.valueForKey(t)}},
setter:function(t){return function(e){return this.setValueForKey(t,e)}},
getter_setter:function(t){return function(e){
return 1===arguments.length?this.setValueForKey(t,e):this.valueForKey(t)}}}
}),t.jqElem=function(e){var i="<"+e+">"
;return i.match(/^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track)/)||(i+="</"+e+">"),
t(i)},t.KBWidget=function(e){var i=(e=e||{}).name,n=e.parent
;void 0===n&&(n="kbaseWidget");var o=e.asPlugin;void 0===o&&(o=!0)
;var s=function(i){
return this.$elem=i,this.options=t.extend(!0,{},e.options,this.constructor.prototype.options),
this};if(i){var a=i
;a=(a=a.replace(/^kbase/,"")).charAt(0).toLowerCase()+a.slice(1),
r[a]=function(e,i){var r=new s;return void 0===i&&(i=t.jqElem("div")),r.$elem=i,
void 0===e&&(e={}),e.headless=!0,r.init(e),r._init=!0,r.trigger("initialized"),r
},p[i]=s,void 0===e&&(e=n,n="kbaseWidget",void 0===e&&(e={}))}if(n){var u=p[n]
;if(void 0===u)throw new Error("Parent widget is not registered. Cannot find "+n+" for "+i)
;!function(t,e){function i(){}i.prototype=e.prototype;var r=new i
;r.constructor=t,t.prototype=r}(s,u)}var h=t.extend(!0,{},e)
;s.prototype.__attributes={},
void 0!==h._accessors&&(t.each(h._accessors,t.proxy((function(t,e){var i={
name:e,setter:e,getter:e,type:"rw"}
;if("object"==typeof e)for(var n in i.setter=e.name,i.getter=e.name,e)i[n]=e[n]
;s.prototype.__attributes[i.name]=i,
i.setter===i.getter&&i.type.match(/rw/)?s.prototype[i.getter]=r._functions.getter_setter(i.name):(i.type.match(/w/)&&void 0!==i.setter&&(s.prototype[i.setter]=r._functions.setter(i.name)),
i.type.match(/r/)&&void 0!==i.getter&&(s.prototype[i.getter]=r._functions.getter(i.name)))
}),this)),h._accessors=void 0)
;var d=t.extend(!0,{},s.prototype.__attributes,p[n].prototype.__attributes)
;for(var c in s.prototype.__attributes=d,
h)t.isFunction(h[c])?s.prototype[c]=function(t,e){let i=function(){
throw"No parent method defined! Play by the rules!"},r=function(){
throw"No parent method defined! Play by the rules!"};return n&&(i=function(){
return p[n].prototype[t].apply(this,arguments)},r=function(t){
return p[n].prototype[t].apply(this,Array.prototype.slice.call(arguments,1))
}),function(){var t=this._super,n=this._superMethod
;this._super=i,this._superMethod=r;var o=e.apply(this,arguments)
;return this._super=t,this._superMethod=n,o}}(c,h[c]):s.prototype[c]=h[c]
;if(n&&(s.prototype.options=t.extend(!0,{},p[n].prototype.options,s.prototype.options)),
o){t.fn[i]=function(e){if(this.length>1){var r=arguments
;return t.each(this,(function(e,n){t.fn[i].apply(t(n),r)})),this}
if(void 0===this.data(i)&&this.data(i,new s(this)),
s.prototype[e])return s.prototype[e].apply(this.data(i),Array.prototype.slice.call(arguments,1))
;if("object"==typeof e||!e){var n=this.data(i)
;return void 0===n._init&&(n=s.prototype.init.apply(n,arguments)),
n._init=!0,n.trigger("initialized"),n}
return t.error("Method "+e+" does not exist on "+i),this},t[i]=t.fn[i]}
return this.on=function(t,e){return this.$elem.bind(t,e),this
},this.emit=function(t,e){return this.$elem.trigger(t,e),this
},this.off=function(t){return this.$elem.unbind(t),this
},void 0!==i?(s.prototype[i]=function(){
return t.fn[i].apply(this.$elem,arguments)},t.fn[i]):this
},t.KBWidget.registry=function(){var t={}
;for(var e in p)"kbaseWidget"!==e&&(t[e]=p[e]);return t
},t.KBWidget.resetRegistry=function(){
for(var t in p)"kbaseWidget"!==t&&delete p[t];return this},t.KBWidget({
name:"kbaseWidget",dbg:function(t){window.console&&console.log(t)},
callAfterInit:function(t){var e=this;function i(){e._init?t():setTimeout(i,10)}
return i(),i},init:function(e){this._attributes={},this.runtime=e.runtime
;var i,r,n=t.extend(!0,{},this.options)
;for(i in this.options=t.extend(!0,{},n,e),
e)void 0===e[i]&&void 0!==this.options[i]&&delete this.options[i]
;for(r in this.__attributes){
if(void 0!==this.options[r])this[this.__attributes[r].setter](this.options[r])}
return this.options.template&&this.callAfterInit(t.proxy((function(){
this.appendUI(this.$elem)}),this)),this},appendUI:function(e){
return this.options.template&&t.ajax(this.options.template).done(t.proxy((function(){
this.templateSuccess.apply(this,arguments)}),this)).fail(t.proxy((function(){
this.templateFailure.apply(this,arguments)}),this)),e},
templateSuccess:function(i){
var r=e.compile(i)(this.templateContent()),n=t.jqElem("span").append(r)
;this._rewireIds(n,this),this.$elem.append(n)},templateFailure:function(t){
this.dbg("Template load failure"),this.dbg(t)},templateContent:function(){
return this.options.templateContent||{}},alert:function(t){
return void 0===t&&(t=this.data("msg")),this.data("msg",t),this},
valueForKey:function(t){return this._attributes[t]},
setValueForKey:function(t,e){var i=void 0,r=this.valueForKey(t);if(e!==r){
var s=function(t){return"willChangeValueFor"+n(t)}(t);if(i={oldValue:r,
newValue:e},this.trigger(s,i),this._attributes[t]=i.newValue,i.newValue!==r){
var a=o(t);this.trigger(a,i)}}return this.valueForKey(t)},
setValuesForKeys:function(e){var i=t.extend({},e)
;for(var r in this.__attributes){
if(void 0!==i[r])this[this.__attributes[r].setter](i[r]),delete i[r]}
this.options=t.extend(this.options,i)},data:function(t,e){
return void 0===this.options._storage&&(this.options._storage={}),
2===arguments.length&&(this.options._storage[t]=e),
void 0!==t?this.options._storage[t]:this.options._storage},
_rewireIds:function(e,i){
return void 0===i&&(i=e),e.attr("id")&&(i.data(e.attr("id"),e),
e.removeAttr("id")),t.each(e.find("[id]"),(function(){
i.data(t(this).attr("id"),t(this)),
t(this).attr("data-id",t(this).attr("id")),t(this).removeAttr("id")})),e},
sortCaseInsensitively:function(t,e){
return t.toLowerCase()<e.toLowerCase()?-1:t.toLowerCase()>e.toLowerCase()?1:0},
sortByKey:function(t,e){return e?function(e,i){
return e[t].toLowerCase()<i[t].toLowerCase()?-1:e[t].toLowerCase()>i[t].toLowerCase()?1:0
}:function(e,i){return e[t]<i[t]?-1:e[t]>i[t]?1:0}},trigger:function(){
this.$elem.trigger.apply(this.$elem,arguments)},on:function(){
this.$elem.on.apply(this.$elem,arguments)},off:function(){
this.$elem.off.apply(this.$elem,arguments)},
makeObserverCallback:function(e,i,r){return t.proxy((function(t,i){
t.preventDefault(),t.stopPropagation(),r.call(this,t,e,i)}),this)},
observe:function(t,e,i){t.on(e,t,this.makeObserverCallback(t,e,i))},
unobserve:function(t,e,i){t.off(e,t,this.makeObserverCallback(t,e,i))},
kb_bind:function(t,e,i){var r=o(e);this.observe(t,r,i)},
kb_unbind:function(t,e,i){var r=o(e);this.unobserve(t,r,i)},uuid:function(){
for(var t="",e=0;e<32;e++)t+=Math.floor(16*Math.random()).toString(16).toUpperCase()
;return"uuid-"+t}})}));