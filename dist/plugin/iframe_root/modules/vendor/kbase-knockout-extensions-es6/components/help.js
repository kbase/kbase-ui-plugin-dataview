define(["knockout","../registry","../lib/generators","../lib/viewModelBase","kb_lib/html"],(function(e,t,i,s,n){
"use strict";const o=n.tag,c=o("div"),a=o("a"),r=o("ul"),l=o("li")
;class d extends s{constructor(t){
super(t),this.helpDb=t.helpDb,this.topics=this.helpDb.topics,
this.references=t.helpDb.references,
this.topicsIndex={},this.helpDb.topics.forEach(e=>{this.topicsIndex[e.id]=e
}),this.currentTopicId=e.observable(),
this.currentTopic=e.observable(),this.subscribe(this.currentTopicId,e=>{
this.currentTopic(this.topicsIndex[e])
}),this.currentTopicId(t.topic||"overview")}doSelectTopic(e){
this.currentTopicId(e.id)}}const p=n.makeStyles({classes:{component:{css:{
paddingTop:"12px"}},index:{css:{display:"inline-block",width:"30%",
border:"1px rgb(221,221,221) solid",padding:"6px",verticalAlign:"top"}},
indexList:{css:{listStyle:"none",padding:"0"}},indexListItem:{css:{
display:"block",padding:"4px"}},indexListItemLink:{css:{padding:"4px",
display:"block"},pseudo:{hover:{backgroundColor:"#DDD"}}},active:{css:{
backgroundColor:"#DDD"}},body:{css:{display:"inline-block",width:"70%",
padding:"6px 6px 6px 12px",verticalAlign:"top"}},title:{css:{fontWeight:"bold"}
},references:{css:{marginTop:"12px"}},markdown:{css:{},inner:{blockquote:{
fontSize:"inherit",marginLeft:"1em",paddingLeft:"1em",
borderLeft:"3px silver solid"},p:{maxWidth:"50em"},h1:{marginTop:"0",
marginBottom:"0",fontWeight:"bold",fontSize:"150%"},h2:{marginTop:"1em",
marginBottom:"0",fontWeight:"bold",fontSize:"133%"},h3:{marginTop:"1em",
marginBottom:"0",fontWeight:"bold",fontSize:"120%"},h4:{marginTop:"1em",
marginBottom:"0",fontWeight:"bold",textDecoration:"underline",fontSize:"100%"},
h5:{marginTop:"1em",marginBottom:"0",fontWeight:"bold",fontSize:"100%"}}}}})
;return t.registerComponent((function(){return{viewModel:d,template:c({
class:p.classes.component},[p.sheet,c({class:p.classes.index},[c({style:{
fontWeight:"bold"}}),r({dataBind:{foreach:"topics"},class:p.classes.indexList
},[i.if("!$data.disabled",l(a({dataBind:{text:"title",
click:"function(d,e){$component.doSelectTopic.call($component,d,e)}",
css:'id === $component.currentTopicId() ? "'+p.classes.active+'": ""'},
class:p.classes.indexListItem})))])]),c({dataBind:{with:"currentTopic"},
class:p.classes.body},[c({dataBind:{text:"title"},class:p.classes.title}),c({
dataBind:{htmlMarkdown:"content"},class:p.classes.markdown
})]),i.if("$data.references && references.length > 0",c({
class:p.classes.references},[c({class:p.classes.title},"References"),r({
dataBind:{foreach:"references"}},l(a({dataBind:{attr:{href:"url",
target:'external ? "_blank" : ""'},text:"title || url"}})))]))])}}))}));