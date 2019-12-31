/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict"
;if(!(void 0===e||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){
var t=e.document,n=function(){return e.URL||e.webkitURL||e
},o=t.createElementNS("http://www.w3.org/1999/xhtml","a"),r="download"in o,a=/constructor/i.test(e.HTMLElement)||e.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent),d=function(t){
(e.setImmediate||e.setTimeout)((function(){throw t}),0)},f=function(e){
setTimeout((function(){"string"==typeof e?n().revokeObjectURL(e):e.remove()
}),4e4)},s=function(e){
return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob([String.fromCharCode(65279),e],{
type:e.type}):e},u=function(t,u,c){c||(t=s(t))
;var l,p=this,v="application/octet-stream"===t.type,w=function(){
!function(e,t,n){for(var o=(t=[].concat(t)).length;o--;){var r=e["on"+t[o]]
;if("function"==typeof r)try{r.call(e,n||e)}catch(a){d(a)}}
}(p,"writestart progress write writeend".split(" "))}
;if(p.readyState=p.INIT,r)return l=n().createObjectURL(t),
void setTimeout((function(){o.href=l,o.download=u,function(e){
var t=new MouseEvent("click");e.dispatchEvent(t)
}(o),w(),f(l),p.readyState=p.DONE}));!function(){if((i||v&&a)&&e.FileReader){
var o=new FileReader;return o.onloadend=function(){
var t=i?o.result:o.result.replace(/^data:[^;]*;/,"data:attachment/file;")
;e.open(t,"_blank")||(e.location.href=t),t=void 0,p.readyState=p.DONE,w()
},o.readAsDataURL(t),void(p.readyState=p.INIT)}
(l||(l=n().createObjectURL(t)),v)?e.location.href=l:e.open(l,"_blank")||(e.location.href=l)
;p.readyState=p.DONE,w(),f(l)}()},c=u.prototype
;return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(e,t,n){
return t=t||e.name||"download",n||(e=s(e)),navigator.msSaveOrOpenBlob(e,t)
}:(c.abort=function(){},
c.readyState=c.INIT=0,c.WRITING=1,c.DONE=2,c.error=c.onwritestart=c.onprogress=c.onwrite=c.onabort=c.onerror=c.onwriteend=null,
function(e,t,n){return new u(e,t||e.name||"download",n)})}
}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this)
;"undefined"!=typeof module&&module.exports?module.exports.saveAs=saveAs:"undefined"!=typeof define&&null!==define&&null!==define.amd&&define("FileSaver.js",(function(){
return saveAs}));