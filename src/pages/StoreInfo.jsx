import React from "react";
import {
  Store,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";

export default function StoreInfo() {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow p-6">

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">

            <div className="
              w-20 h-20 rounded-2xl
              bg-green-100
              flex items-center justify-center
            ">
              <Store size={40} className="text-green-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Thông tin gian hàng
              </h1>

              <p className="text-gray-500">
                Quản lý thông tin cửa hàng/căn tin
              </p>
            </div>
          </div>

          {/* INFO */}
          <div className="grid md:grid-cols-2 gap-5">

            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Store size={18} />
                Tên cửa hàng
              </div>

              <div className="font-semibold">
                Căn Tin Số KIDO
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Phone size={18} />
                Hotline
              </div>

              <div className="font-semibold">
                1900 1234
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MapPin size={18} />
                Địa chỉ
              </div>

              <div className="font-semibold">
                TP. Hồ Chí Minh
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <Globe size={18} />
                Website
              </div>

              <div className="font-semibold">
                kidocanteen.vn
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}