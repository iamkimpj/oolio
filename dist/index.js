var g=e=>/\/\{[^}]+\}/g.test(e),k=(e=void 0)=>e==null?!1:e.length>0,h=(e=[],n={})=>{let r={};if(Array.isArray(e))for(let t in n)e.indexOf(t)!==-1&&(r[t]=n[t]===void 0||n[t]===null?"":typeof n[t]=="object"?JSON.stringify(n[t]):n[t]);else for(let t in e)if(n[t]!==void 0)r[t]=n[t]==null?"":typeof n[t]=="object"?JSON.stringify(n[t]):n[t];else{let s=e[t];s&&(r[t]=s.defaultValue)}return r},F=(e=[],n=[],r={})=>{let t=new FormData,s=h(e,r);for(let o in s){let u=encodeURIComponent(o),i=encodeURIComponent(s[o]);t.append(u,i)}for(let o in r)n.includes(o)&&t.append(o,r[o]);return t},T=(e=[],n={})=>{let r=h(e,n),t=new FormData;for(let s in r)t.append(s,r[s]);return t},x=(e,n={})=>{if(!e)return console.log("path is undefined"),e;if(!g(e))return e;let r=e;for(let[t,s]of Object.entries(n)){let o=new RegExp(`\\{${t}\\}`,"g");r=r.replace(o,s)}return r},A=(e,n,r={},t={})=>{let s=h({payload:n},r);return fetch(`${e}?${new URLSearchParams(s).toString()}`,{headers:t}).then(o=>o.ok?o.json():o.json().then(u=>{throw{status:o.status,statusText:o.statusText,data:u}}))},P=(e,n,r,t={},s={})=>{let o=T({payload:r},t);return fetch(e,{method:n,headers:s,body:o}).then(u=>u.ok?u.json():u.json().then(i=>{throw{status:u.status,statusText:u.statusText,data:i}}))},j=(e,n,r,t=[],s={},o={})=>{let u=F(r,t,s);return o["Content-Type"]==null&&(o["Content-Type"]="application/x-www-form-urlencoded"),fetch(e,{method:n,headers:o,body:u}).then(i=>i.ok?i.json():i.json().then(a=>{throw{status:i.status,statusText:i.statusText,data:a}}))};function m(e,n){return async function(t={},s=null,o={}){let{method:u,path:i,payload:a=[],baseUrl:f=null,authorization:p=null,files:d=void 0}=this,l=f||e||"http://localhost:3000",c=s;if(g(i)?l=l+x(i,t):(l=l+i,s||(c=t)),p!="guest"&&n){let y=await n();y&&(o.Authorization=`Bearer ${y}`)}return u=="get"?A(l,a,c,o):k(d)?j(l,u,a,d,c,o):P(l,u,a,c,o)}}var D=(()=>{let e=null,n,r,t,s={};function o(){console.warn(`
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
    `)}function u(){console.log("getAuthorizeToken is undefined")}function i(){if(n===void 0){o();return}else if(r===void 0){u();return}for(let a in n){s[a]===void 0&&(s[a]={});for(let f in n[a])s[a][f]=(...p)=>m(t,r).call(n[a][f],...p)}}return()=>(e||(e={api:s,routes:a=>(n=a,i(),e),setFnGetAuthorizeToken:a=>(r=a,i(),e),setBaseUrl:a=>(t=a,i(),e)}),e)})(),w=D(),v=w.api,z=w;export{v as api,z as default};
//# sourceMappingURL=index.js.map
