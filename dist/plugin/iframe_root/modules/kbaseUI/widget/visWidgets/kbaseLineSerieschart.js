define(["jquery","d3","./kbaseLinechart"],(function(e,t){"use strict"
;e.KBWidget({name:"kbaseLineSerieschart",parent:"kbaseLinechart",
version:"1.0.0",options:{},_accessors:["labels"],xTickValues:function(){
var e=t.merge(this.dataset().map((function(e){return e.values.map((function(e){
return e.x}))})));return e=t.set(e).values()},xTickLabel:function(e){
return void 0!==this.labels()?this.labels()[e]:e}})}));