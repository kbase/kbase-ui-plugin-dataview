define(["require","exports"],(function(e,t){"use strict"
;Object.defineProperty(t,"__esModule",{value:!0});t.Html=class{constructor(){
this.genIdSerial=0}renderChildren(e){if(null===e)return""
;if("string"==typeof e)return e;if("number"==typeof e)return String(e)
;if(!(e instanceof Array))throw new Error("hmm, not an array? "+typeof e)
;let t=this;return e.map(e=>t.renderChildren(e)).join("")}
styleAttribsToString(e){return Object.keys(e).map(t=>{let r=e[t]
;return[t.replace(/[A-Z]/g,e=>"-"+e.toLowerCase()),r].join(": ")}).join("; ")}
attribsToString(e){let t=this;return Object.keys(e).map(r=>{let i=e[r];var n
;return n="string"==typeof i?'"'+i.replace(/"/,'""')+'"':'"'+t.styleAttribsToString(i)+'"',
[r.replace(/[A-Z]/g,e=>"-"+e.toLowerCase()),n].join("=")}).join(" ")}
mergeAttribs(e,t){void 0===e&&(e={});let r=(e,t)=>{
"object"==typeof t&&null!==t&&Object.keys(t).forEach(i=>{var n=e[i],l=t[i]
;void 0===n?e[i]=l:"object"==typeof n&&null!==n&&"object"==typeof l&&null!==l?r(n,l):e[i]=l
})};return r(e,t),e}tagMaker(){var e=e=>null!=e&&0!==e.length;return(t,r={})=>{
return(i,n)=>{let l="<"
;if(void 0===n)if("object"!=typeof i||i instanceof Array)if(void 0===i){
let i=this.attribsToString(r);l+=[t,i].filter(e).join(" "),l+=">"}else{{
let n=this.attribsToString(r)
;l+=[t,n].filter(e).join(" "),l+=">"+this.renderChildren(i)}}else{
if(0===Object.keys(i).length)l+=t;else{
let n=this.attribsToString(this.mergeAttribs(i,r));l+=[t,n].filter(e).join(" ")}
l+=">"}else{if(0===Object.keys(i).length)l+=t;else{
let n=this.attribsToString(this.mergeAttribs(i,r));l+=[t,n].filter(e).join(" ")}
l+=">"+this.renderChildren(n)}return l+="</"+t+">",l}}}genId(){
let e=Math.floor(1e3*Math.random()),t=(new Date).getTime()
;return 1e3===this.genIdSerial&&(this.genIdSerial=0),
this.genIdSerial+=1,[e,t,this.genIdSerial].map(String).join("-")}}}));