import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getStockInPurpose } from "../../components/StockIn/stockInPurposes";
import StockInHeader from "../../components/StockIn/StockInHeader";
import StockInInfo from "../../components/StockIn/StockInInfo";
import StockInTable from "../../components/StockIn/StockInTable";
import StockInFooter from "../../components/StockIn/StockInFooter";
import { stockInApi } from "../../api";
import { validateStockInItems, stockInItemPayload } from "../../components/StockIn/stockInItems";
import { freshFoodExpiry, currentPurchaseDateTime } from "../../components/Stock/stockDates";
import { getBranchIdFromToken } from "../../api/authSession";

export default function StockInCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const saveRequest = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const reasonCode = getStockInPurpose(searchParams.get("reasonCode")).code;
  const setReasonCode = (code) => setSearchParams((current) => {
    const next = new URLSearchParams(current);
    next.set("reasonCode", getStockInPurpose(code).code);
    return next;
  }, { replace: true });
  const [paymentStatus, setPaymentStatus] = useState("DEBT");
  const [supplier, setSupplier] = useState(null);
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [items, setItems] = useState([]);
  const [purchasedAt, setPurchasedAt] = useState(currentPurchaseDateTime);
  const handlePurchaseDateChange = (value) => {
    setPurchasedAt(value);
    setItems((rows) => rows.map((item) => item.isFreshFood && !item.expiryManuallyEdited
      ? { ...item, expiresAt: value ? freshFoodExpiry(value.slice(0, 10)) : "" }
      : item));
  };

  const handleSave = async () => {
    if (!supplier) {
      toast.error("Vui lòng chọn nhà cung cấp!");
      return;
    }
    if (items.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm!");
      return;
    }

    if (!purchasedAt) {
      toast.error("Vui lòng chọn ngày mua / nhập kho!");
      return;
    }
    const validationError = validateStockInItems(items, reasonCode);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setLoading(true);
      const defaultNote = reasonCode === "NHNNL" ? "Nhập nguyên, nhiên liệu" : paymentStatus === "PAID" ? "Nhap hang tu nha cung cap" : "Nhap hang cong no";
      const finalNote = note ? (reference ? `[Tham chiếu: ${reference}] ${note}` : note) : defaultNote;

      const payload = {
        type: "IMPORT",
        purchasedAt: purchasedAt.slice(0, 10),
        reasonCode,
        branchId: getBranchIdFromToken() || undefined,
        sourceId: supplier.id,
        sourceType: "SUPPLIER",
        paymentStatus: paymentStatus,
        note: finalNote,
        items: items.map((item) => {
          const itemPayload = stockInItemPayload(item);
          if (paymentStatus === "PAID") {
            itemPayload.note = item.note || "Ghi chu dong hang";
          }
          return itemPayload;
        }),
      };

      const fingerprint = JSON.stringify(payload);
      if (saveRequest.current?.fingerprint !== fingerprint) {
        saveRequest.current = { fingerprint, requestId: crypto.randomUUID() };
      }
      await stockInApi.create({ ...payload, requestId: saveRequest.current.requestId });
      toast.success("Tạo phiếu nhập kho thành công!");
      navigate("/stock-in");
    } catch (error) {
      console.error("Lỗi khi tạo phiếu nhập kho:", error);
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra!";
      toast.error(Array.isArray(errorMessage) ? errorMessage.join("\n") : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-3">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-visible">
        {/* Header */}
        <StockInHeader
          reasonCode={reasonCode}
          onChangeReasonCode={setReasonCode}
          paymentStatus={paymentStatus}
          onChangePaymentStatus={setPaymentStatus}
          reference={reference}
          onChangeReference={setReference}
        />

        {/* Thông tin phiếu */}
        <StockInInfo
          purchasedAt={purchasedAt}
          onChangePurchasedAt={handlePurchaseDateChange}
          supplier={supplier}
          onChangeSupplier={setSupplier}
          note={note}
          onChangeNote={setNote}
          reference={reference}
        />

        {/* Bảng chi tiết */}
        <div className="flex-1 overflow-hidden">
          <StockInTable
            key={reasonCode === "NHNNL" ? "materials" : "all-products"}
            productTypeFilter={reasonCode === "NHNNL" ? "INGREDIENT,FUEL" : ""}
            items={items} setItems={setItems} purchasedAt={purchasedAt.slice(0, 10)}
          />
        </div>

        {/* Footer */}
        <StockInFooter 
          onSave={handleSave}
          onCancel={() => navigate("/stock-in")}
          loading={loading}
        />
      </div>
    </div>
  );
}