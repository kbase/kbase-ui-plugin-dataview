define(["require","bluebird","knockout"],(function(o,n,e){"use strict";return{
load:function({deferUpdates:t}={}){
return e.options.deferUpdates=!!t,new n((n,t)=>{
o(["knockout-mapping","knockout-arraytransforms","knockout-validation","knockout-switch-case","knockout-projections","./ko/knockout-es6-collections","./ko/bindingHandlers","./ko/componentLoaders","./ko/extenders","./ko/subscribables"],()=>{
n(e)},o=>{t(o)})})},ko:e}}));