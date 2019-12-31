define(["knockout","kb_knockout/registry","kb_knockout/lib/generators","kb_knockout/lib/viewModelBase","kb_lib/html"],(function(t,e,o,i,n){
"use strict";const r=(0,n.tag)("div");class a extends i{constructor(t){super(t),
this.summary=t.summary,this.maxHeight=t.summaryHeight}}
return e.registerComponent((function(){return{viewModel:a,template:r({style:{
width:"100%",fontFamily:"Monaco,monospace",fontSize:"9pt",color:"#555",
whiteSpace:"pre-wrap",overflow:"auto",height:"auto"},dataBind:{style:{
"max-height":'maxHeight + "px"'},text:"summary"}})}}))}));