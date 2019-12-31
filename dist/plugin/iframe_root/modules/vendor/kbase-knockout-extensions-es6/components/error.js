define(["knockout","../registry","../lib/generators","kb_lib/html","kb_lib/htmlBootstrapBuilders"],(function(e,a,t,i,l){
"use strict";const d=(0,i.tag)("div");class s{constructor(a){this.info=null
;const t=e.unwrap(a.info)
;void 0!==t&&(this.info=l.buildPresentableJson(t)),this.source=a.source,
this.code=a.code,
this.message=a.message,this.detail=a.detail,this.stackTrace=a.stackTrace}}
return a.registerComponent((function(){return{viewModel:s,
template:d([l.buildPanel({name:"message",class:"kb-panel-light",title:"Message",
type:"danger",body:d({dataBind:{text:"message"}})}),t.if("source",l.buildPanel({
name:"source",class:"kb-panel-light",title:"Source",type:"danger",body:d({
dataBind:{text:"source"}})})),t.if("code",l.buildPanel({name:"code",
class:"kb-panel-light",title:"Code",type:"danger",body:d({dataBind:{text:"code"}
})})),t.if("$data.detail",l.buildCollapsiblePanel({name:"detail",title:"Detail",
type:"danger",classes:["kb-panel-light"],collapsed:!1,hidden:!1,body:d({
dataBind:{html:"detail"}})})),t.if("$data.info",l.buildCollapsiblePanel({
name:"info",title:"Info",type:"danger",classes:["kb-panel-light"],collapsed:!0,
hidden:!1,body:d({dataBind:{if:"$data.info"}},d({dataBind:{html:"$data.info"}}))
})),t.if("$data.stackTrace",l.buildCollapsiblePanel({name:"stackTrace",
title:"Stack Trace",type:"danger",classes:["kb-panel-light"],collapsed:!0,
hidden:!1,body:d({dataBind:{foreach:"$data.stackTrace"}},d({dataBind:{
text:"$data"}}))}))])}}))}));