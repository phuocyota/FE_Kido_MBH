import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { reportApi } from "../../../api";

export default function ProductInventoryReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const result = await reportApi.getInventory();
      // Map BE data to FE format
      const mappedData = result.data?.map((item, index) => ({
        stt: index + 1,
        group: "Hàng hóa", // Default group since not provided by API
        code: "",
        name: item.name,
        unit: item.unit,
        value: "0",
        stockStart: "0",
        week1: "0",
        week2: "0",
        week3: "0",
        week4: "0",
        week5: "0",
        week6: "0",
        outside: "0",
        totalImport: "0",
        destroy1: "",
        destroy2: "",
        destroy3: "",
        destroy4: "",
        destroy5: "",
        stockEnd: String(item.quantity || 0),
        sale: "0",
        totalCost: "0",
        usagePer: "0",
        min: "-",
        max: "-",
        warning: item.quantity < 10 ? "Sắp hết hàng" : "",
        order: "",
      })) || [];
      setRows(mappedData);
    } catch (error) {
      toast.error("Không thể tải báo cáo tồn kho");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div
  className="bg-white inline-block"
  style={{
    width: "3200px",
  }}
>

      {/* TOP */}
      <div className="grid grid-cols-12 border border-gray-400">

        {/* LEFT */}
        <div className="col-span-4 border-r border-gray-400">

          <div className="grid grid-cols-2">

            <div className="border-b border-r border-gray-400 p-2 font-semibold">
              Số ngày doanh thu tính đến hiện tại :
            </div>

            <div className="border-b border-gray-400 p-2 text-right">
              15
            </div>

            <div className="border-b border-r border-gray-400 p-2 text-red-600 font-bold">
              DOANH THU HIỆN TẠI TRONG THÁNG
            </div>

            <div className="border-b border-gray-400 p-2 text-right text-[22px] font-bold bg-[#DCE6F1]">
              18,000,000
            </div>

            <div className="border-b border-r border-gray-400 p-2 font-bold">
              CHI PHÍ SỬ DỤNG HÀNG SNACK :
            </div>

            <div className="border-b border-gray-400 p-2 text-right font-bold text-[#1F4E79]">
              30,000,000
            </div>

            <div className="border-b border-r border-gray-400 p-2 font-bold">
              CHI PHÍ SỬ DỤNG HÀNG KẸO :
            </div>

            <div className="border-b border-gray-400 p-2 text-right font-bold text-[#1F4E79]">
              5,000,000
            </div>

            <div className="border-b border-r border-gray-400 p-2 font-bold">
              CHI PHÍ SỬ DỤNG HÀNG NƯỚC :
            </div>

            <div className="border-b border-gray-400 p-2 text-right font-bold text-[#1F4E79]">
              22,500,000
            </div>

            <div className="border-r border-gray-400 p-2 font-bold">
              CHI PHÍ SỬ DỤNG HÀNG KHÔ :
            </div>

            <div className="p-2 text-right font-bold text-[#1F4E79]">
              15,000,000
            </div>

          </div>

        </div>

        {/* CENTER */}
        <div className="col-span-1 flex flex-col justify-end pb-2 gap-4">

          <div className="text-red-600 text-center">
            166.7%
          </div>

          <div className="text-red-600 text-center">
            27.8%
          </div>

          <div className="text-red-600 text-center">
            125.0%
          </div>

          <div className="text-red-600 text-center">
            83.3%
          </div>

        </div>

        {/* RIGHT */}
        <div className="col-span-7 flex flex-col items-center justify-center">

          <div className="text-[34px] font-bold">
            CHI PHÍ SỬ DỤNG HÀNG HÓA TRONG THÁNG
          </div>

          <div className="flex items-center gap-5 mt-4">

            <div className="text-[24px]">
              THÁNG:
            </div>

            <div className="bg-[#8EAADB] px-8 py-2 text-[26px]">
              May-26
            </div>

          </div>

        </div>

      </div>

      {/* TABLE */}
      <table className="border-collapse  ">

        <thead>

          {/* HEADER ROW 1 */}
          <tr>

            <th rowSpan={2} className=" whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[60px] text-center font-bold">
              STT
            </th>

            <th rowSpan={2} className="  whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[140px] text-center font-bold">
              NHÓM
            </th>

            <th rowSpan={2} className="  whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[100px] text-center font-bold">
              CODE
            </th>

            <th rowSpan={2} className=" whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[260px] text-center font-bold">
              TÊN HÀNG
            </th>

            <th rowSpan={2} className=" whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[90px] text-center font-bold">
              ĐVT
            </th>

            <th rowSpan={2} className="  whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[130px] text-center font-bold">
              Giá trị hàng hóa
            </th>

            <th rowSpan={2} className="  whitespace-nowrap border border-gray-500 bg-[#A9D18E] w-[120px] text-center font-bold">
              Tồn Đầu
            </th>

            <th colSpan={6} className="  whitespace-nowrap border border-gray-500 bg-[#F4D35E] text-center font-bold">
              Số lượng nhập từ NCC
            </th>

            <th rowSpan={2} className="  whitespace-nowrap border border-gray-500 bg-[#D9EAD3] w-[120px] text-center font-bold">
              Số lượng mua phía ngoài
            </th>

            <th rowSpan={2} className="  whitespace-nowrap border border-gray-500 bg-[#F4CCCC] w-[120px] text-center text-red-600 font-bold">
              Tổng nhập
            </th>

            <th colSpan={5} className="  whitespace-nowrap border border-gray-500 bg-[#F4CCCC] text-center font-bold">
              Số lượng hủy hàng
            </th>

            <th rowSpan={2} className="  whitespace-nowrap border border-gray-500 bg-[#D9EAD3] w-[120px] text-center font-bold">
              Tồn Cuối (Kiểm Kê)
            </th>

            <th rowSpan={2} className="border border-gray-500 bg-[#FFF200] w-[120px] text-center text-red-600 font-bold">
              Xuất bán trong tháng
            </th>

            <th rowSpan={2} className="border border-gray-500 bg-[#FCE5CD] w-[150px] text-center font-bold">
              Tổng chi phí sử dụng trong tháng
            </th>

            <th colSpan={4} className="border border-gray-500 bg-[#F4D35E] text-center font-bold">
              Plan Sales cho thời gian nhập hàng tới:
            </th>

            <th rowSpan={2} className="border border-gray-500 bg-[#F4D35E] w-[140px] text-center font-bold">
              Số cần đặt thêm
            </th>

          </tr>

          {/* HEADER ROW 2 */}
          <tr>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 1
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 2
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 3
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 4
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 5
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[105px] text-center font-bold">
              Tuần 6
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 1
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 2
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 3
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 4
            </th>

            <th className="border border-gray-500 bg-[#F4CCCC] w-[105px] text-center font-bold">
              Tuần 5
            </th>

            <th className="border border-gray-500 bg-[#E2EFDA] w-[120px] text-center text-red-600 font-bold">
              Usage per Mil
            </th>

            <th className="border border-gray-500 bg-[#F4D35E] w-[90px] text-center font-bold">
              Min
            </th>

            <th className=" whitespace-nowrap border border-gray-500 bg-[#F4D35E] w-[90px] text-center font-bold">
              Max
            </th>

<th className="border border-gray-500 bg-[#F4D35E] w-[220px] px-4 py-2 text-center text-black font-bold whitespace-nowrap">  Báo động
</th>

          </tr>

        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={30} className="text-center py-10">
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={30} className="text-center py-10">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
          rows.map((item) => (

            <tr key={item.stt} className="h-[38px]">

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.stt}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 px-2">
                {item.group}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.code}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 px-2 font-semibold">
                {item.name}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.unit}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-right px-2 text-red-600">
                {item.value}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 bg-[#A9D18E] text-center">
                {item.stockStart}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.week1}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.week2}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.week3}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.week4}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.week5}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.week6}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 bg-[#A9D18E] text-center">
                {item.outside}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 bg-[#FCE4D6] text-center text-red-600 font-bold">
                {item.totalImport}
              </td>

              <td className=" whitespace-nowrap border border-gray-400"></td>

              <td className=" whitespace-nowrap border border-gray-400"></td>

              <td className=" whitespace-nowrap border border-gray-400"></td>

              <td className=" whitespace-nowrap border border-gray-400"></td>

              <td className=" whitespace-nowrap border border-gray-400"></td>

              <td className=" whitespace-nowrap border border-gray-400 bg-[#D9EAD3] text-center">
                {item.stockEnd}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 bg-[#FFF200] text-center text-red-600">
                {item.sale}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.totalCost}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.usagePer}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.min}
              </td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.max}
              </td>

<td className="border border-gray-400 bg-[#FF0000] w-[220px] px-4 text-white text-center font-bold whitespace-nowrap">  {item.warning}
</td>

              <td className=" whitespace-nowrap border border-gray-400 text-center">
                {item.order}
              </td>

            </tr>

          ))
          )}

        </tbody>

      </table>

    </div>

  );
}