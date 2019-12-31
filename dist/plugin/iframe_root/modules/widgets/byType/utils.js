define([],(function(){"use strict";function r(r,e){return r<e?-1:r>e?1:0}
function e(e,o,n){
if(0==e.length)throw new Error("Nx of empty array is undefined");var t={}
;if(void 0===n&&(n=!0),
"boolean"!=typeof n)throw new TypeError("length ("+n+") is not a boolean")
;var i=0;e.forEach((function(r){i+=r}));var f=[]
;o.sort(r),o.forEach((function(r){
if(r<1||r>100)throw new Error("Nx is not defined for x="+r);f.push(i*(r/100))
})),e.sort(r)
;for(var a=e.length,c=0,d=0,u=-1;c<f.length&&a>0;)for(d+=e[a-=1];d>=f[c];)u=d==f[c]&&a>0?n?(e[a]+e[a-1])/2:a-.5:n?1*e[a]:a,
t[o[c]]=u,c+=1;for(;c<f.length;)t[o[c]]=n?1*e[0]:0,c+=1;return t}return{
getRef:function(r){if(r.ref)return r.ref;if(r.workspaceId){
if(!r.objectId)throw new Error("Object id required if workspaceId supplied")
;var e=[r.workspaceId,r.objectId]
;return r.objectVersion&&e.push(r.objectVersion),e.join("/")}
throw new Error("Either a ref property or workspaceId, objectId, and optionally objectVersion required to make a ref")
},nx:e}}));