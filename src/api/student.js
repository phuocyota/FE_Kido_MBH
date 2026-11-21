import { fetch, parseResponse } from "./client";
import { API } from "./endpoint";

 

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(API.STUDENT.UPLOAD_AVATAR, {
    method: "POST",
    body: formData,
  });

  return parseResponse(res);
};

export const updateUserAvatar = async (userId, userData) => {
  const res = await fetch(API.STUDENT.UPDATE_AVATAR(userId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return parseResponse(res);
};

export const updateStudentProfile = async (userId, data) => {
  const res = await fetch(API.STUDENT.UPDATE_PROFILE(userId), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse(res);
};

export const getUserById = async (userId) => {
  const res = await fetch(API.STUDENT.DETAIL(userId));
  return parseResponse(res);
};

// đăng nhập bằng thẻ và qr
export const loginStudent = async (cardId) => {

  const res = await fetch(
    API.STUDENT.LOGIN,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        cardId,
      }),
    }
  );

  const data = await parseResponse(res);

console.log("LOGIN RESPONSE:", data);

return data;
};
