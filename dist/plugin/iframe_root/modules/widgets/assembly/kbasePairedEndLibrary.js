define(["jquery","widgets/assembly/kbaseSingleObjectBasicWidget"],(function(e){
"use strict";e.KBWidget({name:"kbasePairedEndLibrary",
parent:"kbaseSingleObjectBasicWidget",version:"1.0.1",getDataModel:function(e){
var s={
description:"This data object is a reference to a paired end read library",
items:[]};return e.handle_1&&s.items.push({name:"Left reads source file name",
value:e.handle_1.file_name}),e.handle_2&&s.items.push({
name:"Right reads source file name",value:e.handle_2.file_name
}),e.insert_size_mean&&s.items.push({name:"Insert size (mean)",
value:e.insert_size_mean}),e.insert_size_std_dev&&s.items.push({
name:"Insert size (stdev)",value:e.insert_size_std_dev}),s}})}));