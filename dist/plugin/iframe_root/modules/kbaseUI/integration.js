define(["./windowChannel","./runtime"],(t,e)=>{"use strict";return class{
constructor({rootWindow:e,pluginConfigDB:n}){
this.rootWindow=e,this.container=e.document.body,
this.hostParams=this.getParamsFromIFrame(),
this.hostChannelId=this.hostParams.channelId,
this.pluginParams=this.hostParams.params,
this.pluginConfigDB=n,this.authorized=null,
this.navigationListeners=[],this.navigationQueue=[],
this.channel=new t.BidirectionalWindowChannel({on:this.rootWindow,
host:document.location.origin,to:this.hostChannelId}),this.runtime=null}
getParamsFromIFrame(){
if(!this.rootWindow.frameElement.hasAttribute("data-params"))throw new Error("No params found in window!!")
;return JSON.parse(decodeURIComponent(this.rootWindow.frameElement.getAttribute("data-params")))
}showHelp(){this.rootViewModel.bus.send("help")}onNavigate(t){
if(this.navigationListeners.push(t),1===this.navigationListeners.length){
const t=this.navigationQueue
;this.navigationQueue=[],t.forEach(({path:t,params:e})=>{
this.navigationListeners.forEach(n=>{n({path:t,params:e})})})}}
handleNavigation({path:t,params:e}){
0===this.navigationListeners.length?this.navigationQueue.push({path:t,params:e
}):this.navigationListeners.forEach(n=>{n({path:t,params:e})})}setupListeners(){
this.channel.on("navigate",t=>{const{path:e,params:n}=t
;e&&0!==e.length||n.view?this.handleNavigation({path:e,params:n
}):alert("no view provided...")})}setupRuntimeListeners(){
this.runtime.messenger.receive({channel:"app",message:"navigate",handler:t=>{
this.channel.send("ui-navigate",t)}}),this.runtime.messenger.receive({
channel:"app",message:"post-form",handler:({action:t,params:e})=>{
this.channel.send("post-form",{action:t,params:e})}
}),this.runtime.messenger.receive({channel:"ui",message:"setTitle",handler:t=>{
this.channel.send("set-title",{title:t})}})}started(){
this.channel.send("started",{})}start(){return new Promise((t,n)=>{
this.channel.start(),this.channel.on("start",i=>{
const{authorization:{token:s,username:a,realname:h},config:r}=i
;this.authorization=s?{token:s,username:a,realname:h
}:null,this.token=s,this.username=a,
this.config=r,this.authorized=!!s,this.runtime=new e({config:r,token:s,
username:a,pluginConfigDB:this.pluginConfigDB}),this.runtime.start().then(()=>{
this.setupListeners(),this.setupRuntimeListeners(),t()}).catch(t=>{n(t)})
}),window.document.addEventListener("click",()=>{this.channel.send("clicked",{})
}),this.channel.send("ready",{})})}stop(){}}});