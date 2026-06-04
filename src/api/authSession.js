const TOKEN_KEYS = ["accessToken", "token", "authToken"];
const AUTH_KEYS = [...TOKEN_KEYS, "userId", "role", "isLogin"];

export const clearAuthSession = () => {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const getAccessToken = () => {
  for (const key of TOKEN_KEYS) {
    const token = localStorage.getItem(key);
    if (token && token !== "undefined" && token !== "null") return token;
  }

  return null;
};

export const saveAuthSession = ({ accessToken, userId, role }) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("token", accessToken);
  }

  if (userId) localStorage.setItem("userId", userId);
  if (role) localStorage.setItem("role", role);
  localStorage.setItem("isLogin", "true");
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const [, payload] = token.split(".");
    if (!payload) return false;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(normalizedPayload));

    if (!decodedPayload.exp) return false;

    return decodedPayload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
};

export const hasValidAuthSession = () => {
  const token = getAccessToken();

  if (!token) return false;

  if (isTokenExpired(token)) {
    clearAuthSession();
    return false;
  }

  return true;
};

export const getBranchNameFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(normalizedPayload));

    return decodedPayload.branchName || null;
  } catch {
    return null;
  }
};
