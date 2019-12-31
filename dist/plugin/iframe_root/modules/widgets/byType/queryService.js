define(["bluebird","kb_lib/jsonRpc/genericClient","kb_lib/jsonRpc/dynamicServiceClient"],(function(r,e,n){
"use strict";return function(t){var o=t.runtime;function u(t,u,i){switch(t){
case"workspace":return function(r,n){var t,u,i
;if(r.ref&&n.data&&(u="get_object_subset",t=[{ref:r.ref,
included:Object.keys(n.data)}],i=function(r){return r[0].data
}),!u)throw console.error("workspace query",r,n),
new Error("There is no way to satisfy this workspace query");return new e({
module:"Workspace",url:o.config("services.workspace.url"),
token:o.service("session").getAuthToken()
}).callFunc(u,[t]).spread(i).catch((function(e){
throw console.error("Error running workspace query",r,n,e),
new Error("Error running workspace query")}))}(u,i);default:
return function(e,t,u){var i={assembly:{module:"AssemblyAPI",fields:{stats:{
method:"get_stats",args:["ref"]},contig_ids:{method:"get_contig_ids",
args:["ref"]},contig_lengths:{method:"get_contig_lengths",
args:["ref","contig_id_list"]},contig_gc_content:{
method:"get_contig_gc_content",args:["ref","contig_id_list"]}}}}[e]
;if(!i)throw new Error("Could not map subject "+e+" to module")
;var c=Object.keys(u).map((function(r){var e=i.fields[r]
;if(!e)throw new Error("No method mapping for output property "+r)
;var n=e.args.map((function(r){return t[r]||null})),o=u[r];return{outputKey:r,
method:e.method,args:n,outputFields:o}})),s=new n({
url:o.config("services.service_wizard.url"),
token:o.service("session").getAuthToken(),module:i.module})
;return r.all(c.map((function(r){
return s.callFunc(r.method,r.args).then((function(e){var n=e[0]
;if(n instanceof Array){var t=r.outputFields._range;if(t){if("all"===t)return n
;throw console.error("range is not yet supported."),
new Error("Range is not yet supported for array fields")}return n}
var o=Object.keys(r.outputFields);if(0===o.length)return n;var u={}
;return o.forEach((function(r){u[r]=n[r]||null})),u})).catch((function(r){
throw console.error("Error running dynamic service query",e,t,u,r),
new Error("Error running dynamic service query for "+e+": "+r.message)}))
}))).then((function(r){var e={};return r.forEach((function(r,n){
e[c[n].outputKey]=r})),e}))}(t,u,i)}}return{query:function(e){
var n=Object.keys(e);return r.all(n.map((function(r){var n=e[r],t=n._args
;return delete n._args,u(r,t,n)}))).then((function(r){var e={}
;return r.forEach((function(r,t){var o=n[t];e[o]=r})),e}))}}}}));