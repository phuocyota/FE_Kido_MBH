import PageHeader from "../components/Management/PageHeader";
import React from "react";
import {
  Store,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";

export default function StoreInfo() {
  return (
    <div className="erp-page bg-gray-100">
      <div className="erp-content">

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow p-6">

          {/* HEADER */}
          <PageHeader title="Thông tin gian hàng" eyebrow="Thiết lập" description="Quản lý thông tin cửa hàng và căn tin." />

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