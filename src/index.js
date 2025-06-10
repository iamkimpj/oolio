import request from "./request.js";

export default ({ routes, getAuthorizeToken, baseUrl }) => {
  const api = {};

  (function init() {
    if (routes === undefined) {
      logForNoRoutes();
      return;
    } else if (getAuthorizeToken === undefined) {
      logForNoGetAuthorizeToken();
      return;
    }
    for (const category in routes) {
      if (api[category] === undefined) {
        api[category] = {};
      }
      for (const fnName in routes[category]) {
        api[category][fnName] = (...args) => {
          const requestFn = request(baseUrl, getAuthorizeToken);
          return requestFn.call(routes[category][fnName], ...args);
        };
      }
    }
  })();

  return api;
};

function logForNoRoutes() {
  console.warn(`
  [oolio] routes가 정의되지 않았습니다. routes는 다음과 같은 형식이어야 합니다:
  
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
        files: ['avatar']  // 파일 업로드 필드
      }
    }
  };
  
  각 라우트는 다음 속성을 가질 수 있습니다:
  - method: HTTP 메소드 (get, post, put, delete 등)
  - path: API 엔드포인트 경로
  - payload: 요청에 포함될 데이터 필드 목록 (선택사항)
  - authorization: 인증 필요 여부 (기본값: true)
  - files: 파일 업로드 필드 목록 (선택사항)
  `);
  return;
}

function logForNoGetAuthorizeToken() {
  console.log("getAuthorizeToken is undefined");
}
