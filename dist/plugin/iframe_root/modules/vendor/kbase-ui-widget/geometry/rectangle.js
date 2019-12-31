define(["./point","./size"],(function(i,t){"use strict";function n(n,e){
void 0===n&&(n=new i(-1,-1)),
void 0===e&&(e=new t(-1,-1)),this.origin=n,this.size=e}
return n.prototype.invert=function(){return new n(this.height,this.width)
},n.prototype.lowerRight=function(){
return new i(this.origin.x+this.size.width,this.origin.y+this.size.height)
},n.prototype.insetRect=function(e,r){
return new n(new i(this.origin.x+e/2,this.origin.y+r/2),new t(this.size.width-e,this.size.height-r))
},n.prototype.fromString=function(e){
var r=e.match(/{{(.+),\s*(.+)},\s*{(.+),\s*(.+)}}/)
;return r?new n(new i(parseInt(r[1]),parseInt(r[2])),new t(parseInt(r[3]),parseInt(r[4]))):void 0
},n.prototype.intersects=function(i){
return this.origin.x<i.origin.x+i.size.width&&this.origin.x+this.size.width>i.origin.x&&this.origin.y<i.origin.y+i.size.height&&this.origin.y+this.size.height>i.origin.y
},n.prototype.unionRect=function(i,t){
var e=new n,r=this.lowerRight(),h=i.lowerRight()
;e.origin.x=Math.min(this.origin.x,i.origin.x),
e.origin.y=Math.min(this.origin.y,i.origin.y)
;var o=Math.max(r.x,h.x),s=Math.max(r.y,h.y)
;return e.size.width=e.origin.x+o,e.size.height=e.origin.Y+s,
void 0!==t&&(e.origin.x-=t,e.origin.y-=t,e.size.width+=2*t,e.size.height+=2*t),e
},n.prototype.isValidRect=function(){
return!(isNaN(this.origin.x)||isNaN(this.origin.y)||isNaN(this.size.width)||isNaN(this.size.height))
},n.prototype.intersectRect=function(i){
var t=new n,e=this.lowerRight(),r=i.lowerRight()
;t.origin.x=Math.max(this.origin.x,i.origin.x),
t.origin.y=Math.max(this.origin.y,i.origin.y)
;var h=Math.min(e.x,r.x),o=Math.min(e.y,r.y)
;return t.size.width=h-t.origin.x,t.size.height=o-t.origin.y,
t.size.width<=0&&(t.size.width=Number.NaN),
t.size.height<=0&&(t.size.height=Number.NaN),t
},n.prototype.containsPoint=function(i){
var t=this.origin.x+this.size.width,n=this.origin.y+this.size.height
;return i.x>=this.origin.x&&i.x<=t&&i.y>=this.origin.y&&i.y<=n
},n.prototype.equals=function(i){
return void 0!==this&&void 0!==i&&(this.origin.x===i.origin.x&&this.origin.y===i.origin.y&&this.size.width===i.size.width&&this.size.height===i.size.height)
},n.prototype.asString=function(){
return"{"+this.origin.asString()+", "+this.size.asString()+"}"},n}));