define(["knockout","uuid"],(function(e,t){"use strict";return new class{
constructor(){this.installedStylesheets={}}installStylesheet(e,t){
if(this.installedStylesheets[e])return;const n=document.createElement("div")
;n.innerHTML=t;const s=n.querySelector("style")
;s.id="componentStyle_"+e,s?(document.head.appendChild(s),
this.installedStylesheets[e]=t):console.warn("Invalid component stylesheet, no style tag: ",t)
}registerComponent(n){const s=new t(4).format(),l=n();let o
;if(l.viewModelWithContext){o={viewModel:{createViewModel:function(t,n){
const o=e.contextFor(n.element)
;return new l.viewModelWithContext(t,o,n.element,n,s)}},template:l.template}
}else o=l
;return e.components.register(s,o),l.stylesheet&&this.installStylesheet(s,l.stylesheet),
l.stylesheets&&l.stylesheets.forEach((e,t)=>{this.installStylesheet(s+"_"+t,e)
}),{name:function(){return s},quotedName:function(){return'"'+s+'"'}}}}}));