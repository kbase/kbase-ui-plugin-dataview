define(["knockout","../../registry","../../lib/generators","../../lib/viewModelBase","kb_lib/html"],(function(e,t,s,a,i){
"use strict";const l=(0,i.tag)("div");class n extends a{constructor(e){super(e)
;const{type:t="default",message:s}=e;this.alertClass="alert-"+t,this.message=s}}
return t.registerComponent((function(){return{viewModel:n,template:l({
class:"alert",style:{margin:"40px auto 0 auto",maxWidth:"40em",padding:"20px"},
dataBind:{class:"alertClass"}},l({dataBind:{html:"message"}}))}}))}));