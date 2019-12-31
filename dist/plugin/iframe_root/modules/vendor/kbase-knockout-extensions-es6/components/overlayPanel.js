define(["knockout","kb_lib/html","../registry","../lib/generators","../lib/viewModelBase"],(function(e,o,t,n,s){
"use strict";const a=o.tag,i=a("span"),l=a("div");class p extends s{
constructor(o){
super(o),this.showPanel=e.observable(),this.openMessage=null,this.component=o.component,
this.panelStyle=e.pureComputed(()=>{
if(void 0!==this.showPanel())return this.showPanel()?r.classes.panelin:r.classes.panelout
}),this.typeBackgroundColor=e.pureComputed(()=>{
if(o.component())switch(o.component().type){case"error":
return"rgba(145, 91, 91, 0.8)";case"info":default:return"rgba(64, 89, 140, 0.8)"
}
}),this.embeddedComponentName=e.observable(),this.embeddedParams=e.observable(),
this.embeddedViewModel=e.observable({}),this.subscribe(this.component,e=>{
e?this.openComponent(e):this.showPanel()&&this.closeComponent()
}),document.body.addEventListener("keyup",e=>{
"Escape"===e.key&&this.closeComponent()}),this.on("close",e=>{
this.closeComponent(e)})}openComponent(e){
if(this.showPanel())return void this.closeComponent({open:e})
;this.showPanel(!0),
this.embeddedComponentName(e.name),this.embeddedParams("{"+Object.keys(e.params||{}).map(o=>o+":"+e.params[o]).join(", ")+"}"),
this.embeddedParams.link="link"
;const o=Object.keys(e.viewModel).reduce((o,t)=>(o[t]=e.viewModel[t],o),{})
;o.onClose=()=>{this.closeComponent()},o.link=this.bus,this.embeddedViewModel(o)
}closeComponent(e){
e&&e.open?(this.openMessage=e.open,this.showPanel(!1)):this.showPanel(!1)}
clearComponent(){this.component(null),this.embeddedComponentName(null)}
doClose(){this.closeComponent()}onPanelAnimationEnd(e,o){
o.target.classList.contains(r.classes.panelout)&&(this.openMessage?(this.openComponent(this.openMessage),
this.openMessage=null):this.clearComponent())}}const r=o.makeStyles({classes:{
container:{css:{position:"absolute",top:"0",left:"-100%",bottom:"0",right:"0",
width:"100%",zIndex:"3",backgroundColor:"rgba(0,0,0,0.6)"}},panel:{css:{
position:"absolute",top:"0",left:"12.5%",bottom:"0",width:"75%",zIndex:"3"}},
panelBody:{css:{position:"absolute",top:"30px",left:"0",bottom:"30px",
width:"100%",display:"flex",flexDirection:"column"}},panelButton:{css:{
position:"absolute",top:"38px",right:"8px",color:"rgba(150,150,150,1)",
cursor:"pointer",zIndex:"4"},pseudo:{hover:{color:"rgba(75,75,75,1)"},active:{
color:"rgba(0,0,0,1)"}}},panelin:{css:{animationDuration:"0.3s",
animationName:"fadein",animationIterationCount:"1",animationDirection:"normal",
opacity:"1",left:"0"}},panelout:{css:{animationDuration:"0.3s",
animationName:"fadeout",animationIterationCount:"1",animationDirection:"normal",
opacity:"0",left:"-100%"}},miniButton:{css:{padding:"2px",
border:"2px transparent solid",cursor:"pointer"},pseudo:{hover:{
border:"2px white solid"},active:{border:"2px white solid",
backgroundColor:"#555",color:"#FFF"}}}},rules:{keyframes:{slidein:{from:{
left:"-100%"},to:{left:"0"}},slideout:{from:{left:"0"},to:{left:"-100%"}},
fadein:{from:{opacity:"0"},to:{opacity:"1"}},fadeout:{from:{opacity:"1",left:"0"
},to:{opacity:"0",left:"0"}}}}});return t.registerComponent((function(){return{
viewModel:p,template:l({dataBind:{css:"panelStyle",event:{
animationend:"onPanelAnimationEnd"}},class:r.classes.container},l({
class:r.classes.panel},[r.sheet,l({dataBind:{click:"doClose"},
class:r.classes.panelButton},i({class:"fa fa-times"})),l({
class:r.classes.panelBody
},[n.if("embeddedComponentName()",n.with("embeddedViewModel()",l({dataBind:{
component:{name:"$component.embeddedComponentName",params:"$data"}},style:{
flex:"1 1 0px",display:"flex",flexDirection:"column"}})))])]))}}))}));