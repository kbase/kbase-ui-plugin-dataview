define(["jquery","./widget"],(function(t){t.KBWidget({name:"kbasePrompt",
version:"1.0.0",options:{controls:["cancelButton","okayButton"],
modalClass:"fade",keyboard:!0},init:function(t){return this._super(t),this},
openPrompt:function(){this.dialogModal().modal({keyboard:this.options.keyboard})
},closePrompt:function(){this.dialogModal().modal("hide")},
cancelButton:function(){return{name:"Cancel",callback:function(t,a){
a.closePrompt()}}},okayButton:function(){return{name:"Okay",type:"primary",
callback:function(t,a){a.closePrompt()}}},dialogModal:function(){
if(void 0!==this.data("dialogModal"))return this.data("dialogModal")
;var a=t("<div></div>").attr("class","modal "+this.options.modalClass).attr("tabindex","-1").append(t.jqElem("div").addClass("modal-dialog").append(t.jqElem("div").addClass("modal-content").append(t("<div></div>").attr("class","modal-header").append(t("<button></button>").attr("type","button").attr("class","close").attr("data-dismiss","modal").attr("aria-hidden","true").append("x\n")).append(t("<h3></h3>").addClass("modal-title").attr("id","title"))).append(t("<div></div>").attr("class","modal-body").attr("id","body")).append(t("<div></div>").attr("class","modal-footer").append(t("<div></div>").addClass("row").addClass("form-horizontal").append(t("<div></div>").addClass("col-sm-5").addClass("text-left").attr("id","footer")).append(t("<div></div>").addClass("col-sm-7").attr("id","controls").css("white-space","nowrap"))))))
;a.unbind("keypress"),a.keypress((function(o){
13===o.keyCode&&(o.stopPropagation(),
o.preventDefault(),t("a:last",a).trigger("click"))
})),this._rewireIds(a,a),this.options.title&&a.data("title").append(this.options.title),
this.options.body&&a.data("body").append(this.options.body),
this.options.footer&&a.data("footer").append(this.options.footer);var o=this
;t.each(this.options.controls,(function(d,i){"string"==typeof i&&(i=o[i]())
;var n="btn btn-default";i.type&&(n=n+" btn-"+i.type)
;var e=t("<a></a>").attr("href","#").attr("class",n).append(i.name).bind("click",(function(t){
t.preventDefault(),t.stopPropagation(),i.callback.call(this,t,o)}))
;i.id&&e.attr("id",i.id),a.data("controls").append(e)
})),this._rewireIds(a,a),this.data("dialogModal",a);var d=void 0,i=!1
;return a.on("shown.bs.modal",t.proxy((function(){
t.each(a.find("input[type=text],input[type=password],textarea"),(function(a,o){
return void 0===d&&(d=t(o)),t(o).is("input")&&void 0===t(o).val()?(t(o).focus(),
void(i=!0)):t(o).is("textarea")&&0===t(o).text().length?(t(o).focus(),
void(i=!0)):void 0})),i||void 0===d||d.focus()}),this)),a}})}));