define(["jquery","./colorbrewer/colorbrewer","kb_service/client/workspace","uuid","datatables_bootstrap","kbaseUI/widget/legacy/authenticatedWidget","kbaseUI/widget/legacy/kbaseTable"],(function(e,t,a,o){
"use strict";e.KBWidget({name:"KBaseOntologyTranslation",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",options:{},init:function(o){
this._super(o);const n={}
;if(this.options.workspaceId)n.wsid=this.options.workspaceId;else{
if(!this.options.workspaceName)throw new Error("Workspace id or name required")
;n.workspace=this.options.workspaceName}
if(this.options.objectId)n.objid=this.options.objectId;else{
if(!this.options.objectName)throw new Error("Object id or name required")
;n.name=this.options.objectName}this.colors=t.Set2[8],this.colorMap={}
;var l=this;return new a(this.runtime.config("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()
}).get_objects([n]).then((function(t){t=t[0].data;var a=l.data("metaElem")
;a.empty();var o,n={};t.comment.split(/\n/).forEach((function(e){
var t=e.split(/:/);if(t.length>2){var a=t.slice(1,t.length).join(":");t=[t[0],a]
}2===t.length&&(n[t[0]]=t[1])
})),Object.keys(n).length&&(n["external resource"]&&(n["external resource"]=e.jqElem("a").attr("href",n["external resource"]).attr("target","_blank").append(n["external resource"])),
o=e.jqElem("div").kbaseTable({allowNullRows:!1,structure:{
keys:Object.keys(n).sort(),rows:n}}));var r={ncbi:"KBaseOntology/1",
po:"KBaseOntology/2",go:"KBaseOntology/3",toy:"KBaseOntology/4",
sso:"KBaseOntology/8",peo:"KBaseOntology/9",pto:"KBaseOntology/10",
eo:"KBaseOntology/11"},s=e.jqElem("div").kbaseTable({allowNullRows:!1,
structure:{keys:[{value:"ontology1",label:"Ontology 1"},{value:"ontology2",
label:"Ontology 2"},{value:"comment",label:"Comment"}],rows:{
ontology1:r[t.ontology1]?e.jqElem("a").attr("href","/#dataview/"+r[t.ontology1]).attr("target","_blank").append(t.ontology1):t.ontology1,
ontology2:r[t.ontology2]?e.jqElem("a").attr("href","/#dataview/"+r[t.ontology2]).attr("target","_blank").append(t.ontology2):t.ontology2,
comment:o?o.$elem:t.comment}}});a.append(s.$elem);var i=[]
;e.each(Object.keys(t.translation).sort(),(function(a,o){var n=t.translation[o]
;e.each(n.equiv_terms,(function(e,t){i.push([o,t.equiv_name,t.equiv_term])}))}))
;var d=r[t.ontology2];l.data("tableElem").DataTable({columns:[{title:"Term ID",
class:"ontology-top"},{title:"Equivalent Name"},{title:"Equivalent Term"}],
createdRow:function(t,a){var o=e("td",t).eq(2)
;o.empty(),o.append(l.termLink(a[2],d))}
}).rows.add(i).draw(),l.data("loaderElem").hide(),
l.data("globalContainerElem").show()})).catch((function(e){
l.$elem.empty(),l.$elem.addClass("alert alert-danger").html("Could not load object : "+e.error.message)
})),this.appendUI(this.$elem),this},termLink:function(t,a){
return null!=a?e.jqElem("a").attr("target","_blank").attr("href","/#dataview/"+a+"?term_id="+t).append(t):t
},appendUI:function(t){
t.append(e.jqElem("style").text(".ontology-top { vertical-align : top }"))
;var a=e.jqElem("div").append("<br>&nbsp;Loading data...<br>&nbsp;please wait...<br>&nbsp;Data parsing may take upwards of 30 seconds, during which time this page may be unresponsive.").append(e.jqElem("br")).append(e.jqElem("div").attr("align","center").append(e.jqElem("i").addClass("fa fa-spinner").addClass("fa fa-spin fa fa-4x")))
;this.data("loaderElem",a),t.append(a)
;var o=this.data("globalContainerElem",e.jqElem("div").css("display","none"))
;t.append(o)
;var n=this.data("metaElem",e.jqElem("div")),l=this.createContainerElem("Translation Information",[n])
;this.data("metaContainerElem",l),o.append(l)
;var r=e.jqElem("table").addClass("display").css({width:"100%",
border:"1px solid #ddd"})
;this.data("tableElem",r),this.data("colorMapElem",e.jqElem("div"))
;var s=this.createContainerElem("Translation Dictionary",[r])
;return this.data("containerElem",s),o.append(s),t},
createContainerElem:function(t,a,n){
const l=new o(4).format(),r=new o(4).format()
;var s=e.jqElem("div").addClass("panel-body collapse in")
;return e.each(a,(function(e,t){s.append(t)
})),e.jqElem("div").addClass("panel panel-default").css("display",n).append(e.jqElem("div").addClass("panel-heading").attr("id",l).attr("role","tab").on("click",(function(){
e(this).next().collapse("toggle"),e(this).find("i").toggleClass("fa-rotate-90")
})).append(e.jqElem("h4").addClass("panel-title").append(e.jqElem("span").attr("data-toggle","collapse").attr("data-target","#"+r).attr("aria-expanded","true").attr("aria-controls","#"+r).css("cursor","pointer").append(e.jqElem("span").text(t).css("margin-left","10px"))))).append(e.jqElem("div").addClass("panel-collapse collapse in").attr("id",r).attr("role","tabpanel").attr("aria-expanded","true").append(s))
}})}));