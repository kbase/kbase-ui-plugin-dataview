!function(n,l){"object"==typeof exports&&"undefined"!=typeof module?l(exports):"function"==typeof define&&define.amd?define(["exports"],l):l(n.preact={})}(this,function(n){var l,u,t,i,e,f={},r=[],o=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;function c(n,l){for(var u in l)n[u]=l[u];return n}function s(n){var l=n.parentNode;l&&l.removeChild(n)}function a(n,l,u){var t,i,e,f,r=arguments;if(l=c({},l),arguments.length>3)for(u=[u],t=3;t<arguments.length;t++)u.push(r[t]);if(null!=u&&(l.children=u),null!=n&&null!=n.defaultProps)for(i in n.defaultProps)void 0===l[i]&&(l[i]=n.defaultProps[i]);return f=l.key,null!=(e=l.ref)&&delete l.ref,null!=f&&delete l.key,h(n,l,f,e)}function h(n,u,t,i){var e={type:n,props:u,key:t,ref:i,__k:null,__p:null,__b:0,__e:null,l:null,__c:null,constructor:void 0};return l.vnode&&l.vnode(e),e}function v(n){return n.children}function p(n){if(null==n||"boolean"==typeof n)return null;if("string"==typeof n||"number"==typeof n)return h(null,n,null,null);if(null!=n.__e||null!=n.__c){var l=h(n.type,n.props,n.key,null);return l.__e=n.__e,l}return n}function d(n,l){this.props=n,this.context=l}function y(n,l){if(null==l)return n.__p?y(n.__p,n.__p.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?y(n):null}function m(n){var l,u;if(null!=(n=n.__p)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return m(n)}}function w(n){!n.__d&&(n.__d=!0)&&1===u.push(n)&&(l.debounceRendering||t)(g)}function g(){var n;for(u.sort(function(n,l){return l.__v.__b-n.__v.__b});n=u.pop();)n.__d&&n.forceUpdate(!1)}function k(n,l,u,t,i,e,o,c,a){var h,v,d,m,w,g,k,_,x=l.__k||b(l.props.children,l.__k=[],p,!0),C=u&&u.__k||r,P=C.length;for(c==f&&(c=null!=e?e[0]:P?y(u,0):null),v=0;v<x.length;v++)if(null!=(h=x[v]=p(x[v]))){if(h.__p=l,h.__b=l.__b+1,null===(m=C[v])||m&&h.key==m.key&&h.type===m.type)C[v]=void 0;else for(d=0;d<P;d++){if((m=C[d])&&h.key==m.key&&h.type===m.type){C[d]=void 0;break}m=null}if(w=N(n,h,m=m||f,t,i,e,o,null,c,a),(d=h.ref)&&m.ref!=d&&(_||(_=[])).push(d,h.__c||w,h),null!=w){if(null==k&&(k=w),null!=h.l)w=h.l,h.l=null;else if(e==m||w!=c||null==w.parentNode)n:if(null==c||c.parentNode!==n)n.appendChild(w);else{for(g=c,d=0;(g=g.nextSibling)&&d<P;d+=2)if(g==w)break n;n.insertBefore(w,c)}c=w.nextSibling,"function"==typeof l.type&&(l.l=w)}}if(l.__e=k,null!=e&&"function"!=typeof l.type)for(v=e.length;v--;)null!=e[v]&&s(e[v]);for(v=P;v--;)null!=C[v]&&z(C[v],C[v]);if(_)for(v=0;v<_.length;v++)$(_[v],_[++v],_[++v])}function b(n,l,u,t){if(null==l&&(l=[]),null==n||"boolean"==typeof n)t&&l.push(null);else if(Array.isArray(n))for(var i=0;i<n.length;i++)b(n[i],l,u,t);else l.push(u?u(n):n);return l}function _(n,l,u,t,i){var e;for(e in u)e in l||C(n,e,null,u[e],t);for(e in l)i&&"function"!=typeof l[e]||"value"===e||"checked"===e||u[e]===l[e]||C(n,e,l[e],u[e],t)}function x(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]="number"==typeof u&&!1===o.test(l)?u+"px":u}function C(n,l,u,t,i){var e,f,r,o,c;if("key"===(l=i?"className"===l?"class":l:"class"===l?"className":l)||"children"===l);else if("style"===l)if(e=n.style,"string"==typeof u)e.cssText=u;else{if("string"==typeof t&&(e.cssText="",t=null),t)for(f in t)u&&f in u||x(e,f,"");if(u)for(r in u)t&&u[r]===t[r]||x(e,r,u[r])}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),c=l.toLowerCase(),l=(c in n?c:l).slice(2),u?(t||n.addEventListener(l,P,o),(n.u||(n.u={}))[l]=u):n.removeEventListener(l,P,o);else if("list"!==l&&"tagName"!==l&&!i&&l in n)if(n.length&&"value"==l)for(l=n.length;l--;)n.options[l].selected=n.options[l].value==u;else n[l]=null==u?"":u;else"function"!=typeof u&&"dangerouslySetInnerHTML"!==l&&(l!==(l=l.replace(/^xlink:?/,""))?null==u||!1===u?n.removeAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase()):n.setAttributeNS("http://www.w3.org/1999/xlink",l.toLowerCase(),u):null==u||!1===u?n.removeAttribute(l):n.setAttribute(l,u))}function P(n){return this.u[n.type](l.event?l.event(n):n)}function N(n,u,t,i,e,f,r,o,s,a){var h,y,m,w,g,_,x,C,P,N,j=u.type;if(void 0!==u.constructor)return null;(h=l.__b)&&h(u);try{n:if("function"==typeof j){if(C=u.props,P=(h=j.contextType)&&i[h.__c],N=h?P?P.props.value:h.__p:i,t.__c?x=(y=u.__c=t.__c).__p=y.__E:(j.prototype&&j.prototype.render?u.__c=y=new j(C,N):(u.__c=y=new d(C,N),y.constructor=j,y.render=A),P&&P.sub(y),y.props=C,y.state||(y.state={}),y.context=N,y.__n=i,m=y.__d=!0,y.__h=[]),null==y.__s&&(y.__s=y.state),null!=j.getDerivedStateFromProps&&c(y.__s==y.state?y.__s=c({},y.__s):y.__s,j.getDerivedStateFromProps(C,y.__s)),m)null==j.getDerivedStateFromProps&&null!=y.componentWillMount&&y.componentWillMount(),null!=y.componentDidMount&&r.push(y);else{if(null==j.getDerivedStateFromProps&&null==o&&null!=y.componentWillReceiveProps&&y.componentWillReceiveProps(C,N),!o&&null!=y.shouldComponentUpdate&&!1===y.shouldComponentUpdate(C,y.__s,N)){y.props=C,y.state=y.__s,y.__d=!1,y.__v=u,u.__e=t.__e,u.__k=t.__k;break n}null!=y.componentWillUpdate&&y.componentWillUpdate(C,y.__s,N)}for(w=y.props,g=y.state,y.context=N,y.props=C,y.state=y.__s,(h=l.__r)&&h(u),y.__d=!1,y.__v=u,y.__P=n,b(null!=(h=y.render(y.props,y.state,y.context))&&h.type==v&&null==h.key?h.props.children:h,u.__k=[],p,!0),null!=y.getChildContext&&(i=c(c({},i),y.getChildContext())),m||null==y.getSnapshotBeforeUpdate||(_=y.getSnapshotBeforeUpdate(w,g)),k(n,u,t,i,e,f,r,s,a),y.base=u.__e;h=y.__h.pop();)h.call(y);m||null==w||null==y.componentDidUpdate||y.componentDidUpdate(w,g,_),x&&(y.__E=y.__p=null)}else u.__e=T(t.__e,u,t,i,e,f,r,a);(h=l.diffed)&&h(u)}catch(n){l.__e(n,u,t)}return u.__e}function j(n,u){for(var t;t=n.pop();)try{t.componentDidMount()}catch(n){l.__e(n,t.__v)}l.__c&&l.__c(u)}function T(n,l,u,t,i,e,o,c){var s,a,h,v,p=u.props,d=l.props;if(i="svg"===l.type||i,null==n&&null!=e)for(s=0;s<e.length;s++)if(null!=(a=e[s])&&(null===l.type?3===a.nodeType:a.localName===l.type)){n=a,e[s]=null;break}if(null==n){if(null===l.type)return document.createTextNode(d);n=i?document.createElementNS("http://www.w3.org/2000/svg",l.type):document.createElement(l.type),e=null}return null===l.type?p!==d&&(n.data=d):l!==u&&(null!=e&&(e=r.slice.call(n.childNodes)),h=(p=u.props||f).dangerouslySetInnerHTML,v=d.dangerouslySetInnerHTML,c||(v||h)&&(v&&h&&v.__html==h.__html||(n.innerHTML=v&&v.__html||"")),_(n,d,p,i,c),v||k(n,l,u,t,"foreignObject"!==l.type&&i,e,o,f,c),c||("value"in d&&void 0!==d.value&&d.value!==n.value&&(n.value=null==d.value?"":d.value),"checked"in d&&void 0!==d.checked&&d.checked!==n.checked&&(n.checked=d.checked))),n}function $(n,u,t){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,t)}}function z(n,u,t){var i,e,f;if(l.unmount&&l.unmount(n),(i=n.ref)&&$(i,null,u),t||"function"==typeof n.type||(t=null!=(e=n.__e)),n.__e=n.l=null,null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=null}if(i=n.__k)for(f=0;f<i.length;f++)i[f]&&z(i[f],u,t);null!=e&&s(e)}function A(n,l,u){return this.constructor(n,u)}function D(n,u,t){var e,o,c;l.__p&&l.__p(n,u),o=(e=t===i)?null:t&&t.__k||u.__k,n=a(v,null,[n]),c=[],N(u,e?u.__k=n:(t||u).__k=n,o||f,f,void 0!==u.ownerSVGElement,t&&!e?[t]:o?null:r.slice.call(u.childNodes),c,!1,t||f,e),j(c,n)}l={},d.prototype.setState=function(n,l){var u=this.__s!==this.state&&this.__s||(this.__s=c({},this.state));("function"!=typeof n||(n=n(u,this.props)))&&c(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),w(this))},d.prototype.forceUpdate=function(n){var l,u,t,i=this.__v,e=this.__v.__e,f=this.__P;f&&(l=!1!==n,u=[],t=N(f,i,c({},i),this.__n,void 0!==f.ownerSVGElement,null,u,l,null==e?y(i):e),j(u,i),t!=e&&m(i)),n&&n()},d.prototype.render=v,u=[],t="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,l.__e=function(n,l,u){for(var t;l=l.__p;)if((t=l.__c)&&!t.__p)try{if(t.constructor&&null!=t.constructor.getDerivedStateFromError)t.setState(t.constructor.getDerivedStateFromError(n));else{if(null==t.componentDidCatch)continue;t.componentDidCatch(n)}return w(t.__E=t)}catch(l){n=l}throw n},i=f,e=0,n.render=D,n.hydrate=function(n,l){D(n,l,i)},n.createElement=a,n.h=a,n.Fragment=v,n.createRef=function(){return{}},n.Component=d,n.cloneElement=function(n,l){return l=c(c({},n.props),l),arguments.length>2&&(l.children=r.slice.call(arguments,2)),h(n.type,l,l.key||n.key,l.ref||n.ref)},n.createContext=function(n){var l={},u={__c:"__cC"+e++,__p:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var t,i=this;return this.getChildContext||(t=[],this.getChildContext=function(){return l[u.__c]=i,l},this.shouldComponentUpdate=function(n){t.some(function(l){l.__P&&(l.context=n.value,w(l))})},this.sub=function(n){t.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){t.splice(t.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Consumer.contextType=u,u},n.toChildArray=b,n._e=z,n.options=l});
//# sourceMappingURL=preact.umd.js.map