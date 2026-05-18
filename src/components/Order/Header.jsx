
 
import React from "react";
import header1 from "../../assets/header1.png";
import header2 from "../../assets/header2.png";
import header3 from "../../assets/header3.png";
import header4 from "../../assets/header4.png";

export default function Header({
  student,
  amount,
  originalAmount,
  setCardPrice,
  onLogout,
}) {

  const isCashier = localStorage.getItem("userType") === "CASHIER";
 
React.useEffect(() => {

  // QR
  if(amount != null && !isNaN(amount)){

    setCardPrice?.(
      Number(amount)
    );

  }

  // THẺ HỌC SINH
  else if(student?.balance != null){

    setCardPrice?.(
      Number(student.balance)
    );

  }

},[
  amount,
  student,
  setCardPrice,
]);
  return (
  <div className="bg-blue-700 text-white flex items-center justify-between overflow-hidden">

    {/* LEFT: Banner chạy */}
    <div className="flex-1 overflow-hidden relative h-[70px]">

      <div className="flex animate-marquee whitespace-nowrap">
        <img src={header1} className="h-[70px] object-cover" />
        <img src={header2} className="h-[70px] object-cover" />
        <img src={header1} className="h-[70px] object-cover" />
        <img src={header2} className="h-[70px] object-cover" />
        <img src={header3} className="h-[70px] object-cover" />
        <img src={header4} className="h-[70px] object-cover" />
        <img src={header3} className="h-[70px] object-cover" />
        <img src={header4} className="h-[70px] object-cover" />
      </div>

    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-3 px-4 bg-blue-700 z-10">

      {/* QR */}
      {amount != null && !isNaN(amount) && (
        <div className="text-yellow-300 font-bold text-lg">
          💰 Bạn có: {Number(amount).toLocaleString()}đ
        </div>
      )}

      {/* 👨‍🍳 CASHIER */}
      {isCashier ? (

        <div className="flex items-center gap-3">

          <img
            src={
              localStorage.getItem("avatar") ||
              "https://i.pravatar.cc/150"
            }
            alt=""
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />

          <div className="text-sm">

            <p className="font-semibold">
              {localStorage.getItem("fullName") || "Nhân viên"}
            </p>

            <p className="text-yellow-300 font-bold">
              Nhân viên căn tin
            </p>

          </div>

          <button
            onClick={onLogout}
            className="ml-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Đăng xuất
          </button>

        </div>

      ) : (

        <>
          {/* THẺ */}
          {student && student.balance != null && (
            <>
              <img
                src={student.avatar}
                alt=""
                className="w-10 h-10 rounded-full border-2 border-white"
              />

              <div className="grid grid-cols-2 gap-x-4 text-sm">

                <p className="font-semibold">
                  {student.name}
                </p>

                <p className="text-gray-200 font-bold">
                  {student.school}
                </p>

                <p className="text-yellow-300 font-bold">
                  💰 {Number(student.balance).toLocaleString()}đ
                </p>

                <p className="text-gray-200 font-bold">
                  Lớp: {student.class}
                </p>

              </div>
            </>
          )}
        </>

      )}

    </div>
  </div>
);
}