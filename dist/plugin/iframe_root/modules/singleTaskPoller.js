define([],(function(){"use strict";return function(){var n,t=!1,e={id:null,
timer:null,cancelled:!1},i=0;function l(){t=!1}function o(){(new Date).getTime()
;return n.task().catch((function(n){
console.error((new Date).toLocaleString()+": Error while running task",n)}))}
function r(){t&&(e.timer||((e={timer:null,id:i+=1,cancelled:!1
}).timer=window.setTimeout((function(){var t=e
;t.cancelled&&console.warn("poll cancelled! "+t.id),
!n.doContinue||n.doContinue()?o().finally((function(){t.timer=null,r()})):l()
}),n.interval)))}function u(){
e.timer&&(window.clearTimeout(e.timer),e.timer=null,e.cancelled=!0)}return{
start:function(e){if((n=e).lastRun=null,t=!0,n.runInitially){
if(n.doContinue&&!n.doContinue())return void l();o().then((function(){r()}))
}else r()},stop:l,force:function(){t?u():t=!0,o().then((function(){r()}))},
update:function(e){
e.interval&&e.interval!==n.interval&&(n.interval=e.interval,t?u():t=!0,r())}}}
}));