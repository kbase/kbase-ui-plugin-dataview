define(["jquery","vendor/datatables/jquery.dataTables","kbaseUI/widget/legacy/kbaseTable","kbaseUI/widget/legacy/kbaseTabs","uuid","kb_lib/jsonRpc/dynamicServiceClient","widgets/metagenomes/contigBrowserPanel","kbaseUI/widget/legacy/widget"],(function(e,n,a,t,i,o,r){
"use strict";function d(n){var a
;return"string"==typeof n?a=n:n.error?(a=JSON.stringify(n.error),
n.error.message?(a=n.error.message,
n.error.error&&(a+="<br><b>Trace</b>:"+n.error.error)):a=JSON.stringify(n.error)):a=n.message,
e("<div>").addClass("alert alert-danger").append(a)}function s(e){
return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}e.KBWidget({
name:"kbaseAnnotatedMetagenomeAssemblyView",parent:"kbaseWidget",
version:"1.0.0",token:null,width:1150,options:{id:null,ws:null,ver:null},
timer:null,lastElemTabNum:0,metagenome_info:null,state:function(){
var e=0,n=1,a=2,t=null,i=null;return{ok:function(e){t=n,i=e},error:function(e){
t=a,i=e},isUninitialized:function(){return t===e},isOk:function(){return t===n},
isError:function(){return t===a},info:function(){return i}}}(),init:function(e){
var n;if(this._super(e),e.upas)this.metagenome_ref=e.upas.id;else{
if(!(e.ws&&e.id&&e.ver))return n="Insufficient information for this widget",
console.error(n),void this.state.error({message:n})
;this.metagenome_ref=[e.ws,e.id,e.ver].join("/")}
return this.token=this.runtime.token,
this.state.ok(),this.attachClients(),this.render(),this},
attachClients:function(){this.metagenomeAPI=new o({module:"MetagenomeAPI",
url:this.runtime.getConfig("services.service_wizard.url"),token:this.token,
version:"dev"})},showError:function(n){this.$elem.empty()
;var a=e("<div>").css("clear","both");a.append(d(n)),this.$elem.append(a)},
tabData:function(){return{names:["Browse Features","Browse Contigs"],
ids:["browse_features","browse_contigs"]}},buildGeneSearchView:function(n){
var a=this,t=n.$div;if(t.is(":empty")){var i=n.ref,o=null
;n.idClick&&(o=n.idClick);var r=null;n.contigClick&&(r=n.contigClick)
;var s=0,p=["id",1],c=0,l=e('<input type="text" class="form-control" placeholder="Search Features">')
;l.prop("disabled",!0)
;var u=e("<div>"),f=e("<div>").append("<center>No matching features found.</center>").hide(),g=e("<div>"),h=e("<div>"),v=e("<div>").css("text-align","left"),m=e("<div>"),b=e("<div>").addClass("container-fluid").css({
margin:"15px 0px","max-width":"100%"});t.append(b)
;var w=e("<div>").addClass("row").append(e("<div>").addClass("col-md-4").append(v)).append(e("<div>").addClass("col-md-4").append(g)).append(e("<div>").addClass("col-md-4").append(l)),_=e("<div>").addClass("row").css({
"margin-top":"15px"
}).append(e("<div>").addClass("col-md-12").append(u)),C=e("<div>").addClass("row").append(e("<div>").addClass("col-md-12").append(f)),k=e("<div>").addClass("row").append(e("<div>").addClass("col-md-4").append(m)).append(e("<div>").addClass("col-md-8"))
;b.append(w).append(_).append(h).append(C).append(k)
;var y=e('<button class="btn btn-default">').append('<i class="fa fa-caret-left" aria-hidden="true">'),$=e('<button class="btn btn-default">').append('<i class="fa fa-caret-right" aria-hidden="true">')
;v.append(y),v.append($),v.hide();var T=function(n){n.empty()
;var a=e("<div>").attr("align","left").append(e('<i class="fa fa-spinner fa-spin fa-2x">'))
;n.append(a),window.setTimeout((function(){a.append("&nbsp; Building cache..."),
window.setTimeout((function(){a.append(" almost there...")}),25e3)}),2500)
},x=function(e,n,t,o){h.empty();var r=[]
;return"start"===o[0]&&r.push(["contig_id",1]),
r.push(o),a.metagenomeAPI.callFunc("search",[{ref:i,query:e,sort_by:r,start:n,
limit:t}]).spread((function(e){return e})).catch((function(e){
console.error(e),g.empty(),h.append(d(e))}))},F=function(n){var a=e("<tr>"),t=!1
;if(o){var i=function(e){return function(){o(e)}}
;a.append(e("<td>").append(e("<a>").css("cursor","pointer").append(n.feature_id).on("click",i(n))))
}else a.append(e("<td>").append(e("<div>").css("word-break","break-all").append(n.feature_id)))
;a.append(e("<td>").append(n.feature_type)),
a.append(e("<td>").append(n.function)),n.function&&(t=!0);var d=e("<td>")
;if(a.append(d),d=e("<td>"),a.append(d),n.global_location.contig_id){
var s=n.global_location
;a.append(e("<td>").append(A(s.start))),a.append(e("<td>").append(s.strand)),
a.append(e("<td>").append(A(s.stop))),r?(i=function(){return function(){
r(s.contig_id)}},a.append(e("<td>").append(e("<div>").css({
"word-break":"break-all"
}).append(e("<a>").css("cursor","pointer").append(s.contig_id).on("click",i(s.contig_id)))))):a.append(e("<td>").append(e("<div>").css("word-break","break-all").append(s.contig_id)))
}else a.append(e("<td>")).append(e("<td>")).append(e("<td>")).append(e("<td>"))
;return{$tr:a,hasFunc:t,hasOntology:!1,hasAlias:!1}},I=function(e,n){
e.find("tr:gt(0)").remove(),g.empty(),f.hide(),m.empty(),v.hide()
;var a=n.features;if(a.length>0){for(var t=!1,i=!1,o=!1,r=0;r<a.length;r++){
var d=F(a[r])
;e.append(d.$tr),d.hasFunc&&(t=!0),d.hasOntology&&(i=!0),d.hasAlias&&(o=!0)}
c=n.num_found,function(e,n,a){
m.empty(),m.append("Showing "+(e+1)+" to "+(e+n)+" of "+a)
}(n.start,a.length,n.num_found),
n.num_found,v.show(),t?e.find(".feature-tbl-function").css("width","25%"):e.find(".feature-tbl-function").css("width","1%"),
i?e.find(".feature-tbl-ontology_terms").css("width","25%"):e.find(".feature-tbl-ontology_terms").css("width","1%"),
o?e.find(".feature-tbl-aliases").css("width","25%"):e.find(".feature-tbl-aliases").css("width","1%")
}else f.show(),m.empty(),v.hide()
},S=e("<table>").addClass("table table-striped table-bordered table-hover").css({
"margin-left":"auto","margin-right":"auto"});u.append(S);var D=function(){
var n=!1,a=e("<colgroup>"),t=e("<tr>"),i={},o=function(e,a){
n||(p[0]==e?1===p[1]?(p[1]=0,
a.removeClass(),a.addClass("fa fa-sort-asc")):(p[1]=1,
a.removeClass(),a.addClass("fa fa-sort-desc")):(i[p[0]].$sortIcon.removeClass(),
p[0]=e,
p[1]=1,a.addClass("fa fa-sort-desc")),T(g),n=!0,s=0,x(l.val(),s,10,p).then((function(e){
I(S,e),n=!1,s=0})).catch((function(){n=!1})))},r=function(n,a,t,i,o,r){
r.$colgroup.append(e("<col span=1>").addClass("feature-tbl-"+n).css("width",t))
;var d=function(n,a,t){
var i=e("<i>").css("margin-left","8px"),o=e("<th>").append("<b>"+n+"</b>").append(i)
;return t&&o.css("cursor","pointer").on("click",(function(){t(a,i)})),{id:a,
name:n,$th:o,$sortIcon:i}}(a,n,o)
;r.$tr.append(d.$th),i&&d.$sortIcon.addClass("fa fa-sort-desc"),r.cols[d.id]=d
},d={$colgroup:a,$tr:t,cols:i}
;return r("id","Feature&nbsp;ID","1%",!0,o,d),r("type","Type","1%",!1,o,d),
r("functions","Function","25%",!1,o,d),
r("functional_descriptions","Func. Desc.","25%",!1,null,d),
r("aliases","Aliases","25%",!1,null,d),
r("starts","Start","1%",!1,o,d),r("strands","Strand","1%",!1,o,d),
r("stops","Length","1%",!1,o,d),r("contig_ids","Contig","5%",!0,o,d),{
$colgroup:a,$theader:t}}()
;S.append(D.$colgroup),S.append(D.$theader),T(g),x("",s,10,p).then((function(e){
l.prop("disabled",!1),I(S,e)})),y.on("click",(function(){
0!==s&&(s-10<0?s=0:s-=10,T(g),x(l.val(),s,10,p).then((function(e){I(S,e)})))})),
$.on("click",(function(){
s+10>c||(s+=10,T(g),x(l.val(),s,10,p).then((function(e){I(S,e)})))}));var N=null
;l.on("input",(function(){
N&&window.clearTimeout(N),N=window.setTimeout((function(){
N=null,T(g),s=0,x(l.val(),s,10,p).then((function(e){I(S,e)}))}),300)}))}
function A(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}},
buildContigSearchView:function(n){var a=this,t=n.$div;if(t.is(":empty")){
var i=n.ref,o=null;n.contigClick&&(o=n.contigClick)
;var r=0,s=["contig_id",1],p=0,c=e("<div>"),l=e("<div>").append("<center>No matching contigs found.</center>").hide(),u=e("<div>"),f=e("<div>"),g=e("<div>").css("text-align","left"),h=e("<div>"),v=e("<div>").addClass("container-fluid").css({
margin:"15px 0px","max-width":"100%"});t.append(v)
;var m=e("<div>").addClass("row").append(e("<div>").addClass("col-md-4").append(g)).append(e("<div>").addClass("col-md-4").append(u)),b=e("<div>").addClass("row").css({
"margin-top":"15px"
}).append(e("<div>").addClass("col-md-12").append(c)),w=e("<div>").addClass("row").append(e("<div>").addClass("col-md-12").append(l)),_=e("<div>").addClass("row").append(e("<div>").addClass("col-md-4").append(h)).append(e("<div>").addClass("col-md-8"))
;v.append(m).append(b).append(f).append(w).append(_)
;var C=e('<button class="btn btn-default">').append('<i class="fa fa-caret-left" aria-hidden="true">'),k=e('<button class="btn btn-default">').append('<i class="fa fa-caret-right" aria-hidden="true">')
;g.append(C),g.append(k),g.hide();var y=function(n){n.empty()
;var a=e("<div>").attr("align","left").append(e('<i class="fa fa-spinner fa-spin fa-2x">'))
;n.append(a),window.setTimeout((function(){a.append("&nbsp; Building cache..."),
window.setTimeout((function(){a.append(" almost there...")}),25e3)}),2500)
},$=function(n){var a=e("<tr>");if(o){
a.append(e("<td>").append(e("<a>").css("cursor","pointer").append(n.contig_id).on("click",function(e){
return function(){o(e.contig_id)}}(n))))
}else a.append(e("<td>").append(n.contig_id))
;return a.append(e("<td>").append(S(n.length))),
a.append(e("<td>").append(S(n.feature_count))),a},T=function(e,n){
e.find("tr:gt(0)").remove(),u.empty(),l.hide(),h.empty(),g.hide()
;var a=n.contigs;if(a.length>0){for(var t=0;t<a.length;t++)e.append($(a[t]))
;p=n.num_found,function(e,n,a){
h.empty(),h.append("Showing "+(e+1)+" to "+(e+n)+" of "+a)
}(n.start,a.length,n.num_found),n.num_found,g.show()
}else l.show(),h.empty(),g.hide()
},x=e("<table>").addClass("table table-striped table-bordered table-hover").css({
"margin-left":"auto","margin-right":"auto"});c.append(x);var F=function(n,a,t){
var i=e("<i>").css("margin-left","8px"),o=e("<th>").append("<b>"+n+"</b>").append(i)
;return t&&o.css("cursor","pointer").on("click",(function(){t(a,i)})),{id:a,
name:n,$th:o,$sortIcon:i}},I=function(){
var n=!1,a=e("<colgroup>"),t=e("<tr>"),i={},o=function(e,a){
n||(s[0]==e?1===s[1]?(s[1]=0,
a.removeClass(),a.addClass("fa fa-sort-asc")):(s[1]=1,
a.removeClass(),a.addClass("fa fa-sort-desc")):(i[s[0]].$sortIcon.removeClass(),
s[0]=e,
s[1]=1,a.addClass("fa fa-sort-desc")),y(u),n=!0,D(r=0,10,s).then((function(e){
T(x,e),n=!1,r=0})).catch((function(){n=!1})))}
;a.append(e("<col span=1>").css("width","20%"))
;var d=F("Contig ID","contig_id",o)
;return t.append(d.$th),d.$sortIcon.addClass("fa fa-sort-desc"),
i[d.id]=d,a.append(e("<col span=1>").css("width","5%")),
d=F("Length","length",o),
t.append(d.$th),i[d.id]=d,a.append(e("<col span=1>").css("width","20%")),
d=F("Feature Count","feature_count",o),t.append(d.$th),i[d.id]=d,{$colgroup:a,
$theader:t}}()
;x.append(I.$colgroup),x.append(I.$theader),y(u),D(r,10,s).then((function(e){
T(x,e)})),C.on("click",(function(){
0!==r&&(r-10<0?r=0:r-=10,y(u),D(r,10,s).then((function(e){T(x,e)})))
})),k.on("click",(function(){r+10>p||(r+=10,y(u),D(r,10,s).then((function(e){
T(x,e)})))}))}function S(e){
return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function D(e,n,t){
return f.empty(),a.metagenomeAPI.callFunc("search_contigs",[{ref:i,sort_by:t,
start:e,limit:n}]).spread((function(e){return e})).catch((function(e){
console.error(e),u.empty(),f.append(d(e))}))}},renderContigData:function(e,n,a){
var t=a.$length,i=a.$n_features
;return this.metagenomeAPI.callFunc("get_contig_info",[{ref:e,contig_id:n
}]).spread((function(e){var n=e.contig
;return t.append(s(e.contig.length)),i.append(s(e.contig.feature_count)),n
})).catch((function(e){console.error(e),t.empty(),t.append(d(e))}))},
showContigTab:function(n,a,t,i){var o=this;function s(e){var n={}
;if(n.raw=e,n.id=e.feature_id,
n.location=[],e.global_location.contig_id)for(var a=0;a<e.location.length;a++){
var t=e.location[a]
;e.global_location.contig_id===t.contig_id&&n.location.push([t.contig_id,t.start,t.strand,t.stop])
}return n.function=e.function,n}function p(n,a,p,c,l,u){
return o.metagenomeAPI.callFunc("search_region",[{ref:n,contig_id:a,
region_start:p,region_length:c,page_start:0,page_limit:2e3
}]).spread((function(d){u.empty();for(var f={name:a,length:l,genes:[]
},g=0;g<d.features.length;g++)f.genes.push(s(d.features[g]));var h=new r
;h.data.options.contig=f,h.data.options.onClickFunction=function(e,a){
o.showFeatureTab(n,a.original_data.raw,t,i)
},h.data.options.start=p,h.data.options.length=c,
h.data.options.showButtons=!1,h.data.options.token=o.token,
h.data.$elem=e('<div style="width:100%; height: 120px; overflow: auto;"/>'),
h.data.$elem.show((function(){h.data.update()
})),u.append(h.data.$elem),h.data.init()})).catch((function(e){console.error(e),
u.empty(),u.append(d(e))}))}!function(n,a){var r=function(n){
if(i.hasTab(n))return null;o.lastElemTabNum++
;var a=t+"elem"+o.lastElemTabNum,r=e('<div id="'+a+'"> ');return i.addTab({
tab:n,content:r,canDelete:!0,show:!0,deleteCallback:function(e){
i.removeTab(e),i.showTab(i.activeTab())}}),r}(a);if(null!==r){
var d=e("<table>").addClass("table table-striped table-bordered table-hover").css({
"margin-left":"auto","margin-right":"auto"})
;d.append(e("<colgroup>").append(e("<col span=1>").css("width","15%")))
;var s=e("<div>"),c=e("<div>"),l=e("<div>").addClass("container-fluid").css({
margin:"15px 0px","max-width":"100%"});r.append(l)
;var u=e("<div>").addClass("row").append(e("<div>").addClass("col-md-12").append(d)),f=e("<div>").addClass("row").css({
"margin-top":"15px","text-align":"center"
}).append(e("<div>").addClass("col-md-12").append(s)),g=e("<div>").addClass("row").css({
"margin-top":"15px","text-align":"center"
}).append(e("<div>").addClass("col-md-12").append(c))
;l.append(u).append(f).append(g)
;var h=e("<tr>").append(e("<td>").append("<b>Contig ID</b>")).append(e("<td>").append(a))
;d.append(h)
;var v=e("<div>"),m=e("<tr>").append(e("<td>").append("<b>Length</b>")).append(e("<td>").append(v))
;d.append(m)
;var b=e("<div>"),w=e("<tr>").append(e("<td>").append("<b>Number of Features</b>")).append(e("<td>").append(b))
;d.append(w),o.renderContigData(n,a,{$length:v,$n_features:b
}).then((function(t){g.append(e('<i class="fa fa-spinner fa-spin fa-2x">'))
;var i=0,o=2e4,r=t.length,d=e('<button class="btn btn-default">').append('<i class="fa fa-caret-left" aria-hidden="true">').append(" back 20kb").on("click",(function(){
i-2e4<0||(g.append(e('<i class="fa fa-spinner fa-spin fa-2x">')),
p(n,a,i-=2e4,o=2e4,r,g))
})),c=e('<button class="btn btn-default">').append("forward 20kb ").append('<i class="fa fa-caret-right" aria-hidden="true">').on("click",(function(){
i+2e4>r||(g.append(e('<i class="fa fa-spinner fa-spin fa-2x">')),
i+2e4>r||p(n,a,i+=2e4,o=2e4,r,g))}));s.append(d).append(c),p(n,a,i,o,r,g)}))
}else i.showTab(a)}(n,a)},render:function(){
var n=new i(4).format(),a=this,t=this.$elem;if(null!=a.token){
t.empty(),t.append(e("<div>").attr("align","center").append(e('<i class="fa fa-spinner fa-spin fa-2x">')))
;a.metagenome_ref;return function(){t.empty()
;var i=e('<div id="'+n+'tab-content">');t.append(i);for(var o=i.kbaseTabs(i,{
canDelete:!0,tabs:[]}),r=a.tabData(),d=r.names,s=r.ids,p=0;p<s.length;p++){
var c=e('<div id="'+n+s[p]+'"> ');o.addTab({tab:d[p],content:c,canDelete:!1,
show:0==p})}for(var l=i.find("li"),u=0;u<l.length;u++){
var f=e(l.get(u)).find("a");if(1==f.length){
var g=f.attr("data-tab"),h=a.metagenome_ref
;"Browse Features"===g?(f.on("click",(function(){a.buildGeneSearchView({
$div:e("#"+n+"browse_features"),ref:h,idClick:function(e){
a.showFeatureTab(h,e,n,o)},contigClick:function(e){a.showContigTab(h,e,n,o)}})
})),f.click()):"Browse Contigs"===g&&f.on("click",(function(){
a.buildContigSearchView({$div:e("#"+n+"browse_contigs"),ref:h,
contigClick:function(e){a.showContigTab(h,e,n,o)}})}))}}}(),this}
this.showError("You're not logged in")},
normalizeMetagenomeDataFromQuery:function(e,n,a){
var t=e.info,i=t[10],o=this.normalizeMetagenomeMetadata(i,n,a)
;return o.ws_obj_name=t[1],o.version=t[4],o.ref=t[6]+"/"+t[1]+"/"+t[4],o},
normalizeMetagenomeDataFromNarrative:function(e,n,a){
var t=this.normalizeMetagenomeMetadata(e.meta,n,a)
;return t.ws_obj_name=e.name,t.version=e.version,
t.ref=e.ws_id+"/"+e.name+"/"+e.version,t},
normalizeMetagenomeMetadata:function(e,n,a){var t={genetic_code:"",source:"",
source_id:"",size:"",gc_content:""}
;return e["Genetic code"]&&(t.genetic_code=e["Genetic code"]),
e.Source&&(t.source=e.Source),
e["Source ID"]&&(t.source_id=e["Source ID"]),e.Size&&(t.size=e.Size),
e["GC Content"]&&(t.gc_content=e["GC Content"]),
e.Environment&&(t.environment=e.Environment),t},
showFeatureTab:function(n,a,t,i){var o=this;function s(e){
return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function p(e){var n={}
;return e.strand&&"-"===e.strand?(n.end=e.start,
n.start=n.end-e.stop):(n.start=e.start,n.end=n.start+e.stop),n}!function(a){
null===a.feature_array&&(a.feature_array="features")
;var c=a.feature_id,l=function(n){if(i.hasTab(n))return null;o.lastElemTabNum++
;var a=t+"elem"+o.lastElemTabNum,r=e('<div id="'+a+'"> ');return i.addTab({
tab:n,content:r,canDelete:!0,show:!0,deleteCallback:function(e){
i.removeTab(e),i.showTab(i.activeTab())}}),r}(c);if(null!==l){
var u=e("<table>").addClass("table table-striped table-bordered table-hover").css({
"margin-left":"auto","margin-right":"auto"})
;u.append(e("<colgroup>").append(e("<col span=1>").css("width","15%")))
;var f=e("<div>").addClass("container-fluid").css({margin:"15px 0px",
"max-width":"100%"});l.append(f)
;var g=e("<div>").addClass("row").append(e("<div>").addClass("col-md-12").append(u))
;f.append(g);var h=[],v=[];h.push("Feature ID"),v.push(c),h.push("Aliases")
;var m=e("<div>");if(a.aliases){var b=a.aliases,w=!0
;for(var _ in b)b.hasOwnProperty(_)&&(w?w=!1:m.append(", "),m.append(_))
;w&&m.append("None")}
v.push(m),h.push("Type"),v.push(a.feature_type),h.push("Product Function"),
a.function?v.push(a.function):v.push("None");var C=e("<div>")
;h.push("Function Descriptions"),v.push(C),h.push("Location");var k=e("<div>")
;if(a.global_location.contig_id){
if(k.append("Contig:&nbsp;"),k.append(e("<a>").append(a.global_location.contig_id).css({
cursor:"pointer"}).on("click",(function(){
o.showContigTab(n,a.global_location.contig_id,t,i)
}))),k.append("<br>"),a.location){
for(var y=a.location,$=e("<div>"),T=!1,x=0;x<y.length;x++){
x>0&&$.append("<br>"),x>6&&(T=!0);var F=y[x],I=p(F)
;$.append(s(I.start)+"&nbsp;-&nbsp;"+s(I.end)+"&nbsp;("+F.strand+"&nbsp;Strand)")
}k.append($),T&&$.css({height:"10em",overflow:"auto",resize:"vertical"})}
}else k.append("None");v.push(k)
;var S=e("<div>").append(e('<i class="fa fa-spinner fa-spin">')).append(" &nbsp;fetching nearby feature data...")
;h.push("Feature Context"),v.push(S);var D=e("<div>")
;h.push("Relationships"),v.push(D);var N=e("<div>")
;h.push("DNA Length"),v.push(N);var A=e("<div>")
;h.push("DNA Sequence"),v.push(A);var z=e("<div>")
;for(h.push("Warnings"),v.push(z),
x=0;x<h.length;x++)u.append(e("<tr>").append(e("<td>").append(e("<b>").append(h[x]))).append(e("<td>").append(v[x])))
;a.size&&N.empty().append(s(a.size)),
a.dna_sequence?A.empty().append(function(n,a){for(var t=e("<div>").css({
"font-family":'"Lucida Console", Monaco, monospace'}),i=e("<td>").css({
"text-align":"right",border:"0",color:"#777"}),o=e("<td>").css({border:"0",
color:"#000"}),r=1,d=0;d<n.length;d++){
d>0&&d%a==0?(i.append("<br>").append(d+1).append(":&nbsp;"),
o.append("<br>"),r++):0==d&&i.append(d+1).append(":&nbsp;");var s=n[d]
;o.append(s)}return t.append(e("<table>").css({border:"0",
"border-collapse":"collapse"}).append(e("<tr>").css({border:"0"
}).append(i).append(o))),r>5&&t.css({height:"6em",overflow:"auto",
resize:"vertical"}),t
}(a.dna_sequence,100)):A.empty().append("Not Available"),a.warnings&&z.empty().append(a.warnings.join("<br>")),
a.functional_descriptions&&C.empty().append(a.functional_descriptions.join("<br>")),
a.parent_gene&&D.append("Parent Gene: "+a.parent_gene+"<br>"),
a.inference_data&&D.append("Inference Data: "+a.inference_data+"<br>")
;var B=function(e){var n={};n.raw=e,n.id=e.feature_id,n.location=[]
;for(var a=0;a<e.location.length;a++){var t=e.location[a]
;e.global_location.contig_id===t.contig_id&&n.location.push([t.contig_id,t.start,t.strand,t.stop])
}return n.function=e.function,n};if(a.global_location.contig_id){var E={
name:a.global_location.contig_id,genes:[B(a)]
},M=(I=p(a.global_location)).start-1e4;M<0&&(M=0);var P=I.end+1e4,O=P-M
;E.length=P,O>4e4&&(O=4e4),o.metagenomeAPI.callFunc("search_region",[{ref:n,
contig_id:a.global_location.contig_id,region_start:M,region_length:O,
page_start:0,page_limit:100}]).spread((function(d){S.empty()
;for(var s=0;s<d.features.length;s++)E.genes.push(B(d.features[s]));var p=new r
;p.data.options.contig=E,p.data.options.onClickFunction=function(e,a){
o.showFeatureTab(n,a.original_data.raw,t,i)
},p.data.options.start=M,p.data.options.length=O,
p.data.options.centerFeature=a.feature_id,
p.data.options.showButtons=!1,p.data.options.token=o.token,
p.data.$elem=e('<div style="width:100%; height: 200px; overflow: auto"/>'),
p.data.$elem.show((function(){p.data.update()
})),S.append(p.data.$elem),p.data.init()})).catch((function(e){console.error(e),
S.empty(),S.append(d(e))}))
}else S.empty().append("Genomic context is not available.");i.showTab(c)
}else i.showTab(c)}(a)},loggedInCallback:function(e,n){if(!this.state.isOk()){
var a="Widget is in invalid state -- cannot render: "+this.state.info().message
;return console.error(a),void this.showError(a)}
return this.token=n.token,this.attachClients(),this.render(),this},
loggedOutCallback:function(){if(!this.state.isOk()){
var e="Widget is in invalid state -- cannot render: "+this.state.info().message
;return console.error(e),void this.showError(e)}
return this.token=null,this.attachClients(),this.render(),this}})}));