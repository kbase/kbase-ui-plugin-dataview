define(["jquery","kb_common/html","kb_service/client/workspace","kbaseUI/widget/legacy/widget"],(function(e,i,t){
"use strict";e.KBWidget({name:"KBaseWikiDescription",parent:"kbaseWidget",
version:"1.0.0",options:{genomeID:null,workspaceID:null,title:"Description",
maxNumChars:900,width:400,maxTextHeight:300,genomeInfo:null},init:function(i){
return this._super(i),
null===this.options.featureID?this:(this.$messagePane=e("<div>"),
this.$elem.append(this.$messagePane),
this.workspaceClient=new t(this.runtime.getConfig("services.workspace.url",{
token:this.runtime.service("session").getAuthToken()
})),this.renderWorkspace(),this)},renderFromTaxonomy:function(i){var t=i,r=i[0]
;this.wikipediaLookup(t,e.proxy((function(i){var t=e("<div>"),n=e("<div>")
;if(i.hasOwnProperty("description")&&null!==i.description)if(i.searchTerm){
var a=e('<div style="text-align:justify; max-height: '+this.options.maxTextHeight+'px; overflow-y:auto; padding-right:5px">').append(i.description),o=e("<div>")
;r===i.redirectFrom?o=e(this.redirectHeader(r,i.redirectFrom,i.searchTerm)):r!==i.searchTerm&&(o=e(this.notFoundHeader(r,i.searchTerm,i.redirectFrom)))
;var s=e('<p>[<a href="'+i.wikiUri+'" target="_new">more at Wikipedia</a>]</p>'),p='Unable to find an image. If you have one, you might consider <a href="'+i.wikiUri+'" target="_new">adding it to Wikipedia</a>.'
;null!==i.imageUri&&(p='<img src="'+i.imageUri+'"',
this.options.width&&(p+='style="width:'+this.options.width+'px;"'),
p+="/>"),t.append(o).append(a).append(s),n.append(p)
}else o=e(this.notFoundHeader(r,i.searchTerm,i.redirectFrom)),
t.append(o),n.append("Unable to find an image.")
;this.hideMessage(),this.$elem.append(e('<div id="mainview">').css("overflow","auto").append(e('<table cellpadding=4, cellspacing=2, border=0 style="width:100%">').append(e("<tr>").append(e('<td style="vertical-align:top">').append(t)).append(e('<td style="vertical-align:top">').append(n)))).append(e("<br>")))
}),this),e.proxy(this.renderError,this))},renderWorkspace:function(){var e=this
;this.searchedOnce=!1,this.showMessage(i.loading("loading..."))
;var t=this.buildObjectIdentity(this.options.workspaceID,this.options.genomeID)
;function r(i){if(i.taxonomy){
for(var t=i.taxonomy,r=[],n=(a=i.scientific_name.split(/\s+/)).length;n>0;n--)r.push(a.slice(0,n).join(" "))
;r&&"Unknown"!==r&&(r=r.concat(t.split(/\;\s*/).reverse())),
e.renderFromTaxonomy(r)}else if(i.scientific_name){var a
;for(r=[],n=(a=i.scientific_name.split(/\s+/)).length;n>0;n--)r.push(a.slice(0,n).join(" "))
;e.renderFromTaxonomy(r)}}
t.included=["/taxonomy","/scientific_name"],e.options.genomeInfo?r(e.options.genomeInfo.data):e.workspaceClient.get_object_subset([t],(function(e){
e[0]&&r(e[0].data)}),(function(i){
var t=e.buildObjectIdentity(e.options.workspaceID,e.options.genomeID)
;t.included=["/scientific_name"],
e.workspaceClient.get_object_subset([t],(function(e){e[0]&&r(e[0].data)
}),(function(i){e.renderError(i)}))}))},buildObjectIdentity:function(e,i){
var t={}
;return/^\d+$/.exec(e)?t.wsid=e:t.workspace=e,/^\d+$/.exec(i)?t.objid=i:t.name=i,
t},uid:function(){
for(var e="",i=0;i<32;i++)e+=Math.floor(16*Math.random()).toString(16).toUpperCase()
;return e},notFoundHeader:function(e,i,t){
var r=e.replace(/\s+/g,"_"),n='<p><b>"<i>'+e+"</i>\" not found in Wikipedia. Add a description on <a href='http://en.wikipedia.org/wiki/"+r+"' target='_new'>Wikipedia</a>.</b></p>"
;return i&&(n+="<p><b>Showing description for <i>"+i+"</i></b>",
t&&(n+="<br>redirected from <i>"+t+"</i>"),n+="</p>"),n},
redirectHeader:function(e,i,t){
return"<p><b>Showing description for <i>"+t+"</i></b><br>redirected from <i>"+i.replace(/\s+/g,"_")+"</i></p>"
},showMessage:function(i){var t=e("<span>").append(i)
;this.$messagePane.append(t),
this.$messagePane.removeClass("kbwidget-hide-message")},hideMessage:function(){
this.$messagePane.addClass("kbwidget-hide-message"),this.$messagePane.empty()},
getData:function(){return{type:"Description",id:this.options.genomeID,
workspace:this.options.workspaceID,title:"Organism Description"}},
renderError:function(i){
var t="Sorry, an unknown error occured. Wikipedia.org may be down or your browser may be blocking an http request to Wikipedia.org."
;"string"==typeof i?t=i:i&&i.error&&i.error.message&&(t=i.error.message)
;var r=e("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>"+t)
;this.$elem.empty(),this.$elem.append(r)},searchedOnce:!1,
wikipediaLookup:function(i,t,r){
i&&"[object Array]"===Object.prototype.toString.call(i)&&0!==i.length||r&&!this.searchedOnce&&r("No search term given"),
this.searchedOnce=!0
;var n=i.shift(),a="//en.wikipedia.org/w/api.php?action=parse&format=json&prop=text|pageimages&section=0&redirects=&callback=?&page="+n,o="//en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pithumbsize="+this.options.width+"&callback=?&titles="
;e.ajax({type:"GET",url:a,contentType:"application/json; charset=utf-8",
async:!0,dataType:"json"}).then(e.proxy((function(a,s){
if(a.error)this.wikipediaLookup(i,t,r);else if(a.parse&&a.parse.text){var p={
searchTerm:n},d=e("<div>").html(a.parse.text["*"]);d.find("a").each((function(){
e(this).replaceWith(e(this).html())
})),d.find("sup.reference").remove(),d.find(".mw-ext-cite-error").remove(),
p.description="",d.children("p").each((function(i,t){
p.description+="<p>"+e(t).html()+"</p>"
})),p.wikiUri="//www.wikipedia.org/wiki/"+a.parse.title,
a.parse.redirects&&a.parse.redirects.length>0&&(p.redirectFrom=a.parse.redirects[0].from),
e.ajax({type:"GET",url:o+a.parse.title,
contentType:"application/json; charset=utf-8",async:!0,dataType:"json"
}).then((function(e,i){
if(i&&(p.imageUri=null,e.query&&e.query.pages&&Object.keys(e.query.pages).length>0)){
var r=Object.keys(e.query.pages)[0]
;e.query.pages[r].thumbnail&&(p.imageUri=e.query.pages[r].thumbnail.source)}
t&&t(p)}),(function(e){r&&r(e)}))}}),this),(function(e){r&&r(e)}))},
dbpediaLookup:function(i,t,r,n){
i&&"[object Array]"===Object.prototype.toString.call(i)&&0!==i.length||r&&r("No search term given")
;var a=i.shift(),o=a.replace(/\s+/g,"_"),s="http://dbpedia.org/resource/"+o,p="http://dbpedia.org/ontology/abstract",d="http://xmlns.com/foaf/0.1/depiction",c="http://xmlns.com/foaf/0.1/isPrimaryTopicOf",h="http://dbpedia.org/ontology/wikiPageRedirects",l="http://dbpedia.org/data/"+o+".json"
;e.get(l).then(e.proxy((function(e,o){var l={searchTerm:a};if(e[s]){var g=e[s]
;if(g[c]&&g[p]){
if(g[c]&&(l.wikiUri=g[c][0].value),g[p])for(var u=g[p],m=0;m<u.length;m++)"en"===u[m].lang&&(l.description=u[m].value)
;g[d]&&(l.imageUri=g[d][0].value),n&&(l.redirectFrom=n),t(l)}else if(g[h]){
var f=g[h][0].value.split("/");this.dbpediaLookup([f[f.length-1]],t,r,a)
}else i.length>0?this.dbpediaLookup(i,t,r):t(l)
}else i.length>0?this.dbpediaLookup(i,t,r):t(l);return l}),this),(function(e){
r&&r(e)}))}})}));