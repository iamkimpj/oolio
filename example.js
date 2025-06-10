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
      payload: ["userId"],
      files: ["avatar"],
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
