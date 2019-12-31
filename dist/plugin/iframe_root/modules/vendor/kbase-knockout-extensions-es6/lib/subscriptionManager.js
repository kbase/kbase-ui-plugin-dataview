define([],(function(){"use strict";return class{constructor(){
this.subscriptions=[]}add(s){this.subscriptions.push(s)}dispose(){
this.subscriptions.forEach((function(s,i){try{s.dispose()}catch(o){
console.error("Error disposing of subscription: "+i)}}))}}}));