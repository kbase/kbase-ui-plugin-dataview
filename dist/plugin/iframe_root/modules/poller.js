define(["bluebird"],(function(t){"use strict";function e(e){
var n,r={},a=e.interval||5e3,u=0;return{addTask:function(e){var o=String(u+=1)
;r[o]={started:(new Date).getTime(),timeout:e.timeout,task:e,status:"new"
},function e(){if(n)return;n=window.setTimeout((function(){n=null,function(){
var e=Object.keys(r);return t.all(e.map((function(e){
var n=r[e],a=(new Date).getTime()-n.started;return t.try((function(){
return t.all([n,t.resolve(n.task.isCompleted(a)).reflect()])}))
}))).then((function(e){return t.all(e.map((function(e){
var n=e[0],r=e[1],a=(new Date).getTime()-n.started
;return r.isFulfilled()?r.value()?(n.status="completed",
t.all([n,t.resolve(n.task.whenCompleted()).reflect()])):a>n.timeout?(n.status="timedout",
t.all([n,t.resolve(n.task.whenTimedOut(a))])):(n.status="notready",
t.all([n,!1])):(n.status="error",
t.all([n,t.resolve(n.task.whenError(r.reason())).reflect()]))})))
})).then((function(t){var e=t.filter((function(t){var e=t[0]
;return"completed"!==e.status&&"error"!==e.status&&"timedout"!==e.status}))
;return r=e.map((function(t){return t[0]}))})).catch((function(t){
console.error("ERROR in task runner"),console.error(t)}))}().then((function(t){
return 0!==(r=t).length})).then((function(t){t&&e()}))}),a)}()},
removeTask:function(t){delete r[t]},cancelAllTasks:function(){
Object.keys(r).forEach((function(t){!function(t){var e=r[t]
;if(e.task.onCancel)try{e.task.onCancel()}catch(n){
console.error("ERROR cancelling task",n)}}(t)}))}}}return{make:function(t){
return e(t)}}}));