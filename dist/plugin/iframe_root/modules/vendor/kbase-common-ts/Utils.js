define(["require","exports"],(function(e,t){"use strict"
;Object.defineProperty(t,"__esModule",{value:!0});t.Utils=class{constructor(){
this.genIdSerial=0}genId(){
let e=Math.floor(1e3*Math.random()),t=(new Date).getTime()
;return 1e3===this.genIdSerial&&(this.genIdSerial=0),
this.genIdSerial+=1,[e,t,this.genIdSerial].map(String).join("-")}}}));