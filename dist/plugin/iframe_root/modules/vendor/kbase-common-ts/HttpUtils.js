define(["require","exports"],(function(e,t){"use strict"
;Object.defineProperty(t,"__esModule",{value:!0});t.HttpQuery=class{
constructor(e){this.queryMap={},void 0===e&&(e={}),this.queryMap=e}
addField(e,t){this.queryMap[e]=t}removeField(e){delete this.queryMap[e]}
toString(){let e=this;return Object.keys(this.queryMap).map((function(t){
return[t,e.queryMap[t]].map(encodeURIComponent).join("=")})).join("&")}}}));