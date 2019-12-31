define(["knockout","../registry","../lib/viewModelBase","../lib/generators","kb_lib/html"],(function(t,e,a,n,s){
"use strict";class o extends a{constructor(e){super(e)
;const{tabs:a,tabContext:n}=e
;this.tabContext=n,this.tabsetId=s.genId(),this.tabs=t.observableArray(),
this.tabClasses=t.observableArray(["nav","nav-tabs"]),
this.activeTab=t.observable(),this.parentBus.on("add-tab",t=>{this.addTab(t.tab)
}),this.parentBus.on("select-tab",t=>{
"number"==typeof t&&this.doSelectTab(this.tabs()[t])}),a&&a.forEach(t=>{
this.tabs.push(this.makeTab(t))
}),"active"in e||this.tabs().length>0&&(this.tabs()[0].active(!0),
this.activeTab(this.tabs()[0])),this.parentBus.send("ready")}doCloseTab(t){
const e=this.tabs.indexOf(t);if(this.tabs.remove(t),0===e)return
;if(t!==this.activeTab())return;let a
;const n=this.tabs().length,s=this.tabs().reduce((t,e)=>t+(e.closable()?1:0),0)
;a=s>0?e===n-s?this.tabs()[e+1]:this.tabs()[e-1]:this.tabs()[0],
this.activateTab(a),a.active(!0)}makeTab(e){let a,n;return e.tab.component&&(a={
name:e.tab.component.name,params:e.tab.component.params,
stringifiedParams:this.paramsToString(e.tab.component.params)
}),e.panel.component&&(n={name:e.panel.component.name,
params:e.panel.component.params,
stringifiedParams:this.paramsToString(e.panel.component.params)}),{id:e.id,tab:{
label:e.tab.label,component:a},panel:{component:n,content:e.panel.content},
active:t.observable(e.active||!1),closable:t.observable(e.closable||!1)}}
paramsToString(t){return"{"+Object.keys(t).map(e=>e+":"+t[e])+"}"}addTab(t,e){
const a=this.makeTab(t)
;this.tabs.push(a),e&&(this.deactivateCurrentTab(),this.activateTab(a))}
activateTab(t){t.active(!0),this.activeTab(t)}deactivateCurrentTab(){
this.activeTab()&&this.activeTab().active(!1)}doSelectTab(t){
this.deactivateCurrentTab(),this.activateTab(t)}}
const i=s.tag,l=i("ul"),c=i("li"),r=i("a"),b=i("span"),d=i("div")
;const p=s.makeStyles({component:{css:{flex:"1 1 0px",display:"flex",
flexDirection:"column"}},tabSet:{css:{borderBottom:"1px solid #ddd",
paddingLeft:"0",marginBottom:"0",listStyle:"none"},pseudoClasses:{after:{
display:"table",content:" ",clear:"both"}}},tab:{css:{float:"left",
marginBottom:" -1px",position:"relative",display:"block",userSelect:"none",
"-webkit-user-select":"none","-moz-user-select":"none","-ms-user-select":"none"}
},tabLink:{css:{display:"inline-block",marginRight:"2px",
lineHeight:"1.42857143",border:"1px solid transparent",
borderRadius:" 4px 4px 0 0",position:"relative",padding:"10px 15px",
cursor:"pointer"},pseudo:{hover:{borderColor:"#eee #eee #ddd",
textCecoration:"none",backgroundColor:"#eee",outline:0},active:{
textCecoration:"none",backgroundColor:"#eee",outline:0}}},tabLinkActive:{css:{
color:"#555",cursor:"default",backgroundColor:"#fff",border:"1px solid #ddd",
borderBottomColor:"transparent"},pseudo:{hover:{textDecoration:"none",
backgroundColor:"#fff",borderColor:"#ddd #ddd #ddd",
borderBottomColor:"transparent"}}},tabButton:{css:{padding:"0 4px",
marginLeft:"8px",color:"#000",cursor:"pointer",textDecoration:"none"},
pseudoElement:{before:{color:"#888"}}},tabContent:{css:{flex:"1 1 0px",
display:"flex",flexDirection:"column",overflowY:"auto"}},tabPane:{css:{
flex:"1 1 0px",display:"flex",flexDirection:"column"}}})
;return e.registerComponent((function(){return{viewModel:o,template:d({
class:p.classes.component,dataKBTesthookComponent:"tabset"},[l({
class:p.classes.tabSet,dataBind:{attr:{id:"tabsetId"},foreach:{data:"tabs"}},
role:"tablist"},c({role:"presentation",class:p.classes.tab,dataBind:{css:{
active:"active"}}},[r({dataBind:{
click:"function (d, e) {$component.doSelectTab.call($component, d);}",attr:{
"data-k-b-testhook-tab":"tab.id"},
class:'active() ? "'+p.classes.tabLinkActive+'": ""'},role:"tab",
class:p.classes.tabLink},[b({dataBind:{text:"tab.label"}
}),n.if("tab.component",n.let({__tab:"tab"},n.with("$component.tabContext",b({
dataBind:{component:{name:"__tab.component.name",
params:'function(){return eval("[" + __tab.component.stringifiedParams + "][0]");}()'
}},dataKBTesthookButton:"tab"})))),n.if("closable",b({class:p.classes.tabButton,
dataBind:{click:"$component.doCloseTab"}},b({class:"fa fa-times"})))])])),d({
class:p.classes.tabContent,style:{position:"relative"},dataBind:{foreach:{
data:"tabs"}}},n.if("active",d({dataBind:{attr:{active:"active"},css:{
in:"active",active:"active"}},class:[p.classes.tabPane,"fade"],role:"tabpanel"
},n.if("panel.component",n.let({__panel:"panel"
},n.with("$component.tabContext",d({style:{flex:"1 1 0px",display:"flex",
flexDirection:"column"},dataBind:{component:{name:"__panel.component.name",
params:'function(){return eval("[" + __panel.component.stringifiedParams + "][0]");}()'
}}}))),n.if("panel.content",d({style:{flex:"1 1 0px",display:"flex",
flexDirection:"column"},dataBind:{html:"panel.content"}
}),d("** NO CONTENT **"))))))]),stylesheet:p.sheet}}))}));