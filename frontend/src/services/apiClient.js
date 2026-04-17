import axios from "axios";
import { getStoredToken, clearStoredToken } from "../utils/storage.js";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 60000, // 10 seconds frontend timeout
});

// ================= REQUEST INTERCEPTOR =================
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ================= RESPONSE INTERCEPTOR =================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // If token is invalid / expired
    if (status === 401) {
      // Remove invalid token permanently
      clearStoredToken();

      // Prevent redirect loop
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    if (!error.response) {
      console.error("Server not reachable or request timeout");

      return Promise.reject({
        message: "Server is taking too long to respond. Please try again.",
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
