import axios from "axios";
import { getAccessToken } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

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
    return Promise.reject(error);
  }
);

export default axiosInstance;
