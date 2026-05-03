"use strict";var f=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var x=Object.prototype.hasOwnProperty;var A=(e,o)=>{for(var n in o)f(e,n,{get:o[n],enumerable:!0})},F=(e,o,n,t)=>{if(o&&typeof o=="object"||typeof o=="function")for(let s of k(o))!x.call(e,s)&&s!==n&&f(e,s,{get:()=>o[s],enumerable:!(t=T(o,s))||t.enumerable});return e};var v=e=>F(f({},"__esModule",{value:!0}),e);var H={};A(H,{default:()=>P});module.exports=v(H);var y=e=>/\/\{[^}]+\}/g.test(e),I=e=>e?e.length>0:!1,p=(e=[],o={})=>{let n={};if(Array.isArray(e))for(let t in o)e.indexOf(t)!==-1&&(n[t]=o[t]===void 0||o[t]===null?"":typeof o[t]=="object"?JSON.stringify(o[t]):o[t]);else for(let t in e)if(o[t]!==void 0)n[t]=o[t]==null?"":typeof o[t]=="object"?JSON.stringify(o[t]):o[t];else{let s=e[t];s&&(n[t]=s.defaultValue)}return n},j=(e=[],o=[],n={})=>{let t=new FormData,s=p(e,n);for(let r in s){let a=encodeURIComponent(r),i=encodeURIComponent(s[r]);t.append(a,i)}for(let r in n)o.includes(r)&&t.append(r,n[r]);return t},b=(e=[],o={})=>{let n=p(e,o),t=new FormData;for(let s in n)t.append(s,n[s]);return t},O=(e,o={})=>{if(!e)return console.log("path is undefined"),e;if(!y(e))return e;let n=e;for(let[s,r]of Object.entries(o)){let a=new RegExp(`\\{${s}\\}`,"g");n=n.replace(a,r)}let t=n.match(/\{[^}]+\}/g);if(t)throw new Error(`[oolio] \uACBD\uB85C \uD30C\uB77C\uBBF8\uD130\uAC00 \uCE58\uD658\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4: ${t.join(", ")} (path: ${e})`);return n},C=async(e,o,n={},t={})=>{let s=p(o,n),r=await fetch(`${e}?${new URLSearchParams(s).toString()}`,{headers:t});if(!r.ok){let a=await r.json();throw{status:r.status,statusText:r.statusText,data:a}}return r.json()},N=async(e,o,n,t={},s={})=>{let r=b(n,t),a=await fetch(e,{method:o,headers:s,body:r});if(!a.ok){let i=await a.json();throw{status:a.status,statusText:a.statusText,data:i}}return a.json()},q=async(e,o,n,t=[],s={},r={})=>{let a=j(n,t,s);delete r["Content-Type"];let i=await fetch(e,{method:o,headers:r,body:a});if(!i.ok){let l=await i.json();throw{status:i.status,statusText:i.statusText,data:l}}return i.json()},h=(e,o)=>async(n,t={},s=null,r={})=>{let{method:a,path:i,payload:l=[],baseUrl:g=null,authorization:R=null,files:d=void 0}=n,u=g||e||"http://localhost:3000",c=s||{};if(y(i)?u=u+O(i,t):(u=u+i,s||(c=t)),R!=="guest"&&o){let m=await o();m&&(r.Authorization=`Bearer ${m}`)}return a==="get"?C(u,l,c,r):I(d)?q(u,a,l,d,c,r):N(u,a,l,c,r)};function w(){console.warn(`
  [oolio] routes\uAC00 \uC815\uC758\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. routes\uB294 \uB2E4\uC74C\uACFC \uAC19\uC740 \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4:

  import type { Route } from "oolio";

  const routes = {
    auth: {
      login: {
        method: 'post',
        path: '/auth/login',
        payload: ['email', 'password'],
      } as Route<{ email: string; password: string }, { token: string }>,
    },
    user: {
      getProfile: {
        method: 'get',
        path: '/user/profile',
      } as Route<void, { name: string; avatar: string }>,

      uploadAvatar: {
        method: 'post',
        path: '/user/avatar',
        payload: ['userId'],
        files: ['avatar'],
      } as Route<{ userId: string }, { url: string }>,

      getUserById: {
        method: 'get',
        path: '/user/{userId}',
      } as Route<{ userId: string }, { id: string; name: string }>,
    },
  };

  \uAC01 \uB77C\uC6B0\uD2B8\uB294 \uB2E4\uC74C \uC18D\uC131\uC744 \uAC00\uC9C8 \uC218 \uC788\uC2B5\uB2C8\uB2E4:
  - method: HTTP \uBA54\uC18C\uB4DC (get, post, put, delete \uB4F1)
  - path: API \uC5D4\uB4DC\uD3EC\uC778\uD2B8 \uACBD\uB85C (\uACBD\uB85C \uD30C\uB77C\uBBF8\uD130: /user/{userId})
  - payload: \uC694\uCCAD\uC5D0 \uD3EC\uD568\uB420 \uB370\uC774\uD130 \uD544\uB4DC \uBAA9\uB85D (\uC120\uD0DD\uC0AC\uD56D)
  - files: \uD30C\uC77C \uC5C5\uB85C\uB4DC \uD544\uB4DC \uBAA9\uB85D (\uC120\uD0DD\uC0AC\uD56D)
  - authorization: \uC778\uC99D \uD544\uC694 \uC5EC\uBD80 (\uAE30\uBCF8\uAC12: true, 'guest' \uC124\uC815 \uC2DC \uD1A0\uD070 \uBBF8\uCCA8\uBD80)
  - baseUrl: \uB77C\uC6B0\uD2B8\uBCC4 baseUrl \uC624\uBC84\uB77C\uC774\uB4DC (\uC120\uD0DD\uC0AC\uD56D)
  `)}function D(){console.warn("[oolio] getAuthorizeToken\uC774 \uC815\uC758\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.")}function P({routes:e,getAuthorizeToken:o,baseUrl:n}){let t={};return function(){if(e){if(!o){D();return}}else{w();return}for(let r in e){t[r]||(t[r]={});for(let a in e[r])t[r][a]=(...i)=>h(n,o)(e[r][a],...i)}}(),t}
//# sourceMappingURL=index.cjs.map
