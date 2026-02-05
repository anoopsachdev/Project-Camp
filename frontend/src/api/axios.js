import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
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
