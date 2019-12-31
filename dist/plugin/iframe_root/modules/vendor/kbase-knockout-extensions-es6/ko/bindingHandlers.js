define(["knockout","numeral","moment","marked","kb_lib/time"],(function(e,n,t,a,i){
"use strict";function u(e){let n,t=e.getMinutes()
;return t<10&&(t="0"+t),n=e.getHours()>=12?12!==e.getHours()?e.getHours()-12+":"+t+"pm":"12:"+t+"pm":e.getHours()+":"+t+"am",
n}function o(e,n){let t=""
;(new Date).getFullYear()!==e.getFullYear()&&(t=", "+e.getFullYear());let a=""
;return n&&n.showDay&&(a=i.shortDays[e.getDay()]+" "),
a+i.shortMonths[e.getMonth()]+" "+e.getDate()+t}e.bindingHandlers.htmlMarkdown={
update:function(n,t){const i=e.unwrap(t())||"";n.innerHTML=a(i)}
},e.bindingHandlers.markdown={init:function(n,t){const i=e.unwrap(t())||""
;n.innerHTML=a(i)},update:function(n,t){const i=e.unwrap(t())||""
;n.innerHTML=a(i)}},e.bindingHandlers.numberText={update:function(t,a,i){
const u=a(),o=e.unwrap(u),r=i.get("numberFormat")||"",s=n(o).format(r)
;t.innerText=s}},e.bindingHandlers.focus={init:function(e,n){
n().focusser.setElement(e)}},e.bindingHandlers.typedText={update:function(a,r){
const s=r();let l;const c=s.format,d=s.type,f=s.missing||"",p=s.default;let g
;switch(d){case"number":
n.nullFormat(""),l=e.unwrap(s.value),g=null==l?f:n(l).format(c);break
;case"date":if(l=e.unwrap(s.value),null==l)g=f;else switch(c){case"elapsed":
case"nice-elapsed":g=i.niceElapsedTime(t(l).toDate());break;case"duration":
g=function(e,n){n=n||{};const t=[];let a=Math.abs(e);const i=[{
unit:"millisecond",short:"ms",single:"m",size:1e3},{unit:"second",short:"sec",
single:"s",size:60},{unit:"minute",short:"min",single:"m",size:60},{unit:"hour",
short:"hr",single:"h",size:24},{unit:"day",short:"day",single:"d",size:30
}].map((function(e){const n=a%e.size;return a=(a-n)/e.size,{name:e.single,
unit:e.unit,value:n}})).reverse();i.pop();let u=!1
;for(let o=0;o<i.length;o+=1)if(u){
if(t.push(i[o]),n.resolution&&n.resolution===i[o].unit)break
}else i[o].value>0&&(u=!0,t.push(i[o]))
;return 0===t.length?"<1s":t.map((function(e){return String(e.value)+e.name
})).join(" ")}(l);break;default:g=t(l).format(c)}break;case"date-range":
var h,m=e.unwrap(s.value.startDate),w=e.unwrap(s.value.endDate)
;if(h=s.value.now?e.unwrap(s.value.now):Date.now(),m)switch(c){case"nice-range":
g=function(e,n,t){let a
;if(e)return n?e.getDate()===n.getDate()?(a=e.getTime()===n.getTime()?" at "+u(e):" from "+u(e)+" to "+u(n),
o(e,t)+a):"from "+o(e,t)+" at "+u(e)+" to "+o(n,t)+" at "+u(n):"from "+o(e,t)+" at "+u(e)
}(t(m).toDate(),t(w).toDate());break;case"nice-relative-range":
g=function(e,n,a){let i,u
;i=null===e||void 0===n?null:t(e).toDate(),u=null==n?null:t(n).toDate()
;const o=a||new Date.now;let r,s,l;if(null===i){
if(null===u)return"happening now, perpetual"
;u.getTime()<o?(s="ended",l="ago",r=u):(s="happening now, ending in ",r=u)
}else if(i.getTime()>o)s="in",r=i;else{
if(null===u)return"happening now, indefinite end"
;u.getTime()<o?(s="ended",l="ago",r=u):(s="happening now, ending in ",r=u)}
const c=Math.round((o-r.getTime())/1e3),d=Math.abs(c);let f;const p=[];let g
;if(0===d)return"now"
;if(d<60)p.push([d,"second"]);else if(d<3600)f=Math.floor(d/60),
p.push([f,"minute"]),g=d-60*f,g>0&&p.push([g,"second"]);else if(d<86400){
f=Math.floor(d/3600);const e=d-3600*f,n=Math.round(e/60)
;60===n?(f+=1,p.push([f,"hour"])):(p.push([f,"hour"]),n>0&&p.push([n,"minute"]))
}else if(d<604800){f=Math.floor(d/86400)
;const e=d-3600*f*24,n=Math.round(e/3600)
;24===n?(f+=1,p.push([f,"day"])):(p.push([f,"day"]),n>0&&p.push([n,"hour"]))
}else f=Math.floor(d/86400),p.push([f,"day"])
;return[s?s+" ":"",p.map(([e,n])=>(1!==e&&(n+="s"),
[e,n].join(" "))).join(", "),l?" "+l:""].join("")}(m,w,h);break;default:
g="invalid format: "+c}else g=f;break;case"bool":case"boolean":
if(l=e.unwrap(s.value),null==l){if(void 0===p){g=f;break}l=p}var b
;b=c?"string"==typeof c?c.split(","):c:["true","false"],g=l?b[0]:b[1];break
;case"text":case"string":default:l=e.unwrap(s.value),g=l}a.innerText=g}}}));