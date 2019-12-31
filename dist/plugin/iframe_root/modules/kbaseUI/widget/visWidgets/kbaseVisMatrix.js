define(["jquery","./geometry/size"],(function(t,i){"use strict";t.KBWidget({
name:"kbaseVisMatrix",parent:"kbaseVisWidget",version:"1.0.0",options:{},
_accessors:[],init:function(e){this._super(e);var s=this
;return void 0===this.options.matrix_class?this.$elem.append(t.jqElem("div").addClass("alert alert-danger").append("Cannot create vis matrix w/o matrix_class")):require(this.options.matrix_class,(function(){
for(var e=s.options.child_data.length,a=Math.floor(Math.sqrt(e)),n=s.chartBounds(),o=new i(n.size.width/a,n.size.height/a),h=0,r=0,d=0;d<s.options.child_data.length;d++){
var l=s.options.child_data[d],c=t.extend({},s.options.childOptions,l,{parent:s,
rootRegion:{translate:{x:r*o.width+s.options.xPadding,
y:h*o.height+s.options.yGutter},scale:{width:o.width/s.$elem.width(),
height:o.height/s.$elem.height()}}});t.jqElem("div").css({width:s.$elem.width(),
height:s.$elem.height()})[s.options.matrix_class](c),++r%a==0&&(r=0,h++)}
})),this}})}));