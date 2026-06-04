import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
} from "lucide-react";
import { dashboardApi } from "../../api/dashboardApi";

const filterOptions = [
  { label: "Hôm nay", value: "today" },
  { label: "Hôm qua", value: "yesterday" },
  { label: "7 ngày qua", value: "7days" },
  { label: "Tháng này", value: "thisMonth" },
  { label: "Tháng trước", value: "lastMonth" },
];

const stageFallbacks = {
  afterKitchen: { name: "Hủy sau báo bếp", color: "#ff2d55" },
  afterCheckout: { name: "Hủy sau tạm tính", color: "#ff7a00" },
  afterInspection: { name: "Hủy khi kiểm đồ", color: "#ffc400" },
};

const getStage = (stages, key) => {
  const fallback = stageFallbacks[key];
  return stages.find((stage) => stage.key === key) || {
    key,
    name: fallback.name,
    color: fallback.color,
    itemCount: 0,
    amount: 0,
    percentage: 0,
    items: [],
  };
};

export default function StaffAndCancelReport() {

  const [filter, setFilter] = useState("7 ngày qua");

  const [open, setOpen] = useState(false);

  const [expanded, setExpanded] = useState(true);
  const [expanded2, setExpanded2] = useState(false);

const [expanded3, setExpanded3] = useState(false);

  const [cancellations, setCancellations] = useState(null);

  const [cancelLoading, setCancelLoading] = useState(false);

  const [cancelError, setCancelError] = useState("");

  const filterValue = useMemo(() => {
    return filterOptions.find((item) => item.label === filter)?.value || "7days";
  }, [filter]);

  const cancelSummary = cancellations?.summary || {};

  const cancelStages = cancellations?.stages || [];

  const afterKitchenStage = getStage(cancelStages, "afterKitchen");

  const afterCheckoutStage = getStage(cancelStages, "afterCheckout");

  const afterInspectionStage = getStage(cancelStages, "afterInspection");

  useEffect(() => {
    let active = true;

    const fetchCancellations = async () => {
      try {
        setCancelLoading(true);
        setCancelError("");

        const data = await dashboardApi.getCancellations({ filter: filterValue });

        if (active) {
          setCancellations(data);
        }
      } catch (err) {
        if (active) {
          setCancelError(err?.response?.data?.message || "Không thể tải dữ liệu hủy món");
          setCancellations(null);
        }
      } finally {
        if (active) {
          setCancelLoading(false);
        }
      }
    };

    fetchCancellations();

    return () => {
      active = false;
    };
  }, [filterValue]);

  const topStaffs = [
    {
      name: "Lê Thị Bảo Trân",
      hours: "9 giờ 30 phút",
    },
    {
      name: "Nguyễn Thị Hồng Thảo Vân",
      hours: "7 giờ 45 phút",
    },
    {
      name: "Nguyễn Minh Loan",
      hours: "6 giờ 33 phút",
    },
    {
      name: "Lã Ngọc Anh",
      hours: "6 giờ 15 phút",
    },
    {
      name: "Trần Quốc Khánh",
      hours: "5 giờ 50 phút",
    },
  ];

  return (
    <div className="
      grid
      grid-cols-1
      2xl:grid-cols-2
      gap-4
    ">

      {/* ================= LEFT ================= */}
      <div className="
        bg-white
        rounded-3xl
        border
        border-gray-200
        shadow-sm
        overflow-hidden
      ">

        {/* HEADER */}
        <div className="p-5">

          <div className="
            flex
            items-start
            justify-between
            gap-3
            mb-6
          ">

            <h2 className="text-[22px] font-bold text-gray-900">
              Tình trạng hủy món
            </h2>

            {/* FILTER */}
            <div className="relative">

              <button
                onClick={() => setOpen(!open)}
                className="
                  h-11
                  px-4
                  rounded-2xl
                  bg-gray-100
                  hover:bg-gray-200
                  transition
                  flex
                  items-center
                  gap-2
                  text-[15px]
                  font-medium
                  text-gray-700
                  min-w-[150px]
                  justify-between
                "
              >
                {filter}

                <ChevronDown
                  size={18}
                  className={`
                    transition-transform duration-300
                    ${open ? "rotate-180" : ""}
                  `}
                />
              </button>

              {open && (
                <div className="
                  absolute
                  right-0
                  mt-2
                  w-[180px]
                  bg-white
                  rounded-2xl
                  border
                  border-gray-200
                  shadow-2xl
                  overflow-hidden
                  z-50
                ">

                  {filterOptions.map((item) => (

                    <button
                      key={item.value}
                      onClick={() => {
                        setFilter(item.label);
                        setOpen(false);
                      }}
                      className={`
                        w-full
                        px-4
                        py-3
                        text-left
                        text-sm
                        transition

                        ${filter === item.label
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                        }
                      `}
                    >
                      {item.label}
                    </button>

                  ))}

                </div>
              )}
            </div>
          </div>

          {/* STATS */}
          <div className="
            flex
            flex-wrap
            gap-10
            mb-6
          ">

            <div>
              <div className="text-gray-700 font-medium mb-1">
                Món bị hủy
              </div>

              <div className="text-[36px] font-bold text-black">
                {cancelLoading ? "..." : cancelSummary.cancelledItems || 0}
              </div>
            </div>

            <div>
              <div className="text-gray-700 font-medium mb-1">
                Hóa đơn bị hủy
              </div>

              <div className="text-[36px] font-bold text-black">
                {cancelLoading ? "..." : cancelSummary.cancelledInvoices || 0}
              </div>
            </div>

          </div>

          {/* CARD 1 */}
          <div className="
            border
            border-gray-200
            rounded-3xl
            overflow-hidden
            mb-4
          ">

            {/* TOP */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="
                w-full
                px-4
                py-4
                flex
                items-center
                justify-between
                gap-4
              "
            >

              <div className="
                flex
                items-center
                gap-3
                flex-1
              ">

                <div className="
                  w-3
                  h-3
                  rounded-full
                  bg-red-500
                " />

                <span className="font-medium text-gray-800">
                  {afterKitchenStage.name}
                </span>

                {/* PROGRESS */}
                <div className="
                  flex-1
                  h-2
                  rounded-full
                  bg-gray-100
                  overflow-hidden
                ">
                  <div className="
                    h-full
                    bg-red-500
                  "
                    style={{ width: `${afterKitchenStage.percentage || 0}%` }}
                  />
                </div>
              </div>

              <div className="
                flex
                items-center
                gap-3
              ">

                <span className="font-semibold text-black">
                  {afterKitchenStage.itemCount || 0} Món
                </span>

                {expanded ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </button>

            {/* BODY */}
            {expanded && (
              <div className="
                border-t
                border-gray-100
                h-[220px]
                flex
                flex-col
                items-center
                justify-center
                px-6
              ">

                {/* ICON */}
                <div className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                  mb-5
                ">

                  <AlertCircle
                    size={28}
                    className="text-blue-600"
                  />
                </div>

                <p className="text-gray-600 text-center text-[16px]">
                  {cancelLoading ? "Đang tải dữ liệu..." : cancelError || "Chưa có món nào bị hủy"}
                </p>

              </div>
            )}
          </div>

          {/* CARD 2 */}
          {/* CARD 2 */}
<div className="
  border
  border-gray-200
  rounded-3xl
  overflow-hidden
  mb-4
">

  {/* TOP */}
  <button
    onClick={() => setExpanded2(!expanded2)}
    className="
      w-full
      px-4
      py-4
      flex
      items-center
      justify-between
      gap-4
    "
  >

    <div className="
      flex
      items-center
      gap-3
      flex-1
    ">

      <div className="
        w-3
        h-3
        rounded-full
        bg-orange-500
      " />

      <span className="font-medium text-gray-800">
        {afterCheckoutStage.name}
      </span>

      {/* PROGRESS */}
      <div className="
        flex-1
        h-2
        rounded-full
        bg-gray-100
        overflow-hidden
      ">
        <div className="
          h-full
          bg-orange-500
        "
          style={{ width: `${afterCheckoutStage.percentage || 0}%` }}
        />
      </div>
    </div>

    <div className="
      flex
      items-center
      gap-3
    ">

      <span className="font-semibold text-black">
        {afterCheckoutStage.itemCount || 0} Món
      </span>

      {expanded2 ? (
        <ChevronUp size={18} />
      ) : (
        <ChevronDown size={18} />
      )}
    </div>
  </button>

  {/* BODY */}
  {expanded2 && (
    <div className="
      border-t
      border-gray-100
      h-[220px]
      flex
      flex-col
      items-center
      justify-center
      px-6
    ">

      <div className="
        w-14
        h-14
        rounded-2xl
        bg-orange-50
        flex
        items-center
        justify-center
        mb-5
      ">

        <AlertCircle
          size={28}
          className="text-orange-500"
        />
      </div>

      <p className="text-gray-600 text-center text-[16px]">
        {cancelLoading ? "Đang tải dữ liệu..." : cancelError || "Chưa có món nào bị hủy"}
      </p>

    </div>
  )}
</div>

          {/* CARD 3 */}
          {/* CARD 3 */}
<div className="
  border
  border-gray-200
  rounded-3xl
  overflow-hidden
">

  {/* TOP */}
  <button
    onClick={() => setExpanded3(!expanded3)}
    className="
      w-full
      px-4
      py-4
      flex
      items-center
      justify-between
      gap-4
    "
  >

    <div className="
      flex
      items-center
      gap-3
      flex-1
    ">

      <div className="
        w-3
        h-3
        rounded-full
        bg-yellow-400
      " />

      <span className="font-medium text-gray-800">
        {afterInspectionStage.name}
      </span>

      {/* PROGRESS */}
      <div className="
        flex-1
        h-2
        rounded-full
        bg-gray-100
        overflow-hidden
      ">
        <div className="
          h-full
          bg-yellow-400
        "
          style={{ width: `${afterInspectionStage.percentage || 0}%` }}
        />
      </div>
    </div>

    <div className="
      flex
      items-center
      gap-3
    ">

      <span className="font-semibold text-black">
        {afterInspectionStage.itemCount || 0} Món
      </span>

      {expanded3 ? (
        <ChevronUp size={18} />
      ) : (
        <ChevronDown size={18} />
      )}
    </div>
  </button>

  {/* BODY */}
  {expanded3 && (
    <div className="
      border-t
      border-gray-100
      h-[220px]
      flex
      flex-col
      items-center
      justify-center
      px-6
    ">

      <div className="
        w-14
        h-14
        rounded-2xl
        bg-yellow-50
        flex
        items-center
        justify-center
        mb-5
      ">

        <AlertCircle
          size={28}
          className="text-yellow-500"
        />
      </div>

      <p className="text-gray-600 text-center text-[16px]">
        {cancelLoading ? "Đang tải dữ liệu..." : cancelError || "Chưa có món nào bị hủy"}
      </p>

    </div>
  )}
</div>

        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="
        bg-white
        rounded-3xl
        border
        border-gray-200
        shadow-sm
        overflow-hidden
      ">

        {/* HEADER */}
        <div className="p-5 border-b border-gray-100">

          <div className="
            flex
            items-start
            justify-between
            gap-3
            mb-5
          ">

            <div className="
              flex
              items-center
              gap-3
              flex-wrap
            ">

              <h2 className="text-[22px] font-bold text-gray-900">
                Theo dõi nhân viên
              </h2>

              <span className="
                px-3
                py-1
                rounded-xl
                bg-blue-50
                text-blue-600
                text-sm
                font-medium
              ">
                Dữ liệu mẫu
              </span>
            </div>

            <button className="
              h-11
              px-4
              rounded-2xl
              bg-gray-100
              text-gray-500
              flex
              items-center
              gap-2
            ">
              Hôm nay
              <ChevronDown size={18} />
            </button>
          </div>

          {/* STATS */}
          <div className="
            grid
            grid-cols-2
            lg:grid-cols-3
            border
            border-gray-200
            rounded-3xl
            overflow-hidden
          ">

            {[
              {
                title: "Nhân viên đi làm",
                value: 7,
              },
              {
                title: "Nhân viên nghỉ làm",
                value: 0,
              },
              {
                title: "Yêu cầu chờ duyệt",
                value: 1,
              },
              {
                title: "Nhân viên đi muộn",
                value: 1,
              },
              {
                title: "Nhân viên về sớm",
                value: 1,
              },
              {
                title: "Nhân viên làm thêm",
                value: 2,
              },
            ].map((item, index) => (

              <div
                key={index}
                className="
                  h-[96px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  border-r
                  border-b
                  border-gray-200
                  last:border-r-0
                "
              >

                <div className="
                  text-sm
                  text-gray-600
                  mb-1
                  text-center
                ">
                  {item.title}
                </div>

                <div className="
                  text-[32px]
                  font-bold
                  text-black
                ">
                  {item.value}
                </div>

              </div>

            ))}

          </div>
        </div>

        {/* TABLE */}
        <div className="p-5">

          <div className="
            overflow-x-auto
            rounded-2xl
            border
            border-gray-200
          ">

            <table className="w-full min-w-[600px]">

              <thead className="bg-gray-50">

                <tr>

                  <th className="
                    px-4
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-gray-700
                  ">
                    STT
                  </th>

                  <th className="
                    px-4
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-gray-700
                  ">
                    Top 5 nhân viên làm nhiều giờ nhất
                  </th>

                  <th className="
                    px-4
                    py-4
                    text-right
                    text-sm
                    font-semibold
                    text-gray-700
                  ">
                    Số giờ làm
                  </th>

                </tr>

              </thead>

              <tbody>

                {topStaffs.map((staff, index) => (

                  <tr
                    key={index}
                    className="
                      border-t
                      border-gray-100
                      hover:bg-gray-50
                      transition
                    "
                  >

                    <td className="px-4 py-4">
                      {index + 1}
                    </td>

                    <td className="
                      px-4
                      py-4
                      font-medium
                      text-gray-900
                    ">
                      {staff.name}
                    </td>

                    <td className="
                      px-4
                      py-4
                      text-right
                      font-semibold
                      text-blue-600
                    ">
                      {staff.hours}
                    </td>

                  </tr>

                ))}

              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="
            mt-4
            p-4
            rounded-2xl
            bg-gray-50
            flex
            items-center
            gap-3
            text-gray-700
          ">

            <Info
              size={18}
              className="text-gray-500"
            />

            <span>
              Quản lý chấm công - tính lương của cửa hàng
            </span>

            <button className="
              text-blue-600
              hover:underline
              font-medium
            ">
              tại đây
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}