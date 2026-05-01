var y=e=>/\/\{[^}]+\}/g.test(e),P=e=>e?e.length>0:!1,p=(e=[],n={})=>{let r={};if(Array.isArray(e))for(let t in n)e.indexOf(t)!==-1&&(r[t]=n[t]===void 0||n[t]===null?"":typeof n[t]=="object"?JSON.stringify(n[t]):n[t]);else for(let t in e)if(n[t]!==void 0)r[t]=n[t]==null?"":typeof n[t]=="object"?JSON.stringify(n[t]):n[t];else{let s=e[t];s&&(r[t]=s.defaultValue)}return r},x=(e=[],n=[],r={})=>{let t=new FormData,s=p(e,r);for(let o in s){let a=encodeURIComponent(o),i=encodeURIComponent(s[o]);t.append(a,i)}for(let o in r)n.includes(o)&&t.append(o,r[o]);return t},T=(e=[],n={})=>{let r=p(e,n),t=new FormData;for(let s in r)t.append(s,r[s]);return t},k=(e,n={})=>{if(!e)return console.log("path is undefined"),e;if(!y(e))return e;let r=e;for(let[s,o]of Object.entries(n)){let a=new RegExp(`\\{${s}\\}`,"g");r=r.replace(a,o)}let t=r.match(/\{[^}]+\}/g);if(t)throw new Error(`[oolio] \uACBD\uB85C \uD30C\uB77C\uBBF8\uD130\uAC00 \uCE58\uD658\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4: ${t.join(", ")} (path: ${e})`);return r},l=async e=>{let n=await e.text();try{return JSON.parse(n)}catch{return n}},A=async(e,n,r={},t={})=>{let s=p(n,r),o=await fetch(`${e}?${new URLSearchParams(s).toString()}`,{headers:t});if(!o.ok)throw{status:o.status,statusText:o.statusText,data:await l(o)};return l(o)},F=async(e,n,r,t={},s={})=>{let o=T(r,t),a=await fetch(e,{method:n,headers:s,body:o});if(!a.ok)throw{status:a.status,statusText:a.statusText,data:await l(a)};return l(a)},v=async(e,n,r,t=[],s={},o={})=>{let a=x(r,t,s);delete o["Content-Type"];let i=await fetch(e,{method:n,headers:o,body:a});if(!i.ok)throw{status:i.status,statusText:i.statusText,data:await l(i)};return l(i)},h=(e,n)=>async(r,t={},s=null,o={})=>{let{method:a,path:i,payload:c=[],baseUrl:g=null,authorization:D=null,files:d=void 0}=r,u=g||e||"http://localhost:3000",f=s||{};if(y(i)?u=u+k(i,t):(u=u+i,s||(f=t)),D!=="guest"&&n){let m=await n();m&&(o.Authorization=`Bearer ${m}`)}return a==="get"?A(u,c,f,o):P(d)?v(u,a,c,d,f,o):F(u,a,c,f,o)};function w(){console.warn(`
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
  `)}function R(){console.warn("[oolio] getAuthorizeToken\uC774 \uC815\uC758\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.")}function b({routes:e,getAuthorizeToken:n,baseUrl:r}){let t={};return function(){if(e){if(!n){R();return}}else{w();return}for(let o in e){t[o]||(t[o]={});for(let a in e[o])t[o][a]=(...i)=>h(r,n)(e[o][a],...i)}}(),t}export{b as default};
//# sourceMappingURL=index.mjs.map
