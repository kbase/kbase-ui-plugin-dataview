define(["knockout","kb_lib/html","../registry","../lib/clock"],(function(t,e,n,r){
"use strict"
;const i=e.tag,a=i("span"),o=i("div"),s=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
;class u{constructor(e){
this.startTime=t.utils.unwrapObservable(e.startTime),this.currentTime=t.observable(),
this.listener=r.globalClock.listen(()=>{this.currentTime(new Date)
},1),this.elapsed=t.pureComputed(()=>this.startTime?function(t,e){let n,r
;n="string"==typeof t?new Date(t):"number"==typeof t?new Date(t):t,
r=void 0===e?new Date:"string"==typeof e?new Date(e):"number"==typeof e?new Date(e):e
;const i=Math.round((r.getTime()-n.getTime())/1e3),a=Math.abs(i);if(a<604800){
if(0===a)return"now";let t,e,n
;a<60?(t=i,e=a,n="second"):a<3600?(t=Math.round(i/60),
e=Math.round(a/60),n="minute"):a<86400?(t=Math.round(i/3600),
e=Math.round(a/3600),
n="hour"):a<604800&&(t=Math.round(i/86400),e=Math.round(a/86400),
n="day"),e>1&&(n+="s");let r=null,o=null
;return t<0?r="in":t>0&&(o="ago"),(r?r+" ":"")+e+" "+n+(o?" "+o:"")}
return r.getFullYear()===n.getFullYear()?s[n.getMonth()]+" "+n.getDate():s[n.getMonth()]+" "+n.getDate()+", "+n.getFullYear()
}(this.startTime,this.currentTime()):"n/a")}dispose(){
this.listener&&r.globalClock.forget(this.listener)}}
return n.registerComponent((function(){return{viewModel:u,template:o([a({
dataBind:{text:"elapsed"}})])}}))}));