define(["knockout","kb_knockout/registry","kb_knockout/lib/generators","kb_knockout/lib/viewModelBase","kb_lib/html","./warnings","./report","./summary","./links","./files","./createdObjects"],(function(t,e,s,i,a,n,l,r,o,h,c){
"use strict";const m=a.tag,d=m("span"),p=m("div");class u extends i{
constructor(t){
super(t),this.report=t.report,this.links=t.links,this.createdObjects=t.createdObjects,
this.hasWarnings=!1,
this.report.warnings&&this.report.warnings.length>0&&(this.hasWarnings=!0),
this.report.text_message&&this.report.text_message.length>0?(this.hasSummary=!0,
this.summary=this.report.text_message,
this.summaryHeight=this.report.summary_window_height||500):this.hasSummary=!1,
this.report.file_links&&this.report.file_links.length>0?this.hasFiles=!0:this.hasFiles=!1,
this.links&&this.links.length>0?this.hasLinks=!0:this.hasLinks=!1,
this.report.direct_html&&this.report.direct_html.length>0?(this.hasDirectHtml=!0,
/<html/.test(this.report.direct_html)?this.hasDirectHtmlDocument=!0:this.hasDirectHtmlDocument=!1):(this.hasDirectHtmlDocument=!1,
this.hasDirectHtml=!1),
"number"==typeof this.report.direct_html_link_index&&this.report.direct_html_link_index>=0?(this.hasDirectHtmlIndex=!0,
this.directHtmlLink=this.links[this.report.direct_html_link_index]):(this.hasDirectHtmlIndex=!1,
this.directHtmlLink=!1,
this.link=null),this.hasDirectHtml||this.hasDirectHtmlIndex?this.collapseSummary=!0:this.collapseSummary=!1
}}function k(t){var e=["fa"],s={verticalAlign:"middle"}
;return e.push("fa-"+t.name),
t.rotate&&e.push("fa-rotate-"+String(t.rotate)),t.flip&&e.push("fa-flip-"+t.flip),
t.size&&("number"==typeof t.size?e.push("fa-"+String(t.size)+"x"):e.push("fa-"+t.size)),
t.classes&&t.classes.forEach((function(t){e.push(t)
})),t.style&&Object.keys(t.style).forEach((function(e){s[e]=t.style[e]
})),t.color&&(s.color=t.color),d({dataElement:"icon",style:s,class:e.join(" ")})
}function g(t){
var e,s=a.genId(),i=["panel","panel-"+(t.type||"primary")],n=t.style||{}
;return t.hidden&&i.push("hidden"),
t.classes&&(i=i.concat(t.classes)),t.icon&&(e=[" ",k(t.icon)]),p({
class:i.join(" "),dataElement:t.name,style:n},[p({class:"panel-heading"},[p({
class:"panel-title"},d({dataElement:"title",dataToggle:"collapse",
dataTarget:"#"+s,style:{cursor:"pointer"},dataBind:{css:{
collapsed:t.collapsed||!1}}},[t.title,e]))]),p({id:s,
class:"panel-collapse collapse",dataBind:{css:{in:"!"+t.collapsed||!0}}},p({
class:"panel-body",dataElement:"body"},[t.body]))])}
return e.registerComponent((function(){return{viewModel:u,
template:p({},[s.if("hasWarnings",g({classes:["kb-panel-light"],
title:"Warnings",body:p({dataBind:{component:{name:n.quotedName(),params:{
warnings:"report.warnings"}}}})
})),s.if("report.objects_created && report.objects_created.length > 0",g({
classes:["kb-panel-light"],title:"Objects Created",body:p({dataBind:{component:{
name:c.quotedName(),params:{createdObjects:"createdObjects"}}}})
})),s.if("hasDirectHtml || hasDirectHtmlIndex",g({classes:["kb-panel-light"],
title:"Report",body:p({dataBind:{component:{name:l.quotedName(),params:{
report:"report",links:"links"}}}})})),s.if("hasSummary",g({
classes:["kb-panel-light"],title:"Summary",
collapsed:"$component.collapseSummary",body:p({dataBind:{component:{
name:r.quotedName(),params:{summary:"summary",height:"summaryHeight"}}}})
})),s.if("hasLinks",g({classes:["kb-panel-light"],title:"Links",body:p({
dataBind:{component:{name:o.quotedName(),params:{links:"links"}}}})
})),s.if("hasFiles",g({classes:["kb-panel-light"],title:"Files",body:p({
dataBind:{component:{name:h.quotedName(),params:{files:"report.file_links"}}}})
}))])}}))}));