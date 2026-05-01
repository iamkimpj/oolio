# oolio

범용 API 클라이언트 라이브러리입니다. RESTful API를 쉽게 호출할 수 있도록 도와줍니다.

## 설치

```bash
npm install oolio
```

## 특징

- 라우트 기반의 API 클라이언트
- 자동 인증 토큰 처리 (Bearer)
- 경로 파라미터 지원 (`/user/{userId}`)
- 파일 업로드 지원 (FormData 자동 처리)
- 통일된 에러 처리 형식
- 브라우저 / Node.js 환경 모두 지원
- TypeScript 제네릭으로 요청/응답 타입 정의 가능

## 사용법

### JavaScript

```javascript
import oolio from "oolio";

const routes = {
  auth: {
    login: {
      method: "post",
      path: "/auth/login",
      payload: ["email", "password"],
    },
  },
  user: {
    getProfile: {
      method: "get",
      path: "/user/profile",
    },
    getUserById: {
      method: "get",
      path: "/user/{userId}",
    },
    updateUserById: {
      method: "put",
      path: "/user/{userId}",
      payload: ["name", "email"],
    },
    uploadAvatar: {
      method: "post",
      path: "/user/avatar",
      payload: ["userId"],
      files: ["avatar"],
    },
  },
};

const api = oolio({
  routes,
  getAuthorizeToken: () => localStorage.getItem("token"),
  baseUrl: "https://api.example.com",
});

// 일반 요청
const response = await api.auth.login({
  email: "test@example.com",
  password: "1234",
});

// 경로 파라미터
const user = await api.user.getUserById({ userId: "123" });

// 경로 파라미터 + payload
await api.user.updateUserById(
  { userId: "123" },
  { name: "John", email: "john@example.com" },
);

// 파일 업로드
await api.user.uploadAvatar({ userId: "123", avatar: fileInput.files[0] });
```

### TypeScript

`Route<TPayload, TResponse>` 제네릭으로 요청/응답 타입을 정의할 수 있습니다.

```typescript
import oolio from "oolio";
import type { Route } from "oolio";

const routes = {
  auth: {
    login: {
      method: "post",
      path: "/auth/login",
      payload: ["email", "password"],
    } as Route<{ email: string; password: string }, { token: string }>,
  },
  user: {
    getProfile: {
      method: "get",
      path: "/user/profile",
    } as Route<void, { name: string; avatar: string }>,

    getUserById: {
      method: "get",
      path: "/user/{userId}",
    } as Route<{ userId: string }, { id: string; name: string }>,

    // 경로 파라미터 + payload 동시 사용
    // 첫 번째 인자: 경로 파라미터, 두 번째 인자: payload
    updateUserById: {
      method: "put",
      path: "/user/{userId}",
      payload: ["name", "email"],
    } as Route<{ name: string; email: string }, { success: boolean }>,

    uploadAvatar: {
      method: "post",
      path: "/user/avatar",
      payload: ["userId"],
      files: ["avatar"],
    } as Route<{ userId: string; avatar: File }, { url: string }>,
  },
};

const api = oolio({
  routes,
  getAuthorizeToken: () => localStorage.getItem("token"),
  baseUrl: "https://api.example.com",
});

// 타입 자동 추론
const { token } = await api.auth.login({
  email: "test@example.com",
  password: "1234",
});
const { name } = await api.user.getProfile();
const { id } = await api.user.getUserById({ userId: "123" });

// 경로 파라미터 + payload
await api.user.updateUserById(
  { userId: "123" },
  { name: "John", email: "john@example.com" },
);
```

## 라우트 옵션

| 옵션            | 필수 | 설명                                                      |
| --------------- | ---- | --------------------------------------------------------- |
| `method`        | O    | HTTP 메소드 (get, post, put, delete 등)                   |
| `path`          | O    | API 엔드포인트 경로. 경로 파라미터는 `{param}` 형식       |
| `payload`       | -    | 요청에 포함될 데이터 필드 목록                            |
| `files`         | -    | 파일 업로드 필드 목록                                     |
| `authorization` | -    | `false` 또는 `"guest"` 설정 시 토큰 미첨부 (기본값: true) |
| `baseUrl`       | -    | 라우트별 baseUrl 오버라이드                               |

## 에러 처리

```javascript
try {
  const response = await api.auth.login({
    email: "test@example.com",
    password: "1234",
  });
} catch (error) {
  console.error(error.status); // HTTP 상태 코드
  console.error(error.statusText); // 상태 텍스트
  console.error(error.data); // 서버 응답 데이터
}
```

## 라이센스

MIT
