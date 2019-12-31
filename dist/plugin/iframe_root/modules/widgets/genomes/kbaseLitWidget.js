define(["jquery","underscore","d3","kb_common/html","kbaseUI/widget/legacy/widget","datatables_bootstrap"],(function(t,e,i,a){
"use strict";t.KBWidget({name:"KBaseLitWidget",parent:"kbaseWidget",
version:"1.0.0",options:{genomeID:null,workspaceID:null,isInCard:!1,width:600,
height:700,maxPubCount:50},init:function(t){
if(this._super(t),null!==this.options.row)return this.render()},
addInfoRow:function(t,e){return"<tr><td>"+t+"</td><td>"+e+"</td></tr>"},
xmlToJson:function(t){var e={};if(1===t.nodeType){if(t.attributes.length>0){
e["@attributes"]={};for(var i=0;i<t.attributes.length;i++){
var a=t.attributes.item(i);e["@attributes"][a.nodeName]=a.value}}
}else 3===t.nodeType&&(e=t.nodeValue)
;if(t.hasChildNodes())for(var r=0;r<t.childNodes.length;r++){
var s=t.childNodes.item(r),n=s.nodeName
;if(void 0===e[n])e[n]=this.xmlToJson(s);else{if(void 0===e[n].push){var l=e[n]
;e[n]=[],e[n].push(l)}e[n].push(this.xmlToJson(s))}}return e},
render:function(r){var s=this
;s.tooltip=i.select("body").append("div").classed("kbcb-tooltip",!0)
;var n,l=s.options.literature,o=t(a.loading()),u=t("<div>").append('<table cellpadding="0" cellspacing="0" border="0" id="literature-table"                             class="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>'),d=t("<div>").append('<input type="text" name="lit-query-box">'),c=t("<input type='button' id='lit-search-button' value='Update Search'>").on("click",(function(){
l=p.val(),[],n.fnDestroy(),h(l)}))
;s.$elem.append(d.append(c)).append(o).append(u)
;var p=s.$elem.find('[name="lit-query-box"]');function h(i){o.show(),t.ajax({
async:!0,
url:"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax="+s.options.maxPubCount+"&sort=pub+date&term="+i.replace(/\s+/g,"+"),
type:"GET",success:function(i){
var a,r=s.xmlToJson(i),l="https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=",u="https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&id="
;if("0"===r.eSearchResult[1].Count["#text"]){
return o.hide(),void(n=s.$elem.find("#literature-table").dataTable({
iDisplayLength:4,sDom:"t<flip>",aaSorting:[[3,"desc"]],aoColumns:[{
sTitle:"Journal",mData:"source"},{sTitle:"Authors",mData:"author"},{
sTitle:"Title",mData:"title"},{sTitle:"Date",mData:"date"}],aaData:[]}))}
if(e.isArray(r.eSearchResult[1].IdList.Id))for(a=0;a<r.eSearchResult[1].IdList.Id.length;a++)l+=r.eSearchResult[1].IdList.Id[a]["#text"],
u+=r.eSearchResult[1].IdList.Id[a]["#text"],
a!==r.eSearchResult[1].IdList.Id.length-1&&(l+=",",
u+=",");else l+=r.eSearchResult[1].IdList.Id["#text"],
u+=r.eSearchResult[1].IdList.Id["#text"];var d=[],c={};t.when(t.ajax({async:!0,
url:u,type:"GET"})).then((function(i){
var a=(r=s.xmlToJson(i)).PubmedArticleSet[1].PubmedArticle;if(e.isArray(a)){
var u;for(u in a){var p=(m=a[u].MedlineCitation).PMID["#text"]
;if(void 0!==m.Article.Abstract)var h=m.Article.Abstract.AbstractText["#text"];else h="No abstract found for this article."
;c[p]=h}}else{var m;p=(m=a.MedlineCitation).PMID["#text"]
;if(void 0!==m.Article.Abstract)h=m.Article.Abstract.AbstractText["#text"];else h="No abstract found for this article."
;c[p]=h}t.when(t.ajax({async:!0,url:l,type:"GET"})).then((function(i){
var a,l=(r=s.xmlToJson(i)).eSummaryResult[1].DocSum
;if(e.isArray(l))for(p in a=[],l)a.push(l[p]);else a=[l];var u,p,h,m,b=[]
;for(u in a){p=a[u].Item;var f={},v=!1;for(h in p){
if("PubDate"===(m=p[h])["@attributes"].Name&&(f.date=m["#text"].substring(0,4)),
"Source"===m["@attributes"].Name&&(f.source=m["#text"]),
"Title"===m["@attributes"].Name&&(f.title="<a href=https://www.ncbi.nlm.nih.gov/pubmed/"+a[u].Id["#text"]+" target=_blank>"+m["#text"]+"</a>",
f.abstract=a[u].Id["#text"],
b.push(a[u].Id["#text"])),"AuthorList"===m["@attributes"].Name){var x=""
;if("#text"in m)if(e.isArray(m.Item)){var g,y=1
;for(g in m.Item)0===y?x+=", ":y--,x+=m.Item[g]["#text"]
}else x=m.Item["#text"];else x="No authors found for this article.";f.author=x}
var I
;if("PubTypeList"===m["@attributes"].Name)if("#text"in m)if(e.isArray(m.Item))for(I in m.Item)"Journal Article"===m.Item[I]["#text"]&&(v=!0);else"Journal Article"===m.Item["#text"]&&(v=!0)
}v&&d.push(f)}var T="t<flip>";d.length<=10&&(T="tfi");var D={iDisplayLength:4,
sDom:T,aaSorting:[],aoColumns:[{sTitle:"Journal",mData:"source"},{
sTitle:"Authors",mData:"author"},{sTitle:"Title",mData:"title"},{sTitle:"Date",
mData:"date"}],aaData:d,fnRowCallback:function(t,e,i){
t.setAttribute("id",e.abstract)}}
;o.hide(),n=s.$elem.find("#literature-table").dataTable(D),
s.$elem.find("#literature-table tbody").on("mouseover","tr",(function(){
return s.tooltip=s.tooltip.text(c[t(this).attr("id")]),
s.tooltip.style("visibility","visible")})).on("mouseout",(function(){
return s.tooltip.style("visibility","hidden")})).on("mousemove",(function(t){
return s.tooltip.style("top",t.pageY+15+"px").style("left",t.pageX-10+"px")}))
}),(function(){
o.hide(),s.$elem.append("<br><b>Failed to retrieve literature search results. Try again later.</b>")
}))}))}})}return p.val(l),p.css({width:"300px"}),h(l),this},getData:function(){
return{type:"LitWidget",id:this.options.genomeID,
workspace:this.options.workspaceID,title:"Literature"}}})}));