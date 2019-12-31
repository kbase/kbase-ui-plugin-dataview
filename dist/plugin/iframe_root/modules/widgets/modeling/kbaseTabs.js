!function(a,t){a.KBWidget({name:"kbTabs",version:"1.0.0",init:function(t){
this._super(t),t||(t={})
;var n=this.$elem,e=this,i=a('<ul class="nav nav-'+(t.pills?"pills":"tabs")+'">'),d=a('<div class="tab-content">')
;if(n.append(i,d),this.addTab=function(n){
if(!(i.find('a[data-id="'+n.name+'"]').length>0)){
var r=a('<li class="'+(n.active?"active":"")+'">'),s=a('<a data-toggle="tab" data-id="'+n.name+'">'+n.name+"</a>")
;if(!1===n.animate?(r.append(s),
i.append(r)):(r.append(s).hide(),i.append(r),r.toggle("slide",{direction:"down",
duration:"fast"})),n.removable||t.removable){
var c=a('<span class="glyphicon glyphicon-remove">')
;s.append(c),c.click((function(a){e.rmTab(n.name)}))}
var o=a('<div class="tab-pane '+(n.active?"active":"")+'" data-id="'+n.name+'">')
;return o.append(n.content?n.content:""),d.append(o),r.click((function(t){
t.preventDefault(),t.stopPropagation();var n=a(this).find("a").data("id")
;e.showTab(n)})),n.content}},this.rmTab=function(a){
var t=i.find('a[data-id="'+a+'"]').parent("li"),n=d.children('[data-id="'+a+'"]')
;if(t.next().length>0)var r=t.next().children("a").data("id");else r=t.prev().children("a").data("id")
;t.remove(),n.remove(),e.showTab(r)},this.tab=function(a){
return i.children('[data-id="'+a+'"]')},this.tabContent=function(a){
return d.children('[data-id="'+a+'"]')},this.addContent=function(a){
var t=d.children('[data-id="'+a.name+'"]')
;return t.append(a.content?a.content:""),t},this.showTab=function(a){
i.children("li").removeClass("active"),
d.children(".tab-pane").removeClass("active"),
i.find('a[data-id="'+a+'"]').parent().addClass("active"),
d.children('[data-id="'+a+'"]').addClass("active")},this.getTabNav=function(){
return i},"tabs"in t)for(var r in t.tabs){var s=a.extend(t.tabs[r],{animate:!1})
;this.addTab(s)}return this}})}(jQuery);