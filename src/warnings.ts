export function warnNoRoutes(): void {
  console.warn(`
  [oolio] routes가 정의되지 않았습니다. routes는 다음과 같은 형식이어야 합니다:

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

  각 라우트는 다음 속성을 가질 수 있습니다:
  - method: HTTP 메소드 (get, post, put, delete 등)
  - path: API 엔드포인트 경로 (경로 파라미터: /user/{userId})
  - payload: 요청에 포함될 데이터 필드 목록 (선택사항)
  - files: 파일 업로드 필드 목록 (선택사항)
  - authorization: 인증 필요 여부 (기본값: true, 'guest' 설정 시 토큰 미첨부)
  - baseUrl: 라우트별 baseUrl 오버라이드 (선택사항)
  `);
}

export function warnNoGetAuthorizeToken(): void {
  console.warn("[oolio] getAuthorizeToken이 정의되지 않았습니다.");
}
