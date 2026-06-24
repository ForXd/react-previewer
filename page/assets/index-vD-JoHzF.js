const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/rspackBrowser-7Nsc6EIb.js","assets/preload-helper-JMREOW4W.js","assets/chunk-62oNxeRG.js"])))=>i.map(i=>d[i]);
import{i as e,t}from"./chunk-62oNxeRG.js";import{a as n,c as r,i,l as a,n as o,o as s,r as c,s as l,t as u,u as d}from"./preload-helper-JMREOW4W.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var f=t((e=>{var t=Symbol.for(`react.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.provider`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.iterator;function p(e){return typeof e!=`object`||!e?null:(e=f&&e[f]||e[`@@iterator`],typeof e==`function`?e:null)}var m={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},h=Object.assign,g={};function _(e,t,n){this.props=e,this.context=t,this.refs=g,this.updater=n||m}_.prototype.isReactComponent={},_.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`setState(...): takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},_.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function v(){}v.prototype=_.prototype;function y(e,t,n){this.props=e,this.context=t,this.refs=g,this.updater=n||m}var b=y.prototype=new v;b.constructor=y,h(b,_.prototype),b.isPureReactComponent=!0;var x=Array.isArray,S=Object.prototype.hasOwnProperty,C={current:null},w={key:!0,ref:!0,__self:!0,__source:!0};function T(e,n,r){var i,a={},o=null,s=null;if(n!=null)for(i in n.ref!==void 0&&(s=n.ref),n.key!==void 0&&(o=``+n.key),n)S.call(n,i)&&!w.hasOwnProperty(i)&&(a[i]=n[i]);var c=arguments.length-2;if(c===1)a.children=r;else if(1<c){for(var l=Array(c),u=0;u<c;u++)l[u]=arguments[u+2];a.children=l}if(e&&e.defaultProps)for(i in c=e.defaultProps,c)a[i]===void 0&&(a[i]=c[i]);return{$$typeof:t,type:e,key:o,ref:s,props:a,_owner:C.current}}function ee(e,n){return{$$typeof:t,type:e.type,key:n,ref:e.ref,props:e.props,_owner:e._owner}}function te(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function E(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var D=/\/+/g;function ne(e,t){return typeof e==`object`&&e&&e.key!=null?E(``+e.key):t.toString(36)}function re(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0}}if(c)return c=e,o=o(c),e=a===``?`.`+ne(c,0):a,x(o)?(i=``,e!=null&&(i=e.replace(D,`$&/`)+`/`),re(o,r,i,``,function(e){return e})):o!=null&&(te(o)&&(o=ee(o,i+(!o.key||c&&c.key===o.key?``:(``+o.key).replace(D,`$&/`)+`/`)+e)),r.push(o)),1;if(c=0,a=a===``?`.`:a+`:`,x(e))for(var l=0;l<e.length;l++){s=e[l];var u=a+ne(s,l);c+=re(s,r,i,u,o)}else if(u=p(e),typeof u==`function`)for(e=u.call(e),l=0;!(s=e.next()).done;)s=s.value,u=a+ne(s,l++),c+=re(s,r,i,u,o);else if(s===`object`)throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`);return c}function O(e,t,n){if(e==null)return e;var r=[],i=0;return re(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ie(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var k={current:null},A={transition:null},ae={ReactCurrentDispatcher:k,ReactCurrentBatchConfig:A,ReactCurrentOwner:C};function oe(){throw Error(`act(...) is not supported in production builds of React.`)}e.Children={map:O,forEach:function(e,t,n){O(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return O(e,function(){t++}),t},toArray:function(e){return O(e,function(e){return e})||[]},only:function(e){if(!te(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}},e.Component=_,e.Fragment=r,e.Profiler=a,e.PureComponent=y,e.StrictMode=i,e.Suspense=l,e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ae,e.act=oe,e.cloneElement=function(e,n,r){if(e==null)throw Error(`React.cloneElement(...): The argument must be a React element, but you passed `+e+`.`);var i=h({},e.props),a=e.key,o=e.ref,s=e._owner;if(n!=null){if(n.ref!==void 0&&(o=n.ref,s=C.current),n.key!==void 0&&(a=``+n.key),e.type&&e.type.defaultProps)var c=e.type.defaultProps;for(l in n)S.call(n,l)&&!w.hasOwnProperty(l)&&(i[l]=n[l]===void 0&&c!==void 0?c[l]:n[l])}var l=arguments.length-2;if(l===1)i.children=r;else if(1<l){c=Array(l);for(var u=0;u<l;u++)c[u]=arguments[u+2];i.children=c}return{$$typeof:t,type:e.type,key:a,ref:o,props:i,_owner:s}},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:o,_context:e},e.Consumer=e},e.createElement=T,e.createFactory=function(e){var t=T.bind(null,e);return t.type=e,t},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=te,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ie}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=A.transition;A.transition={};try{e()}finally{A.transition=t}},e.unstable_act=oe,e.useCallback=function(e,t){return k.current.useCallback(e,t)},e.useContext=function(e){return k.current.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e){return k.current.useDeferredValue(e)},e.useEffect=function(e,t){return k.current.useEffect(e,t)},e.useId=function(){return k.current.useId()},e.useImperativeHandle=function(e,t,n){return k.current.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return k.current.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return k.current.useLayoutEffect(e,t)},e.useMemo=function(e,t){return k.current.useMemo(e,t)},e.useReducer=function(e,t,n){return k.current.useReducer(e,t,n)},e.useRef=function(e){return k.current.useRef(e)},e.useState=function(e){return k.current.useState(e)},e.useSyncExternalStore=function(e,t,n){return k.current.useSyncExternalStore(e,t,n)},e.useTransition=function(){return k.current.useTransition()},e.version=`18.3.1`})),p=t(((e,t)=>{t.exports=f()})),m=t((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=typeof setTimeout==`function`?setTimeout:null,_=typeof clearTimeout==`function`?clearTimeout:null,v=typeof setImmediate<`u`?setImmediate:null;typeof navigator<`u`&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function b(e){if(h=!1,y(e),!m)if(n(c)!==null)m=!0,O(x);else{var t=n(l);t!==null&&ie(b,t.startTime-e)}}function x(t,i){m=!1,h&&(h=!1,_(w),w=-1),p=!0;var a=f;try{for(y(i),d=n(c);d!==null&&(!(d.expirationTime>i)||t&&!te());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=i);i=e.unstable_now(),typeof s==`function`?d.callback=s:d===n(c)&&r(c),y(i)}else r(c);d=n(c)}if(d!==null)var u=!0;else{var g=n(l);g!==null&&ie(b,g.startTime-i),u=!1}return u}finally{d=null,f=a,p=!1}}var S=!1,C=null,w=-1,T=5,ee=-1;function te(){return!(e.unstable_now()-ee<T)}function E(){if(C!==null){var t=e.unstable_now();ee=t;var n=!0;try{n=C(!0,t)}finally{n?D():(S=!1,C=null)}}else S=!1}var D;if(typeof v==`function`)D=function(){v(E)};else if(typeof MessageChannel<`u`){var ne=new MessageChannel,re=ne.port2;ne.port1.onmessage=E,D=function(){re.postMessage(null)}}else D=function(){g(E,0)};function O(e){C=e,S||(S=!0,D())}function ie(t,n){w=g(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_continueExecution=function(){m||p||(m=!0,O(x))},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):T=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_getFirstCallbackNode=function(){return n(c)},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(_(w),w=-1):h=!0,ie(b,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,O(x))),r},e.unstable_shouldYield=te,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),h=t(((e,t)=>{t.exports=m()})),g=t((e=>{var t=p(),n=h();function r(e){for(var t=`https://reactjs.org/docs/error-decoder.html?invariant=`+e,n=1;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n]);return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}var i=new Set,a={};function o(e,t){s(e,t),s(e+`Capture`,t)}function s(e,t){for(a[e]=t,e=0;e<t.length;e++)i.add(t[e])}var c=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),l=Object.prototype.hasOwnProperty,u=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,d={},f={};function m(e){return l.call(f,e)?!0:l.call(d,e)?!1:u.test(e)?f[e]=!0:(d[e]=!0,!1)}function g(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case`function`:case`symbol`:return!0;case`boolean`:return r?!1:n===null?(e=e.toLowerCase().slice(0,5),e!==`data-`&&e!==`aria-`):!n.acceptsBooleans;default:return!1}}function _(e,t,n,r){if(t==null||g(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function v(e,t,n,r,i,a,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=o}var y={};`children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style`.split(` `).forEach(function(e){y[e]=new v(e,0,!1,e,null,!1,!1)}),[[`acceptCharset`,`accept-charset`],[`className`,`class`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`]].forEach(function(e){var t=e[0];y[t]=new v(t,1,!1,e[1],null,!1,!1)}),[`contentEditable`,`draggable`,`spellCheck`,`value`].forEach(function(e){y[e]=new v(e,2,!1,e.toLowerCase(),null,!1,!1)}),[`autoReverse`,`externalResourcesRequired`,`focusable`,`preserveAlpha`].forEach(function(e){y[e]=new v(e,2,!1,e,null,!1,!1)}),`allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope`.split(` `).forEach(function(e){y[e]=new v(e,3,!1,e.toLowerCase(),null,!1,!1)}),[`checked`,`multiple`,`muted`,`selected`].forEach(function(e){y[e]=new v(e,3,!0,e,null,!1,!1)}),[`capture`,`download`].forEach(function(e){y[e]=new v(e,4,!1,e,null,!1,!1)}),[`cols`,`rows`,`size`,`span`].forEach(function(e){y[e]=new v(e,6,!1,e,null,!1,!1)}),[`rowSpan`,`start`].forEach(function(e){y[e]=new v(e,5,!1,e.toLowerCase(),null,!1,!1)});var b=/[\-:]([a-z])/g;function x(e){return e[1].toUpperCase()}`accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height`.split(` `).forEach(function(e){var t=e.replace(b,x);y[t]=new v(t,1,!1,e,null,!1,!1)}),`xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type`.split(` `).forEach(function(e){var t=e.replace(b,x);y[t]=new v(t,1,!1,e,`http://www.w3.org/1999/xlink`,!1,!1)}),[`xml:base`,`xml:lang`,`xml:space`].forEach(function(e){var t=e.replace(b,x);y[t]=new v(t,1,!1,e,`http://www.w3.org/XML/1998/namespace`,!1,!1)}),[`tabIndex`,`crossOrigin`].forEach(function(e){y[e]=new v(e,1,!1,e.toLowerCase(),null,!1,!1)}),y.xlinkHref=new v(`xlinkHref`,1,!1,`xlink:href`,`http://www.w3.org/1999/xlink`,!0,!1),[`src`,`href`,`action`,`formAction`].forEach(function(e){y[e]=new v(e,1,!1,e.toLowerCase(),null,!0,!0)});function S(e,t,n,r){var i=y.hasOwnProperty(t)?y[t]:null;(i===null?r||!(2<t.length)||t[0]!==`o`&&t[0]!==`O`||t[1]!==`n`&&t[1]!==`N`:i.type!==0)&&(_(t,n,i,r)&&(n=null),r||i===null?m(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,``+n)):i.mustUseProperty?e[i.propertyName]=n===null?i.type===3?!1:``:n:(t=i.attributeName,r=i.attributeNamespace,n===null?e.removeAttribute(t):(i=i.type,n=i===3||i===4&&!0===n?``:``+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var C=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,w=Symbol.for(`react.element`),T=Symbol.for(`react.portal`),ee=Symbol.for(`react.fragment`),te=Symbol.for(`react.strict_mode`),E=Symbol.for(`react.profiler`),D=Symbol.for(`react.provider`),ne=Symbol.for(`react.context`),re=Symbol.for(`react.forward_ref`),O=Symbol.for(`react.suspense`),ie=Symbol.for(`react.suspense_list`),k=Symbol.for(`react.memo`),A=Symbol.for(`react.lazy`),ae=Symbol.for(`react.offscreen`),oe=Symbol.iterator;function se(e){return typeof e!=`object`||!e?null:(e=oe&&e[oe]||e[`@@iterator`],typeof e==`function`?e:null)}var j=Object.assign,ce;function le(e){if(ce===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);ce=t&&t[1]||``}return`
`+ce+e}var ue=!1;function de(e,t){if(!e||ue)return``;ue=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,`props`,{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(t,[])}catch(e){var r=e}Reflect.construct(e,[],t)}else{try{t.call()}catch(e){r=e}e.call(t.prototype)}else{try{throw Error()}catch(e){r=e}e()}}catch(t){if(t&&r&&typeof t.stack==`string`){for(var i=t.stack.split(`
`),a=r.stack.split(`
`),o=i.length-1,s=a.length-1;1<=o&&0<=s&&i[o]!==a[s];)s--;for(;1<=o&&0<=s;o--,s--)if(i[o]!==a[s]){if(o!==1||s!==1)do if(o--,s--,0>s||i[o]!==a[s]){var c=`
`+i[o].replace(` at new `,` at `);return e.displayName&&c.includes(`<anonymous>`)&&(c=c.replace(`<anonymous>`,e.displayName)),c}while(1<=o&&0<=s);break}}}finally{ue=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:``)?le(e):``}function fe(e){switch(e.tag){case 5:return le(e.type);case 16:return le(`Lazy`);case 13:return le(`Suspense`);case 19:return le(`SuspenseList`);case 0:case 2:case 15:return e=de(e.type,!1),e;case 11:return e=de(e.type.render,!1),e;case 1:return e=de(e.type,!0),e;default:return``}}function pe(e){if(e==null)return null;if(typeof e==`function`)return e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case ee:return`Fragment`;case T:return`Portal`;case E:return`Profiler`;case te:return`StrictMode`;case O:return`Suspense`;case ie:return`SuspenseList`}if(typeof e==`object`)switch(e.$$typeof){case ne:return(e.displayName||`Context`)+`.Consumer`;case D:return(e._context.displayName||`Context`)+`.Provider`;case re:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case k:return t=e.displayName||null,t===null?pe(e.type)||`Memo`:t;case A:t=e._payload,e=e._init;try{return pe(e(t))}catch{}}return null}function M(e){var t=e.type;switch(e.tag){case 24:return`Cache`;case 9:return(t.displayName||`Context`)+`.Consumer`;case 10:return(t._context.displayName||`Context`)+`.Provider`;case 18:return`DehydratedFragment`;case 11:return e=t.render,e=e.displayName||e.name||``,t.displayName||(e===``?`ForwardRef`:`ForwardRef(`+e+`)`);case 7:return`Fragment`;case 5:return t;case 4:return`Portal`;case 3:return`Root`;case 6:return`Text`;case 16:return pe(t);case 8:return t===te?`StrictMode`:`Mode`;case 22:return`Offscreen`;case 12:return`Profiler`;case 21:return`Scope`;case 13:return`Suspense`;case 19:return`SuspenseList`;case 25:return`TracingMarker`;case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t==`function`)return t.displayName||t.name||null;if(typeof t==`string`)return t}return null}function me(e){switch(typeof e){case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function he(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function ge(e){var t=he(e)?`checked`:`value`,n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=``+e[t];if(!e.hasOwnProperty(t)&&n!==void 0&&typeof n.get==`function`&&typeof n.set==`function`){var i=n.get,a=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){r=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(e){r=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function _e(e){e._valueTracker||=ge(e)}function ve(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=he(e)?e.checked?`true`:`false`:e.value),e=r,e===n?!1:(t.setValue(e),!0)}function ye(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}function be(e,t){var n=t.checked;return j({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function xe(e,t){var n=t.defaultValue==null?``:t.defaultValue,r=t.checked==null?t.defaultChecked:t.checked;n=me(t.value==null?n:t.value),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type===`checkbox`||t.type===`radio`?t.checked!=null:t.value!=null}}function Se(e,t){t=t.checked,t!=null&&S(e,`checked`,t,!1)}function Ce(e,t){Se(e,t);var n=me(t.value),r=t.type;if(n!=null)r===`number`?(n===0&&e.value===``||e.value!=n)&&(e.value=``+n):e.value!==``+n&&(e.value=``+n);else if(r===`submit`||r===`reset`){e.removeAttribute(`value`);return}t.hasOwnProperty(`value`)?Te(e,t.type,n):t.hasOwnProperty(`defaultValue`)&&Te(e,t.type,me(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function we(e,t,n){if(t.hasOwnProperty(`value`)||t.hasOwnProperty(`defaultValue`)){var r=t.type;if(!(r!==`submit`&&r!==`reset`||t.value!==void 0&&t.value!==null))return;t=``+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==``&&(e.name=``),e.defaultChecked=!!e._wrapperState.initialChecked,n!==``&&(e.name=n)}function Te(e,t,n){(t!==`number`||ye(e.ownerDocument)!==e)&&(n==null?e.defaultValue=``+e._wrapperState.initialValue:e.defaultValue!==``+n&&(e.defaultValue=``+n))}var Ee=Array.isArray;function De(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+me(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Oe(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(r(91));return j({},t,{value:void 0,defaultValue:void 0,children:``+e._wrapperState.initialValue})}function ke(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(r(92));if(Ee(n)){if(1<n.length)throw Error(r(93));n=n[0]}t=n}t??=``,n=t}e._wrapperState={initialValue:me(n)}}function Ae(e,t){var n=me(t.value),r=me(t.defaultValue);n!=null&&(n=``+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=``+r)}function je(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==``&&t!==null&&(e.value=t)}function Me(e){switch(e){case`svg`:return`http://www.w3.org/2000/svg`;case`math`:return`http://www.w3.org/1998/Math/MathML`;default:return`http://www.w3.org/1999/xhtml`}}function Ne(e,t){return e==null||e===`http://www.w3.org/1999/xhtml`?Me(t):e===`http://www.w3.org/2000/svg`&&t===`foreignObject`?`http://www.w3.org/1999/xhtml`:e}var Pe,Fe=function(e){return typeof MSApp<`u`&&MSApp.execUnsafeLocalFunction?function(t,n,r,i){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,i)})}:e}(function(e,t){if(e.namespaceURI!==`http://www.w3.org/2000/svg`||`innerHTML`in e)e.innerHTML=t;else{for(Pe||=document.createElement(`div`),Pe.innerHTML=`<svg>`+t.valueOf().toString()+`</svg>`,t=Pe.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function Ie(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Le={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Re=[`Webkit`,`ms`,`Moz`,`O`];Object.keys(Le).forEach(function(e){Re.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Le[t]=Le[e]})});function ze(e,t,n){return t==null||typeof t==`boolean`||t===``?``:n||typeof t!=`number`||t===0||Le.hasOwnProperty(e)&&Le[e]?(``+t).trim():t+`px`}function Be(e,t){for(var n in e=e.style,t)if(t.hasOwnProperty(n)){var r=n.indexOf(`--`)===0,i=ze(n,t[n],r);n===`float`&&(n=`cssFloat`),r?e.setProperty(n,i):e[n]=i}}var Ve=j({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function He(e,t){if(t){if(Ve[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(r(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(r(60));if(typeof t.dangerouslySetInnerHTML!=`object`||!(`__html`in t.dangerouslySetInnerHTML))throw Error(r(61))}if(t.style!=null&&typeof t.style!=`object`)throw Error(r(62))}}function Ue(e,t){if(e.indexOf(`-`)===-1)return typeof t.is==`string`;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var We=null;function Ge(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ke=null,qe=null,Je=null;function Ye(e){if(e=qi(e)){if(typeof Ke!=`function`)throw Error(r(280));var t=e.stateNode;t&&(t=Yi(t),Ke(e.stateNode,e.type,t))}}function Xe(e){qe?Je?Je.push(e):Je=[e]:qe=e}function Ze(){if(qe){var e=qe,t=Je;if(Je=qe=null,Ye(e),t)for(e=0;e<t.length;e++)Ye(t[e])}}function Qe(e,t){return e(t)}function $e(){}var et=!1;function tt(e,t,n){if(et)return e(t,n);et=!0;try{return Qe(e,t,n)}finally{et=!1,(qe!==null||Je!==null)&&($e(),Ze())}}function nt(e,t){var n=e.stateNode;if(n===null)return null;var i=Yi(n);if(i===null)return null;n=i[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(i=!i.disabled)||(e=e.type,i=!(e===`button`||e===`input`||e===`select`||e===`textarea`)),e=!i;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(r(231,t,typeof n));return n}var rt=!1;if(c)try{var it={};Object.defineProperty(it,`passive`,{get:function(){rt=!0}}),window.addEventListener(`test`,it,it),window.removeEventListener(`test`,it,it)}catch{rt=!1}function at(e,t,n,r,i,a,o,s,c){var l=Array.prototype.slice.call(arguments,3);try{t.apply(n,l)}catch(e){this.onError(e)}}var ot=!1,st=null,ct=!1,lt=null,ut={onError:function(e){ot=!0,st=e}};function dt(e,t,n,r,i,a,o,s,c){ot=!1,st=null,at.apply(ut,arguments)}function ft(e,t,n,i,a,o,s,c,l){if(dt.apply(this,arguments),ot){if(ot){var u=st;ot=!1,st=null}else throw Error(r(198));ct||(ct=!0,lt=u)}}function pt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function mt(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function ht(e){if(pt(e)!==e)throw Error(r(188))}function gt(e){var t=e.alternate;if(!t){if(t=pt(e),t===null)throw Error(r(188));return t===e?e:null}for(var n=e,i=t;;){var a=n.return;if(a===null)break;var o=a.alternate;if(o===null){if(i=a.return,i!==null){n=i;continue}break}if(a.child===o.child){for(o=a.child;o;){if(o===n)return ht(a),e;if(o===i)return ht(a),t;o=o.sibling}throw Error(r(188))}if(n.return!==i.return)n=a,i=o;else{for(var s=!1,c=a.child;c;){if(c===n){s=!0,n=a,i=o;break}if(c===i){s=!0,i=a,n=o;break}c=c.sibling}if(!s){for(c=o.child;c;){if(c===n){s=!0,n=o,i=a;break}if(c===i){s=!0,i=o,n=a;break}c=c.sibling}if(!s)throw Error(r(189))}}if(n.alternate!==i)throw Error(r(190))}if(n.tag!==3)throw Error(r(188));return n.stateNode.current===n?e:t}function _t(e){return e=gt(e),e===null?null:vt(e)}function vt(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=vt(e);if(t!==null)return t;e=e.sibling}return null}var yt=n.unstable_scheduleCallback,bt=n.unstable_cancelCallback,xt=n.unstable_shouldYield,St=n.unstable_requestPaint,N=n.unstable_now,Ct=n.unstable_getCurrentPriorityLevel,wt=n.unstable_ImmediatePriority,Tt=n.unstable_UserBlockingPriority,Et=n.unstable_NormalPriority,Dt=n.unstable_LowPriority,Ot=n.unstable_IdlePriority,kt=null,At=null;function jt(e){if(At&&typeof At.onCommitFiberRoot==`function`)try{At.onCommitFiberRoot(kt,e,void 0,(e.current.flags&128)==128)}catch{}}var Mt=Math.clz32?Math.clz32:Ft,Nt=Math.log,Pt=Math.LN2;function Ft(e){return e>>>=0,e===0?32:31-(Nt(e)/Pt|0)|0}var It=64,Lt=4194304;function Rt(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function zt(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,i=e.suspendedLanes,a=e.pingedLanes,o=n&268435455;if(o!==0){var s=o&~i;s===0?(a&=o,a!==0&&(r=Rt(a))):r=Rt(s)}else o=n&~i,o===0?a!==0&&(r=Rt(a)):r=Rt(o);if(r===0)return 0;if(t!==0&&t!==r&&(t&i)===0&&(i=r&-r,a=t&-t,i>=a||i===16&&a&4194240))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Mt(t),i=1<<n,r|=e[n],t&=~i;return r}function Bt(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Vt(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes;0<a;){var o=31-Mt(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=Bt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}}function Ht(e){return e=e.pendingLanes&-1073741825,e===0?e&1073741824?1073741824:0:e}function Ut(){var e=It;return It<<=1,!(It&4194240)&&(It=64),e}function Wt(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Gt(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Mt(t),e[t]=n}function Kt(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var i=31-Mt(n),a=1<<i;t[i]=0,r[i]=-1,e[i]=-1,n&=~a}}function qt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Mt(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}var P=0;function Jt(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Yt,Xt,Zt,Qt,$t,en=!1,tn=[],nn=null,rn=null,an=null,on=new Map,sn=new Map,cn=[],ln=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit`.split(` `);function un(e,t){switch(e){case`focusin`:case`focusout`:nn=null;break;case`dragenter`:case`dragleave`:rn=null;break;case`mouseover`:case`mouseout`:an=null;break;case`pointerover`:case`pointerout`:on.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:sn.delete(t.pointerId)}}function dn(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=qi(t),t!==null&&Xt(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function fn(e,t,n,r,i){switch(t){case`focusin`:return nn=dn(nn,e,t,n,r,i),!0;case`dragenter`:return rn=dn(rn,e,t,n,r,i),!0;case`mouseover`:return an=dn(an,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return on.set(a,dn(on.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,sn.set(a,dn(sn.get(a)||null,e,t,n,r,i)),!0}return!1}function pn(e){var t=Ki(e.target);if(t!==null){var n=pt(t);if(n!==null){if(t=n.tag,t===13){if(t=mt(n),t!==null){e.blockedOn=t,$t(e.priority,function(){Zt(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function mn(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Tn(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);We=r,n.target.dispatchEvent(r),We=null}else return t=qi(n),t!==null&&Xt(t),e.blockedOn=n,!1;t.shift()}return!0}function hn(e,t,n){mn(e)&&n.delete(t)}function gn(){en=!1,nn!==null&&mn(nn)&&(nn=null),rn!==null&&mn(rn)&&(rn=null),an!==null&&mn(an)&&(an=null),on.forEach(hn),sn.forEach(hn)}function _n(e,t){e.blockedOn===t&&(e.blockedOn=null,en||(en=!0,n.unstable_scheduleCallback(n.unstable_NormalPriority,gn)))}function vn(e){function t(t){return _n(t,e)}if(0<tn.length){_n(tn[0],e);for(var n=1;n<tn.length;n++){var r=tn[n];r.blockedOn===e&&(r.blockedOn=null)}}for(nn!==null&&_n(nn,e),rn!==null&&_n(rn,e),an!==null&&_n(an,e),on.forEach(t),sn.forEach(t),n=0;n<cn.length;n++)r=cn[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<cn.length&&(n=cn[0],n.blockedOn===null);)pn(n),n.blockedOn===null&&cn.shift()}var yn=C.ReactCurrentBatchConfig,bn=!0;function xn(e,t,n,r){var i=P,a=yn.transition;yn.transition=null;try{P=1,Cn(e,t,n,r)}finally{P=i,yn.transition=a}}function Sn(e,t,n,r){var i=P,a=yn.transition;yn.transition=null;try{P=4,Cn(e,t,n,r)}finally{P=i,yn.transition=a}}function Cn(e,t,n,r){if(bn){var i=Tn(e,t,n,r);if(i===null)vi(e,t,r,wn,n),un(e,r);else if(fn(i,e,t,n,r))r.stopPropagation();else if(un(e,r),t&4&&-1<ln.indexOf(e)){for(;i!==null;){var a=qi(i);if(a!==null&&Yt(a),a=Tn(e,t,n,r),a===null&&vi(e,t,r,wn,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else vi(e,t,r,null,n)}}var wn=null;function Tn(e,t,n,r){if(wn=null,e=Ge(r),e=Ki(e),e!==null)if(t=pt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=mt(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return wn=e,null}function En(e){switch(e){case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 1;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`toggle`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 4;case`message`:switch(Ct()){case wt:return 1;case Tt:return 4;case Et:case Dt:return 16;case Ot:return 536870912;default:return 16}default:return 16}}var Dn=null,On=null,kn=null;function An(){if(kn)return kn;var e,t=On,n=t.length,r,i=`value`in Dn?Dn.value:Dn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return kn=i.slice(e,1<r?1-r:void 0)}function jn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Mn(){return!0}function Nn(){return!1}function Pn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Mn:Nn,this.isPropagationStopped=Nn,this}return j(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Mn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Mn)},persist:function(){},isPersistent:Mn}),t}var Fn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},In=Pn(Fn),Ln=j({},Fn,{view:0,detail:0}),Rn=Pn(Ln),zn,Bn,Vn,Hn=j({},Ln,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:$n,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Vn&&(Vn&&e.type===`mousemove`?(zn=e.screenX-Vn.screenX,Bn=e.screenY-Vn.screenY):Bn=zn=0,Vn=e),zn)},movementY:function(e){return`movementY`in e?e.movementY:Bn}}),Un=Pn(Hn),Wn=Pn(j({},Hn,{dataTransfer:0})),Gn=Pn(j({},Ln,{relatedTarget:0})),Kn=Pn(j({},Fn,{animationName:0,elapsedTime:0,pseudoElement:0})),qn=Pn(j({},Fn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Jn=Pn(j({},Fn,{data:0})),Yn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Xn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Zn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Qn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Zn[e])?!!t[e]:!1}function $n(){return Qn}var er=Pn(j({},Ln,{key:function(e){if(e.key){var t=Yn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=jn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Xn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:$n,charCode:function(e){return e.type===`keypress`?jn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?jn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),tr=Pn(j({},Hn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),nr=Pn(j({},Ln,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:$n})),rr=Pn(j({},Fn,{propertyName:0,elapsedTime:0,pseudoElement:0})),ir=Pn(j({},Hn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),ar=[9,13,27,32],or=c&&`CompositionEvent`in window,sr=null;c&&`documentMode`in document&&(sr=document.documentMode);var cr=c&&`TextEvent`in window&&!sr,lr=c&&(!or||sr&&8<sr&&11>=sr),ur=` `,dr=!1;function fr(e,t){switch(e){case`keyup`:return ar.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function pr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var mr=!1;function hr(e,t){switch(e){case`compositionend`:return pr(t);case`keypress`:return t.which===32?(dr=!0,ur):null;case`textInput`:return e=t.data,e===ur&&dr?null:e;default:return null}}function gr(e,t){if(mr)return e===`compositionend`||!or&&fr(e,t)?(e=An(),kn=On=Dn=null,mr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return lr&&t.locale!==`ko`?null:t.data;default:return null}}var _r={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function vr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!_r[e.type]:t===`textarea`}function yr(e,t,n,r){Xe(r),t=bi(t,`onChange`),0<t.length&&(n=new In(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var br=null,xr=null;function Sr(e){pi(e,0)}function Cr(e){if(ve(Ji(e)))return e}function wr(e,t){if(e===`change`)return t}var Tr=!1;if(c){var Er;if(c){var Dr=`oninput`in document;if(!Dr){var Or=document.createElement(`div`);Or.setAttribute(`oninput`,`return;`),Dr=typeof Or.oninput==`function`}Er=Dr}else Er=!1;Tr=Er&&(!document.documentMode||9<document.documentMode)}function kr(){br&&(br.detachEvent(`onpropertychange`,Ar),xr=br=null)}function Ar(e){if(e.propertyName===`value`&&Cr(xr)){var t=[];yr(t,xr,e,Ge(e)),tt(Sr,t)}}function jr(e,t,n){e===`focusin`?(kr(),br=t,xr=n,br.attachEvent(`onpropertychange`,Ar)):e===`focusout`&&kr()}function Mr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return Cr(xr)}function Nr(e,t){if(e===`click`)return Cr(t)}function Pr(e,t){if(e===`input`||e===`change`)return Cr(t)}function Fr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Ir=typeof Object.is==`function`?Object.is:Fr;function Lr(e,t){if(Ir(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!l.call(t,i)||!Ir(e[i],t[i]))return!1}return!0}function Rr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function zr(e,t){var n=Rr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Rr(n)}}function Br(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Br(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Vr(){for(var e=window,t=ye();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=ye(e.document)}return t}function Hr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}function Ur(e){var t=Vr(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Br(n.ownerDocument.documentElement,n)){if(r!==null&&Hr(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),`selectionStart`in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=n.textContent.length,a=Math.min(r.start,i);r=r.end===void 0?a:Math.min(r.end,i),!e.extend&&a>r&&(i=r,r=a,a=i),i=zr(n,a);var o=zr(n,r);i&&o&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),a>r?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus==`function`&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Wr=c&&`documentMode`in document&&11>=document.documentMode,Gr=null,Kr=null,qr=null,Jr=!1;function Yr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Jr||Gr==null||Gr!==ye(r)||(r=Gr,`selectionStart`in r&&Hr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),qr&&Lr(qr,r)||(qr=r,r=bi(Kr,`onSelect`),0<r.length&&(t=new In(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Gr)))}function Xr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Zr={animationend:Xr(`Animation`,`AnimationEnd`),animationiteration:Xr(`Animation`,`AnimationIteration`),animationstart:Xr(`Animation`,`AnimationStart`),transitionend:Xr(`Transition`,`TransitionEnd`)},Qr={},$r={};c&&($r=document.createElement(`div`).style,`AnimationEvent`in window||(delete Zr.animationend.animation,delete Zr.animationiteration.animation,delete Zr.animationstart.animation),`TransitionEvent`in window||delete Zr.transitionend.transition);function ei(e){if(Qr[e])return Qr[e];if(!Zr[e])return e;var t=Zr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in $r)return Qr[e]=t[n];return e}var ti=ei(`animationend`),ni=ei(`animationiteration`),ri=ei(`animationstart`),ii=ei(`transitionend`),ai=new Map,oi=`abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);function si(e,t){ai.set(e,t),o(t,[e])}for(var ci=0;ci<oi.length;ci++){var li=oi[ci];si(li.toLowerCase(),`on`+(li[0].toUpperCase()+li.slice(1)))}si(ti,`onAnimationEnd`),si(ni,`onAnimationIteration`),si(ri,`onAnimationStart`),si(`dblclick`,`onDoubleClick`),si(`focusin`,`onFocus`),si(`focusout`,`onBlur`),si(ii,`onTransitionEnd`),s(`onMouseEnter`,[`mouseout`,`mouseover`]),s(`onMouseLeave`,[`mouseout`,`mouseover`]),s(`onPointerEnter`,[`pointerout`,`pointerover`]),s(`onPointerLeave`,[`pointerout`,`pointerover`]),o(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),o(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),o(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),o(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),o(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),o(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var ui=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),di=new Set(`cancel close invalid load scroll toggle`.split(` `).concat(ui));function fi(e,t,n){var r=e.type||`unknown-event`;e.currentTarget=n,ft(r,t,void 0,e),e.currentTarget=null}function pi(e,t){t=(t&4)!=0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;fi(i,s,l),a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;fi(i,s,l),a=c}}}if(ct)throw e=lt,ct=!1,lt=null,e}function F(e,t){var n=t[Ui];n===void 0&&(n=t[Ui]=new Set);var r=e+`__bubble`;n.has(r)||(_i(t,e,2,!1),n.add(r))}function mi(e,t,n){var r=0;t&&(r|=4),_i(n,e,r,t)}var hi=`_reactListening`+Math.random().toString(36).slice(2);function gi(e){if(!e[hi]){e[hi]=!0,i.forEach(function(t){t!==`selectionchange`&&(di.has(t)||mi(t,!1,e),mi(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[hi]||(t[hi]=!0,mi(`selectionchange`,!1,t))}}function _i(e,t,n,r){switch(En(t)){case 1:var i=xn;break;case 4:i=Sn;break;default:i=Cn}n=i.bind(null,t,n,e),i=void 0,!rt||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function vi(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var s=r.stateNode.containerInfo;if(s===i||s.nodeType===8&&s.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var c=o.tag;if((c===3||c===4)&&(c=o.stateNode.containerInfo,c===i||c.nodeType===8&&c.parentNode===i))return;o=o.return}for(;s!==null;){if(o=Ki(s),o===null)return;if(c=o.tag,c===5||c===6){r=a=o;continue a}s=s.parentNode}}r=r.return}tt(function(){var r=a,i=Ge(n),o=[];a:{var s=ai.get(e);if(s!==void 0){var c=In,l=e;switch(e){case`keypress`:if(jn(n)===0)break a;case`keydown`:case`keyup`:c=er;break;case`focusin`:l=`focus`,c=Gn;break;case`focusout`:l=`blur`,c=Gn;break;case`beforeblur`:case`afterblur`:c=Gn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:c=Un;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:c=Wn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:c=nr;break;case ti:case ni:case ri:c=Kn;break;case ii:c=rr;break;case`scroll`:c=Rn;break;case`wheel`:c=ir;break;case`copy`:case`cut`:case`paste`:c=qn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:c=tr}var u=(t&4)!=0,d=!u&&e===`scroll`,f=u?s===null?null:s+`Capture`:s;u=[];for(var p=r,m;p!==null;){m=p;var h=m.stateNode;if(m.tag===5&&h!==null&&(m=h,f!==null&&(h=nt(p,f),h!=null&&u.push(yi(p,h,m)))),d)break;p=p.return}0<u.length&&(s=new c(s,l,null,n,i),o.push({event:s,listeners:u}))}}if(!(t&7)){a:{if(s=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,s&&n!==We&&(l=n.relatedTarget||n.fromElement)&&(Ki(l)||l[Hi]))break a;if((c||s)&&(s=i.window===i?i:(s=i.ownerDocument)?s.defaultView||s.parentWindow:window,c?(l=n.relatedTarget||n.toElement,c=r,l=l?Ki(l):null,l!==null&&(d=pt(l),l!==d||l.tag!==5&&l.tag!==6)&&(l=null)):(c=null,l=r),c!==l)){if(u=Un,h=`onMouseLeave`,f=`onMouseEnter`,p=`mouse`,(e===`pointerout`||e===`pointerover`)&&(u=tr,h=`onPointerLeave`,f=`onPointerEnter`,p=`pointer`),d=c==null?s:Ji(c),m=l==null?s:Ji(l),s=new u(h,p+`leave`,c,n,i),s.target=d,s.relatedTarget=m,h=null,Ki(i)===r&&(u=new u(f,p+`enter`,l,n,i),u.target=m,u.relatedTarget=d,h=u),d=h,c&&l)b:{for(u=c,f=l,p=0,m=u;m;m=xi(m))p++;for(m=0,h=f;h;h=xi(h))m++;for(;0<p-m;)u=xi(u),p--;for(;0<m-p;)f=xi(f),m--;for(;p--;){if(u===f||f!==null&&u===f.alternate)break b;u=xi(u),f=xi(f)}u=null}else u=null;c!==null&&Si(o,s,c,u,!1),l!==null&&d!==null&&Si(o,d,l,u,!0)}}a:{if(s=r?Ji(r):window,c=s.nodeName&&s.nodeName.toLowerCase(),c===`select`||c===`input`&&s.type===`file`)var g=wr;else if(vr(s))if(Tr)g=Pr;else{g=Mr;var _=jr}else (c=s.nodeName)&&c.toLowerCase()===`input`&&(s.type===`checkbox`||s.type===`radio`)&&(g=Nr);if(g&&=g(e,r)){yr(o,g,n,i);break a}_&&_(e,s,r),e===`focusout`&&(_=s._wrapperState)&&_.controlled&&s.type===`number`&&Te(s,`number`,s.value)}switch(_=r?Ji(r):window,e){case`focusin`:(vr(_)||_.contentEditable===`true`)&&(Gr=_,Kr=r,qr=null);break;case`focusout`:qr=Kr=Gr=null;break;case`mousedown`:Jr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Jr=!1,Yr(o,n,i);break;case`selectionchange`:if(Wr)break;case`keydown`:case`keyup`:Yr(o,n,i)}var v;if(or)b:{switch(e){case`compositionstart`:var y=`onCompositionStart`;break b;case`compositionend`:y=`onCompositionEnd`;break b;case`compositionupdate`:y=`onCompositionUpdate`;break b}y=void 0}else mr?fr(e,n)&&(y=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(y=`onCompositionStart`);y&&(lr&&n.locale!==`ko`&&(mr||y!==`onCompositionStart`?y===`onCompositionEnd`&&mr&&(v=An()):(Dn=i,On=`value`in Dn?Dn.value:Dn.textContent,mr=!0)),_=bi(r,y),0<_.length&&(y=new Jn(y,e,null,n,i),o.push({event:y,listeners:_}),v?y.data=v:(v=pr(n),v!==null&&(y.data=v)))),(v=cr?hr(e,n):gr(e,n))&&(r=bi(r,`onBeforeInput`),0<r.length&&(i=new Jn(`onBeforeInput`,`beforeinput`,null,n,i),o.push({event:i,listeners:r}),i.data=v))}pi(o,t)})}function yi(e,t,n){return{instance:e,listener:t,currentTarget:n}}function bi(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;i.tag===5&&a!==null&&(i=a,a=nt(e,n),a!=null&&r.unshift(yi(e,a,i)),a=nt(e,t),a!=null&&r.push(yi(e,a,i))),e=e.return}return r}function xi(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Si(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(c!==null&&c===r)break;s.tag===5&&l!==null&&(s=l,i?(c=nt(n,a),c!=null&&o.unshift(yi(n,c,s))):i||(c=nt(n,a),c!=null&&o.push(yi(n,c,s)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Ci=/\r\n?/g,wi=/\u0000|\uFFFD/g;function Ti(e){return(typeof e==`string`?e:``+e).replace(Ci,`
`).replace(wi,``)}function Ei(e,t,n){if(t=Ti(t),Ti(e)!==t&&n)throw Error(r(425))}function Di(){}var Oi=null,ki=null;function Ai(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var ji=typeof setTimeout==`function`?setTimeout:void 0,Mi=typeof clearTimeout==`function`?clearTimeout:void 0,Ni=typeof Promise==`function`?Promise:void 0,Pi=typeof queueMicrotask==`function`?queueMicrotask:Ni===void 0?ji:function(e){return Ni.resolve(null).then(e).catch(Fi)};function Fi(e){setTimeout(function(){throw e})}function Ii(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n===`/$`){if(r===0){e.removeChild(i),vn(t);return}r--}else n!==`$`&&n!==`$?`&&n!==`$!`||r++;n=i}while(n);vn(t)}function Li(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`)break;if(t===`/$`)return null}}return e}function Ri(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`){if(t===0)return e;t--}else n===`/$`&&t++}e=e.previousSibling}return null}var zi=Math.random().toString(36).slice(2),Bi=`__reactFiber$`+zi,Vi=`__reactProps$`+zi,Hi=`__reactContainer$`+zi,Ui=`__reactEvents$`+zi,Wi=`__reactListeners$`+zi,Gi=`__reactHandles$`+zi;function Ki(e){var t=e[Bi];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Hi]||n[Bi]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Ri(e);e!==null;){if(n=e[Bi])return n;e=Ri(e)}return t}e=n,n=e.parentNode}return null}function qi(e){return e=e[Bi]||e[Hi],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Ji(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(r(33))}function Yi(e){return e[Vi]||null}var Xi=[],Zi=-1;function Qi(e){return{current:e}}function I(e){0>Zi||(e.current=Xi[Zi],Xi[Zi]=null,Zi--)}function L(e,t){Zi++,Xi[Zi]=e.current,e.current=t}var $i={},R=Qi($i),ea=Qi(!1),ta=$i;function na(e,t){var n=e.type.contextTypes;if(!n)return $i;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var i={},a;for(a in n)i[a]=t[a];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function ra(e){return e=e.childContextTypes,e!=null}function ia(){I(ea),I(R)}function aa(e,t,n){if(R.current!==$i)throw Error(r(168));L(R,t),L(ea,n)}function oa(e,t,n){var i=e.stateNode;if(t=t.childContextTypes,typeof i.getChildContext!=`function`)return n;for(var a in i=i.getChildContext(),i)if(!(a in t))throw Error(r(108,M(e)||`Unknown`,a));return j({},n,i)}function sa(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||$i,ta=R.current,L(R,e),L(ea,ea.current),!0}function ca(e,t,n){var i=e.stateNode;if(!i)throw Error(r(169));n?(e=oa(e,t,ta),i.__reactInternalMemoizedMergedChildContext=e,I(ea),I(R),L(R,e)):I(ea),L(ea,n)}var la=null,ua=!1,da=!1;function fa(e){la===null?la=[e]:la.push(e)}function pa(e){ua=!0,fa(e)}function ma(){if(!da&&la!==null){da=!0;var e=0,t=P;try{var n=la;for(P=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}la=null,ua=!1}catch(t){throw la!==null&&(la=la.slice(e+1)),yt(wt,ma),t}finally{P=t,da=!1}}return null}var ha=[],ga=0,_a=null,va=0,ya=[],ba=0,xa=null,Sa=1,Ca=``;function wa(e,t){ha[ga++]=va,ha[ga++]=_a,_a=e,va=t}function Ta(e,t,n){ya[ba++]=Sa,ya[ba++]=Ca,ya[ba++]=xa,xa=e;var r=Sa;e=Ca;var i=32-Mt(r)-1;r&=~(1<<i),n+=1;var a=32-Mt(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Sa=1<<32-Mt(t)+i|n<<i|r,Ca=a+e}else Sa=1<<a|n<<i|r,Ca=e}function Ea(e){e.return!==null&&(wa(e,1),Ta(e,1,0))}function Da(e){for(;e===_a;)_a=ha[--ga],ha[ga]=null,va=ha[--ga],ha[ga]=null;for(;e===xa;)xa=ya[--ba],ya[ba]=null,Ca=ya[--ba],ya[ba]=null,Sa=ya[--ba],ya[ba]=null}var Oa=null,ka=null,z=!1,Aa=null;function ja(e,t){var n=Kl(5,null,null,0);n.elementType=`DELETED`,n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function Ma(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t===null?!1:(e.stateNode=t,Oa=e,ka=Li(t.firstChild),!0);case 6:return t=e.pendingProps===``||t.nodeType!==3?null:t,t===null?!1:(e.stateNode=t,Oa=e,ka=null,!0);case 13:return t=t.nodeType===8?t:null,t===null?!1:(n=xa===null?null:{id:Sa,overflow:Ca},e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Kl(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Oa=e,ka=null,!0);default:return!1}}function Na(e){return(e.mode&1)!=0&&(e.flags&128)==0}function Pa(e){if(z){var t=ka;if(t){var n=t;if(!Ma(e,t)){if(Na(e))throw Error(r(418));t=Li(n.nextSibling);var i=Oa;t&&Ma(e,t)?ja(i,n):(e.flags=e.flags&-4097|2,z=!1,Oa=e)}}else{if(Na(e))throw Error(r(418));e.flags=e.flags&-4097|2,z=!1,Oa=e}}}function Fa(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Oa=e}function Ia(e){if(e!==Oa)return!1;if(!z)return Fa(e),z=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!==`head`&&t!==`body`&&!Ai(e.type,e.memoizedProps)),t&&=ka){if(Na(e))throw La(),Error(r(418));for(;t;)ja(e,t),t=Li(t.nextSibling)}if(Fa(e),e.tag===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(r(317));a:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`){if(t===0){ka=Li(e.nextSibling);break a}t--}else n!==`$`&&n!==`$!`&&n!==`$?`||t++}e=e.nextSibling}ka=null}}else ka=Oa?Li(e.stateNode.nextSibling):null;return!0}function La(){for(var e=ka;e;)e=Li(e.nextSibling)}function Ra(){ka=Oa=null,z=!1}function za(e){Aa===null?Aa=[e]:Aa.push(e)}var Ba=C.ReactCurrentBatchConfig;function Va(e,t,n){if(e=n.ref,e!==null&&typeof e!=`function`&&typeof e!=`object`){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(r(309));var i=n.stateNode}if(!i)throw Error(r(147,e));var a=i,o=``+e;return t!==null&&t.ref!==null&&typeof t.ref==`function`&&t.ref._stringRef===o?t.ref:(t=function(e){var t=a.refs;e===null?delete t[o]:t[o]=e},t._stringRef=o,t)}if(typeof e!=`string`)throw Error(r(284));if(!n._owner)throw Error(r(290,e))}return e}function Ha(e,t){throw e=Object.prototype.toString.call(t),Error(r(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e))}function Ua(e){var t=e._init;return t(e._payload)}function Wa(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function i(e,t){for(e=new Map;t!==null;)t.key===null?e.set(t.index,t):e.set(t.key,t),t=t.sibling;return e}function a(e,t){return e=Yl(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=2,n):(r=r.index,r<n?(t.flags|=2,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=2),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=$l(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===ee?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===A&&Ua(i)===t.type)?(r=a(t,n.props),r.ref=Va(e,t,n),r.return=e,r):(r=Xl(n.type,n.key,n.props,null,e.mode,r),r.ref=Va(e,t,n),r.return=e,r)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=eu(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=Zl(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`)return t=$l(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case w:return n=Xl(t.type,t.key,t.props,null,e.mode,n),n.ref=Va(e,null,t),n.return=e,n;case T:return t=eu(t,e.mode,n),t.return=e,t;case A:var r=t._init;return f(e,r(t._payload),n)}if(Ee(t)||se(t))return t=Zl(t,e.mode,n,null),t.return=e,t;Ha(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case w:return n.key===i?l(e,t,n,r):null;case T:return n.key===i?u(e,t,n,r):null;case A:return i=n._init,p(e,t,i(n._payload),r)}if(Ee(n)||se(n))return i===null?d(e,t,n,r,null):null;Ha(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case w:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case T:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case A:var a=r._init;return m(e,t,n,a(r._payload),i)}if(Ee(r)||se(r))return e=e.get(n)||null,d(t,e,r,i,null);Ha(t,r)}return null}function h(r,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(r,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(r,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(r,d),z&&wa(r,h),l;if(d===null){for(;h<s.length;h++)d=f(r,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return z&&wa(r,h),l}for(d=i(r,d);h<s.length;h++)g=m(d,r,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(r,e)}),z&&wa(r,h),l}function g(a,s,c,l){var u=se(c);if(typeof u!=`function`)throw Error(r(150));if(c=u.call(c),c==null)throw Error(r(151));for(var d=u=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),z&&wa(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return z&&wa(a,g),u}for(h=i(a,h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),z&&wa(a,g),u}function _(e,r,i,o){if(typeof i==`object`&&i&&i.type===ee&&i.key===null&&(i=i.props.children),typeof i==`object`&&i){switch(i.$$typeof){case w:a:{for(var c=i.key,l=r;l!==null;){if(l.key===c){if(c=i.type,c===ee){if(l.tag===7){n(e,l.sibling),r=a(l,i.props.children),r.return=e,e=r;break a}}else if(l.elementType===c||typeof c==`object`&&c&&c.$$typeof===A&&Ua(c)===l.type){n(e,l.sibling),r=a(l,i.props),r.ref=Va(e,l,i),r.return=e,e=r;break a}n(e,l);break}else t(e,l);l=l.sibling}i.type===ee?(r=Zl(i.props.children,e.mode,o,i.key),r.return=e,e=r):(o=Xl(i.type,i.key,i.props,null,e.mode,o),o.ref=Va(e,r,i),o.return=e,e=o)}return s(e);case T:a:{for(l=i.key;r!==null;){if(r.key===l)if(r.tag===4&&r.stateNode.containerInfo===i.containerInfo&&r.stateNode.implementation===i.implementation){n(e,r.sibling),r=a(r,i.children||[]),r.return=e,e=r;break a}else{n(e,r);break}else t(e,r);r=r.sibling}r=eu(i,e.mode,o),r.return=e,e=r}return s(e);case A:return l=i._init,_(e,r,l(i._payload),o)}if(Ee(i))return h(e,r,i,o);if(se(i))return g(e,r,i,o);Ha(e,i)}return typeof i==`string`&&i!==``||typeof i==`number`?(i=``+i,r!==null&&r.tag===6?(n(e,r.sibling),r=a(r,i),r.return=e,e=r):(n(e,r),r=$l(i,e.mode,o),r.return=e,e=r),s(e)):n(e,r)}return _}var Ga=Wa(!0),Ka=Wa(!1),qa=Qi(null),Ja=null,Ya=null,Xa=null;function Za(){Xa=Ya=Ja=null}function Qa(e){var t=qa.current;I(qa),e._currentValue=t}function $a(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function eo(e,t){Ja=e,Xa=Ya=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(zs=!0),e.firstContext=null)}function to(e){var t=e._currentValue;if(Xa!==e)if(e={context:e,memoizedValue:t,next:null},Ya===null){if(Ja===null)throw Error(r(308));Ya=e,Ja.dependencies={lanes:0,firstContext:e}}else Ya=Ya.next=e;return t}var no=null;function ro(e){no===null?no=[e]:no.push(e)}function io(e,t,n,r){var i=t.interleaved;return i===null?(n.next=n,ro(t)):(n.next=i.next,i.next=n),t.interleaved=n,ao(e,r)}function ao(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var oo=!1;function so(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function co(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function lo(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function uo(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,J&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,ao(e,n)}return i=r.interleaved,i===null?(t.next=t,ro(r)):(t.next=i.next,i.next=t),r.interleaved=t,ao(e,n)}function fo(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194240)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,qt(e,n)}}function po(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function mo(e,t,n,r){var i=e.updateQueue;oo=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane,p=s.eventTime;if((r&f)===f){u!==null&&(u=u.next={eventTime:p,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});a:{var m=e,h=s;switch(f=t,p=n,h.tag){case 1:if(m=h.payload,typeof m==`function`){d=m.call(p,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=h.payload,f=typeof m==`function`?m.call(p,d,f):m,f==null)break a;d=j({},d,f);break a;case 2:oo=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,f=i.effects,f===null?i.effects=[s]:f.push(s))}else p={eventTime:p,lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;f=s,s=f.next,f.next=null,i.lastBaseUpdate=f,i.shared.pending=null}}while(1);if(u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,t=i.shared.interleaved,t!==null){i=t;do o|=i.lane,i=i.next;while(i!==t)}else a===null&&(i.shared.lanes=0);Yc|=o,e.lanes=o,e.memoizedState=d}}function ho(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var i=e[t],a=i.callback;if(a!==null){if(i.callback=null,i=n,typeof a!=`function`)throw Error(r(191,a));a.call(i)}}}var go={},_o=Qi(go),vo=Qi(go),yo=Qi(go);function bo(e){if(e===go)throw Error(r(174));return e}function xo(e,t){switch(L(yo,t),L(vo,e),L(_o,go),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Ne(null,``);break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Ne(t,e)}I(_o),L(_o,t)}function So(){I(_o),I(vo),I(yo)}function Co(e){bo(yo.current);var t=bo(_o.current),n=Ne(t,e.type);t!==n&&(L(vo,e),L(_o,n))}function wo(e){vo.current===e&&(I(_o),I(vo))}var B=Qi(0);function To(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data===`$?`||n.data===`$!`))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Eo=[];function Do(){for(var e=0;e<Eo.length;e++)Eo[e]._workInProgressVersionPrimary=null;Eo.length=0}var Oo=C.ReactCurrentDispatcher,ko=C.ReactCurrentBatchConfig,Ao=0,V=null,H=null,U=null,jo=!1,Mo=!1,No=0,Po=0;function W(){throw Error(r(321))}function Fo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ir(e[n],t[n]))return!1;return!0}function Io(e,t,n,i,a,o){if(Ao=o,V=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Oo.current=e===null||e.memoizedState===null?ys:bs,e=n(i,a),Mo){o=0;do{if(Mo=!1,No=0,25<=o)throw Error(r(301));o+=1,U=H=null,t.updateQueue=null,Oo.current=xs,e=n(i,a)}while(Mo)}if(Oo.current=vs,t=H!==null&&H.next!==null,Ao=0,U=H=V=null,jo=!1,t)throw Error(r(300));return e}function Lo(){var e=No!==0;return No=0,e}function Ro(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return U===null?V.memoizedState=U=e:U=U.next=e,U}function zo(){if(H===null){var e=V.alternate;e=e===null?null:e.memoizedState}else e=H.next;var t=U===null?V.memoizedState:U.next;if(t!==null)U=t,H=e;else{if(e===null)throw Error(r(310));H=e,e={memoizedState:H.memoizedState,baseState:H.baseState,baseQueue:H.baseQueue,queue:H.queue,next:null},U===null?V.memoizedState=U=e:U=U.next=e}return U}function Bo(e,t){return typeof t==`function`?t(e):t}function Vo(e){var t=zo(),n=t.queue;if(n===null)throw Error(r(311));n.lastRenderedReducer=e;var i=H,a=i.baseQueue,o=n.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}i.baseQueue=a=o,n.pending=null}if(a!==null){o=a.next,i=i.baseState;var c=s=null,l=null,u=o;do{var d=u.lane;if((Ao&d)===d)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:e(i,u.action);else{var f={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(c=l=f,s=i):l=l.next=f,V.lanes|=d,Yc|=d}u=u.next}while(u!==null&&u!==o);l===null?s=i:l.next=c,Ir(i,t.memoizedState)||(zs=!0),t.memoizedState=i,t.baseState=s,t.baseQueue=l,n.lastRenderedState=i}if(e=n.interleaved,e!==null){a=e;do o=a.lane,V.lanes|=o,Yc|=o,a=a.next;while(a!==e)}else a===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Ho(e){var t=zo(),n=t.queue;if(n===null)throw Error(r(311));n.lastRenderedReducer=e;var i=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Ir(o,t.memoizedState)||(zs=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,i]}function Uo(){}function Wo(e,t){var n=V,i=zo(),a=t(),o=!Ir(i.memoizedState,a);if(o&&(i.memoizedState=a,zs=!0),i=i.queue,ns(qo.bind(null,n,i,e),[e]),i.getSnapshot!==t||o||U!==null&&U.memoizedState.tag&1){if(n.flags|=2048,Zo(9,Ko.bind(null,n,i,a,t),void 0,null),Y===null)throw Error(r(349));Ao&30||Go(n,t,a)}return a}function Go(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=V.updateQueue,t===null?(t={lastEffect:null,stores:null},V.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ko(e,t,n,r){t.value=n,t.getSnapshot=r,Jo(t)&&Yo(e)}function qo(e,t,n){return n(function(){Jo(t)&&Yo(e)})}function Jo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ir(e,n)}catch{return!0}}function Yo(e){var t=ao(e,1);t!==null&&hl(t,e,1,-1)}function Xo(e){var t=Ro();return typeof e==`function`&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:e},t.queue=e,e=e.dispatch=ms.bind(null,V,e),[t.memoizedState,e]}function Zo(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=V.updateQueue,t===null?(t={lastEffect:null,stores:null},V.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function Qo(){return zo().memoizedState}function $o(e,t,n,r){var i=Ro();V.flags|=e,i.memoizedState=Zo(1|t,n,void 0,r===void 0?null:r)}function es(e,t,n,r){var i=zo();r=r===void 0?null:r;var a=void 0;if(H!==null){var o=H.memoizedState;if(a=o.destroy,r!==null&&Fo(r,o.deps)){i.memoizedState=Zo(t,n,a,r);return}}V.flags|=e,i.memoizedState=Zo(1|t,n,a,r)}function ts(e,t){return $o(8390656,8,e,t)}function ns(e,t){return es(2048,8,e,t)}function rs(e,t){return es(4,2,e,t)}function is(e,t){return es(4,4,e,t)}function as(e,t){if(typeof t==`function`)return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function os(e,t,n){return n=n==null?null:n.concat([e]),es(4,4,as.bind(null,t,e),n)}function ss(){}function cs(e,t){var n=zo();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Fo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function ls(e,t){var n=zo();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&Fo(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function us(e,t,n){return Ao&21?(Ir(n,t)||(n=Ut(),V.lanes|=n,Yc|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,zs=!0),e.memoizedState=n)}function ds(e,t){var n=P;P=n!==0&&4>n?n:4,e(!0);var r=ko.transition;ko.transition={};try{e(!1),t()}finally{P=n,ko.transition=r}}function fs(){return zo().memoizedState}function ps(e,t,n){var r=ml(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},hs(e))gs(t,n);else if(n=io(e,t,n,r),n!==null){var i=pl();hl(n,e,r,i),_s(n,t,r)}}function ms(e,t,n){var r=ml(e),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(hs(e))gs(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Ir(s,o)){var c=t.interleaved;c===null?(i.next=i,ro(t)):(i.next=c.next,c.next=i),t.interleaved=i;return}}catch{}n=io(e,t,i,r),n!==null&&(i=pl(),hl(n,e,r,i),_s(n,t,r))}}function hs(e){var t=e.alternate;return e===V||t!==null&&t===V}function gs(e,t){Mo=jo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function _s(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,qt(e,n)}}var vs={readContext:to,useCallback:W,useContext:W,useEffect:W,useImperativeHandle:W,useInsertionEffect:W,useLayoutEffect:W,useMemo:W,useReducer:W,useRef:W,useState:W,useDebugValue:W,useDeferredValue:W,useTransition:W,useMutableSource:W,useSyncExternalStore:W,useId:W,unstable_isNewReconciler:!1},ys={readContext:to,useCallback:function(e,t){return Ro().memoizedState=[e,t===void 0?null:t],e},useContext:to,useEffect:ts,useImperativeHandle:function(e,t,n){return n=n==null?null:n.concat([e]),$o(4194308,4,as.bind(null,t,e),n)},useLayoutEffect:function(e,t){return $o(4194308,4,e,t)},useInsertionEffect:function(e,t){return $o(4,2,e,t)},useMemo:function(e,t){var n=Ro();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ro();return t=n===void 0?t:n(t),r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=ps.bind(null,V,e),[r.memoizedState,e]},useRef:function(e){var t=Ro();return e={current:e},t.memoizedState=e},useState:Xo,useDebugValue:ss,useDeferredValue:function(e){return Ro().memoizedState=e},useTransition:function(){var e=Xo(!1),t=e[0];return e=ds.bind(null,e[1]),Ro().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var i=V,a=Ro();if(z){if(n===void 0)throw Error(r(407));n=n()}else{if(n=t(),Y===null)throw Error(r(349));Ao&30||Go(i,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,ts(qo.bind(null,i,o,e),[e]),i.flags|=2048,Zo(9,Ko.bind(null,i,o,n,t),void 0,null),n},useId:function(){var e=Ro(),t=Y.identifierPrefix;if(z){var n=Ca,r=Sa;n=(r&~(1<<32-Mt(r)-1)).toString(32)+n,t=`:`+t+`R`+n,n=No++,0<n&&(t+=`H`+n.toString(32)),t+=`:`}else n=Po++,t=`:`+t+`r`+n.toString(32)+`:`;return e.memoizedState=t},unstable_isNewReconciler:!1},bs={readContext:to,useCallback:cs,useContext:to,useEffect:ns,useImperativeHandle:os,useInsertionEffect:rs,useLayoutEffect:is,useMemo:ls,useReducer:Vo,useRef:Qo,useState:function(){return Vo(Bo)},useDebugValue:ss,useDeferredValue:function(e){return us(zo(),H.memoizedState,e)},useTransition:function(){return[Vo(Bo)[0],zo().memoizedState]},useMutableSource:Uo,useSyncExternalStore:Wo,useId:fs,unstable_isNewReconciler:!1},xs={readContext:to,useCallback:cs,useContext:to,useEffect:ns,useImperativeHandle:os,useInsertionEffect:rs,useLayoutEffect:is,useMemo:ls,useReducer:Ho,useRef:Qo,useState:function(){return Ho(Bo)},useDebugValue:ss,useDeferredValue:function(e){var t=zo();return H===null?t.memoizedState=e:us(t,H.memoizedState,e)},useTransition:function(){return[Ho(Bo)[0],zo().memoizedState]},useMutableSource:Uo,useSyncExternalStore:Wo,useId:fs,unstable_isNewReconciler:!1};function Ss(e,t){if(e&&e.defaultProps){for(var n in t=j({},t),e=e.defaultProps,e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function Cs(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:j({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var ws={isMounted:function(e){return(e=e._reactInternals)?pt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=pl(),i=ml(e),a=lo(r,i);a.payload=t,n!=null&&(a.callback=n),t=uo(e,a,i),t!==null&&(hl(t,e,i,r),fo(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=pl(),i=ml(e),a=lo(r,i);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=uo(e,a,i),t!==null&&(hl(t,e,i,r),fo(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=pl(),r=ml(e),i=lo(n,r);i.tag=2,t!=null&&(i.callback=t),t=uo(e,i,r),t!==null&&(hl(t,e,r,n),fo(t,e,r))}};function Ts(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Lr(n,r)||!Lr(i,a):!0}function Es(e,t,n){var r=!1,i=$i,a=t.contextType;return typeof a==`object`&&a?a=to(a):(i=ra(t)?ta:R.current,r=t.contextTypes,a=(r=r!=null)?na(e,i):$i),t=new t(n,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=ws,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=a),t}function Ds(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&ws.enqueueReplaceState(t,t.state,null)}function Os(e,t,n,r){var i=e.stateNode;i.props=n,i.state=e.memoizedState,i.refs={},so(e);var a=t.contextType;typeof a==`object`&&a?i.context=to(a):(a=ra(t)?ta:R.current,i.context=na(e,a)),i.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a==`function`&&(Cs(e,t,a,n),i.state=e.memoizedState),typeof t.getDerivedStateFromProps==`function`||typeof i.getSnapshotBeforeUpdate==`function`||typeof i.UNSAFE_componentWillMount!=`function`&&typeof i.componentWillMount!=`function`||(t=i.state,typeof i.componentWillMount==`function`&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount==`function`&&i.UNSAFE_componentWillMount(),t!==i.state&&ws.enqueueReplaceState(i,i.state,null),mo(e,n,i,r),i.state=e.memoizedState),typeof i.componentDidMount==`function`&&(e.flags|=4194308)}function ks(e,t){try{var n=``,r=t;do n+=fe(r),r=r.return;while(r);var i=n}catch(e){i=`
Error generating stack: `+e.message+`
`+e.stack}return{value:e,source:t,stack:i,digest:null}}function As(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function js(e,t){try{console.error(t.value)}catch(e){setTimeout(function(){throw e})}}var Ms=typeof WeakMap==`function`?WeakMap:Map;function Ns(e,t,n){n=lo(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){rl||(rl=!0,il=r),js(e,t)},n}function Ps(e,t,n){n=lo(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r==`function`){var i=t.value;n.payload=function(){return r(i)},n.callback=function(){js(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch==`function`&&(n.callback=function(){js(e,t),typeof r!=`function`&&(al===null?al=new Set([this]):al.add(this));var n=t.stack;this.componentDidCatch(t.value,{componentStack:n===null?``:n})}),n}function Fs(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Ms;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(i.add(n),e=zl.bind(null,e,t,n),t.then(e,e))}function Is(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t===null?!0:t.dehydrated!==null),t)return e;e=e.return}while(e!==null);return null}function Ls(e,t,n,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=lo(-1,1),t.tag=2,uo(n,t,1))),n.lanes|=1),e)}var Rs=C.ReactCurrentOwner,zs=!1;function Bs(e,t,n,r){t.child=e===null?Ka(t,null,n,r):Ga(t,e.child,n,r)}function Vs(e,t,n,r,i){n=n.render;var a=t.ref;return eo(t,i),r=Io(e,t,n,r,a,i),n=Lo(),e!==null&&!zs?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,sc(e,t,i)):(z&&n&&Ea(t),t.flags|=1,Bs(e,t,r,i),t.child)}function Hs(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!ql(a)&&a.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=a,Us(e,t,a,r,i)):(e=Xl(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,(e.lanes&i)===0){var o=a.memoizedProps;if(n=n.compare,n=n===null?Lr:n,n(o,r)&&e.ref===t.ref)return sc(e,t,i)}return t.flags|=1,e=Yl(a,r),e.ref=t.ref,e.return=t,t.child=e}function Us(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Lr(a,r)&&e.ref===t.ref)if(zs=!1,t.pendingProps=r=a,(e.lanes&i)!==0)e.flags&131072&&(zs=!0);else return t.lanes=e.lanes,sc(e,t,i)}return Ks(e,t,n,r,i)}function Ws(e,t,n){var r=t.pendingProps,i=r.children,a=e===null?null:e.memoizedState;if(r.mode===`hidden`)if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},L(qc,Kc),Kc|=n;else{if(!(n&1073741824))return e=a===null?n:a.baseLanes|n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,L(qc,Kc),Kc|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=a===null?n:a.baseLanes,L(qc,Kc),Kc|=r}else a===null?r=n:(r=a.baseLanes|n,t.memoizedState=null),L(qc,Kc),Kc|=r;return Bs(e,t,i,n),t.child}function Gs(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function Ks(e,t,n,r,i){var a=ra(n)?ta:R.current;return a=na(t,a),eo(t,i),n=Io(e,t,n,r,a,i),r=Lo(),e!==null&&!zs?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,sc(e,t,i)):(z&&r&&Ea(t),t.flags|=1,Bs(e,t,n,i),t.child)}function qs(e,t,n,r,i){if(ra(n)){var a=!0;sa(t)}else a=!1;if(eo(t,i),t.stateNode===null)oc(e,t),Es(t,n,r),Os(t,n,r,i),r=!0;else if(e===null){var o=t.stateNode,s=t.memoizedProps;o.props=s;var c=o.context,l=n.contextType;typeof l==`object`&&l?l=to(l):(l=ra(n)?ta:R.current,l=na(t,l));var u=n.getDerivedStateFromProps,d=typeof u==`function`||typeof o.getSnapshotBeforeUpdate==`function`;d||typeof o.UNSAFE_componentWillReceiveProps!=`function`&&typeof o.componentWillReceiveProps!=`function`||(s!==r||c!==l)&&Ds(t,o,r,l),oo=!1;var f=t.memoizedState;o.state=f,mo(t,r,o,i),c=t.memoizedState,s!==r||f!==c||ea.current||oo?(typeof u==`function`&&(Cs(t,n,u,r),c=t.memoizedState),(s=oo||Ts(t,n,s,r,f,c,l))?(d||typeof o.UNSAFE_componentWillMount!=`function`&&typeof o.componentWillMount!=`function`||(typeof o.componentWillMount==`function`&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount==`function`&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount==`function`&&(t.flags|=4194308)):(typeof o.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=c),o.props=r,o.state=c,o.context=l,r=s):(typeof o.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{o=t.stateNode,co(e,t),s=t.memoizedProps,l=t.type===t.elementType?s:Ss(t.type,s),o.props=l,d=t.pendingProps,f=o.context,c=n.contextType,typeof c==`object`&&c?c=to(c):(c=ra(n)?ta:R.current,c=na(t,c));var p=n.getDerivedStateFromProps;(u=typeof p==`function`||typeof o.getSnapshotBeforeUpdate==`function`)||typeof o.UNSAFE_componentWillReceiveProps!=`function`&&typeof o.componentWillReceiveProps!=`function`||(s!==d||f!==c)&&Ds(t,o,r,c),oo=!1,f=t.memoizedState,o.state=f,mo(t,r,o,i);var m=t.memoizedState;s!==d||f!==m||ea.current||oo?(typeof p==`function`&&(Cs(t,n,p,r),m=t.memoizedState),(l=oo||Ts(t,n,l,r,f,m,c)||!1)?(u||typeof o.UNSAFE_componentWillUpdate!=`function`&&typeof o.componentWillUpdate!=`function`||(typeof o.componentWillUpdate==`function`&&o.componentWillUpdate(r,m,c),typeof o.UNSAFE_componentWillUpdate==`function`&&o.UNSAFE_componentWillUpdate(r,m,c)),typeof o.componentDidUpdate==`function`&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof o.componentDidUpdate!=`function`||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!=`function`||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=m),o.props=r,o.state=m,o.context=c,r=l):(typeof o.componentDidUpdate!=`function`||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!=`function`||s===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return Js(e,t,n,r,a,i)}function Js(e,t,n,r,i,a){Gs(e,t);var o=(t.flags&128)!=0;if(!r&&!o)return i&&ca(t,n,!1),sc(e,t,a);r=t.stateNode,Rs.current=t;var s=o&&typeof n.getDerivedStateFromError!=`function`?null:r.render();return t.flags|=1,e!==null&&o?(t.child=Ga(t,e.child,null,a),t.child=Ga(t,null,s,a)):Bs(e,t,s,a),t.memoizedState=r.state,i&&ca(t,n,!0),t.child}function Ys(e){var t=e.stateNode;t.pendingContext?aa(e,t.pendingContext,t.pendingContext!==t.context):t.context&&aa(e,t.context,!1),xo(e,t.containerInfo)}function Xs(e,t,n,r,i){return Ra(),za(i),t.flags|=256,Bs(e,t,n,r),t.child}var Zs={dehydrated:null,treeContext:null,retryLane:0};function Qs(e){return{baseLanes:e,cachePool:null,transitions:null}}function $s(e,t,n){var r=t.pendingProps,i=B.current,a=!1,o=(t.flags&128)!=0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(i&2)!=0),s?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),L(B,i&1),e===null)return Pa(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data===`$!`?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=r.children,e=r.fallback,a?(r=t.mode,a=t.child,o={mode:`hidden`,children:o},!(r&1)&&a!==null?(a.childLanes=0,a.pendingProps=o):a=Ql(o,r,0,null),e=Zl(e,r,n,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=Qs(n),t.memoizedState=Zs,e):ec(t,o));if(i=e.memoizedState,i!==null&&(s=i.dehydrated,s!==null))return nc(e,t,o,r,s,i,n);if(a){a=r.fallback,o=t.mode,i=e.child,s=i.sibling;var c={mode:`hidden`,children:r.children};return!(o&1)&&t.child!==i?(r=t.child,r.childLanes=0,r.pendingProps=c,t.deletions=null):(r=Yl(i,c),r.subtreeFlags=i.subtreeFlags&14680064),s===null?(a=Zl(a,o,n,null),a.flags|=2):a=Yl(s,a),a.return=t,r.return=t,r.sibling=a,t.child=r,r=a,a=t.child,o=e.child.memoizedState,o=o===null?Qs(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},a.memoizedState=o,a.childLanes=e.childLanes&~n,t.memoizedState=Zs,r}return a=e.child,e=a.sibling,r=Yl(a,{mode:`visible`,children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function ec(e,t){return t=Ql({mode:`visible`,children:t},e.mode,0,null),t.return=e,e.child=t}function tc(e,t,n,r){return r!==null&&za(r),Ga(t,e.child,null,n),e=ec(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function nc(e,t,n,i,a,o,s){if(n)return t.flags&256?(t.flags&=-257,i=As(Error(r(422))),tc(e,t,s,i)):t.memoizedState===null?(o=i.fallback,a=t.mode,i=Ql({mode:`visible`,children:i.children},a,0,null),o=Zl(o,a,s,null),o.flags|=2,i.return=t,o.return=t,i.sibling=o,t.child=i,t.mode&1&&Ga(t,e.child,null,s),t.child.memoizedState=Qs(s),t.memoizedState=Zs,o):(t.child=e.child,t.flags|=128,null);if(!(t.mode&1))return tc(e,t,s,null);if(a.data===`$!`){if(i=a.nextSibling&&a.nextSibling.dataset,i)var c=i.dgst;return i=c,o=Error(r(419)),i=As(o,i,void 0),tc(e,t,s,i)}if(c=(s&e.childLanes)!==0,zs||c){if(i=Y,i!==null){switch(s&-s){case 4:a=2;break;case 16:a=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:a=32;break;case 536870912:a=268435456;break;default:a=0}a=(a&(i.suspendedLanes|s))===0?a:0,a!==0&&a!==o.retryLane&&(o.retryLane=a,ao(e,a),hl(i,e,a,-1))}return kl(),i=As(Error(r(421))),tc(e,t,s,i)}return a.data===`$?`?(t.flags|=128,t.child=e.child,t=Vl.bind(null,e),a._reactRetry=t,null):(e=o.treeContext,ka=Li(a.nextSibling),Oa=t,z=!0,Aa=null,e!==null&&(ya[ba++]=Sa,ya[ba++]=Ca,ya[ba++]=xa,Sa=e.id,Ca=e.overflow,xa=t),t=ec(t,i.children),t.flags|=4096,t)}function rc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),$a(e.return,t,n)}function ic(e,t,n,r,i){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=r,a.tail=n,a.tailMode=i)}function ac(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;if(Bs(e,t,r.children,n),r=B.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&rc(e,n,t);else if(e.tag===19)rc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if(L(B,r),!(t.mode&1))t.memoizedState=null;else switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&To(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),ic(t,!1,i,n,a);break;case`backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&To(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}ic(t,!0,n,null,a);break;case`together`:ic(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function oc(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function sc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Yc|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(r(153));if(t.child!==null){for(e=t.child,n=Yl(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Yl(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function cc(e,t,n){switch(t.tag){case 3:Ys(t),Ra();break;case 5:Co(t);break;case 1:ra(t.type)&&sa(t);break;case 4:xo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,i=t.memoizedProps.value;L(qa,r._currentValue),r._currentValue=i;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(L(B,B.current&1),e=sc(e,t,n),e===null?null:e.sibling):$s(e,t,n):(L(B,B.current&1),t.flags|=128,null);L(B,B.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return ac(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),L(B,B.current),r)break;return null;case 22:case 23:return t.lanes=0,Ws(e,t,n)}return sc(e,t,n)}var lc=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}},uc=function(e,t,n,r){var i=e.memoizedProps;if(i!==r){e=t.stateNode,bo(_o.current);var o=null;switch(n){case`input`:i=be(e,i),r=be(e,r),o=[];break;case`select`:i=j({},i,{value:void 0}),r=j({},r,{value:void 0}),o=[];break;case`textarea`:i=Oe(e,i),r=Oe(e,r),o=[];break;default:typeof i.onClick!=`function`&&typeof r.onClick==`function`&&(e.onclick=Di)}He(n,r);var s;for(u in n=null,i)if(!r.hasOwnProperty(u)&&i.hasOwnProperty(u)&&i[u]!=null)if(u===`style`){var c=i[u];for(s in c)c.hasOwnProperty(s)&&(n||={},n[s]=``)}else u!==`dangerouslySetInnerHTML`&&u!==`children`&&u!==`suppressContentEditableWarning`&&u!==`suppressHydrationWarning`&&u!==`autoFocus`&&(a.hasOwnProperty(u)?o||=[]:(o||=[]).push(u,null));for(u in r){var l=r[u];if(c=i?.[u],r.hasOwnProperty(u)&&l!==c&&(l!=null||c!=null))if(u===`style`)if(c){for(s in c)!c.hasOwnProperty(s)||l&&l.hasOwnProperty(s)||(n||={},n[s]=``);for(s in l)l.hasOwnProperty(s)&&c[s]!==l[s]&&(n||={},n[s]=l[s])}else n||(o||=[],o.push(u,n)),n=l;else u===`dangerouslySetInnerHTML`?(l=l?l.__html:void 0,c=c?c.__html:void 0,l!=null&&c!==l&&(o||=[]).push(u,l)):u===`children`?typeof l!=`string`&&typeof l!=`number`||(o||=[]).push(u,``+l):u!==`suppressContentEditableWarning`&&u!==`suppressHydrationWarning`&&(a.hasOwnProperty(u)?(l!=null&&u===`onScroll`&&F(`scroll`,e),o||c===l||(o=[])):(o||=[]).push(u,l))}n&&(o||=[]).push(`style`,n);var u=o;(t.updateQueue=u)&&(t.flags|=4)}},dc=function(e,t,n,r){n!==r&&(t.flags|=4)};function fc(e,t){if(!z)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function G(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function pc(e,t,n){var i=t.pendingProps;switch(Da(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return G(t),null;case 1:return ra(t.type)&&ia(),G(t),null;case 3:return i=t.stateNode,So(),I(ea),I(R),Do(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(e===null||e.child===null)&&(Ia(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Aa!==null&&(yl(Aa),Aa=null))),G(t),null;case 5:wo(t);var o=bo(yo.current);if(n=t.type,e!==null&&t.stateNode!=null)uc(e,t,n,i,o),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!i){if(t.stateNode===null)throw Error(r(166));return G(t),null}if(e=bo(_o.current),Ia(t)){i=t.stateNode,n=t.type;var s=t.memoizedProps;switch(i[Bi]=t,i[Vi]=s,e=(t.mode&1)!=0,n){case`dialog`:F(`cancel`,i),F(`close`,i);break;case`iframe`:case`object`:case`embed`:F(`load`,i);break;case`video`:case`audio`:for(o=0;o<ui.length;o++)F(ui[o],i);break;case`source`:F(`error`,i);break;case`img`:case`image`:case`link`:F(`error`,i),F(`load`,i);break;case`details`:F(`toggle`,i);break;case`input`:xe(i,s),F(`invalid`,i);break;case`select`:i._wrapperState={wasMultiple:!!s.multiple},F(`invalid`,i);break;case`textarea`:ke(i,s),F(`invalid`,i)}for(var c in He(n,s),o=null,s)if(s.hasOwnProperty(c)){var l=s[c];c===`children`?typeof l==`string`?i.textContent!==l&&(!0!==s.suppressHydrationWarning&&Ei(i.textContent,l,e),o=[`children`,l]):typeof l==`number`&&i.textContent!==``+l&&(!0!==s.suppressHydrationWarning&&Ei(i.textContent,l,e),o=[`children`,``+l]):a.hasOwnProperty(c)&&l!=null&&c===`onScroll`&&F(`scroll`,i)}switch(n){case`input`:_e(i),we(i,s,!0);break;case`textarea`:_e(i),je(i);break;case`select`:case`option`:break;default:typeof s.onClick==`function`&&(i.onclick=Di)}i=o,t.updateQueue=i,i!==null&&(t.flags|=4)}else{c=o.nodeType===9?o:o.ownerDocument,e===`http://www.w3.org/1999/xhtml`&&(e=Me(n)),e===`http://www.w3.org/1999/xhtml`?n===`script`?(e=c.createElement(`div`),e.innerHTML=`<script><\/script>`,e=e.removeChild(e.firstChild)):typeof i.is==`string`?e=c.createElement(n,{is:i.is}):(e=c.createElement(n),n===`select`&&(c=e,i.multiple?c.multiple=!0:i.size&&(c.size=i.size))):e=c.createElementNS(e,n),e[Bi]=t,e[Vi]=i,lc(e,t,!1,!1),t.stateNode=e;a:{switch(c=Ue(n,i),n){case`dialog`:F(`cancel`,e),F(`close`,e),o=i;break;case`iframe`:case`object`:case`embed`:F(`load`,e),o=i;break;case`video`:case`audio`:for(o=0;o<ui.length;o++)F(ui[o],e);o=i;break;case`source`:F(`error`,e),o=i;break;case`img`:case`image`:case`link`:F(`error`,e),F(`load`,e),o=i;break;case`details`:F(`toggle`,e),o=i;break;case`input`:xe(e,i),o=be(e,i),F(`invalid`,e);break;case`option`:o=i;break;case`select`:e._wrapperState={wasMultiple:!!i.multiple},o=j({},i,{value:void 0}),F(`invalid`,e);break;case`textarea`:ke(e,i),o=Oe(e,i),F(`invalid`,e);break;default:o=i}for(s in He(n,o),l=o,l)if(l.hasOwnProperty(s)){var u=l[s];s===`style`?Be(e,u):s===`dangerouslySetInnerHTML`?(u=u?u.__html:void 0,u!=null&&Fe(e,u)):s===`children`?typeof u==`string`?(n!==`textarea`||u!==``)&&Ie(e,u):typeof u==`number`&&Ie(e,``+u):s!==`suppressContentEditableWarning`&&s!==`suppressHydrationWarning`&&s!==`autoFocus`&&(a.hasOwnProperty(s)?u!=null&&s===`onScroll`&&F(`scroll`,e):u!=null&&S(e,s,u,c))}switch(n){case`input`:_e(e),we(e,i,!1);break;case`textarea`:_e(e),je(e);break;case`option`:i.value!=null&&e.setAttribute(`value`,``+me(i.value));break;case`select`:e.multiple=!!i.multiple,s=i.value,s==null?i.defaultValue!=null&&De(e,!!i.multiple,i.defaultValue,!0):De(e,!!i.multiple,s,!1);break;default:typeof o.onClick==`function`&&(e.onclick=Di)}switch(n){case`button`:case`input`:case`select`:case`textarea`:i=!!i.autoFocus;break a;case`img`:i=!0;break a;default:i=!1}}i&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return G(t),null;case 6:if(e&&t.stateNode!=null)dc(e,t,e.memoizedProps,i);else{if(typeof i!=`string`&&t.stateNode===null)throw Error(r(166));if(n=bo(yo.current),bo(_o.current),Ia(t)){if(i=t.stateNode,n=t.memoizedProps,i[Bi]=t,(s=i.nodeValue!==n)&&(e=Oa,e!==null))switch(e.tag){case 3:Ei(i.nodeValue,n,(e.mode&1)!=0);break;case 5:!0!==e.memoizedProps.suppressHydrationWarning&&Ei(i.nodeValue,n,(e.mode&1)!=0)}s&&(t.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Bi]=t,t.stateNode=i}return G(t),null;case 13:if(I(B),i=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(z&&ka!==null&&t.mode&1&&!(t.flags&128))La(),Ra(),t.flags|=98560,s=!1;else if(s=Ia(t),i!==null&&i.dehydrated!==null){if(e===null){if(!s)throw Error(r(318));if(s=t.memoizedState,s=s===null?null:s.dehydrated,!s)throw Error(r(317));s[Bi]=t}else Ra(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;G(t),s=!1}else Aa!==null&&(yl(Aa),Aa=null),s=!0;if(!s)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(i=i!==null,i!==(e!==null&&e.memoizedState!==null)&&i&&(t.child.flags|=8192,t.mode&1&&(e===null||B.current&1?Q===0&&(Q=3):kl())),t.updateQueue!==null&&(t.flags|=4),G(t),null);case 4:return So(),e===null&&gi(t.stateNode.containerInfo),G(t),null;case 10:return Qa(t.type._context),G(t),null;case 17:return ra(t.type)&&ia(),G(t),null;case 19:if(I(B),s=t.memoizedState,s===null)return G(t),null;if(i=(t.flags&128)!=0,c=s.rendering,c===null)if(i)fc(s,!1);else{if(Q!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(c=To(e),c!==null){for(t.flags|=128,fc(s,!1),i=c.updateQueue,i!==null&&(t.updateQueue=i,t.flags|=4),t.subtreeFlags=0,i=n,n=t.child;n!==null;)s=n,e=i,s.flags&=14680066,c=s.alternate,c===null?(s.childLanes=0,s.lanes=e,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=c.childLanes,s.lanes=c.lanes,s.child=c.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=c.memoizedProps,s.memoizedState=c.memoizedState,s.updateQueue=c.updateQueue,s.type=c.type,e=c.dependencies,s.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return L(B,B.current&1|2),t.child}e=e.sibling}s.tail!==null&&N()>tl&&(t.flags|=128,i=!0,fc(s,!1),t.lanes=4194304)}else{if(!i)if(e=To(c),e!==null){if(t.flags|=128,i=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),fc(s,!0),s.tail===null&&s.tailMode===`hidden`&&!c.alternate&&!z)return G(t),null}else 2*N()-s.renderingStartTime>tl&&n!==1073741824&&(t.flags|=128,i=!0,fc(s,!1),t.lanes=4194304);s.isBackwards?(c.sibling=t.child,t.child=c):(n=s.last,n===null?t.child=c:n.sibling=c,s.last=c)}return s.tail===null?(G(t),null):(t=s.tail,s.rendering=t,s.tail=t.sibling,s.renderingStartTime=N(),t.sibling=null,n=B.current,L(B,i?n&1|2:n&1),t);case 22:case 23:return Tl(),i=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==i&&(t.flags|=8192),i&&t.mode&1?Kc&1073741824&&(G(t),t.subtreeFlags&6&&(t.flags|=8192)):G(t),null;case 24:return null;case 25:return null}throw Error(r(156,t.tag))}function mc(e,t){switch(Da(t),t.tag){case 1:return ra(t.type)&&ia(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return So(),I(ea),I(R),Do(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return wo(t),null;case 13:if(I(B),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(r(340));Ra()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return I(B),null;case 4:return So(),null;case 10:return Qa(t.type._context),null;case 22:case 23:return Tl(),null;case 24:return null;default:return null}}var hc=!1,gc=!1,_c=typeof WeakSet==`function`?WeakSet:Set,K=null;function vc(e,t){var n=e.ref;if(n!==null)if(typeof n==`function`)try{n(null)}catch(n){$(e,t,n)}else n.current=null}function yc(e,t,n){try{n()}catch(n){$(e,t,n)}}var bc=!1;function xc(e,t){if(Oi=bn,e=Vr(),Hr(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var a=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||i!==0&&f.nodeType!==3||(l=s+i),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===i&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(ki={focusedElem:e,selectionRange:n},bn=!1,K=t;K!==null;)if(t=K,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,K=e;else for(;K!==null;){t=K;try{var h=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(h!==null){var g=h.memoizedProps,_=h.memoizedState,v=t.stateNode;v.__reactInternalSnapshotBeforeUpdate=v.getSnapshotBeforeUpdate(t.elementType===t.type?g:Ss(t.type,g),_)}break;case 3:var y=t.stateNode.containerInfo;y.nodeType===1?y.textContent=``:y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(r(163))}}catch(e){$(t,t.return,e)}if(e=t.sibling,e!==null){e.return=t.return,K=e;break}K=t.return}return h=bc,bc=!1,h}function Sc(e,t,n){var r=t.updateQueue;if(r=r===null?null:r.lastEffect,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var a=i.destroy;i.destroy=void 0,a!==void 0&&yc(t,n,a)}i=i.next}while(i!==r)}}function Cc(e,t){if(t=t.updateQueue,t=t===null?null:t.lastEffect,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function wc(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t==`function`?t(e):t.current=e}}function Tc(e){var t=e.alternate;t!==null&&(e.alternate=null,Tc(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Bi],delete t[Vi],delete t[Ui],delete t[Wi],delete t[Gi])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Ec(e){return e.tag===5||e.tag===3||e.tag===4}function Dc(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Ec(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Oc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Di));else if(r!==4&&(e=e.child,e!==null))for(Oc(e,t,n),e=e.sibling;e!==null;)Oc(e,t,n),e=e.sibling}function kc(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(kc(e,t,n),e=e.sibling;e!==null;)kc(e,t,n),e=e.sibling}var q=null,Ac=!1;function jc(e,t,n){for(n=n.child;n!==null;)Mc(e,t,n),n=n.sibling}function Mc(e,t,n){if(At&&typeof At.onCommitFiberUnmount==`function`)try{At.onCommitFiberUnmount(kt,n)}catch{}switch(n.tag){case 5:gc||vc(n,t);case 6:var r=q,i=Ac;q=null,jc(e,t,n),q=r,Ac=i,q!==null&&(Ac?(e=q,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):q.removeChild(n.stateNode));break;case 18:q!==null&&(Ac?(e=q,n=n.stateNode,e.nodeType===8?Ii(e.parentNode,n):e.nodeType===1&&Ii(e,n),vn(e)):Ii(q,n.stateNode));break;case 4:r=q,i=Ac,q=n.stateNode.containerInfo,Ac=!0,jc(e,t,n),q=r,Ac=i;break;case 0:case 11:case 14:case 15:if(!gc&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var a=i,o=a.destroy;a=a.tag,o!==void 0&&(a&2||a&4)&&yc(n,t,o),i=i.next}while(i!==r)}jc(e,t,n);break;case 1:if(!gc&&(vc(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(e){$(n,t,e)}jc(e,t,n);break;case 21:jc(e,t,n);break;case 22:n.mode&1?(gc=(r=gc)||n.memoizedState!==null,jc(e,t,n),gc=r):jc(e,t,n);break;default:jc(e,t,n)}}function Nc(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new _c),t.forEach(function(t){var r=Hl.bind(null,e,t);n.has(t)||(n.add(t),t.then(r,r))})}}function Pc(e,t){var n=t.deletions;if(n!==null)for(var i=0;i<n.length;i++){var a=n[i];try{var o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 5:q=c.stateNode,Ac=!1;break a;case 3:q=c.stateNode.containerInfo,Ac=!0;break a;case 4:q=c.stateNode.containerInfo,Ac=!0;break a}c=c.return}if(q===null)throw Error(r(160));Mc(o,s,a),q=null,Ac=!1;var l=a.alternate;l!==null&&(l.return=null),a.return=null}catch(e){$(a,t,e)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Fc(t,e),t=t.sibling}function Fc(e,t){var n=e.alternate,i=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Pc(t,e),Ic(e),i&4){try{Sc(3,e,e.return),Cc(3,e)}catch(t){$(e,e.return,t)}try{Sc(5,e,e.return)}catch(t){$(e,e.return,t)}}break;case 1:Pc(t,e),Ic(e),i&512&&n!==null&&vc(n,n.return);break;case 5:if(Pc(t,e),Ic(e),i&512&&n!==null&&vc(n,n.return),e.flags&32){var a=e.stateNode;try{Ie(a,``)}catch(t){$(e,e.return,t)}}if(i&4&&(a=e.stateNode,a!=null)){var o=e.memoizedProps,s=n===null?o:n.memoizedProps,c=e.type,l=e.updateQueue;if(e.updateQueue=null,l!==null)try{c===`input`&&o.type===`radio`&&o.name!=null&&Se(a,o),Ue(c,s);var u=Ue(c,o);for(s=0;s<l.length;s+=2){var d=l[s],f=l[s+1];d===`style`?Be(a,f):d===`dangerouslySetInnerHTML`?Fe(a,f):d===`children`?Ie(a,f):S(a,d,f,u)}switch(c){case`input`:Ce(a,o);break;case`textarea`:Ae(a,o);break;case`select`:var p=a._wrapperState.wasMultiple;a._wrapperState.wasMultiple=!!o.multiple;var m=o.value;m==null?p!==!!o.multiple&&(o.defaultValue==null?De(a,!!o.multiple,o.multiple?[]:``,!1):De(a,!!o.multiple,o.defaultValue,!0)):De(a,!!o.multiple,m,!1)}a[Vi]=o}catch(t){$(e,e.return,t)}}break;case 6:if(Pc(t,e),Ic(e),i&4){if(e.stateNode===null)throw Error(r(162));a=e.stateNode,o=e.memoizedProps;try{a.nodeValue=o}catch(t){$(e,e.return,t)}}break;case 3:if(Pc(t,e),Ic(e),i&4&&n!==null&&n.memoizedState.isDehydrated)try{vn(t.containerInfo)}catch(t){$(e,e.return,t)}break;case 4:Pc(t,e),Ic(e);break;case 13:Pc(t,e),Ic(e),a=e.child,a.flags&8192&&(o=a.memoizedState!==null,a.stateNode.isHidden=o,!o||a.alternate!==null&&a.alternate.memoizedState!==null||(el=N())),i&4&&Nc(e);break;case 22:if(d=n!==null&&n.memoizedState!==null,e.mode&1?(gc=(u=gc)||d,Pc(t,e),gc=u):Pc(t,e),Ic(e),i&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!d&&e.mode&1)for(K=e,d=e.child;d!==null;){for(f=K=d;K!==null;){switch(p=K,m=p.child,p.tag){case 0:case 11:case 14:case 15:Sc(4,p,p.return);break;case 1:vc(p,p.return);var h=p.stateNode;if(typeof h.componentWillUnmount==`function`){i=p,n=p.return;try{t=i,h.props=t.memoizedProps,h.state=t.memoizedState,h.componentWillUnmount()}catch(e){$(i,n,e)}}break;case 5:vc(p,p.return);break;case 22:if(p.memoizedState!==null){Bc(f);continue}}m===null?Bc(f):(m.return=p,K=m)}d=d.sibling}a:for(d=null,f=e;;){if(f.tag===5){if(d===null){d=f;try{a=f.stateNode,u?(o=a.style,typeof o.setProperty==`function`?o.setProperty(`display`,`none`,`important`):o.display=`none`):(c=f.stateNode,l=f.memoizedProps.style,s=l!=null&&l.hasOwnProperty(`display`)?l.display:null,c.style.display=ze(`display`,s))}catch(t){$(e,e.return,t)}}}else if(f.tag===6){if(d===null)try{f.stateNode.nodeValue=u?``:f.memoizedProps}catch(t){$(e,e.return,t)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===e)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===e)break a;for(;f.sibling===null;){if(f.return===null||f.return===e)break a;d===f&&(d=null),f=f.return}d===f&&(d=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:Pc(t,e),Ic(e),i&4&&Nc(e);break;case 21:break;default:Pc(t,e),Ic(e)}}function Ic(e){var t=e.flags;if(t&2){try{a:{for(var n=e.return;n!==null;){if(Ec(n)){var i=n;break a}n=n.return}throw Error(r(160))}switch(i.tag){case 5:var a=i.stateNode;i.flags&32&&(Ie(a,``),i.flags&=-33),kc(e,Dc(e),a);break;case 3:case 4:var o=i.stateNode.containerInfo;Oc(e,Dc(e),o);break;default:throw Error(r(161))}}catch(t){$(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Lc(e,t,n){K=e,Rc(e,t,n)}function Rc(e,t,n){for(var r=(e.mode&1)!=0;K!==null;){var i=K,a=i.child;if(i.tag===22&&r){var o=i.memoizedState!==null||hc;if(!o){var s=i.alternate,c=s!==null&&s.memoizedState!==null||gc;s=hc;var l=gc;if(hc=o,(gc=c)&&!l)for(K=i;K!==null;)o=K,c=o.child,o.tag===22&&o.memoizedState!==null||c===null?Vc(i):(c.return=o,K=c);for(;a!==null;)K=a,Rc(a,t,n),a=a.sibling;K=i,hc=s,gc=l}zc(e,t,n)}else i.subtreeFlags&8772&&a!==null?(a.return=i,K=a):zc(e,t,n)}}function zc(e){for(;K!==null;){var t=K;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:gc||Cc(5,t);break;case 1:var i=t.stateNode;if(t.flags&4&&!gc)if(n===null)i.componentDidMount();else{var a=t.elementType===t.type?n.memoizedProps:Ss(t.type,n.memoizedProps);i.componentDidUpdate(a,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var o=t.updateQueue;o!==null&&ho(t,o,i);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}ho(t,s,n)}break;case 5:var c=t.stateNode;if(n===null&&t.flags&4){n=c;var l=t.memoizedProps;switch(t.type){case`button`:case`input`:case`select`:case`textarea`:l.autoFocus&&n.focus();break;case`img`:l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var f=d.dehydrated;f!==null&&vn(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(r(163))}gc||t.flags&512&&wc(t)}catch(e){$(t,t.return,e)}}if(t===e){K=null;break}if(n=t.sibling,n!==null){n.return=t.return,K=n;break}K=t.return}}function Bc(e){for(;K!==null;){var t=K;if(t===e){K=null;break}var n=t.sibling;if(n!==null){n.return=t.return,K=n;break}K=t.return}}function Vc(e){for(;K!==null;){var t=K;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Cc(4,t)}catch(e){$(t,n,e)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount==`function`){var i=t.return;try{r.componentDidMount()}catch(e){$(t,i,e)}}var a=t.return;try{wc(t)}catch(e){$(t,a,e)}break;case 5:var o=t.return;try{wc(t)}catch(e){$(t,o,e)}}}catch(e){$(t,t.return,e)}if(t===e){K=null;break}var s=t.sibling;if(s!==null){s.return=t.return,K=s;break}K=t.return}}var Hc=Math.ceil,Uc=C.ReactCurrentDispatcher,Wc=C.ReactCurrentOwner,Gc=C.ReactCurrentBatchConfig,J=0,Y=null,X=null,Z=0,Kc=0,qc=Qi(0),Q=0,Jc=null,Yc=0,Xc=0,Zc=0,Qc=null,$c=null,el=0,tl=1/0,nl=null,rl=!1,il=null,al=null,ol=!1,sl=null,cl=0,ll=0,ul=null,dl=-1,fl=0;function pl(){return J&6?N():dl===-1?dl=N():dl}function ml(e){return e.mode&1?J&2&&Z!==0?Z&-Z:Ba.transition===null?(e=P,e===0?(e=window.event,e=e===void 0?16:En(e.type),e):e):(fl===0&&(fl=Ut()),fl):1}function hl(e,t,n,i){if(50<ll)throw ll=0,ul=null,Error(r(185));Gt(e,n,i),(!(J&2)||e!==Y)&&(e===Y&&(!(J&2)&&(Xc|=n),Q===4&&xl(e,Z)),gl(e,i),n===1&&J===0&&!(t.mode&1)&&(tl=N()+500,ua&&ma()))}function gl(e,t){var n=e.callbackNode;Vt(e,t);var r=zt(e,e===Y?Z:0);if(r===0)n!==null&&bt(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&bt(n),t===1)e.tag===0?pa(Sl.bind(null,e)):fa(Sl.bind(null,e)),Pi(function(){!(J&6)&&ma()}),n=null;else{switch(Jt(r)){case 1:n=wt;break;case 4:n=Tt;break;case 16:n=Et;break;case 536870912:n=Ot;break;default:n=Et}n=Wl(n,_l.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function _l(e,t){if(dl=-1,fl=0,J&6)throw Error(r(327));var n=e.callbackNode;if(Ll()&&e.callbackNode!==n)return null;var i=zt(e,e===Y?Z:0);if(i===0)return null;if(i&30||(i&e.expiredLanes)!==0||t)t=Al(e,i);else{t=i;var a=J;J|=2;var o=Ol();(Y!==e||Z!==t)&&(nl=null,tl=N()+500,El(e,t));do try{Ml();break}catch(t){Dl(e,t)}while(1);Za(),Uc.current=o,J=a,X===null?(Y=null,Z=0,t=Q):t=0}if(t!==0){if(t===2&&(a=Ht(e),a!==0&&(i=a,t=vl(e,a))),t===1)throw n=Jc,El(e,0),xl(e,i),gl(e,N()),n;if(t===6)xl(e,i);else{if(a=e.current.alternate,!(i&30)&&!bl(a)&&(t=Al(e,i),t===2&&(o=Ht(e),o!==0&&(i=o,t=vl(e,o))),t===1))throw n=Jc,El(e,0),xl(e,i),gl(e,N()),n;switch(e.finishedWork=a,e.finishedLanes=i,t){case 0:case 1:throw Error(r(345));case 2:Fl(e,$c,nl);break;case 3:if(xl(e,i),(i&130023424)===i&&(t=el+500-N(),10<t)){if(zt(e,0)!==0)break;if(a=e.suspendedLanes,(a&i)!==i){pl(),e.pingedLanes|=e.suspendedLanes&a;break}e.timeoutHandle=ji(Fl.bind(null,e,$c,nl),t);break}Fl(e,$c,nl);break;case 4:if(xl(e,i),(i&4194240)===i)break;for(t=e.eventTimes,a=-1;0<i;){var s=31-Mt(i);o=1<<s,s=t[s],s>a&&(a=s),i&=~o}if(i=a,i=N()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Hc(i/1960))-i,10<i){e.timeoutHandle=ji(Fl.bind(null,e,$c,nl),i);break}Fl(e,$c,nl);break;case 5:Fl(e,$c,nl);break;default:throw Error(r(329))}}}return gl(e,N()),e.callbackNode===n?_l.bind(null,e):null}function vl(e,t){var n=Qc;return e.current.memoizedState.isDehydrated&&(El(e,t).flags|=256),e=Al(e,t),e!==2&&(t=$c,$c=n,t!==null&&yl(t)),e}function yl(e){$c===null?$c=e:$c.push.apply($c,e)}function bl(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Ir(a(),i))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function xl(e,t){for(t&=~Zc,t&=~Xc,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Mt(t),r=1<<n;e[n]=-1,t&=~r}}function Sl(e){if(J&6)throw Error(r(327));Ll();var t=zt(e,0);if(!(t&1))return gl(e,N()),null;var n=Al(e,t);if(e.tag!==0&&n===2){var i=Ht(e);i!==0&&(t=i,n=vl(e,i))}if(n===1)throw n=Jc,El(e,0),xl(e,t),gl(e,N()),n;if(n===6)throw Error(r(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Fl(e,$c,nl),gl(e,N()),null}function Cl(e,t){var n=J;J|=1;try{return e(t)}finally{J=n,J===0&&(tl=N()+500,ua&&ma())}}function wl(e){sl!==null&&sl.tag===0&&!(J&6)&&Ll();var t=J;J|=1;var n=Gc.transition,r=P;try{if(Gc.transition=null,P=1,e)return e()}finally{P=r,Gc.transition=n,J=t,!(J&6)&&ma()}}function Tl(){Kc=qc.current,I(qc)}function El(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Mi(n)),X!==null)for(n=X.return;n!==null;){var r=n;switch(Da(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&ia();break;case 3:So(),I(ea),I(R),Do();break;case 5:wo(r);break;case 4:So();break;case 13:I(B);break;case 19:I(B);break;case 10:Qa(r.type._context);break;case 22:case 23:Tl()}n=n.return}if(Y=e,X=e=Yl(e.current,null),Z=Kc=t,Q=0,Jc=null,Zc=Xc=Yc=0,$c=Qc=null,no!==null){for(t=0;t<no.length;t++)if(n=no[t],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,a=n.pending;if(a!==null){var o=a.next;a.next=i,r.next=o}n.pending=r}no=null}return e}function Dl(e,t){do{var n=X;try{if(Za(),Oo.current=vs,jo){for(var i=V.memoizedState;i!==null;){var a=i.queue;a!==null&&(a.pending=null),i=i.next}jo=!1}if(Ao=0,U=H=V=null,Mo=!1,No=0,Wc.current=null,n===null||n.return===null){Q=1,Jc=t,X=null;break}a:{var o=e,s=n.return,c=n,l=t;if(t=Z,c.flags|=32768,typeof l==`object`&&l&&typeof l.then==`function`){var u=l,d=c,f=d.tag;if(!(d.mode&1)&&(f===0||f===11||f===15)){var p=d.alternate;p?(d.updateQueue=p.updateQueue,d.memoizedState=p.memoizedState,d.lanes=p.lanes):(d.updateQueue=null,d.memoizedState=null)}var m=Is(s);if(m!==null){m.flags&=-257,Ls(m,s,c,o,t),m.mode&1&&Fs(o,u,t),t=m,l=u;var h=t.updateQueue;if(h===null){var g=new Set;g.add(l),t.updateQueue=g}else h.add(l);break a}else{if(!(t&1)){Fs(o,u,t),kl();break a}l=Error(r(426))}}else if(z&&c.mode&1){var _=Is(s);if(_!==null){!(_.flags&65536)&&(_.flags|=256),Ls(_,s,c,o,t),za(ks(l,c));break a}}o=l=ks(l,c),Q!==4&&(Q=2),Qc===null?Qc=[o]:Qc.push(o),o=s;do{switch(o.tag){case 3:o.flags|=65536,t&=-t,o.lanes|=t;var v=Ns(o,l,t);po(o,v);break a;case 1:c=l;var y=o.type,b=o.stateNode;if(!(o.flags&128)&&(typeof y.getDerivedStateFromError==`function`||b!==null&&typeof b.componentDidCatch==`function`&&(al===null||!al.has(b)))){o.flags|=65536,t&=-t,o.lanes|=t;var x=Ps(o,c,t);po(o,x);break a}}o=o.return}while(o!==null)}Pl(n)}catch(e){t=e,X===n&&n!==null&&(X=n=n.return);continue}break}while(1)}function Ol(){var e=Uc.current;return Uc.current=vs,e===null?vs:e}function kl(){(Q===0||Q===3||Q===2)&&(Q=4),Y===null||!(Yc&268435455)&&!(Xc&268435455)||xl(Y,Z)}function Al(e,t){var n=J;J|=2;var i=Ol();(Y!==e||Z!==t)&&(nl=null,El(e,t));do try{jl();break}catch(t){Dl(e,t)}while(1);if(Za(),J=n,Uc.current=i,X!==null)throw Error(r(261));return Y=null,Z=0,Q}function jl(){for(;X!==null;)Nl(X)}function Ml(){for(;X!==null&&!xt();)Nl(X)}function Nl(e){var t=Ul(e.alternate,e,Kc);e.memoizedProps=e.pendingProps,t===null?Pl(e):X=t,Wc.current=null}function Pl(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=mc(n,t),n!==null){n.flags&=32767,X=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Q=6,X=null;return}}else if(n=pc(n,t,Kc),n!==null){X=n;return}if(t=t.sibling,t!==null){X=t;return}X=t=e}while(t!==null);Q===0&&(Q=5)}function Fl(e,t,n){var r=P,i=Gc.transition;try{Gc.transition=null,P=1,Il(e,t,n,r)}finally{Gc.transition=i,P=r}return null}function Il(e,t,n,i){do Ll();while(sl!==null);if(J&6)throw Error(r(327));n=e.finishedWork;var a=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(r(177));e.callbackNode=null,e.callbackPriority=0;var o=n.lanes|n.childLanes;if(Kt(e,o),e===Y&&(X=Y=null,Z=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||ol||(ol=!0,Wl(Et,function(){return Ll(),null})),o=(n.flags&15990)!=0,n.subtreeFlags&15990||o){o=Gc.transition,Gc.transition=null;var s=P;P=1;var c=J;J|=4,Wc.current=null,xc(e,n),Fc(n,e),Ur(ki),bn=!!Oi,ki=Oi=null,e.current=n,Lc(n,e,a),St(),J=c,P=s,Gc.transition=o}else e.current=n;if(ol&&(ol=!1,sl=e,cl=a),o=e.pendingLanes,o===0&&(al=null),jt(n.stateNode,i),gl(e,N()),t!==null)for(i=e.onRecoverableError,n=0;n<t.length;n++)a=t[n],i(a.value,{componentStack:a.stack,digest:a.digest});if(rl)throw rl=!1,e=il,il=null,e;return cl&1&&e.tag!==0&&Ll(),o=e.pendingLanes,o&1?e===ul?ll++:(ll=0,ul=e):ll=0,ma(),null}function Ll(){if(sl!==null){var e=Jt(cl),t=Gc.transition,n=P;try{if(Gc.transition=null,P=16>e?16:e,sl===null)var i=!1;else{if(e=sl,sl=null,cl=0,J&6)throw Error(r(331));var a=J;for(J|=4,K=e.current;K!==null;){var o=K,s=o.child;if(K.flags&16){var c=o.deletions;if(c!==null){for(var l=0;l<c.length;l++){var u=c[l];for(K=u;K!==null;){var d=K;switch(d.tag){case 0:case 11:case 15:Sc(8,d,o)}var f=d.child;if(f!==null)f.return=d,K=f;else for(;K!==null;){d=K;var p=d.sibling,m=d.return;if(Tc(d),d===u){K=null;break}if(p!==null){p.return=m,K=p;break}K=m}}}var h=o.alternate;if(h!==null){var g=h.child;if(g!==null){h.child=null;do{var _=g.sibling;g.sibling=null,g=_}while(g!==null)}}K=o}}if(o.subtreeFlags&2064&&s!==null)s.return=o,K=s;else b:for(;K!==null;){if(o=K,o.flags&2048)switch(o.tag){case 0:case 11:case 15:Sc(9,o,o.return)}var v=o.sibling;if(v!==null){v.return=o.return,K=v;break b}K=o.return}}var y=e.current;for(K=y;K!==null;){s=K;var b=s.child;if(s.subtreeFlags&2064&&b!==null)b.return=s,K=b;else b:for(s=y;K!==null;){if(c=K,c.flags&2048)try{switch(c.tag){case 0:case 11:case 15:Cc(9,c)}}catch(e){$(c,c.return,e)}if(c===s){K=null;break b}var x=c.sibling;if(x!==null){x.return=c.return,K=x;break b}K=c.return}}if(J=a,ma(),At&&typeof At.onPostCommitFiberRoot==`function`)try{At.onPostCommitFiberRoot(kt,e)}catch{}i=!0}return i}finally{P=n,Gc.transition=t}}return!1}function Rl(e,t,n){t=ks(n,t),t=Ns(e,t,1),e=uo(e,t,1),t=pl(),e!==null&&(Gt(e,1,t),gl(e,t))}function $(e,t,n){if(e.tag===3)Rl(e,e,n);else for(;t!==null;){if(t.tag===3){Rl(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(al===null||!al.has(r))){e=ks(n,e),e=Ps(t,e,1),t=uo(t,e,1),e=pl(),t!==null&&(Gt(t,1,e),gl(t,e));break}}t=t.return}}function zl(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=pl(),e.pingedLanes|=e.suspendedLanes&n,Y===e&&(Z&n)===n&&(Q===4||Q===3&&(Z&130023424)===Z&&500>N()-el?El(e,0):Zc|=n),gl(e,t)}function Bl(e,t){t===0&&(e.mode&1?(t=Lt,Lt<<=1,!(Lt&130023424)&&(Lt=4194304)):t=1);var n=pl();e=ao(e,t),e!==null&&(Gt(e,t,n),gl(e,n))}function Vl(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Bl(e,n)}function Hl(e,t){var n=0;switch(e.tag){case 13:var i=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:i=e.stateNode;break;default:throw Error(r(314))}i!==null&&i.delete(t),Bl(e,n)}var Ul=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ea.current)zs=!0;else{if((e.lanes&n)===0&&!(t.flags&128))return zs=!1,cc(e,t,n);zs=!!(e.flags&131072)}else zs=!1,z&&t.flags&1048576&&Ta(t,va,t.index);switch(t.lanes=0,t.tag){case 2:var i=t.type;oc(e,t),e=t.pendingProps;var a=na(t,R.current);eo(t,n),a=Io(null,t,i,e,a,n);var o=Lo();return t.flags|=1,typeof a==`object`&&a&&typeof a.render==`function`&&a.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,ra(i)?(o=!0,sa(t)):o=!1,t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,so(t),a.updater=ws,t.stateNode=a,a._reactInternals=t,Os(t,i,e,n),t=Js(null,t,i,!0,o,n)):(t.tag=0,z&&o&&Ea(t),Bs(null,t,a,n),t=t.child),t;case 16:i=t.elementType;a:{switch(oc(e,t),e=t.pendingProps,a=i._init,i=a(i._payload),t.type=i,a=t.tag=Jl(i),e=Ss(i,e),a){case 0:t=Ks(null,t,i,e,n);break a;case 1:t=qs(null,t,i,e,n);break a;case 11:t=Vs(null,t,i,e,n);break a;case 14:t=Hs(null,t,i,Ss(i.type,e),n);break a}throw Error(r(306,i,``))}return t;case 0:return i=t.type,a=t.pendingProps,a=t.elementType===i?a:Ss(i,a),Ks(e,t,i,a,n);case 1:return i=t.type,a=t.pendingProps,a=t.elementType===i?a:Ss(i,a),qs(e,t,i,a,n);case 3:a:{if(Ys(t),e===null)throw Error(r(387));i=t.pendingProps,o=t.memoizedState,a=o.element,co(e,t),mo(t,i,null,n);var s=t.memoizedState;if(i=s.element,o.isDehydrated)if(o={element:i,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){a=ks(Error(r(423)),t),t=Xs(e,t,i,n,a);break a}else if(i!==a){a=ks(Error(r(424)),t),t=Xs(e,t,i,n,a);break a}else for(ka=Li(t.stateNode.containerInfo.firstChild),Oa=t,z=!0,Aa=null,n=Ka(t,null,i,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ra(),i===a){t=sc(e,t,n);break a}Bs(e,t,i,n)}t=t.child}return t;case 5:return Co(t),e===null&&Pa(t),i=t.type,a=t.pendingProps,o=e===null?null:e.memoizedProps,s=a.children,Ai(i,a)?s=null:o!==null&&Ai(i,o)&&(t.flags|=32),Gs(e,t),Bs(e,t,s,n),t.child;case 6:return e===null&&Pa(t),null;case 13:return $s(e,t,n);case 4:return xo(t,t.stateNode.containerInfo),i=t.pendingProps,e===null?t.child=Ga(t,null,i,n):Bs(e,t,i,n),t.child;case 11:return i=t.type,a=t.pendingProps,a=t.elementType===i?a:Ss(i,a),Vs(e,t,i,a,n);case 7:return Bs(e,t,t.pendingProps,n),t.child;case 8:return Bs(e,t,t.pendingProps.children,n),t.child;case 12:return Bs(e,t,t.pendingProps.children,n),t.child;case 10:a:{if(i=t.type._context,a=t.pendingProps,o=t.memoizedProps,s=a.value,L(qa,i._currentValue),i._currentValue=s,o!==null)if(Ir(o.value,s)){if(o.children===a.children&&!ea.current){t=sc(e,t,n);break a}}else for(o=t.child,o!==null&&(o.return=t);o!==null;){var c=o.dependencies;if(c!==null){s=o.child;for(var l=c.firstContext;l!==null;){if(l.context===i){if(o.tag===1){l=lo(-1,n&-n),l.tag=2;var u=o.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?l.next=l:(l.next=d.next,d.next=l),u.pending=l}}o.lanes|=n,l=o.alternate,l!==null&&(l.lanes|=n),$a(o.return,n,t),c.lanes|=n;break}l=l.next}}else if(o.tag===10)s=o.type===t.type?null:o.child;else if(o.tag===18){if(s=o.return,s===null)throw Error(r(341));s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),$a(s,n,t),s=o.sibling}else s=o.child;if(s!==null)s.return=o;else for(s=o;s!==null;){if(s===t){s=null;break}if(o=s.sibling,o!==null){o.return=s.return,s=o;break}s=s.return}o=s}Bs(e,t,a.children,n),t=t.child}return t;case 9:return a=t.type,i=t.pendingProps.children,eo(t,n),a=to(a),i=i(a),t.flags|=1,Bs(e,t,i,n),t.child;case 14:return i=t.type,a=Ss(i,t.pendingProps),a=Ss(i.type,a),Hs(e,t,i,a,n);case 15:return Us(e,t,t.type,t.pendingProps,n);case 17:return i=t.type,a=t.pendingProps,a=t.elementType===i?a:Ss(i,a),oc(e,t),t.tag=1,ra(i)?(e=!0,sa(t)):e=!1,eo(t,n),Es(t,i,a),Os(t,i,a,n),Js(null,t,i,!0,e,n);case 19:return ac(e,t,n);case 22:return Ws(e,t,n)}throw Error(r(156,t.tag))};function Wl(e,t){return yt(e,t)}function Gl(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Kl(e,t,n,r){return new Gl(e,t,n,r)}function ql(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Jl(e){if(typeof e==`function`)return+!!ql(e);if(e!=null){if(e=e.$$typeof,e===re)return 11;if(e===k)return 14}return 2}function Yl(e,t){var n=e.alternate;return n===null?(n=Kl(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Xl(e,t,n,i,a,o){var s=2;if(i=e,typeof e==`function`)ql(e)&&(s=1);else if(typeof e==`string`)s=5;else a:switch(e){case ee:return Zl(n.children,a,o,t);case te:s=8,a|=8;break;case E:return e=Kl(12,n,t,a|2),e.elementType=E,e.lanes=o,e;case O:return e=Kl(13,n,t,a),e.elementType=O,e.lanes=o,e;case ie:return e=Kl(19,n,t,a),e.elementType=ie,e.lanes=o,e;case ae:return Ql(n,a,o,t);default:if(typeof e==`object`&&e)switch(e.$$typeof){case D:s=10;break a;case ne:s=9;break a;case re:s=11;break a;case k:s=14;break a;case A:s=16,i=null;break a}throw Error(r(130,e==null?e:typeof e,``))}return t=Kl(s,n,t,a),t.elementType=e,t.type=i,t.lanes=o,t}function Zl(e,t,n,r){return e=Kl(7,e,r,t),e.lanes=n,e}function Ql(e,t,n,r){return e=Kl(22,e,r,t),e.elementType=ae,e.lanes=n,e.stateNode={isHidden:!1},e}function $l(e,t,n){return e=Kl(6,e,null,t),e.lanes=n,e}function eu(e,t,n){return t=Kl(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function tu(e,t,n,r,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Wt(0),this.expirationTimes=Wt(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Wt(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function nu(e,t,n,r,i,a,o,s,c){return e=new tu(e,t,n,s,c),t===1?(t=1,!0===a&&(t|=8)):t=0,a=Kl(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},so(a),e}function ru(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:T,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}function iu(e){if(!e)return $i;e=e._reactInternals;a:{if(pt(e)!==e||e.tag!==1)throw Error(r(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break a;case 1:if(ra(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break a}}t=t.return}while(t!==null);throw Error(r(171))}if(e.tag===1){var n=e.type;if(ra(n))return oa(e,n,t)}return t}function au(e,t,n,r,i,a,o,s,c){return e=nu(n,r,!0,e,i,a,o,s,c),e.context=iu(null),n=e.current,r=pl(),i=ml(n),a=lo(r,i),a.callback=t??null,uo(n,a,i),e.current.lanes=i,Gt(e,i,r),gl(e,r),e}function ou(e,t,n,r){var i=t.current,a=pl(),o=ml(i);return n=iu(n),t.context===null?t.context=n:t.pendingContext=n,t=lo(a,o),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=uo(i,t,o),e!==null&&(hl(e,i,o,a),fo(e,i,o)),o}function su(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function cu(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function lu(e,t){cu(e,t),(e=e.alternate)&&cu(e,t)}function uu(){return null}var du=typeof reportError==`function`?reportError:function(e){console.error(e)};function fu(e){this._internalRoot=e}pu.prototype.render=fu.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(r(409));ou(e,t,null,null)},pu.prototype.unmount=fu.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;wl(function(){ou(null,e,null,null)}),t[Hi]=null}};function pu(e){this._internalRoot=e}pu.prototype.unstable_scheduleHydration=function(e){if(e){var t=Qt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<cn.length&&t!==0&&t<cn[n].priority;n++);cn.splice(n,0,e),n===0&&pn(e)}};function mu(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function hu(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==` react-mount-point-unstable `))}function gu(){}function _u(e,t,n,r,i){if(i){if(typeof r==`function`){var a=r;r=function(){var e=su(o);a.call(e)}}var o=au(t,r,e,0,null,!1,!1,``,gu);return e._reactRootContainer=o,e[Hi]=o.current,gi(e.nodeType===8?e.parentNode:e),wl(),o}for(;i=e.lastChild;)e.removeChild(i);if(typeof r==`function`){var s=r;r=function(){var e=su(c);s.call(e)}}var c=nu(e,0,!1,null,null,!1,!1,``,gu);return e._reactRootContainer=c,e[Hi]=c.current,gi(e.nodeType===8?e.parentNode:e),wl(function(){ou(t,c,n,r)}),c}function vu(e,t,n,r,i){var a=n._reactRootContainer;if(a){var o=a;if(typeof i==`function`){var s=i;i=function(){var e=su(o);s.call(e)}}ou(t,o,e,i)}else o=_u(n,t,e,i,r);return su(o)}Yt=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=Rt(t.pendingLanes);n!==0&&(qt(t,n|1),gl(t,N()),!(J&6)&&(tl=N()+500,ma()))}break;case 13:wl(function(){var t=ao(e,1);t!==null&&hl(t,e,1,pl())}),lu(e,1)}},Xt=function(e){if(e.tag===13){var t=ao(e,134217728);t!==null&&hl(t,e,134217728,pl()),lu(e,134217728)}},Zt=function(e){if(e.tag===13){var t=ml(e),n=ao(e,t);n!==null&&hl(n,e,t,pl()),lu(e,t)}},Qt=function(){return P},$t=function(e,t){var n=P;try{return P=e,t()}finally{P=n}},Ke=function(e,t,n){switch(t){case`input`:if(Ce(e,n),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name=`+JSON.stringify(``+t)+`][type="radio"]`),t=0;t<n.length;t++){var i=n[t];if(i!==e&&i.form===e.form){var a=Yi(i);if(!a)throw Error(r(90));ve(i),Ce(i,a)}}}break;case`textarea`:Ae(e,n);break;case`select`:t=n.value,t!=null&&De(e,!!n.multiple,t,!1)}},Qe=Cl,$e=wl;var yu={usingClientEntryPoint:!1,Events:[qi,Ji,Yi,Xe,Ze,Cl]},bu={findFiberByHostInstance:Ki,bundleType:0,version:`18.3.1`,rendererPackageName:`react-dom`},xu={bundleType:bu.bundleType,version:bu.version,rendererPackageName:bu.rendererPackageName,rendererConfig:bu.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:C.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=_t(e),e===null?null:e.stateNode},findFiberByHostInstance:bu.findFiberByHostInstance||uu,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:`18.3.1-next-f1338f8080-20240426`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var Su=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Su.isDisabled&&Su.supportsFiber)try{kt=Su.inject(xu),At=Su}catch{}}e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=yu,e.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!mu(t))throw Error(r(200));return ru(e,t,null,n)},e.createRoot=function(e,t){if(!mu(e))throw Error(r(299));var n=!1,i=``,a=du;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(i=t.identifierPrefix),t.onRecoverableError!==void 0&&(a=t.onRecoverableError)),t=nu(e,1,!1,null,null,n,!1,i,a),e[Hi]=t.current,gi(e.nodeType===8?e.parentNode:e),new fu(t)},e.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(r(188)):(e=Object.keys(e).join(`,`),Error(r(268,e)));return e=_t(t),e=e===null?null:e.stateNode,e},e.flushSync=function(e){return wl(e)},e.hydrate=function(e,t,n){if(!hu(t))throw Error(r(200));return vu(null,e,t,!0,n)},e.hydrateRoot=function(e,t,n){if(!mu(e))throw Error(r(405));var i=n!=null&&n.hydratedSources||null,a=!1,o=``,s=du;if(n!=null&&(!0===n.unstable_strictMode&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=au(t,null,e,1,n??null,a,!1,o,s),e[Hi]=t.current,gi(e),i)for(e=0;e<i.length;e++)n=i[e],a=n._getVersion,a=a(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,a]:t.mutableSourceEagerHydrationData.push(n,a);return new pu(t)},e.render=function(e,t,n){if(!hu(t))throw Error(r(200));return vu(null,e,t,!1,n)},e.unmountComponentAtNode=function(e){if(!hu(e))throw Error(r(40));return e._reactRootContainer?(wl(function(){vu(null,null,e,!1,function(){e._reactRootContainer=null,e[Hi]=null})}),!0):!1},e.unstable_batchedUpdates=Cl,e.unstable_renderSubtreeIntoContainer=function(e,t,n,i){if(!hu(n))throw Error(r(200));if(e==null||e._reactInternals===void 0)throw Error(r(38));return vu(e,t,n,!1,i)},e.version=`18.3.1-next-f1338f8080-20240426`})),_=t(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()})),v=t((e=>{var t=_();e.createRoot=t.createRoot,e.hydrateRoot=t.hydrateRoot})),y=e(p(),1),b=v(),x=class{codeTransformer=new r;async initialize(){await this.codeTransformer.initialize()}async compile(e){let t=l({...c,...e.depsInfo},i),n=await this.codeTransformer.transformFiles(e.files,t.dependencies);return{fileUrls:n,entryFile:e.entryFile,transformedFiles:n.size}}cleanup(e){e&&this.codeTransformer.cleanup(e.fileUrls)}};function S(e){return typeof e==`object`&&!!e&&`compile`in e}function C(e){return e?typeof e==`string`?{type:e}:S(e)?{type:`babel`}:{type:e.type??`babel`,rspack:e.rspack}:{type:`babel`}}function w(e){if(S(e))return`custom`;let t=C(e);return JSON.stringify({type:t.type,rspack:t.rspack?{cdnDomain:t.rspack.cdnDomain,outputFileName:t.rspack.outputFileName,useWorker:t.rspack.useWorker}:void 0})}function T(e){if(S(e))return e;let t=C(e);return t.type===`rspack-browser`?new ee(t.rspack):new x}var ee=class{options;compilerPromise=null;constructor(e={}){this.options=e}async compile(e){return(await this.getCompiler()).compile(e)}async cleanup(e){this.compilerPromise&&await(await this.compilerPromise).cleanup?.(e)}async getCompiler(){return this.compilerPromise||=u(async()=>{let{RspackBrowserPreviewCompiler:e}=await import(`./rspackBrowser-7Nsc6EIb.js`);return{RspackBrowserPreviewCompiler:e}},__vite__mapDeps([0,1,2])).then(({RspackBrowserPreviewCompiler:e})=>new e(this.options)),this.compilerPromise}},te=a(`FileProcessor`),E=class{compiler;compilerKey;currentResult=null;constructor(e){this.compiler=T(e),this.compilerKey=w(e)}async configure(e){let t=w(e);t!==this.compilerKey&&(await this.cleanup(),await this.compiler.cleanup?.(),this.compiler=T(e),this.compilerKey=t)}async initialize(){await this.compiler.initialize?.()}async processFiles(e,t,n){try{await this.cleanup();let r=await this.compiler.compile({files:e,depsInfo:t,entryFile:n});return te.debug(`transformed`,r.fileUrls),this.currentResult=r,r}catch(e){throw te.error(`Error processing files:`,e),e}}async cleanup(){if(this.currentResult){let e=this.currentResult;if(e.cleanup)e.cleanup();else if(this.compiler.cleanup)await this.compiler.cleanup(e);else for(let t of e.fileUrls.values())URL.revokeObjectURL(t);this.currentResult=null}}async dispose(){await this.cleanup(),await this.compiler.cleanup?.()}},D=a(`ErrorHandler`),ne=class{blobToFileMap=new Map;setBlobToFileMap(e){this.blobToFileMap.clear(),e.forEach((e,t)=>{D.debug(`setBlobToFileMap:`,e,t),this.blobToFileMap.set(e,t)})}processRuntimeError(e){let t=e.filename;if(e.stack&&this.blobToFileMap.size>0){let n=e.stack.split(`
`);for(let e of n){D.trace(`stack line:`,e);let n=e.match(/(blob:[^)]*):\d+:\d+/);if(n&&n[1]){D.debug(`matched blob url:`,n[1]);let e=this.blobToFileMap.get(n[1]);if(D.debug(`mapped fileName:`,e),e){t=e;break}}}D.debug(`runtime-error fileName:`,t,e.stack,this.blobToFileMap)}if(t&&t.startsWith(`blob:`)){let e=this.blobToFileMap.get(t);e&&(t=e)}if(!t&&e.stack){for(let[n,r]of this.blobToFileMap.entries())if(e.stack.includes(n)){t=r;break}if(!t){let n=e.stack.match(/(blob:[^\s)]+)/);if(n&&n[1]){let e=this.blobToFileMap.get(n[1]);e&&(t=e)}}}return{type:`runtime`,message:e.message||`Runtime error occurred`,stack:this.processStackTrace(e.stack),fileName:t,lineNumber:e.lineno,columnNumber:e.colno}}processCompileError(e){D.debug(`processCompileError: =======`,e);let t=e.filename||e.fileName;if(t&&t.startsWith(`blob:`)){let e=this.blobToFileMap.get(t);e&&(t=e)}let n=e.loc?.line,r=e.loc?.column,i=e.codeFrame,a=e.message;return i&&a&&a.includes(i)&&(a=a.replace(i,``).trim()),{type:`compile`,message:a||`Compile error occurred`,stack:e.stack,fileName:t,lineNumber:n,columnNumber:r,codeFrame:i}}processStackTrace(e){if(!e)return e;let t=e;this.blobToFileMap.forEach((e,n)=>{let r=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`),`g`);t=t.replace(r,e)});let n=Array.from(this.blobToFileMap.values()),r=t.split(`
`),i=r.filter(e=>n.some(t=>e.includes(t)));if(i.length>0)return i.join(`
`);let a=r.filter(e=>/blob:[^\s):]+/.test(e));return a.length>0?a.join(`
`):r[0]}},re=class{cache=new Map;generatePreviewHTML(e,t={},r={},a=`/`){let o={react:`18.2.0`,"react-dom":`18.2.0`,"react-dom/client":`18.2.0`,...t},c=this.resolveStyleResources(o,r),u=JSON.stringify({allDeps:o,styleResources:c}),d=this.cache.get(u);return d||(d={dynamicLoaderScript:n(o,i,c),importMapScript:s(l(o,i).importMap.imports)},this.cache.set(u,d)),`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React Preview</title>
        <style>
          ${this.getBaseStyles()}
        </style>
        ${d.importMapScript}
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
          ${d.dynamicLoaderScript}
          ${this.getPreviewScript(e,a)}
        <\/script>
      </body>
      </html>
    `}getBaseStyles(){return`
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        background: #f8fafc;
      }
      #root {
        width: 100%;
        height: 100vh;
      }
      /* 检查模式相关样式，使用更高优先级避免被 Tailwind 覆盖 */
      .inspect-highlight {
        outline: 2px dashed #007acc !important;
        outline-offset: 2px !important;
        background-color: rgba(0, 122, 204, 0.1) !important;
      }
      .inspect-mode {
        cursor: crosshair !important;
      }
      .inspect-mode * {
        cursor: crosshair !important;
      }
      .inspect-clickable {
        position: relative;
      }
      .inspect-clickable::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid transparent;
        pointer-events: none;
        transition: border-color 0.2s ease;
      }
      .inspect-clickable:hover::after {
        border-color: #007acc;
        background-color: rgba(0, 122, 204, 0.05);
      }
    `}resolveStyleResources(e,t){let n={...o,...t};return Object.entries(n).filter(([t])=>t in e).flatMap(([e,t])=>{let n=Array.isArray(t)?t:[t];return n.map((t,r)=>({name:n.length>1?`${e}:${r+1}`:e,url:t}))})}getPreviewScript(e,t){return`
      const configuredInitialPath = ${JSON.stringify(t||`/`)};

      function normalizePreviewPath(value) {
        const fallback = window.location.pathname + window.location.search + window.location.hash;
        if (typeof value !== 'string' || value.trim() === '') {
          return fallback || '/';
        }

        const trimmed = value.trim();
        if (trimmed.startsWith('#')) {
          return window.location.pathname + window.location.search + trimmed;
        }

        try {
          const url = new URL(trimmed, window.location.origin);
          return url.pathname + url.search + url.hash;
        } catch (error) {
          return trimmed.startsWith('/') ? trimmed : '/' + trimmed;
        }
      }

      function getRouteState() {
        const pathname = window.location.pathname || '/';
        const search = window.location.search || '';
        const hash = window.location.hash || '';
        return {
          pathname,
          search,
          hash,
          href: pathname + search + hash
        };
      }

      function postRouteChange() {
        window.parent.postMessage({
          type: 'route-change',
          data: getRouteState()
        }, '*');
      }

      function applyPreviewRoute(nextPath, mode = 'push') {
        const normalizedPath = normalizePreviewPath(nextPath);
        const currentPath = window.location.pathname + window.location.search + window.location.hash;
        if (normalizedPath === currentPath) {
          postRouteChange();
          return;
        }

        try {
          const method = mode === 'replace' ? 'replaceState' : 'pushState';
          window.history[method](window.history.state, '', normalizedPath);
          window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
          postRouteChange();
        } catch (error) {
          console.warn('Failed to update preview route:', error);
        }
      }

      function installRouteSync() {
        const originalPushState = window.history.pushState.bind(window.history);
        const originalReplaceState = window.history.replaceState.bind(window.history);

        window.history.pushState = function pushState(state, title, url) {
          const result = originalPushState(state, title, url);
          postRouteChange();
          return result;
        };

        window.history.replaceState = function replaceState(state, title, url) {
          const result = originalReplaceState(state, title, url);
          postRouteChange();
          return result;
        };

        window.addEventListener('popstate', postRouteChange);
        window.addEventListener('hashchange', postRouteChange);
      }

      installRouteSync();
      applyPreviewRoute(configuredInitialPath, 'replace');

      // 等待依赖加载完成后再渲染应用
      async function renderApp() {
        try {
          window.parent.postMessage({
            type: 'resource-status',
            data: {
              phase: 'rendering',
              resourceTotal: dynamicDependencyLoader?.totalCount || 0,
              resourceLoaded: dynamicDependencyLoader?.loadedCount || 0,
              resourceProgress: dynamicDependencyLoader?.totalCount
                ? Math.round((dynamicDependencyLoader.loadedCount / dynamicDependencyLoader.totalCount) * 100)
                : 100
            }
          }, '*');

          // 现在导入依赖并渲染应用
          let React, createRoot, App;
          
          // 使用动态依赖加载器提供的 URL 导入依赖
          if (typeof dynamicDependencyLoader !== 'undefined') {
            const reactDep = dynamicDependencyLoader.dependencies.get('react');
            const reactDomDep = dynamicDependencyLoader.dependencies.get('react-dom/client');
            
            if (reactDep && reactDomDep) {
              React = await dynamicDependencyLoader.loadModule('react', reactDep.url);
              const reactDom = await dynamicDependencyLoader.loadModule('react-dom/client', reactDomDep.url);
              createRoot = reactDom.createRoot;
            } else {
              // 回退到默认导入
              React = await import('react');
              const reactDom = await import('react-dom/client');
              createRoot = reactDom.createRoot;
            }
          } else {
            // 回退到默认导入
            React = await import('react');
            const reactDom = await import('react-dom/client');
            createRoot = reactDom.createRoot;
          }
          
          window.React = React;
          App = await import('${e}');
          
          const root = createRoot(document.getElementById('root'));
          root.render(React.createElement(App.default));
          
          setTimeout(() => {
            addInspectStyles();
            
            // iframe 加载完成后，主动请求当前的检查模式状态
            window.parent.postMessage({
              type: 'request-inspect-state'
            }, '*');
            window.parent.postMessage({
              type: 'preview-ready',
              data: {
                phase: 'ready',
                resourceTotal: dynamicDependencyLoader?.totalCount || 0,
                resourceLoaded: dynamicDependencyLoader?.loadedCount || 0,
                resourceProgress: 100
              }
            }, '*');
          }, 100);
        } catch (error) {
          sendMessage('runtime-error', {
            message: error.message,
            stack: error.stack
          });
        }
      }
      
      // 监听依赖就绪事件
      window.addEventListener('dependencies-ready', () => {
        renderApp();
      });
      
      // 如果没有依赖加载器或没有依赖，直接渲染
      if (typeof dynamicDependencyLoader === 'undefined' || dynamicDependencyLoader.totalCount === 0) {
        renderApp();
      }
      
      // 错误处理
      window.addEventListener('error', (event) => {
        // 只传递可序列化的数据
        window.parent.postMessage({
          type: 'runtime-error',
          data: {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
          }
        }, '*');
      });

      window.addEventListener('unhandledrejection', (event) => {
        window.parent.postMessage({
          type: 'runtime-error',
          data: {
            message: event.reason?.message || 'Unhandled Promise Rejection',
            stack: event.reason?.stack
          }
        }, '*');
      });

      // 重写console方法以便调试
      const originalConsole = { ...console };
      ['log', 'warn', 'error', 'info'].forEach(method => {
        console[method] = (...args) => {
          originalConsole[method](...args);
          // 序列化 console 参数
          const serializedArgs = args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
              try {
                return JSON.stringify(arg);
              } catch (e) {
                return String(arg);
              }
            }
            return arg;
          });
          
          window.parent.postMessage({
            type: 'console-log',
            data: { 
              level: method, 
              args: serializedArgs 
            }
          }, '*');
        };
      });

      // 检查模式相关功能
      let isInspecting = false;
      let currentHighlight = null;

      function addInspectStyles() {
        const elements = document.querySelectorAll('[data-pipo-line][data-pipo-column][data-pipo-end-line][data-pipo-end-column][data-pipo-file]');
        elements.forEach(el => {
          if (isInspecting) {
            el.classList.add('inspect-clickable');
          } else {
            el.classList.remove('inspect-clickable');
          }
        });
      }

      // 安全的消息发送函数
      function sendMessage(type, data) {
        try {
          // 确保数据是可序列化的
          const serializedData = JSON.parse(JSON.stringify(data));
          window.parent.postMessage({
            type: type,
            data: serializedData
          }, '*');
        } catch (error) {
          console.error('Failed to send message:', error);
          // 发送简化的错误信息
          window.parent.postMessage({
            type: 'runtime-error',
            data: {
              message: 'Failed to serialize message data: ' + error.message
            }
          }, '*');
        }
      }

      window.addEventListener('message', (event) => {
        if (event.data.type === 'toggle-inspect') {
          isInspecting = event.data.enabled;
          document.body.classList.toggle('inspect-mode', isInspecting);
          
          if (!isInspecting && currentHighlight) {
            currentHighlight.classList.remove('inspect-highlight');
            currentHighlight = null;
          }
          
          addInspectStyles();
          return;
        }

        if (event.data.type === 'navigate-preview') {
          applyPreviewRoute(event.data.path, event.data.replace ? 'replace' : 'push');
        }
      });

      document.addEventListener('mouseover', (event) => {
        if (!isInspecting) return;
        
        const target = event.target.closest('[data-pipo-line][data-pipo-column][data-pipo-end-line][data-pipo-end-column][data-pipo-file]');
        if (!target) return;
        
        if (currentHighlight && currentHighlight !== target) {
          currentHighlight.classList.remove('inspect-highlight');
        }
        
        target.classList.add('inspect-highlight');
        currentHighlight = target;
      });

      document.addEventListener('mouseout', (event) => {
        if (!isInspecting) return;
        
        const target = event.target.closest('[data-pipo-line][data-pipo-column][data-pipo-end-line][data-pipo-end-column][data-pipo-file]');
        if (target && currentHighlight === target) {
          target.classList.remove('inspect-highlight');
          currentHighlight = null;
        }
      });

      // 捕获阶段，无条件拦截所有点击，并主动处理源码元素点击
      document.addEventListener('click', (event) => {
        if (isInspecting) {
          const target = event.target.closest('[data-pipo-line][data-pipo-column][data-pipo-end-line][data-pipo-end-column][data-pipo-file]');
          if (target) {
            // 主动处理 element-click 逻辑
            const startLine = target.getAttribute('data-pipo-line');
            const endLine = target.getAttribute('data-pipo-end-line');
            const startColumn = target.getAttribute('data-pipo-column');
            const endColumn = target.getAttribute('data-pipo-end-column');
            const file = target.getAttribute('data-pipo-file');
            if (file && startLine && endLine && startColumn && endColumn) {
              const clickData = {
                file: String(file),
                startLine: parseInt(startLine, 10),
                endLine: parseInt(endLine, 10),
                startColumn: parseInt(startColumn, 10),
                endColumn: parseInt(endColumn, 10),
                x: Number(event.clientX),
                y: Number(event.clientY)
              };
              sendMessage('element-click', clickData);
            }
          }
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);
    `}},O=a(`MessageHandler`),ie=class{errorHandler;onError;onElementClick;onDependencyError;constructor(e,t){this.errorHandler=e,this.onError=t.onError,this.onElementClick=t.onElementClick,this.onDependencyError=t.onDependencyError}handleMessage(e){try{let{type:t,data:n}=e.data;if(O.debug(`MessageHandler received:`,t,n),!t||typeof t!=`string`){O.warn(`Invalid message type:`,t);return}switch(t){case`runtime-error`:this.handleRuntimeError(n);break;case`element-click`:this.handleElementClick(n);break;case`console-log`:this.handleConsoleLog(n);break;case`dependency-error`:this.handleDependencyError(n);break;default:O.warn(`Unknown message type:`,t)}}catch(e){O.error(`Error handling message:`,e)}}handleRuntimeError(e){try{let t=this.errorHandler.processRuntimeError(e);this.onError?.(t)}catch(e){O.error(`Error processing runtime error:`,e)}}handleElementClick(e){try{if(!e||typeof e!=`object`){O.warn(`Invalid element click data:`,e);return}let{file:t,startLine:n,endLine:r,startColumn:i,endColumn:a,x:o,y:s}=e;if(typeof t!=`string`||typeof n!=`number`||typeof r!=`number`||typeof i!=`number`||typeof a!=`number`||typeof o!=`number`||typeof s!=`number`){O.warn(`Invalid element click data format:`,e);return}O.debug(`MessageHandler calling onElementClick with:`,e),this.onElementClick?.(e)}catch(e){O.error(`Error handling element click:`,e)}}handleConsoleLog(e){try{e&&Array.isArray(e.args)&&O.debug(`[Preview]`,...e.args)}catch(e){O.error(`Error handling console log:`,e)}}handleDependencyError(e){try{if(!e||typeof e!=`object`){O.warn(`Invalid dependency error data:`,e);return}let{name:t,url:n,error:r}=e;if(typeof t!=`string`||typeof n!=`string`||typeof r!=`string`){O.warn(`Invalid dependency error data format:`,e);return}O.warn(`依赖加载失败: ${t} (${n}) - ${r}`),this.onDependencyError?.(e)}catch(e){O.error(`Error handling dependency error:`,e)}}},k=t((e=>{var t=p(),n=Symbol.for(`react.element`),r=Symbol.for(`react.fragment`),i=Object.prototype.hasOwnProperty,a=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,o={key:!0,ref:!0,__self:!0,__source:!0};function s(e,t,r){var s,c={},l=null,u=null;for(s in r!==void 0&&(l=``+r),t.key!==void 0&&(l=``+t.key),t.ref!==void 0&&(u=t.ref),t)i.call(t,s)&&!o.hasOwnProperty(s)&&(c[s]=t[s]);if(e&&e.defaultProps)for(s in t=e.defaultProps,t)c[s]===void 0&&(c[s]=t[s]);return{$$typeof:n,type:e,key:l,ref:u,props:c,_owner:a.current}}e.Fragment=r,e.jsx=s,e.jsxs=s})),A=t(((e,t)=>{t.exports=k()}))(),ae={idle:`准备预览...`,compiling:`正在编译预览...`,"loading-js":`正在加载依赖...`,"loading-css":`正在加载样式...`,rendering:`正在渲染组件...`,ready:`预览已就绪`,error:`预览失败`},oe=({status:e})=>{let t=e.resourceTotal>0&&e.phase!==`compiling`;return(0,A.jsx)(`div`,{className:`absolute inset-0 z-[1000] flex items-center justify-center bg-white/90 backdrop-blur-sm`,children:(0,A.jsxs)(`div`,{className:`w-[min(360px,calc(100%-32px))] rounded-lg bg-white p-6 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04),0_8px_8px_-8px_rgba(0,0,0,0.04)]`,children:[(0,A.jsx)(`div`,{className:`relative`,children:(0,A.jsx)(`div`,{className:`mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ebebeb] border-t-[#171717]`})}),(0,A.jsx)(`div`,{className:`mt-4 text-sm font-semibold text-[#171717]`,children:ae[e.phase]}),(0,A.jsx)(`div`,{className:`mt-1 text-xs text-[#666666]`,children:t?`${e.resourceLoaded}/${e.resourceTotal} resources`:`请稍候，正在处理您的代码`}),t&&e.currentResource&&(0,A.jsx)(`div`,{className:`mt-2 truncate rounded-md bg-[#fafafa] px-3 py-2 text-xs text-[#666666] shadow-[0_0_0_1px_#ebebeb]`,children:e.currentResource}),t&&(0,A.jsxs)(`div`,{className:`mt-4`,children:[(0,A.jsx)(`div`,{className:`h-1.5 overflow-hidden rounded-full bg-[#ebebeb]`,children:(0,A.jsx)(`div`,{className:`h-full rounded-full bg-[#171717] transition-[width] duration-200`,style:{width:`${e.resourceProgress}%`}})}),(0,A.jsxs)(`div`,{className:`mt-2 text-xs tabular-nums text-[#666666]`,children:[e.resourceProgress,`%`]})]})]})})},se=a(`ErrorDisplay`),j=({error:e,files:t})=>{let[n,r]=(0,y.useState)(!1),[i,a]=(0,y.useState)([]),[o,s]=(0,y.useState)(null);return(0,y.useEffect)(()=>{if(se.debug(`error: =======`,e),e.type===`compile`&&e.fileName&&e.lineNumber&&t&&t[e.fileName]){let n=t[e.fileName].split(`
`),r=Math.max(0,e.lineNumber-4),i=Math.min(n.length,e.lineNumber+3);a(n.slice(r,i)),s(e.lineNumber-r-1)}else a([]),s(null)},[e,t]),(0,A.jsxs)(`div`,{className:`mx-4 my-3 overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgba(255,91,79,0.22),0_2px_2px_rgba(0,0,0,0.04)]`,children:[(0,A.jsx)(`div`,{className:`border-b border-[#ffe1de] bg-[#fff7f6] px-4 py-3`,children:(0,A.jsxs)(`div`,{className:`flex items-center`,children:[(0,A.jsx)(`svg`,{className:`mr-2 h-5 w-5 flex-shrink-0 text-[#ff5b4f]`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z`})}),(0,A.jsx)(`h3`,{className:`text-sm font-semibold text-[#c73a31]`,children:e.type===`compile`?`编译错误`:`运行时错误`})]})}),(0,A.jsxs)(`div`,{className:`p-4 space-y-4`,children:[(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`div`,{className:`mb-2 text-sm font-medium text-[#4d4d4d]`,children:`错误信息:`}),(0,A.jsx)(`div`,{className:`rounded-md bg-[#fff7f6] p-3 shadow-[0_0_0_1px_rgba(255,91,79,0.18)]`,children:(0,A.jsx)(`pre`,{className:`whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#c73a31]`,children:e.message})})]}),e.type===`compile`&&e.codeFrame?(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`div`,{className:`mb-1 text-xs text-[#666666]`,children:[e.fileName,typeof e.lineNumber==`number`?` (第${e.lineNumber}行)`:``]}),(0,A.jsx)(`pre`,{className:`overflow-auto rounded-md bg-[#171717] p-3 font-mono text-xs leading-6 whitespace-pre-wrap text-[#fafafa] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]`,dangerouslySetInnerHTML:{__html:e.codeFrame}})]}):e.type===`compile`&&e.fileName&&typeof e.lineNumber==`number`&&i.length>0&&(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`div`,{className:`mb-1 text-xs text-[#666666]`,children:[e.fileName,` (第`,e.lineNumber,`行)`]}),(0,A.jsxs)(`div`,{className:`flex overflow-auto rounded-md bg-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]`,children:[(0,A.jsx)(`div`,{className:`select-none border-r border-white/10 bg-black px-2 py-2 text-right text-[#808080]`,children:i.map((t,n)=>(0,A.jsx)(`div`,{className:`h-6 leading-6 ${n===o?`font-semibold text-[#ff5b4f]`:``}`,children:(e.lineNumber??0)-(o??0)+n},n))}),(0,A.jsx)(`pre`,{className:`m-0 min-w-[60px] bg-transparent px-3 py-2 font-mono text-xs leading-6 whitespace-pre text-[#fafafa]`,children:i.map((e,t)=>(0,A.jsx)(`div`,{className:t===o?`rounded bg-[#ff5b4f]/20 text-[#ffd4d1]`:``,children:e},t))})]})]}),e.fileName&&(0,A.jsxs)(`div`,{className:`flex items-center text-sm`,children:[(0,A.jsx)(`svg`,{className:`mr-2 h-4 w-4 text-[#666666]`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z`})}),(0,A.jsxs)(`span`,{className:`text-[#4d4d4d]`,children:[(0,A.jsx)(`span`,{className:`font-medium`,children:`文件:`}),` `,e.fileName,e.lineNumber&&(0,A.jsxs)(`span`,{className:`ml-2 text-[#666666]`,children:[`行: `,e.lineNumber,`, 列: `,e.columnNumber]})]})]}),e.stack&&(0,A.jsxs)(`div`,{children:[(0,A.jsxs)(`button`,{onClick:()=>r(!n),className:`flex items-center text-sm font-medium text-[#4d4d4d] transition-colors hover:text-[#171717]`,children:[(0,A.jsx)(`svg`,{className:`w-4 h-4 mr-2 transition-transform ${n?`rotate-90`:``}`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M9 5l7 7-7 7`})}),`错误堆栈`]}),n&&(0,A.jsx)(`div`,{className:`mt-2 max-h-64 overflow-auto rounded-md bg-[#171717] p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]`,children:(0,A.jsx)(`pre`,{className:`font-mono text-xs leading-relaxed whitespace-pre-wrap text-[#fafafa]`,children:e.stack})})]})]})]})},ce=e=>{let t=2166136261,n=e=>{for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(t,16777619)};return Object.keys(e).sort().forEach(t=>{n(t),n(`\0`),n(e[t]??``),n(`\0`)}),t.toString(36)},le=(e={})=>Object.keys(e).sort().map(t=>`${t}@${e[t]}`).join(`|`),ue=(e={})=>Object.keys(e).sort().map(t=>{let n=e[t];return`${t}:${Array.isArray(n)?n.join(`,`):n}`}).join(`|`),de=(e,t,n)=>Math.max(t,Math.min(e,n)),fe=(e,t,n,r,i)=>{if(t===n){let n=e[t-1]??``,a=de(r,0,n.length),o=de(i,a,n.length);return n.slice(a,o)}let a=[];for(let o=t-1;o<n;o+=1){let s=e[o]??``;o===t-1?a.push(s.slice(de(r,0,s.length))):o===n-1?a.push(s.slice(0,de(i,0,s.length))):a.push(s)}return a.join(`
`)},pe=(e,t)=>{let n=t[e.file];if(!n)return null;let r=n.split(`
`),i=r.length,a=de(e.startLine,1,i),o=de(e.endLine,a,i);return{file:e.file,startLine:a,endLine:o,startColumn:e.startColumn,endColumn:e.endColumn,content:fe(r,a,o,e.startColumn,e.endColumn),position:{x:e.x,y:e.y}}},M=a(`PreviewFrame`),me=()=>({isLoading:!0,phase:`compiling`,error:null,compileDuration:null,transformedFiles:0,resourceTotal:0,resourceLoaded:0,resourceProgress:0}),he=e=>{let t=e?.trim();if(!t)return`/`;if(t.startsWith(`#`))return`/${t}`;try{let e=new URL(t,`https://preview.local`);return`${e.pathname}${e.search}${e.hash}`}catch{return t.startsWith(`/`)?t:`/${t}`}},ge=e=>{let t=typeof e.pathname==`string`&&e.pathname?e.pathname:`/`,n=typeof e.search==`string`?e.search:``,r=typeof e.hash==`string`?e.hash:``;return{pathname:t,search:n,hash:r,href:typeof e.href==`string`&&e.href?e.href:`${t}${n}${r}`}},_e=y.memo(({files:e,entryFile:t,depsInfo:n={},dependencyStyles:r={},previewPath:i=`/`,onError:a,onElementClick:o,onRouteChange:s,isInspecting:c=!1,onStatusChange:l,compileDelay:u=120,compiler:d})=>{let[f,p]=(0,y.useState)(!0),[m,h]=(0,y.useState)(null),[g,_]=(0,y.useState)(()=>me()),[v,b]=(0,y.useState)(0),x=(0,y.useRef)(null),S=(0,y.useRef)(new E),C=(0,y.useRef)(new ne),T=(0,y.useRef)(new re),ee=(0,y.useRef)(null),te=(0,y.useRef)(``),D=(0,y.useRef)(``),O=(0,y.useRef)(``),k=(0,y.useRef)(``),ae=(0,y.useRef)(``),se=(0,y.useRef)(he(i)),de=(0,y.useRef)(o),fe=(0,y.useRef)(a),_e=(0,y.useRef)(s),ve=(0,y.useRef)(l),ye=(0,y.useRef)(0),be=(0,y.useRef)(null),xe=(0,y.useRef)(0),Se=(0,y.useRef)(null);de.current=o,fe.current=a,_e.current=s,ve.current=l,se.current=he(i);let Ce=(0,y.useCallback)((e={})=>{let t={isLoading:f,phase:f?`compiling`:`idle`,error:m,compileDuration:Se.current,transformedFiles:xe.current,resourceTotal:0,resourceLoaded:0,resourceProgress:0,...e};_(t),ve.current?.(t)},[m,f]),we=(0,y.useCallback)(t=>{try{if(M.debug(`Element clicked:`,t,`isInspecting:`,c),!c){M.debug(`Not in inspecting mode, ignoring click`);return}if(!t||!t.file||!t.startLine||!t.endLine||!t.startColumn||!t.endColumn){M.warn(`Missing file or line data`);return}let n=pe(t,e);if(!n){M.warn(`File content not found for:`,t.file);return}M.debug(`Resolved source info:`,n),de.current?.(n)}catch(e){M.error(`Error in handleElementClick:`,e)}},[e,c]);(0,y.useEffect)(()=>{ee.current=new ie(C.current,{onError:e=>{h(e),fe.current?.(Error(e.message)),Ce({isLoading:!1,error:e})},onElementClick:we,onDependencyError:e=>{M.warn(`依赖加载失败:`,e)}})},[we,Ce]);let Te=(0,y.useCallback)(()=>{let e=x.current,t=be.current;if(!e||!t)return;let n=e.contentDocument;n&&(be.current=null,n.open(),n.write(t),n.close())},[]),Ee=(0,y.useCallback)((e,t)=>{let i=e.get(t);if(!i)throw Error(`Entry file ${t} not found`);be.current=T.current.generatePreviewHTML(i,n,r,se.current),b(e=>e+1)},[n,r]);(0,y.useLayoutEffect)(()=>{Te()},[v,Te]);let De=(0,y.useCallback)(async r=>{let i=r??ye.current+1;ye.current=i;let a=performance.now();try{p(!0),h(null),Ce({isLoading:!0,phase:`compiling`,error:null}),await S.current.configure(d),await S.current.initialize();let r=await S.current.processFiles(e,n,t);if(i!==ye.current)return;let o=r.fileUrls;C.current.setBlobToFileMap(o),xe.current=r.transformedFiles,Ee(o,r.entryFile),Se.current=Math.round(performance.now()-a),Ce({isLoading:!0,phase:`loading-js`,error:null,compileDuration:Se.current,transformedFiles:xe.current})}catch(e){if(i!==ye.current)return;let t=C.current.processCompileError(e instanceof Error?e:Error(`Unknown error`));h(t),fe.current?.(e instanceof Error?e:Error(`Unknown error`)),p(!1),Ce({isLoading:!1,phase:`error`,error:t})}},[e,n,t,d,Ce,Ee]);return(0,y.useEffect)(()=>{let i=ce(e),a=le(n),o=ue(r),s=w(d),c=i,l=t,f=a,p=o,m=s;if(te.current!==c||D.current!==l||O.current!==f||k.current!==p||ae.current!==m){M.debug(`PreviewFrame: File content changed, reprocessing files`),M.debug(`Files hash changed:`,{old:te.current,new:c});let e=ye.current+1;ye.current=e;let t=window.setTimeout(()=>{te.current=c,D.current=l,O.current=f,k.current=p,ae.current=m,De(e)},Math.max(0,u));return()=>window.clearTimeout(t)}},[e,t,n,r,d,De,u]),(0,y.useEffect)(()=>{let e=e=>{try{if(e.source!==x.current?.contentWindow)return;if(M.debug(`Received message:`,e.data),e.data.type===`request-inspect-state`){M.debug(`Iframe requested inspect state, sending:`,c),x.current?.contentWindow&&x.current.contentWindow.postMessage({type:`toggle-inspect`,enabled:c},`*`);return}if(e.data.type===`resource-status`){let t=e.data.data||{};Ce({isLoading:!0,phase:t.phase||`loading-js`,resourceTotal:Number(t.resourceTotal)||0,resourceLoaded:Number(t.resourceLoaded)||0,resourceProgress:Number(t.resourceProgress)||0,currentResource:typeof t.currentResource==`string`?t.currentResource:void 0});return}if(e.data.type===`preview-ready`){let t=e.data.data||{};p(!1),Ce({isLoading:!1,phase:`ready`,error:null,resourceTotal:Number(t.resourceTotal)||0,resourceLoaded:Number(t.resourceLoaded)||0,resourceProgress:100});return}if(e.data.type===`route-change`){let t=ge(e.data.data||{});_e.current?.(t);return}if(e.data.type===`resource-error`){M.warn(`资源加载失败:`,e.data.data);return}ee.current?.handleMessage(e)}catch(e){M.error(`Error handling message:`,e)}};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[c,Ce]),(0,y.useEffect)(()=>{let e=he(i);se.current=e,x.current?.contentWindow&&x.current.contentWindow.postMessage({type:`navigate-preview`,path:e},`*`)},[i]),(0,y.useEffect)(()=>{x.current?.contentWindow&&x.current.contentWindow.postMessage({type:`toggle-inspect`,enabled:c},`*`)},[c]),(0,y.useEffect)(()=>{let e=S.current;return()=>{ye.current+=1,be.current=null,e.dispose()}},[]),(0,A.jsxs)(`div`,{className:`relative w-full h-full`,children:[f&&(0,A.jsx)(oe,{status:g}),m&&(0,A.jsx)(`div`,{className:`absolute inset-0 z-10 overflow-auto bg-white`,children:(0,A.jsx)(j,{error:m,files:e})}),(0,A.jsx)(`iframe`,{ref:x,title:`React preview`,className:`w-full h-full border-none transition-opacity duration-200 ${f?`opacity-50`:`opacity-100`}`,sandbox:`allow-scripts allow-same-origin`},v)]})},(e,t)=>{if(e.isInspecting!==t.isInspecting)return M.debug(`PreviewFrame: Re-rendering due to inspect mode change`),!1;if(e.onError!==t.onError||e.onElementClick!==t.onElementClick||e.onRouteChange!==t.onRouteChange||e.onStatusChange!==t.onStatusChange||e.compiler!==t.compiler)return!1;let n=JSON.stringify({filesHash:ce(e.files),entryFile:e.entryFile,depsInfo:le(e.depsInfo||{}),dependencyStyles:ue(e.dependencyStyles||{}),previewPath:he(e.previewPath),compileDelay:e.compileDelay,compiler:w(e.compiler)}),r=JSON.stringify({filesHash:ce(t.files),entryFile:t.entryFile,depsInfo:le(t.depsInfo||{}),dependencyStyles:ue(t.dependencyStyles||{}),previewPath:he(t.previewPath),compileDelay:t.compileDelay,compiler:w(t.compiler)});return n===r?(M.debug(`prevKey`,n),M.debug(`nextKey`,r),M.debug(`PreviewFrame: Skipping re-render, key props unchanged`),M.debug(`Files comparison:`,{prevFiles:Object.keys(e.files),nextFiles:Object.keys(t.files),prevFilesHash:ce(e.files),nextFilesHash:ce(t.files)}),!0):(M.debug(`PreviewFrame: Re-rendering due to key props change`),M.debug(`Files comparison:`,{prevFiles:Object.keys(e.files),nextFiles:Object.keys(t.files),prevFilesHash:ce(e.files),nextFilesHash:ce(t.files)}),!1)}),ve={idle:`Idle`,compiling:`Compiling`,"loading-js":`Loading JS`,"loading-css":`Loading CSS`,rendering:`Rendering`,ready:`Ready`,error:`Error`},ye=({isLoading:e,isInspecting:t,status:n,viewport:r,viewportPresets:i,zoom:a,onRecompile:o,onToggleInspect:s,onViewportChange:c,onZoomChange:l})=>(0,A.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-3 border-b border-[#ebebeb] bg-white px-4 py-3`,children:[(0,A.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,A.jsx)(`button`,{onClick:o,disabled:e,title:`重新编译`,className:`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors duration-150 ${e?`cursor-not-allowed bg-[#fafafa] text-[#808080] shadow-[0_0_0_1px_#ebebeb]`:`bg-[#171717] text-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] hover:bg-black active:bg-[#171717]`}`,children:e?(0,A.jsxs)(`svg`,{className:`h-4 w-4 animate-spin text-[#808080]`,fill:`none`,viewBox:`0 0 24 24`,children:[(0,A.jsx)(`circle`,{className:`opacity-25`,cx:`12`,cy:`12`,r:`10`,stroke:`currentColor`,strokeWidth:`4`}),(0,A.jsx)(`path`,{className:`opacity-75`,fill:`currentColor`,d:`M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z`})]}):(0,A.jsx)(`svg`,{className:`h-4 w-4`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15`})})}),(0,A.jsx)(`button`,{onClick:s,title:t?`关闭源码检查`:`打开源码检查`,className:`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors duration-150 ${t?`bg-[#ebf5ff] text-[#0068d6] shadow-[0_0_0_1px_rgba(0,112,243,0.18)] hover:bg-[#e0f0ff]`:`bg-white text-[#4d4d4d] shadow-[0_0_0_1px_#ebebeb] hover:bg-[#fafafa] hover:text-[#171717]`}`,children:t?(0,A.jsx)(`svg`,{className:`h-4 w-4`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M6 18L18 6M6 6l12 12`})}):(0,A.jsx)(`svg`,{className:`h-4 w-4`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z`})})}),(0,A.jsx)(`div`,{className:`flex h-9 items-center rounded-md bg-[#fafafa] p-0.5 shadow-[0_0_0_1px_#ebebeb]`,children:i.map(e=>(0,A.jsx)(`button`,{type:`button`,onClick:()=>c(e),className:`h-8 px-3 text-xs font-medium transition-colors ${r.label===e.label?`rounded bg-white text-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]`:`text-[#666666] hover:text-[#171717]`}`,children:e.label},e.label))}),(0,A.jsxs)(`label`,{className:`flex h-9 items-center gap-2 rounded-md bg-white px-3 text-xs font-medium text-[#666666] shadow-[0_0_0_1px_#ebebeb]`,children:[(0,A.jsx)(`svg`,{className:`h-4 w-4 text-[#666666]`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M21 21l-4.35-4.35M10.5 7.5v6m-3-3h6m4 0a7 7 0 11-14 0 7 7 0 0114 0z`})}),(0,A.jsx)(`input`,{"aria-label":`缩放`,type:`range`,min:`0.5`,max:`1.5`,step:`0.05`,value:a,onChange:e=>l(Number(e.target.value)),className:`w-24 accent-[#171717]`}),(0,A.jsxs)(`span`,{className:`w-10 text-right tabular-nums`,children:[Math.round(a*100),`%`]})]})]}),(0,A.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[e&&(0,A.jsxs)(`div`,{className:`flex items-center gap-2 rounded-md bg-[#fafafa] px-3 py-1.5 text-sm text-[#4d4d4d] shadow-[0_0_0_1px_#ebebeb]`,children:[(0,A.jsxs)(`svg`,{className:`h-4 w-4 animate-spin flex-shrink-0 text-[#666666]`,fill:`none`,viewBox:`0 0 24 24`,children:[(0,A.jsx)(`circle`,{className:`opacity-25`,cx:`12`,cy:`12`,r:`10`,stroke:`currentColor`,strokeWidth:`4`}),(0,A.jsx)(`path`,{className:`opacity-75`,fill:`currentColor`,d:`M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z`})]}),(0,A.jsx)(`span`,{children:ve[n.phase]}),n.resourceTotal>0&&(0,A.jsxs)(`span`,{className:`tabular-nums text-[#666666]`,children:[n.resourceProgress,`%`]})]}),!e&&n.compileDuration!==null&&!n.error&&(0,A.jsxs)(`div`,{className:`flex items-center rounded-md bg-[#ebf5ff] px-3 py-1.5 text-sm text-[#0068d6] shadow-[0_0_0_1px_rgba(0,112,243,0.16)]`,children:[(0,A.jsxs)(`span`,{className:`font-medium`,children:[n.transformedFiles,` files`]}),(0,A.jsx)(`span`,{className:`mx-2 text-[#8cc7ff]`,children:`/`}),(0,A.jsxs)(`span`,{children:[n.compileDuration,`ms`]})]}),n.error&&(0,A.jsx)(`div`,{className:`flex items-center rounded-md bg-[#fff1f0] px-3 py-1.5 text-sm text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)]`,children:(0,A.jsx)(`span`,{children:`编译失败`})}),t&&(0,A.jsxs)(`div`,{className:`flex items-center rounded-md bg-[#ebf5ff] px-3 py-1.5 text-sm text-[#0068d6] shadow-[0_0_0_1px_rgba(0,112,243,0.16)]`,children:[(0,A.jsx)(`svg`,{className:`mr-2 h-4 w-4 flex-shrink-0`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z`})}),(0,A.jsx)(`span`,{className:`whitespace-nowrap`,children:`点击元素查看源码`})]})]})]}),be=class extends y.Component{constructor(e){super(e),this.state={hasError:!1}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){console.error(`ErrorBoundary caught an error:`,e,t)}render(){return this.state.hasError?this.props.fallback||(0,A.jsxs)(`div`,{className:`rounded-lg bg-white p-4 shadow-[0_0_0_1px_rgba(255,91,79,0.24),0_2px_2px_rgba(0,0,0,0.04)]`,children:[(0,A.jsx)(`h3`,{className:`mb-2 text-sm font-semibold text-[#c73a31]`,children:`组件渲染错误`}),(0,A.jsx)(`p`,{className:`text-sm text-[#4d4d4d]`,children:this.state.error?.message||`未知错误`}),(0,A.jsx)(`button`,{onClick:()=>this.setState({hasError:!1,error:void 0}),className:`mt-3 rounded-md bg-[#171717] px-3 py-1.5 text-sm font-medium text-white hover:bg-black`,children:`重试`})]}):this.props.children}},xe=({files:e,entryFile:t=`App.tsx`,initialPath:n=`/`,onError:r,depsInfo:i={},dependencyStyles:a={},onElementClick:o,onRouteChange:s,loggerConfig:c,compileDelay:l=120,showToolbar:u=!0,className:f=``,defaultViewport:p,defaultZoom:m=1,onStatusChange:h,compiler:g})=>{let[_,v]=(0,y.useState)(!1),[b,x]=(0,y.useState)(0),[S,C]=(0,y.useState)(()=>Se(n)),[w,T]=(0,y.useState)(()=>Se(n)),[ee,te]=(0,y.useState)({isLoading:!0,phase:`compiling`,error:null,compileDuration:null,transformedFiles:0,resourceTotal:0,resourceLoaded:0,resourceProgress:0}),[E,D]=(0,y.useState)(p??{label:`Auto`,width:`100%`,height:`100%`}),[ne,re]=(0,y.useState)(m),O=(0,y.useMemo)(()=>[{label:`Auto`,width:`100%`,height:`100%`},{label:`Desktop`,width:1280,height:800},{label:`Tablet`,width:820,height:1180},{label:`Mobile`,width:390,height:844}],[]);(0,y.useEffect)(()=>{c&&(d.configure(c),d.info(`Logger configured with:`,c))},[c]),(0,y.useEffect)(()=>{let e=Se(n);C(e),T(e)},[n,t]);let ie=(0,y.useCallback)(()=>{v(e=>(d.debug(`Inspect mode toggled:`,!e),!e))},[]),k=(0,y.useCallback)(()=>{x(e=>(d.info(`Forcing recompile with new key:`,e+1),e+1))},[]),ae=(0,y.useCallback)(e=>{te(e),h?.(e)},[h]),oe=(0,y.useCallback)(e=>{C(t=>t===e.href?t:e.href),T(t=>t===e.href?t:e.href),s?.(e)},[s]),se=(0,y.useCallback)(e=>{e.preventDefault();let t=Se(w);T(t),C(t)},[w]),j=(0,y.useCallback)(e=>{re(Math.min(1.5,Math.max(.5,e)))},[]),ce=(0,y.useMemo)(()=>({width:typeof E.width==`number`?`${E.width}px`:E.width,height:typeof E.height==`number`?`${E.height+42}px`:E.height,transform:`scale(${ne})`,transformOrigin:`top center`}),[E,ne]);return(0,A.jsx)(be,{children:(0,A.jsxs)(`div`,{className:`react-previewer flex h-full w-full flex-col bg-white text-[#171717] ${f}`,children:[u&&(0,A.jsx)(ye,{isLoading:ee.isLoading,isInspecting:_,status:ee,viewport:E,viewportPresets:O,zoom:ne,onRecompile:k,onToggleInspect:ie,onViewportChange:D,onZoomChange:j}),(0,A.jsx)(`div`,{className:`relative min-h-0 w-full flex-1 overflow-auto bg-[#fafafa] p-5`,children:(0,A.jsxs)(`div`,{className:`mx-auto flex h-full min-h-[360px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04),0_8px_8px_-8px_rgba(0,0,0,0.04),0_0_0_1px_#fafafa_inset] transition-[width,height,transform] duration-200`,style:ce,children:[(0,A.jsxs)(`div`,{className:`flex h-[42px] flex-none items-center gap-3 border-b border-[#ebebeb] bg-white px-4`,children:[(0,A.jsxs)(`div`,{className:`flex items-center gap-1.5`,"aria-hidden":`true`,children:[(0,A.jsx)(`span`,{className:`h-3 w-3 rounded-full bg-[#ff5b4f] ring-1 ring-black/10`}),(0,A.jsx)(`span`,{className:`h-3 w-3 rounded-full bg-[#ebebeb] ring-1 ring-black/10`}),(0,A.jsx)(`span`,{className:`h-3 w-3 rounded-full bg-[#171717] ring-1 ring-black/10`})]}),(0,A.jsxs)(`form`,{className:`flex min-w-0 flex-1 items-center overflow-hidden rounded-md bg-[#fafafa] text-xs text-[#666666] shadow-[0_0_0_1px_#ebebeb] focus-within:bg-white focus-within:shadow-[0_0_0_1px_#171717]`,onSubmit:se,children:[(0,A.jsx)(`span`,{className:`flex-none border-r border-[#ebebeb] px-3 py-1 font-medium text-[#808080]`,children:`preview.local`}),(0,A.jsx)(`input`,{"aria-label":`预览路由路径`,value:w,onChange:e=>T(e.target.value),className:`min-w-0 flex-1 bg-transparent px-2 py-1 font-mono text-xs text-[#4d4d4d] outline-none`,spellCheck:!1}),(0,A.jsx)(`button`,{type:`submit`,title:`跳转到输入的预览路由`,className:`flex h-7 w-7 flex-none items-center justify-center border-l border-[#ebebeb] text-[#666666] transition-colors hover:bg-white hover:text-[#171717]`,children:(0,A.jsx)(`svg`,{className:`h-3.5 w-3.5`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M5 12h14m-6-6 6 6-6 6`})})})]}),(0,A.jsx)(`div`,{className:`hidden text-xs font-medium text-[#666666] sm:block`,children:E.label})]}),(0,A.jsx)(`div`,{className:`min-h-0 flex-1 bg-white`,children:(0,A.jsx)(_e,{files:e,entryFile:t,depsInfo:i,dependencyStyles:a,previewPath:S,onError:r,onElementClick:o,onRouteChange:oe,isInspecting:_,onStatusChange:ae,compileDelay:l,compiler:g},b)})]})})]})})},Se=e=>{let t=e?.trim();if(!t)return`/`;if(t.startsWith(`#`))return`/${t}`;try{let e=new URL(t,`https://preview.local`);return`${e.pathname}${e.search}${e.hash}`}catch{return t.startsWith(`/`)?t:`/${t}`}},Ce=a(`SourceTooltip`),we=({sourceInfo:e,containerElement:t,onClose:n})=>{let r=(0,y.useRef)(null),{left:i,top:a}=(()=>{let n=t.getBoundingClientRect(),r=e.position.x-n.left+10,i=e.position.y-n.top+10;return r+500>n.width-20&&(r=e.position.x-n.left-500-10),i+300>n.height-20&&(i=e.position.y-n.top-300-10),r=Math.max(20,r),i=Math.max(20,i),{left:r+n.left,top:i+n.top}})();return(0,y.useEffect)(()=>{Ce.debug(`SourceTooltip mounted with:`,e);let t=e=>{r.current&&!r.current.contains(e.target)&&n()};return document.addEventListener(`mousedown`,t),()=>{document.removeEventListener(`mousedown`,t),Ce.debug(`SourceTooltip unmounted`)}},[e,n]),(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(`div`,{className:`fixed inset-0 bg-transparent z-[9999]`,onClick:e=>{e.stopPropagation(),e.preventDefault(),n()}}),(0,A.jsxs)(`div`,{ref:r,className:`pointer-events-auto fixed z-[10001] max-h-[300px] max-w-[500px] overflow-auto rounded-lg bg-white p-4 font-mono text-xs text-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04),0_8px_8px_-8px_rgba(0,0,0,0.04)]`,style:{left:`${i}px`,top:`${a}px`},onClick:e=>{e.stopPropagation(),e.preventDefault()},children:[(0,A.jsxs)(`div`,{className:`mb-3 flex items-center justify-between border-b border-[#ebebeb] pb-2`,children:[(0,A.jsxs)(`div`,{className:`text-sm font-semibold text-[#0070f3]`,children:[e.file,`:`,e.startLine,`-`,e.endLine]}),(0,A.jsx)(`button`,{onClick:e=>{e.stopPropagation(),n()},className:`flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-transparent p-0 text-base text-[#666666] transition-colors hover:bg-[#fafafa] hover:text-[#171717]`,title:`关闭`,children:`×`})]}),(0,A.jsxs)(`div`,{className:`flex overflow-auto rounded-md bg-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]`,children:[(0,A.jsx)(`div`,{className:`select-none border-r border-white/10 bg-black px-2 py-2 text-right text-[#808080]`,children:Array.from({length:e.endLine-e.startLine+1},(t,n)=>(0,A.jsx)(`div`,{className:`leading-6 h-6`,children:e.startLine+n},n))}),(0,A.jsx)(`pre`,{className:`m-0 min-w-[60px] bg-transparent px-3 py-2 font-mono text-xs leading-6 whitespace-pre text-[#fafafa]`,children:e.content})]})]})]})},Te=Object.entries({demo1:{name:`Arco Design 基础`,description:`基础的 Arco Design 组件使用示例`,files:{"App.tsx":`import { useState } from 'react';
import { Form, Grid, Message } from '@arco-design/web-react';
import { Search } from './Search';
import { Table } from './Table';
import { Modal } from './Modal';

const App = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const handleSearch = (values) => {
    // 模拟搜索逻辑
    setData([{ id: 1, name: 'Example', amount: 100, date: '2023-10-01' }]);
  };

  const handleAdd = () => {
    setCurrentRecord(null);
    setVisible(true);
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    setVisible(true);
  };

  const handleDelete = (record) => {
    Message.success('删除成功');
    setData(data.filter(item => item.id !== record.id));
  };

  const handleSubmit = (values) => {
    if (currentRecord) {
      setData(data.map(item => item.id === currentRecord.id ? { ...item, ...values } : item));
    } else {
      setData([...data, { id: data.length + 1, ...values }]);
    }
    setVisible(false);
  };

  return (
    <div>
      <Search form={form} onSearch={handleSearch} onAdd={handleAdd} />
      <Table data={data} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal visible={visible} onCancel={() => setVisible(false)} onSubmit={handleSubmit} record={currentRecord} />
    </div>
  );

};

export default App;`,"Search.tsx":`import { Button, Form, Grid, Input, InputNumber, DatePicker } from '@arco-design/web-react';

export const Search = ({ form, onSearch, onAdd }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onSearch}>
      <Grid.Row gutter={24}>
        <Grid.Col span={6}>
          <Form.Item label="名称" field="name">
            <Input placeholder="请输入名称" />
          </Form.Item>
        </Grid.Col>
        <Grid.Col span={6}>
          <Form.Item label="金额" field="amount">
            <InputNumber placeholder="请输入金额" />
          </Form.Item>
        </Grid.Col>
        <Grid.Col span={6}>
          <Form.Item label="日期" field="date">
            <DatePicker placeholder="请选择日期" />
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit">搜索</Button>
          <Button style={{ marginLeft: 12 }} onClick={onAdd}>新增</Button>
        </Grid.Col>
      </Grid.Row>
    </Form>
  );
};
`,"Table.tsx":`import { Button, Table as ArcoTable } from '@arco-design/web-react';

export const Table = ({ data, onEdit, onDelete }) => {
  const columns = [
    { title: '名称', dataIndex: 'name' },
    { title: '金额', dataIndex: 'amount' },
    { title: '日期', dataIndex: 'date' },
    {
      title: '操作',
      render: (_, record) => (
        <>
          <Button type="text" onClick={() => onEdit(record)}>编辑</Button>
          <Button type="text" status="danger" onClick={() => onDelete(record)}>删除</Button>
        </>
      ),
    },
  ];

  return <ArcoTable columns={columns} data={data} />;
};
`,"Modal.tsx":`import { Button, Form, Input, InputNumber, DatePicker, Modal as ArcoModal } from '@arco-design/web-react';

export const Modal = ({ visible, onCancel, onSubmit, record }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validate().then(values => {
      onSubmit(values);
    });
  };

  return (
    <ArcoModal
      title={record ? '编辑记录' : '新增记录'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} initialValues={record}>
        <Form.Item label="名称" field="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder="请输入名称" />
        </Form.Item>
        <Form.Item label="金额" field="amount" rules={[{ required: true, message: '请输入金额' }]}>
          <InputNumber placeholder="请输入金额" />
        </Form.Item>
        <Form.Item label="日期" field="date" rules={[{ required: true, message: '请选择日期' }]}>
          <DatePicker placeholder="请选择日期" />
        </Form.Item>
      </Form>
    </ArcoModal>
  );
};
`,"deps.json":`{"@arco-design/web-react": "^2.45.0"
  }`},entryFile:`App.tsx`},demo2:{name:`用户管理`,description:`完整的用户管理 CRUD 功能`,files:{"App.tsx":`
      import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Message,
  Card,
  Typography
} from '@arco-design/web-react';
import { IconPlus, IconEdit, IconDelete } from '@arco-design/web-react/icon';
import {Button as CustomButton} from './components/Button';
// import './styles.css';


interface User {
  id: string;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 模拟初始数据
  useEffect(() => {
    const initialUsers: User[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      { id: '3', name: 'Robert Johnson', email: 'robert@example.com' },
    ];
    setUsers(initialUsers);
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      onOk: () => {
        setUsers(users.filter(user => user.id !== id));
        Message.success('删除成功');
      },
    });
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validate();
      
      if (editingUser) {
        // 更新
        setUsers(
          users.map(user => 
            user.id === editingUser.id ? { ...user, ...values } : user
          )
        );
        Message.success('更新成功');
      } else {
        // 新增
        const newUser = {
          id: Date.now().toString(),
          ...values,
        };
        setUsers([...users, newUser]);
        Message.success('添加成功');
      }
      
      setVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '操作',
      key: 'operations',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            status="danger" 
            size="small" 
            icon={<IconDelete />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <Card>
        <div className="header">
          <Typography.Title heading={4}>用户管理</Typography.Title>
          <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
            添加用户
          </Button>
          <CustomButton>11</CustomButton>
        </div>
        
        <Table 
          columns={columns} 
          data={users} 
          rowKey="id"
          pagination={{
            showTotal: true,
            pageSize: 10,
          }}
        />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="姓名"
            field="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            field="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;

    `,"components/Button.tsx":`
      import React from 'react';
      import '../styles.css';

      interface ButtonProps {
        children: React.ReactNode;
        onClick: () => void;
      }

      export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
        return (
          <button 
            onClick={onClick}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {children}
          </button>
        );
      };
    `,"styles.css":`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background: blue;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
    `,"deps.json":`{"@arco-design/web-react": "2.66.1"}`},entryFile:`App.tsx`},demo3:{name:`ECharts 图表`,description:`ECharts 图表库集成示例`,files:{"App.tsx":`import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const App: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        title: {
          text: 'ECharts 示例'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      };
      chart.setOption(option);
    }
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default App;
`,"deps.json":`{
    "echarts": "^5.4.0"
  }`},entryFile:`App.tsx`},demo4:{name:`Tailwind CSS + 远程 CSS`,description:`Tailwind CSS 和远程 CSS 导入功能测试`,files:{"App.tsx":`
import React, { useState } from 'react';
import "@arco-design/web-react/dist/css/arco.css";

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-white p-8 text-[#171717]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)]">
          <h1 className="mb-4 text-3xl font-semibold text-[#171717]">
            Tailwind CSS + Arco Design 测试
          </h1>
          <p className="mb-4 text-[#666666]">
            这个 demo 展示了 Tailwind CSS 和远程 CSS 导入的功能
          </p>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCount(count - 1)}
              className="rounded-md bg-white px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff7f6]"
            >
              减少
            </button>
            
            <span className="rounded-md bg-[#fafafa] px-4 py-2 text-2xl font-semibold text-[#171717] shadow-[0_0_0_1px_#ebebeb]">
              {count}
            </span>
            
            <button 
              onClick={() => setCount(count + 1)}
              className="rounded-md bg-[#171717] px-4 py-2 text-white transition-colors hover:bg-black"
            >
              增加
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-lg bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.06)]">
            <h3 className="mb-2 text-lg font-semibold text-[#171717]">卡片 1</h3>
            <p className="text-[#666666]">这是一个使用 Tailwind CSS 样式的卡片</p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.06)]">
            <h3 className="mb-2 text-lg font-semibold text-[#171717]">卡片 2</h3>
            <p className="text-[#666666]">响应式网格布局</p>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.06)]">
            <h3 className="mb-2 text-lg font-semibold text-[#171717]">卡片 3</h3>
            <p className="text-[#666666]">悬停效果和过渡动画</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
  `,"deps.json":`{"@arco-design/web-react": "^2.45.0"}`},entryFile:`App.tsx`},demo5:{name:`检查模式测试`,description:`测试 iframe 刷新后检查模式状态恢复`,files:{"App.tsx":`
import React from 'react';

const App: React.FC = () => {
return (
  <div className="min-h-screen bg-white p-8 text-[#171717]">
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)]">
      <h1 className="mb-4 text-2xl font-semibold text-[#171717]">
        检查模式测试
      </h1>
      <p className="mb-4 text-[#666666]">
        点击检查按钮，然后刷新 iframe，检查模式应该会自动恢复。
      </p>
      <div className="space-y-3">
        <button className="w-full rounded-md bg-[#171717] px-4 py-2 text-white transition-colors hover:bg-black">
          按钮 1
        </button>
        <button className="w-full rounded-md bg-white px-4 py-2 text-[#171717] shadow-[0_0_0_1px_#ebebeb] transition-colors hover:bg-[#fafafa]">
          按钮 2
        </button>
        <button className="w-full rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]">
          按钮 3
        </button>
      </div>
    </div>
  </div>
);
};

export default App;
  `},entryFile:`App.tsx`},demo6:{name:`运行时错误测试`,description:`测试各种运行时错误的捕获和显示功能`,files:{"App.tsx":`
import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [errorType, setErrorType] = useState<string>('none');
  const [shouldThrow, setShouldThrow] = useState<boolean>(false);

  // 模拟异步错误
  useEffect(() => {
    if (shouldThrow && errorType === 'async') {
      setTimeout(() => {
        throw new Error('这是一个异步错误！');
      }, 1000);
    }
  }, [shouldThrow, errorType]);

  // 模拟事件处理错误
  const handleEventError = () => {
    throw new Error('这是一个事件处理错误！');
  };

  // 模拟状态更新错误
  const handleStateError = () => {
    setErrorType('state');
    // 在下一个渲染周期抛出错误
    setTimeout(() => {
      setShouldThrow(true);
    }, 100);
  };

  // 模拟引用错误
  const handleReferenceError = () => {
    // @ts-ignore
    // 这个 console.log 是故意保留的，用于测试错误捕获功能
    console.log(undefinedVariable);
  };

  // 模拟类型错误
  const handleTypeError = () => {
    const obj = null;
    // @ts-ignore
    obj.someMethod();
  };

  // 模拟语法错误（在运行时通过 eval）
  const handleSyntaxError = () => {
    try {
      eval('const x = {;');
    } catch (error) {
      throw new Error('语法错误：' + error.message);
    }
  };

  // 模拟网络错误
  const handleNetworkError = () => {
    fetch('/non-existent-endpoint')
      .then(response => {
        if (!response.ok) {
          throw new Error('网络请求失败：' + response.status);
        }
        return response.json();
      })
      .catch(error => {
        throw new Error('网络错误：' + error.message);
      });
  };

  // 模拟递归错误
  const handleRecursionError = () => {
    const recursiveFunction = () => {
      recursiveFunction();
    };
    recursiveFunction();
  };

  // 模拟内存错误
  const handleMemoryError = () => {
    const arr = [];
    while (true) {
      arr.push(new Array(1000000));
    }
  };

  // 模拟自定义错误
  const handleCustomError = () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'CustomError';
      }
    }
    throw new CustomError('这是一个自定义错误！');
  };

  // 模拟组件渲染错误
  const ErrorComponent: React.FC = () => {
    if (shouldThrow && errorType === 'render') {
      throw new Error('这是一个组件渲染错误！');
    }
    return <div>正常渲染的组件</div>;
  };

  return (
    <div className="min-h-screen bg-white p-8 text-[#171717]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)]">
          <h1 className="mb-4 text-3xl font-semibold text-[#171717]">
            运行时错误测试
          </h1>
          <p className="mb-6 text-[#666666]">
            点击下面的按钮来测试不同类型的运行时错误捕获功能
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleEventError}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              事件错误
            </button>
            
            <button 
              onClick={handleReferenceError}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              引用错误
            </button>
            
            <button 
              onClick={handleTypeError}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              类型错误
            </button>
            
            <button 
              onClick={handleSyntaxError}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              语法错误
            </button>
            
            <button 
              onClick={handleNetworkError}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              网络错误
            </button>
            
            <button 
              onClick={handleCustomError}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              自定义错误
            </button>
            
            <button 
              onClick={() => {
                setErrorType('async');
                setShouldThrow(true);
              }}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              异步错误
            </button>
            
            <button 
              onClick={handleStateError}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              状态错误
            </button>
            
            <button 
              onClick={() => {
                setErrorType('render');
                setShouldThrow(true);
              }}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              渲染错误
            </button>
            
            <button 
              onClick={handleRecursionError}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              递归错误
            </button>
            
            <button 
              onClick={handleMemoryError}
              className="rounded-md bg-[#fff7f6] px-4 py-2 text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)] transition-colors hover:bg-[#fff1f0]"
            >
              内存错误
            </button>
            
            <button 
              onClick={() => {
                setShouldThrow(false);
                setErrorType('none');
              }}
              className="rounded-md bg-[#171717] px-4 py-2 text-white transition-colors hover:bg-black"
            >
              重置状态
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04)]">
          <h3 className="mb-4 text-lg font-semibold text-[#171717]">当前状态</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">错误类型:</span> {errorType}</p>
            <p><span className="font-medium">是否抛出错误:</span> {shouldThrow ? '是' : '否'}</p>
          </div>
          
          <div className="mt-4 rounded-md bg-[#fafafa] p-4 shadow-[0_0_0_1px_#ebebeb]">
            <h4 className="mb-2 font-medium text-[#4d4d4d]">错误组件测试区域:</h4>
            <ErrorComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
  `},entryFile:`App.tsx`},dependencyLoadingDemo:{name:`依赖加载测试`,description:`测试依赖加载功能`,files:{"App.tsx":`import React from 'react';

const DependencyLoadingTest: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>依赖加载测试</h2>
      
      <p>
        这个组件用于测试依赖加载功能。如果页面正常显示，说明以下依赖已成功加载：
      </p>
      
      <ul style={{ marginBottom: '20px' }}>
        <li>React 18.2.0</li>
        <li>React DOM 18.2.0</li>
        <li>Arco Design Web React 2.66.1</li>
      </ul>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          style={{ 
            padding: '8px 16px', 
            marginRight: '8px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => setCount(c => c + 1)}
        >
          点击次数: {count}
        </button>
        
        <button 
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => setCount(0)}
        >
          重置
        </button>
      </div>
      
      <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>
          <strong>测试说明：</strong>
          <br />
          1. 页面加载时应该显示依赖加载进度
          <br />
          2. 加载完成后进度条应该消失
          <br />
          3. 按钮应该能正常响应点击事件
          <br />
          4. React 状态管理应该正常工作
        </p>
      </div>
    </div>
  );
};

export default DependencyLoadingTest;`,"deps.json":`{"@arco-design/web-react": "2.66.1"}`},entryFile:`App.tsx`},arcoDesignDemo:{name:`Arco Design 组件测试`,description:`测试 Arco Design 组件库和样式加载功能`,files:{"App.tsx":`import React from 'react';
import { Button, Space, Typography } from '@arco-design/web-react';

const ArcoDesignTest: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const { Title, Paragraph } = Typography;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Title level={2}>Arco Design 组件测试</Title>
      
      <Paragraph>
        这个组件用于测试 Arco Design 组件的动态加载功能。
        如果页面正常显示，说明 Arco Design 依赖已成功加载。
      </Paragraph>
      
      <Space>
        <Button 
          type="primary" 
          onClick={() => setCount(c => c + 1)}
        >
          点击次数: {count}
        </Button>
        
        <Button 
          onClick={() => setCount(0)}
        >
          重置
        </Button>
      </Space>
      
      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <Paragraph style={{ margin: 0 }}>
          <strong>测试说明：</strong>
          <br />
          1. 页面加载时应该显示依赖加载进度
          <br />
          2. Arco Design 组件应该正常渲染
          <br />
          3. 按钮应该能正常响应点击事件
          <br />
          4. 组件样式应该正确显示
        </Paragraph>
      </div>
    </div>
  );
};

export default ArcoDesignTest;`,"deps.json":`{"@arco-design/web-react": "2.66.1"}`},entryFile:`App.tsx`},antdDesignDemo:{name:`Ant Design 组件测试`,description:`测试 Ant Design 组件库和样式加载功能`,files:{"App.tsx":`import React from 'react';
import { Button, Card, DatePicker, Form, Input, Space, Table, Tag, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const AntdDesignTest: React.FC = () => {
  const [selected, setSelected] = React.useState('未选择');
  const dataSource = [
    { key: '1', name: 'Preview compile', owner: 'ReactPreview', status: 'ready' },
    { key: '2', name: 'Style resources', owner: 'antd', status: 'loaded' },
    { key: '3', name: 'Runtime render', owner: 'iframe', status: 'active' }
  ];

  const columns = [
    { title: '任务', dataIndex: 'name' },
    { title: '来源', dataIndex: 'owner' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => <Tag color={status === 'ready' ? 'green' : status === 'loaded' ? 'blue' : 'gold'}>{status}</Tag>
    }
  ];

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: '0 auto' }}>
      <Title level={2}>Ant Design 组件测试</Title>
      <Paragraph>
        这个示例用于验证 antd 组件库、CSS reset 和表单/表格组件在预览器中的加载表现。
      </Paragraph>

      <Card style={{ marginBottom: 20 }}>
        <Form layout="inline" onFinish={(values) => setSelected(values.keyword || '未填写')}>
          <Form.Item name="keyword">
            <Input placeholder="输入测试关键字" style={{ width: 220 }} />
          </Form.Item>
          <Form.Item name="date">
            <DatePicker placeholder="选择日期" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">提交</Button>
              <Button onClick={() => setSelected('已重置')}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Paragraph>当前输入：{selected}</Paragraph>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </div>
  );
};

export default AntdDesignTest;`,"deps.json":`{"antd": "5.18.0"}`},entryFile:`App.tsx`},simpleReactDemo:{name:`简单 React 组件测试`,description:`测试简单 React 组件的功能`,files:{"App.tsx":`import React from 'react';

const SimpleReactDemo: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>简单 React 组件测试</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>计数器: {count}</h3>
        <button 
          onClick={() => setCount(c => c + 1)}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          增加
        </button>
        <button 
          onClick={() => setCount(c => c - 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          减少
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>输入框测试</h3>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入内容"
          style={{
            padding: '8px 12px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            width: '200px'
          }}
        />
        <p>输入的内容: {inputValue}</p>
      </div>
      
      <div style={{ padding: '16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
        <h4>测试说明:</h4>
        <ul>
          <li>✅ React 状态管理正常工作</li>
          <li>✅ 事件处理正常工作</li>
          <li>✅ 组件渲染正常</li>
          <li>✅ 依赖加载进度显示正常</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleReactDemo;`,"deps.json":`{}`},entryFile:`App.tsx`},routingDemo:{name:`路由同步测试`,description:`测试 BrowserRouter 路径、参数、查询和 hash 的同步显示`,files:{"App.tsx":`import React from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';

const products = [
  { id: 'alpha', name: 'Alpha Console', status: 'In review' },
  { id: 'bravo', name: 'Bravo Studio', status: 'Live' },
  { id: 'charlie', name: 'Charlie Desk', status: 'Draft' }
];

function Shell() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100%', background: '#f7f8fb', color: '#171717', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ display: 'flex', gap: 8, padding: 16, borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <Link to="/products?tab=list" style={linkStyle}>Products</Link>
        <Link to="/products/alpha?tab=activity" style={linkStyle}>Alpha</Link>
        <Link to="/products/bravo?tab=settings" style={linkStyle}>Bravo</Link>
      </nav>
      <main style={{ padding: 24 }}>
        <div style={{ marginBottom: 16, borderRadius: 6, background: '#111827', color: '#fff', padding: '10px 12px', fontFamily: 'monospace' }}>
          {location.pathname}{location.search}{location.hash}
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/products?tab=list" replace />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </main>
    </div>
  );
}

function ProductList() {
  return (
    <section>
      <h1 style={{ margin: '0 0 12px', fontSize: 24 }}>Products</h1>
      <div style={{ display: 'grid', gap: 12 }}>
        {products.map((item) => (
          <Link key={item.id} to={\`/products/\${item.id}?tab=activity#summary\`} style={cardStyle}>
            <strong>{item.name}</strong>
            <span style={{ color: '#64748b' }}>{item.status}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === id);
  const tab = searchParams.get('tab') || 'activity';

  if (!product) {
    return <Navigate to="/products?tab=list" replace />;
  }

  return (
    <section>
      <button onClick={() => navigate('/products?tab=list')} style={buttonStyle}>Back</button>
      <h1 style={{ margin: '16px 0 6px', fontSize: 24 }}>{product.name}</h1>
      <p style={{ marginTop: 0, color: '#64748b' }}>Route param: <strong>{id}</strong></p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['activity', 'settings', 'metrics'].map((nextTab) => (
          <button
            key={nextTab}
            onClick={() => setSearchParams({ tab: nextTab })}
            style={{ ...buttonStyle, background: tab === nextTab ? '#111827' : '#fff', color: tab === nextTab ? '#fff' : '#111827' }}
          >
            {nextTab}
          </button>
        ))}
      </div>
      <div style={{ borderRadius: 6, background: '#fff', padding: 20, boxShadow: '0 0 0 1px #e5e7eb' }}>
        Current query tab: <strong>{tab}</strong>
      </div>
    </section>
  );
}

const linkStyle = {
  borderRadius: 6,
  padding: '8px 10px',
  textDecoration: 'none',
  color: '#111827',
  boxShadow: '0 0 0 1px #e5e7eb'
};

const cardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  borderRadius: 6,
  background: '#fff',
  padding: 16,
  textDecoration: 'none',
  color: '#111827',
  boxShadow: '0 0 0 1px #e5e7eb'
};

const buttonStyle = {
  border: '1px solid #d1d5db',
  borderRadius: 6,
  background: '#fff',
  color: '#111827',
  padding: '8px 10px',
  cursor: 'pointer'
};

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}`,"deps.json":`{"react-router-dom":"6.30.1"}`},entryFile:`App.tsx`}}).map(([e,t])=>({key:e,...t})),Ee=a(`Example`),De=()=>{let[e,t]=(0,y.useState)(Te[0]),[n,r]=(0,y.useState)(!1),[i,a]=(0,y.useState)(null),[o,s]=(0,y.useState)(!1),[c,l]=(0,y.useState)({}),[u,d]=(0,y.useState)({enabled:!0,level:2,showTimestamp:!1}),f=(0,y.useRef)(null),p=(0,y.useMemo)(()=>{let t={...e.files};return`deps.json`in t&&delete t[`deps.json`],t},[e]),m=(0,y.useCallback)(()=>p,[p]),h=(0,y.useMemo)(()=>{try{let t=e.files[`deps.json`];return t?JSON.parse(t):{}}catch(e){return Ee.error(`Parse deps.json error:`,e),{}}},[e]);(0,y.useEffect)(()=>{l(m())},[m]);let g=e=>{Ee.debug(`Element clicked in example:`,e),a(e)},_=()=>{Ee.debug(`Closing source tooltip from example`),a(null)},v=(0,y.useCallback)((e,t)=>{l(n=>({...n,[e]:t}))},[]),b=(0,y.useCallback)(()=>{l(m())},[m]);(0,y.useEffect)(()=>{let e=e=>{i&&!e.defaultPrevented&&(Ee.debug(`Closing source info due to outside click`),a(null))};if(i)return document.addEventListener(`click`,e),()=>document.removeEventListener(`click`,e)},[i]);let x=(0,y.useMemo)(()=>{let t=o?c:m();return Ee.debug(`getCurrentFiles called:`,{editingMode:o,selectedDemo:e.key,filesKeys:Object.keys(t),filesHash:JSON.stringify(Object.keys(t).sort())}),t},[o,c,m,e.key]);return(0,A.jsxs)(`div`,{ref:f,className:`flex h-screen w-full bg-white text-[#171717]`,children:[(0,A.jsxs)(`div`,{className:`
        flex flex-col border-r border-[#ebebeb] bg-white text-[#171717] transition-all duration-300 ease-in-out
        ${n?`w-16`:`w-80`}
      `,children:[(0,A.jsxs)(`div`,{className:`flex items-center justify-between border-b border-[#ebebeb] p-4`,children:[!n&&(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`h2`,{className:`text-base font-semibold text-[#171717]`,children:`React Previewer`}),(0,A.jsx)(`p`,{className:`mt-1 text-xs text-[#666666]`,children:`组件示例与实时预览`})]}),(0,A.jsx)(`button`,{onClick:()=>r(!n),className:`rounded-md p-2 text-[#666666] transition-colors hover:bg-[#fafafa] hover:text-[#171717]`,title:n?`展开侧边栏`:`收起侧边栏`,children:(0,A.jsx)(`svg`,{className:`h-5 w-5 transition-transform ${n?`rotate-180`:``}`,fill:`none`,stroke:`currentColor`,viewBox:`0 0 24 24`,children:(0,A.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,strokeWidth:2,d:`M15 19l-7-7 7-7`})})})]}),(0,A.jsx)(`div`,{className:`flex-1 overflow-y-auto p-3`,children:n?(0,A.jsx)(`div`,{className:`space-y-2`,children:Te.map((n,r)=>(0,A.jsx)(`button`,{onClick:()=>t(n),className:`
                    flex w-full items-center justify-center rounded-md p-3 transition-colors duration-150
                    ${e.key===n.key?`bg-[#171717] text-white`:`bg-white text-[#666666] shadow-[0_0_0_1px_#ebebeb] hover:bg-[#fafafa] hover:text-[#171717]`}
                  `,title:n.name,children:(0,A.jsx)(`span`,{className:`text-sm font-bold`,children:r+1})},n.key))}):(0,A.jsx)(`div`,{className:`space-y-2`,children:Te.map(n=>(0,A.jsxs)(`button`,{onClick:()=>t(n),className:`
                    w-full rounded-md p-3 text-left transition-colors duration-150
                    ${e.key===n.key?`bg-[#171717] text-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]`:`bg-white text-[#4d4d4d] shadow-[0_0_0_1px_#ebebeb] hover:bg-[#fafafa] hover:text-[#171717]`}
                  `,children:[(0,A.jsx)(`div`,{className:`mb-1 text-sm font-semibold`,children:n.name}),(0,A.jsx)(`div`,{className:`text-xs leading-relaxed opacity-75`,children:n.description})]},n.key))})}),!n&&(0,A.jsxs)(`div`,{className:`border-t border-[#ebebeb] bg-[#fafafa] p-4`,children:[(0,A.jsx)(`h3`,{className:`mb-3 text-sm font-semibold text-[#171717]`,children:`日志配置`}),(0,A.jsxs)(`div`,{className:`space-y-2`,children:[(0,A.jsxs)(`label`,{className:`flex items-center`,children:[(0,A.jsx)(`input`,{type:`checkbox`,checked:u.enabled,onChange:e=>d(t=>({...t,enabled:e.target.checked})),className:`mr-2 accent-[#171717]`}),(0,A.jsx)(`span`,{className:`text-xs text-[#4d4d4d]`,children:`启用日志`})]}),(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`label`,{className:`mb-1 block text-xs text-[#4d4d4d]`,children:`日志级别`}),(0,A.jsxs)(`select`,{value:u.level,onChange:e=>d(t=>({...t,level:parseInt(e.target.value)})),className:`w-full rounded-md bg-white px-2 py-1 text-xs text-[#171717] shadow-[0_0_0_1px_#ebebeb]`,children:[(0,A.jsx)(`option`,{value:0,children:`ERROR`}),(0,A.jsx)(`option`,{value:1,children:`WARN`}),(0,A.jsx)(`option`,{value:2,children:`INFO`}),(0,A.jsx)(`option`,{value:3,children:`DEBUG`}),(0,A.jsx)(`option`,{value:4,children:`TRACE`})]})]}),(0,A.jsxs)(`label`,{className:`flex items-center`,children:[(0,A.jsx)(`input`,{type:`checkbox`,checked:u.showTimestamp,onChange:e=>d(t=>({...t,showTimestamp:e.target.checked})),className:`mr-2 accent-[#171717]`}),(0,A.jsx)(`span`,{className:`text-xs text-[#4d4d4d]`,children:`显示时间戳`})]})]})]})]}),(0,A.jsxs)(`div`,{className:`flex min-w-0 flex-1 flex-col`,children:[(0,A.jsx)(`div`,{className:`border-b border-[#ebebeb] bg-white px-6 py-4`,children:(0,A.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-4`,children:[(0,A.jsxs)(`div`,{className:`min-w-0`,children:[(0,A.jsxs)(`div`,{className:`mb-2 flex flex-wrap items-center gap-2`,children:[(0,A.jsx)(`span`,{className:`rounded-full bg-[#ebf5ff] px-2.5 py-1 text-xs font-medium text-[#0068d6]`,children:`Demo`}),(0,A.jsx)(`span`,{className:`rounded-full bg-[#fafafa] px-2.5 py-1 font-mono text-xs font-medium text-[#666666] shadow-[0_0_0_1px_#ebebeb]`,children:e.entryFile})]}),(0,A.jsx)(`h1`,{className:`text-xl font-semibold text-[#171717]`,children:e.name}),(0,A.jsx)(`p`,{className:`mt-1 text-sm text-[#666666]`,children:e.description})]}),(0,A.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,A.jsx)(`button`,{onClick:()=>s(!o),className:`
                  rounded-md px-4 py-2 text-sm font-medium transition-colors
                  ${o?`bg-[#0068d6] text-white hover:bg-[#005ac0]`:`bg-[#171717] text-white hover:bg-black`}
                `,children:o?`退出编辑`:`实时编辑`}),o&&(0,A.jsx)(`button`,{onClick:b,className:`rounded-md bg-white px-4 py-2 text-sm font-medium text-[#4d4d4d] shadow-[0_0_0_1px_#ebebeb] transition-colors hover:bg-[#fafafa] hover:text-[#171717]`,children:`重置`})]})]})}),(0,A.jsxs)(`div`,{className:`flex min-h-0 flex-1`,children:[o&&(0,A.jsxs)(`div`,{className:`w-1/2 overflow-y-auto border-r border-[#ebebeb] bg-white p-4`,children:[(0,A.jsx)(`h3`,{className:`mb-4 text-base font-semibold text-[#171717]`,children:`文件编辑`}),(0,A.jsx)(`div`,{className:`space-y-4`,children:Object.entries(x).map(([e,t])=>(0,A.jsxs)(`div`,{children:[(0,A.jsx)(`h4`,{className:`mb-2 font-mono text-sm font-medium text-[#4d4d4d]`,children:e}),(0,A.jsx)(`textarea`,{value:t,onChange:t=>v(e,t.target.value),className:`h-32 w-full resize-none rounded-md bg-[#fafafa] p-3 font-mono text-xs text-[#171717] shadow-[0_0_0_1px_#ebebeb] transition focus:bg-white`,placeholder:`输入代码...`})]},e))})]}),(0,A.jsx)(`div`,{className:`${o?`w-1/2`:`w-full`} relative min-w-0`,children:(0,A.jsx)(`div`,{className:`absolute inset-0`,children:(Ee.debug(`Rendering ReactPreviewer:`,{selectedDemo:e.key,files:Object.keys(x),deps:Object.keys(h),entryFile:e.entryFile}),(0,A.jsx)(xe,{files:x,depsInfo:h,entryFile:e.entryFile,onElementClick:g,loggerConfig:u}))})})]}),(e.key===`simpleReactDemo`||e.key===`dependencyLoadingDemo`||e.key===`arcoDesignDemo`||e.key===`antdDesignDemo`)&&(0,A.jsxs)(`div`,{className:`border-t border-[#ebebeb] bg-white px-6 py-4`,children:[(0,A.jsx)(`h3`,{className:`mb-2 text-sm font-semibold text-[#171717]`,children:`依赖加载功能说明`}),(0,A.jsxs)(`div`,{className:`space-y-1 text-xs text-[#666666]`,children:[(0,A.jsx)(`p`,{children:(0,A.jsx)(`strong`,{children:`观察要点:`})}),(0,A.jsxs)(`ul`,{className:`list-disc list-inside space-y-1 ml-2`,children:[(0,A.jsx)(`li`,{children:`页面加载时应该显示依赖加载进度条`}),(0,A.jsx)(`li`,{children:`进度条显示每个依赖的加载状态（等待中、加载中、已加载、加载失败）`}),(0,A.jsx)(`li`,{children:`加载完成后进度条自动消失`}),(0,A.jsx)(`li`,{children:`如果依赖加载失败，会显示错误状态`})]}),(0,A.jsxs)(`p`,{className:`mt-2`,children:[(0,A.jsx)(`strong`,{children:`当前依赖:`}),` `,Object.keys(h).length>0?Object.keys(h).join(`, `):`无外部依赖`]})]})]})]}),i&&(0,A.jsx)(we,{sourceInfo:i,containerElement:f.current||document.body,onClose:_})]})};function Oe(){return(0,A.jsx)(A.Fragment,{children:(0,A.jsx)(De,{})})}(0,b.createRoot)(document.getElementById(`root`)).render((0,A.jsx)(y.StrictMode,{children:(0,A.jsx)(Oe,{})}));