/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
function bpColors(){
return["#109618","#dc3912","#3366cc","#ff9900","#8a4117","#000000","#990099"]}
function GooglePalette(e){
var a=["#3366cc","#dc3912","#ff9900","#109618","#990099","#0099c6","#dd4477","#66aa00","#b82e2e","#316395","#994499","#22aa99","#aaaa11","#6633cc","#e67300","#8b0707","#651067","#329262","#5574a6","#3b3eac","#b77322","#16d620","#b91383","#f4359e","#9c5935","#a9c413","#2a778d","#668d1c","#bea413","#0c5922","#743411"]
;if(!e||0==e)return a;for(var f=[],r=0;r<e;r++){var t=r%a.length;f.push(a[t])}
return f}function RGBColor(e){
this.ok=!1,"#"==e.charAt(0)&&(e=e.substr(1,6)),e=(e=e.replace(/ /g,"")).toLowerCase()
;var a={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",
aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",
black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",
brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",
chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",
crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",
darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",
darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",
darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",
darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",
darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",
dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",
forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",
gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",
greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",
indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",
lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",
lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",
lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",
lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",
lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",
lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",
linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",
mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",
mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",
mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",
mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",
navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",
orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",
palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",
papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",
plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",
rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",
sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",
silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",
snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",
teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",
violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",
whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"}
;for(var f in a)e==f&&(e=a[f]);for(var r=[{
re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(e){
return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}},{
re:/^(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function(e){
return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}},{
re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(e){
return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}
}],t=0;t<r.length;t++){var d=r[t].re,l=r[t].process,n=d.exec(e)
;n&&(channels=l(n),
this.r=channels[0],this.g=channels[1],this.b=channels[2],this.ok=!0)}
this.r=this.r<0||isNaN(this.r)?0:this.r>255?255:this.r,
this.g=this.g<0||isNaN(this.g)?0:this.g>255?255:this.g,
this.b=this.b<0||isNaN(this.b)?0:this.b>255?255:this.b,this.toRGB=function(){
return"rgb("+this.r+", "+this.g+", "+this.b+")"},this.toHex=function(){
var e=this.r.toString(16),a=this.g.toString(16),f=this.b.toString(16)
;return 1==e.length&&(e="0"+e),
1==a.length&&(a="0"+a),1==f.length&&(f="0"+f),"#"+e+a+f
},this.getHelpXML=function(){
for(var e=new Array,f=0;f<r.length;f++)for(var t=r[f].example,d=0;d<t.length;d++)e[e.length]=t[d]
;for(var l in a)e[e.length]=l;var n=document.createElement("ul")
;n.setAttribute("id","rgbcolor-examples");for(f=0;f<e.length;f++)try{
var i=document.createElement("li"),o=new RGBColor(e[f]),c=document.createElement("div")
;c.style.cssText="margin: 3px; border: 1px solid black; background:"+o.toHex()+"; color:"+o.toHex(),
c.appendChild(document.createTextNode("test"))
;var s=document.createTextNode(" "+e[f]+" -> "+o.toRGB()+" -> "+o.toHex())
;i.appendChild(c),i.appendChild(s),n.appendChild(i)}catch(b){}return n}}