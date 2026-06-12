import React, { useState } from "react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";
import customerData from "../../datas/customerData";
import AddEmployeeModal from "../Employee/AddEmployeeModal";
const customers = customerData;
 

export default function SelectCustomer() {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [showAddEmployee, setShowAddEmployee] = useState(false);

  const [selected, setSelected] = useState(
    customers[0]
  );

  const handleSelect = (customer) => {
    setSelected(customer);
    setOpen(false);
  };

  return (
    <div className="relative">

      <div className="flex">

        <input
          readOnly
          value={selected?.name || ""}
          className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 outline-none"
        />

        <button
          onClick={() => setOpen(!open)}
          className="w-12 border-y border-r border-gray-300 flex items-center justify-center bg-white"
        >
          {open ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        <button
  onClick={() => setShowAddEmployee(true)}
  className="w-12 border-y border-r border-gray-300 rounded-r-md flex items-center justify-center text-green-600 bg-white hover:bg-green-50"
>
  <Plus size={18} />
</button>

      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden">

          <table className="w-full">

            <thead>
              <tr className="bg-gray-100">

                <th className="text-left px-4 py-2 border-b">
                  Mã
                </th>

                <th className="text-left px-4 py-2 border-b">
                  Tên
                </th>

                <th className="text-left px-4 py-2 border-b">
                  Số điện thoại
                </th>

              </tr>
            </thead>

            <tbody>

              {customers.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="cursor-pointer hover:bg-blue-50"
                >
                  <td className="px-4 py-2 border-b">
                    {item.code}
                  </td>

                  <td className="px-4 py-2 border-b">
                    {item.name}
                  </td>

                  <td className="px-4 py-2 border-b">
                    {item.phone}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        

        </div>
      )}



              <AddEmployeeModal
  open={showAddEmployee}
  onClose={() => setShowAddEmployee(false)}
/>
    </div>
  );
}