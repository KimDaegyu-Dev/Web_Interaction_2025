import axios from "axios";

export const client = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// JWT access_token을 Authorization 헤더에 자동으로 추가하는 인터셉터
client.interceptors.request.use(
  (config) => {
    // const { accessToken } = useAuthStore.getState();
    // TODO: accessToken 가져오기
    const accessToken = "test";
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(config.headers);
    return config;
  },
  (error) => Promise.reject(error),
);

// Access 토큰 만료 시 자동으로 재발급하는 인터셉터
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // const { logout, setTokens } = useAuthStore.getState();
      // 발급 시도 프로미스, 이미 발급 중이면 대기
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = client
          .post(`${import.meta.env.VITE_BASE_API_URL}/auth/refresh`, {
            withCredentials: true,
          })
          .then((res) => {
            const { accessToken, refreshToken } = res.data.data;
            // TODO: Refresh 토큰 저장
            // setTokens({ accessToken, refreshToken });
            return accessToken;
          })
          .catch((err) => {
            // 발급 실패 시 처리, 예시 : 로그아웃 후 에러 페이지로 이동
            throw err;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      // 발급 완료 후 요청 재시도
      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
