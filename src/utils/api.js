import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const REFRESH_URL = "/auth/refresh-token";

const shouldSkipAuthHandling = (url = "") => {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes(REFRESH_URL)
  );
};

const getAccessToken = () =>
  localStorage.getItem("accessToken") || localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("token", token);
};

const setRefreshToken = (token) => {
  localStorage.setItem("refreshToken", token);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("token");
};

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const isTokenExpiredOrNearExpiry = (token, bufferSeconds = 30) => {
  if (!token) return true;

  const payload = parseJwt(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now < bufferSeconds;
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Không có refresh token");
  }

  const res = await axios.post(
    `http://localhost:3000/api${REFRESH_URL}`,
    { refreshToken }
  );

  const newAccessToken = res.data?.accessToken;
  const newRefreshToken = res.data?.refreshToken;

  if (!newAccessToken) {
    throw new Error("Không nhận được access token mới");
  }

  setAccessToken(newAccessToken);
  if (newRefreshToken) {
    setRefreshToken(newRefreshToken);
  }

  return newAccessToken;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    // Skip auth token logic for auth endpoints that should not trigger refresh.
    if (shouldSkipAuthHandling(config.url)) {
      return config;
    }

    let accessToken = getAccessToken();

    if (isTokenExpiredOrNearExpiry(accessToken)) {
      try {
        accessToken = await refreshAccessToken();
      } catch (error) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !shouldSkipAuthHandling(originalRequest?.url)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export { setAccessToken, setRefreshToken, clearTokens, getAccessToken };