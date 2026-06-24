import React from "react";

export default function TimeFilterPopup({
  selectedTime,
  setSelectedTime,
  onClose,
}) {
  const groups = [
    {
      title: "Theo ngày",
      items: ["Hôm nay", "Hôm qua"],
    },
    {
      title: "Theo tuần",
      items: ["Tuần này", "Tuần trước", "7 ngày qua"],
    },
    {
      title: "Theo tháng",
      items: [
        "Tháng này",
        "Tháng trước",
        "Tháng này (âm lịch)",
        "Tháng trước (âm lịch)",
        "30 ngày qua",
      ],
    },
    {
      title: "Theo quý",
      items: ["Quý này", "Quý trước"],
    },
    {
      title: "Theo năm",
      items: [
        "Năm nay",
        "Năm trước",
        "Năm nay (âm lịch)",
        "Năm trước (âm lịch)",
        "Toàn thời gian",
      ],
    },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div className="p-4 lg:p-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-base lg:text-lg mb-3 lg:mb-4 whitespace-nowrap">
                {group.title}
              </h4>

              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedTime(item);
                      onClose();
                    }}
                    className={`px-3 lg:px-4 py-2 rounded-full border text-sm transition ${
                      selectedTime === item
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t px-4 lg:px-5 py-3">
        <button
          onClick={() => {
            setSelectedTime("Toàn thời gian");
            onClose();
          }}
          className="text-blue-600 font-medium"
        >
          Đặt về mặc định
        </button>
      </div>
    </div>
  );
}
