define(["jquery","../visWidgets/geometry/rectangle","../visWidgets/geometry/point","../visWidgets/geometry/size","bootstrap","css!font_awesome","./widget"],(function(t,o,i,n){
"use strict";t.KBWidget({name:"kbaseButtonControls",version:"1.0.0",options:{
controls:[],onMouseover:!0,position:"top",type:"floating",posOffset:"0px"},
init:function(o){
return this._super(o),this._controls={},this.appendUI(t(this.$elem)),this},
bounds:function(t){var s=t.offset()
;return new o(new i(s.left,s.top),new n(t.width(),t.height()))},
visibleBounds:function(t){for(var o=this.bounds(t),i=0;t=t.parent();){
var n=this.bounds(t);if(o=o.intersectRect(n),i++>1e3)break
;if("body"==t.prop("tagName").toLowerCase())break}return o},
appendUI:function(o){
"floating"==this.options.type&&(o.css("position","relative"),
o.append(t.jqElem("style").text(".tooltip { position : fixed }")))
;var n=t("<div></div>").addClass("btn-group btn-group-xs").attr("id","control-buttons")
;if("floating"==this.options.type&&n.css("right","0px").css(this.options.position,this.options.posOffset).css("position","absolute").css("margin-right","3px").attr("z-index",1e4),
o.prepend(n),
this._rewireIds(o,this),this.options.onMouseover&&"floating"==this.options.type){
var s=this;o.mouseover((function(o){
o.preventDefault(),o.stopPropagation(),null!=window._active_kbaseButtonControls&&window._active_kbaseButtonControls.hide(),
t(this).children().first().show(),window._active_kbaseButtonControls=n
})).mouseout((function(t){t.preventDefault(),t.stopPropagation(),s.bounds(n)
;var e=s.visibleBounds(n)
;s.bounds(o),e.containsPoint(new i(t.pageX,t.pageY))||(window._active_kbaseButtonControls.hide(),
window._active_kbaseButtonControls=void 0)})).children().first().hide()}
return this.setControls(this.options.controls),this},controls:function(t){
return t?this._controls[t]:this._controls},setControls:function(o){
for(var i in this.data("control-buttons").empty(),
this._controls)this._controls[i]=void 0;var n=this
;t.each(o,t.proxy((function(o,i){
if(!i.condition||0!=i.condition.call(this,i,n.options.context,this.$elem)){
var s="btn btn-default";i.type&&(s=s+" btn-"+i.type);var e=i.tooltip
;"string"==typeof i.tooltip&&(e={title:i.tooltip
}),null!=e&&null==e.container&&(e.container=this.data("control-buttons")),
null!=e&&null==e.placement&&(e.placement="top"),null!=e&&(e.delay=1)
;var r=t("<button></button>").attr("href","#").css("padding-top","1px").css("padding-bottom","1px").attr("class",s).append(t("<i></i>").addClass(i.icon)).tooltip(e).on("click",(function(o){
o.preventDefault(),
o.stopPropagation(),i["icon-alt"]&&(t(this).children().first().toggleClass(i.icon),
t(this).children().first().toggleClass(i["icon-alt"])),
i.callback.call(this,o,n.options.context)}))
;i.id&&(this._controls[i.id]=r),this.options.id&&r.data("id",this.options.id),
this.data("control-buttons").append(r)}}),this))}})}));