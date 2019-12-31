d3.sankey=function(){var n={},t=24,r=8,u=[1,1],o=[],e=[];function c(){
function n(n,t){return n.source.y-t.source.y}function t(n,t){
return n.target.y-t.target.y}o.forEach((function(r){
r.sourceLinks.sort(t),r.targetLinks.sort(n)})),o.forEach((function(n){
var t=0,r=0;n.sourceLinks.forEach((function(n){n.sy=t,t+=n.dy
})),n.targetLinks.forEach((function(n){n.ty=r,r+=n.dy}))}))}function i(n){
return n.y+n.dy/2}function f(n){return n.value}return n.nodeWidth=function(r){
return arguments.length?(t=+r,n):t},n.nodePadding=function(t){
return arguments.length?(r=+t,n):r},n.nodes=function(t){
return arguments.length?(o=t,n):o},n.links=function(t){
return arguments.length?(e=t,n):e},n.size=function(t){
return arguments.length?(u=t,n):u},n.layout=function(a){
return o.forEach((function(n){n.sourceLinks=[],n.targetLinks=[]
})),e.forEach((function(n){var t=n.source,r=n.target
;"number"==typeof t&&(t=n.source=o[n.source]),
"number"==typeof r&&(r=n.target=o[n.target]),
t.sourceLinks.push(n),r.targetLinks.push(n)})),o.forEach((function(n){
n.value=Math.max(d3.sum(n.sourceLinks,f),d3.sum(n.targetLinks,f))})),function(){
var n,r=o,e=0;for(;r.length;)n=[],r.forEach((function(r){
r.x=e,r.dx=t,r.sourceLinks.forEach((function(t){n.push(t.target)}))})),r=n,++e
;(function(n){o.forEach((function(t){t.sourceLinks.length||(t.x=n-1)}))
})(e),function(n){o.forEach((function(t){t.x*=n}))}((u[0]-t)/(e-1))
}(),function(n){var t=d3.nest().key((function(n){return n.x
})).sortKeys(d3.ascending).entries(o).map((function(n){return n.values}))
;(function(){var n=d3.min(t,(function(n){return(u[1]-(n.length-1)*r)/d3.sum(n,f)
}));t.forEach((function(t){t.forEach((function(t,r){t.y=r,t.dy=t.value*n}))
})),e.forEach((function(t){t.dy=t.value*n}))})(),y()
;for(var c=1;n>0;--n)s(c*=.99),y(),a(c),y();function a(n){function r(n){
return i(n.source)*n.value}t.forEach((function(t,u){t.forEach((function(t){
if(t.targetLinks.length){var u=d3.sum(t.targetLinks,r)/d3.sum(t.targetLinks,f)
;t.y+=(u-i(t))*n}}))}))}function s(n){function r(n){return i(n.target)*n.value}
t.slice().reverse().forEach((function(t){t.forEach((function(t){
if(t.sourceLinks.length){var u=d3.sum(t.sourceLinks,r)/d3.sum(t.sourceLinks,f)
;t.y+=(u-i(t))*n}}))}))}function y(){t.forEach((function(n){
var t,o,e,c=0,i=n.length;for(n.sort(h),e=0;e<i;++e)(o=c-(t=n[e]).y)>0&&(t.y+=o),
c=t.y+t.dy+r
;if((o=c-r-u[1])>0)for(c=t.y-=o,e=i-2;e>=0;--e)(o=(t=n[e]).y+t.dy+r-c)>0&&(t.y-=o),
c=t.y}))}function h(n,t){return n.y-t.y}}(a),c(),n},n.relayout=function(){
return c(),n},n.link=function(){var n=.5;function t(t){
var r=t.source.x+t.source.dx,u=t.target.x,o=d3.interpolateNumber(r,u),e=o(n),c=o(1-n),i=t.source.y+t.sy+t.dy/2,f=t.target.y+t.ty+t.dy/2
;return"M"+r+","+i+"C"+e+","+i+" "+c+","+f+" "+u+","+f}
return t.curvature=function(r){return arguments.length?(n=+r,t):n},t},n};