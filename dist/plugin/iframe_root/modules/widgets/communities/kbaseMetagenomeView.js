define(["jquery","googlepalette","kb_service/client/workspace","kb_common/html","widgets/communities/kbStandaloneGraph","widgets/communities/kbStandalonePlot","kbaseUI/widget/legacy/authenticatedWidget","kbaseUI/widget/legacy/kbaseTabs","datatables_bootstrap"],(function(t,e,a,n,d,r){
"use strict";t.KBWidget({name:"MetagenomeView",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",token:null,options:{id:null,
ws:null},init:function(t){return this._super(t),this},render:function(){
var s=this,i=this.uuidv4(),o=this.$elem
;if(o.empty(),null!==s.token)return o.append(n.loading("loading data...")),
new a(this.runtime.getConfig("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()}).get_objects([{
ref:s.options.ws+"/"+s.options.id}],(function(a){if(o.empty(),0===a.length){
var p="[Error] Object "+s.options.id+" does not exist in workspace "+s.options.ws
;o.append("<div><p>"+p+">/p></div>")}else{
var c=a[0].data,l=c.statistics.sequence_stats,h="Amplicon"===c.sequence_type,_=l.hasOwnProperty("sequence_count_raw")?parseFloat(l.sequence_count_raw):0,g=l.hasOwnProperty("sequence_count_preprocessed_rna")?parseFloat(l.sequence_count_preprocessed_rna):0,u=l.hasOwnProperty("sequence_count_preprocessed")?parseFloat(l.sequence_count_preprocessed):0,b=l.hasOwnProperty("sequence_count_sims_rna")?parseFloat(l.sequence_count_sims_rna):0,m=l.hasOwnProperty("cluster_count_processed_rna")?parseFloat(l.cluster_count_processed_rna):0,w=l.hasOwnProperty("clustered_sequence_count_processed_rna")?parseFloat(l.clustered_sequence_count_processed_rna):0,x=l.hasOwnProperty("read_count_annotated")?parseFloat(l.read_count_annotated):0,y=_-u,v=b?b-m+w:0,f=x&&x>v?x-v:0,q=(l.hasOwnProperty("read_count_processed_aa")?parseFloat(l.read_count_processed_aa):0)-f,k=_-(y+q+f+v)
;if(_<y+v)k=(F=y+v-_)>k?0:k-F;if(h)q=0,f=0,k=_-((y=_-g)+v);else{var F
;if(k<0&&(k=0),_<y+k+q+f+v)k=(F=y+k+q+f+v-_)>k?0:k-F
;if(0===k&&_<y+q+f+v)q=(F=y+q+f+v-_)>q?0:q-F
;if(0===k&&0===q&&_<y+f+v)v=(F=y+f+v-_)>v?0:v-F}
var M=t('<div id="'+i+'tab-content">');o.append(M),M.kbaseTabs({canDelete:!1,
tabs:[]});var P=t('<div id="'+i+'overview">');M.kbaseTabs("addTab",{
tab:"Overview",content:P,canDelete:!1,show:!0});var T="<h4>Info</h4>"
;T+='<p><table class="table table-striped table-bordered" style="width: 50%;">',
T+='<tr><td style="padding-right: 25px; width: 165px;"><b>Metagenome ID</b></td><td>'+c.id+"</td></tr>",
T+='<tr><td style="padding-right: 25px; width: 165px;"><b>Metagenome Name</b></td><td>'+c.name+"</td></tr>",
T+='<tr><td style="padding-right: 25px; width: 165px;"><b>Project ID</b></td><td>'+c.metadata.project.id+"</td></tr>",
T+='<tr><td style="padding-right: 25px; width: 165px;"><b>Project Name</b></td><td>'+c.metadata.project.name+"</td></tr>",
T+='<tr><td style="padding-right: 25px; width: 165px;"><b>PI</b></td><td>'+c.metadata.project.data.PI_firstname+" "+c.metadata.project.data.PI_lastname+"</td></tr>",
T+='<tr><td style="padding-right: 25px; width: 165px;"><b>Organization</b></td><td>'+c.metadata.project.data.PI_organization+"</td></tr>",
T+='<tr><td style="padding-right: 25px; width: 165px;"><b>Sequence Type</b></td><td>'+c.sequence_type+"</td></tr>",
T+="</table></p>",
T+="<h4>Summary</h4>",T+="<p>The dataset "+c.name+" was uploaded on "+c.created+" and contains "+l.sequence_count_raw+" sequences totaling "+l.bp_count_raw+" basepairs with an average length of "+l.average_length_raw+" bps.</p>"
;var O=" Of the remainder, "+f+" sequences ("+(f/_*100).toFixed(2)+"%) contain predicted proteins with known functions and "+q+" sequences ("+(q/_*100).toFixed(2)+"%) contain predicted proteins with unknown function.",I=" "+k+" sequences ("+(k/_*100).toFixed(2)+"%) have no rRNA genes"+(h?".":" or predicted proteins")
;T+="<p>"+y+" sequences ("+(y/_*100).toFixed(2)+"%) failed to pass the QC pipeline. Of the sequences that passed QC, "+v+" sequences ("+(v/_*100).toFixed(2)+"%) containe ribosomal RNA genes."+(h?"":O)+I+"</p>",
t("#"+i+"overview").append(T)
;var C=t('<div id="'+i+'metadata" style="width: 95%;">');M.kbaseTabs("addTab",{
tab:"Metadata",content:C,canDelete:!1,show:!0})
;var A=[],S=["project","sample","library","env_package"]
;for(var j in S)if(c.metadata[S[j]])for(var D in c.metadata[S[j]].data)A.push([S[j],D,c.metadata[S[j]].data[D]])
;var E={columns:["Category","Field","Value"],rows:A,class:"table table-striped"
},N=n.makeTable(E);t("#"+i+"metadata").html(N),t("#"+E.generated.id).dataTable()
;P=t('<div id="'+i+'stats">');M.kbaseTabs("addTab",{tab:"Statistics",content:P,
canDelete:!1,show:!1})
;var Q='<p><table class="table table-striped table-bordered" style="width: 65%;">'
;Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Upload: bp Count</b></td><td>'+l.bp_count_raw+" bp</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Upload: Sequences Count</b></td><td>'+l.sequence_count_raw+"</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Upload: Mean Sequence Length</b></td><td>'+l.average_length_raw+" ± "+l.standard_deviation_length_raw+" bp</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Upload: Mean GC percent</b></td><td>'+l.average_gc_content_raw+" ± "+l.standard_deviation_gc_content_raw+" %</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Artificial Duplicate Reads: Sequence Count</b></td><td>'+l.sequence_count_dereplication_removed+"</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Post QC: bp Count</b></td><td>'+l.bp_count_preprocessed+"</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Post QC: Sequences Count</b></td><td>'+l.sequence_count_preprocessed+"</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Post QC: Mean Sequence Length</b></td><td>'+l.average_length_preprocessed+" ± "+l.standard_deviation_length_preprocessed+" bp</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Post QC: Mean GC percent</b></td><td>'+l.average_gc_content_preprocessed+" ± "+l.standard_deviation_gc_content_preprocessed+" %</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Processed: Predicted Protein Features</b></td><td>'+l.sequence_count_processed_aa+"</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Processed: Predicted rRNA Features</b></td><td>'+l.sequence_count_processed_rna+"</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Alignment: Identified Protein Features</b></td><td>'+l.sequence_count_sims_aa+"</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Alignment: Identified rRNA Features</b></td><td>'+l.sequence_count_sims_rna+"</td></tr>",
Q+='<tr><td style="padding-right: 25px; width: 325px;"><b>Annotation: Identified Functional Categories</b></td><td>'+l.sequence_count_ontology+"</td></tr>",
Q+="</table></p>",t("#"+i+"stats").append(Q)
;var R=c.statistics.qc.drisee.percents.columns,U=c.statistics.qc.drisee.percents.data
;if(!h&&R&&U&&R.length>0&&U.length>0){
var B=t('<div id="'+i+'drisee" style="width: 95%;">');M.kbaseTabs("addTab",{
tab:"DRISEE",content:B,canDelete:!1,show:!0})
;for(var z=0,G=[1,2,3,4,5,6,7],W=[],K=[],L=[],V=[],H=0,Y=e(G.length),$=0;$<G.length;$++){
W.push({name:R[G[$]],color:Y[$]}),H=Math.max(H,R[G[$]].length)
;for(var J=[],X=0;X<U.length;X++)J.push({x:parseFloat(U[X][z]),
y:parseFloat(U[X][G[$]])
}),L.push(parseFloat(U[X][z])),V.push(parseFloat(U[X][G[$]]));K.push(J)}
var Z=300,tt=(dt=750)+(ht=10*H),et=(_t=23*W.length)>Z?Math.min(_t,Z+Z/2):Z
;r.create({target:document.getElementById(i+"drisee"),data:{series:W,points:K},
x_titleOffset:40,y_titleOffset:60,x_title:"bp position",y_title:"percent error",
x_min:Math.min.apply(Math,L),x_max:Math.max.apply(Math,L),
y_min:Math.min.apply(Math,V),y_max:Math.max.apply(Math,V),show_legend:!0,
show_dots:!1,connected:!0,legendArea:[dt+20,20,ht,_t],chartArea:[70,20,dt,Z],
width:tt+40,height:et+45}).render()}var at=c.statistics.qc.kmer["15_mer"].data
;if(!h&&at&&at.length>0){var nt=t('<div id="'+i+'kmer" style="width: 95%;">')
;M.kbaseTabs("addTab",{tab:"Kmer Profile",content:nt,canDelete:!1,show:!0})
;for(J=[],L=[],V=[],$=0;$<at.length;$+=2)J.push({x:parseFloat(at[$][3]),
y:parseFloat(at[$][0])
}),L.push(parseFloat(at[$][3])),V.push(parseFloat(at[$][0]))
;var dt=750,rt=(Z=300,
Math.max.apply(Math,V)),st=(rt+=.25*rt).toString().indexOf(".")||rt.toString.length
;st=Math.pow(10,st-1),rt=Math.floor((rt+st)/st)*st,r.create({
target:document.getElementById(i+"kmer"),data:{series:[{name:""}],points:[J]},
x_titleOffset:40,y_titleOffset:60,x_title:"sequence size",
y_title:"kmer coverage",x_scale:"log",y_scale:"log",
x_min:Math.min.apply(Math,L),x_max:Math.max.apply(Math,L),y_min:0,y_max:rt,
show_legend:!1,show_dots:!1,connected:!0,chartArea:[70,20,dt,Z],width:dt+40,
height:Z+45}).render()}
var it=c.statistics.qc.bp_profile.percents.columns,ot=c.statistics.qc.bp_profile.percents.data,pt=t('<div id="'+i+'bp_plot" style="width: 95%;">')
;M.kbaseTabs("addTab",{tab:"Nucleotide Histogram",content:pt,canDelete:!1,
show:!0});var ct=it.slice(1),lt=(Y=e(ct.length),[])
;for(z=0;z<ct.length;z++)lt.push({name:ct[z],data:[],fill:Y[z]})
;for($=0;$<ot.length;$++)for(X=1;X<ot[$].length;X++)lt[X-1].data.push(parseFloat(ot[$][X]))
;var ht,_t;Z=300,tt=(dt=750)+(ht=15),et=(_t=23*lt.length)>Z?Math.min(_t,Z+Z/2):Z
;d.create({target:document.getElementById(i+"bp_plot"),data:lt,
x_title:"bp "+it[0],y_title:"Percent bp",type:"stackedArea",
x_tick_interval:parseInt(ot.length/50),
x_labeled_tick_interval:parseInt(ot.length/10),show_legend:!0,
legendArea:[dt+20,20,ht,_t],chartArea:[70,20,dt,Z],width:tt+40,height:et+45
}).render(),M.kbaseTabs("showTab","Overview")}}),(function(e){o.empty()
;var a=t("<div>");a.append(t("<p>").css({padding:"10px 20px"
}).text("[Error] "+e.error.message)),o.append(a)})),s
;o.append("<div>[Error] You're not logged in</div>")},
loggedInCallback:function(t,e){return this.token=e.token,this.render(),this},
loggedOutCallback:function(t,e){return this.token=null,this.render(),this},
uuidv4:function(t,e){
for(e=t="";t++<36;e+=51*t&52?(15^t?8^Math.random()*(20^t?16:4):4).toString(16):"-");
return e}})}));