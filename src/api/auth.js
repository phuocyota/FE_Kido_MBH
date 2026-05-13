import { apiRequest } from "./client";
import { API } from "./endpoint";

const unwrapAuthResponse = (response) => {
  if (response?.success === false) {
    throw new Error(response.message || "Dang nhap that bai");
  }

  return response?.data || response;
};

export const loginByCard = async (cardId) => {
  const response = await apiRequest(API.AUTH.LOGIN_STUDENT, {
    method: "POST",
    body: JSON.stringify({
      cardId: String(cardId || "").trim(),
    }),
  });

  return unwrapAuthResponse(response);
};

export const loginStudent = ({ username, password, deviceId }) =>
  apiRequest(API.AUTH.LOGIN_STUDENT, {
    method: "POST",
    body: JSON.stringify({
      email: username,
      password,
      deviceId,
    }),
  });
