define(["knockout","kb_knockout/registry","kb_knockout/lib/generators","kb_knockout/lib/viewModelBase","kb_lib/html"],(function(t,e,i,r,n){
"use strict";const a=n.tag,h=a("div"),l=a("a"),d=a("span"),s=a("iframe")
;class o extends r{constructor(t){
super(t),this.report=t.report,this.links=t.links,
this.report.direct_html&&this.report.direct_html.length>0?(this.hasDirectHtml=!0,
/<html/.test(this.report.direct_html)?this.hasDirectHtmlDocument=!0:this.hasDirectHtmlDocument=!1,
this.wrappedDirectHtml=function(t){
if(/<html/.test(t))return console.warn("Html document inserted into iframe"),t
;var e=n.tag,i=e("html"),r=e("head"),a=e("body");return i([r(),a({style:{
margin:"0px",padding:"0px",overflow:"auto"}},[t])])
}(h({},this.report.direct_html))):(this.hasDirectHtmlDocument=!1,
this.hasDirectHtml=!1),
"number"==typeof this.report.direct_html_link_index&&this.report.direct_html_link_index>=0?(this.hasDirectHtmlIndex=!0,
this.link=this.links[this.report.direct_html_link_index]):(this.hasDirectHtmlIndex=!1,
this.link=null),
this.height=this.report.html_window_height||500,this.frameId="frame_"+n.genId()}
}function m(){return s({style:{display:"block",width:"100%",height:"auto",
margin:0,padding:0},dataBind:{style:{"max-height":'height + "px"'},attr:{
id:"frameId","data-frame":"frameId",srcdoc:"wrappedDirectHtml"}},
frameborder:"0",scrolling:"no"})}function c(){
return i.if("hasDirectHtmlDocument",s({style:{display:"block",width:"100%",
margin:0,padding:0},dataBind:{style:{"max-height":'height + "px"',
height:'height + "px"'},attr:{id:"frameId","data-frame":"frameId",
src:'"data:text/html;charset=utf-8," + encodeURIComponent(report.direct_html)'}
},frameborder:"0"}),i.if("hasDirectHtml",m(),"nothing"))}
return e.registerComponent((function(){return{viewModel:o,template:h({style:{}
},[i.if("hasDirectHtmlIndex",h([i.if("link",[h({style:{margin:"4px 4px 8px 0",
xborder:"1px silver solid"}},l({target:"_blank",class:"btn btn-default",
dataBind:{attr:{href:"link.url"}}},"View report in separate window")),s({style:{
display:"block",width:"100%",margin:0,padding:0},dataBind:{style:{
"max-height":'height + "px"',height:'height + "px"'},attr:{id:"frameId",
"data-frame":"frameId",src:"link.url"}},frameborder:"0",scrolling:"yes"})],h({
class:"alert alert-danger"},["Report not found for index ",d({dataBind:{
text:"report.direct_html_link_index"}})]))]),c())])}}))}));