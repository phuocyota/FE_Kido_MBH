import React from "react";

export default function Summary() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4 md:p-5">

      {/* TITLE */}
      <h2 className="text-[20px] sm:text-[24px] font-bold text-gray-900 mb-4 sm:mb-5">
        Bức tranh kinh doanh
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">

        {/* CARD 1 */}
<div className="
  bg-gradient-to-b 
  from-blue-100 
  to-white
  rounded-2xl 
  border 
  border-blue-100 
  overflow-hidden 
  min-h-[220px]
">          <div className="flex h-full">

            {/* LEFT BAR */}
            <div className="w-1.5 bg-blue-500 shrink-0" />

            {/* CONTENT */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col">

              <div className="text-[15px] sm:text-[16px] font-semibold text-gray-900 mb-2">
                Doanh thu thuần hôm nay
              </div>

              <div className="text-[32px] sm:text-[38px] font-bold text-black leading-none mb-2">
                0
              </div>

              <div className="text-gray-500 text-[13px] sm:text-[14px] mb-5">
                Không phát sinh doanh thu
              </div>

              <div className="space-y-2 text-[13px] sm:text-[14px] mt-auto">

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-700">
                    Giảm giá hóa đơn
                  </span>

                  <span className="font-semibold text-gray-900">
                    0
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-700">
                    Trả hàng (0)
                  </span>

                  <span className="font-semibold text-gray-900">
                    0
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* CARD 2 */}
<div className="
  bg-gradient-to-b 
  from-green-100 
  to-white
  rounded-2xl 
  border 
  border-green-100 
  overflow-hidden 
  min-h-[220px]
">          <div className="flex h-full">

            {/* LEFT BAR */}
            <div className="w-1.5 bg-green-500 shrink-0" />

            {/* CONTENT */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col">

              <div className="text-[15px] sm:text-[16px] font-semibold text-gray-900 mb-2">
                Số lượng đơn hôm nay
              </div>

              <div className="text-[32px] sm:text-[38px] font-bold text-black leading-none mb-2">
                0
              </div>

              <div className="text-gray-500 text-[13px] sm:text-[14px] mb-5">
                Không phát sinh đơn
              </div>

              <div className="space-y-2 text-[13px] sm:text-[14px] mt-auto">

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-700">
                    Trung bình đơn
                  </span>

                  <span className="font-semibold text-gray-900">
                    0
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-700">
                    Số khách/đơn
                  </span>

                  <span className="font-semibold text-gray-900">
                    0
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* CARD 3 */}
<div className="
  bg-gradient-to-b 
  from-orange-100 
  to-white
  rounded-2xl 
  border 
  border-orange-100 
  overflow-hidden 
  min-h-[220px]
">          <div className="flex h-full">

            {/* LEFT BAR */}
            <div className="w-1.5 bg-orange-400 shrink-0" />

            {/* CONTENT */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col">

              <div className="text-[15px] sm:text-[16px] font-semibold text-gray-900 mb-2">
                Tỷ lệ phủ bàn
              </div>

              <div className="text-[32px] sm:text-[38px] font-bold text-black leading-none mb-2">
                0%
              </div>

              <div className="text-gray-500 text-[13px] sm:text-[14px] mb-5">
                0/1 bàn đang sử dụng
              </div>

              <div className="space-y-2 text-[13px] sm:text-[14px] mt-auto">

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-700">
                    Đơn đang phục vụ
                  </span>

                  <span className="font-semibold text-gray-900">
                    0
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-700">
                    Khách đang phục vụ
                  </span>

                  <span className="font-semibold text-gray-900">
                    0
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}