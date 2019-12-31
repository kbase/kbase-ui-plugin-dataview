define(["bluebird","kb_service/utils","kb_common/utils","kb_common/html","kb_common/dom","kb_service/client/workspace","kb_common/state"],(function(e,t,a,r,n,o,s){
"use strict"
;var i=r.tag,c=i("div"),l=i("h3"),d=i("h4"),u=i("span"),f=i("a"),p=i("table"),b=i("tr"),_=i("th"),h=i("td")
;function g(i){
var g,v,m,y,w,j=i.runtime,k=(i.sub,s.make()),x=new o(j.getConfig("services.workspace.url"),{
token:j.getService("session").getAuthToken()});function M(e){
if(a.isBlank(e))return"";var t=a.iso8601ToDate(e)
;return["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][t.getMonth()]+" "+t.getDate()+", "+t.getFullYear()
}function T(a,r){return e.try((function(){if(r&&!(r.length<1)){
var e=r.map((function(e){return{ref:e}}));return x.get_object_info_new({
objects:e,ignoreErrors:1}).then((function(e){var r=e.filter((function(e){
return!!e})).map((function(e){return t.object_info_to_object(e)}))
;k.set(a,r.sort((function(e,t){return t.name-e.name})))}))}}))}function E(){
return x.list_referencing_objects([{ref:w}]).then((function(e){var a=[]
;if(e[0])for(var r=0;r<e[0].length;r++)a.push(t.object_info_to_object(e[0][r]))
;return k.set("inc_references",a.sort((function(e,t){return t.name-e.name}))),a
}))}function N(){return x.get_object_info_new({objects:[{ref:w}],
includeMetadata:1}).then((function(e){
if(!e||0===e.length)throw k.set("status","notfound"),new Error("notfound")
;k.set("status","found");var a=t.object_info_to_object(e[0])
;k.set("object",a),k.set("dataicon",function(e){try{
var t=e[2],a=j.service("type").parseTypeId(t),n=j.service("type").getIcon({
type:a}),o=r.tag("div"),s=r.tag("span"),i=r.tag("i");return o([s({
class:"fa-stack fa-2x"},[i({class:"fa fa-circle fa-stack-2x",style:{
color:n.color}}),i({class:"fa-inverse fa-stack-1x "+n.classes.join(" ")})])])
}catch(c){return console.error("When fetching icon config: ",c),""}}(e[0]))
})).then((function(){var e=/^\d+$/.test(m);return x.get_workspace_info({
id:e?m:null,workspace:e?null:m}).then((function(e){
k.set("workspace",t.workspace_metadata_to_object(e))}))})).then((function(){
return x.get_object_history({ref:w}).then((function(e){var a=e.map((function(e){
return t.object_info_to_object(e)}));k.set("versions",a.sort((function(e,t){
return t.version-e.version})))}))})).then((function(){
return x.list_referencing_object_counts([{ref:w}]).then((function(e){
if(!(e[0]>100))return k.set("too_many_inc_refs",!1),E()
;k.set("too_many_inc_refs",!0)}))})).then((function(){return E()
})).then((function(){return x.get_object_provenance([{ref:w
}]).then((function(e){var t=e[0].refs
;return e[0].provenance.forEach((function(e){t=t.concat(e.resolved_ws_objects)
})),
t.length>100?(k.set("too_many_out_refs",!0),t):(k.set("too_many_out_refs",!1),
T("out_references",t))}))})).then((function(e){return T(e)})).then((function(){
return x.list_workspace_info({perm:"w"}).then((function(e){
var a=e.map((function(e){return t.workspace_metadata_to_object(e)
})).filter((function(e){
return!(!e.metadata.narrative||isNaN(parseInt(e.metadata.narrative))||e.id===m||!e.metadata.narrative_nice_name||!e.metadata.is_temporary||"true"===e.metadata.is_temporary)
}));k.set("writableNarratives",a)}))}))}function I(){var e=r.tag("div")
;return r.makePanel({title:"Data Overview",content:e({
dataWidget:"dataview-overview"},[e({dataPlaceholder:"alert"}),e({
dataPlaceholder:"content"})])})}function O(){
var e=window.location.protocol+"//"+window.location.host+"/#dataview/"+w
;return k.get("sub.subid")&&(e+="?"+k.get("sub.sub")+"&"+k.get("sub.subid")),
b([_("Permalink"),h({dataElement:"permalink"},f({href:e,target:"_parent"},e))])}
function S(){var e=k.get("object.version")||"Latest"
;return b([_("Object Version"),h({dataElement:"version"},e)])}function D(e){
var t=r.genId(),a="heading_"+t,n="body_"+t;return c({class:"panel panel-default"
},[c({class:"panel-heading",role:"tab",id:a},[d({class:"panel-title"},[u({
dataToggle:"collapse",dataParent:"#"+e.parent,dataTarget:"#"+n,
ariaExpanded:"false",ariaControls:n,class:"collapsed",style:{cursor:"pointer"}
},[u({class:"fa angle-right"}),e.title])])]),c({id:n,
class:"panel-collapse collapse",role:"tabpanel",ariaLabelledby:a},[c({
class:"panel-body"},[e.body])])])}function L(e){var t=k.get("object.metadata")
;return D({title:"Raw Metadata",body:t&&Object.keys(t).length>0?p({class:"table"
},[Object.keys(t).map((function(e){return b([h({style:{maxWidth:"0",width:"30%",
overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},title:e},e),h({
style:{maxWidth:"0",width:"70%",overflow:"hidden",textOverflow:"ellipsis",
whiteSpace:"nowrap"},title:t[e]},t[e])])}))]):"no metadata for this object",
parent:e})}function V(e){var t=k.get("versions");return D({title:"Versions",
body:t&&t.length>0?p({class:"table"},t.map((function(e){return b([h(f({
href:"/#dataview/"+e.wsid+"/"+e.id+"/"+e.version,target:"_parent"
},["v"+e.version])),h(["Saved on ",M(e.save_date)," by ",f({
href:"/#people/"+e.saved_by,target:"_parent"},e.saved_by)])])}))):"no versions",
parent:e})}function W(e){
var t=k.get("too_many_inc_refs"),a=k.get("inc_references");return D({
title:"Referenced by",
body:t?"Sorry, there are too many references to this data to display.":a&&a.length>0?p({
class:"table kb-overview-table",style:{}},[b([_({style:{width:"40%"}
},"Name"),_({style:{width:"20%"}},"Type"),_({style:{width:"20%"}},"Saved"),_({
style:{width:"20%"}},"By")])].concat(a.map((function(e){return b([h(f({
href:["/#dataview",e.wsid,e.id,e.version].join("/"),title:e.name,
target:"_parent"},e.name)),h(f({href:["/#spec","type",e.type].join("/"),
title:e.typeName,target:"_parent"},e.typeName)),h(u({title:M(e.save_date)
},M(e.save_date))),h(f({href:["/#people",e.saved_by].join("/"),title:e.saved_by,
target:"_parent"},e.saved_by))])
})))):"No other data references this data object.",parent:e})}function A(e){
var t=k.get("too_many_out_refs"),a=k.get("out_references");return D({
title:"References",
body:t?"Sorry, there are too many references from this data to display.":a&&a.length>0?p({
class:"table kb-overview-table"},[b([_({style:{width:"40%"}},"Name"),_({style:{
width:"20%"}},"Type"),_({style:{width:"20%"}},"Saved"),_({style:{width:"20%"}
},"By")])].concat(a.map((function(e){return b([h(f({
href:["/#dataview",e.wsid,e.id,e.version].join("/"),title:e.name,
target:"_parent"},e.name)),h(f({href:["/#spec","type",e.type].join("/"),
title:e.typeName,target:"_parent"},e.typeName)),h(u({title:M(e.save_date)
},M(e.save_date))),h(f({href:["/#people",e.saved_by].join("/"),title:e.saved_by,
target:"_parent"},e.saved_by))])
})))):"This data object references no other data.",parent:e})}
return Object.freeze({attach:function(e){
g=e,v=n.createElement("div"),g.appendChild(v),
v.innerHTML=I(),v.querySelector('[data-placeholder="content"]').innerHTML=r.loading()
},start:function(e){
if(m=e.workspaceId,y=e.objectId,e.objectVersion,w=t.makeWorkspaceObjectRef(e.objectInfo.wsid,e.objectInfo.id,e.objectInfo.version),
!m)throw"Workspace ID is required";if(!y)throw"Object ID is required"
;return N().then((function(){v.innerHTML=I()
;var e=v.querySelector('[data-placeholder="content"]');e&&(e.innerHTML=c({
class:"row"},[c({class:"col-sm-6"},[c({style:{display:"flex",flexDirection:"row"
}},[c({flex:"0 1 0px"},k.get("dataicon")),c({style:{flex:"1 1 0px",
marginRight:"4px",minWidth:"0"}},l({style:{overflow:"hidden",
textOverflow:"ellipsis",whiteSpace:"nowrap"}
},k.get("sub.id")?k.get("sub.subid"):k.get("object.name")))]),p({class:"table"
},[S(),[b([_("Module"),h({dataElement:"module"
},[k.get("sub.sub")?k.get("sub.sub")+" in ":"",k.get("object.typeModule")])]),b([_("Type"),h({
dataElement:"module"},[k.get("sub.sub")?k.get("sub.sub")+" in ":"",f({
href:"/#spec/type/"+k.get("object.type"),target:"_blank"
},k.get("object.typeName"))])]),b([_("Type Version"),h({
dataElement:"typeVersion"
},[k.get("object.typeMajorVersion"),".",k.get("object.typeMinorVersion")])])],k.get("workspace.metadata.narrative_nice_name")?b([_("In Narrative"),h({
dataElement:"narrative"},f({
href:"/narrative/ws."+k.get("workspace.id")+".obj."+k.get("workspace.metadata.narrative"),
target:"_blank"
},k.get("workspace.metadata.narrative_nice_name")))]):"",b([_("Last Updated"),h({
dataElement:"last-updated"},[M(k.get("object.save_date"))," by ",f({
href:["/#people",k.get("object.saved_by")].join("/"),target:"_parent"
},k.get("object.saved_by"))])]),O()])]),c({class:"col-sm-6"},[c({
class:"panel-group",id:"accordion",role:"tablist",ariaMultiselectable:"true"
},[L("accordion"),V("accordion"),W("accordion"),A("accordion")])])]))
})).catch((function(e){
console.error(e),e.status&&500===e.status?e.error.error.match(/^us.kbase.workspace.database.exceptions.NoSuchObjectException:/)?(k.set("status","notfound"),
k.set("error",{type:"client",code:"notfound",
shortMessage:"This object does not exist",originalMessage:e.error.message
})):e.error.error.match(/^us.kbase.workspace.database.exceptions.InaccessibleObjectException:/)?(k.set("status","denied"),
k.set("error",{type:"client",code:"denied",
shortMessage:"You do not have access to this object",
originalMessage:e.error.message})):(k.set("status","error"),k.set("error",{
type:"client",code:"error",shortMessage:"An unknown error occured",
originalMessage:e.error.message})):k.set("error",{type:"general",code:"error",
shortMessage:"An unknown error occured"})}))},stop:function(){return null},
detach:function(){g&&v&&g.removeChild(v)}})}return{make:function(e){return g(e)}
}}));