define(["./subscriptionManager","./nanoBus"],(function(s,i){"use strict"
;return class{constructor(n){n=n||{},this.subscriptions=new s,this.bus=new i({
link:n.bus||n.link}),this.parentBus=n.bus}subscribe(s,i){
this.subscriptions.add(s.subscribe(i))}sendToParent(s,i){
this.parentBus&&this.parentBus.send(s,i)}receiveFromParent(s,i){
this.parentBus.on(s,i)}send(s,i){this.bus.send(s,i)}on(s,i){this.bus.on(s,i)}
dispose(){this.subscriptions.dispose(),this.bus.stop()}}}));