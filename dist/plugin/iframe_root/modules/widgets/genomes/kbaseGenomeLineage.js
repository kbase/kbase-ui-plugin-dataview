define(["jquery","uuid","kb_common/html","kbaseUI/widget/legacy/widget"],(function(e,n,t){
"use strict"
;var i=t.tag,r=i("a"),o=i("div"),a=i("span"),s=i("table"),m=i("tr"),l=i("th"),d=i("td")
;e.KBWidget({name:"KBaseGenomeLineage",parent:"kbaseWidget",version:"1.0.0",
options:{width:600,genomeInfo:null},genome:null,token:null,uniqueId:null,
init:function(e){
if(this._super(e),this.options.genomeInfo)return this.genome=e.genomeInfo.data,
this.uniqueId=new n(4).format(),this.render(),this
;this.renderError("Genome information not supplied")},render:function(){
this.$elem.empty().append(s({class:"table table-bordered"},[m([l({style:{
width:"11em"}},"Scientific Name"),d({dataField:"scientific-name",style:{
fontStyle:"italic"}
},this.genome.scientific_name)]),m([l("Taxonomic Lineage"),d(this.buildLineage())])]))
},buildLineage:function(){
if(!this.genome.taxonomy)return"No taxonomic data for this genome.";let e=";"
;this.genome.taxonomy.indexOf(",")>=0&&(e=",")
;var n=this.genome.taxonomy.split(e).map(e=>e.trim());return o({style:{
whiteSpace:"nowrap",overflowX:"auto"}},n.map(e=>{var n=e.replace("/ /g","+")
;return o(r({
href:"http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?name="+n,
target:"_blank"},e))}))},renderError:function(e){var n
;n="string"==typeof e?e:e.error&&e.error.message?e.error.message:"Sorry, an unknown error occurred"
;var t=o({class:"alert alert-danger"},[a({textWeight:"bold"},"Error: "),a(n)])
;this.$elem.empty(),this.$elem.append(t)}})}));