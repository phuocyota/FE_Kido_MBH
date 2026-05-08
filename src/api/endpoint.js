import { API_BASE_URL } from "./client";

export const API = {
  AUTH: {
    LOGIN_STUDENT: `${API_BASE_URL}/auth/login/student`,
  }, 

 
  STUDENT: {
    UPLOAD_AVATAR: `${API_BASE_URL}/upload/single`,
    DETAIL: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE_AVATAR: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE_PROFILE: (id) => `${API_BASE_URL}/users/${id}`,
  },
 
};
