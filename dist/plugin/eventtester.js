(function(){"use strict";var e=`<script type="module">
//assets/index.274163bf.js
const p=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}};p();var l={},d=window.ReactDOM;l.createRoot=d.createRoot,l.hydrateRoot=d.hydrateRoot;var u={exports:{}},c={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var m=window.React,y=Symbol.for("react.element"),_=Symbol.for("react.fragment"),h=Object.prototype.hasOwnProperty,R=m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,v={key:!0,ref:!0,__self:!0,__source:!0};function a(n,r,i){var o,e={},t=null,s=null;i!==void 0&&(t=""+i),r.key!==void 0&&(t=""+r.key),r.ref!==void 0&&(s=r.ref);for(o in r)h.call(r,o)&&!v.hasOwnProperty(o)&&(e[o]=r[o]);if(n&&n.defaultProps)for(o in r=n.defaultProps,r)e[o]===void 0&&(e[o]=r[o]);return{$$typeof:y,type:n,key:t,ref:s,props:e,_owner:R.current}}c.Fragment=_;c.jsx=a;c.jsxs=a;u.exports=c;const f=u.exports.jsx,g=window.React.useEffect,w=()=>(g(()=>{globalThis.addEventListener("message",n=>{n.source===globalThis.parent&&console.log("mousemove with react")})},[]),f("div",{children:"Event Tester"})),O=window.React;l.createRoot(document.getElementById("root")).render(f(O.StrictMode,{children:f(w,{})}));

<\/script>
<title></title>
<script src="https://cdn.jsdelivr.net/npm/react@18.1.0/umd/react.production.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18.1.0/umd/react-dom.production.min.js"><\/script>
<div id="root"></div>


`;globalThis.reearth.ui.show(e,{width:312,height:46}),globalThis.reearth.on("mousemove",t=>{globalThis.reearth.ui.postMessage({foo:t})})})();
