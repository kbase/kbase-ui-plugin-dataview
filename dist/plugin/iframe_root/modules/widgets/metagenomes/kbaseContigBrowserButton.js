define(["bootstrap","jquery","kbaseUI/widget/legacy/widget"],(function(t,n){
return n.KBWidget({name:"KBaseContigBrowserButtons",version:"1.0.0",options:{
direction:"horizontal",browser:null},init:function(t){
if(this._super(t),console.log("button time friendd......"),
null!==this.options.browser){
var o=this,e=n("<div/>").addClass("btn-group").append(n("<button/>").attr("type","button").addClass("btn btn-default").append("First").click((function(){
o.options.browser.moveLeftEnd()
}))).append(n("<button/>").attr("type","button").addClass("btn btn-default").append("Previous").click((function(){
o.options.browser.moveLeftStep()
}))).append(n("<button/>").attr("type","button").addClass("btn btn-default").append("Zoom In").click((function(){
o.options.browser.zoomIn()
}))).append(n("<button/>").attr("type","button").addClass("btn btn-default").append("Zoom Out").click((function(){
o.options.browser.zoomOut()
}))).append(n("<button/>").attr("type","button").addClass("btn btn-default").append("Next").click((function(){
o.options.browser.moveRightStep()
}))).append(n("<button/>").attr("type","button").addClass("btn btn-default").append("Last").click((function(){
o.options.browser.moveRightEnd()})))
;return this.$elem.append(n("<div align='center'/>").append(e)),this}},
render:function(){return this}})}));