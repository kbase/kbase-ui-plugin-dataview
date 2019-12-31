define(["kb_lib/html","../registry","../lib/viewModelBase"],(function(t,e,o){
"use strict";const i=t.tag,n=i("div"),s=i("button");class d extends o{
constructor(t){super(t),this.title=t.title,this.body=t.body,this.buttons=[{
title:"Close",action:this.doClose}]}doClose(){this.params.onClose()}}
return e.registerComponent((function(){return{viewModel:d,template:n({style:{}
},[n({dataBind:{text:"title"},style:{color:"white",
backgroundColor:"rgba(0,0,0,0.6)",fontSize:"150%",padding:"8px",
borderBottom:"1px green solid"}}),n({dataBind:{text:"body"},style:{
padding:"8px",minHeight:"10em",backgroundColor:"rgba(255,255,255,0.8)"}}),n({
dataBind:{foreach:"buttons"},style:{padding:"8px",textAlign:"right",
backgroundColor:"transparent"}},s({type:"button",class:"btn btn-default",
dataBind:{text:"title",click:"action"}}))])}}))}));