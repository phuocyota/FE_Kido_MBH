import React, { useState, useEffect } from "react";
import ReceiptVoucherHeader from "../../components/ReceiptVoucher/ReceiptVoucherHeader";
import ReceiptVoucherInfo from "../../components/ReceiptVoucher/ReceiptVoucherInfo";
import ReceiptVoucherTable from "../../components/ReceiptVoucher/ReceiptVoucherTable";
import ReceiptVoucherFooter from "../../components/ReceiptVoucher/ReceiptVoucherFooter";
import { walletApi, financeApi, productApi } from "../../api";
import { ArrowLeft } from "lucide-react";

export default function ReceiptVoucher({
  onBack,
}) {
  const [receiptType, setReceiptType] = useState("Thu khác");
  const [items, setItems] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  const [voucherNumber, setVoucherNumber] = useState("PT000003");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [funds, setFunds] = useState([]);

  const [voucherDate, setVoucherDate] = useState(() => {
    const now = new Date();
    const pad = (n) => (n < 10 ? "0" + n : n);
    const timezoneOffset = -now.getTimezoneOffset();
    const diff = timezoneOffset >= 0 ? "+" : "-";
    const padOffset = (offset) => {
      const hours = Math.floor(Math.abs(offset) / 60);
      const mins = Math.abs(offset) % 60;
      return pad(hours) + ":" + pad(mins);
    };
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${diff}${padOffset(timezoneOffset)}`;
  });

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const data = await financeApi.getFunds();
        setFunds(data || []);
      } catch (err) {
        console.error("Failed to fetch funds:", err);
      }
    };
    fetchFunds();
  }, []);

  const handleReceiptTypeChange = (type) => {
    setReceiptType(type);
    setSelectedSource(null);
  };

  const handleSelectedSourceChange = (source) => {
    setSelectedSource(source);
    if (items.length > 0) {
      const updatedItems = items.map((item) => {
        if (item.category === "Thu hồi công nợ") {
          return {
            ...item,
            amount: source?.debt || 0,
          };
        }
        return item;
      });
      setItems(updatedItems);
    }
  };

  const handleSave = async () => {
    if (!selectedSource) {
      alert("Vui lòng chọn đối tượng thu!");
      return;
    }
    if (items.length === 0) {
      alert("Vui lòng thêm ít nhất một dòng chi tiết phiếu thu!");
      return;
    }
    const totalAmount = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    if (totalAmount <= 0) {
      alert("Tổng số tiền thu phải lớn hơn 0!");
      return;
    }

    setIsSaving(true);
    try {
      // Find matching fund or default
      const matchedFund = funds.find((f) => {
        const nameLower = (f.name || "").toLowerCase();
        if (paymentMethod === "CASH") {
          return nameLower.includes("tiền mặt") || nameLower.includes("cash");
        } else {
          return nameLower.includes("ngân hàng") || nameLower.includes("bank") || nameLower.includes("gửi");
        }
      }) || funds[0];
      const fundId = matchedFund?.id || "fund-uuid";

      // Upload file if exists
      let attachments = [];
      if (selectedFile) {
        try {
          const res = await productApi.uploadImage(selectedFile);
          attachments = [
            {
              name: selectedFile.name,
              url: res.path || res.imageUrl || "",
              mimeType: selectedFile.type,
              size: selectedFile.size,
            },
          ];
        } catch (uploadErr) {
          console.error("Upload failed:", uploadErr);
          alert("Tải file đính kèm thất bại!");
          setIsSaving(false);
          return;
        }
      }

      const payloadItems = items.map((item) => ({
        amount: Number(item.amount) || 0,
        description: item.description || "",
      }));

      const payload = {
        paymentMethod,
        fundId,
        voucherNumber,
        voucherDate,
        reference,
        note,
        items: payloadItems,
        attachments,
      };

      if (receiptType === "Thu khách hàng") {
        payload.customerId = selectedSource.id;
        await walletApi.clearCustomerDebt(payload);
      } else {
        payload.sourceId = selectedSource.id;
        payload.sourceType = selectedSource.type; // e.g. "Nhân viên", etc.
        await financeApi.createReceipt(payload);
      }

      alert("Lưu phiếu thu thành công!");
      if (onBack) onBack();
    } catch (err) {
      console.error("Failed to save receipt:", err);
      alert(err.response?.data?.message || err.message || "Đã xảy ra lỗi khi lưu phiếu thu!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 mb-4 mt-2"
      >
        <ArrowLeft size={18} />
        Quay lại
      </button>
      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
        <ReceiptVoucherHeader receiptType={receiptType} onChangeReceiptType={handleReceiptTypeChange} />

        <div className="p-4 space-y-4">
          <ReceiptVoucherInfo
            receiptType={receiptType}
            selectedSource={selectedSource}
            onChangeSelectedSource={handleSelectedSourceChange}
            paymentMethod={paymentMethod}
            onChangePaymentMethod={setPaymentMethod}
            note={note}
            onChangeNote={setNote}
            reference={reference}
            onChangeReference={setReference}
            voucherNumber={voucherNumber}
            voucherDate={voucherDate}
          />

          <ReceiptVoucherTable
            items={items}
            setItems={setItems}
            selectedSource={selectedSource}
          />
        </div>

        <ReceiptVoucherFooter
          onCancel={onBack}
          onSave={handleSave}
          onChangeFile={(e) => setSelectedFile(e.target.files?.[0] || null)}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}