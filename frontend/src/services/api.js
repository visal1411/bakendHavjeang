import axios from "axios";

// Base API URL - In production, uses VITE_API_URL + "/api"
// In development, uses "/api" (which is handled by the Vite proxy in vite.config.js)
const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL = VITE_API_URL 
  ? `${VITE_API_URL.replace(/\/$/, "")}/api` 
  : "/api";


// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("hav_jeang_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      localStorage.removeItem("hav_jeang_token");
      localStorage.removeItem("hav_jeang_auth");
      localStorage.removeItem("hav_jeang_user");
      // Optionally redirect to login
      console.error("Authentication failed. Please login again.");
    }
    return Promise.reject(error);
  },
);

export default apiClient;
