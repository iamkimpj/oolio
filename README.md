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
- 본문 자동 직렬화 — 일반 POST/PUT/DELETE는 `application/json`, `payload` 값에 `File`/`Blob`이 있으면 `multipart/form-data`로 자동 전환
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
      payload: ["userId", "avatar"],
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

`IO<TPayload, TResponse>` 제네릭으로 요청/응답 타입을 정의할 수 있습니다.

```typescript
import oolio from "oolio";
import type { IO } from "oolio";

const routes = {
  auth: {
    login: {
      method: "post",
      path: "/auth/login",
      payload: ["email", "password"],
    } as IO<{ email: string; password: string }, { token: string }>,
  },
  user: {
    getProfile: {
      method: "get",
      path: "/user/profile",
    } as IO<void, { name: string; avatar: string }>,

    getUserById: {
      method: "get",
      path: "/user/{userId}",
    } as IO<{ userId: string }, { id: string; name: string }>,

    // 경로 파라미터 + payload 동시 사용
    // 첫 번째 인자: 경로 파라미터, 두 번째 인자: payload
    updateUserById: {
      method: "put",
      path: "/user/{userId}",
      payload: ["name", "email"],
    } as IO<{ name: string; email: string }, { success: boolean }>,

    uploadAvatar: {
      method: "post",
      path: "/user/avatar",
      payload: ["userId", "avatar"],
    } as IO<{ userId: string; avatar: File }, { url: string }>,
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

| 옵션            | 필수 | 설명                                                                   |
| --------------- | ---- | ---------------------------------------------------------------------- |
| `method`        | O    | HTTP 메소드 (get, post, put, delete 등)                                |
| `path`          | O    | API 엔드포인트 경로. 경로 파라미터는 `{param}` 형식                    |
| `payload`       | -    | 요청에 포함될 데이터 필드 목록 (파일 필드도 여기에 함께 명시)          |
| `authorization` | -    | `false` 또는 `"guest"` 설정 시 토큰 미첨부 (기본값: true)              |
| `baseUrl`       | -    | 라우트별 baseUrl 오버라이드                                            |

> 파일 업로드는 별도 옵션 없이 `payload`에 키만 명시하면 됩니다. 호출 시 해당 값이 `File`/`Blob` 인스턴스이면 자동으로 `multipart/form-data`로 전송됩니다.

## 클라이언트 옵션 (`option`)

`oolio({ ..., option })`에 전달하는 클라이언트 단위 설정.

| 옵션     | 기본값 | 설명                                                  |
| -------- | ------ | ----------------------------------------------------- |
| `logger` | false  | true 설정 시 모든 요청·응답·에러를 console에 출력     |

### 로그 활성화

```javascript
const api = oolio({
  routes,
  getAuthorizeToken: () => localStorage.getItem("token"),
  baseUrl: "https://api.example.com",
  option: { logger: true },
});
```

호출마다 6자 임시 ID가 발급되어 모든 로그 라인 prefix(`[oolio]:{id}`)에 포함되므로, 동시 호출 시에도 같은 요청의 로그를 ID로 묶어서 추적할 수 있습니다.

```
[oolio]:k3p9af → { method: 'post', path: '/auth/login', ... } { pathParams: {}, data: {...}, headers: { Authorization: 'Bearer e...XYZ12345' } }
[oolio]:k3p9af → POST https://api.example.com/auth/login
[oolio]:k3p9af ← POST https://api.example.com/auth/login (245ms) { token: '...' }
```

`Authorization` 헤더는 토큰 노출을 줄이기 위해 부분 마스킹됩니다(앞/뒤 일부만 표시). 그 외 body·data는 마스킹 없이 그대로 출력되므로 운영 환경에서는 활성화하지 않는 것을 권장합니다.

## 본문 직렬화 규칙

axios의 동작과 유사하게, 메소드와 호출 시 데이터에 따라 자동으로 본문 형식이 결정됩니다.

| 조건                                                   | Content-Type                          | 본문                          |
| ------------------------------------------------------ | ------------------------------------- | ----------------------------- |
| `method: "get"`                                        | (없음)                                | URL query string              |
| `payload` 값 중 `File`/`Blob` 인스턴스 존재            | `multipart/form-data` (브라우저 자동) | FormData (자동 변환)          |
| 호출 시 `data`로 `FormData` 인스턴스 직접 전달         | `multipart/form-data` (브라우저 자동) | 전달한 FormData 그대로        |
| 그 외 POST/PUT/DELETE                                  | `application/json`                    | `JSON.stringify(payload)`     |

- **사용자가 `headers["Content-Type"]`을 직접 지정한 경우 항상 그 값을 우선합니다** — 자동 분기로 multipart가 되는 경우에도 `delete`하지 않고 사용자가 지정한 값을 그대로 보냅니다 (단, `multipart/form-data`로 임의 지정 시 boundary는 사용자 책임).
- `payload`에 명시되지 않은 키는 자동 감지 대상에서 제외되어 잘려나갑니다 (협업 누락 방지를 위한 의도적 동작).

## 인터셉터

`oolio({ ..., interceptors })`에 전달하는 훅. 한 번 등록하면 모든 요청에 자동 적용됩니다.

| 훅               | 시점                          | 시그니처                                                                                   |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| `request`        | fetch 직전 (직렬화 완료 후)   | `(config: RequestConfig) => RequestConfig \| Promise<RequestConfig>`                       |
| `response`       | 성공 응답 파싱 후             | `(data: any, config: RequestConfig) => any \| Promise<any>`                               |
| `responseError`  | 에러 최종 처리                | `(error: OolioError, config: RequestConfig) => any \| Promise<any>`                       |
| `retry`          | 에러 발생 시 재시도 여부 결정 | `(error: OolioError, config: RequestConfig, attempt: number) => boolean \| Promise<boolean>` |

- `attempt`: 지금까지 실패한 횟수. 첫 실패 후 호출 시 `attempt=1`.
- `retry`가 `true`를 반환하면 동일 config로 재시도합니다. `responseError`보다 먼저 실행되며, retry 포기 후 `responseError`로 넘어갑니다.
- `responseError`가 값을 반환하면 해당 값이 호출자에게 전달됩니다 (throw 없음). 직접 `throw`하면 호출자까지 전파됩니다.

```javascript
const api = oolio({
  routes,
  getAuthorizeToken: () => localStorage.getItem("token"),
  baseUrl: "https://api.example.com",
  interceptors: {
    // 모든 요청에 트레이스 ID 헤더 추가
    request: (config) => {
      config.headers["X-Trace-Id"] = crypto.randomUUID();
      return config;
    },
    // 응답 unwrap: { result: ... } 구조라면 result만 반환
    response: (data) => data.result ?? data,
    // 404는 null로 변환, 나머지는 그대로 throw
    responseError: async (err) => {
      if (err.status === 404) return null;
      throw err;
    },
    // 503 에러 최대 3회 지수 백오프 재시도
    retry: async (err, _config, attempt) => {
      if (err.status !== 503 || attempt >= 3) return false;
      await new Promise((r) => setTimeout(r, 2 ** attempt * 100));
      return true;
    },
  },
});
```

## per-request 옵션

각 API 호출의 **마지막 인자**로 `{ headers?: Record<string, string> }` 오브젝트를 전달하면 해당 요청에만 적용됩니다. 글로벌 인터셉터로 처리하기 어려운 요청별 헤더에 사용합니다.

```javascript
// path params 없는 route — data 없이 headers만
api.user.getProfile({ headers: { "X-Request-Source": "mobile" } });

// path params 없는 route — data + headers
api.auth.login({ email: "a@b.com", password: "1234" }, { headers: { "X-Trace-Id": "abc" } });

// path params 있는 route — data 생략, pathParams + headers
api.user.getUserById({ userId: "123" }, { headers: { "X-Request-Source": "admin" } });

// path params 있는 route — pathParams + data + headers
api.user.updateUserById(
  { userId: "123" },
  { name: "John", email: "john@example.com" },
  { headers: { "X-Trace-Id": "abc" } },
);
```

`{ headers }` 키를 가진 오브젝트를 마지막 인자로 넣으면 options로 인식합니다. data를 생략하고 싶다면 null 없이 바로 붙이면 됩니다.

```javascript
// path params 있는 route — data 생략
// { headers } 키가 있으므로 options로 자동 인식
api.user.getUserById({ userId: "123" }, { headers: { "X-Custom": "test" } });
```

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

## 변경 이력

### 0.2.3

**Breaking changes**

- `IO` 옵션에서 `files` 필드 제거. 대신 `payload` 값 중 `File`/`Blob` 인스턴스가 있으면 자동으로 `multipart/form-data`로 전환됩니다. 기존에 `files`를 사용하던 경우 해당 키를 `payload`로 옮기기만 하면 됩니다.
- POST/PUT/DELETE 기본 직렬화 방식이 `multipart/form-data` → `application/json`으로 변경되었습니다.

**신규 기능**

- `OolioConfig.interceptors` 추가 — `request` / `response` / `responseError` / `retry` 4종 지원
- `OolioConfig.option.logger` 추가 — 요청·응답·에러 콘솔 출력, 동시 요청 구분용 임시 ID 포함
- per-request 옵션 — 마지막 인자로 `{ headers }` 오브젝트 전달 시 해당 요청에만 헤더 적용
- 사용자가 `headers["Content-Type"]`을 직접 지정한 경우 자동 감지보다 우선 적용
- `payload` 값에 `File`/`Blob`이 있으면 별도 설정 없이 `multipart/form-data`로 자동 전환

## 라이센스

MIT
