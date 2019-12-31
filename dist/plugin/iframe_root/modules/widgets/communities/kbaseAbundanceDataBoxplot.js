!function(e,t){e.KBWidget({name:"AbundanceDataBoxplot",version:"1.0.0",options:{
id:null,ws:null,auth:null,name:0},ws_url:window.kbconfig.urls.workspace,
loading_image:"assets/img/ajax-loader.gif",init:function(e){
return this._super(e),this.render()},render:function(){
var t=this,n=(this.uuidv4(),this.$elem),a=new Workspace(t.ws_url,{
token:t.options.auth})
;return n.empty(),n.append('<div><img src="'+t.loading_image+'">&nbsp;&nbsp;loading data...</div>'),
a.get_objects([{ref:t.options.ws+"/"+t.options.id}],(function(e){
if(n.empty(),0==e.length){
var a="[Error] Object "+t.options.id+" does not exist in workspace "+t.options.ws
;n.append("<div><p>"+a+">/p></div>")}else{
var r=e[0].data,i=[],s=r.columns.length,o=r.rows.length
;i="sparse"==r.matrix_type?t.sparse2dense(r.data,r.shape[0],r.shape[1]):r.data
;for(var d=new Array(s),p=GooglePalette(s),l=0;l<s;l++)0==t.options.name?d[l]={
name:r.columns[l].id,data:[],fill:p[l]}:d[l]={name:r.columns[l].name,data:[],
fill:p[l]}
;for(var u=0,g=0;g<o;g++)for(l=0;l<s;l++)u=Math.max(u,i[g][l]),d[l].data.push(i[g][l])
;var h=0
;window.hasOwnProperty("rendererGraph")&&rendererGraph.length&&(h=rendererGraph.length),
n.append("<div id='outputGraph"+h+"' style='width: 95%;'></div>")
;var m="normalized";u>1&&(m="raw");var c=standaloneGraph.create({index:h})
;c.settings.target=document.getElementById("outputGraph"+h),
c.settings.data=d,c.settings.y_title=m+" abundance",
c.settings.show_legend=!1,c.settings.height=400,
c.settings.type="deviation",c.settings.chartArea=[.1,.1,.95,.8],c.render(h)}
}),(function(t){n.empty();var a=e("<div>");a.append(e("<p>").css({
padding:"10px 20px"}).text("[Error] "+t.error.message)),n.append(a)})),t},
sparse2dense:function(e,t,n){
for(var a=new Array(t),r=0;r<t;r++)a[r]=Array.apply(null,new Array(n)).map(Number.prototype.valueOf,0)
;for(r=0;r<e.length;r++)a[e[r][0]][e[r][1]]=e[r][2];return a},
uuidv4:function(e,t){
for(t=e="";e++<36;t+=51*e&52?(15^e?8^Math.random()*(20^e?16:4):4).toString(16):"-");
return t}})}(jQuery);