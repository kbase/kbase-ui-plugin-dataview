!function(t,e){t.KBWidget({name:"AbundanceDataPcoa",
parent:"kbaseAuthenticatedWidget",version:"1.0.0",token:null,options:{id:null,
ws:null,x_axis:"1",y_axis:"2"},ws_url:window.kbconfig.urls.workspace,
init:function(t){return this._super(t),this},render:function(){
var e=this,n=(this.uuidv4(),this.$elem)
;if(n.empty(),null!=e.token)return n.append('<div><img src="'+e.loading_image+'">&nbsp;&nbsp;loading data...</div>'),
new Workspace(e.ws_url,{token:e.token}).get_objects([{
ref:e.options.ws+"/"+e.options.id}],(function(t){if(n.empty(),0==t.length){
var a="[Error] Object "+e.options.id+" does not exist in workspace "+e.options.ws
;n.append("<div><p>"+a+">/p></div>")}else{
var i=t[0].data,s=i.data.length,r=parseInt(e.options.x_axis,10)-1,o=parseInt(e.options.y_axis,10)-1
;(isNaN(r)||isNaN(o)||r<0||r>s-1||o<0||o>s-1)&&(r=0,o=1)
;for(var d={},p=new Array(s),l=new Array(s),u=0;u<s;u++){t={id:i.data[u].id,
x:i.data[u].pco[r],y:i.data[u].pco[o]}
;p[u]=i.data[u].pco[r],l[u]=i.data[u].pco[o],
""==i.data[u].group?d[i.data[u].id]=[t]:d.hasOwnProperty(i.data[u].group)?d[i.data[u].group].push(t):d[i.data[u].group]=[t]
}var g=GooglePalette(d.length),h={series:[],points:[]},c=0;for(var v in d){
var y=[];for(u=0;u<d[v].length;u++)y.push({x:d[v][u].x,y:d[v][u].y})
;h.series.push({name:v,color:g[c],shape:"circle",filled:1
}),h.points.push(y),c+=1}
var x=Math.min.apply(null,p),m=Math.max.apply(null,p),w=Math.min.apply(null,l),f=Math.max.apply(null,l)
;s=0
;window.hasOwnProperty("rendererPlot")&&rendererPlot.length&&(s=rendererPlot.length),
n.append("<div id='outputPlot"+s+"' style='width: 95%;'></div>")
;var _=standalonePlot.create({index:s})
;_.settings.target=document.getElementById("outputPlot"+s),
_.settings.data=h,_.settings.x_title="PC"+(r+1).toString(),
_.settings.y_title="PC"+(o+1).toString(),
_.settings.x_min=x-Math.abs(.1*(m-x)),_.settings.x_max=m+Math.abs(.1*(m-x)),
_.settings.y_min=w-Math.abs(.1*(f-w)),
_.settings.y_max=f+Math.abs(.1*(f-w)),_.settings.connected=!1,
_.settings.show_dots=!0,_.settings.show_legend=!0,_.render(s)}}),(function(e){
n.empty();var a=t("<div>");a.append(t("<p>").css({padding:"10px 20px"
}).text("[Error] "+e.error.message)),n.append(a)})),e
;n.append("<div>[Error] You're not logged in</div>")},
loggedInCallback:function(t,e){return this.token=e.token,this.render(),this},
loggedOutCallback:function(t,e){return this.token=null,this.render(),this},
uuidv4:function(t,e){
for(e=t="";t++<36;e+=51*t&52?(15^t?8^Math.random()*(20^t?16:4):4).toString(16):"-");
return e}})}(jQuery);