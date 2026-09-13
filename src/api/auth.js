import { apiRequest, kitchenRequest } from "./client";
import { API } from "./endpoint";

const unwrapData = (response) =>
  response?.data?.data ||
  response?.data?.result ||
  response?.data?.user ||
  response?.data ||
  response?.result ||
  response;

const getAccessToken = (response) =>
  response?.accessToken ||
  response?.data?.accessToken ||
  response?.data?.data?.accessToken ||
  response?.data?.result?.accessToken ||
  response?.result?.accessToken;

const unwrapAuthResponse = (response) => {
  if (response?.success === false) {
    throw new Error(response.message || "Dang nhap that bai");
  }

  const data = unwrapData(response);
  const accessToken = getAccessToken(response);

  return {
    ...data,
    accessToken,
  };
};

const formatDebugResponse = (response) => {
  try {
    return JSON.stringify(response);
  } catch {
    return String(response);
  }
};

export const loginByCard = async (cardId) => {
  const response = await apiRequest(API.AUTH.LOGIN_STUDENT, {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({
      cardId: String(cardId || "").trim(),
    }),
  });

  console.log("LOGIN BY CARD RESPONSE:", response);

  const authData = unwrapAuthResponse(response);

  if (!authData?.accessToken) {
    throw new Error(
      `Dang nhap thanh cong nhung thieu accessToken. Response: ${formatDebugResponse(
        response
      )}`
    );
  }

  return authData;
};

export const loginStudent = ({ username, password, deviceId }) =>
  apiRequest(API.AUTH.LOGIN_STUDENT, {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({
      email: username,
      password,
      deviceId,
    }),
  });


  export const loginCashier = async ({
  username,
  password,
  deviceId = "pos-counter-01",
}) => {

  const response = await kitchenRequest(
    API.AUTH.LOGIN_CASHIER,
    {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({
        email: username,
        password,
        deviceId,
      }),
    }
  );

  return unwrapAuthResponse(response);
};
