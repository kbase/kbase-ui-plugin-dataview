!function(e,t){e.KBWidget({name:"KBaseGeneDomains",parent:"kbaseWidget",
version:"1.0.0",options:{featureID:null,auth:null,height:300},
cdmiURL:"https://kbase.us/services/cdmi_api",
proteinInfoURL:"https://kbase.us/services/protein_info_service",
init:function(e){
return this._super(e),null===this.options.featureID?this:(this.cdmiClient=new CDMI_API(this.cdmiURL),
this.entityClient=new CDMI_EntityAPI(this.cdmiURL),
this.proteinInfoClient=new ProteinInfo(this.proteinInfoURL),this.render())},
render:function(t){var n=this
;return this.proteinInfoClient.fids_to_domains([this.options.featureID],(function(t){
var i=[];if(t=t[n.options.featureID]){for(var o=0;o<t.length;o++)i.push(t[o])
;n.proteinInfoClient.domains_to_domain_annotations(i,(function(i){
var o=e("<table/>").addClass("table table-bordered table-striped")
;if(Object.getOwnPropertyNames(i).length>0){
for(var s=0;s<t.length;s++)i[t[s]]?o.append(e("<tr>").append(e("<td>").append(t[s])).append(e("<td>").append(i[t[s]]))):o.append(e("<tr>").append(e("<td>").append(t[s])).append(e("<td>").append("No description available")))
;n.$elem.append(o)}else n.$elem.append("No domain assignments found")
}),n.clientError)}else n.$elem.append("No domain assignments found")
}),this.clientError),this},getData:function(){return{type:"Feature",
id:this.options.featureID,workspace:this.options.workspaceID,title:"Domains"}},
clientError:function(e){}})}(jQuery);