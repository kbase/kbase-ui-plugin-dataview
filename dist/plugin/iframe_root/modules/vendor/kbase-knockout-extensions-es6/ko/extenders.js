define(["knockout"],(function(t){"use strict";function e(t){
if(void 0===t)return!0;switch(t){case'""':case"[]":case"{}":case"null":return!0}
}t.extenders.dirty=function(n,s){let i=n()
;const r=t.observable(t.mapping.toJSON(n)),a=t.observable(t.utils.unwrapObservable(s))
;return n.isDirty=t.computed((function(){
const s=t.mapping.toJSON(n),i=e(s),o=r();return!(i&e(o))&&(a()||s!==o)
})),n.markClean=function(){r(t.mapping.toJSON(n)),i=n(),a(!1)
},n.markDirty=function(){a(!0)},n.reset=function(){n(i)},n
},t.extenders.logChange=function(t,e){return t.subscribe((function(t){
console.log(e,t)})),t},t.extenders.enabled=function(e,n){const s=t.observable()
;e.isEnabled=s,n.observable.subscribe((function(t){try{const e=s(),i=n.fun(t)
;void 0===e?s(i):e?i||s(!1):i&&s(!0)}catch(e){
console.error("Error running enable test: "+e.message)}}))
},t.extenders.constraint=function(e,n){function s(){try{const t=e()
;if(function(t){
return null==t||(!("string"!=typeof t||!e.constraint.autoTrim()||0!==t.trim().length)||t instanceof Array&&0===t.length)
}(t))return e.constraint.isRequired()?(e.constraint.message(e.constraint.messages.requiredButEmpty||"Required but empty"),
e.constraint.isValid(!1),
void e.constraint.state("required-missing")):(e.constraint.message(""),
e.constraint.isValid(!0),void e.constraint.state("empty-optional"))
;if(!n.validate)return e.constraint.message(""),
e.constraint.isValid(!0),void e.constraint.state("valid");let s=n.validate(t)
;"string"==typeof s&&(s={message:s
}),s?(e.constraint.message(s.message||""),e.constraint.isValid(!1),
e.constraint.state("invalid")):(e.constraint.message(""),
e.constraint.isValid(!0),e.constraint.state("valid"))}catch(t){
e.constraint.message("Error running validation: "+t.message),
console.error("Error running validation: "+t.message),e.constraint.isValid(!1)}}
return e.constraint={},
e.constraint.description=n.description,e.constraint.messages=n.messages||{},
n.required?t.isComputed(n.required)?e.constraint.isRequired=n.required:t.isObservable(n.required)?e.constraint.isRequired=n.required:e.constraint.isRequired=t.observable(n.required):e.constraint.isRequired=t.observable(!1),
e.constraint.autoTrim=t.observable(n.autoTrim||!0),
e.constraint.isValid=t.observable(n.valid||!0),
e.constraint.message=t.observable(),
e.constraint.state=t.observable("new"),s(e()),
e.subscribe(s),e.constraint.isRequired.subscribe(s),e}}));