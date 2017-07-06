!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.vnill=e():t.vnill=e()}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=0)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1);e.Component=o.default},function(t,e,n){"use strict";var o=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])};return function(e,n){function o(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),r=this&&this.__assign||Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++){e=arguments[n];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}return t};Object.defineProperty(e,"__esModule",{value:!0});var i=n(2),s=n(3),p=function(t){function e(e,n){void 0===e&&(e={});var o=t.call(this)||this;return o.$el=n||null,o.refs={},o.children=[],o._watchers={},o._hasWatchers=!1,o._raf=null,o.props=e,o}return o(e,t),e.prototype.componentWillMount=function(){},e.prototype.componentDidMount=function(){},e.prototype.componentWillUnmount=function(){},e.prototype.componentWillUpdate=function(t){},e.prototype.componentDidUpdate=function(t){},e.prototype.shouldComponentUpdate=function(t){return i.shallowEqual(this.props,t)},e.prototype.updateProps=function(t){if(!1!==this.shouldComponentUpdate(t)){this.componentWillUpdate(t);var e=i.cloneDeep(this.props);if(this.props=r({},e,t),this.componentDidUpdate(e),this._hasWatchers)for(var n in e)e[n]!==t[n]&&"function"==typeof this._watchers[n]&&this._watchers[n](this.props[n],e[n])}},e.prototype.addEventListener=function(t,e,n){return this.$el.addEventListener(t,e,n),this},e.prototype.removeEventListener=function(t,e,n){return this.$el.removeEventListener(t,e,n),this},e.prototype.toChildView=function(t,n){"string"==typeof t&&(t=this.querySelector(t));var o=new e({},t);return this.children.push(o),n&&(this.refs[n]=o),o},e.prototype.addWatcher=function(t,e){this._hasWatchers=!0,this._watchers[t]=e},e.prototype.removeWatcher=function(t){delete this._watchers[t],this._hasWatchers=Object.keys(this._watchers).length>0},e.prototype.setHtml=function(t){this.componentWillMount();var e=document.createElement("div");return e.innerHTML=t,this.$el=e.firstChild,e.remove(),e=null,this.componentDidMount(),this},e.prototype.getDOMNode=function(){return this.$el},e.prototype.querySelectorAll=function(t){return this.$el.querySelectorAll(t)},e.prototype.querySelector=function(t){return this.$el.querySelector(t)},e.prototype.addClass=function(t){return this.$el.classList.add(t),this},e.prototype.removeClass=function(t){return this.$el.classList.remove(t),this},e.prototype.toggleClass=function(t){return this.hasClass(t)?this.removeClass(t):this.addClass(t)},e.prototype.hasClass=function(t){return this.$el.classList.contains(t)},e.prototype.setAttribute=function(t,e){return this.$el.setAttribute(t,e.toString()),this},e.prototype.getAttribute=function(t){return this.$el.getAttribute(t)},e.prototype.removeAttribute=function(t){return this.$el.removeAttribute(t),this},e.prototype.setStyle=function(t,e){return this.$el.style[t]=e.toString(),this},e.prototype.unsetStyle=function(t){return this.$el.style[t]="",this},e.prototype.appendTo=function(t){return t.appendChild(this.$el),this},e.prototype.prependTo=function(t){return 0==t.childNodes.length?this.appendTo(t):(t.insertBefore(this.$el,t.childNodes[0]),this)},e.prototype.appendToView=function(t){return this.appendTo(t.$el)},e.prototype.prependToView=function(t){return this.prependTo(t.$el)},e.prototype.getRect=function(){return this.$el.getBoundingClientRect()},e.prototype.getCords=function(){var t=this.getRect(),e=document.body,n=document.documentElement,o=window.pageYOffset||n.scrollTop||e.scrollTop,r=window.pageXOffset||n.scrollLeft||e.scrollLeft,i=n.clientTop||0,s=n.clientLeft||e.clientLeft||0,p=t.top+o-i,l=t.left+r-s;return{top:Math.round(p),left:Math.round(l)}},e.prototype.snapTo=function(t){var e=t.getCords(),n=t.getRect();return this.setStyle("width",this.getCSSUnit(n.width,"px")),this.setStyle("height",this.getCSSUnit(n.width,"px")),this.setStyle("top",this.getCSSUnit(e.top,"px")),this.setStyle("left",this.getCSSUnit(e.left,"px")),this},e.prototype.getCSSUnit=function(t,e){return void 0===e&&(e="px"),""+t.toString()+e},e.prototype.dispose=function(){this.componentWillUnmount(),this._watchers=null,this.refs=null;for(var t=0,e=this.children.length;t<e;t++)this.children[t].dispose(),this.children[t]=null;this.$el.parentNode.removeChild(this.$el),this.$el=null,this.children.length=0},e}(s.default);e.default=p},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=Object.prototype.hasOwnProperty;e.cloneDeep=function(t){return void 0===t&&(t={}),JSON.parse(JSON.stringify(t))},e.shallowEqual=function(t,e){if(t===e)return!0;var n=0,r=0;for(var i in t){if(o.call(t,i)&&t[i]!==e[i])return!1;n++}for(var i in e)o.call(e,i)&&r++;return n===r}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(){}return t.prototype.on=function(t,e,n){this._eventDispatcherCallbacks||(this._eventDispatcherCallbacks={});var o=this._eventDispatcherCallbacks[t];return o||(this._eventDispatcherCallbacks[t]=o=[]),o.push({fn:e,scope:n||this}),this},t.prototype.un=function(t,e,n){if(this._eventDispatcherCallbacks){var o=this._eventDispatcherCallbacks[t];if(o&&o.length>0)for(var r=o.length-1;r>=0;r--){var i=o[r];i.fn===e&&i.scope===(n||this)&&o.splice(r,1)}}return this},t.prototype.dispatch=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];if(this._eventDispatcherCallbacks){var o=this._eventDispatcherCallbacks[t];if(o)for(var r=o.length-1;r>=0;r--){var i=o[r];i&&i.fn&&i.scope&&i.fn.apply(i.scope||this,e)}}},t.prototype.removeAllListeners=function(){for(var t in this._eventDispatcherCallbacks){this._eventDispatcherCallbacks[t].length=0}this._eventDispatcherCallbacks={}},t}();e.default=o}])});