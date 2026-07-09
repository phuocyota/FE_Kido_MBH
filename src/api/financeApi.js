import axiosInstance from "./axiosConfig";

const unwrap = (response) => response.data?.data || response.data;

export const financeApi = {
  getMoneyVouchers: async (params) => {
    const response = await axiosInstance.get("/finance/money-vouchers", { params });
    return unwrap(response);
  },

  getFinanceSummary: async (params) => {
    const response = await axiosInstance.get("/finance/summary", { params });
    return unwrap(response);
  },

  getFunds: async () => {
    const response = await axiosInstance.get("/finance/funds");
    return unwrap(response);
  },

  createFund: async (data) => {
    const response = await axiosInstance.post("/finance/funds", data);
    return unwrap(response);
  },

  createReceipt: async (data) => {
    const response = await axiosInstance.post("/finance/receipts", data);
    return unwrap(response);
  },

  createPayment: async (data) => {
    const response = await axiosInstance.post("/finance/payments", data);
    return unwrap(response);
  },

  getReceiptsReceived: async () => {
    const response = await axiosInstance.get("/finance/receipts/received");
    return unwrap(response);
  },

  getReceiptsPaid: async () => {
    const response = await axiosInstance.get("/finance/receipts/paid");
    return unwrap(response);
  },

  getTransfers: async () => {
    const response = await axiosInstance.get("/finance/transfers");
    return unwrap(response);
  },

  getDetails: async () => {
    const response = await axiosInstance.get("/finance/details");
    return unwrap(response);
  },

  createTransfer: async (data) => {
    const response = await axiosInstance.post("/finance/transfers", data);
    return unwrap(response);
  },
};

