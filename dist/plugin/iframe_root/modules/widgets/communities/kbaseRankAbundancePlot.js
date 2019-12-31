!function(e,r){e.KBWidget({name:"RankAbundancePlot",version:"1.0.0",options:{
id:null,ws:null,auth:null,name:0,top:"10",order:"average"},
ws_url:window.kbconfig.urls.workspace,
loading_image:"assets/img/ajax-loader.gif",init:function(e){
return this._super(e),this.render()},render:function(){
var r=this,t=(this.uuidv4(),this.$elem),n=new Workspace(r.ws_url,{
token:r.options.auth})
;return t.empty(),t.append('<div><img src="'+r.loading_image+'">&nbsp;&nbsp;loading data...</div>'),
n.get_objects([{ref:r.options.ws+"/"+r.options.id}],(function(e){
if(t.empty(),0==e.length){
var n="[Error] Object "+r.options.id+" does not exist in workspace "+r.options.ws
;t.append("<div><p>"+n+">/p></div>")}else{
var a=e[0].data,o=[],s=a.columns.length,i=a.rows.length,p=new Array(i)
;o="sparse"==a.matrix_type?r.sparse2dense(a.data,a.shape[0],a.shape[1]):a.data
;for(var d=0;d<i;d++){
for(var u=[a.rows[d].id,0,0,0],l=0;l<s;l++)u[1]+=o[d][l],u.push(o[d][l])
;u[2]=u[1]/s,u[3]=Math.max.apply(null,o[d]),p[d]=u}var g=new Array(10)
;for(l=0;l<10;l++)g[l]=p[l];if("sum"==r.options.order)p.sort((function(e,r){
return r[1]-e[1]}));else if("average"==r.options.order)p.sort((function(e,r){
return r[2]-e[2]}));else if("max"==r.options.order)p.sort((function(e,r){
return r[3]-e[3]}));else{var f=4
;isPositiveInteger(r.options.order)&&(f=parseInt(r.options.order,10)+3),
f-1>p.length&&(f=4),p.sort((function(e,r){return r[f]-e[f]}))}
for(var h=parseInt(r.options.top,10),m=GooglePalette(s),c=new Array(s),v=new Array(h),w=0;w<s;w++)0==r.options.name?c[w]={
name:a.columns[w].id,data:[],fill:m[w]}:c[w]={name:a.columns[w].name,data:[],
fill:m[w]};for(d=0;d<h;d++){v[d]=p[d][0]
;for(w=0;w<s;w++)c[w].data.push(p[d][w+4])}var y=0
;window.hasOwnProperty("rendererGraph")&&rendererGraph.length&&(y=rendererGraph.length),
t.append("<div id='outputGraph"+y+"' style='width: 95%;'></div>")
;var x=standaloneGraph.create({index:y})
;x.settings.target=document.getElementById("outputGraph"+y),
x.settings.data=c,x.settings.show_legend=!0,
x.settings.x_labels=v,x.settings.x_labels_rotation="340",
x.settings.height=500,x.settings.type="column",x.render(y)}}),(function(r){
t.empty();var n=e("<div>");n.append(e("<p>").css({padding:"10px 20px"
}).text("[Error] "+r.error.message)),t.append(n)})),r},
sparse2dense:function(e,r,t){
for(var n=new Array(r),a=0;a<r;a++)n[a]=Array.apply(null,new Array(t)).map(Number.prototype.valueOf,0)
;for(a=0;a<e.length;a++)n[e[a][0]][e[a][1]]=e[a][2];return n},
isPositiveInteger:function(e){return/^[1-9]\d*$/.test(e)},uuidv4:function(e,r){
for(r=e="";e++<36;r+=51*e&52?(15^e?8^Math.random()*(20^e?16:4):4).toString(16):"-");
return r}})}(jQuery);