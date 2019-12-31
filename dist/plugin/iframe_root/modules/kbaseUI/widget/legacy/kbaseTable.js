define(["jquery","css!font_awesome","./widget","./deletePrompt","./buttonControls","./searchControls"],(function(t){
"use strict";t.KBWidget({name:"kbaseTable",version:"1.0.0",
_accessors:["numRows","sortButtons","visRowString"],options:{sortable:!1,
striped:!0,hover:!0,bordered:!0,headerOptions:{},resizable:!1,
header_callback:function(t){
return void 0!==t.label?t.label:t.value.replace(/(?:^|\s+)([a-z])/g,(function(t){
return t.toUpperCase()}))},row_callback:function(){},sortButtons:{},
navControls:!1},default_row_callback:function(t){var s
;return void 0===t?t:void 0!==t.label?t.label:(s="object"!=typeof t?t:t.value,
"th"===t.type&&(s=s.replace(/(?:^|\s+)([a-z])/g,(function(t){
return t.toUpperCase()
})),s+=" : "),"object"==typeof t&&void 0!==t.setup&&t.setup(s,t),s)},
init:function(s){
return this._super(s),this.appendUI(t(this.$elem),this.options.structure),this},
appendUI:function(s,a){s.empty()
;var o=t("<table></table>").attr("id","table").css("margin","0px").addClass("table")
;if(this.options.tblOptions&&this.addOptions(o,this.options.tblOptions),
this.options.striped&&o.addClass("table-striped"),
this.options.hover&&o.addClass("table-hover"),
this.options.bordered&&o.addClass("table-bordered"),
this.options.caption&&o.append(t("<caption></caption>").append(this.options.caption)),
a.header){var e=t("<thead></thead>").attr("id","thead")
;e.append(this.navControls(a.header.length))
;var i=t("<tr></tr>").attr("id","headerRow")
;t.each(a.header,t.proxy((function(s,o){"string"==typeof o&&(o={value:o
},a.header[s]=o)
;var e=(o.callback||this.options.header_callback)(o,this),n=o.value,d=t.jqElem("th").append(e)
;if(this.options.resizable&&d.resizable({handles:"e"
}),this.addOptions(d,t.extend(!0,{},this.options.headerOptions,o)),
o.sortable||void 0===o.sortable&&this.options.sortable){
var r=o.value+"-sortButton",l=t("<i></i>").addClass("fa fa-sort"),p=t("<button></button>").addClass("btn btn-default btn-xs").attr("id",r).css("display","none").css("float","right").append(l).data("shouldHide",!0)
;p.bind("click",t.proxy((function(){var t=this.data("lastSort")
;void 0!==t&&t.get(0)!==p.get(0)&&(t.children(":first").removeClass("fa fa-sort-up"),
t.children(":first").removeClass("fa fa-sort-down"),
t.children(":first").addClass("fa fa-sort"),
t.data("shouldHide",!0),t.css("display","none")),
this.data("lastSortHeader",n),l.hasClass("fa fa-sort")?(l.removeClass("fa fa-sort"),
l.addClass("fa fa-sort-up"),
p.data("shouldHide",!1),this.sortAndLayoutOn(n,1),this.data("lastSortDir",1),
this.data("lastSort",p)):l.hasClass("fa fa-sort-up")?(l.removeClass("fa fa-sort-up"),
l.addClass("fa fa-sort-down"),
p.data("shouldHide",!1),this.sortAndLayoutOn(n,-1),
this.data("lastSortDir",-1),this.data("lastSort",p)):l.hasClass("fa fa-sort-down")&&(l.removeClass("fa fa-sort-down"),
l.addClass("fa fa-sort"),
p.data("shouldHide",!0),this.sortAndLayoutOn(void 0),this.data("lastSortHeader",void 0),
this.data("lastSortDir",void 0),this.data("lastSort",void 0))
}),this)),this.sortButtons()[o.value]=p,
d.append(p),d.bind("mouseover",t.proxy((function(){p.css("display","inline")
}),this)),d.bind("mouseout",t.proxy((function(){
p.data("shouldHide")&&p.css("display","none")}),this))}i.append(d)
}),this)),e.append(i),o.append(e)}if(a.rows){
var n=this.data("tbody",t("<tbody></tbody>"))
;this.layoutRows(a.rows,a.header),o.append(n)}if(a.footer){
var d=t("<tfoot></tfoot>").attr("id","tfoot"),r=t.jqElem("tr");d.append(r)
;for(var l=0;l<a.footer.length;l++){var p,u,h=a.footer[l],c=h
;"object"==typeof h&&(c=h.value,p=h.style,u=h.colspan)
;var f=t.jqElem("td").append(c)
;p&&f.attr("style",p),u&&f.attr("colspan",u),r.append(f)}o.append(d)}
return this._rewireIds(o,this),s.append(o),s},navControls:function(s){
var a=this,o=t.jqElem("tr").css("display",this.options.navControls?void 0:"none").append(t.jqElem("td").attr("colspan",s).css("background-color","lightgray").append(t.jqElem("div").addClass("pull-left").addClass("input-group input-group-sm").append(t.jqElem("span").addClass("input-group-btn").append(t.jqElem("button").addClass("btn btn-default").attr("id","pageLeftButton").append(t.jqElem("i").attr("id","leftIcon").addClass("fa fa-caret-left")).on("click",(function(){
var s=a.options.maxVisibleRowIndex||a.numRows(),o=a.options.minVisibleRowIndex||0,e=s-o,i=o-e
;i<=0&&(t(this).attr("disabled",!0),i=0);var n=i+e
;a.options.minVisibleRowIndex=i,a.options.maxVisibleRowIndex=n,a.displayRows()
})))).append(t.jqElem("span").attr("id","visRecords").addClass("input-group-addon").kb_bind(this,"visRowString")).append(t.jqElem("span").addClass("input-group-btn").append(t.jqElem("button").addClass("btn btn-default").attr("id","pageRightButton").append(t.jqElem("i").attr("id","rightIcon").addClass("fa fa-caret-right")).on("click",(function(){
var s=a.options.maxVisibleRowIndex||a.numRows(),o=s-(a.options.minVisibleRowIndex||0),e=s+o
;e>=a.numRows()&&(e=a.numRows(),t(this).attr("disabled",!0));var i=e-o
;a.options.minVisibleRowIndex=i,a.options.maxVisibleRowIndex=e,a.displayRows()
}))))).append(t.jqElem("div").addClass("pull-left").addClass("input-group input-group-sm").append(t.jqElem("span").addClass("input-group-btn").append(t.jqElem("button").addClass("btn btn-default").attr("id","removeButton").append(t.jqElem("i").attr("id","removeIcon").addClass("fa fa-minus")).on("click",(function(){
var t=a.options.maxVisibleRowIndex||0
;--t<1&&(t=1),a.options.maxVisibleRowIndex=t,a.displayRows()
})))).append(t.jqElem("span").addClass("input-group-btn").append(t.jqElem("button").addClass("btn btn-default").attr("id","addButton").append(t.jqElem("i").attr("id","addIcon").addClass("fa fa-plus")).on("click",(function(){
var t=a.options.maxVisibleRowIndex||0;if(++t>a.numRows()){var s=t-a.numRows()
;t=a.options.structure.rows.length,
a.options.minVisibleRowIndex-=s,a.options.minVisibleRowIndex<0&&(a.options.minVisibleRowIndex=0)
}a.options.maxVisibleRowIndex=t,a.displayRows()
}))))).append(t.jqElem("div").addClass("pull-right").attr("id","searchDiv")))
;return this._rewireIds(o,this),this.data("searchDiv").kbaseSearchControls({
onMouseover:!1,type:"inline",context:this,searchCallback:function(t,s,a){
a.refilter(s)}}),o},sort:function(t,s){var a=this.sortButtons()[t]
;if(-1===s||1===s&&void 0!==a){
var o=this.data("lastSortHeader"),e=this.data("lastSortDir")
;if(t===o&&s===e)return
;t===o?1===s&&-1===o?(a.trigger("click"),a.trigger("click")):-1===s&&1===o&&a.trigger("click"):(a.trigger("click"),
-1===s&&a.trigger("click")),a.css("display","inline")}},refilter:function(t){
this.options.filter=t,
this.sortAndLayoutOn(this.data("lastSortHeader"),this.data("lastSortDir"))},
sortAndLayoutOn:function(t,s){var a=this.options.structure.rows
;void 0!==t&&(a=this.options.structure.rows.slice().sort((function(a,o){
var e=a[t],i=o[t]
;return(e=void 0!==e&&void 0!==e.sortValue?e.sortValue:"string"==typeof e?e.toLowerCase():e)<(i=void 0!==i&&void 0!==i.sortValue?i.sortValue:"string"==typeof i?i.toLowerCase():i)?0-s:e>i?s:0
}))),this.layoutRows(a,this.options.structure.header)},layoutRows:function(s,a){
this.data("tbody").empty();var o=0;if(t.isArray(s))for(let t=0;t<s.length;t++){
const e=this.createRow(s[t],a)
;void 0!==e&&e.children().length&&(o++,this.data("tbody").append(e))
}else if(void 0!==this.options.structure.keys)for(let t=0;t<this.options.structure.keys.length;t++){
let a=this.options.structure.keys[t];"object"!=typeof a&&(a={value:a
}),a.type="th",a.style="white-space : nowrap";const e=this.createRow({key:a,
value:{value:s[a.value],key:a.value}},[{value:"key"},{value:"value"}])
;void 0!==e&&e.children().length&&(o++,this.data("tbody").append(e))}
this.numRows(o),this.displayRows()},displayRows:function(){
this.data("tbody").find("tr").css("display","")
;var t=this.options.maxVisibleRowIndex||this.numRows()
;t>this.numRows()&&(t=this.numRows());var s=this.options.minVisibleRowIndex||0
;this.data("tbody").find("tr:lt("+s+")").css("display","none"),
this.data("tbody").find("tr:gt("+(t-1)+")").css("display","none"),
this.visRowString("Rows "+(s+1)+" to "+t+" of "+this.numRows()),
this.options.navControls&&(this.data("pageLeftButton").attr("disabled",0===s),
this.data("pageRightButton").attr("disabled",t===this.numRows()),
this.data("removeButton").attr("disabled",t-s==1),
this.data("addButton").attr("disabled",t===this.numRows()))},
addOptions:function(s,a){if("string"!=typeof a&&void 0!==a){
if(void 0!==a.style&&s.attr("style",a.style),void 0!==a.class){
var o="string"==typeof a.class?[a.class]:a.class
;t.each(o,t.proxy((function(t,a){s.addClass(a)}),this))}
t.each(["mouseover","mouseout","click"],t.proxy((function(t,o){
void 0!==a[o]&&s.bind(o,a[o])
}),this)),a.colspan&&s.attr("colspan",a.colspan),a.rowspan&&s.attr("rowspan",a.rowspan)
}},createRow:function(s,a){
var o=t.jqElem("tr").css("background-color","white"),e=this.options.row_callback,i=""
;if(t.isArray(s)?t.each(s,t.proxy((function(s,a){
var e="object"==typeof a?a.value:a;if(void 0!==e){i+=e instanceof t?e.text():e
;var n=t.jqElem("td").append(e)
;"object"==typeof a&&this.addOptions(n,a),o.append(n)}
}),this)):void 0!==a&&a.length&&t.each(a,t.proxy((function(a,n){
var d=n.value,r="td"
;null===s[d]&&(s[d]=void 0),"object"==typeof s[d]&&null===s[d].value&&(s[d].value=""),
"object"==typeof s[d]&&void 0!==s[d].type&&(r=s[d].type)
;var l=t.jqElem(r),p=e(s[d],d,s,this)
;void 0===p&&(p=this.default_row_callback(s[d],d,s,this)),
i+=p instanceof t?p.text():p,
s[d]&&!s[d].externalSortValue&&(s[d].sortValue=p instanceof t?p.text():p),
l.append(p),
"string"!=typeof s[d]&&this.addOptions(l,s[d]),void 0!==p&&o.append(l)}),this)),
void 0!==this.options.filter){var n=new RegExp(this.options.filter,"i")
;i.match(n)||(o=void 0)}return o},deletePrompt:function(s){
t("<div></div>").kbaseDeletePrompt({name:s,callback:this.deleteRowCallback(s)
}).openPrompt()},deleteRowCallback:function(){},shouldDeleteRow:function(){
return 1}})}));