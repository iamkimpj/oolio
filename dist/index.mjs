var m=e=>/\/\{[^}]+\}/g.test(e),P=e=>e?e.length>0:!1,f=(e=[],o={})=>{let r={};if(Array.isArray(e))for(let t in o)e.indexOf(t)!==-1&&(r[t]=o[t]===void 0||o[t]===null?"":typeof o[t]=="object"?JSON.stringify(o[t]):o[t]);else for(let t in e)if(o[t]!==void 0)r[t]=o[t]==null?"":typeof o[t]=="object"?JSON.stringify(o[t]):o[t];else{let s=e[t];s&&(r[t]=s.defaultValue)}return r},R=(e=[],o=[],r={})=>{let t=new FormData,s=f(e,r);for(let n in s){let a=encodeURIComponent(n),i=encodeURIComponent(s[n]);t.append(a,i)}for(let n in r)o.includes(n)&&t.append(n,r[n]);return t},T=(e=[],o={})=>{let r=f(e,o),t=new FormData;for(let s in r)t.append(s,r[s]);return t},k=(e,o={})=>{if(!e)return console.log("path is undefined"),e;if(!m(e))return e;let r=e;for(let[s,n]of Object.entries(o)){let a=new RegExp(`\\{${s}\\}`,"g");r=r.replace(a,n)}let t=r.match(/\{[^}]+\}/g);if(t)throw new Error(`[oolio] \uACBD\uB85C \uD30C\uB77C\uBBF8\uD130\uAC00 \uCE58\uD658\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4: ${t.join(", ")} (path: ${e})`);return r},x=async(e,o,r={},t={})=>{let s=f(o,r),n=await fetch(`${e}?${new URLSearchParams(s).toString()}`,{headers:t});if(!n.ok){let a=await n.json();throw{status:n.status,statusText:n.statusText,data:a}}return n.json()},A=async(e,o,r,t={},s={})=>{let n=T(r,t),a=await fetch(e,{method:o,headers:s,body:n});if(!a.ok){let i=await a.json();throw{status:a.status,statusText:a.statusText,data:i}}return a.json()},F=async(e,o,r,t=[],s={},n={})=>{let a=R(r,t,s);delete n["Content-Type"];let i=await fetch(e,{method:o,headers:n,body:a});if(!i.ok){let l=await i.json();throw{status:i.status,statusText:i.statusText,data:l}}return i.json()},y=(e,o)=>async(r,t={},s=null,n={})=>{let{method:a,path:i,payload:l=[],baseUrl:p=null,authorization:D=null,files:g=void 0}=r,u=p||e||"http://localhost:3000",c=s||{};if(m(i)?u=u+k(i,t):(u=u+i,s||(c=t)),D!=="guest"&&o){let d=await o();d&&(n.Authorization=`Bearer ${d}`)}return a==="get"?x(u,l,c,n):P(g)?F(u,a,l,g,c,n):A(u,a,l,c,n)};function h(){console.warn(`
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
  `)}function w(){console.warn("[oolio] getAuthorizeToken\uC774 \uC815\uC758\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.")}function v({routes:e,getAuthorizeToken:o,baseUrl:r}){let t={};return function(){if(e){if(!o){w();return}}else{h();return}for(let n in e){t[n]||(t[n]={});for(let a in e[n])t[n][a]=(...i)=>y(r,o)(e[n][a],...i)}}(),t}export{v as default};
//# sourceMappingURL=index.mjs.map
