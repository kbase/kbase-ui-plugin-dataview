define(["jquery","bluebird","kb_lib/html"],(e,t,n)=>{"use strict";return class{
constructor(e){
const{runtime:t,widget:{module:n,jquery_object:r,panel:i,title:s}}=e
;if(!e.runtime)throw{type:"ArgumentError",reason:"RuntimeMissing",
message:"The runtime factory construction property is required but not provided"
}
;this.module=n,this.jqueryObjectName=r,this.wantPanel=!!i,this.title=s,this.runtime=t,
this.mount=null,this.container=null,this.$container=null}init(){
return new t((e,t)=>{require([this.module],()=>{e()},e=>{t(e)})})}attach(r){
return new t((t,i)=>{
this.mount=r,this.container=document.createElement("div"),this.mount.appendChild(this.container),
this.wantPanel?this.$container=function(t,r){
var i=n.genId(),s=n.tag("div"),a=n.tag("span");return t.html(s({
class:"panel panel-default "},[s({class:"panel-heading"},[a({class:"panel-title"
},r)]),s({class:"panel-body"},[s({id:i})])])),e("#"+i)
}(e(this.container),this.title):this.$container=e(this.container),
void 0===this.$container[this.jqueryObjectName]?i(new Error("Sorry, cannot find jquery widget "+this.jqueryObjectName)):t()
})}start(e){return new t(t=>{var n=Object.assign({},e,{wsNameOrId:e.workspaceId,
objNameOrId:e.objectId,ws_url:this.runtime.config("services.workspace.url"),
token:this.runtime.service("session").getAuthToken(),runtime:this.runtime})
;this.$container[this.jqueryObjectName](n),t()})}run(){return t.resolve()}
stop(){return t.resolve()}detach(){return t.resolve()}destroy(){
return t.resolve()}}});