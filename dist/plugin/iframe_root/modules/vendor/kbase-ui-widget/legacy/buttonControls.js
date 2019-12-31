define(["jquery","../geometry/rectangle","../geometry/point","../geometry/size","bootstrap","css!font_awesome","./widget"],(function(t,o,n,i){
t.KBWidget({name:"kbaseButtonControls",version:"1.0.0",options:{controls:[],
onMouseover:!0,position:"top",type:"floating",posOffset:"0px"},init:function(o){
return this._super(o),this._controls={},this.appendUI(t(this.$elem)),this},
bounds:function(t){var s=t.offset()
;return new o(new n(s.left,s.top),new i(t.width(),t.height()))},
visibleBounds:function(t){for(var o=this.bounds(t),n=0;t=t.parent();){
var i=this.bounds(t);if(o=o.intersectRect(i),n++>1e3)break
;if("body"==t.prop("tagName").toLowerCase())break}return o},
appendUI:function(o){
"floating"==this.options.type&&(o.css("position","relative"),
o.append(t.jqElem("style").text(".tooltip { position : fixed }")))
;var i=t("<div></div>").addClass("btn-group btn-group-xs").attr("id","control-buttons")
;if("floating"==this.options.type&&i.css("right","0px").css(this.options.position,this.options.posOffset).css("position","absolute").css("margin-right","3px").attr("z-index",1e4),
o.prepend(i),
this._rewireIds(o,this),this.options.onMouseover&&"floating"==this.options.type){
var s=this;o.mouseover((function(o){
o.preventDefault(),o.stopPropagation(),null!=window._active_kbaseButtonControls&&window._active_kbaseButtonControls.hide(),
t(this).children().first().show(),window._active_kbaseButtonControls=i
})).mouseout((function(t){t.preventDefault(),t.stopPropagation();s.bounds(i)
;var e=s.visibleBounds(i);s.bounds(o)
;e.containsPoint(new n(t.pageX,t.pageY))||(window._active_kbaseButtonControls.hide(),
window._active_kbaseButtonControls=void 0),overParent=!1
})).children().first().hide()}
return this.setControls(this.options.controls),this},controls:function(t){
return t?this._controls[t]:this._controls},setControls:function(o){
for(var n in this.data("control-buttons").empty(),
this._controls)this._controls[n]=void 0;var i=this
;t.each(o,t.proxy((function(o,n){
if(!n.condition||0!=n.condition.call(this,n,i.options.context,this.$elem)){
var s="btn btn-default";n.type&&(s=s+" btn-"+n.type);var e=n.tooltip
;"string"==typeof n.tooltip&&(e={title:n.tooltip
}),null!=e&&null==e.container&&(e.container=this.data("control-buttons")),
null!=e&&null==e.placement&&(e.placement="top"),null!=e&&(e.delay=1)
;var r=t("<button></button>").attr("href","#").css("padding-top","1px").css("padding-bottom","1px").attr("class",s).append(t("<i></i>").addClass(n.icon)).tooltip(e).on("click",(function(o){
o.preventDefault(),
o.stopPropagation(),n["icon-alt"]&&(t(this).children().first().toggleClass(n.icon),
t(this).children().first().toggleClass(n["icon-alt"])),
n.callback.call(this,o,i.options.context)}))
;n.id&&(this._controls[n.id]=r),this.options.id&&r.data("id",this.options.id),
this.data("control-buttons").append(r)}}),this))}})}));