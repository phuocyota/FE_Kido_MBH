import { apiRequest, kitchenRequest } from "./client";
import { API } from "./endpoint";

const unwrapAuthResponse = (response) => {
  if (response?.success === false) {
    throw new Error(response.message || "Dang nhap that bai");
  }

  const data = response?.data || response;
  const accessToken =
    data?.accessToken ||
    data?.token ||
    data?.jwt ||
    data?.access_token;

  return {
    ...data,
    accessToken,
  };
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


  export const loginCashier = async ({
  username,
  password,
}) => {

  const response = await kitchenRequest(
    API.AUTH.LOGIN_CASHIER,
    {
      method: "POST",
      body: JSON.stringify({
        email: username,
        password,
      }),
    }
  );

  return unwrapAuthResponse(response);
};
