import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop: Don't retry if the failed request was already a refresh attempt
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh-token");
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear storage and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        // Only redirect if we are not already on a public page
        const publicPaths = [
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
        ];
        if (
          !publicPaths.some((path) => window.location.pathname.startsWith(path))
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
