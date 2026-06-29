import axios from "axios";
import { getAccessToken } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const isPlainObject = (obj) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};

const cleanEmpty = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => cleanEmpty(item));
  }

  if (isPlainObject(obj)) {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        const trimmedVal = typeof val === "string" ? val.trim() : val;

        if (trimmedVal === "" || trimmedVal === null || trimmedVal === undefined) {
          continue;
        }

        if (typeof trimmedVal === "object") {
          newObj[key] = cleanEmpty(trimmedVal);
        } else {
          newObj[key] = trimmedVal;
        }
      }
    }
    return newObj;
  }

  return obj;
};

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


    if (config.data) {
      config.data = cleanEmpty(config.data);
    }

    if (config.params) {
      config.params = cleanEmpty(config.params);
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
