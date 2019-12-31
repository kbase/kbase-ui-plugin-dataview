define([],(function(){"use strict";const s=Symbol(),e=Symbol(),t=Symbol()
;return class{constructor({link:e}={}){
this.queue=[],this.runInterval=0,this.messageReceivers={},
this.link=e,this.state=s}processQueue(){const s=this.queue
;this.queue=[],s.forEach(s=>{const e=this.messageReceivers[s.id]
;e?e.forEach(e=>{try{e(s.payload)}catch(t){
console.error("Error processing message: "+t.message,t)}
}):this.link&&this.link.send(s.id,s.payload)})}run(){
this.state!==t&&0!==this.queue.length&&(window.setTimeout(()=>{
this.state!==e&&(this.state=s,
this.processQueue(),this.queue.length>0&&this.run())},0),this.state=t)}
send(s,t){this.state!==e&&(this.queue.push({id:s,payload:t}),this.run())}
on(s,e){
this.messageReceivers[s]||(this.messageReceivers[s]=[]),this.messageReceivers[s].push(e)
}stop(){this.queue=[],this.state=e}}}));