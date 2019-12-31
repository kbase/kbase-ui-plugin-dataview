define([],(function(){"use strict";function r(r){
const e=/^([\d]+)\.([\d]+)\.([\d]+)(?:-(.*))?$/.exec(r)
;if(!e)throw new Error("Not a semver string: "+r);const[,t,n,o,i]=e
;return[parseInt(t,10),parseInt(n,10),parseInt(o,10),i]}return{parseSemver:r,
semverIsAtLeast:function(e,t){const[n,o,i,s]=r(e),[a,u,f,c]=r(t)
;if(a!==n)return"major-incompatible";if(u>o)return"minor-too-low"
;if(u===o&&f>i)return"patch-too-low";if(f===i){if(!s)return!0
;if(!c)return"prerelease-makes-patch-too-low";if(c>s)return"prerelease-too-low"}
return!0}}}));