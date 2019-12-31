define(["jquery","./widget","bootstrap"],(function(t){"use strict";t.KBWidget({
name:"kbaseTabs",version:"1.0.0",_accessors:["tabsHeight"],options:{
tabPosition:"top",canDelete:!1,borderColor:"lightgray"},init:function(a){
return this._super(a),
this.data("tabs",{}),this.data("nav",{}),this.appendUI(t(this.$elem)),this},
appendUI:function(a,e){void 0===e&&(e=this.options.tabs)
;var i=t("<div></div>").addClass("tabbable"),s=t("<div></div>").addClass("tab-content").attr("id","tabs-content").css("height",this.tabsHeight()),n=t("<ul></ul>").addClass("nav nav-tabs").attr("id","tabs-nav")
;i.append(n).append(s),
this._rewireIds(i,this),a.append(i),e&&t.each(e,t.proxy((function(t,a){
this.addTab(a)}),this))},addTab:function(a){
void 0===a.canDelete&&(a.canDelete=this.options.canDelete)
;var e=t("<div></div>").addClass("tab-pane").append(a.content)
;this.options.border&&(e.css("border","solid "+this.options.borderColor),
e.css("border-width","0px 1px 0px 1px"),e.css("padding","3px"))
;var i=this,s=t("<li></li>").css("white-space","nowrap").append(t("<a></a>").attr("href","#").text(a.tab).attr("data-tab",a.tab).bind("click",(function(a){
a.preventDefault(),a.stopPropagation()
;var s=i.data("tabs-nav").find(".active:last a")[0]
;t.fn.tab.Constructor.prototype.activate.call(t(this),t(this).parent("li"),i.data("tabs-nav")),
t.fn.tab.Constructor.prototype.activate.call(t(this),e,e.parent(),(function(){
t(this).trigger({type:"shown",relatedTarget:s})}))
})).append(t("<button></button>").addClass("btn btn-default btn-xs").append(t("<i></i>").addClass(this.closeIcon())).css("padding","0px").css("width","22px").css("height","22px").css("margin-left","10px").attr("title",this.deleteTabToolTip(a.tab)).tooltip().bind("click",t.proxy((function(t){
t.preventDefault(),
t.stopPropagation(),void 0!==a.deleteCallback?a.deleteCallback(a.tab):this.deletePrompt(a.tab)
}),this))))
;a.canDelete||s.find("button").remove(),this.data("tabs")[a.tab]=e,this.data("nav")[a.tab]=s,
this.data("tabs-content").append(e),this.data("tabs-nav").append(s)
;var n=Object.keys(this.data("tabs")).length
;(a.show||1===n)&&this.showTab(a.tab)},closeIcon:function(){return"fa fa-close"
},deleteTabToolTip:function(t){return"Remove "+t},hasTab:function(t){
return this.data("tabs")[t]},showTab:function(t){
this.shouldShowTab(t)&&this.data("nav")[t].find("a").trigger("click")},
removeTab:function(t){var a=this.data("tabs")[t],e=this.data("nav")[t]
;e.hasClass("active")&&(e.next("li").length?e.next().find("a").trigger("click"):e.prev("li").find("a").trigger("click")),
a.remove(),e.remove(),this.data("tabs")[t]=void 0,this.data("nav")[t]=void 0},
shouldShowTab:function(t){return 1},deletePrompt:function(t){this.removeTab(t)},
deleteTabCallback:function(a){return t.proxy((function(t,e){
void 0!==e&&e.closePrompt(),this.shouldDeleteTab(a)&&this.removeTab(a)}),this)},
shouldDeleteTab:function(t){return 1},activeTab:function(){
var a=this.data("tabs-nav").find(".active:last a")[0]
;return t(a).attr("data-tab")}})}));