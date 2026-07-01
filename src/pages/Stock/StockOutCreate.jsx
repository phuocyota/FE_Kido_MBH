import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import StockOutHeader from "../../components/StockOut/StockOutHeader";
import StockOutInfo from "../../components/StockOut/StockOutInfo";
import StockOutTable from "../../components/StockOut/StockOutTable";
import StockOutFooter from "../../components/StockOut/StockOutFooter";
import { stockOutApi } from "../../api";

export default function StockOutCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [note, setNote] = useState("");
  const [items, setItems] = useState([]);

  const handleSave = async () => {
    if (!customer) {
      toast.error("Vui lòng chọn khách hàng!");
      return;
    }
    if (items.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        type: "EXPORT",
        supplierId: customer.id, // For EXPORT, backend stores dto.supplierId into details toId
        note: note,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          note: "",
        })),
      };

      await stockOutApi.create(payload);
      toast.success("Tạo phiếu xuất kho thành công!");
      navigate("/stock-out");
    } catch (error) {
      console.error("Lỗi khi tạo phiếu xuất kho:", error);
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <StockOutHeader />

      <div className="flex-1 overflow-y-auto pb-20">
        <StockOutInfo
          customer={customer}
          onChangeCustomer={setCustomer}
          note={note}
          onChangeNote={setNote}
        />

        <StockOutTable items={items} setItems={setItems} />

        <StockOutFooter
          onSave={handleSave}
          onCancel={() => navigate("/stock-out")}
          loading={loading}
        />
      </div>
    </div>
  );
}