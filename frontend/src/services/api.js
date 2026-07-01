import axios from "axios";

/**
 * Axios instance configured for the VegPro API.
 * - Base URL from env or defaults to /api (proxied in dev)
 * - Automatically attaches JWT token from localStorage
 * - Handles 401 responses by clearing auth and redirecting to login
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vegpro_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("vegpro_token");
      localStorage.removeItem("vegpro_user");
      // Only redirect if not already on login page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
