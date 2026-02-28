import axios from "axios";

// Base API URL - Uses "/api" prefix so requests go through the Vite dev proxy
// The Vite proxy in vite.config.js forwards /api/* → http://localhost:8080/api/*
const API_BASE_URL = "/api";


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
