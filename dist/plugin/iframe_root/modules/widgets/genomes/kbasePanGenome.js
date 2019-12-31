define(["jquery","uuid","kb_common/html","kb_service/client/workspace","kbaseUI/widget/legacy/authenticatedWidget","kbaseUI/widget/legacy/tabs","datatables_bootstrap"],(function(e,t,n,o){
"use strict";var a=n.tag,r=a("a"),i=a("span");function s(e){
return Object.keys(e).map((function(t){
return[t,e[t]].map(encodeURIComponent).join("=")})).join("&")}e.KBWidget({
name:"kbasePanGenome",parent:"kbaseAuthenticatedWidget",version:"1.0.0",
options:{ws:null,name:null,withExport:!1,width:1e3},pref:null,geneIndex:{},
genomeNames:{},genomeRefs:{},loaded:!1,init:function(e){
this._super(e),this.workspace=new o(this.runtime.config("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()
}),this.pref=new t(4).format(),
this.geneIndex={},this.genomeNames={},this.genomeRefs={};var a=this.$elem
;return a.empty(),a.html(n.loading("loading pan-genome data...")),this.render(),
this},render:function(){var t=this,n=this.options.name,o=this.$elem
;return this.workspace.get_objects([{workspace:this.options.ws,name:n
}]).then((function(e){
if(!t.loaded)return[e[0].data,t.cacheGeneFunctions(e[0].data.genome_refs)]
})).spread((function(n){return function(n){t.loaded=!0,o.empty()
;const a=e('<div id="'+t.pref+'tab-content">');o.append(a);const r=a.kbTabs({
tabs:[]});let i=!0;t.options.withExport&&(i=!1);var s=e("<div/>");r.addTab({
name:"Pangenome Overview",content:s,active:i,removable:!1})
;const l=e('<table class="table table-striped table-bordered" style="margin-top: 1em;" id="'+t.pref+'overview-table"/>')
;s.append(l),
l.append("<tr><td>Pan-genome object ID</td><td>"+t.options.name+"</td></tr>")
;const{totalGenesInOrth:d,totalOrthologs:c,totalHomFamilies:p,totalOrphanGenes:h,genomeStat:u,orthologStat:m}=function(e){
let t=0,n=0,o=0,a=0;const r={},i={},s={};for(const l in e.orthologs){
const d=e.orthologs[l];n++;const c=d.id,p=d.orthologs.length
;p>=2&&o++,i[c]||(i[c]=[p,{}]);for(const e in d.orthologs){
const n=d.orthologs[e],o=n[2];r[o]||(r[o]=[0,{},0,0]),r[o][1][c]||(r[o][1][c]=0,
p>1?r[o][0]++:r[o][3]++),r[o][1][c]++,i[c][1][o]||(i[c][1][o]=0),i[c][1][o]++
;const l=o+"/"+n[0];s[l]||(p>1?(s[l]=1,t++,r[o][2]++):(s[l]=0,a++))}}return{
totalGenesInOrth:t,totalOrthologs:n,totalHomFamilies:o,totalOrphanGenes:a,
genomeStat:r,orthologStat:i}}(n);let b=0;const g=[]
;for(const e in t.geneIndex)b++,g.push([e,t.genomeNames[e],0])
;g.sort((function(e,t){return e[1]<t[1]?-1:e[1]>t[1]?1:0}))
;for(const e in g)g[e][2]=parseInt(""+e)+1
;l.append("<tr><td>Total # of genomes</td><td><b>"+b+"</b></td></tr>"),
l.append("<tr><td>Total # of protein coding genes</td><td><b>"+(d+h)+"</b> proteins, <b>"+d+"</b> are in homolog families, <b>"+h+"</b> are in singleton families</td></tr>"),
l.append("<tr><td>Total # of families</td><td><b>"+c+"</b> families, <b>"+p+"</b> homolog families, <b>"+(c-p)+"</b> singleton families</td></tr>")
;const f=e('<table class="table table-striped table-bordered" style="margin-top: 1em;" id="'+t.pref+'overview-table2"/>')
;s.append(f),
f.append(e("<tr>").append(e("<th>Genome</th>")).append(e("<th># Genes</th>")).append(e("<th># Genes in Homologs</th>")).append(e("<th># Genes in Singletons</th>")).append(e("<th># Homolog Families</th>")))
;for(const e in g){const n=g[e][0],o=t.genomeNames[n];let a=0,r=0,i=0
;u[n]&&([a,,r,i]=u[n]),
f.append("<tr><td>"+o+"</td><td>"+(r+i)+"</td><td>"+r+"</td><td>"+i+"</td><td>"+a+"</td><tr>")
}const v=e("<div/>");r.addTab({name:"Genome Comparison",content:v,active:!1,
removable:!1})
;const w=e('<table class="table table-striped table-bordered" style="margin-top: 1em; width: 100%;" id="'+t.pref+'shared-table"/>')
;v.append(w);var k="<th>Genome</th><th>Legend</th>";for(var _ in g){
var y=g[_][2];k+='<th width="40" style="text-align: center;">G'+y+"</th>"}
w.append("<tr>"+k+"</tr>");for(const e in g){const t=g[e][0];let n=""
;for(const e in g){const o=g[e][0];let a=0
;for(var T in m)m[T][0]<=1||m[T][1][t]&&m[T][1][o]&&a++
;n+='<td width="40"><font color="'+(t===o?"#d2691e":"black")+'">'+a+"</font></td>"
}const o=g[e][2]
;w.append("<tr><td><b>G"+o+"</b> - "+g[e][1]+"</td><td># homolog families</td>"+n+"</tr>")
}
const x=e('<table class="table table-bordered table-striped" style="margin-top: 1em; width: 100%;">'),D=e("<div/>")
;t.options.withExport&&D.append("<p><b>Please choose homolog family and push 'Export' button on opened ortholog tab.</b></p><br>")
;D.append(x),r.addTab({name:"Families",content:D,active:!i,removable:!1})
;var G=[];for(const e in n.orthologs){
const o=n.orthologs[e],a='<a class="show-orthologs_'+t.pref+'" data-id="'+o.id+'">'+o.id+"</a>",r=Object.keys(m[o.id][1]).length
;G.push({id:a,func:o.function,len:o.orthologs.length,genomes:r})}const j={
sPaginationType:"full_numbers",iDisplayLength:10,aaData:G,
aaSorting:[[2,"desc"],[0,"asc"]],aoColumns:[{sTitle:"Family",mData:"id"},{
sTitle:"Function",mData:"func"},{sTitle:"Protein Count",mData:"len"},{
sTitle:"Genome Count",mData:"genomes"}],oLanguage:{
sEmptyTable:"No objects found",sSearch:"Search: "},fnDrawCallback:function(){
e(".show-orthologs_"+t.pref).unbind("click"),
e(".show-orthologs_"+t.pref).click((function(){var o=e(this).data("id")
;if(r.tabContent(o)[0])r.showTab(o);else{var a=function(e){
for(var t in n.orthologs){if(n.orthologs[t].id===e)return n.orthologs[t]}
}(o),i=t.buildOrthoTable(o,a);r.addTab({name:o,content:i,active:!0,removable:!0
}),r.showTab(o)}}))}};x.dataTable(j)}(n),null})).catch((function(e){
console.error("ERROR",e),
o.empty(),o.append('<div class="alert alert-danger">'+e.error.message+"</div>")
})),this},cacheGeneFunctions:function(e){var t=this,n=e.map((function(e){return{
ref:e,included:["scientific_name","features/[*]/id"]}}))
;return this.workspace.get_object_subset(n).then((function(n){for(var o in e){
var a=e[o]
;t.genomeNames[a]=n[o].data.scientific_name,t.genomeRefs[a]=n[o].info[7]+"/"+n[o].info[1]
;var r={};for(var i in n[o].data.features){r[n[o].data.features[i].id]=i}
t.geneIndex[a]=r}return e}))},buildOrthoTable:function(t,o){
var a=this,r=e(n.loading("loading gene data...")),i=[]
;for(var s in o.orthologs){
var l=o.orthologs[s][2],d=o.orthologs[s][0],c=a.geneIndex[l][d];i.push({ref:l,
included:["features/"+c]})}
return this.workspace.get_object_subset(i).then((function(e){var n=[]
;for(var o in e){var s=e[o].data.features[0],l=i[o].ref;s.genome_ref=l
;var d=a.genomeRefs[l],c=a.genomeNames[l],p=s.id,h=s.function;h||(h="-")
;var u=s.protein_translation,m=u?u.length:"no translation";n.push({ref:d,
genome:c,id:p,func:h,len:m,original:s})}a.buildOrthoTableLoaded(t,n,r)
})).catch((function(e){console.error("Error caching genes: "+e.error.message)
})),r},buildOrthoTableLoaded:function(n,o,a){var l=new t(4).format(),d=this
;a.empty()
;var c=e('<table class="table table-bordered table-striped" style="margin-top: 1em;">')
;d.options.withExport&&a.append('<p><b>Name of feature set object:</b>&nbsp;<input type="text" id="input_'+l+'" value="'+d.options.name+"."+n+'.featureset" style="width: 350px;"/>&nbsp;<button id="btn_'+l+'">Export</button><br><font size="-1">(only features with protein translations will be exported)</font></p><br>'),
a.append(c);var p={sPaginationType:"full_numbers",iDisplayLength:10,aaData:o,
aaSorting:[[0,"asc"],[1,"asc"]],aoColumns:[{sTitle:"Genome name",
mData:function(e){return r({target:"_blank",href:"/#dataview/"+e.ref},i({style:{
whiteSpace:"nowrap"}},e.genome))}},{sTitle:"Feature ID",mData:function(e){
var t={sub:"Feature",subid:e.id};return r({target:"_blank",
href:"/#dataview/"+e.ref+"?"+s(t)},e.id)}},{sTitle:"Function",mData:"func"},{
sTitle:"Protein sequence length",mData:"len"}],oLanguage:{
sEmptyTable:"No objects in workspace",sSearch:"Search: "},
fnDrawCallback:function(){
e(".show-genomes_"+l).unbind("click"),e(".show-genomes_"+l).click((function(){
var t="/#dataview/"+e(this).data("id");window.open(t,"_blank")
})),e(".show-genes_"+l).unbind("click"),e(".show-genes_"+l).click((function(){
var t="/#dataview/"+e(this).data("id");window.open(t,"_blank")}))}}
;c.dataTable(p),d.options.withExport&&e("#btn_"+l).click((function(){
var t=e("#input_"+l).val()
;0!==t.length?d.exportFeatureSet(n,t,o):alert("Error: feature set object name shouldn't be empty")
}))},exportFeatureSet:function(e,t,n){var o={},a=0;for(var r in n){var i=n[r]
;i.original.protein_translation&&(o[""+r]={data:i.original},a++)}var s={
description:'Feature set exported from pan-genome "'+this.options.name+'", otholog "'+e+'"',
elements:o};this.workspace.save_objects({workspace:this.options.ws,objects:[{
type:"KBaseSearch.FeatureSet",name:t,data:s}]}).then((function(){
alert("Feature set object containing "+a+" genes was successfully exported")
})).catch((function(e){alert("Error: "+e.error.message)}))},getData:function(){
return{title:"Pangenome",id:this.options.name,workspace:this.options.ws}},
loggedInCallback:function(e,t){return this.token=t.token,this.render(),this},
loggedOutCallback:function(){return this.token=null,this.render(),this}})}));