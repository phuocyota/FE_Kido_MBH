export const AUTH_STORAGE_KEYS = {
  accessToken: "accessToken",
  isLogin: "isLogin",
  userId: "userId",
  userType: "userType",
  deviceId: "deviceId",
  fullName: "fullName",
  avatar: "avatar",
};

export const getAccessToken = () =>
  localStorage.getItem(AUTH_STORAGE_KEYS.accessToken);

const decodeBase64Url = (value) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const decoded = atob(padded);

  return decodeURIComponent(
    decoded
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
};

export const getTokenPayload = (token = getAccessToken()) => {
  try {
    const payload = token?.split(".")?.[1];
    return payload ? JSON.parse(decodeBase64Url(payload)) : null;
  } catch {
    return null;
  }
};

export const getTokenRole = (token = getAccessToken()) => {
  const payload = getTokenPayload(token);
  const role =
    payload?.role ||
    payload?.userType ||
    payload?.type ||
    payload?.roles?.[0] ||
    payload?.authorities?.[0];

  return String(role || "").toLowerCase();
};

export const isKitchenToken = (token = getAccessToken()) => {
  const role = getTokenRole(token);
  return role === "kitchen" || role === "cashier";
};

export const saveAuthSession = (authData = {}) => {
  if (!authData.accessToken) return;

  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, authData.accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.isLogin, "true");

  if (authData.userId) {
    localStorage.setItem(AUTH_STORAGE_KEYS.userId, authData.userId);
  }

  if (authData.userType) {
    localStorage.setItem(AUTH_STORAGE_KEYS.userType, authData.userType);
  }

  if (authData.deviceId) {
    localStorage.setItem(AUTH_STORAGE_KEYS.deviceId, authData.deviceId);
  }

  if (authData.fullName) {
    localStorage.setItem(AUTH_STORAGE_KEYS.fullName, authData.fullName);
  }

  if (authData.avatar) {
    localStorage.setItem(AUTH_STORAGE_KEYS.avatar, authData.avatar);
  }
};

export const clearAuthSession = () => {
  Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};
