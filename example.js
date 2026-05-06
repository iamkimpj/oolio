// oolio 라이브러리 사용 예제
import oolio from "oolio";

// 1. 라우트 정의
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
    uploadAvatar: {
      method: "post",
      path: "/user/avatar",
      payload: ["userId", "avatar"],
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
  },
};

// 2. API 클라이언트 초기화
const api = oolio({
  routes,
  getAuthorizeToken: () => localStorage.getItem("token"),
  baseUrl: "https://api.example.com",
  option: { logger: true },
  interceptors: {
    // 모든 요청에 트레이스 ID 헤더 추가
    request: (config) => {
      config.headers["X-Trace-Id"] = crypto.randomUUID();
      return config;
    },
    // 응답 데이터 unwrap: { result: ... } 구조라면 result만 반환
    response: (data) => data.result ?? data,
    // 에러 처리: 404는 null로 변환, 나머지는 그대로 throw
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

// 3. API 사용 예제

// 3.1 로그인
async function login(email, password) {
  try {
    const response = await api.auth.login({ email, password });
    console.log("로그인 성공:", response);
    return response;
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
}

// 3.2 프로필 조회
async function getProfile() {
  try {
    const response = await api.user.getProfile();
    console.log("프로필 조회 성공:", response);
    return response;
  } catch (error) {
    console.error("프로필 조회 실패:", error);
    throw error;
  }
}

// 3.3 프로필 수정
async function updateProfile(name, avatar) {
  try {
    const response = await api.user.updateProfile({ name, avatar });
    console.log("프로필 수정 성공:", response);
    return response;
  } catch (error) {
    console.error("프로필 수정 실패:", error);
    throw error;
  }
}

// 3.4 아바타 업로드
async function uploadAvatar(userId, avatarFile) {
  try {
    const response = await api.user.uploadAvatar({
      userId,
      avatar: avatarFile,
    });
    console.log("아바타 업로드 성공:", response);
    return response;
  } catch (error) {
    console.error("아바타 업로드 실패:", error);
    throw error;
  }
}

// 3.5 사용자 ID로 조회/수정
async function getUserById(userId) {
  try {
    const response = await api.user.getUserById({ userId });
    console.log("사용자 정보 조회 성공:", response);
    return response;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    throw error;
  }
}

async function updateUserById(userId, name, email) {
  try {
    const response = await api.user.updateUserById({ userId }, { name, email });
    console.log("사용자 정보 수정 성공:", response);
    return response;
  } catch (error) {
    console.error("사용자 정보 수정 실패:", error);
    throw error;
  }
}

// 3.6 per-request 옵션 (headers)
// 마지막 인자로 { headers: { ... } } 오브젝트를 넘기면 해당 요청에만 적용됩니다.

// path params 없는 route — data 없이 headers만 전달
async function getProfileWithCustomHeader() {
  return api.user.getProfile({ headers: { "X-Request-Source": "mobile" } });
}

// path params 없는 route — data + headers 함께 전달
async function loginWithTraceId(email, password) {
  return api.auth.login({ email, password }, { headers: { "X-Trace-Id": crypto.randomUUID() } });
}

// path params 있는 route — data 없이 pathParams + headers 전달
async function getUserByIdWithHeader(userId) {
  return api.user.getUserById({ userId }, { headers: { "X-Request-Source": "admin" } });
}

// path params 있는 route — pathParams + data + headers 모두 전달
async function updateUserWithTraceId(userId, name, email) {
  return api.user.updateUserById(
    { userId },
    { name, email },
    { headers: { "X-Trace-Id": crypto.randomUUID() } },
  );
}

// 4. 사용 예시
async function main() {
  // 로그인
  await login("user@example.com", "password123");

  // 프로필 조회
  const profile = await getProfile();

  // 프로필 수정
  await updateProfile("새로운 이름", "https://example.com/avatar.jpg");

  // 아바타 업로드
  const fileInput = document.querySelector('input[type="file"]');
  const avatarFile = fileInput.files[0];
  await uploadAvatar("user123", avatarFile);

  // 사용자 ID로 조회/수정
  const userId = "12345";
  await getUserById(userId);
  await updateUserById(userId, "수정된 이름", "updated@example.com");
}

// 실행
main().catch(console.error);
