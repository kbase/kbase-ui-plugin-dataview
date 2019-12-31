define(["jquery","kb_lib/html","./widget"],(function(a,t){"use strict"
;const n=t.tag,e=n("a"),i=n("div");a.KBWidget({name:"kbTabs",version:"1.0.0",
init:function(t){this._super(t),t||(t={})
;var n=this.$elem,d=this,s=a('<ul class="nav nav-'+(t.pills?"pills":"tabs")+'">'),r=a('<div class="tab-content">')
;return n.append(s,r),this.addTab=function(n){
if(!(s.find('a[data-id="'+n.name+'"]').length>0)){
var c=a('<li class="'+(n.active?"active":"")+'">'),o=a(e({dataToggle:"tab",
dataId:n.name,dataKBTesthookTab:n.key},n.name))
;if(n.animate,c.append(o),s.append(c),n.removable||t.removable){
var l=a('<button type="button" class="close" style="margin-left: 6px; vertical-align: bottom; ">&times;</button>')
;o.append(l),l.click((function(){d.rmTab(n.name)}))}var h=a(i({
class:"tab-pane "+(n.active?"active":""),dataId:n.name,
dataKBTesthookTabpane:n.key}))
;return h.append(n.content||""),r.append(h),c.click((function(t){
t.preventDefault(),t.stopPropagation();var n=a(this).find("a").data("id")
;d.showTab(n)})),n.content}},this.rmTab=function(a){
var t,n=s.find('a[data-id="'+a+'"]').parent("li"),e=r.children('[data-id="'+a+'"]')
;t=n.next().length>0?n.next().children("a").data("id"):n.prev().children("a").data("id"),
n.remove(),e.remove(),d.showTab(t)},this.tab=function(a){
return s.children('[data-id="'+a+'"]')},this.tabContent=function(a){
return r.children('[data-id="'+a+'"]')},this.addContent=function(a){
var t=r.children('[data-id="'+a.name+'"]');return t.append(a.content||""),t
},this.setContent=function(a){var t=r.children('[data-id="'+a.name+'"]')
;return t.empty(),t.append(a.content||""),t},this.showTab=function(a){
s.children("li").removeClass("active"),
r.children(".tab-pane").removeClass("active"),
s.find('a[data-id="'+a+'"]').parent().addClass("active"),
r.children('[data-id="'+a+'"]').addClass("active")},this.getTabNav=function(){
return s},t.tabs&&t.tabs.forEach(function(t){this.addTab(a.extend(t,{animate:!1
}))}.bind(this)),this}})}));