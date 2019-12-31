define(["preact"],(function(e){"use strict";const{h:t,Component:a}=e
;return class extends a{constructor(e){super(e),this.message=null}
componentDidMount(){this.setTitle()}setTitle(){switch(this.props.error.code){
case"private-object-no-authorization":
this.props.runtime.send("ui","setTitle","Error : Access Denied - No Authorization")
;break;case"private-object-inadequate-authorization":
this.props.runtime.send("ui","setTitle","Error : Access Denied - Inadequate Authorization")
;break;default:this.props.runtime.send("ui","setTitle","Error")}}
renderDescription(e){switch(e.code){case"private-object-no-authorization":
return t("div",null,t("p",null,["This object is located in a private Narrative. ","This means that you may only access it if you are logged in and have access to the Narrative."]),t("p",null,["In order to access this object you must first log in."]))
;case"private-object-inadequate-authorization":
return t("div",null,t("p",null,["This object is located in a private Narrative. ","This means that you may only access it if you are logged in and have access to the Narrative."]),t("p",null,["You are logged in but do not have access to the Narrative this object is located in."]))
;default:
return e.data.originalError?t("div",null,t("p",null,["The original error message is: ",e.data.originalError.message])):t("div",null,t("p",null,"No additional information available"))
}}renderFooter(e){switch(e.code){case"private-object-no-authorization":
var a=new URL("",window.location.origin);a.hash="login"
;var r=window.parent.location.hash.substr(1),i={original:r,path:r.split("/")}
;return a.searchParams.set("nextrequest",JSON.stringify(i)),
t("div",null,[t("div",null,[t("a",{href:a.toString(),target:"_parent"
},"Log in and try again")]),t("div",null,[t("a",{
href:"https://kbase.us/contact-us",target:"_blank"},"KBase Help")])])
;case"private-object-inadequate-authorization":
return t("div",null,[t("div",null,[t("a",{href:"/narrative/"+e.data.workspaceID,
target:"_blank"
},"Visit the narrative and request access")]),t("div",null,[t("a",{
href:"https://kbase.us/contact-us",target:"_blank"},"KBase Help")])]);default:
return t("div",null,[t("div",null,[t("a",{href:"https://kbase.us/contact-us",
target:"_blank"},"KBase Help")])])}}renderError(e){return t("div",{
className:"panel panel-danger"},[t("div",{className:"panel-heading",style:{
fontWeight:"bold"}},"Error"),t("div",{className:"panel-body"
},[t("p",null,e.message),t("p",{style:{fontWeight:"bold",fontStyle:"italic",
color:"rgba(150, 150, 150)"}},"code: ",e.code),t("p",{style:{fontWeight:"bold",
fontStyle:"italic",color:"rgba(150, 150, 150)"}
},"plugin: ","dataview"),t("hr"),this.renderDescription(e)]),t("div",{
className:"panel-footer"},[t("div",{style:{fontWeight:"bold",
color:"rgba(150, 150, 150)"}},"Resolutions"),this.renderFooter(e)])])}render(){
return this.renderError(this.props.error)}}}));