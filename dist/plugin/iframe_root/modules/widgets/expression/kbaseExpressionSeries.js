define(["jquery","bluebird","kb_common/html","kb_common/utils","kb_service/client/workspace","kb_service/workspaceClient","kbaseUI/widget/legacy/widget","kbaseUI/widget/legacy/tabs","datatables_bootstrap"],(function(e,t,a,r,s,n){
"use strict";e.KBWidget({name:"kbaseExpressionSeries",parent:"kbaseWidget",
version:"1.0.0",options:{color:"black"},init:function(o){this._super(o)
;var i=new s(this.runtime.getConfig("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()}),c=Object.create(n).init({
url:this.runtime.getConfig("services.workspace.url"),
authToken:this.runtime.service("session").getAuthToken()}),l=(o.name,this.$elem)
;return l.html(a.loading()),i.get_objects([{workspace:o.ws,name:o.name
}]).then((function(e){var a=e[0].refs;return new t.all([e,c.translateRefs(a)])
})).then((function(s,n){return function(s,n){return t.try((function(){l.empty()
;var n=l.kbTabs({tabs:[{name:"Overview",active:!0},{name:"ExpressionSeries",
content:a.loading()}]
}),o=s[0][0],c=Object.keys(o.data.genome_expression_sample_ids_map)[0],u={
wsid:o.info[1],ws:o.info[7],kbid:o.data.regulome_id,source:o.data.source,
genome:c,type:o.data.type,errors:o.data.importErrors,owner:o.creator,
date:o.created},d=r.objTable({obj:u,keys:[{key:"wsid"},{key:"ws"},{key:"kbid"},{
key:"source"},{key:"genome"},{key:"type"},{key:"errors"},{key:"owner"},{
key:"date"}],
labels:["Name","Workspace","KBID","Source","Genome","Type","Errors","Owner","Creation date"]
}),b=o.data.genome_expression_sample_ids_map[c],m=[]
;n.tabContent("Overview").append(d);for(var p=0;p<b.length;p++)m.push({ref:b[p]
});return t.resolve(i.get_objects(m)).then((function(t){
var a=e('<table class="table table-bordered table-striped" style="width: 100%;">')
;n.setContent({name:"ExpressionSeries",content:a});var r={
sPaginationType:"full_numbers",iDisplayLength:10,aaData:t,aaSorting:[[0,"asc"]],
aoColumns:[{sTitle:"Gene Expression Samples",mData:function(e){return e.data.id}
}],oLanguage:{sEmptyTable:"No objects in workspace",sSearch:"Search: "}}
;a.dataTable(r)}))}))}(s)})).catch((function(e){
console.error(e),l.append('<div class="alert alert-danger">'+e.error.message+"</div>")
})),this}})}));