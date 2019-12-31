define(["bluebird","knockout","kb_lib/widgetUtils","kb_lib/html","kb_lib/htmlBuilders","./components/main","./model"],(function(e,t,o,s,i,r,n){
"use strict";const c=(0,s.tag)("div");return class{constructor(e){
this.runtime=e.runtime,
this.workspaceId=e.workspaceId,this.objectId=e.objectId,this.objectVersion=e.objectVersion,
this.createdObjects=null,this.vm={runtime:e.runtime,state:t.observable(),
error:t.observable()}}loadRootComponent(){this.node.innerHTML=c({dataBind:{
component:{name:r.quotedName(),params:{report:"report",links:"links",
createdObjects:"createdObjects",runtime:"runtime",workspaceId:"workspaceId",
objectId:"objectId",objectVersion:"objectVersion"}}}
}),t.applyBindings(this.vm,this.node)}attach(e){this.node=e}start(t){
const s=new o.Params(t);return this.workspaceId=s.check("workspaceId","number",{
required:!0}),this.objectId=s.check("objectId","number",{required:!0
}),this.objectVersion=s.check("objectVersion","number",{required:!0
}),this.vm.workspaceId=this.workspaceId,
this.vm.objectId=this.objectId,this.vm.objectVersion=this.objectVersion,
this.node.innerHTML=i.loading(),this.model=new n({runtime:this.runtime,
workspaceId:this.workspaceId,objectId:this.objectId,
objectVersion:this.objectVersion
}),this.vm.model=this.model,this.model.fetchReport().then(t=>(this.vm.report=t,
e.all([this.model.getLinks(),this.model.getCreatedObjects()]))).spread((e,t)=>{
this.vm.links=e,this.vm.createdObjects=t,this.loadRootComponent()})}stop(){}
detach(){this.node=""}}}));