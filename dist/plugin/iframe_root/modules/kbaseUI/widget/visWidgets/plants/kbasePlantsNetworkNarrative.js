define("kbasePlantsNetworkNarrative",["jquery","kbasePlantsNetworkTable","kbaseForcedNetwork","kbaseTable"],(function(e){
e.KBWidget({name:"kbasePlantsNetworkNarrative",parent:"kbaseIrisWidget",
version:"1.0.0",
_accessors:["networkTable","networkGraph","networkClient","cdmiClient","ontologyClient","idmapClient","tabularData"],
options:{},setInput:function(a){a.data&&(a=a.data);var t=d3.scale.category20()
;this.setValueForKey("input",a);var n={},s=[];e.each(a.datasets,(function(e,a){
s.push(a.id);var t=a.description
;a.name!=a.id&&(t=a.name+" ("+a.description+")"),n[a.id]={nodes:[],edges:[],
nodesByName:{},edgesByName:{},dataset:a.id,type:a.network_type,
source:a.source_ref,description:t}}))
;var i=d3.scale.pow().domain([0,s.length]).range([-100,100]),d={},o={}
;e.each(a.nodes,(function(e,a){var t=d[a.name]
;null==t&&(a.func=a.user_annotations.functions||"",
a.func.match(/unknown/i)&&(a.func=""),
a.associations="(not sure yet)",a.name=a.name.replace(/\.CDS$/,""),t=d[a.id]={
name:a.name,func:a.func,associations:a.associations,activeDatasets:{},id:a.id,
radius:10,tag:a.name,
search:[a.name,a.func,JSON.stringify(a.associations)].join(""),
tagStyle:"font : 12px sans-serif",color:"black"})
})),e.each(a.edges,(function(e,a){
var r=d[a.node_id1],l=d[a.node_id2],c=n[a.dataset_id]
;r.name=r.name.replace(/\.CDS$/,""),
l.name=l.name.replace(/\.CDS$/,""),c.nodesByName[r.name]||(c.nodesByName[r.name]=1,
c.nodes.push(r)),
c.nodesByName[l.name]||(c.nodesByName[l.name]=1,c.nodes.push(l))
;var m=[a.dataset_id,r.name,l.name].sort().join("-"),p=o[m],h=s.indexOf(a.dataset_id)
;"is interact with"==a.name&&(a.name="interacts with"),null==p&&(p=o[m]={
source:r,target:l,activeDatasets:{},name:m,
description:r.name+" "+a.name+" "+l.name+" ("+a.strength.toFixed(3)+")",
colors:{},curveStrength:i(h)*(h%2?-1:1)});var u=t(s.indexOf(a.dataset_id)%20)
;p.colors[a.dataset_id]=u,c.edgesByName[m]||(c.edgesByName[m]=1,c.edges.push(p))
}));var r=[];e.each(n,(function(e,a){a.nodes.length&&r.push({
datasetID:a.dataset,dataset:{value:a.dataset,
style:"color : "+t(s.indexOf(a.dataset)%20)},nodes:a.nodes,edges:a.edges,
description:a.description,type:a.type,source:a.source})
})),this.setValueForKey("tabularData",r),
this.networkTable()&&(this.data("loader").remove(),
this.data("msgBox").show(),this.networkTable().setInput(r))},
appendUI:function(a){a.empty(),a.css("border","1px solid gray"),a.empty()
;var t=e.jqElem("div").append("<br>&nbsp;Loading data...<br>&nbsp;please wait...").append(e.jqElem("br")).append(e.jqElem("div").attr("align","center").append(e.jqElem("i").addClass("fa fa-spinner").addClass("fa fa-spin fa fa-4x")))
;a.append(t),this.data("loader",t);var n=e.jqElem("div").css({width:700,
height:600}).attr("align","center").kbaseForcedNetwork({linkDistance:200,
filter:!0,nodeHighlightColor:"#002200",relatedNodeHighlightColor:"black"})
;this.networkGraph(n)
;var s=e.jqElem("div").attr("align","center").css("font-style","italic").html("No datasets with nodes selected")
;this.data("msgBox",s);var i=e.jqElem("div").kbasePlantsNetworkTable({
$terminal:this.options.$terminal,networkGraph:n,msgBox:s});this.networkTable(i),
s.hide(),
n.$elem.hide(),a.append(i.$elem).append(s).append(e.jqElem("div").attr("align","center").append(n.$elem)),
this.input()&&(this.data("loader").remove(),
this.data("msgBox").show(),this.networkTable().setInput(this.tabularData()))}})
}));