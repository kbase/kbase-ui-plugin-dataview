define([],(function(){"use strict";var e=function(e,t,i){
e.addEventListener?e.addEventListener(t,i,!1):e.attachEvent("on"+t,i)
},t=function(){var i,n,o=document.all&&!window.opera,d=null
;this.createMenu=function(i){
(d=document.createElement("div")).setAttribute("id","popdiv"),
d.style.position="absolute",
d.style.backgroundColor="#fcfcfc",d.style.border="1px solid #ccc",
d.style.zIndex="100",
d.style.visibility="hidden",d.style.fontSize="12px",d.onmouseover=t.clear,
e(d,"mouseout",t.autoHide),e(d,"click",i),document.body.appendChild(d)
},this.clear=function(){i&&clearTimeout(i)},this.hide=function(){
d&&(d.style.visibility="hidden")},this.delayedHide=function(){
i=setTimeout((function(){t.hide()}),500)},this.clickHide=function(e){
n&&(new Date).getTime()-n>500&&d&&(e.pageX<d.offsetLeft||e.pageX>d.offsetLeft+d.offsetWidth||e.pageY<d.offsetTop||e.pageY>d.offsetTop+d.offsetHeight)&&t.hide(e)
},this.autoHide=function(e){
o&&!d.contains(e.toElement)?t.hide():e.currentTarget===e.relatedTarget||function(e,t){
for(;t.parentNode;)if((t=t.parentNode)===e)return!0;return!1
}(e.currentTarget,e.relatedTarget)||t.hide()},this.show=function(e,t,i,c){
var l=document.compatMode&&-1!==document.compatMode.indexOf("CSS")?document.documentElement:document.body
;this.clear(),
null===d&&this.createMenu(c),d.innerHTML=t,d.style.width=void 0===i?i:"150px"
;var s=o?event.clientX:e.clientX,f=o?event.clientY:e.clientY,r=o?l.clientWidth-s:window.innerWidth-s,a=o?l.clientHeight-f:window.innerHeight-f
;r<d.offsetWidth?d.style.left=(o?l.scrollLeft:window.pageXOffset)+s-d.offsetWidth+"px":d.style.left=(o?l.scrollLeft:window.pageXOffset)+s+"px",
a<d.offsetHeight?d.style.top=(o?l.scrollTop:window.pageYOffset)+f-d.offsetHeight+"px":d.style.top=(o?l.scrollTop:window.pageYOffset)+f+"px",
d.style.visibility="visible",n=(new Date).getTime()}}
;return e(window,"click",t.clickHide),new t}));