define(["jquery","kb_lib/html","kb_lib/htmlBuilders"],(function(i,n,t){
"use strict";i.fn.rmLoading=function(){i(this).find(".loader").remove()
},i.fn.loading=function(d){var e=n.tag("div")
;return i(this).rmLoading(),i(this).append(e({class:"loader"
},t.loading(d))),this}}));