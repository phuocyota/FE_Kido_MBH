import { clearAuthSession, getAccessToken } from "./session";

const RAW_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "";
 

const RAW_API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api";

const normalizeBaseUrl = (url) => url.replace(/\/$/, "");

export const BASE_URL = normalizeBaseUrl(RAW_BASE_URL);

const API_PREFIX = normalizeBaseUrl(RAW_API_PREFIX);

export const API_BASE_URL = API_PREFIX
  ? `${BASE_URL}${API_PREFIX}`
  : BASE_URL;

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
};

export const buildAssetUrl = (path) => {
  if (!path) return "";

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!BASE_URL && API_PREFIX) {
    return `${API_PREFIX}${normalizedPath}`;
  }

  return `${BASE_URL}${normalizedPath}`;
};

 

export const fetch = async (
  url,
  options = {},
  token
) => {

  return window.fetch(url,{
    cache: options.cache || "no-store",
    ...options,
    headers:{
      ...(token
        ? { Authorization:`Bearer ${token}` }
        : {}),
      ...(options.headers || {})
    }
  });

};

export const kitchenFetch = async (
  url,
  options = {}
) => {

  const token =
    getAccessToken();

  return window.fetch(url,{
    cache: options.cache || "no-store",
    ...options,
    headers:{
      ...(token
        ? {
            Authorization:`Bearer ${token}`
          }
        : {}),
      ...(options.headers || {})
    }
  });

};
 

export const parseResponse = async (response) => {

  const contentType =
    response.headers.get("content-type") || "";

  const isJson =
    contentType.includes("application/json");

  const payload = isJson
    ? await response.json().catch(() => null)
    : await response.text();

  // 🔥 HANDLE 401
  if (response.status === 401) {
    clearAuthSession();

    const message =
      payload?.message ||
      payload?.error ||
      (typeof payload === "string" && payload) ||
      "Phiên đăng nhập không hợp lệ";

    throw new Error(message);
  }

  if (!response.ok) {

  //    console.log("ERROR STATUS:", response.status);
  // console.log("ERROR URL:", response.url);
  // console.log("ERROR PAYLOAD:", payload);

    const errorCode = payload?.errorCode || payload?.code;
    const rawMessage =
      payload?.message ||
      payload?.error ||
      (typeof payload === "string" && payload) ||
      "Request failed";
    const message =
      errorCode === "INSUFFICIENT_BALANCE" ||
      rawMessage === "Insufficient wallet balance"
        ? "Số dư ví không đủ"
        : rawMessage;

    throw new Error(message);
  }

  return payload;
};


const buildUrl = (path) => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (API_BASE_URL && path.startsWith(API_BASE_URL)) {
    return path;
  }

  return buildApiUrl(path);
};

// export const apiRequest = async (path, options = {}) => {
//   const response = await fetch(buildUrl(path), {
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   return parseResponse(response);
// };

export const apiRequest = async (
  path,
  options = {}
) => {

  const token =
    options.skipAuth ? "" : getAccessToken();
  const { skipAuth, ...requestOptions } = options;

  const response =
    await fetch(
      buildUrl(path),
      {
        headers:{
          "Content-Type":"application/json",
          ...(requestOptions.headers || {})
        },
        ...requestOptions
      },
      token
    );

  return parseResponse(response);
};

export const kitchenRequest = async (
  path,
  options = {}
) => {

  const token =
    options.skipAuth
      ? ""
      : getAccessToken();
  const { skipAuth, ...requestOptions } = options;

  const response =
    await fetch(
      buildUrl(path),
      {
        headers:{
          "Content-Type":"application/json",
          ...(requestOptions.headers || {})
        },
        ...requestOptions
      },
      token
    );

  return parseResponse(response);
};
