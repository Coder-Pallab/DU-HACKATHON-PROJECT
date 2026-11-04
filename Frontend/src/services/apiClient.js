import axios from "axios";

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
if (import.meta.env.PROD && !configuredApiBaseUrl) {
  throw new Error("VITE_API_BASE_URL must point to the deployed backend API.");
}
const API_BASE_URL = configuredApiBaseUrl || "http://localhost:5000/api/v1";
const ACCESS_TOKEN_KEY = "disha_access_token";
const REFRESH_TOKEN_KEY = "disha_refresh_token";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "application/json" },
});

const refreshClient = axios.create({ baseURL: API_BASE_URL });
let refreshRequest;

function getTokenStorage() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) !== null ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY) !== null
    ? sessionStorage
    : localStorage;
}

export function getStoredTokens() {
  return {
    accessToken:
      sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
      localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken:
      sessionStorage.getItem(REFRESH_TOKEN_KEY) ||
      localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function saveAuthTokens(tokens, rememberMe = false) {
  clearAuthTokens();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function updateAuthTokens(tokens) {
  const storage = getTokenStorage();
  storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearAuthTokens() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function getApiErrorMessage(error) {
  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return "This request took too long to complete. Please try again.";
  }
  const response = error?.response?.data;
  if (Array.isArray(response?.errors) && response.errors.length > 0) {
    const details = response.errors
      .map((item) => item.msg || item.message || String(item))
      .join(", ");
    return response.message ? `${response.message}: ${details}` : details;
  }
  if (typeof response?.message === "string") {
    return response.message;
  }
  return error?.message || "The request could not be completed.";
}

function notifyUnauthorized() {
  clearAuthTokens();
  window.dispatchEvent(new Event("disha:unauthorized"));
}

function dispatchToast(type, message) {
  if (typeof message !== "string" || !message.trim()) return;
  window.dispatchEvent(
    new CustomEvent("disha:toast", {
      detail: { type, message },
    })
  );
}

apiClient.interceptors.request.use((config) => {
  const { accessToken } = getStoredTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toLowerCase();
    const message = response.data?.message;
    if (["post", "put", "patch", "delete"].includes(method)) {
      dispatchToast("success", message || "Request completed successfully.");
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isAuthRequest = /\/auth\/(login|register|forgot-password|reset-password|refresh-token)(?:\?|$)/.test(
      originalRequest?.url || ""
    );

    if (!isUnauthorized || !originalRequest || isAuthRequest) {
      if (
        (!isUnauthorized || isAuthRequest) &&
        !error.config?.suppressErrorToast &&
        !axios.isCancel(error)
      ) {
        dispatchToast("error", getApiErrorMessage(error));
      }
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      notifyUnauthorized();
      return Promise.reject(error);
    }

    const { refreshToken } = getStoredTokens();
    if (!refreshToken) {
      notifyUnauthorized();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      if (!refreshRequest) {
        refreshRequest = refreshClient
          .post("/auth/refresh-token", { refreshToken })
          .then(({ data }) => {
            const tokens = data?.data;
            if (!tokens?.accessToken || !tokens?.refreshToken) {
              throw new Error("The server returned an invalid token refresh response.");
            }
            updateAuthTokens(tokens);
            return tokens;
          })
          .finally(() => {
            refreshRequest = undefined;
          });
      }

      const tokens = await refreshRequest;
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      notifyUnauthorized();
      return Promise.reject(refreshError);
    }
  }
);
