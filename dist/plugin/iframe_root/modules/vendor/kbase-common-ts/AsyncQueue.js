define(["require","exports"],(function(e,t){"use strict"
;Object.defineProperty(t,"__esModule",{value:!0});class r{constructor(e,t,r){
this.run=t,this.error=r,this.id=e}}t.QueueItem=r;t.AsyncQueue=class{
constructor(e){this.queuePauseTime=e,this.queue=[]}processQueue(){
var e=this.queue.shift();if(e)try{e.run()}catch(t){if(e.error)try{e.error(t)
}catch(r){console.error("ERROR running error fun",t)
}else console.error("Error processing queue item",t)}finally{this.start()}}
start(){let e=this;this.timer=window.setTimeout(()=>{e.processQueue()
},this.queuePauseTime)}stop(e){this.addItem(()=>{
window.clearTimeout(this.timer),this.timer=null,e()})}addItem(e,t){
this.itemId+=1,this.queue.push(new r(this.itemId,e,t)),this.start()}}}));