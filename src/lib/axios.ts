import axios from "axios";
import { useAuthStore } from "../stores/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` } as any;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err?.response?.status === 401) {
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw err;
        const r = await axios.post((import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1") + "/auth/refresh", { refreshToken });
        const { accessToken: newAccess, refreshToken: newRefresh } = r.data?.data || {};
        useAuthStore.getState().setTokens(newAccess, newRefresh);
        err.config.headers = { ...(err.config.headers || {}), Authorization: `Bearer ${newAccess}` };
        return api.request(err.config);
      } catch (_) {
        useAuthStore.getState().logout();
      }
    }
    console.log("API error:", err);
    return Promise.reject(err);
  }
);
