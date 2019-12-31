define(["jquery"],(function(r){"use strict";var t=function(r,t,i){
this.r=r,this.g=t,this.b=i},i=Object.create(null,{asString:{value:function(){
return"rgb("+this.r+","+this.g+","+this.b+")"}},asStringWithAlpha:{
value:function(r){return"rgba("+this.r+","+this.g+","+this.b+","+r+")"}},
invert:{value:function(){return new t(255-this.r,255-this.g,255-this.b)}},
darkenBy:{value:function(r){var i=new t(this.r,this.g,this.b)
;return i.r-=r,i.g-=r,i.b-=r,i.r<0&&(i.r=0),i.g<0&&(i.g=0),i.b<0&&(i.b=0),i}},
lightenBy:{value:function(r){var i=new t(this.r,this.g,this.b)
;return i.r+=r,i.g+=r,
i.b+=r,i.r>255&&(i.r=255),i.g>255&&(i.g=255),i.b>255&&(i.b=255),i}},subtract:{
value:function(r){return new t(this.r-r.r,this.g-r.g,this.b-r.b)}},
rgbFromString:{value:function(t){
var i=r.jqElem("div").css("background-color",t).css("background-color").match(/rgb\((\d+), (\d+), (\d+)\)/)
;if(i)return{r:+i[1],g:+i[2],b:+i[3]}}}});return t.prototype=i,t}));