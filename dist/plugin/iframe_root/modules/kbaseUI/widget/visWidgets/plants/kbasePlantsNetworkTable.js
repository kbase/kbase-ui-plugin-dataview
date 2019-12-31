define("kbasePlantsNetworkTable",["jquery","kbaseIrisWidget","kbaseTable"],(function(e){
e.KBWidget({name:"kbasePlantsNetworkTable",parent:"kbaseIrisWidget",
version:"1.0.0",_accessors:["terminal","networkGraph","msgBox"],options:{
maxVisibleRowIndex:5,navControls:!0,extractHeaders:!1},setInput:function(e){
this.setValueForKey("input",e),this.appendUI(this.$elem)},appendUI:function(t){
t.empty();var a=this
;if(null==this.input())this.setError("Cannot use network table widget w/o input file");else{
var s=this.input();if(s.length>0){
var o=e.jqElem("input").attr("type","checkbox"),n={structure:{header:[{
value:"dataset",label:"Dataset",
style:"max-width : 190px; background-color : black; color : white"},{
value:"description",label:"Description",
style:"width : 300px; max-width : 300px;  background-color : black; color : white"
},{value:"num_nodes",label:"Nodes",
style:"min-width : 75px; background-color : black; color : white"},{
value:"num_edges",label:"Edges",
style:"min-width : 75px; background-color : black; color : white"},{
value:"density",label:"Density",
style:"min-width : 90px; background-color : black; color : white"},{
value:"type",label:"Type",
style:"max-width : 125px; background-color : black; color : white"},{
value:"source",label:"Source",
style:"min-width : 80px; background-color : black; color : white"}],rows:[]},
sortable:!0,hover:!0,headerOptions:{
style:"background-color : black; color : white;",sortable:!0},
maxVisibleRowIndex:this.options.maxVisibleRowIndex,
navControls:this.options.navControls,row_callback:function(t,a,s,o){
if("description"==a){var n=o.default_row_callback(t,a,s,o)
;if(n.length<12)return n;var l=e.jqElem("div").css({"max-height":"18px",
overflow:"hidden",display:"inline-block"}).attr("class","truncated").append(n)
;return e.jqElem("div").append(l).append(e.jqElem("div").attr("class","dots").css({
"font-style":"italic","text-align":"right"}).append("...more"))}
return o.default_row_callback(t,a,s,o)}}
;null!=this.networkGraph()&&n.structure.header.unshift({value:"checkbox",
label:""});var l=d3.scale.category20();e.each(s,(function(t,s){var i={
externalSortValue:!0,value:o.clone(),sortValue:!1,setup:function(o,n){
o.on("click",(function(o){var i=this;if(null!=a.networkGraph){
n.sortValue=i.checked;var r=a.networkGraph().dataset();null==r&&(r={nodes:[],
edges:[]});var c={nodes:[],edges:[]},d={},h={};if(e.each(r.nodes,(function(e,t){
t.activeDatasets[s.datasetID]&&!i.checked&&delete t.activeDatasets[s.datasetID],
d3.keys(t.activeDatasets).length&&(c.nodes.push(t),d[t.name]=1)
})),e.each(r.edges,(function(e,t){
t.activeDatasets[s.datasetID]&&!i.checked&&delete t.activeDatasets[s.datasetID],
d3.keys(t.activeDatasets).length&&(c.edges.push(t),h[t.name]=1)})),i.checked){
e.each(s.nodes,(function(e,t){
t.activeDatasets[s.datasetID]=1,d[t.name]||(c.nodes.push(t),
d[t.name]=1),t.label="<b>"+t.name+"</b><hr>"+d3.keys(t.activeDatasets).sort().join("<br>")
}));var u=l(t%20);e.each(s.edges,(function(e,t){t.activeDatasets[s.datasetID]=1,
t.color=u,h[t.name]||(c.edges.push(t),h[t.name]=1)}))}
e.each(c.nodes,(function(e,t){
t.label="<b>"+t.name+"</b><hr>"+t.func+"<hr>"+d3.keys(t.activeDatasets).sort().join("<br>"),
t.radius=8+3*d3.keys(t.activeDatasets).length,t.tagOffsetY=t.radius+7
})),e.each(c.edges,(function(e,t){
t.label="<b>Dataset source for this edge:</b><br>"+d3.keys(t.activeDatasets).sort().join("<br>"),
t.weight=1.5,
d3.keys(t.activeDatasets).length>1?t.color="black":t.color=t.colors[d3.keys(t.activeDatasets)[0]]
})),
c.nodes.length?(a.msgBox().hide(),a.networkGraph().$elem.show()):(a.msgBox().show(),
a.networkGraph().$elem.hide()),
a.networkGraph().setDataset(c),a.networkGraph().renderChart()}}))}}
;s.checkbox=i,
s.num_nodes=s.nodes.length,s.num_edges=s.edges.length,s.density=(s.num_edges/s.num_nodes).toFixed(3),
n.structure.rows.push(s)}));var i=e.jqElem("div").kbaseTable(n)
;i.sort("num_nodes",-1),i.$elem.css("font-size","85%")
;i.$elem.find("tr").on("mouseover",(function(t){
e(this).find(".truncated").css("max-height",""),
e(this).find(".dots").css("display","none")})).on("mouseout",(function(t){
e(this).find(".truncated").css("max-height","18px"),
e(this).find(".dots").css("display","")
})),this.setOutput(i.$elem),this.$elem.append(i.$elem),
this.options.$terminal&&this.options.$terminal.scroll(),this.setValue(s)}}}})
}));