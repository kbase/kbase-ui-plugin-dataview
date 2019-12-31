define(["jquery","./widget","./prompt"],(function(t){"use strict";t.KBWidget({
name:"kbaseDeletePrompt",parent:"kbasePrompt",version:"1.0.0",options:{
controls:["cancelButton","okayButton"]},init:function(e){
return this._super(e),t("<div></div>").kbasePrompt({title:"Confirm deletion",
body:"Really delete <strong>"+this.options.name+"</strong>?",
controls:["cancelButton",{name:"Delete",type:"primary",
callback:this.options.callback}]})}})}));