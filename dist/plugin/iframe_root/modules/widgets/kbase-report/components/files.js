define(["knockout","kb_knockout/registry","kb_knockout/lib/generators","kb_knockout/lib/viewModelBase","kb_lib/html"],(function(t,e,n,o,i){
"use strict"
;const a=i.tag,r=a("iframe"),l=a("p"),d=a("a"),s=a("div"),c=a("ul"),m=a("li")
;class u extends o{constructor(t,e){
super(t),self.runtime=e.$root.runtime,this.files=t.files.map((t,e)=>{
const n=t.name||"download-"+e;return{url:t.URL,name:t.name,title:t.name||t.URL,
downloadUrl:this.makeDownloadLink(t.URL,n)}}),this.iframeId=i.genId()}
makeDownloadLink(t,e){const n=t.match(/\/node\/(.+)$/);if(n){var o={id:n[1],
wszip:0,name:e},i=Object.keys(o).map((function(t){
return[t,o[t]].map(encodeURIComponent).join("=")})).join("&")
;return self.runtime.config("services.KBaseDataImport.url")+"/download?"+i}}
doDownload(t){
document.getElementById(this.iframeId).setAttribute("src",t.downloadUrl)}}
function f(){return s(n.if("files && files.length > 0",[r({dataBind:{attr:{
id:"iframeId"}},style:{display:"none"}}),c({style:{},dataBind:{foreach:"files"}
},m([d({dataBind:{attr:{href:"$data.url"},text:"$data.title",
click:"function(d,e){$component.doDownload.call($component,d,e);}"},download:!0,
target:"_blank"})]))],l({style:{fontStyle:"italic"}
},"No file links for this report")))}return e.registerComponent((function(){
return{viewModelWithContext:u,template:f()}}))}));