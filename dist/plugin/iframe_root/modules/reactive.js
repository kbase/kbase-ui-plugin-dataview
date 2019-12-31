define(["./minidom"],(function(n){"use strict";function t(n){var t={},e={
listeners:[],props:{}};n.node,Minidom.make(n.node);function r(n){
return"string"==typeof n?n.split("."):n}function i(n,i){var o=function(n){
var t,i=r(n),o=e;for(t=0;t<i.length;t+=1){
if(void 0===o||"object"!=typeof o||null===o)return;o=o[i[t]]}return o}([])
;o&&o.listeners.forEach((function(n){n.onChange(t,i)}))}return{
setItem:function(n,e){if("string"==typeof n&&(n=n.split(".")),0!==n.length){
for(var r,o=n.pop(),f=t;n.length>0;)void 0===f[r=n.shift()]&&(f[r]={}),f=f[r]
;return f[o]=e,i(o,e),e}},getItem:function(n,e){
"string"==typeof n&&(n=n.split("."));var r,i=t;for(r=0;r<n.length;r+=1){
if(void 0===i||"object"!=typeof i||null===i)return e;i=i[n[r]]}
return void 0===i?e:i},incrItem:function(n,e){
if("string"==typeof n&&(n=n.split(".")),0!==n.length){e=void 0===e?1:e
;for(var r,o=n.pop(),f=t;n.length>0;)void 0===f[r=n.shift()]&&(f[r]={}),f=f[r]
;if(void 0===f[o])f[o]=e;else{
if("number"!=typeof f[o])throw new Error("Can only increment a number");f[o]+=e}
return i(o,f[o]),f[o]}},deleteItem:function(n){
if("string"==typeof n&&(n=n.split(".")),0!==n.length){
for(var e,r=n.pop(),o=t;n.length>0;){if(void 0===o[e=n.shift()])return!1;o=o[e]}
return delete o[r],i(r),!0}},listen:function(n,t){!function(n,t){
for(var i,o=r(n),f=e;o.length>0;)i=o.shift(),void 0===f.props[i]&&(f.props[i]={
listeners:[],props:{}}),f=f.props[i];f.listeners.push({onChange:t})}(n,t)}}}
return{make:function(n){return t(n)}}}));