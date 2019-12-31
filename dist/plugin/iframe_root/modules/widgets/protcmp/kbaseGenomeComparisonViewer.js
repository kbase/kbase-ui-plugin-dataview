define(["jquery","kb_common/html","kb_service/client/workspace","kbaseUI/widget/legacy/authenticatedWidget","kbaseUI/widget/legacy/tabs","datatables_bootstrap"],(function(e,a,t){
"use strict";e.KBWidget({name:"kbaseGenomeComparisonViewer",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",id:null,ws:null,pref:null,
width:1150,options:{id:null,ws:null},init:function(e){
return this._super(e),this.pref=this.genUUID(),
this.ws=e.ws,this.id=e.id,this.render(),this},render:function(){
var n=this,s=this.$elem,r=new t(this.runtime.getConfig("services.workspace.url"),{
token:n.token})
;if(s.empty(),n.authToken())return s.html(a.loading("loading genome comparison data...")),
r.get_objects([{ref:n.ws+"/"+n.id}],(function(a){
var t=a[0].data,r=a[0].info,i=t.genomes,o=t.functions,l=t.families,d=e('<div id="'+n.pref+'tab-content">')
;s.html(d),d.kbaseTabs({canDelete:!0,tabs:[]});var m=e("<div/>")
;d.kbaseTabs("addTab",{tab:"Overview",content:m,canDelete:!1,show:!0})
;var b=e('<table class="table table-striped table-bordered" style="margin-left: auto; margin-right: auto;" id="'+n.pref+'overview-table"/>')
;m.append(b),
b.append("<tr><td>Genome comparison object</td><td>"+r[1]+"</td></tr>"),
b.append("<tr><td>Genome comparison workspace</td><td>"+r[7]+"</td></tr>"),
b.append("<tr><td>Core functions</td><td>"+t.core_functions+"</td></tr>"),
b.append("<tr><td>Core families</td><td>"+t.core_families+"</td></tr>"),
t.protcomp_ref?b.append("<tr><td>Protein Comparison</td><td>"+t.protcomp_ref+"</td></tr>"):b.append("<tr><td>Protein Comparison</td><td>"+t.pangenome_ref+"</td></tr>"),
b.append("<tr><td>Owner</td><td>"+r[5]+"</td></tr>"),
b.append("<tr><td>Creation</td><td>"+r[3]+"</td></tr>");var f=e("<div/>")
;d.kbaseTabs("addTab",{tab:"Genomes",content:f,canDelete:!1,show:!1})
;var u=e('<table class="table table-striped table-bordered" style="margin-left: auto; margin-right: auto;" id="'+n.pref+'genome-table"/>')
;f.append(u);var c=["Genome","Legend"];for(var p in i)c.push("G"+p)
;for(var p in u.append("<tr><th><b>"+c.join("</b></th><th><b>")+"</b></th></tr>"),
i){var g=i[p],h=["<b>G"+p+"</b>-"+g.name,"# of families:<br># of functions:"]
;for(var v in i){var y=i[v]
;g.genome_similarity[y.genome_ref]?h.push(g.genome_similarity[y.genome_ref][0]+"<br>"+g.genome_similarity[y.genome_ref][1]):v===p?h.push(g.families+"<br>"+g.functions):h.push("0<br>0")
}u.append("<tr><td>"+h.join("</td><td>")+"</td></tr>")}var T=e("<div/>")
;d.kbaseTabs("addTab",{tab:"Functions",content:T,canDelete:!1,show:!1})
;var _=e('<table class="table table-striped table-bordered" style="margin-left: auto; margin-right: auto;" id="'+n.pref+'function-table"/>')
;T.append(_);var w={sPaginationType:"full_numbers",iDisplayLength:10,aaData:[],
aaSorting:[[2,"desc"],[0,"asc"]],aoColumns:[{sTitle:"Function",mData:"id"},{
sTitle:"Subsystem",mData:"subsystem"},{sTitle:"Primary class",mData:"primclass"
},{sTitle:"Secondary class",mData:"subclass"},{sTitle:"Totals",mData:"totals"},{
sTitle:"Families",mData:"families"},{sTitle:"Family genes",mData:"famgenes"},{
sTitle:"Family genomes",mData:"famgenomes"}],oLanguage:{
sEmptyTable:"No functions found!",sSearch:"Search: "},fnDrawCallback:V}
;for(var p in l){var x=l[p],D=0;for(var v in i){y=i[v]
;if(x.genome_features[y.genome_ref]){var k=x.genome_features[y.genome_ref]
;for(var G in k)D++}}x.numgenes=D}for(var p in o){var S=o[p]
;S.subsystem=S.subsystem.replace(/_/g," ");var F={
id:'<a class="show-function'+n.pref+'" data-id="'+S.id+'">'+S.id+"</a>",
subsystem:S.subsystem,primclass:S.primclass,subclass:S.subclass},C={},j={};D=0
;for(var v in i){y=i[v];if(S.genome_features[y.genome_ref]){var P={}
;k=S.genome_features[y.genome_ref]
;for(var G in k)D++,P[(M=k[G])[1]]=1,void 0===C[M[1]]&&(C[M[1]]=0),C[M[1]]++
;for(var E in P)void 0===j[E]&&(j[E]=0),j[E]++}}S.numgenes=D;var U=Y(C)
;for(var v in F.totals="Families:&nbsp;"+U.length+"<br>Genes:&nbsp;"+D+"<br>Genomes:&nbsp;"+S.number_genomes,
F.families="",
F.famgenes="",F.famgenomes="",U)F.families.length>0&&(F.families+="<br>",
F.famgenes+="<br>",
F.famgenomes+="<br>"),"null"===U[v]?(F.famgenes=0,F.famgenomes=0,
F.families="none"):(F.famgenes+=C[U[v]]+"("+Math.round(100*C[U[v]]/l[U[v]].numgenes)+"%)",
F.famgenomes+=j[U[v]]+"("+Math.round(100*j[U[v]]/l[U[v]].number_genomes)+"%)",
F.families+='<a class="show-family'+n.pref+'" data-id="'+l[U[v]].id+'">'+l[U[v]].id+"</a>")
;w.aaData.push(F)}_.dataTable(w);var I=e("<div/>")
;n.options.withExport&&I.append("<p><b>Please choose homolog family and push 'Export' button on opened ortholog tab.</b></p><br>"),
d.kbaseTabs("addTab",{tab:"Families",content:I,canDelete:!1,show:!1})
;var L=e('<table class="table table-striped table-bordered" style="margin-left: auto; margin-right: auto;" id="'+n.pref+'genome-table"/>')
;I.append(L);for(var p in w={sPaginationType:"full_numbers",iDisplayLength:10,
aaData:[],aaSorting:[[2,"desc"],[0,"asc"]],aoColumns:[{sTitle:"Family",
mData:"id"},{sTitle:"Totals",mData:"totals"},{sTitle:"Functions",
mData:"functions"},{sTitle:"Subsystems",mData:"subsystem"},{
sTitle:"Primary classes",mData:"primclass"},{sTitle:"Secondary classes",
mData:"subclass"},{sTitle:"Function genes",mData:"funcgenes"},{
sTitle:"Function genomes",mData:"funcgenomes"}],oLanguage:{
sEmptyTable:"No families found!",sSearch:"Search: "},fnDrawCallback:V},l){x=l[p]
;var M,O={id:'<a class="show-family'+n.pref+'" data-id="'+x.id+'">'+x.id+"</a>"
},W={},N={};D=0;for(var v in i){y=i[v];if(x.genome_features[y.genome_ref]){P={},
k=x.genome_features[y.genome_ref];for(var G in k){D++;var q=(M=k[G])[1]
;for(var A in q)void 0===W[q[A]]&&(W[q[A]]=0),P[q[A]]=1,W[q[A]]++}
for(var E in P)void 0===N[E]&&(N[E]=0),N[E]++}}var B=Y(W)
;O.totals="Genes:&nbsp;"+D+"<br>Functions:&nbsp;"+B.length+"<br>Genomes:&nbsp;"+x.number_genomes,
O.functions="",
O.subsystem="",O.primclass="",O.subclass="",O.funcgenes="",O.funcgenomes=""
;var K=1
;for(var v in B)O.functions.length>0&&(O.functions+="<br>",O.subsystem+="<br>",
O.primclass+="<br>",
O.subclass+="<br>",O.funcgenes+="<br>",O.funcgenomes+="<br>"),
"null"===B[v]?(O.funcgenes+=0,
O.funcgenomes+=0,O.functions+="none",O.subsystem+="none",
O.primclass+="none",O.subclass+="none"):(O.funcgenes+=K+": "+W[B[v]]+"("+Math.round(100*W[B[v]]/o[B[v]].numgenes)+"%)",
O.funcgenomes+=K+": "+N[B[v]]+"("+Math.round(100*N[B[v]]/o[B[v]].number_genomes)+"%)",
O.functions+=K+': <a class="show-function'+n.pref+'" data-id="'+o[B[v]].id+'">'+o[B[v]].id+"</a>",
O.subsystem+=K+": "+o[B[v]].subsystem,
O.primclass+=K+": "+o[B[v]].primclass,O.subclass+=K+": "+o[B[v]].subclass),K++
;w.aaData.push(O)}function V(){
e(".show-family"+n.pref).unbind("click"),e(".show-family"+n.pref).click((function(){
var a=e(this).data("id")
;if(d.kbaseTabs("hasTab",a))d.kbaseTabs("showTab",a);else{var t
;for(var s in l)l[s].id===a&&(t=l[s])
;var r=e("<div/>"),m=e('<table class="table table-striped table-bordered" style="margin-left: auto; margin-right: auto;" id="'+n.pref+a+'-table"/>')
;r.append(m)
;for(var s in m.append("<tr><th><b>"+["Genome","Genes","Score","Functions","Subsystems","Primary class","Secondary class"].join("</b></th><th><b>")+"</b></th></tr>"),
i){var b=i[s],f="",u="",c="",p="",g="",h=""
;if(void 0===t.genome_features[b.genome_ref])f="none",
u="none",c="none",p="none",g="none",h="none";else{
var v=t.genome_features[b.genome_ref],y=1;for(var T in v){
T>0&&(f+="<br>",u+="<br>"),f+=y+":"+v[0],u+=y+":"+v[2];var _=v[1]
;for(var w in _)(w>0||T>0)&&(c+="<br>",
p+="<br>",g+="<br>",h+="<br>"),c+=y+":"+o[_[w]].id,
p+=y+":"+o[_[w]].subsystem,g+=y+":"+o[_[w]].primclass,h+=y+":"+o[_[w]].subclass
;y++}}var x=[b.name,f,u,c,p,g,h]
;m.append("<tr><td>"+x.join("</td><td>")+"</td></tr>")}d.kbaseTabs("addTab",{
tab:a,content:r,canDelete:!0,show:!0})}
})),e(".show-function"+n.pref).unbind("click"),
e(".show-function"+n.pref).click((function(){var a=e(this).data("id")
;if(d.kbaseTabs("hasTab",a))d.kbaseTabs("showTab",a);else{var t
;for(var s in o)o[s].id===a&&(t=o[s])
;var r=e("<div/>"),m=e('<table class="table table-striped table-bordered" style="margin-left: auto; margin-right: auto;" id="'+n.pref+a+'-table"/>')
;r.append(m)
;for(var s in m.append("<tr><th><b>"+["Genome","Genes","Scores","Families"].join("</b></th><th><b>")+"</b></th></tr>"),
i){var b=i[s],f="",u="",c=""
;if(void 0===t.genome_features[b.genome_ref])f="none",u="none",c="none";else{
var p=t.genome_features[b.genome_ref]
;for(var g in p)g>0&&(f+="<br>",u+="<br>",c+="<br>"),
f+=p[0],u+=p[2],c+=l[p[1]].id}var h=[b.name,f,c,u]
;m.append("<tr><td>"+h.join("</td><td>")+"</td></tr>")}d.kbaseTabs("addTab",{
tab:a,content:r,canDelete:!0,show:!0})}}))}function Y(e){var a=[]
;for(var t in e)a.push(t);return a.sort((function(a,t){return e[t]-e[a]}))}
L.dataTable(w)}),(function(e){
s.empty(),s.append("<p>[Error] "+e.error.message+"</p>")})),this
;s.append("<div>[Error] You're not logged in</div>")},
loggedInCallback:function(e,a){return this.render(),this},
loggedOutCallback:function(e,a){return this.render(),this},genUUID:function(){
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){
var a=16*Math.random()|0;return("x"===e?a:3&a|8).toString(16)}))}})}));