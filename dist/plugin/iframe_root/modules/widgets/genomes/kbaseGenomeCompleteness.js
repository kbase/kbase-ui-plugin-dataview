!function(e,n){e.KBWidget({name:"KBaseGenomeCompleteness",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",genome_id:null,ws_name:null,
kbCache:null,width:800,table_height:656,options:{genome_id:null,ws_name:null,
kbCache:null,loadingImage:"assets/img/ajax-loader.gif"},
wsUrl:"https://kbase.us/services/ws/",markerRoles:[],markerRolesOrder:[],
init:function(e){
return this._super(e),this.ws_name=this.options.ws_name,this.genome_id=this.options.genome_id,
this.kbCache=this.options.kbCache,
this.markerRoles=[],this.markerRolesOrder=[],this.loadMarkerRoles(this.wait_for_marker_roles),
this},wait_for_marker_roles:function(){this.render()},
loadMarkerRoles:function(e){
var n=this.markerRoles,t=this.markerRolesOrder,s=this
;return d3.text("assets/data/universal_markers_SEED_Roles.txt",(function(e){
for(var i=d3.tsv.parseRows(e),r="",a="",o=0;o<i.length;o++)""!==i[o][0]&&""!==i[o][1]&&(r=i[o][0],
a=i[o][1],t.push(a),n[a]=r);s.wait_for_marker_roles()})),!0},render:function(){
var n=this,t=this.uuid(),s=this.$elem
;s.append('<div><img src="'+n.options.loadingImage+'">&nbsp;&nbsp;loading genes data...</div>')
;var i=this.options.ws_name+"/"+this.options.genome_id,r={ref:i}
;this.options.kbCache?prom=this.options.kbCache.req("ws","get_objects",[r]):prom=kb.ws.get_objects([r])
;n=this;return e.when(prom).done(e.proxy((function(r){s.empty()
;var a=r[0].data,o=a.domain
;if("Eukaryota"===o)return s.prepend("<b>Genome Completeness not yet available for "+o+"</b>"),
this;var l=[],d={},p={},g={},h={},m={}
;if(a.contig_ids&&a.contig_lengths&&a.contig_ids.length==a.contig_lengths.length)for(var c in a.contig_ids){
var u=a.contig_ids[c],f=a.contig_lengths[c];d[u]={name:u,length:f,genes:[]}}
for(var x in a.features){var k=a.features[x],v=k.id;if(void 0!==k.function){
var _=k.function.replace(/\s+\/.+/,"").replace(/\s+\#.*/,"")
;void 0!==n.markerRoles[_]&&(void 0===p[_]&&(p[_]=[]),p[_].push(v))}}
for(var b=!1,w=0;w<n.markerRolesOrder.length;w++){_=n.markerRolesOrder[w]
;void 0===g[R=n.markerRoles[_]]&&(g[R]=0),
void 0===h[R]&&(h[R]=0),void 0===m[R]&&(m[R]=""),
h[R]+=1,p[_]&&(g[R]+=1,b=!0,1!==p[_].length&&(m[R]=" (Warning: multiple counts)"))
}for(w=0;w<n.markerRolesOrder.length;w++){_=n.markerRolesOrder[w]
;var R=n.markerRoles[_];if(!1!==b){
if(0!==g[R])if(void 0!==p[_])for(var y=0;y<p[_].length;y++){v=p[_][y]
;var C=p[_].length;l[l.length]={num:C,
id:'<a class="'+t+'gene-click" data-geneid="'+v+'">'+v+"</a>",group:R,func:_}
}else l[l.length]={num:0,id:"-",group:R,func:_}
}else"Universal"===R&&(l[l.length]={num:0,id:"-",group:R,func:_})}var D={
iDisplayLength:100,aaSorting:[[3,"asc"]],sDom:"t<fip>",aoColumns:[{
sTitle:"Count",mData:"num",sWidth:"10%"},{sTitle:"Gene ID",mData:"id"},{
sTitle:"Group",mData:"group"},{sTitle:"Function",mData:"func",sWidth:"50%"}],
aaData:[],oLanguage:{sSearch:"&nbsp&nbsp&nbsp&nbspSearch gene:",
sEmptyTable:"No genes found."},fnDrawCallback:function(){
e("."+t+"gene-click").unbind("click"),e("."+t+"gene-click").click((function(){
var n=[e(this).data("geneid")];window.open("#/genes/"+i+"/"+n,"_blank")}))}}
;for(var R in h)0!==g[R]&&s.append("<div />"+R+" Single-copy Markers Seen: "+g[R]+" / "+h[R]+m[R])
;!1===b&&(R="Universal",
s.append("<div />"+R+" Single-copy Markers Seen: "+g[R]+" / "+h[R]+m[R])),
s.append(e("<div />").css("height",this.table_height+"px").css("overflow","scroll").append('<table cellpadding="0" cellspacing="0" border="0" id="'+t+'genome-completeness-table"             \t\tclass="table table-bordered table-striped" style="width: 100%; margin-left: 0px; margin-right: 0px;"/>')),
e("#"+t+"genome-completeness-table").dataTable(D).fnAddData(l)
}),this)),e.when(prom).fail(e.proxy((function(e){
s.empty(),s.append("<p>[Error] "+e.error.message+"</p>")}),this)),this},
getData:function(){return{type:"KBaseGenomeCompleteness",
id:this.options.ws_name+"."+this.options.genome_id,
workspace:this.options.ws_name,title:"Genome Completeness"}},uuid:function(){
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){
var n=16*Math.random()|0;return("x"==e?n:3&n|8).toString(16)}))}})}(jQuery);