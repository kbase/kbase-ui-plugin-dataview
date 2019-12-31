define(["jquery","./widget"],(function(a){"use strict";a.KBWidget({
name:"kbTabs",version:"1.0.0",init:function(t){this._super(t),t||(t={})
;var n=this.$elem,e=this,i=a('<ul class="nav nav-'+(t.pills?"pills":"tabs")+'">'),d=a('<div class="tab-content">')
;return n.append(i,d),this.addTab=function(n){
if(!(i.find('a[data-id="'+n.name+'"]').length>0)){
var r=a('<li class="'+(n.active?"active":"")+'">'),s=a('<a data-toggle="tab" data-id="'+n.name+'">'+n.name+"</a>")
;if(n.animate,r.append(s),i.append(r),n.removable||t.removable){
var c=a('<button type="button" class="close" style="margin-left: 6px; vertical-align: bottom; ">&times;</button>')
;s.append(c),c.click((function(a){e.rmTab(n.name)}))}
var o=a('<div class="tab-pane '+(n.active?"active":"")+'" data-id="'+n.name+'">')
;return o.append(n.content||""),d.append(o),r.click((function(t){
t.preventDefault(),t.stopPropagation();var n=a(this).find("a").data("id")
;e.showTab(n)})),n.content}},this.rmTab=function(a){
var t,n=i.find('a[data-id="'+a+'"]').parent("li"),r=d.children('[data-id="'+a+'"]')
;t=n.next().length>0?n.next().children("a").data("id"):n.prev().children("a").data("id"),
n.remove(),r.remove(),e.showTab(t)},this.tab=function(a){
return i.children('[data-id="'+a+'"]')},this.tabContent=function(a){
return d.children('[data-id="'+a+'"]')},this.addContent=function(a){
var t=d.children('[data-id="'+a.name+'"]');return t.append(a.content||""),t
},this.setContent=function(a){var t=d.children('[data-id="'+a.name+'"]')
;return t.empty(),t.append(a.content||""),t},this.showTab=function(a){
i.children("li").removeClass("active"),
d.children(".tab-pane").removeClass("active"),
i.find('a[data-id="'+a+'"]').parent().addClass("active"),
d.children('[data-id="'+a+'"]').addClass("active")},this.getTabNav=function(){
return i},t.tabs&&t.tabs.forEach(function(t){this.addTab(a.extend(t,{animate:!1
}))}.bind(this)),this}})}));