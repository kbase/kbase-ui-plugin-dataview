define(["jquery","bluebird","kb_common/html","kb_common/jsonRpc/dynamicServiceClient","kb_service/client/workspace","kb_service/client/fba","widgets/modeling/KBModeling","kbaseUI/widget/legacy/tabs","kbaseUI/widget/legacy/authenticatedWidget","widgets/modeling/KBaseBiochem.Media","widgets/modeling/KBaseFBA.FBA","widgets/modeling/KBaseFBA.FBAModel","widgets/modeling/KBaseFBA.FBAModelSet","kbaseUI/widget/legacy/helpers","datatables_bootstrap"],(function(t,e,n,a,i,r,o){
"use strict";const s=n.tag,d=s("a"),c=s("span"),l=s("table");t.KBWidget({
name:"kbaseTabTable",parent:"kbaseAuthenticatedWidget",version:"1.0.0",
options:{},init:function(r){this._super(r)
;var s,u=this,p="/#dataview/",h=r.type,f=new o({runtime:this.runtime
})[h.split(/-/)[0].replace(/\./g,"_")];this.obj=new f(u)
;for(var m,g=this.obj.tabList,b=[],v=0;v<g.length;v++){g[v];var k=t("<div>")
;k.loading(),b.push({name:g[v].name,key:g[v].key,content:k})}
if(b[0].active=!0,s=u.$elem.kbTabs({tabs:b}),isNaN(r.ws)&&isNaN(r.obj))m={
workspace:r.ws,name:r.obj};else{
if(isNaN(r.ws)||isNaN(r.obj))throw new Error("Invalid input object reference")
;m={ref:r.ws+"/"+r.obj}}
this.workspaceClient=new i(this.runtime.config("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()
}),this.workspaceClient.get_object_info_new({objects:[m],includeMetadata:1
}).then((function(t){u.obj.setMetadata(t[0]);for(var e=0;e<g.length;e++){
var n=g[e];if("verticaltbl"===n.type){
var a=n.key,i=u.obj[a],r=s.tabContent(n.name),o=u.verticalTable({rows:n.rows,
data:i});r.rmLoading(),r.append(o)}}return null})).catch((function(t){
console.error("ERROR getting object info (new)"),console.error(t)
})),this.workspaceClient.get_objects([m]).then((function(t){
return e.try((function(){return u.obj.setData(t[0].data,s)})).then((function(){
return e.all(g.map((function(t){e.try((function(){var n=s.tabContent(t.name)
;if("verticaltbl"!==t.type){if(t.widget)try{n[t.widget](t.getParams())}catch(a){
y(n,a.message)}finally{return}return function(t,n){return e.try((function(){
var e=[];return t.columns.forEach((function(n){
"tabLink"!==n.type&&"wstype"!==n.type||"dispWSRef"!==n.linkformat||u.obj[t.key].forEach((function(t){
-1===e.indexOf(t[n.key])&&e.push({ref:t[n.key]})}))
})),e.length?u.workspaceClient.get_object_info_new({objects:e
}).then((function(t){return e.forEach((function(e,n){w[e.ref]={name:t[n][1],
ws:t[n][7],type:t[n][2].split("-")[0],link:t[n][7]+"/"+t[n][1]}})),null})):null
}))}(t).then((function(){return function(t,e){
var n=u.getTableSettings(t,u.obj.data);e.rmLoading(),e.append(l({
class:"table table-bordered table-striped",dataKBTesthookElement:"table",style:{
marginLeft:"auto",marginRight:"auto"}})),e.find("table").dataTable(n),j(t.name)
}(t,n),null})).catch((function(t){return y(n,t.message||t.error.message),null}))
}}))})))}))})).catch((function(t){console.error("ERROR getting objects",t)}))
;var w={};function y(t,e){t.empty(),t.append("<br>"),t.append(n.makePanel({
title:"Error",content:e}))}function j(n){var a=s.tabContent(n).find(".id-click")
;a.unbind("click"),a.click((function(){var n={id:t(this).data("id"),
type:t(this).data("type"),method:t(this).data("method"),ref:t(this).data("ref"),
name:t(this).data("name"),ws:t(this).data("ws"),action:t(this).data("action")
},a=t("<div>");s.addTab({name:n.id,content:a,removable:!0
}),s.showTab(n.id),e.try((function(){
if(n.method&&"undefined"!==n.method)return e.try((function(){return a.loading(),
u.obj[n.method](n)})).then((function(t){if(a.rmLoading(),t){
var e=u.verticalTable({rows:t});a.append(e),j(n.id)
}else a.append("<br>No data found for "+n.id)}))
;"openWidget"===n.action&&a.kbaseTabTable({ws:n.ws,type:n.type,obj:n.name})
})).catch((function(t){
console.error(t),a.empty(),a.append("ERROR: "+t.message).css("color","red").css("text-align","center").css("padding","10px")
}))}))}function _(e,n,a,i){return function(r){
if("tabLink"===n&&"dispIDCompart"===a){var o=r[e]
;return"dispid"in r&&(o=r.dispid),d({class:"id-click",dataId:r[e],dataMethod:i,
dataKBTesthookField:e},o)}if("tabLink"===n&&"dispID"===a){var s=r[e];return d({
class:"id-click",dataId:s,dataMethod:i,dataKBTesthookField:e},s)}
if("wstype"===n&&"dispWSRef"===a){var l=w[r[e]]
;return l&&l.link?'<a href="'+p+l.link+'" target="_blank" " class="id-click"" data-ws="'+l.ws+'" data-id="'+l.name+'" data-ref="'+r[e]+'" data-type="'+l.type+'" data-action="openPage"" data-method="'+i+'" data-name="'+l.name+'">'+l.name+"</a>":"no link"
}var u=r[e];return t.isArray(u)?c({dataKBTesthookField:e
},"tabLinkArray"===n?B(u,i):r[e].join(", ")):c({dataKBTesthookField:e},u)}}
function B(t,e){var n=[];return t.forEach((function(a){var i=a.id
;"dispid"in a&&(i=a.dispid),n.push(t({class:"id-click",dataId:a.id,dataMethod:e
},i))})),n.join(", ")}this.getTableSettings=function(t,e){for(var n=function(t){
for(var e=[],n=t.columns,a=0;a<n.length;a++){
var i=n[a],r=i.key,o=i.type,s=i.linkformat,d=i.method,c=(i.action,{
sTitle:i.label,sDefaultContent:"-",mData:_(r,o,s,d)})
;i.width&&(c.sWidth=i.width),e.push(c)}return e}(t),a={
dom:'<"top"lf>rt<"bottom"ip><"clear">',aaData:u.obj[t.key],aoColumns:n,
bAutoWidth:!1,language:{search:"_INPUT_",searchPlaceholder:"Search "+t.name}
},i=0;i<t.columns.length;i++){t.columns[i];a.fnDrawCallback=function(){j(t.name)
}}return a},this.verticalTable=function(e){
for(var n=e.data,a=e.rows,i=t('<table class="table table-bordered" style="margin-left: auto; margin-right: auto;">'),r=0;r<a.length;r++){
var o=a[r],s=o.type
;if(!("data"in o&&void 0===o.data||"key"in o&&void 0===n[o.key])){
var c,l=t("<tr>")
;if(l.append("<td><b>"+o.label+"</b></td>"),"data"in o)c="tabLinkArray"===s?B(o.data,o.method):"tabLink"===s?d({
class:"id-click",dataId:o.data,dataMethod:o.method
},o.dispid):o.data,l.append("<td>"+c+"</td>");else if("key"in o)if("wstype"===o.type){
var u=n[o.key],h=t('<td data-ref="'+u+'">loading...</td>')
;l.append(h),A(u).then((function(t){var e=t.url.split("/")[1],n=t.ref
;return i.find("[data-ref='"+n+"']").html('<a href="'+p+t.url+'" target="_blank">'+e+"</a>"),
null})).catch((function(t){return console.error(t),null}))
}else l.append('<td data-k-b-testhook-field="'+o.key+'">'+n[o.key]+"</td>");else"pictureEquation"===o.type&&l.append(t("<td></td>").append(this.pictureEquation(o.data)))
;i.append(l)}}return i},this.getBiochemReaction=function(t){return new a({
url:this.runtime.config("services.service_wizard.url"),
token:this.runtime.service("session").getAuthToken(),module:"BiochemistryAPI"
}).callFunc("get_reactions",[{reactions:[t]}]).spread((function(t){return t[0]
}))},this.getBiochemCompound=function(t){return new a({
url:this.runtime.config("services.service_wizard.url"),
token:this.runtime.service("session").getAuthToken(),module:"BiochemistryAPI"
}).callFunc("get_compounds",[{compounds:[t]}]).spread((function(t){return t[0]
}))},this.getBiochemCompounds=function(t){return new a({
url:this.runtime.config("services.service_wizard.url"),
token:this.runtime.service("session").getAuthToken(),module:"BiochemistryAPI"
}).callFunc("get_compounds",[{compounds:t}]).then(([t])=>t)
},this.compoundImage=function(t){
return"<img src=http://minedatabase.mcs.anl.gov/compound_images/ModelSEED/"+t.split("_")[0]+".png style='height:300px !important;'>"
};var T="http://bioseed.mcs.anl.gov/~chenry/jpeg/";function A(t){
return u.workspaceClient.get_object_info_new({objects:[{ref:t}]
}).then((function(t){var e=t[0];return{url:e[7]+"/"+e[1],
ref:e[6]+"/"+e[0]+"/"+e[4]}}))}return this.pictureEquation=function(e){
for(var n=function(t){var e={},n=t.split("=")
;return e.left=n[0].match(/cpd\d*/g),e.right=n[1].match(/cpd\d*/g),e
}(e),a=t("<div></div>"),i=0;i<n.left.length;i++){var r=n.left[i],o=T+r+".jpeg"
;a.append('<div class="pull-left text-center">                                    <img src="'+o+'" width=150 ><br>                                    <div class="cpd-id" data-cpd="'+r+'">'+r+"</div>                                </div>"),
(d=t('<div class="pull-left text-center">+</div>')).css("margin","30px 0 0 0"),
i<n.left.length-1&&a.append(d)}
var s=t('<div class="pull-left text-center"><=></div>')
;s.css("margin","25px 0 0 0"),a.append(s);for(i=0;i<n.right.length;i++){var d
;r=n.right[i],o=T+r+".jpeg"
;a.append('<div class="pull-left text-center">                                    <img src="'+o+'" data-cpd="'+r+'" width=150 ><br>                                    <div class="cpd-id" data-cpd="'+r+'">'+r+"</div>                                </div>"),
(d=t('<div class="pull-left text-center">+</div>')).css("margin","25px 0 0 0"),
i<n.right.length-1&&a.append(d)}var c=n.left.concat(n.right)
;return this.getBiochemCompounds(c).then((function(e){var n={}
;for(var a in e)n[e[a].id]=e[a].name;return t(".cpd-id").each((function(){
t(this).html(n[t(this).data("cpd")])})),null})).catch((function(t){
console.error(t)})),a},this}})}));