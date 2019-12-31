!function(e,n){e.KBWidget({name:"AbundanceDataTable",version:"1.0.0",options:{
id:null,ws:null,auth:null,name:0},ws_url:window.kbconfig.urls.workspace,
loading_image:"assets/img/ajax-loader.gif",init:function(e){
return this._super(e),this.render()},render:function(){
var n=this,t=(this.uuidv4(),this.$elem),r=new Workspace(n.ws_url,{
token:n.options.auth})
;return t.empty(),t.append('<div><img src="'+n.loading_image+'">&nbsp;&nbsp;loading data...</div>'),
r.get_objects([{ref:n.options.ws+"/"+n.options.id}],(function(e){
if(t.empty(),0==e.length){
var r="[Error] Object "+n.options.id+" does not exist in workspace "+n.options.ws
;t.append("<div><p>"+r+">/p></div>")}else{var a=e[0].data,i=[],s=[]
;i="sparse"==a.matrix_type?n.sparse2dense(a.data,a.shape[0],a.shape[1]):a.data
;var o=a.columns.length+1,d=new Array(o);d[0]="Annotation"
;for(var p=0;p<a.columns.length;p++)0==n.options.name?d[p+1]=a.columns[p].id:d[p+1]=a.columns[p].name
;s=new Array(i.length);for(var l=0;l<i.length;l++){
s[l]=new Array(o),s[l][0]=a.rows[l].id;for(p=0;p<i[l].length;p++){
var u=Math.round(1e3*i[l][p])/1e3;u||(u="0"),s[l][p+1]=u}}var g=0
;window.hasOwnProperty("rendererTable")&&rendererTable.length&&(g=rendererTable.length),
t.append("<div id='outputTable"+g+"' style='width: 95%;'></div>")
;var h=standaloneTable.create({index:g})
;h.settings.target=document.getElementById("outputTable"+g),h.settings.data={
header:d,data:s},h.settings.filter={0:{type:"text"}}
;for(var m=[120],v=1;v<d.length;v++)m.push(130)
;h.settings.minwidths=m,h.render(g)}}),(function(n){t.empty();var r=e("<div>")
;r.append(e("<p>").css({padding:"10px 20px"}).text("[Error] "+n.error.message)),
t.append(r)})),n},sparse2dense:function(e,n,t){
for(var r=new Array(n),a=0;a<n;a++)r[a]=Array.apply(null,new Array(t)).map(Number.prototype.valueOf,0)
;for(a=0;a<e.length;a++)r[e[a][0]][e[a][1]]=e[a][2];return r},
uuidv4:function(e,n){
for(n=e="";e++<36;n+=51*e&52?(15^e?8^Math.random()*(20^e?16:4):4).toString(16):"-");
return n}})}(jQuery);