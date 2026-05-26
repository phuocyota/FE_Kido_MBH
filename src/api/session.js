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
