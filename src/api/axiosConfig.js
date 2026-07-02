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

const parsePaginatedData = (resData) => {
  if (
    resData &&
    typeof resData === "object" &&
    "data" in resData &&
    Array.isArray(resData.data) &&
    "page" in resData &&
    "size" in resData
  ) {
    const arr = [...resData.data];
    const page = Number(resData.page) || 1;
    const size = Number(resData.size) || 10;
    const total = Number(resData.total) || 0;
    Object.defineProperties(arr, {
      data: { value: arr, writable: true, enumerable: false },
      page: { value: page, writable: true, enumerable: false },
      size: { value: size, writable: true, enumerable: false },
      total: { value: total, writable: true, enumerable: false },
      items: { value: arr, writable: true, enumerable: false },
      totalPages: {
        value: Math.ceil(total / (size || 10)),
        writable: true,
        enumerable: false,
      },
    });
    return arr;
  }
  return resData;
};

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      if (response.data.data && typeof response.data.data === "object") {
        response.data.data = parsePaginatedData(response.data.data);
      } else if (typeof response.data === "object") {
        response.data = parsePaginatedData(response.data);
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
