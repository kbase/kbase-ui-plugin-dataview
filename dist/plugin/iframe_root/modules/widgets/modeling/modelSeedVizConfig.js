define([],(function(){"use strict";function e(){
var e="ff0000",r="0000ff",t=0,n=100;function F(e,r,F){var i=e
;i<t&&(i=t),i>n&&(i=n);var o=n-t,a=parseInt(r,16),l=(parseInt(F,16)-a)/o
;return function(e){return 1===e.length?"0"+e:e
}(Math.round(l*(i-t)+a).toString(16))}var i={aliceblue:"F0F8FF",
antiquewhite:"FAEBD7",aqua:"00FFFF",aquamarine:"7FFFD4",azure:"F0FFFF",
beige:"F5F5DC",bisque:"FFE4C4",black:"000000",blanchedalmond:"FFEBCD",
blue:"0000FF",blueviolet:"8A2BE2",brown:"A52A2A",burlywood:"DEB887",
cadetblue:"5F9EA0",chartreuse:"7FFF00",chocolate:"D2691E",coral:"FF7F50",
cornflowerblue:"6495ED",cornsilk:"FFF8DC",crimson:"DC143C",cyan:"00FFFF",
darkblue:"00008B",darkcyan:"008B8B",darkgoldenrod:"B8860B",darkgray:"A9A9A9",
darkgreen:"006400",darkgrey:"A9A9A9",darkkhaki:"BDB76B",darkmagenta:"8B008B",
darkolivegreen:"556B2F",darkorange:"FF8C00",darkorchid:"9932CC",
darkred:"8B0000",darksalmon:"E9967A",darkseagreen:"8FBC8F",
darkslateblue:"483D8B",darkslategray:"2F4F4F",darkslategrey:"2F4F4F",
darkturquoise:"00CED1",darkviolet:"9400D3",deeppink:"FF1493",
deepskyblue:"00BFFF",dimgray:"696969",dimgrey:"696969",dodgerblue:"1E90FF",
firebrick:"B22222",floralwhite:"FFFAF0",forestgreen:"228B22",fuchsia:"FF00FF",
gainsboro:"DCDCDC",ghostwhite:"F8F8FF",gold:"FFD700",goldenrod:"DAA520",
gray:"808080",green:"008000",greenyellow:"ADFF2F",grey:"808080",
honeydew:"F0FFF0",hotpink:"FF69B4",indianred:"CD5C5C",indigo:"4B0082",
ivory:"FFFFF0",khaki:"F0E68C",lavender:"E6E6FA",lavenderblush:"FFF0F5",
lawngreen:"7CFC00",lemonchiffon:"FFFACD",lightred:"FFCFCF",lightblue:"ADD8E6",
lightcoral:"F08080",lightcyan:"E0FFFF",lightgoldenrodyellow:"FAFAD2",
lightgray:"D3D3D3",lightgreen:"c7e8cd",lightgrey:"D3D3D3",lightpink:"FFB6C1",
lightsalmon:"FFA07A",lightseagreen:"20B2AA",lightskyblue:"87CEFA",
lightslategray:"778899",lightslategrey:"778899",lightsteelblue:"B0C4DE",
lightyellow:"FFFFE0",lime:"00FF00",limegreen:"32CD32",linen:"FAF0E6",
magenta:"FF00FF",maroon:"800000",mediumaquamarine:"66CDAA",mediumblue:"0000CD",
mediumorchid:"BA55D3",mediumpurple:"9370DB",mediumseagreen:"3CB371",
mediumslateblue:"7B68EE",mediumspringgreen:"00FA9A",mediumturquoise:"48D1CC",
mediumvioletred:"C71585",midnightblue:"191970",mintcream:"F5FFFA",
mistyrose:"FFE4E1",moccasin:"FFE4B5",navajowhite:"FFDEAD",navy:"000080",
oldlace:"FDF5E6",olive:"808000",olivedrab:"6B8E23",orange:"FFA500",
orangered:"FF4500",orchid:"DA70D6",palegoldenrod:"EEE8AA",palegreen:"98FB98",
paleturquoise:"AFEEEE",palevioletred:"DB7093",papayawhip:"FFEFD5",
peachpuff:"FFDAB9",peru:"CD853F",pink:"FFC0CB",plum:"DDA0DD",
powderblue:"B0E0E6",purple:"800080",red:"FF0000",rosybrown:"BC8F8F",
royalblue:"4169E1",saddlebrown:"8B4513",salmon:"FA8072",sandybrown:"F4A460",
seagreen:"2E8B57",seashell:"FFF5EE",sienna:"A0522D",silver:"C0C0C0",
skyblue:"87CEEB",slateblue:"6A5ACD",slategray:"708090",slategrey:"708090",
snow:"FFFAFA",springgreen:"00FF7F",steelblue:"4682B4",tan:"D2B48C",
teal:"008080",thistle:"D8BFD8",tomato:"FF6347",turquoise:"40E0D0",
violet:"EE82EE",wheat:"F5DEB3",white:"FFFFFF",whitesmoke:"F5F5F5",
yellow:"FFFF00",yellowgreen:"9ACD32"};this.getHexColour=function(e){
if(function(e){return/^#?[0-9a-fA-F]{6}$/i.test(e)
}(e))return e.substring(e.length-6,e.length);var r=e.toLowerCase()
;if(i.hasOwnProperty(r))return i[r];throw new Error(e+" is not a valid colour.")
},this.setGradient=function(t,n){e=this.getHexColour(t),r=this.getHexColour(n)},
this.setNumberRange=function(e,r){
if(!(r>e))throw new RangeError("maxNumber ("+r+") is not greater than minNumber ("+e+")")
;t=e,n=r},this.colourAt=function(t){
return F(t,e.substring(0,2),r.substring(0,2))+F(t,e.substring(2,4),r.substring(2,4))+F(t,e.substring(4,6),r.substring(4,6))
}}function r(){var r=null,t=0,n=100,F=["ff0000","ffff00","00ff00","0000ff"]
;function i(i){
if(i.length<2)throw new Error("Rainbow must have two or more colours.")
;var o,a,l=(n-t)/(i.length-1),u=new e
;for(u.setGradient(i[0],i[1]),u.setNumberRange(t,t+l),
r=[u],o=1;o<i.length-1;o+=1)(a=new e).setGradient(i[o],i[o+1]),
a.setNumberRange(t+l*o,t+l*(o+1)),r[o]=a;F=i}i(F),this.setSpectrum=function(){
return i(arguments),this},this.setSpectrumByArray=function(e){return i(e),this},
this.colourAt=function(e){if(isNaN(e))throw new TypeError(e+" is not a number")
;if(1===r.length)return r[0].colourAt(e)
;var F=(n-t)/r.length,i=Math.min(Math.floor((Math.max(e,t)-t)/F),r.length-1)
;return r[i].colourAt(e)
},this.colorAt=this.colourAt,this.setNumberRange=function(e,r){
if(!(r>e))throw new RangeError("maxNumber ("+r+") is not greater than minNumber ("+e+")")
;return t=e,n=r,i(F),this}}return function(){
this.geneColor="#87CEEB",this.negFluxColors=["#910000","#e52222","#ff4444","#fc8888","#fcabab"],
this.fluxColors=["#0d8200","#1cd104","#93e572","#99db9d","#c7e8cd"],
this.bounds=[100,50,5,1,0],this.negBounds=[0,-1,-5,-50,-100],this.stroke="#888",
this.strokeDark="#000",this.highlight="steelblue";var t=new r
;t.setNumberRange(1,20),t.setSpectrum("lightred","darkred");var n=new r
;n.setNumberRange(1,20),
n.setSpectrum("lightgreen","darkgreen"),this.getColor=function(e,r){
var F=Math.abs(e)/41*100
;return 0===e?self.geneColor:e<0||r?"#"+t.colourAt(F):"#"+n.colourAt(F)}
;var F=new e;this.getNegMinHex=function(){return"#"+F.getHexColour("lightred")},
this.getNegMaxHex=function(){return"#"+F.getHexColour("darkred")
},this.getPosMinHex=function(){return"#"+F.getHexColour("lightgreen")
},this.getPosMaxHex=function(){return"#"+F.getHexColour("darkgreen")
},this.getMaxAbsFlux=function(){return 41}}}));