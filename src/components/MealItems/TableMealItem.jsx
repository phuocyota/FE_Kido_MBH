import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { mealItemApi } from "../../api";
import MealItemModal from "./MealItemModal";

const periodLabels = {
  BREAKFAST: "Sáng",
  LUNCH: "Trưa",
  AFTERNOON: "Chiều",
  DINNER: "Tối",
};

export default function TableMealItem({ filters, triggerRefresh, onRefresh, openAddModal, setOpenAddModal }) {
  const [mealItems, setMealItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchMealItems();
  }, [filters, triggerRefresh]);

  const fetchMealItems = async () => {
    setLoading(true);
    try {
      const data = await mealItemApi.getAll(filters);
      setMealItems(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách món ăn theo buổi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Bạn có chắc muốn xóa món "${item.product?.name || item.productId}" khỏi buổi ${periodLabels[item.mealPeriod] || item.mealPeriod}?`)) {
      return;
    }

    try {
      await mealItemApi.delete(item.id);
      toast.success("Xóa thành công");
      onRefresh();
    } catch (error) {
      toast.error("Không thể xóa");
    }
  };

  const handleUpdateStatus = async (item) => {
    try {
      const newStatus = item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await mealItemApi.update(item.id, { status: newStatus });
      toast.success("Cập nhật trạng thái thành công");
      onRefresh();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[700px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-center">STT</th>
                <th className="p-3 text-left">Mã hàng</th>
                <th className="p-3 text-left">Tên món</th>
                <th className="p-3 text-center">Buổi</th>
                <th className="p-3 text-center">Thứ tự</th>
                <th className="p-3 text-center">Dự kiến</th>
                <th className="p-3 text-left">Ghi chú</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">Đang tải...</td>
                </tr>
              ) : mealItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                mealItems.map((item, index) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-center">{index + 1}</td>
                    <td className="p-3">{item.product?.code || ""}</td>
                    <td className="p-3 font-medium text-gray-800">{item.product?.name || "N/A"}</td>
                    <td className="p-3 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-semibold">
                        {periodLabels[item.mealPeriod] || item.mealPeriod}
                      </span>
                    </td>
                    <td className="p-3 text-center">{item.sortOrder}</td>
                    <td className="p-3 text-center font-semibold text-gray-700">{item.expectedQuantity || 0}</td>
                    <td className="p-3">{item.note || ""}</td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => handleUpdateStatus(item)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
                          item.status === "ACTIVE" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {item.status === "ACTIVE" ? "Đang bán" : "Ngừng bán"}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setOpenAddModal(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Sửa"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MealItemModal 
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
          setSelectedItem(null);
        }}
        initialData={selectedItem}
        onSuccess={onRefresh}
      />
    </div>
  );
}
