define(["bluebird","../rpc"],(function(t,e){"use strict";return class{
constructor({runtime:t}){this.runtime=t}start(){return!0}stop(){return!0}
pluginHandler(){return t.try((function(){}))}
makeClient({module:t,timeout:n,authenticated:r}){
return r=void 0===r||!!r,new e.RPCClient({runtime:this.runtime,module:t,
timeout:n,authenticated:r})}}}));