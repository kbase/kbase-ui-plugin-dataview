!function(e,o){e.KBWidget({name:"KBaseGenomeWideCommunity",parent:"kbaseWidget",
version:"1.0.0",options:{genomeID:null,workspaceID:null,
loadingImage:"assets/img/ajax-loader.gif",kbCache:null,genomeInfo:null},
init:function(e){return this._super(e),this.render(),this},render:function(){
var o=e('<div class="row">');this.$elem.append(o)
;var n=e('<div class="col-md-4 panel panel-default">');o.append(n)
;var a=e('<div class="col-md-4 panel panel-default">');o.append(a)
;var s=e('<div class="col-md-4 panel panel-default">')
;o.append(s),n.KBaseNarrativesUsingData({objNameOrId:this.options.genomeID,
wsNameOrId:this.options.workspaceID,objVer:null,kbCache:this.options.kbCache,
loadingImage:this.options.loadingImage,genomeInfo:this.options.genomeInfo
}),a.KBaseWSReferenceList({objNameOrId:this.options.genomeID,
wsNameOrId:this.options.workspaceID,objVer:null,kbCache:this.options.kbCache,
loadingImage:this.options.loadingImage,genomeInfo:this.options.genomeInfo
}),s.KBaseWSObjRefUsers({objNameOrId:this.options.genomeID,
wsNameOrId:this.options.workspaceID,objVer:null,kbCache:this.options.kbCache,
loadingImage:this.options.loadingImage,genomeInfo:this.options.genomeInfo})
;var i=e('<div class="row">');this.$elem.append(i)
;var t=e('<div class="col-md-12 panel panel-default">')
;i.append(t),t.KBaseWSObjGraphCenteredView({objNameOrId:this.options.genomeID,
wsNameOrId:this.options.workspaceID,kbCache:this.options.kbCache,
genomeInfo:this.options.genomeInfo})},getData:function(){return{
type:"Genome Community",id:this.options.genomeID,
workspace:this.options.workspaceID,title:"KBase Community"}}})}(jQuery);