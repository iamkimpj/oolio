var h=Object.defineProperty;var F=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var x=Object.prototype.hasOwnProperty;var A=(t,e)=>{for(var o in e)h(t,o,{get:e[o],enumerable:!0})},P=(t,e,o,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of T(e))!x.call(t,r)&&r!==o&&h(t,r,{get:()=>e[r],enumerable:!(n=F(e,r))||n.enumerable});return t};var j=t=>P(h({},"__esModule",{value:!0}),t);var C={};A(C,{api:()=>U,default:()=>B});module.exports=j(C);var w=t=>/\/\{[^}]+\}/g.test(t),D=(t=void 0)=>t==null?!1:t.length>0,m=(t=[],e={})=>{let o={};if(Array.isArray(t))for(let n in e)t.indexOf(n)!==-1&&(o[n]=e[n]===void 0||e[n]===null?"":typeof e[n]=="object"?JSON.stringify(e[n]):e[n]);else for(let n in t)if(e[n]!==void 0)o[n]=e[n]==null?"":typeof e[n]=="object"?JSON.stringify(e[n]):e[n];else{let r=t[n];r&&(o[n]=r.defaultValue)}return o},q=(t=[],e=[],o={})=>{let n=new FormData,r=m(t,o);for(let s in r){let u=encodeURIComponent(s),i=encodeURIComponent(r[s]);n.append(u,i)}for(let s in o)e.includes(s)&&n.append(s,o[s]);return n},b=(t=[],e={})=>{let o=m(t,e),n=new FormData;for(let r in o)n.append(r,o[r]);return n},v=(t,e={})=>{if(!t)return console.log("path is undefined"),t;if(!w(t))return t;let o=t;for(let[n,r]of Object.entries(e)){let s=new RegExp(`\\{${n}\\}`,"g");o=o.replace(s,r)}return o},z=(t,e,o={},n={})=>{let r=m({payload:e},o);return fetch(`${t}?${new URLSearchParams(r).toString()}`,{headers:n}).then(s=>s.ok?s.json():s.json().then(u=>{throw{status:s.status,statusText:s.statusText,data:u}}))},O=(t,e,o,n={},r={})=>{let s=b({payload:o},n);return fetch(t,{method:e,headers:r,body:s}).then(u=>u.ok?u.json():u.json().then(i=>{throw{status:u.status,statusText:u.statusText,data:i}}))},N=(t,e,o,n=[],r={},s={})=>{let u=q(o,n,r);return s["Content-Type"]==null&&(s["Content-Type"]="application/x-www-form-urlencoded"),fetch(t,{method:e,headers:s,body:u}).then(i=>i.ok?i.json():i.json().then(a=>{throw{status:i.status,statusText:i.statusText,data:a}}))};function y(t,e){return async function(n={},r=null,s={}){let{method:u,path:i,payload:a=[],baseUrl:f=null,authorization:p=null,files:d=void 0}=this,l=f||t||"http://localhost:3000",c=r;if(w(i)?l=l+v(i,n):(l=l+i,r||(c=n)),p!="guest"&&e){let g=await e();g&&(s.Authorization=`Bearer ${g}`)}return u=="get"?z(l,a,c,s):D(d)?N(l,u,a,d,c,s):O(l,u,a,c,s)}}var R=(()=>{let t=null,e,o,n,r={};function s(){console.warn(`
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
    `)}function u(){console.log("getAuthorizeToken is undefined")}function i(){if(e===void 0){s();return}else if(o===void 0){u();return}for(let a in e){r[a]===void 0&&(r[a]={});for(let f in e[a])r[a][f]=(...p)=>y(n,o).call(e[a][f],...p)}}return()=>(t||(t={api:r,routes:a=>(e=a,i(),t),setFnGetAuthorizeToken:a=>(o=a,i(),t),setBaseUrl:a=>(n=a,i(),t)}),t)})(),k=R(),U=k.api,B=k;0&&(module.exports={api});
//# sourceMappingURL=index.cjs.map
