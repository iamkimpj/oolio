# oolio

범용 API 클라이언트 라이브러리입니다. RESTful API를 쉽게 호출할 수 있도록 도와줍니다.

## 설치

```bash
npm install oolio
```

## 사용법

### 기본 설정

```javascript
import oolio from "oolio";

// API 라우트 정의
const routes = {
  auth: {
    login: {
      method: "post",
      path: "/auth/login",
      payload: ["email", "password"],
    },
    register: {
      method: "post",
      path: "/auth/register",
      payload: ["email", "password", "name"],
    },
  },
  user: {
    getProfile: {
      method: "get",
      path: "/user/profile",
    },
    updateProfile: {
      method: "put",
      path: "/user/profile",
      payload: ["name", "avatar"],
    },
  },
};

// oolio 클라이언트 초기화
const api = oolio({
  routes,
  getAuthorizeToken: () => localStorage.getItem("token"),
  baseUrl: "https://api.example.com",
});
```

### API 호출

```javascript
// 로그인 API 호출
const response = await api.auth.login({
  email: "test@example.com",
  password: "1234",
});

// 프로필 조회
const profile = await api.user.getProfile();

// 프로필 업데이트
const updateResult = await api.user.updateProfile({
  name: "John",
  avatar: "profile.jpg",
});
```

### 라우트 설정 옵션

```javascript
const routes = {
  user: {
    // GET 요청
    getProfile: {
      method: "get",
      path: "/user/profile",
    },

    // POST 요청 (데이터 전송)
    updateProfile: {
      method: "post",
      path: "/user/profile",
      payload: ["name", "age"],
    },

    // 파일 업로드
    uploadAvatar: {
      method: "post",
      path: "/user/avatar",
      payload: ["userId"],
      files: ["avatar"],
    },

    // 경로 파라미터 사용
    getUser: {
      method: "get",
      path: "/user/{userId}",
    },

    // 인증 불필요
    publicData: {
      method: "get",
      path: "/public/data",
      authorization: false,
    },
  },
};
```

### 에러 처리

```javascript
try {
  const response = await api.auth.login({
    email: "test@example.com",
    password: "1234",
  });
} catch (error) {
  console.error("API Error:", {
    status: error.status,
    statusText: error.statusText,
    data: error.data,
  });
}
```

## 라우트 설정 옵션

각 라우트는 다음 속성을 가질 수 있습니다:

- `method`: HTTP 메소드 (get, post, put, delete 등)
- `path`: API 엔드포인트 경로
- `payload`: 요청에 포함될 데이터 필드 목록 (선택사항)
- `authorization`: 인증 필요 여부 (기본값: true)
- `files`: 파일 업로드 필드 목록 (선택사항)

## 특징

- 라우트 기반의 API 클라이언트
- 자동 인증 토큰 처리
- 파일 업로드 지원
- 경로 파라미터 지원
- FormData를 사용한 데이터 전송
- 통일된 에러 처리 형식
- TypeScript 지원

## 라이센스

MIT
