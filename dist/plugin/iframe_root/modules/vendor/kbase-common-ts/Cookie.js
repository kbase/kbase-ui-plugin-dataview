define(["require","exports"],(function(e,t){"use strict"
;Object.defineProperty(t,"__esModule",{value:!0});class i{constructor(e){
if(this.reservedKeys=["expires","max-age","path","domain","secure"],
this.noEncode=!1,
this.reservedKeys.indexOf(e.toLowerCase())>=0)throw new Error("Cookie key invalid, must not be one of "+this.reservedKeys.join(", "))
;if(e.match(/;/)||e.match(/=/))throw new Error("Cookie name may not contain a ; or =")
;this.name=e}setValue(e){
if(e.match(/;/)||e.match(/=/))throw new Error("Cookie value may not contain a ; or =")
;return this.value=e,this}setExpires(e){
if(e.match(/;/))throw new Error("Cookie parameter value may not contain a ;")
;return this.expires=e,this}setDomain(e){
if(e.match(/;/))throw new Error("Cookie parameter value may not contain a ;")
;return this.domain=e,this}setMaxAge(e){return this.maxAge=e,this}setPath(e){
if(e.match(/;/))throw new Error("Cookie parameter value may not contain a ;")
;return this.path=e,this}setSecure(e){return this.secure=e,this}setNoEncode(e){
return this.noEncode=e,this}toString(){var e=[];(void 0!==this.domain&&e.push({
key:"domain",value:this.domain}),void 0!==this.path&&e.push({key:"path",
value:this.path}),void 0!==this.expires)?(e.push({key:"expires",
value:this.expires}),void 0!==this.maxAge&&(this.maxAge===1/0?e.push({
key:"expires",value:new Date("9999-12-31T23:59:59Z").toUTCString()}):e.push({
key:"max-age",value:String(this.maxAge)
}))):void 0!==this.maxAge&&(this.maxAge===1/0?e.push({key:"expires",
value:new Date("9999-12-31T23:59:59Z").toUTCString()}):(e.push({key:"expires",
value:new Date((new Date).getTime()+1e3*this.maxAge).toUTCString()}),e.push({
key:"max-age",value:String(this.maxAge)})))
;return void 0!==this.secure&&e.push({key:"secure"
}),[[this.name,this.value].join("=")].concat(e.map(e=>[e.key,e.value].filter(e=>void 0!==e).join("="))).join(";")
}}t.Cookie=i;t.CookieManager=class{constructor(){this.global=document}
importCookies(){var e=this.global.cookie
;return e.length>0?e.split(/;/).reduce((e,t)=>{var i=t.split("="),r=i[0]
;if(0===i.length)return e;r=r.trim(),1===i.length&&e.push({name:r,value:""})
;var o=i[1];return e.push({name:r,value:decodeURIComponent(o)}),e},[]):[]}
getCookies(){return this.importCookies()}findCookies(e){
return this.importCookies().filter(t=>{if(t.name===e)return!0})}getItem(e){
if(!e)return null;var t=this.findCookies(e)
;if(t.length>1)throw new Error("Too many cookies returned, expected 1.")
;return 0===t.length?null:t[0].value}getItems(e){if(!e)return null
;var t=this.findCookies(e);return 0===t.length?[]:t.map((function(e){
return e.value}))}newCookie(e){return new i(e)}setItem(e){
document.cookie=e.toString()}removeItem(e){
let t=new i(e.name).setPath(e.path).setValue("*").setExpires(new Date("1970-01-01T00:00:00Z").toUTCString())
;e.domain&&t.setDomain(e.domain),this.setItem(t)}}}));