import { apiRequest } from "./client";
import { API } from "./endpoint";

export const getParentHome = async () => {
  const res = await apiRequest(API.PARENT.HOME);

  return res?.data ?? res;
};
