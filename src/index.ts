import request from "./request.js";

interface Route {
  method: string;
  path: string;
  payload?: string[];
  files?: string[];
  authorization?: boolean;
}

interface Routes {
  [category: string]: {
    [fnName: string]: Route;
  };
}

interface OolioConfig {
  routes: Routes;
  getAuthorizeToken: () => string | null;
  baseUrl: string;
}

export default function oolio({
  routes,
  getAuthorizeToken,
  baseUrl,
}: OolioConfig) {
  const api: Record<string, any> = {};

  (function init(): void {
    if (!routes) {
      logForNoRoutes();
      return;
    } else if (!getAuthorizeToken) {
      logForNoGetAuthorizeToken();
      return;
    }

    for (const category in routes) {
      if (!api[category]) {
        api[category] = {};
      }
      for (const fnName in routes[category]) {
        api[category][fnName] = (...args: any[]) => {
          const requestFn = request(baseUrl, getAuthorizeToken);
          return requestFn.call(routes[category][fnName], ...args);
        };
      }
    }
  })();

  return api;
}

function logForNoRoutes(): void {
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
}

function logForNoGetAuthorizeToken(): void {
  console.log("getAuthorizeToken is undefined");
}
