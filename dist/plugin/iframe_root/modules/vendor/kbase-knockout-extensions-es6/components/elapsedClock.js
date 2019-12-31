define(["knockout","../registry","kb_lib/html","../lib/clock","../lib/viewModelBase"],(function(e,t,i,s,n){
"use strict";const r=i.tag,l=r("span"),o=r("div");class a extends n{
constructor(t){
super(t),this.startTime=e.utils.unwrapObservable(t.startTime),this.startTime instanceof Date&&(this.startTime=this.startTime.getTime()),
this.currentTime=e.observable((new Date).getTime()),
this.listener=s.globalClock.listen(()=>{this.currentTime((new Date).getTime())
},t.updateInterval||1),
this.elapsed=e.pureComputed(()=>this.startTime?function(e,t){t=t||{};const i=[]
;let s=Math.abs(e);const n=[{unit:"millisecond",short:"ms",single:"m",size:1e3
},{unit:"second",short:"sec",single:"s",size:60},{unit:"minute",short:"min",
single:"m",size:60},{unit:"hour",short:"hr",single:"h",size:24},{unit:"day",
short:"day",single:"d",size:30}].map((function(e){const t=s%e.size
;return s=(s-t)/e.size,{name:e.single,unit:e.unit,value:t}})).reverse();n.pop()
;let r=!1;for(let l=0;l<n.length;l+=1)if(r){
if(i.push(n[l]),t.resolution&&t.resolution===n[l].unit)break
}else n[l].value>0&&(r=!0,i.push(n[l]))
;return 0===i.length?"<1s":i.map((function(e){return String(e.value)+e.name
})).join(" ")}(this.currentTime()-this.startTime):"n/a")}dispose(){
this.listener&&s.globalClock.forget(this.listener),super.dispose()}}
return t.registerComponent((function(){return{viewModel:a,template:o([l({
dataBind:{text:"elapsed"}})])}}))}));