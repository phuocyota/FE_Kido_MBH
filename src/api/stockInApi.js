import { getStockInPurpose } from "../components/StockIn/stockInPurposes";
import axiosInstance from "./axiosConfig";
import { stockInReceiptsData } from "../datas/stockInListData";

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

const getImportHeader = (detail) => detail.importReceipt || detail.import || null;

const normalizeDetail = (detail, index, header) => {
  const product = detail.product || {};
  const quantity = toNumber(detail.quantity);
  const unitPrice = toNumber(
    detail.unitPrice ?? detail.price ?? product.costPrice ?? product.price
  );

  return {
    id: detail.id || `${detail.productId || product.id || "item"}-${index}`,
    productCode: product.code || detail.productCode || detail.code || "",
    productName: product.name || detail.productName || detail.name || "",
    warehouse: detail.toStock?.name || detail.stock?.name || "Kho mặc định",
    unit: product.unit || detail.unit || "",
    lotCode: detail.inputDetails?.lotCode || detail.lot?.lotCode || "",
    purchasedAt: detail.inputDetails?.purchasedAt || null,
    receivedAt: header.createdAt || detail.createdAt || null,
    manufacturedAt: formatDate(detail.inputDetails?.manufacturedAt || detail.lot?.manufacturedAt),
    expiresAt: formatDate(detail.inputDetails?.expiresAt || detail.lot?.expiresAt),
    serialMode: detail.inputDetails?.serialMode || "NONE",
    serials: detail.inputDetails?.serials || [],
    quantity,
    unitPrice,
    amount: toNumber(detail.amount) || quantity * unitPrice,
    discountRate: 0,
    discountAmount: 0,
  };
};

const normalizeImportReceipt = (header, details, index = 0) => {
  const normalizedDetails = details.map((detail, detailIndex) => normalizeDetail(detail, detailIndex, header));
  const totalAmount =
    toNumber(header.totalAmount) ||
    normalizedDetails.reduce((sum, detail) => sum + toNumber(detail.amount), 0);

  return {
    id: header.id || header.code || index,
    postedDate: formatDate(header.createdAt || header.updatedAt),
    voucherNo: header.code || "",
    description: header.note || "",
    totalAmount,
    deliverer: header.supplier?.name || "",
    reasonCode: header.reasonCode || "",
    voucherType: getStockInPurpose(header.reasonCode).title,
    paymentStatus: header.paymentStatus || "",
    branch: header.branch?.name || header.branchName || header.branchId || "",
    details: normalizedDetails,
  };
};

const groupImportReceipts = (details) => {
  const groups = new Map();

  details.forEach((detail, index) => {
    const header = getImportHeader(detail);
    if (!header || detail.receiptType !== "IMPORT") return;

    const key = header.id || detail.importId || `import-${index}`;
    const group = groups.get(key) || { header, details: [] };
    group.details.push(detail);
    groups.set(key, group);
  });

  return Array.from(groups.values()).map((group, index) =>
    normalizeImportReceipt(group.header, group.details, index)
  );
};

const findFallbackReceipt = (id) =>
  stockInReceiptsData.find((receipt) => String(receipt.id) === String(id));

export const stockInApi = {
  getAll: async (filters = {}) => {
    try {
      const response = await axiosInstance.get("/stock-vouchers", {
        params: filters,
      });
      return groupImportReceipts(toList(unwrap(response)));
    } catch (error) {
      if (error?.response?.status !== 404) throw error;
      return stockInReceiptsData;
    }
  },

  getById: async (id) => {
    const receipts = await stockInApi.getAll();
    const receipt = receipts.find((item) => String(item.id) === String(id));
    if (receipt) return receipt;

    const fallbackReceipt = findFallbackReceipt(id);
    if (fallbackReceipt) return fallbackReceipt;

    throw new Error("Không tìm thấy phiếu nhập kho");
  },

  create: async (data) => {
    const response = await axiosInstance.post("/stock-vouchers", data);
    const receipts = groupImportReceipts(toList(unwrap(response)));
    return receipts[0] || null;
  },
};
