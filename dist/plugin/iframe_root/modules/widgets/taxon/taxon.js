define(["bluebird","jquery","underscore","kb_lib/html","kb_lib/htmlBuilders","kb_lib/htmlBootstrapBuilders","kb_lib/jsonRpc/dynamicServiceClient","datatables","datatables_bootstrap"],(function(e,i,t,n,a,r,o){
"use strict";function d(d){var c,l,u=d.runtime,s=n.tag("div"),f={
overview:"<div class='row'>    <div class='col-md-6'>        <table class='table table-bordered'>            <tr><td><b>NCBI taxonomic ID</b></td><td data-element='ncbi-id'></td></tr>            <tr><td><b>Scientific name</b></td><td data-element='scientific-name'></td></tr>            <tr><td><b>Domain</b></td><td data-element='domain'></td></tr>            <tr><td><b>Genetic Code</b></td><td data-element='genetic-code'></td></tr>        </table>        <div>            <div><span><b>Aliases</b></span></div>            <div data-element='aliases'></div>        </div>    </div>    <div class='col-md-6' data-element='lineage'>    </div></div>",
additionalInfo:"<div class='row'>    <div class='media col-md-12'>        <div class='media-body'>            <h4 class='media-heading' data-element='wiki_url'></h4>            <div data-element='wikipedia_text'></div>        </div>        <div class='media-right media-middle'>            <div data-element='wikipedia_image'></div>        </div>    </div></div>"
};function m(e,i){try{l.querySelector("[data-element='"+e+"']").innerHTML=i
}catch(t){throw console.error('while setting data element "'+e+'":',t),t}}
function p(e){
null===e||void 0===e.link?m("wiki_url","No Wikipedia entry found for this Taxon"):m("wiki_url","<a target='_blank' href='"+e.link+"'>Wikipedia entry for this Taxon</a>"),
null===e||void 0===e.extract?m("wikipedia_text","No text found"):m("wikipedia_text",e.extract)
}function h(e){
m("wikipedia_image",null===e?"No image found":"<img class='media-object' src='"+e+"'></img>")
}return Object.freeze({attach:function(e){
(l=(c=e).appendChild(document.createElement("div"))).innerHTML=s([r.buildPanel({
type:"default",title:"Summary",body:s({id:"overview"},f.overview)
}),r.buildPanel({type:"default",title:"Children Taxons",body:s({
id:"taxonChildren"},a.loading())}),r.buildPanel({type:"default",
title:"Additional Information for this Taxon",body:s({id:"moreTaxonInfo"
},f.additionalInfo)})])},start:function(n){var a,d=function(e){
if(e.ref)return e.ref;if(e.workspaceId){
if(!e.objectId)throw new Error("Object id required if workspaceId supplied")
;var i=[e.workspaceId,e.objectId]
;return e.objectVersion&&i.push(e.objectVersion),i.join("/")}
throw new Error("Either a ref property or workspaceId, objectId, and optionally objectVersion required to make a ref")
}(n),c="https://en.wikipedia.org/w/api.php";function f(n){return function n(a){
var r=c+"?"+g({action:"query",list:"search",format:"json",srwhat:"text",
srsearch:a});return e.resolve(i.ajax({url:r,dataType:"jsonp"
})).then((function(e){if(0==e.query.search.length){var i=function(e){
if(""==e)return"";var i=e.split(" ")
;return i.length<=1?"":t.initial(i).join(" ")}(a)
;if(""==i)throw new Error('No page found on Wikipedia for "'+i+'"');e=n(i)}
return e}))}(n).then((function(t){return function(t){
var n=t.query.search[0].title,a=c+"?"+g({action:"query",
prop:"extracts|pageimages|imageinfo|images|info|pageimages|pageprops",
format:"json",exlimit:"1",exintro:"",piprop:"name",inprop:"url",indexpageids:"",
titles:n});return e.resolve(i.ajax({url:a,dataType:"jsonp"}).then((function(e){
var i=e.query.pageids[0];return{extract:e.query.pages[i].extract,
image:e.query.pages[i].pageimage,link:e.query.pages[i].fullurl}
}))).catch((function(e){
return 404===e.status||console.error('Error while fetching wikipedia image at "'+a+'":',e),
{extract:void 0,image:void 0,link:void 0}}))}(t)})).catch((function(e){
return console.error('while fetching wikipedia entry for "'+n+'":',e),!1}))}
function g(e){return Object.keys(e).map((function(i){
return[i,e[i]].map(encodeURIComponent).join("=")})).join("&")}function v(e,i){
e.innerHTML=r.buildPanel({type:"danger",title:"Error",body:i.message})}
var b,w=new o({url:u.config("services.service_wizard.url"),
token:u.service("session").getAuthToken(),module:"TaxonAPI"}),y=[]
;return y.push(w.callFunc("get_all_data",[{ref:d,exclude_children:1
}]).spread((function(e){
return m("scientific-name",b=e.scientific_name),m("domain",e.domain),
function(e){
m("ncbi-id","<a target='_blank' href='http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=info&id="+e+"'>"+e+"</a>")
}(e.taxonomic_id),m("genetic-code",e.genetic_code),function(e){
var i,t=[],n=e.length
;for(i=0;i<n;i+=1)t.push("<div class='col-sm-offset-1'>"+e[i]+"</div>")
;m("aliases",n>0?t.join(""):"None")
}(e.aliases),w.callFunc("get_decorated_scientific_lineage",[{ref:d}])
})).spread((function(e){return function(e,i){var t,n=[],a=e.length
;for(t=0;t<a;t+=1)n.push("<div style='padding-left: "+String(10*t)+"px'><a href='#dataview/"+e[t].ref+"'>"+e[t].scientific_name+"</a></div>")
;n.push("<div style='padding-left: "+String(10*a)+"px'>"+i+"</div>"),
m("lineage",s([s("<h5><strong>Lineage</strong></h5>"),s(n)]))
}(e.decorated_scientific_lineage,b),f(b)})).then((function(t){
return!1===(a=t)?(p(null),!1):(p(a),function(t){if(void 0===t)return null
;var n=c+"?"+g({action:"query",format:"json",prop:"pageimages|imageinfo",
indexpageids:"",iiprop:"url",pithumbsize:"600",titles:"Image:"+t,callback:"?"})
;return e.resolve(i.ajax({url:n,dataType:"jsonp"})).then((function(e){
var i=e.query.pageids[0];return e.query.pages[i].thumbnail.source
})).catch((function(e){
return console.error('while fetching wikipedia image at "'+n+'":',e),null}))
}(a.image))})).then((function(e){h(null===e?null:e)})).catch((function(e){
v(document.getElementById("overview"),e),
v(document.getElementById("moreTaxonInfo"),e)
}))),y.push(w.callFunc("get_decorated_children",[{ref:d}]).spread((function(e){
!function(e){var i,t=[],n=e.length,a=e.sort((function(e,i){
return e.scientific_name.toLowerCase()>i.scientific_name.toLowerCase()}))
;for(i=0;i<n;i+=1)t.push("<div><a href='#dataview/"+a[i].ref+"'>"+a[i].scientific_name+"</a></div>")
;l.querySelector('div[id="taxonChildren"]').innerHTML=s(n>0?t:"None")
}(e.decorated_children)})).catch((function(e){
v(document.getElementById("taxonChildren"),e)}))),e.all(y).catch((function(e){
console.error(e)}))},stop:function(){},detach:function(){
c&&l&&(l.innerHTML="",c.removeChild(l))}})}return{make:function(e){return d(e)}}
}));