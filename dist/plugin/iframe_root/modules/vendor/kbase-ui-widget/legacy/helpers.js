define(["jquery","kb_common/html"],(function(n,i){"use strict"
;n.fn.rmLoading=function(){n(this).find(".loader").remove()
},n.fn.loading=function(o,t){var a=i.tag("div")
;return n(this).rmLoading(),n(this).append(a({class:"loader"
},i.loading(o))),this}}));