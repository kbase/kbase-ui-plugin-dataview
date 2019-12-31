define(["knockout","kb_common/html","kb_service/client/workspace","kb_service/utils"],(function(e,t,a,n){
"use strict";function o(o){
var r,i,c,s,d=o.runtime,l=t.tag,h=l("div"),f=l("button"),p=l("input"),u=l("table"),b=l("tr"),v=l("td"),m=l("th"),w=l("form"),y=l("select"),g=l("a"),k=l("p"),j=l("b"),x=l("span"),_="hidden",N=new a(d.getConfig("services.workspace.url"),{
token:d.service("session").getAuthToken()});function M(){switch(_){case"hidden":
i.firstChild.classList.remove("hidden"),_="showing";break;case"showing":
i.firstChild.classList.add("hidden"),_="hidden"}}function I(e,t){var a={
ref:e.objectInfo.ref},o={wsid:t.objectInfo.wsid,name:e.objectInfo.name}
;N.copy_object({from:a,to:o}).then((function(e){
var a=n.objectInfoToObject(e),o=function(e){
return d.getConfig("services.narrative.url")+e
}("/narrative/"+n.makeWorkspaceObjectId(t.workspaceInfo.id,t.workspaceInfo.metadata.narrative)),r=h(["Successfully copied this data object to the Narrative ",t.workspaceInfo.metadata.narrative_nice_name,x({
style:{fontStyle:"italic"}},[g({href:o,class:"btn btn-default",target:"_blank"
},"Open this Narrative")])]);return c.completionMessage(r),a}))}function C(e,t){
return"#"+e+"?"+function(e){return Object.keys(e).map((function(t){
return t+"="+encodeURIComponent(e[t])})).join("&")}(t)}function O(a){
this.narratives=e.observableArray([]),
this.copyMethod=e.observable(),this.selectedNarrative=e.observable(),
this.selectedNarrativeObject=e.observable(),
this.narrativesById={},this.errorMessage=e.observable(),
this.completionMessage=e.observable(),this.copyMethod.subscribe(function(e){
switch(e){case"new":this.selectedNarrative([void 0])}
}.bind(this)),this.selectedNarrative.subscribe(function(e){var t=this
;void 0===e[0]?this.copyMethod("new"):(this.copyMethod("existing"),function(e){
return N.get_object_info_new({objects:[{ref:e}],ignoreErrors:1
}).then((function(t){
if(0===t.length)throw new Error("No Narrative found with reference "+e)
;if(t.length>1)throw new Error("Too many Narratives found with reference "+e)
;var a=n.objectInfoToObject(t[0]);return[a,N.get_workspace_info({id:a.wsid})]
})).spread((function(e,t){return{objectInfo:e,
workspaceInfo:n.workspaceInfoToObject(t)}}))}(e[0]).then((function(e){
t.selectedNarrativeObject(e)})).catch(Error,(function(e){
console.error(e),t.errorMessage(e.message)})).catch((function(e){
console.error(e),t.errorMessage("unknown error")})))
}.bind(this)),this.handleCopy=function(){
switch(this.errorMessage(""),this.copyMethod()){case"new":!function(e){
var a=C("narrativemanager/new",{copydata:e.objectInfo.ref})
;window.open(a,"window_"+t.genId())}(a);break;case"existing":
this.selectedNarrative()[0]?I(a,this.selectedNarrativeObject()):this.errorMessage("You must select a narrative before copying the data object into it.")
}}}return{init:function(e){},attach:function(e){
r=e,(i=e.appendChild(document.createElement("div"))).innerHTML=h({
class:"hidden",dataPlace:"main"},[h({class:"panel panel-primary"},[h({
class:"panel-heading"},[x({class:"panel-title"
},"Copy Object to Narrative")]),h({class:"panel-body"},[h({
class:"container-fluid"
},[k(["You may use this  panel to copy the ",j("data object")," you are viewing into either a ",j("new Narrative"),", which will be created automatically, or an ",j("existing Narrartive")," which you may select from the list below."]),h({
class:"col-md-8"},[w([u({class:"table"},[b([v(p({type:"radio",name:"copyMethod",
value:"new",dataBind:{checked:"copyMethod"}
})),v("Copy into New Narrative")]),b([v(),v("or")]),b([v(p({type:"radio",
name:"copyMethod",value:"existing",dataBind:{checked:"copyMethod"}
})),v(["Copy into: ",y({dataBind:{
optionsCaption:'"Select a Narrative to Copy To"',options:"narratives",
optionsValue:'"value"',optionsText:'"name"',selectedOptions:"selectedNarrative"}
})])]),"\x3c!-- ko if: errorMessage() --\x3e",b([v(["ER"]),v(h({dataBind:{
text:"errorMessage"}}))]),"\x3c!-- /ko --\x3e",b([v(),v([h({class:"btn-toolbar",
role:"toolbar"},[h({class:"btn-group",role:"group"},f({class:"btn btn-primary",
dataBind:"click: handleCopy"
},"Copy and Open Narrative"))])])]),"\x3c!-- ko if: completionMessage() --\x3e",b([v([""]),v(h({
dataBind:{html:"completionMessage"}}))]),"\x3c!-- /ko --\x3e"])])]),h({
class:"col-md-4"},[h({class:"panel panel-default"},[h({class:"panel-heading"
},[h({class:"panel-title"},"Selected Narrative")]),h({class:"panel-body"
},['\x3c!-- ko if: copyMethod() === "existing" --\x3e',k(["The data object will be copied into the following Narrative:"]),"\x3c!-- ko with: selectedNarrativeObject --\x3e",u({
class:"table"},[b([m("Ref"),v(h({dataBind:{text:"objectInfo.ref"}
}))]),b([m("Name"),v(h({dataBind:{
text:"workspaceInfo.metadata.narrative_nice_name"}}))]),b([m("Owner"),v(h({
dataBind:{text:"objectInfo.saved_by"}}))]),b([m("Last saved"),v(h({dataBind:{
text:"objectInfo.saveDate"}
}))])]),"\x3c!-- /ko --\x3e","\x3c!-- /ko --\x3e",'\x3c!-- ko if: copyMethod() === "new" --\x3e',k(["A new narrative will be created containing this data object."]),"\x3c!-- /ko --\x3e"])])])])])])])
},start:function(t){return s=d.recv("copyWidget","toggle",(function(){M()
})),(c=new O(t)).copyMethod("new"),e.applyBindings(c,i),function(e){
var t=e.objectInfo.wsid;return N.list_workspace_info({perm:"w"
}).then((function(e){return e.map((function(e){
return n.workspace_metadata_to_object(e)})).filter((function(e){
return!(!e.metadata.narrative||isNaN(parseInt(e.metadata.narrative,10))||e.id===t||!e.metadata.narrative_nice_name||!e.metadata.is_temporary||"true"===e.metadata.is_temporary)
}))}))}(t).then((function(e){e.forEach((function(e){
c.narrativesById[e.id]=e,c.narratives.push({name:e.metadata.narrative_nice_name,
value:[String(e.id),e.metadata.narrative].join("/")})}))}))},stop:function(){
s&&d.drop(s)},detach:function(){i&&r.removeChild(i)},destroy:function(){}}}
return{make:function(e){return o(e)}}}));