define(["jquery","widgets/assembly/kbaseSingleObjectBasicWidget"],(function(e){
"use strict";e.KBWidget({name:"kbaseAssemblyInput",
parent:"kbaseSingleObjectBasicWidget",version:"1.0.1",getDataModel:function(a){
var n={description:a.dataset_description,items:[]};if(a.single_end_libs){
n.items.push({header:"1",name:"Single end read library"})
;for(var i=0;i<a.single_end_libs.length;i++){var s=a.single_end_libs[i]
;s.handle&&s.handle.file_name&&n.items.push({
name:e("<span />").css("padding-left","2em").appen("Reads source file name"),
value:s.handle.file_name})}}if(a.paired_end_libs){n.items.push({header:1,
name:"Paired end read library"});for(i=0;i<a.paired_end_libs.length;i++){
var d=a.paired_end_libs[i]
;d.handle_1&&d.handle_1.file_name&&d.handle_2&&d.handle_2.file_name&&(n.items.push({
name:e("<span />").css("padding-left","2em").append("Left reads source file name"),
value:d.handle_1.file_name}),n.items.push({
name:e("<span />").css("padding-left","2em").append("Right reads source file name"),
value:d.handle_2.file_name}))}}return a.expected_coverage&&n.items.push({
name:"Expected coverage",value:a.expected_coverage
}),a.estimated_genome_size&&n.items.push({name:"Estimated genome size",
value:a.estimated_genome_size}),n}})}));