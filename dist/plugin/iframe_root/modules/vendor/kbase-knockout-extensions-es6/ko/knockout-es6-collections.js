define(["knockout"],(function(t){"use strict";const e={mutex:Symbol("Mutex"),
kc:Symbol("Entity Class Instance"),trigger:Symbol("Observable Trigger"),
tm:Symbol("Trigger Mutation Fn"),pm:Symbol("Trigger Propagate Mutation Fn")
},r=t.tasks&&t.tasks.schedule||setTimeout;function s(r,s){
this[e.trigger]=t.observable(0),
this[e.mutex]=!1,this[e.kc]=new r(s),n[r.name].observers.forEach(t=>this[t].peek=(...r)=>this[e.kc][t](...r))
}function i(t,e,r){if(!(this instanceof t))return new t(r);s.call(this,e,r)}
s.prototype={constructor:s,[e.tm]:function(){
this[e.mutex]||(this[e.mutex]=!0,r(this[e.pm].bind(this),0))},[e.pm]:function(){
this[e.mutex]=!1,this[e.trigger](this[e.trigger]()+1)}
},Object.defineProperty(s.prototype,"size",{get:function(){
return this[e.trigger](),this[e.kc].size}});const n={Map:{Ctr:function t(e){
return i.call(this,t,Map,e)},mutators:["set","clear","delete"],
observers:["get","has","values","keys","entries","forEach","valueOf"],
iterFn:"entries"},Set:{Ctr:function t(e){return i.call(this,t,Set,e)},
mutators:["add","clear","delete"],
observers:["entries","values","has","forEach","keys","valueOf"],iterFn:"values"
},WeakMap:{Ctr:function t(e){return i.call(this,t,WeakMap,e)},
mutators:["set","delete","has"],observers:["get","valueOf"]},WeakSet:{
Ctr:function t(e){return i.call(this,t,WeakSet,e)},mutators:["delete","add"],
observers:["has","get","valueOf"]}};Object.keys(n).forEach((function(r){
const i=n[r],o=i.Ctr
;o["@@SYMS"]=e,o.prototype=Object.create(s.prototype),Object.assign(o.prototype,{
subscribe(t,r){return this[e.trigger].subscribe((function(){t.call(r,this)
}),this)},getSubscriptionsCount(){return this[e.trigger].getSubscriptionsCount()
},valueHasMutated(){return this[e.trigger].valueHasMutated()}
}),i.mutators.forEach((function(t){o.prototype[t]=function(){
return this[e.tm](),this[e.kc][t].apply(this[e.kc],arguments)}
})),i.observers.forEach((function(t){o.prototype[t]=function(){
return this[e.trigger](),this[e.kc][t].apply(this[e.kc],arguments)}
})),i.iterFn&&(o.prototype[Symbol.iterator]=function(){
return this[e.kc][i.iterFn]()}),t[r]=o}))}));