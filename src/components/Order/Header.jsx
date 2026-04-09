
import React  from "react";

export default function Header({ student }) {
  return (
    <div className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
      
      <h1 className="font-bold text-lg">🍔 Căn Tin Số</h1>

      {student && (
        <div className="flex items-center gap-3">
          <img
            src={student.avatar}
            alt=""
            className="w-10 h-10 rounded-full border-2 border-white"
          />

          <div className="text-sm">
            <p>{student.name}</p>
            <p className="text-yellow-300 font-bold">
              💰 {student.balance.toLocaleString()}đ
            </p>
          </div>
        </div>
      )}
    </div>
  );
}