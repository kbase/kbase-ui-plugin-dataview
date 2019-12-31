define(["jquery","uuid","kb_lib/html","kb_lib/jsonRpc/dynamicServiceClient","kbaseUI/widget/legacy/widget"],(function(e,n,t,i){
"use strict"
;const r=t.tag,o=r("a"),s=r("div"),a=r("span"),l=r("table"),c=r("tr"),g=r("th"),m=r("td")
;e.KBWidget({name:"KBaseGenomeRELineage",parent:"kbaseWidget",version:"1.0.0",
options:{width:600,genomeInfo:null,genomeID:null,timestamp:null},genome:null,
token:null,init:function(e){
if(this._super(e),this.options.genomeInfo)return this.genome=e.genomeInfo.data,
this.genomeID=e.genomeID,this.render(),this
;this.renderError("Genome information not supplied")},renderLineageTable(e,n,t){
const i=`/#review/${n.ns}/${n.id}/${n.ts}`;this.$elem.empty().append(l({
class:"table table-bordered"},[c([g({style:{width:"11em"}
},"Scientific Name"),m({dataField:"scientific-name",style:{fontStyle:"italic"}
},o({href:i,target:"_blank"
},t))]),c([g("Taxonomic Lineage"),m(this.buildLineage(e))])]))},
fetchRELineage:function(e){const n=new i({
url:this.runtime.config("services.service_wizard.url"),module:"taxonomy_re_api",
token:this.runtime.service("session").getAuthToken()})
;let t=this.options.timestamp
;return t=Date.now(),n.callFunc("get_taxon_from_ws_obj",[{obj_ref:e,
ns:"ncbi_taxonomy"}]).then(([e])=>{
if(0===e.results.length)throw new Error("No taxon found for this object")
;const[i]=e.results,r={ns:i.ns,id:i.id,ts:t}
;return Promise.all([n.callFunc("get_lineage",[r]),n.callFunc("get_taxon",[r])]).then(([[{results:e}],[{results:[n]}]])=>{
if(!n)throw new Error("Taxon not found");const{scientific_name:t}=n
;this.renderLineageTable(e,r,t)})})},buildLineage:function(e){
return e=e.slice(1),s({style:{whiteSpace:"nowrap",overflowX:"auto"}},e.map(e=>{
const n=`/#review/${e.ns}/${e.id}`;return s(o({href:n,target:"_blank"
},e.scientific_name))}))},renderLoading:function(){
this.$elem.empty(),this.$elem.append(s({style:{textAlign:"left",
marginBottom:"10px",color:"rgba(150, 150, 150, 1)"}},[a({
class:"fa fa-spinner fa-pulse"}),a({style:{marginLeft:"4px"}
},"Loading lineage...")]))},renderError:function(e){var n
;n="string"==typeof e?e:e.error&&e.error.message?e.error.message:"Sorry, an unknown error occurred"
;var t=s({class:"alert alert-danger"},[a({textWeight:"bold"},"Error: "),a(n)])
;this.$elem.empty(),this.$elem.append(t)},render:function(){
const{ws:e,id:n,ver:t}=this.options.genomeRef,i=[e,n,t].join("/")
;this.renderLoading(),this.fetchRELineage(i).catch(e=>{console.error("ERROR",e),
this.renderError("Error fetching lineage: "+e.message)})}})}));