"use strict";var p=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var A=Object.prototype.hasOwnProperty;var F=(t,e)=>{for(var o in e)p(t,o,{get:e[o],enumerable:!0})},v=(t,e,o,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of k(e))!A.call(t,s)&&s!==o&&p(t,s,{get:()=>e[s],enumerable:!(n=T(e,s))||n.enumerable});return t};var b=t=>v(p({},"__esModule",{value:!0}),t);var $={};F($,{default:()=>P});module.exports=b($);var h=t=>/\/\{[^}]+\}/g.test(t),C=t=>t?t.length>0:!1,g=(t=[],e={})=>{let o={};if(Array.isArray(t))for(let n in e)t.indexOf(n)!==-1&&(o[n]=e[n]===void 0||e[n]===null?"":typeof e[n]=="object"?JSON.stringify(e[n]):e[n]);else for(let n in t)if(e[n]!==void 0)o[n]=e[n]==null?"":typeof e[n]=="object"?JSON.stringify(e[n]):e[n];else{let s=t[n];s&&(o[n]=s.defaultValue)}return o},I=(t=[],e=[],o={})=>{let n=new FormData,s=g(t,o);for(let r in s){let a=encodeURIComponent(r),i=encodeURIComponent(s[r]);n.append(a,i)}for(let r in o)e.includes(r)&&n.append(r,o[r]);return n},N=(t=[],e={})=>{let o=g(t,e),n=new FormData;for(let s in o)n.append(s,o[s]);return n},O=(t,e={})=>{if(!t)return console.log("path is undefined"),t;if(!h(t))return t;let o=t;for(let[s,r]of Object.entries(e)){let a=new RegExp(`\\{${s}\\}`,"g");o=o.replace(a,r)}let n=o.match(/\{[^}]+\}/g);if(n)throw new Error(`[oolio] \uACBD\uB85C \uD30C\uB77C\uBBF8\uD130\uAC00 \uCE58\uD658\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4: ${n.join(", ")} (path: ${t})`);return o},l=async t=>{let e=await t.text();try{return JSON.parse(e)}catch{return e}},q=async(t,e,o={},n={})=>{let s=g(e,o),r=await fetch(`${t}?${new URLSearchParams(s).toString()}`,{headers:n});if(!r.ok)throw{status:r.status,statusText:r.statusText,data:await l(r)};return l(r)},H=async(t,e,o,n={},s={})=>{let r=N(o,n),a=await fetch(t,{method:e,headers:s,body:r});if(!a.ok)throw{status:a.status,statusText:a.statusText,data:await l(a)};return l(a)},U=async(t,e,o,n=[],s={},r={})=>{let a=I(o,n,s);delete r["Content-Type"];let i=await fetch(t,{method:e,headers:r,body:a});if(!i.ok)throw{status:i.status,statusText:i.statusText,data:await l(i)};return l(i)},w=(t,e)=>async(o,n={},s=null,r={})=>{let{method:a,path:i,payload:c=[],baseUrl:d=null,authorization:x=null,files:m=void 0}=o,u=d||t||"http://localhost:3000",f=s||{};if(h(i)?u=u+O(i,n):(u=u+i,s||(f=n)),x!=="guest"&&e){let y=await e();y&&(r.Authorization=`Bearer ${y}`)}return a==="get"?q(u,c,f,r):C(m)?U(u,a,c,m,f,r):H(u,a,c,f,r)};function R(){console.warn(`
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
  `)}function D(){console.warn("[oolio] getAuthorizeToken\uC774 \uC815\uC758\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.")}function P({routes:t,getAuthorizeToken:e,baseUrl:o}){let n={};return function(){if(t){if(!e){D();return}}else{R();return}for(let r in t){n[r]||(n[r]={});for(let a in t[r])n[r][a]=(...i)=>w(o,e)(t[r][a],...i)}}(),n}
//# sourceMappingURL=index.cjs.map
