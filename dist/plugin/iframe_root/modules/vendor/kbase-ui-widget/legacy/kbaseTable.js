define(["jquery","css!font_awesome","./widget","./deletePrompt","./buttonControls","./searchControls"],(function(t){
"use strict";t.KBWidget({name:"kbaseTable",version:"1.0.0",
_accessors:["numRows","sortButtons","visRowString"],options:{sortable:!1,
striped:!0,hover:!0,bordered:!0,headerOptions:{},resizable:!1,
header_callback:function(t){
return void 0!==t.label?t.label:t.value.replace(/(?:^|\s+)([a-z])/g,(function(t){
return t.toUpperCase()}))},row_callback:function(t,a,s,o){},sortButtons:{},
navControls:!1},default_row_callback:function(t){var a
;return void 0===t?t:void 0!==t.label?t.label:(a="object"!=typeof t?t:t.value,
"th"===t.type&&(a=a.replace(/(?:^|\s+)([a-z])/g,(function(t){
return t.toUpperCase()
})),a+=" : "),"object"==typeof t&&void 0!==t.setup&&t.setup(a,t),a)},
init:function(a){
return this._super(a),this.appendUI(t(this.$elem),this.options.structure),this},
appendUI:function(a,s){a.empty()
;var o=t("<table></table>").attr("id","table").css("margin","0px").addClass("table")
;if(this.options.tblOptions&&this.addOptions(o,this.options.tblOptions),
this.options.striped&&o.addClass("table-striped"),
this.options.hover&&o.addClass("table-hover"),
this.options.bordered&&o.addClass("table-bordered"),
this.options.caption&&o.append(t("<caption></caption>").append(this.options.caption)),
s.header){var e=t("<thead></thead>").attr("id","thead")
;e.append(this.navControls(s.header.length))
;var i=t("<tr></tr>").attr("id","headerRow")
;t.each(s.header,t.proxy((function(a,o){"string"==typeof o&&(o={value:o
},s.header[a]=o)
;var e=(o.callback||this.options.header_callback)(o,this),n=o.value,d=t.jqElem("th").append(e)
;if(this.options.resizable&&d.resizable({handles:"e"
}),this.addOptions(d,t.extend(!0,{},this.options.headerOptions,o)),
o.sortable||void 0===o.sortable&&this.options.sortable){
var r=o.value+"-sortButton",l=t("<i></i>").addClass("fa fa-sort"),p=t("<button></button>").addClass("btn btn-default btn-xs").attr("id",r).css("display","none").css("float","right").append(l).data("shouldHide",!0)
;p.bind("click",t.proxy((function(t){var a=this.data("lastSort")
;void 0!==a&&a.get(0)!==p.get(0)&&(a.children(":first").removeClass("fa fa-sort-up"),
a.children(":first").removeClass("fa fa-sort-down"),
a.children(":first").addClass("fa fa-sort"),
a.data("shouldHide",!0),a.css("display","none")),
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
d.append(p),d.bind("mouseover",t.proxy((function(t){p.css("display","inline")
}),this)),d.bind("mouseout",t.proxy((function(t){
p.data("shouldHide")&&p.css("display","none")}),this))}i.append(d)
}),this)),e.append(i),o.append(e)}if(s.rows){
var n=this.data("tbody",t("<tbody></tbody>"))
;this.layoutRows(s.rows,s.header),o.append(n)}if(s.footer){
var d=t("<tfoot></tfoot>").attr("id","tfoot"),r=t.jqElem("tr");d.append(r)
;for(var l=0;l<s.footer.length;l++){var p,u,h=s.footer[l],c=h
;"object"==typeof h&&(c=h.value,p=h.style,u=h.colspan)
;var f=t.jqElem("td").append(c)
;p&&f.attr("style",p),u&&f.attr("colspan",u),r.append(f)}o.append(d)}
return this._rewireIds(o,this),a.append(o),a},navControls:function(a){
var s=this,o=t.jqElem("tr").css("display",this.options.navControls?void 0:"none").append(t.jqElem("td").attr("colspan",a).css("background-color","lightgray").append(t.jqElem("div").addClass("pull-left").addClass("input-group input-group-sm").append(t.jqElem("span").addClass("input-group-btn").append(t.jqElem("button").addClass("btn btn-default").attr("id","pageLeftButton").append(t.jqElem("i").attr("id","leftIcon").addClass("fa fa-caret-left")).on("click",(function(a){
var o=s.options.maxVisibleRowIndex||s.numRows(),e=s.options.minVisibleRowIndex||0,i=o-e,n=e-i
;n<=0&&(t(this).attr("disabled",!0),n=0);var d=n+i
;s.options.minVisibleRowIndex=n,s.options.maxVisibleRowIndex=d,s.displayRows()
})))).append(t.jqElem("span").attr("id","visRecords").addClass("input-group-addon").kb_bind(this,"visRowString")).append(t.jqElem("span").addClass("input-group-btn").append(t.jqElem("button").addClass("btn btn-default").attr("id","pageRightButton").append(t.jqElem("i").attr("id","rightIcon").addClass("fa fa-caret-right")).on("click",(function(a){
var o=s.options.maxVisibleRowIndex||s.numRows(),e=o-(s.options.minVisibleRowIndex||0),i=o+e
;i>=s.numRows()&&(i=s.numRows(),t(this).attr("disabled",!0));var n=i-e
;s.options.minVisibleRowIndex=n,s.options.maxVisibleRowIndex=i,s.displayRows()
}))))).append(t.jqElem("div").addClass("pull-left").addClass("input-group input-group-sm").append(t.jqElem("span").addClass("input-group-btn").append(t.jqElem("button").addClass("btn btn-default").attr("id","removeButton").append(t.jqElem("i").attr("id","removeIcon").addClass("fa fa-minus")).on("click",(function(t){
var a=s.options.maxVisibleRowIndex||0
;--a<1&&(a=1),s.options.maxVisibleRowIndex=a,s.displayRows()
})))).append(t.jqElem("span").addClass("input-group-btn").append(t.jqElem("button").addClass("btn btn-default").attr("id","addButton").append(t.jqElem("i").attr("id","addIcon").addClass("fa fa-plus")).on("click",(function(t){
var a=s.options.maxVisibleRowIndex||0;if(++a>s.numRows()){var o=a-s.numRows()
;a=s.options.structure.rows.length,
s.options.minVisibleRowIndex-=o,s.options.minVisibleRowIndex<0&&(s.options.minVisibleRowIndex=0)
}s.options.maxVisibleRowIndex=a,s.displayRows()
}))))).append(t.jqElem("div").addClass("pull-right").attr("id","searchDiv")))
;return this._rewireIds(o,this),this.data("searchDiv").kbaseSearchControls({
onMouseover:!1,type:"inline",context:this,searchCallback:function(t,a,s){
s.refilter(a)}}),o},sort:function(t,a){var s=this.sortButtons()[t]
;if(-1===a||1===a&&void 0!==s){
var o=this.data("lastSortHeader"),e=this.data("lastSortDir")
;if(t===o&&a===e)return
;t===o?1===a&&-1===o?(s.trigger("click"),s.trigger("click")):-1===a&&1===o&&s.trigger("click"):(s.trigger("click"),
-1===a&&s.trigger("click")),s.css("display","inline")}},refilter:function(t){
this.options.filter=t,
this.sortAndLayoutOn(this.data("lastSortHeader"),this.data("lastSortDir"))},
sortAndLayoutOn:function(t,a){var s=this.options.structure.rows
;void 0!==t&&(s=this.options.structure.rows.slice().sort((function(s,o){
var e=s[t],i=o[t]
;return(e=void 0!==e&&void 0!==e.sortValue?e.sortValue:"string"==typeof e?e.toLowerCase():e)<(i=void 0!==i&&void 0!==i.sortValue?i.sortValue:"string"==typeof i?i.toLowerCase():i)?0-a:e>i?a:0
}))),this.layoutRows(s,this.options.structure.header)},layoutRows:function(a,s){
this.data("tbody").empty();var o=0;if(t.isArray(a))for(var e=0;e<a.length;e++){
void 0!==(i=this.createRow(a[e],s))&&i.children().length&&(o++,
this.data("tbody").append(i))
}else if(void 0!==this.options.structure.keys)for(e=0;e<this.options.structure.keys.length;e++){
var i,n=this.options.structure.keys[e];"object"!=typeof n&&(n={value:n
}),n.type="th",n.style="white-space : nowrap",void 0!==(i=this.createRow({key:n,
value:{value:a[n.value],key:n.value}},[{value:"key"},{value:"value"
}]))&&i.children().length&&(o++,this.data("tbody").append(i))}
this.numRows(o),this.displayRows()},displayRows:function(){
this.data("tbody").find("tr").css("display","")
;var t=this.options.maxVisibleRowIndex||this.numRows()
;t>this.numRows()&&(t=this.numRows());var a=this.options.minVisibleRowIndex||0
;this.data("tbody").find("tr:lt("+a+")").css("display","none"),
this.data("tbody").find("tr:gt("+(t-1)+")").css("display","none"),
this.visRowString("Rows "+(a+1)+" to "+t+" of "+this.numRows()),
this.options.navControls&&(this.data("pageLeftButton").attr("disabled",0===a),
this.data("pageRightButton").attr("disabled",t===this.numRows()),
this.data("removeButton").attr("disabled",t-a==1),
this.data("addButton").attr("disabled",t===this.numRows()))},
addOptions:function(a,s){if("string"!=typeof s&&void 0!==s){
if(void 0!==s.style&&a.attr("style",s.style),void 0!==s.class){
var o="string"==typeof s.class?[s.class]:s.class
;t.each(o,t.proxy((function(t,s){a.addClass(s)}),this))}
t.each(["mouseover","mouseout","click"],t.proxy((function(t,o){
void 0!==s[o]&&a.bind(o,s[o])
}),this)),s.colspan&&a.attr("colspan",s.colspan),s.rowspan&&a.attr("rowspan",s.rowspan)
}},createRow:function(a,s){
var o=t.jqElem("tr").css("background-color","white"),e=this.options.row_callback,i=""
;if(t.isArray(a)?t.each(a,t.proxy((function(a,s){
var e="object"==typeof s?s.value:s;if(void 0!==e){
i+=e instanceof jQuery?e.text():e;var n=t.jqElem("td").append(e)
;"object"==typeof s&&this.addOptions(n,s),o.append(n)}
}),this)):void 0!==s&&s.length&&t.each(s,t.proxy((function(s,n){
var d=n.value,r="td"
;null===a[d]&&(a[d]=void 0),"object"==typeof a[d]&&null===a[d].value&&(a[d].value=""),
"object"==typeof a[d]&&void 0!==a[d].type&&(r=a[d].type)
;var l=t.jqElem(r),p=e(a[d],d,a,this)
;void 0===p&&(p=this.default_row_callback(a[d],d,a,this)),
i+=p instanceof jQuery?p.text():p,
a[d]&&!a[d].externalSortValue&&(a[d].sortValue=p instanceof jQuery?p.text():p),
l.append(p),
"string"!=typeof a[d]&&this.addOptions(l,a[d]),void 0!==p&&o.append(l)}),this)),
void 0!==this.options.filter){var n=new RegExp(this.options.filter,"i")
;i.match(n)||(o=void 0)}return o},deletePrompt:function(a){
t("<div></div>").kbaseDeletePrompt({name:a,callback:this.deleteRowCallback(a)
}).openPrompt()},deleteRowCallback:function(t){},shouldDeleteRow:function(t){
return 1}})}));