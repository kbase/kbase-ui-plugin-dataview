(function(){this.standaloneTable={about:{name:"table",title:"Table",
author:"Tobias Paczian",version:"1.0",requires:[],defaults:{width:null,
height:null,rows_per_page:10,sortcol:0,sorted:!1,offset:0,invisible_columns:{},
disable_sort:{},sortdir:"asc",sorttype:{},filter_autodetect:!1,
filter_autodetect_select_max:10,sort_autodetect:!1,filter:{},hide_options:!1,
filter_changed:!1,editable:{},edit_callback:null,navigation_callback:null,
navigation_url:null,target:"table_space",synchronous:!0,query_type:"infix",
asynch_column_mapping:null},options:[{general:[{name:"editable",type:"bool",
description:"can cell data be edited?",title:"editable"},{
name:"filter_autodetect",type:"bool",
description:"should all columns have an auto detected filter?",
title:"filter autodetection"}]},{layout:[{name:"width",type:"int",
description:"width of the table in pixel",title:"width"},{name:"height",
type:"int",description:"height of the table in pixel",title:"height"},{
name:"rows_per_page",type:"int",description:"number of rows diplayed per page",
title:"rows per page"}]}]},create:function(e){
window.hasOwnProperty("rendererTable")||(window.rendererTable=[]);var t={
settings:{},index:e.index}
;return jQuery.extend(!0,t,this),jQuery.extend(!0,t.settings,this.about.defaults,e),
window.rendererTable.push(t),t},importDataFromDiv:function(e,t){
rendererTable[e].settings.data=JSON.parse(document.getElementById(t).innerHTML)
},exampleData:function(){return{
data:[["a1","b1","c1"],["a3","b2","c2"],["a4","b3","c3"],["a2","b4","c4"],["a1","b1","c1"],["a3","b2","c2"],["a4","b3","c3"],["a2","b4","c4"],["a1","b1","c1"],["a3","b2","c2"],["a4","b3","c3"],["a2","b4","c4"],["a1","b3","c1"],["a3","b2","c2"],["a4","b3","c3"],["a2","b4","c4"],["a5","b5","c5"]],
header:["column A","column B","column C"]}},update_visible_columns:function(e){
for(var t=rendererTable[e],n=document.getElementById("table_colsel_table_"+e).firstChild.childNodes,i={},s=0;s<n.length;s++)n[s].firstChild.firstChild.checked||(i[s]=1)
;t.settings.invisible_columns=i,t.render(e)},render:function(e){
var t,n=rendererTable[e]
;n.settings.target.innerHTML="",0==n.settings.synchronous&&(n.settings.target.innerHTML='<div style="position: absolute; width: 100%; height: 100%; opacity: 0.7; background-color: white; display: none;"></div>'),
n.settings.data.length&&(n.settings.data={header:n.settings.data[0],
data:n.settings.data
},n.settings.data.data.shift()),n.settings.header?t=n.settings.header:(t=n.settings.data.header,
n.settings.data.header||(t=n.settings.data.data.shift()),
n.settings.header=t,n.settings.data.header=null);var i=[]
;if(n.settings.tdata)i=n.settings.tdata;else{
for(var s=0;s<n.settings.data.data.length;s++){i[i.length]={}
;for(var r=0;r<n.settings.data.data[s].length;r++)i[i.length-1][t[r]]=n.settings.data.data[s][r]||""
}n.settings.tdata=i,n.settings.data.data=null}
if(n.settings.sort_autodetect)for(s=0;s<t.length;s++)if(!n.settings.sorttype[s])if(i[0]&&"function"==typeof i[0][t[s]].replace){
var a=i[0][t[s]].replace(/<(.|\n)*?>/g,"")
;isNaN(parseFloat(a))?n.settings.sorttype[s]="string":n.settings.sorttype[s]="number"
}else n.settings.sorttype[s]="number";var l=n.settings.filter,o=!1
;for(var s in l)if(l.hasOwnProperty(s)&&l[s].hasOwnProperty("searchword")&&l[s].searchword.length>0){
o=!0;break}if(o&&n.settings.synchronous){var d=[];if(n.settings.filter_changed){
for(var s in n.settings.offset=0,l){var c
;c=l[s].case_sensitive?new RegExp(l[s].searchword):new RegExp(l[s].searchword,"i"),
l[s].re=c,
void 0!==l[s].searchword&&l[s].searchword.length>0&&l[s].operator&&"><"==l[s].operator[l[s].active_operator]&&(l[s].minmax=l[s].searchword.split(","),
2!=l[s].minmax.length&&(alert("'"+l[s].searchword+"' is not a valid inclusive range.\nRanges must be noted as the minimum\nand the maximum range, separated by ','\ni.e. '-2.1, 5.2'"),
l[s].searchword=""))}var p=new RegExp("<.+?>","ig");for(r=0;r<i.length;r++){
var g=1;for(var s in l){var h=i[r][t[s]]+""
;if(l[s].keepHTML||(h=h.replace(p,"")),
void 0!==l[s].searchword&&l[s].searchword.length>0){
if(l[s].operator)switch(l[s].operator[l[s].active_operator]){case"=":
h!=l[s].searchword&&(g=0);break;case">":
parseFloat(h)<=parseFloat(l[s].searchword)&&(g=0);break;case"<":
parseFloat(h)>=parseFloat(l[s].searchword)&&(g=0);break;case"><":
(parseFloat(h)>parseFloat(l[s].minmax[1])||parseFloat(h)<parseFloat(l[s].minmax[0]))&&(g=0)
}else h.match(l[s].re)||(g=0);if(0==g)break}}g&&d.push(i[r])}
}else d=n.settings.filtered_data
;n.settings.filter_changed=!1,n.settings.filtered_data=d,i=d}
var u=n.settings.offset,f=n.settings.rows_per_page<0?i.length:n.settings.rows_per_page,b=n.settings.sortcol,v=n.settings.sortdir,m=n.settings.sorttype,y=n.settings.target
;n.settings.width&&n.settings.width;n.settings.height&&n.settings.height
;var x=document.createElement("table")
;x.setAttribute("class","table table-striped table-bordered table-condensed"),
x.setAttribute("style","margin-bottom: 2px; margin-top: 7px;")
;var w=document.createElement("thead"),_=document.createElement("tr")
;_.setAttribute("style","height: 30px; border-top: 1px solid lightgray;")
;for(s=0;s<t.length;s++)if(!n.settings.invisible_columns[s]){
var k=document.createElement("i")
;k.setAttribute("class","fa fa-chevron-down"),k.setAttribute("title","sort ascending")
;var A,E=document.createElement("i")
;if(E.setAttribute("class","fa fa-chevron-up"),
E.setAttribute("title","sort descending"),
s==b?"asc"==v?(k.setAttribute("class","fa fa-chevron-circle-down"),
k.setAttribute("title","current sorting: ascending"),
k.setAttribute("style","padding-left: 1px"),
E.setAttribute("style","cursor: pointer;"),E.i=s,E.index=e,E.onclick=function(){
var e=this.index,t=rendererTable[e]
;t.settings.sortcol=this.i,t.settings.sortdir="desc",
"function"==typeof t.settings.navigation_callback?t.settings.navigation_callback({
sort:t.settings.header[this.i],dir:"desc"},e):(t.settings.sorted=!1,t.render(e))
}):(E.setAttribute("class","fa fa-chevron-circle-up"),
E.setAttribute("title","current sorting: descending"),
E.setAttribute("style","padding-left: 1px"),
k.setAttribute("style","cursor: pointer;"),k.i=s,k.index=e,k.onclick=function(){
var e=this.index,t=rendererTable[e]
;t.settings.sortcol=this.i,t.settings.sortdir="asc",
"function"==typeof t.settings.navigation_callback?t.settings.navigation_callback({
sort:t.settings.header[this.i],dir:"asc"},e):(t.settings.sorted=!1,t.render(e))
}):(k.setAttribute("style","cursor: pointer;"),
k.i=s,k.index=e,k.onclick=function(){var e=this.index,t=rendererTable[e]
;t.settings.sortcol=this.i,
t.settings.sortdir="asc","function"==typeof t.settings.navigation_callback?t.settings.navigation_callback({
sort:t.settings.header[this.i],dir:"asc"},e):(t.settings.sorted=!1,t.render(e))
},
E.setAttribute("style","cursor: pointer;"),E.i=s,E.index=e,E.onclick=function(){
var e=this.index,t=rendererTable[e]
;t.settings.sortcol=this.i,t.settings.sortdir="desc",
"function"==typeof t.settings.navigation_callback?t.settings.navigation_callback({
sort:t.settings.header[this.i],dir:"desc"},e):(t.settings.sorted=!1,t.render(e))
}),n.settings.filter_autodetect&&!n.settings.filter[s]){n.settings.filter[s]={
type:"text"
},"number"==n.settings.sorttype[s]&&(n.settings.filter[s].operator=["=","<",">","><"],
n.settings.filter[s].active_operator=0);var T=[],C=0
;for(r=0;r<i.length;r++)T[i[r][t[s]]]||C++,T[i[r][t[s]]]=1
;C<=n.settings.filter_autodetect_select_max&&(n.settings.filter[s].type="select")
}
if(n.settings.filter[s])if(n.settings.filter[s].searchword||(n.settings.filter[s].searchword=""),
"text"==n.settings.filter[s].type){var N=document.createElement("input")
;if(N.setAttribute("type","text"),
N.value=l[s].searchword,N.setAttribute("style","margin-bottom: 0px; margin-top: 2px; height: 16px; width: 100px; display: none; position: absolute; z-index: 100;"),
N.i=s,N.index=e,N.onkeypress=function(e){var t=this.index,n=rendererTable[t]
;if(13==(e=e||window.event).keyCode)if(n.settings.filter[this.i].searchword=this.value,
"function"==typeof n.settings.navigation_callback){var i=[]
;for(var s in n.settings.filter)n.settings.filter.hasOwnProperty(s)&&n.settings.filter[s].hasOwnProperty("searchword")&&n.settings.filter[s].searchword.length>0&&i.push({
searchword:n.settings.filter[s].searchword,field:n.settings.header[s],
comparison:n.settings.filter[s].operator||"="});n.settings.navigation_callback({
query:i},t)}else n.settings.filter_changed=!0,n.render(t)
},n.settings.filter[s].operator){
(A=document.createElement("div")).setAttribute("style","float: left; margin-bottom: 0px; display: none; position: absolute; margin-top: 2px; height: 16px; z-index: 100;"),
A.className="input-prepend";var L=document.createElement("span")
;L.setAttribute("style","cursor: pointer; height: 16px;"),
L.i=s,L.index=e,L.onclick=function(){
for(var e=this.index,t=rendererTable[e],n=0;n<this.childNodes.length;n++)""==this.childNodes[n].style.display&&(this.childNodes[n].style.display="none",
n==this.childNodes.length-1?(this.childNodes[0].style.display="",
t.settings.filter[this.i].active_operator=0):(this.childNodes[n+1].style.display="",
n++,t.settings.filter[this.i].active_operator=n))},L.className="add-on"
;for(r=0;r<n.settings.filter[s].operator.length;r++){
var H=document.createElement("span")
;H.innerHTML=n.settings.filter[s].operator[r],
r==n.settings.filter[s].active_operator?H.setAttribute("style","font-weight: bold; height: 16px;"):H.setAttribute("style","display: none; font-weight: bold; height: 16px;"),
H.setAttribute("title","click to switch filter operator"),L.appendChild(H)}
N.setAttribute("style","position: relative; left: -3px; width: 80px; height: 16px;"),
A.appendChild(L),A.appendChild(N)}else A=N
}else if("select"==n.settings.filter[s].type){
(A=document.createElement("select")).setAttribute("style","position: absolute; height: 26px; margin-bottom: 0px; margin-top: 2px; z-index: 100; display: none;"),
A.add(new Option("-show all-",""),null)
;for(T=[],r=0;r<i.length;r++)i[r][t[s]].length&&(T[i[r][t[s]]]=1)
;for(var r in T)"function"!=typeof T[r]&&(r==n.settings.filter[s].searchword?A.add(new Option(r,r,!0),null):A.add(new Option(r,r),null))
;A.i=s,A.index=e,A.onchange=function(){var e=this.index,t=rendererTable[e]
;t.settings.filter[this.i].searchword=this.options[this.selectedIndex].value,
t.settings.filter_changed=!0,t.render(e)
},1==A.options.length&&(A=document.createElement("span"))
}else if("premade-select"==n.settings.filter[s].type){
(A=document.createElement("select")).setAttribute("style","position: absolute; height: 26px; margin-bottom: 0px; margin-top: 2px; z-index: 100; display: none;")
;for(var M=0;M<n.settings.filter[s].options.length;M++)n.settings.filter[s].options[M].value==n.settings.filter[s].searchword?A.add(new Option(n.settings.filter[s].options[M].text,n.settings.filter[s].options[M].value,!0),null):A.add(new Option(n.settings.filter[s].options[M].text,n.settings.filter[s].options[M].value),null)
;A.i=s,A.index=e,A.onchange=function(){var e=this.index,t=rendererTable[e]
;if(t.settings.filter[this.i].searchword=this.options[this.selectedIndex].value,
"function"==typeof t.settings.navigation_callback){var n=[]
;for(var i in t.settings.filter)t.settings.filter.hasOwnProperty(i)&&t.settings.filter[i].hasOwnProperty("searchword")&&t.settings.filter[i].searchword.length>0&&n.push({
searchword:t.settings.filter[i].searchword,field:t.settings.header[i],
comparison:t.settings.filter[i].operator||"="});t.settings.navigation_callback({
query:n},e)}else t.settings.filter_changed=!0,t.render(e)
},1==A.options.length&&(A=document.createElement("span"))}
var F=document.createElement("table")
;F.setAttribute("style","float: right; margin: 0px; border: none;")
;var O=document.createElement("tr");O.setAttribute("style","border: none;")
;var I=document.createElement("td")
;I.setAttribute("style","padding: 0px 2px; line-height: 0px; border: none;")
;var P=document.createElement("tr");P.setAttribute("style","border: none;")
;var S=document.createElement("td")
;S.setAttribute("style","padding: 0px 2px; line-height: 0px; border: none;"),
I.appendChild(E),
S.appendChild(k),O.appendChild(I),P.appendChild(S),F.appendChild(O),
F.appendChild(P);var q=document.createElement("th"),z=1
;n.settings.minwidths&&n.settings.minwidths[s]&&(z=n.settings.minwidths[s]),
q.setAttribute("style","padding: 0px; padding-left: 4px; min-width: "+z+"px;")
;var B=document.createElement("div")
;if(B.setAttribute("style","float: left; position: relative; height: 25px;"),
B.innerHTML=t[s],q.appendChild(B),n.settings.disable_sort[s]||(q.appendChild(F),
B.style.top="4px"),l[s]){var R=document.createElement("i")
;R.className="fa fa-search";var D=""
;l[s].searchword&&(D=" border: 1px solid blue;",
R.setAttribute("title","filtered for: '"+l[s].searchword+"'"));var j="3"
;n.settings.disable_sort[s]||(j="7"),
R.setAttribute("style","float: right; position: relative; top: "+j+"px; cursor: pointer; right: 2px;"+D),
R.onclick=function(){
""==this.nextSibling.style.display?(this.nextSibling.style.display="none",
this.parentNode.firstChild.style.display=""):(this.nextSibling.style.display="",
this.parentNode.firstChild.style.display="none")
},q.appendChild(R),q.appendChild(A)}_.appendChild(q)}
w.appendChild(_),x.appendChild(w);var Q,J=document.createElement("tbody")
;n.settings.sorted?Q=i:(Q=i.sort((function(e,n){if("desc"==v){var i=e;e=n,n=i}
if(!m[b])return"function"!=typeof e[t[b]].replace||"function"!=typeof n[t[b]].replace?e[t[b]]==n[t[b]]?0:e[t[b]]<n[t[b]]?-1:1:e[t[b]].replace(/<(.|\n)*?>/g,"")==n[t[b]].replace(/<(.|\n)*?>/g,"")?0:e[t[b]].replace(/<(.|\n)*?>/g,"")<n[t[b]].replace(/<(.|\n)*?>/g,"")?-1:1
;switch(m[b]){case"number":
if("function"!=typeof e[t[b]].replace||"function"!=typeof n[t[b]].replace){
if(e[t[b]]==n[t[b]])return 0;if(e[t[b]]<n[t[b]])return-1}else{
if(parseFloat(e[t[b]].replace(/<(.|\n)*?>/g,""))==parseFloat(n[t[b]].replace(/<(.|\n)*?>/g,"")))return 0
;if(parseFloat(e[t[b]].replace(/<(.|\n)*?>/g,""))<parseFloat(n[t[b]].replace(/<(.|\n)*?>/g,"")))return-1
}return 1;case"string":
return e[t[b]].replace(/<(.|\n)*?>/g,"")==n[t[b]].replace(/<(.|\n)*?>/g,"")?0:e[t[b]].replace(/<(.|\n)*?>/g,"")<n[t[b]].replace(/<(.|\n)*?>/g,"")?-1:1
}})),n.settings.sorted=!0),n.settings.synchronous&&(Q=Q.slice(u,u+f))
;for(s=0;s<Q.length;s++){var K=document.createElement("tr")
;for(r=0;r<t.length;r++)if(!n.settings.invisible_columns[r]){
var G=document.createElement("td")
;G.innerHTML=Q[s][t[r]],n.settings.editable[r]&&(G.index=e,
G.addEventListener("click",(function(e){
for(var i,s,r=this.index,a=(e=e||window.event).originalTarget||e.srcElement,l=0;l<a.parentNode.children.length;l++)a.parentNode.children[l]==a&&(s=l)
;for(var o=0;o<a.parentNode.parentNode.children.length;o++)if(a.parentNode.parentNode.children[o]==a.parentNode){
i=o+u;break}var d=document.createElement("input");d.setAttribute("type","text"),
d.setAttribute("value",n.settings.tdata[i][t[s]]),
d.index=r,d.addEventListener("keypress",(function(e){
var n=this.index,r=rendererTable[n]
;13==(e=e||window.event).keyCode&&(r.settings.tdata[i][t[s]]=d.value,
r.settings.edit_callback&&"function"==typeof r.settings.edit_callback&&r.settings.edit_callback.call(r.settings.tdata),
r.render(n))})),d.index=r,d.addEventListener("blur",(function(){var e=this.index
;rendererTable[e].render(e)
})),a.innerHTML="",a.appendChild(d),d.focus(),"number"==typeof d.selectionStart?(d.selectionStart=0,
d.selectionEnd=d.value.length):void 0!==document.selection&&(document.selection.createRange().text=d.value)
}))),K.appendChild(G)}J.appendChild(K)}x.appendChild(J)
;var U=document.createElement("td")
;if(U.setAttribute("style","text-align: left; width: 45px; border: none;"),
U.innerHTML="&nbsp;",u>0){var V=document.createElement("i")
;V.setAttribute("class","fa fa-fast-backward"),
V.setAttribute("title","first"),V.setAttribute("style","cursor: pointer;"),
V.index=e,
V.onclick="function"==typeof n.settings.navigation_callback?function(){
var e=this.index;rendererTable[e].settings.navigation_callback("first",e)
}:function(){var e=this.index,t=rendererTable[e];t.settings.offset=0,t.render(e)
};var W=document.createElement("i")
;W.setAttribute("class","fa fa-backward"),W.setAttribute("title","previous"),
W.setAttribute("style","cursor: pointer; margin-left: 5px;"),
W.index=e,W.onclick="function"==typeof n.settings.navigation_callback?function(){
var e=this.index;rendererTable[e].settings.navigation_callback("previous",e)
}:function(){var e=this.index,t=rendererTable[e]
;t.settings.offset-=f,t.settings.offset<0&&(t.settings.offset=0),t.render(e)
},U.appendChild(V),U.appendChild(W)}var X=document.createElement("td")
;if(X.setAttribute("style","text-align: right; width: 45px; border: none;"),
X.innerHTML="&nbsp;",u+f<(n.settings.numrows||i.length)){
var Y=document.createElement("i")
;Y.setAttribute("class","fa fa-fast-forward"),Y.setAttribute("title","last"),
Y.setAttribute("style","cursor: pointer;"),
Y.index=e,Y.onclick="function"==typeof n.settings.navigation_callback?function(){
var e=this.index;rendererTable[e].settings.navigation_callback("last",e)
}:function(){var e=this.index,t=rendererTable[e]
;t.settings.offset=i.length-f,t.settings.offset<0&&(t.settings.offset=0),
t.render(e)};var Z=document.createElement("i")
;Z.setAttribute("class","fa fa-forward"),
Z.setAttribute("title","next"),Z.setAttribute("style","cursor: pointer; margin-right: 5px;"),
Z.index=e,
Z.onclick="function"==typeof n.settings.navigation_callback?function(){
var e=this.index;rendererTable[e].settings.navigation_callback("next",e)
}:function(){var e=this.index,t=rendererTable[e]
;t.settings.offset+=f,t.settings.offset>i.length-1&&(t.settings.offset=i.length-f,
t.settings.offset<0&&(t.settings.offset=0)),t.render(e)
},X.appendChild(Z),X.appendChild(Y)}var $=document.createElement("td")
;$.setAttribute("style","text-align: center; border: none;"),
$.innerHTML="showing rows "+((n.settings.offset||u)+1)+"-"+(Q.length+(n.settings.offset||u))+" of "+(n.settings.numrows||i.length)
;var ee=document.createElement("table")
;ee.setAttribute("style","width: 100%; border: none;")
;var te=document.createElement("tr")
;te.setAttribute("style","border: none;"),te.appendChild(U),
te.appendChild($),te.appendChild(X),ee.appendChild(te)
;var ne=document.createElement("span");ne.innerHTML="goto row "
;var ie=document.createElement("input")
;ie.setAttribute("value",u+1),ie.setAttribute("type","text"),
ie.setAttribute("style","width: 30px; border: 1px solid lightgray; border-radius: 3px;"),
ie.index=e,ie.onkeypress=function(e){var t=this.index,n=rendererTable[t]
;13==(e=e||window.event).keyCode&&("function"==typeof n.settings.navigation_callback?n.settings.navigation_callback({
goto:parseInt(this.value)-1
},t):(n.settings.offset=parseInt(this.value)-1,n.settings.offset<0&&(n.settings.offset=0),
n.settings.offset>f&&(n.settings.offset=f),n.render(t)))}
;var se=document.createElement("input")
;se.setAttribute("type","button"),se.setAttribute("class","btn btn-xs btn-default"),
se.setAttribute("value","clear all filters"),
se.style.marginLeft="10px",se.index=e,se.onclick=function(){
var e=this.index,t=rendererTable[e]
;for(var n in t.settings.filter_changed=!0,t.settings.filter)t.settings.filter[n].searchword=""
;"function"==typeof t.settings.navigation_callback?t.settings.navigation_callback({
goto:0,query:t.settings.default_query||null,sort:t.settings.default_sort||null
},e):(t.settings.sorted=!1,t.render(e))};var re=document.createElement("input")
;re.setAttribute("type","text"),
re.setAttribute("value",f),re.setAttribute("style","width: 30px; border: 1px solid lightgray; border-radius: 3px;"),
re.index=e,re.onkeypress=function(e){var t=this.index,n=rendererTable[t]
;13==(e=e||window.event).keyCode&&("function"==typeof n.settings.navigation_callback?n.settings.navigation_callback({
limit:parseInt(this.value)
},t):(n.settings.offset=0,n.settings.rows_per_page=parseInt(this.value),
n.render(t)))};var ae=document.createElement("span");ae.innerHTML=" show "
;var le=document.createElement("span")
;le.innerHTML=" rows at a time",n.settings.onclick&&(x.index=e,
x.onclick=function(e){
var t=this.index,n=rendererTable[t],i=(e=e||window.event).originalTarget||e.srcElement
;if("TD"==i.nodeName){
for(var s,r,a=[],l=0;l<i.parentNode.children.length;l++)i.parentNode.children[l]==i&&(r=l),
a.push(i.parentNode.children[l].innerHTML)
;for(var o=0;o<i.parentNode.parentNode.children.length;o++)if(i.parentNode.parentNode.children[o]==i.parentNode){
s=o+u;break}var d=i.innerHTML;n.settings.onclick(a,d,s,r)}})
;var oe=document.createElement("span"),de=document.createElement("input")
;de.setAttribute("class","btn btn-xs btn-default"),
de.setAttribute("type","button"),de.setAttribute("value","select columns")
;var ce=document.createElement("div")
;ce.setAttribute("style","position: absolute; left: 528px; min-width: 150px; border: 1px solid #BBB; background-color: white; z-index: 99000; display: none; box-shadow: 4px 4px 4px #666; padding: 2px;"),
de.addEventListener("click",(function(){
"none"==ce.style.display?ce.style.display="":ce.style.display="none"}))
;for(var pe="<input type='button' class='btn btn-xs btn-default' style='float: right;' value='OK' onclick='rendererTable["+e+"].update_visible_columns("+e+");'><table id='table_colsel_table_"+e+"' style='border: none;'>",ge=0;ge<n.settings.header.length;ge++){
var he=" checked"
;n.settings.invisible_columns[ge]&&(he=""),pe+="<tr style='border: none;'><td style='border: none;'><input style='margin-right: 5px;' type='checkbox'"+he+"></td><td style='border: none;'>"+n.settings.header[ge]+"</td></tr>"
}pe+="</table>",ce.innerHTML=pe,oe.appendChild(de),oe.appendChild(ce)
;var ue=document.createElement("div")
;ue.innerHTML="<i class='fa fa-cog'></i>",ue.title="table options, click to show",
ue.className="btn btn-xs btn-default",
ue.setAttribute("style","cursor: pointer;"),ue.onclick=function(){
this.nextSibling.style.display="",this.style.display="none"}
;var fe=document.createElement("div")
;return fe.setAttribute("style","display: none;"),
fe.innerHTML="<div title='close options' onclick='this.parentNode.previousSibling.style.display=\"\";this.parentNode.style.display=\"none\";' style='cursor: pointer; margin-right: 5px;' class='btn btn-xs btn-default'><i class='fa fa-times'></div>",
0==n.settings.hide_options&&(y.appendChild(ue),
y.appendChild(fe),fe.appendChild(ne),
fe.appendChild(ie),fe.appendChild(se),fe.appendChild(ae),
fe.appendChild(re),fe.appendChild(le),
fe.appendChild(oe)),y.appendChild(x),y.appendChild(ee),n}}}).call(this);