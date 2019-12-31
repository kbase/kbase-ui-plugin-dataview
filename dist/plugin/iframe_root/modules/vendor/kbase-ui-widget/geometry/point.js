define(["./rectangle","./size"],(function(t,i){"use strict";function n(t,i){
this.x=t,this.y=i}return n.prototype.asString=function(){
return"{"+this.x+", "+this.y+"}"},n.prototype.offset=function(t,i){
return new n(this.x+t,this.y+i)},n.prototype.rectWithPoint=function(e){
var s=this.x<e.x?this.x:e.x,r=this.y<e.y?this.y:e.y,h=Math.abs(this.x-e.x),o=Math.abs(this.y-e.y)
;return new t(new n(s,r),new i(h,o))},n}));