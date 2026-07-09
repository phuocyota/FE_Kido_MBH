import axiosInstance from "./axiosConfig";
import { stockOutReceiptsData } from "../datas/stockOutListData";

const unwrap = (response) => response.data?.data || response.data;

const toList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const toNumber = (value) => Number(value || 0);

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("vi-VN");
};

const getExportHeader = (detail) => detail.exportReceipt || detail.export || null;

const normalizeDetail = (detail, index) => {
  const product = detail.product || {};
  const quantity = toNumber(detail.quantity);
  const unitPrice = toNumber(
    detail.unitPrice ?? detail.price ?? product.price ?? product.costPrice
  );

  return {
    id: detail.id || `${detail.productId || product.id || "item"}-${index}`,
    productCode: product.code || detail.productCode || detail.code || "",
    productName: product.name || detail.productName || detail.name || "",
    warehouse: "Kho mặc định",
    unit: product.unit || detail.unit || "",
    quantity,
    unitPrice,
    amount: toNumber(detail.amount) || quantity * unitPrice,
    discountRate: 0,
    discountAmount: 0,
  };
};

const normalizeExportReceipt = (header, details, index = 0) => {
  const normalizedDetails = details.map(normalizeDetail);
  const totalAmount =
    toNumber(header.totalAmount) ||
    normalizedDetails.reduce((sum, detail) => sum + toNumber(detail.amount), 0);

  return {
    id: header.id || header.code || index,
    postedDate: formatDate(header.createdAt || header.updatedAt),
    voucherNo: header.code || "",
    description: header.note || "",
    totalAmount,
    receiver: header.order?.customer?.fullName || "Khách lẻ",
    voucherType: "Xuất kho bán hàng",
    branch: header.branch?.name || header.branchName || header.branchId || "Chi nhánh mặc định",
    details: normalizedDetails,
  };
};

const groupExportReceipts = (details) => {
  const groups = new Map();

  details.forEach((detail, index) => {
    const header = getExportHeader(detail);
    if (!header || detail.receiptType !== "EXPORT") return;

    const key = header.id || detail.exportId || `export-${index}`;
    const group = groups.get(key) || { header, details: [] };
    group.details.push(detail);
    groups.set(key, group);
  });

  return Array.from(groups.values()).map((group, index) =>
    normalizeExportReceipt(group.header, group.details, index)
  );
};

const findFallbackReceipt = (id) =>
  stockOutReceiptsData.find((receipt) => String(receipt.id) === String(id));

export const stockOutApi = {
  getAll: async (filters = {}) => {
    try {
      const response = await axiosInstance.get("/stock-vouchers", {
        params: filters,
      });
      return groupExportReceipts(toList(unwrap(response)));
    } catch (error) {
      if (error?.response?.status !== 404) throw error;
      return stockOutReceiptsData;
    }
  },

  getById: async (id) => {
    const receipts = await stockOutApi.getAll();
    const receipt = receipts.find((item) => String(item.id) === String(id));
    if (receipt) return receipt;

    const fallbackReceipt = findFallbackReceipt(id);
    if (fallbackReceipt) return fallbackReceipt;

    throw new Error("Không tìm thấy phiếu xuất kho");
  },

  create: async (data) => {
    const response = await axiosInstance.post("/stock-vouchers", data);
    const receipts = groupExportReceipts(toList(unwrap(response)));
    return receipts[0] || null;
  },
};
