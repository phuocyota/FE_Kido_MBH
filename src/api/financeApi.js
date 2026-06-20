import axiosInstance from "./axiosConfig";

const unwrap = (response) => response.data?.data || response.data;

export const financeApi = {
  getMoneyVouchers: async () => {
    const response = await axiosInstance.get("/finance/money-vouchers");
    return unwrap(response);
  },
};
