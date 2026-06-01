import axios from "axios";
import { getAccessToken } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      const authorization = `Bearer ${token}`;

      if (config.headers?.set) {
        config.headers.set("authorization", authorization);
      } else {
        config.headers = {
          ...(config.headers || {}),
          authorization,
        };
      }

      if (import.meta.env.DEV) {
        console.log("Authorization header attached:", config.url);
      }
    } else if (import.meta.env.DEV) {
      console.warn("No access token found for request:", config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    if (status === 401 && import.meta.env.DEV) {
      console.warn("Unauthorized request:", requestUrl);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
