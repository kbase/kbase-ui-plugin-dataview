define(["knockout"],(function(n){"use strict"
;n.subscribable.fn.subscribeChanged=function(n,s){let i=this.peek()
;return this.subscribe((function(c){const t=i;i=c,n.call(s,c,t)}))
},n.subscribable.fn.syncWith=function(n,s,i){const c=this
;return c(n()),c.subscribe((function(s){n(s)}),s,i),n.subscribe((function(n){
c(n)}),s,i),c},n.subscribable.fn.syncFrom=function(n,s,i){const c=this
;return c(n()),n.subscribe((function(n){c(n)}),s,i),c
},n.subscribable.fn.syncTo=function(n,s,i){
return n(this()),this.subscribe((function(s){n(s)}),s,i),this}}));