define(["jquery","kbaseUI/widget/legacy/widget","bootstrap"],(function(t){
"use strict";t.KBWidget({name:"KBaseContigBrowserButtons",parent:"kbaseWidget",
version:"1.0.0",options:{direction:"horizontal",browser:null},init:function(n){
if(this._super(n),null!==this.options.browser){
var o=this,e=t("<div/>").addClass("btn-group").append(t("<button/>").attr("type","button").addClass("btn btn-default").css("font-size","125%").css("font-weight","bold").append("|<<").click((function(){
o.options.browser.moveLeftEnd()
}))).append(t("<button/>").attr("type","button").addClass("btn btn-default").css("font-size","125%").css("font-weight","bold").append("<").click((function(){
o.options.browser.moveLeftStep()
}))).append(t("<button/>").attr("type","button").addClass("btn btn-default").css("font-size","125%").css("font-weight","bold").append("+").click((function(){
o.options.browser.zoomIn()
}))).append(t("<button/>").attr("type","button").addClass("btn btn-default").css("font-size","125%").css("font-weight","bold").append("-").click((function(){
o.options.browser.zoomOut()
}))).append(t("<button/>").attr("type","button").addClass("btn btn-default").css("font-size","125%").css("font-weight","bold").append(">").click((function(){
o.options.browser.moveRightStep()
}))).append(t("<button/>").attr("type","button").addClass("btn btn-default").css("font-size","125%").css("font-weight","bold").append(">>|").click((function(){
o.options.browser.moveRightEnd()})))
;return this.$elem.append(t("<div align='center'/>").append(e)),this}},
render:function(){return this}})}));