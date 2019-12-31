define(["uuid"],(function(s){"use strict";return{LocalPost:class{constructor(e){
if(e.partner.location.origin!==window.location.origin)throw new Error("LocalPost may only be used to communicate on the same host (origin).")
;this.partnerWindow=e.partner,
this.channel=e.channel||new s(4).format(),this.origin=window.location.origin,
this.listener=null,this.listeners={}}processMessage(s){
if(!s.id)return void console.warn("not a valid message",s)
;let e=this.listeners[s.id];e&&e.forEach(e=>{try{e.callback(s.payload)}catch(n){
console.error("error processing messagse",n)}})}startListenLoop(){
this.listener=window.addEventListener("message",s=>{
s.origin===this.origin?(s.data.channel!==this.channel&&console.warn("not our channel",this.channel,s),
this.processMessage(s.data)):console.warn("not for us",s)})}stopListenLoop(){
window.removeEventListener("message",this.listener)}start(){
this.startListenLoop()}stop(){this.stopListenLoop()}on(s,e){
this.listeners[s]||(this.listeners[s]=[]),this.listeners[s].push({callback:e})}
send(s,e){let n={id:s,channel:this.channel,payload:e}
;this.partnerWindow.postMessage(n,this.origin)}}}}));