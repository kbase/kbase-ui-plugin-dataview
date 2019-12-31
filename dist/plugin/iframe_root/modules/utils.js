define(["bluebird","kb_service/utils","kb_service/client/workspace","kb_lib/jsonRpc/genericClient"],(function(e,r,o,t){
"use strict";class n extends Error{constructor({message:e,code:r,data:o}){
super(e),this.code=r,this.data=o}}return{getObjectInfo:function(o,c){
return e.try((function(){const e=c.workspaceId,i=c.objectId,s=c.objectVersion
;if(void 0===e)throw new Error("Workspace id or name is required")
;if(void 0===i)throw new Error("Object id or name is required")
;const a=r.makeWorkspaceObjectRef(e,i,s);return new t({module:"Workspace",
url:o.config("services.Workspace.url"),token:o.service("session").getAuthToken()
}).callFunc("get_object_info_new",[{objects:[{ref:a}],ignoreErrors:0
}]).then(([e])=>r.object_info_to_object(e[0])).catch(r=>{
throw/Anonymous users may not read workspace/.test(r.message)?new n({
message:"Private object without authorization ",
code:"private-object-no-authorization",data:{workspaceID:e}
}):/User .+ may not read workspace/.test(r.message)?new n({
message:"Access denied to this object with reference "+a,
code:"private-object-inadequate-authorization",data:{workspaceID:e}}):new n({
message:"An unknown error occurred while accessing object with reference "+a,
code:"unknown-error",data:{originalError:r}})})}))},getObject:function(t,n){
return e.try((function(){var e=n.workspaceId,c=n.objectId,i=n.objectVersion
;if(void 0===e)throw new Error("Workspace id or name is required")
;if(void 0===c)throw new Error("Object id or name is required")
;var s=r.makeWorkspaceObjectRef(e,c,i)
;return new o(t.config("services.workspace.url"),{
token:t.service("session").getAuthToken()}).get_objects([{ref:s
}]).then((function(e){if(0===e.length)throw new Error("Object not found: "+s)
;if(e.length>1)throw new Error("Too many objects found: "+s+", "+e.length)
;if(null===e[0])throw new Error("Object x not found with reference "+s)
;return e[0]}))}))}}}));