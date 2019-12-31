define([],(function(){"use strict";class t{constructor(t){
this.interval=t,this.timer=null,this.listeners={}}}class e{constructor(){
this.intervalAlarms={},this.listeners={},this.currentId=0}getIntervalAlarm(e){
var r=this.intervalAlarms[e];return r||(r=new t(e),this.intervalAlarms[e]=r),r}
listen(t,e){this.currentId+=1,e=e||1;var r=this.getIntervalAlarm(e)
;return r.listeners[this.currentId]={fun:t,id:this.currentId,callCount:0,
lastCalledAt:null,error:null},this.listeners[this.currentId]={interval:e,
id:this.currentId},r.timer||(r.timer=window.setInterval((function(){
Object.keys(r.listeners).forEach(t=>{var l=r.listeners[t];try{
l.callCount+=1,l.lastCalledA=new Date,l.fun(),l.error=null}catch(n){
console.error("ERROR calling listener "+l.id+" in alarm "+e,n),l.error=n}})
}),1e3*r.interval)),this.currentId}forget(t){var e=this.listeners[t];if(e){
delete this.listeners[t];var r=this.intervalAlarms[e.interval]
;delete r.listeners[t],
0===Object.keys(r.listeners).length&&(window.clearInterval(r.timer),
r.timer=null)}}}const r=new e;return{Clock:e,globalClock:r}}));