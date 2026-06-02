import React, { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AddSupplierModal({
  open,
  onClose,
}) {
  const [showAddress, setShowAddress] = useState(true);
  const [showNote, setShowNote] = useState(true);
  const [showInvoice, setShowInvoice] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="w-full max-w-7xl max-h-[95vh] bg-white rounded-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="text-2xl font-semibold">
            Thêm nhà cung cấp
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">

          {/* Thông tin cơ bản */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 text-sm">
                Tên nhà cung cấp
              </label>

              <input
                placeholder="Bắt buộc"
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Mã nhà cung cấp
              </label>

              <input
                placeholder="Tự động"
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Điện thoại
              </label>

              <input
                placeholder="Bắt buộc"
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                Email
              </label>

              <input
                placeholder="Bắt buộc"
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">
                CCCD
              </label>

              <input
                className="w-full h-11 border border-gray-300 rounded-xl px-4"
              />
            </div>

          </div>

          {/* Địa chỉ */}

          <div className="mt-6 border border-gray-200 rounded-2xl p-4">

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                Địa chỉ
              </h3>

              <button
                onClick={() =>
                  setShowAddress(!showAddress)
                }
              >
                {showAddress ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
            </div>

            {showAddress && (
              <>
                <label className="block mb-2 text-sm">
                  Địa chỉ
                </label>

                <input
                  placeholder="Nhập địa chỉ"
                  className="w-full h-11 border border-gray-300 rounded-xl px-4 mb-4"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                  <div>
                    <label className="block mb-2 text-sm">
                      Tỉnh / Thành phố
                    </label>

                    <input
                      placeholder="Tìm Tỉnh/Thành phố"
                      className="w-full h-11 border border-gray-300 rounded-xl px-4"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">
                      Quận / Huyện
                    </label>

                    <input
                      placeholder="Tìm Quận/Huyện"
                      className="w-full h-11 border border-gray-300 rounded-xl px-4"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">
                      Phường / Xã
                    </label>

                    <input
                      placeholder="Tìm Phường/Xã"
                      className="w-full h-11 border border-gray-300 rounded-xl px-4"
                    />
                  </div>

                </div>
              </>
            )}
          </div>

          {/* Nhóm NCC */}

          <div className="mt-6 border border-gray-200 rounded-2xl p-4">

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                Nhóm nhà cung cấp, ghi chú
              </h3>

              <button
                onClick={() => setShowNote(!showNote)}
              >
                {showNote ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
            </div>

            {showNote && (
              <>
                <label className="block mb-2 text-sm">
                  Nhóm nhà cung cấp
                </label>

                <select className="w-full h-11 border border-gray-300 rounded-xl px-4 mb-4">
                  <option>
                    Chọn nhóm nhà cung cấp
                  </option>
                </select>

                <label className="block mb-2 text-sm">
                  Ghi chú
                </label>

                <textarea
                  rows={4}
                  placeholder="Nhập ghi chú"
                  className="w-full border border-gray-300 rounded-xl p-4"
                />
              </>
            )}
          </div>

          {/* Hóa đơn */}

          <div className="mt-6 border border-gray-200 rounded-2xl p-4">

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                Thông tin xuất hóa đơn
              </h3>

              <button
                onClick={() =>
                  setShowInvoice(!showInvoice)
                }
              >
                {showInvoice ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
            </div>

            {showInvoice && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div>
                  <label className="block mb-2 text-sm">
                    Mã số thuế
                  </label>

                  <input
                    placeholder="Nhập mã số thuế"
                    className="w-full h-11 border border-gray-300 rounded-xl px-4"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">
                    Công ty
                  </label>

                  <input
                    placeholder="Nhập tên công ty"
                    className="w-full h-11 border border-gray-300 rounded-xl px-4"
                  />
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white">

          <button
            onClick={onClose}
            className="px-5 h-11 border border-gray-300 rounded-xl font-medium cursor-pointer"
          >
            Bỏ qua
          </button>

          <button className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium cursor-pointer">
            Lưu
          </button>

        </div>

      </div>
    </div>
  );
}