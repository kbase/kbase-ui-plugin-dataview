jQuery.KBWidget({name:"kbaseSingleEndLibrary",
parent:"kbaseSingleObjectBasicWidget",version:"1.0.1",getDataModel:function(e){
var a={
description:"This data object is a reference to a single end read library",
items:[]};return e.handle&&a.items.push({name:"Source file name",
value:e.handle.file_name}),a}});