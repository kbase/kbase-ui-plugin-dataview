define(["kb_lib/props"],(function(e){"use strict";function t(t){
var r=new e.Props({data:t.typeDefs}),n={type:"fontAwesome",classes:["fa-file-o"]
};function i(e){
var t,r=0,n=["#F44336","#E91E63","#9C27B0","#3F51B5","#2196F3","#673AB7","#FFC107","#0277BD","#00BCD4","#009688","#4CAF50","#33691E","#2E7D32","#AEEA00","#03A9F4","#FF9800","#FF5722","#795548","#006064","#607D8B"]
;for(t=0;t<e.name.length;t+=1)r+=e.name.charCodeAt(t);return n[r%n.length]}
return Object.freeze({getIcon:function(e){
var t=r.getItem(["types",e.type.module,e.type.name,"icon"])||n,s=t.classes.map((function(e){
return e}));switch(t.type){case"kbase":if(s.push("icon"),e.size)switch(e.size){
case"small":s.push("icon-sm");break;case"medium":s.push("icon-md");break
;case"large":s.push("icon-lg")}break;case"fontAwesome":s.push("fa")}if(s)return{
classes:s,type:t.type,color:t.color||i(e.type),
html:'<span class="'+s.join(" ")+'"></span>'}},setIcon:function(e,t){
var n=r.getItem(["types",e.module,e.name])
;null==n?r.setItem(["types",e.module,e.name],{icon:t
}):r.setItem(["types",e.module,e.name,"icon"],t)},getViewer:function(e){
if(e.id)return function(e){
var t=r.getItem(["types",e.type.module,e.type.name,"viewersById",e.id])
;if(!t)throw new Error("Viewer not found with this id "+e.id+" for "+e.type.module+"."+e.type.name)
;return t}(e);var t=r.getItem(["types",e.type.module,e.type.name,"viewers"])
;if(t&&0!==t.length){if(1===t.length)return t[0];var n=t.filter((function(e){
return!!e.default}));if(1===n.length){var i=Object.assign({},n[0])
;return delete i.default,i}
if(0===n.length)throw new Error("Multiple viewers defined for this type, but none are set as default")
;throw new Error("Multiple default viewers defined for this type")}},
getDefault:function(e){return r.getItem(["defaults",e])},makeTypeId:function(e){
return e.module+"."+e.name+"-"+e.version.major+"."+e.version.minor},
parseTypeId:function(e){var t=e.match(/^(.+?)\.(.+?)-(.+?)\.(.+)$/)
;if(!t)throw new Error("Invalid data type "+e)
;if(5!==t.length)throw new Error("Invalid data type "+e);return{module:t[1],
name:t[2],version:{major:t[3],minor:t[4]}}},makeType:function(){
if(1===arguments.length){var e=arguments[0];if(e.version){
var t=e.version.split(".");return{module:e.module,name:e.name,version:{
major:t[0],minor:t[1]}}}}},makeVersion:function(e){
return e.version.major+"."+e.version.minor},addViewer:function(e,t){
void 0===r.getItem(["types",e.module,e.name])&&r.setItem(["types",e.module,e.name],{
viewers:[]});var n=r.getItem(["types",e.module,e.name,"viewers"])
;if(n||(n=[],r.setItem(["types",e.module,e.name,"viewers"],n)),n.push(t),t.id){
var i=r.getItem(["types",e.module,e.name,"viewersById"])
;if(i||(i={},r.setItem(["types",e.module,e.name,"viewersById"],i)),
i[t.id])throw new Error("Viewer with this id already registered "+t.id)
;i[t.id]=t}},hasType:function(e){return!!r.hasItem(["types",e.module,e.name])},
checkViewers:function(){var e=r.getItem("types"),t=[]
;return e?(Object.keys(e).forEach((function(r){var n=e[r]
;Object.keys(n).forEach((function(e){var i=n[e],s=!1
;i.viewers?(i.viewers.forEach((function(n){n.default&&(s&&t.push({
severity:"error",type:"duplicate-default",
message:"There is already a default viewer established "+r+"."+e,info:{module:r,
type:e}}),s=!0)})),s||t.push({severity:"error",type:"no-default",
message:"There is no default viewer for this type: "+r+"."+e,info:{module:r,
type:e}})):t.push({severity:"warning",type:"no-viewers",
message:"A registered type has no viewers: "+r+"."+e,info:{module:r,type:e}})}))
})),t):t}})}return{make:function(e){return t(e)}}}));