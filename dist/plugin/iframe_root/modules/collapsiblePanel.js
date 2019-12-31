define(["kb_common/html"],(function(a){"use strict"
;return function({collapsed:e,icon:l,title:t,content:n}){
const s=a.genId(),i=a.genId(),r=a.genId(),o=a.tag("div"),c=a.tag("h4"),d=a.tag("span")
;return o({class:"panel-group kb-widget",id:s,role:"tablist",
"aria-multiselectable":"true"},[o({class:"panel panel-default"},[o({
class:"panel-heading",role:"tab",id:i},[c({class:"panel-title"},[d({
"data-toggle":"collapse","data-parent":"#"+s,"data-target":"#"+r,
"aria-expanded":"false","aria-controls":r,class:!1===e?"":"collapsed",style:{
cursor:"pointer"}},[d({class:"fa fa-"+l+" fa-rotate-90",style:{
"margin-left":"10px","margin-right":"10px"}}),t])])]),o({
class:"panel-collapse collapse "+(!1===e?"in":""),id:r,role:"tabpanel",
"aria-labelledby":"provHeading"},[o({class:"panel-body"},[n])])])])}}));