"use strict";var c=Object.defineProperty;var w=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var F=Object.prototype.hasOwnProperty;var R=(e,n)=>{for(var r in n)c(e,r,{get:n[r],enumerable:!0})},x=(e,n,r,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of k(n))!F.call(e,s)&&s!==r&&c(e,s,{get:()=>n[s],enumerable:!(t=w(n,s))||t.enumerable});return e};var T=e=>x(c({},"__esModule",{value:!0}),e);var z={};R(z,{default:()=>D});module.exports=T(z);var m=e=>/\/\{[^}]+\}/g.test(e),b=e=>e?e.length>0:!1,g=(e=[],n={})=>{let r={};if(Array.isArray(e))for(let t in n)e.indexOf(t)!==-1&&(r[t]=n[t]===void 0||n[t]===null?"":typeof n[t]=="object"?JSON.stringify(n[t]):n[t]);else for(let t in e)if(n[t]!==void 0)r[t]=n[t]==null?"":typeof n[t]=="object"?JSON.stringify(n[t]):n[t];else{let s=e[t];s&&(r[t]=s.defaultValue)}return r},j=(e=[],n=[],r={})=>{let t=new FormData,s=g(e,r);for(let o in s){let a=encodeURIComponent(o),i=encodeURIComponent(s[o]);t.append(a,i)}for(let o in r)n.includes(o)&&t.append(o,r[o]);return t},v=(e=[],n={})=>{let r=g(e,n),t=new FormData;for(let s in r)t.append(s,r[s]);return t},A=(e,n={})=>{if(!e)return console.log("path is undefined"),e;if(!m(e))return e;let r=e;for(let[t,s]of Object.entries(n)){let o=new RegExp(`\\{${t}\\}`,"g");r=r.replace(o,s)}return r},q=async(e,n,r={},t={})=>{let s=g(n,r),o=await fetch(`${e}?${new URLSearchParams(s).toString()}`,{headers:t});if(!o.ok){let a=await o.json();throw{status:o.status,statusText:o.statusText,data:a}}return o.json()},C=async(e,n,r,t={},s={})=>{let o=v(r,t),a=await fetch(e,{method:n,headers:s,body:o});if(!a.ok){let i=await a.json();throw{status:a.status,statusText:a.statusText,data:i}}return a.json()},H=async(e,n,r,t=[],s={},o={})=>{let a=j(r,t,s);o["Content-Type"]||(o["Content-Type"]="application/x-www-form-urlencoded");let i=await fetch(e,{method:n,headers:o,body:a});if(!i.ok){let l=await i.json();throw{status:i.status,statusText:i.statusText,data:l}}return i.json()},h=(e,n)=>async(r,t={},s=null,o={})=>{let{method:a,path:i,payload:l=[],baseUrl:p=null,authorization:P=null,files:d=void 0}=r,u=p||e||"http://localhost:3000",f=s||{};if(m(i)?u=u+A(i,t):(u=u+i,s||(f=t)),P!=="guest"&&n){let y=await n();y&&(o.Authorization=`Bearer ${y}`)}return a==="get"?q(u,l,f,o):b(d)?H(u,a,l,d,f,o):C(u,a,l,f,o)};function D({routes:e,getAuthorizeToken:n,baseUrl:r}){let t={};return function(){if(e){if(!n){O();return}}else{N();return}for(let o in e){t[o]||(t[o]={});for(let a in e[o])t[o][a]=(...i)=>h(r,n)(e[o][a],...i)}}(),t}function N(){console.warn(`
  [oolio] routes\uAC00 \uC815\uC758\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4. routes\uB294 \uB2E4\uC74C\uACFC \uAC19\uC740 \uD615\uC2DD\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4:
  
  const routes = {
    auth: {
      login: {
        method: 'post',
        path: '/auth/login',
        payload: ['email', 'password']
      },
      register: {
        method: 'post',
        path: '/auth/register',
        payload: ['email', 'password', 'name']
      }
    },
    user: {
      getProfile: {
        method: 'get',
        path: '/user/profile'
      },
      updateProfile: {
        method: 'put',
        path: '/user/profile',
        payload: ['name', 'avatar']
      },
      uploadAvatar: {
        method: 'post',
        path: '/user/avatar',
        payload: ['userId'],
        files: ['avatar']  // \uD30C\uC77C \uC5C5\uB85C\uB4DC \uD544\uB4DC
      }
    }
  };
  
  \uAC01 \uB77C\uC6B0\uD2B8\uB294 \uB2E4\uC74C \uC18D\uC131\uC744 \uAC00\uC9C8 \uC218 \uC788\uC2B5\uB2C8\uB2E4:
  - method: HTTP \uBA54\uC18C\uB4DC (get, post, put, delete \uB4F1)
  - path: API \uC5D4\uB4DC\uD3EC\uC778\uD2B8 \uACBD\uB85C
  - payload: \uC694\uCCAD\uC5D0 \uD3EC\uD568\uB420 \uB370\uC774\uD130 \uD544\uB4DC \uBAA9\uB85D (\uC120\uD0DD\uC0AC\uD56D)
  - authorization: \uC778\uC99D \uD544\uC694 \uC5EC\uBD80 (\uAE30\uBCF8\uAC12: true)
  - files: \uD30C\uC77C \uC5C5\uB85C\uB4DC \uD544\uB4DC \uBAA9\uB85D (\uC120\uD0DD\uC0AC\uD56D)
  `)}function O(){console.log("getAuthorizeToken is undefined")}
//# sourceMappingURL=index.cjs.map
