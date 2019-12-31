define(["jquery","bootstrap","css!font_awesome","./widget"],(function(o){
o.KBWidget({name:"kbaseSearchControls",version:"1.0.0",options:{controls:[],
onMouseover:!0,position:"top",type:"floating"},init:function(s){
return this._super(s),this.appendUI(o(this.$elem)),this},appendUI:function(s){
var t=this,a=this.options.onMouseover
;"floating"===this.options.type&&s.css("position","relative")
;var e=o.jqElem("div").addClass("input-group input-group-sm").append(o.jqElem("input").attr("type","text").addClass("form-control").attr("id","searchBox").on("keyup",(function(o){
27===o.keyCode&&t.value(void 0);var s=t.value()
;s.length?(t.data("searchIcon").removeClass("fa-search"),
t.data("searchIcon").addClass("fa-times"),
t.options.onMouseover=!1):(t.data("searchIcon").addClass("fa-search"),
t.data("searchIcon").removeClass("fa-times"),
a&&(t.options.onMouseover=!0)),t.options.searchCallback.call(this,o,s,t.options.context)
}))).append(o.jqElem("span").addClass("input-group-btn").append(o.jqElem("button").addClass("btn btn-default").attr("id","searchButton").append(o.jqElem("i").attr("id","searchIcon").addClass("fa fa-search")).on("click",(function(o){
t.data("searchIcon").hasClass("fa-times")&&(t.value(void 0),
t.data("searchBox").focus(),
a&&(t.options.onMouseover=!0)),t.options.searchCallback.call(this,o,t.value(),t.options.context)
}))))
;return"floating"===this.options.type&&e.css("right","0px").css("top","0px").css("position","absolute").css("margin-right","3px").attr("z-index",1e4),
this._rewireIds(e,this),
s.append(e),s.data("searchControls",e),s.on("mouseover.kbaseSearchControls",(function(o){
t.options.onMouseover&&e.show()
})).on("mouseout.kbaseSearchControls",(function(o){
t.options.onMouseover&&e.hide(),t.data("searchBox").blur()
})),this.options.onMouseover&&e.hide(),this},value:function(o){
return arguments.length&&this.data("searchBox").val(o),
this.data("searchBox").val()}})}));