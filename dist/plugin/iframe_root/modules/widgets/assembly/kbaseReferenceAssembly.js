define(["jquery","widgets/assembly/kbaseSingleObjectBasicWidget"],(function(e){
"use strict";e.KBWidget({name:"kbaseReferenceAssembly",
parent:"kbaseSingleObjectBasicWidget",version:"1.0.1",getDataModel:function(e){
var a={
description:"This data object is a reference to a reference assembly that can be used when assembling reads",
items:[]};return e.reference_name&&a.items.push({name:"Reference name",
value:e.reference_name}),e.handle&&a.items.push({name:"Source file name",
value:e.handle.file_name}),a}})}));