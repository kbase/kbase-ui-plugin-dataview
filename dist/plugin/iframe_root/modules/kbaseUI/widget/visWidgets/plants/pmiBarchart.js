define(["jquery","d3","bluebird","kb_service/client/workspace","../kbaseBarchart","../../legacy/authenticatedWidget","bootstrap"],(function(e,a,t,s){
"use strict";e.KBWidget({name:"kbasePMIBarchart",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",options:{
subsystem_annotation_object:"PlantSEED_Subsystems",
subsystem_annotation_workspace:"PlantSEED",
selected_subsystems:["Central Carbon: Glycolysis_and_Gluconeogenesis_in_plants"]
},_accessors:[{name:"dataset",setter:"setDataset"}],setDataset:function(t){
var s=this
;this.data("loader")&&(this.data("loader").hide(),this.data("barchartElem").show(),
this.data("formElem").show());var n=a.scale.category20(),o={}
;if(this.data("selectbox")){this.data("selectbox").empty()
;for(var c=Object.keys(t.subsystems).sort(),i=0;i<c.length;i++){
var r=c[i],d=r.replace(/_/g," "),l=d.replace(/:.+/,""),p=d.replace(/.+:\s*/,"")
;this.data("selectbox").append(e.jqElem("option").attr("value",r).prop("selected",0===i).css("background-color",n(i)).append(d))
;for(var h=0;h<t.subsystems[r].length;h++)t.subsystems[r][h].color=n(i)
;if(!o[l]){var u=e.jqElem("div").addClass("btn-group dropup").css({
"padding-right":"5px"
}).append(e.jqElem("button").attr("type","button").addClass("btn btn-sm btn-default").append(e.jqElem("span").css("display","none").addClass("check fa fa-check").append("&nbsp;")).append(l).on("click",(function(a){
e(this).parent().hasClass("open")&&(e(this).parent().removeClass("open"),
e(this).next().find("span").toggleClass("fa-plus fa-caret-up"))
;var t=e(this).parent().find(".check"),n=!t.data("checked")
;e.each(e(this).parent().find(".subsystem-checkbox"),(function(a,t){
n&&!t.checked?e(t).prop("checked",!0):!n&&t.checked&&e(t).prop("checked",!1)})),
n?(t.show(),
t.data("checked",e(this).parent().find(".subsystem-checkbox").length),
t.addClass("fa-check-square-o"),
t.removeClass("fa-check")):(t.hide(),t.data("checked",0),
t.removeClass("fa-check-square-o"),t.addClass("fa-check"));var o=[]
;e.each(s.$elem.find(".subsystem-checkbox"),(function(a,t){
t.checked&&o.push(e(t).val())})),s.displaySubsystems(o)
}))).append(e.jqElem("button").attr("type","button").addClass("btn btn-sm btn-default dropdown-toggle").append(e.jqElem("span").addClass("fa fa-caret-up")).on("click",(function(a){
var t=e(this).parent().hasClass("open")
;s.data("formElem").find(".btn-group").removeClass("open"),
t||e(this).parent().addClass("open"),
e(this).find("span").toggleClass("fa-caret-up"),
e(this).find("span").toggleClass("fa-plus")
;var n=s.data("formElem").find(".check")
;this.checked?(n.data("checked",(n.data("checked")||0)+1),
n.data("checked")===e(this).closest(".btn-group").find(".subsystem-checkbox").length?(n.addClass("fa-check-square-o"),
n.removeClass("fa-check")):(n.removeClass("fa-check-square-o"),
n.addClass("fa-check")),
n.show()):(n.data("checked",n.data("checked")-1),n.removeClass("fa-check-square-o"),
n.addClass("fa-check"),0===n.data("checked")&&n.hide());var o=[]
;e.each(s.$elem.find(".subsystem-checkbox"),(function(a,t){
t.checked&&o.push(e(t).val())})),s.displaySubsystems(o)
}))).append(e.jqElem("ul").addClass("dropdown-menu").css({width:"450px",
"padding-left":"5px","text-align":"left"}))
;this.data("formElem").append(u),o[l]=u}
o[l].find("ul").append(e.jqElem("li").append(e.jqElem("label").append(e.jqElem("input").attr("type","checkbox").attr("value",r).addClass("subsystem-checkbox").on("change",(function(e){}))).append(e.jqElem("span").css("color",n(i)).append("&nbsp;&nbsp;"+p))))
}}
this.setValueForKey("dataset",t),this.data("barchart")&&this.options.selected_subsystems
},setBarchartDataset:function(e,a){
this.data("barchart").setDataset(e),this.data("barchart").options.xAxisTransform=this.data("barchart").yScale()(0),
this.data("barchart").renderXAxis(),this.data("barchart").setLegend(a)},
parseWorkspaceData:function(a,t){
var s=a[0].data,n=t[0].data,o={},c=Object.keys(s.subsystems)
;e.each(c,(function(a,t){void 0===o[t]&&(o[t]={});var c=o[t]
;e.each(s.subsystems[t],(function(a,t){var s=t[0],o=t[1]
;e.each(n.FBAReactionVariables,(function(e,a){
var t=a.modelreaction_ref,n=t.split(/\//),i=t=n[n.length-1]
;if((i=i.replace(/_\w\d+$/,""))===s){void 0===c[t]&&(c[t]={}),c[t].flux=a.value
;var r=o.tooltip
;r=(r=(r=r.replace(/\n/g,"<br>")).replace(/^(.+?):/g,"<b>$1:</b>")).replace(/<br>(.+?):/g,"<br><b>$1:</b>"),
c[t].tooltip=r}}))}))}));var i={subsystems:{}};e.each(o,(function(a,t){
var s=Object.keys(t).sort();e.each(s,(function(e,s){var n=t[s]
;void 0===i.subsystems[a]&&(i.subsystems[a]=[]),i.subsystems[a].push({bar:s,
value:n.flux,tooltip:n.tooltip,id:s})}))})),this.setDataset(i)},
init:function(e){this.$elem.parent().rmLoading(),this._super(e)
;var a=this,n=new s(this.runtime.config("services.workspace.url"),{
token:this.runtime.service("session").getAuthToken()}),o={
workspace:this.options.subsystem_annotation_workspace,
name:this.options.subsystem_annotation_object},c={
workspace:this.options.fba_workspace,name:this.options.fba_object}
;return t.all([n.get_objects([o]),n.get_objects([c])]).spread((function(e,t){
var s=setInterval((function(){
a.data("loader").is(":visible")&&(clearInterval(s),a.parseWorkspaceData(e,t))
}),2e3);return null})).catch((function(e){
a.$elem.empty(),a.$elem.addClass("alert alert-danger").html("Could not load object : "+e.error.message)
})),this.appendUI(this.$elem),this},displaySubsystems:function(a){
var t=this.lastSubsystems;if(void 0!==t){var s={};e.each(a,(function(e,a){s[a]=1
}));var n={};e.each(t,(function(e,a){n[a]=1}));var o=[];e.each(t,(function(e,a){
s[a]&&o.push(a)})),e.each(a,(function(e,a){n[a]||o.push(a)})),a=o}
this.lastSubsystems=a;var c=this,i={},r={};e.each(a,(function(t,s){
var n=c.$elem.find("[value='"+s+"']")
;n.prop("checked",!0),n.closest(".btn-group").find(".check").show(),
n.closest(".btn-group").find(".check").data("checked",a.length),
e.each(c.dataset().subsystems[s],(function(e,a){
void 0===r[s]&&(r[s]=a.color),void 0===i[a.bar]?i[a.bar]={bar:a.bar,
value:[a.value],color:[a.color],tooltip:[a.tooltip],id:a.bar
}:(i[a.bar].value.push(a.value),
i[a.bar].color.push(a.color),i[a.bar].tooltip.push(a.tooltip))}))}))
;var d=Object.keys(i).sort(),l=[];e.each(d,(function(e,a){l.push(i[a])}))
;var p=Object.keys(r).sort(),h=[];e.each(p,(function(e,a){h.push({label:a,
color:r[a],shape:"square"})})),c.setBarchartDataset(l,h)},appendUI:function(a){
var t=this,s=e.jqElem("div").append(e.jqElem("div").css("display","none").attr("id","old-formElem").append(e.jqElem("span").append("Select subsystem(s):&nbsp;&nbsp;").css("float","left")).append(e.jqElem("form").append(e.jqElem("select").attr("id","selectbox").prop("multiple",!0).css("border","1px solid black").on("change",(function(a){
t.displaySubsystems(e(this).val())
}))))).append(e.jqElem("div").attr("id","barchartElem").css("display","none").css("width",1100).css("height",500)).append(e.jqElem("div").attr("id","formElem").css({
width:"100%","text-align":"center"
})).append(e.jqElem("div").attr("id","loader").append("<br>&nbsp;Loading data...<br>&nbsp;please wait...<br>&nbsp;Data parsing may take upwards of 30 seconds, during which time this window may be unresponsive.").append(e.jqElem("br")).append(e.jqElem("div").attr("align","center").append(e.jqElem("i").addClass("fa fa-spinner").addClass("fa fa-spin fa fa-4x"))))
;this._rewireIds(s,this),
this.data("barchart",this.data("barchartElem").kbaseBarchart({scaleAxes:!0,
yLabelRegion:"xPadding",xGutter:300,xAxisRegion:"chart",xAxisVerticalLabels:!0,
yLabel:"Reaction Flux",hGrid:!0,useUniqueID:!0,legendRegion:"xGutter"}))
;var n=this.data("barchart")
;n.superYDomain=n.defaultYDomain,n.defaultYDomain=function(){
var e=n.superYDomain(),a=Math.max(Math.abs(e[0]),Math.abs(e[1]));return[-a,a]
},n.superRenderChart=n.renderChart,n.renderChart=function(){
n.superRenderChart(),
this.D3svg().selectAll(".xAxis .tick text").data(this.dataset()).on("mouseover",(function(e,a){
n.showToolTip({label:n.dataset()[a].tooltip[0]})})).on("mouseout",(function(e){
n.hideToolTip()}))},n.superToolTip=n.showToolTip,n.showToolTip=function(e){
e.maxWidth=1500,n.superToolTip(e)
},this.data("barchart").initialized=!1,this.dataset()&&this.setDataset(this.dataset()),
a.append(s)}})}));