import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 60000,
});

// ================= RESPONSE INTERCEPTOR =================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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
