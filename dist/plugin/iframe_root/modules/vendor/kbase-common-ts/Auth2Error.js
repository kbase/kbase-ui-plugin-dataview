define(["require","exports"],(function(t,e){"use strict"
;Object.defineProperty(e,"__esModule",{value:!0});class r extends Error{
constructor(t){
super(t.message),Object.setPrototypeOf(this,r.prototype),this.name="AuthError",
this.code=t.code,
this.detail=t.detail,this.data=t.data,this.stack=(new Error).stack}}
e.AuthError=r}));