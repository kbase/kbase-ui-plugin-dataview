define(["jquery","widgets/assembly/kbaseSingleObjectBasicWidget"],(function(e){
"use strict";e.KBWidget({name:"kbaseFilePairedEndLibrary",
parent:"kbaseSingleObjectBasicWidget",version:"1.0.1",getDataModel:function(e){
var i={
description:"This data object is a reference to a paired end read library",
items:[]};if(e.strain){var s=""
;e.strain.genus&&(s=e.strain.genus),e.strain.species&&(s+=" "+e.strain.species),
e.strain.strain&&(s+=" "+e.strain.strain),i.items.push({name:"Organism",value:s
})}return e.lib1&&e.lib1.file&&e.lib1.file.file_name&&i.items.push({
name:"Left reads source file name",value:e.lib1.file.file_name
}),e.lib2&&e.lib2.file&&e.lib2.file.file_name&&i.items.push({
name:"Right reads source file name",value:e.lib2.file.file_name
}),e.source&&(e.source.source&&i.items.push({name:"Source",value:e.source.source
}),e.source.project_id&&i.items.push({name:"Project ID",
value:e.source.project_id}),e.source.source_id&&i.items.push({name:"Source ID",
value:e.source.source_id})),e.read_count&&i.items.push({name:"Read count",
value:e.read_count}),e.read_size&&i.items.push({name:"Read size",
value:e.read_size}),e.sequencing_tech&&i.items.push({
name:"Sequencing technology",value:e.sequencing_tech}),i}})}));