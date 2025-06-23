var m=e=>/\/\{[^}]+\}/g.test(e),D=e=>e?e.length>0:!1,c=(e=[],o={})=>{let r={};if(Array.isArray(e))for(let t in o)e.indexOf(t)!==-1&&(r[t]=o[t]===void 0||o[t]===null?"":typeof o[t]=="object"?JSON.stringify(o[t]):o[t]);else for(let t in e)if(o[t]!==void 0)r[t]=o[t]==null?"":typeof o[t]=="object"?JSON.stringify(o[t]):o[t];else{let s=e[t];s&&(r[t]=s.defaultValue)}return r},P=(e=[],o=[],r={})=>{let t=new FormData,s=c(e,r);for(let n in s){let a=encodeURIComponent(n),i=encodeURIComponent(s[n]);t.append(a,i)}for(let n in r)o.includes(n)&&t.append(n,r[n]);return t},w=(e=[],o={})=>{let r=c(e,o),t=new FormData;for(let s in r)t.append(s,r[s]);return t},k=(e,o={})=>{if(!e)return console.log("path is undefined"),e;if(!m(e))return e;let r=e;for(let[t,s]of Object.entries(o)){let n=new RegExp(`\\{${t}\\}`,"g");r=r.replace(n,s)}return r},F=async(e,o,r={},t={})=>{let s=c(o,r),n=await fetch(`${e}?${new URLSearchParams(s).toString()}`,{headers:t});if(!n.ok){let a=await n.json();throw{status:n.status,statusText:n.statusText,data:a}}return n.json()},R=async(e,o,r,t={},s={})=>{let n=w(r,t),a=await fetch(e,{method:o,headers:s,body:n});if(!a.ok){let i=await a.json();throw{status:a.status,statusText:a.statusText,data:i}}return a.json()},b=async(e,o,r,t=[],s={},n={})=>{let a=P(r,t,s);n["Content-Type"]||(n["Content-Type"]="application/x-www-form-urlencoded");let i=await fetch(e,{method:o,headers:n,body:a});if(!i.ok){let l=await i.json();throw{status:i.status,statusText:i.statusText,data:l}}return i.json()};function g(e,o){return async function(t={},s=null,n={}){let{method:a,path:i,payload:l=[],baseUrl:p=null,authorization:h=null,files:d=void 0}=this,u=p||e||"http://localhost:3000",f=s||{};if(m(i)?u=u+k(i,t):(u=u+i,s||(f=t)),h!=="guest"&&o){let y=await o();y&&(n.Authorization=`Bearer ${y}`)}return a==="get"?F(u,l,f,n):D(d)?b(u,a,l,d,f,n):R(u,a,l,f,n)}}function T({routes:e,getAuthorizeToken:o,baseUrl:r}){let t={};return function(){if(e){if(!o){j();return}}else{x();return}for(let n in e){t[n]||(t[n]={});for(let a in e[n])t[n][a]=(...i)=>g(r,o).call(e[n][a],...i)}}(),t}function x(){console.warn(`
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
  `)}function j(){console.log("getAuthorizeToken is undefined")}export{T as default};
//# sourceMappingURL=index.mjs.map
