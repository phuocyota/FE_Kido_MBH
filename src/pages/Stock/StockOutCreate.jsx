import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import StockOutHeader from "../../components/StockOut/StockOutHeader";
import StockOutInfo from "../../components/StockOut/StockOutInfo";
import StockOutTable from "../../components/StockOut/StockOutTable";
import StockOutFooter from "../../components/StockOut/StockOutFooter";
import { stockOutApi } from "../../api";
import { getBranchIdFromToken } from "../../api/authSession";

export default function StockOutCreate({ saleMode = false }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [note, setNote] = useState("");
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [requestId] = useState(() => crypto.randomUUID());
  const backPath = saleMode ? "/stock-sale" : "/stock-out";

  const handleSave = async () => {
    if (loading) return;
    if (!customer) {
      toast.error("Vui lòng chọn khách hàng!");
      return;
    }
    if (items.length === 0 || items.some(item => !item.productId || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0 || !Number.isFinite(Number(item.price)) || Number(item.price) < 0)) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm!");
      return;
    }
    if (items.some((item) => item.lotTrackingEnabled && (!item.allocations?.length || Math.abs(item.allocations.reduce((sum, allocation) => sum + Number(allocation.quantity), 0) - Number(item.quantity)) > 0.00005))) {
      toast.error('Vui lòng chọn đủ số lượng lô cho hàng có theo dõi lô.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        type: "EXPORT",
        branchId: getBranchIdFromToken() || undefined,
        sourceId: customer.id,
        sourceType: "CUSTOMER",
        note: note,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          unitId: item.unitId || item.baseUnitId || undefined,
          allocations: item.allocations,
          note: "",
        })),
      };

      if (saleMode) {
        await stockOutApi.createSale({ ...payload, requestId, paymentMethod });
      } else {
        await stockOutApi.create(payload);
      }
      toast.success(saleMode ? "Đã tạo phiếu xuất bán và phiếu thu!" : "Tạo phiếu xuất kho thành công!");
      navigate(backPath);
    } catch (error) {
      console.error("Lỗi khi tạo phiếu xuất kho:", error);
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1800px] bg-gray-100 p-3 md:p-5">
      <div className="flex flex-col overflow-visible rounded-lg border border-gray-200 bg-white shadow-sm">
        <StockOutHeader saleMode={saleMode} />

        <div className="flex-1">
          <StockOutInfo
            customer={customer}
            onChangeCustomer={setCustomer}
            note={note}
            onChangeNote={setNote}
          />

          {saleMode && (
            <div className="flex flex-wrap items-center gap-4 border-b border-gray-200 px-4 py-3 text-sm">
              <label htmlFor="sale-payment-method" className="font-medium">Phương thức thu tiền</label>
              <select id="sale-payment-method" value={paymentMethod} onChange={event => setPaymentMethod(event.target.value)} className="h-10 rounded border border-gray-300 bg-white px-3">
                <option value="CASH">Tiền mặt</option>
                <option value="BANK_TRANSFER">Chuyển khoản</option>
              </select>
              <span className="text-gray-500">Lưu phiếu sẽ đồng thời xuất kho và tạo phiếu thu theo tổng tiền hàng.</span>
            </div>
          )}
          <StockOutTable items={items} setItems={setItems} />

          <StockOutFooter
            onSave={handleSave}
            onCancel={() => navigate(backPath)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
