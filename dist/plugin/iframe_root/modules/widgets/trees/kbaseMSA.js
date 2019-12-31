!function(e,t){e.KBWidget({name:"kbaseMSA",parent:"kbaseAuthenticatedWidget",
version:"0.0.1",options:{msaID:null,workspaceID:null,jobID:null,kbCache:null,
workspaceURL:"https://kbase.us/services/ws/",
loadingImage:"assets/img/ajax-loader.gif",
ujsServiceURL:"https://kbase.us/services/userandjobstate/",height:null,width:1e3
},msaWsRef:null,pref:null,timer:null,loadingImage:"assets/img/ajax-loader.gif",
token:null,aminoAcidColors:{K:"#ff8f8f",R:"#ff8f8f",S:"#6fff6f",T:"#6fff6f",
Q:"#6fff6f",N:"#6fff6f",L:"#9fcfff",V:"#9fcfff",I:"#9fcfff",A:"#9fcfff",
F:"#9fcfff",W:"#9fcfff",M:"#9fcfff",C:"#ffcfef",E:"#ff8fff",D:"#ff8fff",
G:"orange",P:"yellow",H:"#9fffff",Y:"#9fffff"},init:function(t){
return this._super(t),
this.pref=this.uuid(),this.$messagePane=e("<div/>").addClass("kbwidget-message-pane kbwidget-hide-message"),
this.$elem.append(this.$messagePane),
this.options.msaID?this.options.workspaceID?this.options.kbCache||this.authToken()?(this.token=this.authToken(),
this.render()):this.renderError("No cache given, and not logged in!"):this.renderError("No workspace given!"):this.renderError("No MSA to render!"),
this},render:function(){
if(this.wsClient=new Workspace(this.options.workspaceURL,{token:this.token
}),this.loading(!1),this.msaWsRef||null==this.options.jobID)this.loadMSA();else{
var t=this,s=new UserAndJobState(t.options.ujsServiceURL,{token:this.token})
;t.$elem.empty();var r=e('<div class="loader-table"/>');t.$elem.append(r)
;var n=e('<table class="table table-striped table-bordered"             \t\t\tstyle="margin-left: auto; margin-right: auto;" id="'+t.pref+'overview-table"/>')
;r.append(n),
n.append("<tr><td>Job was created with id</td><td>"+t.options.jobID+"</td></tr>"),
n.append("<tr><td>Output result will be stored as</td><td>"+t.options.msaID+"</td></tr>"),
n.append('<tr><td>Current job state is</td><td id="'+t.pref+'job"></td></tr>')
;var a=function(r){s.get_job_status(t.options.jobID,(function(s){
var r=s[2],n=s[5],a=s[6],i=e("#"+t.pref+"job")
;"running"===r?i.html(r+'... &nbsp &nbsp <img src="'+t.loadingImage+'">'):i.html(r),
1===n&&(clearInterval(t.timer),this.msaWsRef||0===a&&t.loadMSA())
}),(function(s){
(clearInterval(t.timer),this.msaWsRef)||e("#"+t.pref+"job").html("Error accessing job status: "+s.error.message)
}))};a(),t.timer=setInterval(a,5e3)}},loadMSA:function(){
var t,s=this.buildObjectIdentity(this.options.workspaceID,this.options.msaID,null,this.msaWsRef)
;t=this.options.kbCache?this.options.kbCache.req("ws","get_objects",[s]):this.wsClient.get_objects([s])
;var r=this;e.when(t).done(e.proxy((function(t){
r.$elem.empty(),r.$elem.append('<table class="table table-striped table-bordered" style="margin-left: auto; margin-right: auto;"><tr><td width="40%">Multiple Sequence Alignment object ID</td><td>'+r.options.msaID+"</td></tr></table>")
;var s="canvas-"+r.pref,n="canvas-div-"+r.pref,a=e('<div id="'+n+'" style="border:1px solid #d3d3d3;">').append(e('<canvas id="'+s+'">'))
;a.css({"max-height":400,"max-width":1080,overflow:"scroll"}),r.$elem.append(a),
watchForWidgetMaxWidthCorrection(n)
;var i=document.getElementById(s),o=t[0].data.alignment,f=0,d=null,l=0
;for(var h in o){f++;var c=r.drawLine(i,h,0,!0);l<c&&(l=c),d=o[h].length}
i.width=l+8*(2+d),i.height=12*f+2;var p=0;for(var h in o){r.drawLine(i,h,p,!1)
;for(var u=o[h],g=0;g<u.length;g++){var m=u.substring(g,g+1)
;r.drawSymbol(i,m,r.getColor(m),l,2+g,p)}p++}r.loading(!0)
}),this)),e.when(t).fail(e.proxy((function(e){this.renderError(e)}),this))},
drawSymbol:function(e,t,s,r,n,a){
var i=t,o=e.getContext("2d"),f="10pt courier-new";CanvasTextFunctions.enable(o),
o.strokeStyle="#000000",o.fillStyle=s;var d=o.measureText(f,10,i),l=r+8*n,h=12*a
;o.fillRect(l-1,h+1,8,12),o.drawText(f,10,l+(7-d)/2,h+11,i)},
drawLine:function(e,t,s,r){var n=e.getContext("2d"),a="10pt courier-new"
;CanvasTextFunctions.enable(n),n.strokeStyle="#000000"
;var i=n.measureText(a,10,t),o=12*s;return r||n.drawText(a,10,0,o+11,t),i},
getColor:function(e){var t=this.aminoAcidColors[e];return t||(t="#ffffff"),t},
renderError:function(t){
errString="Sorry, an unknown error occurred","string"==typeof t?errString=t:t.error&&t.error.message&&(errString=t.error.message)
;var s=e("<div>").addClass("alert alert-danger").append("<b>Error:</b>").append("<br>"+errString)
;this.$elem.empty(),this.$elem.append(s)},getData:function(){return{type:"MSA",
id:this.options.msaID,workspace:this.options.workspaceID,
title:"Multiple sequence alignment"}},buildObjectIdentity:function(e,t,s,r){
var n={}
;return r?n.ref=r:(/^\d+$/.exec(e)?n.wsid=e:n.workspace=e,/^\d+$/.exec(t)?n.objid=t:n.name=t,
s&&(n.ver=s)),n},loading:function(e){
e?this.hideMessage():this.showMessage("<img src='"+this.options.loadingImage+"'/>")
},showMessage:function(t){var s=e("<span/>").append(t)
;this.$messagePane.append(s),this.$messagePane.show()},hideMessage:function(){
this.$messagePane.hide(),this.$messagePane.empty()},uuid:function(){
return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){
var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)}))},
getState:function(){return{msaWsRef:this.msaWsRef}},loadState:function(e){
e&&e.msaWsRef&&(this.msaWsRef=e.msaWsRef,this.render())},
loggedInCallback:function(e,t){
return null==this.token&&(this.token=t.token,this.render()),this},
loggedOutCallback:function(e,t){return this.render(),this}})}(jQuery);