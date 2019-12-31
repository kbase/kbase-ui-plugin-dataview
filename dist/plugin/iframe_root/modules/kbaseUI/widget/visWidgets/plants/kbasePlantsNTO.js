define(["jquery","d3","kbaseIrisWidget","kbaseTable"],(function(e,t){
e.KBWidget({name:"kbasePlantsNTO",parent:"kbaseIrisWidget",version:"1.0.0",
_accessors:["terminal","networkGraph"],options:{maxVisibleRowIndex:5,
navControls:!0,extractHeaders:!1},setInput:function(e){
"string"==typeof e&&(e=JSON.parse(e)),
e.data&&(e=e.data),this.setValueForKey("input",e),this.appendUI(this.$elem)},
appendUI:function(a){a.empty();var n=this
;if(void 0===this.input())this.setError("Cannot use network table widget w/o input file");else{
var i=[],o=t.scale.category20();e.each(this.input().nodes,(function(e,t){
if("CLUSTER"==t.type){
var a=t.user_annotations.go_enrichnment_annotation,n=[],s=[],l=[]
;if(null!=a)for(var d=a.split(/\n/),r=0;r<d.length;r++){var c
;(c=d[r].match(/(GO:\d+)\(([\d.]+)\)(.+)/))&&(n.push(c[1]),
l.push(c[2]),s.push(c[3]))}i.push({id:t.id,cluster_id:t.entity_id,
styled_cluster_id:{value:t.entity_id,style:"color : "+o(i.length%20)},
color:o(i.length%20),num_genes:0,num_edges:0,
go_enrichment:t.user_annotations.go_enrichnment_annotation||"No enrichment",
go_id:n,p_value:l,go_term:s,nodes:[],edges:[],nodesByName:{},edgesByName:{},
dataset:t.id,type:t.network_type,source:t.source_ref,
description:t.name+" ("+t.description+")"})}}));var s=[],l={}
;e.each(this.input().edges,(function(t,a){e.each(i,(function(e,t){
null==t.gene_ids&&(t.gene_ids=[]),a.node_id1==t.id?(t.gene_ids.push(a.node_id2),
s.push(a.node_id2),
t.num_genes++,l[a.node_id2]=t):a.node_id2==t.id&&(t.gene_ids.push(a.node_id1),
s.push(a.node_id1),t.num_genes++,l[a.node_id1]=t)}))}));var d={},r={}
;e.each(this.input().nodes,(function(t,a){e.each(s,(function(e,t){if(a.id==t){
var n=l[a.id];return null==n.gene_data&&(n.gene_data=[]),n.gene_data.push({
external_id:a.user_annotations.external_id||a.entity_id,kbase_id:a.entity_id,
func:a.user_annotations.functions||"",cluster:n.cluster_id
}),a.func=a.user_annotations.functions,
(null==a.func||a.func.match(/unknown/i))&&(a.func=""),
a.associations="(not sure yet)",void(d[a.id]={name:a.name,func:a.func,
associations:a.associations,activeDatasets:{},id:a.id,radius:10,tag:a.name,
search:[a.name,a.func,JSON.stringify(a.associations)].join(""),
tagStyle:"font : 12px sans-serif",color:"black",type:a.type})}}))}))
;var c=t.scale.pow().domain([0,i.length]).range([-100,100])
;e.each(this.input().edges,(function(t,a){e.each(i,(function(e,t){var n,o=!1
;if(l[a.node_id1].id==t.id&&(l[a.node_id2]||{}).id==t.id?(t.num_edges++,
o=!0,n=l[a.node_id1]):l[a.node_id2]==t.id&&(l[a.node_id1]||{}).id==t.id&&(t.num_edges++,
o=!0,n=l[a.node_id2]),o){var s=d[a.node_id1],h=d[a.node_id2]
;n.nodesByName[s.name]||(n.nodesByName[s.name]=1,
n.nodes.push(s)),n.nodesByName[h.name]||(n.nodesByName[h.name]=1,
n.nodes.push(h))
;var u=[a.dataset_id,s.name,h.name].sort().join("-"),p=r[u],_=i.indexOf(n)
;"is interact with"==a.name&&(a.name="interacts with"),null==p&&(p=r[u]={
source:s,target:h,activeDatasets:{},name:u,
description:s.name+" "+a.name+" "+h.name+" ("+a.strength.toFixed(3)+")",
colors:{},curveStrength:c(_)*(_%2?-1:1)});var g=n.color
;p.colors[a.dataset_id]=g,n.edgesByName[u]||(n.edgesByName[u]=1,n.edges.push(p))
}}))}));var h=this,u=e.jqElem("input").attr("type","checkbox")
;e.each(i,(function(a,i){var o={externalSortValue:!0,value:u.clone(),
sortValue:!1,setup:function(a,o){a.on("click",(function(a){var s=this
;if(null!=n.networkGraph){o.sortValue=s.checked;var l=n.networkGraph().dataset()
;null==l&&(l={nodes:[],edges:[]});var d={nodes:[],edges:[]},r={},c={}
;if(e.each(l.nodes,(function(e,a){
a.activeDatasets[i.cluster_id]&&!s.checked&&delete a.activeDatasets[i.cluster_id],
t.keys(a.activeDatasets).length&&(d.nodes.push(a),r[a.name]=1)
})),e.each(l.edges,(function(e,a){
a.activeDatasets[i.cluster_id]&&!s.checked&&delete a.activeDatasets[i.cluster_id],
t.keys(a.activeDatasets).length&&(d.edges.push(a),c[a.name]=1)})),s.checked){
e.each(i.nodes,(function(e,a){
a.activeDatasets[i.cluster_id]=1,r[a.name]||(d.nodes.push(a),
r[a.name]=1),a.label="<b>"+a.name+"</b><hr>"+t.keys(a.activeDatasets).sort().join("<br>")
}));var h=i.color;e.each(i.edges,(function(e,t){
t.activeDatasets[i.cluster_id]=1,
t.color=h,c[t.name]||(d.edges.push(t),c[t.name]=1)}))}
e.each(d.nodes,(function(e,a){
a.label="<b>"+a.name+"</b><hr>"+a.func+"<hr>"+t.keys(a.activeDatasets).sort().join("<br>"),
a.radius=8+3*t.keys(a.activeDatasets).length,a.tagOffsetY=a.radius+7
})),e.each(d.edges,(function(e,a){
a.label="<b>"+a.description+"</b><hr>"+t.keys(a.activeDatasets).sort().join("<br>"),
a.weight=1.5,t.keys(a.activeDatasets).length>1&&(a.color="black")
})),d.nodes.length?n.networkGraph().$elem.show():n.networkGraph().$elem.hide(),
n.networkGraph().setDataset(d),n.networkGraph().renderChart()}}))}};i.checkbox=o
}));var p={structure:{header:[{value:"styled_cluster_id",label:"Cluster ID",
style:"width : 80px; background-color : black; color : white"},{
value:"num_genes",label:"No. of genes",
style:"min-width : 130px; width : 130px; background-color : black; color : white"
},{value:"num_edges",label:"No. of edges",
style:"min-width : 130px; width : 130px; background-color : black; color : white"
},{value:"go_id",label:"GO ID",
style:"width : 70px; background-color : black; color : white"},{value:"go_term",
label:"GO term",style:"width : 110px; background-color : black; color : white"
},{value:"p_value",label:"p-value",
style:"min-width : 90px; width : 90px; background-color : black; color : white"
},{value:"gene_list",label:"Gene List",
style:"width : 250px; background-color : black; color : white"}],rows:i},
row_callback:function(t,a,n,i){if("gene_list"==a){
n.gene_data=n.gene_data.sort(i.sortByKey("external_id",!0))
;for(var o=e.jqElem("ul").css("list-style","none").css("padding-left","0px"),s=0;s<3&&s<n.gene_data.length;s++){
var l=n.gene_data[s].external_id
;l=l.replace(/\.CDS$/,""),o.append(e.jqElem("li").append(l))}
return n.gene_data.length>3&&o.append(e.jqElem("li").append(e.jqElem("a").attr("href","#").append("more...").on("click",(function(e){
e.stopPropagation(),e.preventDefault(),h.display_gene_list(n.gene_data)})))),o}
if(a.match(/^(go_id|go_term|p_value)$/)){
for(o=e.jqElem("ul").css("list-style","none").css("padding-left","0px"),
s=0;s<n[a].length;s++)o.append(e.jqElem("li").append(n[a][s]));return o}
return"network_comparison"==a?e.jqElem("a").attr("href","#").append("Compare with KBase networks"+n.id).on("click",(function(e){
h.display_gene_list(n.gene_data)})):i.default_row_callback(t,a,n,i)},
sortable:!0,hover:!0,headerOptions:{
style:"background-color : black; color : white;",sortable:!0},
maxVisibleRowIndex:this.options.maxVisibleRowIndex,
navControls:this.options.navControls
},_=e.jqElem("div").attr("id","tables").append(e.jqElem("div").attr("id","cluster_table")).append(e.jqElem("div").attr("id","gene_table")).append(e.jqElem("div").attr("id","network"))
;this._rewireIds(_,this);var g=this.data("network").css({width:700,height:600
}).attr("align","center").kbaseForcedNetwork({linkDistance:200,filter:!0,
nodeHighlightColor:"#002200",relatedNodeHighlightColor:"black"});g.$elem.hide(),
this.networkGraph(g);var m=e.jqElem("div").kbaseTable(p),b=m.data("headerRow")
;b.find("th:nth-child(3)").after(e.jqElem("th").attr("style","background-color : black; color : white").append("GO enrichment"))
;var f=e.jqElem("tr")
;f.append(b.find("th:nth-child(5)")),f.append(b.find("th:nth-child(5)")),
f.append(b.find("th:nth-child(5)")),
m.data("headerRow").find("th").attr("rowspan",2),
m.data("headerRow").find("th:nth-child(4)").attr("rowspan",1).attr("colspan",3),
m.data("thead").append(f),this.data("cluster_table").append(m.$elem),a.append(_)
}},display_gene_list:function(t){
if(t==this.data("last_gene_data"))return this.data("gene_table").empty(),
void this.data("last_gene_data",void 0);var a={structure:{header:[{
value:"external_id",label:"External gene ID",
style:"max-width : 190px; background-color : black; color : white"},{
value:"kbase_id",label:"KBase gene ID",
style:"min-width : 250px; background-color : black; color : white"},{
value:"func",label:"Gene Function",
style:"min-width : 75px; background-color : black; color : white"},{
value:"cluster",label:"Cluster name",
style:"min-width : 75px; background-color : black; color : white"}],rows:t},
row_callback:function(e,t,a,n){
return"external_id"==t?e.replace(/\.CDS$/,""):n.default_row_callback(e,t,a,n)},
sortable:!0,hover:!0,headerOptions:{
style:"background-color : black; color : white;",sortable:!0},
navControls:this.options.navControls},n=e.jqElem("div").kbaseTable(a)
;this.data("gene_table").empty(),
this.data("gene_table").append(n.$elem),this.data("last_gene_data",t);var i=this
;setTimeout((function(){
$parent=e("html,body"),offset=i.data("gene_table").prop("offsetTop"),
$parent.animate({scrollTop:offset},500)}),0)}})}));